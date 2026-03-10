#!/usr/bin/env node

/**
 * 🌸 花卷高级 MCP 模式
 * 
 * 功能：
 * 1. 智能知识采样机制
 * 2. 实时价格预警通知（推送到 Telegram）
 * 3. 主动通知推送
 */

const { Redis } = require('@upstash/redis');
const https = require('https');

// Redis 配置
const redis = new Redis({
  url: 'https://valued-hamster-37498.upstash.io',
  token: 'AZJ6AAIncDE1YzRlYzY3NzI5OTU0MWIzOTM5YzNjMWE2NDkzMTkyZHAxMzc0OTg',
});

// Telegram 配置（从环境变量读取）
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || 'YOUR_BOT_TOKEN';
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || 'YOUR_CHAT_ID';

// 日志
function log(message) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`);
}

// ========== 功能1：智能知识采样 ==========

/**
 * 智能采样知识库
 * @param {string} query - 查询关键词
 * @param {number} sampleSize - 采样大小
 * @returns {Array} 采样结果
 */
async function sampleKnowledge(query, sampleSize = 5) {
  log(`📖 智能知识采样: "${query}"`);
  
  try {
    // 获取所有知识条目
    const knowledge = await redis.get('knowledge:items');
    
    if (!knowledge || knowledge.length === 0) {
      log('   ⚠️  知识库为空');
      return [];
    }
    
    // 1. 关键词匹配
    const matched = knowledge.filter(item => 
      item.title?.toLowerCase().includes(query.toLowerCase()) ||
      item.content?.toLowerCase().includes(query.toLowerCase()) ||
      (item.tags && item.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase())))
    );
    
    log(`   📊 关键词匹配: ${matched.length} 个`);
    
    // 2. 相关性排序（基于关键词出现频率）
    const scored = matched.map(item => {
      let score = 0;
      const lowerQuery = query.toLowerCase();
      
      // 标题匹配（权重：3）
      if (item.title?.toLowerCase().includes(lowerQuery)) {
        score += 3;
      }
      
      // 标签匹配（权重：2）
      if (item.tags && item.tags.some(tag => tag.toLowerCase().includes(lowerQuery))) {
        score += 2;
      }
      
      // 内容匹配（权重：1，按出现次数）
      const contentMatches = (item.content?.toLowerCase().match(new RegExp(lowerQuery, 'g')) || []).length;
      score += Math.min(contentMatches, 5); // 最多5分
      
      return { ...item, score };
    });
    
    // 3. 按相关性排序
    scored.sort((a, b) => b.score - a.score);
    
    // 4. 采样（取前N个）
    const sampled = scored.slice(0, sampleSize);
    
    log(`   ✅ 采样完成: ${sampled.length} 个条目`);
    
    return sampled;
    
  } catch (error) {
    log(`   ❌ 采样失败: ${error.message}`);
    return [];
  }
}

// ========== 功能2：实时价格预警 ==========

/**
 * 设置价格预警
 * @param {string} ticker - 股票代码
 * @param {number} targetPrice - 目标价格
 * @param {string} condition - 条件（above/below）
 */
async function setPriceAlert(ticker, targetPrice, condition = 'above') {
  log(`🔔 设置价格预警: ${ticker} ${condition} $${targetPrice}`);
  
  const alert = {
    ticker: ticker.toUpperCase(),
    targetPrice,
    condition,
    createdAt: new Date().toISOString(),
    status: 'active',
  };
  
  // 保存到 Redis
  const alerts = await redis.get('price:alerts') || [];
  alerts.push(alert);
  await redis.set('price:alerts', alerts);
  
  log(`   ✅ 预警已设置`);
  
  return alert;
}

/**
 * 检查价格预警
 */
async function checkPriceAlerts() {
  log('🔍 检查价格预警...');
  
  try {
    const alerts = await redis.get('price:alerts') || [];
    
    if (alerts.length === 0) {
      log('   ⏳ 无活跃预警');
      return;
    }
    
    for (const alert of alerts) {
      if (alert.status !== 'active') continue;
      
      // 获取当前价格（这里使用模拟数据）
      const currentPrice = await getCurrentPrice(alert.ticker);
      
      // 检查条件
      let triggered = false;
      
      if (alert.condition === 'above' && currentPrice >= alert.targetPrice) {
        triggered = true;
      } else if (alert.condition === 'below' && currentPrice <= alert.targetPrice) {
        triggered = true;
      }
      
      if (triggered) {
        log(`   🚨 预警触发: ${alert.ticker} 当前价格 $${currentPrice}`);
        
        // 发送 Telegram 通知
        const message = `🚨 价格预警触发！\n\n股票：${alert.ticker}\n目标：$${alert.targetPrice}\n当前：$${currentPrice}\n条件：${alert.condition}`;
        
        await sendTelegramNotification(message);
        
        // 标记为已触发
        alert.status = 'triggered';
        alert.triggeredAt = new Date().toISOString();
        alert.triggeredPrice = currentPrice;
      }
    }
    
    // 更新 Redis
    await redis.set('price:alerts', alerts);
    
    log('   ✅ 预警检查完成');
    
  } catch (error) {
    log(`   ❌ 检查失败: ${error.message}`);
  }
}

/**
 * 获取当前价格（模拟）
 */
async function getCurrentPrice(ticker) {
  // 这里应该接入真实的股票 API
  // 暂时返回模拟数据
  const mockPrices = {
    'AAPL': 150.25,
    'NVDA': 875.50,
    'MSFT': 415.30,
    'GOOGL': 142.80,
  };
  
  return mockPrices[ticker] || 100.00;
}

// ========== 功能3：主动通知推送 ==========

/**
 * 发送 Telegram 通知
 * @param {string} message - 消息内容
 */
async function sendTelegramNotification(message) {
  log('📱 发送 Telegram 通知...');
  
  try {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    
    const data = JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
      parse_mode: 'Markdown',
    });
    
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
      },
    };
    
    return new Promise((resolve, reject) => {
      const req = https.request(url, options, (res) => {
        let body = '';
        
        res.on('data', (chunk) => {
          body += chunk;
        });
        
        res.on('end', () => {
          if (res.statusCode === 200) {
            log('   ✅ 通知已发送');
            resolve(body);
          } else {
            log(`   ❌ 发送失败: ${res.statusCode}`);
            reject(new Error(`HTTP ${res.statusCode}`));
          }
        });
      });
      
      req.on('error', (error) => {
        log(`   ❌ 发送失败: ${error.message}`);
        reject(error);
      });
      
      req.write(data);
      req.end();
    });
    
  } catch (error) {
    log(`   ❌ 发送失败: ${error.message}`);
    throw error;
  }
}

/**
 * 主动推送每日摘要
 */
async function pushDailySummary() {
  log('📊 推送每日摘要...');
  
  try {
    // 获取统计数据
    const stats = await redis.get('stats:total');
    
    const message = `🌸 花卷每日摘要\n\n` +
      `📊 能力统计：\n` +
      `• 主能力：${stats.mainCapabilities}\n` +
      `• 自定义能力：${stats.customCapabilities}\n` +
      `• 知识库：${stats.knowledge + stats.books}\n` +
      `• 总计：${stats.grandTotal}\n\n` +
      `⏰ 更新时间：${new Date().toLocaleString('zh-CN')}`;
    
    await sendTelegramNotification(message);
    
    log('   ✅ 每日摘要已推送');
    
  } catch (error) {
    log(`   ❌ 推送失败: ${error.message}`);
  }
}

// ========== 主函数 ==========

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  log('');
  log('🌸 花卷高级 MCP 模式');
  log('==================');
  log('');
  
  switch (command) {
    case 'sample':
      const query = args[1] || 'HBM4';
      const size = parseInt(args[2]) || 5;
      await sampleKnowledge(query, size);
      break;
      
    case 'alert':
      const ticker = args[1] || 'NVDA';
      const price = parseFloat(args[2]) || 900;
      const condition = args[3] || 'above';
      await setPriceAlert(ticker, price, condition);
      break;
      
    case 'check-alerts':
      await checkPriceAlerts();
      break;
      
    case 'push-summary':
      await pushDailySummary();
      break;
      
    default:
      log('用法：');
      log('  node advanced-mcp.js sample <query> <size>');
      log('  node advanced-mcp.js alert <ticker> <price> <condition>');
      log('  node advanced-mcp.js check-alerts');
      log('  node advanced-mcp.js push-summary');
  }
  
  log('');
}

// 运行
if (require.main === module) {
  main().catch((error) => {
    log(`❌ 运行失败: ${error.message}`);
    process.exit(1);
  });
}

module.exports = {
  sampleKnowledge,
  setPriceAlert,
  checkPriceAlerts,
  sendTelegramNotification,
  pushDailySummary,
};
