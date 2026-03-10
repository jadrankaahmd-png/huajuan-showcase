'use client';

import { useState } from 'react';
import FinancialTools from '@/components/FinancialTools';

export default function FinanceAIPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* 导航栏 */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <a href="/coe" className="text-gray-600 hover:text-gray-900">
                ← 返回能力中心
              </a>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-3xl">🌸</span>
              <div>
                <h1 className="text-xl font-bold text-gray-900">AI财报分析工具</h1>
                <p className="text-xs text-gray-500">基于 Financial Datasets API</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI财报分析工具 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <FinancialTools />
      </div>

      {/* 页脚说明 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
          <div className="flex">
            <div className="text-2xl mr-3">💡</div>
            <div>
              <h3 className="text-sm font-semibold text-blue-900 mb-1">使用说明</h3>
              <p className="text-sm text-blue-800">
                本工具基于 Financial Datasets API，支持17,000+家公司30年历史数据。
                所有数据均为真实财务数据，无模拟数据。
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
