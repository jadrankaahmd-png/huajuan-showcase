'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface ShowcaseItem {
  name: string;
  href: string;
  icon: string;
  description: string;
  color: string;
}

export default function ShowcasePage() {
  const [items, setItems] = useState<ShowcaseItem[]>([]);

  useEffect(() => {
    setItems([
      {
        name: '伊朗局势',
        href: '/showcase/iran',
        icon: '🌍',
        description: '实时地缘政治监控与影响分析',
        color: 'from-red-50 to-orange-50'
      },
      {
        name: 'QVeris美股',
        href: '/showcase/qveris',
        icon: '📊',
        description: '万级数据实时查询与深度分析',
        color: 'from-green-50 to-teal-50'
      },
      {
        name: 'Telegram新闻',
        href: '/showcase/telegram',
        icon: '📰',
        description: '加密货币与美股新闻聚合',
        color: 'from-blue-50 to-indigo-50'
      },
      {
        name: 'AI分析师',
        href: '/showcase/market-analyst',
        icon: '🤖',
        description: 'MiniMax驱动的智能市场分析',
        color: 'from-purple-50 to-pink-50'
      }
    ]);
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djJoLTJ2LTJoMnptLTQgNHYyaC0ydi0yaDJ6bTQtOGgydjJoLTJ2LTJ6bS04IDhoMnYyaC0ydi0yaDJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50"></div>
        
        <div className="max-w-7xl mx-auto px-4 py-20 relative">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 mb-6 shadow-2xl shadow-violet-500/30">
              <span className="text-4xl">🎯</span>
            </div>
            <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">
              花卷展示厅
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              实时数据展示与智能分析能力
            </p>
          </div>
        </div>
      </div>

      {/* Showcase Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${item.color} p-8 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-white/80 backdrop-blur-sm flex items-center justify-center text-3xl shadow-lg">
                  {item.icon}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-violet-600 transition-colors">
                    {item.name}
                  </h2>
                  <p className="text-slate-600">
                    {item.description}
                  </p>
                </div>
                <div className="text-2xl opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-4 group-hover:translate-x-0">
                  →
                </div>
              </div>
              
              {/* Decorative corner */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/20 to-transparent rounded-bl-full"></div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
