#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
智能选股器 - Smart Screener
作者：虾虾
创建时间：2026-02-08
用途：综合多因子选股（价值+成长+动量+质量），AI预测评分
"""

import yfinance as yf
import pandas as pd
import numpy as np
from datetime import datetime
import os


class SmartScreener:
    """智能选股器"""
    
    def __init__(self):
        self.output_dir = os.path.expanduser("~/.openclaw/workspace/选股结果")
        os.makedirs(self.output_dir, exist_ok=True)
        
        # 股票池
        self.universe = [
            'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META', 'NVDA', 'TSLA',
            'TSM', 'AMD', 'INTC', 'QCOM', 'AVGO', 'MU', 'SMCI',
            'JPM', 'BAC', 'GS', 'MS', 'WFC',
            'JNJ', 'PFE', 'UNH', 'ABBV', 'LLY',
            'XOM', 'CVX', 'COP', 'EOG',
            'WMT', 'COST', 'HD', 'LOW',
            'NFLX', 'DIS', 'CMCSA', 'VZ'
        ]
    
    def calculate_value_score(self, stock):
        """价值因子评分"""
        try:
            info = stock.info
            pe = info.get('trailingPE', 100)
            pb = info.get('priceToBook', 10)
            ps = info.get('priceToSalesTrailing12Months', 10)
            
            # PE评分 (越低越好)
            pe_score = max(0, min(100, (30 - pe) / 30 * 100))
            
            # PB评分 (越低越好)
            pb_score = max(0, min(100, (5 - pb) / 5 * 100))
            
            return (pe_score + pb_score) / 2
        except:
            return 50
    
    def calculate_growth_score(self, stock):
        """成长因子评分"""
        try:
            info = stock.info
            revenue_growth = info.get('revenueGrowth', 0) * 100
            earnings_growth = info.get('earningsGrowth', 0) * 100
            
            # 营收增长评分
            revenue_score = min(100, max(0, revenue_growth * 5))
            
            # 盈利增长评分
            earnings_score = min(100, max(0, earnings_growth * 5))
            
            return (revenue_score + earnings_score) / 2
        except:
            return 50
    
    def calculate_momentum_score(self, symbol):
        """动量因子评分"""
        try:
            hist = yf.Ticker(symbol).history(period="6mo")
            if len(hist) < 60:
                return 50
            
            # 20日涨幅
            ret_20d = (hist['Close'][-1] / hist['Close'][-20] - 1) * 100
            
            # 60日涨幅
            ret_60d = (hist['Close'][-1] / hist['Close'][-60] - 1) * 100
            
            # 综合评分
            momentum_score = min(100, max(0, (ret_20d + ret_60d / 3)))
            
            return momentum_score
        except:
            return 50
    
    def calculate_quality_score(self, stock):
        """质量因子评分"""
        try:
            info = stock.info
            roe = info.get('returnOnEquity', 0) * 100
            debt_to_equity = info.get('debtToEquity', 100)
            
            # ROE评分
            roe_score = min(100, max(0, roe * 2))
            
            # 负债率评分 (越低越好)
            debt_score = max(0, min(100, (100 - debt_to_equity)))
            
            return (roe_score + debt_score) / 2
        except:
            return 50
    
    def screen_stock(self, symbol):
        """筛选单个股票"""
        try:
            stock = yf.Ticker(symbol)
            
            value = self.calculate_value_score(stock)
            growth = self.calculate_growth_score(stock)
            momentum = self.calculate_momentum_score(symbol)
            quality = self.calculate_quality_score(stock)
            
            # 综合评分
            total_score = value * 0.25 + growth * 0.25 + momentum * 0.25 + quality * 0.25
            
            return {
                'symbol': symbol,
                'value': value,
                'growth': growth,
                'momentum': momentum,
                'quality': quality,
                'total_score': total_score
            }
        except Exception as e:
            return None
    
    def screen_all(self, top_n=20):
        """筛选所有股票"""
        print("🦐 智能选股器启动...")
        print("=" * 70)
        print(f"股票池: {len(self.universe)} 只股票")
        print("=" * 70)
        
        results = []
        
        for i, symbol in enumerate(self.universe, 1):
            print(f"\n[{i}/{len(self.universe)}] 分析 {symbol}...", end=" ")
            result = self.screen_stock(symbol)
            if result:
                results.append(result)
                print(f"评分: {result['total_score']:.1f}")
            else:
                print("失败")
        
        # 排序
        results.sort(key=lambda x: x['total_score'], reverse=True)
        
        return results[:top_n]
    
    def generate_report(self, results):
        """生成选股报告"""
        print("\n" + "=" * 70)
        print("🦐 智能选股报告")
        print(f"时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print("=" * 70)
        
        print(f"\n🏆 精选股票 (Top {len(results)}):")
        print("-" * 70)
        print(f"{'排名':<4} {'代码':<8} {'价值':>8} {'成长':>8} {'动量':>8} {'质量':>8} {'总分':>8}")
        print("-" * 70)
        
        for i, r in enumerate(results, 1):
            print(f"{i:<4} {r['symbol']:<8} {r['value']:>8.1f} {r['growth']:>8.1f} "
                  f"{r['momentum']:>8.1f} {r['quality']:>8.1f} {r['total_score']:>8.1f}")
        
        print("\n" + "=" * 70)
        print("✅ 选股完成！")


def main():
    """主函数"""
    screener = SmartScreener()
    results = screener.screen_all(top_n=20)
    screener.generate_report(results)


if __name__ == "__main__":
    main()
