'use client';

import { useState } from 'react';

interface Skill {
  name: string;
  description: string;
  category: string;
  status: 'active' | 'beta' | 'coming-soon';
  icon: string;
}

const skills: Skill[] = [
  // 金融分析类（27个）
  { name: 'Stock Research Engine', description: '个股基本面深度研究引擎，覆盖A股/港股/美股', category: '金融分析', status: 'active', icon: '🔬' },
  { name: 'US Stock Analysis', description: '美股综合分析（基本面+技术面+投资建议）', category: '金融分析', status: 'active', icon: '🇺🇸' },
  { name: 'Stock Market Pro', description: '专业股票市场分析（RSI/MACD/BB/VWAP/ATR）', category: '金融分析', status: 'active', icon: '📊' },
  { name: 'Stock Info Explorer', description: '股票信息探索器（高分辨率图表+技术指标）', category: '金融分析', status: 'active', icon: '📈' },
  { name: 'Stock Analysis 6.2.0', description: '股票分析6.2.0版本', category: '金融分析', status: 'active', icon: '📉' },
  { name: 'Backtest Expert', description: '策略回测专家', category: '金融分析', status: 'active', icon: '🧪' },
  { name: 'Portfolio Manager', description: '投资组合管理', category: '金融分析', status: 'active', icon: '💼' },
  { name: 'US Market Bubble Detector', description: '美国市场泡沫检测', category: '金融分析', status: 'active', icon: '🫧' },
  { name: 'Options Strategy Advisor', description: '期权策略顾问', category: '金融分析', status: 'active', icon: '📊' },
  { name: 'OptionsHawk', description: '期权鹰', category: '金融分析', status: 'active', icon: '🦅' },
  { name: 'Market Environment Analysis', description: '市场环境分析', category: '金融分析', status: 'active', icon: '🌍' },
  { name: 'Sector Analyst', description: '行业分析师', category: '金融分析', status: 'active', icon: '🏢' },
  { name: 'Earnings Calendar', description: '财报日历', category: '金融分析', status: 'active', icon: '📅' },
  { name: 'Economic Calendar Fetcher', description: '经济日历获取器', category: '金融分析', status: 'active', icon: '📆' },
  { name: 'Financial Analysis', description: '财务分析', category: '金融分析', status: 'active', icon: '📊' },
  { name: 'Intellectia Stock Screener', description: 'Intellectia AI股票筛选器', category: '金融分析', status: 'active', icon: '🤖' },
  { name: 'Intellectia Stock Forecast', description: 'Intellectia AI股票预测', category: '金融分析', status: 'active', icon: '🔮' },
  { name: 'A Stock Analysis', description: 'A股分析系统', category: '金融分析', status: 'active', icon: '🇨🇳' },
  { name: 'Astock Daily', description: 'A股日报', category: '金融分析', status: 'active', icon: '📰' },
  { name: 'PRISM Finance OS', description: 'PRISM金融OS（218+只读API）', category: '金融分析', status: 'active', icon: '💎' },
  { name: 'PRISM API SDK', description: 'PRISM API SDK', category: '金融分析', status: 'active', icon: '🔧' },
  { name: 'Finance', description: '股票/ETF/指数/加密货币追踪', category: '金融分析', status: 'active', icon: '💰' },
  { name: 'ETF Finance', description: 'ETF和基金组合管理（盈亏+预警）', category: '金融分析', status: 'active', icon: '🏦' },
  { name: 'Finance Lite', description: '每日宏观+市场简报', category: '金融分析', status: 'active', icon: '☀️' },
  { name: 'Finance News', description: '市场新闻简报（AI总结）', category: '金融分析', status: 'active', icon: '🗞️' },
  { name: 'Sina Stock', description: '新浪财经A股实时数据', category: '金融分析', status: 'active', icon: '📱' },
  { name: 'Tecent Finance', description: '腾讯财经（港股+美股）', category: '金融分析', status: 'active', icon: '💎' },
  { name: 'Yahoo Finance', description: '雅虎财经全球股票数据', category: '金融分析', status: 'active', icon: '🌐' },
  { name: 'Trading Quant', description: '量化交易数据分析（技术+资金+基本面）', category: '金融分析', status: 'active', icon: '🎯' },
  { name: 'HK Stock Trending', description: '港股趋势分析', category: '金融分析', status: 'active', icon: '🇭🇰' },
  { name: 'A Share Real Time Data', description: 'A股实时数据（mootdx/TDX协议）', category: '金融分析', status: 'active', icon: '📊' },
  { name: 'Finance Tracker', description: '完整个人财务管理（支出+订阅+储蓄+多货币）', category: '金融分析', status: 'active', icon: '💰' },
  { name: 'AI News Oracle', description: 'AI新闻神谕（Hacker News+TechCrunch+Verge）', category: '金融分析', status: 'active', icon: '📰' },
  { name: 'Market Intelligence', description: '市场情报分析系统', category: '金融分析', status: 'active', icon: '🔍' },
  { name: 'Breadth Chart Analyst', description: '市场宽度图表分析', category: '金融分析', status: 'active', icon: '📊' },
  { name: 'Biz Reporter', description: '商业智能报告（GA4+Search Console+Stripe）', category: '金融分析', status: 'active', icon: '📊' },
  { name: 'Accounting Workflows', description: '会计工作流自动化', category: '金融分析', status: 'active', icon: '💼' },
  { name: 'BBC News', description: 'BBC新闻抓取和分析', category: '金融分析', status: 'active', icon: '🗞️' },
  { name: 'Apify Competitor Intelligence', description: '竞争对手情报分析', category: '金融分析', status: 'active', icon: '🔍' },

  // 投资组合与交易（7个）
  { name: 'Portfolio Tracking Skill', description: '投资组合追踪', category: '投资组合', status: 'active', icon: '📊' },
  { name: 'Crypto Portfolio Tracker API', description: '加密货币投资组合追踪API', category: '投资组合', status: 'active', icon: '💰' },
  { name: 'Passive Income Tracker', description: '被动收入追踪', category: '投资组合', status: 'active', icon: '💵' },
  { name: 'Trading Devbox', description: '交易开发盒', category: '交易系统', status: 'active', icon: '📦' },
  { name: 'Trading212 API', description: 'Trading212 API', category: '交易系统', status: 'active', icon: '🔌' },
  { name: 'Realtime Crypto Price API', description: '实时加密货币价格API', category: '交易系统', status: 'active', icon: '⚡' },
  { name: 'X Alpha Scout', description: 'X Alpha侦察', category: 'AI分析', status: 'active', icon: '🎯' },

  // 数据抓取类（9个）
  { name: 'XPR Web Scraping', description: 'XPR网页抓取', category: '数据抓取', status: 'active', icon: '🕷️' },
  { name: 'Smart Web Scraper', description: '智能网页抓取器', category: '数据抓取', status: 'active', icon: '🧠' },
  { name: 'XPR Structured Data', description: 'XPR结构化数据', category: '数据抓取', status: 'active', icon: '📋' },
  { name: 'Agent Browser', description: 'Agent浏览器自动化', category: '数据抓取', status: 'active', icon: '🌐' },
  { name: 'Playwright Headless Browser', description: 'Playwright无头浏览器', category: '数据抓取', status: 'active', icon: '🎭' },
  { name: 'Browser Use', description: '浏览器使用工具', category: '数据抓取', status: 'active', icon: '🔍' },
  { name: 'Data Enricher', description: '数据增强（邮件+格式化）', category: '数据抓取', status: 'active', icon: '✨' },
  { name: 'DataForSEO', description: 'SEO和SERP数据（Google搜索）', category: '数据抓取', status: 'active', icon: '🔍' },
  { name: 'Reddit API', description: 'Reddit API', category: '数据抓取', status: 'active', icon: '📱' },

  // 新闻与情绪分析（5个）
  { name: 'Social Sentiment', description: '社交情绪分析', category: '新闻情绪', status: 'active', icon: '💬' },
  { name: 'NewsAPI Search', description: 'NewsAPI搜索', category: '新闻情绪', status: 'active', icon: '🔍' },
  { name: 'CLS News Scraper', description: 'CLS新闻爬虫', category: '新闻情绪', status: 'active', icon: '🗞️' },
  { name: 'IPO Alert', description: 'IPO提醒', category: '新闻情绪', status: 'active', icon: '🔔' },
  { name: 'AI CFO', description: 'AI CFO', category: 'AI分析', status: 'active', icon: '🤖' },

  // 网站开发类（6个）
  { name: 'React Expert', description: 'React 18+专家（组件+Hooks+状态管理）', category: '网站开发', status: 'active', icon: '⚛️' },
  { name: 'Clerk Auth', description: 'Clerk认证系统（API Keys + Next.js 16）', category: '网站开发', status: 'active', icon: '🔐' },
  { name: 'Cloudflare Agent Tunnel', description: 'Cloudflare隧道（HTTPS URL）', category: '网站开发', status: 'active', icon: '☁️' },
  { name: 'React Local Biz', description: 'React本地业务网站生成', category: '网站开发', status: 'active', icon: '🏢' },
  { name: 'React NextJS Generator', description: 'React Next.js项目生成器', category: '网站开发', status: 'active', icon: '🚀' },
  { name: 'React Component Generator', description: 'React组件生成器', category: '网站开发', status: 'active', icon: '🧩' },

  // 数据分析类（11个）
  { name: 'Data Analyst', description: '数据可视化+SQL查询+电子表格', category: '数据分析', status: 'active', icon: '📊' },
  { name: 'Finance Automation', description: '金融自动化', category: '数据分析', status: 'active', icon: '🤖' },
  { name: 'Google Analytics API', description: 'Google Analytics数据访问和分析', category: '数据分析', status: 'active', icon: '📈' },
  { name: 'Advanced Calendar', description: '高级日历管理（支持多种日历服务）', category: '数据分析', status: 'active', icon: '📅' },
  { name: 'Google Calendar', description: 'Google日历集成', category: '数据分析', status: 'active', icon: '📆' },
  { name: 'Daily Report', description: '每日业务报告生成', category: '数据分析', status: 'active', icon: '📊' },
  { name: 'Agent Dashboard', description: 'Agent实时仪表板', category: '数据分析', status: 'active', icon: '📊' },
  { name: 'CSV Pipeline', description: 'CSV数据处理管道', category: '数据分析', status: 'active', icon: '📊' },
  { name: 'Chartclass', description: '图表类库（多种图表类型）', category: '数据分析', status: 'active', icon: '📊' },
  { name: 'OpenClaw Dashboard', description: 'OpenClaw仪表板', category: '数据分析', status: 'active', icon: '📊' },
  { name: 'OC Daily Business Report', description: '每日业务报告', category: '数据分析', status: 'active', icon: '📊' },

  // 自动化与集成（3个）
  { name: 'N8N Workflow Automation', description: 'N8N工作流自动化平台', category: '自动化', status: 'active', icon: '🔄' },
  { name: 'AgentMail Integration', description: 'Agent邮件集成', category: '自动化', status: 'active', icon: '📧' },
  { name: 'Prism Alerts', description: 'Prism提醒系统', category: '自动化', status: 'active', icon: '🔔' },
  { name: 'Apipick Email Checker', description: '邮件检查API', category: '自动化', status: 'active', icon: '✉️' },
];

