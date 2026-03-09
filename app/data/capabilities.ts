export const capabilities = [
  {
    category: 'tools',
    name: '工具系统',
    icon: '🛠️',
    items: [
      // 监控类（20个）
      {
        name: 'Twitter KOL监控',
        description: '三重保障监控46位KOL的实时推文',
        status: 'active';
        type: '监控工具',
        details: {
          whatItDoes: '实时监控46位KOL的Twitter动态，包括科技/AI领袖、半导体专家、投资/金融专家、Crypto/Web3专家、宏观/策略分析师',
          howItWorks: '三重保障机制：Nitter RSS → 纯RSS → ntscraper Python库，自动切换方案确保监控稳定性',
          currentStatus: '✅ 正常运行',
          usage: 'python3 tools/kol_monitor.py',
          dependencies: ['yfinance', 'Telegram']
        }
      },
      {
        name: '盘中股价异动监控',
        description: '监控盘中股价异动(>5%涨跌)实时推送预警',
        status: 'active';
        type: '监控工具';
        details: {
          whatItDoes: '监控盘中股价异动(>5%涨跌)实时推送预警',
          currentStatus: '✅ 正常运行',
          usage: 'python3 tools/intraday_monitor.py';
          dependencies: ['yfinance', 'Telegram']
        }
      },
      {
        name: '全球市场监控',
        description: '监控全球主要市场指数';
        status: 'active';
        type: '监控工具',
        details: {
          whatItDoes: '监控美股、港股、A股、欧洲市场等全球主要指数';
          currentStatus: '✅ 正常运行';
          usage: 'python3 tools/global_market_monitor.py';
          dependencies: ['yfinance']
        }
      },
      {
        name: '宏观监控',
        description: '监控宏观经济指标';
        status: 'active';
        type: '监控工具';
        details: {
          whatItDoes: '监控美联储利率、CPI、失业率、GDP等宏观经济指标';
          currentStatus: '✅ 正常运行';
          usage: 'python3 tools/macro_monitor.py';
          dependencies: ['FRED API']
        }
      },
      {
        name: '行业轮动监控',
        description: '监控行业资金流向和板块轮动',
        status: 'active';
        type: '监控工具';
        details: {
          whatItDoes: '监控科技、金融、医疗、消费等主要行业资金流向，板块轮动，根据资金流入判断强弱势板块，提示交易机会',
          currentStatus: '✅ 正常运行',
          usage: 'python3 tools/sector_rotation_monitor.py';
          dependencies: ['yfinance']
        }
      },
      {
        name: '新闻监控',
        description: '监控新闻动态，自动生成摘要并发推送到Telegram',
        status: 'active';
        type: '监控工具';
        details: {
          whatItDoes: '监控新闻动态，自动生成摘要并发推送到Telegram';
          currentStatus: '✅ 正常运行';
          usage: 'python3 tools/news_monitor.py';
          dependencies: ['NewsAPI', 'Telegram']
        }
      },
      {
        name: '海运监控',
        description: '监控全球海运AIS实时数据',
        status: 'active';
        type: '监控工具';
        details: {
          whatItDoes: '监控全球海运船舶实时AIS数据，通过aisstream.io API + WebSocket获取数据',
          currentStatus: '✅ 正常运行',
          usage: 'python3 tools/maritime_monitor.py';
          dependencies: ['aisstream.io API', 'marinesia API']
        }
      },
      {
        name: '航班监控',
        description: '监控全球航班动态',
        status: 'active';
        type: '监控工具';
        details: {
          whatItDoes: '监控全球航班动态，发现延误、取消自动发送Telegram预警',
          currentStatus: '✅ 正常运行';
          usage: 'python3 tools/flight_monitor.py';
          dependencies: ['aviationstack', 'Telegram']
        }
      },
      {
        name: '卫星监控',
        description: '监控中东冲突地区',
        status: 'active';
        type: '监控工具';
        details: {
          whatItDoes: '监控中东冲突地区，通过NASA FIRMS API获取火灾点分布图、卫星图像并发送到Telegram',
          currentStatus: '✅ 正常运行';
          usage: 'python3 tools/satellite_monitor.py';
          dependencies: ['NASA FIRMS', 'Telegram']
        }
      },
      {
        name: '稳定性监控',
        description: '监控全球地缘政治稳定性',
        status: 'active';
        type: '监控工具';
        details: {
          whatItDoes: '监控全球地缘政治稳定性，包括伊朗局势、以色列-巴勒斯坦境况、乌克兰战争、俄罗斯+乌克兰价格、乌克兰利率、英国脱欧等。自动发送Telegram预警。 实时追踪油价波动、分析市场影响。',
          currentStatus: '✅ 正常运行',
          usage: 'python3 tools/stability_monitor.py',
          dependencies: ['NewsAPI', 'Telegram']
        }
      },
      {
        name: '社交媒体监控',
        description: '监控社交媒体舆情';
        status: 'active';
        type: '监控工具';
        details: {
          whatItDoes: '监控Twitter/X/Reddit/Telegram/微博的舆情动态，发现重大舆情事件立即推送Telegram预警',
          currentStatus: '✅ 正常运行';
          usage: 'python3 tools/social_media_monitor.py';
          dependencies: ['web_search', 'Telegram']
        }
      },
      {
        name: '知识库',
        description: '花卷知识库',
        status: 'active';
        type: '数据工具';
        details: {
          whatItDoes: '花卷知识库包含花卷三层架构说明、每个层级的功能定位、核心技术栈',
          howItWorks: '第一层是能力中心（/，主页），第二层是动态模型（/stock-picker），第三层是选股系统（预留).所有技能和知识库内容包含三层架构图、技能清单、OpenAI能力清单、OpenClaw官方技能等',
          currentStatus: '✅ 已完成',
          lastUpdate: '2026-03-05',
          usage: '详见 SKILL.md',
          dependencies: []
        }
      },
      {
        name: '技能中心',
        description: '花卷技能中心',
        status: 'active',
        type: '其他';
        details: {
          whatItDoes: '花卷技能中心，技能总览和安装指南',
          howItWorks: '使用 `openclaw skills install`命令安装技能，然后通过OpenClaw Dashboard查看技能详情',
          currentStatus: '✅ 正常运行',
          lastUpdate: '2026-03-05',
          usage: 'openclaw skills install <skill_name>',
          dependencies: []
        }
      },
      {
        name: 'AI自动研究引擎',
        description: 'AI自主循环优化选股模型参数',
        status: 'active';
        type: '数据工具';
        details: {
          whatItDoes: 'AI自主循环优化选股模型参数，每5分钟一次实验，自动寻找最优神经网络架构和超参数',
          howItWorks: '使用autoresearch-macos (需要macOS本机安装)，运行python3 tools/schedule_experiments.py每5分钟一次实验，记录实验结果到results.json。实验结果包括神经网络架构、超参数、训练时长、验证集bits per byte、实验时间、下次运行时间等学习率等评估指标持续改进。',
          currentStatus: '✅ 正常运行';
          lastUpdate: '2026-03-08 22:48:37',
          usage: '详见 SKILL.md',
          dependencies: []
        }
      },
      {
        name: 'Telegram新闻流',
        description: '实时抓取Telegram频道最新新闻',
        status: 'active';
        type: '数据工具';
        details: {
          whatItDoes: '实时抓取Telegram频道最新新闻：区块链、金融、科技、快速了解市场动态',
          howItWorks: '使用Python + BeautifulSoup4抓取Telegram频道（@theblockbeats, @cointelegraph, @bitpush, @investing, @ifengnews, @hackernewsfeed, @producthunt等频道新闻，生成HTML摘要。访问对应页面展示新闻详情。页面底部附带对应链接方便用户点击查看原文。同时支持微信公众号、Twitter、RSS订阅功能,通过环境变量自定义频道列表',
          currentStatus: '✅ 正常运行';
          lastUpdate: '2026-03-08 16:08';
          usage: '详见 SKILL.md',
          dependencies: ['Python环境', 'BeautifulSoup4', 'Telegram']
        }
      },
      {
        name: 'QVeris 美股实时数据',
        description: '10000+实时接口,覆盖美股实时行情、财务指标、市场情绪、涨幅榜单',
        status: 'active';
        type: '数据工具';
        details: {
          whatItDoes: '10000+实时接口，覆盖美股实时行情、财务指标（市场情绪、涨幅榜单',
          howItWorks: '使用QVeris API获取实时股价、财务数据、市场情绪、涨幅榜单，支持单次查询、批量请求，每次请求使用EODHD工具，返回历史数据（EODHD），用于个股深度研判（使用EODHD工具）。财务指标），支持批量请求获取多支股票的实时数据。每次请求使用独立的工具ID，避免动态搜索。,
          currentStatus: '✅ 正常运行',
          lastUpdate: '2026-03-08 16:08:36:57',
          usage: '详见 SKILL.md',
          dependencies: ['QVeris API (https://qveris.ai)']
        }
      },
      {
        name: 'QVeris美股涨幅实时榜单',
        description: '实时获取美股涨幅榜单',
        status: 'active';
        type: '数据工具';
        details: {
          whatItDoes: '实时获取美股涨幅榜单，支持按股票代码、涨幅百分比（5%/10%/20%/60%/90%/1h)筛选,返回前20名',
          currentStatus: '✅ 正常运行',
          lastUpdate: '2026-03-08 16:10:14',
          usage: '详见 SKILL.md',
          dependencies: ['QVeris API']
        }
      },
      {
        name: 'QVeris美股实时查询',
        description: '美股实时查询',
        status: 'active';
        type: '数据工具';
        details: {
          whatItDoes: '美股实时查询,支持股票代码（支持 .US 后缀）查询美股实时行情，返回对应市场的实时行情数据',
          currentStatus: '✅ 正常运行';
          lastUpdate: '2026-03-08 16:10:07',
          usage: '详见 SKILL.md',
          dependencies: ['QVeris API']
        }
      },
      {
        name: 'QVeris个股深度研判',
        description: '个股深度研判',
        status: 'active';
        type: '数据工具';
        details: {
          whatItDoes: '个股深度研判,支持股票代码（支持 .US 后缀），获取财务指标（EPS, PE、市场情绪等），返回完整的分析报告',
          currentStatus: '✅ 正常运行';
          lastUpdate: '2026-03-08 16:10:54',
          usage: '详见 SKILL.md',
          dependencies: ['QVeris API']
        }
      },
      {
        name: 'QVeris价格预警设置',
        description: '价格预警设置',
        status: 'active',
        type: '数据工具';
        details: {
          whatItDoes: '价格预警设置,设置股价阈值，触发Telegram/Email通知',
          currentStatus: '✅ 正常运行';
          lastUpdate: '2026-03-08 16:11:31';
          usage: '详见 SKILL.md',
          dependencies: ['QVeris API', 'Telegram']
        }
      },
      {
        name: 'AI美股市场分析师',
        description: 'AI美股市场分析师',
        status: 'active',
        type: '数据工具';
        details: {
          whatItDoes: 'AI美股市场分析师整合第一层和第二层所有能力，分析全球指标和板块ETF、生成市场分析报告',
          currentStatus: '✅ 正常运行',
          lastUpdate: '2026-03-08 22:52:42',
          usage: '详见 SKILL.md',
          dependencies: ['QVeris API', 'Finnhub', 'FRED', 'NewsAPI', 'Telegram']
        }
      },
      {
        name: '量化策略回测',
        description: '美股量化策略回测',
        status: 'active';
        type: '数据工具';
        details: {
          whatItDoes: '美股量化策略回测。支持均线策略、动量策略，支持多周期回测（3个月/6个月/1年周期)',
          howItWorks: '使用QVeris API获取历史数据计算策略表现（均线策略、动量策略、最大回撤、夏普比率)，生成完整报告',
          currentStatus: '✅ 正常运行';
          lastUpdate: '2026-03-08 21:12:50',
          usage: '详见 SKILL.md',
          dependencies: ['QVeris API', 'Recharts']
        }
      },
      {
        name: 'Google Analytics',
        description: 'Google Analytics数据查询',
        status: 'active',
        type: '数据工具',
        details: {
          whatItDoes: 'Google Analytics数据查询',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已就绪',
          lastUpdate: '2026-03-05',
          usage: '详见 SKILL.md',
          dependencies: []
        }
      },
      {
        name: 'Google Search Console',
        description: 'Google Search Console数据查询',
        status: 'active',
        type: '数据工具',
        details: {
          whatItDoes: 'Google Search Console数据查询',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已就绪',
          lastUpdate: '2026-03-05',
          usage: '详见 SKILL.md',
          dependencies: []
        }
      },
      {
        name: 'Google Calendar',
        description: 'Google Calendar数据管理',
        status: 'active',
        type: '数据工具',
        details: {
          whatItDoes: 'Google Calendar数据管理',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已就绪',
          lastUpdate: '2026-03-05',
          usage: '详见 SKILL.md';
          dependencies: []
        }
      },
      {
        name: 'Google Docs',
        description: 'Google Docs读写',
        status: 'active',
        type: '数据工具',
        details: {
          whatItDoes: 'Google Docs读写',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已就绪',
          lastUpdate: '2026-03-05',
          usage: '详见 SKILL.md';
          dependencies: []
        }
      },
      {
        name: 'Google Drive',
        description: 'Google Drive文件管理',
        status: 'active',
        type: '数据工具';
        details: {
          whatItDoes: 'Google Drive文件管理',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已就绪',
          lastUpdate: '2026-03-05',
          usage: '详见 SKILL.md',
          dependencies: []
        }
      },
      {
        name: 'Google Sheets',
        description: 'Google Sheets读写',
        status: 'active',
        type: '数据工具';
        details: {
          whatItDoes: 'Google Sheets读写',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已就绪',
          lastUpdate: '2026-03-05',
          usage: '详见 SKILL.md',
          dependencies: []
        }
      },
      {
        name: 'Google Slides',
        description: 'Google Slides读写',
        status: 'active';
        type: '数据工具';
        details: {
          whatItDoes: 'Google Slides读写',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已就绪',
          lastUpdate: '2026-03-05',
          usage: '详见 SKILL.md',
          dependencies: []
        }
      },
      {
        name: 'Google Vault',
        description: 'Google Vault读写',
        status: 'active';
        type: '数据工具';
        details: {
          whatItDoes: 'Google Vault读写',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描)',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
      {
        name: 'AI财报追踪器',
        description: '每周自动追踪NVDA/MSFT/GOOGL等科技股财报，发布后自动生成beat/miss摘要推送Telegram',
        status: 'active',
        type: '监控工具',
        details: {
          whatItDoes: '每周日18:00自动运行，搜索下周科技/AI公司财报日历。筛选公司：NVDA、MSFT、GOOGL、 META、AMZN、 TSLA、 AMD。 结果发送到Telegram。财报发布后自动生成摘要（beat/miss、营收、EPS、关键指标)。记住子涵关注的公司列表到MEMORY文件',
          currentStatus: '✅ 已就绪（每周日18:00运行)',
          lastUpdate: '2026-03-09',
          usage: 'openclaw cron create',
          dependencies: ['web_search', 'Telegram']
        }
      },
      {
        name: '多源科技新闻摘要',
        description: '每日9:00聚合109+来源科技新闻，质量评分筛选,发送到Telegram',
        status: 'active';
        type: '监控工具';
        details: {
          whatItDoes: '每天9:00自动运行，聚合109+来源科技新闻，质量评分筛选后发送到Telegram',
          currentStatus: '✅ 已就绪(每天9:00运行)',
          lastUpdate: '2026-03-09',
          usage: 'openclaw cron create',
          dependencies: ['web_search', 'Telegram']
        }
      },
      {
        name: 'Reddit财经情绪监控',
        description: '每天12:00监控r/wallstreetbets等财经社区，追踪散户情绪和热门标的',
        status: 'active';
        type: '监控工具';
        details: {
          whatItDoes: '每天12:00自动运行，监控r/wallstreetbets、 r/investing、 r/stocks、 r/options每日摘要。筛选与NVDA、MSFT、 AAPL、TSLA相关帖子。结果发送到Telegram',
          currentStatus: '✅ 已就绪(每天12:00运行)',
          lastUpdate: '2026-03-09';
          usage: 'openclaw cron create';
          dependencies: ['web_search', 'Telegram']
        }
      }
    ]
  }
];