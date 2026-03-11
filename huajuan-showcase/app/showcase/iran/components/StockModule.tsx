'use client';

import { RealTimePrice } from '../types';

interface StockModuleProps {
  realTimePrices: RealTimePrice[];
}

export default function StockModule({ realTimePrices }: StockModuleProps) {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <span>💰</span>
        <span>实时股价（Finnhub API - 真实数据）</span>
        <span className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded">✅ 真实</span>
        <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded">5分钟缓存</span>
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {realTimePrices.map((item, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
            <div className="text-xs text-gray-500 mb-1">{item.symbol}</div>
            <div className="text-lg font-bold text-gray-900">${item.price.toFixed(2)}</div>
            <div className={`text-sm font-medium ${item.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {item.change >= 0 ? '+' : ''}{item.change.toFixed(2)} ({item.changePercent >= 0 ? '+' : ''}{item.changePercent.toFixed(2)}%)
            </div>
            <div className="text-xs text-gray-400 mt-1">最后更新：{item.lastUpdate}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
