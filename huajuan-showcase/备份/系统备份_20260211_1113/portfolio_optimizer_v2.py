#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
投资组合优化器 v2 - Portfolio Optimizer v2
作者：虾虾
创建时间：2026-02-09
用途：现代投资组合理论(MPT)、相关性分析、最优仓位计算、组合VaR风险值
"""

import os
import sys
import json
import yfinance as yf
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from typing import List, Dict, Optional, Tuple


class PortfolioOptimizerV2:
    """
    投资组合优化器 v2
    
    功能：
    1. 现代投资组合理论（MPT）- 均值方差优化
    2. 相关性分析 - 避免风险集中
    3. 最优仓位计算（凯利公式/风险平价）
    4. 组合VaR风险值
    
    核心思想：单只股票好，但组合起来可能风险过高！
    """
    
    def __init__(self):
        self.data_dir = os.path.expanduser("~/.openclaw/workspace/组合优化数据")
        os.makedirs(self.data_dir, exist_ok=True)
        
        # 无风险利率（年化，假设2%）
        self.risk_free_rate = 0.02
        
        print("🦐 投资组合优化器 v2 启动")
        print("📊 基于现代投资组合理论(MPT)优化配置")
        print("="*70)
    
    def fetch_price_data(self, symbols: List[str], period: str = "1y") -> pd.DataFrame:
        """
        获取价格数据
        
        Returns:
            DataFrame with daily returns
        """
        print(f"\n📊 获取 {len(symbols)} 只股票数据...")
        
        all_data = {}
        for symbol in symbols:
            try:
                ticker = yf.Ticker(symbol)
                hist = ticker.history(period=period)
                if not hist.empty:
                    all_data[symbol] = hist['Close']
            except Exception as e:
                print(f"  ⚠️ 获取{symbol}失败: {e}")
        
        if not all_data:
            return pd.DataFrame()
        
        df = pd.DataFrame(all_data)
        return df
    
    def calculate_returns(self, prices: pd.DataFrame) -> pd.DataFrame:
        """计算日收益率"""
        returns = prices.pct_change().dropna()
        return returns
    
    def calculate_statistics(self, returns: pd.DataFrame) -> Dict:
        """
        计算收益统计
        
        Returns:
            均值、协方差矩阵等
        """
        # 年化均值收益
        mean_returns = returns.mean() * 252
        
        # 年化协方差矩阵
        cov_matrix = returns.cov() * 252
        
        # 年化波动率
        volatility = returns.std() * np.sqrt(252)
        
        return {
            'mean_returns': mean_returns,
            'cov_matrix': cov_matrix,
            'volatility': volatility
        }
    
    def optimize_mpt(self, symbols: List[str], target_return: Optional[float] = None) -> Dict:
        """
        均值方差优化（Modern Portfolio Theory）
        
        Args:
            symbols: 股票列表
            target_return: 目标收益率（可选，默认最大化夏普比率）
        
        Returns:
            最优权重配置
        """
        print(f"\n🎯 执行MPT优化...")
        
        # 获取数据
        prices = self.fetch_price_data(symbols)
        if prices.empty:
            return {'error': '数据不足'}
        
        returns = self.calculate_returns(prices)
        stats = self.calculate_statistics(returns)
        
        mean_returns = stats['mean_returns']
        cov_matrix = stats['cov_matrix']
        
        num_assets = len(symbols)
        
        # 模拟不同权重组合
        num_portfolios = 10000
        results = np.zeros((3, num_portfolios))
        weights_record = []
        
        np.random.seed(42)
        
        for i in range(num_portfolios):
            # 随机权重
            weights = np.random.random(num_assets)
            weights /= np.sum(weights)
            weights_record.append(weights)
            
            # 组合收益
            portfolio_return = np.dot(weights, mean_returns)
            
            # 组合风险
            portfolio_std = np.sqrt(np.dot(weights.T, np.dot(cov_matrix, weights)))
            
            # 夏普比率
            sharpe = (portfolio_return - self.risk_free_rate) / portfolio_std if portfolio_std > 0 else 0
            
            results[0, i] = portfolio_return
            results[1, i] = portfolio_std
            results[2, i] = sharpe
        
        # 找到最优组合（最大夏普比率）
        max_sharpe_idx = np.argmax(results[2])
        max_sharpe_weights = weights_record[max_sharpe_idx]
        
        # 找到最小风险组合
        min_vol_idx = np.argmin(results[1])
        min_vol_weights = weights_record[min_vol_idx]
        
        # 组装结果
        optimal_weights = {}
        for i, symbol in enumerate(symbols):
            optimal_weights[symbol] = {
                'max_sharpe': round(max_sharpe_weights[i] * 100, 2),
                'min_volatility': round(min_vol_weights[i] * 100, 2)
            }
        
        return {
            'optimal_weights': optimal_weights,
            'max_sharpe_portfolio': {
                'expected_return': round(results[0, max_sharpe_idx] * 100, 2),
                'volatility': round(results[1, max_sharpe_idx] * 100, 2),
                'sharpe_ratio': round(results[2, max_sharpe_idx], 2)
            },
            'min_volatility_portfolio': {
                'expected_return': round(results[0, min_vol_idx] * 100, 2),
                'volatility': round(results[1, min_vol_idx] * 100, 2),
                'sharpe_ratio': round(results[2, min_vol_idx], 2)
            }
        }
    
    def calculate_correlation_matrix(self, symbols: List[str]) -> pd.DataFrame:
        """
        计算相关性矩阵
        
        Returns:
            相关性矩阵
        """
        print(f"\n📊 计算相关性矩阵...")
        
        prices = self.fetch_price_data(symbols)
        if prices.empty:
            return pd.DataFrame()
        
        returns = self.calculate_returns(prices)
        corr_matrix = returns.corr()
        
        return corr_matrix
    
    def calculate_portfolio_var(self, symbols: List[str], weights: List[float], 
                                confidence: float = 0.95) -> Dict:
        """
        计算组合VaR (Value at Risk)
        
        Args:
            symbols: 股票列表
            weights: 权重列表
            confidence: 置信度（默认95%）
        
        Returns:
            VaR值
        """
        print(f"\n📉 计算组合VaR...")
        
        prices = self.fetch_price_data(symbols)
        if prices.empty:
            return {'error': '数据不足'}
        
        returns = self.calculate_returns(prices)
        
        # 组合收益
        portfolio_returns = returns.dot(weights)
        
        # VaR计算
        var_95 = np.percentile(portfolio_returns, (1 - confidence) * 100)
        var_99 = np.percentile(portfolio_returns, 1)
        
        # 预期组合收益和风险
        portfolio_mean = portfolio_returns.mean() * 252
        portfolio_std = portfolio_returns.std() * np.sqrt(252)
        
        return {
            'var_95_daily': round(var_95 * 100, 2),  # 日VaR 95%
            'var_99_daily': round(var_99 * 100, 2),  # 日VaR 99%
            'var_95_annual': round(var_95 * np.sqrt(252) * 100, 2),  # 年化VaR 95%
            'portfolio_expected_return': round(portfolio_mean * 100, 2),
            'portfolio_volatility': round(portfolio_std * 100, 2),
            'interpretation': f'日内有{confidence*100}%概率亏损不超过{abs(var_95)*100:.2f}%'
        }
    
    def kelly_criterion(self, win_rate: float, avg_win: float, avg_loss: float) -> float:
        """
        凯利公式计算最优仓位
        
        f* = (p * b - q) / b
        
        其中：
        - p: 胜率
        - q: 败率 = 1 - p
        - b: 盈亏比 = 平均盈利/平均亏损
        """
        if avg_loss == 0:
            return 0
        
        b = avg_win / avg_loss  # 盈亏比
        q = 1 - win_rate
        
        kelly = (win_rate * b - q) / b
        
        # 限制在0-1之间
        return max(0, min(1, kelly))
    
    def risk_parity_weights(self, symbols: List[str]) -> Dict:
        """
        风险平价权重
        
        每个资产对组合风险贡献相等
        """
        print(f"\n⚖️ 计算风险平价权重...")
        
        prices = self.fetch_price_data(symbols)
        if prices.empty:
            return {}
        
        returns = self.calculate_returns(prices)
        volatilities = returns.std() * np.sqrt(252)
        
        # 简化版风险平价：按波动率倒数加权
        inv_vol = 1 / volatilities
        weights = inv_vol / inv_vol.sum()
        
        result = {}
        for i, symbol in enumerate(symbols):
            result[symbol] = round(weights.iloc[i] * 100, 2)
        
        return result
    
    def generate_optimization_report(self, symbols: List[str]) -> Dict:
        """
        生成组合优化报告
        """
        print(f"\n📊 生成组合优化报告")
        print("="*70)
        
        # MPT优化
        mpt_result = self.optimize_mpt(symbols)
        
        # 相关性矩阵
        corr_matrix = self.calculate_correlation_matrix(symbols)
        
        # 风险平价
        risk_parity = self.risk_parity_weights(symbols)
        
        # 示例VaR计算（等权重）
        equal_weights = [1/len(symbols)] * len(symbols)
        var_result = self.calculate_portfolio_var(symbols, equal_weights)
        
        result = {
            'symbols': symbols,
            'timestamp': datetime.now().isoformat(),
            'mpt_optimization': mpt_result,
            'correlation_matrix': corr_matrix.to_dict(),
            'risk_parity_weights': risk_parity,
            'portfolio_var': var_result
        }
        
        return result
    
    def print_report(self, result: Dict):
        """打印报告"""
        print("\n" + "="*70)
        print("📊 投资组合优化报告")
        print("="*70)
        
        symbols = result['symbols']
        
        # MPT优化结果
        if 'mpt_optimization' in result and 'optimal_weights' in result['mpt_optimization']:
            mpt = result['mpt_optimization']
            
            print(f"\n🎯 MPT最优配置（最大夏普比率）:")
            print("-"*70)
            for symbol in symbols:
                weight = mpt['optimal_weights'][symbol]['max_sharpe']
                print(f"  {symbol}: {weight}%")
            
            max_sharpe = mpt.get('max_sharpe_portfolio', {})
            print(f"\n  预期年化收益: {max_sharpe.get('expected_return', 0)}%")
            print(f"  预期波动率: {max_sharpe.get('volatility', 0)}%")
            print(f"  夏普比率: {max_sharpe.get('sharpe_ratio', 0)}")
        
        # 风险平价
        if 'risk_parity_weights' in result:
            print(f"\n⚖️ 风险平价配置:")
            print("-"*70)
            for symbol, weight in result['risk_parity_weights'].items():
                print(f"  {symbol}: {weight}%")
        
        # VaR
        if 'portfolio_var' in result:
            var = result['portfolio_var']
            print(f"\n📉 组合风险(VaR):")
            print("-"*70)
            print(f"  日VaR 95%: {var.get('var_95_daily', 0)}%")
            print(f"  {var.get('interpretation', '')}")
        
        # 投资建议
        print(f"\n💡 组合优化建议:")
        print("-"*70)
        print("  1. 避免相关性过高的股票同时重仓")
        print("  2. 根据风险承受能力选择配置方案")
        print("  3. 定期再平衡，维持目标权重")
        print("  4. 关注组合VaR，控制总风险")
        
        print("="*70)


def main():
    """主函数"""
    import argparse
    
    parser = argparse.ArgumentParser(
        description='虾虾投资组合优化器 v2',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
使用示例:
  # 优化投资组合
  python3 portfolio_optimizer_v2.py --symbols NVDA AMD TSLA
        """
    )
    
    parser.add_argument('--symbols', '-s', nargs='+', required=True,
                       help='股票列表')
    
    args = parser.parse_args()
    
    optimizer = PortfolioOptimizerV2()
    
    result = optimizer.generate_optimization_report(args.symbols)
    optimizer.print_report(result)


if __name__ == "__main__":
    main()
