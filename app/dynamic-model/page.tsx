'use client';

import Navigation from '@/components/Navigation';

export default function DynamicModelPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Navigation currentLayer={2} />
      
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-6">✨</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            花卷动态模型
          </h1>
          <p className="text-xl text-gray-600">
            第二层 · 智能选股引擎
          </p>
        </div>
        
        {/* Autoresearch Engine Card */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl shadow-lg p-8 border border-blue-100 mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="text-5xl">🧬</div>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-3">
            AI自动研究引擎
          </h2>
          
          <div className="flex justify-center mb-4">
            <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium">
              ✅ 已就绪（可直接运行）
            </span>
          </div>
          
          <p className="text-gray-700 text-center mb-6 max-w-2xl mx-auto">
            AI自主循环优化选股模型参数，每5分钟一次实验，自动寻找最优神经网络架构和超参数
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-2xl mb-2">⏱️</div>
              <h3 className="text-gray-900 font-semibold mb-1">固定时间预算</h3>
              <p className="text-gray-600 text-sm">每次实验5分钟</p>
            </div>
            
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-2xl mb-2">🔄</div>
              <h3 className="text-gray-900 font-semibold mb-1">自主优化</h3>
              <p className="text-gray-600 text-sm">自动修改架构和超参数</p>
            </div>
            
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-2xl mb-2">📊</div>
              <h3 className="text-gray-900 font-semibold mb-1">性能追踪</h3>
              <p className="text-gray-600 text-sm">验证集bits per byte</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 mb-6">
            <h3 className="text-gray-900 font-semibold mb-2 flex items-center gap-2">
              <span>📁</span> 本地路径
            </h3>
            <code className="text-sm text-gray-700 bg-gray-50 px-3 py-2 rounded block overflow-x-auto">
              ~/.openclaw/workspace/autoresearch-macos/
            </code>
          </div>
          
          <div className="flex justify-center gap-4">
            <a
              href="https://github.com/miolini/autoresearch-macos"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
            >
              查看GitHub
            </a>
          </div>
        </div>
        
        {/* Zread 源码自检系统 */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl shadow-lg p-8 border border-purple-100 mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="text-5xl">🔍</div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 text-center mb-3">
            Zread 源码自检系统
          </h2>

          <div className="flex justify-center mb-4">
            <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
              ✅ 已就绪
            </span>
          </div>

          <p className="text-gray-700 text-center mb-6 max-w-2xl mx-auto">
            花卷可以检索自己的 OpenClaw 源代码，进行自我分析和优化
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-2xl mb-2">📚</div>
              <h3 className="text-gray-900 font-semibold mb-1">源码检索</h3>
              <p className="text-gray-600 text-sm">搜索 OpenClaw 代码库</p>
            </div>
            
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-2xl mb-2">🤖</div>
              <h3 className="text-gray-900 font-semibold mb-1">自我优化</h3>
              <p className="text-gray-600 text-sm">分析并改进自身能力</p>
            </div>
          </div>
          
          <div className="flex justify-center gap-4">
            <a
              href="https://z.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-colors"
            >
              访问官网
            </a>
          </div>
        </div>
        
        {/* 第三层预告 */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl shadow-lg p-8 border border-yellow-100">
          <div className="flex items-center justify-center mb-4">
            <div className="text-5xl">🎯</div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 text-center mb-3">
            第三层：花卷选股推荐
          </h2>

          <div className="flex justify-center mb-4">
            <span className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
              ⏳ 开发中
            </span>
          </div>

          <p className="text-gray-700 text-center mb-6 max-w-2xl mx-auto">
            整合第一层、第二层所有能力，生成动态选股推荐，提供买卖建议和风险管理
          </p>

          <div className="flex justify-center">
            <a
              href="/stock-picker"
              className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-medium transition-colors"
            >
              进入第三层
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
