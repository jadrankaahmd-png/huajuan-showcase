'use client';

import { useState } from 'react';
import CapabilityCard from './components/CapabilityCard';
import CapabilityDetail from './components/CapabilityDetail';
import { capabilities } from './data/capabilities';

// 在组件外预计算统计数据（静态导出时可用）
const stats = {
  total: capabilities.reduce((sum, cat) => sum + cat.items.length, 0),
  active: capabilities.reduce((sum, cat) =>
    sum + cat.items.filter((item: any) => item.status === 'active').length, 0
  ),
  categories: capabilities.length
};

export default function Home() {
  const [selectedCapability, setSelectedCapability] = useState<any>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filteredCapabilities = activeCategory === 'all'
    ? capabilities
    : capabilities.filter(cat => cat.category === activeCategory);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <span className="text-4xl">🌸</span>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">花卷能力中心</h1>
                <p className="text-sm text-gray-500">完整展示花卷的所有能力</p>
              </div>
            </div>
            <div className="flex gap-4 text-sm flex-wrap">
              <div className="bg-pink-50 px-4 py-2 rounded-lg">
                <div className="text-pink-600 font-semibold">{stats.total}</div>
                <div className="text-gray-600">总能力</div>
              </div>
              <div className="bg-green-50 px-4 py-2 rounded-lg">
                <div className="text-green-600 font-semibold">{stats.active}</div>
                <div className="text-gray-600">正常运行</div>
              </div>
              <div className="bg-blue-50 px-4 py-2 rounded-lg">
                <div className="text-blue-600 font-semibold">{stats.categories}</div>
                <div className="text-gray-600">分类</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Category Filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-2 overflow-x-auto pb-2">
          <a
            href="/iran-geopolitical-risk"
            className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg hover:from-red-600 hover:to-orange-600 transition-all"
          >
            🌍 伊朗局势监控
          </a>
          <a
            href="/skills"
            className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg hover:from-blue-600 hover:to-purple-600 transition-all"
          >
            ⚡ 新技能中心
          </a>
          <a
            href="/knowledge-base"
            className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap bg-purple-500 text-white shadow-lg hover:bg-purple-600 transition-colors"
          >
            📚 知识库
          </a>
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              activeCategory === 'all'
                ? 'bg-pink-500 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            全部能力
          </button>
          {capabilities.map(cat => (
            <button
              key={cat.category}
              onClick={() => setActiveCategory(cat.category)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeCategory === cat.category
                  ? 'bg-pink-500 text-white shadow-lg'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Capabilities Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {filteredCapabilities.map(category => (
          <div key={category.category} className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">{category.icon}</span>
              <h2 className="text-xl font-bold text-gray-800">{category.name}</h2>
              <span className="text-sm text-gray-500">({category.items.length})</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {category.items.map((item: any, idx: number) => (
                <CapabilityCard
                  key={`${category.category}-${idx}`}
                  capability={item}
                  onClick={() => setSelectedCapability({ ...item, category: category.name })}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {selectedCapability && (
        <CapabilityDetail
          capability={selectedCapability}
          onClose={() => setSelectedCapability(null)}
        />
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between text-sm text-gray-600 gap-2">
            <div className="flex items-center gap-2">
              <span>🌸</span>
              <span>花卷能力展示页 v1.0</span>
            </div>
            <div className="text-center sm:text-right text-gray-500">
              自动更新机制：每当花卷新增能力，本页面自动同步
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
