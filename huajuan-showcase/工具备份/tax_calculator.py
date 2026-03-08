#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
税务计算器 - Tax Calculator
作者：虾虾
创建时间：2026-02-08
用途：盈亏税务计算，wash sale检测，年度税务报告
"""

import pandas as pd
from datetime import datetime
import os


class TaxCalculator:
    """税务计算器"""
    
    def __init__(self):
        self.output_dir = os.path.expanduser("~/.openclaw/workspace/税务报告")
        os.makedirs(self.output_dir, exist_ok=True)
    
    def calculate_capital_gains(self, trades):
        """
        计算资本利得
        """
        # 简化版税务计算
        short_term_gains = 0  # 短期（<1年）
        long_term_gains = 0   # 长期（>1年）
        
        for trade in trades:
            if trade['type'] == 'SELL':
                gain = trade['proceeds'] - trade['cost_basis']
                holding_period = trade.get('holding_days', 0)
                
                if holding_period < 365:
                    short_term_gains += gain
                else:
                    long_term_gains += gain
        
        # 美国税率（简化）
        short_term_tax = short_term_gains * 0.37  # 最高税率
        long_term_tax = long_term_gains * 0.20    # 长期资本利得税率
        
        return {
            'short_term_gains': short_term_gains,
            'long_term_gains': long_term_gains,
            'short_term_tax': short_term_tax,
            'long_term_tax': long_term_tax,
            'total_tax': short_term_tax + long_term_tax
        }
    
    def check_wash_sale(self, trades):
        """
        检测wash sale
        """
        wash_sales = []
        
        # 简化检测：30天内卖出后买入同一股票
        for i, sell_trade in enumerate(trades):
            if sell_trade['type'] != 'SELL' or sell_trade.get('pnl', 0) >= 0:
                continue
            
            sell_date = sell_trade['date']
            symbol = sell_trade['symbol']
            
            for buy_trade in trades[i+1:]:
                if (buy_trade['type'] == 'BUY' and 
                    buy_trade['symbol'] == symbol and
                    (buy_trade['date'] - sell_date).days <= 30):
                    wash_sales.append({
                        'symbol': symbol,
                        'sell_date': sell_date,
                        'buy_date': buy_trade['date'],
                        'loss': abs(sell_trade['pnl'])
                    })
                    break
        
        return wash_sales
    
    def generate_tax_report(self, trades):
        """
        生成税务报告
        """
        print("🦐 税务报告")
        print("=" * 70)
        print(f"年度: {datetime.now().year}")
        print("=" * 70)
        
        # 计算资本利得
        gains = self.calculate_capital_gains(trades)
        
        print("\n💰 资本利得:")
        print(f"   短期利得: ${gains['short_term_gains']:,.2f}")
        print(f"   长期利得: ${gains['long_term_gains']:,.2f}")
        print(f"   合计: ${gains['short_term_gains'] + gains['long_term_gains']:,.2f}")
        
        print("\n💸 预估税款:")
        print(f"   短期税款: ${gains['short_term_tax']:,.2f}")
        print(f"   长期税款: ${gains['long_term_tax']:,.2f}")
        print(f"   总税款: ${gains['total_tax']:,.2f}")
        
        # Wash sale检测
        wash_sales = self.check_wash_sale(trades)
        if wash_sales:
            print("\n⚠️  Wash Sale检测:")
            for ws in wash_sales:
                print(f"   {ws['symbol']}: 损失 ${ws['loss']:,.2f} 不可抵扣")
        else:
            print("\n✅ 无Wash Sale")
        
        print("\n" + "=" * 70)
        print("⚠️  注意: 以上为简化计算，实际税务请咨询专业人士")


def main():
    """主函数"""
    calc = TaxCalculator()
    
    # 示例交易
    example_trades = [
        {'type': 'BUY', 'symbol': 'AAPL', 'date': datetime(2024, 1, 15), 'cost_basis': 10000},
        {'type': 'SELL', 'symbol': 'AAPL', 'date': datetime(2024, 6, 15), 'proceeds': 12000, 'cost_basis': 10000, 'pnl': 2000, 'holding_days': 150},
        {'type': 'BUY', 'symbol': 'TSLA', 'date': datetime(2024, 3, 1), 'cost_basis': 5000},
        {'type': 'SELL', 'symbol': 'TSLA', 'date': datetime(2024, 4, 1), 'proceeds': 4000, 'cost_basis': 5000, 'pnl': -1000, 'holding_days': 31}
    ]
    
    calc.generate_tax_report(example_trades)


if __name__ == "__main__":
    main()
