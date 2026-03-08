import { NextRequest, NextResponse } from 'next/server';

// API 配置
const QVERIS_API_KEY = process.env.QVERIS_API_KEY || 'sk-YFaMAuNb1r1qBE4_0Pr3wZYtvzqHbKL8Ths6SvWOiRU';
const NEWSAPI_KEY = process.env.NEWSAPI_KEY || '332b7388f0fb42a9bf05d06a89fc10c9';
const FINNHUB_KEY = process.env.FINNHUB_KEY || 'd61gv49r01qufbsn7v90d61gv49r01qufbsn7v9g';
const FRED_API_KEY = process.env.FRED_API_KEY || 'af7508267bd3d2d7820438698f28b3ec';
const EIA_API_KEY = process.env.EIA_API_KEY || 'vFGhPvNPdmfdJ7YKMx1BgJ1Oz9FS82dIscKBB6G8';

const QVERIS_EXECUTE_URL = 'https://qveris.ai/api/v1/tools/execute';

// 全球指标
const GLOBAL_INDICATORS = [
  { symbol: 'DXY', name: '美元指数' },
  { symbol: 'NDX', name: '纳斯达克100' },
  { symbol: 'VIX', name: 'VIX恐慌指数' },
  { symbol: 'GC1', name: '黄金期货' },
  { symbol: 'SPX', name: '标普500' },
];

// 美股38个板块ETF（只取前20个）
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

