#!/usr/bin/env node

/**
 * 🌸 花卷安全审计脚本
 * 
 * 每晚自动审计：
 * 1. Redis 数据完整性
 * 2. API Key 敏感信息泄露
 * 3. Git 操作审计
 */

const { Redis } = require('@upstash/redis');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Redis 配置
const redis = new Redis({
  url: 'https://valued-hamster-37498.upstash.io',
  token: 'AZJ6AAIncDE1YzRlYzY3NzI5OTU0MWIzOTM5YzNjMWE2NDkzMTkyZHAxMzc0OTg',
});

// 项目根目录
const projectRoot = '/Users/fox/.openclaw/workspace/huajuan-showcase';

// 日志文件
const logFile = '/tmp/huajuan-security-audit.log';

// 日志函数
function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  console.log(message);
  fs.appendFileSync(logFile, logMessage);
}

// 审计结果
const auditResults = {
  timestamp: new Date().toISOString(),
  redis: { status: 'pending', errors: [] },
  sensitive: { status: 'pending', leaks: [] },
  git: { status: 'pending', commits: [] },
};

// 1. Redis 数据完整性审计
async function auditRedis() {
  log('📊 开始 Redis 数据完整性审计...');
  
  try {
    // 获取统计数据
    const stats = await redis.get('stats:total');
    
    if (!stats) {
      throw new Error('stats:total 不存在');
    }
    
    // 验证关键数据
    const capabilities = await redis.get('capabilities:all');
    const knowledge = await redis.get('knowledge:items');
    const books = await redis.get('knowledge:books');
    
    if (!capabilities || !knowledge || !books) {
      throw new Error('关键数据缺失');
    }
    
    // 验证数据一致性
    const expectedTotal = stats.mainCapabilities + stats.knowledge + stats.books + stats.iran + stats.telegram + stats.qveris;
    
    if (stats.grandTotal !== expectedTotal) {
      throw new Error(`数据不一致: grandTotal=${stats.grandTotal}, expected=${expectedTotal}`);
    }
    
    auditResults.redis.status = 'pass';
    log('✅ Redis 数据完整性审计通过');
    log(`   主能力: ${stats.mainCapabilities}`);
    log(`   知识库: ${stats.knowledge + stats.books}`);
    log(`   子页面: ${stats.iran + stats.telegram + stats.qveris}`);
    log(`   总计: ${stats.grandTotal}`);
    
  } catch (error) {
    auditResults.redis.status = 'fail';
    auditResults.redis.errors.push(error.message);
    log(`❌ Redis 审计失败: ${error.message}`);
  }
}

// 2. 敏感信息泄露检测
function auditSensitiveInfo() {
  log('🔒 开始敏感信息泄露检测...');
  
  const sensitivePatterns = [
    /AZJ6AAIncDE1YzRlYzY3NzI5OTU0MWIzOTM5YzNjMWE2NDkzMTkyZHAxMzc0OTg/g,
    /sk-[a-zA-Z0-9]{20,}/g, // OpenAI API Key
    /AIza[a-zA-Z0-9_-]{35}/g, // Google API Key
    /ghp_[a-zA-Z0-9]{36}/g, // GitHub Personal Access Token
    /xox[baprs]-[0-9]{10,}-[0-9]{10,}-[a-zA-Z0-9]{24}/g, // Slack Token
  ];
  
  const sensitiveKeywords = [
    'API_KEY',
    'SECRET_KEY',
    'PRIVATE_KEY',
    'PASSWORD',
    'TOKEN',
  ];
  
  try {
    // 检查最近1天的Git提交
    const gitLog = execSync('git log --since="1 day ago" -p', {
      cwd: projectRoot,
      encoding: 'utf-8',
      maxBuffer: 50 * 1024 * 1024, // 50MB buffer
    });
    
    let hasLeak = false;
    
    // 检查敏感模式
    for (const pattern of sensitivePatterns) {
      const matches = gitLog.match(pattern);
      if (matches && matches.length > 0) {
        auditResults.sensitive.leaks.push(`检测到敏感信息模式: ${matches[0].substring(0, 20)}...`);
        hasLeak = true;
      }
    }
    
    // 检查敏感关键词
    for (const keyword of sensitiveKeywords) {
      const regex = new RegExp(keyword + '\\s*=\\s*["\'][^"\']+["\']', 'gi');
      const matches = gitLog.match(regex);
      if (matches && matches.length > 0) {
        auditResults.sensitive.leaks.push(`检测到敏感关键词: ${keyword}`);
        hasLeak = true;
      }
    }
    
    if (hasLeak) {
      auditResults.sensitive.status = 'fail';
      log('❌ 检测到敏感信息泄露');
      auditResults.sensitive.leaks.forEach(leak => log(`   - ${leak}`));
    } else {
      auditResults.sensitive.status = 'pass';
      log('✅ 未检测到敏感信息泄露');
    }
    
  } catch (error) {
    auditResults.sensitive.status = 'fail';
    auditResults.sensitive.errors.push(error.message);
    log(`❌ 敏感信息检测失败: ${error.message}`);
  }
}

