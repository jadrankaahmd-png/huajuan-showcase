#!/usr/bin/env ts-node
/**
 * 从 SQLite 数据库自动生成 capabilities.ts
 * 
 * 用法：ts-node scripts/generate_capabilities.ts
 * 
 * 此脚本从 data/capabilities.db 读取所有能力，自动生成 app/data/capabilities.ts
 * capabilities.ts 禁止手动编辑，所有修改通过数据库操作
 */

import * as fs from 'fs';
import Database from 'better-sqlite3';

const DB_PATH = 'data/capabilities.db';
const OUTPUT_PATH = 'app/data/capabilities.ts';

interface Capability {
  id: number;
  category: string;
  name: string;
  description: string;
  status: string;
  type: string;
  icon: string;
  details_json: string;
}

interface CategoryGroup {
  category: string;
  name: string;
  description?: string;
  icon: string;
  items: Capability[];
}

// 分类名称映射（从 category 到中文）
const CATEGORY_NAMES: Record<string, string> = {
  'tools': '工具系统',
  'api': 'API系统',
  'knowledge': '知识库系统',
  'knowledge-base': '知识库系统',
  'institutional': '机构系统',
  'ai': 'AI系统',
  'agents': '八大分析Agent',
  'memory': '记忆系统',
  'design': '设计系统',
  'memory-optimization': '记忆与优化系统',
  'data-fetching': '数据获取系统',
  'templates': '模板系统',
  'automation': '自动化系统',
  'shell': 'Shell系统',
  'data': '数据系统',
  'systems': '系统',
  'other': '其他',
  'reports': '报告系统',
  'tool-library': '工具库',
  'team': '团队系统',
  'iran-tracker': '伊朗追踪',
  'deployment': '部署系统',
  'openclaw-skills': 'OpenClaw技能',
  'book-distillation': '书籍提炼',
  'documentation': '文档系统',
  'stock-analysis': '股票分析',
  'data-monitoring': '数据监控',
  'ai-analysis': 'AI分析',
  'calendar-email': '日历邮件',
  'document-management': '文档管理',
  'development-tools': '开发工具',
  'communication': '通信系统',
  'skills': '技能系统',
};

// 分类图标映射
const CATEGORY_ICONS: Record<string, string> = {
  'tools': '🛠️',
  'api': '🔌',
  'knowledge': '📚',
  'knowledge-base': '📖',
  'institutional': '🏛️',
  'ai': '🤖',
  'agents': '🤖',
  'memory': '🧠',
  'design': '🎨',
  'memory-optimization': '🧠',
  'data-fetching': '📊',
  'templates': '📝',
  'automation': '⚡',
  'shell': '💻',
  'data': '📊',
  'systems': '⚙️',
  'other': '📦',
  'reports': '📊',
  'tool-library': '🛠️',
  'team': '👥',
  'iran-tracker': '🌍',
  'deployment': '🚀',
  'openclaw-skills': '🦾',
  'book-distillation': '📚',
  'documentation': '📄',
  'stock-analysis': '📈',
  'data-monitoring': '📊',
  'ai-analysis': '🤖',
  'calendar-email': '📅',
  'document-management': '📄',
  'development-tools': '🛠️',
  'communication': '💬',
  'skills': '🎯',
};

