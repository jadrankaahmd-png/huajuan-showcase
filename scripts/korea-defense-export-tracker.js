#!/usr/bin/env node
/**
 * K-防务出口跟踪器
 * 监控韩国防务公司（LIG NexOne、韩华防务等）中东/欧洲出口订单动态
 * 用 Jina Reader 抓取相关新闻
 * 分析对美股防务板块的联动影响（LMT、RTX、NOC）
 */

const https = require('https');

// API Keys
const NEWS_API_KEY = '332b7388f0fb42a9bf05d06a89fc10c9';
const FINNHUB_API_KEY = 'd61gv49r01qufbsn7v90d61gv49r01qufbsn7v9g';

// 韩国防务公司（非上市）
const KOREA_DEFENSE_COMPANIES = [
  { name: 'LIG NexOne', products: '雷达、导弹系统', exports: '中东、欧洲' },
  { name: 'Hanwha Defense', products: 'K9自行火炮、K2坦克', exports: '中东、亚洲' },
  { name: 'Korean Aerospace', products: 'KF-21战机', exports: '东南亚' },
];

// 美股防务板块标的
const US_DEFENSE_STOCKS = [
  { symbol: 'LMT', name: 'Lockheed Martin', role: '美国防务龙头' },
  { symbol: 'RTX', name: 'Raytheon Technologies', role: '导弹雷达巨头' },
  { symbol: 'NOC', name: 'Northrop Grumman', role: '国防承包商' },
];

// 搜索关键词
const KOREA_DEFENSE_KEYWORDS = [
  'Korea defense export',
  'LIG NexOne',
  'Hanwha Defense',
  'K9 howitzer',
  'Korean arms export',
  'Middle East defense',
];

