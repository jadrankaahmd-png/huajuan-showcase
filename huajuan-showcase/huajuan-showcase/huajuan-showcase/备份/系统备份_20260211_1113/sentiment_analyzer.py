#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
情绪分析器 - Sentiment Analyzer
作者：虾虾
创建时间：2026-02-08
用途：分析市场情绪，识别恐慌/贪婪指数，辅助投资决策
"""

import yfinance as yf
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import sys


class SentimentAnalyzer:
    """市场情绪分析器"""
    
    def __init__(self, symbol=None):
        self.symbol = symbol
        self.data = None
        self.vix_data = None
        
    def fetch_data(self):
        """获取股票数据"""
        if self.symbol is None:
            return True
        
        try:
            stock = yf.Ticker(self.symbol)
            self.data = stock.history(period="3mo")
            print(f"✅ 获取{self.symbol}数据成功")
            return True
        except Exception as e:
            print(f"❌ 获取{self.symbol}数据失败: {e}")
            return False
    
    def fetch_vix(self):
        """获取VIX数据（恐慌指数）"""
        try:
            vix = yf.Ticker("^VIX")
            self.vix_data = vix.history(period="1mo")
            return True
        except Exception as e:
            print(f"⚠️ 获取VIX数据失败: {e}")
            return False
    
    def calculate_price_momentum(self):
        """计算价格动量情绪"""
        if self.data is None or len(self.data) < 20:
            return None
        
        # 计算各种动量指标
        current_price = self.data['Close'][-1]
        
        # 与不同周期均线比较
        sma_5 = self.data['Close'].rolling(5).mean().iloc[-1]
        sma_10 = self.data['Close'].rolling(10).mean().iloc[-1]
        sma_20 = self.data['Close'].rolling(20).mean().iloc[-1]
        
        # 计算RSI
        delta = self.data['Close'].diff()
        gain = (delta.where(delta > 0, 0)).rolling(window=14).mean()
        loss = (-delta.where(delta < 0, 0)).rolling(window=14).mean()
        rs = gain / loss
        rsi = 100 - (100 / (1 + rs))
        current_rsi = rsi.iloc[-1]
        
        # 评分（0-100，越高越贪婪）
        score = 50
        
        # RSI贡献（30-70范围）
        if current_rsi > 70:
            score += 20
        elif current_rsi > 60:
            score += 10
        elif current_rsi < 30:
            score -= 20
        elif current_rsi < 40:
            score -= 10
        
        # 均线位置贡献
        if current_price > sma_5 > sma_10 > sma_20:
            score += 15  # 强势多头排列
        elif current_price < sma_5 < sma_10 < sma_20:
            score -= 15  # 弱势空头排列
        
        # 限制范围
        score = max(0, min(100, score))
        
        return {
            'score': score,
            'rsi': current_rsi,
            'price_vs_sma5': (current_price / sma_5 - 1) * 100,
            'price_vs_sma20': (current_price / sma_20 - 1) * 100
        }
    
    def calculate_volume_sentiment(self):
        """计算成交量情绪"""
        if self.data is None or len(self.data) < 20:
            return None
        
        # 计算成交量变化
        current_vol = self.data['Volume'][-1]
        avg_vol_20 = self.data['Volume'].rolling(20).mean().iloc[-1]
        avg_vol_5 = self.data['Volume'].rolling(5).mean().iloc[-1]
        
        vol_ratio = current_vol / avg_vol_20 if avg_vol_20 > 0 else 1
        
        # 计算量价关系
        price_change = (self.data['Close'][-1] / self.data['Close'][-2] - 1) * 100
        
        # 放量上涨 = 贪婪，放量下跌 = 恐慌
        if vol_ratio > 1.5:
            if price_change > 0:
                sentiment = "🟢 放量上涨 - 贪婪"
                score = 75
            else:
                sentiment = "🔴 放量下跌 - 恐慌"
                score = 25
        elif vol_ratio < 0.7:
            sentiment = "⚪ 缩量 - 观望"
            score = 50
        else:
            sentiment = "🟡 正常成交量"
            score = 50 + (price_change * 2)  # 价格变化小幅影响
        
        return {
            'score': max(0, min(100, score)),
            'volume_ratio': vol_ratio,
            'sentiment': sentiment
        }
    
    def calculate_volatility_sentiment(self):
        """计算波动率情绪"""
        if self.data is None or len(self.data) < 20:
            return None
        
        # 计算历史波动率
        returns = self.data['Close'].pct_change().dropna()
        current_vol = returns.rolling(20).std().iloc[-1] * np.sqrt(252) * 100
        
        # 波动率分位数
        vol_history = returns.rolling(20).std().dropna() * np.sqrt(252) * 100
        vol_percentile = np.percentile(vol_history, [10, 25, 75, 90])
        
        if current_vol > vol_percentile[3]:  # >90%
            sentiment = "🔴 极高波动 - 恐慌"
            score = 20
        elif current_vol > vol_percentile[2]:  # >75%
            sentiment = "🟠 高波动 - 焦虑"
            score = 35
        elif current_vol < vol_percentile[0]:  # <10%
            sentiment = "🟢 极低波动 - 贪婪/麻木"
            score = 80
        elif current_vol < vol_percentile[1]:  # <25%
            sentiment = "🟡 低波动 - 平静"
            score = 60
        else:
            sentiment = "⚪ 正常波动"
            score = 50
        
        return {
            'score': score,
            'volatility': current_vol,
            'sentiment': sentiment
        }
    
    def get_vix_sentiment(self):
        """获取VIX情绪"""
        if not self.fetch_vix():
            return None
        
        current_vix = self.vix_data['Close'][-1]
        
        # VIX解读
        if current_vix > 30:
            sentiment = "🔴 极度恐慌 - 市场处于危机"
            score = 10
        elif current_vix > 25:
            sentiment = "🟠 高恐慌 - 市场焦虑"
            score = 25
        elif current_vix > 20:
            sentiment = "🟡 轻度担忧 - 正常偏高"
            score = 40
        elif current_vix > 15:
            sentiment = "⚪ 正常 - 市场平静"
            score = 50
        else:
            sentiment = "🟢 贪婪/自满 - 市场过于乐观"
            score = 80
        
        return {
            'vix': current_vix,
            'sentiment': sentiment,
            'score': score
        }
    
    def calculate_overall_sentiment(self):
        """计算综合情绪指数"""
        price_momentum = self.calculate_price_momentum()
        volume_sentiment = self.calculate_volume_sentiment()
        volatility_sentiment = self.calculate_volatility_sentiment()
        vix_sentiment = self.get_vix_sentiment()
        
        # 加权计算（0-100，0=极度恐慌，100=极度贪婪）
        weights = {
            'price': 0.30,
            'volume': 0.20,
            'volatility': 0.20,
            'vix': 0.30
        }
        
        overall_score = 50  # 默认值
        
        if price_momentum:
            overall_score += price_momentum['score'] * weights['price']
        if volume_sentiment:
            overall_score += volume_sentiment['score'] * weights['volume']
        if volatility_sentiment:
            overall_score += volatility_sentiment['score'] * weights['volatility']
        if vix_sentiment:
            overall_score += vix_sentiment['score'] * weights['vix']
        
        overall_score = max(0, min(100, overall_score))
        
        # 情绪分级
        if overall_score >= 80:
            level = "极度贪婪"
            color = "🔴"
            advice = "考虑减仓，市场可能过热"
        elif overall_score >= 60:
            level = "贪婪"
            color = "🟠"
            advice = "保持谨慎，适当获利了结"
        elif overall_score >= 40:
            level = "中性"
            color = "🟡"
            advice = "正常交易，保持观察"
        elif overall_score >= 20:
            level = "恐惧"
            color = "🟠"
            advice = "可能是买入机会，关注支撑"
        else:
            level = "极度恐惧"
            color = "🔴"
            advice = "恐慌中可能有机会，谨慎抄底"
        
        return {
            'overall_score': overall_score,
            'level': level,
            'color': color,
            'advice': advice,
            'components': {
                'price_momentum': price_momentum,
                'volume_sentiment': volume_sentiment,
                'volatility_sentiment': volatility_sentiment,
                'vix_sentiment': vix_sentiment
            }
        }
    
    def print_report(self):
        """打印情绪分析报告"""
        print("\n" + "=" * 70)
        
        if self.symbol:
            print(f"😊 {self.symbol} 情绪分析报告")
        else:
            print("😊 市场情绪分析报告")
        
        print("=" * 70)
        
        if not self.fetch_data() and self.symbol:
            print("❌ 无法获取数据")
            return
        
        # 综合情绪
        overall = self.calculate_overall_sentiment()
        
        print(f"\n🎯 综合情绪指数:")
        print("-" * 70)
        print(f"   {overall['color']} {overall['level']}")
        print(f"   情绪得分: {overall['overall_score']:.0f}/100")
        print(f"   💡 建议: {overall['advice']}")
        
        # 各分项
        print(f"\n📊 情绪分项指标:")
        print("-" * 70)
        
        components = overall['components']
        
        if components['price_momentum']:
            pm = components['price_momentum']
            print(f"   价格动量: {pm['score']:.0f}/100 (RSI: {pm['rsi']:.1f})")
        
        if components['volume_sentiment']:
            vs = components['volume_sentiment']
            print(f"   成交量情绪: {vs['score']:.0f}/100")
            print(f"   {vs['sentiment']}")
        
        if components['volatility_sentiment']:
            vols = components['volatility_sentiment']
            print(f"   波动率情绪: {vols['score']:.0f}/100")
            print(f"   {vols['sentiment']} (波动率: {vols['volatility']:.1f}%)")
        
        if components['vix_sentiment']:
            vixs = components['vix_sentiment']
            print(f"   VIX情绪: {vixs['score']:.0f}/100")
            print(f"   {vixs['sentiment']} (VIX: {vixs['vix']:.2f})")
        
        # 可视化情绪指数
        print(f"\n📈 情绪指数可视化:")
        print("-" * 70)
        score = overall['overall_score']
        bar_length = 50
        filled = int(score / 100 * bar_length)
        bar = "█" * filled + "░" * (bar_length - filled)
        print(f"   极度恐慌 |{bar}| 极度贪婪")
        print(f"   0        {score:.0f}        100")
        
        # 交易建议
        print(f"\n🎲 交易策略建议:")
        print("-" * 70)
        
        if overall['overall_score'] >= 75:
            print("   • 市场情绪过于乐观，考虑减仓")
            print("   • 设置止盈点，保护利润")
            print("   • 避免追高，等待回调")
        elif overall['overall_score'] <= 25:
            print("   • 市场情绪恐慌，可能是机会")
            print("   • 分批建仓，不要一次性买入")
            print("   • 关注超跌反弹机会")
        else:
            print("   • 情绪中性，按原计划交易")
            print("   • 关注情绪变化，及时调整")
        
        print("=" * 70)


def main():
    """主函数"""
    if len(sys.argv) < 2:
        print("🦐 情绪分析器使用说明：")
        print("=" * 70)
        print("用法: python sentiment_analyzer.py <股票代码>")
        print("     python sentiment_analyzer.py --market  (分析整体市场)")
        print("\n示例:")
        print("  python sentiment_analyzer.py AAPL")
        print("  python sentiment_analyzer.py --market")
        sys.exit(1)
    
    if sys.argv[1] == '--market':
        analyzer = SentimentAnalyzer()
        analyzer.print_report()
    else:
        symbol = sys.argv[1]
        analyzer = SentimentAnalyzer(symbol)
        analyzer.print_report()


if __name__ == "__main__":
    main()
