'use client';

import { useState, useEffect } from 'react';

interface Knowledge {
  title: string;
  source: string;
  date: string;
  summary: string;
  insights: string[];
  category: string;
  type?: string;
  icon?: string;
  tag?: string;
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
];

// 从 capabilities.ts 硬编码的16个知识库能力
const capabilitiesKnowledge: Knowledge[] = [
  {
    title: '知识库更新流程',
    source: '花卷系统',
    date: '2026-03-09',
    summary: '自动学习和保存有价值的信息',
    insights: [
      '信息收集 → 分析价值 → 分类归档 → 整合应用 → 确认反馈',
      '自动触发',
      '分类归档',
      '整合应用'
    ],
    category: '系统功能',
    type: '知识库',
    icon: '📚'
  },
  {
    title: '已保存的重要洞察',
    source: '花卷系统',
    date: '2026-03-09',
    summary: '5个核心洞察（量化、量子计算、CTA模型、黄金投资）',
    insights: [
      '子涵量化洞察（回测价值）',
      'Jensen Huang量子计算洞察',
      'CTA模型卖出信号',
      '黄金投资宏观框架'
    ],
    category: '系统功能',
    type: '知识库',
    icon: '📚'
  },
  {
    title: '行业分析知识库',
    source: '花卷系统',
    date: '2026-03-09',
    summary: '按行业分类的深度分析框架',
    insights: [
      '量子计算（Jensen Huang洞察）',
      'IONQ vs RGTI对比',
      '半导体行业',
      'AI行业'
    ],
    category: '系统功能',
    type: '知识库',
    icon: '📚'
  },
  {
    title: '量化策略库',
    source: '花卷系统',
    date: '2026-03-09',
    summary: '量化策略和学习材料',
    insights: [
      '量化策略',
      '回测技术',
      '学习材料'
    ],
    category: '系统功能',
    type: '知识库',
    icon: '📚'
  },
  {
    title: 'Interactive Benchmarks: 评估模型的交互学习能力',
    source: 'arXiv:2411.14451',
    date: '2026-03-05',
    summary: '评估AI模型"主动获取信息"能力的革命性基准测试方法',
    insights: [
      '智能不仅是回答问题，更是提问的能力',
      '从"答案导向"到"过程导向"的范式转变',
      '主动获取信息比被动接收更重要',
      '过程比结果更能体现智能',
      '交互式学习是持续改进的基础'
    ],
    category: 'AI理论',
    type: '知识条目',
    icon: '📖'
  },
  {
    title: '选股系统的交互式学习应用',
    source: '基于Interactive Benchmarks论文',
    date: '2026-03-05',
    summary: '将交互式学习理论应用到选股系统，实现从"静态推荐"到"动态学习"的革命性改进',
    insights: [
      '主动识别信息缺口并补充',
      '持续监控市场动态并更新评估',
      '验证投资假设并持续优化',
      '建立知识库的持续学习机制',
      '透明的决策过程展示'
    ],
    category: '选股系统',
    type: '知识条目',
    icon: '📖'
  },
  {
    title: 'Agent Reach 数据抓取系统',
    source: 'Agent Reach v1.3.0',
    date: '2026-03-05',
    summary: 'Agent Reach是一个强大的数据抓取系统，支持Twitter、Reddit、YouTube、B站等7个平台的数据抓取和情绪分析',
    insights: [
      'Twitter/X推文抓取和情绪分析',
      'Reddit帖子和评论抓取',
      '微信公众号文章抓取',
      'YouTube和B站视频信息提取',
      '全网语义搜索（Exa，免费）',
      '任意网页读取（Jina Reader）',
      '整合进选股系统的数据抓取层'
    ],
    category: '数据抓取',
    type: '知识条目',
    icon: '📖'
  },
  {
    title: '$AAOI 深度投资分析：6.3倍上涨空间',
    source: '个人书籍提炼系统',
    date: '2026-03-05',
    summary: 'Applied Optoelectronics ($AAOI) 当前市值$7.5B，目标估值$47.6B。垂直整合能力、美国制造、AI数据中心需求驱动',
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
    category: '投资分析',
    type: '知识条目',
    icon: '📖'
  },
  {
    title: 'Phase 3: 假设验证机制',
    source: 'Interactive Benchmarks论文应用',
    date: '2026-03-05',
    summary: '实现投资假设的量化验证系统，支持4种假设类型（股价目标、市值目标、涨幅、时间），提供合理性评分和信心度评估',
    insights: [
      '4种假设类型识别与解析',
      '量化验证模型（0-100%合理性）',
      '信心度评估（very_high到very_low）',
      '验证报告自动生成',
      '关键因素和风险因素分析',
      '投资建议智能推荐',
      '测试：AAOI、AAPL、TSLA验证成功'
    ],
    category: '交互式学习',
    type: '知识条目',
    icon: '📖'
  },
  {
    title: 'Phase 1: 股票分析编排器',
    source: 'OpenAI Symphony 架构设计',
    date: '2026-03-05',
    summary: '实现单一权威状态管理系统，协调8大Agent（基本面、技术面、情绪、风险等）进行分析，支持错误恢复和进度追踪',
    insights: [
      '单一权威状态管理（Source of Truth）',
      '8大Agent协调（权重总和100%）',
      '错误恢复机制（重试3次，退避5分钟）',
      '进度追踪（pending→running→completed）',
      '工作空间隔离（每个任务独立目录）',
      '生命周期钩子（创建、分析、删除）',
      '测试：成功协调AAPL分析'
    ],
    category: 'Agent编排',
    type: '知识条目',
    icon: '📖'
  },
  {
    title: 'Phase 2: 分析工作空间管理',
    source: 'OpenAI Symphony 工作空间设计',
    date: '2026-03-05',
    summary: '实现任务隔离的工作空间系统，每个分析任务有独立目录，支持生命周期钩子、自动清理和安全不变量保护',
    insights: [
      '任务隔离（每个股票独立工作空间）',
      '生命周期钩子（4个钩子：创建、分析、删除前后）',
      '自动清理（保留30天后删除）',
      '安全不变量（路径验证、权限检查）',
      '工作空间状态（active、completed、archived）',
      '目录结构（prompts/、results/、logs/）',
      '测试：成功创建和管理10个工作空间'
    ],
    category: 'Agent编排',
    type: '知识条目',
    icon: '📖'
  },
  {
    title: 'Phase 3: 工作流定义与配置解析',
    source: 'OpenAI Symphony 配置层设计',
    date: '2026-03-05',
    summary: '实现YAML格式的工作流定义文件和配置解析器，支持类型化配置访问、Jinja2模板渲染和动态重载',
    insights: [
      'YAML front matter + Markdown 格式',
      '7个数据类（类型安全配置访问）',
      'Jinja2风格模板渲染（{{ stock.symbol }}）',
      '动态重载机制（无需重启更新配置）',
      '环境变量解析（$VAR_NAME 和 ${VAR_NAME}）',
      '配置验证（并发数、权重总和、路径检查）',
      '8大Agent配置（权重30%+25%+20%+15%+10%）'
    ],
    category: 'Agent编排',
    type: '知识条目',
    icon: '📖'
  },
  {
    title: 'Phase 4: 分析可观察性系统',
    source: 'OpenAI Symphony 可观察性设计',
    date: '2026-03-05',
    summary: '实现实时监控、性能追踪、HTTP API和美观仪表板，支持3种快照类型（Agent、分析、系统）和5个API端点',
    insights: [
      '3种快照类型（Agent、Analysis、System）',
      '5个HTTP API端点（健康检查、系统统计、分析任务）',
      '实时仪表板（渐变设计、自动刷新5秒）',
      '8个监控指标（内存、CPU、Agent池等）',
      '系统健康检查（psutil或模拟数据）',
      '指标导出（JSON格式）',
      '测试：成功创建快照和启动HTTP API'
    ],
    category: 'Agent编排',
    type: '知识条目',
    icon: '📖'
  },
  {
    title: 'Phase 5: 集成测试完成',
    source: 'OpenAI Symphony 集成测试',
    date: '2026-03-06',
    summary: '完成编排器+工作空间+工作流+可观察性的完整集成测试，6个测试全部通过，成功率100%，总耗时3.28秒',
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
    category: 'Agent编排',
    type: '知识条目',
    icon: '📖'
  },
  {
    title: 'GLM MCP 深度测试成功',
    source: '深度测试报告',
    date: '2026-03-06',
    summary: 'GLM MCP 深度测试全部通过！4个工具（联网搜索、网页读取、视觉理解、开源仓库）测试成功率100%。已成功整合进花卷选股系统',
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
    category: 'MCP工具',
    type: '知识条目',
    icon: '📖'
  },
  {
    title: '$AAOI 1.6T数据中心收发器首单分析',
    source: '个人书籍提炼系统',
    date: '2026-03-09',
    summary: 'AAOI首个2亿美元1.6T数据中心收发器订单，预计成为美国最大800G和1.6T收发器生产商，每月3.78亿美元收入预测逐步验证',
    insights: [
      '首个2亿美元1.6T收发器订单验证',
      '预计成为美国最大800G/1.6T产能',
      '每月3.78亿美元收入预测验证',
      '超大规模客户（AMZN/META/GOOGL）背书',
      '投资逻辑：执行力 > 内部交易',
      '关键指标：后续订单、产能爬坡、收入确认'
    ],
    category: '投资分析',
    type: '知识条目',
    icon: '📖'
  },
  {
    title: 'Groq被NVIDIA收购：推理芯片商业量产',
    source: '市场新闻',
    date: '2026-03-09',
    summary: 'NVIDIA以约200亿美元收购Groq，三星代工厂晶圆产量从9000片提升至15000片，进入推理芯片商业量产阶段',
    insights: [
      'NVIDIA约200亿美元收购Groq',
      '三星代工产能提升（9000 → 15000片）',
      'GTC 2026发布推理专用芯片',
      '用SRAM替代HBM（更快、更高效、更低成本）',
      '投资逻辑：关注NVDA及推理芯片相关标的',
      '关键指标：收购金额、产能提升、发布时间'
    ],
    category: '投资分析',
    type: '知识条目',
    icon: '📖'
  }
];

