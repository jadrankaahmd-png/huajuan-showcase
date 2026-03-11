import { NextRequest, NextResponse } from 'next/server';

// API 配置
const QVERIS_API_KEY = process.env.QVERIS_API_KEY || 'sk-YFaMAuNb1r1qBE4_0Pr3wZYtvzqHbKL8Ths6SvWOiRU';
const NEWSAPI_KEY = process.env.NEWSAPI_KEY || '332b7388f0fb42a9bf05d06a89fc10c9';
const FINNHUB_KEY = process.env.FINNHUB_KEY || 'd61gv49r01qufbsn7v90d61gv49r01qufbsn7v9g';
const FRED_API_KEY = process.env.FRED_API_KEY || 'af7508267bd3d2d7820438698f28b3ec';
const EIA_API_KEY = process.env.EIA_API_KEY || 'vFGhPvNPdmfdJ7YKMx1BgJ1Oz9FS82dIscKBB6G8';

// MiniMax API 配置
const MINIMAX_API_KEY = process.env.MINIMAX_API_KEY || '';
const MINIMAX_API_URL = 'https://api.minimax.chat/v1/text/chatcompletion_v2';

const QVERIS_EXECUTE_URL = 'https://qveris.ai/api/v1/tools/execute';
// Tool ID now dynamically fetched

// 缓存 tool_id（避免每次请求都搜索）
let cachedToolId: string | null = null;

// 动态获取 EODHD 历史数据工具ID（必须动态获取，不能hardcode）
async function getEODToolId(): Promise<string | null> {
  if (cachedToolId) return cachedToolId;
  
  try {
    const response = await fetch('https://qveris.ai/api/v1/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${QVERIS_API_KEY}`,
      },
      body: JSON.stringify({
        query: 'stock historical price eod',
        limit: 3,
      }),
    });
    
    if (!response.ok) return null;
    
    const result = await response.json();
    if (result.results && result.results.length > 0) {
      const eodTool = result.results.find((t: any) => 
        t.tool_id && t.tool_id.includes('eodhd') && t.tool_id.includes('historical')
      );
      if (eodTool) {
        cachedToolId = eodTool.tool_id;
        console.log('✅ QVeris tool_id:', cachedToolId);
        return cachedToolId;
      }
    }
    return null;
  } catch (error) {
    console.error('获取 tool_id 错误:', error);
    return null;
  }
}


// 全球指标（ETF）
const GLOBAL_INDICATORS = [
  { symbol: 'SPY', name: '标普500 ETF' },
  { symbol: 'QQQ', name: '纳斯达克100 ETF' },
  { symbol: 'VIXY', name: 'VIX恐慌指数 ETF' },
  { symbol: 'GLD', name: '黄金ETF' },
  { symbol: 'UUP', name: '美元指数 ETF' },
];

// 美股20个板块ETF
const SECTOR_ETFS = [
  { symbol: 'XLB', name: '材料' },
  { symbol: 'XLE', name: '能源' },
  { symbol: 'XLF', name: '金融' },
  { symbol: 'XLI', name: '工业' },
  { symbol: 'XLK', name: '科技' },
  { symbol: 'XLP', name: '消费必需品' },
  { symbol: 'XLU', name: '公用事业' },
  { symbol: 'XLV', name: '医疗' },
  { symbol: 'XLY', name: '消费非必需品' },
  { symbol: 'XME', name: '矿业' },
  { symbol: 'XOP', name: '油气勘探' },
  { symbol: 'XHB', name: '住宅建筑' },
  { symbol: 'XRT', name: '零售' },
  { symbol: 'XSD', name: '半导体' },
  { symbol: 'XBI', name: '生物技术' },
  { symbol: 'XAR', name: '航空航天与国防' },
  { symbol: 'GDX', name: '金矿' },
  { symbol: 'SIL', name: '白银' },
  { symbol: 'USO', name: '原油' },
  { symbol: 'UNG', name: '天然气' },
];

