#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
财报日历监控 - Earnings Calendar Monitor
作者：虾虾
创建时间：2026-02-08
用途：监控美股财报日历，提前预警重要财报
"""

import yfinance as yf
import pandas as pd
from datetime import datetime, timedelta
import sys
import json


class EarningsCalendar:
    """财报日历监控类"""
    
    def __init__(self):
        self.earnings_data = []
        self.watchlist = []
        
    def add_to_watchlist(self, symbols):
        """添加股票到监控列表"""
        if isinstance(symbols, str):
            symbols = [symbols]
        self.watchlist.extend(symbols)
        self.watchlist = list(set(self.watchlist))  # 去重
        print(f"✅ 已添加 {len(symbols)} 只股票到监控列表")
    
    def get_earnings_date(self, symbol):
        """获取单只股票的财报日期"""
        try:
            stock = yf.Ticker(symbol)
            info = stock.info
            
            # 获取财报日期
            earnings_date = info.get('earningsDate')
            if earnings_date:
                if isinstance(earnings_date, list):
                    earnings_date = earnings_date[0]
            
            # 获取已知的最近财报数据
            quarterly_earnings = stock.quarterly_earnings
            
            return {
                'symbol': symbol,
                'name': info.get('longName', 'N/A'),
                'sector': info.get('sector', 'N/A'),
                'earnings_date': earnings_date,
                'eps_estimate': info.get('epsEstimate', 'N/A'),
                'revenue_estimate': info.get('revenueEstimate', 'N/A'),
                'pe_ratio': info.get('trailingPE', 'N/A'),
                'market_cap': info.get('marketCap', 0)
            }
        except Exception as e:
            print(f"❌ 获取{symbol}财报信息失败: {e}")
            return None
    
    def scan_watchlist(self):
        """扫描监控列表中的所有股票"""
        if not self.watchlist:
            print("⚠️ 监控列表为空，请先添加股票")
            return []
        
        print(f"\n🦐 扫描 {len(self.watchlist)} 只股票的财报信息...")
        print("=" * 70)
        
        results = []
        for i, symbol in enumerate(self.watchlist, 1):
            print(f"[{i}/{len(self.watchlist)}] 查询 {symbol}...", end=" ")
            data = self.get_earnings_date(symbol)
            if data:
                results.append(data)
                if data['earnings_date']:
                    print(f"📅 {data['earnings_date']}")
                else:
                    print("暂无财报日期")
            else:
                print("❌ 失败")
        
        self.earnings_data = results
        return results
    
    def get_upcoming_earnings(self, days=7):
        """
        获取未来N天的财报
        """
        if not self.earnings_data:
            self.scan_watchlist()
        
        today = datetime.now()
        upcoming = []
        
        for data in self.earnings_data:
            if data['earnings_date']:
                try:
                    if isinstance(data['earnings_date'], str):
                        earnings_dt = datetime.strptime(data['earnings_date'], '%Y-%m-%d')
                    else:
                        earnings_dt = data['earnings_date']
                    
                    days_until = (earnings_dt - today).days
                    
                    if 0 <= days_until <= days:
                        data['days_until'] = days_until
                        upcoming.append(data)
                except:
                    pass
        
        # 按日期排序
        upcoming.sort(key=lambda x: x.get('days_until', 999))
        return upcoming
    
    def print_earnings_report(self, days=7):
        """打印财报报告"""
        upcoming = self.get_upcoming_earnings(days)
        
        print("\n" + "=" * 70)
        print(f"📅 未来{days}天财报日历")
        print("=" * 70)
        
        if not upcoming:
            print(f"\n✅ 未来{days}天内没有监控股票的财报")
            return
        
        print(f"\n找到 {len(upcoming)} 只股票即将发布财报：\n")
        
        for data in upcoming:
            symbol = data['symbol']
            name = data['name']
            date = data['earnings_date']
            days_left = data.get('days_until', '?')
            eps_est = data.get('eps_estimate', 'N/A')
            
            if days_left == 0:
                urgency = "🔴 今天"
            elif days_left == 1:
                urgency = "🟠 明天"
            elif days_left <= 3:
                urgency = f"🟡 {days_left}天后"
            else:
                urgency = f"🟢 {days_left}天后"
            
            print(f"{urgency} {date}")
            print(f"  {symbol} - {name}")
            print(f"  预期EPS: {eps_est}")
            print()
        
        print("=" * 70)
        
        # 风险提醒
        today_earnings = [e for e in upcoming if e.get('days_until') == 0]
        tomorrow_earnings = [e for e in upcoming if e.get('days_until') == 1]
        
        if today_earnings:
            print(f"\n🔴 今日财报 ({len(today_earnings)}只):")
            for e in today_earnings:
                print(f"  • {e['symbol']} - 注意盘后波动")
        
        if tomorrow_earnings:
            print(f"\n🟠 明日财报 ({len(tomorrow_earnings)}只):")
            for e in tomorrow_earnings:
                print(f"  • {e['symbol']} - 提前准备")
    
    def get_earnings_history(self, symbol):
        """获取股票历史财报表现"""
        try:
            stock = yf.Ticker(symbol)
            earnings = stock.quarterly_earnings
            
            if earnings is None or earnings.empty:
                return None
            
            print(f"\n📊 {symbol} 历史财报表现：")
            print("-" * 70)
            print(earnings.to_string())
            
            # 计算超预期比例
            if 'Reported EPS' in earnings.columns and 'Estimated EPS' in earnings.columns:
                earnings['Beat'] = earnings['Reported EPS'] > earnings['Estimated EPS']
                beat_ratio = earnings['Beat'].mean() * 100
                print(f"\n✅ 超预期率: {beat_ratio:.1f}%")
            
            return earnings
        except Exception as e:
            print(f"❌ 获取{symbol}历史财报失败: {e}")
            return None
    
    def save_watchlist(self, filename='earnings_watchlist.json'):
        """保存监控列表"""
        with open(filename, 'w') as f:
            json.dump(self.watchlist, f)
        print(f"✅ 监控列表已保存到 {filename}")
    
    def load_watchlist(self, filename='earnings_watchlist.json'):
        """加载监控列表"""
        try:
            with open(filename, 'r') as f:
                self.watchlist = json.load(f)
            print(f"✅ 已从 {filename} 加载 {len(self.watchlist)} 只股票")
        except FileNotFoundError:
            print(f"⚠️ 文件 {filename} 不存在")


def main():
    """主函数"""
    print("🦐 财报日历监控工具")
    print("=" * 70)
    
    # 默认监控列表（半导体/AI核心股）
    default_watchlist = [
        'NVDA', 'AMD', 'TSM', 'INTC', 'QCOM', 'AVGO',  # 半导体
        'AAPL', 'MSFT', 'GOOGL', 'META', 'AMZN', 'TSLA',  # 科技巨头
        'CRM', 'ORCL', 'ADBE', 'CRM', 'NOW',  # SaaS
        'PLTR', 'CRWD', 'SNOW', 'DDOG',  # 高增长科技
        'ARKK', 'SMH', 'SOXX',  # ETF
    ]
    
    calendar = EarningsCalendar()
    
    if len(sys.argv) > 1:
        if sys.argv[1] == '--add':
            symbols = sys.argv[2:]
            calendar.add_to_watchlist(symbols)
            calendar.save_watchlist()
        elif sys.argv[1] == '--scan':
            calendar.load_watchlist()
            if not calendar.watchlist:
                print("使用默认监控列表...")
                calendar.add_to_watchlist(default_watchlist)
            calendar.print_earnings_report(days=14)
        elif sys.argv[1] == '--history':
            if len(sys.argv) > 2:
                symbol = sys.argv[2]
                calendar.get_earnings_history(symbol)
            else:
                print("请指定股票代码: python earnings_calendar.py --history AAPL")
        else:
            print("未知命令")
    else:
        print("\n使用说明:")
        print("  --add <股票1> <股票2> ...  添加股票到监控列表")
        print("  --scan                      扫描财报日历")
        print("  --history <股票>            查看历史财报")
        print("\n示例:")
        print("  python earnings_calendar.py --add NVDA AMD TSM")
        print("  python earnings_calendar.py --scan")
        print("  python earnings_calendar.py --history AAPL")
        
        # 默认执行扫描
        print("\n" + "=" * 70)
        print("执行默认扫描...")
        calendar.add_to_watchlist(default_watchlist)
        calendar.print_earnings_report(days=14)


if __name__ == "__main__":
    main()
