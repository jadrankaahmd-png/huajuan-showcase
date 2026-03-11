'use client';

import Link from 'next/link';

export default function LabPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 mb-6 shadow-2xl shadow-cyan-500/30">
            <span className="text-4xl">🔬</span>
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">
            花卷研究实验室
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            AI 自主研究与实验项目
          </p>
        </div>
      </div>

      {/* Lab Projects */}
      <div className="max-w-4xl mx-auto px-4 pb-20">
        <Link
          href="/lab/autoresearch"
          className="block group relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 p-8 hover:border-cyan-500/60 transition-all hover:scale-[1.01]"
        >
          <div className="flex items-start gap-6">
            <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-3xl">
              🧠
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                AI 自动研究引擎
              </h2>
              <p className="text-slate-400 mb-4">
                让 LLM 自主进行 AI 模型训练实验，构建自我进化的研究系统
              </p>
              <div className="flex items-center gap-4">
                <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 text-sm">
                  Python
                </span>
                <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-sm">
                  ML Research
                </span>
              </div>
            </div>
            <div className="text-2xl opacity-0 group-hover:opacity-100 transition-opacity">
              →
            </div>
          </div>
        </Link>
      </div>
    </main>
  );
}
