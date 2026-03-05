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
  // 金融分析类（17个）
  { name: 'Stock Research Engine', description: '个股基本面深度研究引擎，覆盖A股/港股/美股', category: '金融分析', status: 'active', icon: '🔬' },
  { name: 'US Stock Analysis', description: '美股综合分析（基本面+技术面+投资建议）', category: '金融分析', status: 'active', icon: '🇺🇸' },
  { name: 'Stock Market Pro', description: '专业股票市场分析（RSI/MACD/BB/VWAP/ATR）', category: '金融分析', status: 'active', icon: '📊' },
  { name: 'Stock Info Explorer', description: '股票信息探索器（高分辨率图表+技术指标）', category: '金融分析', status: 'active', icon: '📈' },
  { name: 'Stock Analysis 6.2.0', description: '股票分析6.2.0版本', category: '金融分析', status: 'active', icon: '📉' },
  { name: 'Intellectia Stock Screener', description: 'Intellectia AI股票筛选器', category: '金融分析', status: 'active', icon: '🤖' },
  { name: 'A Stock Analysis', description: 'A股分析系统', category: '金融分析', status: 'active', icon: '🇨🇳' },
  { name: 'Astock Daily', description: 'A股日报', category: '金融分析', status: 'active', icon: '📰' },
  { name: 'PRISM Finance OS', description: 'PRISM金融OS（218+只读API）', category: '金融分析', status: 'active', icon: '💎' },
  { name: 'Finance', description: '股票/ETF/指数/加密货币追踪', category: '金融分析', status: 'active', icon: '💰' },
  { name: 'ETF Finance', description: 'ETF和基金组合管理（盈亏+预警）', category: '金融分析', status: 'active', icon: '🏦' },
  { name: 'Finance Lite', description: '每日宏观+市场简报', category: '金融分析', status: 'active', icon: '☀️' },
  { name: 'Finance News', description: '市场新闻简报（AI总结）', category: '金融分析', status: 'active', icon: '🗞️' },
  { name: 'Sina Stock', description: '新浪财经A股实时数据', category: '金融分析', status: 'active', icon: '📱' },
  { name: 'Tecent Finance', description: '腾讯财经（港股+美股）', category: '金融分析', status: 'active', icon: '💎' },
  { name: 'Yahoo Finance', description: '雅虎财经全球股票数据', category: '金融分析', status: 'active', icon: '🌐' },
  { name: 'Trading Quant', description: '量化交易数据分析（技术+资金+基本面）', category: '金融分析', status: 'active', icon: '🎯' },

  // 数据抓取类（6个）
  { name: 'XPR Web Scraping', description: 'XPR网页抓取', category: '数据抓取', status: 'active', icon: '🕷️' },
  { name: 'Agent Browser', description: 'Agent浏览器自动化', category: '数据抓取', status: 'active', icon: '🌐' },
  { name: 'Playwright Headless Browser', description: 'Playwright无头浏览器', category: '数据抓取', status: 'active', icon: '🎭' },
  { name: 'Browser Use', description: '浏览器使用工具', category: '数据抓取', status: 'active', icon: '🔍' },
  { name: 'Data Enricher', description: '数据增强（邮件+格式化）', category: '数据抓取', status: 'active', icon: '✨' },
  { name: 'DataForSEO', description: 'SEO和SERP数据（Google搜索）', category: '数据抓取', status: 'active', icon: '🔍' },

  // 网站开发类（6个）
  { name: 'React Expert', description: 'React 18+专家（组件+Hooks+状态管理）', category: '网站开发', status: 'active', icon: '⚛️' },
  { name: 'Clerk Auth', description: 'Clerk认证系统（API Keys + Next.js 16）', category: '网站开发', status: 'active', icon: '🔐' },
  { name: 'Cloudflare Agent Tunnel', description: 'Cloudflare隧道（HTTPS URL）', category: '网站开发', status: 'active', icon: '☁️' },
  { name: 'React Local Biz', description: 'React本地业务网站生成', category: '网站开发', status: 'active', icon: '🏢' },
  { name: 'React NextJS Generator', description: 'React Next.js项目生成器', category: '网站开发', status: 'active', icon: '🚀' },
  { name: 'React Component Generator', description: 'React组件生成器', category: '网站开发', status: 'active', icon: '🧩' },

  // 数据分析类（4个）
  { name: 'Data Analyst', description: '数据可视化+SQL查询+电子表格', category: '数据分析', status: 'active', icon: '📊' },
  { name: 'Intellectia Stock Forecast', description: 'Intellectia AI股票预测', category: '数据分析', status: 'active', icon: '🔮' },
  { name: 'HK Stock Trending', description: '港股趋势分析', category: '数据分析', status: 'active', icon: '🇭🇰' },
  { name: 'Finance Automation', description: '金融自动化', category: '数据分析', status: 'active', icon: '🤖' },
];

const categories = ['全部', '金融分析', '数据抓取', '网站开发', '数据分析'];

export default function SkillsPage() {
  const [selectedCategory, setSelectedCategory] = useState('全部');

  const filteredSkills = selectedCategory === '全部'
    ? skills
    : skills.filter(skill => skill.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            🌸 花卷能力中心
          </h1>
          <p className="text-xl text-gray-400">
            33个专业技能 · 覆盖选股、分析、开发全流程
          </p>
          <div className="mt-4 flex justify-center gap-4">
            <div className="bg-blue-500/20 px-4 py-2 rounded-lg">
              <span className="text-blue-400 font-bold">248</span>
              <span className="text-gray-400 ml-2">个能力点</span>
            </div>
            <div className="bg-green-500/20 px-4 py-2 rounded-lg">
              <span className="text-green-400 font-bold">240</span>
              <span className="text-gray-400 ml-2">正常运行</span>
            </div>
            <div className="bg-purple-500/20 px-4 py-2 rounded-lg">
              <span className="text-purple-400 font-bold">24</span>
              <span className="text-gray-400 ml-2">个分类</span>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex justify-center gap-4 mb-8">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                selectedCategory === category
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSkills.map((skill, index) => (
            <div
              key={index}
              className="bg-gray-800 rounded-xl p-6 hover:bg-gray-750 transition-all hover:scale-105 border border-gray-700"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="text-4xl">{skill.icon}</div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  skill.status === 'active'
                    ? 'bg-green-500/20 text-green-400'
                    : skill.status === 'beta'
                    ? 'bg-yellow-500/20 text-yellow-400'
                    : 'bg-gray-500/20 text-gray-400'
                }`}>
                  {skill.status === 'active' ? '✅ 正常' : skill.status === 'beta' ? '🟡 测试' : '⏳ 即将上线'}
                </span>
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">{skill.name}</h3>
              <p className="text-gray-400 text-sm mb-3">{skill.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 bg-gray-700 px-2 py-1 rounded">
                  {skill.category}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-16 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl p-8">
          <h2 className="text-3xl font-bold mb-6 text-center">📊 能力统计</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-400 mb-2">17</div>
              <div className="text-gray-400">金融分析</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-400 mb-2">6</div>
              <div className="text-gray-400">数据抓取</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-400 mb-2">6</div>
              <div className="text-gray-400">网站开发</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-400 mb-2">4</div>
              <div className="text-gray-400">数据分析</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>最后更新：2026-03-05 19:50</p>
          <p className="mt-2">🌸 花卷 - 你的智能金融分析助手</p>
        </div>
      </div>
    </div>
  );
}
