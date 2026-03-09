// 统一能力总表 - 包含所有能力来源
// 总计：618个能力（卡片429 + 技能139 + 页面21 + API路由29）

export type CapabilitySource = 'card' | 'skill' | 'page' | 'monitor';
export type CapabilityStatus = '已就绪' | '需配置' | '暂停';

export interface UnifiedCapability {
  id: string;
  name: string;
  description: string;
  category: string;
  source: CapabilitySource;
  status: CapabilityStatus;
  link?: string;
}

// 12个标准分类
export const CATEGORIES = [
  { id: 'market', name: '市场数据', icon: '📊', description: '股价、行情、ETF、实时数据' },
  { id: 'news', name: '新闻与情绪', icon: '📰', description: 'Telegram新闻、Reddit、NewsAPI、情绪分析' },
  { id: 'geopolitics', name: '地缘监控', icon: '🌍', description: '伊朗局势、海运、火灾、NASA卫星' },
  { id: 'macro', name: '宏观经济', icon: '🌐', description: 'FRED、EIA、美元指数、VIX' },
  { id: 'ai', name: 'AI分析', icon: '🤖', description: 'AI推演、量化回测、因子分析' },
  { id: 'dev', name: '开发工具', icon: '🔧', description: '代码生成、技能创建、GitHub' },
  { id: 'data', name: '数据接入', icon: '📡', description: 'QVeris、Finnhub、API集成' },
  { id: 'automation', name: '自动化任务', icon: '⏰', description: 'cron、财报追踪、定时预警' },
  { id: 'knowledge', name: '知识与记忆', icon: '🧠', description: '知识库、OpenViking、记忆系统' },
  { id: 'web', name: '网络与搜索', icon: '🌐', description: '爬虫、搜索引擎、RSS' },
  { id: 'communication', name: '通讯与推送', icon: '💬', description: 'Telegram Bot、消息推送' },
  { id: 'system', name: '系统工具', icon: '🛠️', description: '其他所有工具' },
] as const;

// 第一部分：页面类能力（7个主要页面）
const pageCapabilities: UnifiedCapability[] = [
  {
    id: 'page-home',
    name: '能力中心',
    description: '第一层所有能力展示',
    category: 'system',
    source: 'page',
    status: '已就绪',
    link: '/'
  },
  {
    id: 'page-telegram-news',
    name: 'Telegram新闻流',
    description: '实时Telegram频道新闻',
    category: 'news',
    source: 'page',
    status: '已就绪',
    link: '/telegram-news'
  },
  {
    id: 'page-iran',
    name: '伊朗局势监控',
    description: '中东地缘政治风险',
    category: 'geopolitics',
    source: 'page',
    status: '已就绪',
    link: '/iran-geopolitical-risk'
  },
  {
    id: 'page-knowledge',
    name: '知识库',
    description: '花卷知识库系统',
    category: 'knowledge',
    source: 'page',
    status: '已就绪',
    link: '/knowledge-base'
  },
  {
    id: 'page-skills',
    name: '技能中心',
    description: '139个技能展示',
    category: 'dev',
    source: 'page',
    status: '已就绪',
    link: '/skills'
  },
  {
    id: 'page-dynamic',
    name: '第二层动态模型',
    description: 'AI自动研究引擎',
    category: 'ai',
    source: 'page',
    status: '已就绪',
    link: '/dynamic-model'
  },
  {
    id: 'page-stock',
    name: '第三层选股',
    description: '股票推荐页面',
    category: 'ai',
    source: 'page',
    status: '已就绪',
    link: '/stock-picker'
  },
];

