import { Metadata } from 'next';
import Navigation from '@/components/Navigation';

export const metadata: Metadata = {
  title: 'Telegram 新闻流 - 花卷能力中心',
  description: '实时抓取 Telegram 频道最新新闻：区块链、金融、科技',
};

// 相对时间转换函数
function getRelativeTime(isoTime: string): string {
  const now = new Date();
  const past = new Date(isoTime);
  const diffMs = now.getTime() - past.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return '刚刚';
  if (diffMins < 60) return `${diffMins}分钟前`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}小时前`;

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}天前`;
}

export default function TelegramNewsPage() {
  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-4xl">📱</span>
                  <h1 className="text-3xl font-bold text-gray-900">Telegram 新闻流</h1>
                </div>
                <p className="text-gray-600">实时抓取全球顶级新闻源，每5分钟自动刷新</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-xs text-gray-500">最后更新</p>
                  <p className="text-sm font-medium text-gray-900" id="last-update">加载中...</p>
                </div>
                <button
                  id="refresh-button"
                  className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  刷新
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {/* 数据新鲜度警告 */}
          <div id="freshness-warning" className="hidden bg-yellow-50 border border-yellow-200 rounded-2xl p-6 mb-6">
            <div className="flex items-start gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <h3 className="font-semibold text-yellow-900 mb-2">数据可能过旧</h3>
                <p className="text-sm text-yellow-800" id="freshness-message">最后更新超过1小时，点击"刷新"按钮重新加载</p>
              </div>
            </div>
          </div>

          {/* 总体统计信息 */}
          <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-5xl">📱</span>
                <div>
                  <p className="text-lg font-semibold text-gray-900" id="total-stats">加载中...</p>
                  <p className="text-sm text-gray-600">实时更新 · 只显示24小时内新闻</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">最后更新</p>
                <p className="text-sm font-medium text-gray-900" id="last-update-2">加载中...</p>
              </div>
            </div>
          </div>

          {/* 分类统计信息 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">📊</span>
                <div>
                  <p className="text-sm text-gray-600">区块链新闻</p>
                  <p className="text-2xl font-bold text-gray-900" id="blockchain-stats">加载中...</p>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">BlockBeats, Cointelegraph, BitPush</p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">💰</span>
                <div>
                  <p className="text-sm text-gray-600">金融新闻</p>
                  <p className="text-2xl font-bold text-gray-900" id="finance-stats">加载中...</p>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">Investing.com, 凤凰网</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">💻</span>
                <div>
                  <p className="text-sm text-gray-600">科技新闻</p>
                  <p className="text-2xl font-bold text-gray-900" id="tech-stats">加载中...</p>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">Wired, Hacker News, Product Hunt</p>
            </div>
          </div>

          {/* 新闻内容区域 */}
          <div id="news-container" className="space-y-8">
            {/* 新闻将通过 JavaScript 动态加载 */}
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
              <p className="mt-4 text-gray-600">加载新闻中...</p>
            </div>
          </div>

          {/* 提示信息 */}
          <div className="bg-pink-50 rounded-2xl p-6 mt-8">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🌸</span>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">花卷提示</h3>
                <p className="text-sm text-gray-600">
                  Telegram 新闻流功能已部署，每5分钟自动刷新。点击右上角"刷新"按钮可手动刷新数据。
                  所有数据保存在本地，可用于后续分析和投资决策。
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 客户端脚本：自动刷新 + 数据加载 */}
      <script dangerouslySetInnerHTML={{ __html: `
        let newsData = null;
        let isLoading = false;

        async function loadNews(manual = false) {
          if (isLoading) return;
          isLoading = true;

          const button = document.getElementById('refresh-button');
          if (manual && button) {
            button.disabled = true;
            button.innerHTML = '<svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> 刷新中...';
          }

          try {
            const response = await fetch('/api/telegram-news');
            newsData = await response.json();
            renderNews(newsData);
            updateLastUpdateTime(newsData.last_update);
            updateStats(newsData);
            checkFreshness(newsData.last_update);
          } catch (error) {
            console.error('加载新闻失败:', error);
            document.getElementById('news-container').innerHTML = '<p class="text-center text-red-500 py-12">加载失败，请刷新页面重试</p>';
          } finally {
            isLoading = false;
            if (manual && button) {
              button.disabled = false;
              button.innerHTML = '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg> 刷新';
            }
          }
        }

        function checkFreshness(isoTime) {
          const now = new Date();
          const lastUpdate = new Date(isoTime);
          const diffMs = now.getTime() - lastUpdate.getTime();
          const diffHours = diffMs / (1000 * 60 * 60);

          const warning = document.getElementById('freshness-warning');
          const message = document.getElementById('freshness-message');

          if (diffHours > 1 && warning && message) {
            warning.classList.remove('hidden');
            const diffMins = Math.floor(diffMs / 60000);
            message.textContent = '最后更新于 ' + diffMins + ' 分钟前，数据可能过旧。点击右上角"刷新"按钮重新加载。';
          } else if (warning) {
            warning.classList.add('hidden');
          }
        }

        function updateStats(data) {
          // 更新总体统计
          const totalStats = document.getElementById('total-stats');
          if (totalStats && data.total_messages !== undefined) {
            totalStats.textContent = '共 ' + data.total_messages + ' 条新闻，来自 ' + data.active_channels + ' 个频道';
          }

          // 更新分类统计
          const blockchainStats = document.getElementById('blockchain-stats');
          if (blockchainStats && data.channels && data.channels.blockchain) {
            blockchainStats.textContent = data.channels.blockchain.length + ' 条新闻';
          }

          const financeStats = document.getElementById('finance-stats');
          if (financeStats && data.channels && data.channels.finance) {
            financeStats.textContent = data.channels.finance.length + ' 条新闻';
          }

          const techStats = document.getElementById('tech-stats');
          if (techStats && data.channels && data.channels.tech) {
            techStats.textContent = data.channels.tech.length + ' 条新闻';
          }
        }

        function renderNews(data) {
          const container = document.getElementById('news-container');

          if (!data.channels || Object.keys(data.channels).length === 0) {
            container.innerHTML = '<p class="text-center text-gray-500 py-12">暂无新闻数据</p>';
            return;
          }

          let html = '';

          // 区块链新闻
          html += '<div><h2 class="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2"><span>📊</span> 区块链新闻</h2>';
          if (data.channels.blockchain && data.channels.blockchain.length > 0) {
            html += '<div class="grid grid-cols-1 md:grid-cols-2 gap-4">';
            data.channels.blockchain.forEach(item => {
              html += createNewsCard(item);
            });
            html += '</div>';
          } else {
            html += '<div class="bg-gray-50 rounded-xl p-6 text-center text-gray-500">暂无最新消息（24小时内）</div>';
          }
          html += '</div>';

          // 金融新闻
          html += '<div><h2 class="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2"><span>💰</span> 金融新闻</h2>';
          if (data.channels.finance && data.channels.finance.length > 0) {
            html += '<div class="grid grid-cols-1 md:grid-cols-3 gap-4">';
            data.channels.finance.forEach(item => {
              html += createNewsCard(item);
            });
            html += '</div>';
          } else {
            html += '<div class="bg-gray-50 rounded-xl p-6 text-center text-gray-500">暂无最新消息（24小时内）</div>';
          }
          html += '</div>';

          // 科技新闻
          html += '<div><h2 class="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2"><span>💻</span> 科技新闻</h2>';
          if (data.channels.tech && data.channels.tech.length > 0) {
            html += '<div class="grid grid-cols-1 md:grid-cols-2 gap-4">';
            data.channels.tech.forEach(item => {
              html += createNewsCard(item);
            });
            html += '</div>';
          } else {
            html += '<div class="bg-gray-50 rounded-xl p-6 text-center text-gray-500">暂无最新消息（24小时内）</div>';
          }
          html += '</div>';

          container.innerHTML = html;
        }

        function createNewsCard(item) {
          const categoryColors = {
            blockchain: 'from-blue-50 to-blue-100',
            finance: 'from-green-50 to-green-100',
            tech: 'from-purple-50 to-purple-100',
          };

          const categoryIcons = {
            blockchain: '📊',
            finance: '💰',
            tech: '💻',
          };

          return '<div class="bg-gradient-to-br ' + categoryColors[item.category] + ' rounded-xl shadow-sm p-6 hover:shadow-md transition-all"><div class="flex items-start justify-between mb-3"><div class="flex items-center gap-2"><span class="text-lg">' + categoryIcons[item.category] + '</span><h3 class="font-semibold text-gray-900">' + item.channel_name + '</h3></div><span class="text-xs text-gray-500">' + getRelativeTime(item.timestamp) + '</span></div><p class="text-sm text-gray-700 mb-4 line-clamp-3">' + item.text + '</p><div class="flex items-center justify-between text-xs"><span class="text-gray-500">👁 ' + item.views.toLocaleString() + ' views</span><a href="' + item.link + '" target="_blank" rel="noopener noreferrer" class="text-pink-600 hover:text-pink-700 font-medium flex items-center gap-1">查看原文<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg></a></div></div>';
        }

        function getRelativeTime(isoTime) {
          const now = new Date();
          const past = new Date(isoTime);
          const diffMs = now.getTime() - past.getTime();
          const diffMins = Math.floor(diffMs / 60000);

          if (diffMins < 1) return '刚刚';
          if (diffMins < 60) return diffMins + '分钟前';

          const diffHours = Math.floor(diffMins / 60);
          if (diffHours < 24) return diffHours + '小时前';

          const diffDays = Math.floor(diffHours / 24);
          return diffDays + '天前';
        }

        let lastUpdateTime = null;

        function updateLastUpdateTime(isoTime) {
          lastUpdateTime = isoTime;
          updateRelativeTime();
        }

        function updateRelativeTime() {
          if (!lastUpdateTime) return;

          const el1 = document.getElementById('last-update');
          const el2 = document.getElementById('last-update-2');

          const now = new Date();
          const past = new Date(lastUpdateTime);
          const diffMs = now.getTime() - past.getTime();
          const diffMins = Math.floor(diffMs / 60000);

          let relativeTime = '';
          if (diffMins < 1) {
            relativeTime = '刚刚更新';
          } else if (diffMins < 60) {
            relativeTime = diffMins + ' 分钟前更新';
          } else {
            const diffHours = Math.floor(diffMins / 60);
            if (diffHours < 24) {
              relativeTime = diffHours + ' 小时前更新';
            } else {
              const diffDays = Math.floor(diffHours / 24);
              relativeTime = diffDays + ' 天前更新';
            }
          }

          if (el1) el1.textContent = relativeTime;
          if (el2) el2.textContent = relativeTime;
        }

        // 页面加载时立即执行
        loadNews();

        // 每分钟更新相对时间（倒计时）
        setInterval(updateRelativeTime, 60 * 1000);

        // 每5分钟自动刷新数据
        setInterval(() => loadNews(false), 5 * 60 * 1000);

        // 绑定刷新按钮点击事件
        document.addEventListener('DOMContentLoaded', function() {
          const refreshButton = document.getElementById('refresh-button');
          if (refreshButton) {
            refreshButton.addEventListener('click', function() {
              loadNews(true);
            });
          }
        });
      `}} />
    </>
  );
}
