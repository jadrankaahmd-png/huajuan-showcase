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
    const { ticker, keyword, filingType = '10-K', years = 5 } = req.body;

    if (!ticker || !keyword) {
      return res.status(400).json({ error: 'Missing ticker or keyword' });
    }

    // 搜索 SEC 文件
    const filings = await callFinancialDatasetsAPI('sec-filings/search', {
      ticker,
      filing_type: filingType,
      query: keyword,
      limit: years,
    });

    // 分析关键词趋势
    const trend = filings.map((filing: any) => {
      const keywordRegex = new RegExp(keyword, 'gi');
      const matches = filing.content?.match(keywordRegex);
      const count = matches ? matches.length : 0;

      return {
        year: filing.fiscal_year,
        date: filing.filing_date,
        count,
        type: filing.filing_type,
      };
    });

    // 计算总出现次数
    const totalCount = trend.reduce((sum: number, item: any) => sum + item.count, 0);

    // 计算趋势方向
    let trendDirection = 'stable';
    if (trend.length >= 2) {
      const recent = trend[0].count;
      const previous = trend[1].count;
      const change = ((recent - previous) / previous) * 100;

      if (change > 20) {
        trendDirection = 'increasing';
      } else if (change < -20) {
        trendDirection = 'decreasing';
      }
    }

    res.status(200).json({
      ticker,
      keyword,
      filingType,
      trend,
      totalCount,
      trendDirection,
    });
  } catch (error: any) {
    console.error('SEC关键词追踪失败:', error);
    res.status(500).json({ error: error.message });
  }
}
