import { NextResponse } from 'next/server';

// Redis 客户端配置
const Redis = require('@upstash/redis').Redis;

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || 'https://valued-hamster-37498.upstash.io',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || 'AZJ6AAIncDE1YzRlYzY3NzI5OTU0MWIzOTM5YzNjMWE2NDkzMTkyZHAxMzc0OTg',
});

async function getAllCapabilities() {
  return await redis.get('capabilities:all') || [];
}

async function getStats() {
  return await redis.get('stats:total') || {};
}

export async function GET() {
  try {
    // 1. 从 Redis 读取所有能力
    const capabilities = await getAllCapabilities();
    
    // 2. 从 Redis 读取统计数据
    const stats = await getStats();
    
    // 3. 按分类分组
    const categoryMap = new Map<string, any[]>();
    for (const cap of capabilities) {
      const category = cap.category;
      if (!categoryMap.has(category)) {
        categoryMap.set(category, []);
      }
      categoryMap.get(category)!.push(cap);
    }
    
    const categorizedCapabilities = Array.from(categoryMap.entries()).map(([category, items]) => ({
      category,
      name: items[0]?.categoryName || category,
      items,
    }));
    
    // 4. 返回数据
    return NextResponse.json({
      capabilities: categorizedCapabilities,
      stats: {
        total: stats?.grandTotal || capabilities.length,
        capabilities: stats?.capabilities || 0,
        knowledge: stats?.knowledge || 0,
        books: stats?.books || 0,
        categories: categoryMap.size,
        grandTotal: stats?.grandTotal || 0,
      },
      source: {
        redis: true
      }
    });
    
  } catch (error) {
    console.error('读取能力失败:', error);
    return NextResponse.json({
      error: '读取能力失败',
      capabilities: [],
      stats: {
        total: 0,
        categories: 0,
        grandTotal: 0
      }
    }, { status: 500 });
  }
}
