import { NextResponse } from 'next/server';
import { getAllCapabilities, getStats } from '@/lib/redis-client';

export async function GET() {
  try {
    // 1. 从 Redis 读取所有能力
    const capabilities = await getAllCapabilities();
    
    // 2. 从 Redis 读取统计数据
    const stats = await getStats();
    
    // 3. 返回数据
    return NextResponse.json({
      capabilities: capabilities,
      stats: {
        total: stats?.capabilities || capabilities.length,
        categories: stats?.categories || 0,
        grandTotal: stats?.grandTotal || 0
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
