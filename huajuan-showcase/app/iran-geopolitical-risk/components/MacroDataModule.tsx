'use client';

import { MacroData } from '../types';
import { getTrendIcon } from '../utils';

interface MacroDataModuleProps {
  macroData: MacroData[];
}

export default function MacroDataModule({ macroData }: MacroDataModuleProps) {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <span>📊</span>
        <span>宏观经济数据（yfinance + FRED + EIA API）</span>
        <span className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded">✅ 真实</span>
        <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded">1小时缓存</span>
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {macroData.map((item, index) => (
          <div key={index} className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-100">
            <div className="flex items-center justify-between mb-1">
              <div className="text-xs text-gray-600">{item.name}</div>
              <span className="text-sm">{getTrendIcon(item.trend)}</span>
            </div>
            <div className="text-lg font-bold text-gray-900">{item.value}</div>
            <div className="flex items-center justify-between">
              <div className={`text-xs font-medium ${item.trend === 'up' ? 'text-red-600' : item.trend === 'down' ? 'text-green-600' : 'text-gray-600'}`}>
                {item.change}
              </div>
              <div className="text-xs text-gray-500">{item.lastUpdate}</div>
            </div>
            <div className="text-xs text-gray-400 mt-1">来源: {item.source}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
