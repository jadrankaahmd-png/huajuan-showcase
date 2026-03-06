'use client';

import { AgentAnalysis } from '../types';

interface AIAnalysisModuleProps {
  agentAnalysis: AgentAnalysis[];
}

export default function AIAnalysisModule({ agentAnalysis }: AIAnalysisModuleProps) {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <span>🧠</span>
        <span>AI推演 + 八大Agent分析（真实数据驱动）</span>
        <span className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded">✅ 真实</span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {agentAnalysis.map((item, index) => (
          <div key={index} className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-100">
            <div className="text-sm font-semibold text-gray-900 mb-2">{item.agent}</div>
            <div className="text-xs text-gray-600 mb-2">{item.analysis}</div>
            <div className="text-xs text-gray-700 mb-1">
              <span className="font-medium">建议: </span>
              {item.recommendation}
            </div>
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>置信度: {(item.confidence * 100).toFixed(0)}%</span>
              <span>最后更新：{item.lastUpdate}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
