'use client';

import { useState } from 'react';

interface AnalysisResult {
  success: boolean;
  report?: string;
  dataSources?: {
    qveris?: { global: number; sectors: number };
    newsapi?: number;
    finnhub?: number;
    fred?: number;
    eia?: number;
  };
  error?: string;
}

export default function MarketAnalystPage() {
  const [symbol, setSymbol] = useState('SPY');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const analyze = async () => {
    if (!symbol.trim()) return;
    
    setIsLoading(true);
    setResult(null);
    
    try {
      const res = await fetch('/api/market-analyst', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbol: symbol.toUpperCase() })
      });
      const data = await res.json();
      setResult(data);
    } catch (error: any) {
      setResult({ success: false, error: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      analyze();
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0a0f]">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0f] via-[#12121a] to-[#0a0a0f]">
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}></div>
        <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-violet-500/15 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/3 w-[500px] h-[500px] bg-purple-500/15 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-4xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-white/60 mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            AI Market Analyst
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            AI 美股市场分析师
          </h1>
          <p className="text-lg text-white/50">
            MiniMax M2.5 驱动的智能市场分析报告
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-2 mb-8">
          <div className="flex gap-3">
            <input
              type="text"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
              onKeyPress={handleKeyPress}
              placeholder="输入股票代码，如 SPY、QQQ、AAPL"
              className="flex-1 px-5 py-4 rounded-xl bg-white/5 text-white placeholder-white/30 border border-white/10 focus:border-violet-500/50 focus:outline-none focus:bg-white/10 transition-all"
            />
            <button
              onClick={analyze}
              disabled={isLoading || !symbol.trim()}
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold hover:from-violet-500 hover:to-purple-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:shadow-lg hover:shadow-violet-500/25"
            >
              {isLoading ? '分析中...' : '生成报告'}
            </button>
          </div>
        </div>

        {/* QVeris Warning */}
        <div className="mb-8 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
          <div className="flex items-start gap-3">
            <span className="text-xl">⚠️</span>
            <div>
              <p className="text-amber-400 font-medium mb-1">QVeris 数据当前已禁用</p>
              <p className="text-amber-400/70 text-sm">
                为节省 API 配额，QVeris 数据暂不自动获取。其他数据源（NewsAPI、Finnhub、FRED、EIA）正常工作。
              </p>
            </div>
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-6">
              <div className="relative">
                <div className="w-16 h-16 border-3 border-violet-500/20 border-t-violet-500 rounded-full animate-spin"></div>
                <div className="absolute inset-2 border-2 border-purple-500/20 border-b-purple-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}></div>
              </div>
              <div className="text-center">
                <p className="text-white/80 font-medium mb-2">MiniMax 正在分析市场...</p>
                <p className="text-white/40 text-sm">整合多源数据生成专业报告</p>
              </div>
            </div>
          </div>
        )}

        {/* Result */}
        {result && result.success && result.report && (
          <div className="space-y-6">
            {/* Report Content */}
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 overflow-hidden">
              <div className="px-6 py-4 bg-white/5 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span className="text-white/80 font-medium">分析报告</span>
                </div>
              </div>
              <div className="p-6">
                <div className="prose prose-invert max-w-none">
                  <div className="text-white/80 whitespace-pre-wrap leading-relaxed">
                    {result.report}
                  </div>
                </div>
              </div>
            </div>

            {/* Data Sources */}
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
              <h3 className="text-white/60 text-sm font-medium mb-4">数据来源</h3>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10">
                  <span className="text-emerald-400">📊</span>
                  <span className="text-white/70 text-sm">QVeris</span>
                  <span className="text-white/40 text-xs">
                    {(result.dataSources?.qveris?.global || 0) + (result.dataSources?.qveris?.sectors || 0)} 条
                  </span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10">
                  <span className="text-blue-400">📰</span>
                  <span className="text-white/70 text-sm">NewsAPI</span>
                  <span className="text-white/40 text-xs">{result.dataSources?.newsapi || 0} 条</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10">
                  <span className="text-orange-400">📈</span>
                  <span className="text-white/70 text-sm">Finnhub</span>
                  <span className="text-white/40 text-xs">{result.dataSources?.finnhub || 0} 条</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10">
                  <span className="text-purple-400">🏦</span>
                  <span className="text-white/70 text-sm">FRED</span>
                  <span className="text-white/40 text-xs">{result.dataSources?.fred || 0}</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10">
                  <span className="text-red-400">⛽</span>
                  <span className="text-white/70 text-sm">EIA</span>
                  <span className="text-white/40 text-xs">{result.dataSources?.eia || 0}</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-500/10 border border-violet-500/30">
                  <span className="text-violet-400">🤖</span>
                  <span className="text-white/70 text-sm">MiniMax M2.5</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error */}
        {result && result.error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6">
            <div className="flex items-center gap-3">
              <span className="text-2xl">❌</span>
              <div>
                <p className="text-red-400 font-medium mb-1">分析失败</p>
                <p className="text-red-400/70 text-sm">{result.error}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
