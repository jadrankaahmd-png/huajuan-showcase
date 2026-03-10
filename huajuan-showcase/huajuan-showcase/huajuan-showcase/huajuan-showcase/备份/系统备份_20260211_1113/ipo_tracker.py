#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
IPO追踪器 - IPO Tracker
作者：虾虾
创建时间：2026-02-08
用途：监控新股IPO表现，首日统计，破发率分析
"""

import yfinance as yf
import pandas as pd
from datetime import datetime
import os


class IPOTracker:
    """IPO追踪器"""
    
    def __init__(self):
        self.output_dir = os.path.expanduser("~/.openclaw/workspace/IPO数据")
        os.makedirs(self.output_dir, exist_ok=True)
        
        # 最近IPO列表（示例）
        self.recent_ipos = ['ARM', 'INST', 'KVYO', 'ALAB', 'ZJYL']
    
    def track_ipo_performance(self, symbol):
        """
        追踪IPO表现
        """
        try:
            stock = yf.Ticker(symbol)
            hist = stock.history(period="3mo")
            
            if hist.empty or len(hist) < 2:
                return None
            
            # 首日表现
            first_day_open = hist['Open'].iloc[0]
            first_day_close = hist['Close'].iloc[0]
            first_day_return = (first_day_close / first_day_open - 1) * 100
            
            # 当前表现
            current_price = hist['Close'].iloc[-1]
            current_return = (current_price / first_day_open - 1) * 100
            
            # 最高价/最低价
            high_since_ipo = hist['High'].max()
            low_since_ipo = hist['Low'].min()
            
            # 是否破发
            broke_ipo = current_price < first_day_open
            
            return {
                'symbol': symbol,
                'ipo_price': first_day_open,
                'first_day_return': first_day_return,
                'current_price': current_price,
                'current_return': current_return,
                'high_since_ipo': high_since_ipo,
                'low_since_ipo': low_since_ipo,
                'broke_ipo': broke_ipo
            }
            
        except Exception as e:
            print(f"⚠️  获取{symbol}失败: {e}")
            return None
    
    def generate_ipo_report(self):
        """
        生成IPO报告
        """
        print("🦐 IPO追踪报告")
        print("=" * 70)
        print(f"时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print("=" * 70)
        
        ipo_data = []
        
        for symbol in self.recent_ipos:
            data = self.track_ipo_performance(symbol)
            if data:
                ipo_data.append(data)
        
        if not ipo_data:
            print("\n⚠️  无法获取IPO数据")
            return
        
        # 统计
        broke_count = sum(1 for d in ipo_data if d['broke_ipo'])
        broke_rate = broke_count / len(ipo_data) * 100
        
        print(f"\n📊 IPO统计:")
        print(f"   样本数: {len(ipo_data)}")
        print(f"   破发数: {broke_count}")
        print(f"   破发率: {broke_rate:.1f}%")
        
        print(f"\n📈 详细表现:")
        print("-" * 70)
        print(f"{'股票':<8} {'首日涨幅':>10} {'当前涨幅':>10} {'破发':>8}")
        print("-" * 70)
        
        for d in ipo_data:
            emoji = "🔴" if d['broke_ipo'] else "🟢"
            broke_str = "是" if d['broke_ipo'] else "否"
            print(f"{emoji} {d['symbol']:<6} {d['first_day_return']:>+8.1f}% {d['current_return']:>+8.1f}% {broke_str:>8}")
        
        print("\n" + "=" * 70)
        print("✅ IPO追踪完成！")


def main():
    """主函数"""
    tracker = IPOTracker()
    tracker.generate_ipo_report()


if __name__ == "__main__":
    main()
