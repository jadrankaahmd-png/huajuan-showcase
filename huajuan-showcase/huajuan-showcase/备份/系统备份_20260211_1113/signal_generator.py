#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
量化信号生成器 - Signal Generator
作者：虾虾
创建时间：2026-02-09
用途：多指标共振信号（RSI+MACD+均线）、突破/跌破警报、量化选股（价值/成长/动量）
"""

import os
import sys
import json
import yfinance as yf
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from typing import List, Dict, Optional, Tuple


class SignalGenerator:
    """
    量化信号生成器
    
    功能：
    1. 多指标共振信号（RSI + MACD + 均线）
    2. 突破/跌破警报
    3. 量化选股（价值/成长/动量）
    4. 生成买卖信号
    """
    
    def __init__(self):
        # 数据目录
        self.data_dir = os.path.expanduser("~/.openclaw/workspace/信号数据")
        os.makedirs(self.data_dir, exist_ok=True)
        
        # 监控股票池
        self.watchlist = {
            'AI半导体': ['NVDA', 'AMD', 'AVGO', 'QCOM', 'MU', 'SMCI'],
            '科技巨头': ['AAPL', 'MSFT', 'GOOGL', 'META', 'AMZN', 'NFLX'],
            'AI应用': ['CRWV', 'PLTR', 'SNOW', 'NET'],
            '其他': ['TSLA', 'COIN', 'ARM']
        }
        
        print("🦐 量化信号生成器启动")
        print(f"📊 监控股票池: {sum(len(v) for v in self.watchlist.values())} 只股票")
        print("="*70)
    
    def calculate_rsi(self, prices: pd.Series, period: int = 14) -> float:
        """计算RSI"""
        delta = prices.diff()
        gain = (delta.where(delta > 0, 0)).rolling(window=period).mean()
        loss = (-delta.where(delta < 0, 0)).rolling(window=period).mean()
        rs = gain / loss
        rsi = 100 - (100 / (1 + rs))
        return rsi.iloc[-1]
    
    def calculate_macd(self, prices: pd.Series) -> Dict:
        """计算MACD"""
        ema12 = prices.ewm(span=12).mean()
        ema26 = prices.ewm(span=26).mean()
        macd = ema12 - ema26
        signal = macd.ewm(span=9).mean()
        histogram = macd - signal
        
        return {
            'macd': macd.iloc[-1],
            'signal': signal.iloc[-1],
            'histogram': histogram.iloc[-1],
            'trend': 'bullish' if macd.iloc[-1] > signal.iloc[-1] else 'bearish'
        }
    
    def calculate_ma(self, prices: pd.Series) -> Dict:
        """计算均线系统"""
        ma5 = prices.rolling(window=5).mean().iloc[-1]
        ma10 = prices.rolling(window=10).mean().iloc[-1]
        ma20 = prices.rolling(window=20).mean().iloc[-1]
        ma50 = prices.rolling(window=50).mean().iloc[-1]
        ma200 = prices.rolling(window=200).mean().iloc[-1]
        
        current_price = prices.iloc[-1]
        
        # 判断趋势
        trend = 'uptrend' if current_price > ma20 > ma50 else (
            'downtrend' if current_price < ma20 < ma50 else 'sideways'
        )
        
        # 均线排列
        if ma5 > ma10 > ma20 > ma50:
            ma_arrangement = 'bullish_aligned'
        elif ma5 < ma10 < ma20 < ma50:
            ma_arrangement = 'bearish_aligned'
        else:
            ma_arrangement = 'mixed'
        
        return {
            'ma5': ma5,
            'ma10': ma10,
            'ma20': ma20,
            'ma50': ma50,
            'ma200': ma200,
            'current_price': current_price,
            'trend': trend,
            'ma_arrangement': ma_arrangement
        }
    
    def generate_multi_indicator_signal(self, symbol: str) -> Dict:
        """
        生成多指标共振信号
        
        综合指标：
        - RSI（超买超卖）
        - MACD（趋势动量）
        - 均线系统（趋势方向）
        
        信号级别：
        - Strong Buy: 3个指标全部看涨
        - Buy: 2个指标看涨
        - Neutral: 混合信号
        - Sell: 2个指标看跌
        - Strong Sell: 3个指标全部看跌
        """
        print(f"\n🔍 分析 {symbol} 多指标共振...")
        
        try:
            # 获取数据
            ticker = yf.Ticker(symbol)
            hist = ticker.history(period="6mo")
            
            if hist.empty or len(hist) < 50:
                return {'symbol': symbol, 'error': '数据不足'}
            
            prices = hist['Close']
            
            # 计算指标
            rsi = self.calculate_rsi(prices)
            macd = self.calculate_macd(prices)
            ma = self.calculate_ma(prices)
            
            # RSI信号
            rsi_signal = 'oversold' if rsi < 30 else ('overbought' if rsi > 70 else 'neutral')
            rsi_bullish = rsi < 50  # RSI在50以下为潜在看涨（超卖反弹）
            
            # MACD信号
            macd_bullish = macd['trend'] == 'bullish' and macd['histogram'] > 0
            
            # 均线信号
            ma_bullish = ma['trend'] == 'uptrend' and ma['ma_arrangement'] == 'bullish_aligned'
            
            # 统计看涨指标数量
            bullish_count = sum([rsi_bullish, macd_bullish, ma_bullish])
            
            # 生成综合信号
            if bullish_count == 3:
                overall_signal = 'STRONG_BUY'
                confidence = 'high'
            elif bullish_count == 2:
                overall_signal = 'BUY'
                confidence = 'medium'
            elif bullish_count == 1:
                overall_signal = 'NEUTRAL'
                confidence = 'low'
            else:
                overall_signal = 'SELL'
                confidence = 'medium'
            
            # 检查突破信号
            breakout = self.detect_breakout(prices, hist['High'], hist['Low'])
            
            return {
                'symbol': symbol,
                'timestamp': datetime.now().isoformat(),
                'overall_signal': overall_signal,
                'confidence': confidence,
                'bullish_indicators': bullish_count,
                'indicators': {
                    'rsi': {
                        'value': round(rsi, 2),
                        'signal': rsi_signal,
                        'bullish': rsi_bullish
                    },
                    'macd': {
                        'value': round(macd['macd'], 4),
                        'signal': macd['trend'],
                        'histogram': round(macd['histogram'], 4),
                        'bullish': macd_bullish
                    },
                    'ma': {
                        'ma20': round(ma['ma20'], 2),
                        'ma50': round(ma['ma50'], 2),
                        'trend': ma['trend'],
                        'arrangement': ma['ma_arrangement'],
                        'bullish': ma_bullish
                    }
                },
                'breakout': breakout,
                'current_price': round(ma['current_price'], 2)
            }
            
        except Exception as e:
            print(f"  ❌ 分析失败: {e}")
            return {'symbol': symbol, 'error': str(e)}
    
    def detect_breakout(self, prices: pd.Series, highs: pd.Series, 
                       lows: pd.Series, lookback: int = 20) -> Dict:
        """
        检测突破/跌破信号
        
        Args:
            prices: 收盘价
            highs: 最高价
            lows: 最低价
            lookback: 回看周期
        
        Returns:
            突破信号
        """
        current_price = prices.iloc[-1]
        
        # 计算支撑阻力位
        resistance = highs[-lookback:].max()
        support = lows[-lookback:].min()
        
        # 突破检测
        breakout_up = current_price > resistance * 0.99  # 突破阻力（允许1%误差）
        breakout_down = current_price < support * 1.01   # 跌破支撑
        
        # 判断突破强度
        if breakout_up:
            strength = 'strong' if current_price > resistance * 1.02 else 'weak'
            return {
                'type': 'breakout_up',
                'signal': '向上突破',
                'strength': strength,
                'resistance': round(resistance, 2),
                'current_price': round(current_price, 2),
                'breakout_pct': round((current_price - resistance) / resistance * 100, 2)
            }
        elif breakout_down:
            strength = 'strong' if current_price < support * 0.98 else 'weak'
            return {
                'type': 'breakout_down',
                'signal': '向下跌破',
                'strength': strength,
                'support': round(support, 2),
                'current_price': round(current_price, 2),
                'breakout_pct': round((support - current_price) / support * 100, 2)
            }
        
        return {
            'type': 'none',
            'signal': '无突破',
            'resistance': round(resistance, 2),
            'support': round(support, 2),
            'current_price': round(current_price, 2)
        }
    
    def screen_stocks(self, criteria: str = 'momentum', limit: int = 10) -> List[Dict]:
        """
        量化选股
        
        Args:
            criteria: 选股标准 (value/growth/momentum/quality)
            limit: 返回数量
        
        Returns:
            选股结果
        """
        print(f"\n🔍 执行{criteria}选股...")
        
        all_stocks = []
        for category, stocks in self.watchlist.items():
            all_stocks.extend(stocks)
        
        results = []
        
        for symbol in all_stocks:
            try:
                # 获取基本信息
                ticker = yf.Ticker(symbol)
                info = ticker.info
                
                stock_data = {
                    'symbol': symbol,
                    'name': info.get('shortName', symbol),
                    'sector': info.get('sector', 'Unknown'),
                    'market_cap': info.get('marketCap', 0)
                }
                
                # 根据不同标准筛选
                if criteria == 'momentum':
                    # 动量：近1月涨幅 + RSI
                    hist = ticker.history(period="1mo")
                    if not hist.empty:
                        momentum = (hist['Close'].iloc[-1] - hist['Close'].iloc[0]) / hist['Close'].iloc[0]
                        rsi = self.calculate_rsi(hist['Close'])
                        
                        stock_data['momentum'] = momentum
                        stock_data['rsi'] = rsi
                        stock_data['score'] = momentum * 100 + (50 - abs(rsi - 50))  # 动量 + RSI适中
                
                elif criteria == 'value':
                    # 价值：低PE + 高ROE
                    pe = info.get('trailingPE', 999)
                    roe = info.get('returnOnEquity', 0)
                    
                    stock_data['pe'] = pe
                    stock_data['roe'] = roe
                    stock_data['score'] = (30 - min(pe, 30)) + roe * 100 if roe else 0
                
                elif criteria == 'growth':
                    # 成长：高营收增长 + 高利润增长
                    revenue_growth = info.get('revenueGrowth', 0)
                    earnings_growth = info.get('earningsGrowth', 0)
                    
                    stock_data['revenue_growth'] = revenue_growth
                    stock_data['earnings_growth'] = earnings_growth
                    stock_data['score'] = (revenue_growth or 0) + (earnings_growth or 0)
                
                results.append(stock_data)
                
            except Exception as e:
                continue
        
        # 排序并返回前limit个
        results.sort(key=lambda x: x.get('score', 0), reverse=True)
        return results[:limit]
    
    def scan_all_signals(self) -> Dict:
        """
        扫描所有股票的信号
        
        Returns:
            所有信号汇总
        """
        print("\n🔄 扫描所有股票信号...")
        print("="*70)
        
        all_signals = {
            'strong_buy': [],
            'buy': [],
            'neutral': [],
            'sell': [],
            'breakouts': [],
            'timestamp': datetime.now().isoformat()
        }
        
        all_stocks = []
        for category, stocks in self.watchlist.items():
            all_stocks.extend([(s, category) for s in stocks])
        
        for symbol, category in all_stocks:
            signal = self.generate_multi_indicator_signal(symbol)
            
            if 'error' in signal:
                continue
            
            # 分类
            overall = signal['overall_signal']
            if overall == 'STRONG_BUY':
                all_signals['strong_buy'].append({
                    'symbol': symbol,
                    'category': category,
                    'confidence': signal['confidence'],
                    'price': signal['current_price']
                })
            elif overall == 'BUY':
                all_signals['buy'].append({
                    'symbol': symbol,
                    'category': category,
                    'confidence': signal['confidence'],
                    'price': signal['current_price']
                })
            elif overall == 'SELL':
                all_signals['sell'].append({
                    'symbol': symbol,
                    'category': category,
                    'confidence': signal['confidence'],
                    'price': signal['current_price']
                })
            
            # 突破信号
            if signal['breakout']['type'] != 'none':
                all_signals['breakouts'].append({
                    'symbol': symbol,
                    'category': category,
                    'breakout': signal['breakout'],
                    'price': signal['current_price']
                })
        
        return all_signals
    
    def generate_signal_report(self) -> str:
        """生成信号报告"""
        report = []
        report.append("="*70)
        report.append("📊 量化信号生成报告")
        report.append(f"生成时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        report.append("="*70)
        
        # 扫描所有信号
        signals = self.scan_all_signals()
        
        # 1. 强烈买入信号
        if signals['strong_buy']:
            report.append("\n## 🚀 强烈买入信号 (STRONG BUY)\n")
            for item in signals['strong_buy']:
                report.append(f"✅ {item['symbol']} ({item['category']}) - ${item['price']}")
                report.append(f"   置信度: {item['confidence']}")
        
        # 2. 买入信号
        if signals['buy']:
            report.append("\n## 📈 买入信号 (BUY)\n")
            for item in signals['buy']:
                report.append(f"🟢 {item['symbol']} ({item['category']}) - ${item['price']}")
                report.append(f"   置信度: {item['confidence']}")
        
        # 3. 突破信号
        if signals['breakouts']:
            report.append("\n## 💥 突破警报\n")
            for item in signals['breakouts']:
                b = item['breakout']
                emoji = "🚀" if b['type'] == 'breakout_up' else "📉"
                report.append(f"{emoji} {item['symbol']} - {b['signal']} ({b['strength']})")
                report.append(f"   当前价: ${item['price']}")
                if b['type'] != 'none':
                    report.append(f"   突破幅度: {b['breakout_pct']}%")
        
        # 4. 选股推荐
        report.append("\n## 🎯 量化选股推荐\n")
        
        # 动量选股
        momentum_picks = self.screen_stocks('momentum', 5)
        report.append("\n### 动量最强 (Momentum)\n")
        for i, stock in enumerate(momentum_picks, 1):
            report.append(f"{i}. {stock['symbol']} - 1月动量: {stock.get('momentum', 0)*100:+.1f}%")
        
        # 价值选股
        value_picks = self.screen_stocks('value', 3)
        report.append("\n### 价值最优 (Value)\n")
        for i, stock in enumerate(value_picks, 1):
            report.append(f"{i}. {stock['symbol']} - PE: {stock.get('pe', 'N/A'):.1f}")
        
        # 5. 操作建议
        report.append("\n## 💡 量化交易建议\n")
        report.append("1. 优先考虑强烈买入信号 (3个指标共振)")
        report.append("2. 突破信号需确认成交量配合")
        report.append("3. RSI < 30 考虑超跌反弹机会")
        report.append("4. 均线多头排列时顺势操作")
        report.append("5. 设置止损: 跌破MA20或支撑位")
        
        report.append("\n" + "="*70)
        
        return "\n".join(report)
    
    def save_report(self, report: str, filename: str = None):
        """保存报告"""
        if filename is None:
            filename = f"signals_{datetime.now().strftime('%Y%m%d_%H%M')}.md"
        
        filepath = os.path.join(self.data_dir, filename)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(report)
        
        print(f"\n💾 报告已保存: {filepath}")
        return filepath


def main():
    """主函数"""
    import argparse
    
    parser = argparse.ArgumentParser(
        description='虾虾量化信号生成器',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
使用示例:
  # 分析特定股票信号
  python3 signal_generator.py --symbol NVDA
  
  # 扫描所有股票
  python3 signal_generator.py --scan
  
  # 动量选股
  python3 signal_generator.py --screen momentum
  
  # 价值选股
  python3 signal_generator.py --screen value
  
  # 生成综合报告
  python3 signal_generator.py --report
        """
    )
    
    parser.add_argument('--symbol', '-s', type=str,
                       help='分析特定股票')
    parser.add_argument('--scan', action='store_true',
                       help='扫描所有股票')
    parser.add_argument('--screen', type=str,
                       choices=['momentum', 'value', 'growth'],
                       help='选股标准')
    parser.add_argument('--report', '-r', action='store_true',
                       help='生成综合报告')
    
    args = parser.parse_args()
    
    generator = SignalGenerator()
    
    if args.symbol:
        signal = generator.generate_multi_indicator_signal(args.symbol)
        print(json.dumps(signal, indent=2, ensure_ascii=False))
    
    elif args.scan:
        signals = generator.scan_all_signals()
        print(f"\n强烈买入: {len(signals['strong_buy'])} 只")
        print(f"买入: {len(signals['buy'])} 只")
        print(f"突破: {len(signals['breakouts'])} 只")
    
    elif args.screen:
        results = generator.screen_stocks(args.screen, 10)
        print(f"\n🎯 {args.screen}选股结果:")
        print("="*70)
        for i, stock in enumerate(results, 1):
            print(f"{i}. {stock['symbol']} - Score: {stock.get('score', 0):.2f}")
    
    elif args.report:
        report = generator.generate_signal_report()
        print(report)
        generator.save_report(report)
    
    else:
        print("🦐 虾虾量化信号生成器")
        print("="*70)
        print("\n使用方法:")
        print("  --symbol SYMBOL    分析特定股票")
        print("  --scan             扫描所有股票")
        print("  --screen TYPE      选股 (momentum/value/growth)")
        print("  --report           生成综合报告")
        print("\n详细帮助:")
        print("  python3 signal_generator.py --help")


if __name__ == "__main__":
    main()
