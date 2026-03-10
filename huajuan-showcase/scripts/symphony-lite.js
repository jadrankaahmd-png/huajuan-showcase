#!/usr/bin/env node

/**
 * 🌸 花卷 Symphony Lite - 简化版任务调度器
 * 
 * 替代 OpenAI Symphony，实现基本的任务调度功能
 * - 监听文件变化
 * - 自动同步 Redis
 * - Git 自动提交
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🌸 花卷 Symphony Lite 启动...');
console.log('');

// 配置
const config = {
  projectRoot: '/Users/fox/.openclaw/workspace/huajuan-showcase',
  customCapabilitiesPath: 'data/custom-capabilities.json',
  syncScript: 'scripts/sync-to-redis.js',
  maxRetries: 3,
  retryDelay: 5 * 60 * 1000, // 5分钟
};

// 任务队列
const taskQueue = [];

// 监听 custom-capabilities.json 变化
function watchCapabilities() {
  const filePath = path.join(config.projectRoot, config.customCapabilitiesPath);
  
  console.log(`👀 监听文件: ${filePath}`);
  
  let lastSize = 0;
  let lastMtime = 0;
  
  setInterval(() => {
    try {
      const stats = fs.statSync(filePath);
      const currentSize = stats.size;
      const currentMtime = stats.mtimeMs;
      
      if (currentSize !== lastSize || currentMtime !== lastMtime) {
        console.log('📝 检测到 capabilities 变化');
        lastSize = currentSize;
        lastMtime = currentMtime;
        
        // 添加任务到队列
        taskQueue.push({
          type: 'capability-sync',
          timestamp: Date.now(),
          retries: 0,
        });
      }
    } catch (error) {
      console.error('❌ 监听失败:', error.message);
    }
  }, 60 * 1000); // 每分钟检查一次
}

// 执行同步任务
function executeSyncTask(task) {
  console.log('🔄 执行能力同步任务...');
  
  try {
    // 1. 同步到 Redis
    console.log('  → 同步到 Redis...');
    execSync(`node ${config.syncScript}`, {
      cwd: config.projectRoot,
      stdio: 'inherit',
    });
    
    // 2. Git 提交
    console.log('  → Git 提交...');
    execSync('git add -A', { cwd: config.projectRoot, stdio: 'inherit' });
    execSync('git commit -m "symphony: auto sync capabilities"', {
      cwd: config.projectRoot,
      stdio: 'inherit',
    });
    
    // 3. Git 推送
    console.log('  → Git 推送...');
    execSync('git push', { cwd: config.projectRoot, stdio: 'inherit' });
    
    console.log('✅ 任务完成');
    return true;
  } catch (error) {
    console.error('❌ 任务失败:', error.message);
    
    // 重试逻辑
    if (task.retries < config.maxRetries) {
      console.log(`⏳ ${config.retryDelay / 1000 / 60} 分钟后重试 (${task.retries + 1}/${config.maxRetries})`);
      task.retries++;
      setTimeout(() => taskQueue.push(task), config.retryDelay);
    } else {
      console.error('❌ 达到最大重试次数，任务失败');
    }
    
    return false;
  }
}

// 任务处理循环
function processTasks() {
  setInterval(() => {
    if (taskQueue.length > 0) {
      const task = taskQueue.shift();
      console.log('');
      console.log(`📋 处理任务: ${task.type}`);
      executeSyncTask(task);
    }
  }, 10 * 1000); // 每10秒处理一次
}

// 启动服务
function start() {
  console.log('✅ 配置加载完成');
  console.log(`📁 项目根目录: ${config.projectRoot}`);
  console.log(`📊 最大重试次数: ${config.maxRetries}`);
  console.log(`⏱️  重试延迟: ${config.retryDelay / 1000 / 60} 分钟`);
  console.log('');
  
  // 启动监听
  watchCapabilities();
  
  // 启动任务处理
  processTasks();
  
  console.log('🚀 Symphony Lite 已启动');
  console.log('💡 按 Ctrl+C 停止服务');
  console.log('');
}

// 启动
start();
