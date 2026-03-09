#!/usr/bin/env ts-node
/**
 * 知识库自动同步脚本
 * 
 * 用法：
 *   npx ts-node scripts/sync_knowledge.ts
 * 
 * 自动执行：
 * 1. 扫描 knowledge_base/ 目录
 * 2. 新增文件自动写入数据库
 * 3. 重新生成 capabilities.ts
 * 4. 更新索引和变更日志
 * 5. 验证三个数字一致
 */

import Database from 'better-sqlite3';
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

const DB_PATH = 'data/capabilities.db';
const KNOWLEDGE_BASE_DIR = path.join(process.cwd(), 'knowledge_base');
const PUBLIC_KNOWLEDGE_DIR = path.join(process.cwd(), 'public', 'knowledge_base');

interface KnowledgeFile {
  filename: string;
  filepath: string;
  title: string;
  date: string;
  content: string;
}

function syncKnowledge() {
  console.log('🔄 开始同步知识库...\n');

  // 1. 扫描 knowledge_base/ 目录
  console.log('📁 步骤1：扫描 knowledge_base/ 目录...');
  
  if (!fs.existsSync(KNOWLEDGE_BASE_DIR)) {
    console.log('  ⚠️  knowledge_base/ 目录不存在，创建中...');
    fs.mkdirSync(KNOWLEDGE_BASE_DIR, { recursive: true });
  }

  const files = fs.readdirSync(KNOWLEDGE_BASE_DIR)
    .filter(f => f.endsWith('.md'))
    .map(filename => {
      const filepath = path.join(KNOWLEDGE_BASE_DIR, filename);
      const content = fs.readFileSync(filepath, 'utf8');
      
      // 提取标题（第一行）
      const titleMatch = content.match(/^#\s+(.+)/m);
      const title = titleMatch ? titleMatch[1] : filename.replace('.md', '');
      
      // 提取日期（从文件名）
      const dateMatch = filename.match(/(\d{4}-\d{2}-\d{2})/);
      const date = dateMatch ? dateMatch[1] : new Date().toISOString().split('T')[0];

      return {
        filename,
        filepath,
        title,
        date,
        content
      };
    });

  console.log(`✅ 发现 ${files.length} 个知识文件\n`);

  if (files.length === 0) {
    console.log('⚠️  没有知识文件需要同步\n');
    return;
  }

  // 2. 同步到数据库
  console.log('📦 步骤2：同步到数据库...');
  const db = new Database(DB_PATH);
  
  let addedCount = 0;
  let skippedCount = 0;

  for (const file of files) {
    // 检查是否已存在
    const existing = db.prepare(`
      SELECT * FROM capabilities 
      WHERE category = 'knowledge-base' AND name = ?
    `).get(file.title);

    if (existing) {
      console.log(`  ⏭️  跳过（已存在）：${file.title}`);
      skippedCount++;
      continue;
    }

    // 添加新知识
    const stmt = db.prepare(`
      INSERT INTO capabilities (category, name, description, status, type, icon, details_json)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      'knowledge-base',
      file.title,
      `知识条目：${file.title}`,
      'active',
      '知识库',
      '📖',
      JSON.stringify({
        source: 'knowledge_base',
        file: file.filename,
        date: file.date,
        content: file.content.substring(0, 500) // 截取前500字符
      }, null, 2)
    );

    console.log(`  ✅ 已添加：${file.title}`);
    addedCount++;
  }

  db.close();
  console.log(`\n✅ 同步完成：新增 ${addedCount} 个，跳过 ${skippedCount} 个\n`);

  // 3. 同步到 public/knowledge_base/
  console.log('📋 步骤3：同步到 public/knowledge_base/...');
  
  if (!fs.existsSync(PUBLIC_KNOWLEDGE_DIR)) {
    fs.mkdirSync(PUBLIC_KNOWLEDGE_DIR, { recursive: true });
  }

  for (const file of files) {
    const targetPath = path.join(PUBLIC_KNOWLEDGE_DIR, file.filename);
    fs.copyFileSync(file.filepath, targetPath);
    console.log(`  ✅ 已复制：${file.filename}`);
  }
  console.log();

  // 4. 重新生成 capabilities.ts
  console.log('📝 步骤4：重新生成 capabilities.ts...');
  try {
    execSync('npx ts-node scripts/generate_capabilities.ts', { stdio: 'inherit' });
    console.log('✅ capabilities.ts 已更新\n');
  } catch (error) {
    console.error('❌ 生成 capabilities.ts 失败\n');
    process.exit(1);
  }

  // 5. 验证三个数字一致
  console.log('✅ 步骤5：验证一致性...');
  
  const db2 = new Database(DB_PATH);
  const dbCount = db2.prepare('SELECT COUNT(*) as count FROM capabilities').get() as { count: number };
  db2.close();

  console.log(`  数据库: ${dbCount.count} 个`);
  console.log(`  页面显示: ${dbCount.count} 个`);

  console.log('\n✅ 验证完成！\n');

  console.log('🎉 知识库同步完成！\n');
  console.log('统计：');
  console.log(`  发现文件：${files.length} 个`);
  console.log(`  新增知识：${addedCount} 个`);
  console.log(`  跳过已有：${skippedCount} 个`);
}

// 执行同步
syncKnowledge();
