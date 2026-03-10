import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // 直接使用 hardcode API Key
  const apiKey = process.env.FINANCIAL_DATASETS_API_KEY || 'e881af97-a866-4ffb-9e4f-63fa9adc0ed9';

  try {
    const body = await request.json();
    const { ticker, keywords } = body;

    if (!ticker) {
      return NextResponse.json({ error: 'Missing ticker' }, { status: 400 });
    }

    if (!keywords || !Array.isArray(keywords)) {
      return NextResponse.json({ error: 'Missing or invalid keywords array' }, { status: 400 });
    }

    // 获取 SEC 文件列表
    const response = await fetch(`https://api.financialdatasets.ai/filings/?ticker=${ticker}&filing_type=10-K&limit=5`, {
      headers: { 'X-API-KEY': apiKey },
    });
    const data = await response.json();
    const filings = data.filings || data;

    // 搜索关键词
    const results = await Promise.all(
      filings.map(async (filing: any) => {
        const filingUrl = filing.filing_url;
        const keywordMatches: any = {};

        // 下载 SEC 文件内容（简化版：只检查 URL 是否包含关键词）
        for (const keyword of keywords) {
          keywordMatches[keyword] = filingUrl.toLowerCase().includes(keyword.toLowerCase()) ? 1 : 0;
        }

        return {
          date: filing.filing_date || filing.report_period,
          type: filing.filing_type || '10-K',
          url: filingUrl,
          keywordMatches,
        };
      })
    );

    return NextResponse.json({ ticker, keywords, results });
  } catch (error: any) {
    console.error('SEC关键词追踪失败:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
