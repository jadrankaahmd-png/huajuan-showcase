'use client';

// QVeris credits 预留给第三层选股推荐使用
// 暂停用户端直接调用，等第三层上线后恢复

import FeatureDisabled from './FeatureDisabled';

export default function StockRanking() {
  return <FeatureDisabled featureName="美股涨幅实时榜单" />;
}

/*
原有代码保留：
'use client';

import { useState, useEffect } from 'react';

export default function StockRanking() {
  const [rankings, setRankings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRankings();
  }, []);

  const fetchRankings = async () => {
    try {
      const response = await fetch('/api/qveris/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: 'US stock market top gainers today' }),
      });

      const data = await response.json();

      if (data.tools && data.tools.length > 0) {
        const tool = data.tools[0];
        const executeRes = await fetch('/api/qveris/execute', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            toolId: tool.id,
            params: { limit: 5 },
          }),
        });

        const result = await executeRes.json();

        if (result.success) {
          setRankings(result.data || []);
        } else {
          throw new Error(result.error || '获取数据失败');
        }
      } else {
        throw new Error('没有找到可用的榜单工具');
      }
    } catch (err: any) {
      setError(err.message || '获取榜单失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl shadow-lg p-8 border border-purple-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="text-4xl">🏆</div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">美股涨幅实时榜单</h2>
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
            ✅ 已就绪
          </span>
        </div>
      </div>

      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      )}

      {rankings.length > 0 && (
        <div className="space-y-3">
          {rankings.map((stock, index) => (
            <div key={index} className="bg-white rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-2xl font-bold text-purple-600">#{index + 1}</div>
                <div>
                  <div className="font-semibold text-gray-900">{stock.symbol}</div>
                  <div className="text-sm text-gray-600">{stock.name}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-green-600">
                  +{stock.changePercent?.toFixed(2)}%
                </div>
                <div className="text-sm text-gray-600">${stock.price?.toFixed(2)}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
*/
