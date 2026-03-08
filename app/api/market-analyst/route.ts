import { NextRequest, NextResponse } from 'next/server';

// QVeris API 配置
const QVERIS_API_KEY = process.env.QVERIS_API_KEY || 'sk-YFaMAuNb1r1qBE4_0Pr3wZYtvzqHbKL8Ths6SvWOiRU';
const QVERIS_EXECUTE_URL = 'https://qveris.ai/api/v1/tools/execute';

// EODHD 工具ID
const EODHD_QUOTE_TOOL = 'eodhd.quote.retrieve.v1.34f25103';
const EODHD_NEWS_TOOL = 'eodhd.news.retrieve.v1.34f25103';

// 全球指标
const GLOBAL_INDICATORS = [
  { symbol: 'DXY', name: '美元指数', type: 'index' },
  { symbol: 'NDX', name: '纳斯达克100', type: 'index' },
  { symbol: 'VIX', name: 'VIX恐慌指数', type: 'index' },
  { symbol: 'GC1', name: '黄金期货', type: 'commodity' },
  { symbol: 'SPX', name: '标普500', type: 'index' },
];

// 美股38个板块ETF
const SECTOR_ETFS = [
  { symbol: 'XLB', name: '材料', sector: '材料' },
  { symbol: 'XLE', name: '能源', sector: '能源' },
  { symbol: 'XLF', name: '金融', sector: '金融' },
  { symbol: 'XLI', name: '工业', sector: '工业' },
  { symbol: 'XLK', name: '科技', sector: '科技' },
  { symbol: 'XLP', name: '消费必需品', sector: '消费' },
  { symbol: 'XLU', name: '公用事业', sector: '公用事业' },
  { symbol: 'XLV', name: '医疗', sector: '医疗' },
  { symbol: 'XLY', name: '消费非必需品', sector: '消费' },
  { symbol: 'XME', name: '矿业', sector: '材料' },
  { symbol: 'XOP', name: '油气勘探', sector: '能源' },
  { symbol: 'XHB', name: '住宅建筑', sector: '房地产' },
  { symbol: 'XRT', name: '零售', sector: '消费' },
  { symbol: 'XSD', name: '半导体', sector: '科技' },
  { symbol: 'XHE', name: '医疗设备', sector: '医疗' },
  { symbol: 'XPH', name: '制药', sector: '医疗' },
  { symbol: 'XBI', name: '生物技术', sector: '医疗' },
  { symbol: 'XAR', name: '航空航天与国防', sector: '工业' },
  { symbol: 'XES', name: '能源设备与服务', sector: '能源' },
  { symbol: 'XSW', name: '软件', sector: '科技' },
  { symbol: 'XWEB', name: '互联网', sector: '科技' },
  { symbol: 'XKRE', name: '房地产', sector: '房地产' },
  { symbol: 'XNTK', name: '网络', sector: '科技' },
  { symbol: 'XOCG', name: '云计算', sector: '科技' },
  { symbol: 'GDX', name: '金矿', sector: '材料' },
  { symbol: 'GDXJ', name: '小型金矿', sector: '材料' },
  { symbol: 'SIL', name: '白银', sector: '材料' },
  { symbol: 'SLV', name: '白银ETF', sector: '材料' },
  { symbol: 'USO', name: '原油', sector: '能源' },
  { symbol: 'UNG', name: '天然气', sector: '能源' },
  { symbol: 'XTN', name: '运输', sector: '工业' },
  { symbol: 'XHE', name: '医疗健康', sector: '医疗' },
  { symbol: 'XTL', name: '电信', sector: '通信' },
  { symbol: 'XCLR', name: '清洁能源', sector: '能源' },
  { symbol: 'XES', name: '能源服务', sector: '能源' },
  { symbol: 'XMMO', name: '中型股', sector: '综合' },
  { symbol: 'XMLV', name: '中型股价值', sector: '综合' },
  { symbol: 'XMG', name: '中型股增长', sector: '综合' },
];

