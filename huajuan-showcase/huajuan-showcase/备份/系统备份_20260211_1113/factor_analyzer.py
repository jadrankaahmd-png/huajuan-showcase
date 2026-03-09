#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
因子分析器 - Factor Analyzer
作者：虾虾
创建时间：2026-02-09
用途：Fama-French因子分析，多因子模型，因子暴露分析
"""

import yfinance as yf
import pandas as pd
import numpy as np
from datetime import datetime


class FactorAnalyzer:
    """因子分析器"""
    
    def __init__(self):
        # Fama-French 5因子
        self.factors = ['市值', '价值', '盈利', '投资', '动量']
    
    def calculate_factor_exposure(self, symbol):
        """
        计算因子暴露
        """
        try:
            stock = yf.Ticker(symbol)
            info = stock.info
            
            # 市值因子 (Size)
            market_cap = info.get('marketCap', 0)
            size_score = np.log(market_cap / 1e9) if market_cap > 0 else 0
            
            # 价值因子 (Value) - 使用PB倒数
            pb = info.get('priceToBook', 1)
            value_score = 1 / pb if pb > 0 else 0
            
            # 盈利因子 (Profitability)
            roe = info.get('returnOnEquity', 0) or 0
            profit_score = roe * 100
            
            # 动量因子 (Momentum)
            hist = stock.history(period="1y")
            if len(hist) > 20:
                momentum = (hist['Close'][-1] / hist['Close'][-20] - 1) * 100
            else:
                momentum = 0
            
            return {
                'symbol': symbol,
                'size': size_score,
                'value': value_score,
                'profitability': profit_score,
                'momentum': momentum
            }
            
        except Exception as e:
            print(f"⚠️  分析{symbol}失败: {e}")
            return None
    
    def analyze_portfolio_factors(self, symbols):
        """
        分析组合因子暴露
        """
        print("🦐 因子分析报告")
        print("=" * 70)
        print(f"时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print("=" * 70)
        
        exposures = []
        for symbol in symbols:
            exposure = self.calculate_factor_exposure(symbol)
            if exposure:
                exposures.append(exposure)
        
        if not exposures:
            print("❌ 无法获取数据")
            return
        
        # 计算平均因子暴露
        df = pd.DataFrame(exposures)
        
        print("\n📊 各股票因子暴露:")
        print("-" * 70)
        print(f"{'代码':<8} {'市值':>10} {'价值':>10} {'盈利':>10} {'动量':>10}")
        print("-" * 70)
        
        for _, row in df.iterrows():
            print(f"{row['symbol']:<8} {row['size']:>10.2f} {row['value']:>10.2f} "
                  f"{row['profitability']:>10.2f} {row['momentum']:>10.2f}")
        
        # 平均值
        print("-" * 70)
        print(f"{'平均':<8} {df['size'].mean():>10.2f} {df['value'].mean():>10.2f} "
              f"{df['profitability'].mean():>10.2f} {df['momentum'].mean():>10.2f}")
        
        print("\n💡 因子解读:")
        print("   • 市值: 正值=大盘股，负值=小盘股")
        print("   • 价值: 高值=价值股，低值=成长股")
        print("   • 盈利: 高值=高盈利质量")
        print("   • 动量: 正值=上涨动量强")
        
        print("\n" + "=" * 70)


def main():
    """主函数"""
    analyzer = FactorAnalyzer()
    symbols = ['AAPL', 'MSFT', 'NVDA', 'JPM', 'XOM']
    analyzer.analyze_portfolio_factors(symbols)


if __name__ == "__main__":
    main()
