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
  status: string;
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
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    categories: 0
  });

  // 从 API 加载能力数据
  useEffect(() => {
    async function fetchCapabilities() {
      try {
        const res = await fetch('/api/capabilities');
        const data = await res.json();
        
        // 将扁平化的能力按分类分组
        const categoryMap = new Map<string, Category>();
        const allCaps = data.capabilities || [];
        
        let activeCount = 0;
        
        for (const cap of allCaps) {
          const category = cap.category;
          
          if (!categoryMap.has(category)) {
            categoryMap.set(category, {
              category: category,
              name: cap.categoryName || category,
              items: []
            });
          }
          
          categoryMap.get(category)!.items.push(cap);
          
          if (cap.status === 'active') {
            activeCount++;
          }
        }
        
        setCapabilities(Array.from(categoryMap.values()));
        setStats({
          total: data.stats?.total || allCaps.length,
          active: activeCount,
          categories: categoryMap.size
        });
      } catch (error) {
        console.error('Error fetching capabilities:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchCapabilities();
  }, []);

  const filteredCapabilities = activeCategory === 'all'
    ? capabilities
    : capabilities.filter(cat => cat.category === activeCategory);

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
              </div>
              <div className="bg-green-50 px-4 py-2 rounded-lg">
                <div className="text-green-600 font-semibold">{stats.active}</div>
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
        {filteredCapabilities.map(cat => (
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
        ))}
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
