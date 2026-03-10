#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
财报速读器 - Earnings Reader
作者：虾虾
创建时间：2026-02-08
用途：自动下载财报PDF，AI提取关键信息，超预期/不及预期判断
"""

import yfinance as yf
from datetime import datetime
import os


class EarningsReader:
    """财报速读器"""
    
    def __init__(self):
        self.output_dir = os.path.expanduser("~/.openclaw/workspace/财报速读")
        os.makedirs(self.output_dir, exist_ok=True)
    
    def read_earnings_summary(self, symbol):
        """
        读取财报摘要
        """
        try:
            stock = yf.Ticker(symbol)
            
            # 获取财报日期
            calendar = stock.calendar
            earnings_date = calendar.index[0] if calendar is not None and not calendar.empty else None
            
            # 获取财务数据
            financials = stock.financials
            
            if financials is not None and not financials.empty:
                revenue = financials.loc['Total Revenue'].iloc[0] if 'Total Revenue' in financials.index else 0
                net_income = financials.loc['Net Income'].iloc[0] if 'Net Income' in financials.index else 0
            else:
                revenue = 0
                net_income = 0
            
            # 获取分析师预期（简化）
            info = stock.info
            target_price = info.get('targetMeanPrice', 0)
            
            return {
                'symbol': symbol,
                'earnings_date': earnings_date.strftime('%Y-%m-%d') if earnings_date else 'N/A',
                'revenue': revenue / 1e9 if revenue else 0,  # 转换为十亿
                'net_income': net_income / 1e9 if net_income else 0,
                'target_price': target_price
            }
            
        except Exception as e:
            print(f"⚠️  读取{symbol}财报失败: {e}")
            return None
    
    def analyze_earnings(self, symbol):
        """
        分析财报
        """
        data = self.read_earnings_summary(symbol)
        if not data:
            return None
        
        # 简单分析
        analysis = {
            'symbol': data['symbol'],
            'revenue_billions': data['revenue'],
            'net_income_billions': data['net_income'],
            'target_price': data['target_price']
        }
        
        # 判断（简化版）
        if data['net_income'] > 0:
            analysis['verdict'] = "🟢 盈利"
        else:
            analysis['verdict'] = "🔴 亏损"
        
        return analysis
    
    def generate_report(self, symbols):
        """
        生成财报速读报告
        """
        print("🦐 财报速读报告")
        print("=" * 70)
        
        for symbol in symbols:
            print(f"\n📄 {symbol}:")
            analysis = self.analyze_earnings(symbol)
            if analysis:
                print(f"   营收: ${analysis['revenue_billions']:.2f}B")
                print(f"   净利: ${analysis['net_income_billions']:.2f}B")
                print(f"   目标价: ${analysis['target_price']:.2f}")
                print(f"   判断: {analysis['verdict']}")


def main():
    """主函数"""
    reader = EarningsReader()
    symbols = ['AAPL', 'MSFT', 'NVDA', 'TSLA']
    reader.generate_report(symbols)


if __name__ == "__main__":
    main()
