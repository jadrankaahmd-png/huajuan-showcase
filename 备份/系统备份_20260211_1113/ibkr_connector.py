#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
IBKR连接器 - Interactive Brokers Connector
作者：虾虾
创建时间：2026-02-10
用途：连接IBKR API，支持模拟交易和实盘交易
"""

import sys
import time
import logging
from datetime import datetime
from typing import Optional, List, Dict

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class IBKRConnector:
    """
    IBKR连接器
    支持Paper Trading和Live Trading
    """
    
    def __init__(self, paper_trading: bool = True, client_id: int = 1):
        """
        初始化连接器
        
        Args:
            paper_trading: True=模拟交易, False=实盘
            client_id: 客户端ID (多个连接时用不同ID)
        """
        self.paper_trading = paper_trading
        self.client_id = client_id
        self.ib = None
        self.connected = False
        
        # IBKR连接配置
        self.host = '127.0.0.1'
        self.port = 7497 if paper_trading else 7496
        
        logger.info(f"🦐 IBKR连接器初始化")
        logger.info(f"  模式: {'Paper Trading' if paper_trading else 'Live Trading'}")
        logger.info(f"  端口: {self.port}")
        logger.info(f"  客户端ID: {client_id}")
    
    def connect(self) -> bool:
        """
        连接到IBKR TWS/IB Gateway
        
        Returns:
            bool: 连接是否成功
        """
        try:
            # 尝试导入ib_insync
            try:
                from ib_insync import IB, Stock, Forex, Future, Option
                from ib_insync import MarketOrder, LimitOrder, StopOrder
                import asyncio
                logger.info("✅ ib_insync库已加载")
            except ImportError:
                logger.error("❌ 请先安装ib_insync: pip install ib_insync")
                return False
            
            # 创建连接
            self.ib = IB()
            logger.info(f"🔄 正在连接 {self.host}:{self.port}...")
            
            # 设置事件循环
            try:
                loop = asyncio.get_event_loop()
            except RuntimeError:
                loop = asyncio.new_event_loop()
                asyncio.set_event_loop(loop)
            
            # 连接 (超时30秒)
            self.ib.connect(self.host, self.port, clientId=self.client_id, timeout=30)
            
            # 检查连接状态
            if self.ib.isConnected():
                self.connected = True
                logger.info("✅ IBKR连接成功!")
                
                # 获取账户信息
                accounts = self.ib.managedAccounts()
                logger.info(f"📊 管理账户: {accounts}")
                
                return True
            else:
                logger.error("❌ 连接失败: 未建立连接")
                return False
                
        except Exception as e:
            logger.error(f"❌ 连接失败: {e}")
            self.connected = False
            return False
    
    def disconnect(self):
        """断开连接"""
        if self.ib and self.connected:
            self.ib.disconnect()
            self.connected = False
            logger.info("👋 已断开IBKR连接")
    
    def get_account_info(self) -> Dict:
        """
        获取账户信息
        
        Returns:
            账户信息字典
        """
        if not self.connected:
            logger.error("❌ 未连接，无法获取账户信息")
            return {}
        
        try:
            account = self.ib.managedAccounts()[0]
            summary = self.ib.accountSummary(account)
            
            info = {
                'account': account,
                'timestamp': datetime.now().isoformat(),
                'values': {}
            }
            
            # 提取关键信息
            for item in summary:
                if item.tag in ['NetLiquidation', 'AvailableFunds', 'BuyingPower', 
                               'EquityWithLoanValue', 'InitMarginReq', 'MaintMarginReq']:
                    info['values'][item.tag] = {
                        'value': item.value,
                        'currency': item.currency
                    }
            
            logger.info(f"📊 账户信息获取成功")
            return info
            
        except Exception as e:
            logger.error(f"❌ 获取账户信息失败: {e}")
            return {}
    
    def get_positions(self) -> List[Dict]:
        """
        获取当前持仓
        
        Returns:
            持仓列表
        """
        if not self.connected:
            logger.error("❌ 未连接，无法获取持仓")
            return []
        
        try:
            positions = self.ib.positions()
            
            result = []
            for pos in positions:
                result.append({
                    'symbol': pos.contract.symbol,
                    'secType': pos.contract.secType,
                    'position': pos.position,
                    'avgCost': pos.avgCost,
                    'currency': pos.contract.currency
                })
            
            logger.info(f"📈 当前持仓: {len(result)} 只")
            return result
            
        except Exception as e:
            logger.error(f"❌ 获取持仓失败: {e}")
            return []
    
    def place_market_order(self, symbol: str, action: str, quantity: int,
                          sec_type: str = 'STK', exchange: str = 'SMART',
                          currency: str = 'USD') -> Optional[Dict]:
        """
        下市价单
        
        Args:
            symbol: 股票代码
            action: 'BUY' 或 'SELL'
            quantity: 数量
            sec_type: 证券类型 (STK=股票)
            exchange: 交易所
            currency: 货币
        
        Returns:
            订单信息或None
        """
        if not self.connected:
            logger.error("❌ 未连接，无法下单")
            return None
        
        try:
            from ib_insync import Stock, MarketOrder
            
            # 创建合约
            contract = Stock(symbol, exchange, currency)
            
            # 创建市价单
            order = MarketOrder(action, quantity)
            
            # 下单
            logger.info(f"📝 下单: {action} {quantity} {symbol}")
            trade = self.ib.placeOrder(contract, order)
            
            # 等待订单状态更新 (最多5秒)
            self.ib.sleep(2)
            
            # 返回订单信息
            result = {
                'orderId': trade.order.orderId,
                'symbol': symbol,
                'action': action,
                'quantity': quantity,
                'orderType': 'MKT',
                'status': trade.orderStatus.status,
                'filled': trade.orderStatus.filled,
                'remaining': trade.orderStatus.remaining,
                'avgFillPrice': trade.orderStatus.avgFillPrice
            }
            
            logger.info(f"✅ 订单已提交: ID={result['orderId']}, Status={result['status']}")
            return result
            
        except Exception as e:
            logger.error(f"❌ 下单失败: {e}")
            return None
    
    def get_market_price(self, symbol: str, sec_type: str = 'STK',
                        exchange: str = 'SMART', currency: str = 'USD') -> Optional[float]:
        """
        获取最新市场价格
        
        Returns:
            最新价格或None
        """
        if not self.connected:
            logger.error("❌ 未连接，无法获取价格")
            return None
        
        try:
            from ib_insync import Stock
            
            contract = Stock(symbol, exchange, currency)
            
            # 请求市场数据
            ticker = self.ib.reqMktData(contract, '', False, False)
            
            # 等待数据 (最多5秒)
            for _ in range(10):
                if ticker.last:
                    break
                self.ib.sleep(0.5)
            
            price = ticker.last
            
            # 取消市场数据订阅
            self.ib.cancelMktData(contract)
            
            if price:
                logger.info(f"💰 {symbol} 最新价格: ${price}")
                return price
            else:
                logger.warning(f"⚠️ 无法获取 {symbol} 价格")
                return None
                
        except Exception as e:
            logger.error(f"❌ 获取价格失败: {e}")
            return None
    
    def print_portfolio_summary(self):
        """打印账户摘要"""
        if not self.connected:
            print("❌ 未连接")
            return
        
        print("\n" + "="*70)
        print("📊 IBKR账户摘要")
        print("="*70)
        
        # 账户信息
        account_info = self.get_account_info()
        if account_info:
            print(f"\n账户: {account_info.get('account', 'N/A')}")
            print(f"时间: {account_info.get('timestamp', 'N/A')}")
            
            values = account_info.get('values', {})
            for tag, data in values.items():
                print(f"  {tag}: {data['value']} {data['currency']}")
        
        # 持仓
        positions = self.get_positions()
        if positions:
            print(f"\n📈 持仓 ({len(positions)}只):")
            for pos in positions:
                print(f"  {pos['symbol']}: {pos['position']}股 @ ${pos['avgCost']:.2f}")
        else:
            print("\n📈 无持仓")
        
        print("="*70 + "\n")


def test_connection():
    """测试连接"""
    print("🦐 测试IBKR连接...")
    print("="*70)
    
    # 创建连接器 (Paper Trading)
    connector = IBKRConnector(paper_trading=True, client_id=1)
    
    # 连接
    if connector.connect():
        print("\n✅ 连接成功!")
        
        # 打印账户摘要
        connector.print_portfolio_summary()
        
        # 测试获取价格
        print("\n🧪 测试获取市场价格...")
        price = connector.get_market_price('GFS')
        if price:
            print(f"✅ GFS价格获取成功: ${price}")
        
        # 断开连接
        connector.disconnect()
        print("\n✅ 测试完成!")
        
        return True
    else:
        print("\n❌ 连接失败!")
        print("\n请检查:")
        print("  1. TWS是否已打开并登录到Paper Trading")
        print("  2. API是否在TWS中启用 (端口7497)")
        print("  3. 防火墙是否阻止连接")
        return False


if __name__ == "__main__":
    test_connection()
