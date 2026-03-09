'use client';

import Navigation from '@/components/Navigation';
import Link from 'next/link';

export default function StockPickerPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Navigation currentLayer={3} />
      
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-6">🌸</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            花卷选股
          </h1>
          <p className="text-xl text-gray-600">
            第三层 · 智能股票推荐
          </p>
        </div>
        
        {/* Coming Soon Card */}
        <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
          <div className="flex items-center justify-center mb-6">
            <div className="text-5xl">🔍</div>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">
            即将上线
          </h2>
          
          <p className="text-gray-600 text-center mb-8">
            基于第二层动态模型的智能选股系统，让投资决策更简单！
          </p>
          
          {/* Features Preview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <div className="text-2xl mb-2">🔎</div>
              <h3 className="text-gray-900 font-semibold mb-2">智能搜索</h3>
              <p className="text-gray-600 text-sm">
                输入任何内容，获得深度分析报告
              </p>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
              <div className="text-2xl mb-2">⭐</div>
              <h3 className="text-gray-900 font-semibold mb-2">个性化推荐</h3>
              <p className="text-gray-600 text-sm">
                根据投资偏好推荐最佳股票
              </p>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4 border border-green-100">
              <div className="text-2xl mb-2">📊</div>
              <h3 className="text-gray-900 font-semibold mb-2">详细分析</h3>
              <p className="text-gray-600 text-sm">
                整合第一层所有能力的全面分析
              </p>
            </div>
            
            <div className="bg-orange-50 rounded-lg p-4 border border-orange-100">
              <div className="text-2xl mb-2">💼</div>
              <h3 className="text-gray-900 font-semibold mb-2">投资组合</h3>
              <p className="text-gray-600 text-sm">
                管理和优化你的投资组合
              </p>
            </div>
          </div>
          
          {/* Search Preview */}
          <div className="mb-8">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="text-gray-600 text-sm mb-3">搜索预览</div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="输入股票代码、公司名称或任何关键词..."
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  disabled
                />
                <div className="absolute right-3 top-3 text-gray-400">
                  🔒
                </div>
              </div>
            </div>
          </div>
          
          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>开发进度</span>
              <span>0%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full" style={{ width: '0%' }}></div>
            </div>
          </div>
          
          {/* CTA */}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/"
              className="px-6 py-3 bg-pink-50 hover:bg-pink-100 text-pink-600 rounded-lg font-medium transition-colors text-center"
            >
              返回能力中心
            </Link>
            <Link
              href="/dynamic-model"
              className="px-6 py-3 bg-purple-50 hover:bg-purple-100 text-purple-600 rounded-lg font-medium transition-colors text-center"
            >
              查看第二层
            </Link>
          </div>
        </div>
        
        {/* Architecture Info */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm">
            花卷三层架构 · 第一层（能力中心）→ 第二层（动态模型）→ 第三层（选股）
          </p>
        </div>
      </div>
    </main>
  );
}
