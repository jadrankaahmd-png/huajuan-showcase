/**
 * 网页内容清洗工具
 * 使用 Jina Reader API (r.jina.ai) 清洗网页正文
 * 去除广告和无关内容，返回干净的文章文字
 */

const https = require('https');
const http = require('http');

/**
 * 使用 Jina Reader API 清洗网页内容
 * @param {string} url - 原始网页 URL
 * @returns {Promise<{title: string, content: string, url: string}>}
 */
async function cleanWebPage(url) {
  const jinaUrl = `https://r.jina.ai/${url}`;
  
  return new Promise((resolve, reject) => {
    https.get(jinaUrl, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        // 处理重定向
        cleanWebPage(response.headers.location).then(resolve).catch(reject);
        return;
      }
      
      if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode}`));
        return;
      }
      
      let data = '';
      response.on('data', (chunk) => { data += chunk; });
      response.on('end', () => {
        // 解析返回的 Markdown 内容
        const lines = data.split('\n');
        let title = '';
        let contentStart = 0;
        
        // 查找标题
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].startsWith('Title:')) {
            title = lines[i].replace('Title:', '').trim();
            contentStart = i + 1;
            break;
          }
        }
        
        // 跳过元数据部分
        let content = '';
        let inContent = false;
        for (let i = contentStart; i < lines.length; i++) {
          if (lines[i].startsWith('Markdown Content:')) {
            inContent = true;
            continue;
          }
          if (inContent) {
            content += lines[i] + '\n';
          }
        }
        
        // 如果没有找到标准格式，直接返回全部内容
        if (!content) {
          content = data;
        }
        
        resolve({
          title: title || 'Untitled',
          content: content.trim(),
          url: url,
        });
      });
      response.on('error', reject);
    }).on('error', reject);
  });
}

/**
 * 使用 Defuddle 清洗网页内容（备用方案）
 * @param {string} url - 原始网页 URL
 * @returns {Promise<{title: string, content: string, url: string}>}
 */
async function cleanWebPageDefuddle(url) {
  const defuddleUrl = `https://defuddle.md/${url}`;
  
  return new Promise((resolve, reject) => {
    https.get(defuddleUrl, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        cleanWebPageDefuddle(response.headers.location).then(resolve).catch(reject);
        return;
      }
      
      if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode}`));
        return;
      }
      
      let data = '';
      response.on('data', (chunk) => { data += chunk; });
      response.on('end', () => {
        resolve({
          title: 'Web Page',
          content: data,
          url: url,
        });
      });
      response.on('error', reject);
    }).on('error', reject);
  });
}

/**
 * 智能清洗网页内容（优先 Jina，失败则尝试 Defuddle）
 * @param {string} url - 原始网页 URL
 * @returns {Promise<{title: string, content: string, url: string, method: string}>}
 */
async function smartCleanWebPage(url) {
  // 优先使用 Jina Reader
  try {
    const result = await cleanWebPage(url);
    return { ...result, method: 'jina' };
  } catch (e) {
    console.log(`⚠️  Jina Reader 失败: ${e.message}`);
    console.log('🔄 尝试 Defuddle...');
    
    // 备用：Defuddle
    try {
      const result = await cleanWebPageDefuddle(url);
      return { ...result, method: 'defuddle' };
    } catch (e2) {
      throw new Error(`两种方法都失败: Jina (${e.message}), Defuddle (${e2.message})`);
    }
  }
}

module.exports = {
  cleanWebPage,
  cleanWebPageDefuddle,
  smartCleanWebPage,
};
