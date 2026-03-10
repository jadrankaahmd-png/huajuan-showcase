#!/usr/bin/env node

/**
 * Scan Environment Skill
 * 
 * 功能：扫描 Git 状态、数据变化、环境变化
 */

const { execSync } = require('child_process');

const workspaceRoot = '/Users/fox/.openclaw/workspace';
const projectRoot = '/Users/fox/.openclaw/workspace/huajuan-showcase';

function log(message) {
  console.log(`  ${message}`);
}

async function main() {
  log('扫描环境变化...');
  
  // 检查 Git 状态
  try {
    const status = execSync('git status --short', {
      cwd: projectRoot,
      encoding: 'utf-8',
    });
    
    if (status.trim() === '') {
      log('✅ Git 状态: clean（无未提交更改）');
    } else {
      const changedFiles = status.split('\n').filter(line => line.trim()).length;
      log(`⚠️  Git 状态: ${changedFiles} 个文件未提交`);
    }
  } catch (error) {
    log(`❌ Git 检查失败: ${error.message}`);
  }
}

main().catch(console.error);
