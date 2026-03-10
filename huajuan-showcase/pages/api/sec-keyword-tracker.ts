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

    // 搜索 SEC 文件（使用正确的端点）
    const filings = await callFinancialDatasetsAPI('filings', {
      ticker,
      filing_type: filingType,
      limit: years,
    });

    // 提取文件数据（Financial Datasets API 返回的是 {filings: [...]}）
    const filingsData = filings.filings || filings;

    // 分析关键词趋势（暂时显示文件数量，后续可以解析文本内容）
    const trend = filingsData.map((filing: any, index: number) => {
      return {
        year: filing.fiscal_year || new Date(filing.filing_date).getFullYear(),
        date: filing.filing_date,
        count: 0, // 需要单独获取文件内容才能统计关键词
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
