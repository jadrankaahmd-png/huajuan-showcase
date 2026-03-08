import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const dataPath = path.join(process.cwd(), 'data', 'telegram_news', 'latest.json');
    
    if (!fs.existsSync(dataPath)) {
      return NextResponse.json({ error: '数据文件不存在' }, { status: 404 });
    }
    
    const data = fs.readFileSync(dataPath, 'utf-8');
    const newsData = JSON.parse(data);
    
    return NextResponse.json(newsData);
  } catch (error) {
    console.error('读取新闻数据失败:', error);
    return NextResponse.json({ error: '读取数据失败' }, { status: 500 });
  }
}
