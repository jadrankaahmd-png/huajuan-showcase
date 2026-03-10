#!/usr/bin/env node

/**
 * 🌸 花卷三层记忆加载工具
 * 
 * 三层记忆结构：
 * - 第一层：NOW.md（当前状态，每次必读）
 * - 第二层：当日日志（短期记忆，需要时读取）
 * - 第三层：knowledge_base/（长期知识，按需索引）
 */

const fs = require('fs');
const path = require('path');

// 项目根目录
const workspaceRoot = '/Users/fox/.openclaw/workspace';
const projectRoot = path.join(workspaceRoot, 'huajuan-showcase');

// 三层记忆
const memory = {
  // 第一层：当前状态（每次必读）
  layer1: {
    name: 'NOW.md',
    path: path.join(workspaceRoot, 'NOW.md'),
    required: true,
    maxTokens: 1000,
  },
  
  // 第二层：短期记忆（需要时读取）
  layer2: {
    name: '当日日志',
    path: path.join(workspaceRoot, 'memory', `${new Date().toISOString().split('T')[0]}.md`),
    required: false,
    maxTokens: 5000,
  },
  
  // 第三层：长期知识（按需索引）
  layer3: {
    name: 'knowledge_base/',
    path: path.join(projectRoot, 'public/knowledge_base'),
    required: false,
    maxTokens: 20000,
  }
};

// 加载第一层（当前状态）
function loadLayer1() {
  console.log('📖 加载第一层：NOW.md（当前状态）');
  
  try {
    if (fs.existsSync(memory.layer1.path)) {
      const content = fs.readFileSync(memory.layer1.path, 'utf-8');
      const tokens = content.length / 4; // 粗略估算
      
      console.log(`   ✅ 已加载 NOW.md`);
      console.log(`   📊 约 ${Math.round(tokens)} tokens`);
      
      return content;
    } else {
      console.log('   ⚠️  NOW.md 不存在');
      return null;
    }
  } catch (error) {
    console.error(`   ❌ 加载失败: ${error.message}`);
    return null;
  }
}

// 加载第二层（短期记忆）
function loadLayer2() {
  console.log('📖 加载第二层：当日日志（短期记忆）');
  
  try {
    if (fs.existsSync(memory.layer2.path)) {
      const content = fs.readFileSync(memory.layer2.path, 'utf-8');
      const tokens = content.length / 4;
      
      console.log(`   ✅ 已加载当日日志`);
      console.log(`   📊 约 ${Math.round(tokens)} tokens`);
      
      return content;
    } else {
      console.log('   ⏳ 当日日志尚未创建');
      return null;
    }
  } catch (error) {
    console.error(`   ❌ 加载失败: ${error.message}`);
    return null;
  }
}

// 加载第三层（长期知识）
function loadLayer3(keyword = null) {
  console.log('📖 加载第三层：knowledge_base/（长期知识）');
  
  try {
    const knowledgeBase = memory.layer3.path;
    
    if (fs.existsSync(knowledgeBase)) {
      const files = fs.readdirSync(knowledgeBase).filter(f => f.endsWith('.md'));
      
      console.log(`   ✅ 找到 ${files.length} 个知识条目`);
      
      // 如果有关键词，只加载相关文件
      if (keyword) {
        const relevant = files.filter(f => f.toLowerCase().includes(keyword.toLowerCase()));
        console.log(`   📊 关键词 "${keyword}" 相关: ${relevant.length} 个`);
        
        return relevant.map(f => ({
          name: f,
          path: path.join(knowledgeBase, f),
        }));
      }
      
      return files.map(f => ({
        name: f,
        path: path.join(knowledgeBase, f),
      }));
    } else {
      console.log('   ⚠️  knowledge_base/ 不存在');
      return [];
    }
  } catch (error) {
    console.error(`   ❌ 加载失败: ${error.message}`);
    return [];
  }
}

// 按需加载
function loadContext(level = 1, keyword = null) {
  console.log('');
  console.log('🌸 花卷三层记忆加载');
  console.log('==================');
  console.log(`加载级别: ${level}`);
  console.log('');
  
  const result = {};
  
  // 第一层（必读）
  result.layer1 = loadLayer1();
  
  // 第二层（需要时）
  if (level >= 2) {
    result.layer2 = loadLayer2();
  }
  
  // 第三层（按需）
  if (level >= 3) {
    result.layer3 = loadLayer3(keyword);
  }
  
  console.log('');
  console.log('✅ 加载完成');
  console.log('');
  
  return result;
}

// 主函数
function main() {
  const args = process.argv.slice(2);
  const level = parseInt(args[0]) || 1;
  const keyword = args[1] || null;
  
  loadContext(level, keyword);
}

// 运行
if (require.main === module) {
  main();
}

module.exports = { loadContext, loadLayer1, loadLayer2, loadLayer3 };
