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
        body: JSON.stringify({ query: `${symbol} earnings financial PE EPS` }),
      });
      const searchData = await searchRes.json();

      if (searchData.results && searchData.results.length > 0) {
        const toolId = searchData.results[0].tool_id;
        const searchId = searchData.search_id;

        // 2. 执行工具
        const executeRes = await fetch('/api/qveris/execute', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            toolId,
            searchId,
            parameters: { symbol: symbol.toUpperCase() },
          }),
        });
        const result = await executeRes.json();

        if (result.success) {
          setData({
            financials: result.result.data,
          });
        } else {
          setError(result.error_message || '分析失败');
        }
      } else {
        setError('未找到相关数据');
      }
    } catch (err) {
      setError('分析失败，请稍后重试');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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

      {data && (
        <div className="space-y-6">
          {/* 财务指标 */}
          <div className="bg-white rounded-lg p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span>📊</span> 核心财务指标
            </h3>
            <div className="bg-gray-50 p-4 rounded overflow-x-auto text-sm">
              <pre>{JSON.stringify(data.financials, null, 2)}</pre>
            </div>
          </div>

          {/* AI研判结论 */}
          <div className="bg-white rounded-lg p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span>🤖</span> AI 综合研判
            </h3>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-gray-700">
                基于财务数据和技术指标的初步分析已完成。完整的 AI 研判功能正在开发中，敬请期待。
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
