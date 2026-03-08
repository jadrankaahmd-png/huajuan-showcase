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
      
      if (!searchRes.ok) {
        throw new Error('搜索API调用失败');
      }
      
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
        
        if (!executeRes.ok) {
          throw new Error('执行API调用失败');
        }
        
        const result = await executeRes.json();

        if (result.success && result.result && result.result.data) {
          // 验证数据格式
          const stockData = result.result.data;
          if (typeof stockData.c === 'number') {
            setData(stockData);
          } else {
            setError('返回数据格式不正确');
          }
        } else {
          setError(result.error_message || '查询失败');
        }
      } else {
        setError('未找到相关数据');
      }
    } catch (err: any) {
      const errorMsg = err.message || '查询失败，请稍后重试';
      setError(errorMsg);
      console.error('StockQuery error:', err);
    } finally {
      setLoading(false);
    }
  };

  // 安全的数据访问函数
  const safeToFixed = (value: any, digits: number = 2): string => {
    if (value === null || value === undefined || isNaN(value)) {
      return 'N/A';
    }
    try {
      return Number(value).toFixed(digits);
    } catch {
      return 'N/A';
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
              <p className="text-2xl font-bold text-gray-900">
                ${data.c !== undefined ? safeToFixed(data.c, 2) : 'N/A'}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-600 text-sm mb-1">涨跌幅</p>
              <p className={`text-2xl font-bold ${data.dp >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {data.dp !== undefined ? (data.dp >= 0 ? '+' : '') + safeToFixed(data.dp, 2) + '%' : 'N/A'}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-600 text-sm mb-1">今日最高</p>
              <p className="text-xl font-bold text-gray-900">
                ${data.h !== undefined ? safeToFixed(data.h, 2) : 'N/A'}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-600 text-sm mb-1">今日最低</p>
              <p className="text-xl font-bold text-gray-900">
                ${data.l !== undefined ? safeToFixed(data.l, 2) : 'N/A'}
              </p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-gray-600 text-sm">开盘价</p>
              <p className="text-lg font-bold">
                ${data.o !== undefined ? safeToFixed(data.o, 2) : 'N/A'}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-gray-600 text-sm">前一日收盘</p>
              <p className="text-lg font-bold">
                ${data.pc !== undefined ? safeToFixed(data.pc, 2) : 'N/A'}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-gray-600 text-sm">涨跌额</p>
              <p className={`text-lg font-bold ${data.d >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {data.d !== undefined ? (data.d >= 0 ? '+' : '') + '$' + safeToFixed(data.d, 2) : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
