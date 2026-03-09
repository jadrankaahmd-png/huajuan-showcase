'use client';

// QVeris credits 预留给第三层选股推荐使用
// 暂停用户端直接调用，等第三层上线后恢复

import FeatureDisabled from './FeatureDisabled';

export default function Backtest() {
  return <FeatureDisabled featureName="美股量化策略回测" />;
}

/*
原有代码保留：
'use client';

import { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function Backtest() {
  const [symbol, setSymbol] = useState('');
  const [period, setPeriod] = useState<'3m' | '6m' | '1y'>('3m');
  const [strategy, setStrategy] = useState<'ma' | 'momentum'>('ma');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleBacktest = async () => {
    if (!symbol.trim()) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/backtest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symbol: symbol.toUpperCase(),
          period,
          strategy,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setResult(data);
      } else {
        throw new Error(data.error || '回测失败');
      }
    } catch (err: any) {
      setError(err.message || '回测失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl shadow-lg p-8 border border-indigo-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="text-4xl">📊</div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">美股量化策略回测</h2>
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
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              回测周期
            </label>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value as '3m' | '6m' | '1y')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="3m">3个月</option>
              <option value="6m">6个月</option>
              <option value="1y">1年</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              策略类型
            </label>
            <select
              value={strategy}
              onChange={(e) => setStrategy(e.target.value as 'ma' | 'momentum')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="ma">均线策略</option>
              <option value="momentum">动量策略</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleBacktest}
          disabled={loading || !symbol.trim()}
          className="w-full px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? '回测中...' : '开始回测'}
        </button>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {error}
          </div>
        )}

        {result && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg p-4">
                <div className="text-sm text-gray-600">年化收益</div>
                <div className={`text-xl font-bold ${
                  result.annualReturn >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {result.annualReturn >= 0 ? '+' : ''}{result.annualReturn?.toFixed(2)}%
                </div>
              </div>

              <div className="bg-white rounded-lg p-4">
                <div className="text-sm text-gray-600">最大回撤</div>
                <div className="text-xl font-bold text-red-600">
                  -{result.maxDrawdown?.toFixed(2)}%
                </div>
              </div>

              <div className="bg-white rounded-lg p-4">
                <div className="text-sm text-gray-600">胜率</div>
                <div className="text-xl font-bold text-blue-600">
                  {result.winRate?.toFixed(2)}%
                </div>
              </div>

              <div className="bg-white rounded-lg p-4">
                <div className="text-sm text-gray-600">交易次数</div>
                <div className="text-xl font-bold text-purple-600">
                  {result.trades}
                </div>
              </div>
            </div>

            {result.strategyValues && result.strategyValues.length > 0 && (
              <div className="bg-white rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-4">净值曲线</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={result.strategyValues.map((sv, idx) => ({
                      date: sv.date,
                      策略净值: sv.value,
                      基准净值: result.benchmarkValues[idx]?.value || sv.value,
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="策略净值" stroke="#4F46E5" strokeWidth={2} />
                      <Line type="monotone" dataKey="基准净值" stroke="#9CA3AF" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
*/