// 获取 QVeris 数据
async function getQVerisData(toolId: string, params: any) {
  try {
    const executeUrl = new URL(QVERIS_EXECUTE_URL);
    executeUrl.searchParams.set('tool_id', toolId);
    
    const response = await fetch(executeUrl.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${QVERIS_API_KEY}`,
      },
      body: JSON.stringify({
        search_id: `market-analyst-${Date.now()}`,
        parameters: params,
        max_response_size: 20480,
      }),
    });

    if (!response.ok) return null;
    
    const result = await response.json();
    if (result.success && result.result) {
      const data = result.result.data || result.result.truncated_content;
      return typeof data === 'string' ? JSON.parse(data) : data;
    }
    return null;
  } catch (error) {
    console.error('QVeris API 错误:', error);
    return null;
  }
}

// 获取实时报价
async function getQuotes(symbols: string[]) {
  const promises = symbols.map(async (symbol) => {
    const data = await getQVerisData('eodhd.quote.retrieve.v1.34f25103', {
      symbols: `${symbol}.US`,
      fmt: 'json',
    });
    
    if (data) {
      const quote = Array.isArray(data) ? data[0] : data;
      return {
        symbol,
        close: quote.close || quote.price,
        change: quote.change || 0,
        changePercent: quote.change_p || quote.changePercent || 0,
      };
    }
    return null;
  });
  
  const results = await Promise.all(promises);
  return results.filter(Boolean);
}

// 获取 NewsAPI 新闻
async function getNewsAPIData() {
  try {
    const response = await fetch(
      `https://newsapi.org/v2/top-headlines?country=us&category=business&pageSize=5&apiKey=${NEWSAPI_KEY}`
    );
    
    if (!response.ok) return [];
    
    const data = await response.json();
    return data.articles?.slice(0, 5) || [];
  } catch (error) {
    console.error('NewsAPI 错误:', error);
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
    // 获取联邦基金利率
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
    // 获取原油库存数据
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

// 生成综合分析报告
function generateComprehensiveReport(
  globalData: any[],
  sectorData: any[],
  newsData: any[],
  macroData: any,
  energyData: any
): string {
  // 异常识别
  const anomalies: string[] = [];
  
  const vix = globalData.find(d => d.symbol === 'VIX');
  const ndx = globalData.find(d => d.symbol === 'NDX');
  const dxy = globalData.find(d => d.symbol === 'DXY');
  const gc1 = globalData.find(d => d.symbol === 'GC1');
  
  // 跨数据源交叉验证异常
  if (vix?.changePercent > 10 && ndx?.changePercent < -2) {
    anomalies.push(`🚨 **恐慌性抛售信号**：VIX暴涨 ${vix.changePercent.toFixed(2)}% + 纳指暴跌 ${ndx.changePercent.toFixed(2)}%`);
  }
  
  if (dxy?.changePercent > 1 && gc1?.changePercent > 2) {
    anomalies.push(`⚠️ **避险异常**：美元走强 ${dxy.changePercent.toFixed(2)}% 同时黄金上涨 ${gc1.changePercent.toFixed(2)}%`);
  }
  
  if (energyData?.value !== 'N/A') {
    anomalies.push(`📊 **原油库存数据**：${energyData.value}（${energyData.period}）`);
  }
  
  // 板块异常
  const strongSectors = sectorData.filter(s => s.changePercent > 3);
  const weakSectors = sectorData.filter(s => s.changePercent < -3);
  
  if (strongSectors.length >= 5) {
    anomalies.push(`🔥 **板块普涨**：${strongSectors.length}个板块涨幅超3%`);
  }
  
  if (weakSectors.length >= 5) {
    anomalies.push(`❄️ **板块普跌**：${weakSectors.length}个板块跌幅超3%`);
  }
  
  // 板块梯队
  const sortedSectors = [...sectorData].sort((a, b) => b.changePercent - a.changePercent);
  
  const tier1 = sortedSectors.slice(0, 4);
  const tier2 = sortedSectors.slice(4, 8);
  const tier3 = sortedSectors.slice(8, 12);
  const tier4 = sortedSectors.slice(12, 16);
  const tier5 = sortedSectors.slice(16, 20);
  
  // 主线逻辑
  let logicChain = '';
  if (dxy?.changePercent > 0.5) {
    logicChain = `美元走强（${dxy.changePercent.toFixed(2)}%）→ 压制风险资产 → 美股承压 → 资金流向防御性板块`;
  } else if (vix?.changePercent > 10) {
    logicChain = `恐慌情绪上升（VIX +${vix.changePercent.toFixed(2)}%）→ 避险需求增加 → 黄金和国债上涨 → 成长股下跌`;
  } else {
    logicChain = `市场情绪平稳 → 板块轮动正常 → 资金流向强势板块 → 结构性机会`;
  }
  
  // 生成报告
  const report = `# 🤖 AI美股市场分析师报告（综合版）

**生成时间：** ${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}
**数据源：** QVeris + NewsAPI + Finnhub + FRED + EIA

---

## 🌍 宏观环境

### 利率与宏观经济
${macroData ? `**${macroData.indicator}**：${macroData.value}（${macroData.date}）` : '数据暂不可用'}

### 全球指标
| 指标 | 最新价 | 涨跌幅 |
|------|--------|--------|
${globalData.map(g => `**${g.name}** | ${g.close?.toFixed(2) || '-'} | ${g.changePercent > 0 ? '+' : ''}${g.changePercent?.toFixed(2) || '0.00'}%`).join('\n')}

---

## 📊 市场概况

### 板块强弱梯队

#### 第一梯队（强势板块）✅
${tier1.map(s => `- **${s.name}** (${s.symbol}): ${s.changePercent > 0 ? '+' : ''}${s.changePercent.toFixed(2)}%`).join('\n')}

#### 第二梯队（中上板块）📈
${tier2.map(s => `- **${s.name}** (${s.symbol}): ${s.changePercent > 0 ? '+' : ''}${s.changePercent.toFixed(2)}%`).join('\n')}

#### 第三梯队（中性板块）➡️
${tier3.map(s => `- **${s.name}** (${s.symbol}): ${s.changePercent > 0 ? '+' : ''}${s.changePercent.toFixed(2)}%`).join('\n')}

#### 第四梯队（弱势板块）📉
${tier4.map(s => `- **${s.name}** (${s.symbol}): ${s.changePercent.toFixed(2)}%`).join('\n')}

#### 第五梯队（最弱板块）❄️
${tier5.map(s => `- **${s.name}** (${s.symbol}): ${s.changePercent.toFixed(2)}%`).join('\n')}

---

## 🔥 异常信号

${anomalies.length > 0 ? anomalies.join('\n\n') : '✅ **无明显异常**，市场运行平稳'}

---

## 🔗 主线逻辑

${logicChain}

---

## 📰 重要新闻

### NewsAPI
${newsData.slice(0, 3).map(n => `- **${n.title}** (${n.source?.name || '未知来源'})`).join('\n') || '暂无新闻'}

---

## 🎯 关键关注

1. **美元走势**：${dxy?.changePercent > 0.5 ? '走强，压制风险资产' : dxy?.changePercent < -0.5 ? '走弱，利好风险资产' : '平稳'}
2. **恐慌指数**：${vix?.changePercent > 10 ? '暴涨，市场恐慌' : vix?.changePercent > 5 ? '上升，谨慎情绪' : '平稳'}
3. **科技股**：${ndx?.changePercent > 1 ? '强势，市场情绪乐观' : ndx?.changePercent < -1 ? '弱势，市场情绪悲观' : '震荡'}
4. **能源板块**：${energyData ? '关注原油库存数据变化' : '数据暂不可用'}
5. **利率环境**：${macroData ? '关注美联储政策动向' : '数据暂不可用'}

---

**⚠️ 风险提示：** 本报告整合多数据源，由AI自动生成，仅供参考，不构成投资建议。市场有风险，投资需谨慎。

**📊 数据源：** QVeris（实时行情）+ NewsAPI（新闻）+ Finnhub（市场情绪）+ FRED（宏观经济）+ EIA（能源数据）
`;

  return report;
}

export async function POST(request: NextRequest) {
  try {
    console.log('\n=== AI美股市场分析师（综合版）启动 ===');
    
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
      // 行情数据层（QVeris）
      getQuotes(GLOBAL_INDICATORS.map(g => g.symbol)),
      getQuotes(SECTOR_ETFS.map(s => s.symbol)),
      
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
    
    // 整合数据
    const globalData = GLOBAL_INDICATORS.map(indicator => {
      const quote = globalQuotes.find(q => q?.symbol === indicator.symbol);
      return {
        ...indicator,
        close: quote?.close,
        changePercent: quote?.changePercent || 0,
      };
    });
    
    const sectorData = SECTOR_ETFS.map(sector => {
      const quote = sectorQuotes.find(q => q?.symbol === sector.symbol);
      return {
        ...sector,
        close: quote?.close,
        changePercent: quote?.changePercent || 0,
      };
    });
    
    // 合并新闻数据
    const allNews = [...newsData, ...finnhubData];
    
    // 生成综合报告
    console.log('2. 生成综合分析报告...');
    const report = generateComprehensiveReport(
      globalData,
      sectorData,
      allNews,
      macroData,
      energyData
    );
    
    console.log('=== AI美股市场分析师（综合版）完成 ===\n');
    
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
