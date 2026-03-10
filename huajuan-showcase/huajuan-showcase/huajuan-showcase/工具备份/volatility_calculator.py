#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
波动率计算器 - Volatility Calculator
作者：虾虾
创建时间：2026-02-08
用途：计算股票的历史波动率、预测波动率，评估风险
"""

import yfinance as yf
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from scipy import stats
import sys


class VolatilityCalculator:
    """波动率计算器"""
    
    def __init__(self, symbol, period="1y"):
        self.symbol = symbol
        self.period = period
        self.data = None
        self.returns = None
        
    def fetch_data(self):
        """获取股票数据"""
        try:
            stock = yf.Ticker(self.symbol)
            self.data = stock.history(period=self.period)
            if self.data.empty:
                raise ValueError(f"无法获取{self.symbol}的数据")
            
            # 计算日收益率
            self.returns = self.data['Close'].pct_change().dropna()
            
            print(f"✅ 获取{self.symbol}数据成功")
            print(f"   时间范围: {self.data.index[0].strftime('%Y-%m-%d')} 至 {self.data.index[-1].strftime('%Y-%m-%d')}")
            print(f"   数据点: {len(self.data)} 天")
            return True
        except Exception as e:
            print(f"❌ 获取{self.symbol}数据失败: {e}")
            return False
    
    def calculate_historical_volatility(self, windows=[20, 60, 120, 252]):
        """
        计算历史波动率
        windows: 不同时间窗口（交易日）
        """
        volatilities = {}
        
        for window in windows:
            if len(self.returns) >= window:
                # 滚动波动率（年化）
                rolling_vol = self.returns.rolling(window=window).std() * np.sqrt(252)
                current_vol = rolling_vol.iloc[-1]
                avg_vol = rolling_vol.mean()
                
                volatilities[f'{window}D'] = {
                    'current': current_vol,
                    'average': avg_vol,
                    'min': rolling_vol.min(),
                    'max': rolling_vol.max(),
                    'percentile': stats.percentileofscore(rolling_vol.dropna(), current_vol)
                }
        
        return volatilities
    
    def calculate_intraday_volatility(self):
        """计算日内波动率（使用High-Low）"""
        if self.data is None:
            return None
        
        # Parkinson波动率（使用日内高低点）
        hl_ratio = np.log(self.data['High'] / self.data['Low'])
        parkinson_vol = np.sqrt((hl_ratio**2).mean() / (4 * np.log(2))) * np.sqrt(252)
        
        # Garman-Klass波动率
        log_hl = np.log(self.data['High'] / self.data['Low'])**2
        log_co = np.log(self.data['Close'] / self.data['Open'])**2
        gk_vol = np.sqrt((0.5 * log_hl - (2*np.log(2)-1) * log_co).mean()) * np.sqrt(252)
        
        return {
            'parkinson': parkinson_vol,
            'garman_klass': gk_vol
        }
    
    def calculate_garch_estimate(self):
        """
        简单的GARCH-like波动率预测
        使用EWMA（指数加权移动平均）
        """
        if self.returns is None:
            return None
        
        # EWMA波动率
        lambda_param = 0.94  # RiskMetrics常用参数
        variance = self.returns.ewm(alpha=1-lambda_param).var()
        ewma_vol = np.sqrt(variance.iloc[-1]) * np.sqrt(252)
        
        return {
            'ewma_volatility': ewma_vol,
            'lambda': lambda_param
        }
    
    def calculate_volatility_regimes(self):
        """识别波动率状态（高/中/低）"""
        if self.returns is None:
            return None
        
        vol_20d = self.returns.rolling(window=20).std() * np.sqrt(252)
        current_vol = vol_20d.iloc[-1]
        
        # 历史分位数
        vol_history = vol_20d.dropna()
        percentile = stats.percentileofscore(vol_history, current_vol)
        
        if percentile >= 80:
            regime = "高波动"
            color = "🔴"
        elif percentile >= 50:
            regime = "中等波动"
            color = "🟡"
        else:
            regime = "低波动"
            color = "🟢"
        
        return {
            'current_volatility': current_vol,
            'percentile': percentile,
            'regime': regime,
            'color': color,
            'interpretation': self._interpret_regime(regime, percentile)
        }
    
    def _interpret_regime(self, regime, percentile):
        """解读波动率状态"""
        interpretations = {
            "高波动": f"当前处于高波动状态（历史{percentile:.0f}%分位），风险较高，适合期权卖方策略",
            "中等波动": f"当前处于中等波动状态（历史{percentile:.0f}%分位），风险适中",
            "低波动": f"当前处于低波动状态（历史{percentile:.0f}%分位），风险较低，可能酝酿突破"
        }
        return interpretations.get(regime, "未知状态")
    
    def calculate_volatility_skew(self):
        """计算波动率偏斜（隐含波动率微笑分析）"""
        # 这里使用历史数据模拟
        if self.returns is None:
            return None
        
        # 上行波动率 vs 下行波动率
        upside_returns = self.returns[self.returns > 0]
        downside_returns = self.returns[self.returns < 0]
        
        upside_vol = upside_returns.std() * np.sqrt(252) if len(upside_returns) > 0 else 0
        downside_vol = downside_returns.std() * np.sqrt(252) if len(downside_returns) > 0 else 0
        
        skew = downside_vol - upside_vol
        
        return {
            'upside_volatility': upside_vol,
            'downside_volatility': downside_vol,
            'skew': skew,
            'interpretation': "偏斜显著，存在尾部风险" if abs(skew) > 0.05 else "偏斜正常"
        }
    
    def get_volatility_cone(self, lookback_days=252):
        """
        生成波动率锥（历史波动率分布）
        """
        if self.returns is None or len(self.returns) < lookback_days:
            return None
        
        vol_20d = self.returns.rolling(window=20).std() * np.sqrt(252)
        vol_history = vol_20d.dropna()
        
        if len(vol_history) == 0:
            return None
        
        return {
            'current': vol_history.iloc[-1],
            'min': vol_history.min(),
            'max': vol_history.max(),
            'mean': vol_history.mean(),
            'median': vol_history.median(),
            'p10': np.percentile(vol_history, 10),
            'p25': np.percentile(vol_history, 25),
            'p75': np.percentile(vol_history, 75),
            'p90': np.percentile(vol_history, 90)
        }
    
    def compare_to_market(self, market_symbol='SPY'):
        """与市场基准比较波动率"""
        try:
            market = yf.Ticker(market_symbol)
            market_data = market.history(period=self.period)
            market_returns = market_data['Close'].pct_change().dropna()
            
            stock_vol = self.returns.std() * np.sqrt(252)
            market_vol = market_returns.std() * np.sqrt(252)
            
            beta_vol = stock_vol / market_vol if market_vol > 0 else 0
            
            return {
                'stock_volatility': stock_vol,
                'market_volatility': market_vol,
                'volatility_beta': beta_vol,
                'interpretation': f"股票波动率是市场的{beta_vol:.2f}倍"
            }
        except Exception as e:
            print(f"⚠️  市场比较失败: {e}")
            return None
    
    def print_report(self):
        """打印波动率分析报告"""
        print("\n" + "=" * 70)
        print(f"📊 {self.symbol} 波动率分析报告")
        print("=" * 70)
        
        current_price = self.data['Close'][-1]
        print(f"\n💰 当前价格: ${current_price:.2f}")
        
        # 1. 历史波动率
        hist_vols = self.calculate_historical_volatility()
        print(f"\n📈 历史波动率（年化）:")
        print("-" * 70)
        for period, data in hist_vols.items():
            print(f"   {period:6s}: 当前 {data['current']*100:5.1f}% | "
                  f"平均 {data['average']*100:5.1f}% | "
                  f"区间 [{data['min']*100:4.1f}%-{data['max']*100:4.1f}%] | "
                  f"分位 {data['percentile']:4.1f}%")
        
        # 2. 日内波动率
        intraday = self.calculate_intraday_volatility()
        if intraday:
            print(f"\n📊 日内波动率:")
            print("-" * 70)
            print(f"   Parkinson波动率: {intraday['parkinson']*100:.1f}%")
            print(f"   Garman-Klass波动率: {intraday['garman_klass']*100:.1f}%")
        
        # 3. 波动率状态
        regime = self.calculate_volatility_regimes()
        if regime:
            print(f"\n🎯 波动率状态:")
            print("-" * 70)
            print(f"   {regime['color']} {regime['regime']}")
            print(f"   20日波动率: {regime['current_volatility']*100:.1f}%")
            print(f"   历史分位: {regime['percentile']:.0f}%")
            print(f"   解读: {regime['interpretation']}")
        
        # 4. 波动率锥
        cone = self.get_volatility_cone()
        if cone:
            print(f"\n📐 波动率锥（历史分布）:")
            print("-" * 70)
            print(f"   当前: {cone['current']*100:.1f}%")
            print(f"   最小: {cone['min']*100:.1f}%")
            print(f"   最大: {cone['max']*100:.1f}%")
            print(f"   中位数: {cone['median']*100:.1f}%")
            print(f"   10%-90%区间: [{cone['p10']*100:.1f}%, {cone['p90']*100:.1f}%]")
        
        # 5. 与市场比较
        market_comp = self.compare_to_market()
        if market_comp:
            print(f"\n📊 与市场基准(SPY)比较:")
            print("-" * 70)
            print(f"   股票波动率: {market_comp['stock_volatility']*100:.1f}%")
            print(f"   市场波动率: {market_comp['market_volatility']*100:.1f}%")
            print(f"   相对波动: {market_comp['volatility_beta']:.2f}x")
            print(f"   {market_comp['interpretation']}")
        
        # 6. 波动率偏斜
        skew = self.calculate_volatility_skew()
        if skew:
            print(f"\n⚖️ 波动率偏斜:")
            print("-" * 70)
            print(f"   上行波动率: {skew['upside_volatility']*100:.1f}%")
            print(f"   下行波动率: {skew['downside_volatility']*100:.1f}%")
            print(f"   偏斜: {skew['skew']*100:.1f}%")
            print(f"   {skew['interpretation']}")
        
        # 7. 投资建议
        print(f"\n💡 投资建议:")
        print("-" * 70)
        if regime['regime'] == "高波动":
            print("   • 适合：期权卖方策略（Sell Strangle/Iron Condor）")
            print("   • 谨慎：方向性交易，因价格波动大")
            print("   • 建议：缩小仓位，严格止损")
        elif regime['regime'] == "低波动":
            print("   • 适合：Long Vega策略（买入期权）")
            print("   • 注意：可能酝酿大行情突破")
            print("   • 建议：准备应对波动率扩张")
        else:
            print("   • 适合：正常交易策略")
            print("   • 建议：标准仓位管理")
        
        print("=" * 70)


def compare_volatilities(symbols):
    """比较多只股票的波动率"""
    print(f"\n🦐 比较 {len(symbols)} 只股票的波动率...")
    print("=" * 70)
    
    results = []
    
    for symbol in symbols:
        calc = VolatilityCalculator(symbol)
        if calc.fetch_data():
            vol_20d = calc.returns.rolling(window=20).std().iloc[-1] * np.sqrt(252)
            vol_annual = calc.returns.std() * np.sqrt(252)
            regime = calc.calculate_volatility_regimes()
            
            results.append({
                'symbol': symbol,
                'vol_20d': vol_20d,
                'vol_annual': vol_annual,
                'regime': regime['regime'] if regime else 'Unknown'
            })
    
    # 排序
    results.sort(key=lambda x: x['vol_20d'], reverse=True)
    
    print(f"\n{'股票':<8} {'20日波动率':>12} {'年化波动率':>12} {'状态':<10}")
    print("-" * 70)
    for r in results:
        print(f"{r['symbol']:<8} {r['vol_20d']*100:>11.1f}% {r['vol_annual']*100:>11.1f}% {r['regime']:<10}")
    
    print("=" * 70)


def main():
    """主函数"""
    if len(sys.argv) < 2:
        print("🦐 波动率计算器使用说明：")
        print("=" * 70)
        print("用法:")
        print("  单只股票: python volatility_calculator.py <股票代码>")
        print("  比较多只: python volatility_calculator.py --compare <股票1> <股票2> ...")
        print("\n示例:")
        print("  python volatility_calculator.py AAPL")
        print("  python volatility_calculator.py --compare AAPL TSLA NVDA AMD")
        sys.exit(1)
    
    if sys.argv[1] == '--compare':
        symbols = sys.argv[2:]
        compare_volatilities(symbols)
    else:
        symbol = sys.argv[1]
        calc = VolatilityCalculator(symbol)
        if calc.fetch_data():
            calc.print_report()


if __name__ == "__main__":
    main()
