'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface ShowcaseItem {
  name: string;
  href: string;
  icon: string;
  description: string;
  color: {
    bg: string;
    border: string;
    icon: string;
    hover: string;
  };
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
        color: {
          bg: 'from-rose-500/20 to-orange-500/20',
          border: 'border-rose-500/30',
          icon: 'from-rose-500 to-orange-500',
          hover: 'hover:border-rose-500/60'
        }
      },
      {
        name: 'QVeris美股',
        href: '/showcase/qveris',
        icon: '📊',
        description: '万级数据实时查询与深度分析',
        color: {
          bg: 'from-emerald-500/20 to-teal-500/20',
          border: 'border-emerald-500/30',
          icon: 'from-emerald-500 to-teal-500',
          hover: 'hover:border-emerald-500/60'
        }
      },
      {
        name: 'Telegram新闻',
        href: '/showcase/telegram',
        icon: '📰',
        description: '加密货币与美股新闻聚合',
        color: {
          bg: 'from-blue-500/20 to-indigo-500/20',
          border: 'border-blue-500/30',
          icon: 'from-blue-500 to-indigo-500',
          hover: 'hover:border-blue-500/60'
        }
      },
      {
        name: 'AI分析师',
        href: '/showcase/market-analyst',
        icon: '🤖',
        description: 'MiniMax驱动的智能市场分析',
        color: {
          bg: 'from-violet-500/20 to-purple-500/20',
          border: 'border-violet-500/30',
          icon: 'from-violet-500 to-purple-500',
          hover: 'hover:border-violet-500/60'
        }
      }
    ]);
  }, []);

  return (
    <main className="min-h-screen bg-[#0a0a0f]">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0f] via-[#12121a] to-[#0a0a0f]">
          {/* Grid Pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}></div>
          
          {/* Glow Effects */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-24 relative">
          {/* Badge */}
          <div className="flex justify-center mb-8">
            <div className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-white/60">
              花卷实战展示
            </div>
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-6xl font-bold text-center text-white mb-6 tracking-tight">
            展示厅
          </h1>
          
          <p className="text-xl text-white/50 text-center max-w-2xl mx-auto leading-relaxed">
            实时数据展示与智能分析能力
          </p>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${item.color.bg} border ${item.color.border} ${item.color.hover} p-8 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl`}
            >
              {/* Corner Decor */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/10 to-transparent rounded-bl-full"></div>
              
              <div className="flex items-start gap-5">
                {/* Icon */}
                <div className={`flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br ${item.color.icon} flex items-center justify-center text-2xl shadow-lg shadow-black/20`}>
                  {item.icon}
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-semibold text-white mb-2 group-hover:text-white/90 transition-colors">
                    {item.name}
                  </h2>
                  <p className="text-white/50 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
                
                {/* Arrow */}
                <div className="text-white/30 group-hover:text-white/70 group-hover:translate-x-1 transition-all">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>

              {/* Bottom Line */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </Link>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-12 grid grid-cols-3 gap-4">
          {[
            { label: '实时数据源', value: '8+' },
            { label: '日处理数据', value: '100M+' },
            { label: 'AI分析能力', value: 'MiniMax' }
          ].map((stat, i) => (
            <div key={i} className="text-center py-4 px-6 rounded-xl bg-white/5 border border-white/10">
              <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-xs text-white/40">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
