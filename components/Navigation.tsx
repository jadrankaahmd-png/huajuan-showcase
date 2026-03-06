'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavigationProps {
  currentLayer?: 1 | 2 | 3;
}

export default function Navigation({ currentLayer }: NavigationProps) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // 自动检测当前层级
  const detectLayer = (): 1 | 2 | 3 => {
    if (currentLayer) return currentLayer;
    if (pathname === '/dynamic-model' || pathname.startsWith('/dynamic-model/')) return 2;
    if (pathname === '/stock-picker' || pathname.startsWith('/stock-picker/')) return 3;
    return 1;
  };
  
  const layer = detectLayer();
  
  const navItems = [
    { href: '/', label: '🌸 花卷能力中心', layer: 1 },
    { href: '/dynamic-model', label: '🧠 花卷动态模型', layer: 2 },
    { href: '/stock-picker', label: '📈 花卷选股', layer: 3 }
  ];
  
  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <span className="text-2xl">🌸</span>
              <span className="text-gray-900 font-bold text-lg">花卷</span>
            </Link>
          </div>
          
          {/* Desktop Navigation Links */}
          <div className="hidden md:flex space-x-1">
            {navItems.map((item) => {
              const isActive = layer === item.layer;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${isActive 
                      ? 'bg-pink-50 text-pink-600 shadow-sm' 
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
          
          {/* Version Badge (Desktop) */}
          <div className="hidden md:flex-shrink-0">
            <span className="text-xs text-gray-400">v5.1.0</span>
          </div>
          
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
        
        {/* Mobile Navigation Links */}
        {isMenuOpen && (
          <div className="md:hidden py-3 space-y-1 border-t border-gray-100">
            {navItems.map((item) => {
              const isActive = layer === item.layer;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`
                    block px-4 py-3 rounded-lg text-sm font-medium transition-all
                    ${isActive 
                      ? 'bg-pink-50 text-pink-600' 
                      : 'text-gray-700 hover:bg-gray-50'
                    }
                  `}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </nav>
  );
}
