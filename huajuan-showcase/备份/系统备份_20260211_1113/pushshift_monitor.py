#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Reddit Pushshift 监控器 - 无需API Key方案
作者：虾虾
创建时间：2026-02-09
用途：使用Pushshift API免费监控Reddit（无需Reddit账号和API Key）
特点：零成本、免登录、适合长期监控
注意：数据有5-30分钟延迟
"""

import requests
import json
import os
import time
from datetime import datetime, timedelta
from typing import List, Dict, Optional
import re


class PushshiftMonitor:
    """
    Pushshift Reddit监控器
    
    优势：
    - 完全免费，无需API Key
    - 无需Reddit账号
    - 可访问历史数据（追溯到几年前）
    - 高频率查询限制较宽松
    
    限制：
    - 数据有5-30分钟延迟
    - 偶尔服务不稳定
    - 某些字段可能缺失
    """
    
    def __init__(self):
        self.base_url = "https://api.pullpush.io/reddit"
        self.data_dir = os.path.expanduser("~/.openclaw/workspace/Reddit监控数据/Pushshift")
        os.makedirs(self.data_dir, exist_ok=True)
        
        # 记录API调用次数（遵守限制）
        self.api_calls = 0
        self.max_calls_per_minute = 60
        self.last_call_time = None
        
        print("🦐 Pushshift Reddit监控器启动")
        print("💡 特点：免费、免登录、数据有延迟")
        print("⚠️ 注意：请遵守60次/分钟的速率限制\n")
    
    def _rate_limit(self):
        """简单的速率限制"""
        if self.last_call_time:
            elapsed = (datetime.now() - self.last_call_time).total_seconds()
            if elapsed < 1.0:  # 每次调用间隔至少1秒
                time.sleep(1.0 - elapsed)
        
        self.last_call_time = datetime.now()
        self.api_calls += 1
    
    def search_submissions(self, 
                          query: str = None,
                          subreddit: str = None,
                          author: str = None,
                          after: int = None,
                          before: int = None,
                          size: int = 25,
                          sort: str = "desc",
                          sort_type: str = "created_utc") -> List[Dict]:
        """
        搜索帖子（Submissions）
        
        Args:
            query: 搜索关键词
            subreddit: 限定subreddit
            author: 限定作者
            after: 开始时间戳（Unix timestamp）
            before: 结束时间戳
            size: 返回数量（最大100）
            sort: 排序方向（asc/desc）
            sort_type: 排序字段（created_utc/score/num_comments）
        
        Returns:
            帖子列表
        """
        url = f"{self.base_url}/search/submission/"
        
        params = {
            'size': min(size, 100),  # 最大100
            'sort': sort,
            'sort_type': sort_type
        }
        
        if query:
            params['q'] = query
        if subreddit:
            params['subreddit'] = subreddit
        if author:
            params['author'] = author
        if after:
            params['after'] = after
        if before:
            params['before'] = before
        
        self._rate_limit()
        
        try:
            response = requests.get(url, params=params, timeout=15)
            
            if response.status_code == 200:
                data = response.json()
                posts = data.get('data', [])
                print(f"✅ 找到 {len(posts)} 条帖子")
                return posts
            elif response.status_code == 429:
                print("⚠️ 速率限制，等待60秒...")
                time.sleep(60)
                return self.search_submissions(query, subreddit, author, after, before, size, sort, sort_type)
            else:
                print(f"❌ API错误: {response.status_code}")
                return []
                
        except Exception as e:
            print(f"❌ 请求失败: {e}")
            return []
    
    def search_comments(self,
                       query: str = None,
                       subreddit: str = None,
                       author: str = None,
                       after: int = None,
                       before: int = None,
                       size: int = 25) -> List[Dict]:
        """
        搜索评论（Comments）
        
        Args:
            query: 搜索关键词
            subreddit: 限定subreddit
            author: 限定作者
            after: 开始时间戳
            before: 结束时间戳
            size: 返回数量
        
        Returns:
            评论列表
        """
        url = f"{self.base_url}/search/comment/"
        
        params = {'size': min(size, 100)}
        
        if query:
            params['q'] = query
        if subreddit:
            params['subreddit'] = subreddit
        if author:
            params['author'] = author
        if after:
            params['after'] = after
        if before:
            params['before'] = before
        
        self._rate_limit()
        
        try:
            response = requests.get(url, params=params, timeout=15)
            
            if response.status_code == 200:
                data = response.json()
                comments = data.get('data', [])
                print(f"✅ 找到 {len(comments)} 条评论")
                return comments
            else:
                print(f"❌ API错误: {response.status_code}")
                return []
                
        except Exception as e:
            print(f"❌ 请求失败: {e}")
            return []
    
    def get_submissions_by_ids(self, ids: List[str]) -> List[Dict]:
        """
        通过ID获取特定帖子
        
        Args:
            ids: 帖子ID列表
        
        Returns:
            帖子详情列表
        """
        url = f"{self.base_url}/submission/"
        
        params = {'ids': ','.join(ids)}
        
        self._rate_limit()
        
        try:
            response = requests.get(url, params=params, timeout=15)
            
            if response.status_code == 200:
                data = response.json()
                return data.get('data', [])
            else:
                return []
                
        except Exception as e:
            print(f"❌ 请求失败: {e}")
            return []
    
    def time_range_to_timestamp(self, time_range: str) -> int:
        """
        将时间范围转换为Unix时间戳
        
        Args:
            time_range: "1h", "6h", "24h", "7d", "30d", "90d"
        
        Returns:
            Unix时间戳
        """
        now = datetime.utcnow()
        
        if time_range.endswith('h'):
            hours = int(time_range[:-1])
            target_time = now - timedelta(hours=hours)
        elif time_range.endswith('d'):
            days = int(time_range[:-1])
            target_time = now - timedelta(days=days)
        else:
            # 默认24小时
            target_time = now - timedelta(hours=24)
        
        return int(target_time.timestamp())
    
    def monitor_stock(self, symbol: str, time_range: str = "24h", limit: int = 50) -> Dict:
        """
        监控特定股票在Reddit的提及
        
        Args:
            symbol: 股票代码（如 "NVDA"）
            time_range: 时间范围
            limit: 返回数量
        
        Returns:
            监控结果
        """
        print(f"\n🎯 监控股票: ${symbol} (过去{time_range})")
        
        after_timestamp = self.time_range_to_timestamp(time_range)
        
        # 搜索不同的提及方式
        search_patterns = [
            f"${symbol}",      # $NVDA
            f"{symbol} stock", # NVDA stock
            f"{symbol} shares" # NVDA shares
        ]
        
        all_posts = []
        for pattern in search_patterns:
            print(f"  搜索: '{pattern}'...")
            posts = self.search_submissions(
                query=pattern,
                after=after_timestamp,
                size=limit
            )
            all_posts.extend(posts)
            time.sleep(1)  # 避免过快请求
        
        # 去重
        seen_ids = set()
        unique_posts = []
        for post in all_posts:
            post_id = post.get('id')
            if post_id and post_id not in seen_ids:
                seen_ids.add(post_id)
                unique_posts.append(post)
        
        # 排序（按时间）
        unique_posts.sort(key=lambda x: x.get('created_utc', 0), reverse=True)
        
        # 分析subreddit分布
        subreddit_counts = {}
        for post in unique_posts:
            sub = post.get('subreddit', 'unknown')
            subreddit_counts[sub] = subreddit_counts.get(sub, 0) + 1
        
        # 简单情感分析
        sentiment_scores = []
        for post in unique_posts:
            title = post.get('title', '').lower()
            text = post.get('selftext', '').lower()
            combined = f"{title} {text}"
            
            # 简单的情感判断
            positive_words = ['bullish', 'moon', 'rocket', 'buy', 'long', 'gain', 'profit', 'beat']
            negative_words = ['bearish', 'crash', 'dump', 'sell', 'short', 'loss', 'miss']
            
            pos_count = sum(1 for word in positive_words if word in combined)
            neg_count = sum(1 for word in negative_words if word in combined)
            
            if pos_count > neg_count:
                sentiment = 1
            elif neg_count > pos_count:
                sentiment = -1
            else:
                sentiment = 0
            
            sentiment_scores.append(sentiment)
            post['sentiment'] = sentiment
        
        avg_sentiment = sum(sentiment_scores) / len(sentiment_scores) if sentiment_scores else 0
        
        result = {
            'symbol': symbol,
            'time_range': time_range,
            'total_mentions': len(unique_posts),
            'average_sentiment': avg_sentiment,
            'sentiment_label': 'positive' if avg_sentiment > 0.1 else ('negative' if avg_sentiment < -0.1 else 'neutral'),
            'subreddit_distribution': subreddit_counts,
            'posts': unique_posts[:20],  # 只保留前20条详情
            'timestamp': datetime.now().isoformat()
        }
        
        # 保存结果
        self._save_result(result, f"pushshift_stock_{symbol}_{datetime.now().strftime('%Y%m%d_%H%M')}")
        
        return result
    
    def monitor_keyword(self, keyword: str, time_range: str = "24h", subreddit: str = None, limit: int = 50) -> Dict:
        """
        监控特定关键词
        
        Args:
            keyword: 关键词
            time_range: 时间范围
            subreddit: 限定subreddit（可选）
            limit: 返回数量
        
        Returns:
            监控结果
        """
        print(f"\n🔍 监控关键词: '{keyword}' (过去{time_range})")
        
        after_timestamp = self.time_range_to_timestamp(time_range)
        
        posts = self.search_submissions(
            query=keyword,
            subreddit=subreddit,
            after=after_timestamp,
            size=limit
        )
        
        # 同时搜索评论
        print("  搜索评论中...")
        comments = self.search_comments(
            query=keyword,
            subreddit=subreddit,
            after=after_timestamp,
            size=limit
        )
        
        result = {
            'keyword': keyword,
            'time_range': time_range,
            'subreddit': subreddit or 'all',
            'total_posts': len(posts),
            'total_comments': len(comments),
            'posts': posts[:15],
            'comments': comments[:15],
            'timestamp': datetime.now().isoformat()
        }
        
        # 保存结果
        self._save_result(result, f"pushshift_keyword_{keyword.replace(' ', '_')}_{datetime.now().strftime('%Y%m%d_%H%M')}")
        
        return result
    
    def monitor_subreddit(self, subreddit: str, time_range: str = "24h", limit: int = 50) -> Dict:
        """
        监控特定subreddit
        
        Args:
            subreddit: subreddit名称
            time_range: 时间范围
            limit: 返回数量
        
        Returns:
            监控结果
        """
        print(f"\n📊 监控 r/{subreddit} (过去{time_range})")
        
        after_timestamp = self.time_range_to_timestamp(time_range)
        
        posts = self.search_submissions(
            subreddit=subreddit,
            after=after_timestamp,
            size=limit,
            sort='desc',
            sort_type='created_utc'
        )
        
        result = {
            'subreddit': subreddit,
            'time_range': time_range,
            'total_posts': len(posts),
            'posts': posts[:25],
            'timestamp': datetime.now().isoformat()
        }
        
        # 保存结果
        self._save_result(result, f"pushshift_subreddit_{subreddit}_{datetime.now().strftime('%Y%m%d_%H%M')}")
        
        return result
    
    def compare_stocks(self, symbols: List[str], time_range: str = "24h") -> Dict:
        """
        对比多只股票的热度
        
        Args:
            symbols: 股票代码列表
            time_range: 时间范围
        
        Returns:
            对比结果
        """
        print(f"\n📈 对比 {len(symbols)} 只股票热度")
        
        results = {}
        for symbol in symbols:
            result = self.monitor_stock(symbol, time_range, limit=30)
            results[symbol] = {
                'mentions': result['total_mentions'],
                'sentiment': result['average_sentiment'],
                'sentiment_label': result['sentiment_label']
            }
            time.sleep(2)  # 避免过快请求
        
        # 排序
        sorted_by_mentions = sorted(results.items(), key=lambda x: x[1]['mentions'], reverse=True)
        
        comparison = {
            'time_range': time_range,
            'stocks_compared': symbols,
            'ranking_by_mentions': sorted_by_mentions,
            'timestamp': datetime.now().isoformat()
        }
        
        # 保存结果
        self._save_result(comparison, f"pushshift_comparison_{datetime.now().strftime('%Y%m%d_%H%M')}")
        
        return comparison
    
    def _save_result(self, data: Dict, filename: str):
        """保存结果到JSON文件"""
        filepath = os.path.join(self.data_dir, f"{filename}.json")
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print(f"💾 结果已保存: {filepath}")
    
    def print_stock_report(self, result: Dict):
        """打印股票监控报告"""
        print("\n" + "="*70)
        print(f"📊 Pushshift股票监控报告: ${result['symbol']}")
        print("="*70)
        
        print(f"\n📈 统计概览:")
        print(f"  总提及数: {result['total_mentions']}")
        print(f"  时间范围: 过去{result['time_range']}")
        
        sentiment_emoji = '🟢' if result['sentiment_label'] == 'positive' else (
            '🔴' if result['sentiment_label'] == 'negative' else '⚪'
        )
        print(f"  平均情感: {sentiment_emoji} {result['sentiment_label']} ({result['average_sentiment']:.2f})")
        
        print(f"\n📍 Subreddit分布 (Top 10):")
        for sub, count in sorted(result['subreddit_distribution'].items(), 
                                key=lambda x: x[1], reverse=True)[:10]:
            print(f"  r/{sub}: {count} 条")
        
        print(f"\n🔥 热门帖子 (Top 5):")
        for i, post in enumerate(result['posts'][:5], 1):
            sentiment_emoji = '🟢' if post.get('sentiment') == 1 else (
                '🔴' if post.get('sentiment') == -1 else '⚪'
            )
            title = post.get('title', 'No title')[:70]
            print(f"\n  {i}. {sentiment_emoji} {title}...")
            print(f"     👤 u/{post.get('author', 'Unknown')} | "
                  f"📍 r/{post.get('subreddit', 'Unknown')} | "
                  f"⬆️ {post.get('score', 0)} | "
                  f"💬 {post.get('num_comments', 0)}")
            
            # 显示创建时间
            created_utc = post.get('created_utc')
            if created_utc:
                created_time = datetime.utcfromtimestamp(created_utc).strftime('%Y-%m-%d %H:%M')
                print(f"     🕐 {created_time} UTC")
        
        print("\n" + "="*70)
    
    def print_comparison_report(self, comparison: Dict):
        """打印对比报告"""
        print("\n" + "="*70)
        print(f"📈 股票热度对比 (过去{comparison['time_range']})")
        print("="*70)
        
        print("\n🏆 提及数排名:")
        for i, (symbol, data) in enumerate(comparison['ranking_by_mentions'], 1):
            sentiment_emoji = '🟢' if data['sentiment_label'] == 'positive' else (
                '🔴' if data['sentiment_label'] == 'negative' else '⚪'
            )
            print(f"  {i}. ${symbol}: {data['mentions']} 次提及 "
                  f"{sentiment_emoji} {data['sentiment_label']}")
        
        print("\n" + "="*70)


def main():
    """主函数"""
    import argparse
    
    parser = argparse.ArgumentParser(
        description='虾虾Pushshift Reddit监控器 - 免费免登录方案',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
使用示例:
  # 监控NVDA股票
  python3 pushshift_monitor.py --stock NVDA
  
  # 监控关键词
  python3 pushshift_monitor.py --keyword "artificial intelligence"
  
  # 监控WSB subreddit
  python3 pushshift_monitor.py --subreddit wallstreetbets
  
  # 对比多只股票
  python3 pushshift_monitor.py --compare NVDA AMD TSLA AAPL
  
  # 指定时间范围
  python3 pushshift_monitor.py --stock NVDA --time 7d
        """
    )
    
    parser.add_argument('--stock', '-s', type=str, help='监控特定股票')
    parser.add_argument('--keyword', '-k', type=str, help='监控关键词')
    parser.add_argument('--subreddit', '-r', type=str, help='监控subreddit')
    parser.add_argument('--compare', '-c', nargs='+', help='对比多只股票')
    parser.add_argument('--time', '-t', type=str, default='24h',
                       help='时间范围 (1h, 6h, 24h, 7d, 30d, 90d)')
    parser.add_argument('--limit', '-l', type=int, default=50,
                       help='返回数量 (默认50，最大100)')
    
    args = parser.parse_args()
    
    # 创建监控器
    monitor = PushshiftMonitor()
    
    if args.stock:
        result = monitor.monitor_stock(args.stock.upper(), args.time, args.limit)
        monitor.print_stock_report(result)
    
    elif args.keyword:
        result = monitor.monitor_keyword(args.keyword, args.time, limit=args.limit)
        print(f"\n✅ 找到 {result['total_posts']} 条帖子, {result['total_comments']} 条评论")
        print("\n热门帖子:")
        for i, post in enumerate(result['posts'][:5], 1):
            print(f"{i}. {post.get('title', 'No title')[:80]}...")
            print(f"   r/{post.get('subreddit', 'Unknown')}\n")
    
    elif args.subreddit:
        result = monitor.monitor_subreddit(args.subreddit, args.time, args.limit)
        print(f"\n✅ r/{args.subreddit} 找到 {result['total_posts']} 条帖子")
        print("\n最新帖子:")
        for i, post in enumerate(result['posts'][:5], 1):
            print(f"{i}. {post.get('title', 'No title')[:80]}...")
            print(f"   👤 u/{post.get('author', 'Unknown')} | ⬆️ {post.get('score', 0)}\n")
    
    elif args.compare:
        comparison = monitor.compare_stocks(args.compare, args.time)
        monitor.print_comparison_report(comparison)
    
    else:
        print("🦐 虾虾Pushshift Reddit监控器")
        print("="*70)
        print("\n✨ 特点：完全免费，无需API Key，无需Reddit账号")
        print("⚠️  限制：数据有5-30分钟延迟")
        print("\n使用方法:")
        print("  --stock NVDA        监控NVDA股票")
        print("  --keyword AI        搜索AI关键词")
        print("  --subreddit WSB     监控WSB")
        print("  --compare NVDA AMD  对比多只股票")
        print("  --time 7d           指定时间范围")
        print("\n详细帮助:")
        print("  python3 pushshift_monitor.py --help")


if __name__ == "__main__":
    main()
