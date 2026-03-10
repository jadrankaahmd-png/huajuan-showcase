import { NextResponse } from 'next/server';

// Redis 客户端配置
const Redis = require('@upstash/redis').Redis;

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || 'https://valued-hamster-37498.upstash.io',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || 'AZJ6AAIncDE1YzRlYzY3NzI5OTU0MWIzOTM5YzNjMWE2NDkzMTkyZHAxMzc0OTg',
});

export async function GET() {
  try {
    // 从 Redis 读取全站统计
    const globalStats = await redis.get('global:stats') || {
      layer1: { total: 631 },
      layer2: { total: 5 },
      layer3: { total: 4 },
      grandTotal: 640
    };
    
    return NextResponse.json({
      stats: globalStats,
      source: 'redis'
    });
    
  } catch (error) {
    console.error('读取全站统计失败:', error);
    return NextResponse.json({
      error: '读取失败',
      stats: {
        layer1: { total: 631 },
        layer2: { total: 5 },
        layer3: { total: 4 },
        grandTotal: 640
      }
    }, { status: 500 });
  }
}
