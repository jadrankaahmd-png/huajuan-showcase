'use client';

import Navigation from '@/components/Navigation';
import Link from 'next/link';
import StockQuery from '@/components/qveris/StockQuery';
import StockRanking from '@/components/qveris/StockRanking';
import StockAnalysis from '@/components/qveris/StockAnalysis';

export default function DynamicModelPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Navigation currentLayer={2} />
      
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-6">✨</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            花卷动态模型
          </h1>
          <p className="text-xl text-gray-600">
            第二层 · 智能选股引擎
          </p>
        </div>
        
        {/* Autoresearch Engine Card */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl shadow-lg p-8 border border-blue-100 mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="text-5xl">🧬</div>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-3">
            AI自动研究引擎
          </h2>
          
          <div className="flex justify-center mb-4">
            <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium">
              ✅ 已就绪（可直接运行）
            </span>
          </div>
          
          <p className="text-gray-700 text-center mb-6 max-w-2xl mx-auto">
            AI自主循环优化选股模型参数，每5分钟一次实验，自动寻找最优神经网络架构和超参数
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-2xl mb-2">⏱️</div>
              <h3 className="text-gray-900 font-semibold mb-1">固定时间预算</h3>
              <p className="text-gray-600 text-sm">每次实验5分钟</p>
            </div>
            
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-2xl mb-2">🔄</div>
              <h3 className="text-gray-900 font-semibold mb-1">自主优化</h3>
              <p className="text-gray-600 text-sm">自动修改架构和超参数</p>
            </div>
            
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-2xl mb-2">📊</div>
              <h3 className="text-gray-900 font-semibold mb-1">性能追踪</h3>
              <p className="text-gray-600 text-sm">验证集bits per byte</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 mb-6">
            <h3 className="text-gray-900 font-semibold mb-2 flex items-center gap-2">
              <span>📁</span> 本地路径
            </h3>
            <code className="text-sm text-gray-700 bg-gray-50 px-3 py-2 rounded block overflow-x-auto">
              ~/.openclaw/workspace/autoresearch-macos/
            </code>
          </div>
          
          <div className="flex justify-center gap-4">
            <a
              href="https://github.com/miolini/autoresearch-macos"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
            >
              查看GitHub
            </a>
          </div>
        </div>
        
        {/* QVeris Card */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl shadow-lg p-8 border border-green-100 mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="text-5xl">📊</div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 text-center mb-3">
            QVeris 美股实时数据
          </h2>

          <div className="flex justify-center mb-4">
            <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium">
              ✅ 已就绪
            </span>
          </div>

          <p className="text-gray-700 text-center mb-6 max-w-2xl mx-auto">
            10000+实时接口，覆盖美股实时行情、财务指标（EPS/PE）、市场情绪、涨幅榜单，延迟&lt;1秒
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-2xl mb-2">📈</div>
              <h3 className="text-gray-900 font-semibold mb-1">实时股价</h3>
              <p className="text-gray-600 text-sm">AAPL、TSLA、NVDA等</p>
            </div>

            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-2xl mb-2">💰</div>
              <h3 className="text-gray-900 font-semibold mb-1">财务数据</h3>
              <p className="text-gray-600 text-sm">EPS、PE、财报</p>
            </div>

            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-2xl mb-2">📰</div>
              <h3 className="text-gray-900 font-semibold mb-1">市场情绪</h3>
              <p className="text-gray-600 text-sm">新闻情绪分析</p>
            </div>

            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-2xl mb-2">🏆</div>
              <h3 className="text-gray-900 font-semibold mb-1">涨幅榜单</h3>
              <p className="text-gray-600 text-sm">美股涨幅TOP5</p>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 mb-6">
            <h3 className="text-gray-900 font-semibold mb-2 flex items-center gap-2">
              <span>⚡</span> 数据提供商
            </h3>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">Finnhub</span>
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">Alpha Vantage</span>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">EODHD</span>
              <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">Yahoo Finance</span>
              <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">FMP</span>
              <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">Tiingo</span>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <a
              href="https://www.qveris.ai/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
            >
              访问官网
            </a>
          </div>
        </div>
        
        {/* QVeris 四大能力模块 */}
        <div className="space-y-8 mb-8">
          {/* 模块一：基础行情与情绪分析 */}
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl shadow-lg p-8 border border-blue-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="text-4xl">📈</div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">基础行情与情绪分析</h2>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    ✅ 已就绪
                  </span>
                </div>
              </div>
            </div>
            
            <p className="text-gray-700 mb-6">
              获取美股实时价格、当日涨跌、近期趋势和市场情绪分析
            </p>
            
            <div className="bg-white rounded-lg p-4 mb-4">
              <h3 className="text-gray-900 font-semibold mb-3 flex items-center gap-2">
                <span>💡</span> 示例指令
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                  <code className="text-sm text-gray-800">查询英伟达（NVDA）最新股价，给出分析</code>
                  <button className="text-gray-500 hover:text-gray-700" title="复制">📋</button>
                </div>
                <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                  <code className="text-sm text-gray-800">苹果（AAPL）今日表现如何？</code>
                  <button className="text-gray-500 hover:text-gray-700" title="复制">📋</button>
                </div>
                <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                  <code className="text-sm text-gray-800">特斯拉（TSLA）近期趋势与市场情绪分析</code>
                  <button className="text-gray-500 hover:text-gray-700" title="复制">📋</button>
                </div>
              </div>
            </div>
          </div>

          {/* 模块二：市场概览与榜单追踪 */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl shadow-lg p-8 border border-purple-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="text-4xl">🏆</div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">市场概览与榜单追踪</h2>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    ✅ 已就绪
                  </span>
                </div>
              </div>
            </div>
            
            <p className="text-gray-700 mb-6">
              快速获取美股市场全局视野，追踪热门标的和板块动向
            </p>
            
            <div className="bg-white rounded-lg p-4 mb-4">
              <h3 className="text-gray-900 font-semibold mb-3 flex items-center gap-2">
                <span>💡</span> 示例指令
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                  <code className="text-sm text-gray-800">今日美股涨幅 TOP 10</code>
                  <button className="text-gray-500 hover:text-gray-700" title="复制">📋</button>
                </div>
                <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                  <code className="text-sm text-gray-800">今日科技板块资金净流入前3的股票</code>
                  <button className="text-gray-500 hover:text-gray-700" title="复制">📋</button>
                </div>
                <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                  <code className="text-sm text-gray-800">对比英伟达和AMD今日表现，分析板块联动</code>
                  <button className="text-gray-500 hover:text-gray-700" title="复制">📋</button>
                </div>
              </div>
            </div>
          </div>

          {/* 模块三：个股与板块深度研判 */}
          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl shadow-lg p-8 border border-orange-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="text-4xl">🔬</div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">个股与板块深度研判</h2>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    ✅ 已就绪
                  </span>
                </div>
              </div>
            </div>
            
            <p className="text-gray-700 mb-6">
              多因子分析、K线、成交量、财务指标综合研判
            </p>
            
            <div className="bg-white rounded-lg p-4 mb-4">
              <h3 className="text-gray-900 font-semibold mb-3 flex items-center gap-2">
                <span>💡</span> 示例指令
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                  <code className="text-sm text-gray-800">分析NVDA近30天K线数据、成交量变化及核心财务指标</code>
                  <button className="text-gray-500 hover:text-gray-700" title="复制">📋</button>
                </div>
                <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                  <code className="text-sm text-gray-800">调取美股半导体板块涨幅前5，对比PE和PB，筛选估值合理标的</code>
                  <button className="text-gray-500 hover:text-gray-700" title="复制">📋</button>
                </div>
                <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                  <code className="text-sm text-gray-800">分析MSFT最新财报，评估短期走势</code>
                  <button className="text-gray-500 hover:text-gray-700" title="复制">📋</button>
                </div>
              </div>
            </div>
          </div>

          {/* 模块四：定时监控与预警 */}
          <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-2xl shadow-lg p-8 border border-green-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="text-4xl">⏰</div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">定时监控与预警</h2>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    ✅ 已就绪
                  </span>
                </div>
              </div>
            </div>
            
            <p className="text-gray-700 mb-6">
              设置自动化监控，股价异动时第一时间收到提示
            </p>
            
            <div className="bg-white rounded-lg p-4 mb-4">
              <h3 className="text-gray-900 font-semibold mb-3 flex items-center gap-2">
                <span>💡</span> 示例指令
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                  <code className="text-sm text-gray-800">每15分钟扫描美股涨跌幅超过3%的股票并推送提示</code>
                  <button className="text-gray-500 hover:text-gray-700" title="复制">📋</button>
                </div>
                <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                  <code className="text-sm text-gray-800">实时监控NVDA、AAPL、TSLA、MSFT，涨跌超5%立即预警</code>
                  <button className="text-gray-500 hover:text-gray-700" title="复制">📋</button>
                </div>
                <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                  <code className="text-sm text-gray-800">每天收盘后自动生成美股市场日报</code>
                  <button className="text-gray-500 hover:text-gray-700" title="复制">📋</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Coming Soon Card */}
        <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
          <div className="flex items-center justify-center mb-6">
            <div className="text-5xl">🚧</div>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">
            即将上线
          </h2>
          
          <p className="text-gray-600 text-center mb-8">
            我们正在打造全球最强动态选股模型，敬请期待！
          </p>
          
          {/* Features Preview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <div className="text-2xl mb-2">📊</div>
              <h3 className="text-gray-900 font-semibold mb-2">多因子选股模型</h3>
              <p className="text-gray-600 text-sm">
                整合第一层所有能力进行深度分析
              </p>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
              <div className="text-2xl mb-2">🤖</div>
              <h3 className="text-gray-900 font-semibold mb-2">机器学习预测</h3>
              <p className="text-gray-600 text-sm">
                基于历史数据训练的智能预测系统
              </p>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4 border border-green-100">
              <div className="text-2xl mb-2">📊</div>
              <h3 className="text-gray-900 font-semibold mb-2">自动优化</h3>
              <p className="text-gray-600 text-sm">
                随第一层能力扩充自动优化模型
              </p>
            </div>
            
            <div className="bg-orange-50 rounded-lg p-4 border border-orange-100">
              <div className="text-2xl mb-2">🔄</div>
              <h3 className="text-gray-900 font-semibold mb-2">自我反思</h3>
              <p className="text-gray-600 text-sm">
                根据投资盈亏结果持续改进
              </p>
            </div>
          </div>
          
          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>开发进度</span>
              <span>0%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div className="bg-gradient-to-r from-pink-500 to-purple-500 h-3 rounded-full" style={{ width: '0%' }}></div>
            </div>
          </div>
          
          {/* CTA */}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/"
              className="px-6 py-3 bg-pink-50 hover:bg-pink-100 text-pink-600 rounded-lg font-medium transition-colors text-center"
            >
              返回能力中心
            </Link>
            <Link
              href="/stock-picker"
              className="px-6 py-3 bg-purple-50 hover:bg-purple-100 text-purple-600 rounded-lg font-medium transition-colors text-center"
            >
              查看第三层
            </Link>
          </div>
        </div>
        
        {/* QVeris 实时交互组件 */}
        <div className="space-y-8 mb-8">
          <StockQuery />
          <StockRanking />
          <StockAnalysis />
        </div>
        
        {/* Architecture Info */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm">
            花卷三层架构 · 第一层（能力中心）→ 第二层（动态模型）→ 第三层（选股）
          </p>
        </div>
      </div>
    </main>
  );
}
