#!/usr/bin/env python3
"""
Telegram Channel Scraper using Telethon
真实抓取 Telegram 频道消息
"""

import asyncio
import json
import argparse
import sys
from datetime import datetime, timezone
from telethon import TelegramClient
from telethon.tl.functions.messages import GetHistoryRequest
from telethon.tl.types import InputPeerChannel
from telethon.errors import SessionPasswordNeededError

# 配置
API_ID = None
API_HASH = None
SESSION_NAME = 'telegram_session'

class TelegramScraper:
    def __init__(self, api_id, api_hash):
        self.api_id = api_id
        self.api_hash = api_hash
        self.client = None
        
    async def connect(self):
        """连接到 Telegram"""
        print(f'🔌 正在连接 Telegram API...')
        print(f'   API ID: {self.api_id}')
        
        self.client = TelegramClient(SESSION_NAME, self.api_id, self.api_hash)
        await self.client.connect()
        
        if not await self.client.is_user_authorized():
            print('❌ 需要授权！请先运行授权流程')
            print('   提示：首次使用需要输入手机号和验证码')
            sys.exit(1)
        
        print('✅ 已连接到 Telegram')
    
    async def get_channel_messages(self, channel_username, limit=50):
        """获取频道消息"""
        try:
            print(f'📡 正在获取频道 @{channel_username} 的消息...')
            
            # 获取频道实体
            try:
                entity = await self.client.get_entity(channel_username)
            except Exception as e:
                print(f'   ⚠️ 无法获取频道实体: {e}')
                return []
            
            # 获取消息历史
            messages = await self.client(GetHistoryRequest(
                peer=entity,
                limit=limit,
                offset_date=None,
                offset_id=0,
                max_id=0,
                min_id=0,
                add_offset=0,
                hash=0
            ))
            
            result = []
            for msg in messages.messages:
                if hasattr(msg, 'message') and msg.message:
                    result.append({
                        'channel': channel_username,
                        'message_id': msg.id,
                        'text': msg.message,
                        'timestamp': msg.date.isoformat() if msg.date else None,
                        'views': msg.views or 0,
                        'link': f'https://t.me/{channel_username}/{msg.id}',
                        'channel_name': channel_username.title().replace('_', ' '),
                        'category': 'unknown',
                        'lang': 'unknown'
                    })
            
            print(f'   ✅ 获取到 {len(result)} 条消息')
            return result
            
        except Exception as e:
            print(f'   ❌ 获取消息失败: {e}')
            return []
    
    async def scrape_channels(self, channels_list):
        """抓取多个频道"""
        all_news = {
            'last_update': datetime.now(timezone.utc).isoformat(),
            'source': 'Telegram MTProto API (真实数据)',
            'channels': {
                'blockchain': [],
                'finance': [],
                'tech': []
            },
            'total_messages': 0,
            'active_channels': 0
        }
        
        # 解析频道列表
        for item in channels_list:
            if ':' in item:
                category, channel = item.split(':', 1)
            else:
                category = 'blockchain'
                channel = item
            
            messages = await self.get_channel_messages(channel, limit=50)
            
            if messages:
                # 更新分类
                for msg in messages:
                    msg['category'] = category
                
                if category in all_news['channels']:
                    all_news['channels'][category].extend(messages)
                else:
                    all_news['channels'][category] = messages
                
                all_news['active_channels'] += 1
        
        # 计算总数
        all_news['total_messages'] = sum(
            len(msgs) for msgs in all_news['channels'].values()
        )
        
        return all_news
    
    async def close(self):
        """关闭连接"""
        if self.client:
            await self.client.disconnect()
            print('🔌 已断开 Telegram 连接')

async def main():
    parser = argparse.ArgumentParser(description='Telegram 频道抓取器')
    parser.add_argument('--api-id', required=True, help='Telegram API ID')
    parser.add_argument('--api-hash', required=True, help='Telegram API Hash')
    parser.add_argument('--channels', required=True, help='频道列表（格式: category:channel,category:channel）')
    parser.add_argument('--output', required=True, help='输出文件路径')
    
    args = parser.parse_args()
    
    # 解析频道列表
    channels_list = [ch.strip() for ch in args.channels.split(',')]
    print(f'📋 要抓取的频道: {len(channels_list)} 个')
    
    # 创建抓取器
    scraper = TelegramScraper(args.api_id, args.api_hash)
    
    try:
        # 连接
        await scraper.connect()
        
        # 抓取
        all_news = await scraper.scrape_channels(channels_list)
        
        # 保存结果
        import os
        os.makedirs(os.path.dirname(args.output), exist_ok=True)
        
        with open(args.output, 'w', encoding='utf-8') as f:
            json.dump(all_news, f, ensure_ascii=False, indent=2)
        
        print(f'\n✅ 抓取完成！')
        print(f'📊 统计:')
        print(f'   - 总消息数: {all_news["total_messages"]}')
        print(f'   - 活跃频道: {all_news["active_channels"]}')
        print(f'   - 最后更新: {all_news["last_update"]}')
        print(f'   - 数据来源: {all_news["source"]}')
        print(f'   - 保存位置: {args.output}')
        
    finally:
        await scraper.close()

if __name__ == '__main__':
    asyncio.run(main())
