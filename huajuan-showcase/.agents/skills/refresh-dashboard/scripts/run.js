#!/usr/bin/env node

/**
 * Refresh Dashboard Skill (修复版)
 * 
 * 功能：更新 NOW.md 统计、刷新状态板、更新总能力数
 * 修复：使用 curl 调用 Redis API，不依赖 @upstash/redis
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const workspaceRoot = '/Users/fox/.openclaw/workspace';
const nowFile = path.join(workspaceRoot, 'NOW.md');

function log(message) {
  console.log(`  ${message}`);
}

async function main() {
  log('刷新状态板...');
  
  try {
    // 使用 curl 调用 Redis API
    const response = execSync(`curl -s "https://valued-hamster-37498.upstash.io/get/stats:total" -H "Authorization: Bearer AZJ6AAIncDE1YzRlYzY3NzI5OTU0MWIzOTM5YzNjMWE2NDkzMTkyZHAxMzc0OTg"`, {
      encoding: 'utf-8',
      timeout: 10000,
    });
    
    const data = JSON.parse(response);
    const stats = JSON.parse(data.result);
    
    if (stats && stats.grandTotal) {
      // 读取 NOW.md
      if (fs.existsSync(nowFile)) {
        let content = fs.readFileSync(nowFile, 'utf-8');
        
        // 更新总能力数
        const oldTotal = content.match(/总能力数：(\d+)/)?.[1];
        if (oldTotal) {
          content = content.replace(/总能力数：\d+/, `总能力数：${stats.grandTotal}`);
          fs.writeFileSync(nowFile, content);
          log(`✅ NOW.md 已更新: ${oldTotal} → ${stats.grandTotal}`);
        } else {
          log('⚠️  NOW.md 中未找到总能力数');
        }
      } else {
        log('⚠️  NOW.md 不存在');
      }
    } else {
      log('❌ Redis 数据不完整');
    }
  } catch (error) {
    log(`❌ 刷新失败: ${error.message}`);
  }
}

main().catch(console.error);
