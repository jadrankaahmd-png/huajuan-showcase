#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
内部人交易追踪器 - Insider Trading Tracker
作者：虾虾
创建时间：2026-02-08
用途：追踪公司内部人交易，发现潜在买卖信号
"""

import yfinance as yf
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import requests
import sys


class InsiderTracker:
    """内部人交易追踪器"""
    
    def __init__(self, symbol):
        self.symbol = symbol
        self.data = None
        self.insider_data = None
        
    def fetch_insider_data(self):
        """
        获取内部人交易数据
        使用OpenInsider或类似API
        """
        print(f"🦐 获取 {self.symbol} 内部人交易数据...")
        
        # 尝试使用yfinance获取内部人数据
        try:
            stock = yf.Ticker(self.symbol)
            
            # 获取内部人交易数据
            insider_df = stock.get_insider_transactions()
            if insider_df is not None and not insider_df.empty:
                self.insider_data = insider_df
                print(f"✅ 获取到 {len(insider_df)} 条内部人交易记录")
                return True
            else:
                print(f"⚠️ 无法从yfinance获取内部人数据")
                return False
        except Exception as e:
            print(f"⚠️ 获取内部人数据失败: {e}")
            return False
    
    def fetch_openinsider_data(self):
        """
        从OpenInsider获取数据（备用方案）
        """
        try:
            # OpenInsider数据格式
            # 这里使用模拟数据演示功能
            # 实际使用时应调用OpenInsider API或爬虫
            
            print("📝 使用演示数据（实际使用时应连接OpenInsider API）")
            
            # 模拟一些内部人交易数据
            demo_data = [
                {
                    'Date': datetime.now() - timedelta(days=5),
                    'Insider': 'CEO',
                    'Title': 'Chief Executive Officer',
                    'Transaction': 'Purchase',
                    'Shares': 10000,
                    'Price': 150.0,
                    'Value': 1500000
                },
                {
                    'Date': datetime.now() - timedelta(days=10),
                    'Insider': 'CFO',
                    'Title': 'Chief Financial Officer',
                    'Transaction': 'Sale',
                    'Shares': 5000,
                    'Price': 155.0,
                    'Value': 775000
                }
            ]
            
            return pd.DataFrame(demo_data)
        except Exception as e:
            print(f"⚠️ 获取OpenInsider数据失败: {e}")
            return None
    
    def analyze_buy_sell_ratio(self):
        """分析买卖比例"""
        if self.insider_data is None:
            return None
        
        buys = 0
        sells = 0
        buy_value = 0
        sell_value = 0
        
        for _, row in self.insider_data.iterrows():
            shares = row.get('Shares', 0)
            price = row.get('Price', 0)
            transaction = row.get('Transaction', '').lower()
            
            value = shares * price
            
            if 'purchase' in transaction or 'buy' in transaction:
                buys += shares
                buy_value += value
            elif 'sale' in transaction or 'sell' in transaction:
                sells += shares
                sell_value += value
        
        total = buys + sells
        if total == 0:
            return {'buy_ratio': 0, 'sell_ratio': 0, 'signal': '无数据'}
        
        buy_ratio = buys / total
        sell_ratio = sells / total
        
        if buy_ratio > 0.7:
            signal = "🟢 强烈买入信号 - 内部人大量买入"
        elif buy_ratio > 0.5:
            signal = "🟡 温和买入信号 - 内部人倾向于买入"
        elif sell_ratio > 0.7:
            signal = "🔴 强烈卖出信号 - 内部人大量卖出"
        elif sell_ratio > 0.5:
            signal = "🟠 温和卖出信号 - 内部人倾向于卖出"
        else:
            signal = "⚪ 中性 - 买卖平衡"
        
        return {
            'buy_shares': buys,
            'sell_shares': sells,
            'buy_value': buy_value,
            'sell_value': sell_value,
            'buy_ratio': buy_ratio,
            'sell_ratio': sell_ratio,
            'signal': signal
        }
    
    def analyze_recent_activity(self, days=30):
        """分析最近的交易活动"""
        if self.insider_data is None:
            return None
        
        cutoff_date = datetime.now() - timedelta(days=days)
        recent = self.insider_data[self.insider_data.index >= cutoff_date]
        
        if recent.empty:
            return {'activity_count': 0, 'message': f'最近{days}天无内部人交易'}
        
        activity_count = len(recent)
        
        return {
            'activity_count': activity_count,
            'days': days,
            'message': f'最近{days}天有{activity_count}笔内部人交易'
        }
    
    def get_insider_summary(self):
        """获取内部人交易摘要"""
        buy_sell = self.analyze_buy_sell_ratio()
        recent = self.analyze_recent_activity()
        
        return {
            'buy_sell': buy_sell,
            'recent': recent
        }
    
    def print_report(self):
        """打印内部人交易报告"""
        print("\n" + "=" * 70)
        print(f"👔 {self.symbol} 内部人交易追踪报告")
        print("=" * 70)
        
        # 尝试获取数据
        if not self.fetch_insider_data():
            print("\n⚠️ 无法获取内部人数据")
            print("📝 使用OpenInsider演示数据...")
            demo_df = self.fetch_openinsider_data()
            if demo_df is not None:
                self.insider_data = demo_df
        
        # 买卖比例分析
        buy_sell = self.analyze_buy_sell_ratio()
        if buy_sell:
            print(f"\n📊 买卖比例分析:")
            print("-" * 70)
            print(f"   {buy_sell['signal']}")
            print(f"   买入股数: {buy_sell['buy_shares']:,.0f}")
            print(f"   卖出股数: {buy_sell['sell_shares']:,.0f}")
            print(f"   买入金额: ${buy_sell['buy_value']:,.0f}")
            print(f"   卖出金额: ${buy_sell['sell_value']:,.0f}")
            print(f"   买入比例: {buy_sell['buy_ratio']*100:.1f}%")
            print(f"   卖出比例: {buy_sell['sell_ratio']*100:.1f}%")
        
        # 近期活动
        recent = self.analyze_recent_activity()
        if recent:
            print(f"\n📅 近期交易活动:")
            print("-" * 70)
            print(f"   {recent['message']}")
        
        # 数据表格
        if self.insider_data is not None and not self.insider_data.empty:
            print(f"\n📋 内部人交易明细:")
            print("-" * 70)
            print(self.insider_data.head(10).to_string())
        
        # 投资建议
        print(f"\n💡 投资建议:")
        print("-" * 70)
        if buy_sell and buy_sell['buy_ratio'] > 0.6:
            print("   • 内部人大量买入，可能是积极信号")
            print("   • 建议关注公司基本面是否有改善")
            print("   • 可考虑跟随内部人买入")
        elif buy_sell and buy_sell['sell_ratio'] > 0.6:
            print("   • 内部人大量卖出，需警惕")
            print("   • 可能是正常套现，也可能是看空")
            print("   • 建议仔细研究卖出原因")
        else:
            print("   • 内部人交易平衡，无明显信号")
            print("   • 建议结合其他指标分析")
        
        print("=" * 70)
        print("\n⚠️ 注意：内部人数据可能存在延迟，仅供参考")


def track_multiple(symbols):
    """追踪多只股票"""
    print(f"\n🦐 批量追踪 {len(symbols)} 只股票的内部人交易...")
    print("=" * 70)
    
    results = []
    
    for symbol in symbols:
        tracker = InsiderTracker(symbol)
        if tracker.fetch_insider_data():
            summary = tracker.get_insider_summary()
            buy_sell = summary['buy_sell']
            results.append({
                'symbol': symbol,
                'buy_ratio': buy_sell['buy_ratio'] if buy_sell else 0,
                'signal': buy_sell['signal'] if buy_sell else '无数据'
            })
        else:
            results.append({
                'symbol': symbol,
                'buy_ratio': 0,
                'signal': '无数据'
            })
    
    # 按买入比例排序
    results.sort(key=lambda x: x['buy_ratio'], reverse=True)
    
    print(f"\n👔 内部人买入倾向排名：")
    print("-" * 70)
    print(f"{'排名':<4} {'股票':<8} {'买入比例':>12} {'信号':<20}")
    print("-" * 70)
    
    for i, r in enumerate(results, 1):
        print(f"{i:<4} {r['symbol']:<8} {r['buy_ratio']*100:>11.1f}% {r['signal']:<20}")
    
    print("=" * 70)


def main():
    """主函数"""
    if len(sys.argv) < 2:
        print("🦐 内部人交易追踪器使用说明：")
        print("=" * 70)
        print("用法:")
        print("  单只股票: python insider_tracker.py <股票代码>")
        print("  批量追踪: python insider_tracker.py --track <股票1> <股票2> ...")
        print("\n示例:")
        print("  python insider_tracker.py AAPL")
        print("  python insider_tracker.py --track AAPL MSFT NVDA GOOGL")
        sys.exit(1)
    
    if sys.argv[1] == '--track':
        symbols = sys.argv[2:]
        track_multiple(symbols)
    else:
        symbol = sys.argv[1]
        tracker = InsiderTracker(symbol)
        tracker.print_report()


if __name__ == "__main__":
    main()
