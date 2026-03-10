#!/usr/bin/env node

/**
 * Review Last 24h Skill
 * 
 * 功能：回顾最近24小时的工作、完成的任务、重要决策
 */

const fs = require('fs');
const path = require('path');

const workspaceRoot = '/Users/fox/.openclaw/workspace';
const memoryFile = path.join(workspaceRoot, 'memory', '2026-03-10.md');

function log(message) {
  console.log(`  ${message}`);
}

async function main() {
  log('回顾最近24小时...');
  
  // 读取今日日志
  if (fs.existsSync(memoryFile)) {
    const content = fs.readFileSync(memoryFile, 'utf-8');
    const lines = content.split('\n');
    
    // 提取完成的任务
    const completedTasks = lines.filter(line => line.includes('✅')).length;
    const sections = lines.filter(line => line.startsWith('## ')).length;
    
    log(`✅ 完成任务: ${completedTasks} 个`);
    log(`✅ 工作章节: ${sections} 个`);
  } else {
    log('⚠️  今日日志不存在');
  }
}

main().catch(console.error);
