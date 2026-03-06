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
  
  // 临时方案：先返回占位数据，避免超时
  // TODO: 后续接入 aisstream.io WebSocket API
  const response = NextResponse.json({
    success: false,
    error: '海运监控API暂时不可用',
    data: [
      {
        route: '霍尔木兹海峡',
        vessels: 0,
        status: '暂时无法获取',
        lastUpdate: now,
        available: false
      },
      {
        route: '波斯湾 → 阿曼湾',
        vessels: 0,
        status: '暂时无法获取',
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
        note: '免费且稳定，推荐使用'
      },
      aishub: {
        name: 'AISHub',
        url: 'https://www.aishub.net/',
        cost: '免费（需分享AIS数据流）',
        features: 'AIS数据交换平台'
      }
    },
    lastUpdate: now,
    source: '海运监控API暂时不可用'
  });
  
  // 设置缓存控制：10分钟
  response.headers.set('Cache-Control', 'public, max-age=600, s-maxage=600');
  
  return response;
}
