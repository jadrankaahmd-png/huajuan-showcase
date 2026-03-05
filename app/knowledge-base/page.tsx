'use client';

import { useState, useEffect } from 'react';

interface KnowledgeItem {
  id: string;
  title: string;
  source: string;
  date: string;
  tags: string[];
  summary: string;
  key_points: string[];
  file_path: string;
}

export default function KnowledgeBase() {
  const [knowledgeItems, setKnowledgeItems] = useState<KnowledgeItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<KnowledgeItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 加载知识库数据
    fetch('/data/knowledge-base.json')
      .then(res => res.json())
      .then(data => {
        setKnowledgeItems(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('加载知识库失败:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">📚</div>
          <div className="text-gray-600">加载知识库中...</div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <span className="text-4xl">📚</span>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">花卷知识库</h1>
                <p className="text-sm text-gray-500">个人书籍提炼系统 · 六维提炼</p>
              </div>
            </div>
            <div className="flex gap-4 text-sm">
              <div className="bg-purple-50 px-4 py-2 rounded-lg">
                <div className="text-purple-600 font-semibold">{knowledgeItems.length}</div>
                <div className="text-gray-600">知识条目</div>
              </div>
              <a
                href="/"
                className="bg-gray-100 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-200 transition-colors"
              >
                ← 返回能力中心
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Knowledge Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {knowledgeItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📚</div>
            <div className="text-xl text-gray-600 mb-2">知识库为空</div>
            <div className="text-gray-500">使用「个人书籍提炼系统：」开始提炼知识吧！</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {knowledgeItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedItem(item)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="text-sm text-gray-500">{item.date}</div>
                  <div className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                    {item.source}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-3">{item.summary}</p>
                <div className="flex flex-wrap gap-1">
                  {item.tags.slice(0, 3).map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                  {item.tags.length > 3 && (
                    <span className="text-xs text-gray-400">+{item.tags.length - 3}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">{selectedItem.title}</h2>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6 text-sm text-gray-500">
                <div>📅 {selectedItem.date}</div>
                <div>📖 {selectedItem.source}</div>
              </div>
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">📚 总览摘要</h3>
                <p className="text-gray-700">{selectedItem.summary}</p>
              </div>
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">🎯 核心论点</h3>
                <ul className="list-disc list-inside space-y-1">
                  {selectedItem.key_points.map((point, idx) => (
                    <li key={idx} className="text-gray-700">{point}</li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-wrap gap-2 mt-6">
                {selectedItem.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-sm bg-purple-100 text-purple-700 px-3 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-600">
            <div className="flex items-center justify-center gap-2">
              <span>📚</span>
              <span>花卷知识库 · 六维提炼法</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
