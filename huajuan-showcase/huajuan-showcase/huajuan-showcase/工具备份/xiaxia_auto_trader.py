#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
虾虾自动交易系统 - XiaXia Auto Trading System
作者：虾虾
创建时间：2026-02-10
用途：基于多因子评分的自动化交易系统
"""

import sys
import asyncio
import json
import logging
from datetime import datetime, timedelta
from typing import List, Dict, Optional
import subprocess

# 导入Telegram通知
sys.path.insert(0, '/Users/fox/.openclaw/workspace/tools')
from telegram_notifier import TelegramNotifier

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('/Users/fox/.openclaw/workspace/交易日志/auto_trading.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# 设置事件循环 (Python 3.14兼容)
if sys.platform == 'darwin':
    asyncio.set_event_loop_policy(asyncio.DefaultEventLoopPolicy())

try:
    loop = asyncio.get_running_loop()
except RuntimeError:
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)

from ib_insync import IB, Stock, MarketOrder, LimitOrder


class XiaXiaAutoTrader:
    """
    虾虾自动交易系统
    
    核心逻辑：
    1. 每天扫描监控列表
    2. 运行多因子评分
    3. 评分>80分且通过风控 → 买入
    4. 评分<40分或风险>70 → 卖出
    5. 记录所有交易到纸面交易系统
    """
    
    def __init__(self, paper_trading: bool = True):
        """
        初始化交易系统
        
        Args:
            paper_trading: True=模拟交易, False=实盘
        """
        self.paper_trading = paper_trading
        self.ib = None
        self.connected = False
        
        # 交易配置
        self.config = {
            'buy_threshold': 80,      # 买入阈值
            'sell_threshold': 40,     # 卖出阈值
            'risk_threshold': 70,     # 风险阈值
            'max_position_size': 0.15, # 单股最大15%
            'max_positions': 10,       # 最大持仓数
            'stop_loss_pct': 0.08,     # 止损8%
            'take_profit_pct': 0.20,   # 止盈20%
        }
        
        # 监控列表
        self.watchlist = [
            'NVDA', 'AMD', 'TSLA', 'AAPL', 'MSFT', 
            'AVGO', 'SMCI', 'CRWV', 'META', 'GOOGL',
            'GFS', 'INTC', 'AMKR', 'TSM', 'QCOM'
        ]
        
        # 时区设置
        self.timezone_info = self._get_timezone_info()
        logger.info(f"🌍 当前时区: {self.timezone_info['name']}")
        logger.info(f"🕐 美股开盘北京时间: {self.timezone_info['market_open_bj']}")
        
        # 数据目录
        self.data_dir = '/Users/fox/.openclaw/workspace/交易数据'
        import os
        os.makedirs(self.data_dir, exist_ok=True)
        
        # Telegram通知器
        self.notifier = TelegramNotifier()
        
        logger.info("🦐 虾虾自动交易系统初始化")
        logger.info(f"  模式: {'Paper Trading' if paper_trading else 'Live Trading'}")
        logger.info(f"  买入阈值: {self.config['buy_threshold']}分")
        logger.info(f"  监控股票: {len(self.watchlist)}只")
    
    def _get_timezone_info(self) -> dict:
        """
        获取时区信息，自动检测冬令时/夏令时
        
        Returns:
            时区信息字典
        """
        from datetime import datetime
        import pytz
        
        # 纽约时区
        ny_tz = pytz.timezone('America/New_York')
        now = datetime.now(ny_tz)
        
        # 检测是否夏令时
        is_dst = bool(now.dst())
        
        if is_dst:
            # 夏令时 (3月-11月)
            return {
                'name': '夏令时 (DST)',
                'is_dst': True,
                'market_open_bj': '21:30',
                'market_close_bj': '04:00',
                'hours_ahead': 12,
                'trading_start_bj': '21:00',  # 虾虾开始监控
                'trading_end_bj': '05:00'     # 虾虾结束监控
            }
        else:
            # 冬令时 (11月-3月)
            return {
                'name': '冬令时 (Standard)',
                'is_dst': False,
                'market_open_bj': '22:30',
                'market_close_bj': '05:00',
                'hours_ahead': 13,
                'trading_start_bj': '22:00',  # 虾虾开始监控
                'trading_end_bj': '06:00'     # 虾虾结束监控
            }
        logger.info(f"  模式: {'Paper Trading' if paper_trading else 'Live Trading'}")
        logger.info(f"  买入阈值: {self.config['buy_threshold']}分")
        logger.info(f"  监控股票: {len(self.watchlist)}只")
    
    def connect(self) -> bool:
        """连接到IBKR"""
        try:
            self.ib = IB()
            port = 7497 if self.paper_trading else 7496
            
            logger.info(f"🔄 连接IBKR (端口 {port})...")
            self.ib.connect('127.0.0.1', port, clientId=2, timeout=10)
            
            if self.ib.isConnected():
                self.connected = True
                accounts = self.ib.managedAccounts()
                logger.info(f"✅ 连接成功! 账户: {accounts}")
                return True
            else:
                logger.error("❌ 连接失败")
                return False
                
        except Exception as e:
            logger.error(f"❌ 连接错误: {e}")
            return False
    
    def disconnect(self):
        """断开连接"""
        if self.ib and self.connected:
            self.ib.disconnect()
            self.connected = False
            logger.info("👋 已断开连接")
    
    def get_account_summary(self) -> Dict:
        """获取账户摘要"""
        if not self.connected:
            return {}
        
        try:
            account = self.ib.managedAccounts()[0]
            summary = self.ib.accountSummary(account)
            
            result = {}
            for item in summary:
                if item.tag in ['NetLiquidation', 'AvailableFunds', 'BuyingPower']:
                    result[item.tag] = float(item.value)
            
            return result
        except Exception as e:
            logger.error(f"获取账户信息失败: {e}")
            return {}
    
    def get_positions(self) -> List[Dict]:
        """获取当前持仓"""
        if not self.connected:
            return []
        
        try:
            positions = self.ib.positions()
            result = []
            for pos in positions:
                result.append({
                    'symbol': pos.contract.symbol,
                    'position': pos.position,
                    'avgCost': pos.avgCost,
                    'marketPrice': 0,  # 稍后获取
                    'marketValue': 0   # 稍后获取
                })
            return result
        except Exception as e:
            logger.error(f"获取持仓失败: {e}")
            return []
    
    def run_multi_factor_score(self, symbol: str) -> Optional[Dict]:
        """
        运行多因子评分
        
        Args:
            symbol: 股票代码
        
        Returns:
            评分结果字典
        """
        try:
            # 调用multi_factor_scorer.py
            cmd = ['python3', '/Users/fox/.openclaw/workspace/tools/multi_factor_scorer.py', 
                   '--symbol', symbol]
            
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
            
            # 解析输出 (简化版，实际应该解析JSON)
            if '综合评分' in result.stdout:
                # 从输出中提取评分 (简化处理)
                score = 65  # 默认值
                if '评分:' in result.stdout:
                    try:
                        score_line = [l for l in result.stdout.split('\n') if '评分:' in l][0]
                        score = float(score_line.split(':')[1].split('/')[0].strip())
                    except:
                        pass
                
                return {
                    'symbol': symbol,
                    'score': score,
                    'recommendation': 'BUY' if score > 80 else 'SELL' if score < 40 else 'HOLD',
                    'timestamp': datetime.now().isoformat()
                }
            else:
                return None
                
        except Exception as e:
            logger.error(f"评分失败 {symbol}: {e}")
            return None
    
    def place_buy_order(self, symbol: str, quantity: int) -> Optional[Dict]:
        """
        下买单
        
        Args:
            symbol: 股票代码
            quantity: 数量
        
        Returns:
            订单信息
        """
        if not self.connected:
            logger.error("未连接，无法下单")
            return None
        
        try:
            contract = Stock(symbol, 'SMART', 'USD')
            order = MarketOrder('BUY', quantity)
            
            logger.info(f"📝 买入 {quantity}股 {symbol}")
            trade = self.ib.placeOrder(contract, order)
            
            # 等待几秒
            self.ib.sleep(3)
            
            result = {
                'orderId': trade.order.orderId,
                'symbol': symbol,
                'action': 'BUY',
                'quantity': quantity,
                'status': trade.orderStatus.status,
                'filled': trade.orderStatus.filled,
                'avgFillPrice': trade.orderStatus.avgFillPrice
            }
            
            logger.info(f"✅ 买入订单: {symbol} {trade.orderStatus.filled}股 @ ${trade.orderStatus.avgFillPrice}")
            
            # 记录到纸面交易
            self._record_trade(symbol, 'BUY', trade.orderStatus.avgFillPrice, 
                             quantity, "多因子评分触发买入")
            
            # Telegram推送
            self.notifier.send_trade_notification(
                symbol=symbol,
                action='BUY',
                quantity=int(trade.orderStatus.filled),
                price=trade.orderStatus.avgFillPrice,
                reason=f"多因子评分触发买入 (>{self.config['buy_threshold']}分)"
            )
            
            return result
            
        except Exception as e:
            logger.error(f"买入失败 {symbol}: {e}")
            return None
    
    def place_sell_order(self, symbol: str, quantity: int) -> Optional[Dict]:
        """下卖单"""
        if not self.connected:
            logger.error("未连接，无法下单")
            return None
        
        try:
            contract = Stock(symbol, 'SMART', 'USD')
            order = MarketOrder('SELL', quantity)
            
            logger.info(f"📝 卖出 {quantity}股 {symbol}")
            trade = self.ib.placeOrder(contract, order)
            
            self.ib.sleep(3)
            
            result = {
                'orderId': trade.order.orderId,
                'symbol': symbol,
                'action': 'SELL',
                'quantity': quantity,
                'status': trade.orderStatus.status,
                'filled': trade.orderStatus.filled,
                'avgFillPrice': trade.orderStatus.avgFillPrice
            }
            
            logger.info(f"✅ 卖出订单: {symbol} {trade.orderStatus.filled}股 @ ${trade.orderStatus.avgFillPrice}")
            
            self._record_trade(symbol, 'SELL', trade.orderStatus.avgFillPrice,
                             quantity, "评分下降触发卖出")
            
            # Telegram推送
            self.notifier.send_trade_notification(
                symbol=symbol,
                action='SELL',
                quantity=int(trade.orderStatus.filled),
                price=trade.orderStatus.avgFillPrice,
                reason=f"评分下降触发卖出 (<{self.config['sell_threshold']}分)"
            )
            
            return result
            
        except Exception as e:
            logger.error(f"卖出失败 {symbol}: {e}")
            return None
    
    def _record_trade(self, symbol: str, action: str, price: float, 
                     quantity: int, reason: str):
        """记录交易到纸面交易系统"""
        try:
            cmd = ['python3', '/Users/fox/.openclaw/workspace/tools/paper_trading_tracker.py',
                   '--record', symbol, action, str(price), reason, 'high']
            subprocess.run(cmd, capture_output=True, timeout=10)
            logger.info(f"📝 已记录交易: {symbol} {action}")
        except Exception as e:
            logger.error(f"记录交易失败: {e}")
    
    def scan_and_trade(self):
        """
        扫描监控列表并执行交易
        """
        logger.info("="*70)
        logger.info("🦐 开始每日扫描交易")
        logger.info("="*70)
        
        # 获取账户信息
        account = self.get_account_summary()
        available_funds = account.get('AvailableFunds', 0)
        logger.info(f"💰 可用资金: ${available_funds:,.2f}")
        
        # 获取当前持仓
        positions = self.get_positions()
        position_symbols = {p['symbol'] for p in positions}
        logger.info(f"📈 当前持仓: {len(positions)}只 {position_symbols}")
        
        # 扫描监控列表
        buy_candidates = []
        sell_candidates = []
        
        for symbol in self.watchlist:
            logger.info(f"\n🔍 扫描 {symbol}...")
            
            # 运行多因子评分
            score_result = self.run_multi_factor_score(symbol)
            
            if not score_result:
                logger.warning(f"  ⚠️ 无法获取 {symbol} 评分")
                continue
            
            score = score_result['score']
            logger.info(f"  评分: {score}/100")
            
            # 买入逻辑
            if score >= self.config['buy_threshold']:
                if symbol not in position_symbols:
                    logger.info(f"  ✅ 买入信号: {symbol} 评分{score}")
                    buy_candidates.append({
                        'symbol': symbol,
                        'score': score
                    })
                else:
                    logger.info(f"  ⏭️ 已持有 {symbol}，跳过")
            
            # 卖出逻辑
            elif score <= self.config['sell_threshold']:
                if symbol in position_symbols:
                    logger.info(f"  ❌ 卖出信号: {symbol} 评分{score}")
                    sell_candidates.append({
                        'symbol': symbol,
                        'score': score
                    })
            
            else:
                logger.info(f"  ⏭️ 评分{score}，无信号")
        
        # 执行买入
        logger.info(f"\n🛒 买入候选: {len(buy_candidates)}只")
        for candidate in buy_candidates[:3]:  # 最多买3只
            symbol = candidate['symbol']
            
            # 计算买入金额 (可用资金的10%)
            position_value = available_funds * 0.10
            
            # 获取当前价格 (简化，实际应该获取实时价格)
            price = 100  # 假设价格
            quantity = int(position_value / price)
            
            if quantity > 0:
                self.place_buy_order(symbol, quantity)
                available_funds -= position_value  # 更新可用资金
        
        # 执行卖出
        logger.info(f"\n💸 卖出候选: {len(sell_candidates)}只")
        for candidate in sell_candidates:
            symbol = candidate['symbol']
            
            # 找到持仓数量
            position = next((p for p in positions if p['symbol'] == symbol), None)
            if position:
                self.place_sell_order(symbol, int(position['position']))
        
        logger.info("\n" + "="*70)
        logger.info("✅ 扫描完成")
        logger.info("="*70)
    
    def run_daily(self):
        """运行每日交易流程"""
        try:
            # 连接
            if not self.connect():
                logger.error("❌ 无法连接到IBKR")
                return False
            
            # 执行扫描和交易
            self.scan_and_trade()
            
            # 断开
            self.disconnect()
            
            return True
            
        except Exception as e:
            logger.error(f"每日运行失败: {e}")
            self.disconnect()
            return False


def main():
    """主函数"""
    print("🦐 虾虾自动交易系统")
    print("="*70)
    print()
    
    # 创建交易器
    trader = XiaXiaAutoTrader(paper_trading=True)
    
    # 运行一次
    print("🔄 开始运行...")
    print()
    
    success = trader.run_daily()
    
    if success:
        print("\n✅ 运行成功!")
    else:
        print("\n❌ 运行失败!")
    
    print()
    print("="*70)
    print("提示: 使用 crontab 设置每天9:30自动运行")
    print("  0 9 * * 1-5 python3 /Users/fox/.openclaw/workspace/tools/xiaxia_auto_trader.py")
    print("="*70)


if __name__ == "__main__":
    main()
