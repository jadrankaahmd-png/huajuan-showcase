#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
风险计算器 - Risk Calculator
作者：虾虾
创建时间：2026-02-08
用途：计算投资组合的各种风险指标
"""

import yfinance as yf
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from scipy import stats
import sys


class RiskCalculator:
    """风险计算器类"""
    
    def __init__(self, symbols, weights=None, period="1y"):
        self.symbols = symbols
        self.weights = weights or [1/len(symbols)] * len(symbols)
        self.period = period
        self.data = None
        self.returns = None
        
    def fetch_data(self):
        """获取数据"""
        print(f"🦐 获取 {len(self.symbols)} 只股票数据...")
        
        data = {}
        for symbol in self.symbols:
            try:
                stock = yf.Ticker(symbol)
                hist = stock.history(period=self.period)
                if not hist.empty:
                    data[symbol] = hist['Close']
            except Exception as e:
                print(f"  ❌ {symbol}: {e}")
        
        self.data = pd.DataFrame(data)
        self.data = self.data.dropna()
        self.returns = self.data.pct_change().dropna()
        
        print(f"✅ 成功获取 {len(self.data.columns)} 只股票数据")
        return self.data
    
    def calculate_portfolio_returns(self):
        """计算组合收益率"""
        weights = np.array(self.weights)
        portfolio_returns = self.returns.dot(weights)
        return portfolio_returns
    
    def calculate_var(self, confidence_level=0.95):
        """
        计算Value at Risk (VaR)
        """
        portfolio_returns = self.calculate_portfolio_returns()
        
        # 历史模拟法
        var_hist = np.percentile(portfolio_returns, (1 - confidence_level) * 100)
        
        # 参数法（假设正态分布）
        mean = portfolio_returns.mean()
        std = portfolio_returns.std()
        var_param = stats.norm.ppf(1 - confidence_level, mean, std)
        
        return {
            'historical_var': var_hist,
            'parametric_var': var_param,
            'confidence_level': confidence_level
        }
    
    def calculate_cvar(self, confidence_level=0.95):
        """
        计算Conditional VaR (CVaR) / Expected Shortfall
        """
        portfolio_returns = self.calculate_portfolio_returns()
        var = np.percentile(portfolio_returns, (1 - confidence_level) * 100)
        cvar = portfolio_returns[portfolio_returns <= var].mean()
        
        return {
            'cvar': cvar,
            'var': var,
            'confidence_level': confidence_level
        }
    
    def calculate_drawdown(self):
        """
        计算最大回撤
        """
        portfolio_returns = self.calculate_portfolio_returns()
        cumulative = (1 + portfolio_returns).cumprod()
        running_max = cumulative.expanding().max()
        drawdown = (cumulative - running_max) / running_max
        
        max_drawdown = drawdown.min()
        max_drawdown_date = drawdown.idxmin()
        
        # 计算回撤持续时间
        is_drawdown = drawdown < 0
        drawdown_periods = []
        start_date = None
        
        for date, in_dd in is_drawdown.items():
            if in_dd and start_date is None:
                start_date = date
            elif not in_dd and start_date is not None:
                drawdown_periods.append((start_date, date))
                start_date = None
        
        max_dd_duration = 0
        if drawdown_periods:
            durations = [(end - start).days for start, end in drawdown_periods]
            max_dd_duration = max(durations)
        
        return {
            'max_drawdown': max_drawdown,
            'max_drawdown_date': max_drawdown_date,
            'max_drawdown_duration': max_dd_duration,
            'current_drawdown': drawdown.iloc[-1]
        }
    
    def calculate_sharpe_ratio(self, risk_free_rate=0.02):
        """
        计算夏普比率
        """
        portfolio_returns = self.calculate_portfolio_returns()
        excess_returns = portfolio_returns - risk_free_rate/252
        
        sharpe = np.sqrt(252) * excess_returns.mean() / portfolio_returns.std()
        
        return {
            'sharpe_ratio': sharpe,
            'annualized_return': portfolio_returns.mean() * 252,
            'annualized_volatility': portfolio_returns.std() * np.sqrt(252),
            'risk_free_rate': risk_free_rate
        }
    
    def calculate_sortino_ratio(self, risk_free_rate=0.02):
        """
        计算索提诺比率（只考虑下行风险）
        """
        portfolio_returns = self.calculate_portfolio_returns()
        excess_returns = portfolio_returns - risk_free_rate/252
        
        # 下行标准差
        downside_returns = portfolio_returns[portfolio_returns < 0]
        downside_std = downside_returns.std() * np.sqrt(252)
        
        sortino = (portfolio_returns.mean() * 252 - risk_free_rate) / downside_std if downside_std > 0 else 0
        
        return {
            'sortino_ratio': sortino,
            'downside_volatility': downside_std
        }
    
    def calculate_beta(self, market_symbol='SPY'):
        """
        计算Beta系数
        """
        try:
            market = yf.Ticker(market_symbol)
            market_data = market.history(period=self.period)
            market_returns = market_data['Close'].pct_change().dropna()
            
            portfolio_returns = self.calculate_portfolio_returns()
            
            # 对齐日期
            common_dates = portfolio_returns.index.intersection(market_returns.index)
            portfolio_aligned = portfolio_returns.loc[common_dates]
            market_aligned = market_returns.loc[common_dates]
            
            covariance = np.cov(portfolio_aligned, market_aligned)[0][1]
            market_variance = np.var(market_aligned)
            beta = covariance / market_variance if market_variance > 0 else 0
            
            # 计算Alpha
            portfolio_annual_return = portfolio_aligned.mean() * 252
            market_annual_return = market_aligned.mean() * 252
            alpha = portfolio_annual_return - (0.02 + beta * (market_annual_return - 0.02))
            
            return {
                'beta': beta,
                'alpha': alpha,
                'correlation': np.corrcoef(portfolio_aligned, market_aligned)[0][1]
            }
        except Exception as e:
            print(f"⚠️  Beta计算失败: {e}")
            return {'beta': None, 'alpha': None, 'correlation': None}
    
    def calculate_tail_risk(self):
        """
        计算尾部风险指标
        """
        portfolio_returns = self.calculate_portfolio_returns()
        
        # 峰度（Kurtosis）- 衡量极端风险
        kurtosis = stats.kurtosis(portfolio_returns)
        
        # 偏度（Skewness）- 衡量不对称性
        skewness = stats.skew(portfolio_returns)
        
        # 极值次数
        extreme_positive = (portfolio_returns > portfolio_returns.quantile(0.99)).sum()
        extreme_negative = (portfolio_returns < portfolio_returns.quantile(0.01)).sum()
        
        return {
            'kurtosis': kurtosis,
            'skewness': skewness,
            'extreme_positive_days': extreme_positive,
            'extreme_negative_days': extreme_negative,
            'tail_ratio': extreme_negative / extreme_positive if extreme_positive > 0 else 0
        }
    
    def stress_test(self, scenarios=None):
        """
        压力测试
        """
        if scenarios is None:
            scenarios = {
                '2008金融危机': -0.40,
                '2020疫情崩盘': -0.35,
                '2018Q4调整': -0.15,
                '温和下跌': -0.10,
                '黑天鹅事件': -0.50
            }
        
        portfolio_value = 100000  # 假设10万美元组合
        results = {}
        
        for scenario, drop in scenarios.items():
            loss = portfolio_value * drop
            remaining = portfolio_value + loss
            results[scenario] = {
                'portfolio_drop': f"{drop*100:.0f}%",
                'loss_amount': f"${loss:,.0f}",
                'remaining_value': f"${remaining:,.0f}"
            }
        
        return results
    
    def comprehensive_risk_report(self):
        """
        综合风险报告
        """
        print("\n" + "=" * 70)
        print("🦐 投资组合风险分析报告")
        print("=" * 70)
        
        print(f"\n📊 组合构成：")
        print("-" * 70)
        for symbol, weight in zip(self.symbols, self.weights):
            print(f"  {symbol:6s}: {weight*100:6.2f}%")
        
        # 1. 基础统计
        portfolio_returns = self.calculate_portfolio_returns()
        print(f"\n📈 收益统计：")
        print("-" * 70)
        print(f"  平均日收益: {portfolio_returns.mean()*100:.4f}%")
        print(f"  日收益标准差: {portfolio_returns.std()*100:.4f}%")
        print(f"  年化收益率: {portfolio_returns.mean()*252*100:.2f}%")
        print(f"  年化波动率: {portfolio_returns.std()*np.sqrt(252)*100:.2f}%")
        
        # 2. VaR & CVaR
        var_result = self.calculate_var(0.95)
        cvar_result = self.calculate_cvar(0.95)
        print(f"\n⚠️  Value at Risk (95%置信度)：")
        print("-" * 70)
        print(f"  日VaR (历史): {var_result['historical_var']*100:.2f}%")
        print(f"  日VaR (参数): {var_result['parametric_var']*100:.2f}%")
        print(f"  日CVaR: {cvar_result['cvar']*100:.2f}%")
        print(f"  说明: 每天有5%的概率亏损超过{abs(var_result['historical_var'])*100:.2f}%")
        
        # 3. 最大回撤
        dd_result = self.calculate_drawdown()
        print(f"\n📉 回撤分析：")
        print("-" * 70)
        print(f"  最大回撤: {dd_result['max_drawdown']*100:.2f}%")
        print(f"  回撤日期: {dd_result['max_drawdown_date'].strftime('%Y-%m-%d')}")
        print(f"  回撤持续时间: {dd_result['max_drawdown_duration']}天")
        print(f"  当前回撤: {dd_result['current_drawdown']*100:.2f}%")
        
        # 4. 风险调整收益
        sharpe = self.calculate_sharpe_ratio()
        sortino = self.calculate_sortino_ratio()
        print(f"\n🎯 风险调整收益：")
        print("-" * 70)
        print(f"  夏普比率: {sharpe['sharpe_ratio']:.2f}")
        print(f"  索提诺比率: {sortino['sortino_ratio']:.2f}")
        print(f"  下行波动率: {sortino['downside_volatility']*100:.2f}%")
        
        # 5. Beta & Alpha
        beta_result = self.calculate_beta()
        if beta_result['beta'] is not None:
            print(f"\n📊 市场相关性：")
            print("-" * 70)
            print(f"  Beta: {beta_result['beta']:.2f}")
            print(f"  Alpha: {beta_result['alpha']*100:.2f}%")
            print(f"  与市场相关性: {beta_result['correlation']:.2f}")
        
        # 6. 尾部风险
        tail = self.calculate_tail_risk()
        print(f"\n⚡ 尾部风险：")
        print("-" * 70)
        print(f"  峰度: {tail['kurtosis']:.2f} ({'高尾部风险' if tail['kurtosis'] > 3 else '正常'})")
        print(f"  偏度: {tail['skewness']:.2f} ({'左偏' if tail['skewness'] < 0 else '右偏'})")
        print(f"  极端下跌天数: {tail['extreme_negative_days']}")
        print(f"  极端上涨天数: {tail['extreme_positive_days']}")
        
        # 7. 压力测试
        stress = self.stress_test()
        print(f"\n🔥 压力测试（假设10万美元组合）：")
        print("-" * 70)
        for scenario, result in stress.items():
            print(f"  {scenario:15s}: {result['portfolio_drop']:>8s} → 损失{result['loss_amount']:>10s} → 剩余{result['remaining_value']:>10s}")
        
        # 8. 风险等级评估
        vol = sharpe['annualized_volatility']
        max_dd = abs(dd_result['max_drawdown'])
        
        if vol < 0.15 and max_dd < 0.20:
            risk_level = "🟢 低风险"
        elif vol < 0.25 and max_dd < 0.35:
            risk_level = "🟡 中等风险"
        else:
            risk_level = "🔴 高风险"
        
        print(f"\n🏆 综合风险评级：{risk_level}")
        print("=" * 70)


def main():
    """主函数"""
    if len(sys.argv) < 2:
        print("🦐 风险计算器使用说明：")
        print("=" * 70)
        print("用法: python risk_calculator.py <股票1> [股票2] ... [股票N] --weights [权重1] [权重2] ...")
        print("\n示例:")
        print("  python risk_calculator.py AAPL MSFT GOOGL")
        print("  python risk_calculator.py TSM NVDA AMD --weights 0.4 0.4 0.2")
        sys.exit(1)
    
    # 解析参数
    if '--weights' in sys.argv:
        idx = sys.argv.index('--weights')
        symbols = sys.argv[1:idx]
        weights = [float(w) for w in sys.argv[idx+1:]]
    else:
        symbols = sys.argv[1:]
        weights = None
    
    if weights and len(weights) != len(symbols):
        print("❌ 权重数量与股票数量不匹配")
        sys.exit(1)
    
    try:
        calculator = RiskCalculator(symbols, weights)
        calculator.fetch_data()
        calculator.comprehensive_risk_report()
    except Exception as e:
        print(f"❌ 错误: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    main()
