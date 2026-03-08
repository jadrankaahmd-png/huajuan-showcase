#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
板块轮动追踪器 - Sector Rotation Tracker
作者：虾虾
创建时间：2026-02-08
用途：监控资金在不同板块间流动，板块轮动周期判断
"""

import yfinance as yf
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import os
import sys


class SectorRotationTracker:
    """板块轮动追踪器"""
    
    def __init__(self):
        self.output_dir = os.path.expanduser("~/.openclaw/workspace/板块轮动数据")
        os.makedirs(self.output_dir, exist_ok=True)
        
        # 标普11大板块ETF
        self.sectors = {
            'XLK': {'name': '科技', 'weight': 0.30},
            'XLF': {'name': '金融', 'weight': 0.12},
            'XLV': {'name': '医疗保健', 'weight': 0.13},
            'XLY': {'name': '非必需品', 'weight': 0.10},
            'XLI': {'name': '工业', 'weight': 0.08},
            'XLP': {'name': '必需品', 'weight': 0.06},
            'XLE': {'name': '能源', 'weight': 0.04},
            'XLU': {'name': '公用事业', 'weight': 0.03},
            'XLRE': {'name': '房地产', 'weight': 0.03},
            'XLB': {'name': '原材料', 'weight': 0.03},
            'XLC': {'name': '通信服务', 'weight': 0.08}
        }
        
        # 基准指数
        self.benchmark = 'SPY'
    
    def get_sector_performance(self, period='1mo'):
        """
        获取各板块表现
        """
        print(f"🦐 获取板块表现（{period}）...")
        
        performances = []
        
        for symbol, info in self.sectors.items():
            try:
                ticker = yf.Ticker(symbol)
                hist = ticker.history(period=period)
                
                if hist.empty or len(hist) < 2:
                    continue
                
                start_price = hist['Close'].iloc[0]
                end_price = hist['Close'].iloc[-1]
                performance = (end_price / start_price - 1) * 100
                
                # 计算波动率
                returns = hist['Close'].pct_change().dropna()
                volatility = returns.std() * np.sqrt(252) * 100
                
                performances.append({
                    'symbol': symbol,
                    'name': info['name'],
                    'performance': performance,
                    'volatility': volatility,
                    'weight': info['weight'],
                    'current_price': end_price
                })
                
            except Exception as e:
                print(f"⚠️  获取{symbol}失败: {e}")
                continue
        
        # 按表现排序
        performances.sort(key=lambda x: x['performance'], reverse=True)
        
        return performances
    
    def calculate_relative_strength(self):
        """
        计算板块相对强弱（相对SPY）
        """
        print("🦐 计算相对强弱...")
        
        try:
            # 获取SPY表现
            spy = yf.Ticker(self.benchmark)
            spy_hist = spy.history(period="1mo")
            spy_performance = (spy_hist['Close'].iloc[-1] / spy_hist['Close'].iloc[0] - 1) * 100
            
            # 获取各板块表现
            sector_perf = self.get_sector_performance()
            
            # 计算相对强弱
            for sector in sector_perf:
                sector['relative_strength'] = sector['performance'] - spy_performance
                sector['rs_rank'] = 0  # 临时值
            
            # 排名
            sector_perf.sort(key=lambda x: x['relative_strength'], reverse=True)
            for i, sector in enumerate(sector_perf, 1):
                sector['rs_rank'] = i
            
            return sector_perf, spy_performance
            
        except Exception as e:
            print(f"❌ 计算失败: {e}")
            return None, 0
    
    def detect_rotation_pattern(self, performances):
        """
        检测轮动模式
        """
        if not performances:
            return None
        
        # 获取领涨和领跌板块
        leaders = performances[:3]  # 前3名
        laggards = performances[-3:]  # 后3名
        
        # 判断轮动阶段
        tech_performance = next((p for p in performances if p['symbol'] == 'XLK'), None)
        financial_performance = next((p for p in performances if p['symbol'] == 'XLF'), None)
        utility_performance = next((p for p in performances if p['symbol'] == 'XLU'), None)
        
        # 简单判断
        if tech_performance and tech_performance['performance'] > 5:
            phase = "🚀 成长板块领涨 - 风险偏好高"
        elif utility_performance and utility_performance['performance'] > 2:
            phase = "🛡️ 防御板块领涨 - 避险情绪"
        elif financial_performance and financial_performance['performance'] > 3:
            phase = "🏦 周期板块领涨 - 经济复苏"
        else:
            phase = "⚖️ 板块轮动中 - 观察等待"
        
        return {
            'phase': phase,
            'leaders': leaders,
            'laggards': laggards
        }
    
    def generate_rotation_heatmap(self, performances):
        """
        生成板块轮动热力图（文本版）
        """
        print("\n🌡️ 板块轮动热力图:")
        print("=" * 70)
        
        for sector in performances:
            perf = sector['performance']
            
            # 选择表情
            if perf > 5:
                emoji = "🔥"
                color = "🟢"
            elif perf > 2:
                emoji = "🟢"
                color = "🟢"
            elif perf > 0:
                emoji = "⚪"
                color = "⚪"
            elif perf > -2:
                emoji = "🟠"
                color = "🟠"
            else:
                emoji = "🔴"
                color = "🔴"
            
            bar_length = int(abs(perf))
            bar = "█" * min(bar_length, 20)
            
            print(f"{emoji} {sector['name']:<10} {perf:>+6.2f}% {bar}")
        
        print("=" * 70)
    
    def generate_sector_report(self):
        """
        生成板块轮动报告
        """
        print("\n" + "=" * 70)
        print("🦐 板块轮动追踪报告")
        print(f"时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print("=" * 70)
        
        # 获取相对强弱
        performances, spy_perf = self.calculate_relative_strength()
        
        if not performances:
            print("❌ 无法获取数据")
            return
        
        # 显示基准
        print(f"\n📊 基准指数 ({self.benchmark}): {spy_perf:+.2f}%")
        
        # 生成热力图
        self.generate_rotation_heatmap(performances)
        
        # 相对强弱排名
        print("\n📈 相对强弱排名（相对SPY）:")
        print("-" * 70)
        for i, sector in enumerate(performances[:5], 1):
            rs = sector['relative_strength']
            emoji = "🥇" if i == 1 else "🥈" if i == 2 else "🥉" if i == 3 else f"{i}."
            print(f"{emoji} {sector['name']:<10} 绝对收益: {sector['performance']:+.2f}%  相对强弱: {rs:+.2f}%")
        
        print("\n📉 相对弱势板块:")
        for sector in performances[-3:]:
            rs = sector['relative_strength']
            print(f"🔻 {sector['name']:<10} 绝对收益: {sector['performance']:+.2f}%  相对强弱: {rs:+.2f}%")
        
        # 检测轮动模式
        rotation = self.detect_rotation_pattern(performances)
        if rotation:
            print(f"\n🔄 轮动阶段判断:")
            print(f"   {rotation['phase']}")
            
            print(f"\n🏆 领涨板块:")
            for sector in rotation['leaders']:
                print(f"   • {sector['name']}: {sector['performance']:+.2f}%")
            
            print(f"\n📉 领跌板块:")
            for sector in rotation['laggards']:
                print(f"   • {sector['name']}: {sector['performance']:+.2f}%")
        
        # 投资建议
        print(f"\n💡 投资建议:")
        leaders = [p for p in performances if p['relative_strength'] > 2]
        laggards = [p for p in performances if p['relative_strength'] < -2]
        
        if leaders:
            print(f"   • 关注强势板块: {', '.join([p['name'] for p in leaders[:3]])}")
        if laggards:
            print(f"   • 回避弱势板块: {', '.join([p['name'] for p in laggards[:3]])}")
        
        print("\n" + "=" * 70)
        print("✅ 板块轮动分析完成！")


def main():
    """主函数"""
    tracker = SectorRotationTracker()
    tracker.generate_sector_report()


if __name__ == "__main__":
    main()
