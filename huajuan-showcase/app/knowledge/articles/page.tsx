'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface KnowledgeItem {
  title: string;
  source: string;
  date: string;
  category?: string;
}

export default function ArticlesPage() {
  const [articles, setArticles] = useState<KnowledgeItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArticles() {
      try {
        const res = await fetch('/api/knowledge');
        const data = await res.json();
        if (data.items) {
          setArticles(data.items);
        }
      } catch (error) {
        console.error('Failed to fetch articles:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchArticles();
  }, []);

  return (
    <main className="min-h-screen bg-[#0a0a0f]">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0f] via-[#1a1510] to-[#0a0a0f]">
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}></div>
        <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-amber-500/15 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/3 w-[500px] h-[500px] bg-orange-500/15 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-4xl mx-auto px-6 py-16">
        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/10">
            <Link
              href="/knowledge/articles"
              className="px-6 py-2.5 rounded-lg bg-amber-500/20 text-amber-400 font-medium"
            >
              文章
            </Link>
            <Link
              href="/knowledge/books"
              className="px-6 py-2.5 rounded-lg text-white/40 hover:text-white/70 transition-colors"
            >
              书单
            </Link>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-white/60 mb-6">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            Knowledge Base
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            研究文章
          </h1>
          <p className="text-lg text-white/50">
            投资知识与深度研究报告
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin"></div>
          </div>
        )}

        {/* Articles */}
        {!loading && articles.length > 0 && (
          <div className="space-y-3">
            {articles.map((article, index) => (
              <a
                key={index}
                href={article.source}
                target="_blank"
                rel="noopener noreferrer"
                className="block group bg-white/5 border border-white/10 rounded-xl p-5 hover:border-amber-500/30 hover:bg-white/10 transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-medium mb-2 group-hover:text-amber-400 transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <div className="flex items-center gap-3 text-sm text-white/40">
                      <span>{article.date}</span>
                      {article.category && (
                        <>
                          <span>•</span>
                          <span>{article.category}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <span className="text-white/30 group-hover:text-amber-400 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </span>
                </div>
              </a>
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && articles.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📭</div>
            <p className="text-white/40">暂无文章</p>
          </div>
        )}

        {/* Stats */}
        {!loading && articles.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-white/30 text-sm">
              共 {articles.length} 篇文章
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
