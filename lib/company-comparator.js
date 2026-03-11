/**
 * 公司对比分析器
 * 基于 Financial Datasets API
 * 自动对比多家公司财务表现
 */

const FINANCIAL_DATASETS_API_KEY = process.env.FINANCIAL_DATASETS_API_KEY;

// Financial Datasets API 调用
async function fetchFinancialData(endpoint, params) {
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

// 获取公司数据
async function getCompanyData(ticker) {
  const [incomeStatements, balanceSheets] = await Promise.all([
    fetchFinancialData('income-statements', { ticker, period: 'annual', limit: 1 }),
    fetchFinancialData('balance-sheets', { ticker, period: 'annual', limit: 1 }),
  ]);
  
  return {
    ticker,
    revenue: incomeStatements[0]?.revenue || 0,
    netIncome: incomeStatements[0]?.net_income || 0,
    grossProfit: incomeStatements[0]?.gross_profit || 0,
    shareholdersEquity: balanceSheets[0]?.shareholders_equity || 0,
  };
}

// 计算对比指标
function calculateComparisonMetrics(companies) {
  return companies.map(company => {
    const revenueGrowth = companies.length > 1 
      ? ((company.revenue - companies[companies.length - 1].revenue) / companies[companies.length - 1].revenue) * 100
      : 0;
    
    return {
      ticker: company.ticker,
      revenue: company.revenue,
      revenueGrowth: revenueGrowth,
      grossMargin: (company.grossProfit / company.revenue) * 100,
      netMargin: (company.netIncome / company.revenue) * 100,
      roe: (company.netIncome / company.shareholdersEquity) * 100,
    };
  });
}

// 主函数
export async function compareCompanies(tickers) {
  console.log(`🌸 花卷公司对比分析器`);
  console.log(`========================\n`);
  console.log(`📊 对比股票：${tickers.join(' vs ')}\n`);
  
  try {
    // 获取所有公司数据
    console.log(`📡 获取公司数据...`);
    const companies = await Promise.all(tickers.map(getCompanyData));
    console.log(`✅ 获取成功！\n`);
    
    // 计算对比指标
    console.log(`🔍 计算对比指标...`);
    const comparison = calculateComparisonMetrics(companies);
    
    // 输出结果
    console.log(`\n📊 公司对比分析：\n`);
    
    console.log(`💰 收入规模：`);
    comparison.forEach(item => {
      console.log(`   ${item.ticker}: $${(item.revenue / 1e9).toFixed(2)}B`);
    });
    
    console.log(`\n📈 增长率：`);
    comparison.forEach(item => {
      console.log(`   ${item.ticker}: ${item.revenueGrowth.toFixed(2)}%`);
    });
    
    console.log(`\n💎 毛利率：`);
    comparison.forEach(item => {
      console.log(`   ${item.ticker}: ${item.grossMargin.toFixed(2)}%`);
    });
    
    console.log(`\n💵 净利率：`);
    comparison.forEach(item => {
      console.log(`   ${item.ticker}: ${item.netMargin.toFixed(2)}%`);
    });
    
    console.log(`\n📊 ROE：`);
    comparison.forEach(item => {
      console.log(`   ${item.ticker}: ${item.roe.toFixed(2)}%`);
    });
    
    console.log(`\n✅ 对比完成！`);
    
    return {
      tickers,
      comparison,
    };
  } catch (error) {
    console.error(`❌ 对比失败：`, error.message);
    throw error;
  }
}

// 如果直接运行
if (require.main === module) {
  const tickers = process.argv.slice(2);
  if (tickers.length < 2) {
    console.log('Usage: node company-comparator.js TICKER1 TICKER2 [TICKER3 ...]');
    process.exit(1);
  }
  compareCompanies(tickers).catch(console.error);
}
