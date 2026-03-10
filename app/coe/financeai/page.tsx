'use client';

import { useState } from 'react';
import FinancialTools from '@/components/FinancialTools';

export default function FinanceAIPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* 统一导航栏 */}
      <div className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <a href="/coe" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                <span className="text-3xl">🌸</span>
                <div>
                  <div className="text-xl font-bold text-gray-900">花卷</div>
                  <div className="text-xs text-gray-500">智能投资系统</div>
                </div>
              </a>
            </div>
            
            {/* 返回按钮 */}
            <a
              href="/coe"
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              ← 返回能力中心
            </a>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <span className="text-4xl">📊</span>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">AI财报分析工具</h1>
                <p className="text-sm text-gray-500">基于 Financial Datasets API（17,000+ 公司 30 年数据）</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* AI财报分析工具 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <FinancialTools />
      </div>

      {/* 页脚说明 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="bg-pink-50 border-l-4 border-pink-500 p-4 sm:p-6 rounded-r-lg">
          <div className="flex flex-col sm:flex-row">
            <div className="text-3xl sm:text-4xl mr-0 sm:mr-4 mb-3 sm:mb-0">💡</div>
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-pink-900 mb-2">使用说明</h3>
              <p className="text-sm sm:text-base text-pink-800 leading-relaxed">
                本工具基于 Financial Datasets API，支持17,000+家公司30年历史数据。
                所有数据均为真实财务数据，无模拟数据。支持自然语言查询，无需编写 SQL。
              </p>
              <div className="mt-3 sm:mt-4 flex flex-wrap gap-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
                  🎯 财报快速扫描
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
                  ⚖️ 公司对比分析
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
                  🔍 SEC关键词追踪
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
