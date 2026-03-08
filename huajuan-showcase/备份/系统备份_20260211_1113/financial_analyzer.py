#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
财务报表深度分析器 - Financial Analyzer
作者：虾虾
创建时间：2026-02-09
用途：深度分析财务报表，计算关键比率，评估财务健康度

使用方法：
    python financial_analyzer.py <股票代码>
    例如：python financial_analyzer.py AAPL
"""

import yfinance as yf
import pandas as pd
import numpy as np
from datetime import datetime
import os
import json


class FinancialAnalyzer:
    """财务报表深度分析器"""
    
    def __init__(self):
        self.output_dir = os.path.expanduser("~/.openclaw/workspace/财务分析")
        os.makedirs(self.output_dir, exist_ok=True)
    
    def get_financial_data(self, symbol):
        """获取财务数据"""
        try:
            stock = yf.Ticker(symbol)
            
            # 获取财务报表
            income_stmt = stock.income_stmt
            balance_sheet = stock.balance_sheet
            cash_flow = stock.cashflow
            info = stock.info
            
            return {
                'income_stmt': income_stmt,
                'balance_sheet': balance_sheet,
                'cash_flow': cash_flow,
                'info': info
            }
        except Exception as e:
            print(f"⚠️  获取财务数据失败: {e}")
            return None
    
    def analyze_income_statement(self, data):
        """分析利润表"""
        print("\n📊 利润表分析")
        print("-" * 70)
        
        try:
            income = data['income_stmt']
            
            if income is None or income.empty:
                print("⚠️  无利润表数据")
                return {}
            
            # 获取最近4个季度/年度数据
            latest = income.columns[0]
            
            revenue = income.loc['Total Revenue'].iloc[0] if 'Total Revenue' in income.index else 0
            gross_profit = income.loc['Gross Profit'].iloc[0] if 'Gross Profit' in income.index else 0
            operating_income = income.loc['Operating Income'].iloc[0] if 'Operating Income' in income.index else 0
            net_income = income.loc['Net Income'].iloc[0] if 'Net Income' in income.index else 0
            
            # 计算比率
            gross_margin = (gross_profit / revenue * 100) if revenue > 0 else 0
            operating_margin = (operating_income / revenue * 100) if revenue > 0 else 0
            net_margin = (net_income / revenue * 100) if revenue > 0 else 0
            
            print(f"营业收入: ${revenue/1e9:.2f}B")
            print(f"毛利润: ${gross_profit/1e9:.2f}B")
            print(f"营业利润: ${operating_income/1e9:.2f}B")
            print(f"净利润: ${net_income/1e9:.2f}B")
            print(f"\n盈利能力:")
            print(f"   毛利率: {gross_margin:.1f}%")
            print(f"   营业利润率: {operating_margin:.1f}%")
            print(f"   净利率: {net_margin:.1f}%")
            
            return {
                'revenue': revenue,
                'gross_margin': gross_margin,
                'operating_margin': operating_margin,
                'net_margin': net_margin
            }
        except Exception as e:
            print(f"⚠️  利润表分析失败: {e}")
            return {}
    
    def analyze_balance_sheet(self, data):
        """分析资产负债表"""
        print("\n📊 资产负债表分析")
        print("-" * 70)
        
        try:
            balance = data['balance_sheet']
            
            if balance is None or balance.empty:
                print("⚠️  无资产负债表数据")
                return {}
            
            total_assets = balance.loc['Total Assets'].iloc[0] if 'Total Assets' in balance.index else 0
            total_debt = balance.loc['Total Debt'].iloc[0] if 'Total Debt' in balance.index else 0
            total_equity = balance.loc['Stockholders Equity'].iloc[0] if 'Stockholders Equity' in balance.index else 0
            cash = balance.loc['Cash And Cash Equivalents'].iloc[0] if 'Cash And Cash Equivalents' in balance.index else 0
            
            # 计算比率
            debt_to_equity = (total_debt / total_equity * 100) if total_equity > 0 else 0
            current_ratio = 1.5  # 简化计算
            
            print(f"总资产: ${total_assets/1e9:.2f}B")
            print(f"总负债: ${total_debt/1e9:.2f}B")
            print(f"股东权益: ${total_equity/1e9:.2f}B")
            print(f"现金: ${cash/1e9:.2f}B")
            print(f"\n偿债能力:")
            print(f"   负债权益比: {debt_to_equity:.1f}%")
            
            return {
                'total_assets': total_assets,
                'debt_to_equity': debt_to_equity,
                'cash': cash
            }
        except Exception as e:
            print(f"⚠️  资产负债表分析失败: {e}")
            return {}
    
    def analyze_cash_flow(self, data):
        """分析现金流量表"""
        print("\n📊 现金流量表分析")
        print("-" * 70)
        
        try:
            cashflow = data['cash_flow']
            
            if cashflow is None or cashflow.empty:
                print("⚠️  无现金流量表数据")
                return {}
            
            operating_cf = cashflow.loc['Operating Cash Flow'].iloc[0] if 'Operating Cash Flow' in cashflow.index else 0
            free_cf = cashflow.loc['Free Cash Flow'].iloc[0] if 'Free Cash Flow' in cashflow.index else 0
            capex = cashflow.loc['Capital Expenditure'].iloc[0] if 'Capital Expenditure' in cashflow.index else 0
            
            print(f"经营现金流: ${operating_cf/1e9:.2f}B")
            print(f"自由现金流: ${free_cf/1e9:.2f}B")
            print(f"资本支出: ${capex/1e9:.2f}B")
            
            return {
                'operating_cf': operating_cf,
                'free_cf': free_cf,
                'capex': capex
            }
        except Exception as e:
            print(f"⚠️  现金流量表分析失败: {e}")
            return {}
    
    def calculate_health_score(self, metrics):
        """计算财务健康度评分"""
        print("\n🏥 财务健康度评分")
        print("-" * 70)
        
        score = 0
        max_score = 100
        
        # 盈利能力 (40分)
        if metrics.get('gross_margin', 0) > 40:
            score += 15
        elif metrics.get('gross_margin', 0) > 20:
            score += 10
        
        if metrics.get('operating_margin', 0) > 15:
            score += 15
        elif metrics.get('operating_margin', 0) > 5:
            score += 10
        
        if metrics.get('net_margin', 0) > 10:
            score += 10
        elif metrics.get('net_margin', 0) > 0:
            score += 5
        
        # 偿债能力 (30分)
        if metrics.get('debt_to_equity', 100) < 50:
            score += 30
        elif metrics.get('debt_to_equity', 100) < 100:
            score += 20
        
        # 现金流 (30分)
        if metrics.get('free_cf', 0) > 0:
            score += 30
        elif metrics.get('operating_cf', 0) > 0:
            score += 20
        
        # 评级
        if score >= 80:
            rating = "🟢 非常健康"
        elif score >= 60:
            rating = "🟡 基本健康"
        elif score >= 40:
            rating = "🟠 需要关注"
        else:
            rating = "🔴 风险较高"
        
        print(f"财务健康度评分: {score}/{max_score}")
        print(f"评级: {rating}")
        
        return score
    
    def analyze(self, symbol):
        """执行完整财务分析"""
        print("=" * 70)
        print(f"🦐 财务报表深度分析器 - {symbol}")
        print("=" * 70)
        print(f"时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print("=" * 70)
        
        # 获取数据
        data = self.get_financial_data(symbol)
        if not data:
            print("❌ 无法获取财务数据")
            return
        
        # 分析三大报表
        income_metrics = self.analyze_income_statement(data)
        balance_metrics = self.analyze_balance_sheet(data)
        cash_metrics = self.analyze_cash_flow(data)
        
        # 合并指标
        all_metrics = {**income_metrics, **balance_metrics, **cash_metrics}
        
        # 计算健康度评分
        health_score = self.calculate_health_score(all_metrics)
        
        # 保存结果
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f"{self.output_dir}/{symbol}_financial_{timestamp}.json"
        
        with open(filename, 'w') as f:
            json.dump({
                'symbol': symbol,
                'timestamp': datetime.now().isoformat(),
                'health_score': health_score,
                'metrics': all_metrics
            }, f, indent=2)
        
        print(f"\n💾 结果已保存: {filename}")
        print("\n" + "=" * 70)
        print("✅ 财务分析完成！")


def main():
    """主函数"""
    if len(sys.argv) < 2:
        print("用法: python financial_analyzer.py <股票代码>")
        print("例如: python financial_analyzer.py AAPL")
        sys.exit(1)
    
    symbol = sys.argv[1].upper()
    
    analyzer = FinancialAnalyzer()
    analyzer.analyze(symbol)


if __name__ == "__main__":
    main()
