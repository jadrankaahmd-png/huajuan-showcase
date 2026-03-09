import { NextResponse } from 'next/server';
import { getAllKnowledge, getAllBooks } from '@/lib/redis-client';

export async function GET() {
  try {
    // 1. 从 Redis 读取知识条目
    const knowledge = await getAllKnowledge();
    
    // 2. 从 Redis 读取书籍来源
    const bookSources = await getAllBooks();
    
    // 3. 返回数据
    return NextResponse.json({
      knowledge: knowledge,
      bookSources: bookSources,
      total: {
        knowledge: knowledge.length,
        bookSources: bookSources.length,
        grandTotal: knowledge.length + bookSources.length
      },
      source: {
        redis: true
      }
    });
    
  } catch (error) {
    console.error('读取知识库失败:', error);
    return NextResponse.json({
      error: '读取知识库失败',
      knowledge: [],
      bookSources: [],
      total: {
        knowledge: 0,
        bookSources: 0,
        grandTotal: 0
      }
    }, { status: 500 });
  }
}
