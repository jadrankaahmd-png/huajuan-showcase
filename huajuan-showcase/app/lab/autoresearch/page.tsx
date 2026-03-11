'use client';

import Link from 'next/link';

export default function AutoresearchPage() {
  const projectInfo = {
    name: 'AI 自动研究引擎',
    description: '让 LLM 自主进行 AI 模型训练实验，构建自我进化的研究系统',
    localPath: '~/.openclaw/workspace/autoresearch-macos/',
    github: 'https://github.com/miolini/autoresearch-macos',
    features: [
      'LLM 自主决策实验流程',
      '自动化数据准备与处理',
      '模型训练与评估',
      '实验结果分析与可视化',
      '自我改进循环'
    ]
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-cyan-900 to-slate-900">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500 to-emerald-500 mb-6 shadow-2xl">
            <span className="text-4xl">🧠</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            AI 自动研究引擎
          </h1>
          <p className="text-xl text-slate-400">
            {projectInfo.description}
          </p>
        </div>

        {/* Features */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8 border border-white/20">
          <h2 className="text-xl font-semibold text-white mb-6">核心能力</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projectInfo.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3 text-slate-300">
                <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
                {feature}
              </div>
            ))}
          </div>
        </div>

        {/* Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <a
            href={projectInfo.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-gradient-to-r from-slate-800 to-slate-700 text-white hover:from-slate-700 hover:to-slate-600 transition-all border border-slate-600 hover:border-cyan-500"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            GitHub 仓库
          </a>
          <div className="flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-slate-800/50 text-slate-400 border border-slate-700">
            📁 {projectInfo.localPath}
          </div>
        </div>

        {/* Back */}
        <Link
          href="/lab"
          className="block text-center text-slate-400 hover:text-white transition-colors"
        >
          ← 返回研究实验室
        </Link>
      </div>
    </main>
  );
}
