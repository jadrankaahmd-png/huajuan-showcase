import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface KnowledgeEntry {
  title: string;
  source: string;
  date: string;
  summary: string;
  insights: string[];
  category: string;
  filePath: string;
}

export async function GET() {
  try {
    const knowledgeDir = path.join(process.cwd(), '..', 'knowledge_base');

    if (!fs.existsSync(knowledgeDir)) {
      return NextResponse.json({ knowledge: [], total: 0 });
    }

    const files = fs.readdirSync(knowledgeDir)
      .filter(file => file.endsWith('.md'))
      .map(file => {
        const filePath = path.join(knowledgeDir, file);
        const stats = fs.statSync(filePath);
        const content = fs.readFileSync(filePath, 'utf-8');

        // 解析 Markdown 文件
        const lines = content.split('\n');
        const title = lines[0]?.replace(/^#\s*/, '') || file.replace('.md', '');
        const dateMatch = content.match(/\*\*日期：\*\*\s*(\d{4}-\d{2}-\d{2})/);
        const date = dateMatch ? dateMatch[1] : stats.mtime.toISOString().split('T')[0];

        // 提取摘要
        const summaryMatch = content.match(/##\s*核心信息\s*\n\n([\s\S]*?)(?=\n##|$)/);
        const summary = summaryMatch ? summaryMatch[1].trim().substring(0, 200) : '投资分析文档';

        // 提取洞察
        const insights: string[] = [];
        const investmentPointsMatch = content.match(/###\s*✅\s*看涨因素\s*\n\n([\s\S]*?)(?=\n###|$)/);
        if (investmentPointsMatch) {
          const points = investmentPointsMatch[1].match(/[-*]\s*(.+)/g) || [];
          insights.push(...points.map(p => p.replace(/^[-*]\s*/, '')).slice(0, 7));
        }

        // 提取分类
        const categoryMatch = content.match(/_分类：(.+?)_/);
        const category = categoryMatch ? categoryMatch[1].split('（')[0] : '投资分析';

        return {
          title,
          source: '个人书籍提炼系统',
          date,
          summary,
          insights: insights.length > 0 ? insights : ['投资分析文档'],
          category,
          filePath: `knowledge_base/${file}`,
          mtime: stats.mtime.getTime()
        };
      })
      .sort((a, b) => b.mtime - a.mtime); // 按时间排序，最新在前

    return NextResponse.json({
      knowledge: files,
      total: files.length
    });
  } catch (error) {
    console.error('Error reading knowledge base:', error);
    return NextResponse.json({ knowledge: [], total: 0 });
  }
}
