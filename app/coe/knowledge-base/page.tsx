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

const bookSources = [
  {
    name: 'Project Gutenberg',
    url: 'https://www.gutenberg.org/',
    description: '70,000+ 经典投资书籍（公共领域）',
    example: '《聪明的投资者》、《证券分析》'
  },
  {
    name: 'Open Library',
    url: 'https://openlibrary.org/',
    description: '数百万本现代投资书籍（合法借阅）',
    example: '当代投资理论、最新市场分析'
  },
  {
    name: 'SEC EDGAR',
    url: 'https://www.sec.gov/cgi-bin/browse-edgar',
    description: '公司财报、年报、招股书（公共领域）',
    example: '巴菲特致股东信、公司10-K年报'
  },
  {
    name: 'Internet Archive',
    url: 'https://archive.org/',
    description: '数百万本历史投资文献（合法借阅）',
    example: '历史市场分析、经典投资案例'
  }
  }
  {
    title: '$AAOI 1.6T数据中心收发器首单分析',
    source: '个人书籍提炼系统',
    date: '2026-03-09',
    summary: 'AAOI首个2亿美元1.6T数据中心收发器订单，预计成为美国最大800G和1.6T收发器生产商，每月3.78亿美元收入预测逐步验证。超大规模客户（AMZN/META/GOOGL）背书。',
    insights: [
      '首个2亿美元1.6T收发器订单验证',
      '预计成为美国最大800G/1.6T产能',
      '每月3.78亿美元收入预测验证',
      '超大规模客户（AMZN/META/GOOGL）背书',
      '投资逻辑：执行力 > 内部交易',
      '关键指标：后续订单、产能爬坡、收入确认'
    ],
    category: '投资分析'
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
  },
  {
    title: 'Phase 3: 假设验证机制',
    source: 'Interactive Benchmarks论文应用',
    date: '2026-03-05',
    summary: '实现投资假设的量化验证系统，支持4种假设类型（股价目标、市值目标、涨幅、时间），提供合理性评分和信心度评估。',
    insights: [
      '4种假设类型识别与解析',
      '量化验证模型（0-100%合理性）',
      '信心度评估（very_high到very_low）',
      '验证报告自动生成',
      '关键因素和风险因素分析',
      '投资建议智能推荐',
      '测试：AAOI、AAPL、TSLA验证成功'
    ],
    category: '交互式学习'
  },
  {
    title: 'Phase 1: 股票分析编排器',
    source: 'OpenAI Symphony 架构设计',
    date: '2026-03-05',
    summary: '实现单一权威状态管理系统，协调8大Agent（基本面、技术面、情绪、风险等）进行分析，支持错误恢复和进度追踪。',
    insights: [
      '单一权威状态管理（Source of Truth）',
      '8大Agent协调（权重总和100%）',
      '错误恢复机制（重试3次，退避5分钟）',
      '进度追踪（pending→running→completed）',
      '工作空间隔离（每个任务独立目录）',
      '生命周期钩子（创建、分析、删除）',
      '测试：成功协调AAPL分析'
    ],
    category: 'Agent编排'
  },
  {
    title: 'Phase 2: 分析工作空间管理',
    source: 'OpenAI Symphony 工作空间设计',
    date: '2026-03-05',
    summary: '实现任务隔离的工作空间系统，每个分析任务有独立目录，支持生命周期钩子、自动清理和安全不变量保护。',
    insights: [
      '任务隔离（每个股票独立工作空间）',
      '生命周期钩子（4个钩子：创建、分析、删除前后）',
      '自动清理（保留30天后删除）',
      '安全不变量（路径验证、权限检查）',
      '工作空间状态（active、completed、archived）',
      '目录结构（prompts/、results/、logs/）',
      '测试：成功创建和管理10个工作空间'
    ],
    category: 'Agent编排'
  },
  {
    title: 'Phase 3: 工作流定义与配置解析',
    source: 'OpenAI Symphony 配置层设计',
    date: '2026-03-05',
    summary: '实现YAML格式的工作流定义文件和配置解析器，支持类型化配置访问、Jinja2模板渲染和动态重载。',
    insights: [
      'YAML front matter + Markdown 格式',
      '7个数据类（类型安全配置访问）',
      'Jinja2风格模板渲染（{{ stock.symbol }}）',
      '动态重载机制（无需重启更新配置）',
      '环境变量解析（$VAR_NAME 和 ${VAR_NAME}）',
      '配置验证（并发数、权重总和、路径检查）',
      '8大Agent配置（权重30%+25%+20%+15%+10%）'
    ],
    category: 'Agent编排'
  },
  {
    title: 'Phase 4: 分析可观察性系统',
    source: 'OpenAI Symphony 可观察性设计',
    date: '2026-03-05',
    summary: '实现实时监控、性能追踪、HTTP API和美观仪表板，支持3种快照类型（Agent、分析、系统）和5个API端点。',
    insights: [
      '3种快照类型（Agent、Analysis、System）',
      '5个HTTP API端点（健康检查、系统统计、分析任务）',
      '实时仪表板（渐变设计、自动刷新5秒）',
      '8个监控指标（内存、CPU、Agent池等）',
      '系统健康检查（psutil或模拟数据）',
      '指标导出（JSON格式）',
      '测试：成功创建快照和启动HTTP API'
    ],
    category: 'Agent编排'
  },
  {
    title: 'Phase 5: 集成测试完成',
    source: 'OpenAI Symphony 集成测试',
    date: '2026-03-06',
    summary: '完成编排器+工作空间+工作流+可观察性的完整集成测试，6个测试全部通过，成功率100%，总耗时3.28秒。',
    insights: [
      '6个测试全部通过（100%成功率）',
      '工作流解析测试：5个Agent配置正确',
      '工作空间生命周期测试：创建/更新/清理成功',
      '编排器协调测试：状态转换正确（PENDING→RUNNING→COMPLETED）',
      '可观察性监控测试：快照创建成功，指标正常',
      '端到端测试：7步完整流程通过',
      '性能测试：5个并发任务，创建/启动/完成时间均<1ms',
      '总耗时：3.28秒'
    ],
    category: 'Agent编排'
  },
  {
    title: 'GLM MCP 深度测试成功',
    source: '深度测试报告',
    date: '2026-03-06',
    summary: '🎉 GLM MCP 深度测试全部通过！4个工具（联网搜索、网页读取、视觉理解、开源仓库）测试成功率100%。已成功整合进花卷选股系统。',
    insights: [
      '✅ 深度测试完成（01:30）',
      '✅ 联网搜索：41.4秒响应',
      '✅ 网页读取：54.7秒响应',
      '✅ 视觉理解：34.2秒响应',
      '✅ 开源仓库：53.5秒响应',
      '📊 成功率：100%（4/4通过）',
      '🎯 已整合进选股系统',
      '🚀 可以立即使用'
    ],
    category: 'MCP工具'
  }
  },
  {
    title: '$AAOI 1.6T数据中心收发器首单分析',
    source: '个人书籍提炼系统',
    date: '2026-03-09',
    summary: 'AAOI首个2亿美元1.6T数据中心收发器订单，预计成为美国最大800G和1.6T收发器生产商，每月3.78亿美元收入预测逐步验证。超大规模客户（AMZN/META/GOOGL）背书。',
    insights: [
      '首个2亿美元1.6T收发器订单验证',
      '预计成为美国最大800G/1.6T产能',
      '每月3.78亿美元收入预测验证',
      '超大规模客户（AMZN/META/GOOGL）背书',
      '投资逻辑：执行力 > 内部交易',
      '关键指标：后续订单、产能爬坡、收入确认'
    ],
    category: '投资分析'
  }

