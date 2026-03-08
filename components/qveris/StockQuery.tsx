'use client';

import { useState } from 'react';

export default function StockQuery() {
  const [symbol, setSymbol] = useState('');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleQuery = async () => {
    if (!symbol.trim()) return;

    setLoading(true);
    setError('');
    setData(null);

    try {
      // 1. 搜索工具
      const searchRes = await fetch('/api/qveris/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: `${symbol} stock quote real-time` }),
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
          setData(result.result.data);
        } else {
          setError(result.error_message || '查询失败');
        }
      } else {
        setError('未找到相关数据');
      }
    } catch (err) {
      setError('查询失败，请稍后重试');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl shadow-lg p-8 border border-blue-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-4xl">📈</div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">美股实时查询</h2>
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
              ✅ 已就绪
            </span>
          </div>
        </div>
      </div>

      <p className="text-gray-700 mb-6">
        输入股票代码，获取实时股价、涨跌幅和市场数据（数据来源：QVeris API）
      </p>

      <div className="flex gap-3 mb-6">
        <input
          type="text"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          placeholder="输入股票代码（如 NVDA、AAPL）"
          className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onKeyPress={(e) => e.key === 'Enter' && handleQuery()}
        />
        <button
          onClick={handleQuery}
          disabled={loading}
          className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          {loading ? '查询中...' : '查询'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {data && (
        <div className="bg-white rounded-lg p-6">
          <h3 className="text-lg font-bold mb-4">查询结果 - {symbol.toUpperCase()}</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-600 text-sm mb-1">当前价</p>
              <p className="text-2xl font-bold text-gray-900">${data.c}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-600 text-sm mb-1">涨跌幅</p>
              <p className={`text-2xl font-bold ${data.dp >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {data.dp >= 0 ? '+' : ''}{data.dp.toFixed(2)}%
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-600 text-sm mb-1">今日最高</p>
              <p className="text-xl font-bold text-gray-900">${data.h}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-600 text-sm mb-1">今日最低</p>
              <p className="text-xl font-bold text-gray-900">${data.l}</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-gray-600 text-sm">开盘价</p>
              <p className="text-lg font-bold">${data.o}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-gray-600 text-sm">前一日收盘</p>
              <p className="text-lg font-bold">${data.pc}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-gray-600 text-sm">涨跌额</p>
              <p className={`text-lg font-bold ${data.d >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {data.d >= 0 ? '+' : ''}${data.d.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
