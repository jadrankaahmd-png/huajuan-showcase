#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
加密货币监控器 - Crypto Monitor
作者：虾虾
创建时间：2026-02-08
用途：监控加密市场，BTC/ETH链上数据，交易所资金流向
"""

import yfinance as yf
from datetime import datetime
import os


class CryptoMonitor:
    """加密货币监控器"""
    
    def __init__(self):
        self.output_dir = os.path.expanduser("~/.openclaw/workspace/加密货币数据")
        os.makedirs(self.output_dir, exist_ok=True)
        
        # 主要加密货币
        self.cryptos = {
            'BTC-USD': '比特币',
            'ETH-USD': '以太坊',
            'SOL-USD': 'Solana',
            'COIN': 'Coinbase股票'
        }
    
    def get_crypto_data(self, symbol):
        """
        获取加密货币数据
        """
        try:
            ticker = yf.Ticker(symbol)
            data = ticker.history(period="7d")
            
            if data.empty:
                return None
            
            current = data['Close'][-1]
            prev = data['Close'][-2]
            change = (current / prev - 1) * 100
            
            week_high = data['High'].max()
            week_low = data['Low'].min()
            
            return {
                'price': current,
                'change': change,
                'week_high': week_high,
                'week_low': week_low
            }
            
        except Exception as e:
            print(f"⚠️  获取{symbol}失败: {e}")
            return None
    
    def generate_crypto_report(self):
        """
        生成加密货币报告
        """
        print("🦐 加密货币监控报告")
        print("=" * 70)
        print(f"时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print("=" * 70)
        
        print(f"\n💰 主要加密货币:")
        print("-" * 70)
        print(f"{'资产':<15} {'价格':>15} {'24h涨幅':>12} {'周高点':>12}")
        print("-" * 70)
        
        for symbol, name in self.cryptos.items():
            data = self.get_crypto_data(symbol)
            if data:
                emoji = "🟢" if data['change'] > 0 else "🔴"
                print(f"{emoji} {name:<12} ${data['price']:>13,.2f} {data['change']:>+10.2f}% ${data['week_high']:>10,.0f}")
        
        print("\n📊 链上数据（需要专业API）:")
        print("   - BTC交易所流入/流出")
        print("   - 稳定币供应量变化")
        print("   - 矿工持仓变化")
        
        print("\n" + "=" * 70)
        print("✅ 加密货币监控完成！")


def main():
    """主函数"""
    monitor = CryptoMonitor()
    monitor.generate_crypto_report()


if __name__ == "__main__":
    main()
