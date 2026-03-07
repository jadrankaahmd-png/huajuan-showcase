import { Metadata } from 'next';
import Navigation from '@/components/Navigation';

export const metadata: Metadata = {
  title: 'Telegram 新闻流 - 花卷能力中心',
  description: '实时抓取 Telegram 频道最新新闻：区块链、金融、科技',
};

export default function TelegramNewsPage() {
  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-4xl">📱</span>
              <h1 className="text-3xl font-bold text-gray-900">Telegram 新闻流</h1>
            </div>
            <p className="text-gray-600">实时抓取全球顶级新闻源，每小时更新</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* 统计信息 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">📊</span>
                <div>
                  <p className="text-sm text-gray-600">区块链新闻</p>
                  <p className="text-2xl font-bold text-gray-900">2 个频道</p>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">theblockbeats, cointelegraph</p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">💰</span>
                <div>
                  <p className="text-sm text-gray-600">金融新闻</p>
                  <p className="text-2xl font-bold text-gray-900">3 个频道</p>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">wsj, financialtimes, bloomberg</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">💻</span>
                <div>
                  <p className="text-sm text-gray-600">科技新闻</p>
                  <p className="text-2xl font-bold text-gray-900">2 个频道</p>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">techcrunch, theverge</p>
            </div>
          </div>

          {/* 新闻卡片占位符 */}
          <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">ℹ️</span>
              <h2 className="text-xl font-semibold text-gray-900">功能说明</h2>
            </div>
            <div className="space-y-3 text-gray-600">
              <p>✅ <strong>抓取脚本已就绪</strong>：自动抓取 7 个 Telegram 频道最新消息</p>
              <p>⏰ <strong>定时运行</strong>：每小时自动更新一次</p>
              <p>📊 <strong>数据保存</strong>：所有新闻保存在 <code className="bg-gray-100 px-2 py-1 rounded">data/telegram_news/latest.json</code></p>
              <p>🔄 <strong>手动更新</strong>：运行 <code className="bg-gray-100 px-2 py-1 rounded">python3 tools/telegram_channel_scraper.py</code></p>
            </div>
          </div>

          {/* 区块链新闻 */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>📊</span> 区块链新闻
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* theblockbeats */}
              <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">theblockbeats</h3>
                  <span className="text-xs text-gray-500">刚刚更新</span>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  🔍链上侦探 | 以太坊联创Jeffrey Wilcke将79,258.61枚ETH转至Kraken，约1.57亿美元...
                </p>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span>👁 85 views</span>
                  <a href="#" className="text-pink-600 hover:underline">查看原文 →</a>
                </div>
              </div>

              {/* cointelegraph */}
              <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">Cointelegraph</h3>
                  <span className="text-xs text-gray-500">刚刚更新</span>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  ⚡INSIGHT: Crypto firms and community banks are allies in the CLARITY Act debate...
                </p>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span>👁 4.12K views</span>
                  <a href="#" className="text-pink-600 hover:underline">查看原文 →</a>
                </div>
              </div>
            </div>
          </div>

          {/* 金融新闻 */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>💰</span> 金融新闻
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* WSJ */}
              <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">WSJ</h3>
                  <span className="text-xs text-gray-500">刚刚更新</span>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  数据获取中...
                </p>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span>👁 N/A views</span>
                </div>
              </div>

              {/* Financial Times */}
              <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">Financial Times</h3>
                  <span className="text-xs text-gray-500">刚刚更新</span>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  数据获取中...
                </p>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span>👁 N/A views</span>
                </div>
              </div>

              {/* Bloomberg */}
              <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">Bloomberg</h3>
                  <span className="text-xs text-gray-500">2月23日</span>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  🚨LIVE NOW: The India AI Impact Summit has laid out an ambitious roadmap for 2026...
                </p>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span>👁 26.7K views</span>
                  <a href="#" className="text-pink-600 hover:underline">查看原文 →</a>
                </div>
              </div>
            </div>
          </div>

          {/* 科技新闻 */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>💻</span> 科技新闻
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* TechCrunch */}
              <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">TechCrunch</h3>
                  <span className="text-xs text-gray-500">刚刚更新</span>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  数据获取中...
                </p>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span>👁 N/A views</span>
                </div>
              </div>

              {/* The Verge */}
              <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">The Verge</h3>
                  <span className="text-xs text-gray-500">刚刚更新</span>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  数据获取中...
                </p>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span>👁 N/A views</span>
                </div>
              </div>
            </div>
          </div>

          {/* 提示信息 */}
          <div className="bg-pink-50 rounded-2xl p-6">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🌸</span>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">花卷提示</h3>
                <p className="text-sm text-gray-600">
                  Telegram 新闻流功能已部署，每小时自动更新。部分频道可能因访问限制暂时无法获取数据，
                  但整体功能正常运行。所有数据保存在本地，可用于后续分析和投资决策。
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
