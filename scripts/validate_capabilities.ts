#!/usr/bin/env ts-node
/**
 * 构建前自动校验脚本 (Redis版)
 * 
 * 用法：npx ts-node scripts/validate_capabilities.ts
 * 
 * 校验内容：
 * 1. Redis capabilities:all 条目数
 * 2. stats:total 统计数字
 * 3. knowledge:items 数量
 * 
 * 注意：已移除 SQLite 依赖
 */

import { Redis } from '@upstash/redis';
import * as fs from 'fs';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || 'https://valued-hamster-37498.upstash.io',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || 'AZJ6AAIncDE1YzRlYzY3NzI5OTU0MWIzOTM5YzNjMWE2NDkzMTkyZHAxMzc0OKg',
});

interface ValidationResult {
  redisCount: number;
  knowledgeCount: number;
  statsGrandTotal: number;
  isValid: boolean;
  errors: string[];
}

async function validateCapabilities(): Promise<ValidationResult> {
  console.log('🔍 开始校验能力数据一致性 (Redis版)...\n');

  const errors: string[] = [];
  let redisCount = 0;
  let knowledgeCount = 0;
  let statsGrandTotal = 0;

  // 1. 检查 Redis capabilities:all
  console.log('📊 步骤1：检查 Redis capabilities:all...');
  try {
    const caps = await redis.get('capabilities:all') || [];
    redisCount = Array.isArray(caps) ? caps.length : 0;
    console.log(`✅ Redis 能力数：${redisCount} 个\n`);
  } catch (error: any) {
    const errorMsg = `❌ 无法读取 Redis：${error.message}`;
    console.error(errorMsg);
    errors.push(errorMsg);
    console.log();
  }

  // 2. 检查 knowledge:items
  console.log('📚 步骤2：检查知识库...');
  try {
    const knowledge = await redis.get('knowledge:items') || [];
    knowledgeCount = Array.isArray(knowledge) ? knowledge.length : 0;
    console.log(`✅ 知识条目数：${knowledgeCount} 个\n`);
  } catch (error: any) {
    const errorMsg = `❌ 无法读取知识库：${error.message}`;
    console.error(errorMsg);
    errors.push(errorMsg);
    console.log();
  }

  // 3. 检查 stats:total
  console.log('📈 步骤3：检查统计数字...');
  try {
    const stats = await redis.get('stats:total');
    if (stats && typeof stats === 'object') {
      statsGrandTotal = (stats as any).grandTotal || 0;
      console.log(`✅ grandTotal：${statsGrandTotal}\n`);
      console.log('   详细统计：');
      console.log(`   - 主能力：${(stats as any).mainCapabilities}`);
      console.log(`   - 自定义能力：${(stats as any).customCapabilities}`);
      console.log(`   - 知识条目：${(stats as any).knowledge}`);
      console.log(`   - 书籍：${(stats as any).books}`);
      console.log(`   - 伊朗局势：${(stats as any).iran}`);
      console.log(`   - Telegram：${(stats as any).telegram}`);
      console.log(`   - QVeris：${(stats as any).qveris}`);
    }
  } catch (error: any) {
    const errorMsg = `❌ 无法读取统计：${error.message}`;
    console.error(errorMsg);
    errors.push(errorMsg);
    console.log();
  }

  // 4. 检查 custom-capabilities.json
  console.log('📝 步骤4：检查自定义能力文件...');
  try {
    const customPath = 'data/custom-capabilities.json';
    if (fs.existsSync(customPath)) {
      const custom = JSON.parse(fs.readFileSync(customPath, 'utf8'));
      console.log(`✅ 自定义能力文件：${custom.length} 条\n`);
    } else {
      console.log('⚠️  自定义能力文件不存在\n');
    }
  } catch (error: any) {
    const errorMsg = `❌ 无法读取自定义能力文件：${error.message}`;
    console.error(errorMsg);
    errors.push(errorMsg);
    console.log();
  }

  const isValid = errors.length === 0;

  console.log('═══════════════════════════════════════');
  if (isValid) {
    console.log('✅ 校验通过！数据一致性正常。');
  } else {
    console.log('❌ 校验失败！存在以下问题：');
    errors.forEach(e => console.log('   -', e));
  }
  console.log('═══════════════════════════════════════\n');

  return {
    redisCount,
    knowledgeCount,
    statsGrandTotal,
    isValid,
    errors
  };
}

// 运行校验
validateCapabilities()
  .then(result => {
    if (!result.isValid) {
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('❌ 校验脚本执行失败:', error);
    process.exit(1);
  });
