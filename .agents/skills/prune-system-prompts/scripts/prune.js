#!/usr/bin/env node

/**
 * Prune System Prompts Skill
 * 
 * 功能：自动扫描和精简 workspace 文件
 * 
 * 文件：
 * 1. AGENTS.md - 仓库级指令
 * 2. MEMORY.md - 长期记忆
 * 3. NOW.md - 当前状态
 * 4. memory/YYYY-MM-DD.md - 每日日志
 */

const fs = require('fs');
const path = require('path');

const workspaceRoot = '/Users/fox/.openclaw/workspace';
const logFile = '/tmp/huajuan-prune.log';

// 阈值配置（KB）
const THRESHOLDS = {
  'AGENTS.md': 5,
  'MEMORY.md': 4,
  'NOW.md': 2,
  'memory/*.md': 10,
};

// 日志函数
function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  console.log(message);
  fs.appendFileSync(logFile, logMessage);
}

// 扫描文件
function scanFiles() {
  const files = [];
  
  // 扫描根目录文件
  for (const filename of ['AGENTS.md', 'MEMORY.md', 'NOW.md']) {
    const filePath = path.join(workspaceRoot, filename);
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      files.push({
        path: filePath,
        name: filename,
        size: stats.size,
        sizeKB: (stats.size / 1024).toFixed(1),
        threshold: THRESHOLDS[filename],
      });
    }
  }
  
  // 扫描 memory 目录
  const memoryDir = path.join(workspaceRoot, 'memory');
  if (fs.existsSync(memoryDir)) {
    const memoryFiles = fs.readdirSync(memoryDir).filter(f => f.endsWith('.md'));
    for (const filename of memoryFiles) {
      const filePath = path.join(memoryDir, filename);
      const stats = fs.statSync(filePath);
      files.push({
        path: filePath,
        name: `memory/${filename}`,
        size: stats.size,
        sizeKB: (stats.size / 1024).toFixed(1),
        threshold: THRESHOLDS['memory/*.md'],
      });
    }
  }
  
  return files;
}

// 识别需要精简的文件
function identifyFilesToPrune(files) {
  return files.filter(file => {
    const sizeKB = parseFloat(file.sizeKB);
    return sizeKB > file.threshold;
  });
}

// 精简文件
function pruneFile(file) {
  log(`  ${file.name}: ${file.sizeKB}KB → 精简中...`);
  
  const content = fs.readFileSync(file.path, 'utf-8');
  const lines = content.split('\n');
  
  // 精简策略
  const prunedLines = [];
  let inCodeBlock = false;
  
  for (const line of lines) {
    // 保留代码块标记
    if (line.startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      prunedLines.push(line);
      continue;
    }
    
    // 在代码块内，保留所有行
    if (inCodeBlock) {
      prunedLines.push(line);
      continue;
    }
    
    // 删除空行（保留一个）
    if (line.trim() === '' && prunedLines[prunedLines.length - 1]?.trim() === '') {
      continue;
    }
    
    // 保留标题
    if (line.startsWith('#')) {
      prunedLines.push(line);
      continue;
    }
    
    // 保留规则
    if (line.includes('❌') || line.includes('✅') || line.includes('⚠️')) {
      prunedLines.push(line);
      continue;
    }
    
    // 保留关键信息
    if (line.includes('API') || line.includes('Key') || line.includes('Token') || line.includes('规则')) {
      prunedLines.push(line);
      continue;
    }
    
    // 保留列表项
    if (line.startsWith('-') || line.startsWith('*') || line.startsWith('  -')) {
      prunedLines.push(line);
      continue;
    }
    
    // 保留其他行（限制长度）
    if (line.length < 200) {
      prunedLines.push(line);
    }
  }
  
  // 写入精简后的内容
  const prunedContent = prunedLines.join('\n');
  
  // 备份原文件
  const backupPath = `${file.path}.backup`;
  fs.writeFileSync(backupPath, content);
  
  // 写入新文件
  fs.writeFileSync(file.path, prunedContent);
  
  // 计算节省
  const newSize = Buffer.byteLength(prunedContent, 'utf-8');
  const newSizeKB = (newSize / 1024).toFixed(1);
  const saved = ((1 - newSize / file.size) * 100).toFixed(0);
  
  log(`  ${file.name}: ${file.sizeKB}KB → ${newSizeKB}KB ✅ 节省${saved}%`);
  
  return {
    original: file.sizeKB,
    pruned: newSizeKB,
    saved: saved,
  };
}

// 主函数
async function main() {
  log('');
  log('🔍 Prune System Prompts');
  log('=======================');
  log('');
  
  // 1. 扫描文件
  log('📊 扫描文件:');
  const files = scanFiles();
  
  for (const file of files) {
    const status = file.sizeKB > file.threshold ? '⚠️  需要精简' : '✅ 无需精简';
    log(`  ${file.name}: ${file.sizeKB}KB ${status}（阈值: ${file.threshold}KB）`);
  }
  
  log('');
  
  // 2. 识别需要精简的文件
  const toPrune = identifyFilesToPrune(files);
  
  if (toPrune.length === 0) {
    log('✅ 所有文件都在阈值内，无需精简');
    return;
  }
  
  log('📊 精简文件:');
  
  // 3. 精简文件
  const results = [];
  for (const file of toPrune) {
    const result = pruneFile(file);
    results.push(result);
  }
  
  log('');
  
  // 4. 生成报告
  log('📊 总节省:');
  const totalOriginal = results.reduce((sum, r) => sum + parseFloat(r.original), 0);
  const totalPruned = results.reduce((sum, r) => sum + parseFloat(r.pruned), 0);
  const totalSaved = ((1 - totalPruned / totalOriginal) * 100).toFixed(0);
  
  log(`  Token: ${totalOriginal.toFixed(1)}KB → ${totalPruned.toFixed(1)}KB（节省${totalSaved}%）`);
  log('');
  
  log('✅ 精简完成');
}

// 运行
main().catch(error => {
  log(`❌ 精简异常: ${error.message}`);
  process.exit(1);
});
