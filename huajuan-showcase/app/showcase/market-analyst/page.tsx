'use client';

import { useState } from 'react';

interface AnalysisResult {
  success: boolean;
  report?: string;
  dataSources?: any;
  error?: string;
}

export default function MarketAnalystPage() {
  const [symbol, setSymbol] = useState('SPY');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const analyze = async () => {
    setIsLoading(true);
    setResult(null);
    
    try {
      const res = await fetch('/api/market-analyst', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbol })
      });
      const data = await res.json();
      setResult(data);
    } catch (error: any) {
      setResult({ success: false, error: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 mb-6 shadow-2xl">
            <span className="text-3xl">🤖</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">
            AI 美股市场分析师
          </h1>
          <p className="text-slate-400">
            MiniMax M2.5 驱动的智能市场分析报告
          </p>
        </div>

        {/* Input */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/20">
          <div className="flex gap-4">
            <input
              type="text"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
              placeholder="输入股票代码，如 SPY、QQQ、AAPL"
              className="flex-1 px-6 py-4 rounded-xl bg-slate-800/50 text-white placeholder-slate-400 border border-slate-700 focus:border-violet-500 focus:outline-none transition-colors"
            />
            <button
              onClick={analyze}
              disabled={isLoading || !symbol}
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white font-semibold hover:from-violet-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-lg hover:shadow-violet-500/30"
            >
              {isLoading ? '分析中...' : '开始分析'}
            </button>
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-slate-400">MiniMax 正在生成分析报告...</p>
            </div>
          </div>
        )}

        {/* Result */}
        {result && result.success && result.report && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            <div className="prose prose-invert max-w-none">
              <div className="text-white whitespace-pre-wrap leading-relaxed">
                {result.report}
              </div>
            </div>
            
            {/* Data Sources */}
            {result.dataSources && (
              <div className="mt-8 pt-6 border-t border-white/20">
                <p className="text-sm text-slate-500 mb-3">数据来源</p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(result.dataSources).map(([key, value]: [string, any]) => (
                    <span key={key} className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-sm">
                      {key}: {typeof value === 'object' ? JSON.stringify(value) : value}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Error */}
        {result && result.error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-2xl p-6 text-red-300">
            {result.error}
          </div>
        )}
      </div>
    </main>
  );
}
