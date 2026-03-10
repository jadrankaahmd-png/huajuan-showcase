import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // 直接使用 hardcode API Key
  const apiKey = process.env.FINANCIAL_DATASETS_API_KEY || 'e881af97-a866-4ffb-9e4f-63fa9adc0ed9';

  try {
    const body = await request.json();
    const { tickers } = body;

    if (!tickers || !Array.isArray(tickers)) {
      return NextResponse.json({ error: 'Missing or invalid tickers array' }, { status: 400 });
    }

    // 并行获取所有公司的财务数据
    const companiesData = await Promise.all(
      tickers.map(async (ticker: string) => {
        const [incomeStatements, balanceSheets, cashFlowStatements] = await Promise.all([
          fetch(`https://api.financialdatasets.ai/financials/income-statements/?ticker=${ticker}&period=annual&limit=1`, {
            headers: { 'X-API-KEY': apiKey },
          }).then(r => r.json()),
          fetch(`https://api.financialdatasets.ai/financials/balance-sheets/?ticker=${ticker}&period=annual&limit=1`, {
            headers: { 'X-API-KEY': apiKey },
          }).then(r => r.json()),
          fetch(`https://api.financialdatasets.ai/financials/cash-flow-statements/?ticker=${ticker}&period=annual&limit=1`, {
            headers: { 'X-API-KEY': apiKey },
          }).then(r => r.json()),
        ]);

        const income = incomeStatements.income_statements?.[0] || incomeStatements[0];
        const balance = balanceSheets.balance_sheets?.[0] || balanceSheets[0];
        const cashFlow = cashFlowStatements.cash_flow_statements?.[0] || cashFlowStatements[0];

        return {
          ticker,
          revenue: income?.revenue || 0,
          netIncome: income?.net_income || 0,
          grossProfit: income?.gross_profit || 0,
          totalAssets: balance?.total_assets || 0,
          shareholdersEquity: balance?.shareholders_equity || 0,
          operatingCashFlow: cashFlow?.operating_cash_flow || 0,
          capitalExpenditure: cashFlow?.capital_expenditure || 0,
        };
      })
    );

    return NextResponse.json({ companies: companiesData });
  } catch (error: any) {
    console.error('公司对比失败:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
