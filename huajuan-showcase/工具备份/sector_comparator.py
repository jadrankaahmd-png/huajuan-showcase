#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
行业对比器 - Sector Comparator
作者：虾虾
创建时间：2026-02-08
用途：同行业公司对比，估值对比，成长性对比
"""

import yfinance as yf
import pandas as pd
from datetime import datetime


class SectorComparator:
    """行业对比器"""
    
    def __init__(self):
        # 同行业公司分组
        self.sectors = {
            '半导体': ['NVDA', 'AMD', 'INTC', 'QCOM', 'AVGO', 'TSM'],
            '科技': ['AAPL', 'MSFT', 'GOOGL', 'META', 'NFLX'],
            '金融': ['JPM', 'BAC', 'GS', 'MS', 'WFC'],
            '能源': ['XOM', 'CVX', 'COP', 'EOG']
        }
    
    def get_company_metrics(self, symbol):
        """
        获取公司指标
        """
        try:
            stock = yf.Ticker(symbol)
            info = stock.info
            
            return {
                'symbol': symbol,
                'pe': info.get('trailingPE', None),
                'pb': info.get('priceToBook', None),
                'ps': info.get('priceToSalesTrailing12Months', None),
                'market_cap': info.get('marketCap', 0) / 1e9,  # 十亿
                'revenue_growth': info.get('revenueGrowth', 0) * 100 if info.get('revenueGrowth') else 0,
                'profit_margin': info.get('profitMargins', 0) * 100 if info.get('profitMargins') else 0,
                'roe': info.get('returnOnEquity', 0) * 100 if info.get('returnOnEquity') else 0
            }
        except:
            return None
    
    def compare_sector(self, sector_name):
        """
        对比整个行业
        """
        print(f"\n🦐 {sector_name}行业对比")
        print("=" * 70)
        
        symbols = self.sectors.get(sector_name, [])
        if not symbols:
            print(f"❌ 未知行业: {sector_name}")
            return
        
        # 收集数据
        metrics = []
        for symbol in symbols:
            print(f"  获取 {symbol} 数据...")
            data = self.get_company_metrics(symbol)
            if data:
                metrics.append(data)
        
        if not metrics:
            print("❌ 无法获取数据")
            return
        
        # 创建对比表
        df = pd.DataFrame(metrics)
        
        print("\n📊 估值对比:")
        print("-" * 70)
        print(f"{'代码':<8} {'PE':>8} {'PB':>8} {'PS':>8} {'市值(B)':>10}")
        print("-" * 70)
        for _, row in df.iterrows():
            pe = f"{row['pe']:.1f}" if row['pe'] else 'N/A'
            pb = f"{row['pb']:.1f}" if row['pb'] else 'N/A'
            ps = f"{row['ps']:.1f}" if row['ps'] else 'N/A'
            print(f"{row['symbol']:<8} {pe:>8} {pb:>8} {ps:>8} {row['market_cap']:>10.1f}")
        
        print("\n📈 成长性对比:")
        print("-" * 70)
        print(f"{'代码':<8} {'营收增长':>10} {'利润率':>10} {'ROE':>8}")
        print("-" * 70)
        for _, row in df.iterrows():
            print(f"{row['symbol']:<8} {row['revenue_growth']:>9.1f}% {row['profit_margin']:>9.1f}% {row['roe']:>7.1f}%")
        
        # 排名
        print("\n🏆 综合排名:")
        df['score'] = (df['pe'].rank(ascending=True) + 
                       df['revenue_growth'].rank(ascending=False) +
                       df['roe'].rank(ascending=False))
        df = df.sort_values('score')
        
        for i, (_, row) in enumerate(df.iterrows(), 1):
            print(f"   {i}. {row['symbol']} (综合评分: {row['score']:.0f})")
        
        print("\n" + "=" * 70)


def main():
    """主函数"""
    comparator = SectorComparator()
    
    # 对比半导体行业
    comparator.compare_sector('半导体')
    
    # 对比科技行业
    comparator.compare_sector('科技')


if __name__ == "__main__":
    main()
