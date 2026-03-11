#!/usr/bin/env node
/**
 * Skill 文档生成器
 * 为每个 skill 自动生成使用文档
 * 包括：使用示例、触发方式、故障排查指南
 */

const fs = require('fs');
const path = require('path');

const SKILLS_DIR = path.join(__dirname, '../../.agents/skills');
const DOCS_DIR = path.join(__dirname, '../docs/skills');

// 从描述中提取触发短语
function extractTriggerPhrases(description) {
  const phrases = [];
  const patterns = [
    /当用户说['"「"](.+?)['"」」]/g,
    /when user says ['"「"](.+?)['"」」]/gi,
  ];
  
  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(description)) !== null) {
      phrases.push(match[1]);
    }
  }
  
  return phrases;
}

// 生成文档内容
function generateDocumentation(skill) {
  const triggers = extractTriggerPhrases(skill.description);
  const name = skill.name;
  
  const doc = `# ${name} - 使用文档

**生成时间**: ${new Date().toISOString()}  
**Skill 名称**: ${name}

---

## 📋 概述

${skill.description}

---

## 🚀 使用方式

### 触发方式

${triggers.length > 0 ? triggers.map(t => `- 用户说："${t}"`).join('\n') : '- （需要添加触发短语）'}

### 使用示例

\`\`\`bash
# 方式1：通过自然语言触发
用户说："${triggers[0] || '触发短语'}"

# 方式2：手动运行脚本
node .agents/skills/${name}/scripts/main.js
\`\`\`

---

## 📖 详细说明

### 功能特点

${generateFeatures(name)}

### 执行步骤

${generateSteps(name)}

---

## ⚠️ 故障排查

### 常见问题

${generateTroubleshooting(name)}

---

## 📚 相关文档

- [Anthropic 官方 Skill 最佳实践](../knowledge_base/anthropic-skill-best-practices-2026-03-10.md)
- [OpenClaw Skills 文档](https://docs.openclaw.ai)

---

## 🔗 相关 Skills

${generateRelatedSkills(name)}

---

_最后更新: ${new Date().toISOString()}_
`;
  
  return doc;
}

// 生成功能特点
function generateFeatures(name) {
  const features = {
    'code-change-verification': '- 自动运行验证栈\n- 检查 Redis 数据完整性\n- 验证统计数字准确性\n- 生成详细报告',
    'prune-system-prompts': '- 自动扫描文件大小\n- 识别可精简文件\n- 保留关键信息\n- 生成精简报告',
    'docs-sync': '- 审计知识库vs能力库\n- 查找缺失文档\n- 检测错误或过时内容\n- 生成同步报告',
    'heartbeat-orchestrator': '- 统一调度5件事\n- 管理执行顺序\n- 汇总执行结果\n- 更新状态板',
  };
  
  return features[name] || '- 执行 skill 主功能\n- 生成执行报告';
}

// 生成执行步骤
function generateSteps(name) {
  const steps = {
    'code-change-verification': '1. 运行 \`npm run sync\`\n2. 验证 Redis 数据\n3. 验证统计数字\n4. 生成验证报告',
    'prune-system-prompts': '1. 扫描 workspace 文件\n2. 识别可精简文件\n3. 自动精简\n4. 生成精简报告',
    'docs-sync': '1. 读取能力库\n2. 读取知识库\n3. 比较一致性\n4. 生成同步报告',
    'heartbeat-orchestrator': '1. 执行 review-last-24h\n2. 执行 journal-events\n3. 执行 scan-environment\n4. 执行 health-check\n5. 执行 refresh-dashboard',
  };
  
  return steps[name] || '1. 执行主功能\n2. 生成报告';
}

// 生成故障排查
function generateTroubleshooting(name) {
  const troubleshooting = {
    'code-change-verification': '**问题1: npm run sync 失败**\n- 检查 Redis 连接\n- 检查数据文件\n\n**问题2: 统计数字不准确**\n- 重新运行 sync\n- 检查 custom-capabilities.json',
    'prune-system-prompts': '**问题1: 精简后文件损坏**\n- 检查备份文件\n- 恢复备份\n\n**问题2: 精简过度**\n- 调整阈值\n- 增加保留规则',
    'docs-sync': '**问题1: 知识条目缺失**\n- 检查 public/knowledge_base/\n- 运行 npm run sync\n\n**问题2: 能力未同步**\n- 检查 Redis 连接\n- 重新运行 sync',
    'heartbeat-orchestrator': '**问题1: 某个子 skill 失败**\n- 检查日志文件\n- 单独运行失败的 skill\n\n**问题2: 重复执行**\n- 检查 crontab 配置\n- 检查上次执行时间',
  };
  
  return troubleshooting[name] || '**问题1: skill 未触发**\n- 检查描述字段\n- 添加触发短语\n\n**问题2: 执行失败**\n- 检查脚本文件\n- 查看错误日志';
}

// 生成相关 skills
function generateRelatedSkills(name) {
  const related = {
    'code-change-verification': '- [docs-sync](./docs-sync.md)\n- [heartbeat-orchestrator](./heartbeat-orchestrator.md)',
    'prune-system-prompts': '- [heartbeat-orchestrator](./heartbeat-orchestrator.md)\n- [docs-sync](./docs-sync.md)',
    'docs-sync': '- [code-change-verification](./code-change-verification.md)\n- [heartbeat-orchestrator](./heartbeat-orchestrator.md)',
    'heartbeat-orchestrator': '- [code-change-verification](./code-change-verification.md)\n- [docs-sync](./docs-sync.md)\n- [prune-system-prompts](./prune-system-prompts.md)',
  };
  
  return related[name] || '- （无相关 skills）';
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
      
      const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
      if (frontmatterMatch) {
        const frontmatter = frontmatterMatch[1];
        const nameMatch = frontmatter.match(/^name:\s*(.+)$/m);
        const descMatch = frontmatter.match(/^description:\s*(.+)$/m);
        
        if (nameMatch && descMatch) {
          skills.push({
            name: nameMatch[1].trim(),
            description: descMatch[1].trim(),
            path: skillFile,
          });
        }
      }
    }
  }
  
  return skills;
}

// 主函数
async function main() {
  console.log('🌸 花卷 Skill 文档生成器');
  console.log('========================\n');
  
  // 确保文档目录存在
  if (!fs.existsSync(DOCS_DIR)) {
    fs.mkdirSync(DOCS_DIR, { recursive: true });
  }
  
  // 1. 扫描所有 skills
  console.log('📡 步骤1：扫描 skills...');
  const skills = scanSkills();
  console.log(`✅ 找到 ${skills.length} 个 skills\n`);
  
  // 2. 生成文档
  console.log('📝 步骤2：生成文档...');
  const results = [];
  
  for (const skill of skills) {
    const doc = generateDocumentation(skill);
    const fileName = `${skill.name}.md`;
    const filePath = path.join(DOCS_DIR, fileName);
    
    // 写入文档文件
    fs.writeFileSync(filePath, doc, 'utf8');
    
    results.push({
      name: skill.name,
      fileName,
    });
    
    console.log(`  ✅ ${skill.name} -> ${fileName}`);
  }
  
  console.log(`\n📊 生成结果:`);
  console.log(`  总数: ${results.length}`);
  console.log(`  文档目录: ${DOCS_DIR}`);
  
  console.log('\n✅ Skill 文档生成完成！');
}

main().catch(console.error);
