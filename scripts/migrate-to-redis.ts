/**
 * 数据迁移脚本：将所有数据迁移到 Upstash Redis
 * 
 * 迁移内容：
 * 1. capabilities.ts 所有612条能力 → Redis
 * 2. public/knowledge_base/ 所有29个 .md 文件 → Redis
 * 3. public/knowledge_base/book-sources.json 4条书籍 → Redis
 */

import { Redis } from '@upstash/redis';
import * as fs from 'fs';
import * as path from 'path';

// Upstash Redis 配置
const redis = new Redis({
  url: 'https://valued-hamster-37498.upstash.io',
  token: 'AZJ6AAIncDE1YzRlYzY3NzI5OTU0MWIzOTM5YzNjMWE2NDkzMTkyZHAxMzc0OTg',
});

async function migrateCapabilities() {
  console.log('📦 开始迁移 capabilities...');
  
  // 读取 capabilities.ts
  const { capabilities } = await import('../app/data/capabilities');
  
  // 扁平化所有能力
  const allCapabilities: any[] = [];
  const categoryMap: Record<string, any[]> = {};
  const typeMap: Record<string, any[]> = {};
  
  for (const category of capabilities) {
    for (const item of category.items) {
      const cap = {
        id: `capability_${item.name.replace(/[^a-zA-Z0-9]/g, '_')}`,
        name: item.name,
        description: item.description,
        category: category.category,
        categoryName: category.name,
        type: item.type,
        status: item.status,
        icon: item.icon,
        details: item.details,
      };
      
      allCapabilities.push(cap);
      
      // 按分类索引
      if (!categoryMap[category.category]) {
        categoryMap[category.category] = [];
      }
      categoryMap[category.category].push(cap);
      
      // 按类型索引
      if (item.type) {
        if (!typeMap[item.type]) {
          typeMap[item.type] = [];
        }
        typeMap[item.type].push(cap);
      }
    }
  }
  
  console.log(`✅ 读取 ${allCapabilities.length} 条能力`);
  
  // 写入 Redis
  await redis.set('capabilities:all', allCapabilities);
  console.log('✅ 写入 capabilities:all');
  
  // 写入分类索引
  for (const [category, items] of Object.entries(categoryMap)) {
    await redis.set(`capabilities:category:${category}`, items);
    console.log(`✅ 写入 capabilities:category:${category} (${items.length} 条)`);
  }
  
  // 写入类型索引
  for (const [type, items] of Object.entries(typeMap)) {
    await redis.set(`capabilities:type:${type}`, items);
    console.log(`✅ 写入 capabilities:type:${type} (${items.length} 条)`);
  }
  
  // 写入索引列表
  await redis.set('index:categories', Object.keys(categoryMap));
  await redis.set('index:types', Object.keys(typeMap));
  console.log('✅ 写入索引列表');
  
  return allCapabilities.length;
}

async function migrateKnowledgeItems() {
  console.log('\n📦 开始迁移知识条目...');
  
  const knowledgeBaseDir = path.join(process.cwd(), 'public/knowledge_base');
  const files = fs.readdirSync(knowledgeBaseDir).filter(f => f.endsWith('.md'));
  
  console.log(`找到 ${files.length} 个 .md 文件`);
  
  const allKnowledge: any[] = [];
  
  for (const file of files) {
    const filePath = path.join(knowledgeBaseDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    
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
      allKnowledge.push({
        title,
        summary: summary || '投资知识文件',
        insights: insights.length > 0 ? insights : ['详见文件内容'],
        source: 'knowledge_base/' + file,
        date: fs.statSync(filePath).mtime.toISOString().split('T')[0],
        category: '知识条目',
        type: '知识条目',
        icon: '📖',
      });
      console.log(`  ✅ ${title}`);
    }
  }
  
  // 写入 Redis
  await redis.set('knowledge:items', allKnowledge);
  console.log(`✅ 写入 knowledge:items (${allKnowledge.length} 条)`);
  
  return allKnowledge.length;
}

