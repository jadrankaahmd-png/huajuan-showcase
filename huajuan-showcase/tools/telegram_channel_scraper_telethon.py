#!/usr/bin/env python3
"""
Telegram 频道新闻抓取脚本（Telethon MTProto API 版本）- v3.0
功能：从活跃频道抓取真实消息（使用官方 API）
优势：更稳定、更全面、无需网页解析
运行频率：每15分钟一次
输出：data/telegram_news/latest.json
"""

import os
import json
import asyncio
from datetime import datetime, timezone, timedelta
from pathlib import Path
from dotenv import load_dotenv
from telethon import TelegramClient
from telethon.errors import ChannelPrivateError, ChatAdminRequiredError, UsernameNotOccupiedError
from telethon.tl.types import Channel

# 加载环境变量
load_dotenv()

# API 凭证
API_ID = int(os.getenv('TELEGRAM_API_ID'))
API_HASH = os.getenv('TELEGRAM_API_HASH')

# 频道配置（已验证：24小时内有更新的活跃频道）
CHANNELS = {
    "blockchain": [
        {"username": "theblockbeats", "name": "BlockBeats", "lang": "zh"},
        {"username": "cointelegraph", "name": "Cointelegraph", "lang": "en"},
    ],
    "finance": [
        # 注：传统金融媒体的 Telegram 频道大多私有或无公开消息
    ],
    "tech": [
        {"username": "hackernewsfeed", "name": "Hacker News", "lang": "en"},
        {"username": "wired", "name": "Wired", "lang": "en"},
    ],
}

# 每个频道抓取的消息数量
MESSAGES_PER_CHANNEL = 50

# 时间过滤：只保留24小时内的新闻
TIME_FILTER_HOURS = 24

async def fetch_channel_messages(client, channel_username, limit=50):
    """抓取单个频道的最新消息（使用 Telethon）"""
    messages = []
    try:
        # 获取频道实体
        entity = await client.get_entity(channel_username)
        
        # 计算时间截止点
        now = datetime.now(timezone.utc)
        cutoff = now - timedelta(hours=TIME_FILTER_HOURS)
        
        # 抓取消息
        async for message in client.iter_messages(entity, limit=limit):
            # 只保留有文本的消息
            if not message.text:
                continue
            
            # 时间过滤
            if message.date < cutoff:
                break  # 因为消息是按时间倒序，遇到旧消息就可以停止
            
            messages.append({
                "channel": channel_username,
                "message_id": message.id,
                "text": message.text[:500],  # 限制文本长度
                "timestamp": message.date.isoformat(),
                "views": message.views or 0,
                "link": f"https://t.me/{channel_username}/{message.id}",
            })
        
        print(f"   ✅ 抓取了 {len(messages)} 条消息（24小时内）")
        
    except ChannelPrivateError:
        print(f"   ❌ 频道 @{channel_username} 是私有频道，无法访问")
    except ChatAdminRequiredError:
        print(f"   ❌ 频道 @{channel_username} 需要管理员权限")
    except UsernameNotOccupiedError:
        print(f"   ❌ 用户名 @{channel_username} 不存在")
    except Exception as e:
        print(f"   ❌ 抓取频道 @{channel_username} 失败: {e}")
    
    return messages

async def fetch_all_channels():
    """抓取所有频道的消息（使用 Telethon）"""
    print("🚀 开始使用 Telethon MTProto API 抓取 Telegram 频道...")
    print(f"📅 执行时间：{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"⏰ 时间过滤：只保留 {TIME_FILTER_HOURS} 小时内的新闻")
    
    # 创建 Telegram 客户端（使用已保存的 session）
    client = TelegramClient('telegram_session', API_ID, API_HASH)
    await client.start()
    
    print("✅ Telegram 客户端已连接（使用已保存的 session）")
    
    all_messages = []
    channel_stats = {}
    
    # 抓取每个分类的频道
    for category, channels in CHANNELS.items():
        for channel in channels:
            print(f"📡 正在抓取 @{channel['username']}...")
            messages = await fetch_channel_messages(
                client, 
                channel['username'], 
                limit=MESSAGES_PER_CHANNEL
            )
            
            # 添加频道信息
            for msg in messages:
                msg["channel_name"] = channel['name']
                msg["category"] = category
                msg["lang"] = channel['lang']
            
            all_messages.extend(messages)
            
            # 记录统计信息
            channel_stats[channel['username']] = len(messages)
    
    await client.disconnect()
    
    # 按时间倒序排序（最新的排最前面）
    all_messages.sort(key=lambda x: x['timestamp'], reverse=True)
    
    # 按分类重新组织
    news_data = {
        "last_update": datetime.now().isoformat(),
        "channels": {
            "blockchain": [],
            "finance": [],
            "tech": [],
        },
        "total_messages": len(all_messages),
        "channel_stats": channel_stats,
        "source": "Telethon MTProto API",
    }
    
    for msg in all_messages:
        news_data["channels"][msg["category"]].append(msg)
    
    return news_data

def save_news_data(news_data):
    """保存新闻数据到 JSON 文件"""
    output_dir = Path(__file__).parent.parent / "data" / "telegram_news"
    output_dir.mkdir(parents=True, exist_ok=True)
    
    output_file = output_dir / "latest.json"
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(news_data, f, ensure_ascii=False, indent=2)
    
    print(f"\n✅ 新闻数据已保存到 {output_file}")
    print(f"📊 总计 {news_data['total_messages']} 条新闻（24小时内）")
    print(f"⏰ 更新时间：{news_data['last_update']}")
    print(f"📡 数据来源：{news_data['source']}")
    
    # 显示各频道统计
    print("\n📋 各频道抓取统计：")
    for channel, count in news_data['channel_stats'].items():
        status = "✅" if count > 0 else "⚠️"
        print(f"  {status} @{channel}: {count} 条")

def main():
    """主函数"""
    try:
        # 运行异步抓取
        news_data = asyncio.run(fetch_all_channels())
        
        # 保存数据
        save_news_data(news_data)
        
        print("\n✨ 抓取完成！")
        print("\n💡 说明：")
        print("- 使用 Telethon MTProto API（官方 API）")
        print("- 只保留24小时内的新闻")
        print("- 按时间倒序排列（最新的在最前面）")
        print("- 数据更稳定、更全面")
        
    except Exception as e:
        print(f"\n❌ 抓取失败: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()
