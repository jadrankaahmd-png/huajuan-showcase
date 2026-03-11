'use client';

import { MaritimeData } from '../types';

interface ShippingModuleProps {
  maritimeData: MaritimeData[];
}

export default function ShippingModule({ maritimeData }: ShippingModuleProps) {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <span>🚢</span>
        <span>海运监控（aisstream.io WebSocket）</span>
        <span className="text-xs bg-yellow-50 text-yellow-600 px-2 py-1 rounded">⚠️ 暂时无法获取</span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {maritimeData.map((item, index) => (
          <div key={index} className="bg-yellow-50 rounded-lg shadow-sm p-4 border border-yellow-200">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-semibold text-gray-900">{item.route}</div>
              <span className="text-sm">{item.available ? '✅' : '⚠️'}</span>
            </div>
            <div className="text-sm text-gray-600 mb-1">
              <span className="font-medium">船只数量: </span>
              {item.available ? item.vessels : '暂时无法获取'}
            </div>
            <div className="text-sm text-gray-600 mb-2">
              <span className="font-medium">状态: </span>
              {item.status}
            </div>
            <div className="text-xs text-gray-400">最后更新：{item.lastUpdate}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
