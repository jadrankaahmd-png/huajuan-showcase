'use client';

import { useState, useEffect } from 'react';

interface Knowledge {
  title: string;
  source: string;
  date: string;
  summary: string;
  insights: string[];
  category: string;
}

const bookSources = [
  {
    name: 'Project Gutenberg',
    url: 'https://www.gutenberg.org/',
    description: '70,000+ 经典投资书籍（公共领域）',
    example: '《聪明的投资者》、《证券分析》'
  },
  {
    name: 'Open Library',
    url: 'https://openlibrary.org/',
    description: '数百万本现代投资书籍（合法借阅）',
    example: '当代投资理论、最新市场分析'
  },
  {
    name: 'SEC EDGAR',
    url: 'https://www.sec.gov/cgi-bin/browse-edgar',
    description: '公司财报、年报、招股书（公共领域）',
    example: '巴菲特致股东信、公司10-K年报'
  },
  {
    name: 'Internet Archive',
    url: 'https://archive.org/',
    description: '数百万本历史投资文献（合法借阅）',
    example: '历史市场分析、经典投资案例'
  }
];

export default function KnowledgeBasePage() {
  const [knowledgeBase, setKnowledgeBase] = useState<Knowledge[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, categories: 0 });

  useEffect(() => {
    async function fetchKnowledge() {
      try {
        const res = await fetch('/api/knowledge-base');
        const data = await res.json();
        setKnowledgeBase(data.knowledge || []);
        const categories = new Set(data.knowledge.map((k: Knowledge) => k.category));
        setStats({
          total: data.total || 0,
          categories: categories.size
        });
      } catch (error) {
        console.error('Error fetching knowledge:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchKnowledge();
  }, []);

  const categories = ['全部', ...Array.from(new Set(knowledgeBase.map(k => k.category)))];

  const filteredKnowledge = selectedCategory === '全部'
    ? knowledgeBase
    : knowledgeBase.filter(k => k.category === selectedCategory);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <a href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                <span className="text-4xl">🌸</span>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">花卷知识库</h1>
                  <p className="text-sm text-gray-500">持续学习 · 持续进化</p>
                </div>
              </a>
            </div>
            <div className="flex gap-4 text-sm flex-wrap">
              <div className="bg-pink-50 px-4 py-2 rounded-lg">
                <div className="text-pink-600 font-semibold">{stats.total}</div>
                <div className="text-gray-600">知识条目</div>
              </div>
              <div className="bg-green-50 px-4 py-2 rounded-lg">
                <div className="text-green-600 font-semibold">{stats.categories}</div>
                <div className="text-gray-600">分类</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Book Search Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">📚</span>
            <div>
              <h2 className="text-xl font-bold text-gray-900">合法书籍知识库</h2>
              <p className="text-sm text-gray-600">整合4大合法数据源，支持书籍搜索和投资知识提炼</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {bookSources.map((source, index) => (
              <a
                key={index}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-lg p-4 hover:shadow-md transition-all border border-gray-200"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">📖</span>
                  <h3 className="font-bold text-gray-900">{source.name}</h3>
                </div>
                <p className="text-sm text-gray-600 mb-2">{source.description}</p>
                <p className="text-xs text-gray-500 italic">{source.example}</p>
              </a>
            ))}
          </div>
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              💡 <strong>使用方法：</strong>点击上方数据源搜索书籍 → 下载或借阅 → 发送给花卷进行六维蒸馏法提炼 → 存入知识库
            </p>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                selectedCategory === category
                  ? 'bg-pink-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Knowledge Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {loading ? (
          <div className="text-center py-12">
            <div className="text-gray-500">加载中...</div>
          </div>
        ) : filteredKnowledge.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500">暂无知识条目</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredKnowledge.map((knowledge, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-100 p-6"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded">
                        {knowledge.category}
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
              <span>花卷知识库 v2.0</span>
            </div>
            <div className="text-center sm:text-right text-gray-500">
              最后更新：{new Date().toLocaleDateString('zh-CN')} · 持续学习机制已启用
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