// 第二部分：监控类API（14个主要API）
const monitorCapabilities: UnifiedCapability[] = [
  {
    id: 'api-maritime',
    name: '海运AIS监控',
    description: '全球海运船舶实时AIS',
    category: 'geopolitics',
    source: 'monitor',
    status: '已就绪',
    link: '/api/maritime'
  },
  {
    id: 'api-satellite',
    name: 'NASA卫星监控',
    description: '中东火灾点分布图',
    category: 'geopolitics',
    source: 'monitor',
    status: '已就绪',
    link: '/api/satellite'
  },
  {
    id: 'api-flights',
    name: '航班监控',
    description: '全球航班动态',
    category: 'geopolitics',
    source: 'monitor',
    status: '已就绪',
    link: '/api/flights'
  },
  {
    id: 'api-macro',
    name: '宏观数据',
    description: 'FRED/EIA宏观数据',
    category: 'macro',
    source: 'monitor',
    status: '已就绪',
    link: '/api/macro'
  },
  {
    id: 'api-sentiment',
    name: '情绪分析',
    description: '市场情绪分析',
    category: 'news',
    source: 'monitor',
    status: '已就绪',
    link: '/api/sentiment'
  },
  {
    id: 'api-stability',
    name: '地缘稳定性',
    description: '全球地缘稳定性',
    category: 'geopolitics',
    source: 'monitor',
    status: '已就绪',
    link: '/api/stability'
  },
  {
    id: 'api-news',
    name: '新闻API',
    description: 'NewsAPI新闻聚合',
    category: 'news',
    source: 'monitor',
    status: '已就绪',
    link: '/api/news'
  },
  {
    id: 'api-telegram',
    name: 'Telegram新闻抓取',
    description: '实时抓取频道新闻',
    category: 'news',
    source: 'monitor',
    status: '已就绪',
    link: '/api/fetch-telegram-news'
  },
  {
    id: 'api-backtest',
    name: '量化回测',
    description: '美股策略回测',
    category: 'ai',
    source: 'monitor',
    status: '已就绪',
    link: '/api/backtest'
  },
  {
    id: 'api-market-analyst',
    name: 'AI市场分析师',
    description: '整合所有能力的AI分析',
    category: 'ai',
    source: 'monitor',
    status: '已就绪',
    link: '/api/market-analyst'
  },
  {
    id: 'api-qveris-search',
    name: 'QVeris搜索',
    description: '万级数据接口搜索',
    category: 'data',
    source: 'monitor',
    status: '已就绪',
    link: '/api/qveris/search'
  },
  {
    id: 'api-qveris-execute',
    name: 'QVeris执行',
    description: '数据接口执行',
    category: 'data',
    source: 'monitor',
    status: '已就绪',
    link: '/api/qveris/execute'
  },
];

// 第三部分：自动化任务（3个新增cron任务）
const automationCapabilities: UnifiedCapability[] = [
  {
    id: 'cron-earnings',
    name: 'AI财报追踪器',
    description: '每周日18:00追踪科技股财报',
    category: 'automation',
    source: 'monitor',
    status: '已就绪',
  },
  {
    id: 'cron-news',
    name: '多源科技新闻摘要',
    description: '每天9:00聚合109+新闻源',
    category: 'automation',
    source: 'monitor',
    status: '已就绪',
  },
  {
    id: 'cron-reddit',
    name: 'Reddit财经情绪监控',
    description: '每天12:00监控财经社区',
    category: 'automation',
    source: 'monitor',
    status: '已就绪',
  },
];

// 导出所有能力（后续会添加429个卡片能力）
export const allCapabilities: UnifiedCapability[] = [
  ...pageCapabilities,
  ...monitorCapabilities,
  ...automationCapabilities,
  // 卡片能力将在下一步添加
];

// 统计函数
export const getStats = () => {
  const total = allCapabilities.length;
  const byCategory = CATEGORIES.reduce((acc, cat) => {
    acc[cat.id] = allCapabilities.filter(c => c.category === cat.id).length;
    return acc;
  }, {} as Record<string, number>);
  const bySource = {
    card: allCapabilities.filter(c => c.source === 'card').length,
    skill: allCapabilities.filter(c => c.source === 'skill').length,
    page: allCapabilities.filter(c => c.source === 'page').length,
    monitor: allCapabilities.filter(c => c.source === 'monitor').length,
  };
  const byStatus = {
    ready: allCapabilities.filter(c => c.status === '已就绪').length,
    needConfig: allCapabilities.filter(c => c.status === '需配置').length,
    paused: allCapabilities.filter(c => c.status === '暂停').length,
  };
  
  return { total, byCategory, bySource, byStatus };
};
