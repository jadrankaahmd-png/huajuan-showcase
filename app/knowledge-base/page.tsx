'use client';

import { useState } from 'react';

interface Knowledge {
  title: string;
  source: string;
  date: string;
  summary: string;
  insights: string[];
  category: string;
}

const knowledgeBase: Knowledge[] = [
  {
    title: 'Interactive Benchmarks: 评估模型的交互学习能力',
    source: 'arXiv:2411.14451',
    date: '2026-03-05',
    summary: '这篇论文提出了评估AI模型"主动获取信息"能力的革命性基准测试方法。核心思想：通过交互学习是所有智能理论的基础。',
    insights: [
      '智能不仅是回答问题，更是提问的能力',
      '从"答案导向"到"过程导向"的范式转变',
      '主动获取信息比被动接收更重要',
      '过程比结果更能体现智能',
      '交互式学习是持续改进的基础'
    ],
    category: 'AI理论'
  },
  {
    title: '选股系统的交互式学习应用',
    source: '基于Interactive Benchmarks论文',
    date: '2026-03-05',
    summary: '将交互式学习理论应用到选股系统，实现从"静态推荐"到"动态学习"的革命性改进。',
    insights: [
      '主动识别信息缺口并补充',
      '持续监控市场动态并更新评估',
      '验证投资假设并持续优化',
      '建立知识库的持续学习机制',
      '透明的决策过程展示'
    ],
    category: '选股系统'
  },
  {
    title: 'Agent Reach 数据抓取系统',
    source: 'Agent Reach v1.3.0',
    date: '2026-03-05',
    summary: 'Agent Reach是一个强大的数据抓取系统，支持Twitter、Reddit、YouTube、B站等7个平台的数据抓取和情绪分析。',
    insights: [
      'Twitter/X推文抓取和情绪分析',
      'Reddit帖子和评论抓取',
      '微信公众号文章抓取',
      'YouTube和B站视频信息提取',
      '全网语义搜索（Exa，免费）',
      '任意网页读取（Jina Reader）',
      '整合进选股系统的数据抓取层'
    ],
    category: '数据抓取'
  },
  {
    title: '$AAOI 深度投资分析：6.3倍上涨空间',
    source: '个人书籍提炼系统',
    date: '2026-03-05',
    summary: 'Applied Optoelectronics ($AAOI) 当前市值$7.5B，目标估值$47.6B。垂直整合能力、美国制造、AI数据中心需求驱动，上涨空间6.3倍（535%）。',
    insights: [
      '当前市值$7.5B → 目标市值$47.6B',
      '垂直整合：激光器制造+设计+组装',
      '德克萨斯州产能增加三倍',
      '2027 H2收入预测：每月$3.78亿',
      '毛利率：35-38% → 40%（Q3 2027）',
      '超大规模企业买断所有产能',
      'SOTP估值：10.58x Forward Sales',
      '投资建议：是的，毫无疑问（Yes, Unequivocally）'
    ],
    category: '投资分析'
  }
];

const categories = ['全部', 'AI理论', '选股系统', '数据抓取', '投资分析', '金融分析', '数据科学'];

export default function KnowledgeBasePage() {
  const [selectedCategory, setSelectedCategory] = useState('全部');

  const filteredKnowledge = selectedCategory === '全部'
    ? knowledgeBase
    : knowledgeBase.filter(k => k.category === selectedCategory);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <a href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                <span className="text-4xl">🌸</span>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">花卷知识库</h1>
                  <p className="text-sm text-gray-500">持续学习 · 持续进化</p>
                </div>
              </a>
            </div>
            <div className="flex gap-4 text-sm flex-wrap">
              <div className="bg-pink-50 px-4 py-2 rounded-lg">
                <div className="text-pink-600 font-semibold">4</div>
                <div className="text-gray-600">知识条目</div>
              </div>
              <div className="bg-green-50 px-4 py-2 rounded-lg">
                <div className="text-green-600 font-semibold">4</div>
                <div className="text-gray-600">分类</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Category Filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                selectedCategory === category
                  ? 'bg-pink-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Knowledge Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredKnowledge.map((knowledge, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-100 p-6"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded">
                      {knowledge.category}
                    </span>
                    <span className="text-xs text-gray-500">{knowledge.date}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{knowledge.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{knowledge.summary}</p>
                </div>
              </div>
              
              <div className="mb-3">
                <div className="text-xs text-gray-500 mb-2">来源: {knowledge.source}</div>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-2">💡 核心洞察</h4>
                <ul className="space-y-1">
                  {knowledge.insights.map((insight, idx) => (
                    <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                      <span className="text-pink-500 mt-0.5">•</span>
                      <span>{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between text-sm text-gray-600 gap-2">
            <div className="flex items-center gap-2">
              <span>🌸</span>
              <span>花卷知识库 v1.0</span>
            </div>
            <div className="text-center sm:text-right text-gray-500">
              最后更新：2026-03-05 21:52 · 持续学习机制已启用
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
