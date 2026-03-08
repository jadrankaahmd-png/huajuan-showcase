#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Reddit 监控器 - Reddit Monitor
作者：虾虾
创建时间：2026-02-09
用途：监控Reddit股票/投资相关内容，三重保障方案（PRAW + Pushshift + RSS）
"""

import os
import sys
import json
import time
import feedparser
import requests
from datetime import datetime, timedelta
from typing import List, Dict, Optional
import re

# 尝试导入PRAW
try:
    import praw
    PRAW_AVAILABLE = True
except ImportError:
    PRAW_AVAILABLE = False
    print("⚠️ PRAW未安装，将使用备用方案")
    print("💡 安装命令: pip install praw")


class RedditMonitor:
    """Reddit监控器 - 三重保障方案"""
    
    def __init__(self):
        self.reddit = None
        self.data_dir = os.path.expanduser("~/.openclaw/workspace/Reddit监控数据")
        os.makedirs(self.data_dir, exist_ok=True)
        
        # 核心股票/投资subreddit
        self.stock_subreddits = [
            # 主要投资社区
            "wallstreetbets",
            "stocks",
            "investing",
            "StockMarket",
            "pennystocks",
            "options",
            "SecurityAnalysis",
            
            # 科技/半导体
            "hardware",
            "nvidia",
            "AMD_Stock",
            "INTEL",
            "semiconductors",
            "artificial",
            "MachineLearning",
            "LocalLLaMA",
            
            # 特定股票
            "NvidiaStock",
            "AMD_Stock",
            "TSLA",
            "apple",
            "msft",
            "google",
            "meta",
            "amazon",
            "superstonk",
            
            # 行业分析
            "tech",
            "technology",
            "futurology",
            
            # 宏观/经济
            "economy",
            "EconMonitor",
            "finance",
            "FinancialIndependence"
        ]
        
        # 监控关键词
        self.keywords = [
            # 热门股票
            "NVDA", "TSLA", "AAPL", "MSFT", "GOOGL", "AMZN", "META",
            "AMD", "INTC", "QCOM", "AVGO", "MU", "SMCI", "CRWV",
            
            # 半导体相关
            "semiconductor", "chip", "HBM", "GPU", "AI chip", "TSMC",
            "silicon", "foundry", "ASML", "lithography",
            
            # AI相关
            "AI", "artificial intelligence", "LLM", "ChatGPT", "Claude",
            "machine learning", "deep learning", "neural network",
            "OpenAI", "Anthropic", "Gemini",
            
            # 市场术语
            "earnings", "revenue", "guidance", "beat", "miss",
            "bullish", "bearish", "moon", "tendies", "YOLO",
            "short squeeze", "gamma squeeze", "institutional",
            
            # 技术术语
            "CPO", "co-packaged optics", "silicon photonics",
            "optical interconnect", "HBF", "High Bandwidth Flash"
        ]
        
        # 初始化PRAW（如果可用）
        self.init_praw()
    
    def init_praw(self):
        """初始化PRAW Reddit实例"""
        if not PRAW_AVAILABLE:
            return False
        
        try:
            # 从环境变量获取API凭证
            client_id = os.getenv('REDDIT_CLIENT_ID')
            client_secret = os.getenv('REDDIT_CLIENT_SECRET')
            user_agent = os.getenv('REDDIT_USER_AGENT', '虾虾Reddit监控器/1.0')
            
            if not client_id or not client_secret:
                print("⚠️ Reddit API凭证未配置")
                print("💡 请设置环境变量:")
                print("   export REDDIT_CLIENT_ID='your_client_id'")
                print("   export REDDIT_CLIENT_SECRET='your_client_secret'")
                return False
            
            self.reddit = praw.Reddit(
                client_id=client_id,
                client_secret=client_secret,
                user_agent=user_agent
            )
            
            # 测试连接
            user = self.reddit.user.me()
            print(f"✅ PRAW连接成功: {user}")
            return True
            
        except Exception as e:
            print(f"❌ PRAW初始化失败: {e}")
            return False
    
    def search_pushshift(self, query: str, after: str = "24h", 
                         subreddit: str = None, size: int = 25) -> List[Dict]:
        """
        方案2: 使用Pushshift API搜索（无需API Key）
        
        Args:
            query: 搜索关键词
            after: 时间范围 (1h, 24h, 7d, 30d)
            subreddit: 限定subreddit
            size: 返回结果数量
        """
        try:
            # Pushshift API endpoint
            url = "https://api.pullpush.io/reddit/search/submission/"
            
            # 计算时间戳
            now = datetime.utcnow()
            if after.endswith('h'):
                hours = int(after[:-1])
                after_time = now - timedelta(hours=hours)
            elif after.endswith('d'):
                days = int(after[:-1])
                after_time = now - timedelta(days=days)
            else:
                after_time = now - timedelta(hours=24)
            
            after_timestamp = int(after_time.timestamp())
            
            params = {
                'q': query,
                'after': after_timestamp,
                'size': size,
                'sort': 'desc',
                'sort_type': 'created_utc'
            }
            
            if subreddit:
                params['subreddit'] = subreddit
            
            response = requests.get(url, params=params, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                posts = data.get('data', [])
                return posts
            else:
                print(f"⚠️ Pushshift API返回错误: {response.status_code}")
                return []
                
        except Exception as e:
            print(f"❌ Pushshift搜索失败: {e}")
            return []
    
    def get_subreddit_rss(self, subreddit: str, limit: int = 25) -> List[Dict]:
        """
        方案3: 通过RSS获取subreddit最新帖子（备用方案）
        
        Args:
            subreddit: subreddit名称
            limit: 返回数量
        """
        try:
            # Reddit RSS feed
            rss_url = f"https://www.reddit.com/r/{subreddit}/new/.rss"
            
            headers = {
                'User-Agent': 'Mozilla/5.0 (虾虾Reddit监控器/1.0)'
            }
            
            feed = feedparser.parse(rss_url)
            
            if feed.entries:
                posts = []
                for entry in feed.entries[:limit]:
                    post = {
                        'title': entry.get('title', ''),
                        'selftext': entry.get('summary', ''),
                        'author': entry.get('author', 'Unknown'),
                        'created_utc': entry.get('published_parsed', ''),
                        'url': entry.get('link', ''),
                        'subreddit': subreddit,
                        'score': 0,  # RSS不提供分数
                        'num_comments': 0
                    }
                    posts.append(post)
                return posts
            else:
                return []
                
        except Exception as e:
            print(f"❌ RSS获取失败 r/{subreddit}: {e}")
            return []
    
    def get_subreddit_praw(self, subreddit: str, limit: int = 25,
                          time_filter: str = "day") -> List[Dict]:
        """
        方案1: 使用PRAW获取subreddit帖子（最佳方案）
        
        Args:
            subreddit: subreddit名称
            limit: 返回数量
            time_filter: 时间过滤 (hour, day, week, month, year, all)
        """
        if not self.reddit:
            return []
        
        try:
            sub = self.reddit.subreddit(subreddit)
            posts = []
            
            for submission in sub.new(limit=limit):
                post = {
                    'title': submission.title,
                    'selftext': submission.selftext,
                    'author': str(submission.author),
                    'created_utc': submission.created_utc,
                    'url': submission.url,
                    'permalink': f"https://reddit.com{submission.permalink}",
                    'subreddit': subreddit,
                    'score': submission.score,
                    'num_comments': submission.num_comments,
                    'upvote_ratio': submission.upvote_ratio,
                    'is_self': submission.is_self,
                    'id': submission.id
                }
                posts.append(post)
            
            return posts
            
        except Exception as e:
            print(f"❌ PRAW获取失败 r/{subreddit}: {e}")
            return []
    
    def search_keyword(self, keyword: str, after: str = "24h") -> List[Dict]:
        """
        搜索关键词 - 三重保障
        
        优先顺序:
        1. PRAW搜索（如果可用）
        2. Pushshift API搜索
        3. 监控subreddit RSS
        """
        print(f"\n🔍 搜索关键词: '{keyword}' (过去{after})")
        
        all_posts = []
        
        # 方案1: PRAW搜索
        if self.reddit:
            try:
                print("  尝试 PRAW...")
                for submission in self.reddit.subreddit("all").search(
                    keyword, 
                    sort="new",
                    time_filter="day" if after == "24h" else "week",
                    limit=50
                ):
                    post = {
                        'title': submission.title,
                        'selftext': submission.selftext,
                        'author': str(submission.author),
                        'created_utc': submission.created_utc,
                        'url': submission.url,
                        'subreddit': submission.subreddit.display_name,
                        'score': submission.score,
                        'num_comments': submission.num_comments,
                        'source': 'PRAW'
                    }
                    all_posts.append(post)
                print(f"  ✅ PRAW找到 {len(all_posts)} 条")
            except Exception as e:
                print(f"  ⚠️ PRAW搜索失败: {e}")
        
        # 方案2: Pushshift搜索（如果PRAW失败或数量不足）
        if len(all_posts) < 10:
            print("  尝试 Pushshift...")
            pushshift_posts = self.search_pushshift(keyword, after=after)
            for post in pushshift_posts:
                post['source'] = 'Pushshift'
            all_posts.extend(pushshift_posts)
            print(f"  ✅ Pushshift找到 {len(pushshift_posts)} 条")
        
        # 去重
        seen_ids = set()
        unique_posts = []
        for post in all_posts:
            post_id = post.get('id', post.get('url', ''))
            if post_id not in seen_ids:
                seen_ids.add(post_id)
                unique_posts.append(post)
        
        # 按时间排序
        unique_posts.sort(key=lambda x: x.get('created_utc', 0), reverse=True)
        
        return unique_posts[:50]  # 最多返回50条
    
    def monitor_subreddit(self, subreddit: str, limit: int = 25) -> List[Dict]:
        """
        监控特定subreddit - 三重保障
        
        优先顺序:
        1. PRAW获取
        2. RSS获取
        """
        print(f"\n📊 监控 r/{subreddit}")
        
        # 方案1: PRAW
        posts = self.get_subreddit_praw(subreddit, limit)
        if posts:
            for post in posts:
                post['source'] = 'PRAW'
            print(f"  ✅ PRAW获取 {len(posts)} 条")
            return posts
        
        # 方案2: RSS
        print("  尝试 RSS...")
        posts = self.get_subreddit_rss(subreddit, limit)
        if posts:
            for post in posts:
                post['source'] = 'RSS'
            print(f"  ✅ RSS获取 {len(posts)} 条")
            return posts
        
        print("  ❌ 所有方案失败")
        return []
    
    def analyze_sentiment(self, text: str) -> Dict:
        """
        简单情感分析
        
        Returns:
            情感评分 (-1到1，负到正)
        """
        text_lower = text.lower()
        
        # 积极词汇
        positive_words = [
            'bullish', 'moon', 'rocket', 'tendies', 'gain', 'profit',
            'beat', 'exceed', 'strong', 'growth', 'boom', 'surge',
            '突破', '大涨', '牛市', '看好'
        ]
        
        # 消极词汇
        negative_words = [
            'bearish', 'crash', 'dump', 'loss', 'miss', 'weak',
            'decline', 'fall', 'drop', 'crash', 'bankrupt',
            '跌破', '大跌', '熊市', '看空', '爆雷'
        ]
        
        positive_count = sum(1 for word in positive_words if word in text_lower)
        negative_count = sum(1 for word in negative_words if word in text_lower)
        
        total = positive_count + negative_count
        if total == 0:
            return {'sentiment': 'neutral', 'score': 0}
        
        score = (positive_count - negative_count) / total
        
        if score > 0.2:
            sentiment = 'positive'
        elif score < -0.2:
            sentiment = 'negative'
        else:
            sentiment = 'neutral'
        
        return {
            'sentiment': sentiment,
            'score': score,
            'positive_count': positive_count,
            'negative_count': negative_count
        }
    
    def monitor_stock_mentions(self, symbol: str, after: str = "24h") -> Dict:
        """
        监控特定股票在Reddit的提及
        
        Args:
            symbol: 股票代码 (如 "NVDA", "CRWV")
            after: 时间范围
            
        Returns:
            分析结果字典
        """
        print(f"\n🎯 监控股票: ${symbol} (过去{after})")
        
        # 搜索关键词（包括$符号和纯代码）
        patterns = [f"${symbol}", symbol]
        
        all_posts = []
        for pattern in patterns:
            posts = self.search_keyword(pattern, after)
            all_posts.extend(posts)
        
        # 去重
        seen_ids = set()
        unique_posts = []
        for post in all_posts:
            post_id = post.get('id', post.get('url', ''))
            if post_id not in seen_ids:
                seen_ids.add(post_id)
                unique_posts.append(post)
        
        # 分析情感
        sentiment_scores = []
        for post in unique_posts:
            text = f"{post.get('title', '')} {post.get('selftext', '')}"
            sentiment = self.analyze_sentiment(text)
            post['sentiment'] = sentiment
            sentiment_scores.append(sentiment['score'])
        
        avg_sentiment = sum(sentiment_scores) / len(sentiment_scores) if sentiment_scores else 0
        
        # 统计subreddit分布
        subreddit_counts = {}
        for post in unique_posts:
            sub = post.get('subreddit', 'unknown')
            subreddit_counts[sub] = subreddit_counts.get(sub, 0) + 1
        
        result = {
            'symbol': symbol,
            'total_mentions': len(unique_posts),
            'time_range': after,
            'average_sentiment': avg_sentiment,
            'sentiment_label': 'positive' if avg_sentiment > 0.2 else ('negative' if avg_sentiment < -0.2 else 'neutral'),
            'subreddit_distribution': subreddit_counts,
            'posts': unique_posts[:20],  # 只保留前20条详细信息
            'timestamp': datetime.now().isoformat()
        }
        
        # 保存结果
        self.save_result(result, f"stock_{symbol}_{datetime.now().strftime('%Y%m%d')}")
        
        return result
    
    def save_result(self, data: Dict, filename: str):
        """保存结果到文件"""
        filepath = os.path.join(self.data_dir, f"{filename}.json")
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print(f"💾 结果已保存: {filepath}")
    
    def print_stock_report(self, result: Dict):
        """打印股票监控报告"""
        print("\n" + "="*60)
        print(f"📊 Reddit股票监控报告: ${result['symbol']}")
        print("="*60)
        
        print(f"\n📈 统计概览:")
        print(f"  总提及数: {result['total_mentions']}")
        print(f"  时间范围: 过去{result['time_range']}")
        print(f"  平均情感: {result['sentiment_label']} ({result['average_sentiment']:.2f})")
        
        print(f"\n📍 Subreddit分布:")
        for sub, count in sorted(result['subreddit_distribution'].items(), 
                                key=lambda x: x[1], reverse=True)[:10]:
            print(f"  r/{sub}: {count} 条")
        
        print(f"\n🔥 热门帖子 (Top 5):")
        for i, post in enumerate(result['posts'][:5], 1):
            sentiment_emoji = '🟢' if post['sentiment']['sentiment'] == 'positive' else (
                '🔴' if post['sentiment']['sentiment'] == 'negative' else '⚪'
            )
            print(f"\n  {i}. {sentiment_emoji} {post['title'][:80]}...")
            print(f"     👤 u/{post.get('author', 'Unknown')} | "
                  f"📍 r/{post.get('subreddit', 'Unknown')} | "
                  f"⬆️ {post.get('score', 0)} | "
                  f"💬 {post.get('num_comments', 0)}")
            print(f"     🔗 {post.get('permalink', post.get('url', ''))}")
        
        print("\n" + "="*60)


def main():
    """主函数"""
    import argparse
    
    parser = argparse.ArgumentParser(description='虾虾Reddit监控器')
    parser.add_argument('--stock', '-s', type=str, help='监控特定股票 (如: NVDA)')
    parser.add_argument('--keyword', '-k', type=str, help='搜索关键词')
    parser.add_argument('--subreddit', '-r', type=str, help='监控特定subreddit')
    parser.add_argument('--time', '-t', type=str, default='24h', 
                       help='时间范围 (1h, 24h, 7d, 30d)')
    parser.add_argument('--list-subs', action='store_true', 
                       help='列出所有监控的subreddit')
    
    args = parser.parse_args()
    
    # 创建监控器实例
    monitor = RedditMonitor()
    
    if args.list_subs:
        print("📋 监控的Subreddit列表:")
        for sub in monitor.stock_subreddits:
            print(f"  r/{sub}")
    
    elif args.stock:
        result = monitor.monitor_stock_mentions(args.stock.upper(), args.time)
        monitor.print_stock_report(result)
    
    elif args.keyword:
        posts = monitor.search_keyword(args.keyword, args.time)
        print(f"\n🔍 找到 {len(posts)} 条关于 '{args.keyword}' 的帖子")
        for i, post in enumerate(posts[:10], 1):
            print(f"\n{i}. {post['title'][:100]}...")
            print(f"   r/{post.get('subreddit', 'Unknown')} | ⬆️ {post.get('score', 0)}")
    
    elif args.subreddit:
        posts = monitor.monitor_subreddit(args.subreddit, limit=25)
        print(f"\n📊 r/{args.subreddit} 最新 {len(posts)} 条帖子:")
        for i, post in enumerate(posts[:10], 1):
            print(f"\n{i}. {post['title'][:100]}...")
            print(f"   👤 u/{post.get('author', 'Unknown')} | ⬆️ {post.get('score', 0)}")
    
    else:
        # 默认：监控热门股票
        print("🦐 虾虾Reddit监控器启动！")
        print("💡 使用方法:")
        print("  python3 reddit_monitor.py --stock NVDA     # 监控NVDA")
        print("  python3 reddit_monitor.py --keyword AI     # 搜索AI相关")
        print("  python3 reddit_monitor.py --subreddit wallstreetbets  # 监控WSB")
        print("  python3 reddit_monitor.py --list-subs      # 列出所有subreddit")


if __name__ == "__main__":
    main()