// Jina Reader 清洗网页
function cleanWebPage(url) {
  return new Promise((resolve, reject) => {
    const jinaUrl = `https://r.jina.ai/${url}`;
    https.get(jinaUrl, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve(data);
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

// Finnhub API 调用
function fetchFinnhub(endpoint) {
  return new Promise((resolve, reject) => {
    const url = `https://finnhub.io/api/v1/${endpoint}&token=${FINNHUB_API_KEY}`;
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

// 获取美股防务公司股价
async function getUSDefenseStocks() {
  const stocks = [];
  
  for (const company of US_DEFENSE_STOCKS) {
    try {
      const quote = await fetchFinnhub(`quote?symbol=${company.symbol}`);
      if (quote.c) {
        stocks.push({
          symbol: company.symbol,
          name: company.name,
          role: company.role,
          price: quote.c,
          change: quote.d,
          changePercent: quote.dp,
        });
      }
    } catch (e) {
      console.log(`⚠️  ${company.symbol} 股价获取失败:`, e.message);
    }
  }
  
  return stocks;
}

// 获取韩国防务新闻（NewsAPI）
async function getKoreaDefenseNews() {
  return new Promise((resolve, reject) => {
    const query = KOREA_DEFENSE_KEYWORDS.join(' OR ');
    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&sortBy=publishedAt&pageSize=10&apiKey=${NEWS_API_KEY}`;
    
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          resolve(result.articles || []);
        } catch (e) {
          resolve([]);
        }
      });
    }).on('error', () => resolve([]));
  });
}

// 分析出口订单动态
function analyzeExportOrders(news) {
  const orders = [];
  
  // 关键词映射
  const productKeywords = {
    'K9': 'K9自行火炮',
    'K2': 'K2坦克',
    'KF-21': 'KF-21战机',
    'radar': '雷达系统',
    'missile': '导弹系统',
    'Cheongung': '天弓防空系统',
  };
  
  const regionKeywords = {
    'Middle East': '中东',
    'Saudi': '沙特',
    'UAE': '阿联酋',
    'Poland': '波兰',
    'Europe': '欧洲',
    'Asia': '亚洲',
  };
  
  for (const article of news) {
    const text = (article.title + ' ' + (article.description || '')).toLowerCase();
    
    // 识别产品
    const products = [];
    for (const [keyword, product] of Object.entries(productKeywords)) {
      if (text.includes(keyword.toLowerCase())) {
        products.push(product);
      }
    }
    
    // 识别地区
    const regions = [];
    for (const [keyword, region] of Object.entries(regionKeywords)) {
      if (text.includes(keyword.toLowerCase())) {
        regions.push(region);
      }
    }
    
    if (products.length > 0 || regions.length > 0) {
      orders.push({
        title: article.title,
        products: products,
        regions: regions,
        url: article.url,
        publishedAt: article.publishedAt,
      });
    }
  }
  
  return orders;
}

// 分析对美股防务板块的影响
function analyzeUSImpact(orders, usStocks) {
  const impacts = [];
  
  // 如果韩国出口订单增加 → 可能影响美股防务公司
  if (orders.length > 0) {
    // 1. 竞争影响（负面）
    impacts.push({
      type: 'competition',
      impact: '韩国防务出口增加可能对美国防务公司形成竞争压力',
      direction: 'negative',
      affectedStocks: usStocks.map(s => s.symbol),
      confidence: 'medium',
    });
    
    // 2. 地缘政治影响（正面）
    impacts.push({
      type: 'geopolitical',
      impact: '全球防务需求增长，美国和韩国防务公司都可能受益',
      direction: 'positive',
      affectedStocks: usStocks.map(s => s.symbol),
      confidence: 'low',
    });
    
    // 3. 具体产品影响
    for (const order of orders) {
      if (order.products.includes('K9自行火炮')) {
        impacts.push({
          type: 'product_competition',
          impact: 'K9出口可能影响美国自行火炮市场份额',
          direction: 'negative',
          affectedStocks: ['LMT', 'BA'], // Boeing也有火炮业务
          confidence: 'medium',
        });
      }
      
      if (order.products.includes('雷达系统')) {
        impacts.push({
          type: 'product_competition',
          impact: '韩国雷达出口可能影响Raytheon雷达业务',
          direction: 'negative',
          affectedStocks: ['RTX'],
          confidence: 'medium',
        });
      }
    }
  }
  
  return impacts;
}

// 主函数
async function main() {
  console.log('🌸 花卷K-防务出口跟踪器');
  console.log('========================\n');
  
  // 1. 获取美股防务公司股价
  console.log('📡 步骤1：获取美股防务公司股价...');
  const usStocks = await getUSDefenseStocks();
  console.log(`✅ 获取 ${usStocks.length} 家公司股价\n`);
  
  if (usStocks.length > 0) {
    console.log('📊 美股防务板块:');
    for (const stock of usStocks) {
      const changeIcon = stock.changePercent >= 0 ? '📈' : '📉';
      console.log(`  ${changeIcon} ${stock.symbol} (${stock.name}): $${stock.price.toFixed(2)} (${stock.changePercent >= 0 ? '+' : ''}${stock.changePercent.toFixed(2)}%)`);
    }
    console.log('');
  }
  
  // 2. 获取韩国防务新闻
  console.log('📰 步骤2：获取韩国防务出口新闻...');
  const news = await getKoreaDefenseNews();
  console.log(`✅ 找到 ${news.length} 条新闻\n`);
  
  if (news.length > 0) {
    console.log('最新新闻:');
    for (const article of news.slice(0, 3)) {
      console.log(`  - ${article.title}`);
      console.log(`    来源: ${article.source?.name || 'Unknown'}`);
      console.log('');
    }
  }
  
  // 3. 分析出口订单动态
  console.log('🔍 步骤3：分析出口订单动态...');
  const orders = analyzeExportOrders(news);
  console.log(`✅ 识别到 ${orders.length} 个订单信号\n`);
  
  if (orders.length > 0) {
    console.log('订单详情:');
    for (const order of orders) {
      console.log(`  📦 ${order.title}`);
      if (order.products.length > 0) {
        console.log(`     产品: ${order.products.join(', ')}`);
      }
      if (order.regions.length > 0) {
        console.log(`     地区: ${order.regions.join(', ')}`);
      }
      console.log('');
    }
  }
  
  // 4. 分析对美股影响
  console.log('💡 步骤4：分析对美股防务板块影响...');
  const impacts = analyzeUSImpact(orders, usStocks);
  console.log(`✅ 识别到 ${impacts.length} 个影响\n`);
  
  if (impacts.length > 0) {
    console.log('影响分析:');
    for (const impact of impacts) {
      const directionIcon = impact.direction === 'positive' ? '🟢' : '🔴';
      console.log(`  ${directionIcon} [${impact.type}] ${impact.impact}`);
      console.log(`     影响股票: ${impact.affectedStocks.join(', ')}`);
      console.log(`     信心度: ${impact.confidence}`);
      console.log('');
    }
  }
  
  console.log('✅ K-防务出口跟踪完成！');
}

main().catch(console.error);
