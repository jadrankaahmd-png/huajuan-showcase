#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
形态识别器 - Pattern Recognition
作者：虾虾
创建时间：2026-02-08
用途：识别K线形态，发现反转和持续信号
"""

import yfinance as yf
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import sys


class PatternRecognition:
    """K线形态识别器"""
    
    def __init__(self, symbol):
        self.symbol = symbol
        self.data = None
        
    def fetch_data(self):
        """获取股票数据"""
        try:
            stock = yf.Ticker(self.symbol)
            self.data = stock.history(period="6mo")
            if len(self.data) < 20:
                print(f"⚠️ 数据不足")
                return False
            print(f"✅ 获取{self.symbol}数据成功")
            return True
        except Exception as e:
            print(f"❌ 获取{self.symbol}数据失败: {e}")
            return False
    
    def detect_candlestick_patterns(self):
        """识别单根K线形态"""
        if self.data is None:
            return []
        
        patterns = []
        df = self.data.copy()
        
        # 计算K线实体和影线
        df['body'] = df['Close'] - df['Open']
        df['body_size'] = abs(df['body'])
        df['upper_shadow'] = df['High'] - df[['Open', 'Close']].max(axis=1)
        df['lower_shadow'] = df[['Open', 'Close']].min(axis=1) - df['Low']
        df['total_range'] = df['High'] - df['Low']
        
        # 获取最新K线
        latest = df.iloc[-1]
        prev = df.iloc[-2] if len(df) > 1 else None
        
        # 1. 锤子线（Hammer）- 底部反转
        if (latest['lower_shadow'] > latest['body_size'] * 2 and 
            latest['upper_shadow'] < latest['body_size'] * 0.5 and
            latest['body_size'] < latest['total_range'] * 0.3):
            if latest['body'] > 0:
                patterns.append({
                    'name': '锤子线',
                    'type': 'bullish',
                    'signal': '底部反转',
                    'strength': '中等'
                })
            else:
                patterns.append({
                    'name': '倒锤子线',
                    'type': 'bearish',
                    'signal': '顶部反转',
                    'strength': '中等'
                })
        
        # 2. 十字星（Doji）
        if latest['body_size'] < latest['total_range'] * 0.1:
            patterns.append({
                'name': '十字星',
                'type': 'neutral',
                'signal': '犹豫不决',
                'strength': '弱'
            })
        
        # 3. 吞没形态（Engulfing）- 需要前一根K线
        if prev is not None:
            # 看涨吞没
            if (prev['body'] < 0 and latest['body'] > 0 and
                latest['Open'] < prev['Close'] and
                latest['Close'] > prev['Open']):
                patterns.append({
                    'name': '看涨吞没',
                    'type': 'bullish',
                    'signal': '强势反转',
                    'strength': '强'
                })
            
            # 看跌吞没
            if (prev['body'] > 0 and latest['body'] < 0 and
                latest['Open'] > prev['Close'] and
                latest['Close'] < prev['Open']):
                patterns.append({
                    'name': '看跌吞没',
                    'type': 'bearish',
                    'signal': '强势反转',
                    'strength': '强'
                })
            
            # 4. 晨星/暮星（需要3根K线）
            if len(df) >= 3:
                prev2 = df.iloc[-3]
                
                # 晨星（Morning Star）- 底部反转
                if (prev2['body'] < 0 and  # 第一根阴线
                    abs(prev['body']) < abs(prev2['body']) * 0.3 and  # 第二根小实体
                    latest['body'] > 0 and  # 第三根阳线
                    latest['Close'] > (prev2['Open'] + prev2['Close']) / 2):  # 收盘回到第一根中部
                    patterns.append({
                        'name': '晨星',
                        'type': 'bullish',
                        'signal': '底部反转',
                        'strength': '强'
                    })
                
                # 暮星（Evening Star）- 顶部反转
                if (prev2['body'] > 0 and  # 第一根阳线
                    abs(prev['body']) < abs(prev2['body']) * 0.3 and  # 第二根小实体
                    latest['body'] < 0 and  # 第三根阴线
                    latest['Close'] < (prev2['Open'] + prev2['Close']) / 2):  # 收盘回到第一根中部
                    patterns.append({
                        'name': '暮星',
                        'type': 'bearish',
                        'signal': '顶部反转',
                        'strength': '强'
                    })
        
        return patterns
    
    def detect_chart_patterns(self):
        """识别图表形态"""
        if self.data is None or len(self.data) < 30:
            return []
        
        patterns = []
        df = self.data.copy()
        
        # 计算均线
        df['sma20'] = df['Close'].rolling(20).mean()
        df['sma50'] = df['Close'].rolling(50).mean()
        
        # 获取最近数据
        recent = df.iloc[-20:]
        
        # 1. 双底（Double Bottom）- 简化检测
        lows = recent['Low'].values
        if len(lows) >= 10:
            # 寻找两个相似的低点
            for i in range(5, len(lows) - 5):
                for j in range(i + 5, len(lows)):
                    if abs(lows[i] - lows[j]) / lows[i] < 0.02:  # 2%误差
                        patterns.append({
                            'name': '双底形态（疑似）',
                            'type': 'bullish',
                            'signal': '底部反转',
                            'strength': '中等'
                        })
                        break
        
        # 2. 双顶（Double Top）- 简化检测
        highs = recent['High'].values
        if len(highs) >= 10:
            for i in range(5, len(highs) - 5):
                for j in range(i + 5, len(highs)):
                    if abs(highs[i] - highs[j]) / highs[i] < 0.02:  # 2%误差
                        patterns.append({
                            'name': '双顶形态（疑似）',
                            'type': 'bearish',
                            'signal': '顶部反转',
                            'strength': '中等'
                        })
                        break
        
        # 3. 上升通道/下降通道
        recent_20 = df.iloc[-20:]
        price_trend = np.polyfit(range(len(recent_20)), recent_20['Close'], 1)[0]
        
        if price_trend > recent_20['Close'].mean() * 0.005:  # 上升趋势
            patterns.append({
                'name': '上升通道',
                'type': 'bullish',
                'signal': '趋势持续',
                'strength': '中等'
            })
        elif price_trend < -recent_20['Close'].mean() * 0.005:  # 下降趋势
            patterns.append({
                'name': '下降通道',
                'type': 'bearish',
                'signal': '趋势持续',
                'strength': '中等'
            })
        
        # 4. 均线金叉/死叉
        if len(df) >= 2:
            if (df['sma20'].iloc[-2] < df['sma50'].iloc[-2] and
                df['sma20'].iloc[-1] > df['sma50'].iloc[-1]):
                patterns.append({
                    'name': '均线金叉',
                    'type': 'bullish',
                    'signal': '趋势转折',
                    'strength': '强'
                })
            elif (df['sma20'].iloc[-2] > df['sma50'].iloc[-2] and
                  df['sma20'].iloc[-1] < df['sma50'].iloc[-1]):
                patterns.append({
                    'name': '均线死叉',
                    'type': 'bearish',
                    'signal': '趋势转折',
                    'strength': '强'
                })
        
        return patterns
    
    def detect_support_resistance(self):
        """识别支撑阻力位"""
        if self.data is None:
            return None
        
        df = self.data.copy()
        
        # 使用最近20天的数据
        recent = df.iloc[-20:]
        
        # 简单支撑阻力计算
        support = recent['Low'].min()
        resistance = recent['High'].max()
        current = df['Close'].iloc[-1]
        
        # 计算距离支撑阻力的距离
        dist_to_support = (current - support) / current * 100
        dist_to_resistance = (resistance - current) / current * 100
        
        return {
            'support': support,
            'resistance': resistance,
            'current': current,
            'dist_to_support': dist_to_support,
            'dist_to_resistance': dist_to_resistance
        }
    
    def get_all_patterns(self):
        """获取所有识别到的形态"""
        candlestick = self.detect_candlestick_patterns()
        chart = self.detect_chart_patterns()
        support_resistance = self.detect_support_resistance()
        
        return {
            'candlestick': candlestick,
            'chart': chart,
            'support_resistance': support_resistance
        }
    
    def print_report(self):
        """打印形态识别报告"""
        print("\n" + "=" * 70)
        print(f"📈 {self.symbol} 形态识别报告")
        print("=" * 70)
        
        if not self.fetch_data():
            print("❌ 无法获取数据")
            return
        
        current_price = self.data['Close'][-1]
        print(f"\n💰 当前价格: ${current_price:.2f}")
        
        # K线形态
        candlestick_patterns = self.detect_candlestick_patterns()
        if candlestick_patterns:
            print(f"\n🕯️ 识别到的K线形态:")
            print("-" * 70)
            for pattern in candlestick_patterns:
                emoji = "🟢" if pattern['type'] == 'bullish' else "🔴" if pattern['type'] == 'bearish' else "⚪"
                print(f"   {emoji} {pattern['name']}")
                print(f"      信号: {pattern['signal']} | 强度: {pattern['strength']}")
        else:
            print(f"\n🕯️ K线形态: 未识别到明显形态")
        
        # 图表形态
        chart_patterns = self.detect_chart_patterns()
        if chart_patterns:
            print(f"\n📊 识别到的图表形态:")
            print("-" * 70)
            # 去重
            seen = set()
            for pattern in chart_patterns:
                if pattern['name'] not in seen:
                    seen.add(pattern['name'])
                    emoji = "🟢" if pattern['type'] == 'bullish' else "🔴"
                    print(f"   {emoji} {pattern['name']}")
                    print(f"      信号: {pattern['signal']} | 强度: {pattern['strength']}")
        else:
            print(f"\n📊 图表形态: 未识别到明显形态")
        
        # 支撑阻力
        sr = self.detect_support_resistance()
        if sr:
            print(f"\n🎯 支撑阻力位:")
            print("-" * 70)
            print(f"   阻力位: ${sr['resistance']:.2f} (距离 {sr['dist_to_resistance']:.1f}%)")
            print(f"   当前价: ${sr['current']:.2f}")
            print(f"   支撑位: ${sr['support']:.2f} (距离 {sr['dist_to_support']:.1f}%)")
            
            if sr['dist_to_resistance'] < 3:
                print(f"   ⚠️  接近阻力位，注意回调风险")
            elif sr['dist_to_support'] < 3:
                print(f"   ✅ 接近支撑位，可能反弹")
        
        # 综合判断
        all_patterns = self.get_all_patterns()
        bullish_count = sum(1 for p in all_patterns['candlestick'] + all_patterns['chart'] if p['type'] == 'bullish')
        bearish_count = sum(1 for p in all_patterns['candlestick'] + all_patterns['chart'] if p['type'] == 'bearish')
        
        print(f"\n📈 综合判断:")
        print("-" * 70)
        print(f"   看涨形态: {bullish_count}个")
        print(f"   看跌形态: {bearish_count}个")
        
        if bullish_count > bearish_count:
            print(f"   🟢 整体偏向看涨")
        elif bearish_count > bullish_count:
            print(f"   🔴 整体偏向看跌")
        else:
            print(f"   ⚪ 多空平衡")
        
        # 交易建议
        print(f"\n💡 交易建议:")
        print("-" * 70)
        
        if candlestick_patterns and any(p['strength'] == '强' for p in candlestick_patterns):
            strong_pattern = [p for p in candlestick_patterns if p['strength'] == '强'][0]
            if strong_pattern['type'] == 'bullish':
                print(f"   • 发现强看涨形态【{strong_pattern['name']}】，可考虑买入")
                print(f"   • 设置止损在支撑位下方")
            else:
                print(f"   • 发现强看跌形态【{strong_pattern['name']}】，考虑减仓")
                print(f"   • 关注是否跌破支撑位")
        
        if sr:
            if sr['dist_to_resistance'] < 5:
                print(f"   • 接近阻力位，谨慎追高")
            elif sr['dist_to_support'] < 5:
                print(f"   • 接近支撑位，关注反弹机会")
        
        print("=" * 70)
        print("\n⚠️ 注意：形态识别仅供参考，需结合其他指标确认")


def scan_multiple(symbols):
    """扫描多只股票"""
    print(f"\n🦐 批量扫描 {len(symbols)} 只股票的形态...")
    print("=" * 70)
    
    results = []
    
    for symbol in symbols:
        recognizer = PatternRecognition(symbol)
        if recognizer.fetch_data():
            patterns = recognizer.get_all_patterns()
            bullish = sum(1 for p in patterns['candlestick'] + patterns['chart'] if p['type'] == 'bullish')
            bearish = sum(1 for p in patterns['candlestick'] + patterns['chart'] if p['type'] == 'bearish')
            
            results.append({
                'symbol': symbol,
                'bullish': bullish,
                'bearish': bearish,
                'signal': '看涨' if bullish > bearish else '看跌' if bearish > bullish else '中性'
            })
        else:
            results.append({
                'symbol': symbol,
                'bullish': 0,
                'bearish': 0,
                'signal': '无数据'
            })
    
    # 按看涨形态数量排序
    results.sort(key=lambda x: x['bullish'], reverse=True)
    
    print(f"\n📈 形态扫描结果：")
    print("-" * 70)
    print(f"{'排名':<4} {'股票':<8} {'看涨':>6} {'看跌':>6} {'信号':<8}")
    print("-" * 70)
    
    for i, r in enumerate(results, 1):
        print(f"{i:<4} {r['symbol']:<8} {r['bullish']:>6} {r['bearish']:>6} {r['signal']:<8}")
    
    print("=" * 70)


def main():
    """主函数"""
    if len(sys.argv) < 2:
        print("🦐 形态识别器使用说明：")
        print("=" * 70)
        print("用法:")
        print("  单只股票: python pattern_recognition.py <股票代码>")
        print("  批量扫描: python pattern_recognition.py --scan <股票1> <股票2> ...")
        print("\n示例:")
        print("  python pattern_recognition.py AAPL")
        print("  python pattern_recognition.py --scan AAPL MSFT NVDA TSLA")
        sys.exit(1)
    
    if sys.argv[1] == '--scan':
        symbols = sys.argv[2:]
        scan_multiple(symbols)
    else:
        symbol = sys.argv[1]
        recognizer = PatternRecognition(symbol)
        recognizer.print_report()


if __name__ == "__main__":
    main()
