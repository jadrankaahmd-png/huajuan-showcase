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
      }
    }
    fetchBooks();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 mb-6 shadow-2xl">
            <span className="text-3xl">📖</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">
            书单推荐
          </h1>
          <p className="text-slate-400">
            投资与技术领域精选书籍
          </p>
        </div>

        {/* Books Grid */}
        {books.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {books.map((book, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/10"
              >
                <div className="text-4xl mb-4">📚</div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {book.title}
                </h3>
                {book.author && (
                  <p className="text-sm text-slate-400 mb-2">
                    作者: {book.author}
                  </p>
                )}
                {book.description && (
                  <p className="text-sm text-slate-500">
                    {book.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-slate-500">
            暂无书单
          </div>
        )}

        {/* Tabs */}
        <div className="flex justify-center gap-4 mt-8">
          <Link
            href="/knowledge/articles"
            className="px-6 py-3 rounded-full bg-slate-800 text-slate-400 border border-slate-700 hover:border-slate-600"
          >
            文章
          </Link>
          <Link
            href="/knowledge/books"
            className="px-6 py-3 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30"
          >
            书单
          </Link>
        </div>
      </div>
    </main>
  );
}
