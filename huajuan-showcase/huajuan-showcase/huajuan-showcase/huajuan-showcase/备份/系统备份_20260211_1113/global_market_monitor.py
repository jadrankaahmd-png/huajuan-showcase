#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
全球市场监控器 - Global Market Monitor
作者：虾虾
创建时间：2026-02-08
用途：监控全球主要市场，欧洲/亚洲股市，汇率，商品
"""

import yfinance as yf
from datetime import datetime
import os


class GlobalMarketMonitor:
    """全球市场监控器"""
    
    def __init__(self):
        self.output_dir = os.path.expanduser("~/.openclaw/workspace/全球市场数据")
        os.makedirs(self.output_dir, exist_ok=True)
        
        # 全球市场指数
        self.markets = {
            # 美国
            'SPY': '标普500',
            'QQQ': '纳斯达克100',
            'IWM': '罗素2000',
            
            # 欧洲
            'EZU': 'MSCI欧洲',
            'EWU': '英国',
            'EWG': '德国',
            'EWQ': '法国',
            
            # 亚洲
            'FXI': '中国大型股',
            'EWJ': '日本',
            'EWH': '香港',
            'INDA': '印度',
            
            # 商品
            'GLD': '黄金',
            'USO': '原油',
            'DBA': '农产品',
            
            # 汇率
            'UUP': '美元指数',
        }
    
    def get_market_data(self, symbol):
        """
        获取市场数据
        """
        try:
            ticker = yf.Ticker(symbol)
            data = ticker.history(period="5d")
            
            if data.empty or len(data) < 2:
                return None
            
            current = data['Close'][-1]
            prev = data['Close'][-2]
            change = (current / prev - 1) * 100
            
            return {
                'price': current,
                'change': change
            }
            
        except Exception as e:
            return None
    
    def generate_global_report(self):
        """
        生成全球市场报告
        """
        print("🦐 全球市场监控报告")
        print("=" * 70)
        print(f"时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print("=" * 70)
        
        categories = {
            '美国市场': ['SPY', 'QQQ', 'IWM'],
            '欧洲市场': ['EZU', 'EWU', 'EWG', 'EWQ'],
            '亚洲市场': ['FXI', 'EWJ', 'EWH', 'INDA'],
            '商品': ['GLD', 'USO', 'DBA'],
            '汇率': ['UUP']
        }
        
        for category, symbols in categories.items():
            print(f"\n🌍 {category}:")
            print("-" * 70)
            
            for symbol in symbols:
                if symbol in self.markets:
                    data = self.get_market_data(symbol)
                    if data:
                        emoji = "🟢" if data['change'] > 0 else "🔴"
                        print(f"{emoji} {self.markets[symbol]:<15} ${data['price']:>10,.2f} ({data['change']:+.2f}%)")
        
        print("\n" + "=" * 70)
        print("✅ 全球市场监控完成！")


def main():
    """主函数"""
    monitor = GlobalMarketMonitor()
    monitor.generate_global_report()


if __name__ == "__main__":
    main()
