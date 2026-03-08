#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
市场时机工具 - Market Timing
作者：虾虾
创建时间：2026-02-08
用途：判断入场/出场时机，趋势强度评分，超买/超卖判断
"""

import yfinance as yf
import pandas as pd
import numpy as np
from datetime import datetime


class MarketTiming:
    """市场时机工具"""
    
    def __init__(self):
        self.symbols = ['SPY', 'QQQ', 'IWM', 'VIX']
    
    def calculate_trend_strength(self, symbol):
        """
        计算趋势强度
        """
        try:
            stock = yf.Ticker(symbol)
            hist = stock.history(period="3mo")
            
            if len(hist) < 50:
                return None
            
            # 价格在各均线之上
            sma20 = hist['Close'].rolling(20).mean()
            sma50 = hist['Close'].rolling(50).mean()
            
            current = hist['Close'][-1]
            above_sma20 = current > sma20.iloc[-1]
            above_sma50 = current > sma50.iloc[-1]
            sma20_above_sma50 = sma20.iloc[-1] > sma50.iloc[-1]
            
            # 趋势强度评分 (0-100)
            score = 0
            if above_sma20: score += 25
            if above_sma50: score += 25
            if sma20_above_sma50: score += 25
            
            # 20日涨幅
            ret_20d = (current / hist['Close'][-20] - 1) * 100
            if ret_20d > 5: score += 25
            elif ret_20d > 0: score += 15
            
            return {
                'symbol': symbol,
                'trend_score': score,
                'above_sma20': above_sma20,
                'above_sma50': above_sma50,
                'return_20d': ret_20d
            }
            
        except:
            return None
    
    def check_overbought_oversold(self, symbol):
        """
        检查超买超卖
        """
        try:
            stock = yf.Ticker(symbol)
            hist = stock.history(period="3mo")
            
            if len(hist) < 14:
                return None
            
            # 计算RSI
            delta = hist['Close'].diff()
            gain = (delta.where(delta > 0, 0)).rolling(window=14).mean()
            loss = (-delta.where(delta < 0, 0)).rolling(window=14).mean()
            rs = gain / loss
            rsi = 100 - (100 / (1 + rs))
            current_rsi = rsi.iloc[-1]
            
            if current_rsi > 70:
                status = "🔴 超买"
            elif current_rsi < 30:
                status = "🟢 超卖"
            else:
                status = "⚪ 中性"
            
            return {
                'symbol': symbol,
                'rsi': current_rsi,
                'status': status
            }
            
        except:
            return None
    
    def generate_timing_report(self):
        """
        生成时机报告
        """
        print("🦐 市场时机分析报告")
        print("=" * 70)
        print(f"时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print("=" * 70)
        
        print("\n📊 趋势强度:")
        print("-" * 70)
        print(f"{'指数':<10} {'趋势评分':>10} {'20日涨幅':>10} {'状态':>15}")
        print("-" * 70)
        
        for symbol in ['SPY', 'QQQ', 'IWM']:
            trend = self.calculate_trend_strength(symbol)
            if trend:
                status = "🟢 强势" if trend['trend_score'] >= 70 else "🟡 震荡" if trend['trend_score'] >= 40 else "🔴 弱势"
                print(f"{symbol:<10} {trend['trend_score']:>10} {trend['return_20d']:>9.1f}% {status:>15}")
        
        print("\n🌡️ 超买超卖:")
        print("-" * 70)
        for symbol in ['SPY', 'QQQ', 'IWM']:
            os_status = self.check_overbought_oversold(symbol)
            if os_status:
                print(f"{symbol}: RSI={os_status['rsi']:.1f} {os_status['status']}")
        
        print("\n💡 时机建议:")
        print("-" * 70)
        print("   • 趋势评分>70: 适合买入或持有")
        print("   • 趋势评分<40: 谨慎或减仓")
        print("   • RSI>70: 警惕回调")
        print("   • RSI<30: 关注反弹机会")
        
        print("\n" + "=" * 70)


def main():
    """主函数"""
    timing = MarketTiming()
    timing.generate_timing_report()


if __name__ == "__main__":
    main()
