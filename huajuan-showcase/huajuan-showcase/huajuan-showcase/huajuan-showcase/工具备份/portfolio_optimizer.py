#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
投资组合优化器 - Portfolio Optimizer
作者：虾虾
创建时间：2026-02-08
用途：基于现代投资组合理论优化资产配置
"""

import yfinance as yf
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import sys

try:
    import pypfopt
    from pypfopt import EfficientFrontier, risk_models, expected_returns, plotting
    from pypfopt.discrete_allocation import DiscreteAllocation, get_latest_prices
    PYPORTFOLIOOPT_AVAILABLE = True
except ImportError:
    PYPORTFOLIOOPT_AVAILABLE = False
    print("⚠️  pyportfolioopt未安装，使用基础优化方法")


class PortfolioOptimizer:
    """投资组合优化器"""
    
    def __init__(self, symbols, period="1y"):
        self.symbols = symbols
        self.period = period
        self.data = None
        self.returns = None
        self.mean_returns = None
        self.cov_matrix = None
        
    def fetch_data(self):
        """获取股票数据"""
        print(f"🦐 获取 {len(self.symbols)} 只股票的历史数据...")
        
        data = {}
        for symbol in self.symbols:
            try:
                stock = yf.Ticker(symbol)
                hist = stock.history(period=self.period)
                if not hist.empty:
                    data[symbol] = hist['Close']
                    print(f"  ✅ {symbol}")
                else:
                    print(f"  ❌ {symbol}: 无数据")
            except Exception as e:
                print(f"  ❌ {symbol}: {e}")
        
        if not data:
            raise ValueError("没有获取到任何股票数据")
        
        self.data = pd.DataFrame(data)
        self.data = self.data.dropna()  # 删除缺失值
        
        print(f"✅ 成功获取 {len(self.data.columns)} 只股票数据")
        print(f"   时间范围: {self.data.index[0].strftime('%Y-%m-%d')} 至 {self.data.index[-1].strftime('%Y-%m-%d')}")
        
        return self.data
    
    def calculate_returns(self):
        """计算收益率"""
        self.returns = self.data.pct_change().dropna()
        self.mean_returns = self.returns.mean() * 252  # 年化收益率
        self.cov_matrix = self.returns.cov() * 252     # 年化协方差矩阵
        return self.returns
    
    def optimize_sharpe(self, risk_free_rate=0.02):
        """
        最大化夏普比率优化
        """
        print("\n🎯 优化策略：最大化夏普比率")
        
        if PYPORTFOLIOOPT_AVAILABLE:
            # 使用pyportfolioopt
            mu = expected_returns.mean_historical_return(self.data)
            S = risk_models.sample_cov(self.data)
            
            ef = EfficientFrontier(mu, S)
            ef.max_sharpe(risk_free_rate=risk_free_rate)
            weights = ef.clean_weights()
            
            performance = ef.portfolio_performance(verbose=False, risk_free_rate=risk_free_rate)
            
            return {
                'weights': weights,
                'expected_return': performance[0],
                'volatility': performance[1],
                'sharpe_ratio': performance[2]
            }
        else:
            # 基础优化方法
            return self._basic_optimize('sharpe', risk_free_rate)
    
    def minimize_volatility(self):
        """
        最小化波动率优化
        """
        print("\n🎯 优化策略：最小化波动率")
        
        if PYPORTFOLIOOPT_AVAILABLE:
            mu = expected_returns.mean_historical_return(self.data)
            S = risk_models.sample_cov(self.data)
            
            ef = EfficientFrontier(mu, S)
            ef.min_volatility()
            weights = ef.clean_weights()
            
            performance = ef.portfolio_performance(verbose=False)
            
            return {
                'weights': weights,
                'expected_return': performance[0],
                'volatility': performance[1],
                'sharpe_ratio': performance[2]
            }
        else:
            return self._basic_optimize('min_vol')
    
    def optimize_return(self, target_volatility=0.2):
        """
        目标波动率下的收益最大化
        """
        print(f"\n🎯 优化策略：目标波动率 {target_volatility*100}% 下的收益最大化")
        
        if PYPORTFOLIOOPT_AVAILABLE:
            mu = expected_returns.mean_historical_return(self.data)
            S = risk_models.sample_cov(self.data)
            
            ef = EfficientFrontier(mu, S)
            ef.efficient_return(target_volatility)
            weights = ef.clean_weights()
            
            performance = ef.portfolio_performance(verbose=False)
            
            return {
                'weights': weights,
                'expected_return': performance[0],
                'volatility': performance[1],
                'sharpe_ratio': performance[2]
            }
        else:
            return self._basic_optimize('target_return', target_volatility)
    
    def _basic_optimize(self, method, param=None):
        """基础优化方法（无pyportfolioopt时使用）"""
        n_assets = len(self.symbols)
        
        if method == 'sharpe':
            # 简单的等权重作为基准
            weights = np.array([1/n_assets] * n_assets)
        elif method == 'min_vol':
            # 基于波动率的逆权重
            vols = self.returns.std() * np.sqrt(252)
            weights = 1 / vols
            weights = weights / weights.sum()
        else:
            weights = np.array([1/n_assets] * n_assets)
        
        # 计算组合表现
        portfolio_return = np.dot(weights, self.mean_returns)
        portfolio_vol = np.sqrt(np.dot(weights.T, np.dot(self.cov_matrix, weights)))
        sharpe = (portfolio_return - 0.02) / portfolio_vol if portfolio_vol > 0 else 0
        
        return {
            'weights': dict(zip(self.symbols, weights)),
            'expected_return': portfolio_return,
            'volatility': portfolio_vol,
            'sharpe_ratio': sharpe
        }
    
    def generate_efficient_frontier(self, num_portfolios=100):
        """
        生成有效前沿
        """
        print("\n📈 生成有效前沿...")
        
        target_returns = np.linspace(self.mean_returns.min(), self.mean_returns.max(), num_portfolios)
        efficient_portfolios = []
        
        for target in target_returns:
            try:
                if PYPORTFOLIOOPT_AVAILABLE:
                    mu = expected_returns.mean_historical_return(self.data)
                    S = risk_models.sample_cov(self.data)
                    ef = EfficientFrontier(mu, S)
                    ef.efficient_return(target)
                    weights = ef.clean_weights()
                    perf = ef.portfolio_performance(verbose=False)
                    
                    efficient_portfolios.append({
                        'return': perf[0],
                        'volatility': perf[1],
                        'sharpe': perf[2],
                        'weights': weights
                    })
            except:
                pass
        
        return efficient_portfolios
    
    def print_optimization_results(self, result, total_value=100000):
        """
        打印优化结果
        """
        print("\n" + "=" * 60)
        print("📊 投资组合优化结果")
        print("=" * 60)
        
        print("\n💼 最优资产配置：")
        print("-" * 60)
        weights = result['weights']
        sorted_weights = sorted(weights.items(), key=lambda x: x[1], reverse=True)
        
        for symbol, weight in sorted_weights:
            if weight > 0.001:  # 只显示权重大于0.1%的
                allocation = total_value * weight
                print(f"  {symbol:6s}: {weight*100:6.2f}%  (${allocation:,.0f})")
        
        print("-" * 60)
        print(f"\n📈 预期年化收益率: {result['expected_return']*100:.2f}%")
        print(f"📉 预期年化波动率: {result['volatility']*100:.2f}%")
        print(f"🎯 夏普比率: {result['sharpe_ratio']:.2f}")
        
        # 风险评估
        if result['volatility'] < 0.15:
            risk_level = "低风险"
        elif result['volatility'] < 0.25:
            risk_level = "中等风险"
        else:
            risk_level = "高风险"
        
        print(f"⚠️  风险等级: {risk_level}")
        print("=" * 60)
    
    def compare_strategies(self, total_value=100000):
        """
        对比不同优化策略
        """
        print("\n" + "=" * 60)
        print("🔄 对比不同优化策略")
        print("=" * 60)
        
        strategies = {
            '等权重': {'method': 'equal', 'result': self._equal_weights()},
            '最大夏普': self.optimize_sharpe(),
            '最小波动': self.minimize_volatility(),
        }
        
        print("\n策略对比：")
        print("-" * 60)
        print(f"{'策略':<12} {'预期收益':>10} {'波动率':>10} {'夏普比率':>10} {'风险等级':>10}")
        print("-" * 60)
        
        for name, data in strategies.items():
            if 'result' in data:
                data = data['result']
            
            ret = data['expected_return'] * 100
            vol = data['volatility'] * 100
            sharpe = data['sharpe_ratio']
            
            if data['volatility'] < 0.15:
                risk = "低风险"
            elif data['volatility'] < 0.25:
                risk = "中风险"
            else:
                risk = "高风险"
            
            print(f"{name:<12} {ret:>9.2f}% {vol:>9.2f}% {sharpe:>10.2f} {risk:>10}")
        
        print("-" * 60)
    
    def _equal_weights(self):
        """等权重组合"""
        n = len(self.symbols)
        weights = {symbol: 1/n for symbol in self.symbols}
        
        w = np.array([1/n] * n)
        portfolio_return = np.dot(w, self.mean_returns)
        portfolio_vol = np.sqrt(np.dot(w.T, np.dot(self.cov_matrix, w)))
        sharpe = (portfolio_return - 0.02) / portfolio_vol if portfolio_vol > 0 else 0
        
        return {
            'weights': weights,
            'expected_return': portfolio_return,
            'volatility': portfolio_vol,
            'sharpe_ratio': sharpe
        }


def main():
    """主函数"""
    if len(sys.argv) < 3:
        print("🦐 投资组合优化器使用说明：")
        print("=" * 60)
        print("用法: python portfolio_optimizer.py <策略> <股票1> <股票2> ... <股票N>")
        print("\n可用策略：")
        print("  - sharpe: 最大化夏普比率")
        print("  - min_vol: 最小化波动率")
        print("  - target: 目标波动率优化")
        print("  - compare: 对比所有策略")
        print("\n示例:")
        print("  python portfolio_optimizer.py sharpe AAPL MSFT GOOGL NVDA AMZN")
        print("  python portfolio_optimizer.py compare TSM NVDA AMD INTC QCOM")
        sys.exit(1)
    
    strategy = sys.argv[1]
    symbols = sys.argv[2:]
    
    if len(symbols) < 2:
        print("❌ 至少需要2只股票进行组合优化")
        sys.exit(1)
    
    try:
        # 创建优化器
        optimizer = PortfolioOptimizer(symbols)
        optimizer.fetch_data()
        optimizer.calculate_returns()
        
        if strategy == 'sharpe':
            result = optimizer.optimize_sharpe()
            optimizer.print_optimization_results(result)
        
        elif strategy == 'min_vol':
            result = optimizer.minimize_volatility()
            optimizer.print_optimization_results(result)
        
        elif strategy == 'target':
            result = optimizer.optimize_return(target_volatility=0.20)
            optimizer.print_optimization_results(result)
        
        elif strategy == 'compare':
            optimizer.compare_strategies()
        
        else:
            print(f"❌ 未知策略: {strategy}")
            print("可用策略: sharpe, min_vol, target, compare")
    
    except Exception as e:
        print(f"❌ 错误: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    main()
