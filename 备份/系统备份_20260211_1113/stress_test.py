#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
压力测试 - Stress Test
作者：虾虾
创建时间：2026-02-08
用途：组合压力测试，黑天鹅事件模拟，最大回撤预测
"""

import yfinance as yf
import pandas as pd
import numpy as np
from datetime import datetime


class StressTest:
    """压力测试"""
    
    def __init__(self):
        self.scenarios = {
            '2008金融危机': {'drop': -0.50, 'description': '类似2008年金融危机'},
            '2020疫情崩盘': {'drop': -0.35, 'description': '类似2020年3月疫情崩盘'},
            '2022科技股崩盘': {'drop': -0.30, 'description': '类似2022年科技股回调'},
            '轻度回调': {'drop': -0.15, 'description': '轻度市场回调'},
            '中度回调': {'drop': -0.25, 'description': '中度市场调整'}
        }
    
    def stress_test_portfolio(self, portfolio_value, stock_allocation, bond_allocation):
        """
        组合压力测试
        """
        print("🦐 组合压力测试")
        print("=" * 70)
        print(f"组合价值: ${portfolio_value:,.2f}")
        print(f"股票配置: {stock_allocation*100:.0f}%")
        print(f"债券配置: {bond_allocation*100:.0f}%")
        print("=" * 70)
        
        results = []
        
        for scenario_name, scenario in self.scenarios.items():
            # 假设股票下跌scenario['drop']，债券相对稳健（下跌一半）
            stock_loss = portfolio_value * stock_allocation * scenario['drop']
            bond_loss = portfolio_value * bond_allocation * (scenario['drop'] * 0.3)  # 债券跌幅较小
            
            total_loss = stock_loss + bond_loss
            new_value = portfolio_value + total_loss
            loss_pct = total_loss / portfolio_value * 100
            
            results.append({
                'scenario': scenario_name,
                'description': scenario['description'],
                'loss': total_loss,
                'new_value': new_value,
                'loss_pct': loss_pct
            })
        
        # 显示结果
        print("\n📊 压力测试结果:")
        print("-" * 70)
        print(f"{'情景':<15} {'损失金额':>12} {'损失比例':>10} {'剩余价值':>12}")
        print("-" * 70)
        
        for result in results:
            emoji = "🔴" if result['loss_pct'] < -30 else "🟠" if result['loss_pct'] < -20 else "🟡"
            print(f"{emoji} {result['scenario']:<12} ${result['loss']:>11,.0f} {result['loss_pct']:>9.1f}% ${result['new_value']:>11,.0f}")
        
        # 最大回撤预测
        max_drawdown = max([r['loss_pct'] for r in results])
        print(f"\n⚠️  最坏情景预测:")
        print(f"   最大回撤: {max_drawdown:.1f}%")
        print(f"   建议: 确保能承受此回撤再投资")
        
        print("\n" + "=" * 70)


def main():
    """主函数"""
    stress = StressTest()
    
    # 示例组合
    portfolio_value = 100000
    stock_allocation = 0.70
    bond_allocation = 0.30
    
    stress.stress_test_portfolio(portfolio_value, stock_allocation, bond_allocation)


if __name__ == "__main__":
    main()
