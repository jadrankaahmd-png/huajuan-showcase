#!/usr/bin/env node

/**
 * Journal Events Skill
 * 
 * 功能：记录重要事件和学习到 memory/YYYY-MM-DD.md
 */

const fs = require('fs');
const path = require('path');

const workspaceRoot = '/Users/fox/.openclaw/workspace';
const memoryDir = path.join(workspaceRoot, 'memory');

function log(message) {
  console.log(`  ${message}`);
}

async function main() {
  log('记录重要事件...');
  
  // 确保 memory 目录存在
  if (!fs.existsSync(memoryDir)) {
    fs.mkdirSync(memoryDir, { recursive: true });
  }
  
  // 今天的日期
  const today = new Date().toISOString().split('T')[0];
  const memoryFile = path.join(memoryDir, `${today}.md`);
  
  // 如果文件不存在，创建
  if (!fs.existsSync(memoryFile)) {
    const header = `# ${today} 花卷工作日志\n\n`;
    fs.writeFileSync(memoryFile, header);
    log(`✅ 创建今日日志: ${memoryFile}`);
  } else {
    log(`✅ 今日日志已存在: ${memoryFile}`);
  }
}

main().catch(console.error);
