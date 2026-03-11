'use client';

import Link from 'next/link';

export default function AutoresearchPage() {
  const project = {
    name: 'AI 自动研究引擎',
    description: '让 LLM 自主进行 AI 模型训练实验，构建自我进化的研究系统',
    github: 'https://github.com/miolini/autoresearch-macos',
    localPath: '~/.openclaw/workspace/autoresearch-macos/',
    status: '研究中',
    features: [
      'LLM 自主决策实验流程',
      '自动化数据准备与处理',
      '模型训练与评估',
      '实验结果分析与可视化',
      '自我改进循环'
    ]
  };

  return (
    <main className="min-h-screen bg-[#0a0a0f]">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0f] via-[#0a1520] to-[#0a0a0f]">
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}></div>
        <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-cyan-500/15 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/3 w-[500px] h-[500px] bg-emerald-500/15 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-3xl mx-auto px-6 py-16">
        {/* Back Button */}
        <Link 
          href="/lab"
          className="inline-flex items-center gap-2 text-white/40 hover:text-white/70 transition-colors mb-8"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          返回研究实验室
        </Link>

        {/* Header Card */}
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-8 mb-6">
          <div className="flex items-start gap-6">
            <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center text-3xl shadow-lg shadow-cyan-500/20">
              🧠
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-white">
                  {project.name}
                </h1>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  {project.status}
                </span>
              </div>
              <p className="text-white/50">
                {project.description}
              </p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6 mb-6">
          <h2 className="text-white/80 font-medium mb-4">核心能力</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {project.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3 text-white/60">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400"></div>
                {feature}
              </div>
            ))}
          </div>
        </div>

        {/* Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-gradient-to-r from-white/10 to-white/5 text-white font-medium border border-white/10 hover:border-cyan-500/50 hover:bg-white/10 transition-all"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.921-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            GitHub 仓库
          </a>
          <div className="flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-white/5 text-white/50 border border-white/10">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            {project.localPath}
          </div>
        </div>

        {/* Status Note */}
        <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <span className="text-xl">💡</span>
            <p className="text-cyan-400/80 text-sm">
              项目正在积极开发中，代码会持续更新迭代
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
