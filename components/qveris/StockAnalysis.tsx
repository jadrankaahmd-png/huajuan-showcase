'use client';

import { useState } from 'react';

export default function StockAnalysis() {
  const [symbol, setSymbol] = useState('');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!symbol.trim()) return;

    setLoading(true);
    setError('');
    setData(null);

    try {
      // 1. 搜索财务数据工具
      const searchRes = await fetch('/api/qveris/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: `${symbol} company overview financial metrics` }),
      });
      
      if (!searchRes.ok) {
        throw new Error('搜索API调用失败');
      }
      
      const searchData = await searchRes.json();

      if (searchData.results && searchData.results.length > 0) {
        const toolId = searchData.results[0].tool_id;
        const searchId = searchData.search_id;

        // 检查工具是否需要 function 参数
        const tool = searchData.results[0];
        const params: any = { symbol: symbol.toUpperCase() };
        
        // 如果工具描述包含 earnings，添加 function 参数
        if (tool.name && tool.name.toLowerCase().includes('earnings')) {
          params.function = 'EARNINGS';
        } else if (tool.name && tool.name.toLowerCase().includes('overview')) {
          params.function = 'OVERVIEW';
        }

        // 2. 执行工具
        const executeRes = await fetch('/api/qveris/execute', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            toolId,
            searchId,
            parameters: params,
          }),
        });
        
        if (!executeRes.ok) {
          throw new Error('执行API调用失败');
        }
        
        const result = await executeRes.json();

        if (result.success && result.result && result.result.data) {
          setData({
            financials: result.result.data,
            symbol: symbol.toUpperCase(),
          });
        } else {
          setError(result.error_message || '分析失败');
        }
      } else {
        setError('未找到相关数据');
      }
    } catch (err: any) {
      const errorMsg = err.message || '分析失败，请稍后重试';
      setError(errorMsg);
      console.error('StockAnalysis error:', err);
    } finally {
      setLoading(false);
    }
  };

  // 格式化函数
  const formatPercent = (value: any): string => {
    if (value === null || value === undefined || value === 'None' || isNaN(value)) return 'N/A';
    const num = parseFloat(value);
    if (isNaN(num)) return 'N/A';
    return `${num.toFixed(2)}%`;
  };

  const formatPrice = (value: any): string => {
    if (value === null || value === undefined || value === 'None' || isNaN(value)) return 'N/A';
    const num = parseFloat(value);
    if (isNaN(num)) return 'N/A';
    return `$${num.toFixed(2)}`;
  };

  const formatNumber = (value: any): string => {
    if (value === null || value === undefined || value === 'None' || isNaN(value)) return 'N/A';
    const num = parseFloat(value);
    if (isNaN(num)) return 'N/A';
    
    if (num >= 1e9) return `${(num / 1e9).toFixed(2)}亿`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)}万`;
    if (num >= 1e4) return `${(num / 1e4).toFixed(2)}万`;
    return num.toFixed(2);
  };

  const formatBasic = (value: any): string => {
    if (value === null || value === undefined || value === 'None') return 'N/A';
    return String(value);
  };

  // 提取关键财务指标
  const extractMetrics = (data: any, symbol: string) => {
    if (!data) return null;

    // 从返回的 JSON 中提取关键字段
    const metrics = {
      // 估值指标
      pe: data.PERatio || data['PE Ratio'] || data.pe_ratio,
      forwardPE: data.ForwardPE || data['Forward PE'] || data.forward_pe,
      ps: data.PriceToSalesRatioTTM || data['Price/Sales'] || data.ps_ratio,
      pb: data.PriceToBookRatio || data['Price/Book'] || data.pb_ratio,
      
      // 价格指标
      high52: data['52WeekHigh'] || data['52 Week High'] || data.high_52_week,
      low52: data['52WeekLow'] || data['52 Week Low'] || data.low_52_week,
      ma50: data['50DayMovingAverage'] || data['50 Day MA'] || data.ma_50,
      ma200: data['200DayMovingAverage'] || data['200 Day MA'] || data.ma_200,
      
      // 风险指标
      beta: data.Beta || data.beta,
      institutionalOwnership: data.PercentInstitutions || data['Institutional Ownership'] || data.institutional_percent,
      insiderOwnership: data.PercentInsiders || data['Insider Ownership'] || data.insider_percent,
      
      // 股息信息
      dividendDate: data.DividendDate || data['Dividend Date'] || data.dividend_date,
      dividendYield: data.DividendYield || data['Dividend Yield'] || data.dividend_yield,
      
      // 盈利能力
      eps: data.EPS || data['Earnings Per Share'] || data.earnings_per_share,
      profitMargin: data.ProfitMargin || data['Profit Margin'] || data.profit_margin,
      
      // 公司名称
      companyName: data.Name || data.CompanyName || data.name || symbol,
    };

    return metrics;
  };

  // 生成AI研判结论
  const generateAIAnalysis = (metrics: any, symbol: string): string => {
    if (!metrics) return '数据不足，无法生成研判结论';

    const parts: string[] = [];
    
    // 估值分析
    if (metrics.pe && metrics.forwardPE) {
      const pe = parseFloat(metrics.pe);
      const forwardPE = parseFloat(metrics.forwardPE);
      if (!isNaN(pe) && !isNaN(forwardPE)) {
        if (pe > 50) {
          parts.push(`${symbol}当前PE ${pe.toFixed(2)}倍，估值较高`);
        } else if (pe < 15) {
          parts.push(`${symbol}当前PE ${pe.toFixed(2)}倍，估值偏低`);
        } else {
          parts.push(`${symbol}当前PE ${pe.toFixed(2)}倍，估值合理`);
        }
        
        if (forwardPE < pe) {
          parts.push('预期盈利增长强劲');
        }
      }
    }
    
    // 技术面分析
    if (metrics.ma50 && metrics.ma200) {
      const ma50 = parseFloat(metrics.ma50);
      const ma200 = parseFloat(metrics.ma200);
      if (!isNaN(ma50) && !isNaN(ma200)) {
        if (ma50 > ma200) {
          parts.push(`50日均线位于200日均线上方，趋势向好`);
        } else {
          parts.push(`50日均线位于200日均线下方，注意风险`);
        }
      }
    }
    
    // 风险提示
    if (metrics.beta) {
      const beta = parseFloat(metrics.beta);
      if (!isNaN(beta) && beta > 2) {
        parts.push(`Beta系数${beta.toFixed(2)}，波动性较大，注意风险控制`);
      }
    }
    
    // 机构持股
    if (metrics.institutionalOwnership) {
      const instOwn = parseFloat(metrics.institutionalOwnership);
      if (!isNaN(instOwn) && instOwn > 70) {
        parts.push(`机构持股${instOwn.toFixed(1)}%，专业投资者认可度高`);
      }
    }
    
    // 如果没有分析内容
    if (parts.length === 0) {
      return '基于现有财务数据，建议结合行业趋势和市场环境综合判断';
    }
    
    return parts.join('。') + '。';
  };

  const metrics = data?.financials ? extractMetrics(data.financials, data.symbol) : null;
  const aiAnalysis = metrics ? generateAIAnalysis(metrics, data.symbol) : '';

  return (
    <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl shadow-lg p-8 border border-orange-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-4xl">🔬</div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">个股深度研判</h2>
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
              ✅ 已就绪
            </span>
          </div>
        </div>
      </div>

      <p className="text-gray-700 mb-6">
        输入股票代码，获取财务指标、K线走势和AI综合研判
      </p>

      <div className="flex gap-3 mb-6">
        <input
          type="text"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          placeholder="输入股票代码（如 NVDA、AAPL）"
          className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
          onKeyPress={(e) => e.key === 'Enter' && handleAnalyze()}
        />
        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          {loading ? '分析中...' : '深度分析'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {metrics && (
        <div className="space-y-6">
          {/* 核心财务指标卡片 */}
          <div className="bg-white rounded-lg p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span>📊</span> 核心财务指标 — {data?.symbol}
            </h3>
            
            {/* 估值指标 */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-600 mb-3">估值指标</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-3 flex justify-between items-center">
                  <span className="text-gray-700 text-sm">市盈率(PE)</span>
                  <span className="font-semibold text-gray-900">{formatBasic(metrics.pe)}</span>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 flex justify-between items-center">
                  <span className="text-gray-700 text-sm">预期PE</span>
                  <span className="font-semibold text-gray-900">{formatBasic(metrics.forwardPE)}</span>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 flex justify-between items-center">
                  <span className="text-gray-700 text-sm">市销率</span>
                  <span className="font-semibold text-gray-900">{formatBasic(metrics.ps)}</span>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 flex justify-between items-center">
                  <span className="text-gray-700 text-sm">市净率</span>
                  <span className="font-semibold text-gray-900">{formatBasic(metrics.pb)}</span>
                </div>
              </div>
            </div>
            
            {/* 价格指标 */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-600 mb-3">价格指标</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-3 flex justify-between items-center">
                  <span className="text-gray-700 text-sm">52周最高</span>
                  <span className="font-semibold text-gray-900">{formatPrice(metrics.high52)}</span>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 flex justify-between items-center">
                  <span className="text-gray-700 text-sm">52周最低</span>
                  <span className="font-semibold text-gray-900">{formatPrice(metrics.low52)}</span>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 flex justify-between items-center">
                  <span className="text-gray-700 text-sm">50日均线</span>
                  <span className="font-semibold text-gray-900">{formatPrice(metrics.ma50)}</span>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 flex justify-between items-center">
                  <span className="text-gray-700 text-sm">200日均线</span>
                  <span className="font-semibold text-gray-900">{formatPrice(metrics.ma200)}</span>
                </div>
              </div>
            </div>
            
            {/* 风险与持股 */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-600 mb-3">风险与持股</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-3 flex justify-between items-center">
                  <span className="text-gray-700 text-sm">Beta系数</span>
                  <span className="font-semibold text-gray-900">{formatBasic(metrics.beta)}</span>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 flex justify-between items-center">
                  <span className="text-gray-700 text-sm">机构持股比例</span>
                  <span className="font-semibold text-gray-900">{formatPercent(metrics.institutionalOwnership)}</span>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 flex justify-between items-center">
                  <span className="text-gray-700 text-sm">内部人持股</span>
                  <span className="font-semibold text-gray-900">{formatPercent(metrics.insiderOwnership)}</span>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 flex justify-between items-center">
                  <span className="text-gray-700 text-sm">下次除息日</span>
                  <span className="font-semibold text-gray-900">{formatBasic(metrics.dividendDate)}</span>
                </div>
              </div>
            </div>
            
            {/* 盈利能力（如果有数据） */}
            {(metrics.eps || metrics.profitMargin) && (
              <div>
                <h4 className="text-sm font-semibold text-gray-600 mb-3">盈利能力</h4>
                <div className="grid grid-cols-2 gap-3">
                  {metrics.eps && (
                    <div className="bg-gray-50 rounded-lg p-3 flex justify-between items-center">
                      <span className="text-gray-700 text-sm">每股收益(EPS)</span>
                      <span className="font-semibold text-gray-900">{formatPrice(metrics.eps)}</span>
                    </div>
                  )}
                  {metrics.profitMargin && (
                    <div className="bg-gray-50 rounded-lg p-3 flex justify-between items-center">
                      <span className="text-gray-700 text-sm">净利润率</span>
                      <span className="font-semibold text-gray-900">{formatPercent(metrics.profitMargin)}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* AI综合研判 */}
          <div className="bg-white rounded-lg p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span>🤖</span> AI 综合研判
            </h3>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-gray-800 leading-relaxed">
                {aiAnalysis}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
