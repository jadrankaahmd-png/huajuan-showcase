import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // 直接使用 hardcode API Key
  const apiKey = process.env.FINANCIAL_DATASETS_API_KEY || 'e881af97-a866-4ffb-9e4f-63fa9adc0ed9';

  try {
    const body = await request.json();
    const { ticker } = body;

    if (!ticker) {
      return NextResponse.json({ error: 'Missing ticker' }, { status: 400 });
    }

    // 直接调用 Financial Datasets API
    const [incomeStatements, balanceSheets, cashFlowStatements] = await Promise.all([
      fetch(`https://api.financialdatasets.ai/financials/income-statements/?ticker=${ticker}&period=annual&limit=5`, {
        headers: { 'X-API-KEY': apiKey },
      }).then(r => r.json()),
      fetch(`https://api.financialdatasets.ai/financials/balance-sheets/?ticker=${ticker}&period=annual&limit=5`, {
        headers: { 'X-API-KEY': apiKey },
      }).then(r => r.json()),
      fetch(`https://api.financialdatasets.ai/financials/cash-flow-statements/?ticker=${ticker}&period=annual&limit=5`, {
        headers: { 'X-API-KEY': apiKey },
      }).then(r => r.json()),
    ]);

    // 从响应中提取数据
    const incomeData = incomeStatements.income_statements || incomeStatements;
    const balanceData = balanceSheets.balance_sheets || balanceSheets;
    const cashFlowData = cashFlowStatements.cash_flow_statements || cashFlowStatements;

    // 计算财务指标
    const metrics: {
      revenueGrowth: Array<{ year: any; value: number }>;
      grossMargin: Array<{ year: any; value: number }>;
      netMargin: Array<{ year: any; value: number }>;
      freeCashFlow: Array<{ year: any; value: number }>;
      roe: Array<{ year: any; value: number }>;
    } = {
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
      if (i < incomeData.length - 1) {
        const growth = ((income.revenue - incomeData[i + 1].revenue) / incomeData[i + 1].revenue) * 100;
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

    return NextResponse.json({ ticker, metrics });
  } catch (error: any) {
    console.error('财报扫描失败:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