function generateCapabilitiesTs() {
  console.log('🔧 开始生成 capabilities.ts...\n');

  // 1. 读取数据库
  console.log('📦 读取数据库...');
  const db = new Database(DB_PATH);
  
  const capabilities = db.prepare(`
    SELECT * FROM capabilities 
    ORDER BY category, id
  `).all() as Capability[];

  console.log(`✅ 读取 ${capabilities.length} 个能力\n`);

  // 2. 按分类分组
  console.log('📊 按分类分组...');
  const categoryMap = new Map<string, CategoryGroup>();

  for (const cap of capabilities) {
    if (!categoryMap.has(cap.category)) {
      categoryMap.set(cap.category, {
        category: cap.category,
        name: CATEGORY_NAMES[cap.category] || cap.category,
        icon: CATEGORY_ICONS[cap.category] || '⭐',
        items: [],
      });
    }
    categoryMap.get(cap.category)!.items.push(cap);
  }

  const categories = Array.from(categoryMap.values());
  console.log(`✅ 分组完成：${categories.length} 个分类\n`);

  // 3. 生成 TypeScript 代码
  console.log('✍️  生成 TypeScript 代码...');
  
  const timestamp = new Date().toISOString();
  
  let content = `// 第一层能力定义（自动生成）
// ⚠️ 此文件由 SQLite 数据库自动生成，禁止手动编辑
// 最后更新：${timestamp}
// 
// 如需修改能力，请通过以下方式：
// 1. 直接操作 SQLite 数据库（data/capabilities.db）
// 2. 运行生成脚本：ts-node scripts/generate_capabilities.ts
//
// 数据库操作示例：
// - 添加能力：INSERT INTO capabilities (category, name, description, ...)
// - 修改能力：UPDATE capabilities SET ... WHERE id = ...
// - 删除能力：DELETE FROM capabilities WHERE id = ...

export interface Capability {
  category: string;
  name: string;
  description: string;
  status: string;
  type: string;
  icon: string;
  details: {
    whatItDoes?: string;
    howItWorks?: string;
    currentStatus?: string;
    lastUpdate?: string;
    usage?: string;
    dependencies?: string[];
    [key: string]: any;
  };
}

export interface CapabilityCategory {
  category: string;
  name: string;
  description?: string;
  icon: string;
  items: Capability[];
}

export const capabilities: CapabilityCategory[] = [
`;

  // 添加每个分类
  for (const cat of categories) {
    content += `  {
    category: '${cat.category}',
    name: '${cat.name}',
    icon: '${cat.icon}',
    items: [
`;

    // 添加每个能力
    for (const item of cat.items) {
      const details = JSON.parse(item.details_json || '{}');
      const detailsStr = Object.entries(details)
        .map(([key, value]) => {
          if (typeof value === 'string') {
            return `          ${key}: '${value.replace(/'/g, "\\'").replace(/\n/g, '\\n')}'`;
          } else if (Array.isArray(value)) {
            return `          ${key}: [${value.map(v => `'${v}'`).join(', ')}]`;
          } else {
            return `          ${key}: ${JSON.stringify(value)}`;
          }
        })
        .join(',\n');

      content += `      {
        name: '${item.name.replace(/'/g, "\\'")}',
        description: '${item.description.replace(/'/g, "\\'").replace(/\n/g, '\\n')}',
        status: '${item.status}',
        type: '${item.type}',
        icon: '${item.icon}',
        details: {
${detailsStr}
        }
      },
`;
    }

    content += `    ]
  },
`;
  }

  content += `];

// 动态计算总能力数
export function getTotalCapabilities(): number {
  return capabilities.reduce((total, cat) => total + cat.items.length, 0);
}

// 获取所有能力（扁平化）
export function getAllCapabilities(): Capability[] {
  return capabilities.flatMap(cat => cat.items);
}

// 按分类获取能力
export function getCapabilitiesByCategory(category: string): Capability[] {
  const cat = capabilities.find(c => c.category === category);
  return cat ? cat.items : [];
}

// 搜索能力
export function searchCapabilities(query: string): Capability[] {
  const lowerQuery = query.toLowerCase();
  return capabilities.flatMap(cat => 
    cat.items.filter(item => 
      item.name.toLowerCase().includes(lowerQuery) ||
      item.description.toLowerCase().includes(lowerQuery)
    )
  );
}
`;

  // 4. 写入文件
  console.log('💾 写入文件...');
  fs.writeFileSync(OUTPUT_PATH, content, 'utf8');
  console.log(`✅ 已生成：${OUTPUT_PATH}\n`);

  // 5. 验证
  console.log('✅ 验证生成结果...');
  console.log(`✅ 总能力数：${capabilities.length} 个\n`);
  console.log('✅ 生成成功！\n');

  db.close();
}

// 执行
generateCapabilitiesTs();
