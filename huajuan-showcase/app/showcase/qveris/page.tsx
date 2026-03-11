'use client';

import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import StockQuery from '@/components/qveris/StockQuery';
import StockRanking from '@/components/qveris/StockRanking';
import StockAnalysis from '@/components/qveris/StockAnalysis';
import AlertSettings from '@/components/qveris/AlertSettings';
import Backtest from '@/components/qveris/Backtest';
import MarketAnalyst from '@/components/qveris/MarketAnalyst';

interface QVerisCapability {
  name: string;
  description: string;
  type: string;
  status: string;
}

export default function QVerisPage() {
  const [capabilities, setCapabilities] = useState<QVerisCapability[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchCapabilities() {
      try {
        const res = await fetch('/api/qveris-capabilities');
        const data = await res.json();
        setCapabilities(data.capabilities || []);
      } catch (error) {
        console.error('Error fetching capabilities:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCapabilities();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl shadow-lg p-8 border border-green-100 mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <span className="text-5xl">📊</span>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">QVeris 美股实时数据</h1>
                <p className="text-gray-600">万级数据接入 · 实时行情 · 深度分析</p>
              </div>
            </div>
            <div className="flex gap-4 text-sm">
              <div className="bg-white px-4 py-2 rounded-lg">
                <div className="text-green-600 font-semibold">万级</div>
                <div className="text-gray-600">数据接口</div>
              </div>
              <div className="bg-white px-4 py-2 rounded-lg">
                <div className="text-blue-600 font-semibold">实时</div>
                <div className="text-gray-600">行情数据</div>
              </div>
            </div>
          </div>

          {/* 能力列表 */}
          {!isLoading && capabilities.length > 0 && (
            <div className="mt-6 pt-6 border-t border-green-200">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">QVeris 能力清单（{capabilities.length}条）</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {capabilities.map((cap, idx) => (
                  <div 
                    key={idx}
                    className="bg-white px-3 py-2 rounded-lg text-sm flex items-center gap-2"
                  >
                    <span className={cap.status === 'active' ? 'text-green-600' : 'text-gray-400'}>
                      {cap.status === 'active' ? '✓' : '○'}
                    </span>
                    <span className="text-gray-700">{cap.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 功能模块网格 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 美股实时查询 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🔍</span>
              <h2 className="text-xl font-bold text-gray-900">美股实时查询</h2>
            </div>
            <StockQuery />
          </div>

          {/* 美股涨幅实时榜单 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">📈</span>
              <h2 className="text-xl font-bold text-gray-900">美股涨幅实时榜单</h2>
            </div>
            <StockRanking />
          </div>

          {/* 个股深度研判 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🔬</span>
              <h2 className="text-xl font-bold text-gray-900">个股深度研判</h2>
            </div>
            <StockAnalysis />
          </div>

          {/* 价格预警设置 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🔔</span>
              <h2 className="text-xl font-bold text-gray-900">价格预警设置</h2>
            </div>
            <AlertSettings />
          </div>

          {/* 美股量化策略回测 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">📊</span>
              <h2 className="text-xl font-bold text-gray-900">美股量化策略回测</h2>
            </div>
            <Backtest />
          </div>

          {/* AI美股市场分析师 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🤖</span>
              <h2 className="text-xl font-bold text-gray-900">AI美股市场分析师</h2>
            </div>
            <MarketAnalyst />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>QVeris API · 万级数据接入 · 实时行情 · 深度分析</p>
        </div>
      </div>
    </main>
  );
}
