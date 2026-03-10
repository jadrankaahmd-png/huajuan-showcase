'use client';

import Navigation from '@/components/Navigation';
import { useState, useEffect } from 'react';

interface Layer2Capability {
  id: string;
  name: string;
  description: string;
  status: string;
  category: string;
  icon: string;
  details?: any;
}

export default function DynamicModelPage() {
  const [capabilities, setCapabilities] = useState<Layer2Capability[]>([]);
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/layer2-capabilities');
        const data = await res.json();
        setCapabilities(data.capabilities || []);
        setStats(data.stats || { total: 0, active: 0, inactive: 0 });
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
      <Navigation currentLayer={2} />
      
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-6">✨</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            花卷动态模型
          </h1>
          <p className="text-xl text-gray-600">
            第二层 · 智能选股引擎
          </p>
          <div className="mt-4 flex justify-center gap-4">
            <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-purple-600">{stats.total}</div>
              <div className="text-sm text-gray-600">总能力</div>
            </div>
            <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-green-600">{stats.active}</div>
              <div className="text-sm text-gray-600">已激活</div>
            </div>
          </div>
        </div>

        {/* Capabilities Grid */}
        {!isLoading && capabilities.length > 0 && (
          <div className="grid grid-cols-1 gap-6 mb-8">
            {capabilities.map((cap) => (
              <div 
                key={cap.id}
                className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl shadow-lg p-8 border border-blue-100"
              >
                <div className="flex items-center justify-center mb-4">
                  <div className="text-5xl">{cap.icon}</div>
                </div>
                
                <h2 className="text-2xl font-bold text-gray-900 text-center mb-3">
                  {cap.name}
                </h2>
                
                <div className="flex justify-center mb-4">
                  <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                    cap.status === 'active' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {cap.status === 'active' ? '✅ 已就绪' : '⏳ 开发中'}
                  </span>
                </div>
                
                <p className="text-gray-700 text-center mb-6 max-w-2xl mx-auto">
                  {cap.description}
                </p>

                {cap.details && (
                  <div className="bg-white rounded-lg p-4">
                    {cap.details.localPath && (
                      <div className="mb-2">
                        <h3 className="text-gray-900 font-semibold mb-2 flex items-center gap-2">
                          <span>📁</span> 本地路径
                        </h3>
                        <code className="text-sm text-gray-700 bg-gray-50 px-3 py-2 rounded block overflow-x-auto">
                          {cap.details.localPath}
                        </code>
                      </div>
                    )}
                    {cap.details.github && (
                      <div className="flex justify-center">
                        <a
                          href={cap.details.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
                        >
                          查看GitHub
                        </a>
                      </div>
                    )}
                    {cap.details.features && (
                      <div className="grid grid-cols-3 gap-4 mt-4">
                        {cap.details.features.map((feature: string, idx: number) => (
                          <div key={idx} className="bg-white rounded-lg p-4 text-center">
                            <p className="text-gray-600 text-sm">{feature}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
