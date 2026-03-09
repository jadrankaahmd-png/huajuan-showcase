/**
 * 数据迁移脚本：将所有数据迁移到 Upstash Redis
 */

const { Redis } = require('@upstash/redis');
const fs = require('fs');
const path = require('path');

// Upstash Redis 配置
const redis = new Redis({
  url: 'https://valued-hamster-37498.upstash.io',
  token: 'AZJ6AAIncDE1YzRlYzY3NzI5OTU0MWIzOTM5YzNjMWE2NDkzMTkyZHAxMzc0OTg',
});

async function migrateCapabilities() {
  console.log('📦 开始迁移 capabilities...');
  
  // 直接读取 capabilities.ts 文件
  const capabilitiesPath = path.join(__dirname, '../app/data/capabilities.ts');
  const capabilitiesContent = fs.readFileSync(capabilitiesPath, 'utf-8');
  
  // 简单解析：提取所有能力条目
  // 由于 capabilities.ts 是 TypeScript，我们需要手动解析或使用 ts-node
  // 这里我们使用 SQLite 数据库作为数据源
  
  const Database = require('better-sqlite3');
  const dbPath = path.join(__dirname, '../data/capabilities.db');
  const db = new Database(dbPath);
  
  const allCaps = db.prepare(`
    SELECT 
      name,
      description,
      category,
      type,
      status,
      icon,
      details_json
    FROM capabilities
    ORDER BY category, name
  `).all();
  
  const allCapabilities = allCaps.map((cap, index) => ({
    id: `capability_${index + 1}`,
    name: cap.name,
    description: cap.description,
    category: cap.category,
    type: cap.type,
    status: cap.status,
    icon: cap.icon,
    details: JSON.parse(cap.details_json || '{}'),
  }));
  
  console.log(`✅ 读取 ${allCapabilities.length} 条能力`);
  
  // 写入 Redis
  await redis.set('capabilities:all', allCapabilities);
  console.log('✅ 写入 capabilities:all');
  
  // 按分类索引
  const categoryMap = {};
  for (const cap of allCapabilities) {
    if (!categoryMap[cap.category]) {
      categoryMap[cap.category] = [];
    }
    categoryMap[cap.category].push(cap);
  }
  
  for (const [category, items] of Object.entries(categoryMap)) {
    await redis.set(`capabilities:category:${category}`, items);
    console.log(`✅ 写入 capabilities:category:${category} (${items.length} 条)`);
  }
  
  db.close();
  
  return allCapabilities.length;
}

async function migrateKnowledgeItems() {
  console.log('\n📦 开始迁移知识条目...');
  
  const knowledgeBaseDir = path.join(__dirname, '../public/knowledge_base');
  const files = fs.readdirSync(knowledgeBaseDir).filter(f => f.endsWith('.md'));
  
  console.log(`找到 ${files.length} 个 .md 文件`);
  
  const allKnowledge = [];
  
  for (const file of files) {
    const filePath = path.join(knowledgeBaseDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    
    const lines = content.split('\n');
    let title = '';
    let summary = '';
    const insights = [];
    
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
  
  const bookSourcesPath = path.join(__dirname, '../public/knowledge_base/book-sources.json');
  const bookSourcesContent = fs.readFileSync(bookSourcesPath, 'utf-8');
  const bookSources = JSON.parse(bookSourcesContent);
  
  console.log(`读取 ${bookSources.length} 条书籍来源`);
  
  // 写入 Redis
  await redis.set('knowledge:books', bookSources);
  console.log(`✅ 写入 knowledge:books (${bookSources.length} 条)`);
  
  return bookSources.length;
}

async function updateStatistics(capabilitiesCount, knowledgeCount, booksCount) {
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
  
  const capabilities = await redis.get('capabilities:all');
  const knowledge = await redis.get('knowledge:items');
  const books = await redis.get('knowledge:books');
  const stats = await redis.get('stats:total');
  
  console.log('📊 Redis 数据验证:');
  console.log(`  ✅ capabilities:all - ${capabilities?.length || 0} 条`);
  console.log(`  ✅ knowledge:items - ${knowledge?.length || 0} 条`);
  console.log(`  ✅ knowledge:books - ${books?.length || 0} 条`);
  console.log(`  ✅ stats:total - ${JSON.stringify(stats)}`);
  
  return {
    capabilities: capabilities?.length || 0,
    knowledge: knowledge?.length || 0,
    books: books?.length || 0,
    total: stats?.grandTotal || 0,
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
    
  } catch (error) {
    console.error('❌ 迁移失败:', error);
    process.exit(1);
  }
}

main();
