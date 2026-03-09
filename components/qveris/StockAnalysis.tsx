'use client';

// QVeris credits 预留给第三层选股推荐使用
// 暂停用户端直接调用，等第三层上线后恢复

import FeatureDisabled from './FeatureDisabled';

export default function StockAnalysis() {
  return <FeatureDisabled featureName="个股深度研判" />;
}

/*
原有代码保留：
'use client';

import { useState } from 'react';

export default function StockAnalysis() {
  const [symbol, setSymbol] = useState('');
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalysis = async () => {
    if (!symbol.trim()) return;

    setLoading(true);
    setError('');
    setAnalysis(null);

    try {
      // 1. 搜索工具
      const searchRes = await fetch('/api/qveris/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: `stock analysis ${symbol} fundamentals technicals` }),
      });

      const searchResult = await searchRes.json();

      if (!searchResult.tools || searchResult.tools.length === 0) {
        throw new Error('没有找到可用的分析工具');
      }

      // 2. 执行工具
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
        setAnalysis(result.data);
      } else {
        throw new Error(result.error || '分析失败');
      }
    } catch (err: any) {
      setError(err.message || '分析失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl shadow-lg p-8 border border-orange-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="text-4xl">🔬</div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">个股深度研判</h2>
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
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>

        <button
          onClick={handleAnalysis}
          disabled={loading || !symbol.trim()}
          className="w-full px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? '分析中...' : '开始研判'}
        </button>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {error}
          </div>
        )}

        {analysis && (
          <div className="bg-white rounded-lg p-4 space-y-4">
            <h3 className="font-semibold text-gray-900 text-lg">研判报告</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="text-sm text-gray-600">市盈率</div>
                <div className="text-xl font-bold text-blue-600">{analysis.pe || 'N/A'}</div>
              </div>

              <div className="bg-green-50 rounded-lg p-3">
                <div className="text-sm text-gray-600">市净率</div>
                <div className="text-xl font-bold text-green-600">{analysis.pb || 'N/A'}</div>
              </div>

              <div className="bg-purple-50 rounded-lg p-3">
                <div className="text-sm text-gray-600">EPS</div>
                <div className="text-xl font-bold text-purple-600">{analysis.eps || 'N/A'}</div>
              </div>

              <div className="bg-orange-50 rounded-lg p-3">
                <div className="text-sm text-gray-600">市值</div>
                <div className="text-xl font-bold text-orange-600">
                  ${analysis.marketCap ? (analysis.marketCap / 1e9).toFixed(2) + 'B' : 'N/A'}
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-sm text-gray-600 mb-2">AI研判结论</div>
              <div className="text-gray-800">{analysis.conclusion || '暂无研判结论'}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
*/
