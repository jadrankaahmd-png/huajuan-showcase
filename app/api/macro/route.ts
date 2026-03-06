import { NextResponse } from 'next/server';

// 强制动态渲染（Next.js 16要求）
export const dynamic = 'force-dynamic';

// 设置缓存控制：5分钟
export const fetchCache = 'force-no-store';
export const revalidate = 300; // 5分钟

interface MacroData {
  name: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'stable';
  lastUpdate: string;
  source: string;
  real: boolean;
}

export async function GET() {
  const now = new Date().toLocaleTimeString('zh-CN');
  const macroResults: MacroData[] = [];
  const errors: string[] = [];

  // 1. VIX恐慌指数（yfinance API）
  try {
    const vixResponse = await fetch('https://query1.finance.yahoo.com/v8/finance/chart/%5EVIX?interval=1d&range=1d', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      }
    });
    
    if (vixResponse.ok) {
      const vixData = await vixResponse.json();
      const vixQuote = vixData.chart?.result?.[0]?.meta;
      if (vixQuote?.regularMarketPrice) {
        macroResults.push({
          name: 'VIX恐慌指数',
          value: vixQuote.regularMarketPrice.toFixed(2),
          change: '+0.0',
          trend: 'stable',
          lastUpdate: now,
          source: 'yfinance API',
          real: true
        });
      }
    }
  } catch (err) {
    errors.push(`VIX获取失败: ${err}`);
  }

  // 2. 美元指数（yfinance API）
  try {
    const dxyResponse = await fetch('https://query1.finance.yahoo.com/v8/finance/chart/DX-Y.NYB?interval=1d&range=1d', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      }
    });
    
    if (dxyResponse.ok) {
      const dxyData = await dxyResponse.json();
      const dxyQuote = dxyData.chart?.result?.[0]?.meta;
      if (dxyQuote?.regularMarketPrice) {
        macroResults.push({
          name: '美元指数',
          value: dxyQuote.regularMarketPrice.toFixed(2),
          change: '+0.0',
          trend: 'stable',
          lastUpdate: now,
          source: 'yfinance API',
          real: true
        });
      }
    }
  } catch (err) {
    errors.push(`美元指数获取失败: ${err}`);
  }

  // 3. 美联储利率（FRED API）
  try {
    const FRED_API_KEY = process.env.FRED_API_KEY || 'af7508267bd3d2d7820438698f28b3ec';
    const fredResponse = await fetch(
      `https://api.stlouisfed.org/fred/series/observations?series_id=DFF&api_key=${FRED_API_KEY}&file_type=json&limit=1&sort_order=desc`
    );
    
    if (fredResponse.ok) {
      const fredData = await fredResponse.json();
      const rate = fredData.observations?.[0]?.value;
      if (rate) {
        macroResults.push({
          name: '美联储利率',
          value: `${rate}%`,
          change: '0%',
          trend: 'stable',
          lastUpdate: now,
          source: 'FRED API',
          real: true
        });
      }
    }
  } catch (err) {
    errors.push(`美联储利率获取失败: ${err}`);
  }

  // 4. 美国CPI（FRED API）
  try {
    const FRED_API_KEY = process.env.FRED_API_KEY || 'af7508267bd3d2d7820438698f28b3ec';
    const cpiResponse = await fetch(
      `https://api.stlouisfed.org/fred/series/observations?series_id=CPIAUCSL&api_key=${FRED_API_KEY}&file_type=json&limit=2&sort_order=desc`
    );
    
    if (cpiResponse.ok) {
      const cpiData = await cpiResponse.json();
      const currentCPI = cpiData.observations?.[0]?.value;
      const previousCPI = cpiData.observations?.[1]?.value;
      if (currentCPI && previousCPI) {
        const cpiChange = ((currentCPI - previousCPI) / previousCPI * 100).toFixed(2);
        macroResults.push({
          name: '美国CPI',
          value: `${currentCPI}`,
          change: `+${cpiChange}%`,
          trend: parseFloat(cpiChange) > 0 ? 'up' : 'down',
          lastUpdate: now,
          source: 'FRED API',
          real: true
        });
      }
    }
  } catch (err) {
    errors.push(`CPI获取失败: ${err}`);
  }

  // 5. 美国原油库存（EIA API）
  // 使用正确的series：W_EPC0_SAX_YCUOK_MBBL（俄克拉荷马州库欣原油库存）
  try {
    const EIA_API_KEY = process.env.EIA_API_KEY || 'vFGhPvNPdmfdJ7YKMx1BgJ1Oz9FS82dIscKBB6G8';
    
    // EIA API v2正确格式
    // endpoint: /v2/petroleum/stoc/wstk/data/
    // series: W_EPC0_SAX_YCUOK_MBBL（Cushing, OK Crude Oil Ending Stocks）
    const eiaResponse = await fetch(
      `https://api.eia.gov/v2/petroleum/stoc/wstk/data/?api_key=${EIA_API_KEY}&frequency=weekly&data[0]=value&facets[series][]=W_EPC0_SAX_YCUOK_MBBL&sort[0][column]=period&sort[0][direction]=desc&length=1`,
      {
        headers: {
          'Accept': 'application/json'
        }
      }
    );
    
    if (eiaResponse.ok) {
      const eiaData = await eiaResponse.json();
      
      // EIA API v2返回格式：{ response: { data: [...] } }
      // data数组中每个对象包含：period, value, series, etc.
      const data = eiaData.response?.data;
      
      if (Array.isArray(data) && data.length > 0) {
        const crudeStock = data[0].value;
        
        if (crudeStock && parseFloat(crudeStock) > 0) {
          // 原油库存单位：千桶（Thousand Barrels）
          // 转换为百万桶（Million Barrels）
          const stockInMillion = (parseFloat(crudeStock) / 1000).toFixed(1);
          
          macroResults.push({
            name: '美国原油库存',
            value: `${stockInMillion}M桶`,
            change: '-0.0M',
            trend: 'stable',
            lastUpdate: now,
            source: 'EIA API (库欣原油库存)',
            real: true
          });
        } else {
          macroResults.push({
            name: '美国原油库存',
            value: '暂时无法获取',
            change: '-',
            trend: 'stable',
            lastUpdate: now,
            source: 'EIA API',
            real: false
          });
        }
      } else {
        macroResults.push({
          name: '美国原油库存',
          value: '暂时无法获取',
          change: '-',
          trend: 'stable',
          lastUpdate: now,
          source: 'EIA API',
          real: false
        });
      }
    } else {
      errors.push(`EIA API调用失败: ${eiaResponse.status}`);
      macroResults.push({
        name: '美国原油库存',
        value: '暂时无法获取',
        change: '-',
        trend: 'stable',
        lastUpdate: now,
        source: 'EIA API',
        real: false
      });
    }
  } catch (err) {
    errors.push(`原油库存获取失败: ${err}`);
    macroResults.push({
      name: '美国原油库存',
      value: '暂时无法获取',
      change: '-',
      trend: 'stable',
      lastUpdate: now,
      source: 'EIA API',
      real: false
    });
  }

  // 如果所有数据都获取失败，返回错误
  if (macroResults.length === 0) {
    return NextResponse.json({
      success: false,
      error: '所有宏观数据API调用失败',
      details: errors
    }, { status: 500 });
  }

  // 返回成功数据
  const response = NextResponse.json({
    success: true,
    data: macroResults,
    errors: errors.length > 0 ? errors : undefined,
    lastUpdate: now
  });
  
  // 设置缓存控制：5分钟
  response.headers.set('Cache-Control', 'public, max-age=300, s-maxage=300, stale-while-revalidate=60');
  
  return response;
}
