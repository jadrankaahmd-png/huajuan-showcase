'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavigationProps {
  currentLayer?: 1 | 2 | 3;
}

export default function Navigation({ currentLayer }: NavigationProps) {
  const pathname = usePathname();
  
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
    <nav className="bg-gradient-to-r from-blue-900 via-purple-900 to-pink-900 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl">🌸</span>
              <span className="text-white font-bold text-lg">花卷</span>
            </Link>
          </div>
          
          {/* Navigation Links */}
          <div className="flex space-x-1">
            {navItems.map((item) => {
              const isActive = layer === item.layer;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${isActive 
                      ? 'bg-white text-purple-900 shadow-lg' 
                      : 'text-gray-200 hover:bg-white/10 hover:text-white'
                    }
                  `}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
          
          {/* Version Badge */}
          <div className="flex-shrink-0">
            <span className="text-xs text-gray-400">v5.1.0</span>
          </div>
        </div>
      </div>
    </nav>
  );
}
