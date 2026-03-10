#!/usr/bin/env node
/**
 * 化合物半导体封装分析器
 * 分析 HTCC、金属化、钎焊技术壁垒
 * 跟踪日本 Kyocera、NTK 和韩国 RF머트리얼즈 市场份额动态
 * 识别技术壁垒带来的投资机会
 */

const https = require('https');

// API Keys
const NEWS_API_KEY = '332b7388f0fb42a9bf05d06a89fc10c9';
const FINNHUB_API_KEY = 'd61gv49r01qufbsn7v90d61gv49r01qufbsn7v9g';

// 封装技术壁垒
const PACKAGING_TECHNOLOGIES = [
  {
    name: 'HTCC（高温同时烧结陶瓷）',
    description: '1500℃以上高温烧结，精确匹配热膨胀系数',
    barrier: '极高',
    players: ['Kyocera', 'NTK', 'RF머트리얼즈'],
    marketShare: {
      'Kyocera': '40%',
      'NTK': '30%',
      'RF머트리얼즈': '5%（快速增长）',
    },
  },
  {
    name: '金属化（Metallizing）',
    description: '陶瓷表面特殊金属浆料处理',
    barrier: '高',
    players: ['Kyocera', 'NTK', 'RF머트리얼즈', 'Coherent'],
    marketShare: {
      'Kyocera': '35%',
      'NTK': '25%',
      'RF머트리얼즈': '8%',
    },
  },
  {
    name: '钎焊（Brazing）',
    description: '真空环境下陶瓷-金属完美接合',
    barrier: '极高',
    players: ['Kyocera', 'NTK', 'RF머트리얼즈'],
    marketShare: {
      'Kyocera': '45%',
      'NTK': '35%',
      'RF머트리얼즈': '3%（技术突破）',
    },
  },
];

// 相关公司（非上市 + 上市）
const PACKAGING_COMPANIES = {
  nonPublic: [
    { name: 'Kyocera', country: 'Japan', marketShare: '40-45%' },
    { name: 'NTK', country: 'Japan', marketShare: '30-35%' },
    { name: 'RF머트리얼즈', country: 'Korea', marketShare: '5-8%' },
  ],
  public: [
    { symbol: 'COHR', name: 'Coherent', role: '激光器+封装', marketShare: '10%' },
  ],
};

