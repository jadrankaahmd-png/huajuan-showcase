import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // 1. 读取知识条目文件
    const knowledgeBaseDir = path.join(process.cwd(), 'public/knowledge_base');
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
              category: '知识条目',
              type: '知识条目',
              icon: '📖'
            });
          }
        } catch (err) {
          console.error('读取文件失败:', file, err);
        }
      }
    }
    
    // 2. 读取书籍来源文件
    const bookSourcesPath = path.join(process.cwd(), 'public/knowledge_base/book-sources.json');
    let bookSources: any[] = [];
    
    if (fs.existsSync(bookSourcesPath)) {
      try {
        const bookSourcesContent = fs.readFileSync(bookSourcesPath, 'utf-8');
        bookSources = JSON.parse(bookSourcesContent);
      } catch (err) {
        console.error('读取书籍来源失败:', err);
      }
    }
    
    // 3. 去重（以 title 为唯一标识）
    const allKnowledge: any[] = [];
    const seenTitles = new Set<string>();
    
    for (const item of fileKnowledge) {
      if (!seenTitles.has(item.title)) {
        seenTitles.add(item.title);
        allKnowledge.push(item);
      }
    }
    
    return NextResponse.json({
      knowledge: allKnowledge,
      bookSources: bookSources,
      total: {
        knowledge: allKnowledge.length,
        bookSources: bookSources.length,
        grandTotal: allKnowledge.length + bookSources.length
      },
      source: {
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
