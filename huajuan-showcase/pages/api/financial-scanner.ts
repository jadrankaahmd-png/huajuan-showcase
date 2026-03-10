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
    const { ticker } = req.body;

    if (!ticker) {
      return res.status(400).json({ error: 'Missing ticker' });
    }

    // 获取财务数据（使用正确的端点）
    const [incomeStatements, balanceSheets, cashFlowStatements] = await Promise.all([
      callFinancialDatasetsAPI('financials/income-statements', { ticker, period: 'annual', limit: 5 }),
      callFinancialDatasetsAPI('financials/balance-sheets', { ticker, period: 'annual', limit: 5 }),
      callFinancialDatasetsAPI('financials/cash-flow-statements', { ticker, period: 'annual', limit: 5 }),
    ]);

    // 从响应中提取数据（Financial Datasets API 返回的是 {income_statements: [...]}）
    const incomeData = incomeStatements.income_statements || incomeStatements;
    const balanceData = balanceSheets.balance_sheets || balanceSheets;
    const cashFlowData = cashFlowStatements.cash_flow_statements || cashFlowStatements;

    // 计算财务指标
    const metrics = {
      revenueGrowth: [],
      grossMargin: [],
      netMargin: [],
      freeCashFlow: [],
      roe: [],
    };

    for (let i = 0; i < incomeData.length; i++) {
      const income = incomeData[i];
      const balance = balanceData[i];
      const cashFlow = cashFlowData[i];

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

    res.status(200).json({
      ticker,
      metrics,
      raw: {
        incomeStatements,
        balanceSheets,
        cashFlowStatements,
      },
    });
  } catch (error: any) {
    console.error('财报扫描失败:', error);
    res.status(500).json({ error: error.message });
  }
}