// 搜索关键词
const PACKAGING_KEYWORDS = [
  'semiconductor packaging',
  'HTCC ceramic',
  'metallizing brazing',
  'Kyocera NTK',
  'compound semiconductor package',
  'hermetic seal',
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

// 获取上市公司股价
async function getPublicCompanies() {
  const stocks = [];
  
  for (const company of PACKAGING_COMPANIES.public) {
    try {
      const quote = await fetchFinnhub(`quote?symbol=${company.symbol}`);
      if (quote.c) {
        stocks.push({
          symbol: company.symbol,
          name: company.name,
          role: company.role,
          marketShare: company.marketShare,
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

// 获取封装技术新闻（NewsAPI）
async function getPackagingNews() {
  return new Promise((resolve, reject) => {
    const query = PACKAGING_KEYWORDS.join(' OR ');
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

// 分析技术壁垒
function analyzeTechnologyBarriers(news) {
  const insights = [];
  
  // 关键词映射
  const barrierKeywords = {
    'yield': '良率',
    'manufacturing': '制造工艺',
    'patent': '专利',
    'R&D': '研发',
    'breakthrough': '技术突破',
    'competition': '竞争',
  };
  
  for (const article of news) {
    const text = (article.title + ' ' + (article.description || '')).toLowerCase();
    
    // 识别技术壁垒相关关键词
    const matchedBarriers = [];
    for (const [keyword, barrier] of Object.entries(barrierKeywords)) {
      if (text.includes(keyword.toLowerCase())) {
        matchedBarriers.push(barrier);
      }
    }
    
    if (matchedBarriers.length > 0) {
      insights.push({
        title: article.title,
        barriers: matchedBarriers,
        url: article.url,
        publishedAt: article.publishedAt,
      });
    }
  }
  
  return insights;
}

// 分析市场份额动态
function analyzeMarketShareDynamics() {
  const dynamics = [];
  
  for (const tech of PACKAGING_TECHNOLOGIES) {
    // 计算集中度
    const shares = Object.values(tech.marketShare);
    const top2Share = shares.slice(0, 2).reduce((sum, share) => {
      return sum + parseFloat(share.replace('%', ''));
    }, 0);
    
    dynamics.push({
      technology: tech.name,
      barrier: tech.barrier,
      concentration: top2Share > 60 ? '高集中度' : '分散',
      topPlayers: Object.keys(tech.marketShare).slice(0, 2),
      opportunity: top2Share > 60 ? '新进入者机会大' : '竞争激烈',
    });
  }
  
  return dynamics;
}

// 识别投资机会
function identifyInvestmentOpportunities(dynamics, news) {
  const opportunities = [];
  
  // 1. 技术突破机会
  const breakthroughNews = news.filter(article => 
    (article.title + ' ' + (article.description || '')).toLowerCase().includes('breakthrough')
  );
  
  if (breakthroughNews.length > 0) {
    opportunities.push({
      type: '技术突破',
      opportunity: '韩国/中国公司技术突破，打破日本垄断',
      confidence: 'high',
      affectedStocks: ['RF머트리얼즈相关', '中国半导体封装公司'],
      timeline: '1-2年',
    });
  }
  
  // 2. 产能扩张机会
  const expansionNews = news.filter(article =>
    (article.title + ' ' + (article.description || '')).toLowerCase().includes('expansion') ||
    (article.title + ' ' + (article.description || '')).toLowerCase().includes('capacity')
  );
  
  if (expansionNews.length > 0) {
    opportunities.push({
      type: '产能扩张',
      opportunity: '需求增长驱动产能扩张，设备供应商受益',
      confidence: 'medium',
      affectedStocks: ['半导体设备公司', '材料供应商'],
      timeline: '6-12个月',
    });
  }
  
  // 3. 高壁垒带来的超额利润
  for (const dynamic of dynamics) {
    if (dynamic.barrier === '极高' && dynamic.concentration === '高集中度') {
      opportunities.push({
        type: '高壁垒超额利润',
        opportunity: `${dynamic.technology}壁垒极高，龙头享受超额利润`,
        confidence: 'high',
        affectedStocks: dynamic.topPlayers,
        timeline: '长期',
      });
    }
  }
  
  return opportunities;
}

// 主函数
async function main() {
  console.log('🌸 花卷化合物半导体封装分析器');
  console.log('================================\n');
  
  // 1. 显示技术壁垒信息
  console.log('📊 步骤1：封装技术壁垒分析...');
  console.log('');
  
  for (const tech of PACKAGING_TECHNOLOGIES) {
    console.log(`🔧 ${tech.name}`);
    console.log(`   描述: ${tech.description}`);
    console.log(`   壁垒: ${tech.barrier}`);
    console.log(`   主要玩家: ${tech.players.join(', ')}`);
    console.log('');
  }
  
  // 2. 获取市场新闻
  console.log('📰 步骤2：获取封装技术新闻...');
  const news = await getPackagingNews();
  console.log(`✅ 找到 ${news.length} 条新闻\n`);
  
  if (news.length > 0) {
    console.log('最新新闻:');
    for (const article of news.slice(0, 3)) {
      console.log(`  - ${article.title}`);
      console.log(`    来源: ${article.source?.name || 'Unknown'}`);
      console.log('');
    }
  }
  
  // 3. 分析市场份额动态
  console.log('🔍 步骤3：分析市场份额动态...');
  const dynamics = analyzeMarketShareDynamics();
  console.log(`✅ 分析 ${dynamics.length} 项技术\n`);
  
  if (dynamics.length > 0) {
    console.log('市场动态:');
    for (const dynamic of dynamics) {
      console.log(`  📊 ${dynamic.technology}`);
      console.log(`     壁垒: ${dynamic.barrier}`);
      console.log(`     集中度: ${dynamic.concentration}`);
      console.log(`     机会: ${dynamic.opportunity}`);
      console.log('');
    }
  }
  
  // 4. 识别投资机会
  console.log('💡 步骤4：识别投资机会...');
  const opportunities = identifyInvestmentOpportunities(dynamics, news);
  console.log(`✅ 识别到 ${opportunities.length} 个投资机会\n`);
  
  if (opportunities.length > 0) {
    console.log('投资机会:');
    for (const opp of opportunities) {
      console.log(`  🎯 [${opp.type}] ${opp.opportunity}`);
      console.log(`     信心度: ${opp.confidence}`);
      console.log(`     受益标的: ${opp.affectedStocks.join(', ')}`);
      console.log(`     时间线: ${opp.timeline}`);
      console.log('');
    }
  }
  
  console.log('✅ 化合物半导体封装分析完成！');
}

main().catch(console.error);
