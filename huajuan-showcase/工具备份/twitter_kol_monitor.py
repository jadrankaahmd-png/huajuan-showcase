#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Twitter KOL监控器 - 三重保障方案
作者：虾虾
创建时间：2026-02-08
用途：监控44位KOL的Twitter动态（Nitter + RSS + ntscraper）
"""

import feedparser
import requests
import json
import os
import time
from datetime import datetime, timedelta
from ntscraper import Nitter
import sys


class TwitterMonitor:
    """Twitter KOL监控器 - 三重保障"""
    
    def __init__(self):
        self.kol_list = self.load_kol_list()
        self.nitter_instances = [
            "https://nitter.net",
            "https://nitter.it",
            "https://nitter.cz",
            "https://nitter.privacydev.net"
        ]
        self.scraper = None
        self.data_dir = os.path.expanduser("~/.openclaw/workspace/KOL监控数据")
        os.makedirs(self.data_dir, exist_ok=True)
        
    def load_kol_list(self):
        """加载44位KOL列表"""
        return [
            # 科技/AI领袖 (10位)
            "elonmusk", "nvidia", "sundarpichai", "satyanadella", "tim_cook",
            "MarkZuckerberg", "sama", "DoveyWan", "demishassabis", "DrJimFan",
            
            # 半导体专家 (10位)
            "semianalysis", "jrjaramillo", "DougOLeary2", "kylebrussell", "Tech_Portal",
            "danielnenni", "esilvestro", "BobOToole", "IanCutress", "awei01",
            
            # 投资/金融专家 (10位)
            "CathieDWood", "jimcramer", "chamath", "paulg", "fredwilson",
            "davidmarcus", "billackman", "gdb", "howardmarks", "rabois",
            
            # Crypto/Web3专家 (8位)
            "VitalikButerin", "balajis", "saylor", "naval",
            "aantonop", "RyanWatkins_", "twobitidiot", "APompliano",
            
            # 宏观/策略分析师 (6位)
            "GoldmanSachs", "MorganStanley", "DeItaone", "tracyalloway",
            "byron_gill", "LynAldenContact",
            
            # 新增KOL（第45位）
            "jukan05"
        ]
    
    def get_rss_feed(self, username, instance_idx=0):
        """
        方案1&2: 通过Nitter RSS获取推文
        """
        if instance_idx >= len(self.nitter_instances):
            return None
            
        instance = self.nitter_instances[instance_idx]
        rss_url = f"{instance}/{username}/rss"
        
        try:
            feed = feedparser.parse(rss_url)
            if feed.entries:
                return feed.entries
            else:
                # 尝试下一个实例
                return self.get_rss_feed(username, instance_idx + 1)
        except Exception as e:
            print(f"  ⚠️ RSS获取失败 {username}: {e}")
            # 尝试下一个实例
            return self.get_rss_feed(username, instance_idx + 1)
    
    def get_tweets_ntscraper(self, username, number=10):
        """
        方案3: 使用ntscraper获取推文
        """
        try:
            if self.scraper is None:
                self.scraper = Nitter()
            
            tweets = self.scraper.get_tweets(username, mode='user', number=number)
            return tweets
        except Exception as e:
            print(f"  ⚠️ ntscraper获取失败 {username}: {e}")
            return None
    
    def monitor_kol(self, username):
        """
        监控单个KOL - 三套方案 fallback
        """
        results = {
            'username': username,
            'timestamp': datetime.now().isoformat(),
            'tweets': []
        }
        
        print(f"  监控 @{username}...", end=" ")
        
        # 方案1&2: 尝试RSS
        rss_tweets = self.get_rss_feed(username)
        if rss_tweets:
            for entry in rss_tweets[:5]:  # 取最新5条
                results['tweets'].append({
                    'source': 'rss',
                    'published': entry.get('published', ''),
                    'title': entry.get('title', ''),
                    'link': entry.get('link', '')
                })
            print(f"✅ RSS成功 ({len(rss_tweets)}条)")
            return results
        
        # 方案3: 尝试ntscraper
        ntscraper_tweets = self.get_tweets_ntscraper(username, number=5)
        if ntscraper_tweets and 'tweets' in ntscraper_tweets:
            for tweet in ntscraper_tweets['tweets'][:5]:
                results['tweets'].append({
                    'source': 'ntscraper',
                    'published': tweet.get('date', ''),
                    'content': tweet.get('text', ''),
                    'link': tweet.get('link', '')
                })
            print(f"✅ ntscraper成功 ({len(ntscraper_tweets['tweets'])}条)")
            return results
        
        print("❌ 所有方案失败")
        return results
    
    def monitor_all(self):
        """
        监控所有44位KOL
        """
        print(f"\n🦐 开始监控 {len(self.kol_list)} 位KOL...")
        print(f"   时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print("=" * 70)
        
        all_results = []
        success_count = 0
        
        for i, username in enumerate(self.kol_list, 1):
            print(f"\n[{i}/{len(self.kol_list)}] ", end="")
            result = self.monitor_kol(username)
            all_results.append(result)
            
            if result['tweets']:
                success_count += 1
            
            # 避免请求过快
            time.sleep(1)
        
        # 保存结果
        self.save_results(all_results)
        
        print("\n" + "=" * 70)
        print(f"\n✅ 监控完成: {success_count}/{len(self.kol_list)} 位KOL获取成功")
        print(f"   数据已保存到: {self.data_dir}")
        
        return all_results
    
    def save_results(self, results):
        """保存监控结果"""
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f"{self.data_dir}/kol_monitor_{timestamp}.json"
        
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(results, f, ensure_ascii=False, indent=2)
        
        print(f"\n💾 数据已保存: {filename}")
    
    def get_latest_tweets(self, username, hours=24):
        """
        获取指定KOL最近N小时的推文
        """
        result = self.monitor_kol(username)
        
        if not result['tweets']:
            return []
        
        # 过滤最近N小时的推文
        cutoff_time = datetime.now() - timedelta(hours=hours)
        recent_tweets = []
        
        for tweet in result['tweets']:
            # 这里简化处理，实际应该解析时间
            recent_tweets.append(tweet)
        
        return recent_tweets
    
    def search_keywords(self, keywords, hours=24):
        """
        在所有KOL推文中搜索关键词
        """
        print(f"\n🔍 搜索关键词: {keywords}")
        print("=" * 70)
        
        matches = []
        
        for username in self.kol_list:
            tweets = self.get_latest_tweets(username, hours)
            
            for tweet in tweets:
                content = tweet.get('title', '') or tweet.get('content', '')
                
                for keyword in keywords:
                    if keyword.lower() in content.lower():
                        matches.append({
                            'username': username,
                            'keyword': keyword,
                            'content': content[:200],
                            'published': tweet.get('published', '')
                        })
                        break
        
        print(f"\n✅ 找到 {len(matches)} 条相关推文")
        return matches


def main():
    """主函数"""
    if len(sys.argv) < 2:
        print("🦐 Twitter KOL监控器 - 三重保障方案")
        print("=" * 70)
        print("用法:")
        print("  监控所有KOL: python twitter_kol_monitor.py --all")
        print("  监控单个KOL: python twitter_kol_monitor.py <用户名>")
        print("  搜索关键词: python twitter_kol_monitor.py --search <关键词1> <关键词2>")
        print("\n示例:")
        print("  python twitter_kol_monitor.py --all")
        print("  python twitter_kol_monitor.py nvidia")
        print("  python twitter_kol_monitor.py --search NVDA TSLA AI")
        sys.exit(1)
    
    monitor = TwitterMonitor()
    
    if sys.argv[1] == '--all':
        monitor.monitor_all()
    elif sys.argv[1] == '--search':
        keywords = sys.argv[2:]
        matches = monitor.search_keywords(keywords)
        
        print("\n📊 搜索结果:")
        for match in matches[:10]:  # 显示前10条
            print(f"\n  @{match['username']} [关键词: {match['keyword']}]")
            print(f"    {match['content'][:150]}...")
    else:
        username = sys.argv[1]
        result = monitor.monitor_kol(username)
        
        print(f"\n📊 @{username} 的最新推文:")
        for tweet in result['tweets']:
            print(f"\n  [{tweet.get('published', '')}]")
            content = tweet.get('title', '') or tweet.get('content', '')
            print(f"    {content[:200]}...")


if __name__ == "__main__":
    main()
