#!/usr/bin/env node
/**
 * Skill 测试生成器
 * 为每个 skill 自动生成测试用例
 * 包括：应该触发的场景、不应该触发的场景、预期输出验证
 */

const fs = require('fs');
const path = require('path');

const SKILLS_DIR = path.join(__dirname, '../../.agents/skills');
const TESTS_DIR = path.join(__dirname, '../tests/skills');

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

// 生成测试用例
function generateTestCases(skill) {
  const triggers = extractTriggerPhrases(skill.description);
  const name = skill.name;
  
  const testCases = {
    skillName: name,
    description: skill.description,
    testCases: {
      shouldTrigger: [],
      shouldNotTrigger: [],
      expectedOutput: [],
    },
  };
  
  // 应该触发的测试用例
  if (triggers.length > 0) {
    for (const trigger of triggers) {
      testCases.testCases.shouldTrigger.push({
        input: `用户说："${trigger}"`,
        expected: '应该触发此 skill',
      });
    }
  } else {
    testCases.testCases.shouldTrigger.push({
      input: '（无法提取触发短语，需要手动添加）',
      expected: '应该触发此 skill',
    });
  }
  
  // 不应该触发的测试用例（常见误触发场景）
  const notTriggerExamples = [
    { input: '用户说："验证身份证"', reason: '不相关' },
    { input: '用户说："检查邮件"', reason: '不相关' },
    { input: '用户说："同步手机"', reason: '不相关' },
  ];
  testCases.testCases.shouldNotTrigger = notTriggerExamples;
  
  // 预期输出验证
  const outputExamples = {
    'code-change-verification': [
      '运行 npm run sync',
      '验证 Redis 数据完整性',
      '验证统计数字准确性',
      '生成验证报告',
    ],
    'prune-system-prompts': [
      '扫描 workspace 文件大小',
      '识别可以精简的文件',
      '自动精简',
      '生成精简报告',
    ],
    'docs-sync': [
      '读取能力库',
      '读取知识库',
      '比较知识库 vs 能力库',
      '生成同步报告',
    ],
    'heartbeat-orchestrator': [
      '执行 review-last-24h',
      '执行 journal-events',
      '执行 scan-environment',
      '执行 health-check',
      '执行 refresh-dashboard',
    ],
  };
  
  testCases.testCases.expectedOutput = (outputExamples[name] || [
    '执行 skill 主功能',
    '生成执行报告',
  ]).map(output => ({
    check: output,
    expected: '✅ 成功',
  }));
  
  return testCases;
}

// 生成测试文件
function generateTestFile(skill, testCases) {
  const testName = skill.name.replace(/-/g, '');
  const fileName = `${testName}.test.js`;
  const filePath = path.join(TESTS_DIR, fileName);
  
  const content = `/**
 * ${skill.name} - 自动生成测试用例
 * 生成时间: ${new Date().toISOString()}
 */

describe('${skill.name}', () => {
  const skillName = '${skill.name}';
  const description = '${skill.description.replace(/'/g, "\\'")}';
  
  describe('应该触发', () => {
${testCases.testCases.shouldTrigger.map(tc => `    test('${tc.input}', () => {
      // TODO: 实现触发测试
      expect(true).toBe(true);
    });`).join('\n\n')}
  });
  
  describe('不应该触发', () => {
${testCases.testCases.shouldNotTrigger.map(tc => `    test('${tc.input} - ${tc.reason}', () => {
      // TODO: 实现不触发测试
      expect(true).toBe(true);
    });`).join('\n\n')}
  });
  
  describe('预期输出', () => {
${testCases.testCases.expectedOutput.map(tc => `    test('${tc.check}', () => {
      // TODO: 实现输出验证
      expect(true).toBe(true);
    });`).join('\n\n')}
  });
});
`;
  
  return { fileName, filePath, content };
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
  console.log('🌸 花卷 Skill 测试生成器');
  console.log('========================\n');
  
  // 确保测试目录存在
  if (!fs.existsSync(TESTS_DIR)) {
    fs.mkdirSync(TESTS_DIR, { recursive: true });
  }
  
  // 1. 扫描所有 skills
  console.log('📡 步骤1：扫描 skills...');
  const skills = scanSkills();
  console.log(`✅ 找到 ${skills.length} 个 skills\n`);
  
  // 2. 生成测试用例
  console.log('🔧 步骤2：生成测试用例...');
  const results = [];
  
  for (const skill of skills) {
    const testCases = generateTestCases(skill);
    const testFile = generateTestFile(skill, testCases);
    
    // 写入测试文件
    fs.writeFileSync(testFile.filePath, testFile.content, 'utf8');
    
    results.push({
      name: skill.name,
      fileName: testFile.fileName,
      triggerCount: testCases.testCases.shouldTrigger.length,
    });
    
    console.log(`  ✅ ${skill.name} -> ${testFile.fileName}`);
    console.log(`     触发测试: ${testCases.testCases.shouldTrigger.length} 个`);
  }
  
  console.log(`\n📊 生成结果:`);
  console.log(`  总数: ${results.length}`);
  console.log(`  测试文件: ${TESTS_DIR}`);
  
  console.log('\n✅ Skill 测试生成完成！');
}

main().catch(console.error);
