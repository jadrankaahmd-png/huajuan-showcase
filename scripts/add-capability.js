#!/usr/bin/env node
/**
 * 新增能力到 Redis（不再使用 SQLite）
 * 
 * 使用：
 * node scripts/add-capability.js --name "能力名称" --description "描述" --category "分类" --type "类型" --status "active"
 * 
 * 或交互式：
 * node scripts/add-capability.js
 */

const { Redis } = require('@upstash/redis');
const readline = require('readline');

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || 'https://valued-hamster-37498.upstash.io',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || 'AZJ6AAIncDE1YzRlYzY3NzI5OTU0MWIzOTM5YzNjMWE2NDkzMTkyZHAxMzc0OTg',
});

async function addCapability(options) {
  console.log('📦 新增能力到 Redis...\n');
  
  // 1. 读取当前所有能力
  const capabilities = await redis.get('capabilities:all') || [];
  
  // 2. 创建新能力
  const newCapability = {
    id: `capability_${Date.now()}`,
    name: options.name,
    description: options.description,
    category: options.category,
    categoryName: options.category,
    type: options.type || '能力',
    status: options.status || 'active',
    icon: options.icon || '📋',
    details: {
      whatItDoes: options.description,
      howItWorks: '待补充',
      currentStatus: 'active',
      usage: '待补充',
      dependencies: []
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  // 3. 添加到能力列表
  capabilities.push(newCapability);
  
  // 4. 写回 Redis
  await redis.set('capabilities:all', capabilities);
  
  // 5. 更新分类索引
  const categoryKey = `capabilities:category:${options.category}`;
  const categoryCaps = await redis.get(categoryKey) || [];
  categoryCaps.push(newCapability);
  await redis.set(categoryKey, categoryCaps);
  
  console.log('✅ 能力已添加到 Redis');
  console.log('\n📊 新能力详情:');
  console.log(JSON.stringify(newCapability, null, 2));
  
  // 6. 运行同步更新统计
  console.log('\n🔄 更新统计数字...');
  require('./sync-to-redis.js');
}

// 解析命令行参数
const args = process.argv.slice(2);
const options = {};

for (let i = 0; i < args.length; i++) {
  if (args[i].startsWith('--')) {
    const key = args[i].substring(2);
    options[key] = args[i + 1];
    i++;
  }
}

// 如果提供了所有参数，直接添加
if (options.name && options.description && options.category) {
  addCapability(options).catch(console.error);
} else {
  // 否则交互式输入
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  rl.question('能力名称：', (name) => {
    rl.question('描述：', (description) => {
      rl.question('分类（如 skills, stock-analysis）：', (category) => {
        rl.question('类型（如 监控工具, 分析Agent）：', (type) => {
          rl.question('状态（active/inactive/pending）：', (status) => {
            rl.close();
            
            addCapability({
              name,
              description,
              category,
              type: type || '能力',
              status: status || 'active'
            }).catch(console.error);
          });
        });
      });
    });
  });
}
