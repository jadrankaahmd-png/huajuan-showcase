'use client';

import Navigation from '@/components/Navigation';
import { useState, useEffect } from 'react';

interface Layer3Capability {
  id: string;
  name: string;
  description: string;
  status: string;
  category: string;
  icon: string;
}

export default function StockPickerPage() {
  const [capabilities, setCapabilities] = useState<Layer3Capability[]>([]);
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0, progress: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/layer3-capabilities');
        const data = await res.json();
        setCapabilities(data.capabilities || []);
        setStats(data.stats || { total: 0, active: 0, inactive: 0, progress: 0 });
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Navigation currentLayer={3} />
      
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-6">🌸</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            花卷选股
          </h1>
          <p className="text-xl text-gray-600">
            第三层 · 智能股票推荐
          </p>
          <div className="mt-4 flex justify-center gap-4">
            <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
              <div className="text-sm text-gray-600">总能力</div>
            </div>
            <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-orange-600">{stats.progress}%</div>
              <div className="text-sm text-gray-600">开发进度</div>
            </div>
          </div>
        </div>
        
        {/* Coming Soon Card */}
        <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100 mb-8">
          <div className="flex items-center justify-center mb-6">
            <div className="text-5xl">🔍</div>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">
            即将上线
          </h2>
          
          <p className="text-gray-600 text-center mb-8">
            基于第二层动态模型的智能选股系统，让投资决策更简单！
          </p>
          
          {/* Capabilities Grid */}
          {!isLoading && capabilities.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {capabilities.map((cap) => (
                <div 
                  key={cap.id}
                  className="bg-blue-50 rounded-lg p-4 border border-blue-100"
                >
                  <div className="text-2xl mb-2">{cap.icon}</div>
                  <h3 className="text-gray-900 font-semibold mb-2">{cap.name}</h3>
                  <p className="text-gray-600 text-sm">{cap.description}</p>
                </div>
              ))}
            </div>
          )}
          
          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>开发进度</span>
              <span>{stats.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full" 
                style={{ width: `${stats.progress}%` }}
              ></div>
            </div>
          </div>
          
          <div className="text-center text-gray-500 text-sm">
            <p>🚧 第三层正在开发中，敬请期待！</p>
          </div>
        </div>
      </div>
    </main>
  );
}
