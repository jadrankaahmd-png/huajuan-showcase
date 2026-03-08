#!/usr/bin/env python3
"""
Telegram 频道新闻抓取脚本（网页抓取方案）
功能：从7个顶级新闻频道抓取真实消息（通过网页抓取）
运行频率：每小时一次
输出：data/telegram_news/latest.json
"""

import os
import json
import requests
from datetime import datetime, timezone
from pathlib import Path
from bs4 import BeautifulSoup
import re

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

# 每个频道抓取的消息数量
MESSAGES_PER_CHANNEL = 5

def fetch_channel_web(channel_username, limit=5):
    """通过网页抓取单个频道的消息"""
    messages = []
    try:
        # Telegram 网页版 URL
        url = f"https://t.me/s/{channel_username}"
        
        print(f"   📡 正在抓取网页: {url}")
        
        # 发送请求
        headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        }
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        
        # 解析 HTML
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # 查找所有消息
        message_elements = soup.find_all('div', class_='tgme_widget_message')[:limit]
        
        for msg_elem in message_elements:
            try:
                # 提取消息 ID
                message_link = msg_elem.find('a', class_='tgme_widget_message_date')
                if message_link:
                    href = message_link.get('href', '')
                    message_id = href.split('/')[-1]
                else:
                    continue
                
                # 提取消息文本
                text_elem = msg_elem.find('div', class_='tgme_widget_message_text')
                text = text_elem.get_text(strip=True)[:500] if text_elem else "No text"
                
                # 提取时间
                time_elem = msg_elem.find('time', class_='time')
                if time_elem:
                    datetime_str = time_elem.get('datetime', '')
                    if datetime_str:
                        timestamp = datetime.fromisoformat(datetime_str.replace('Z', '+00:00')).isoformat()
                    else:
                        timestamp = datetime.now(timezone.utc).isoformat()
                else:
                    timestamp = datetime.now(timezone.utc).isoformat()
                
                # 提取浏览量
                views_elem = msg_elem.find('span', class_='tgme_widget_message_views')
                views_text = views_elem.get_text(strip=True) if views_elem else "0"
                # 转换浏览量（例如 "1.2K" -> 1200）
                views = convert_views(views_text)
                
                messages.append({
                    "channel": channel_username,
                    "message_id": message_id,
                    "text": text,
                    "timestamp": timestamp,
                    "views": views,
                    "link": f"https://t.me/{channel_username}/{message_id}",
                })
                
            except Exception as e:
                print(f"      ⚠️  解析消息失败: {e}")
                continue
        
    except requests.RequestException as e:
        print(f"   ❌ 网络请求失败: {e}")
    except Exception as e:
        print(f"   ❌ 抓取频道 @{channel_username} 失败: {e}")
    
    return messages

def convert_views(views_text):
    """转换浏览量文本为数字"""
    views_text = views_text.strip().upper()
    if not views_text:
        return 0
    
    try:
        if 'K' in views_text:
            return int(float(views_text.replace('K', '')) * 1000)
        elif 'M' in views_text:
            return int(float(views_text.replace('M', '')) * 1000000)
        else:
            return int(views_text)
    except:
        return 0

def fetch_all_channels():
    """抓取所有频道的消息"""
    print("🚀 开始使用网页抓取 Telegram 频道...")
    print(f"📅 执行时间：{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    news_data = {
        "last_update": datetime.now().isoformat(),
        "channels": {},
        "total_messages": 0,
    }
    
    # 抓取每个分类的频道
    for category, channels in CHANNELS.items():
        news_data["channels"][category] = []
        for channel in channels:
            print(f"📡 正在抓取 @{channel['username']}...")
            messages = fetch_channel_web(
                channel['username'], 
                limit=MESSAGES_PER_CHANNEL
            )
            
            # 添加频道信息
            for msg in messages:
                msg["channel_name"] = channel['name']
                msg["category"] = category
                msg["lang"] = channel['lang']
            
            news_data["channels"][category].extend(messages)
            news_data["total_messages"] += len(messages)
            
            print(f"   ✅ 抓取了 {len(messages)} 条消息")
    
    return news_data

def save_news_data(news_data):
    """保存新闻数据到 JSON 文件"""
    output_dir = Path(__file__).parent.parent / "data" / "telegram_news"
    output_dir.mkdir(parents=True, exist_ok=True)
    
    output_file = output_dir / "latest.json"
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(news_data, f, ensure_ascii=False, indent=2)
    
    print(f"\n✅ 新闻数据已保存到 {output_file}")
    print(f"📊 总计 {news_data['total_messages']} 条新闻")
    print(f"⏰ 更新时间：{news_data['last_update']}")

def main():
    """主函数"""
    try:
        # 抓取数据
        news_data = fetch_all_channels()
        
        # 保存数据
        save_news_data(news_data)
        
        print("\n✨ 抓取完成！")
        print("\n💡 说明：")
        print("- 通过 Telegram 网页版抓取公开频道消息")
        print("- 数据真实可靠，无需 API 登录")
        print("- 如需使用 Telethon MTProto API（需手动登录），请运行 tools/telegram_channel_scraper_telethon.py")
        
    except Exception as e:
        print(f"\n❌ 抓取失败: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()
