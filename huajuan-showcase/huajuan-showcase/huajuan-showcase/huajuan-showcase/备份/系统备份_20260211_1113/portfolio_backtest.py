#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
组合回测器 - Portfolio Backtest
作者：虾虾
创建时间：2026-02-08
用途：完整组合历史回测，多策略对比，风险调整后收益分析
"""

import yfinance as yf
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import os


class PortfolioBacktest:
    """组合回测器"""
    
    def __init__(self):
        self.output_dir = os.path.expanduser("~/.openclaw/workspace/回测结果")
        os.makedirs(self.output_dir, exist_ok=True)
    
    def backtest_portfolio(self, symbols, weights, start_date, end_date, initial_value=100000):
        """
        回测组合
        """
        print(f"🦐 回测组合: {', '.join(symbols)}")
        print(f"时间: {start_date} 至 {end_date}")
        
        # 获取数据
        portfolio_data = []
        for symbol in symbols:
            try:
                stock = yf.Ticker(symbol)
                hist = stock.history(start=start_date, end=end_date)
                if not hist.empty:
                    portfolio_data.append({
                        'symbol': symbol,
                        'history': hist['Close']
                    })
            except:
                continue
        
        if not portfolio_data:
            return None
        
        # 计算组合收益
        portfolio_values = []
        dates = portfolio_data[0]['history'].index
        
        for date in dates:
            daily_value = 0
            for i, data in enumerate(portfolio_data):
                if date in data['history'].index:
                    price = data['history'][date]
                    weight = weights[i] if i < len(weights) else 1/len(portfolio_data)
                    daily_value += initial_value * weight * (price / data['history'].iloc[0])
            portfolio_values.append(daily_value)
        
        # 计算指标
        returns = pd.Series(portfolio_values).pct_change().dropna()
        
        total_return = (portfolio_values[-1] / portfolio_values[0] - 1) * 100
        annual_return = ((portfolio_values[-1] / portfolio_values[0]) ** (252 / len(returns)) - 1) * 100
        volatility = returns.std() * np.sqrt(252) * 100
        sharpe = (annual_return - 2) / volatility if volatility > 0 else 0
        
        # 最大回撤
        cumulative = pd.Series(portfolio_values)
        running_max = cumulative.expanding().max()
        drawdown = (cumulative - running_max) / running_max
        max_drawdown = drawdown.min() * 100
        
        return {
            'total_return': total_return,
            'annual_return': annual_return,
            'volatility': volatility,
            'sharpe': sharpe,
            'max_drawdown': max_drawdown,
            'portfolio_values': portfolio_values,
            'dates': dates
        }
    
    def compare_strategies(self):
        """
        对比不同策略
        """
        print("\n🦐 组合回测对比")
        print("=" * 70)
        
        end_date = datetime.now()
        start_date = end_date - timedelta(days=365)
        
        # 策略1: 科技成长
        tech_stocks = ['NVDA', 'AAPL', 'MSFT', 'GOOGL']
        tech_weights = [0.25, 0.25, 0.25, 0.25]
        
        # 策略2: 半导体
        semi_stocks = ['NVDA', 'TSM', 'AMD', 'QCOM']
        semi_weights = [0.25, 0.25, 0.25, 0.25]
        
        # 策略3: 均衡
        balanced_stocks = ['AAPL', 'MSFT', 'JPM', 'JNJ', 'XOM']
        balanced_weights = [0.2, 0.2, 0.2, 0.2, 0.2]
        
        strategies = [
            ('科技成长', tech_stocks, tech_weights),
            ('半导体', semi_stocks, semi_weights),
            ('均衡配置', balanced_stocks, balanced_weights)
        ]
        
        results = []
        
        for name, stocks, weights in strategies:
            print(f"\n📊 回测策略: {name}")
            result = self.backtest_portfolio(stocks, weights, start_date.strftime('%Y-%m-%d'), end_date.strftime('%Y-%m-%d'))
            if result:
                results.append((name, result))
        
        # 显示对比
        print("\n" + "=" * 70)
        print("📈 策略对比结果")
        print("=" * 70)
        print(f"{'策略':<15} {'总收益':>10} {'年化':>10} {'波动率':>10} {'夏普':>8} {'最大回撤':>10}")
        print("-" * 70)
        
        for name, result in results:
            print(f"{name:<15} {result['total_return']:>9.1f}% {result['annual_return']:>9.1f}% "
                  f"{result['volatility']:>9.1f}% {result['sharpe']:>8.2f} {result['max_drawdown']:>9.1f}%")
        
        print("\n" + "=" * 70)
        print("✅ 回测完成！")


def main():
    """主函数"""
    backtest = PortfolioBacktest()
    backtest.compare_strategies()


if __name__ == "__main__":
    main()
