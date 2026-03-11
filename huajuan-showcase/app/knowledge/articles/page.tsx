'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface KnowledgeItem {
  title: string;
  source: string;
  date: string;
}

export default function ArticlesPage() {
  const [articles, setArticles] = useState<KnowledgeItem[]>([]);

  useEffect(() => {
    // 从 Redis 获取知识条目
    async function fetchArticles() {
      try {
        const res = await fetch('/api/knowledge');
        const data = await res.json();
        if (data.items) {
          setArticles(data.items);
        }
      } catch (error) {
        console.error('Failed to fetch articles:', error);
      }
    }
    fetchArticles();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 mb-6 shadow-2xl">
            <span className="text-3xl">📚</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">
            研究文章
          </h1>
          <p className="text-slate-400">
            投资知识与深度研究报告
          </p>
        </div>

        {/* Articles Grid */}
        {articles.length > 0 ? (
          <div className="grid gap-4">
            {articles.map((article, index) => (
              <a
                key={index}
                href={article.source}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:border-amber-500/50 hover:bg-white/15 transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2 hover:text-amber-400 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-sm text-slate-500">{article.date}</p>
                  </div>
                  <span className="text-slate-600">→</span>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-slate-500">
            暂无文章
          </div>
        )}

        {/* Tabs */}
        <div className="flex justify-center gap-4 mt-8">
          <Link
            href="/knowledge/articles"
            className="px-6 py-3 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30"
          >
            文章
          </Link>
          <Link
            href="/knowledge/books"
            className="px-6 py-3 rounded-full bg-slate-800 text-slate-400 border border-slate-700 hover:border-slate-600"
          >
            书单
          </Link>
        </div>
      </div>
    </main>
  );
}
