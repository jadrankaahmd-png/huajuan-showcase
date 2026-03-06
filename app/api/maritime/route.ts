import { NextResponse } from 'next/server';

// 强制动态渲染（Next.js 16要求）
export const dynamic = 'force-dynamic';

interface MaritimeData {
  route: string;
  vessels: number;
  status: string;
  lastUpdate: string;
  available: boolean;
}

export async function GET() {
  const now = new Date().toLocaleTimeString('zh-CN');
  const results: MaritimeData[] = [];
  const errors: string[] = [];

  // 使用aisstream.io API获取实时船舶数据（WebSocket API）
  // API文档：https://aisstream.io/documentation
  // 注意：aisstream.io是WebSocket API，这里使用HTTP API作为fallback
  
  // 也可以使用AISHub（https://www.aishub.net/）
  // 或者Marinesia（https://marinesia.com/）
  
  // 由于aisstream.io是WebSocket API，这里暂时返回占位数据
  // TODO: 未来可以集成WebSocket实现实时船舶监控
  
  // 临时方案：使用公开的AIS数据
  // 但由于CORS限制，这里先返回"暂时无法获取"
  // 实际部署时，可以在服务器端通过WebSocket连接获取数据
  
  try {
    // 尝试使用免费的Marinesia API
    // 注意：Marinesia可能也需要API Key
    
    const MARINESIA_API_KEY = process.env.MARINESIA_API_KEY;
    
    if (!MARINESIA_API_KEY) {
      // 没有API Key，返回占位数据
      return NextResponse.json({
        success: false,
        error: 'Marinesia API Key未配置',
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
        note: '免费注册获取API Key：https://marinesia.com/',
        alternative: '也可以使用aisstream.io WebSocket API（https://aisstream.io/）'
      });
    }

    // 如果有API Key，调用Marinesia API
    // 这里暂时返回占位数据，实际实现需要：
    // 1. 注册Marinesia账号获取API Key
    // 2. 调用API获取波斯湾地区的船舶数据
    // 3. 分析船舶密度和通行状态
    
    // 临时返回占位数据
    return NextResponse.json({
      success: true,
      data: [
        {
          route: '霍尔木兹海峡',
          vessels: 0,
          status: '暂时无法获取（需要配置API Key）',
          lastUpdate: now,
          available: false
        },
        {
          route: '波斯湾 → 阿曼湾',
          vessels: 0,
          status: '暂时无法获取（需要配置API Key）',
          lastUpdate: now,
          available: false
        }
      ],
      lastUpdate: now,
      source: 'Marinesia API',
      note: '实际部署需要配置Marinesia API Key'
    });

  } catch (err) {
    console.error('海运监控API错误:', err);
    return NextResponse.json({
      success: false,
      error: '海运监控API调用失败',
      details: [String(err)],
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
      ]
    }, { status: 500 });
  }
}
