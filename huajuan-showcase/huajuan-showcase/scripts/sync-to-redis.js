#!/usr/bin/env node
/**
 * 统一同步脚本 - 一键同步所有能力到 Redis
 * 
 * 功能：
 * 1. 读取 data/custom-capabilities.json（自定义能力）
 * 2. 读取 SQLite 数据库原有能力
 * 3. 合并所有能力
 * 4. 写入 Redis
 * 5. 更新统计数字
 * 
 * 使用：npm run sync 或 node scripts/sync-to-redis.js
 */

const { Redis } = require('@upstash/redis');
const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

// Redis 客户端
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || 'https://valued-hamster-37498.upstash.io',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || 'AZJ6AAIncDE1YzRlYzY3NzI5OTU0MWIzOTM5YzNjMWE2NDkzMTkyZHAxMzc0OTg',
});

async function syncCapabilities() {
  console.log('📦 同步主能力（从 SQLite + 自定义能力）...\n');
  
  const db = new Database('data/capabilities.db');
  
  // 1. 读取 SQLite 原有能力
  const sqliteCaps = db.prepare(`
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
  
  const capabilitiesFromSqlite = sqliteCaps.map((cap, index) => ({
    id: `capability_${index + 1}`,
    name: cap.name,
    description: cap.description,
    category: cap.category,
    categoryName: cap.category,
    type: cap.type,
    status: cap.status,
    icon: cap.icon,
    details: JSON.parse(cap.details_json || '{}'),
    source: 'sqlite' // 标记来源
  }));
  
  console.log(`✅ 从 SQLite 读取 ${capabilitiesFromSqlite.length} 条能力`);
  
  // 2. 读取自定义能力
  const customCapsPath = path.join(__dirname, '../data/custom-capabilities.json');
  let customCapabilities = [];
  
  if (fs.existsSync(customCapsPath)) {
    customCapabilities = JSON.parse(fs.readFileSync(customCapsPath, 'utf-8'));
    console.log(`✅ 从 custom-capabilities.json 读取 ${customCapabilities.length} 条自定义能力`);
  } else {
    console.log('⚠️  未找到 custom-capabilities.json，跳过自定义能力');
  }
  
  // 3. 合并能力（自定义能力优先，因为可能更新）
  const capabilitiesMap = new Map();
  
  // 先添加 SQLite 能力
  for (const cap of capabilitiesFromSqlite) {
    capabilitiesMap.set(cap.name, cap);
  }
  
  // 再添加自定义能力（会覆盖同名能力）
  for (const cap of customCapabilities) {
    capabilitiesMap.set(cap.name, cap);
  }
  
  const allCapabilities = Array.from(capabilitiesMap.values());
  
  console.log(`📊 合并后总能力数: ${allCapabilities.length} 条`);
  
  // 4. 写入 Redis
  await redis.set('capabilities:all', allCapabilities);
  console.log(`✅ 写入 capabilities:all (${allCapabilities.length} 条)`);
  
  // 5. 按分类索引
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
  
  return allCapabilities;
}

async function syncKnowledge() {
  console.log('\n📦 同步知识条目（从 public/knowledge_base/）...\n');
  
  const knowledgeBaseDir = path.join(process.cwd(), 'public/knowledge_base');
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
        icon: '📖'
      });
      console.log(`  ✅ ${title}`);
    }
  }
  
  await redis.set('knowledge:items', allKnowledge);
  console.log(`✅ 写入 knowledge:items (${allKnowledge.length} 条)`);
  
  return allKnowledge;
}

async function syncBooks() {
  console.log('\n📦 同步书籍来源（从 public/knowledge_base/book-sources.json）...\n');
  
  const bookSourcesPath = path.join(process.cwd(), 'public/knowledge_base/book-sources.json');
  const bookSourcesContent = fs.readFileSync(bookSourcesPath, 'utf-8');
  const bookSources = JSON.parse(bookSourcesContent);
  
  console.log(`读取 ${bookSources.length} 条书籍来源`);
  
  await redis.set('knowledge:books', bookSources);
  console.log(`✅ 写入 knowledge:books (${bookSources.length} 条)`);
  
  return bookSources;
}

async function syncSubPages() {
  console.log('\n📦 同步子页面能力（伊朗局势、Telegram、QVeris）...\n');
  
  // 1. 伊朗局势能力（从 SQLite iran-tracker 分类）
  const db = new Database('data/capabilities.db');
  const iranCaps = db.prepare(`
    SELECT name, description, type, status, icon
    FROM capabilities 
    WHERE category = 'iran-tracker'
  `).all();
  
  const iranCapabilities = iranCaps.map(cap => ({
    name: cap.name,
    description: cap.description,
    type: cap.type,
    status: cap.status
  }));
  
  await redis.set('iran:capabilities', iranCapabilities);
  console.log(`✅ 写入 iran:capabilities (${iranCapabilities.length} 条)`);
  
  // 2. Telegram 频道（从数据文件）
  const telegramData = JSON.parse(fs.readFileSync('data/telegram_news/latest.json', 'utf-8'));
  const channelStats = telegramData.channel_stats || {};
  
  await redis.set('telegram:channels', channelStats);
  console.log(`✅ 写入 telegram:channels (${Object.keys(channelStats).length} 个频道)`);
  
  // 3. QVeris 能力（从 SQLite qveris 分类）
  const qverisCaps = db.prepare(`
    SELECT name, description, type, status
    FROM capabilities 
    WHERE category = 'qveris'
  `).all();
  
  const qverisCapabilities = qverisCaps.map(cap => ({
    name: cap.name,
    description: cap.description,
    type: cap.type,
    status: cap.status
  }));
  
  await redis.set('qveris:capabilities', qverisCapabilities);
  console.log(`✅ 写入 qveris:capabilities (${qverisCapabilities.length} 条)`);
  
  db.close();
  
  return {
    iran: iranCapabilities.length,
    telegram: Object.keys(channelStats).length,
    qveris: qverisCapabilities.length
  };
}

async function updateStats(capabilities, knowledge, books, subPages) {
  console.log('\n📦 更新统计数据...\n');
  
  const uniqueCapabilities = new Set(capabilities.map(c => c.name)).size;
  const customCaps = capabilities.filter(c => c.source === 'custom');
  
  const stats = {
    mainCapabilities: uniqueCapabilities,
    customCapabilities: customCaps.length,
    sqliteCapabilities: capabilities.length - customCaps.length,
    knowledge: knowledge.length,
    books: books.length,
    iran: subPages.iran,
    telegram: subPages.telegram,
    qveris: subPages.qveris,
    grandTotal: uniqueCapabilities + knowledge.length + books.length + subPages.iran + subPages.telegram + subPages.qveris,
    lastUpdate: new Date().toISOString()
  };
  
  await redis.set('stats:total', stats);
  
  console.log('✅ 写入 stats:total');
  console.log('\n📊 总统计:');
  console.log('  - 主能力：', stats.mainCapabilities);
  console.log('    - SQLite 能力：', stats.sqliteCapabilities);
  console.log('    - 自定义能力：', stats.customCapabilities);
  console.log('  - 知识条目：', stats.knowledge);
  console.log('  - 书籍：', stats.books);
  console.log('  - 伊朗局势：', stats.iran);
  console.log('  - Telegram：', stats.telegram);
  console.log('  - QVeris：', stats.qveris);
  console.log('  - 总计：', stats.grandTotal);
  
  return stats;
}

async function verify() {
  console.log('\n🔍 验证同步结果...\n');
  
  const capabilities = await redis.get('capabilities:all');
  const knowledge = await redis.get('knowledge:items');
  const books = await redis.get('knowledge:books');
  const stats = await redis.get('stats:total');
  
  console.log('📊 Redis 数据验证:');
  console.log('  ✅ capabilities:all -', capabilities.length, '条');
  console.log('  ✅ knowledge:items -', knowledge.length, '条');
  console.log('  ✅ knowledge:books -', books.length, '条');
  console.log('  ✅ stats:total -', JSON.stringify(stats));
}

async function main() {
  console.log('🚀 开始一键同步到 Redis...\n');
  
  try {
    // 1. 同步主能力
    const capabilities = await syncCapabilities();
    
    // 2. 同步知识条目
    const knowledge = await syncKnowledge();
    
    // 3. 同步书籍
    const books = await syncBooks();
    
    // 4. 同步子页面
    const subPages = await syncSubPages();
    
    // 5. 更新统计
    const stats = await updateStats(capabilities, knowledge, books, subPages);
    
    // 6. 验证
    await verify();
    
    console.log('\n✅ 同步完成！');
    console.log('\n📊 最终统计:');
    console.log('  - 主能力：', stats.mainCapabilities);
    console.log('  - 知识库总计：', stats.knowledge + stats.books);
    console.log('  - 子页面总计：', stats.iran + stats.telegram + stats.qveris);
    console.log('  - 第一层总能力数：', stats.grandTotal);
    
  } catch (error) {
    console.error('❌ 同步失败:', error);
    process.exit(1);
  }
}

main();
