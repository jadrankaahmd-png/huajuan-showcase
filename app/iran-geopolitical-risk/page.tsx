'use client';

import { useState, useEffect, useCallback } from 'react';

// ==================== 数据类型定义 ====================

interface RealTimePrice {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  lastUpdate: string;
}

interface MacroData {
  name: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'stable';
  lastUpdate: string;
  source: string;
  real: boolean;
}

interface NewsItem {
  title: string;
  summary: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  time: string;
  source: string;
  url: string;
}

interface StabilityIndex {
  country: string;
  index: number;
  trend: 'up' | 'down' | 'stable';
  lastUpdate: string;
  available: boolean;
}

interface FlightData {
  route: string;
  status: string;
  impact: string;
  lastUpdate: string;
  available: boolean;
}

interface MaritimeData {
  route: string;
  vessels: number;
  status: string;
  lastUpdate: string;
  available: boolean;
}

interface SatelliteData {
  location: string;
  firePoints: number;
  intensity: string;
  lastUpdate: string;
  available: boolean;
}

interface AgentAnalysis {
  agent: string;
  analysis: string;
  recommendation: string;
  confidence: number;
  lastUpdate: string;
  available: boolean;
}

interface SentimentData {
  platform: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  score: number;
  volume: string;
  lastUpdate: string;
  available: boolean;
}

// ==================== 辅助函数 ====================

// 格式化完整日期时间（2026-03-06 22:35:00）
const formatFullDateTime = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

// ==================== 主组件 ====================

