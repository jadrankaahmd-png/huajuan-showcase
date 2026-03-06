import { NextResponse } from 'next/server';

// 强制动态渲染（Next.js 16要求）
export const dynamic = 'force-dynamic';

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
    // 获取中东地区的火点数据
    // 使用MODIS或VIIRS卫星数据
    // API endpoint: https://firms.modaps.eosdis.nasa.gov/api/area/{API_KEY}/{SOURCE}/{AREA}/{DAY_RANGE}
    // SOURCE: MODIS (MCD14DL) 或 VIIRS (VIIRS_NOAA20_NRT, VIIRS_SNPP_NRT)
    // AREA: 可以指定区域坐标（bounding box）
    
    // 中东地区的大致边界框（min_lon, min_lat, max_lon, max_lat）
    // 伊朗西部和伊拉克边境：35, 30, 50, 40
    
    const response = await fetch(
      `https://firms.modaps.eosdis.nasa.gov/api/area/${FIRMS_API_KEY}/VIIRS_NOAA20_NRT/35,30,50,40/1`,
      {
        headers: {
          'Accept': 'application/json'
        }
      }
    );

    if (response.ok) {
      const data = await response.json();
      
      // FIRMS API返回格式：数组对象，每个对象代表一个火点
      // 包含字段：latitude, longitude, bright_ti4, bright_ti5, frp, confidence, daynight等
      
      if (Array.isArray(data) && data.length > 0) {
        // 按区域分组火点
        const iranFires = data.filter((f: any) => 
          parseFloat(f.latitude) >= 30 && parseFloat(f.latitude) <= 40 &&
          parseFloat(f.longitude) >= 45 && parseFloat(f.longitude) <= 65
        );
        
        const iraqBorderFires = data.filter((f: any) => 
          parseFloat(f.latitude) >= 30 && parseFloat(f.latitude) <= 37 &&
          parseFloat(f.longitude) >= 38 && parseFloat(f.longitude) <= 50
        );
        
        // 计算平均强度
        const getIntensity = (fires: any[]) => {
          if (fires.length === 0) return '无';
          const avgFRP = fires.reduce((sum, f) => sum + parseFloat(f.frp || 0), 0) / fires.length;
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
      errors.push(`NASA FIRMS API调用失败: ${response.status}`);
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
    return NextResponse.json({
      success: true,
      data: results,
      errors: errors.length > 0 ? errors : undefined,
      lastUpdate: now,
      source: 'NASA FIRMS API (VIIRS卫星)'
    });

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
