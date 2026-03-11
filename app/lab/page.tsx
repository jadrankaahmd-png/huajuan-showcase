'use client';

import Link from 'next/link';

interface LabProject {
  name: string;
  href: string;
  icon: string;
  description: string;
  status: string;
  statusColor: string;
  tags: string[];
}

export default function LabPage() {
  const projects: LabProject[] = [
    {
      name: 'AI自动研究引擎',
      href: '/lab/autoresearch',
      icon: '🧠',
      description: '让 LLM 自主进行 AI 模型训练实验，构建自我进化的研究系统',
      status: '研究中',
      statusColor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
      tags: ['Python', 'ML Research', 'LLM']
    }
  ];

  return (
    <main className="min-h-screen bg-[#0a0a0f]">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0f] via-[#0f1a1f] to-[#0a0a0f]">
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}></div>
        <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-cyan-500/15 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/3 w-[500px] h-[500px] bg-blue-500/15 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-4xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-white/60 mb-6">
            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
            Research Lab
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            研究实验室
          </h1>
          <p className="text-lg text-white/50">
            AI 自主研究与实验项目
          </p>
        </div>

        {/* Projects */}
        <div className="space-y-4">
          {projects.map((project, index) => (
            <Link
              key={index}
              href={project.href}
              className="block group relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-500/30 p-6 transition-all hover:scale-[1.01] hover:shadow-xl hover:shadow-cyan-500/10"
            >
              {/* Corner Decor */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-cyan-500/10 to-transparent rounded-bl-full"></div>
              
              <div className="flex items-start gap-5">
                {/* Icon */}
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-2xl shadow-lg shadow-cyan-500/20">
                  {project.icon}
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-xl font-semibold text-white">
                      {project.name}
                    </h2>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${project.statusColor}`}>
                      {project.status}
                    </span>
                  </div>
                  <p className="text-white/50 text-sm mb-3">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, i) => (
                      <span key={i} className="px-2 py-1 rounded-md bg-white/5 text-white/40 text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* Arrow */}
                <div className="text-white/30 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {projects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-white/40">暂无研究项目</p>
          </div>
        )}
      </div>
    </main>
  );
}