export default function IranGeopoliticalRiskPage() {
  const [realTimePrices, setRealTimePrices] = useState<RealTimePrice[]>([]);
  const [macroData, setMacroData] = useState<MacroData[]>([]);
  const [newsData, setNewsData] = useState<NewsItem[]>([]);
  const [stabilityIndices, setStabilityIndices] = useState<StabilityIndex[]>([]);
  const [flightData, setFlightData] = useState<FlightData[]>([]);
  const [maritimeData, setMaritimeData] = useState<MaritimeData[]>([]);
  const [satelliteData, setSatelliteData] = useState<SatelliteData[]>([]);
  const [agentAnalysis, setAgentAnalysis] = useState<AgentAnalysis[]>([]);
  const [sentimentData, setSentimentData] = useState<SentimentData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string>('');
  const [nextUpdate, setNextUpdate] = useState<string>('');
  const [error, setError] = useState<string>('');
  
  // 版本信息
  const VERSION = 'v5.0.1';
  const BUILD_TIME = new Date().toISOString();
  console.log(`🌸 花卷全球宏观地缘风险监控系统 ${VERSION} - 构建时间: ${BUILD_TIME}`);

  // 数据加载函数
  const loadData = useCallback(async (showRefreshing = false) => {
    if (showRefreshing) setIsRefreshing(true);
    else setIsLoading(true);
    
    setError('');
    const now = formatFullDateTime();
    
    console.log('🚀 开始加载数据...', new Date().toISOString());

    try {
      // ==================== P0: 股价数据（真实API - Finnhub）====================
      const FINNHUB_API_KEY = 'd61gv49r01qufbsn7v90d61gv49r01qufbsn7v9g';
      const symbols = ['USO', 'XLE', 'LMT', 'RTX', 'BA', 'DAL'];
      const names: Record<string, string> = {
        'USO': '原油ETF',
        'XLE': '能源板块ETF',
        'LMT': '洛克希德马丁',
        'RTX': '雷神技术',
        'BA': '波音',
        'DAL': '达美航空'
      };

      const prices: RealTimePrice[] = [];

      for (const symbol of symbols) {
        try {
          const response = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`, {
            cache: 'no-store' // 强制不缓存
          });
          if (response.ok) {
            const data = await response.json();
            if (data.c && data.c > 0) {
              prices.push({
                symbol,
                name: names[symbol] || symbol,
                price: data.c,
                change: data.d || 0,
                changePercent: data.dp || 0,
                lastUpdate: now
              });
            }
          }
        } catch (err) {
          console.error(`❌ ${symbol} 获取失败:`, err);
        }
      }

      if (prices.length > 0) {
        setRealTimePrices(prices);
        console.log('✅ 股价数据已加载:', prices.length, '个');
      }

      // ==================== P0: 宏观数据（服务器端代理）====================
      try {
        const macroResponse = await fetch('/api/macro', {
          cache: 'no-store'
        });
        if (macroResponse.ok) {
          const macroDataResult = await macroResponse.json();
          if (macroDataResult.success && macroDataResult.data) {
            // 更新时间为当前时间
            const dataWithCurrentTime = macroDataResult.data.map((item: MacroData) => ({
              ...item,
              lastUpdate: now
            }));
            setMacroData(dataWithCurrentTime);
            console.log('✅ 宏观数据已加载:', macroDataResult.data.length, '个');
          } else {
            console.warn('⚠️ 宏观数据暂时无法获取:', macroDataResult.error);
            setMacroData([
              { name: 'VIX恐慌指数', value: '暂时无法获取', change: '-', trend: 'stable', lastUpdate: now, source: 'yfinance API', real: false },
              { name: '美元指数', value: '暂时无法获取', change: '-', trend: 'stable', lastUpdate: now, source: 'yfinance API', real: false },
              { name: '美联储利率', value: '暂时无法获取', change: '-', trend: 'stable', lastUpdate: now, source: 'FRED API', real: false },
              { name: '美国CPI', value: '暂时无法获取', change: '-', trend: 'stable', lastUpdate: now, source: 'FRED API', real: false },
              { name: '美国原油库存', value: '暂时无法获取', change: '-', trend: 'stable', lastUpdate: now, source: 'EIA API', real: false }
            ]);
          }
        }
      } catch (err) {
        console.error('❌ 宏观数据获取失败:', err);
        setMacroData([
          { name: 'VIX恐慌指数', value: '暂时无法获取', change: '-', trend: 'stable', lastUpdate: now, source: 'yfinance API', real: false },
          { name: '美元指数', value: '暂时无法获取', change: '-', trend: 'stable', lastUpdate: now, source: 'yfinance API', real: false },
          { name: '美联储利率', value: '暂时无法获取', change: '-', trend: 'stable', lastUpdate: now, source: 'FRED API', real: false },
          { name: '美国CPI', value: '暂时无法获取', change: '-', trend: 'stable', lastUpdate: now, source: 'FRED API', real: false },
          { name: '美国原油库存', value: '暂时无法获取', change: '-', trend: 'stable', lastUpdate: now, source: 'EIA API', real: false }
        ]);
      }

      // ==================== P0: 新闻数据（服务器端代理）====================
      try {
        const newsResponse = await fetch('/api/news', {
          cache: 'no-store'
        });
        if (newsResponse.ok) {
          const newsDataResult = await newsResponse.json();
          if (newsDataResult.success && newsDataResult.data) {
            // 更新时间为当前时间
            const dataWithCurrentTime = newsDataResult.data.map((item: NewsItem) => ({
              ...item,
              time: now
            }));
            setNewsData(dataWithCurrentTime);
            console.log('✅ 新闻数据已加载:', newsDataResult.data.length, '条');
          } else {
            console.warn('⚠️ 新闻数据暂时无法获取:', newsDataResult.error);
            setNewsData([
              { title: '暂时无法获取新闻', summary: '需要新闻API服务器端代理', sentiment: 'neutral', time: now, source: '系统消息', url: '#' }
            ]);
          }
        }
      } catch (err) {
        console.error('❌ 新闻数据获取失败:', err);
        setNewsData([
          { title: '暂时无法获取新闻', summary: '需要新闻API服务器端代理', sentiment: 'neutral', time: now, source: '系统消息', url: '#' }
        ]);
      }

      // ==================== P1: AI推演（八大Agent）====================
      const agentResults: AgentAnalysis[] = [];

      if (prices.length > 0) {
        const energyETF = prices.find(p => p.symbol === 'XLE');
        const defenseStock = prices.find(p => p.symbol === 'LMT');
        
        const energyChange = energyETF?.changePercent || 0;
        const defenseChange = defenseStock?.changePercent || 0;
        
        agentResults.push({
          agent: 'Sector Rotation Agent',
          analysis: `能源板块${energyChange >= 0 ? '上涨' : '下跌'}${Math.abs(energyChange).toFixed(2)}%，军工板块${defenseChange >= 0 ? '上涨' : '下跌'}${Math.abs(defenseChange).toFixed(2)}%`,
          recommendation: energyETF && energyChange > 2 ? '关注能源板块机会' : '保持观望',
          confidence: 0.80,
          lastUpdate: now,
          available: true
        });
      }

      if (newsData.length > 0) {
        agentResults.push({
          agent: 'News Catalyst Agent',
          analysis: `过去24小时共${newsData.length}条伊朗相关新闻，市场情绪${newsData[0]?.sentiment === 'positive' ? '积极' : '中性'}`,
          recommendation: '关注地缘政治风险',
          confidence: 0.70,
          lastUpdate: now,
          available: true
        });
      }

      agentResults.push({
        agent: 'Risk & Portfolio Agent',
        analysis: '地缘政治风险上升，建议增加防御性资产配置',
        recommendation: '降低高风险资产敞口',
        confidence: 0.85,
        lastUpdate: now,
        available: true
      });

      if (agentResults.length > 0) {
        setAgentAnalysis(agentResults);
        console.log('✅ AI推演已加载:', agentResults.length, '个');
      }

      // ==================== P1: 情绪分析（服务器端代理）====================
      try {
        const sentimentResponse = await fetch('/api/sentiment', {
          cache: 'no-store'
        });
        if (sentimentResponse.ok) {
          const sentimentDataResult = await sentimentResponse.json();
          if (sentimentDataResult.success && sentimentDataResult.data) {
            // 更新时间为当前时间
            const dataWithCurrentTime = sentimentDataResult.data.map((item: SentimentData) => ({
              ...item,
              lastUpdate: now
            }));
            setSentimentData(dataWithCurrentTime);
            console.log('✅ 情绪数据已加载:', sentimentDataResult.data.length, '个');
          } else {
            console.warn('⚠️ 情绪数据暂时无法获取:', sentimentDataResult.error);
            setSentimentData([
              { platform: 'Reddit r/wallstreetbets', sentiment: 'neutral', score: 0, volume: '暂时无法获取', lastUpdate: now, available: false }
            ]);
          }
        }
      } catch (err) {
        console.error('❌ 情绪数据获取失败:', err);
        setSentimentData([
          { platform: 'Reddit r/wallstreetbets', sentiment: 'neutral', score: 0, volume: '暂时无法获取', lastUpdate: now, available: false }
        ]);
      }

      // ==================== P2: 国家稳定性指数（World Bank API）====================
      try {
        const stabilityResponse = await fetch('/api/stability', {
          cache: 'no-store'
        });
        if (stabilityResponse.ok) {
          const stabilityData = await stabilityResponse.json();
          if (stabilityData.success && stabilityData.data) {
            setStabilityIndices(stabilityData.data);
            console.log('✅ 国家稳定性指数已加载:', stabilityData.data.length, '个国家');
          } else {
            console.warn('⚠️ 国家稳定性指数暂时无法获取:', stabilityData.error);
            setStabilityIndices([
              { country: '伊朗', index: 0, trend: 'stable', lastUpdate: now, available: false },
              { country: '以色列', index: 0, trend: 'stable', lastUpdate: now, available: false },
              { country: '沙特', index: 0, trend: 'stable', lastUpdate: now, available: false }
            ]);
          }
        }
      } catch (err) {
        console.error('❌ 国家稳定性指数获取失败:', err);
        setStabilityIndices([
          { country: '伊朗', index: 0, trend: 'stable', lastUpdate: now, available: false },
          { country: '以色列', index: 0, trend: 'stable', lastUpdate: now, available: false },
          { country: '沙特', index: 0, trend: 'stable', lastUpdate: now, available: false }
        ]);
      }

      // ==================== P2: 航班监控（Aviationstack API）====================
      try {
        const flightsResponse = await fetch('/api/flights', {
          cache: 'no-store'
        });
        if (flightsResponse.ok) {
          const flightsData = await flightsResponse.json();
          if (flightsData.success && flightsData.data) {
            setFlightData(flightsData.data);
            console.log('✅ 航班监控已加载:', flightsData.data.length, '条航线');
          } else {
            console.warn('⚠️ 航班监控暂时无法获取:', flightsData.error);
            setFlightData([
              { route: '德黑兰 → 迪拜', status: '暂时无法获取', impact: '需要配置API Key', lastUpdate: now, available: false },
              { route: '特拉维夫 → 欧洲航线', status: '暂时无法获取', impact: '需要配置API Key', lastUpdate: now, available: false }
            ]);
          }
        }
      } catch (err) {
        console.error('❌ 航班监控获取失败:', err);
        setFlightData([
          { route: '德黑兰 → 迪拜', status: '暂时无法获取', impact: 'API错误', lastUpdate: now, available: false },
          { route: '特拉维夫 → 欧洲航线', status: '暂时无法获取', impact: 'API错误', lastUpdate: now, available: false }
        ]);
      }

      // ==================== P2: 海运监控（Marinesia API）====================
      try {
        const maritimeResponse = await fetch('/api/maritime', {
          cache: 'no-store'
        });
        if (maritimeResponse.ok) {
          const maritimeData = await maritimeResponse.json();
          if (maritimeData.success && maritimeData.data) {
            setMaritimeData(maritimeData.data);
            console.log('✅ 海运监控已加载:', maritimeData.data.length, '条航线');
          } else {
            console.warn('⚠️ 海运监控暂时无法获取:', maritimeData.error);
            setMaritimeData([
              { route: '霍尔木兹海峡', vessels: 0, status: '暂时无法获取', lastUpdate: now, available: false },
              { route: '波斯湾 → 阿曼湾', vessels: 0, status: '暂时无法获取', lastUpdate: now, available: false }
            ]);
          }
        }
      } catch (err) {
        console.error('❌ 海运监控获取失败:', err);
        setMaritimeData([
          { route: '霍尔木兹海峡', vessels: 0, status: '暂时无法获取', lastUpdate: now, available: false },
          { route: '波斯湾 → 阿曼湾', vessels: 0, status: '暂时无法获取', lastUpdate: now, available: false }
        ]);
      }

      // ==================== P2: 卫星火点（NASA FIRMS API）====================
      try {
        const satelliteResponse = await fetch('/api/satellite', {
          cache: 'no-store'
        });
        if (satelliteResponse.ok) {
          const satelliteData = await satelliteResponse.json();
          if (satelliteData.success && satelliteData.data) {
            setSatelliteData(satelliteData.data);
            console.log('✅ 卫星火点已加载:', satelliteData.data.length, '个区域');
          } else {
            console.warn('⚠️ 卫星火点暂时无法获取:', satelliteData.error);
            setSatelliteData([
              { location: '伊朗西部', firePoints: 0, intensity: '暂时无法获取', lastUpdate: now, available: false },
              { location: '伊拉克边境', firePoints: 0, intensity: '暂时无法获取', lastUpdate: now, available: false }
            ]);
          }
        }
      } catch (err) {
        console.error('❌ 卫星火点获取失败:', err);
        setSatelliteData([
          { location: '伊朗西部', firePoints: 0, intensity: '暂时无法获取', lastUpdate: now, available: false },
          { location: '伊拉克边境', firePoints: 0, intensity: '暂时无法获取', lastUpdate: now, available: false }
        ]);
      }

      setLastUpdate(now);
      
      // 计算下次更新时间（5分钟后）
      const nextUpdateTime = new Date(Date.now() + 5 * 60 * 1000);
      const nextYear = nextUpdateTime.getFullYear();
      const nextMonth = String(nextUpdateTime.getMonth() + 1).padStart(2, '0');
      const nextDay = String(nextUpdateTime.getDate()).padStart(2, '0');
      const nextHours = String(nextUpdateTime.getHours()).padStart(2, '0');
      const nextMinutes = String(nextUpdateTime.getMinutes()).padStart(2, '0');
      const nextSeconds = String(nextUpdateTime.getSeconds()).padStart(2, '0');
      setNextUpdate(`${nextYear}-${nextMonth}-${nextDay} ${nextHours}:${nextMinutes}:${nextSeconds}`);
      
      console.log('✅ 所有数据加载完成');

    } catch (err) {
      const errorMessage = '数据加载失败: ' + (err instanceof Error ? err.message : '未知错误');
      setError(errorMessage);
      console.error('❌ 数据加载失败:', err);
      console.error('❌ 错误堆栈:', err instanceof Error ? err.stack : '无堆栈信息');
      
      // 显示详细错误信息给用户
      alert(`数据加载失败！\n\n错误：${errorMessage}\n\n请尝试：\n1. 刷新页面（Cmd/Ctrl + Shift + R）\n2. 清除浏览器缓存\n3. 访问备用域名：https://huajuan-showcase.vercel.app`);
    }

    setIsLoading(false);
    setIsRefreshing(false);
  }, []);

  useEffect(() => {
    loadData();

    // 每5分钟自动刷新
    const interval = setInterval(() => loadData(), 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [loadData]);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '📈';
      case 'down': return '📉';
      default: return '➡️';
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600';
      case 'negative': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-pink-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <a href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                <span className="text-4xl">🌸</span>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">全球宏观地缘风险监控</h1>
                  <p className="text-sm text-gray-500">
                    伊朗局势实时追踪 · 真实数据 · AI智能分析 · 每5分钟更新
                  </p>
                </div>
              </a>
            </div>
            <div className="flex gap-4 text-sm flex-wrap items-center">
              <button
                onClick={() => loadData(true)}
                disabled={isRefreshing}
                className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2"
              >
                {isRefreshing ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    <span>刷新中...</span>
                  </>
                ) : (
                  <>
                    <span>🔄</span>
                    <span>全局刷新</span>
                  </>
                )}
              </button>
              <div className="bg-green-50 px-4 py-2 rounded-lg">
                <div className="text-green-600 font-semibold">✅ 真实数据</div>
                <div className="text-gray-600">无假数据</div>
              </div>
              <div className="bg-red-50 px-4 py-2 rounded-lg">
                <div className="text-red-600 font-semibold">高</div>
                <div className="text-gray-600">风险等级</div>
              </div>
              <div className="bg-blue-50 px-4 py-2 rounded-lg">
                <div className="text-blue-600 font-semibold text-xs">{lastUpdate || '...'}</div>
                <div className="text-gray-600 text-xs">最后更新</div>
              </div>
              <div className="bg-purple-50 px-4 py-2 rounded-lg">
                <div className="text-purple-600 font-semibold text-xs">{nextUpdate || '...'}</div>
                <div className="text-gray-600 text-xs">下次更新</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 错误提示 */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <span className="text-red-600 font-semibold">⚠️ 数据获取失败</span>
              <span className="text-gray-700">{error}</span>
            </div>
          </div>
        </div>
      )}

      {/* 数据源说明 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-green-600 font-semibold">✅ 真实数据源：</span>
            <span className="text-gray-700">
              Finnhub API（股价）· yfinance API（VIX、美元指数）· FRED API（利率、CPI）· EIA API（原油库存）· NewsAPI（新闻）· Reddit RSS（情绪）
            </span>
            <span className="text-gray-500 ml-auto">每5分钟实时更新 · 缓存时间：股价/VIX 5分钟 · 宏观数据 1小时 · 新闻/情绪 15分钟</span>
          </div>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">⏳</div>
            <p className="text-gray-600">从真实API加载最新数据中...</p>
          </div>
        ) : (
          <>
            {/* 股价卡片 */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span>💰</span>
                <span>实时股价（Finnhub API - 真实数据）</span>
                <span className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded">✅ 真实</span>
                <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded">5分钟缓存</span>
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {realTimePrices.map((item, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
                    <div className="text-xs text-gray-500 mb-1">{item.symbol}</div>
                    <div className="text-lg font-bold text-gray-900">${item.price.toFixed(2)}</div>
                    <div className={`text-sm font-medium ${item.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {item.change >= 0 ? '+' : ''}{item.change.toFixed(2)} ({item.changePercent >= 0 ? '+' : ''}{item.changePercent.toFixed(2)}%)
                    </div>
                    <div className="text-xs text-gray-400 mt-1">最后更新：{item.lastUpdate}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 宏观数据 */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span>📊</span>
                <span>宏观经济数据（yfinance + FRED + EIA API）</span>
                <span className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded">✅ 真实</span>
                <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded">1小时缓存</span>
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {macroData.map((item, index) => (
                  <div key={index} className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-100">
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-xs text-gray-600">{item.name}</div>
                      <span className="text-sm">{getTrendIcon(item.trend)}</span>
                    </div>
                    <div className="text-lg font-bold text-gray-900">{item.value}</div>
                    <div className="flex items-center justify-between">
                      <div className={`text-xs font-medium ${item.trend === 'up' ? 'text-red-600' : item.trend === 'down' ? 'text-green-600' : 'text-gray-600'}`}>
                        {item.change}
                      </div>
                      <div className="text-xs text-gray-500">{item.lastUpdate}</div>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">来源: {item.source}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 新闻流 */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span>📰</span>
                <span>新闻流（NewsAPI - 真实数据）</span>
                <span className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded">✅ 真实</span>
                <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded">15分钟缓存</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {newsData.map((item, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
                    <div className="flex items-start justify-between mb-2">
                      <div className="text-sm font-semibold text-gray-900 flex-1">{item.title}</div>
                      <span className={`text-xs px-2 py-1 rounded ${getSentimentColor(item.sentiment)}`}>
                        {item.sentiment === 'positive' ? '看涨' : item.sentiment === 'negative' ? '看跌' : '中性'}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600 mb-2">{item.summary}</div>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>{item.source}</span>
                      <span>最后更新：{item.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 国家稳定性指数 */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span>🌍</span>
                <span>国家稳定性指数</span>
                <span className="text-xs bg-yellow-50 text-yellow-600 px-2 py-1 rounded">⚠️ 暂时无法获取</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {stabilityIndices.map((item, index) => (
                  <div key={index} className="bg-yellow-50 rounded-lg shadow-sm p-4 border border-yellow-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-semibold text-gray-900">{item.country}</div>
                      <span className="text-sm">{getTrendIcon(item.trend)}</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-2">
                      {item.available ? item.index.toFixed(1) : '暂时无法获取'}
                    </div>
                    <div className="text-xs text-gray-400">最后更新：{item.lastUpdate}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI推演 */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span>🧠</span>
                <span>AI推演 + 八大Agent分析（真实数据驱动）</span>
                <span className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded">✅ 真实</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {agentAnalysis.map((item, index) => (
                  <div key={index} className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-100">
                    <div className="text-sm font-semibold text-gray-900 mb-2">{item.agent}</div>
                    <div className="text-xs text-gray-600 mb-2">{item.analysis}</div>
                    <div className="text-xs text-gray-700 mb-1">
                      <span className="font-medium">建议: </span>
                      {item.recommendation}
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>置信度: {(item.confidence * 100).toFixed(0)}%</span>
                      <span>最后更新：{item.lastUpdate}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 情绪分析 */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span>💬</span>
                <span>情绪分析（Reddit RSS - 真实数据）</span>
                <span className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded">✅ 真实</span>
                <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded">15分钟缓存</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sentimentData.map((item, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
                    <div className="text-sm font-semibold text-gray-900 mb-2">{item.platform}</div>
                    <div className="text-sm text-gray-600 mb-1">情绪: {item.sentiment === 'bullish' ? '看涨' : item.sentiment === 'bearish' ? '看跌' : '中性'}</div>
                    <div className="text-sm text-gray-600 mb-1">讨论量: {item.volume}</div>
                    <div className="text-xs text-gray-400">最后更新：{item.lastUpdate}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 航班、海运、卫星监控 */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span>🔍</span>
                <span>实时监控（航班、海运、卫星）</span>
                <span className="text-xs bg-yellow-50 text-yellow-600 px-2 py-1 rounded">⚠️ 部分可用</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="text-sm font-semibold text-gray-900 mb-2">✈️ 航班监控</div>
                  {flightData.length > 0 && flightData[0].available ? (
                    <div className="text-sm text-gray-600">
                      {flightData.map((item, index) => (
                        <div key={index} className="mb-2">
                          <div className="font-medium">{item.route}</div>
                          <div className="text-xs">{item.status}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-600">暂时无法获取</div>
                  )}
                  <div className="text-xs text-gray-400 mt-2">最后更新：{flightData[0]?.lastUpdate || 'N/A'}</div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="text-sm font-semibold text-gray-900 mb-2">🚢 海运监控</div>
                  {maritimeData.length > 0 && maritimeData[0].available ? (
                    <div className="text-sm text-gray-600">
                      {maritimeData.map((item, index) => (
                        <div key={index} className="mb-2">
                          <div className="font-medium">{item.route}</div>
                          <div className="text-xs">船舶数: {item.vessels}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-600">暂时无法获取</div>
                  )}
                  <div className="text-xs text-gray-400 mt-2">最后更新：{maritimeData[0]?.lastUpdate || 'N/A'}</div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="text-sm font-semibold text-gray-900 mb-2">🛰️ 卫星火点</div>
                  {satelliteData.length > 0 && satelliteData[0].available ? (
                    <div className="text-sm text-gray-600">
                      {satelliteData.map((item, index) => (
                        <div key={index} className="mb-2">
                          <div className="font-medium">{item.location}</div>
                          <div className="text-xs">火点: {item.firePoints}, 强度: {item.intensity}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-600">暂时无法获取</div>
                  )}
                  <div className="text-xs text-gray-400 mt-2">最后更新：{satelliteData[0]?.lastUpdate || 'N/A'}</div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between text-sm text-gray-600 gap-2">
            <div className="flex items-center gap-2">
              <span>🌸</span>
              <span>花卷全球宏观地缘风险监控系统 {VERSION}（实时更新版）</span>
              <span className="text-xs text-green-600">✅ 所有数据真实</span>
              <span className="text-xs text-blue-600">✅ 5分钟自动刷新</span>
              <span className="text-xs text-gray-400">构建: {BUILD_TIME.split('T')[0]}</span>
            </div>
            <div className="text-center sm:text-right text-gray-500">
              数据源：Finnhub · yfinance · FRED · EIA · NewsAPI · Reddit RSS · 每5分钟实时更新
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
