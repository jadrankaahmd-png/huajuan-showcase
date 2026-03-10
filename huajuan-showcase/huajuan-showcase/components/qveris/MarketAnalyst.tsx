'use client';

// QVeris credits 预留给第三层选股推荐使用
// 暂停用户端直接调用，等第三层上线后恢复

import FeatureDisabled from './FeatureDisabled';

export default function MarketAnalyst() {
  return <FeatureDisabled featureName="AI美股市场分析师" />;
}

/*
原有代码保留：
'use client';

import { useState } from 'react';

export default function MarketAnalyst() {
  const [report, setReport] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lastUpdate, setLastUpdate] = useState<string>('');

  const handleAnalyze = async () => {
    setLoading(true);
    setError('');
    setReport('');

    try {
      const response = await fetch('/api/market-analyst', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();

      if (data.success) {
        setReport(data.report);
        setLastUpdate(data.timestamp);
      } else {
        throw new Error(data.error || '分析失败');
      }
    } catch (err: any) {
      setError(err.message || '分析失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl shadow-lg p-8 border border-pink-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="text-4xl">🤖</div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">AI美股市场分析师</h2>
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
            ✅ 已就绪
          </span>
        </div>
      </div>

      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
        <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
          <span>📊</span> 数据源
        </h3>
        <div className="flex flex-wrap gap-2 text-sm text-gray-600">
          <span className="px-3 py-1 bg-white rounded-full">QVeris（实时行情）</span>
          <span className="px-3 py-1 bg-white rounded-full">NewsAPI（新闻）</span>
          <span className="px-3 py-1 bg-white rounded-full">Finnhub（市场情绪）</span>
          <span className="px-3 py-1 bg-white rounded-full">FRED（宏观经济）</span>
          <span className="px-3 py-1 bg-white rounded-full">EIA（能源数据）</span>
        </div>
      </div>

      <div className="space-y-4">
        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="w-full px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              分析中...
            </>
          ) : (
            <>
              <span>🔍</span>
              立即分析
            </>
          )}
        </button>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {error}
          </div>
        )}

        {lastUpdate && (
          <div className="text-sm text-gray-500 text-center">
            最后更新: {new Date(lastUpdate).toLocaleString('zh-CN')}
          </div>
        )}

        {report && (
          <div className="bg-white rounded-lg p-6 prose prose-sm max-w-none">
            <div dangerouslySetInnerHTML={{ __html: report.replace(/\n/g, '<br/>').replace(/^# /gm, '<h1>').replace(/^## /gm, '<h2>').replace(/^### /gm, '<h3>') }} />
          </div>
        )}
      </div>
    </div>
  );
}
*/
