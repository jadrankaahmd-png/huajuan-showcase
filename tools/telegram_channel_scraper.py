#!/usr/bin/env python3
"""
Telegram频道新闻抓取脚本
功能：从7个顶级新闻频道抓取最新消息
运行频率：每小时一次
输出：data/telegram_news/latest.json
"""

import json
import os
from datetime import datetime
from pathlib import Path

# 频道配置
CHANNELS = {
    "blockchain": [
        {"username": "theblockbeats", "name": "BlockBeats", "lang": "zh"},
        {"username": "cointelegraph", "name": "Cointelegraph", "lang": "en"},
    ],
    "finance": [
        {"username": "wsj", "name": "Wall Street Journal", "lang": "en"},
        {"username": "financialtimes", "name": "Financial Times", "lang": "en"},
        {"username": "bloomberg", "name": "Bloomberg", "lang": "en"},
    ],
    "tech": [
        {"username": "techcrunch", "name": "TechCrunch", "lang": "en"},
        {"username": "theverge", "name": "The Verge", "lang": "en"},
    ],
}

def generate_mock_news():
    """生成模拟新闻数据（实际部署时需替换为真实API调用）"""
    news_data = {
        "last_update": datetime.now().isoformat(),
        "channels": {},
        "total_messages": 0,
    }
    
    for category, channels in CHANNELS.items():
        news_data["channels"][category] = []
        for channel in channels:
            # 生成3条模拟新闻
            for i in range(3):
                message_id = 1000 + (hash(channel["username"] + str(i)) % 9000)
                news_item = {
                    "channel": channel["username"],
                    "channel_name": channel["name"],
                    "message_id": message_id,
                    "category": category,
                    "lang": channel["lang"],
                    "text": f"【{channel['name']}】最新新闻 #{i+1} - 这是模拟的新闻内容，实际部署时将从Telegram API获取真实数据。",
                    "views": 1000 + (hash(channel["username"] + str(i)) % 50000),
                    "timestamp": datetime.now().isoformat(),
                    "link": f"https://t.me/{channel['username']}/{message_id}",
                }
                news_data["channels"][category].append(news_item)
                news_data["total_messages"] += 1
    
    return news_data

def save_news_data(news_data):
    """保存新闻数据到JSON文件"""
    output_dir = Path(__file__).parent.parent / "data" / "telegram_news"
    output_dir.mkdir(parents=True, exist_ok=True)
    
    output_file = output_dir / "latest.json"
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(news_data, f, ensure_ascii=False, indent=2)
    
    print(f"✅ 新闻数据已保存到 {output_file}")
    print(f"📊 总计 {news_data['total_messages']} 条新闻")
    print(f"⏰ 更新时间：{news_data['last_update']}")

def main():
    print("🚀 开始抓取 Telegram 频道新闻...")
    print(f"📅 执行时间：{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    # 生成模拟数据（实际部署时需替换为真实API调用）
    news_data = generate_mock_news()
    
    # 保存数据
    save_news_data(news_data)
    
    print("\n✨ 抓取完成！")

if __name__ == "__main__":
    main()
