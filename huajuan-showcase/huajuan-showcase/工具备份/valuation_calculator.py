#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
估值计算器 - Valuation Calculator
作者：虾虾
创建时间：2026-02-09
用途：多种估值方法计算，判断估值合理性

使用方法：
    python valuation_calculator.py <股票代码>
    例如：python valuation_calculator.py AAPL
"""

import yfinance as yf
import pandas as pd
import numpy as np
from datetime import datetime
import os
import json


class ValuationCalculator:
    """估值计算器"""
    
    def __init__(self):
        self.output_dir = os.path.expanduser("~/.openclaw/workspace/估值分析")
        os.makedirs(self.output_dir, exist_ok=True)
    
    def get_valuation_data(self, symbol):
        """获取估值数据"""
        try:
            stock = yf.Ticker(symbol)
            info = stock.info
            hist = stock.history(period="2y")
            
            return {
                'info': info,
                'history': hist
            }
        except Exception as e:
            print(f"⚠️  获取数据失败: {e}")
            return None
    
    def calculate_multiples(self, data):
        """计算估值倍数"""
        print("\n📊 估值倍数分析")
        print("-" * 70)
        
        info = data['info']
        
        # 获取当前价格和财务数据
        current_price = info.get('currentPrice', info.get('regularMarketPrice', 0))
        pe = info.get('trailingPE', None)
        forward_pe = info.get('forwardPE', None)
        pb = info.get('priceToBook', None)
        ps = info.get('priceToSalesTrailing12Months', None)
        peg = info.get('pegRatio', None)
        
        print(f"当前股价: ${current_price:.2f}")
        print(f"\n估值倍数:")
        print(f"   市盈率 (TTM): {pe:.1f}x" if pe else "   市盈率 (TTM): N/A")
        print(f"   远期市盈率: {forward_pe:.1f}x" if forward_pe else "   远期市盈率: N/A")
        print(f"   市净率: {pb:.1f}x" if pb else "   市净率: N/A")
        print(f"   市销率: {ps:.1f}x" if ps else "   市销率: N/A")
        print(f"   PEG比率: {peg:.2f}" if peg else "   PEG比率: N/A")
        
        return {
            'current_price': current_price,
            'pe': pe,
            'forward_pe': forward_pe,
            'pb': pb,
            'ps': ps,
            'peg': peg
        }
    
    def calculate_dcf(self, data):
        """
        简化DCF计算
        注：完整DCF需要详细财务预测，这里使用简化版
        """
        print("\n💰 DCF估值 (简化版)")
        print("-" * 70)
        
        info = data['info']
        
        # 获取自由现金流 (简化)
        fcf = info.get('freeCashflow', 0)
        
        if fcf <= 0:
            print("⚠️  自由现金流为负或无法获取，跳过DCF计算")
            return None
        
        # DCF假设参数
        growth_rate = 0.10  # 10%增长率
        discount_rate = 0.10  # 10%折现率
        terminal_growth = 0.03  # 3%永续增长率
        years = 5
        
        # 计算未来现金流现值
        pv_fcf = 0
        for year in range(1, years + 1):
            future_fcf = fcf * (1 + growth_rate) ** year
            pv = future_fcf / (1 + discount_rate) ** year
            pv_fcf += pv
        
        # 终值
        terminal_fcf = fcf * (1 + growth_rate) ** years * (1 + terminal_growth)
        terminal_value = terminal_fcf / (discount_rate - terminal_growth)
        pv_terminal = terminal_value / (1 + discount_rate) ** years
        
        # 企业价值
        enterprise_value = pv_fcf + pv_terminal
        
        # 减去净债务得到股权价值 (简化)
        equity_value = enterprise_value
        
        # 每股价值 (需要知道股数，简化处理)
        shares_outstanding = info.get('sharesOutstanding', 1)
        dcf_value_per_share = equity_value / shares_outstanding if shares_outstanding > 0 else 0
        
        print(f"自由现金流: ${fcf/1e9:.2f}B")
        print(f"假设增长率: {growth_rate*100:.0f}%")
        print(f"折现率: {discount_rate*100:.0f}%")
        print(f"DCF估值: ${dcf_value_per_share:.2f}")
        
        return dcf_value_per_share
    
    def analyze_valuation(self, data, multiples):
        """分析估值合理性"""
        print("\n📈 估值合理性分析")
        print("-" * 70)
        
        current_price = multiples['current_price']
        pe = multiples['pe']
        
        # 估值评级
        print("\n估值判断:")
        
        if pe:
            if pe < 15:
                rating = "🟢 低估"
                suggestion = "估值合理偏低，可考虑买入"
            elif pe < 25:
                rating = "🟡 合理"
                suggestion = "估值在合理区间"
            elif pe < 40:
                rating = "🟠 偏高"
                suggestion = "估值偏高，谨慎买入"
            else:
                rating = "🔴 高估"
                suggestion = "估值过高，建议观望"
            
            print(f"   当前PE: {pe:.1f}x")
            print(f"   评级: {rating}")
            print(f"   建议: {suggestion}")
        else:
            print("   无法计算PE，无法评估估值")
        
        # 目标价估算 (简化)
        if pe and pe > 0:
            fair_pe = 20  # 假设合理PE为20倍
            eps = current_price / pe
            fair_value = eps * fair_pe
            upside = (fair_value - current_price) / current_price * 100
            
            print(f"\n目标价估算:")
            print(f"   假设合理PE: {fair_pe}x")
            print(f"   估算合理价格: ${fair_value:.2f}")
            print(f"   上涨空间: {upside:+.1f}%")
    
    def calculate(self, symbol):
        """执行完整估值计算"""
        print("=" * 70)
        print(f"🦐 估值计算器 - {symbol}")
        print("=" * 70)
        print(f"时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print("=" * 70)
        
        # 获取数据
        data = self.get_valuation_data(symbol)
        if not data:
            print("❌ 无法获取数据")
            return
        
        # 计算估值倍数
        multiples = self.calculate_multiples(data)
        
        # DCF估值
        dcf_value = self.calculate_dcf(data)
        
        # 分析估值合理性
        self.analyze_valuation(data, multiples)
        
        # 保存结果
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f"{self.output_dir}/{symbol}_valuation_{timestamp}.json"
        
        with open(filename, 'w') as f:
            json.dump({
                'symbol': symbol,
                'timestamp': datetime.now().isoformat(),
                'multiples': multiples,
                'dcf_value': dcf_value
            }, f, indent=2)
        
        print(f"\n💾 结果已保存: {filename}")
        print("\n" + "=" * 70)
        print("✅ 估值计算完成！")


def main():
    """主函数"""
    if len(sys.argv) < 2:
        print("用法: python valuation_calculator.py <股票代码>")
        print("例如: python valuation_calculator.py AAPL")
        sys.exit(1)
    
    symbol = sys.argv[1].upper()
    
    calculator = ValuationCalculator()
    calculator.calculate(symbol)


if __name__ == "__main__":
    main()
