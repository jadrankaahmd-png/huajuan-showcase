import { NextResponse } from 'next/server';

// 强制动态渲染（Next.js 16要求）
export const dynamic = 'force-dynamic';

// 设置缓存控制：10分钟
export const fetchCache = 'force-no-store';
export const revalidate = 600;

interface SatelliteData {
  location: string;
  firePoints: number;
  intensity: string;
  lastUpdate: string;
  available: boolean;
}

export async function GET() {
  const now = new Date().toLocaleTimeString('zh-CN');
  const results: SatelliteData[] = [];
  const errors: string[] = [];

  // 使用NASA FIRMS API获取火点数据
  // API文档：https://firms.modaps.eosdis.nasa.gov/api/
  // 完全免费，但需要API Key
  
  const FIRMS_API_KEY = process.env.FIRMS_API_KEY;

  if (!FIRMS_API_KEY) {
    // 没有API Key，返回占位数据
    return NextResponse.json({
      success: false,
      error: 'NASA FIRMS API Key未配置',
      data: [
        {
          location: '伊朗西部',
          firePoints: 0,
          intensity: '暂时无法获取',
          lastUpdate: now,
          available: false
        },
        {
          location: '伊拉克边境',
          firePoints: 0,
          intensity: '暂时无法获取',
          lastUpdate: now,
          available: false
        }
      ],
      note: '免费注册获取API Key：https://firms.modaps.eosdis.nasa.gov/api/'
    });
  }

  try {
    // NASA FIRMS API正确格式：
    // https://firms.modaps.eosdis.nasa.gov/api/area/csv/{API_KEY}/{SOURCE}/{AREA}/{DAYS}
    // SOURCE: VIIRS_SNPP_NRT (Suomi NPP VIIRS Near Real-Time)
    // AREA: 世界区域代码（中东 = world）
    // DAYS: 1 (过去24小时)
    
    // 先尝试获取全球数据，然后过滤中东地区
    const response = await fetch(
      `https://firms.modaps.eosdis.nasa.gov/api/area/csv/${FIRMS_API_KEY}/VIIRS_SNPP_NRT/world/1`,
      {
        headers: {
          'Accept': 'text/csv'
        }
      }
    );

    if (response.ok) {
      const csvText = await response.text();
      
      // 解析CSV数据
      const lines = csvText.trim().split('\n');
      if (lines.length > 1) {
        // 第一行是表头
        const headers = lines[0].split(',');
        const latIndex = headers.indexOf('latitude');
        const lonIndex = headers.indexOf('longitude');
        const frpIndex = headers.indexOf('frp'); // Fire Radiative Power
        
        if (latIndex !== -1 && lonIndex !== -1 && frpIndex !== -1) {
          // 解析数据行
          const fires: { lat: number; lon: number; frp: number }[] = [];
          
          for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',');
            const lat = parseFloat(values[latIndex]);
            const lon = parseFloat(values[lonIndex]);
            const frp = parseFloat(values[frpIndex]);
            
            if (!isNaN(lat) && !isNaN(lon)) {
              fires.push({ lat, lon, frp });
            }
          }
          
          // 按区域分组火点
          // 伊朗西部：30-40N, 45-65E
          const iranFires = fires.filter(f => 
            f.lat >= 30 && f.lat <= 40 && f.lon >= 45 && f.lon <= 65
          );
          
          // 伊拉克边境：30-37N, 38-50E
          const iraqBorderFires = fires.filter(f => 
            f.lat >= 30 && f.lat <= 37 && f.lon >= 38 && f.lon <= 50
          );
          
          // 计算平均强度
          const getIntensity = (fireList: typeof fires) => {
            if (fireList.length === 0) return '无';
            const avgFRP = fireList.reduce((sum, f) => sum + f.frp, 0) / fireList.length;
            if (avgFRP > 50) return '高';
            if (avgFRP > 20) return '中';
            return '低';
          };
          
          results.push({
            location: '伊朗西部',
            firePoints: iranFires.length,
            intensity: getIntensity(iranFires),
            lastUpdate: now,
            available: true
          });
          
          results.push({
            location: '伊拉克边境',
            firePoints: iraqBorderFires.length,
            intensity: getIntensity(iraqBorderFires),
            lastUpdate: now,
            available: true
          });
        } else {
          errors.push('CSV格式解析失败：找不到必要的列');
        }
      } else {
        // 没有检测到火点
        results.push({
          location: '伊朗西部',
          firePoints: 0,
          intensity: '无',
          lastUpdate: now,
          available: true
        });
        
        results.push({
          location: '伊拉克边境',
          firePoints: 0,
          intensity: '无',
          lastUpdate: now,
          available: true
        });
      }
    } else {
      errors.push(`NASA FIRMS API调用失败: ${response.status} ${response.statusText}`);
      
      // 尝试读取错误信息
      try {
        const errorText = await response.text();
        errors.push(`错误详情: ${errorText.substring(0, 200)}`);
      } catch (e) {
        // 忽略
      }
      
      return NextResponse.json({
        success: false,
        error: 'NASA FIRMS API调用失败',
        details: errors,
        data: [
          {
            location: '伊朗西部',
            firePoints: 0,
            intensity: '暂时无法获取',
            lastUpdate: now,
            available: false
          },
          {
            location: '伊拉克边境',
            firePoints: 0,
            intensity: '暂时无法获取',
            lastUpdate: now,
            available: false
          }
        ]
      }, { status: 500 });
    }

    // 返回成功数据
    const response_data = NextResponse.json({
      success: true,
      data: results,
      errors: errors.length > 0 ? errors : undefined,
      lastUpdate: now,
      source: 'NASA FIRMS API (VIIRS_SNPP_NRT卫星)'
    });
    
    // 设置缓存控制：10分钟
    response_data.headers.set('Cache-Control', 'public, max-age=600, s-maxage=600');
    
    return response_data;

  } catch (err) {
    console.error('卫星火点API错误:', err);
    return NextResponse.json({
      success: false,
      error: '卫星火点API调用失败',
      details: [String(err)],
      data: [
        {
          location: '伊朗西部',
          firePoints: 0,
          intensity: '暂时无法获取',
          lastUpdate: now,
          available: false
        },
        {
          location: '伊拉克边境',
          firePoints: 0,
          intensity: '暂时无法获取',
          lastUpdate: now,
          available: false
        }
      ]
    }, { status: 500 });
  }
}
