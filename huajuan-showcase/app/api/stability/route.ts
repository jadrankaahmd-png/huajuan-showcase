import { NextResponse } from 'next/server';

// 强制动态渲染（Next.js 16要求）
export const dynamic = 'force-dynamic';

// 设置缓存控制：1小时
export const fetchCache = 'force-no-store';
export const revalidate = 3600;

interface StabilityIndex {
  country: string;
  index: number;
  trend: 'up' | 'down' | 'stable';
  lastUpdate: string;
  available: boolean;
}

export async function GET() {
  const now = new Date().toLocaleTimeString('zh-CN');
  const results: StabilityIndex[] = [];
  const errors: string[] = [];

  // 使用World Bank API获取政治稳定性指数
  // API文档：https://data.worldbank.org/indicator/PV.EST
  // 指标代码：PV.EST（Political Stability and Absence of Violence/Terrorism: Estimate）
  // 范围：-2.5（最不稳定）到 2.5（最稳定）
  
  const countries = [
    { code: 'IR', name: '伊朗' },
    { code: 'IL', name: '以色列' },
    { code: 'SA', name: '沙特阿拉伯' }
  ];

  try {
    // World Bank API v2 - 获取最新的政治稳定性数据
    // 正确URL格式：https://api.worldbank.org/v2/country/{country}/indicator/PV.EST?format=json
    // 注意：World Bank数据通常有1-2年延迟，最新数据可能是2023年的
    
    for (const country of countries) {
      try {
        const response = await fetch(
          `https://api.worldbank.org/v2/country/${country.code}/indicator/PV.EST?format=json&date=2020:2024&per_page=5`,
          {
            headers: {
              'Accept': 'application/json'
            },
            cache: 'no-store'
          }
        );

        if (response.ok) {
          const data = await response.json();
          // World Bank API返回格式：[metadata, [data_objects]]
          const observations = data[1];
          
          if (observations && observations.length > 0) {
            // 找到最新的非空值
            const latestData = observations.find((obs: any) => obs.value !== null);
            
            if (latestData) {
              // PV.EST已经是-2.5到2.5的范围，直接使用
              const stabilityIndex = latestData.value;
              
              results.push({
                country: country.name,
                index: parseFloat(stabilityIndex.toFixed(2)),
                trend: 'stable', // World Bank数据更新慢，趋势判断需要历史数据
                lastUpdate: now,
                available: true
              });
            } else {
              // 数据不可用
              results.push({
                country: country.name,
                index: 0,
                trend: 'stable',
                lastUpdate: now,
                available: false
              });
            }
          } else {
            // 数据不可用
            results.push({
              country: country.name,
              index: 0,
              trend: 'stable',
              lastUpdate: now,
              available: false
            });
          }
        } else {
          // API调用失败
          errors.push(`${country.name}API调用失败: ${response.status}`);
          results.push({
            country: country.name,
            index: 0,
            trend: 'stable',
            lastUpdate: now,
            available: false
          });
        }
      } catch (err) {
        errors.push(`${country.name}数据获取失败: ${err}`);
        results.push({
          country: country.name,
          index: 0,
          trend: 'stable',
          lastUpdate: now,
          available: false
        });
      }
    }

    // 如果所有数据都获取失败，返回错误
    const availableCount = results.filter(r => r.available).length;
    if (availableCount === 0) {
      return NextResponse.json({
        success: false,
        error: '所有国家稳定性指数API调用失败',
        details: errors,
        data: results // 仍然返回占位数据
      }, { status: 500 });
    }

    // 返回成功数据
    const response_data = NextResponse.json({
      success: true,
      data: results,
      errors: errors.length > 0 ? errors : undefined,
      lastUpdate: now,
      source: 'World Bank API (Political Stability Index PV.EST)',
      note: '数据基于世界银行政治稳定性指数（范围：-2.5到2.5）'
    });
    
    // 设置缓存控制：1小时
    response_data.headers.set('Cache-Control', 'public, max-age=3600, s-maxage=3600');
    
    return response_data;

  } catch (err) {
    console.error('稳定性指数API错误:', err);
    return NextResponse.json({
      success: false,
      error: '稳定性指数API调用失败',
      details: [String(err)],
      data: countries.map(c => ({
        country: c.name,
        index: 0,
        trend: 'stable' as const,
        lastUpdate: now,
        available: false
      }))
    }, { status: 500 });
  }
}
