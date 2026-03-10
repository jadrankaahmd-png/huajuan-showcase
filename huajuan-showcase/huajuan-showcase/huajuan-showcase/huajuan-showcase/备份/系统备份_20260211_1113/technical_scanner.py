#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
技术指标扫描器 - Technical Indicator Scanner
作者：虾虾
创建时间：2026-02-08
用途：扫描股票的技术指标，识别买入/卖出信号
"""

import yfinance as yf
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import sys


class TechnicalScanner:
    """技术指标扫描器"""
    
    def __init__(self, symbol, period="6mo"):
        self.symbol = symbol
        self.period = period
        self.data = None
        self.signals = []
        
    def fetch_data(self):
        """获取股票数据"""
        try:
            stock = yf.Ticker(self.symbol)
            self.data = stock.history(period=self.period)
            if self.data.empty:
                raise ValueError(f"无法获取{self.symbol}的数据")
            return True
        except Exception as e:
            print(f"❌ 获取{self.symbol}数据失败: {e}")
            return False
    
    def calculate_sma(self, window):
        """计算简单移动平均线"""
        return self.data['Close'].rolling(window=window).mean()
    
    def calculate_ema(self, window):
        """计算指数移动平均线"""
        return self.data['Close'].ewm(span=window, adjust=False).mean()
    
    def calculate_rsi(self, period=14):
        """计算RSI指标"""
        delta = self.data['Close'].diff()
        gain = (delta.where(delta > 0, 0)).rolling(window=period).mean()
        loss = (-delta.where(delta < 0, 0)).rolling(window=period).mean()
        rs = gain / loss
        rsi = 100 - (100 / (1 + rs))
        return rsi
    
    def calculate_macd(self, fast=12, slow=26, signal=9):
        """计算MACD指标"""
        ema_fast = self.calculate_ema(fast)
        ema_slow = self.calculate_ema(slow)
        macd = ema_fast - ema_slow
        macd_signal = macd.ewm(span=signal, adjust=False).mean()
        macd_hist = macd - macd_signal
        return macd, macd_signal, macd_hist
    
    def calculate_bollinger_bands(self, window=20, num_std=2):
        """计算布林带"""
        sma = self.calculate_sma(window)
        std = self.data['Close'].rolling(window=window).std()
        upper = sma + (std * num_std)
        lower = sma - (std * num_std)
        return upper, sma, lower
    
    def calculate_stochastic(self, k_period=14, d_period=3):
        """计算随机指标（Stochastic Oscillator）"""
        low_min = self.data['Low'].rolling(window=k_period).min()
        high_max = self.data['High'].rolling(window=k_period).max()
        k = 100 * ((self.data['Close'] - low_min) / (high_max - low_min))
        d = k.rolling(window=d_period).mean()
        return k, d
    
    def calculate_atr(self, period=14):
        """计算ATR（Average True Range）"""
        high_low = self.data['High'] - self.data['Low']
        high_close = np.abs(self.data['High'] - self.data['Close'].shift())
        low_close = np.abs(self.data['Low'] - self.data['Close'].shift())
        ranges = pd.concat([high_low, high_close, low_close], axis=1)
        true_range = np.max(ranges, axis=1)
        atr = true_range.rolling(period).mean()
        return atr
    
    def scan_signals(self):
        """扫描所有技术指标信号"""
        if self.data is None:
            return []
        
        signals = []
        current_price = self.data['Close'][-1]
        
        # 1. 均线交叉信号
        sma_20 = self.calculate_sma(20)
        sma_50 = self.calculate_sma(50)
        
        if len(sma_20) > 1 and len(sma_50) > 1:
            # 金叉（20日均线上穿50日均线）
            if sma_20.iloc[-2] < sma_50.iloc[-2] and sma_20.iloc[-1] > sma_50.iloc[-1]:
                signals.append({
                    'indicator': 'SMA Crossover',
                    'signal': 'BUY',
                    'strength': 'Strong',
                    'description': '20日均线上穿50日均线（金叉）',
                    'price': current_price
                })
            # 死叉（20日均线下穿50日均线）
            elif sma_20.iloc[-2] > sma_50.iloc[-2] and sma_20.iloc[-1] < sma_50.iloc[-1]:
                signals.append({
                    'indicator': 'SMA Crossover',
                    'signal': 'SELL',
                    'strength': 'Strong',
                    'description': '20日均线下穿50日均线（死叉）',
                    'price': current_price
                })
        
        # 2. RSI信号
        rsi = self.calculate_rsi(14)
        current_rsi = rsi.iloc[-1]
        
        if current_rsi < 30:
            signals.append({
                'indicator': 'RSI',
                'signal': 'BUY',
                'strength': 'Medium',
                'description': f'RSI超卖（{current_rsi:.1f} < 30）',
                'price': current_price
            })
        elif current_rsi > 70:
            signals.append({
                'indicator': 'RSI',
                'signal': 'SELL',
                'strength': 'Medium',
                'description': f'RSI超买（{current_rsi:.1f} > 70）',
                'price': current_price
            })
        
        # 3. MACD信号
        macd, macd_signal, macd_hist = self.calculate_macd()
        
        if len(macd) > 1:
            # MACD金叉
            if macd.iloc[-2] < macd_signal.iloc[-2] and macd.iloc[-1] > macd_signal.iloc[-1]:
                signals.append({
                    'indicator': 'MACD',
                    'signal': 'BUY',
                    'strength': 'Strong',
                    'description': 'MACD上穿信号线（金叉）',
                    'price': current_price
                })
            # MACD死叉
            elif macd.iloc[-2] > macd_signal.iloc[-2] and macd.iloc[-1] < macd_signal.iloc[-1]:
                signals.append({
                    'indicator': 'MACD',
                    'signal': 'SELL',
                    'strength': 'Strong',
                    'description': 'MACD下穿信号线（死叉）',
                    'price': current_price
                })
        
        # 4. 布林带信号
        upper, middle, lower = self.calculate_bollinger_bands()
        
        if current_price < lower.iloc[-1]:
            signals.append({
                'indicator': 'Bollinger Bands',
                'signal': 'BUY',
                'strength': 'Medium',
                'description': '价格跌破下轨（超卖反弹）',
                'price': current_price
            })
        elif current_price > upper.iloc[-1]:
            signals.append({
                'indicator': 'Bollinger Bands',
                'signal': 'SELL',
                'strength': 'Medium',
                'description': '价格突破上轨（超买回调）',
                'price': current_price
            })
        
        # 5. 随机指标信号
        k, d = self.calculate_stochastic()
        
        if len(k) > 1 and len(d) > 1:
            current_k = k.iloc[-1]
            current_d = d.iloc[-1]
            
            if current_k < 20 and current_d < 20:
                signals.append({
                    'indicator': 'Stochastic',
                    'signal': 'BUY',
                    'strength': 'Medium',
                    'description': f'K线({current_k:.1f})和D线({current_d:.1f})均超卖区',
                    'price': current_price
                })
            elif current_k > 80 and current_d > 80:
                signals.append({
                    'indicator': 'Stochastic',
                    'signal': 'SELL',
                    'strength': 'Medium',
                    'description': f'K线({current_k:.1f})和D线({current_d:.1f})均超买区',
                    'price': current_price
                })
        
        self.signals = signals
        return signals
    
    def get_trend_analysis(self):
        """趋势分析"""
        if self.data is None or len(self.data) < 50:
            return None
        
        current_price = self.data['Close'][-1]
        sma_20 = self.calculate_sma(20).iloc[-1]
        sma_50 = self.calculate_sma(50).iloc[-1]
        
        # 判断趋势
        if current_price > sma_20 > sma_50:
            trend = "上升趋势"
            trend_strength = "Strong"
        elif current_price < sma_20 < sma_50:
            trend = "下降趋势"
            trend_strength = "Strong"
        elif current_price > sma_50:
            trend = "震荡偏强"
            trend_strength = "Medium"
        else:
            trend = "震荡偏弱"
            trend_strength = "Medium"
        
        return {
            'current_price': current_price,
            'sma_20': sma_20,
            'sma_50': sma_50,
            'trend': trend,
            'trend_strength': trend_strength
        }
    
    def get_support_resistance(self):
        """计算支撑和阻力位"""
        if self.data is None:
            return None
        
        # 使用近期高低点
        recent_data = self.data.tail(20)
        
        support = recent_data['Low'].min()
        resistance = recent_data['High'].max()
        
        current_price = self.data['Close'][-1]
        
        # 距离支撑/阻力的距离
        distance_to_support = (current_price - support) / current_price * 100
        distance_to_resistance = (resistance - current_price) / current_price * 100
        
        return {
            'support': support,
            'resistance': resistance,
            'distance_to_support': distance_to_support,
            'distance_to_resistance': distance_to_resistance
        }
    
    def print_report(self):
        """打印技术分析报告"""
        print("\n" + "=" * 70)
        print(f"🦐 {self.symbol} 技术分析报告")
        print("=" * 70)
        
        # 趋势分析
        trend = self.get_trend_analysis()
        if trend:
            print(f"\n📈 趋势分析：")
            print("-" * 70)
            print(f"  当前价格: ${trend['current_price']:.2f}")
            print(f"  20日均线: ${trend['sma_20']:.2f}")
            print(f"  50日均线: ${trend['sma_50']:.2f}")
            print(f"  趋势判断: {trend['trend']} ({trend['trend_strength']})")
        
        # 支撑阻力
        sr = self.get_support_resistance()
        if sr:
            print(f"\n🎯 支撑与阻力：")
            print("-" * 70)
            print(f"  支撑位: ${sr['support']:.2f} (距离: {sr['distance_to_support']:.1f}%)")
            print(f"  阻力位: ${sr['resistance']:.2f} (距离: {sr['distance_to_resistance']:.1f}%)")
        
        # 技术指标信号
        signals = self.scan_signals()
        
        if signals:
            print(f"\n⚡ 技术指标信号：")
            print("-" * 70)
            
            buy_signals = [s for s in signals if s['signal'] == 'BUY']
            sell_signals = [s for s in signals if s['signal'] == 'SELL']
            
            if buy_signals:
                print(f"\n  🟢 买入信号 ({len(buy_signals)}个):")
                for sig in buy_signals:
                    print(f"    • {sig['indicator']}: {sig['description']} [强度: {sig['strength']}]")
            
            if sell_signals:
                print(f"\n  🔴 卖出信号 ({len(sell_signals)}个):")
                for sig in sell_signals:
                    print(f"    • {sig['indicator']}: {sig['description']} [强度: {sig['strength']}]")
        else:
            print(f"\n⚡ 技术指标信号：")
            print("-" * 70)
            print("  暂无明确信号（震荡整理中）")
        
        # 综合建议
        buy_count = len([s for s in signals if s['signal'] == 'BUY'])
        sell_count = len([s for s in signals if s['signal'] == 'SELL'])
        
        print(f"\n🎯 综合建议：")
        print("-" * 70)
        
        if buy_count > sell_count and buy_count >= 2:
            recommendation = "🟢 看多 - 买入信号占优"
        elif sell_count > buy_count and sell_count >= 2:
            recommendation = "🔴 看空 - 卖出信号占优"
        else:
            recommendation = "🟡 观望 - 信号不明确"
        
        print(f"  {recommendation}")
        print(f"  买入信号: {buy_count}个 | 卖出信号: {sell_count}个")
        
        print("=" * 70)


def scan_multiple_stocks(symbols):
    """扫描多只股票"""
    print(f"\n🦐 批量扫描 {len(symbols)} 只股票...")
    print("=" * 70)
    
    results = []
    
    for symbol in symbols:
        print(f"\n分析 {symbol}...")
        scanner = TechnicalScanner(symbol)
        
        if scanner.fetch_data():
            signals = scanner.scan_signals()
            trend = scanner.get_trend_analysis()
            
            buy_count = len([s for s in signals if s['signal'] == 'BUY'])
            sell_count = len([s for s in signals if s['signal'] == 'SELL'])
            
            results.append({
                'symbol': symbol,
                'price': trend['current_price'] if trend else 0,
                'trend': trend['trend'] if trend else 'Unknown',
                'buy_signals': buy_count,
                'sell_signals': sell_count,
                'recommendation': 'BUY' if buy_count > sell_count and buy_count >= 2 else 
                                 'SELL' if sell_count > buy_count and sell_count >= 2 else 'HOLD'
            })
    
    # 汇总报告
    print("\n" + "=" * 70)
    print("📊 批量扫描汇总")
    print("=" * 70)
    print(f"\n{'股票':<8} {'价格':<10} {'趋势':<12} {'买入':<6} {'卖出':<6} {'建议':<8}")
    print("-" * 70)
    
    for r in results:
        print(f"{r['symbol']:<8} ${r['price']:<9.2f} {r['trend']:<12} {r['buy_signals']:<6} {r['sell_signals']:<6} {r['recommendation']:<8}")
    
    print("=" * 70)
    
    # 输出推荐买入列表
    buy_list = [r for r in results if r['recommendation'] == 'BUY']
    if buy_list:
        print(f"\n🟢 推荐关注 ({len(buy_list)}只):")
        for r in buy_list:
            print(f"  • {r['symbol']} - {r['trend']} ({r['buy_signals']}个买入信号)")


def main():
    """主函数"""
    if len(sys.argv) < 2:
        print("🦐 技术指标扫描器使用说明：")
        print("=" * 70)
        print("用法:")
        print("  单只股票: python technical_scanner.py <股票代码>")
        print("  多只股票: python technical_scanner.py --scan <股票1> <股票2> ...")
        print("\n示例:")
        print("  python technical_scanner.py AAPL")
        print("  python technical_scanner.py --scan AAPL MSFT GOOGL NVDA TSLA")
        sys.exit(1)
    
    if sys.argv[1] == '--scan':
        symbols = sys.argv[2:]
        scan_multiple_stocks(symbols)
    else:
        symbol = sys.argv[1]
        scanner = TechnicalScanner(symbol)
        
        if scanner.fetch_data():
            scanner.print_report()


if __name__ == "__main__":
    main()
