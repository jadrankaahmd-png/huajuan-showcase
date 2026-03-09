#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
财报超预期追踪器 - Earnings Surprise Tracker
作者：虾虾
创建时间：2026-02-08
用途：追踪财报超预期情况，行业统计，股价反应分析
"""

import yfinance as yf
from datetime import datetime
import os


class EarningsSurpriseTracker:
    """财报超预期追踪器"""
    
    def __init__(self):
        self.output_dir = os.path.expanduser("~/.openclaw/workspace/财报超预期数据")
        os.makedirs(self.output_dir, exist_ok=True)
        
        self.watchlist = ['NVDA', 'AAPL', 'MSFT', 'GOOGL', 'META', 'TSLA', 'AMD']
    
    def analyze_earnings_surprise(self, symbol):
        """
        分析财报超预期情况
        """
        try:
            stock = yf.Ticker(symbol)
            earnings = stock.earnings_dates
            
            if earnings is None or earnings.empty:
                return None
            
            # 最近财报
            recent = earnings.head(4)
            
            surprises = []
            for idx, row in recent.iterrows():
                surprise = row.get('Surprise(%)', 0)
                surprises.append(surprise)
            
            avg_surprise = sum(surprises) / len(surprises) if surprises else 0
            beat_count = sum(1 for s in surprises if s > 0)
            beat_rate = beat_count / len(surprises) * 100 if surprises else 0
            
            return {
                'symbol': symbol,
                'beat_rate': beat_rate,
                'avg_surprise': avg_surprise,
                'consistency': '稳定' if beat_rate >= 75 else '一般' if beat_rate >= 50 else '不稳定'
            }
            
        except Exception as e:
            print(f"⚠️  分析{symbol}失败: {e}")
            return None
    
    def generate_surprise_report(self):
        """
        生成超预期报告
        """
        print("🦐 财报超预期追踪报告")
        print("=" * 70)
        print(f"时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print("=" * 70)
        
        all_data = []
        
        for symbol in self.watchlist:
            data = self.analyze_earnings_surprise(symbol)
            if data:
                all_data.append(data)
        
        # 排序
        all_data.sort(key=lambda x: x['beat_rate'], reverse=True)
        
        print(f"\n📊 财报超预期排名:")
        print("-" * 70)
        print(f"{'股票':<8} {'超预期率':>10} {'平均惊喜':>10} {'一致性':>10}")
        print("-" * 70)
        
        for d in all_data:
            emoji = "🟢" if d['beat_rate'] >= 75 else "🟡" if d['beat_rate'] >= 50 else "🔴"
            print(f"{emoji} {d['symbol']:<6} {d['beat_rate']:>8.1f}% {d['avg_surprise']:>+8.1f}% {d['consistency']:>10}")
        
        print("\n" + "=" * 70)
        print("✅ 财报超预期分析完成！")


def main():
    """主函数"""
    tracker = EarningsSurpriseTracker()
    tracker.generate_surprise_report()


if __name__ == "__main__":
    main()
