'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

interface NavigationProps {
  currentLayer?: 0 | 1 | 2 | 3;
}

export default function Navigation({ currentLayer }: NavigationProps) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // 自动检测当前层级
  const detectLayer = (): 0 | 1 | 2 | 3 => {
    if (currentLayer !== undefined) return currentLayer;
    if (!pathname) return 1; // pathname 为 null 时默认第一层
    if (pathname === '/') return 0; // 首页
    if (pathname === '/dynamic-model' || pathname?.startsWith('/dynamic-model/')) return 2;
    if (pathname === '/stock-picker' || pathname?.startsWith('/stock-picker/')) return 3;
    return 1; // 默认第一层
  };
  
  const layer = detectLayer();
  
  const navItems = [
    { href: '/', label: '🏠 首页', layer: 0 },
    { href: '/coe', label: '🔧 花卷能力中心', layer: 1 },
    { href: '/dynamic-model', label: '⚡ 花卷动态模型', layer: 2 },
    { href: '/stock-picker', label: '🎯 花卷选股', layer: 3 }
  ];
  
  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <span className="text-3xl">🌸</span>
              <div>
                <div className="text-xl font-bold text-gray-900">花卷</div>
                <div className="text-xs text-gray-500">智能投资系统</div>
              </div>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  layer === item.layer
                    ? 'bg-pink-100 text-pink-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-4 py-3 rounded-lg font-medium ${
                  layer === item.layer
                    ? 'bg-pink-100 text-pink-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
