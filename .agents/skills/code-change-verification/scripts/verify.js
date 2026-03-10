#!/usr/bin/env node

/**
 * Code Change Verification Script
 * 
 * 功能：
 * 1. 运行 npm run sync
 * 2. 验证 Redis 数据完整性
 * 3. 验证统计数字准确性
 * 4. 生成验证报告
 */

const { execSync } = require('child_process');
const { Redis } = require('@upstash/redis');

// Redis 配置
const redis = new Redis({
  url: 'https://valued-hamster-37498.upstash.io',
  token: 'AZJ6AAIncDE1YzRlYzY3NzI5OTU0MWIzOTM5YzNjMWE2NDkzMTkyZHAxMzc0OTg',
});

// 项目根目录
const projectRoot = '/Users/fox/.openclaw/workspace/huajuan-showcase';

// 日志
function log(message) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`);
}

// 验证报告
const report = {
  timestamp: new Date().toISOString(),
  status: 'pending',
  checks: {
    npmSync: { status: 'pending', message: '' },
    redisIntegrity: { status: 'pending', message: '' },
    statsAccuracy: { status: 'pending', message: '' },
  },
  total: 0,
};

// 1. 运行 npm run sync
function runNpmSync() {
  log('1️⃣  运行 npm run sync...');
  
  try {
    const output = execSync('npm run sync', {
      cwd: projectRoot,
      encoding: 'utf-8',
      timeout: 60000, // 60秒超时
    });
    
    // 检查输出是否包含成功标志
    if (output.includes('✅ 同步完成')) {
      report.checks.npmSync.status = 'pass';
      report.checks.npmSync.message = '成功';
      log('   ✅ npm run sync 成功');
      return true;
    } else {
      report.checks.npmSync.status = 'fail';
      report.checks.npmSync.message = '同步未完成';
      log('   ❌ npm run sync 未完成');
      return false;
    }
  } catch (error) {
    report.checks.npmSync.status = 'fail';
    report.checks.npmSync.message = error.message;
    log(`   ❌ npm run sync 失败: ${error.message}`);
    return false;
  }
}

// 2. 验证 Redis 数据完整性
async function verifyRedisIntegrity() {
  log('2️⃣  验证 Redis 数据完整性...');
  
  try {
    // 检查关键 keys
    const keys = [
      'capabilities:all',
      'knowledge:items',
      'knowledge:books',
      'stats:total',
    ];
    
    let allExist = true;
    
    for (const key of keys) {
      const data = await redis.get(key);
      if (!data) {
        log(`   ❌ ${key} 不存在`);
        allExist = false;
      } else {
        log(`   ✅ ${key} 存在`);
      }
    }
    
    if (allExist) {
      report.checks.redisIntegrity.status = 'pass';
      report.checks.redisIntegrity.message = '所有 keys 存在';
      log('   ✅ Redis 数据完整');
      return true;
    } else {
      report.checks.redisIntegrity.status = 'fail';
      report.checks.redisIntegrity.message = '部分 keys 缺失';
      log('   ❌ Redis 数据不完整');
      return false;
    }
  } catch (error) {
    report.checks.redisIntegrity.status = 'fail';
    report.checks.redisIntegrity.message = error.message;
    log(`   ❌ Redis 验证失败: ${error.message}`);
    return false;
  }
}

// 3. 验证统计数字准确性
async function verifyStatsAccuracy() {
  log('3️⃣  验证统计数字准确性...');
  
  try {
    const stats = await redis.get('stats:total');
    
    if (!stats) {
      report.checks.statsAccuracy.status = 'fail';
      report.checks.statsAccuracy.message = 'stats:total 不存在';
      log('   ❌ stats:total 不存在');
      return false;
    }
    
    // 计算预期总数
    const expected = 
      stats.mainCapabilities + 
      stats.knowledge + 
      stats.books + 
      stats.iran + 
      stats.telegram + 
      stats.qveris;
    
    // 验证
    if (stats.grandTotal === expected) {
      report.checks.statsAccuracy.status = 'pass';
      report.checks.statsAccuracy.message = `准确（${stats.grandTotal}）`;
      report.total = stats.grandTotal;
      log(`   ✅ 统计数字准确: ${stats.grandTotal}`);
      return true;
    } else {
      report.checks.statsAccuracy.status = 'fail';
      report.checks.statsAccuracy.message = `不准确（预期 ${expected}，实际 ${stats.grandTotal}）`;
      log(`   ❌ 统计数字不准确:`);
      log(`      预期: ${expected}`);
      log(`      实际: ${stats.grandTotal}`);
      return false;
    }
  } catch (error) {
    report.checks.statsAccuracy.status = 'fail';
    report.checks.statsAccuracy.message = error.message;
    log(`   ❌ 统计验证失败: ${error.message}`);
    return false;
  }
}

// 生成报告
function generateReport() {
  log('');
  log('📊 验证报告');
  log('==================');
  log(`时间: ${report.timestamp}`);
  log('');
  
  // 检查结果
  const allPassed = Object.values(report.checks).every(check => check.status === 'pass');
  
  log('验证结果:');
  log(`  1. npm run sync: ${report.checks.npmSync.status === 'pass' ? '✅' : '❌'} ${report.checks.npmSync.message}`);
  log(`  2. Redis 完整性: ${report.checks.redisIntegrity.status === 'pass' ? '✅' : '❌'} ${report.checks.redisIntegrity.message}`);
  log(`  3. 统计准确性: ${report.checks.statsAccuracy.status === 'pass' ? '✅' : '❌'} ${report.checks.statsAccuracy.message}`);
  log('');
  
  if (allPassed) {
    report.status = 'pass';
    log('✅ 所有验证通过');
    log(`✅ 总计: ${report.total}`);
  } else {
    report.status = 'fail';
    log('❌ 部分验证失败');
    log('');
    log('建议:');
    if (report.checks.npmSync.status === 'fail') {
      log('  1. 运行 npm run sync');
    }
    if (report.checks.redisIntegrity.status === 'fail') {
      log('  2. 检查 Redis 连接');
    }
    if (report.checks.statsAccuracy.status === 'fail') {
      log('  3. 验证数据文件');
    }
  }
  
  log('');
  
  return allPassed;
}

// 主函数
async function main() {
  log('');
  log('🔍 Code Change Verification');
  log('===========================');
  log('');
  
  // 执行验证
  runNpmSync();
  await verifyRedisIntegrity();
  await verifyStatsAccuracy();
  
  // 生成报告
  const passed = generateReport();
  
  // 退出码
  if (passed) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

// 运行
main().catch(error => {
  log(`❌ 验证异常: ${error.message}`);
  process.exit(1);
});
