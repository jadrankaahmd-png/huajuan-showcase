#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
市场广度分析器 - Market Breadth Analyzer
作者：虾虾
创建时间：2026-02-08
用途：分析市场内部强度（涨跌家数比、新高新低、市场宽度指标）
"""

import yfinance as yf
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import os
import sys


class MarketBreadthAnalyzer:
    """市场广度分析器"""
    
    def __init__(self):
        self.output_dir = os.path.expanduser("~/.openclaw/workspace/市场广度数据")
        os.makedirs(self.output_dir, exist_ok=True)
        
        # 主要指数成分股
        self.indices = {
            'SPY': '标普500',
            'QQQ': '纳斯达克100',
            'IWM': '罗素2000',
            'XLF': '金融板块',
            'XLK': '科技板块',
            'XLE': '能源板块',
            'XLI': '工业板块',
            'XLP': '消费必需品',
            'XLU': '公用事业',
            'XLV': '医疗保健',
            'XLY': '非必需品'
        }
    
    def get_market_breadth(self, index_symbol='SPY'):
        """
        获取市场广度数据
        """
        print(f"🦐 分析 {self.indices.get(index_symbol, index_symbol)} 市场广度...")
        
        try:
            # 获取指数数据
            index = yf.Ticker(index_symbol)
            hist = index.history(period="1mo")
            
            if hist.empty:
                return None
            
            # 计算涨跌家数（简化版，使用成交量和振幅估算）
            recent = hist.tail(5)  # 最近5天
            
            # 计算市场宽度指标
            advances = len(recent[recent['Close'] > recent['Open']])
            declines = len(recent[recent['Close'] < recent['Open']])
            unchanged = len(recent[recent['Close'] == recent['Open']])
            
            # A/D Ratio
            ad_ratio = advances / declines if declines > 0 else advances
            
            # 新高新低（简化计算）
            high_20d = hist['High'].rolling(20).max()
            low_20d = hist['Low'].rolling(20).min()
            
            new_highs = len(hist[hist['Close'] >= high_20d * 0.99])
            new_lows = len(hist[hist['Close'] <= low_20d * 1.01])
            
            return {
                'advances': advances,
                'declines': declines,
                'unchanged': unchanged,
                'ad_ratio': ad_ratio,
                'new_highs': new_highs,
                'new_lows': new_lows,
                'index_price': hist['Close'][-1],
                'index_change': (hist['Close'][-1] / hist['Close'][-2] - 1) * 100
            }
            
        except Exception as e:
            print(f"⚠️  获取数据失败: {e}")
            return None
    
    def calculate_mcclellan_oscillator(self, index_symbol='SPY'):
        """
        计算McClellan Oscillator（市场宽度震荡指标）
        """
        try:
            index = yf.Ticker(index_symbol)
            hist = index.history(period="3mo")
            
            if hist.empty:
                return None
            
            # 计算每日涨跌（简化版）
            daily_change = hist['Close'].diff()
            advances = (daily_change > 0).astype(int)
            declines = (daily_change < 0).astype(int)
            
            # 净涨跌
            net_advances = advances - declines
            
            # 19日和39日EMA
            ema_19 = net_advances.ewm(span=19).mean()
            ema_39 = net_advances.ewm(span=39).mean()
            
            # McClellan Oscillator
            mco = ema_19 - ema_39
            
            current_mco = mco.iloc[-1]
            
            # 信号解读
            if current_mco > 100:
                signal = "🟢 极度超买 - 警惕回调"
            elif current_mco > 50:
                signal = "🟡 偏强 - 健康上涨"
            elif current_mco > -50:
                signal = "⚪ 中性 - 震荡整理"
            elif current_mco > -100:
                signal = "🟠 偏弱 - 健康回调"
            else:
                signal = "🔴 极度超卖 - 可能反弹"
            
            return {
                'mco': current_mco,
                'ema_19': ema_19.iloc[-1],
                'ema_39': ema_39.iloc[-1],
                'signal': signal
            }
            
        except Exception as e:
            print(f"⚠️  计算MCO失败: {e}")
            return None
    
    def calculate_breadth_thrust(self, index_symbol='SPY'):
        """
        计算Breadth Thrust（市场广度冲刺）
        """
        try:
            index = yf.Ticker(index_symbol)
            hist = index.history(period="1mo")
            
            if len(hist) < 10:
                return None
            
            # 计算10日涨跌比率
            recent = hist.tail(10)
            up_days = len(recent[recent['Close'] > recent['Open']])
            breadth_thrust = (up_days / 10) * 100
            
            # 信号解读
            if breadth_thrust >= 70:
                signal = "🚀 Breadth Thrust - 强势上涨信号"
            elif breadth_thrust >= 60:
                signal = "🟢 偏多 - 健康市场"
            elif breadth_thrust >= 40:
                signal = "⚪ 中性 - 震荡"
            else:
                signal = "🔴 偏空 - 弱势市场"
            
            return {
                'breadth_thrust': breadth_thrust,
                'signal': signal
            }
            
        except Exception as e:
            print(f"⚠️  计算失败: {e}")
            return None
    
    def generate_breadth_report(self):
        """
        生成市场广度报告
        """
        print("\n" + "=" * 70)
        print("🦐 市场广度分析报告")
        print(f"时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print("=" * 70)
        
        # 分析主要指数
        for symbol, name in self.indices.items():
            print(f"\n📊 {name} ({symbol}):")
            
            # 市场广度
            breadth = self.get_market_breadth(symbol)
            if breadth:
                print(f"   价格: ${breadth['index_price']:.2f} ({breadth['index_change']:+.2f}%)")
                print(f"   涨跌比: {breadth['advances']}/{breadth['declines']} (A/D Ratio: {breadth['ad_ratio']:.2f})")
                print(f"   新高/新低: {breadth['new_highs']}/{breadth['new_lows']}")
            
            # McClellan Oscillator
            mco = self.calculate_mcclellan_oscillator(symbol)
            if mco:
                print(f"   MCO指标: {mco['mco']:+.2f}")
                print(f"   信号: {mco['signal']}")
            
            # Breadth Thrust
            bt = self.calculate_breadth_thrust(symbol)
            if bt:
                print(f"   Breadth Thrust: {bt['breadth_thrust']:.1f}%")
                print(f"   信号: {bt['signal']}")
            
            print("-" * 70)
        
        print("\n✅ 市场广度分析完成！")


def main():
    """主函数"""
    analyzer = MarketBreadthAnalyzer()
    analyzer.generate_breadth_report()


if __name__ == "__main__":
    main()
