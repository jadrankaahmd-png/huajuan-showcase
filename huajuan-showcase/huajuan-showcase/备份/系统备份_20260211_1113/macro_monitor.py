#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
宏观经济数据监控 - Macro Economic Monitor
作者：虾虾
创建时间：2026-02-08
用途：监控宏观指标，美联储数据，CPI/PPI/非农，国债收益率
"""

import yfinance as yf
import pandas as pd
from datetime import datetime, timedelta
import os


class MacroMonitor:
    """宏观经济数据监控"""
    
    def __init__(self):
        self.output_dir = os.path.expanduser("~/.openclaw/workspace/宏观数据")
        os.makedirs(self.output_dir, exist_ok=True)
        
        # 关键指标
        self.symbols = {
            'DXY': '美元指数',
            '^TNX': '10年期国债收益率',
            '^FVX': '5年期国债收益率',
            '^TYX': '30年期国债收益率',
            'GLD': '黄金ETF',
            'USO': '原油ETF'
        }
    
    def fetch_treasury_yields(self):
        """
        获取国债收益率
        """
        print("🦐 获取国债收益率曲线...")
        
        yields = {}
        for symbol, name in self.symbols.items():
            if '收益率' in name or symbol == 'DXY':
                try:
                    data = yf.Ticker(symbol).history(period="5d")
                    if not data.empty:
                        current = data['Close'][-1]
                        prev = data['Close'][-2]
                        change = (current - prev) / prev * 100
                        yields[name] = {
                            'current': current,
                            'change': change,
                            'symbol': symbol
                        }
                except Exception as e:
                    print(f"⚠️  获取{name}失败: {e}")
        
        return yields
    
    def analyze_yield_curve(self, yields):
        """
        分析收益率曲线
        """
        if '10年期国债收益率' in yields and '2年期国债收益率' in yields:
            spread = yields['10年期国债收益率']['current'] - yields['2年期国债收益率']['current']
            
            if spread < 0:
                status = "🔴 倒挂 - 衰退信号"
            elif spread < 0.5:
                status = "🟠 平坦 - 警惕"
            else:
                status = "🟢 正常 - 健康"
            
            return {'spread': spread, 'status': status}
        
        return None
    
    def fetch_dxy(self):
        """
        获取美元指数
        """
        try:
            dxy = yf.Ticker('DXY')
            data = dxy.history(period="5d")
            if not data.empty:
                return {
                    'current': data['Close'][-1],
                    'change': (data['Close'][-1] / data['Close'][-2] - 1) * 100
                }
        except:
            pass
        return None
    
    def fetch_gold(self):
        """
        获取黄金价格
        """
        try:
            gold = yf.Ticker('GC=F')
            data = gold.history(period="5d")
            if not data.empty:
                return {
                    'current': data['Close'][-1],
                    'change': (data['Close'][-1] / data['Close'][-2] - 1) * 100
                }
        except:
            pass
        return None
    
    def generate_macro_report(self):
        """
        生成宏观报告
        """
        print("🦐 生成宏观经济监控报告...")
        print("=" * 70)
        
        # 获取数据
        yields = self.fetch_treasury_yields()
        
        # 打印报告
        print("\n📊 国债收益率:")
        for name, data in yields.items():
            emoji = "🟢" if data['change'] < 0 else "🔴"
            print(f"   {emoji} {name}: {data['current']:.2f}% ({data['change']:+.2f}%)")
        
        # 收益率曲线分析
        curve = self.analyze_yield_curve(yields)
        if curve:
            print(f"\n📈 收益率曲线:")
            print(f"   10Y-2Y利差: {curve['spread']:.2f}%")
            print(f"   状态: {curve['status']}")
        
        # DXY
        dxy = self.fetch_dxy()
        if dxy:
            print(f"\n💵 美元指数:")
            print(f"   当前: {dxy['current']:.2f} ({dxy['change']:+.2f}%)")
        
        # 黄金
        gold = self.fetch_gold()
        if gold:
            print(f"\n🥇 黄金:")
            print(f"   当前: ${gold['current']:.2f} ({gold['change']:+.2f}%)")
        
        print("\n" + "=" * 70)
        print("✅ 宏观数据监控完成！")


def main():
    """主函数"""
    monitor = MacroMonitor()
    monitor.generate_macro_report()


if __name__ == "__main__":
    main()
