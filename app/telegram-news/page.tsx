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

// 新闻卡片组件
function NewsCard({ item }: { item: any }) {
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
  
  return (
    <div className={`bg-gradient-to-br ${categoryColors[item.category as keyof typeof categoryColors]} rounded-xl shadow-sm p-6 hover:shadow-md transition-all`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">{categoryIcons[item.category as keyof typeof categoryIcons]}</span>
          <h3 className="font-semibold text-gray-900">{item.channel_name}</h3>
        </div>
        <span className="text-xs text-gray-500">{getRelativeTime(item.timestamp)}</span>
      </div>
      
      <p className="text-sm text-gray-700 mb-4 line-clamp-3">
        {item.text}
      </p>
      
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-500">👁 {item.views.toLocaleString()} views</span>
        <a 
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-pink-600 hover:text-pink-700 font-medium flex items-center gap-1"
        >
          查看原文
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
    </div>
  );
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
              <div className="text-right">
                <p className="text-xs text-gray-500">最后更新</p>
                <p className="text-sm font-medium text-gray-900" id="last-update">加载中...</p>
              </div>
            </div>
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
                  Telegram 新闻流功能已部署，每小时自动更新。点击"查看原文"可在新标签页打开原始 Telegram 链接。
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
        
        async function loadNews() {
          try {
            const response = await fetch('/api/telegram-news');
            newsData = await response.json();
            renderNews(newsData);
            updateLastUpdateTime(newsData.last_update);
          } catch (error) {
            console.error('加载新闻失败:', error);
            document.getElementById('news-container').innerHTML = '<p class="text-center text-red-500 py-12">加载失败，请刷新页面重试</p>';
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
          
          return \`
            <div class="bg-gradient-to-br \${categoryColors[item.category]} rounded-xl shadow-sm p-6 hover:shadow-md transition-all">
              <div class="flex items-start justify-between mb-3">
                <div class="flex items-center gap-2">
                  <span class="text-lg">\${categoryIcons[item.category]}</span>
                  <h3 class="font-semibold text-gray-900">\${item.channel_name}</h3>
                </div>
                <span class="text-xs text-gray-500">\${getRelativeTime(item.timestamp)}</span>
              </div>
              <p class="text-sm text-gray-700 mb-4 line-clamp-3">\${item.text}</p>
              <div class="flex items-center justify-between text-xs">
                <span class="text-gray-500">👁 \${item.views.toLocaleString()} views</span>
                <a href="\${item.link}" target="_blank" rel="noopener noreferrer" class="text-pink-600 hover:text-pink-700 font-medium flex items-center gap-1">
                  查看原文
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                  </svg>
                </a>
              </div>
            </div>
          \`;
        }
        
        function getRelativeTime(isoTime) {
          const now = new Date();
          const past = new Date(isoTime);
          const diffMs = now.getTime() - past.getTime();
          const diffMins = Math.floor(diffMs / 60000);
          
          if (diffMins < 1) return '刚刚';
          if (diffMins < 60) return \`\${diffMins}分钟前\`;
          
          const diffHours = Math.floor(diffMins / 60);
          if (diffHours < 24) return \`\${diffHours}小时前\`;
          
          const diffDays = Math.floor(diffHours / 24);
          return \`\${diffDays}天前\`;
        }
        
        function updateLastUpdateTime(isoTime) {
          const el = document.getElementById('last-update');
          if (el) {
            const date = new Date(isoTime);
            el.textContent = date.toLocaleString('zh-CN', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
            });
          }
        }
        
        // 页面加载时立即执行
        loadNews();
        
        // 每5分钟自动刷新
        setInterval(loadNews, 5 * 60 * 1000);
      `}} />
    </>
  );
}
