import { NextApiRequest, NextApiResponse } from 'next';
import { callFinancialDatasetsAPI, isAPIKeyConfigured } from '../../lib/financial-datasets-config';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 检查 API Key
  if (!isAPIKeyConfigured()) {
    return res.status(500).json({
      error: 'Financial Datasets API Key 未配置',
      instructions: '请访问 https://financialdatasets.ai 获取 API Key',
    });
  }

  try {
    const { tickers } = req.body;

    if (!tickers || !Array.isArray(tickers) || tickers.length < 2) {
      return res.status(400).json({ error: 'Need at least 2 tickers for comparison' });
    }

    // 获取所有公司数据
    const companies = await Promise.all(
      tickers.map(async (ticker) => {
        const [incomeStatements, balanceSheets] = await Promise.all([
          callFinancialDatasetsAPI('financials/income-statements', { ticker, period: 'annual', limit: 1 }),
          callFinancialDatasetsAPI('financials/balance-sheets', { ticker, period: 'annual', limit: 1 }),
        ]);

        // 提取数据（Financial Datasets API 返回的是 {income_statements: [...]}）
        const incomeData = incomeStatements.income_statements?.[0] || incomeStatements[0];
        const balanceData = balanceSheets.balance_sheets?.[0] || balanceSheets[0];

        return {
          ticker,
          revenue: incomeData?.revenue || 0,
          netIncome: incomeData?.net_income || 0,
          grossProfit: incomeData?.gross_profit || 0,
          shareholdersEquity: balanceData?.shareholders_equity || 1,
        };
      })
    );

    // 计算对比指标
    const comparison = companies.map((company, index) => {
      const revenueGrowth = index < companies.length - 1
        ? ((company.revenue - companies[companies.length - 1].revenue) / companies[companies.length - 1].revenue) * 100
        : 0;

      return {
        ticker: company.ticker,
        revenue: company.revenue,
        revenueGrowth,
        grossMargin: (company.grossProfit / company.revenue) * 100,
        netMargin: (company.netIncome / company.revenue) * 100,
        roe: (company.netIncome / company.shareholdersEquity) * 100,
      };
    });

    res.status(200).json({
      tickers,
      comparison,
    });
  } catch (error: any) {
    console.error('公司对比失败:', error);
    res.status(500).json({ error: error.message });
  }
}
