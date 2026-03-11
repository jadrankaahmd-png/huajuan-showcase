'use client';

import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';

interface Knowledge {
  title: string;
  source: string;
  date: string;
  summary: string;
  insights: string[];
  category: string;
  type?: string;
  icon?: string;
}

interface BookSource {
  name: string;
  url: string;
  description: string;
  example: string;
}

interface Stats {
  knowledge: number;
  bookSources: number;
  grandTotal: number;
}

export default function KnowledgeBasePage() {
  const [knowledge, setKnowledge] = useState<Knowledge[]>([]);
  const [bookSources, setBookSources] = useState<BookSource[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({
    knowledge: 0,
    bookSources: 0,
    grandTotal: 0
  });
  
  // 从 API 动态加载知识库数据
  useEffect(() => {
    async function fetchKnowledge() {
      try {
        const res = await fetch('/api/knowledge-base');
        const data = await res.json();
        setKnowledge(data.knowledge || []);
        setBookSources(data.bookSources || []);
        setStats(data.total || { knowledge: 0, bookSources: 0, grandTotal: 0 });
      } catch (error) {
        console.error('Error fetching knowledge:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchKnowledge();
  }, []);
  
  // 获取所有分类
  const categories = ['all', ...Array.from(new Set(knowledge.map(k => k.category)))];
  
  // 筛选知识
  const filteredKnowledge = knowledge.filter(k => {
    const matchesSearch = k.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         k.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || k.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
            <p className="mt-4 text-gray-600">加载知识库...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-4xl">📱</span>
                  <h1 className="text-3xl font-bold text-gray-900">花卷知识库</h1>
                </div>
                <p className="text-gray-600">系统学习、持续进化的投资智慧库</p>
              </div>
              <div className="flex gap-4 text-sm">
                <div className="bg-pink-50 px-4 py-2 rounded-lg">
                  <div className="text-pink-600 font-semibold">{stats.knowledge}</div>
                  <div className="text-gray-600">📖 知识条目</div>
                </div>
                <div className="bg-blue-50 px-4 py-2 rounded-lg">
                  <div className="text-blue-600 font-semibold">{stats.bookSources}</div>
                  <div className="text-gray-600">📚 合法书籍知识库</div>
                </div>
                <div className="bg-purple-50 px-4 py-2 rounded-lg">
                  <div className="text-purple-600 font-semibold">{stats.grandTotal}</div>
                  <div className="text-gray-600">知识库总数</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {/* 合法书籍知识库 */}
          {bookSources.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-3xl">📚</span>
                合法书籍知识库
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {bookSources.map((source, index) => (
                  <a
                    key={index}
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-100 p-6"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                            📚 合法书籍知识库
                          </span>
                        </div>
                        <h3 className="font-bold text-gray-900">{source.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{source.description}</p>
                        <p className="text-xs text-gray-500 italic">{source.example}</p>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  💡 <strong>使用方法：</strong>点击上方数据源搜索书籍 → 下载或借阅 → 发送给花卷进行六维蒸馏法提炼 → 存入知识库
                </p>
              </div>
            </div>
          )}

          {/* Category Filter */}
          <div className="mb-6">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                    selectedCategory === category
                      ? 'bg-pink-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {category === 'all' ? '全部' : category} ({category === 'all' ? knowledge.length : knowledge.filter(k => k.category === category).length})
                </button>
              ))}
            </div>
          </div>

          {/* Search */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="搜索知识库..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          {/* Knowledge Cards */}
          {filteredKnowledge.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              暂无知识条目
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredKnowledge.map((knowledge, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-100 p-6"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs bg-pink-100 text-pink-800 px-2 py-1 rounded-full">
                          📖 知识条目
                        </span>
                        <span className="text-xs text-gray-500">{knowledge.date}</span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{knowledge.title}</h3>
                      <p className="text-sm text-gray-600 mb-4">{knowledge.summary}</p>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="text-xs text-gray-500 mb-2">来源: {knowledge.source}</div>
                  </div>

                  <div className="border-t border-gray-100 pt-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">💡 核心洞察</h4>
                    <ul className="space-y-1">
                      {knowledge.insights.map((insight, idx) => (
                        <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                          <span className="text-pink-500 mt-0.5">•</span>
                          <span>{insight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col sm:flex-row items-center justify-between text-sm text-gray-600 gap-2">
              <div className="flex items-center gap-2">
                <span>🌸</span>
                <span>花卷知识库 v4.0（Redis 驱动）</span>
              </div>
              <div className="text-center sm:text-right text-gray-500">
                数据来源：Upstash Redis · 实时同步
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
