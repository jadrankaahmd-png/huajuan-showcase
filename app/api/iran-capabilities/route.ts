import { NextResponse } from 'next/server';

// Redis 客户端配置
const Redis = require('@upstash/redis').Redis;

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || 'https://valued-hamster-37498.upstash.io',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || 'AZJ6AAIncDE1YzRlYzY3NzI5OTU0MWIzOTM5YzNjMWE2NDkzMTkyZHAxMzc0OTg',
});

export async function GET() {
  try {
    // 从 Redis 读取伊朗局势能力
    const iranCapabilities = await redis.get('iran:capabilities') || [];
    
    return NextResponse.json({
      capabilities: iranCapabilities,
      total: iranCapabilities.length,
      source: 'redis'
    });
    
  } catch (error) {
    console.error('读取伊朗局势能力失败:', error);
    return NextResponse.json({
      error: '读取失败',
      capabilities: [],
      total: 0
    }, { status: 500 });
  }
}
