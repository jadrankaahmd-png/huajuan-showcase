'use client';

import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import CapabilityCard from '../components/CapabilityCard';
import CapabilityDetail from '../components/CapabilityDetail';

interface Capability {
  id: string;
  name: string;
  description: string;
  category: string;
  categoryName: string;
  type: string;
  status: 'active' | 'pending' | 'inactive';
  icon: string;
  details: any;
}

interface Category {
  category: string;
  name: string;
  items: Capability[];
}

export default function Home() {
  const [capabilities, setCapabilities] = useState<Category[]>([]);
  const [selectedCapability, setSelectedCapability] = useState<any>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    mainCapabilities: 0,
    knowledge: 0,
    books: 0,
    subPages: 0,
    active: 0,
    categories: 0
  });

  // 从 API 加载能力数据
  useEffect(() => {
    async function fetchCapabilities() {
      try {
        setIsLoading(true);
        setError(null);
        
        const res = await fetch('/api/capabilities');
        
        if (!res.ok) {
          throw new Error(`API 返回错误: ${res.status} ${res.statusText}`);
        }
        
        const data = await res.json();
        
        // 检查返回的数据格式
        if (!data || !Array.isArray(data.capabilities)) {
          throw new Error('API 返回数据格式错误');
        }
        
        // 处理分类数据
        const categoryMap = new Map<string, Category>();
        const allCaps = data.capabilities || [];
        
        let activeCount = 0;
        
        for (const cat of allCaps) {
          if (!cat || !cat.category || !Array.isArray(cat.items)) {
            continue; // 跳过无效数据
          }
          
          categoryMap.set(cat.category, {
            category: cat.category,
            name: cat.name || cat.category,
            items: cat.items.filter((item: Capability) => item && item.status === 'active')
          });
          
          activeCount += cat.items.filter((item: Capability) => item && item.status === 'active').length;
        }
        
        setCapabilities(Array.from(categoryMap.values()));
        setStats({
          total: data.stats?.grandTotal || 0,
          mainCapabilities: data.stats?.mainCapabilities || 0,
          knowledge: data.stats?.knowledge || 0,
          books: data.stats?.books || 0,
          subPages: (data.stats?.iran || 0) + (data.stats?.telegram || 0) + (data.stats?.qveris || 0),
          active: activeCount,
          categories: categoryMap.size
        });
      } catch (error) {
        console.error('Error fetching capabilities:', error);
        setError(error instanceof Error ? error.message : '加载能力数据失败');
        // 设置空数据，防止页面崩溃
        setCapabilities([]);
        setStats({ total: 0, mainCapabilities: 0, knowledge: 0, books: 0, subPages: 0, active: 0, categories: 0 });
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchCapabilities();
  }, []);

  const filteredCapabilities = activeCategory === 'all'
    ? capabilities
    : capabilities.filter(cat => cat.category === activeCategory);

  // 错误状态
  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <Navigation currentLayer={1} />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">加载失败</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
            >
              重新加载
            </button>
          </div>
        </div>
      </main>
    );
  }

  // 加载状态
  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <Navigation currentLayer={1} />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
            <p className="mt-4 text-gray-600">加载能力中心...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* 统一导航栏 */}
      <Navigation currentLayer={1} />


      {/* Header */}
      <header className="bg-white shadow-sm">
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
                <div className="text-xs text-gray-400">主能力+知识库+子页面</div>
              </div>
              <div className="bg-blue-50 px-4 py-2 rounded-lg">
                <div className="text-blue-600 font-semibold">{stats.mainCapabilities}</div>
                <div className="text-gray-600">主能力</div>
                <div className="text-xs text-gray-400">SQLite+自定义</div>
              </div>
              <div className="bg-purple-50 px-4 py-2 rounded-lg">
                <div className="text-purple-600 font-semibold">{stats.knowledge + stats.books}</div>
                <div className="text-gray-600">知识库</div>
                <div className="text-xs text-gray-400">条目{stats.knowledge}+书籍{stats.books}</div>
              </div>
              <div className="bg-green-50 px-4 py-2 rounded-lg">
                <div className="text-green-600 font-semibold">{stats.subPages}</div>
                <div className="text-gray-600">子页面</div>
                <div className="text-xs text-gray-400">伊朗+Telegram+QVeris</div>
              </div>
              <div className="bg-orange-50 px-4 py-2 rounded-lg">
                <div className="text-orange-600 font-semibold">{stats.active}</div>
                <div className="text-gray-600">正常运行</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Category Filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-2 overflow-x-auto pb-2">
          <a
            href="/coe/iran-geopolitical-risk"
            className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg hover:from-red-600 hover:to-orange-600 transition-all"
          >
            🌍 伊朗局势监控
          </a>
          <a
            href="/coe/telegram-news"
            className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap bg-gradient-to-r from-blue-400 to-cyan-500 text-white shadow-lg hover:from-blue-500 hover:to-cyan-600 transition-all"
          >
            📱 Telegram新闻
          </a>
          <a
            href="/coe/knowledge-base"
            className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap bg-purple-500 text-white shadow-lg hover:bg-purple-600 transition-colors"
          >
            📚 知识库
          </a>
          <a
            href="/coe/qveris"
            className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg hover:from-green-600 hover:to-blue-600 transition-all"
          >
            📊 QVeris美股数据
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
              {cat.name} ({cat.items.length})
            </button>
          ))}
        </div>
      </div>

      {/* Capabilities Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {filteredCapabilities.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            暂无能力数据
          </div>
        ) : (
          filteredCapabilities.map(cat => (
            <div key={cat.category} className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-3xl">{cat.items[0]?.icon || '📋'}</span>
                {cat.name}
                <span className="text-sm font-normal text-gray-500">
                  ({cat.items.length} 个能力)
                </span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {cat.items.map((capability, index) => (
                  <CapabilityCard
                    key={index}
                    capability={capability}
                    onClick={() => setSelectedCapability(capability)}
                  />
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Detail Modal */}
      {selectedCapability && (
        <CapabilityDetail
          capability={selectedCapability}
          onClose={() => setSelectedCapability(null)}
        />
      )}
    </main>
  );
}
