#!/usr/bin/env node

/**
 * Docs Sync Audit Script
 * 
 * 功能：
 * 1. 读取知识库条目
 * 2. 读取能力库
 * 3. 比较知识库 vs 能力库
 * 4. 生成同步报告
 */

const fs = require('fs');
const path = require('path');
const { Redis } = require('@upstash/redis');

// Redis 配置
const redis = new Redis({
  url: 'https://valued-hamster-37498.upstash.io',
  token: 'AZJ6AAIncDE1YzRlYzY3NzI5OTU0MWIzOTM5YzNjMWE2NDkzMTkyZHAxMzc0OTg',
});

// 项目根目录
const workspaceRoot = '/Users/fox/.openclaw/workspace';
const projectRoot = path.join(workspaceRoot, 'huajuan-showcase');
const knowledgeBaseDir = path.join(projectRoot, 'public/knowledge_base');

// 日志
function log(message) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`);
}

// 同步报告
const report = {
  timestamp: new Date().toISOString(),
  status: 'pending',
  knowledge: {
    total: 0,
    items: [],
  },
  capabilities: {
    total: 0,
    items: [],
  },
  inconsistencies: {
    knowledgeWithoutCapability: [],
    capabilityWithoutKnowledge: [],
  },
  coverage: 0,
};

// 1. 读取知识库
function readKnowledgeBase() {
  log('1️⃣  读取知识库...');
  
  try {
    const files = fs.readdirSync(knowledgeBaseDir)
      .filter(file => file.endsWith('.md'));
    
    report.knowledge.total = files.length;
    
    // 提取知识条目标题
    files.forEach(file => {
      const filePath = path.join(knowledgeBaseDir, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      const title = content.split('\n')[0].replace(/^# /, '');
      
      report.knowledge.items.push({
        file: file,
        title: title,
      });
    });
    
    log(`   ✅ 知识条目: ${report.knowledge.total} 个`);
    return true;
  } catch (error) {
    log(`   ❌ 读取知识库失败: ${error.message}`);
    return false;
  }
}

// 2. 读取能力库
async function readCapabilities() {
  log('2️⃣  读取能力库...');
  
  try {
    const capabilities = await redis.get('capabilities:all');
    
    if (!capabilities) {
      log('   ❌ capabilities:all 不存在');
      return false;
    }
    
    report.capabilities.total = capabilities.length;
    report.capabilities.items = capabilities.map(c => ({
      name: c.name,
      category: c.category,
    }));
    
    log(`   ✅ 能力数: ${report.capabilities.total} 个`);
    return true;
  } catch (error) {
    log(`   ❌ 读取能力库失败: ${error.message}`);
    return false;
  }
}

// 3. 比较知识库 vs 能力库
function compareKnowledgeVsCapabilities() {
  log('3️⃣  比较知识库 vs 能力库...');
  
  // 提取能力名称
  const capabilityNames = new Set(
    report.capabilities.items.map(c => c.name.toLowerCase())
  );
  
  // 提取知识条目标题
  const knowledgeTitles = new Set(
    report.knowledge.items.map(k => k.title.toLowerCase())
  );
  
  // 检查：知识条目没有对应能力
  report.knowledge.items.forEach(k => {
    const title = k.title.toLowerCase();
    let found = false;
    
    // 模糊匹配（包含关键词）
    for (const capName of capabilityNames) {
      if (capName.includes(title) || title.includes(capName)) {
        found = true;
        break;
      }
    }
    
    if (!found) {
      report.inconsistencies.knowledgeWithoutCapability.push({
        title: k.title,
        file: k.file,
      });
    }
  });
  
  // 检查：能力没有对应知识条目
  report.capabilities.items.forEach(c => {
    const name = c.name.toLowerCase();
    let found = false;
    
    // 模糊匹配（包含关键词）
    for (const title of knowledgeTitles) {
      if (name.includes(title) || title.includes(name)) {
        found = true;
        break;
      }
    }
    
    if (!found) {
      report.inconsistencies.capabilityWithoutKnowledge.push({
        name: c.name,
        category: c.category,
      });
    }
  });
  
  // 计算覆盖率
  const coveredCapabilities = 
    report.capabilities.total - report.inconsistencies.capabilityWithoutKnowledge.length;
  report.coverage = 
    (coveredCapabilities / report.capabilities.total * 100).toFixed(1);
  
  log(`   ✅ 比较完成`);
  log(`   📊 知识条目缺少对应能力: ${report.inconsistencies.knowledgeWithoutCapability.length} 个`);
  log(`   📊 能力缺少知识条目: ${report.inconsistencies.capabilityWithoutKnowledge.length} 个`);
  log(`   📊 覆盖率: ${report.coverage}%`);
  
  return true;
}

// 4. 生成报告
function generateReport() {
  log('');
  log('📊 Docs Sync Report');
  log('===================');
  log(`时间: ${report.timestamp}`);
  log('');
  
  log('统计:');
  log(`  知识条目: ${report.knowledge.total} 个`);
  log(`  能力库: ${report.capabilities.total} 个`);
  log(`  覆盖率: ${report.coverage}%`);
  log('');
  
  // 判断状态
  const hasInconsistencies = 
    report.inconsistencies.knowledgeWithoutCapability.length > 0 ||
    report.inconsistencies.capabilityWithoutKnowledge.length > 0;
  
  if (!hasInconsistencies) {
    report.status = 'pass';
    log('✅ 知识库与能力库一致');
  } else {
    report.status = 'warning';
    log('⚠️  发现不一致');
    log('');
    
    if (report.inconsistencies.knowledgeWithoutCapability.length > 0) {
      log('知识条目缺少对应能力:');
      report.inconsistencies.knowledgeWithoutCapability.forEach((k, i) => {
        log(`  ${i + 1}. ${k.title} (${k.file})`);
      });
      log('');
    }
    
    if (report.inconsistencies.capabilityWithoutKnowledge.length > 0) {
      log(`能力缺少知识条目 (${report.inconsistencies.capabilityWithoutKnowledge.length} 个):`);
      
      // 只显示前20个
      const toShow = report.inconsistencies.capabilityWithoutKnowledge.slice(0, 20);
      toShow.forEach((c, i) => {
        log(`  ${i + 1}. ${c.name} (${c.category})`);
      });
      
      if (report.inconsistencies.capabilityWithoutKnowledge.length > 20) {
        log(`  ... 还有 ${report.inconsistencies.capabilityWithoutKnowledge.length - 20} 个`);
      }
      log('');
    }
    
    log('建议:');
    log('  1. 为高优先级能力创建知识条目');
    log('  2. 定期更新知识条目');
    log('  3. 建立自动化同步机制');
  }
  
  log('');
  
  return report.status === 'pass';
}

// 主函数
async function main() {
  log('');
  log('🔍 Docs Sync Audit');
  log('==================');
  log('');
  
  // 执行审计
  readKnowledgeBase();
  await readCapabilities();
  compareKnowledgeVsCapabilities();
  
  // 生成报告
  const passed = generateReport();
  
  // 退出码（warning 也算成功）
  process.exit(0);
}

// 运行
main().catch(error => {
  log(`❌ 审计异常: ${error.message}`);
  process.exit(1);
});
