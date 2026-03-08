import { NextRequest, NextResponse } from 'next/server';

// QVeris API 配置
const QVERIS_API_KEY = process.env.QVERIS_API_KEY || 'sk-YFaMAuNb1r1qBE4_0Pr3wZYtvzqHbKL8Ths6SvWOiRU';
const QVERIS_SEARCH_URL = 'https://qveris.ai/api/v1/search';
const QVERIS_EXECUTE_URL = 'https://qveris.ai/api/v1/execute';

// 频率限制（同一IP每分钟最多5次）
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const limit = rateLimitMap.get(ip);
  
  if (!limit || now > limit.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + 60000 });
    return true;
  }
  
  if (limit.count >= 5) {
    return false;
  }
  
  limit.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // 获取客户端 IP
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown';
    
    // 检查频率限制
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: '请求过于频繁，请稍后再试（每分钟最多5次）' },
        { status: 429 }
      );
    }
    
    const body = await request.json();
    const { symbol, strategy, period } = body;
    
    if (!symbol || !strategy || !period) {
      return NextResponse.json(
        { error: '缺少必需参数' },
        { status: 400 }
      );
    }
    
    // 1. 搜索历史价格数据工具
    const searchRes = await fetch(QVERIS_SEARCH_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${QVERIS_API_KEY}`,
      },
      body: JSON.stringify({
        query: `${symbol} historical stock price daily data`,
        limit: 5,
      }),
    });
    
    if (!searchRes.ok) {
      throw new Error('QVeris搜索API调用失败');
    }
    
    const searchData = await searchRes.json();
    
    if (!searchData.results || searchData.results.length === 0) {
      throw new Error('未找到历史价格数据工具');
    }
    
    // 2. 执行工具获取历史数据
    const toolId = searchData.results[0].tool_id;
    const searchId = searchData.search_id;
    
    // 计算日期范围
    const endDate = new Date();
    const startDate = new Date();
    const periodDays = period === '3m' ? 90 : period === '6m' ? 180 : 365;
    startDate.setDate(startDate.getDate() - periodDays);
    
    const executeRes = await fetch(QVERIS_EXECUTE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${QVERIS_API_KEY}`,
      },
      body: JSON.stringify({
        tool_id: toolId,
        search_id: searchId,
        parameters: {
          symbol: symbol.toUpperCase(),
          start_date: startDate.toISOString().split('T')[0],
          end_date: endDate.toISOString().split('T')[0],
        },
      }),
    });
    
    if (!executeRes.ok) {
      throw new Error('QVeris执行API调用失败');
    }
    
    const result = await executeRes.json();
    
    if (!result.success || !result.result || !result.result.data) {
      throw new Error(result.error_message || '获取历史数据失败');
    }
    
    // 3. 解析历史数据并计算策略
    const historicalData = parseHistoricalData(result.result.data);
    
    if (!historicalData || historicalData.length === 0) {
      throw new Error('历史数据格式错误');
    }
    
    // 4. 应用策略计算
    const backtestResult = calculateStrategy(historicalData, strategy);
    
    return NextResponse.json({
      success: true,
      data: backtestResult,
    });
    
  } catch (error: any) {
    console.error('Backtest API error:', error);
    return NextResponse.json(
      { error: error.message || '回测失败，请稍后重试' },
      { status: 500 }
    );
  }
}