async function migrateBookSources() {
  console.log('\n📦 开始迁移书籍来源...');
  
  const bookSourcesPath = path.join(process.cwd(), 'public/knowledge_base/book-sources.json');
  const bookSourcesContent = fs.readFileSync(bookSourcesPath, 'utf-8');
  const bookSources = JSON.parse(bookSourcesContent);
  
  console.log(`读取 ${bookSources.length} 条书籍来源`);
  
  // 写入 Redis
  await redis.set('knowledge:books', bookSources);
  console.log(`✅ 写入 knowledge:books (${bookSources.length} 条)`);
  
  return bookSources.length;
}

async function updateStatistics(capabilitiesCount: number, knowledgeCount: number, booksCount: number) {
  console.log('\n📦 更新统计数据...');
  
  const stats = {
    capabilities: capabilitiesCount,
    knowledge: knowledgeCount,
    books: booksCount,
    grandTotal: capabilitiesCount + knowledgeCount + booksCount,
    lastUpdate: new Date().toISOString(),
  };
  
  await redis.set('stats:total', stats);
  console.log('✅ 写入 stats:total');
  console.log(`\n📊 总统计:`);
  console.log(`  - 能力：${capabilitiesCount} 条`);
  console.log(`  - 知识条目：${knowledgeCount} 条`);
  console.log(`  - 书籍：${booksCount} 条`);
  console.log(`  - 总计：${stats.grandTotal} 条`);
  
  return stats;
}

async function verifyMigration() {
  console.log('\n🔍 验证迁移结果...\n');
  
  // 读取并验证数据
  const capabilities = await redis.get('capabilities:all') as any[];
  const knowledge = await redis.get('knowledge:items') as any[];
  const books = await redis.get('knowledge:books') as any[];
  const stats = await redis.get('stats:total') as any;
  
  console.log('📊 Redis 数据验证:');
  console.log(`  ✅ capabilities:all - ${capabilities?.length || 0} 条`);
  console.log(`  ✅ knowledge:items - ${knowledge?.length || 0} 条`);
  console.log(`  ✅ knowledge:books - ${books?.length || 0} 条`);
  console.log(`  ✅ stats:total - ${JSON.stringify(stats)}`);
  
  // 检查重复
  const capNames = capabilities?.map((c: any) => c.name) || [];
  const uniqueNames = new Set(capNames);
  const duplicates = capNames.length - uniqueNames.size;
  
  console.log(`\n📊 去重验证:`);
  console.log(`  - 总能力：${capNames.length} 条`);
  console.log(`  - 唯一能力：${uniqueNames.size} 条`);
  console.log(`  - 重复能力：${duplicates} 条`);
  
  return {
    capabilities: capabilities?.length || 0,
    knowledge: knowledge?.length || 0,
    books: books?.length || 0,
    total: stats?.grandTotal || 0,
    duplicates,
  };
}

async function main() {
  console.log('🚀 开始数据迁移到 Upstash Redis...\n');
  
  try {
    // 迁移能力
    const capabilitiesCount = await migrateCapabilities();
    
    // 迁移知识条目
    const knowledgeCount = await migrateKnowledgeItems();
    
    // 迁移书籍来源
    const booksCount = await migrateBookSources();
    
    // 更新统计
    await updateStatistics(capabilitiesCount, knowledgeCount, booksCount);
    
    // 验证迁移
    const result = await verifyMigration();
    
    console.log('\n✅ 数据迁移完成！');
    console.log('\n📊 最终统计:');
    console.log(`  - 能力：${result.capabilities} 条`);
    console.log(`  - 知识条目：${result.knowledge} 条`);
    console.log(`  - 书籍：${result.books} 条`);
    console.log(`  - 总计：${result.total} 条`);
    console.log(`  - 重复：${result.duplicates} 条`);
    
  } catch (error) {
    console.error('❌ 迁移失败:', error);
    process.exit(1);
  }
}

main();