// 获取最近N天的历史数据（用于计算实时价格和涨跌幅）
async function getRecentEODData(symbol: string, days: number = 5) {
  try {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const executeUrl = new URL(QVERIS_EXECUTE_URL);
    const toolId = await getEODToolId();
    if (!toolId) return null;
    
    executeUrl.searchParams.set('tool_id', toolId);
    
    const response = await fetch(executeUrl.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${QVERIS_API_KEY}`,
      },
      body: JSON.stringify({
        search_id: `market-analyst-${symbol}-${Date.now()}`,
        parameters: {
          symbol: `${symbol}.US`,
          from: startDate.toISOString().split('T')[0],
          to: endDate.toISOString().split('T')[0],
          period: 'd',
          fmt: 'json',
        },
        max_response_size: 50000,
      }),
    });

    if (!response.ok) return null;
    
    const result = await response.json();
    if (result.success && result.result && result.result.data) {
      return result.result.data;
    }
    return null;
  } catch (error) {
    console.error(`获取 ${symbol} 历史数据错误:`, error);
    return null;
  }
}

// 批量获取报价（使用历史数据工具）
async function getBatchQuotes(symbols: string[]) {
  try {
    console.log(`批量获取报价（历史数据）: ${symbols.length} 个符号`);
    
    // 并行获取所有符号的历史数据
    const promises = symbols.map(async (symbol) => {
      const data = await getRecentEODData(symbol, 5); // 获取最近5天数据
      
      if (!data || data.length < 2) {
        return null;
      }
      
      // 最新一天的数据
      const latest = data[data.length - 1];
      // 前一天的数据（用于计算涨跌幅）
      const previous = data[data.length - 2];
      
      const close = latest.close || latest.adjusted_close || 0;
      const prevClose = previous.close || previous.adjusted_close || 0;
      const change = close - prevClose;
      const changePercent = prevClose > 0 ? ((change / prevClose) * 100) : 0;
      
      return {
        symbol,
        close: parseFloat(String(close)) || 0,
        change: parseFloat(String(change)) || 0,
        changePercent: parseFloat(changePercent.toFixed(2)) || 0,
      };
    });
    
    const results = await Promise.all(promises);
    const filtered = results.filter(Boolean);
    
    console.log(`获取到报价数量: ${filtered.length}`);
    
    return filtered;
  } catch (error) {
    console.error('批量获取报价错误:', error);
    return [];
  }
}

// 获取 NewsAPI 新闻（增加超时限制）
async function getNewsAPIData() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    
    const response = await fetch(
      `https://newsapi.org/v2/top-headlines?country=us&category=business&pageSize=5&apiKey=${NEWSAPI_KEY}`,
      { signal: controller.signal }
    );
    
    clearTimeout(timeoutId);
    
    if (!response.ok) return [];
    
    const data = await response.json();
    return data.articles?.slice(0, 5) || [];
  } catch (error) {
    console.error('NewsAPI 错误（超时或网络问题）:', error);
    return [];
  }
}

// 获取 Finnhub 市场新闻
async function getFinnhubNews() {
  try {
    const response = await fetch(
      `https://finnhub.io/api/v1/news?category=general&token=${FINNHUB_KEY}`
    );
    
    if (!response.ok) return [];
    
    const data = await response.json();
    return data.slice(0, 5) || [];
  } catch (error) {
    console.error('Finnhub 错误:', error);
    return [];
  }
}

// 获取 FRED 宏观经济数据
async function getFREDData() {
  try {
    const response = await fetch(
      `https://api.stlouisfed.org/fred/series/observations?series_id=FEDFUNDS&api_key=${FRED_API_KEY}&file_type=json&observation_start=2025-01-01`
    );
    
    if (!response.ok) return null;
    
    const data = await response.json();
    const observations = data.observations || [];
    const latest = observations[observations.length - 1];
    
    return {
      indicator: '联邦基金利率',
      value: latest?.value || 'N/A',
      date: latest?.date || 'N/A',
    };
  } catch (error) {
    console.error('FRED API 错误:', error);
    return null;
  }
}

// 获取 EIA 能源数据
async function getEIAData() {
  try {
    const response = await fetch(
      `https://api.eia.gov/v2/petroleum/stoc/wstk/data/?api_key=${EIA_API_KEY}&frequency=weekly&data[0]=value&sort[0][column]=period&sort[0][direction]=desc&length=1`
    );
    
    if (!response.ok) return null;
    
    const data = await response.json();
    const latest = data.response?.data?.[0];
    
    return {
      indicator: '原油库存',
      value: latest?.value || 'N/A',
      period: latest?.period || 'N/A',
    };
  } catch (error) {
    console.error('EIA API 错误:', error);
    return null;
  }
}