const categories = ['全部', 'AI理论', '选股系统', '数据抓取', '投资分析', '金融分析', '数据科学', 'Agent编排', 'MCP工具'];

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
                <div className="text-pink-600 font-semibold">5</div>
                <div className="text-gray-600">知识条目</div>
              </div>
              <div className="bg-green-50 px-4 py-2 rounded-lg">
                <div className="text-green-600 font-semibold">5</div>
                <div className="text-gray-600">分类</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Book Search Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">📚</span>
            <div>
              <h2 className="text-xl font-bold text-gray-900">合法书籍知识库</h2>
              <p className="text-sm text-gray-600">整合4大合法数据源，支持书籍搜索和投资知识提炼</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {bookSources.map((source, index) => (
              <a
                key={index}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-lg p-4 hover:shadow-md transition-all border border-gray-200"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">📖</span>
                  <h3 className="font-bold text-gray-900">{source.name}</h3>
                </div>
                <p className="text-sm text-gray-600 mb-2">{source.description}</p>
                <p className="text-xs text-gray-500 italic">{source.example}</p>
              </a>
            ))}
          </div>
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              💡 <strong>使用方法：</strong>点击上方数据源搜索书籍 → 下载或借阅 → 发送给花卷进行六维蒸馏法提炼 → 存入知识库
            </p>
          </div>
        </div>
      </div>

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
