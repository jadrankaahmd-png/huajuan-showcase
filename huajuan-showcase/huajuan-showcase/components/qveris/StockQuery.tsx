'use client';

// QVeris credits 预留给第三层选股推荐使用
// 暂停用户端直接调用，等第三层上线后恢复

import FeatureDisabled from './FeatureDisabled';

export default function StockQuery() {
  return <FeatureDisabled featureName="美股实时查询" />;
}

/*
原有代码保留：
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
        body: JSON.stringify({ query: `real-time stock price ${symbol}` }),
      });

      const searchResult = await searchRes.json();

      if (!searchResult.tools || searchResult.tools.length === 0) {
        throw new Error('没有找到可用的股票数据工具');
      }

      // 2. 执行第一个工具
      const tool = searchResult.tools[0];
      const executeRes = await fetch('/api/qveris/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolId: tool.id,
          params: { symbol: symbol.toUpperCase() },
        }),
      });

      const result = await executeRes.json();

      if (result.success) {
        setData(result.data);
      } else {
        throw new Error(result.error || '获取数据失败');
      }
    } catch (err: any) {
      setError(err.message || '查询失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl shadow-lg p-8 border border-blue-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="text-4xl">📈</div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">美股实时查询</h2>
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
            ✅ 已就绪
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            股票代码
          </label>
          <input
            type="text"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value.toUpperCase())}
            placeholder="例如: AAPL, TSLA, NVDA"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <button
          onClick={handleQuery}
          disabled={loading || !symbol.trim()}
          className="w-full px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? '查询中...' : '查询'}
        </button>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {error}
          </div>
        )}

        {data && (
          <div className="bg-white rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">查询结果</h3>
            <pre className="text-sm text-gray-700 overflow-x-auto">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
*/
