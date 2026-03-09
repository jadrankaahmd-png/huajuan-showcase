#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
RSS KOL监控器 - 备用方案
作者：虾虾
创建时间：2026-02-08
用途：纯RSS方案监控KOL（当ntscraper失败时的备用）
"""

import feedparser
import yaml
import json
import os
import time
from datetime import datetime, timedelta
import sys


class RSSMonitor:
    """RSS KOL监控器"""
    
    def __init__(self):
        self.config = self.load_config()
        self.data_dir = os.path.expanduser("~/.openclaw/workspace/KOL监控数据")
        os.makedirs(self.data_dir, exist_ok=True)
        
    def load_config(self):
        """加载RSS配置"""
        config_path = os.path.expanduser("~/.openclaw/workspace/KOL储备库/kol_rss_feeds.yaml")
        
        # 如果YAML解析失败，使用默认配置
        try:
            with open(config_path, 'r') as f:
                return yaml.safe_load(f)
        except:
            print("⚠️ 无法加载YAML配置，使用默认配置")
            return self.get_default_config()
    
    def get_default_config(self):
        """默认配置"""
        return {
            'nitter_instances': [
                'https://nitter.net',
                'https://nitter.it',
                'https://nitter.cz'
            ],
            'kol_rss_feeds': [
                {'username': 'elonmusk', 'rss': 'https://nitter.net/elonmusk/rss'},
                {'username': 'nvidia', 'rss': 'https://nitter.net/nvidia/rss'},
                {'username': 'DoveyWan', 'rss': 'https://nitter.net/DoveyWan/rss'},
            ]
        }
    
    def fetch_rss(self, rss_url, instance_idx=0):
        """获取RSS订阅"""
        instances = self.config.get('nitter_instances', ['https://nitter.net'])
        
        if instance_idx >= len(instances):
            return None
        
        # 替换实例域名
        original_instance = 'https://nitter.net'
        new_instance = instances[instance_idx]
        rss_url = rss_url.replace(original_instance, new_instance)
        
        try:
            feed = feedparser.parse(rss_url)
            if feed.entries:
                return feed.entries
            else:
                # 尝试下一个实例
                return self.fetch_rss(rss_url.replace(new_instance, original_instance), instance_idx + 1)
        except Exception as e:
            print(f"  ⚠️ RSS获取失败: {e}")
            return self.fetch_rss(rss_url.replace(new_instance, original_instance), instance_idx + 1)
    
    def monitor_kol(self, kol_config):
        """监控单个KOL"""
        username = kol_config['username']
        rss_url = kol_config['rss']
        category = kol_config.get('category', '未知')
        priority = kol_config.get('priority', 'medium')
        
        print(f"  监控 @{username} [{category}]...", end=" ")
        
        tweets = self.fetch_rss(rss_url)
        
        if tweets:
            result = {
                'username': username,
                'category': category,
                'priority': priority,
                'timestamp': datetime.now().isoformat(),
                'tweet_count': len(tweets),
                'tweets': []
            }
            
            for tweet in tweets[:5]:  # 只取最新5条
                result['tweets'].append({
                    'published': tweet.get('published', ''),
                    'title': tweet.get('title', '')[:200],
                    'link': tweet.get('link', '')
                })
            
            print(f"✅ 成功 ({len(tweets)}条)")
            return result
        else:
            print("❌ 失败")
            return {
                'username': username,
                'timestamp': datetime.now().isoformat(),
                'tweet_count': 0,
                'tweets': []
            }
    
    def monitor_all(self):
        """监控所有KOL"""
        kol_list = self.config.get('kol_rss_feeds', [])
        
        print(f"\n🦐 RSS监控 {len(kol_list)} 位KOL...")
        print(f"   时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print("=" * 70)
        
        results = []
        success_count = 0
        
        for i, kol in enumerate(kol_list, 1):
            print(f"\n[{i}/{len(kol_list)}] ", end="")
            result = self.monitor_kol(kol)
            results.append(result)
            
            if result['tweet_count'] > 0:
                success_count += 1
            
            # 避免请求过快
            time.sleep(0.5)
        
        # 保存结果
        self.save_results(results)
        
        print("\n" + "=" * 70)
        print(f"\n✅ RSS监控完成: {success_count}/{len(kol_list)} 位KOL获取成功")
        
        return results
    
    def save_results(self, results):
        """保存结果"""
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f"{self.data_dir}/rss_monitor_{timestamp}.json"
        
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(results, f, ensure_ascii=False, indent=2)
        
        print(f"\n💾 数据已保存: {filename}")
    
    def analyze_sentiment(self, text):
        """简单的情绪分析"""
        bullish_words = ['buy', 'bullish', 'upgrade', 'strong', 'growth', 'breakthrough']
        bearish_words = ['sell', 'bearish', 'downgrade', 'weak', 'decline', 'risk']
        
        text_lower = text.lower()
        
        bullish_count = sum(1 for word in bullish_words if word in text_lower)
        bearish_count = sum(1 for word in bearish_words if word in text_lower)
        
        if bullish_count > bearish_count:
            return 'bullish'
        elif bearish_count > bullish_count:
            return 'bearish'
        else:
            return 'neutral'
    
    def generate_report(self, results):
        """生成监控报告"""
        print("\n📊 RSS监控报告")
        print("=" * 70)
        
        # 按类别统计
        category_stats = {}
        sentiment_stats = {'bullish': 0, 'bearish': 0, 'neutral': 0}
        
        for result in results:
            category = result.get('category', '未知')
            if category not in category_stats:
                category_stats[category] = {'count': 0, 'tweets': 0}
            
            category_stats[category]['count'] += 1
            category_stats[category]['tweets'] += result.get('tweet_count', 0)
            
            # 情绪统计
            for tweet in result.get('tweets', []):
                sentiment = self.analyze_sentiment(tweet.get('title', ''))
                sentiment_stats[sentiment] += 1
        
        print("\n📈 按类别统计:")
        for category, stats in category_stats.items():
            print(f"   {category}: {stats['count']}位KOL, {stats['tweets']}条推文")
        
        print("\n😊 情绪统计:")
        print(f"   🟢 看涨: {sentiment_stats['bullish']}")
        print(f"   🔴 看跌: {sentiment_stats['bearish']}")
        print(f"   ⚪ 中性: {sentiment_stats['neutral']}")
        
        # 最新推文
        print("\n📝 最新推文:")
        for result in results[:5]:  # 显示前5位KOL
            if result.get('tweets'):
                tweet = result['tweets'][0]
                print(f"\n   @{result['username']}:")
                print(f"     {tweet['title'][:100]}...")


def main():
    """主函数"""
    if len(sys.argv) < 2:
        print("🦐 RSS KOL监控器 - 备用方案")
        print("=" * 70)
        print("用法:")
        print("  监控所有KOL: python rss_kol_monitor.py --all")
        print("  生成报告: python rss_kol_monitor.py --report")
        sys.exit(1)
    
    monitor = RSSMonitor()
    
    if sys.argv[1] == '--all':
        results = monitor.monitor_all()
    elif sys.argv[1] == '--report':
        # 加载最新的监控结果
        import glob
        data_dir = os.path.expanduser("~/.openclaw/workspace/KOL监控数据")
        files = glob.glob(f"{data_dir}/rss_monitor_*.json")
        
        if files:
            latest_file = max(files, key=os.path.getctime)
            with open(latest_file, 'r') as f:
                results = json.load(f)
            monitor.generate_report(results)
        else:
            print("❌ 没有找到监控数据，请先运行 --all")
    else:
        print("❌ 未知命令")


if __name__ == "__main__":
    main()
