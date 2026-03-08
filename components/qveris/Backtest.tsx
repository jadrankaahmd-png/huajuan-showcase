'use client';

import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Backtest() {
  const [symbol, setSymbol] = useState('NVDA');
  const [strategy, setStrategy] = useState('ma');
  const [period, setPeriod] = useState('3m');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const handleBacktest = async () => {
    if (!symbol.trim()) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      setLoadingStep('正在获取历史数据...');
      
      const res = await fetch('/api/backtest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbol: symbol.toUpperCase(), strategy, period }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || '回测失败');
      }

      setLoadingStep('正在计算策略...');
      const data = await res.json();

      if (data.success) {
        setResult(data.data);
      } else {
        throw new Error(data.error || '回测失败');
      }
    } catch (err: any) {
      setError(err.message || '回测失败，请稍后重试');
      console.error('Backtest error:', err);
    } finally {
      setLoading(false);
      setLoadingStep('');
    }
  };

  // 合并策略净值和基准净值数据
  const chartData = result ? result.strategyValues.map((sv: any, idx: number) => ({
    date: sv.date,
    策略净值: sv.value,
    基准净值: result.benchmarkValues[idx]?.value || sv.value,
  })) : [];

  return (
    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl shadow-lg p-8 border border-indigo-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-4xl">📈</div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">美股量化策略回测</h2>
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
              ✅ 已就绪
            </span>
          </div>
        </div>
      </div>

      <p className="text-gray-700 mb-6">
        基于真实历史数据的量化策略回测，支持均线策略和动量策略
      </p>

      {/* 输入区域 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">股票代码</label>
          <input
            type="text"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            placeholder="如 NVDA"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">策略选择</label>
          <select
            value={strategy}
            onChange={(e) => setStrategy(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ma">均线策略</option>
            <option value="momentum">动量策略</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">回测周期</label>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="3m">近3个月</option>
            <option value="6m">近6个月</option>
            <option value="1y">近1年</option>
          </select>
        </div>
        
        <div className="flex items-end">
          <button
            onClick={handleBacktest}
            disabled={loading}
            className="w-full px-6 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {loading ? '回测中...' : '开始回测'}
          </button>
        </div>
      </div>

      {/* 加载提示 */}
      {loading && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <p className="text-blue-700 flex items-center gap-2">
            <span className="animate-spin">⏳</span>
            {loadingStep}
          </p>
        </div>
      )}

      {/* 错误提示 */}
      {error && (
        <div className="bg-red-50 border border-blue-200 rounded-lg p-4 mb-4">
          <p className="text-red-700">{error}</p>
          <button
            onClick={handleBacktest}
            className="mt-2 text-red-700 underline hover:text-red-800"
          >
            重试
          </button>
        </div>
      )}

      {/* 回测结果 */}
      {result && (
        <div className="space-y-6">
          {/* 核心指标 */}
          <div className="bg-white rounded-lg p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span>📊</span> 回测结果 — {result.symbol}
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-600 text-sm mb-1">策略年化收益</p>
                <p className={`text-2xl font-bold ${parseFloat(result.annualReturn) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {result.annualReturn}%
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-600 text-sm mb-1">基准年化收益</p>
                <p className={`text-2xl font-bold ${parseFloat(result.benchmarkReturn) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {result.benchmarkReturn}%
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-600 text-sm mb-1">最大回撤</p>
                <p className="text-2xl font-bold text-red-600">
                  -{result.maxDrawdown}%
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-600 text-sm mb-1">胜率</p>
                <p className="text-2xl font-bold text-blue-600">
                  {result.winRate}%
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-600 text-sm mb-1">回测周期</p>
                <p className="text-2xl font-bold text-gray-900">
                  {result.period}
                </p>
              </div>
            </div>

            {/* 策略说明 */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>策略说明：</strong>
                {result.strategy === 'ma' ? 
                  '均线策略：短期均线（5日）上穿长期均线（20日）买入，下穿卖出。' :
                  '动量策略：单日涨幅超过3%买入，持仓后下跌超过3%卖出。'
                }
              </p>
            </div>
          </div>

          {/* 净值曲线图表 */}
          <div className="bg-white rounded-lg p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span>📈</span> 策略净值曲线 vs 基准
            </h3>
            
            <div className="w-full h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    interval="preserveStartEnd"
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    domain={['auto', 'auto']}
                  />
                  <Tooltip 
                    formatter={(value: any) => [value.toFixed(2), '']}
                    labelFormatter={(label) => `日期: ${label}`}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="策略净值" 
                    stroke="#4F46E5" 
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="基准净值"
                    stroke="#9CA3AF" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 最近交易记录 */}
          {result.trades && result.trades.length > 0 && (
            <div className="bg-white rounded-lg p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span>📋</span> 最近交易记录
              </h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left font-semibold">日期</th>
                      <th className="px-4 py-2 text-left font-semibold">类型</th>
                      <th className="px-4 py-2 text-right font-semibold">价格</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.trades.map((trade: any, idx: number) => (
                      <tr key={idx} className="border-t border-gray-200">
                        <td className="px-4 py-2">{trade.date}</td>
                        <td className="px-4 py-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            trade.type === 'buy' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {trade.type === 'buy' ? '买入' : '卖出'}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-right font-medium">${trade.price.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 免责声明 */}
      <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-800">
          <strong>⚠️ 风险提示：</strong>
          历史回测结果不代表未来表现。量化策略存在过拟合风险，实际交易请谨慎决策。
        </p>
      </div>
    </div>
  );
}
