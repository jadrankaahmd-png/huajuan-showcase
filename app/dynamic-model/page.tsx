'use client';

import Navigation from '@/components/Navigation';
import Link from 'next/link';

export default function DynamicModelPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <Navigation currentLayer={2} />
      
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-6">🧠</div>
          <h1 className="text-4xl font-bold text-white mb-4">
            花卷动态模型
          </h1>
          <p className="text-xl text-gray-300">
            第二层 · 智能选股引擎
          </p>
        </div>
        
        {/* Coming Soon Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
          <div className="flex items-center justify-center mb-6">
            <div className="text-5xl animate-pulse">🚧</div>
          </div>
          
          <h2 className="text-2xl font-bold text-white text-center mb-4">
            即将上线
          </h2>
          
          <p className="text-gray-300 text-center mb-8">
            我们正在打造全球最强动态选股模型，敬请期待！
          </p>
          
          {/* Features Preview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="text-2xl mb-2">📊</div>
              <h3 className="text-white font-semibold mb-2">多因子选股模型</h3>
              <p className="text-gray-400 text-sm">
                整合第一层所有能力进行深度分析
              </p>
            </div>
            
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="text-2xl mb-2">🤖</div>
              <h3 className="text-white font-semibold mb-2">机器学习预测</h3>
              <p className="text-gray-400 text-sm">
                基于历史数据训练的智能预测系统
              </p>
            </div>
            
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="text-2xl mb-2">📈</div>
              <h3 className="text-white font-semibold mb-2">自动优化</h3>
              <p className="text-gray-400 text-sm">
                随第一层能力扩充自动优化模型
              </p>
            </div>
            
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="text-2xl mb-2">🔄</div>
              <h3 className="text-white font-semibold mb-2">自我反思</h3>
              <p className="text-gray-400 text-sm">
                根据投资盈亏结果持续改进
              </p>
            </div>
          </div>
          
          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>开发进度</span>
              <span>0%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full" style={{ width: '0%' }}></div>
            </div>
          </div>
          
          {/* CTA */}
          <div className="flex justify-center space-x-4">
            <Link
              href="/"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              返回能力中心
            </Link>
            <Link
              href="/stock-picker"
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
            >
              查看第三层
            </Link>
          </div>
        </div>
        
        {/* Architecture Info */}
        <div className="mt-12 text-center">
          <p className="text-gray-400 text-sm">
            花卷三层架构 · 第一层（能力中心）→ 第二层（动态模型）→ 第三层（选股）
          </p>
        </div>
      </div>
    </div>
  );
}
