#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
相关性矩阵生成器 - Correlation Matrix Generator
作者：虾虾
创建时间：2026-02-08
用途：分析多只股票的价格相关性，优化组合配置
"""

import yfinance as yf
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime, timedelta
import sys


class CorrelationMatrix:
    """相关性矩阵分析器"""
    
    def __init__(self, symbols, period="1y"):
        self.symbols = symbols
        self.period = period
        self.price_data = None
        self.returns_data = None
        self.correlation_matrix = None
        
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
                    print(f"  ⚠️  {symbol}: 无数据")
            except Exception as e:
                print(f"  ❌ {symbol}: {e}")
        
        if not data:
            raise ValueError("没有获取到任何股票数据")
        
        self.price_data = pd.DataFrame(data)
        self.price_data = self.price_data.dropna()
        
        # 计算日收益率
        self.returns_data = self.price_data.pct_change().dropna()
        
        print(f"\n✅ 成功获取 {len(self.price_data.columns)} 只股票数据")
        print(f"   时间范围: {self.price_data.index[0].strftime('%Y-%m-%d')} 至 {self.price_data.index[-1].strftime('%Y-%m-%d')}")
        print(f"   数据点: {len(self.price_data)} 天")
        
        return self.price_data
    
    def calculate_correlation(self):
        """计算相关性矩阵"""
        if self.returns_data is None:
            raise ValueError("请先获取数据")
        
        self.correlation_matrix = self.returns_data.corr()
        return self.correlation_matrix
    
    def find_high_correlations(self, threshold=0.8):
        """找出高相关性的股票对"""
        if self.correlation_matrix is None:
            self.calculate_correlation()
        
        high_corr_pairs = []
        
        for i in range(len(self.correlation_matrix.columns)):
            for j in range(i+1, len(self.correlation_matrix.columns)):
                corr = self.correlation_matrix.iloc[i, j]
                if abs(corr) >= threshold:
                    high_corr_pairs.append({
                        'stock1': self.correlation_matrix.columns[i],
                        'stock2': self.correlation_matrix.columns[j],
                        'correlation': corr
                    })
        
        # 按相关性排序
        high_corr_pairs.sort(key=lambda x: abs(x['correlation']), reverse=True)
        return high_corr_pairs
    
    def find_low_correlations(self, threshold=0.3):
        """找出低相关性的股票对（分散化效果好）"""
        if self.correlation_matrix is None:
            self.calculate_correlation()
        
        low_corr_pairs = []
        
        for i in range(len(self.correlation_matrix.columns)):
            for j in range(i+1, len(self.correlation_matrix.columns)):
                corr = self.correlation_matrix.iloc[i, j]
                if abs(corr) <= threshold:
                    low_corr_pairs.append({
                        'stock1': self.correlation_matrix.columns[i],
                        'stock2': self.correlation_matrix.columns[j],
                        'correlation': corr
                    })
        
        # 按相关性绝对值排序（从低到高）
        low_corr_pairs.sort(key=lambda x: abs(x['correlation']))
        return low_corr_pairs
    
    def get_diversification_score(self):
        """计算组合的分散化评分"""
        if self.correlation_matrix is None:
            self.calculate_correlation()
        
        # 计算平均相关性（排除对角线）
        mask = np.ones(self.correlation_matrix.shape, dtype=bool)
        np.fill_diagonal(mask, 0)
        avg_correlation = self.correlation_matrix.values[mask].mean()
        
        # 分散化评分 (0-100, 越高越好)
        diversification_score = (1 - avg_correlation) * 100
        
        return {
            'average_correlation': avg_correlation,
            'diversification_score': diversification_score,
            'interpretation': self._interpret_score(diversification_score)
        }
    
    def _interpret_score(self, score):
        """解读分散化评分"""
        if score >= 70:
            return "🟢 优秀 - 组合分散化程度高，风险分散良好"
        elif score >= 50:
            return "🟡 良好 - 组合有一定分散化，但仍有优化空间"
        elif score >= 30:
            return "🟠 一般 - 组合相关性较高，风险集中"
        else:
            return "🔴 较差 - 组合高度相关，急需优化"
    
    def suggest_optimization(self):
        """基于相关性给出优化建议"""
        if self.correlation_matrix is None:
            self.calculate_correlation()
        
        high_corr = self.find_high_correlations(threshold=0.8)
        low_corr = self.find_low_correlations(threshold=0.3)
        div_score = self.get_diversification_score()
        
        suggestions = []
        
        # 1. 高相关性问题
        if high_corr:
            suggestions.append({
                'type': 'warning',
                'title': '⚠️ 高相关性股票对（建议减仓或替换）',
                'details': high_corr[:5]  # 前5对
            })
        
        # 2. 低相关性优势
        if low_corr:
            suggestions.append({
                'type': 'good',
                'title': '✅ 低相关性股票对（分散化效果好）',
                'details': low_corr[:5]  # 前5对
            })
        
        # 3. 具体优化建议
        if div_score['diversification_score'] < 50:
            suggestions.append({
                'type': 'action',
                'title': '🎯 优化建议',
                'details': [
                    f"当前平均相关性: {div_score['average_correlation']:.2f}",
                    "建议:",
                    "1. 减少高度相关的股票持仓",
                    "2. 增加与现有组合低相关的资产",
                    "3. 考虑加入不同行业/地区的股票",
                    "4. 加入债券或商品等另类资产"
                ]
            })
        
        return suggestions
    
    def print_report(self):
        """打印相关性分析报告"""
        print("\n" + "=" * 70)
        print(f"📊 股票相关性矩阵分析报告")
        print("=" * 70)
        
        # 1. 相关性矩阵
        print("\n📈 相关性矩阵:")
        print("-" * 70)
        print(self.correlation_matrix.round(2).to_string())
        
        # 2. 分散化评分
        div_score = self.get_diversification_score()
        print(f"\n🎯 组合分散化评分:")
        print("-" * 70)
        print(f"   平均相关性: {div_score['average_correlation']:.3f}")
        print(f"   分散化评分: {div_score['diversification_score']:.1f}/100")
        print(f"   评价: {div_score['interpretation']}")
        
        # 3. 高相关性股票对
        high_corr = self.find_high_correlations(threshold=0.7)
        if high_corr:
            print(f"\n⚠️ 高相关性股票对 (|r| >= 0.7):")
            print("-" * 70)
            for pair in high_corr[:10]:  # 显示前10对
                color = "🔴" if pair['correlation'] > 0.9 else "🟠"
                print(f"   {color} {pair['stock1']} - {pair['stock2']}: {pair['correlation']:.3f}")
        
        # 4. 低相关性股票对
        low_corr = self.find_low_correlations(threshold=0.3)
        if low_corr:
            print(f"\n✅ 低相关性股票对 (|r| <= 0.3) - 分散化效果好:")
            print("-" * 70)
            for pair in low_corr[:10]:  # 显示前10对
                print(f"   🟢 {pair['stock1']} - {pair['stock2']}: {pair['correlation']:.3f}")
        
        # 5. 优化建议
        suggestions = self.suggest_optimization()
        if suggestions:
            print(f"\n💡 优化建议:")
            print("-" * 70)
            for suggestion in suggestions:
                print(f"\n{suggestion['title']}")
                if isinstance(suggestion['details'], list):
                    for detail in suggestion['details']:
                        print(f"   {detail}")
                else:
                    for item in suggestion['details']:
                        print(f"   • {item['stock1']} - {item['stock2']}: {item['correlation']:.3f}")
        
        print("=" * 70)
    
    def save_matrix(self, filename=None):
        """保存相关性矩阵到CSV"""
        if filename is None:
            filename = f"correlation_matrix_{datetime.now().strftime('%Y%m%d')}.csv"
        
        if self.correlation_matrix is not None:
            self.correlation_matrix.to_csv(filename)
            print(f"✅ 相关性矩阵已保存到: {filename}")


def main():
    """主函数"""
    if len(sys.argv) < 2:
        print("🦐 相关性矩阵生成器使用说明：")
        print("=" * 70)
        print("用法: python correlation_matrix.py <股票1> <股票2> ... <股票N>")
        print("\n示例:")
        print("  python correlation_matrix.py AAPL MSFT GOOGL NVDA")
        print("  python correlation_matrix.py TSM NVDA AMD INTC QCOM AVGO")
        print("\n提示:")
        print("  - 建议至少3只股票")
        print("  - 建议包含不同行业的股票")
        print("  - 可以分析ETF和个股的相关性")
        sys.exit(1)
    
    symbols = sys.argv[1:]
    
    if len(symbols) < 2:
        print("❌ 请至少提供2只股票进行分析")
        sys.exit(1)
    
    try:
        analyzer = CorrelationMatrix(symbols)
        analyzer.fetch_data()
        analyzer.calculate_correlation()
        analyzer.print_report()
        analyzer.save_matrix()
    except Exception as e:
        print(f"❌ 错误: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    main()
