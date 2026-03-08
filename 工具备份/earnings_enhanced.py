#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
财报日历增强版 - Enhanced Earnings Calendar
作者：虾虾
创建时间：2026-02-08
用途：更完善的财报监控，提前预警，历史分析
"""

import yfinance as yf
import pandas as pd
from datetime import datetime, timedelta
import json
import os
import sys


class EnhancedEarningsCalendar:
    """财报日历增强版"""
    
    def __init__(self):
        self.watchlist = self.load_watchlist()
        self.data_dir = os.path.expanduser("~/.openclaw/workspace/财报监控数据")
        os.makedirs(self.data_dir, exist_ok=True)
        self.history_file = f"{self.data_dir}/earnings_history.json"
        
    def load_watchlist(self):
        """加载监控列表"""
        # 默认监控重点股票
        return [
            'NVDA', 'TSM', 'AMD', 'INTC', 'QCOM', 'AVGO',  # 半导体
            'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META', 'TSLA',  # 科技
            'SMCI', 'PLTR', 'ARM', 'MU',  # AI/半导体相关
        ]
    
    def get_earnings_date(self, symbol):
        """
        获取财报日期
        """
        try:
            stock = yf.Ticker(symbol)
            calendar = stock.calendar
            
            if calendar is not None and not calendar.empty:
                # 获取下一个财报日期
                earnings_date = calendar.index[0] if len(calendar.index) > 0 else None
                if earnings_date:
                    return pd.Timestamp(earnings_date)
            
            return None
        except Exception as e:
            print(f"⚠️  获取{symbol}财报日期失败: {e}")
            return None
    
    def get_earnings_history(self, symbol):
        """
        获取历史财报数据
        """
        try:
            stock = yf.Ticker(symbol)
            earnings = stock.earnings_dates
            
            if earnings is not None and not earnings.empty:
                return earnings
            
            return None
        except Exception as e:
            print(f"⚠️  获取{symbol}历史财报失败: {e}")
            return None
    
    def analyze_earnings_history(self, symbol):
        """
        分析历史财报表现
        """
        history = self.get_earnings_history(symbol)
        
        if history is None or history.empty:
            return None
        
        # 分析最近4个季度的表现
        recent = history.head(4)
        
        beats = 0
        misses = 0
        meets = 0
        
        for idx, row in recent.iterrows():
            surprise = row.get('Surprise(%)', 0)
            if surprise > 0:
                beats += 1
            elif surprise < 0:
                misses += 1
            else:
                meets += 1
        
        avg_surprise = recent['Surprise(%)'].mean() if 'Surprise(%)' in recent.columns else 0
        
        return {
            'total_quarters': len(recent),
            'beats': beats,
            'misses': misses,
            'meets': meets,
            'beat_rate': beats / len(recent) * 100 if len(recent) > 0 else 0,
            'avg_surprise': avg_surprise,
            'consistency': '稳定' if beats >= 3 else '不稳定' if misses >= 2 else '一般'
        }
    
    def check_upcoming_earnings(self, days_ahead=7):
        """
        检查未来N天的财报
        """
        print(f"🦐 检查未来{days_ahead}天的财报...")
        print("=" * 70)
        
        today = datetime.now()
        upcoming = []
        
        for symbol in self.watchlist:
            earnings_date = self.get_earnings_date(symbol)
            
            if earnings_date:
                days_until = (earnings_date - today).days
                
                if 0 <= days_until <= days_ahead:
                    # 获取历史分析
                    history_analysis = self.analyze_earnings_history(symbol)
                    
                    # 判断盘前还是盘后
                    # yfinance不直接提供时间，我们假设大部分在盘后
                    earnings_time = "盘后"  # 默认盘后
                    
                    upcoming.append({
                        'symbol': symbol,
                        'earnings_date': earnings_date.strftime('%Y-%m-%d'),
                        'days_until': days_until,
                        'time': earnings_time,
                        'history': history_analysis
                    })
        
        # 按日期排序
        upcoming.sort(key=lambda x: x['days_until'])
        
        return upcoming
    
    def generate_alert(self, upcoming_earnings):
        """
        生成财报预警
        """
        if not upcoming_earnings:
            print("\n✅ 未来7天内没有重点监控股票的财报")
            return
        
        print(f"\n🚨 财报预警 - 发现 {len(upcoming_earnings)} 个财报事件")
        print("-" * 70)
        
        for item in upcoming_earnings:
            symbol = item['symbol']
            date = item['earnings_date']
            days = item['days_until']
            time = item['time']
            history = item['history']
            
            # 紧急程度
            if days == 0:
                urgency = "🔴 今天发布！"
            elif days <= 2:
                urgency = "🟠  imminent"
            elif days <= 5:
                urgency = "🟡 即将发布"
            else:
                urgency = "⚪ 本周内"
            
            print(f"\n{urgency}")
            print(f"   股票: {symbol}")
            print(f"   日期: {date} ({time})")
            print(f"   剩余: {days}天")
            
            if history:
                print(f"   历史表现:")
                print(f"     - 过去{history['total_quarters']}季度: {history['beats']}次超预期, {history['misses']}次不及预期")
                print(f"     - 超预期率: {history['beat_rate']:.1f}%")
                print(f"     - 平均惊喜: {history['avg_surprise']:+.1f}%")
                print(f"     - 一致性: {history['consistency']}")
            
            # 建议
            if history and history['beat_rate'] >= 75:
                print(f"   💡 建议: 历史超预期率高，可关注")
            elif history and history['misses'] >= 2:
                print(f"   ⚠️  注意: 近期有不及预期记录，谨慎")
    
    def check_today_earnings(self):
        """
        检查今天的财报（盘后）
        """
        print("\n📅 今日财报监控（盘后）")
        print("=" * 70)
        
        today = datetime.now().strftime('%Y-%m-%d')
        today_earnings = []
        
        for symbol in self.watchlist:
            earnings_date = self.get_earnings_date(symbol)
            if earnings_date and earnings_date.strftime('%Y-%m-%d') == today:
                today_earnings.append(symbol)
        
        if today_earnings:
            print(f"\n🔴 注意！今天盘后以下股票发布财报：")
            for symbol in today_earnings:
                print(f"   • {symbol}")
            print("\n   建议:")
            print("   - 盘前不要新建仓")
            print("   - 已有持仓设置好止损")
            print("   - 财报后根据结果调整")
        else:
            print("\n✅ 今天没有重点监控股票的财报")
        
        return today_earnings
    
    def save_earnings_data(self, upcoming_earnings):
        """
        保存财报数据
        """
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f"{self.data_dir}/earnings_alert_{timestamp}.json"
        
        data = {
            'timestamp': timestamp,
            'upcoming_earnings': upcoming_earnings
        }
        
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        
        print(f"\n💾 数据已保存: {filename}")
    
    def generate_daily_report(self):
        """
        生成每日财报报告
        """
        print("\n" + "=" * 70)
        print("🦐 每日财报监控报告")
        print(f"时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print("=" * 70)
        
        # 1. 检查今天财报
        today_earnings = self.check_today_earnings()
        
        # 2. 检查未来7天财报
        upcoming = self.check_upcoming_earnings(days_ahead=7)
        
        # 3. 生成预警
        self.generate_alert(upcoming)
        
        # 4. 保存数据
        self.save_earnings_data(upcoming)
        
        print("\n" + "=" * 70)
        print("✅ 财报监控完成！")
        
        return {
            'today_earnings': today_earnings,
            'upcoming_earnings': upcoming
        }


def main():
    """主函数"""
    if len(sys.argv) > 1:
        if sys.argv[1] == '--today':
            calendar = EnhancedEarningsCalendar()
            calendar.check_today_earnings()
        elif sys.argv[1] == '--week':
            calendar = EnhancedEarningsCalendar()
            upcoming = calendar.check_upcoming_earnings(days_ahead=7)
            calendar.generate_alert(upcoming)
        elif sys.argv[1] == '--add':
            if len(sys.argv) > 2:
                symbol = sys.argv[2].upper()
                print(f"🦐 添加 {symbol} 到监控列表")
                # 这里可以实现添加功能
            else:
                print("❌ 请提供股票代码: python earnings_enhanced.py --add AAPL")
        else:
            print("❌ 未知命令")
    else:
        # 生成完整报告
        calendar = EnhancedEarningsCalendar()
        calendar.generate_daily_report()


if __name__ == "__main__":
    main()
