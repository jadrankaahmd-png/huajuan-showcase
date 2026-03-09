#!/usr/bin/env ts-node
/**
 * 构建前自动校验脚本
 * 
 * 用法：npx ts-node scripts/validate_capabilities.ts
 * 
 * 校验内容：
 * 1. 数据库能力数
 * 2. capabilities.ts 条目数
 * 3. getTotalCapabilities() 返回值
 * 
 * 三个数字必须完全一致，否则构建失败
 */

import Database from 'better-sqlite3';
import * as fs from 'fs';

const DB_PATH = 'data/capabilities.db';
const CAPABILITIES_TS_PATH = 'app/data/capabilities.ts';

interface ValidationResult {
  dbCount: number;
  tsFileCount: number;
  tsFunctionCount: number;
  isValid: boolean;
  errors: string[];
}

function validateCapabilities(): ValidationResult {
  console.log('🔍 开始校验能力数据一致性...\n');

  const errors: string[] = [];
  let dbCount = 0;
  let tsFileCount = 0;
  let tsFunctionCount = 0;

  // 1. 检查数据库能力数
  console.log('📊 步骤1：检查数据库能力数...');
  try {
    const db = new Database(DB_PATH);
    const result = db.prepare('SELECT COUNT(*) as count FROM capabilities').get() as { count: number };
    dbCount = result.count;
    db.close();
    console.log(`✅ 数据库能力数：${dbCount} 个\n`);
  } catch (error: any) {
    const errorMsg = `❌ 无法读取数据库：${error.message}`;
    console.error(errorMsg);
    errors.push(errorMsg);
    console.log();
  }

  // 2. 检查 capabilities.ts 文件
  console.log('📝 步骤2：检查 capabilities.ts 文件...');
  try {
    if (!fs.existsSync(CAPABILITIES_TS_PATH)) {
      const errorMsg = '❌ capabilities.ts 文件不存在';
      console.error(errorMsg);
      errors.push(errorMsg);
    } else {
      const content = fs.readFileSync(CAPABILITIES_TS_PATH, 'utf8');
      
      // 统计 items 条目数
      const itemsMatches = content.match(/{\s*name:\s*'[^']+',/g);
      tsFileCount = itemsMatches ? itemsMatches.length : 0;
      
      console.log(`✅ capabilities.ts 条目数：${tsFileCount} 个\n`);
    }
  } catch (error: any) {
    const errorMsg = `❌ 无法读取 capabilities.ts：${error.message}`;
    console.error(errorMsg);
    errors.push(errorMsg);
    console.log();
  }

  // 3. 检查 getTotalCapabilities() 函数
  console.log('🧮 步骤3：检查 getTotalCapabilities() 函数...');
  try {
    // 直接使用 require 加载 capabilities.ts
    const capabilitiesModule = require('../app/data/capabilities.ts');
    const capabilities = capabilitiesModule.capabilities;
    
    // 计算总数
    tsFunctionCount = capabilities.reduce((total: number, cat: any) => total + cat.items.length, 0);
    
    console.log(`✅ getTotalCapabilities() 返回值：${tsFunctionCount} 个\n`);
  } catch (error: any) {
    const errorMsg = `❌ 无法计算 getTotalCapabilities()：${error.message}`;
    console.error(errorMsg);
    errors.push(errorMsg);
    console.log();
  }

  // 4. 验证一致性
  console.log('✅ 步骤4：验证一致性...\n');
  console.log('三个数字：');
  console.log(`  1. 数据库能力数：${dbCount} 个`);
  console.log(`  2. capabilities.ts 条目数：${tsFileCount} 个`);
  console.log(`  3. getTotalCapabilities() 返回值：${tsFunctionCount} 个`);
  console.log();

  const isValid = (dbCount === tsFileCount && tsFileCount === tsFunctionCount && dbCount > 0);

  if (isValid) {
    console.log('✅ 三个数字完全一致！\n');
    console.log(`✅ 总能力数：${dbCount} 个\n`);
  } else {
    console.error('❌ 三个数字不一致！\n');
    
    if (dbCount !== tsFileCount) {
      const errorMsg = `❌ 数据库（${dbCount}）≠ capabilities.ts（${tsFileCount}）`;
      console.error(errorMsg);
      errors.push(errorMsg);
    }
    
    if (tsFileCount !== tsFunctionCount) {
      const errorMsg = `❌ capabilities.ts（${tsFileCount}）≠ getTotalCapabilities()（${tsFunctionCount}）`;
      console.error(errorMsg);
      errors.push(errorMsg);
    }
    
    if (dbCount !== tsFunctionCount) {
      const errorMsg = `❌ 数据库（${dbCount}）≠ getTotalCapabilities()（${tsFunctionCount}）`;
      console.error(errorMsg);
      errors.push(errorMsg);
    }
    
    console.log();
    console.error('❌ 构建失败！请修复不一致问题后重新构建。\n');
    console.error('修复方法：');
    console.error('  1. 检查数据库：sqlite3 data/capabilities.db "SELECT COUNT(*) FROM capabilities;"');
    console.error('  2. 重新生成 capabilities.ts：npx ts-node scripts/generate_capabilities.ts');
    console.error('  3. 重新构建：npm run build\n');
  }

  return {
    dbCount,
    tsFileCount,
    tsFunctionCount,
    isValid,
    errors
  };
}

// 执行校验
const result = validateCapabilities();

// 如果不一致，退出并返回错误码
if (!result.isValid) {
  process.exit(1);
}

// 如果一致，正常退出
process.exit(0);
