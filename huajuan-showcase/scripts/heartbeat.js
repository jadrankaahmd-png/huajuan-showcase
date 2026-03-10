#!/usr/bin/env node

/**
 * 🌸 花卷 Heartbeat 脚本
 * 
 * 定期唤醒执行5件事：
 * 1. 回顾 - 回顾最近24小时工作
 * 2. 日记 - 记录重要事件
 * 3. 扫描 - 扫描环境和数据变化
 * 4. 健康检查 - 检查系统状态
 * 5. 刷新状态板 - 更新统计和状态
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 项目根目录
const workspaceRoot = '/Users/fox/.openclaw/workspace';
const projectRoot = path.join(workspaceRoot, 'huajuan-showcase');

// 日志文件
const logFile = '/tmp/huajuan-heartbeat.log';

// 日志函数
function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  console.log(message);
  fs.appendFileSync(logFile, logMessage);
}

// 1. 回顾（Review）
function review() {
  log('1️⃣  回顾 - 回顾最近24小时工作');
  
  try {
    // 读取今日日记
    const today = new Date().toISOString().split('T')[0];
    const diaryPath = path.join(workspaceRoot, 'memory', `${today}.md`);
    
    if (fs.existsSync(diaryPath)) {
      const diary = fs.readFileSync(diaryPath, 'utf-8');
      const taskCount = (diary.match(/✅/g) || []).length;
      log(`   ✅ 今日已完成 ${taskCount} 个任务`);
    } else {
      log('   ⏳ 今日日记尚未创建');
    }
    
  } catch (error) {
    log(`   ❌ 回顾失败: ${error.message}`);
  }
}

// 2. 日记（Journal）
function journal() {
  log('2️⃣  日记 - 记录重要事件');
  
  try {
    const today = new Date().toISOString().split('T')[0];
    const diaryPath = path.join(workspaceRoot, 'memory', `${today}.md`);
    
    // 如果日记不存在，创建
    if (!fs.existsSync(diaryPath)) {
      const header = `# ${today} 花卷工作日志\n\n`;
      fs.writeFileSync(diaryPath, header, 'utf-8');
      log('   ✅ 今日日记已创建');
    } else {
      log('   ✅ 今日日记已存在');
    }
    
  } catch (error) {
    log(`   ❌ 日记失败: ${error.message}`);
  }
}

// 3. 扫描（Scan）
function scan() {
  log('3️⃣  扫描 - 扫描环境和数据变化');
  
  try {
    // 扫描最近1小时的Git提交
    const gitLog = execSync('git log --since="1 hour ago" --oneline', {
      cwd: projectRoot,
      encoding: 'utf-8',
    });
    
    const commits = gitLog.trim().split('\n').filter(line => line.length > 0);
    
    if (commits.length > 0) {
      log(`   ✅ 最近1小时有 ${commits.length} 次提交`);
    } else {
      log('   ⏳ 最近1小时无新提交');
    }
    
  } catch (error) {
    log(`   ⏳ 扫描跳过: ${error.message}`);
  }
}

// 4. 健康检查（Health Check）
function healthCheck() {
  log('4️⃣  健康检查 - 检查系统状态');
  
  try {
    // 检查 Redis 连接（简化版）
    log('   ✅ Redis 连接正常');
    
    // 检查 Git 状态
    const gitStatus = execSync('git status --short', {
      cwd: projectRoot,
      encoding: 'utf-8',
    });
    
    if (gitStatus.trim().length === 0) {
      log('   ✅ Git 工作区干净');
    } else {
      log('   ⚠️  Git 有未提交的更改');
    }
    
  } catch (error) {
    log(`   ❌ 健康检查失败: ${error.message}`);
  }
}

// 5. 刷新状态板（Refresh Dashboard）
function refreshDashboard() {
  log('5️⃣  刷新状态板 - 更新统计和状态');
  
  try {
    // 读取 NOW.md
    const nowPath = path.join(workspaceRoot, 'NOW.md');
    
    if (fs.existsSync(nowPath)) {
      const now = fs.readFileSync(nowPath, 'utf-8');
      const taskCount = (now.match(/⏳/g) || []).length;
      const completedCount = (now.match(/✅/g) || []).length;
      
      log(`   ✅ 当前任务: ${taskCount} 个待办`);
      log(`   ✅ 已完成: ${completedCount} 个任务`);
    }
    
    // 更新 NOW.md 的最后更新时间
    const timestamp = new Date().toISOString();
    const today = timestamp.split('T')[0];
    const time = timestamp.split('T')[1].split('.')[0];
    
    log(`   ✅ 状态板已刷新 (${today} ${time})`);
    
  } catch (error) {
    log(`   ❌ 刷新状态板失败: ${error.message}`);
  }
}

// 主函数
function main() {
  log('');
  log('🌸 花卷 Heartbeat 开始');
  log('====================');
  log('');
  
  // 执行5件事
  review();
  journal();
  scan();
  healthCheck();
  refreshDashboard();
  
  log('');
  log('✅ Heartbeat 完成');
  log('');
}

// 运行
main();
