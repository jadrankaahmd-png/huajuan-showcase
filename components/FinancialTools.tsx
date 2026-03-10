'use client';

import React, { useState } from 'react';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div hidden={value !== index} {...other}>
      {value === index && <div className="py-6">{children}</div>}
    </div>
  );
}

export default function FinancialTools() {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<any>(null);

  // 财报快速扫描器
  const [scannerTicker, setScannerTicker] = useState('NVDA');

  // 公司对比分析器
  const [compareTickers, setCompareTickers] = useState('NVDA,AMD,AVGO');

  // SEC关键词追踪器
  const [secTicker, setSecTicker] = useState('NVDA');
  const [secKeyword, setSecKeyword] = useState('AI');

  const handleScanFinancials = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/financial-scanner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticker: scannerTicker }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '扫描失败');
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCompareCompanies = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const tickers = compareTickers.split(',').map((t) => t.trim()).filter(Boolean);

      if (tickers.length < 2) {
        throw new Error('需要至少2个股票代码');
      }

      const response = await fetch('/api/company-comparator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tickers }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '对比失败');
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTrackKeyword = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/sec-keyword-tracker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticker: secTicker,
          keyword: secKeyword,
          filingType: '10-K',
          years: 5,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '追踪失败');
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h2 className="text-2xl font-bold text-blue-600 mb-2">
        🚀 AI财报分析工具（Financial Datasets API）
      </h2>
      <p className="text-gray-600 mb-4">
        基于真实财务数据，支持17,000+家公司30年历史数据
      </p>

      {/* 标签页导航 */}
      <div className="border-b border-gray-200 mb-4">
        <div className="flex space-x-4">
          <button
            onClick={() => {
              setTabValue(0);
              setResult(null);
              setError('');
            }}
            className={`px-4 py-2 font-medium ${
              tabValue === 0
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            📊 财报快速扫描
          </button>
          <button
            onClick={() => {
              setTabValue(1);
              setResult(null);
              setError('');
            }}
            className={`px-4 py-2 font-medium ${
              tabValue === 1
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            ⚖️ 公司对比分析
          </button>
          <button
            onClick={() => {
              setTabValue(2);
              setResult(null);
              setError('');
            }}
            className={`px-4 py-2 font-medium ${
              tabValue === 2
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            🔍 SEC关键词追踪
          </button>
        </div>
      </div>

      {/* 标签1：财报快速扫描 */}
      <TabPanel value={tabValue} index={0}>
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
          💡 快速扫描任意公司过去5年财报核心指标：收入增长率、毛利率、净利率、自由现金流、ROE
        </div>

        <div className="flex gap-4 mb-4">
          <input
            type="text"
            placeholder="NVDA"
            value={scannerTicker}
            onChange={(e) => setScannerTicker(e.target.value.toUpperCase())}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleScanFinancials}
            disabled={loading || !scannerTicker}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading && <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>}
            {loading ? '扫描中...' : '📈 开始扫描'}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
            {error}
          </div>
        )}

        {result && (
          <div>
            <h3 className="text-xl font-bold mb-4">
              📊 {result.ticker} 过去5年财报核心指标
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 收入增长率 */}
              <div className="border rounded-lg p-4">
                <h4 className="text-sm text-gray-600 mb-2">📈 收入增长率</h4>
                {result.metrics.revenueGrowth.map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between py-1">
                    <span>{item.year}</span>
                    <span className={`px-2 py-1 rounded text-sm ${
                      item.value > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {item.value.toFixed(2)}%
                    </span>
                  </div>
                ))}
              </div>

              {/* 毛利率 */}
              <div className="border rounded-lg p-4">
                <h4 className="text-sm text-gray-600 mb-2">💰 毛利率</h4>
                {result.metrics.grossMargin.map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between py-1">
                    <span>{item.year}</span>
                    <span className="px-2 py-1 rounded text-sm bg-blue-100 text-blue-800">
                      {item.value.toFixed(2)}%
                    </span>
                  </div>
                ))}
              </div>

              {/* 净利率 */}
              <div className="border rounded-lg p-4">
                <h4 className="text-sm text-gray-600 mb-2">💵 净利率</h4>
                {result.metrics.netMargin.map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between py-1">
                    <span>{item.year}</span>
                    <span className={`px-2 py-1 rounded text-sm ${
                      item.value > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {item.value.toFixed(2)}%
                    </span>
                  </div>
                ))}
              </div>

              {/* ROE */}
              <div className="border rounded-lg p-4">
                <h4 className="text-sm text-gray-600 mb-2">📊 ROE（净资产收益率）</h4>
                {result.metrics.roe.map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between py-1">
                    <span>{item.year}</span>
                    <span className="px-2 py-1 rounded text-sm bg-purple-100 text-purple-800">
                      {item.value.toFixed(2)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </TabPanel>

      {/* 标签2：公司对比分析 */}
      <TabPanel value={tabValue} index={1}>
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
          💡 对比多家公司财务表现：收入规模、增长率、利润率、ROE
        </div>

        <div className="flex gap-4 mb-4">
          <input
            type="text"
            placeholder="NVDA,AMD,AVGO"
            value={compareTickers}
            onChange={(e) => setCompareTickers(e.target.value.toUpperCase())}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleCompareCompanies}
            disabled={loading || compareTickers.split(',').length < 2}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading && <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>}
            {loading ? '对比中...' : '⚖️ 开始对比'}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
            {error}
          </div>
        )}

        {result && (
          <div>
            <h3 className="text-xl font-bold mb-4">
              📊 公司对比分析
            </h3>

            <div className="border rounded-lg p-4 mb-4">
              <h4 className="text-sm text-gray-600 mb-4">💰 收入规模（$B）</h4>
              <div className="flex gap-8 flex-wrap">
                {result.comparison.map((item: any, idx: number) => (
                  <div key={idx} className="text-center">
                    <div className="text-lg font-bold text-blue-600">{item.ticker}</div>
                    <div className="text-2xl font-bold">${(item.revenue / 1e9).toFixed(2)}B</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <h4 className="text-sm text-gray-600 mb-4">💎 毛利率对比</h4>
                {result.comparison.map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between py-2">
                    <span className="font-medium">{item.ticker}</span>
                    <span className="px-2 py-1 rounded text-sm bg-blue-100 text-blue-800">
                      {item.grossMargin.toFixed(2)}%
                    </span>
                  </div>
                ))}
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="text-sm text-gray-600 mb-4">📊 ROE 对比</h4>
                {result.comparison.map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between py-2">
                    <span className="font-medium">{item.ticker}</span>
                    <span className="px-2 py-1 rounded text-sm bg-purple-100 text-purple-800">
                      {item.roe.toFixed(2)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </TabPanel>

      {/* 标签3：SEC关键词追踪 */}
      <TabPanel value={tabValue} index={2}>
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
          💡 追踪 SEC 文件中关键词出现频率趋势，发现公司战略变化
        </div>

        <div className="flex gap-4 mb-4">
          <input
            type="text"
            placeholder="NVDA"
            value={secTicker}
            onChange={(e) => setSecTicker(e.target.value.toUpperCase())}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="AI"
            value={secKeyword}
            onChange={(e) => setSecKeyword(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleTrackKeyword}
            disabled={loading || !secTicker || !secKeyword}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading && <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>}
            {loading ? '追踪中...' : '🔍 开始追踪'}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
            {error}
          </div>
        )}

        {result && (
          <div>
            <h3 className="text-xl font-bold mb-4">
              📊 "{result.keyword}" 关键词趋势（{result.ticker}）
            </h3>

            <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-4">
              总计出现：<strong>{result.totalCount}</strong> 次
              {result.trendDirection === 'increasing' && ' 🚀 快速增长'}
              {result.trendDirection === 'decreasing' && ' 📉 快速下降'}
              {result.trendDirection === 'stable' && ' ➡️ 趋势稳定'}
            </div>

            <div className="border rounded-lg p-4">
              <h4 className="text-sm text-gray-600 mb-4">年度出现次数</h4>
              {result.trend.map((item: any, idx: number) => {
                const barLength = Math.min(item.count / 10, 20);
                return (
                  <div key={idx} className="py-1">
                    <span>
                      {item.year} ({item.type}): {'█'.repeat(barLength)} {item.count}次
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </TabPanel>
    </div>
  );
}
