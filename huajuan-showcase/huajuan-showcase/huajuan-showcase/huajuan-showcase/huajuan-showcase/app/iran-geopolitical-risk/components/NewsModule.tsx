'use client';

import { NewsItem } from '../types';
import { getSentimentColor } from '../utils';

interface NewsModuleProps {
  newsData: NewsItem[];
}

export default function NewsModule({ newsData }: NewsModuleProps) {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <span>📰</span>
        <span>新闻流（NewsAPI - 真实数据）</span>
        <span className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded">✅ 真实</span>
        <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded">15分钟缓存</span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {newsData.map((item, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
            <div className="flex items-start justify-between mb-2">
              <div className="text-sm font-semibold text-gray-900 flex-1">{item.title}</div>
              <span className={`text-xs px-2 py-1 rounded ${getSentimentColor(item.sentiment)}`}>
                {item.sentiment === 'positive' ? '看涨' : item.sentiment === 'negative' ? '看跌' : '中性'}
              </span>
            </div>
            <div className="text-xs text-gray-600 mb-2">{item.summary}</div>
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>{item.source}</span>
              <span>最后更新：{item.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