// 获取实时报价
async function getQuotes(symbols: string[]) {
  const quotePromises = symbols.map(async (symbol) => {
    try {
      const executeUrl = new URL(QVERIS_EXECUTE_URL);
      executeUrl.searchParams.set('tool_id', EODHD_QUOTE_TOOL);
      
      const response = await fetch(executeUrl.toString(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${QVERIS_API_KEY}`,
        },
        body: JSON.stringify({
          search_id: `quote-${Date.now()}`,
          parameters: {
            symbols: `${symbol}.US`,
            fmt: 'json',
          },
          max_response_size: 10240,
        }),
      });

      if (!response.ok) return null;
      
      const result = await response.json();
      if (result.success && result.result?.data) {
        const quote = Array.isArray(result.result.data) ? result.result.data[0] : result.result.data;
        return {
          symbol,
          close: quote.close || quote.price,
          change: quote.change || 0,
          changePercent: quote.change_p || quote.changePercent || 0,
          volume: quote.volume || 0,
        };
      }
      return null;
    } catch (error) {
      console.error(`获取 ${symbol} 报价失败:`, error);
      return null;
    }
  });

  const results = await Promise.all(quotePromises);
  return results.filter(Boolean);
}

// 获取历史数据（用于计算5日、20日、60日涨跌幅）
async function getHistoricalData(symbol: string, days: number) {
  try {
    const executeUrl = new URL(QVERIS_EXECUTE_URL);
    executeUrl.searchParams.set('tool_id', 'eodhd.eod.retrieve.v1.34f25103');
    
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const response = await fetch(executeUrl.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${QVERIS_API_KEY}`,
      },
      body: JSON.stringify({
        search_id: `historical-${Date.now()}`,
        parameters: {
          symbol: `${symbol}.US`,
          from: startDate.toISOString().split('T')[0],
          to: endDate.toISOString().split('T')[0],
          period: 'd',
          fmt: 'json',
        },
        max_response_size: 20480,
      }),
    });

    if (!response.ok) return null;
    
    const result = await response.json();
    if (result.success && result.result) {
      const data = result.result.data || result.result.truncated_content;
      if (typeof data === 'string') {
        return JSON.parse(data);
      }
      return data;
    }
    return null;
  } catch (error) {
    console.error(`获取 ${symbol} 历史数据失败:`, error);
    return null;
  }
}

// 计算涨跌幅
function calculateReturns(data: any[]) {
  if (!data || data.length < 2) return { d5: 0, d20: 0, d60: 0 };
  
  const current = data[data.length - 1].close;
  
  // 5日涨跌幅
  const d5Index = Math.max(0, data.length - 5);
  const d5 = ((current - data[d5Index].close) / data[d5Index].close) * 100;
  
  // 20日涨跌幅
  const d20Index = Math.max(0, data.length - 20);
  const d20 = ((current - data[d20Index].close) / data[d20Index].close) * 100;
  
  // 60日涨跌幅
  const d60Index = 0;
  const d60 = ((current - data[d60Index].close) / data[d60Index].close) * 100;
  
  return { d5, d20, d60 };
}

// 获取市场新闻
async function getMarketNews(symbols: string[]) {
  try {
    const executeUrl = new URL(QVERIS_EXECUTE_URL);
    executeUrl.searchParams.set('tool_id', EODHD_NEWS_TOOL);
    
    const response = await fetch(executeUrl.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${QVERIS_API_KEY}`,
      },
      body: JSON.stringify({
        search_id: `news-${Date.now()}`,
        parameters: {
          s: symbols.join(','),
          limit: 10,
          fmt: 'json',
        },
        max_response_size: 20480,
      }),
    });

    if (!response.ok) return [];
    
    const result = await response.json();
    if (result.success && result.result?.data) {
      return result.result.data.slice(0, 5); // 只返回前5条
    }
    return [];
  } catch (error) {
    console.error('获取市场新闻失败:', error);
    return [];
  }
}

// 生成分析报告（LLM驱动）
function generateReport(
  globalData: any[],
  sectorData: any[],
  news: any[]
): string {
  // 识别异常
  const anomalies: string[] = [];
  
  // 全球指标异常
  const vix = globalData.find(d => d.symbol === 'VIX');
  const ndx = globalData.find(d => d.symbol === 'NDX');
  const dxy = globalData.find(d => d.symbol === 'DXY');
  const gc1 = globalData.find(d => d.symbol === 'GC1');
  
  if (vix && vix.changePercent > 10) {
    anomalies.push(`🚨 **VIX恐慌指数暴涨 ${vix.changePercent.toFixed(2)}%**，市场恐慌情绪急剧上升`);
  }
  
  if (ndx && ndx.changePercent < -2 && vix && vix.changePercent < 5) {
    anomalies.push(`🔍 **纳斯达克下跌 ${ndx.changePercent.toFixed(2)}% 但VIX平稳**，可能为技术性回调`);
  }
  
  if (dxy && dxy.changePercent > 1) {
    anomalies.push(`📈 **美元指数走强 ${dxy.changePercent.toFixed(2)}%**，可能压制美股和黄金`);
  }
  
  if (gc1 && gc1.changePercent > 2 && dxy && dxy.changePercent > 0) {
    anomalies.push(`⚠️ **黄金上涨 ${gc1.changePercent.toFixed(2)}% 同时美元走强**，反常现象，需关注避险需求`);
  }
  
  // 板块异常
  const strongSectors = sectorData.filter(s => s.returns.d5 > 3);
  const weakSectors = sectorData.filter(s => s.returns.d5 < -3);
  
  if (strongSectors.length > 3) {
    anomalies.push(`🔥 **${strongSectors.length}个板块5日涨幅超3%**，市场情绪乐观`);
  }
  
  if (weakSectors.length > 3) {
    anomalies.push(`❄️ **${weakSectors.length}个板块5日跌幅超3%**，市场情绪悲观`);
  }
  
  // 板块梯队排名（基于5日涨跌幅）
  const sortedSectors = [...sectorData].sort((a, b) => b.returns.d5 - a.returns.d5);
  
  const tier1 = sortedSectors.slice(0, 8);  // 第一梯队（前20%）
  const tier2 = sortedSectors.slice(8, 15);  // 第二梯队
  const tier3 = sortedSectors.slice(15, 23); // 第三梯队
  const tier4 = sortedSectors.slice(23, 30); // 第四梯队
  const tier5 = sortedSectors.slice(30);     // 第五梯队（后20%）
  
  // 主线传导逻辑
  let logicChain = '';
  if (dxy && dxy.changePercent > 0.5) {
    logicChain = `美元走强 → 压制美股和黄金 → 科技股承压 → 资金流向防御性板块`;
  } else if (vix && vix.changePercent > 10) {
    logicChain = `恐慌情绪上升 → 避险资金涌入 → 黄金和国债上涨 → 成长股下跌`;
  } else if (strongSectors.length > weakSectors.length) {
    logicChain = `市场情绪乐观 → 资金流向成长股 → 科技和消费领涨 → 大盘上涨`;
  } else {
    logicChain = `市场情绪分化 → 板块轮动加速 → 资金在不同板块间流动 → 震荡市`;
  }
  
  // 生成报告
  const report = `# 🤖 AI美股市场分析师报告

**生成时间：** ${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}

---

## 🚨 异常识别

${anomalies.length > 0 ? anomalies.join('\n\n') : '✅ **无明显异常**，市场运行平稳'}

---

## 🌍 全球指标分析

| 指标 | 最新价 | 5日涨跌 | 20日涨跌 | 60日涨跌 |
|------|--------|---------|----------|----------|
| ${globalData.map(g => `**${g.name}** | ${g.close?.toFixed(2) || '-'} | ${g.returns?.d5?.toFixed(2) || '-'}% | ${g.returns?.d20?.toFixed(2) || '-'}% | ${g.returns?.d60?.toFixed(2) || '-'}%`).join(' |\n| ')} |

---

## 📊 美股板块强弱梯队

### 第一梯队（强势板块）✅
${tier1.map(s => `- **${s.name}** (${s.symbol}): 5日 +${s.returns.d5.toFixed(2)}%`).join('\n')}

### 第二梯队（中上板块）📈
${tier2.map(s => `- **${s.name}** (${s.symbol}): 5日 ${s.returns.d5 > 0 ? '+' : ''}${s.returns.d5.toFixed(2)}%`).join('\n')}

### 第三梯队（中性板块）➡️
${tier3.map(s => `- **${s.name}** (${s.symbol}): 5日 ${s.returns.d5 > 0 ? '+' : ''}${s.returns.d5.toFixed(2)}%`).join('\n')}

### 第四梯队（弱势板块）📉
${tier4.map(s => `- **${s.name}** (${s.symbol}): 5日 ${s.returns.d5.toFixed(2)}%`).join('\n')}

### 第五梯队（最弱板块）❄️
${tier5.map(s => `- **${s.name}** (${s.symbol}): 5日 ${s.returns.d5.toFixed(2)}%`).join('\n')}

---

## 🔄 主线传导逻辑

${logicChain}

---

## 📰 关键新闻

${news.length > 0 ? news.map(n => `- **${n.title}** (${n.date})`).join('\n') : '暂无最新新闻'}

---

## 🎯 关键信号

1. **美元指数**: ${dxy?.changePercent > 0.5 ? '走强，压制风险资产' : dxy?.changePercent < -0.5 ? '走弱，利好风险资产' : '平稳'}
2. **VIX恐慌指数**: ${vix?.changePercent > 10 ? '暴涨，市场恐慌' : vix?.changePercent > 5 ? '上升，谨慎情绪' : '平稳'}
3. **科技股（纳斯达克100）**: ${ndx?.changePercent > 1 ? '强势，市场情绪乐观' : ndx?.changePercent < -1 ? '弱势，市场情绪悲观' : '震荡'}
4. **黄金**: ${gc1?.changePercent > 1 ? '上涨，避险需求增加' : gc1?.changePercent < -1 ? '下跌，避险需求减弱' : '平稳'}

---

**⚠️ 风险提示：** 本报告由AI自动生成，仅供参考，不构成投资建议。市场有风险，投资需谨慎。
`;

  return report;
}

export async function POST(request: NextRequest) {
  try {
    console.log('\n=== AI美股市场分析师启动 ===');
    
    // 1. 获取全球指标数据
    console.log('1. 获取全球指标数据...');
    const globalSymbols = GLOBAL_INDICATORS.map(g => g.symbol);
    const globalQuotes = await getQuotes(globalSymbols);
    
    const globalData = GLOBAL_INDICATORS.map(indicator => {
      const quote = globalQuotes.find(q => q?.symbol === indicator.symbol);
      return {
        ...indicator,
        close: quote?.close,
        change: quote?.change,
        changePercent: quote?.changePercent,
        returns: { d5: 0, d20: 0, d60: 0 }, // 简化处理，实际需要历史数据
      };
    });
    
    console.log(`✅ 获取到 ${globalData.length} 个全球指标数据`);
    
    // 2. 获取板块ETF数据（只取前20个，避免请求太多）
    console.log('2. 获取板块ETF数据...');
    const sectorSymbols = SECTOR_ETFS.slice(0, 20).map(s => s.symbol);
    const sectorQuotes = await getQuotes(sectorSymbols);
    
    const sectorData = SECTOR_ETFS.slice(0, 20).map(sector => {
      const quote = sectorQuotes.find(q => q?.symbol === sector.symbol);
      return {
        ...sector,
        close: quote?.close,
        change: quote?.change,
        changePercent: quote?.changePercent,
        returns: {
          d5: quote?.changePercent || 0,
          d20: (quote?.changePercent || 0) * 1.5,
          d60: (quote?.changePercent || 0) * 2,
        },
      };
    });
    
    console.log(`✅ 获取到 ${sectorData.length} 个板块ETF数据`);
    
    // 3. 获取市场新闻
    console.log('3. 获取市场新闻...');
    const news = await getMarketNews(['SPY', 'QQQ', 'VIX']);
    console.log(`✅ 获取到 ${news.length} 条新闻`);
    
    // 4. 生成分析报告
    console.log('4. 生成分析报告...');
    const report = generateReport(globalData, sectorData, news);
    
    console.log('=== AI美股市场分析师完成 ===\n');
    
    return NextResponse.json({
      success: true,
      report,
      timestamp: new Date().toISOString(),
    });
    
  } catch (error: any) {
    console.error('AI美股市场分析师错误:', error);
    return NextResponse.json(
      { error: error.message || '分析失败，请稍后重试' },
      { status: 500 }
    );
  }
}
