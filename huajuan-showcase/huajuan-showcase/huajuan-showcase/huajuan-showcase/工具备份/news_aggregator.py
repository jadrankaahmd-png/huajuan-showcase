#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
新闻聚合监控器 - News Aggregator Monitor
作者：虾虾
创建时间：2026-02-08
用途：实时抓取半导体/AI行业新闻，关键词过滤，自动分类
"""

import requests
import json
import os
from datetime import datetime, timedelta
import sys
import time


class NewsAggregator:
    """新闻聚合监控器"""
    
    def __init__(self):
        self.api_keys = self.load_api_keys()
        self.data_dir = os.path.expanduser("~/.openclaw/workspace/新闻监控数据")
        os.makedirs(self.data_dir, exist_ok=True)
        
        # 关键词配置
        self.keywords = {
            'semiconductor': [
                'NVDA', 'TSM', 'AMD', 'INTC', 'QCOM', 'AVGO', 'MU', 'AMAT', 'LRCX', 'KLAC',
                'semiconductor', 'chip', 'HBM', 'DRAM', 'NAND', 'foundry', 'AI chip'
            ],
            'ai': [
                'AI', 'artificial intelligence', 'LLM', 'GPT', 'OpenAI', 'ChatGPT',
                'machine learning', 'deep learning', 'neural network'
            ],
            'market': [
                'earnings', 'revenue', 'profit', 'guidance', 'upgrade', 'downgrade',
                'buy', 'sell', 'bullish', 'bearish', 'outperform', 'underperform'
            ]
        }
        
    def load_api_keys(self):
        """加载API密钥"""
        # 从环境变量读取
        return {
            'marketaux': os.getenv('MARKETAUX_API_KEY', ''),
            'newsapi': os.getenv('NEWSAPI_KEY', ''),
            'brave': os.getenv('BRAVE_API_KEY', '')
        }
    
    def fetch_marketaux_news(self, keywords=None, limit=20):
        """
        从MarketAux获取新闻
        """
        if not self.api_keys['marketaux']:
            print("⚠️  MarketAux API密钥未配置")
            return []
        
        url = "https://api.marketaux.com/v1/news/all"
        
        # 构建查询词
        if keywords:
            query = ' OR '.join(keywords[:5])  # 最多5个关键词
        else:
            query = 'NVDA OR TSM OR semiconductor OR AI'
        
        params = {
            'api_token': self.api_keys['marketaux'],
            'symbols': 'NVDA,TSM,AMD,INTC',
            'filter_entities': 'true',
            'language': 'en',
            'limit': limit
        }
        
        try:
            response = requests.get(url, params=params, timeout=10)
            if response.status_code == 200:
                data = response.json()
                return data.get('data', [])
            else:
                print(f"⚠️  MarketAux API错误: {response.status_code}")
                return []
        except Exception as e:
            print(f"❌ MarketAux请求失败: {e}")
            return []
    
    def fetch_newsapi_news(self, query='semiconductor OR AI', limit=20):
        """
        从NewsAPI获取新闻
        """
        if not self.api_keys['newsapi']:
            print("⚠️  NewsAPI密钥未配置")
            return []
        
        url = "https://newsapi.org/v2/everything"
        
        # 计算昨天到今天的日期
        today = datetime.now()
        yesterday = today - timedelta(days=1)
        
        params = {
            'q': query,
            'from': yesterday.strftime('%Y-%m-%d'),
            'to': today.strftime('%Y-%m-%d'),
            'language': 'en',
            'sortBy': 'publishedAt',
            'pageSize': limit,
            'apiKey': self.api_keys['newsapi']
        }
        
        try:
            response = requests.get(url, params=params, timeout=10)
            if response.status_code == 200:
                data = response.json()
                return data.get('articles', [])
            else:
                print(f"⚠️  NewsAPI错误: {response.status_code}")
                return []
        except Exception as e:
            print(f"❌ NewsAPI请求失败: {e}")
            return []
    
    def classify_sentiment(self, text):
        """
        简单情绪分类
        """
        text_lower = text.lower()
        
        bullish_words = ['surge', 'rally', 'jump', 'soar', 'beat', 'exceed', 'strong', 'growth', 'breakthrough', 'upgrade', 'buy']
        bearish_words = ['plunge', 'crash', 'drop', 'fall', 'decline', 'miss', 'weak', 'downgrade', 'sell', 'risk']
        
        bullish_count = sum(1 for word in bullish_words if word in text_lower)
        bearish_count = sum(1 for word in bearish_words if word in text_lower)
        
        if bullish_count > bearish_count:
            return 'bullish', min(bullish_count * 20, 100)
        elif bearish_count > bullish_count:
            return 'bearish', min(bearish_count * 20, 100)
        else:
            return 'neutral', 50
    
    def extract_keywords(self, text):
        """
        提取关键词
        """
        found_keywords = []
        text_upper = text.upper()
        
        for category, words in self.keywords.items():
            for word in words:
                if word.upper() in text_upper:
                    found_keywords.append(word)
        
        return list(set(found_keywords))  # 去重
    
    def format_news(self, raw_news, source):
        """
        格式化新闻数据
        """
        formatted = []
        
        for item in raw_news:
            if source == 'marketaux':
                title = item.get('title', '')
                description = item.get('description', '')
                published = item.get('published_at', '')
                url = item.get('url', '')
                source_name = item.get('source', '')
            elif source == 'newsapi':
                title = item.get('title', '')
                description = item.get('description', '')
                published = item.get('publishedAt', '')
                url = item.get('url', '')
                source_name = item.get('source', {}).get('name', '')
            else:
                continue
            
            # 分类情绪
            full_text = title + ' ' + description
            sentiment, confidence = self.classify_sentiment(full_text)
            
            # 提取关键词
            keywords = self.extract_keywords(full_text)
            
            formatted.append({
                'title': title,
                'description': description[:200] if description else '',
                'published': published,
                'url': url,
                'source': source_name,
                'sentiment': sentiment,
                'confidence': confidence,
                'keywords': keywords,
                'fetched_at': datetime.now().isoformat()
            })
        
        return formatted
    
    def fetch_all_news(self, limit=20):
        """
        从所有来源获取新闻
        """
        print("🦐 开始抓取新闻...")
        print("=" * 70)
        
        all_news = []
        
        # 1. MarketAux
        print("\n📡 从MarketAux获取新闻...")
        marketaux_news = self.fetch_marketaux_news(limit=limit)
        if marketaux_news:
            formatted = self.format_news(marketaux_news, 'marketaux')
            all_news.extend(formatted)
            print(f"   ✅ 获取到 {len(formatted)} 条新闻")
        
        # 2. NewsAPI
        print("\n📡 从NewsAPI获取新闻...")
        newsapi_news = self.fetch_newsapi_news(limit=limit)
        if newsapi_news:
            formatted = self.format_news(newsapi_news, 'newsapi')
            all_news.extend(formatted)
            print(f"   ✅ 获取到 {len(formatted)} 条新闻")
        
        # 去重（基于标题）
        seen_titles = set()
        unique_news = []
        for news in all_news:
            if news['title'] not in seen_titles:
                seen_titles.add(news['title'])
                unique_news.append(news)
        
        # 按发布时间排序
        unique_news.sort(key=lambda x: x['published'], reverse=True)
        
        print("\n" + "=" * 70)
        print(f"✅ 总共获取到 {len(unique_news)} 条唯一新闻")
        
        return unique_news
    
    def analyze_news(self, news_list):
        """
        分析新闻
        """
        # 情绪统计
        sentiment_count = {'bullish': 0, 'bearish': 0, 'neutral': 0}
        keyword_count = {}
        
        for news in news_list:
            sentiment_count[news['sentiment']] += 1
            
            for keyword in news['keywords']:
                keyword_count[keyword] = keyword_count.get(keyword, 0) + 1
        
        # 排序关键词
        top_keywords = sorted(keyword_count.items(), key=lambda x: x[1], reverse=True)[:10]
        
        return {
            'sentiment_stats': sentiment_count,
            'top_keywords': top_keywords,
            'total_news': len(news_list)
        }
    
    def generate_report(self, news_list):
        """
        生成新闻报告
        """
        analysis = self.analyze_news(news_list)
        
        report = []
        report.append("🦐 新闻聚合监控报告")
        report.append("=" * 70)
        report.append(f"\n📊 统计概览:")
        report.append(f"   总新闻数: {analysis['total_news']}")
        report.append(f"   🟢 看涨: {analysis['sentiment_stats']['bullish']}")
        report.append(f"   🔴 看跌: {analysis['sentiment_stats']['bearish']}")
        report.append(f"   ⚪ 中性: {analysis['sentiment_stats']['neutral']}")
        
        report.append(f"\n🏷️ 热门关键词:")
        for keyword, count in analysis['top_keywords']:
            report.append(f"   • {keyword}: {count}次")
        
        report.append(f"\n📰 最新新闻（前10条）:")
        for i, news in enumerate(news_list[:10], 1):
            emoji = "🟢" if news['sentiment'] == 'bullish' else "🔴" if news['sentiment'] == 'bearish' else "⚪"
            report.append(f"\n   {i}. {emoji} {news['title'][:80]}...")
            report.append(f"      来源: {news['source']} | 关键词: {', '.join(news['keywords'][:3])}")
        
        return '\n'.join(report)
    
    def save_news(self, news_list):
        """
        保存新闻到文件
        """
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f"{self.data_dir}/news_{timestamp}.json"
        
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(news_list, f, ensure_ascii=False, indent=2)
        
        print(f"\n💾 新闻已保存到: {filename}")
        return filename
    
    def run_monitor(self):
        """
        运行监控
        """
        print("🦐 启动新闻聚合监控器...")
        print(f"时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        
        # 获取新闻
        news = self.fetch_all_news(limit=20)
        
        if news:
            # 保存
            self.save_news(news)
            
            # 生成并打印报告
            report = self.generate_report(news)
            print("\n" + report)
        else:
            print("\n⚠️  未能获取到新闻")
        
        return news


def main():
    """主函数"""
    if len(sys.argv) > 1 and sys.argv[1] == '--config':
        print("🦐 新闻聚合监控器配置")
        print("=" * 70)
        print("\n需要配置的API密钥:")
        print("  1. MarketAux API Key")
        print("     获取地址: https://www.marketaux.com/")
        print("     免费额度: 100次/天")
        print("\n  2. NewsAPI Key")
        print("     获取地址: https://newsapi.org/")
        print("     免费额度: 100次/天")
        print("\n配置方法:")
        print("  export MARKETAUX_API_KEY='your_key'")
        print("  export NEWSAPI_KEY='your_key'")
        sys.exit(0)
    
    monitor = NewsAggregator()
    monitor.run_monitor()


if __name__ == "__main__":
    main()
