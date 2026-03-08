'use client';

import { useState } from 'react';

export default function MarketAnalyst() {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<string>('');
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    setLoading(true);
    setError('');
    setReport('');

    try {
      const res = await fetch('/api/market-analyst', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || '分析失败');
      }

      const data = await res.json();

      if (data.success) {
        setReport(data.report);
      } else {
        throw new Error(data.error || '分析失败');
      }
    } catch (err: any) {
      setError(err.message || '分析失败，请稍后重试');
      console.error('Market analyst error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl shadow-lg p-8 border border-purple-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-4xl">🤖</div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">AI美股市场分析师</h2>
            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
              ✅ 已就绪
            </span>
          </div>
        </div>
      </div>

      <p className="text-gray-700 mb-6">
        LLM驱动的智能分析：主动识别异常、搜索验证、推理结论，生成深度市场报告
      </p>

      {/* 分析按钮 */}
      <div className="mb-6">
        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="w-full md:w-auto px-8 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <span className="animate-spin">⏳</span>
              分析中...
            </>
          ) : (
            <>
              <span>🔍</span>
              立即分析
            </>
          )}
        </button>
      </div>

      {/* 加载提示 */}
      {loading && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
          <p className="text-purple-700 flex items-center gap-2">
            <span className="animate-spin">⏳</span>
            正在收集全球指标和板块数据...
          </p>
        </div>
      )}

      {/* 错误提示 */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-red-700">{error}</p>
          <button
            onClick={handleAnalyze}
            className="mt-2 text-red-700 underline hover:text-red-800"
          >
            重试
          </button>
        </div>
      )}

      {/* 分析报告 */}
      {report && (
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="prose prose-sm max-w-none">
            <div 
              className="whitespace-pre-wrap font-mono text-sm"
              dangerouslySetInnerHTML={{ 
                __html: report
                  .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold text-gray-900 mb-4">$1</h1>')
                  .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold text-gray-800 mb-3 mt-6">$1</h2>')
                  .replace(/^### (.+)$/gm, '<h3 class="text-lg font-bold text-gray-700 mb-2 mt-4">$1</h3>')
                  .replace(/\*\*(.+?)\*\*/g, '<strong class="text-gray-900">$1</strong>')
                  .replace(/^---$/gm, '<hr class="my-6 border-gray-300" />')
                  .replace(/🚨|📈|📉|✅|❄️|🔥|🔍|⚠️|🔄|📰|🎯/g, '<span class="text-2xl">$&</span>')
              }}
            />
          </div>
        </div>
      )}

      {/* 说明 */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>📊 数据来源：</strong>
          全球指标（美元指数、纳斯达克100、VIX、黄金、标普500）+ 美股38个板块ETF + 实时新闻
        </p>
        <p className="text-sm text-blue-800 mt-2">
          <strong>🧠 分析维度：</strong>
          异常识别 + 板块梯队排名（5个梯队） + 主线传导逻辑 + 关键信号
        </p>
      </div>
    </div>
  );
}
