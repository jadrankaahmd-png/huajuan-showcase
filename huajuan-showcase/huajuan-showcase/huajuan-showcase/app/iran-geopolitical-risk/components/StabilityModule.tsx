'use client';

import { StabilityIndex } from '../types';
import { getTrendIcon } from '../utils';

interface StabilityModuleProps {
  stabilityIndices: StabilityIndex[];
}

export default function StabilityModule({ stabilityIndices }: StabilityModuleProps) {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <span>🌍</span>
        <span>国家稳定性指数</span>
        <span className="text-xs bg-yellow-50 text-yellow-600 px-2 py-1 rounded">⚠️ 暂时无法获取</span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stabilityIndices.map((item, index) => (
          <div key={index} className="bg-yellow-50 rounded-lg shadow-sm p-4 border border-yellow-200">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-semibold text-gray-900">{item.country}</div>
              <span className="text-sm">{getTrendIcon(item.trend)}</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-2">
              {item.available ? item.index.toFixed(1) : '暂时无法获取'}
            </div>
            <div className="text-xs text-gray-400">最后更新：{item.lastUpdate}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
