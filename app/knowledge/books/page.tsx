'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Book {
  title: string;
  author?: string;
  description?: string;
}

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBooks() {
      try {
        const res = await fetch('/api/books');
        const data = await res.json();
        if (Array.isArray(data)) {
          setBooks(data);
        }
      } catch (error) {
        console.error('Failed to fetch books:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchBooks();
  }, []);

  return (
    <main className="min-h-screen bg-[#0a0a0f]">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0f] via-[#150f1a] to-[#0a0a0f]">
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}></div>
        <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-rose-500/15 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/3 w-[500px] h-[500px] bg-pink-500/15 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-4xl mx-auto px-6 py-16">
        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/10">
            <Link
              href="/knowledge/articles"
              className="px-6 py-2.5 rounded-lg text-white/40 hover:text-white/70 transition-colors"
            >
              文章
            </Link>
            <Link
              href="/knowledge/books"
              className="px-6 py-2.5 rounded-lg bg-rose-500/20 text-rose-400 font-medium"
            >
              书单
            </Link>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-white/60 mb-6">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            Knowledge Base
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            书单推荐
          </h1>
          <p className="text-lg text-white/50">
            投资与技术领域精选书籍
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-rose-500/30 border-t-rose-500 rounded-full animate-spin"></div>
          </div>
        )}

        {/* Books Grid */}
        {!loading && books.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {books.map((book, index) => (
              <div
                key={index}
                className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-rose-500/30 hover:bg-white/10 transition-all"
              >
                <div className="text-4xl mb-4">📚</div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {book.title}
                </h3>
                {book.author && (
                  <p className="text-rose-400/80 text-sm mb-2">
                    作者: {book.author}
                  </p>
                )}
                {book.description && (
                  <p className="text-white/50 text-sm line-clamp-3">
                    {book.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && books.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📭</div>
            <p className="text-white/40">暂无书单</p>
          </div>
        )}

        {/* Stats */}
        {!loading && books.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-white/30 text-sm">
              共 {books.length} 本书籍
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
