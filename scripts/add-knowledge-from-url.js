#!/usr/bin/env node

/**
 * 🌸 花卷链接自动抓取知识库工具
 * 
 * 功能：
 * 1. 自动抓取链接全文内容
 * 2. 自动生成标签和摘要
 * 3. 保存为 .md 文件到 knowledge_base/
 * 4. 自动运行 npm run sync 同步到 Redis
 * 5. 知识库总数自动 +1
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 项目根目录
const projectRoot = '/Users/fox/.openclaw/workspace/huajuan-showcase';
const knowledgeBaseDir = path.join(projectRoot, 'public/knowledge_base');

// 检查参数
if (process.argv.length < 3) {
  console.log('🌸 花卷链接自动抓取知识库工具');
  console.log('');
  console.log('用法: node scripts/add-knowledge-from-url.js <URL>');
  console.log('');
  console.log('示例:');
  console.log('  node scripts/add-knowledge-from-url.js https://example.com/article');
  console.log('');
  process.exit(1);
}

const url = process.argv[2];

console.log('🌸 花卷链接自动抓取知识库');
console.log('========================');
console.log('');
console.log(`📝 链接: ${url}`);
console.log('');

// 生成文件名（基于URL）
function generateFileName(url) {
  const urlObj = new URL(url);
  const domain = urlObj.hostname.replace(/\./g, '-');
  const pathname = urlObj.pathname.replace(/\//g, '-').substring(0, 50);
  const timestamp = new Date().toISOString().split('T')[0];
  return `${domain}${pathname}-${timestamp}.md`;
}

// 抓取网页内容
async function fetchContent(url) {
  console.log('📡 正在抓取网页内容...');
  
  try {
    // 使用 curl 抓取
    const html = execSync(`curl -s -L "${url}"`, {
      encoding: 'utf-8',
      maxBuffer: 10 * 1024 * 1024, // 10MB buffer
    });
    
    // 简单提取标题和正文
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : '无标题';
    
    // 提取正文（简单版本，移除HTML标签）
    let content = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, '\n')
      .replace(/\n\s*\n/g, '\n\n')
      .trim();
    
    // 限制长度
    if (content.length > 10000) {
      content = content.substring(0, 10000) + '\n\n... (内容过长，已截断)';
    }
    
    console.log(`✅ 抓取成功: ${title}`);
    console.log(`   内容长度: ${content.length} 字符`);
    
    return { title, content };
    
  } catch (error) {
    console.error('❌ 抓取失败:', error.message);
    throw error;
  }
}

// 生成标签
function generateTags(url, title, content) {
  console.log('🏷️  正在生成标签...');
  
  const tags = [];
  const urlObj = new URL(url);
  
  // 从URL提取域名作为标签
  tags.push(urlObj.hostname);
  
  // 从标题提取关键词
  const keywords = title.split(/[\s\-:|]+/).filter(word => word.length > 2);
  tags.push(...keywords.slice(0, 3));
  
  // 去重
  const uniqueTags = [...new Set(tags)].slice(0, 5);
  
  console.log(`✅ 标签: ${uniqueTags.join(', ')}`);
  
  return uniqueTags;
}

// 生成 Markdown 文件
function generateMarkdown(url, title, content, tags) {
  const timestamp = new Date().toISOString();
  const date = timestamp.split('T')[0];
  
  return `# ${title}

**来源**: ${url}  
**日期**: ${date}  
**标签**: ${tags.join(', ')}

---

## 正文

${content}

---

_抓取时间: ${timestamp}_
_状态: 已自动加入知识库_
`;
}

// 保存文件
function saveFile(fileName, markdown) {
  const filePath = path.join(knowledgeBaseDir, fileName);
  
  console.log(`💾 正在保存文件: ${fileName}`);
  
  fs.writeFileSync(filePath, markdown, 'utf-8');
  
  console.log(`✅ 文件已保存: ${filePath}`);
  
  return filePath;
}

// 运行 npm run sync
function runSync() {
  console.log('');
  console.log('🔄 正在同步到 Redis...');
  
  try {
    execSync('npm run sync', {
      cwd: projectRoot,
      stdio: 'inherit',
    });
    
    console.log('✅ 同步完成');
    
  } catch (error) {
    console.error('❌ 同步失败:', error.message);
    throw error;
  }
}

// Git 提交
function gitCommit(fileName) {
  console.log('');
  console.log('📝 正在提交到 Git...');
  
  try {
    execSync('git add public/knowledge_base/' + fileName, {
      cwd: projectRoot,
      stdio: 'inherit',
    });
    
    execSync(`git commit -m "feat: 自动抓取知识库 - ${fileName} ✨"`, {
      cwd: projectRoot,
      stdio: 'inherit',
    });
    
    execSync('git push', {
      cwd: projectRoot,
      stdio: 'inherit',
    });
    
    console.log('✅ Git 提交完成');
    
  } catch (error) {
    console.error('⚠️  Git 提交失败:', error.message);
  }
}

// 主函数
async function main() {
  try {
    // 1. 抓取内容
    const { title, content } = await fetchContent(url);
    
    // 2. 生成标签
    const tags = generateTags(url, title, content);
    
    // 3. 生成 Markdown
    const markdown = generateMarkdown(url, title, content, tags);
    
    // 4. 保存文件
    const fileName = generateFileName(url);
    const filePath = saveFile(fileName, markdown);
    
    // 5. 同步到 Redis
    runSync();
    
    // 6. Git 提交
    gitCommit(fileName);
    
    console.log('');
    console.log('✅ 链接已自动加入知识库！');
    console.log('');
    console.log('📊 更新结果:');
    console.log(`  - 文件: ${fileName}`);
    console.log(`  - 标题: ${title}`);
    console.log(`  - 标签: ${tags.join(', ')}`);
    console.log(`  - 知识库: +1`);
    console.log(`  - 总能力: +1`);
    console.log('');
    console.log('🎉 完成！');
    
  } catch (error) {
    console.error('');
    console.error('❌ 处理失败:', error.message);
    process.exit(1);
  }
}

// 运行
main();