// 生成AI分析报告（使用 MiniMax M2.5）
async function generateAIReport(
  globalData: any[],
  sectorData: any[],
  newsData: any,
  finnhubData: any,
  macroData: any,
  energyData: any
): Promise<string> {
  // 检查 API Key
  if (!MINIMAX_API_KEY) {
    throw new Error('MiniMax API Key 未配置 (MINIMAX_API_KEY)');
  }

  const dataContext = `
全球指标：${JSON.stringify(globalData.map(d => ({ name: d.name, change: d.changePercent })))}
板块表现：${JSON.stringify(sectorData.map(d => ({ name: d.name, change: d.changePercent })))}
宏观数据：${JSON.stringify(macroData)}
能源数据：${JSON.stringify(energyData)}
最新新闻：${JSON.stringify(newsData?.slice(0,5).map((a:any) => a.title))}
`;

  const response = await fetch(MINIMAX_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${MINIMAX_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'MiniMax-M2.5-highspeed',
      messages: [
        {
          role: 'system',
          content: '你是花卷AI投资系统的专业美股市场分析师。基于真实市场数据，用中文生成简洁专业的分析报告。包含：市场概况、板块强弱梯队、异常信号、主线逻辑、风险提示。'
        },
        {
          role: 'user',
          content: `请基于以下今日市场数据生成分析报告：\n${dataContext}`
        }
      ],
      max_tokens: 1500,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`MiniMax API错误: ${response.status} - ${errorText}`);
  }

  const result = await response.json();
  if (result.choices && result.choices[0]) {
    return result.choices[0].message.content;
  }
  throw new Error('MiniMax 返回格式错误');
}

export async function POST(request: NextRequest) {
  try {
    console.log('\n=== AI美股市场分析师（修复版 V2）启动 ===');
    
    // 并行获取所有数据
    console.log('1. 并行获取所有数据源...');
    
    const [
      globalQuotes,
      sectorQuotes,
      newsData,
      finnhubData,
      macroData,
      energyData,
    ] = await Promise.all([
      // 行情数据层（QVeris EODHD 历史数据）
      getBatchQuotes(GLOBAL_INDICATORS.map(g => g.symbol)),
      getBatchQuotes(SECTOR_ETFS.map(s => s.symbol)),
      
      // 新闻与情绪层
      getNewsAPIData(),
      getFinnhubNews(),
      
      // 宏观监控层
      getFREDData(),
      getEIAData(),
    ]);
    
    console.log('✅ 数据获取完成:');
    console.log(`  - 全球指标: ${globalQuotes.length} 个`);
    console.log(`  - 板块ETF: ${sectorQuotes.length} 个`);
    console.log(`  - NewsAPI新闻: ${newsData.length} 条`);
    console.log(`  - Finnhub新闻: ${finnhubData.length} 条`);
    console.log(`  - FRED数据: ${macroData ? '✅' : '❌'}`);
    console.log(`  - EIA数据: ${energyData ? '✅' : '❌'}`);
    
    // 打印前3个全球指标数据（调试用）
    console.log('全球指标示例:', globalQuotes.slice(0, 3));
    console.log('板块ETF示例:', sectorQuotes.slice(0, 3));
    
    // 整合数据
    const globalData = GLOBAL_INDICATORS.map(indicator => {
      const quote = globalQuotes.find(q => q?.symbol === indicator.symbol);
      return {
        ...indicator,
        close: quote?.close || 0,
        changePercent: quote?.changePercent || 0,
      };
    });
    
    const sectorData = SECTOR_ETFS.map(sector => {
      const quote = sectorQuotes.find(q => q?.symbol === sector.symbol);
      return {
        ...sector,
        close: quote?.close || 0,
        changePercent: quote?.changePercent || 0,
      };
    });
    
    // 合并新闻数据
    const allNews = [...newsData, ...finnhubData];

    // 生成AI分析报告
    console.log('2. 生成AI分析报告（GLM-5）...');
    const report = await generateAIReport(
      globalData,
      sectorData,
      allNews,
      finnhubData,
      macroData,
      energyData
    );
    
    console.log('=== AI美股市场分析师（修复版 V2）完成 ===\n');
    
    return NextResponse.json({
      success: true,
      report,
      timestamp: new Date().toISOString(),
      dataSources: {
        qveris: { global: globalQuotes.length, sectors: sectorQuotes.length },
        newsapi: newsData.length,
        finnhub: finnhubData.length,
        fred: macroData ? 1 : 0,
        eia: energyData ? 1 : 0,
      },
    });
    
  } catch (error: any) {
    console.error('AI美股市场分析师错误:', error);
    return NextResponse.json(
      { error: error.message || '分析失败，请稍后重试' },
      { status: 500 }
    );
  }
}
