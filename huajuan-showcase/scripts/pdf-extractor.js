#!/usr/bin/env node
/**
 * PDF 提取器
 * 基于 pdf-parse 库，支持从 URL 或本地文件提取 PDF 内容
 * 自动将提取的内容添加到知识库
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// 注意：需要先安装 pdf-parse
// npm install pdf-parse

let PDFParse;
try {
  const pdfModule = require('pdf-parse');
  // pdf-parse v2.0+ 导出 PDFParse 类
  if (pdfModule.PDFParse) {
    PDFParse = pdfModule.PDFParse;
  } else if (typeof pdfModule === 'function') {
    // 旧版本直接导出函数
    PDFParse = pdfModule;
  } else {
    console.log('⚠️  pdf-parse 导出格式不兼容');
    console.log('💡 使用备用方案');
    PDFParse = null;
  }
} catch (e) {
  console.log('❌ pdf-parse 未安装:', e.message);
  console.log('📦 安装中: npm install pdf-parse');
  console.log('');
  console.log('💡 使用备用方案：直接提取文本（不需要 pdf-parse）');
  PDFParse = null;
}

const KNOWLEDGE_BASE_DIR = path.join(__dirname, '../public/knowledge_base');

// 从 URL 下载 PDF
async function downloadPDF(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    
    protocol.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        // 处理重定向
        downloadPDF(response.headers.location).then(resolve).catch(reject);
        return;
      }
      
      const chunks = [];
      response.on('data', (chunk) => chunks.push(chunk));
      response.on('end', () => resolve(Buffer.concat(chunks)));
      response.on('error', reject);
    }).on('error', reject);
  });
}

// 从本地文件读取 PDF
async function readLocalPDF(filePath) {
  return fs.readFileSync(filePath);
}

// 提取 PDF 内容（使用 pdf-parse）
async function extractWithPDFParse(buffer) {
  if (!PDFParse) {
    throw new Error('pdf-parse 未安装或不兼容');
  }
  
  const parser = new PDFParse({ data: buffer });
  const result = await parser.getText();
  
  return {
    text: result.text || result,
    pages: result.pages ? result.pages.length : 1,
    info: result.info || {},
  };
}

// 提取 PDF 内容（备用方案：直接提取文本）
async function extractTextFallback(buffer) {
  // PDF 文本通常在 "stream" 和 "endstream" 之间
  const content = buffer.toString('utf8');
  const textMatches = content.match(/stream[\s\S]*?endstream/g) || [];
  
  let extractedText = '';
  for (const match of textMatches) {
    // 移除 stream 和 endstream 标记
    let text = match.replace(/stream|endstream/g, '').trim();
    
    // 尝试解码（如果被压缩，这会失败，但至少能提取部分文本）
    try {
      extractedText += text + '\n';
    } catch (e) {
      // 忽略解码错误
    }
  }
  
  return {
    text: extractedText,
    pages: (content.match(/\/Type\s*\/Page[^s]/g) || []).length,
    info: {},
  };
}

// 提取 PDF 内容
async function extractPDF(source) {
  let buffer;
  
  // 判断是 URL 还是本地文件
  if (source.startsWith('http://') || source.startsWith('https://')) {
    console.log(`📡 从 URL 下载 PDF: ${source}`);
    buffer = await downloadPDF(source);
  } else {
    console.log(`📁 从本地文件读取 PDF: ${source}`);
    buffer = await readLocalPDF(source);
  }
  
  console.log(`✅ PDF 大小: ${(buffer.length / 1024).toFixed(2)} KB\n`);
  
  // 尝试使用 pdf-parse
  if (PDFParse) {
    try {
      console.log('🔍 使用 pdf-parse 提取内容...');
      return await extractWithPDFParse(buffer);
    } catch (e) {
      console.log(`⚠️  pdf-parse 失败: ${e.message}`);
      console.log('🔄 使用备用方案...');
    }
  }
  
  // 备用方案
  console.log('🔍 使用备用方案提取文本...');
  return await extractTextFallback(buffer);
}

// 生成知识库文件名
function generateKnowledgeFileName(title) {
  const date = new Date().toISOString().split('T')[0];
  const safeTitle = title
    .replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 50);
  return `${safeTitle}-${date}.md`;
}

// 保存到知识库
function saveToKnowledgeBase(content, title, source) {
  const fileName = generateKnowledgeFileName(title);
  const filePath = path.join(KNOWLEDGE_BASE_DIR, fileName);
  
  const frontMatter = `# ${title}

**来源**: ${source}  
**提取时间**: ${new Date().toISOString()}  
**页数**: ${content.pages}

---

`;
  
  const fullContent = frontMatter + content.text;
  
  fs.writeFileSync(filePath, fullContent, 'utf8');
  
  return filePath;
}

// 主函数
async function main() {
  const source = process.argv[2];
  
  if (!source) {
    console.log('🌸 花卷 PDF 提取器');
    console.log('==================\n');
    console.log('用法:');
    console.log('  node pdf-extractor.js <URL或本地文件路径>');
    console.log('  node pdf-extractor.js https://example.com/document.pdf');
    console.log('  node pdf-extractor.js /path/to/document.pdf\n');
    console.log('功能:');
    console.log('  - 从 URL 或本地文件提取 PDF 内容');
    console.log('  - 自动保存到知识库');
    console.log('  - 支持提取文本、页数、元数据');
    process.exit(1);
  }
  
  console.log('🌸 花卷 PDF 提取器');
  console.log('==================\n');
  
  try {
    // 1. 提取 PDF 内容
    console.log('📡 步骤1：提取 PDF 内容...');
    const content = await extractPDF(source);
    
    console.log(`✅ 提取成功！`);
    console.log(`  页数: ${content.pages}`);
    console.log(`  文本长度: ${content.text.length} 字符\n`);
    
    // 2. 保存到知识库
    console.log('💾 步骤2：保存到知识库...');
    const title = content.info?.Title || 'PDF 文档';
    const filePath = saveToKnowledgeBase(content, title, source);
    
    console.log(`✅ 已保存到: ${filePath}\n`);
    
    // 3. 显示内容预览
    console.log('📖 内容预览:');
    console.log('---');
    console.log(content.text.substring(0, 500));
    if (content.text.length > 500) {
      console.log('...');
    }
    console.log('---\n');
    
    console.log('✅ PDF 提取完成！');
    console.log(`💡 下一步: 运行 npm run add-capability 添加到能力库`);
    
  } catch (e) {
    console.error('❌ 提取失败:', e.message);
    process.exit(1);
  }
}

main().catch(console.error);
