/**
 * Financial Datasets API 配置
 * 用于财报快速扫描器、公司对比分析器、SEC文件关键词追踪器
 */

// API 配置
export const FINANCIAL_DATASETS_CONFIG = {
  // API 基础 URL
  baseUrl: 'https://api.financialdatasets.ai',
  
  // API Key（从环境变量读取）
  apiKey: process.env.FINANCIAL_DATASETS_API_KEY,
  
  // 请求超时（毫秒）
  timeout: 30000,
  
  // 重试次数
  maxRetries: 3,
  
  // 支持的端点（正确的格式）
  endpoints: {
    incomeStatements: 'financials/income-statements',
    balanceSheets: 'financials/balance-sheets',
    cashFlowStatements: 'financials/cash-flow-statements',
    stockPrices: 'prices',
    secFilings: 'filings',
    companyNews: 'news',
    cryptoPrices: 'crypto/prices',
  },
  
  // 支持的文件类型
  filingTypes: ['10-K', '10-Q', '8-K', 'DEF 14A'],
  
  // 支持的周期
  periods: ['annual', 'quarterly'],
};

// 通用 API 调用函数
export async function callFinancialDatasetsAPI(endpoint, params) {
  const url = new URL(`${FINANCIAL_DATASETS_CONFIG.baseUrl}/${endpoint}`);
  Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
  
  const response = await fetch(url, {
    headers: {
      'X-API-Key': FINANCIAL_DATASETS_CONFIG.apiKey,
    },
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Financial Datasets API Error (${response.status}): ${error}`);
  }
  
  return response.json();
}

// 检查 API Key 是否配置
export function isAPIKeyConfigured() {
  return !!FINANCIAL_DATASETS_CONFIG.apiKey;
}

// 获取 API Key 配置说明
export function getAPIKeyInstructions() {
  return `
🔒 **Financial Datasets API Key 配置说明**

1. 访问：https://financialdatasets.ai
2. 注册账号
3. 获取免费 API Key
4. 配置到环境变量：
   export FINANCIAL_DATASETS_API_KEY="your-api-key"

或者在 .env 文件中添加：
FINANCIAL_DATASETS_API_KEY=your-api-key
`;
}
