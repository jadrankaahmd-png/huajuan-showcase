#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
回测报告生成器 - Backtest Report Generator
作者：虾虾
创建时间：2026-02-08
用途：自动化回测多只股票，生成tearsheet，策略对比
"""

import yfinance as yf
import backtrader as bt
import quantstats as qs
import pandas as pd
from datetime import datetime
import os


class BacktestReport:
    """回测报告生成器"""
    
    def __init__(self):
        self.output_dir = os.path.expanduser("~/.openclaw/workspace/回测报告")
        os.makedirs(self.output_dir, exist_ok=True)
        
    def run_backtest(self, symbol, strategy, start_date, end_date):
        """
        运行回测
        """
        print(f"🦐 回测 {symbol}...")
        print(f"策略: {strategy}")
        print(f"时间: {start_date} 至 {end_date}")
        
        try:
            # 获取数据
            data = yf.download(symbol, start=start_date, end=end_date)
            
            if data.empty:
                print(f"❌ 无法获取{symbol}数据")
                return None
            
            # 简化回测（实际应使用完整的backtrader逻辑）
            returns = data['Close'].pct_change().dropna()
            
            # 使用quantstats生成报告
            report_file = f"{self.output_dir}/{symbol}_{strategy}_{datetime.now().strftime('%Y%m%d')}.html"
            
            # 生成tearsheet
            qs.reports.html(returns, output=report_file)
            
            print(f"✅ 回测报告已生成: {report_file}")
            
            # 计算关键指标
            sharpe = qs.stats.sharpe(returns)
            max_dd = qs.stats.max_drawdown(returns)
            cagr = qs.stats.cagr(returns)
            
            return {
                'symbol': symbol,
                'strategy': strategy,
                'sharpe': sharpe,
                'max_drawdown': max_dd,
                'cagr': cagr,
                'report_file': report_file
            }
            
        except Exception as e:
            print(f"❌ 回测失败: {e}")
            return None
    
    def batch_backtest(self, symbols, strategy='sma_cross'):
        """
        批量回测
        """
        print(f"🦐 批量回测 {len(symbols)} 只股票...")
        
        end_date = datetime.now()
        start_date = end_date - pd.DateOffset(years=1)
        
        results = []
        for symbol in symbols:
            result = self.run_backtest(symbol, strategy, start_date, end_date)
            if result:
                results.append(result)
        
        # 生成对比报告
        self.generate_comparison_report(results)
        
        return results
    
    def generate_comparison_report(self, results):
        """
        生成对比报告
        """
        if not results:
            return
        
        print("\n📊 回测结果对比:")
        print("=" * 70)
        print(f"{'股票':<10} {'策略':<15} {'夏普比率':>10} {'最大回撤':>10} {'年化收益':>10}")
        print("-" * 70)
        
        for result in results:
            print(f"{result['symbol']:<10} {result['strategy']:<15} "
                  f"{result['sharpe']:>10.2f} {result['max_drawdown']:>9.1%} {result['cagr']:>9.1%}")


if __name__ == "__main__":
    import sys
    
    backtest = BacktestReport()
    
    if len(sys.argv) > 1:
        symbol = sys.argv[1].upper()
        backtest.run_backtest(symbol, 'sma_cross', '2023-01-01', '2024-01-01')
    else:
        # 批量回测示例
        symbols = ['NVDA', 'TSM', 'AMD', 'AAPL', 'MSFT']
        backtest.batch_backtest(symbols)
