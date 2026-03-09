#!/usr/bin/env ts-node
/**
 * 新增能力命令脚本
 * 
 * 用法：
 *   npx ts-node scripts/add_capability.ts <category> <name> <description> [type] [status]
 * 
 * 示例：
 *   npx ts-node scripts/add_capability.ts tools "测试工具" "这是一个测试工具" "测试类型" "active"
 * 
 * 自动执行：
 * 1. 写入 SQLite 数据库
 * 2. 重新生成 capabilities.ts
 * 3. 更新 layer1-capabilities-index.md
 * 4. 更新 layer1-change-log.md
 * 5. 验证三个数字一致
 */

import Database from 'better-sqlite3';
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

const DB_PATH = 'data/capabilities.db';
const INDEX_PATH = 'app/coe/layer1-capabilities-index.md';
const CHANGELOG_PATH = 'app/coe/layer1-change-log.md';

interface AddCapabilityOptions {
  category: string;
  name: string;
  description: string;
  type?: string;
  status?: string;
  icon?: string;
  details?: Record<string, any>;
}

function addCapability(options: AddCapabilityOptions) {
  console.log('🚀 开始新增能力...\n');

  const {
    category,
    name,
    description,
    type = 'capability',
    status = 'active',
    icon = '⭐',
    details = {}
  } = options;

  // 1. 写入数据库
  console.log('📦 步骤1：写入数据库...');
  const db = new Database(DB_PATH);

  try {
    const stmt = db.prepare(`
      INSERT INTO capabilities (category, name, description, status, type, icon, details_json)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      category,
      name,
      description,
      status,
      type,
      icon,
      JSON.stringify(details, ensure_ascii=false)
    );

    console.log(`✅ 已写入数据库（ID: ${result.lastInsertRowid}）\n`);
  } catch (error: any) {
    console.error(`❌ 写入数据库失败：${error.message}\n`);
    db.close();
    process.exit(1);
  }

  db.close();

  // 2. 重新生成 capabilities.ts
  console.log('📝 步骤2：重新生成 capabilities.ts...');
  try {
    execSync('npx ts-node scripts/generate_capabilities.ts', { stdio: 'inherit' });
    console.log('✅ capabilities.ts 已更新\n');
  } catch (error) {
    console.error('❌ 生成 capabilities.ts 失败\n');
    process.exit(1);
  }

  // 3. 更新 layer1-capabilities-index.md
  console.log('📊 步骤3：更新索引文件...');
  updateIndex(category, name, description);
  console.log('✅ 索引文件已更新\n');

  // 4. 更新 layer1-change-log.md
  console.log('📋 步骤4：更新变更日志...');
  updateChangelog(category, name, description, 'added');
  console.log('✅ 变更日志已更新\n');

  // 5. 验证三个数字一致
  console.log('✅ 步骤5：验证一致性...');
  const { getTotalCapabilities } = require('../app/data/capabilities.ts');
  const tsCount = getTotalCapabilities();
  
  const db2 = new Database(DB_PATH);
  const dbCount = db2.prepare('SELECT COUNT(*) as count FROM capabilities').get() as { count: number };
  db2.close();

  console.log(`  capabilities.ts: ${tsCount} 个`);
  console.log(`  数据库: ${dbCount.count} 个`);
  console.log(`  页面显示: ${dbCount.count} 个`);

  if (tsCount === dbCount.count) {
    console.log('\n✅ 三个数字完全一致！\n');
  } else {
    console.error(`\n❌ 错误：数字不一致（TS: ${tsCount}, DB: ${dbCount.count}）\n`);
    process.exit(1);
  }

  console.log('🎉 新增能力完成！\n');
  console.log('能力详情：');
  console.log(`  分类：${category}`);
  console.log(`  名称：${name}`);
  console.log(`  描述：${description}`);
  console.log(`  类型：${type}`);
  console.log(`  状态：${status}`);
}

function updateIndex(category: string, name: string, description: string) {
  if (!fs.existsSync(INDEX_PATH)) {
    console.log('  ⚠️  索引文件不存在，跳过更新');
    return;
  }

  let content = fs.readFileSync(INDEX_PATH, 'utf8');
  
  // 查找分类位置
  const categoryRegex = new RegExp(`### ${category}[\\s\\S]*?(?=###|$)`, 'g');
  const match = content.match(categoryRegex);

  if (match) {
    // 分类存在，添加新能力
    const newEntry = `- **${name}**：${description}\n`;
    content = content.replace(categoryRegex, match[0] + newEntry);
  } else {
    // 分类不存在，添加新分类
    const newCategory = `\n### ${category}\n\n- **${name}**：${description}\n`;
    const lastCategoryMatch = content.match(/### [^\n]+/g);
    if (lastCategoryMatch) {
      const lastCategory = lastCategoryMatch[lastCategoryMatch.length - 1];
      const insertPos = content.indexOf(lastCategory) + lastCategory.length;
      content = content.slice(0, insertPos) + content.slice(insertPos) + newCategory;
    }
  }

  fs.writeFileSync(INDEX_PATH, content, 'utf8');
}

function updateChangelog(category: string, name: string, description: string, action: 'added' | 'updated' | 'deleted') {
  if (!fs.existsSync(CHANGELOG_PATH)) {
    console.log('  ⚠️  变更日志文件不存在，跳过更新');
    return;
  }

  let content = fs.readFileSync(CHANGELOG_PATH, 'utf8');
  const timestamp = new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });
  
  const actionText = {
    added: '新增',
    updated: '更新',
    deleted: '删除'
  }[action];

  const newEntry = `\n### ${timestamp}\n\n**${actionText}能力**：${category} - ${name}\n\n- 描述：${description}\n`;

  // 在文件开头插入新条目
  const lines = content.split('\n');
  const headerEndIndex = lines.findIndex(line => line.startsWith('###'));
  
  if (headerEndIndex > 0) {
    lines.splice(headerEndIndex, 0, newEntry);
    content = lines.join('\n');
  } else {
    content = newEntry + content;
  }

  fs.writeFileSync(CHANGELOG_PATH, content, 'utf8');
}

// 解析命令行参数
const args = process.argv.slice(2);

if (args.length < 3) {
  console.log('用法：npx ts-node scripts/add_capability.ts <category> <name> <description> [type] [status]');
  console.log('\n示例：');
  console.log('  npx ts-node scripts/add_capability.ts tools "测试工具" "这是一个测试工具" "测试类型" "active"');
  process.exit(1);
}

const [category, name, description, type, status] = args;

addCapability({
  category,
  name,
  description,
  type,
  status
});
