/**
 * 财报快速扫描器
 * 基于 Financial Datasets API
 * 一键获取公司5年财报核心指标
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

// 获取损益表
async function getIncomeStatements(ticker, years = 5) {
  return fetchFinancialData('income-statements', {
    ticker,
    period: 'annual',
    limit: years,
  });
}

// 获取资产负债表
async function getBalanceSheets(ticker, years = 5) {
  return fetchFinancialData('balance-sheets', {
    ticker,
    period: 'annual',
    limit: years,
  });
}

// 获取现金流表
async function getCashFlowStatements(ticker, years = 5) {
  return fetchFinancialData('cash-flow-statements', {
    ticker,
    period: 'annual',
    limit: years,
  });
}

// 计算财务指标
function calculateMetrics(incomeStatements, balanceSheets, cashFlowStatements) {
  const metrics = {
    revenueGrowth: [],
    grossMargin: [],
    netMargin: [],
    freeCashFlow: [],
    roe: [],
  };
  
  for (let i = 0; i < incomeStatements.length; i++) {
    const income = incomeStatements[i];
    const balance = balanceSheets[i];
    const cashFlow = cashFlowStatements[i];
    
    // 收入增长率
    if (i < incomeStatements.length - 1) {
      const growth = ((income.revenue - incomeStatements[i + 1].revenue) / incomeStatements[i + 1].revenue) * 100;
      metrics.revenueGrowth.push({
        year: income.fiscal_year,
        value: growth,
      });
    }
    
    // 毛利率
    const grossMargin = (income.gross_profit / income.revenue) * 100;
    metrics.grossMargin.push({
      year: income.fiscal_year,
      value: grossMargin,
    });
    
    // 净利率
    const netMargin = (income.net_income / income.revenue) * 100;
    metrics.netMargin.push({
      year: income.fiscal_year,
      value: netMargin,
    });
    
    // 自由现金流
    const fcf = cashFlow.operating_cash_flow - cashFlow.capital_expenditure;
    metrics.freeCashFlow.push({
      year: income.fiscal_year,
      value: fcf,
    });
    
    // ROE
    const roe = (income.net_income / balance.shareholders_equity) * 100;
    metrics.roe.push({
      year: income.fiscal_year,
      value: roe,
    });
  }
  
  return metrics;
}

// 主函数
export async function scanFinancials(ticker) {
  console.log(`🌸 花卷财报快速扫描器`);
  console.log(`========================\n`);
  console.log(`📊 扫描股票：${ticker}\n`);
  
  try {
    // 获取财务数据
    console.log(`📡 获取 ${ticker} 财务数据...`);
    const [incomeStatements, balanceSheets, cashFlowStatements] = await Promise.all([
      getIncomeStatements(ticker, 5),
      getBalanceSheets(ticker, 5),
      getCashFlowStatements(ticker, 5),
    ]);
    
    console.log(`✅ 获取成功！\n`);
    
    // 计算指标
    console.log(`🔍 计算财务指标...`);
    const metrics = calculateMetrics(incomeStatements, balanceSheets, cashFlowStatements);
    
    // 输出结果
    console.log(`\n📊 ${ticker} 过去5年财报核心指标：\n`);
    
    console.log(`📈 收入增长率：`);
    metrics.revenueGrowth.forEach(item => {
      console.log(`   ${item.year}: ${item.value.toFixed(2)}%`);
    });
    
    console.log(`\n💰 毛利率：`);
    metrics.grossMargin.forEach(item => {
      console.log(`   ${item.year}: ${item.value.toFixed(2)}%`);
    });
    
    console.log(`\n💵 净利率：`);
    metrics.netMargin.forEach(item => {
      console.log(`   ${item.year}: ${item.value.toFixed(2)}%`);
    });
    
    console.log(`\n🌊 自由现金流：`);
    metrics.freeCashFlow.forEach(item => {
      console.log(`   ${item.year}: $${(item.value / 1e9).toFixed(2)}B`);
    });
    
    console.log(`\n📊 ROE（净资产收益率）：`);
    metrics.roe.forEach(item => {
      console.log(`   ${item.year}: ${item.value.toFixed(2)}%`);
    });
    
    console.log(`\n✅ 扫描完成！`);
    
    return {
      ticker,
      metrics,
      raw: {
        incomeStatements,
        balanceSheets,
        cashFlowStatements,
      },
    };
  } catch (error) {
    console.error(`❌ 扫描失败：`, error.message);
    throw error;
  }
}

// 如果直接运行
if (require.main === module) {
  const ticker = process.argv[2] || 'NVDA';
  scanFinancials(ticker).catch(console.error);
}
