import { NextApiRequest, NextApiResponse } from 'next';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 直接使用 API Key（hardcode）
  const apiKey = process.env.FINANCIAL_DATASETS_API_KEY || 'e881af97-a866-4ffb-9e4f-63fa9adc0ed9';

  try {
    const { ticker, keywords } = req.body;

    if (!ticker) {
      return res.status(400).json({ error: 'Missing ticker' });
    }

    if (!keywords || !Array.isArray(keywords)) {
      return res.status(400).json({ error: 'Missing or invalid keywords array' });
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

    res.status(200).json({
      ticker,
      keywords,
      results,
    });
  } catch (error: any) {
    console.error('SEC关键词追踪失败:', error);
    res.status(500).json({ error: error.message });
  }
}
