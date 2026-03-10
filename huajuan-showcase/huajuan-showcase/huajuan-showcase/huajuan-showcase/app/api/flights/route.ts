import { NextResponse } from 'next/server';

// 强制动态渲染（Next.js 16要求）
export const dynamic = 'force-dynamic';

interface FlightData {
  route: string;
  status: string;
  impact: string;
  lastUpdate: string;
  available: boolean;
}

export async function GET() {
  const now = new Date().toLocaleTimeString('zh-CN');
  const results: FlightData[] = [];
  const errors: string[] = [];

  // 使用Aviationstack API获取实时航班数据
  // API文档：https://aviationstack.com/documentation
  // 免费计划：100 requests/month
  
  // 注意：需要API Key，如果没有配置，则显示"暂时无法获取"
  const AVIATIONSTACK_API_KEY = process.env.AVIATIONSTACK_API_KEY;

  if (!AVIATIONSTACK_API_KEY) {
    // 没有API Key，返回占位数据
    return NextResponse.json({
      success: false,
      error: 'Aviationstack API Key未配置',
      data: [
        {
          route: '德黑兰 → 迪拜',
          status: '暂时无法获取',
          impact: '需要Aviationstack API Key',
          lastUpdate: now,
          available: false
        },
        {
          route: '特拉维夫 → 欧洲航线',
          status: '暂时无法获取',
          impact: '需要Aviationstack API Key',
          lastUpdate: now,
          available: false
        }
      ],
      note: '免费注册获取API Key：https://aviationstack.com/'
    });
  }

  try {
    // 获取伊朗周边主要机场的航班数据
    // 德黑兰机场（IKA）、迪拜机场（DXB）、特拉维夫机场（TLV）
    
    const airports = [
      { code: 'IKA', name: '德黑兰伊玛目霍梅尼国际机场', route: '德黑兰 → 国际航线' },
      { code: 'TLV', name: '特拉维夫本古里安机场', route: '特拉维夫 → 欧洲航线' }
    ];

    for (const airport of airports) {
      try {
        const response = await fetch(
          `http://api.aviationstack.com/v1/flights?access_key=${AVIATIONSTACK_API_KEY}&dep_iata=${airport.code}`,
          {
            headers: {
              'Accept': 'application/json'
            }
          }
        );

        if (response.ok) {
          const data = await response.json();
          const flights = data.data || [];
          
          if (flights.length > 0) {
            // 分析航班状态
            const activeFlights = flights.filter((f: any) => f.flight_status === 'active');
            const cancelledFlights = flights.filter((f: any) => f.flight_status === 'cancelled');
            const delayedFlights = flights.filter((f: any) => f.flight_status === 'delayed');
            
            let status = '正常';
            let impact = '无影响';
            
            if (cancelledFlights.length > 0) {
              status = `取消${cancelledFlights.length}班`;
              impact = '航线受影响';
            } else if (delayedFlights.length > 0) {
              status = `延误${delayedFlights.length}班`;
              impact = '轻微延误';
            }
            
            results.push({
              route: airport.route,
              status: `${status}（总计${flights.length}班航班）`,
              impact: impact,
              lastUpdate: now,
              available: true
            });
          } else {
            // 当前没有航班数据
            results.push({
              route: airport.route,
              status: '暂无航班数据',
              impact: '可能已停飞',
              lastUpdate: now,
              available: true
            });
          }
        } else {
          errors.push(`${airport.name}API调用失败: ${response.status}`);
          results.push({
            route: airport.route,
            status: '暂时无法获取',
            impact: 'API调用失败',
            lastUpdate: now,
            available: false
          });
        }
      } catch (err) {
        errors.push(`${airport.name}数据获取失败: ${err}`);
        results.push({
          route: airport.route,
          status: '暂时无法获取',
          impact: '数据获取失败',
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
        error: '所有航班数据API调用失败',
        details: errors,
        data: results
      }, { status: 500 });
    }

    // 返回成功数据
    return NextResponse.json({
      success: true,
      data: results,
      errors: errors.length > 0 ? errors : undefined,
      lastUpdate: now,
      source: 'Aviationstack API'
    });

  } catch (err) {
    console.error('航班监控API错误:', err);
    return NextResponse.json({
      success: false,
      error: '航班监控API调用失败',
      details: [String(err)],
      data: [
        {
          route: '德黑兰 → 迪拜',
          status: '暂时无法获取',
          impact: 'API错误',
          lastUpdate: now,
          available: false
        },
        {
          route: '特拉维夫 → 欧洲航线',
          status: '暂时无法获取',
          impact: 'API错误',
          lastUpdate: now,
          available: false
        }
      ]
    }, { status: 500 });
  }
}
