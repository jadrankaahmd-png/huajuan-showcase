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
    
    // 3. 计算唯一能力数（去重）
    const uniqueCapabilities = new Set(capabilities.map((c: any) => c.name)).size;
    
    // 4. 计算正确的总数：主能力 + 知识库 + 子页面
    const knowledge = stats?.knowledge || 0;
    const books = stats?.books || 0;
    const iran = stats?.iran || 0;
    const telegram = stats?.telegram || 0;
    const qveris = stats?.qveris || 0;
    const grandTotal = uniqueCapabilities + knowledge + books + iran + telegram + qveris;
    
    // 5. 按分类分组
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
    
    // 6. 返回数据
    return NextResponse.json({
      capabilities: categorizedCapabilities,
      stats: {
        total: grandTotal,  // 总计
        mainCapabilities: uniqueCapabilities,  // 主能力数
        knowledge: knowledge,  // 知识条目
        books: books,  // 书籍
        iran: iran,  // 伊朗局势
        telegram: telegram,  // Telegram
        qveris: qveris,  // QVeris
        categories: categoryMap.size,
        grandTotal: grandTotal,
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
