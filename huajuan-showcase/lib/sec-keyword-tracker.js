/**
 * SEC 文件关键词追踪器
 * 基于 Financial Datasets API
 * 追踪 SEC 文件中关键词出现频率
 */

const FINANCIAL_DATASETS_API_KEY = process.env.FINANCIAL_DATASETS_API_KEY;

// Financial Datasets API 调用
async function fetchSECData(endpoint, params) {
  const url = new URL(`https://api.financialdatasets.ai/${endpoint}`);
  Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
  
  const response = await fetch(url, {
    headers: {
      'X-API-Key': FINANCIAL_DATASETS_API_KEY,
    },
  });
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }
  
  return response.json();
}

// 搜索 SEC 文件
async function searchSECFilings(ticker, filingType, query, years = 5) {
  return fetchSECData('sec-filings/search', {
    ticker,
    filing_type: filingType,
    query,
    limit: years,
  });
}

// 分析关键词趋势
function analyzeKeywordTrend(filings, keyword) {
  const trend = [];
  
  filings.forEach(filing => {
    const keywordRegex = new RegExp(keyword, 'gi');
    const matches = filing.content.match(keywordRegex);
    const count = matches ? matches.length : 0;
    
    trend.push({
      year: filing.fiscal_year,
      date: filing.filing_date,
      count,
      type: filing.filing_type,
    });
  });
  
  return trend;
}

// 主函数
export async function trackKeyword(ticker, keyword, filingType = '10-K', years = 5) {
  console.log(`🌸 花卷SEC文件关键词追踪器`);
  console.log(`==============================\n`);
  console.log(`📊 追踪股票：${ticker}`);
  console.log(`🔍 关键词："${keyword}"`);
  console.log(`📄 文件类型：${filingType}\n`);
  
  try {
    // 搜索 SEC 文件
    console.log(`📡 搜索 SEC 文件...`);
    const filings = await searchSECFilings(ticker, filingType, keyword, years);
    console.log(`✅ 找到 ${filings.length} 个文件\n`);
    
    // 分析关键词趋势
    console.log(`🔍 分析关键词出现频率...`);
    const trend = analyzeKeywordTrend(filings, keyword);
    
    // 输出结果
    console.log(`\n📊 "${keyword}" 关键词趋势：\n`);
    
    trend.forEach(item => {
      const bar = '█'.repeat(Math.min(item.count / 10, 20));
      console.log(`${item.year} (${item.type}): ${bar} ${item.count}次`);
    });
    
    // 计算总出现次数
    const totalCount = trend.reduce((sum, item) => sum + item.count, 0);
    console.log(`\n📈 总计：${totalCount} 次出现`);
    
    // 识别趋势方向
    if (trend.length >= 2) {
      const recent = trend[0].count;
      const previous = trend[1].count;
      const change = ((recent - previous) / previous) * 100;
      
      if (change > 20) {
        console.log(`\n🚀 趋势：快速增长 (+${change.toFixed(2)}%)`);
      } else if (change < -20) {
        console.log(`\n📉 趋势：快速下降 (${change.toFixed(2)}%)`);
      } else {
        console.log(`\n➡️  趋势：稳定 (${change > 0 ? '+' : ''}${change.toFixed(2)}%)`);
      }
    }
    
    console.log(`\n✅ 追踪完成！`);
    
    return {
      ticker,
      keyword,
      filingType,
      trend,
      totalCount,
    };
  } catch (error) {
    console.error(`❌ 追踪失败：`, error.message);
    throw error;
  }
}

// 如果直接运行
if (require.main === module) {
  const ticker = process.argv[2] || 'NVDA';
  const keyword = process.argv[3] || 'AI';
  const filingType = process.argv[4] || '10-K';
  
  trackKeyword(ticker, keyword, filingType).catch(console.error);
}
