import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || 'https://valued-hamster-37498.upstash.io',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || 'AZJ6AAIncDE1YzRlYzY3NzI5OTU0MWIzOTM5YzNjMWE2NDkzMTkyZHAxMzc0OTg',
});

// 禁用缓存，确保每次都从 Redis 读取最新数据
export const revalidate = 0;

export async function GET() {
  try {
    // 从 Redis 读取最新新闻数据
    const newsData = await redis.get('telegram:news:latest');
    
    if (!newsData) {
      return NextResponse.json({ 
        error: '暂无数据',
        channels: {},
        total_messages: 0,
        active_channels: 0,
        last_update: null
      });
    }
    
    // 设置响应头禁止缓存
    return NextResponse.json(newsData, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    console.error('读取新闻数据失败:', error);
    return NextResponse.json({ error: '读取数据失败' }, { status: 500 });
  }
}