// 3. Git 操作审计
function auditGit() {
  log('📝 开始 Git 操作审计...');
  
  try {
    // 获取最近1天的提交
    const gitLog = execSync('git log --since="1 day ago" --oneline', {
      cwd: projectRoot,
      encoding: 'utf-8',
    });
    
    const commits = gitLog.trim().split('\n').filter(line => line.length > 0);
    
    auditResults.git.status = 'pass';
    auditResults.git.commits = commits;
    
    log(`✅ Git 操作审计完成`);
    log(`   最近24小时提交: ${commits.length} 次`);
    
    if (commits.length > 0) {
      log('   最新提交:');
      commits.slice(0, 3).forEach(commit => log(`     ${commit}`));
    }
    
  } catch (error) {
    auditResults.git.status = 'fail';
    auditResults.git.errors.push(error.message);
    log(`❌ Git 审计失败: ${error.message}`);
  }
}

// 生成审计报告
function generateReport() {
  log('');
  log('📊 审计报告总结');
  log('==================');
  log(`审计时间: ${auditResults.timestamp}`);
  log('');
  log(`1. Redis 数据完整性: ${auditResults.redis.status === 'pass' ? '✅ 通过' : '❌ 失败'}`);
  if (auditResults.redis.errors.length > 0) {
    auditResults.redis.errors.forEach(err => log(`   - ${err}`));
  }
  log('');
  log(`2. 敏感信息泄露: ${auditResults.sensitive.status === 'pass' ? '✅ 通过' : '❌ 失败'}`);
  if (auditResults.sensitive.leaks.length > 0) {
    auditResults.sensitive.leaks.forEach(leak => log(`   - ${leak}`));
  }
  log('');
  log(`3. Git 操作审计: ${auditResults.git.status === 'pass' ? '✅ 通过' : '❌ 失败'}`);
  log(`   提交次数: ${auditResults.git.commits.length}`);
  log('');
  
  // 保存报告到文件
  const reportPath = path.join(projectRoot, 'data/audit-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(auditResults, null, 2));
  log(`📄 审计报告已保存: ${reportPath}`);
}

// 主函数
async function main() {
  log('🌸 花卷安全审计开始');
  log('==================');
  log('');
  
  await auditRedis();
  auditSensitiveInfo();
  auditGit();
  
  generateReport();
  
  log('');
  log('✅ 审计完成');
  
  // 如果有失败项，退出码为1
  if (auditResults.redis.status === 'fail' || 
      auditResults.sensitive.status === 'fail' || 
      auditResults.git.status === 'fail') {
    process.exit(1);
  }
}

// 运行
main().catch(error => {
  console.error('❌ 审计异常:', error);
  process.exit(1);
});