const categories = ['全部', '金融分析', '投资组合', '交易系统', '数据抓取', '新闻情绪', 'AI分析', '网站开发', '数据分析', '自动化'];

const categoryIcons: Record<string, string> = {
  '全部': '🌸',
  '金融分析': '📊',
  '投资组合': '💼',
  '交易系统': '⚡',
  '数据抓取': '🕷️',
  '新闻情绪': '📰',
  'AI分析': '🤖',
  '网站开发': '🚀',
  '数据分析': '📈',
  '自动化': '🔄',
};

export default function SkillsPage() {
  const [selectedCategory, setSelectedCategory] = useState('全部');

  const filteredSkills = selectedCategory === '全部'
    ? skills
    : skills.filter(skill => skill.category === selectedCategory);

  const stats = {
    total: skills.length,
    active: skills.filter(s => s.status === 'active').length,
    categories: categories.length - 1,
  };

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
                  <h1 className="text-2xl font-bold text-gray-900">花卷技能中心</h1>
                  <p className="text-sm text-gray-500">82个专业技能 · 覆盖选股、分析、开发、自动化全流程</p>
                </div>
              </a>
            </div>
            <div className="flex gap-4 text-sm flex-wrap">
              <div className="bg-pink-50 px-4 py-2 rounded-lg">
                <div className="text-pink-600 font-semibold">{stats.total}</div>
                <div className="text-gray-600">总技能</div>
              </div>
              <div className="bg-green-50 px-4 py-2 rounded-lg">
                <div className="text-green-600 font-semibold">{stats.active}</div>
                <div className="text-gray-600">正常运行</div>
              </div>
              <div className="bg-blue-50 px-4 py-2 rounded-lg">
                <div className="text-blue-600 font-semibold">{stats.categories}</div>
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
              {categoryIcons[category]} {category}
            </button>
          ))}
        </div>
      </div>

      {/* Skills Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredSkills.map((skill, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-100 p-5 hover:border-pink-200"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="text-3xl">{skill.icon}</div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  skill.status === 'active'
                    ? 'bg-green-50 text-green-600'
                    : skill.status === 'beta'
                    ? 'bg-yellow-50 text-yellow-600'
                    : 'bg-gray-50 text-gray-500'
                }`}>
                  {skill.status === 'active' ? '✅ 正常' : skill.status === 'beta' ? '🟡 测试' : '⏳ 即将上线'}
                </span>
              </div>
              <h3 className="text-lg font-bold mb-2 text-gray-900">{skill.name}</h3>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{skill.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
                  {skill.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-6">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">📊 能力统计</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4">
            <div className="text-center bg-white rounded-lg p-4 shadow-sm">
              <div className="text-3xl font-bold text-pink-500 mb-1">37</div>
              <div className="text-sm text-gray-600">金融分析</div>
            </div>
            <div className="text-center bg-white rounded-lg p-4 shadow-sm">
              <div className="text-3xl font-bold text-green-500 mb-1">7</div>
              <div className="text-sm text-gray-600">投资组合</div>
            </div>
            <div className="text-center bg-white rounded-lg p-4 shadow-sm">
              <div className="text-3xl font-bold text-blue-500 mb-1">9</div>
              <div className="text-sm text-gray-600">数据抓取</div>
            </div>
            <div className="text-center bg-white rounded-lg p-4 shadow-sm">
              <div className="text-3xl font-bold text-purple-500 mb-1">5</div>
              <div className="text-sm text-gray-600">新闻情绪</div>
            </div>
            <div className="text-center bg-white rounded-lg p-4 shadow-sm">
              <div className="text-3xl font-bold text-orange-500 mb-1">6</div>
              <div className="text-sm text-gray-600">网站开发</div>
            </div>
            <div className="text-center bg-white rounded-lg p-4 shadow-sm">
              <div className="text-3xl font-bold text-cyan-500 mb-1">11</div>
              <div className="text-sm text-gray-600">数据分析</div>
            </div>
            <div className="text-center bg-white rounded-lg p-4 shadow-sm">
              <div className="text-3xl font-bold text-indigo-500 mb-1">4</div>
              <div className="text-sm text-gray-600">自动化</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between text-sm text-gray-600 gap-2">
            <div className="flex items-center gap-2">
              <span>🌸</span>
              <span>花卷技能中心 v2.0</span>
            </div>
            <div className="text-center sm:text-right text-gray-500">
              最后更新：2026-03-05 20:20 · 自动同步机制已启用
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
