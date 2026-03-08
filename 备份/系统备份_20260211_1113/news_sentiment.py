#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
新闻情绪分析器 - News Sentiment Analyzer
作者：虾虾
创建时间：2026-02-08
用途：分析新闻情绪，识别市场热点和情绪变化
"""

import yfinance as yf
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import re
import sys


class NewsSentimentAnalyzer:
    """新闻情绪分析器"""
    
    def __init__(self, symbol):
        self.symbol = symbol
        self.stock = None
        self.news = None
        
    def fetch_news(self):
        """获取股票新闻"""
        try:
            self.stock = yf.Ticker(self.symbol)
            self.news = self.stock.news
            
            if self.news:
                print(f"✅ 获取到 {len(self.news)} 条新闻")
                return True
            else:
                print(f"⚠️ 未找到 {self.symbol} 的新闻")
                return False
        except Exception as e:
            print(f"❌ 获取新闻失败: {e}")
            return False
    
    def analyze_sentiment_keywords(self, text):
        """
        基于关键词的情绪分析
        简单版本，实际应用中可以使用更复杂的NLP模型
        """
        text = text.lower()
        
        # 正面关键词
        positive_words = [
            'profit', 'growth', 'beat', 'exceed', 'strong', 'surge', 'rally', 'boom',
            'upgrade', 'buy', 'outperform', 'bullish', 'record', 'breakthrough',
            'partnership', 'expansion', 'innovation', 'success', 'gain', 'rise',
            '上涨', '增长', '突破', '利好', '强劲', '超预期', '合作', '创新'
        ]
        
        # 负面关键词
        negative_words = [
            'loss', 'decline', 'miss', 'weak', 'crash', 'drop', 'fall', 'bearish',
            'downgrade', 'sell', 'underperform', 'risk', 'concern', 'investigation',
            'lawsuit', 'debt', 'bankruptcy', 'cut', 'layoff', 'delay',
            '下跌', '亏损', '不及预期', '风险', '裁员', '延迟', '调查'
        ]
        
        positive_count = sum(1 for word in positive_words if word in text)
        negative_count = sum(1 for word in negative_words if word in text)
        
        total = positive_count + negative_count
        if total == 0:
            return {'sentiment': 'neutral', 'score': 0, 'positive': 0, 'negative': 0}
        
        score = (positive_count - negative_count) / total
        
        if score > 0.3:
            sentiment = 'positive'
        elif score < -0.3:
            sentiment = 'negative'
        else:
            sentiment = 'neutral'
        
        return {
            'sentiment': sentiment,
            'score': score,
            'positive': positive_count,
            'negative': negative_count
        }
    
    def analyze_news_batch(self):
        """批量分析新闻"""
        if self.news is None:
            return None
        
        analyzed_news = []
        
        for item in self.news:
            title = item.get('title', '')
            publisher = item.get('publisher', '')
            published_time = item.get('published', '')
            
            # 分析标题情绪
            sentiment = self.analyze_sentiment_keywords(title)
            
            analyzed_news.append({
                'title': title,
                'publisher': publisher,
                'published': published_time,
                'sentiment': sentiment['sentiment'],
                'score': sentiment['score'],
                'positive_words': sentiment['positive'],
                'negative_words': sentiment['negative']
            })
        
        return analyzed_news
    
    def calculate_overall_sentiment(self):
        """计算整体新闻情绪"""
        analyzed = self.analyze_news_batch()
        if not analyzed:
            return None
        
        # 统计
        positive_count = sum(1 for n in analyzed if n['sentiment'] == 'positive')
        negative_count = sum(1 for n in analyzed if n['sentiment'] == 'negative')
        neutral_count = sum(1 for n in analyzed if n['sentiment'] == 'neutral')
        
        total = len(analyzed)
        
        # 加权平均分
        avg_score = sum(n['score'] for n in analyzed) / total
        
        # 情绪分类
        if avg_score > 0.3:
            overall = "🟢 积极"
            signal = "利好"
        elif avg_score < -0.3:
            overall = "🔴 消极"
            signal = "利空"
        else:
            overall = "⚪ 中性"
            signal = "中性"
        
        return {
            'overall': overall,
            'signal': signal,
            'score': avg_score,
            'positive_count': positive_count,
            'negative_count': negative_count,
            'neutral_count': neutral_count,
            'total': total,
            'positive_pct': positive_count / total * 100,
            'negative_pct': negative_count / total * 100
        }
    
    def identify_hot_topics(self):
        """识别热点话题"""
        if self.news is None:
            return []
        
        # 关键词频率统计
        all_titles = ' '.join([n.get('title', '').lower() for n in self.news])
        
        # 常见金融关键词
        keywords = [
            'earnings', 'revenue', 'profit', 'guidance', 'analyst', 'upgrade', 'downgrade',
            'merger', 'acquisition', 'partnership', 'lawsuit', 'investigation',
            'product', 'launch', 'innovation', 'ai', 'technology', 'market',
            'growth', 'expansion', 'debt', 'dividend', 'buyback'
        ]
        
        topic_freq = {}
        for keyword in keywords:
            count = len(re.findall(r'\b' + keyword + r'\b', all_titles))
            if count > 0:
                topic_freq[keyword] = count
        
        # 排序
        sorted_topics = sorted(topic_freq.items(), key=lambda x: x[1], reverse=True)
        
        return sorted_topics[:5]  # 返回前5个热点
    
    def print_report(self):
        """打印新闻情绪报告"""
        print("\n" + "=" * 70)
        print(f"📰 {self.symbol} 新闻情绪分析报告")
        print("=" * 70)
        
        if not self.fetch_news():
            print("❌ 无法获取新闻数据")
            return
        
        # 整体情绪
        overall = self.calculate_overall_sentiment()
        if overall:
            print(f"\n📊 整体情绪:")
            print("-" * 70)
            print(f"   {overall['overall']}")
            print(f"   情绪得分: {overall['score']:+.2f}")
            print(f"   分析新闻: {overall['total']}条")
            print(f"   正面: {overall['positive_count']} ({overall['positive_pct']:.0f}%)")
            print(f"   负面: {overall['negative_count']} ({overall['negative_pct']:.0f}%)")
            print(f"   中性: {overall['neutral_count']}")
        
        # 热点话题
        hot_topics = self.identify_hot_topics()
        if hot_topics:
            print(f"\n🔥 热点话题:")
            print("-" * 70)
            for topic, freq in hot_topics:
                print(f"   • {topic.capitalize()}: {freq}次提及")
        
        # 新闻详情
        analyzed_news = self.analyze_news_batch()
        if analyzed_news:
            print(f"\n📋 新闻详情:")
            print("-" * 70)
            
            for i, news in enumerate(analyzed_news[:10], 1):  # 显示前10条
                emoji = "🟢" if news['sentiment'] == 'positive' else "🔴" if news['sentiment'] == 'negative' else "⚪"
                print(f"\n   {i}. {emoji} {news['title'][:80]}...")
                print(f"      来源: {news['publisher']} | 情绪: {news['sentiment']} ({news['score']:+.2f})")
        
        # 投资建议
        print(f"\n💡 投资建议:")
        print("-" * 70)
        
        if overall:
            if overall['score'] > 0.3:
                print("   • 新闻情绪积极，可能有利好支撑")
                print("   • 关注是否有实质性利好消息")
                print("   • 可作为辅助买入信号")
            elif overall['score'] < -0.3:
                print("   • 新闻情绪消极，需谨慎")
                print("   • 关注负面消息的具体内容")
                print("   • 可能是减仓或观望信号")
            else:
                print("   • 新闻情绪中性")
                print("   • 没有明显的情绪偏向")
                print("   • 建议结合其他指标决策")
        
        print("=" * 70)
        print("\n⚠️ 注意：新闻情绪分析仅供参考，需结合基本面和技术面")


def compare_sentiments(symbols):
    """比较多只股票的新闻情绪"""
    print(f"\n🦐 批量比较 {len(symbols)} 只股票的新闻情绪...")
    print("=" * 70)
    
    results = []
    
    for symbol in symbols:
        analyzer = NewsSentimentAnalyzer(symbol)
        if analyzer.fetch_news():
            overall = analyzer.calculate_overall_sentiment()
            if overall:
                results.append({
                    'symbol': symbol,
                    'score': overall['score'],
                    'sentiment': overall['overall'],
                    'positive_pct': overall['positive_pct']
                })
            else:
                results.append({
                    'symbol': symbol,
                    'score': 0,
                    'sentiment': '无数据',
                    'positive_pct': 0
                })
        else:
            results.append({
                'symbol': symbol,
                'score': 0,
                'sentiment': '无数据',
                'positive_pct': 0
            })
    
    # 按情绪得分排序
    results.sort(key=lambda x: x['score'], reverse=True)
    
    print(f"\n📊 新闻情绪排名（从高到低）：")
    print("-" * 70)
    print(f"{'排名':<4} {'股票':<8} {'情绪得分':>10} {'正面比例':>10} {'评级':<15}")
    print("-" * 70)
    
    for i, r in enumerate(results, 1):
        print(f"{i:<4} {r['symbol']:<8} {r['score']:>+10.2f} {r['positive_pct']:>9.0f}% {r['sentiment']:<15}")
    
    print("=" * 70)


def main():
    """主函数"""
    if len(sys.argv) < 2:
        print("🦐 新闻情绪分析器使用说明：")
        print("=" * 70)
        print("用法:")
        print("  单只股票: python news_sentiment.py <股票代码>")
        print("  批量比较: python news_sentiment.py --compare <股票1> <股票2> ...")
        print("\n示例:")
        print("  python news_sentiment.py AAPL")
        print("  python news_sentiment.py --compare AAPL MSFT NVDA GOOGL")
        sys.exit(1)
    
    if sys.argv[1] == '--compare':
        symbols = sys.argv[2:]
        compare_sentiments(symbols)
    else:
        symbol = sys.argv[1]
        analyzer = NewsSentimentAnalyzer(symbol)
        analyzer.print_report()


if __name__ == "__main__":
    main()
