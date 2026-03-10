#!/usr/bin/env node

/**
 * Heartbeat Orchestrator
 * 
 * 功能：协调5个子 skill 的执行
 * 
 * 子 skills：
 * 1. review-last-24h - 回顾最近24小时
 * 2. journal-events - 记录重要事件
 * 3. scan-environment - 扫描环境变化
 * 4. health-check - 健康检查
 * 5. refresh-dashboard - 刷新状态板
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// 项目根目录
const workspaceRoot = '/Users/fox/.openclaw/workspace';
const skillsDir = path.join(workspaceRoot, '.agents/skills');

// 日志
function log(message) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`);
}

// 执行结果
const results = {
  review: { status: 'pending', message: '' },
  journal: { status: 'pending', message: '' },
  scan: { status: 'pending', message: '' },
  health: { status: 'pending', message: '' },
  dashboard: { status: 'pending', message: '' },
};

// 执行 skill
function runSkill(skillName) {
  const skillPath = path.join(skillsDir, skillName, 'scripts/run.js');
  
  if (!fs.existsSync(skillPath)) {
    log(`   ⚠️  ${skillName} skill 不存在，跳过`);
    return false;
  }
  
  try {
    const output = execSync(`node ${skillPath}`, {
      cwd: workspaceRoot,
      encoding: 'utf-8',
      timeout: 60000,
    });
    
    log(`   ✅ ${skillName} 完成`);
    return true;
  } catch (error) {
    log(`   ❌ ${skillName} 失败: ${error.message}`);
    return false;
  }
}

// 主函数
async function main() {
  log('');
  log('🔍 Heartbeat Orchestrator');
  log('=========================');
  log('');
  
  const startTime = Date.now();
  
  // 1. 回顾最近24小时
  log('1️⃣  Review（回顾最近24小时）...');
  results.review.status = runSkill('review-last-24h') ? 'pass' : 'fail';
  
  // 2. 记录重要事件
  log('2️⃣  Journal（记录重要事件）...');
  results.journal.status = runSkill('journal-events') ? 'pass' : 'fail';
  
  // 3. 扫描环境变化
  log('3️⃣  Scan（扫描环境变化）...');
  results.scan.status = runSkill('scan-environment') ? 'pass' : 'fail';
  
  // 4. 健康检查
  log('4️⃣  Health Check（健康检查）...');
  results.health.status = runSkill('health-check') ? 'pass' : 'fail';
  
  // 5. 刷新状态板
  log('5️⃣  Refresh Dashboard（刷新状态板）...');
  results.dashboard.status = runSkill('refresh-dashboard') ? 'pass' : 'fail';
  
  // 汇总报告
  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(1);
  
  log('');
  log('📊 汇总报告');
  log('===========');
  log(`1️⃣  Review: ${results.review.status === 'pass' ? '✅' : '❌'}`);
  log(`2️⃣  Journal: ${results.journal.status === 'pass' ? '✅' : '❌'}`);
  log(`3️⃣  Scan: ${results.scan.status === 'pass' ? '✅' : '❌'}`);
  log(`4️⃣  Health Check: ${results.health.status === 'pass' ? '✅' : '❌'}`);
  log(`5️⃣  Refresh Dashboard: ${results.dashboard.status === 'pass' ? '✅' : '❌'}`);
  log('');
  
  const passCount = Object.values(results).filter(r => r.status === 'pass').length;
  log(`任务完成: ${passCount}/5`);
  log(`用时: ${duration}秒`);
  
  // 下次执行时间（30分钟后）
  const nextTime = new Date(Date.now() + 30 * 60 * 1000);
  log(`下次执行: ${nextTime.getHours()}:${String(nextTime.getMinutes()).padStart(2, '0')}`);
  log('');
  
  log('✅ Heartbeat 完成');
}

// 运行
main().catch(error => {
  log(`❌ Heartbeat 异常: ${error.message}`);
  process.exit(1);
});
