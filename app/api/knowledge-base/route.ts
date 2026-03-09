import { NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const db = new Database('data/capabilities.db');
    
    // 1. 从数据库读取知识库相关能力
    const dbKnowledge = db.prepare(`
      SELECT 
        name as title,
        description as summary,
        details_json
      FROM capabilities 
      WHERE category = 'knowledge' 
         OR type = 'knowledge' 
         OR name LIKE '%知识%'
      ORDER BY created_at DESC
    `).all() as Array<{ title: string; summary: string; details_json: string }>;
    
    // 2. 从 knowledge_base/ 目录读取文件
    const knowledgeBaseDir = path.join(process.cwd(), 'knowledge_base');
    const fileKnowledge: any[] = [];
    
    if (fs.existsSync(knowledgeBaseDir)) {
      const files = fs.readdirSync(knowledgeBaseDir).filter(f => f.endsWith('.md'));
      
      for (const file of files) {
        try {
          const filePath = path.join(knowledgeBaseDir, file);
          const content = fs.readFileSync(filePath, 'utf-8');
          
          // 简单解析 Markdown 文件
          const lines = content.split('\n');
          let title = '';
          let summary = '';
          const insights: string[] = [];
          
          for (const line of lines) {
            if (line.startsWith('# ') && !title) {
              title = line.replace('# ', '').trim();
            } else if (line.startsWith('## ') && !summary) {
              summary = line.replace('## ', '').trim();
            } else if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
              insights.push(line.replace(/^[\-\*] /, '').trim());
            }
          }
          
          if (title) {
            fileKnowledge.push({
              title,
              summary: summary || '投资知识文件',
              insights: insights.length > 0 ? insights : ['详见文件内容'],
              source: 'knowledge_base/' + file,
              date: fs.statSync(filePath).mtime.toISOString().split('T')[0],
              category: '文件知识库',
              type: '知识条目',
              icon: '📖'
            });
          }
        } catch (err) {
          console.error('读取文件失败:', file, err);
        }
      }
    }
    
    // 3. 合并并去重（以 title 为唯一标识）
    const allKnowledge: any[] = [];
    const seenTitles = new Set<string>();
    
    // 添加数据库知识
    for (const item of dbKnowledge) {
      let details: any = {};
      try {
        details = JSON.parse(item.details_json || '{}');
      } catch {}
      
      const title = item.title;
      if (!seenTitles.has(title)) {
        seenTitles.add(title);
        allKnowledge.push({
          title,
          summary: item.summary || details.whatItDoes || '',
          insights: details.features || details.key_points || [],
          source: 'SQLite 数据库',
          date: new Date().toISOString().split('T')[0],
          category: '数据库知识库',
          type: '知识条目',
          icon: '📖'
        });
      }
    }
    
    // 添加文件知识（去重）
    for (const item of fileKnowledge) {
      if (!seenTitles.has(item.title)) {
        seenTitles.add(item.title);
        allKnowledge.push(item);
      }
    }
    
    // 4. 从数据库读取书籍来源
    const dbBookSources = db.prepare(`
      SELECT 
        name,
        description,
        details_json
      FROM capabilities 
      WHERE category = 'book-sources'
      ORDER BY created_at DESC
    `).all() as Array<{ name: string; description: string; details_json: string }>;
    
    const bookSources = dbBookSources.map(item => {
      let details: any = {};
      try {
        details = JSON.parse(item.details_json || '{}');
      } catch {}
      
      return {
        name: item.name,
        description: item.description,
        url: details.url || '#',
        example: details.example || ''
      };
    });
    
    db.close();
    
    return NextResponse.json({
      knowledge: allKnowledge,
      bookSources: bookSources,
      total: {
        knowledge: allKnowledge.length,
        bookSources: bookSources.length,
        grandTotal: allKnowledge.length + bookSources.length
      },
      source: {
        database: dbKnowledge.length,
        files: fileKnowledge.length
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
