#!/usr/bin/env node

/**
 * 🌸 花卷安全审计脚本 (重构版 - script 嵌套 skill)
 * 
 * 重构：改为调用已有的 skill
 * 1. 调用 code-change-verification skill
 * 2. 调用 docs-sync skill
 * 3. 生成综合审计报告
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// 项目根目录
const workspaceRoot = '/Users/fox/.openclaw/workspace';
const projectRoot = path.join(workspaceRoot, 'huajuan-showcase');

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
  codeVerification: { status: 'pending', message: '' },
  docsSync: { status: 'pending', message: '' },
  gitStatus: { status: 'pending', message: '' },
};

// 1. 调用 code-change-verification skill
function runCodeVerification() {
  log('📊 1️⃣  运行 Code Change Verification...');
  
  const skillPath = path.join(workspaceRoot, '.agents/skills/code-change-verification/scripts/verify.js');
  
  if (!fs.existsSync(skillPath)) {
    log('   ⚠️  code-change-verification skill 不存在，跳过');
    auditResults.codeVerification.status = 'skipped';
    auditResults.codeVerification.message = 'skill 不存在';
    return false;
  }
  
  try {
    const output = execSync(`node ${skillPath}`, {
      cwd: projectRoot,
      encoding: 'utf-8',
      timeout: 60000,
    });
    
    log('   ✅ Code Change Verification 通过');
    auditResults.codeVerification.status = 'pass';
    auditResults.codeVerification.message = '验证通过';
    return true;
  } catch (error) {
    log(`   ❌ Code Change Verification 失败: ${error.message}`);
    auditResults.codeVerification.status = 'fail';
    auditResults.codeVerification.message = error.message;
    return false;
  }
}

// 2. 调用 docs-sync skill
function runDocsSync() {
  log('📊 2️⃣  运行 Docs Sync...');
  
  const skillPath = path.join(workspaceRoot, '.agents/skills/docs-sync/scripts/audit.js');
  
  if (!fs.existsSync(skillPath)) {
    log('   ⚠️  docs-sync skill 不存在，跳过');
    auditResults.docsSync.status = 'skipped';
    auditResults.docsSync.message = 'skill 不存在';
    return false;
  }
  
  try {
    const output = execSync(`node ${skillPath}`, {
      cwd: projectRoot,
      encoding: 'utf-8',
      timeout: 60000,
    });
    
    log('   ✅ Docs Sync 完成');
    auditResults.docsSync.status = 'pass';
    auditResults.docsSync.message = '审计完成';
    return true;
  } catch (error) {
    log(`   ❌ Docs Sync 失败: ${error.message}`);
    auditResults.docsSync.status = 'fail';
    auditResults.docsSync.message = error.message;
    return false;
  }
}

// 3. 检查 Git 状态
function checkGitStatus() {
  log('📊 3️⃣  检查 Git 状态...');
  
  try {
    const status = execSync('git status --short', {
      cwd: projectRoot,
      encoding: 'utf-8',
    });
    
    if (status.trim() === '') {
      log('   ✅ Git 状态: clean（无未提交更改）');
      auditResults.gitStatus.status = 'pass';
      auditResults.gitStatus.message = 'clean';
    } else {
      const changedFiles = status.split('\n').filter(line => line.trim()).length;
      log(`   ⚠️  Git 状态: ${changedFiles} 个文件未提交`);
      auditResults.gitStatus.status = 'warning';
      auditResults.gitStatus.message = `${changedFiles} 个文件未提交`;
    }
    
    return true;
  } catch (error) {
    log(`   ❌ Git 检查失败: ${error.message}`);
    auditResults.gitStatus.status = 'fail';
    auditResults.gitStatus.message = error.message;
    return false;
  }
}

// 4. 生成综合审计报告
function generateReport() {
  log('');
  log('📊 审计报告');
  log('===========');
  log(`时间: ${auditResults.timestamp}`);
  log('');
  
  log('审计结果:');
  log(`  1. Code Verification: ${auditResults.codeVerification.status === 'pass' ? '✅' : '❌'} ${auditResults.codeVerification.message}`);
  log(`  2. Docs Sync: ${auditResults.docsSync.status === 'pass' ? '✅' : '❌'} ${auditResults.docsSync.message}`);
  log(`  3. Git Status: ${auditResults.gitStatus.status === 'pass' ? '✅' : '⚠️'} ${auditResults.gitStatus.message}`);
  log('');
  
  const allPass = Object.values(auditResults).every(result => result.status === 'pass');
  
  if (allPass) {
    log('✅ 所有审计通过');
  } else {
    log('⚠️  部分审计未通过，请检查');
  }
  
  log('');
  
  // 保存审计报告到文件
  const reportPath = path.join(projectRoot, 'data/audit-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(auditResults, null, 2));
  log(`📄 审计报告已保存: ${reportPath}`);
}

// 主函数
async function main() {
  log('');
  log('🌸 花卷安全审计（script 嵌套 skill 版）');
  log('========================================');
  log('');
  
  // 1. 调用 code-change-verification skill
  runCodeVerification();
  
  // 2. 调用 docs-sync skill
  runDocsSync();
  
  // 3. 检查 Git 状态
  checkGitStatus();
  
  // 4. 生成综合审计报告
  generateReport();
  
  log('✅ 审计完成');
}

// 运行
main().catch(error => {
  log(`❌ 审计异常: ${error.message}`);
  process.exit(1);
});
