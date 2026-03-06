import { NextResponse } from 'next/server';

// 强制动态渲染（Next.js 16要求）
export const dynamic = 'force-dynamic';

// 设置缓存控制：10分钟
export const fetchCache = 'force-no-store';
export const revalidate = 600;

interface MaritimeData {
  route: string;
  vessels: number;
  status: string;
  lastUpdate: string;
  available: boolean;
}

export async function GET() {
  const now = new Date().toLocaleTimeString('zh-CN');
  const AISSTREAM_API_KEY = process.env.AISSTREAM_API_KEY;
  
  // 检查是否配置了 aisstream.io API Key
  if (!AISSTREAM_API_KEY) {
    return NextResponse.json({
      success: false,
      error: 'AISSTREAM_API_KEY 未配置',
      data: [
        {
          route: '霍尔木兹海峡',
          vessels: 0,
          status: '需要配置API Key',
          lastUpdate: now,
          available: false
        },
        {
          route: '波斯湾 → 阿曼湾',
          vessels: 0,
          status: '需要配置API Key',
          lastUpdate: now,
          available: false
        }
      ],
      registration: {
        aisstream: {
          name: 'aisstream.io',
          url: 'https://aisstream.io/',
          cost: '免费',
          features: '全球AIS数据，WebSocket API',
          steps: [
            '1. 访问 https://aisstream.io/',
            '2. 注册免费账号',
            '3. 获取API Key',
            '4. 在Vercel环境变量中添加 AISSTREAM_API_KEY'
          ]
        }
      },
      lastUpdate: now,
      source: 'AISSTREAM_API_KEY 未配置'
    });
  }

  // 返回 WebSocket 连接信息（前端直接连接）
  // 因为 Vercel Serverless Functions 不支持 WebSocket 持久连接
  const response = NextResponse.json({
    success: true,
    config: {
      apiKey: AISSTREAM_API_KEY,
      websocketUrl: 'wss://stream.aisstream.io/v0/stream',
      regions: [
        {
          name: '霍尔木兹海峡',
          boundingBox: [
            [25.0, 56.0],  // 西南角（纬度，经度）
            [27.0, 58.0]   // 东北角
          ]
        },
        {
          name: '波斯湾 → 阿曼湾',
          boundingBox: [
            [22.0, 58.0],  // 西南角
            [26.0, 62.0]   // 东北角
          ]
        }
      ],
      shipTypes: ['Tanker', 'Cargo', 'Passenger', 'Fishing'],
      updateInterval: 10000  // 10秒
    },
    data: [
      {
        route: '霍尔木兹海峡',
        vessels: 0,
        status: '前端WebSocket连接中...',
        lastUpdate: now,
        available: true
      },
      {
        route: '波斯湾 → 阿曼湾',
        vessels: 0,
        status: '前端WebSocket连接中...',
        lastUpdate: now,
        available: true
      }
    ],
    lastUpdate: now,
    source: 'aisstream.io WebSocket API（前端直接连接）',
    note: 'aisstream.io提供免费WebSocket API，前端可以直接连接获取实时船舶数据'
  });
  
  response.headers.set('Cache-Control', 'public, max-age=600, s-maxage=600');
  return response;
}