export default function KnowledgeBasePage() {
  const [fileKnowledge, setFileKnowledge] = useState<Knowledge[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchKnowledge() {
      try {
        const res = await fetch('/api/knowledge-base');
        const data = await res.json();
        // 为文件知识添加标签
        const knowledgeWithTags = (data.knowledge || []).map((k: Knowledge) => ({
          ...k,
          tag: '知识条目'
        }));
        setFileKnowledge(knowledgeWithTags);
      } catch (error) {
        console.error('Error fetching knowledge:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchKnowledge();
  }, []);

  // 合并两部分知识：capabilities.ts 的16个 + knowledge_base/ 目录的4个
  const allKnowledge = [...capabilitiesKnowledge, ...fileKnowledge];

  // 按日期排序（最新在前）
  allKnowledge.sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return dateB - dateA;
  });

  // 简化分类：只有"全部"、"知识条目"、"合法书籍知识库"
  const categories = ['全部', '知识条目', '合法书籍知识库'];

  const filteredKnowledge = selectedCategory === '全部'
    ? allKnowledge
    : selectedCategory === '知识条目'
      ? allKnowledge.filter(k => !k.tag || k.tag === '知识条目')
      : allKnowledge.filter(k => k.tag === '合法书籍知识库');

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <a href="/coe" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                <span className="text-4xl">🌸</span>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">花卷知识库</h1>
                  <p className="text-sm text-gray-500">持续学习 · 持续进化</p>
                </div>
              </a>
            </div>
            <div className="flex gap-4 text-sm flex-wrap">
              <div className="bg-pink-50 px-4 py-2 rounded-lg">
                <div className="text-pink-600 font-semibold">{allKnowledge.length}</div>
                <div className="text-gray-600">📖 知识条目</div>
              </div>
              <div className="bg-blue-50 px-4 py-2 rounded-lg">
                <div className="text-blue-600 font-semibold">{bookSources.length}</div>
                <div className="text-gray-600">📚 合法书籍知识库</div>
              </div>
              <div className="bg-purple-50 px-4 py-2 rounded-lg">
                <div className="text-purple-600 font-semibold">{allKnowledge.length + bookSources.length}</div>
                <div className="text-gray-600">知识库总数</div>
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
                className="bg-white rounded-lg p-4 hover:shadow-md transition-all border border-gray-200 relative"
              >
                <div className="absolute top-2 right-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full flex items-center gap-1">
                    📚 合法书籍知识库
                  </span>
                </div>
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
        {loading ? (
          <div className="text-center py-12">
            <div className="text-gray-500">加载中...</div>
          </div>
        ) : filteredKnowledge.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500">暂无知识条目</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredKnowledge.map((knowledge, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-100 p-6"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs bg-pink-100 text-pink-800 px-2 py-1 rounded-full">
                        📖 知识条目
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
        )}
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between text-sm text-gray-600 gap-2">
            <div className="flex items-center gap-2">
              <span>🌸</span>
              <span>花卷知识库 v2.0</span>
            </div>
            <div className="text-center sm:text-right text-gray-500">
              最后更新：{new Date().toLocaleDateString('zh-CN')} · 持续学习机制已启用
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
