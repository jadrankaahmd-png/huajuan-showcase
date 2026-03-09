#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
虾虾IBKR数据获取模块 - IBKR Data Provider
所有数据直接从IBKR获取，确保准确性和实时性
"""

import sys
import asyncio
from datetime import datetime, timedelta
from typing import Dict, Optional, List

sys.path.insert(0, '/Users/ox/.openclaw/workspace/tools')

# 设置事件循环
if sys.platform == 'darwin':
    asyncio.set_event_loop_policy(asyncio.DefaultEventLoopPolicy())

try:
    loop = asyncio.get_running_loop()
except RuntimeError:
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)

from ib_insync import IB, Stock, util


class IBKRDataProvider:
    """
    IBKR数据提供器
    所有市场数据直接从IBKR获取
    """
    
    def __init__(self):
        self.ib = IB()
        self.connected = False
    
    def connect(self, timeout: int = 10) -> bool:
        """连接IBKR"""
        try:
            self.ib.connect('127.0.0.1', 7497, clientId=99, timeout=timeout)
            self.connected = True
            print(f"✅ IBKR数据连接成功")
            return True
        except Exception as e:
            print(f"❌ IBKR连接失败: {e}")
            self.connected = False
            return False
    
    def disconnect(self):
        """断开连接"""
        if self.connected:
            self.ib.disconnect()
            self.connected = False
    
    def get_current_price(self, symbol: str) -> Optional[float]:
        """
        获取当前价格 (从IBKR)
        
        Args:
            symbol: 股票代码
        
        Returns:
            当前价格或None
        """
        if not self.connected:
            return None
        
        try:
            contract = Stock(symbol, 'SMART', 'USD')
            self.ib.qualifyContracts(contract)
            
            # 请求市场数据
            ticker = self.ib.reqMktData(contract)
            self.ib.sleep(1)  # 等待数据
            
            # 获取最新价格
            price = ticker.last if ticker.last else ticker.close
            
            return price
        except Exception as e:
            print(f"⚠️  获取{symbol}价格失败: {e}")
            return None
    
    def get_historical_data(self, symbol: str, duration: str = "5 D", 
                           bar_size: str = "1 day") -> Optional[List]:
        """
        获取历史数据
        
        Args:
            symbol: 股票代码
            duration: 时间范围 (如 "5 D", "1 M")
            bar_size: K线周期 (如 "1 day", "1 hour")
        
        Returns:
            历史数据列表或None
        """
        if not self.connected:
            return None
        
        try:
            contract = Stock(symbol, 'SMART', 'USD')
            self.ib.qualifyContracts(contract)
            
            # 请求历史数据
            bars = self.ib.reqHistoricalData(
                contract,
                endDateTime='',
                durationStr=duration,
                barSizeSetting=bar_size,
                whatToShow='TRADES',
                useRTH=True,
                formatDate=1
            )
            
            return bars
        except Exception as e:
            print(f"⚠️  获取{symbol}历史数据失败: {e}")
            return None
    
    def get_account_summary(self) -> Dict:
        """获取账户摘要"""
        if not self.connected:
            return {}
        
        try:
            account = self.ib.managedAccounts()[0]
            summary = self.ib.accountSummary(account)
            
            result = {}
            for item in summary:
                result[item.tag] = {
                    'value': item.value,
                    'currency': item.currency
                }
            
            return result
        except Exception as e:
            print(f"⚠️  获取账户摘要失败: {e}")
            return {}
    
    def get_positions(self) -> List[Dict]:
        """获取持仓"""
        if not self.connected:
            return []
        
        try:
            positions = self.ib.positions()
            result = []
            for pos in positions:
                result.append({
                    'symbol': pos.contract.symbol,
                    'quantity': pos.position,
                    'avg_cost': pos.avgCost
                })
            return result
        except Exception as e:
            print(f"⚠️  获取持仓失败: {e}")
            return []
    
    def get_portfolio(self) -> List[Dict]:
        """获取投资组合"""
        if not self.connected:
            return []
        
        try:
            portfolio = self.ib.portfolio()
            result = []
            for item in portfolio:
                result.append({
                    'symbol': item.contract.symbol,
                    'quantity': item.position,
                    'market_price': item.marketPrice,
                    'market_value': item.marketValue,
                    'avg_cost': item.averageCost,
                    'unrealized_pnl': item.unrealizedPNL,
                    'realized_pnl': item.realizedPNL
                })
            return result
        except Exception as e:
            print(f"⚠️  获取投资组合失败: {e}")
            return []
    
    def get_last_night_close(self, symbol: str) -> Optional[float]:
        """
        获取昨晚收盘价
        
        Args:
            symbol: 股票代码
        
        Returns:
            昨晚收盘价
        """
        bars = self.get_historical_data(symbol, duration="2 D", bar_size="1 day")
        if bars and len(bars) >= 1:
            # 最后一个bar是昨晚的收盘
            return bars[-1].close
        return None
    
    def get_price_change_percent(self, symbol: str) -> Optional[float]:
        """
        获取涨跌百分比 (昨晚收盘 vs 前晚收盘)
        
        Args:
            symbol: 股票代码
        
        Returns:
            涨跌百分比
        """
        bars = self.get_historical_data(symbol, duration="5 D", bar_size="1 day")
        if bars and len(bars) >= 2:
            last_close = bars[-1].close  # 昨晚收盘
            prev_close = bars[-2].close  # 前晚收盘
            change = (last_close - prev_close) / prev_close * 100
            return change
        return None


def test_ibkr_data():
    """测试IBKR数据获取"""
    print("🦐 测试IBKR数据提供器")
    print("="*70)
    
    provider = IBKRDataProvider()
    
    # 连接
    if not provider.connect():
        print("❌ 连接失败")
        return
    
    # 测试股票
    symbols = ['NVDA', 'AAPL', 'TSLA']
    
    print("\n📊 获取当前价格:")
    for symbol in symbols:
        price = provider.get_current_price(symbol)
        if price:
            print(f"  {symbol}: ${price:.2f}")
        else:
            print(f"  {symbol}: 无法获取")
    
    print("\n📈 获取昨晚收盘:")
    for symbol in symbols:
        close = provider.get_last_night_close(symbol)
        change = provider.get_price_change_percent(symbol)
        if close and change:
            print(f"  {symbol}: ${close:.2f} ({change:+.2f}%)")
        else:
            print(f"  {symbol}: 无法获取")
    
    # 获取账户信息
    print("\n💰 账户信息:")
    summary = provider.get_account_summary()
    if summary:
        if 'AvailableFunds' in summary:
            print(f"  可用资金: ${float(summary['AvailableFunds']['value']):,.2f}")
        if 'BuyingPower' in summary:
            print(f"  购买力: ${float(summary['BuyingPower']['value']):,.2f}")
    
    # 获取持仓
    print("\n📈 当前持仓:")
    positions = provider.get_positions()
    if positions:
        for pos in positions:
            print(f"  {pos['symbol']}: {pos['quantity']}股 @ ${pos['avg_cost']:.2f}")
    else:
        print("  暂无持仓")
    
    # 断开连接
    provider.disconnect()
    print("\n✅ 测试完成")


if __name__ == "__main__":
    test_ibkr_data()
