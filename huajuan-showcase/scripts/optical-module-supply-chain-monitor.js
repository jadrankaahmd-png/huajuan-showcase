#!/usr/bin/env node
/**
 * 光模块供应链监控器
 * 实时监控 Lumentum（LITE）、Coherent（COHR）、Fabrinet（FN）股价和新闻
 * 跟踪 AI 数据中心光模块需求动态
 * 识别订单拐点信号
 */

const https = require('https');

// API Keys
const NEWS_API_KEY = '332b7388f0fb42a9bf05d06a89fc10c9';
const FINNHUB_API_KEY = 'd61gv49r01qufbsn7v90d61gv49r01qufbsn7v9g';

// 光模块供应链核心公司
const OPTICAL_COMPANIES = [
  { symbol: 'LITE', name: 'Lumentum', role: '光模块龙头' },
  { symbol: 'COHR', name: 'Coherent', role: '激光器龙头' },
  { symbol: 'FN', name: 'Fabrinet', role: '光模块代工龙头' },
];

// NewsAPI 搜索关键词
const OPTICAL_KEYWORDS = [
  'optical transceiver',
  'data center optical',
  'Lumentum',
  'AI networking',
  '400G 800G',
];

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

// 获取股价数据
async function getStockPrices() {
  const prices = [];
  
  for (const company of OPTICAL_COMPANIES) {
    try {
      const quote = await fetchFinnhub(`quote?symbol=${company.symbol}`);
      if (quote.c) {
        prices.push({
          symbol: company.symbol,
          name: company.name,
          role: company.role,
          price: quote.c,
          change: quote.d,
          changePercent: quote.dp,
          high: quote.h,
          low: quote.l,
          open: quote.o,
          previousClose: quote.pc,
        });
      }
    } catch (e) {
      console.log(`⚠️  ${company.symbol} 股价获取失败:`, e.message);
    }
  }
  
  return prices;
}

// 获取公司新闻
async function getCompanyNews(symbol, days = 7) {
  const endDate = new Date().toISOString().split('T')[0];
  const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  
  return new Promise((resolve, reject) => {
    const url = `https://finnhub.io/api/v1/company-news?symbol=${symbol}&from=${startDate}&to=${endDate}&token=${FINNHUB_API_KEY}`;
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const news = JSON.parse(data);
          resolve(news.slice(0, 5)); // 最近5条
        } catch (e) {
          resolve([]);
        }
      });
    }).on('error', () => resolve([]));
  });
}

// 获取行业新闻（NewsAPI）
async function getIndustryNews() {
  return new Promise((resolve, reject) => {
    const query = OPTICAL_KEYWORDS.join(' OR ');
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

// 分析订单拐点信号
function analyzeOrderSignals(prices, news) {
  const signals = [];
  
  // 1. 股价涨幅分析
  for (const price of prices) {
    if (price.changePercent > 5) {
      signals.push({
        type: 'price_surge',
        company: price.symbol,
        signal: `${price.symbol} 单日涨幅 ${price.changePercent.toFixed(2)}%`,
        strength: 'strong',
        impact: '可能存在订单利好消息',
      });
    }
  }
  
  // 2. 新闻关键词分析
  const orderKeywords = ['order', 'contract', 'demand', 'growth', 'AI data center', '400G', '800G'];
  
  for (const article of news) {
    const text = (article.title + ' ' + (article.description || '')).toLowerCase();
    const matchedKeywords = orderKeywords.filter(kw => text.includes(kw.toLowerCase()));
    
    if (matchedKeywords.length >= 2) {
      signals.push({
        type: 'news_signal',
        company: 'Industry',
        signal: article.title,
        strength: 'medium',
        impact: `关键词匹配: ${matchedKeywords.join(', ')}`,
        url: article.url,
      });
    }
  }
  
  return signals;
}

// 生成投资机会
function generateInvestmentOpportunities(prices, signals) {
  const opportunities = [];
  
  // 基于信号强度排序
  const strongSignals = signals.filter(s => s.strength === 'strong');
  
  if (strongSignals.length > 0) {
    for (const signal of strongSignals) {
      const company = prices.find(p => p.symbol === signal.company);
      if (company) {
        opportunities.push({
          company: company.symbol,
          name: company.name,
          role: company.role,
          opportunity: signal.impact,
          currentPrice: company.price,
          changePercent: company.changePercent,
          confidence: 'high',
        });
      }
    }
  }
  
  // 行业整体机会
  if (signals.length >= 3) {
    opportunities.push({
      company: 'Industry',
      name: '光模块供应链',
      role: '整体',
      opportunity: 'AI数据中心需求持续增长，多个信号确认行业景气度提升',
      confidence: 'medium',
    });
  }
  
  return opportunities;
}

// 主函数
async function main() {
  console.log('🌸 花卷光模块供应链监控器');
  console.log('============================\n');
  
  // 1. 获取股价数据
  console.log('📡 步骤1：获取光模块公司股价...');
  const prices = await getStockPrices();
  console.log(`✅ 获取 ${prices.length} 家公司股价\n`);
  
  if (prices.length > 0) {
    console.log('📊 股价数据:');
    for (const price of prices) {
      const changeIcon = price.changePercent >= 0 ? '📈' : '📉';
      console.log(`  ${changeIcon} ${price.symbol} (${price.name}): $${price.price.toFixed(2)} (${price.changePercent >= 0 ? '+' : ''}${price.changePercent.toFixed(2)}%)`);
    }
    console.log('');
  }
  
  // 2. 获取行业新闻
  console.log('📰 步骤2：获取行业新闻...');
  const industryNews = await getIndustryNews();
  console.log(`✅ 找到 ${industryNews.length} 条行业新闻\n`);
  
  if (industryNews.length > 0) {
    console.log('最新新闻:');
    for (const news of industryNews.slice(0, 3)) {
      console.log(`  - ${news.title}`);
      console.log(`    来源: ${news.source?.name || 'Unknown'}`);
      console.log('');
    }
  }
  
  // 3. 分析订单拐点信号
  console.log('🔍 步骤3：识别订单拐点信号...');
  const signals = analyzeOrderSignals(prices, industryNews);
  console.log(`✅ 识别到 ${signals.length} 个信号\n`);
  
  if (signals.length > 0) {
    console.log('信号详情:');
    for (const signal of signals) {
      console.log(`  ${signal.strength === 'strong' ? '🔴' : '🟡'} [${signal.type}] ${signal.company}: ${signal.signal}`);
      console.log(`     影响: ${signal.impact}\n`);
    }
  }
  
  // 4. 生成投资机会
  console.log('💡 步骤4：生成投资机会...');
  const opportunities = generateInvestmentOpportunities(prices, signals);
  console.log(`✅ 识别到 ${opportunities.length} 个投资机会\n`);
  
  if (opportunities.length > 0) {
    console.log('投资机会:');
    for (const opp of opportunities) {
      console.log(`  ${opp.confidence === 'high' ? '🎯' : '👀'} ${opp.company} (${opp.name})`);
      console.log(`     角色: ${opp.role}`);
      console.log(`     机会: ${opp.opportunity}`);
      if (opp.currentPrice) {
        console.log(`     当前价格: $${opp.currentPrice.toFixed(2)}`);
      }
      console.log('');
    }
  }
  
  console.log('✅ 光模块供应链监控完成！');
}

main().catch(console.error);
