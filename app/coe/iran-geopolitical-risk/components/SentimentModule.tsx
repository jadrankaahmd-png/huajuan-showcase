'use client';

import { SentimentData } from '../types';

interface SentimentModuleProps {
  sentimentData: SentimentData[];
}

export default function SentimentModule({ sentimentData }: SentimentModuleProps) {
  const getSentimentEmoji = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish': return '🐂';
      case 'bearish': return '🐻';
      default: return '😐';
    }
  };

  const getSentimentLabel = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish': return '看涨';
      case 'bearish': return '看跌';
      default: return '中性';
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish': return 'text-green-600 bg-green-50';
      case 'bearish': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <span>💬</span>
        <span>情绪分析（Reddit RSS - 真实数据）</span>
        <span className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded">✅ 真实</span>
        <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded">15分钟缓存</span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sentimentData.map((item, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{getSentimentEmoji(item.sentiment)}</span>
                <div className="text-sm font-semibold text-gray-900">{item.platform}</div>
              </div>
              <span className={`text-xs px-2 py-1 rounded ${getSentimentColor(item.sentiment)}`}>
                {getSentimentLabel(item.sentiment)}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
              <span>情绪得分: {(item.score * 100).toFixed(0)}%</span>
              <span>讨论量: {item.volume}</span>
            </div>
            <div className="text-xs text-gray-400">最后更新：{item.lastUpdate}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
