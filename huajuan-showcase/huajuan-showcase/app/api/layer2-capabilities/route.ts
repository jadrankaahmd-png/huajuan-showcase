import { NextResponse } from 'next/server';

// Redis 客户端配置
const Redis = require('@upstash/redis').Redis;

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || 'https://valued-hamster-37498.upstash.io',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || 'AZJ6AAIncDE1YzRlYzY3NzI5OTU0MWIzOTM5YzNjMWE2NDkzMTkyZHAxMzc0OTg',
});

export async function GET() {
  try {
    // 从 Redis 读取第二层能力
    const capabilities = await redis.get('layer2:capabilities') || [];
    const stats = await redis.get('layer2:stats') || {
      total: 0,
      active: 0,
      inactive: 0
    };
    
    return NextResponse.json({
      capabilities,
      stats,
      source: 'redis'
    });
    
  } catch (error) {
    console.error('读取第二层能力失败:', error);
    return NextResponse.json({
      error: '读取失败',
      capabilities: [],
      stats: { total: 0, active: 0, inactive: 0 }
    }, { status: 500 });
  }
}