// 解析历史数据
function parseHistoricalData(data: any): any[] {
  // 兼容不同的数据格式
  if (Array.isArray(data)) {
    return data;
  }
  
  if (data['Time Series (Daily)']) {
    // Alpha Vantage 格式
    const timeSeries = data['Time Series (Daily)'];
    return Object.entries(timeSeries).map(([date, values]: [string, any]) => ({
      date,
      close: parseFloat(values['4. close']),
      high: parseFloat(values['2. high']),
      low: parseFloat(values['3. low']),
      volume: parseInt(values['5. volume']),
    })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }
  
  if (data.prices) {
    // Finnhub 格式
    return data.prices.map((p: any) => ({
      date: new Date(p.t * 1000).toISOString().split('T')[0],
      close: p.c,
      high: p.h,
      low: p.l,
      volume: p.v,
    }));
  }
  
  return [];
}

// 计算策略
function calculateStrategy(data: any[], strategy: string) {
  if (data.length === 0) {
    throw new Error('数据不足');
  }
  
  // 基准：买入持有
  const benchmarkValues = data.map((d, i) => ({
    date: d.date,
    value: (d.close / data[0].close) * 100, // 初始净值100
  }));
  
  // 策略净值曲线
  let strategyValues: { date: string; value: number }[] = [];
  let trades: any[] = [];
  
  if (strategy === 'ma') {
    // 均线策略：短期均线上穿长期均线买入，下穿卖出
    const shortPeriod = 5;
    const longPeriod = 20;
    
    const shortMA = calculateMA(data, shortPeriod);
    const longMA = calculateMA(data, longPeriod);
    
    let position = 0; // 0=空仓，1=持仓
    let cash = 100; // 初始现金
    let shares = 0;
    
    for (let i = longPeriod; i < data.length; i++) {
      const prevShortMA = shortMA[i - 1];
      const prevLongMA = longMA[i - 1];
      const currShortMA = shortMA[i];
      const currLongMA = longMA[i];
      
      // 买入信号：短期均线上穿长期均线
      if (prevShortMA <= prevLongMA && currShortMA > currLongMA && position === 0) {
        shares = cash / data[i].close;
        cash = 0;
        position = 1;
        trades.push({ date: data[i].date, type: 'buy', price: data[i].close });
      }
      // 卖出信号：短期均线下穿长期均线
      else if (prevShortMA >= prevLongMA && currShortMA < currLongMA && position === 1) {
        cash = shares * data[i].close;
        shares = 0;
        position = 0;
        trades.push({ date: data[i].date, type: 'sell', price: data[i].close });
      }
      
      // 计算当前净值
      const currentValue = cash + shares * data[i].close;
      strategyValues.push({
        date: data[i].date,
        value: currentValue,
      });
    }
  } else if (strategy === 'momentum') {
    // 动量策略：价格上涨超过阈值买入，下跌超过阈值卖出
    const threshold = 0.03; // 3%
    
    let position = 0;
    let cash = 100;
    let shares = 0;
    let entryPrice = 0;
    
    for (let i = 1; i < data.length; i++) {
      const change = (data[i].close - data[i - 1].close) / data[i - 1].close;
      
      // 买入信号：单日涨幅超过3%
      if (change > threshold && position === 0) {
        shares = cash / data[i].close;
        cash = 0;
        position = 1;
        entryPrice = data[i].close;
        trades.push({ date: data[i].date, type: 'buy', price: data[i].close });
      }
      // 卖出信号：持仓后下跌超过3%
      else if (position === 1) {
        const pnl = (data[i].close - entryPrice) / entryPrice;
        if (pnl < -threshold) {
          cash = shares * data[i].close;
          shares = 0;
          position = 0;
          trades.push({ date: data[i].date, type: 'sell', price: data[i].close });
        }
      }
      
      // 计算当前净值
      const currentValue = cash + shares * data[i].close;
      strategyValues.push({
        date: data[i].date,
        value: currentValue,
      });
    }
  }
  
  // 如果策略净值曲线为空，使用基准
  if (strategyValues.length === 0) {
    strategyValues = benchmarkValues;
  }
  
  // 计算策略指标
  const finalValue = strategyValues[strategyValues.length - 1].value;
  const benchmarkFinalValue = benchmarkValues[benchmarkValues.length - 1].value;
  
  // 年化收益率
  const days = data.length;
  const years = days / 252; // 252个交易日
  const annualReturn = ((finalValue / 100) ** (1 / years) - 1) * 100;
  const benchmarkAnnualReturn = ((benchmarkFinalValue / 100) ** (1 / years) - 1) * 100;
  
  // 最大回撤
  const maxDrawdown = calculateMaxDrawdown(strategyValues);
  
  // 胜率
  const winRate = calculateWinRate(trades, data);
  
  return {
    symbol: data[0].symbol || 'UNKNOWN',
    strategy,
    period: `${days}天`,
    annualReturn: annualReturn.toFixed(2),
    benchmarkReturn: benchmarkAnnualReturn.toFixed(2),
    maxDrawdown: maxDrawdown.toFixed(2),
    winRate: winRate.toFixed(2),
    strategyValues,
    benchmarkValues,
    trades: trades.slice(-5), // 只返回最近5笔交易
  };
}

// 计算移动平均线
function calculateMA(data: any[], period: number): number[] {
  const ma: number[] = [];
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      ma.push(0);
    } else {
      const sum = data.slice(i - period + 1, i + 1).reduce((acc, d) => acc + d.close, 0);
      ma.push(sum / period);
    }
  }
  return ma;
}

// 计算最大回撤
function calculateMaxDrawdown(values: { value: number }[]): number {
  let maxDrawdown = 0;
  let peak = values[0].value;
  
  for (const v of values) {
    if (v.value > peak) {
      peak = v.value;
    }
    const drawdown = (peak - v.value) / peak * 100;
    if (drawdown > maxDrawdown) {
      maxDrawdown = drawdown;
    }
  }
  
  return maxDrawdown;
}

// 计算胜率
function calculateWinRate(trades: any[], data: any[]): number {
  if (trades.length < 2) return 0;
  
  let wins = 0;
  for (let i = 0; i < trades.length - 1; i += 2) {
    if (trades[i].type === 'buy' && trades[i + 1]?.type === 'sell') {
      if (trades[i + 1].price > trades[i].price) {
        wins++;
      }
    }
  }
  
  const totalPairs = Math.floor(trades.length / 2);
  return totalPairs > 0 ? (wins / totalPairs) * 100 : 0;
}
