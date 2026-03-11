#!/usr/bin/env node
/**
 * 统一同步脚本 - 一键同步所有能力到 Redis
 * 
 * 功能（2026-03-11 升级版 - 仅Redis）：
 * 1. 读取 data/custom-capabilities.json（自定义能力）
 * 2. 读取 Redis 现有能力
 * 3. 合并并更新 Redis
 * 4. 同步知识库
 * 5. 更新统计
 * 
 * 注意：已移除 SQLite 依赖，数据全部存储在 Redis
 * 
 * 使用：npm run sync 或 node scripts/sync-to-redis.js
 */

const { Redis } = require('@upstash/redis');
const fs = require('fs');
const path = require('path');

// Redis 客户端
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || 'https://valued-hamster-37498.upstash.io',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || 'AZJ6AAIncDE1YzRlYzY3NzI5OTU0MWIzOTM5YzNjMWE2NDkzMTkyZHAxMzc0OKg',
});

async function syncCapabilities() {
  console.log('📦 同步主能力（从 Redis + 自定义能力）...\n');
  
  // 1. 获取 Redis 现有能力
  let existingCaps = [];
  try {
    existingCaps = await redis.get('capabilities:all') || [];
    console.log(`✅ 从 Redis 读取 ${existingCaps.length} 条现有能力`);
  } catch (e) {
    console.log('ℹ️  Redis 中暂无能力，从头开始');
  }
  
  const existingNames = new Set(existingCaps.map(c => c.name));
  
  // 2. 读取自定义能力
  const customCapsPath = path.join(__dirname, '../data/custom-capabilities.json');
  let customCapabilities = [];
  
  if (fs.existsSync(customCapsPath)) {
    customCapabilities = JSON.parse(fs.readFileSync(customCapsPath, 'utf-8'));
    console.log(`✅ 从 custom-capabilities.json 读取 ${customCapabilities.length} 条自定义能力`);
  } else {
    console.log('⚠️  未找到 custom-capabilities.json');
  }
  
  // 3. 合并能力（自定义优先）
  const capabilitiesMap = new Map();
  
  // 先添加现有能力
  for (const cap of existingCaps) {
    capabilitiesMap.set(cap.name, cap);
  }
  
  // 再添加自定义能力
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

async function syncSubPages(capabilities) {
  console.log('\n📦 同步子页面能力（从 capabilities:all 过滤）...\n');
  
  // 1. 伊朗局势能力
  const iranCaps = capabilities.filter(c => c.category === 'iran-tracker');
  const iranCapabilities = iranCaps.map(cap => ({
    name: cap.name,
    description: cap.description,
    type: cap.type,
    status: cap.status
  }));
  
  await redis.set('iran:capabilities', iranCapabilities);
  console.log(`✅ 写入 iran:capabilities (${iranCapabilities.length} 条)`);
  
  // 2. Telegram 频道
  let channelStats = {};
  try {
    const telegramData = JSON.parse(fs.readFileSync('data/telegram_news/latest.json', 'utf-8'));
    channelStats = telegramData.channel_stats || {};
  } catch (e) {
    console.log('ℹ️  未找到 telegram_news/latest.json');
  }
  
  await redis.set('telegram:channels', channelStats);
  console.log(`✅ 写入 telegram:channels (${Object.keys(channelStats).length} 个频道)`);
  
  // 3. QVeris 能力
  const qverisCaps = capabilities.filter(c => c.category === 'qveris');
  const qverisCapabilities = qverisCaps.map(cap => ({
    name: cap.name,
    description: cap.description,
    type: cap.type,
    status: cap.status
  }));
  
  await redis.set('qveris:capabilities', qverisCapabilities);
  console.log(`✅ 写入 qveris:capabilities (${qverisCapabilities.length} 条)`);
  
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
  const sqliteCaps = capabilities.filter(c => c.source !== 'custom');
  
  const stats = {
    mainCapabilities: uniqueCapabilities,
    customCapabilities: customCaps.length,
    sqliteCapabilities: sqliteCaps.length,
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
  console.log('    - 原 SQLite 能力：', stats.sqliteCapabilities);
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
  console.log('🚀 开始一键同步到 Redis (纯Redis版)...\n');
  
  try {
    // 1. 同步主能力
    const capabilities = await syncCapabilities();
    
    // 2. 同步知识条目
    const knowledge = await syncKnowledge();
    
    // 3. 同步书籍
    const books = await syncBooks();
    
    // 4. 同步子页面
    const subPages = await syncSubPages(capabilities);
    
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
