#!/usr/bin/env node
/**
 * Skill 描述优化器
 * 自动扫描 .agents/skills/ 目录下所有 skill
 * 检查每个 skill 的描述字段是否包含具体触发短语
 * 不符合标准的自动生成优化建议并更新
 */

const fs = require('fs');
const path = require('path');

const SKILLS_DIR = path.join(__dirname, '../../.agents/skills');

// Anthropic 官方标准：描述字段应该包含用户触发短语
const TRIGGER_PHRASE_PATTERNS = [
  /当用户说['"「"](.+?)['"」」]/g,
  /when user says ['"「"](.+?)['"」」]/gi,
  /触发短语[:：]\s*(.+)/gi,
];

// 检查描述是否包含触发短语
function hasTriggerPhrases(description) {
  for (const pattern of TRIGGER_PHRASE_PATTERNS) {
    if (pattern.test(description)) {
      return true;
    }
  }
  return false;
}

// 生成优化建议
function generateOptimizationSuggestion(skill) {
  const name = skill.name;
  const description = skill.description;
  
  // 根据 skill 类型生成触发短语建议
  const suggestions = {
    'code-change-verification': ['验证代码变更', '检查 Redis 数据', '同步能力', '验证统计'],
    'prune-system-prompts': ['精简系统提示词', '节省 Token', '压缩 MEMORY.md', '清理冗余'],
    'docs-sync': ['审计文档', '同步知识库', '检查文档完整性', '验证知识条目'],
    'heartbeat-orchestrator': ['运行 heartbeat', '执行心跳检查', '检查系统状态', '刷新状态板'],
  };
  
  const triggers = suggestions[name] || ['触发短语1', '触发短语2'];
  const triggerPhrases = triggers.map(t => `'${t}'`).join('、');
  
  return `当用户说${triggerPhrases}时使用`;
}

// 扫描所有 skills
function scanSkills() {
  const skills = [];
  const skillDirs = fs.readdirSync(SKILLS_DIR).filter(dir => {
    const skillPath = path.join(SKILLS_DIR, dir);
    return fs.statSync(skillPath).isDirectory();
  });
  
  for (const dir of skillDirs) {
    const skillFile = path.join(SKILLS_DIR, dir, 'SKILL.md');
    if (fs.existsSync(skillFile)) {
      const content = fs.readFileSync(skillFile, 'utf8');
      
      // 解析 frontmatter
      const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
      if (frontmatterMatch) {
        const frontmatter = frontmatterMatch[1];
        const nameMatch = frontmatter.match(/^name:\s*(.+)$/m);
        const descMatch = frontmatter.match(/^description:\s*(.+)$/m);
        
        if (nameMatch && descMatch) {
          const name = nameMatch[1].trim();
          const description = descMatch[1].trim();
          
          skills.push({
            name,
            description,
            path: skillFile,
            hasTriggers: hasTriggerPhrases(description),
          });
        }
      }
    }
  }
  
  return skills;
}

// 优化 skill 描述
function optimizeSkills(skills) {
  const results = {
    total: skills.length,
    optimized: 0,
    alreadyGood: 0,
    changes: [],
  };
  
  for (const skill of skills) {
    if (!skill.hasTriggers) {
      // 需要优化
      const suggestion = generateOptimizationSuggestion(skill);
      
      // 读取文件
      let content = fs.readFileSync(skill.path, 'utf8');
      
      // 替换描述
      const newDescription = `${skill.description} ${suggestion}`;
      content = content.replace(
        /^description:\s*(.+)$/m,
        `description: ${newDescription}`
      );
      
      // 写回文件
      fs.writeFileSync(skill.path, content, 'utf8');
      
      results.optimized++;
      results.changes.push({
        name: skill.name,
        old: skill.description,
        new: newDescription,
      });
    } else {
      results.alreadyGood++;
    }
  }
  
  return results;
}

// 主函数
async function main() {
  console.log('🌸 花卷 Skill 描述优化器');
  console.log('========================\n');
  
  // 1. 扫描所有 skills
  console.log('📡 步骤1：扫描 skills...');
  const skills = scanSkills();
  console.log(`✅ 找到 ${skills.length} 个 skills\n`);
  
  // 2. 检查哪些需要优化
  console.log('🔍 步骤2：检查描述字段...');
  const needsOptimization = skills.filter(s => !s.hasTriggers);
  const alreadyGood = skills.filter(s => s.hasTriggers);
  
  console.log(`  ✅ 已符合标准: ${alreadyGood.length} 个`);
  console.log(`  ⚠️  需要优化: ${needsOptimization.length} 个\n`);
  
  if (needsOptimization.length > 0) {
    // 3. 优化描述
    console.log('🔧 步骤3：优化描述字段...');
    const results = optimizeSkills(skills);
    
    console.log(`\n📊 优化结果:`);
    console.log(`  总数: ${results.total}`);
    console.log(`  已优化: ${results.optimized}`);
    console.log(`  已符合: ${results.alreadyGood}\n`);
    
    if (results.changes.length > 0) {
      console.log('💡 优化详情:');
      for (const change of results.changes) {
        console.log(`  ${change.name}:`);
        console.log(`    ❌ 旧: ${change.old.substring(0, 50)}...`);
        console.log(`    ✅ 新: ${change.new.substring(0, 80)}...`);
      }
    }
  } else {
    console.log('✅ 所有 skills 描述已符合标准！\n');
  }
  
  console.log('\n✅ Skill 描述优化完成！');
}

main().catch(console.error);
