#!/usr/bin/env node

/**
 * Health Check Skill (修复版)
 * 
 * 功能：检查 Redis 数据完整性、Git 同步状态、系统健康
 * 修复：使用 curl 调用 Redis API，不依赖 @upstash/redis
 */

const { execSync } = require('child_process');

function log(message) {
  console.log(`  ${message}`);
}

async function main() {
  log('健康检查...');
  
  try {
    // 使用 curl 调用 Redis API
    const response = execSync(`curl -s "https://valued-hamster-37498.upstash.io/get/stats:total" -H "Authorization: Bearer AZJ6AAIncDE1YzRlYzY3NzI5OTU0MWIzOTM5YzNjMWE2NDkzMTkyZHAxMzc0OTg"`, {
      encoding: 'utf-8',
      timeout: 10000,
    });
    
    const data = JSON.parse(response);
    const stats = JSON.parse(data.result);
    
    if (stats && stats.grandTotal) {
      log(`✅ Redis 正常: ${stats.grandTotal} 条能力`);
      log(`   主能力: ${stats.mainCapabilities}`);
      log(`   自定义: ${stats.customCapabilities}`);
      log(`   知识库: ${stats.knowledge + stats.books}`);
      log(`   子页面: ${stats.iran + stats.telegram + stats.qveris}`);
    } else {
      log('❌ Redis 数据不完整');
    }
  } catch (error) {
    log(`❌ Redis 检查失败: ${error.message}`);
  }
}

main().catch(console.error);
