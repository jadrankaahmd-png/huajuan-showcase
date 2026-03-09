'use client';

import Navigation from '@/components/Navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Home() {
  const [totalCapabilities, setTotalCapabilities] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchCapabilities() {
      try {
        const res = await fetch('/api/capabilities');
        const data = await res.json();
        setTotalCapabilities(data.stats?.grandTotal || 0);
      } catch (error) {
        console.error('Error fetching capabilities:', error);
        setTotalCapabilities(0);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCapabilities();
  }, []);
  
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* 统一导航栏 */}
      <Navigation currentLayer={0} />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-8xl mb-6 animate-pulse">🌸</div>
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              花卷美股智能投资系统
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              基于AI的三层架构投资系统，从数据采集、智能分析到真实选股，全流程自动化投资决策
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <div className="bg-white px-6 py-3 rounded-lg shadow-md">
                <div className="text-3xl font-bold text-pink-600">
                  {isLoading ? '...' : totalCapabilities}+
                </div>
                <div className="text-sm text-gray-600">总能力</div>
              </div>
              <div className="bg-white px-6 py-3 rounded-lg shadow-md">
                <div className="text-3xl font-bold text-purple-600">3</div>
                <div className="text-sm text-gray-600">层级架构</div>
              </div>
              <div className="bg-white px-6 py-3 rounded-lg shadow-md">
                <div className="text-3xl font-bold text-blue-600">AI</div>
                <div className="text-sm text-gray-600">智能驱动</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* 装饰元素 */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </section>

      {/* 三层架构介绍 */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">三层架构</h2>
            <p className="text-lg text-gray-600">从数据到决策的完整链路</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* 第一层 */}
            <Link href="/coe" className="group">
              <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-2xl p-8 h-full transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                <div className="text-6xl mb-4">🧠</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">第一层：能力中心</h3>
                <p className="text-gray-600 mb-4">
                  数据采集与基础能力层，包含{totalCapabilities}+个能力
                </p>
                <ul className="text-sm text-gray-500 space-y-2 mb-6">
                  <li>✓ 全球宏观地缘风险监控</li>
                  <li>✓ 实时数据采集（美股/ETF/加密货币）</li>
                  <li>✓ 新闻情绪分析</li>
                  <li>✓ Telegram新闻流</li>
                  <li>✓ 知识库系统</li>
                </ul>
                <div className="flex items-center text-pink-600 font-semibold group-hover:translate-x-2 transition-transform">
                  进入能力中心 →
                </div>
              </div>
            </Link>

            {/* 第二层 */}
            <Link href="/dynamic-model" className="group">
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8 h-full transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                <div className="text-6xl mb-4">⚡</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">第二层：动态模型</h3>
                <p className="text-gray-600 mb-4">
                  AI分析与量化策略层，智能研判市场
                </p>
                <ul className="text-sm text-gray-500 space-y-2 mb-6">
                  <li>✓ AI自动研究引擎</li>
                  <li>✓ 量化策略回测</li>
                  <li>✓ 市场情绪分析</li>
                  <li>✓ AI美股市场分析师</li>
                  <li>✓ QVeris 万级数据接入</li>
                </ul>
                <div className="flex items-center text-purple-600 font-semibold group-hover:translate-x-2 transition-transform">
                  进入动态模型 →
                </div>
              </div>
            </Link>

            {/* 第三层 */}
            <Link href="/stock-picker" className="group">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 h-full transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                <div className="text-6xl mb-4">🎯</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">第三层：选股推荐</h3>
                <p className="text-gray-600 mb-4">
                  真实选股推荐层，输出投资决策
                </p>
                <ul className="text-sm text-gray-500 space-y-2 mb-6">
                  <li>✓ 智能选股系统</li>
                  <li>✓ 风险评估模型</li>
                  <li>✓ 投资组合优化</li>
                  <li>✓ 实时推荐更新</li>
                  <li>✓ 回测验证</li>
                </ul>
                <div className="flex items-center text-blue-600 font-semibold group-hover:translate-x-2 transition-transform">
                  进入选股推荐 →
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 核心优势 */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">核心优势</h2>
            <p className="text-lg text-gray-600">AI驱动的美股投资决策系统</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-5xl mb-4">📊</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{totalCapabilities}+能力</h3>
              <p className="text-gray-600 text-sm">数据采集、分析、监控全覆盖</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">🤖</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">AI驱动</h3>
              <p className="text-gray-600 text-sm">智能分析、自动研判</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">⚡</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">实时数据</h3>
              <p className="text-gray-600 text-sm">全球数据实时更新</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">🎯</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">真实推荐</h3>
              <p className="text-gray-600 text-sm">可执行的投资建议</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600">
          <p>🌸 花卷美股智能投资系统 © 2026</p>
          <p className="text-sm mt-2">AI-Powered US Stock Investment System</p>
        </div>
      </footer>
    </main>
  );
}
