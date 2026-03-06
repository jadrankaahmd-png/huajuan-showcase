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
  const results: MaritimeData[] = [];
  const errors: string[] = [];

  // 海运监控API方案：
  // 1. Marinesia API（需要API Key）- https://marinesia.com/
  // 2. aisstream.io（免费WebSocket API）- https://aisstream.io/
  // 3. AISHub（如果分享自己的AIS数据流）- https://www.aishub.net/
  
  const MARINESIA_API_KEY = process.env.MARINESIA_API_KEY;
  
  // 临时方案：先返回占位数据，避免超时
  // TODO: 后续接入 aisstream.io WebSocket API
  return NextResponse.json({
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
  
  /* 暂时注释掉 Marinesia API 调用（容易超时）
  if (!MARINESIA_API_KEY) {
    // 没有API Key，返回占位数据并提供注册指南
    return NextResponse.json({
      success: false,
      error: '海运监控API Key未配置',
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
        marinesia: {
          name: 'Marinesia API',
          url: 'https://marinesia.com/',
          cost: '免费',
          features: '船舶AIS数据，HTTP REST API',
          steps: [
            '1. 访问 https://marinesia.com/',
            '2. 注册免费账号',
            '3. 获取API Key',
            '4. 在Vercel配置环境变量：MARINESIA_API_KEY'
          ]
        },
        aisstream: {
          name: 'aisstream.io',
          url: 'https://aisstream.io/',
          cost: '免费',
          features: '全球AIS数据，WebSocket API',
          note: '需要WebSocket客户端，适合实时监控'
        },
        aishub: {
          name: 'AISHub',
          url: 'https://www.aishub.net/',
          cost: '免费（需分享AIS数据流）',
          features: 'AIS数据交换平台'
        }
      }
    });
  }

  try {
    // 如果有API Key，尝试调用Marinesia API
    // Marinesia API文档：https://marinesia.com/documentation
    // 注意：Marinesia可能使用不同的API endpoint格式
    
    // 尝试调用API（这里需要根据实际API文档调整）
    // 临时方案：返回提示信息
    
    const response = await fetch(
      `https://api.marinesia.com/v1/vessels?area=persian_gulf&key=${MARINESIA_API_KEY}`,
      {
        headers: {
          'Accept': 'application/json'
        },
        cache: 'no-store'
      }
    );

    if (response.ok) {
      const data = await response.json();
      
      // 根据API返回格式解析数据
      // 这里需要根据实际API文档调整
      
      if (data.vessels && Array.isArray(data.vessels)) {
        // 统计霍尔木兹海峡船舶
        const hormuzVessels = data.vessels.filter((v: any) => {
          // 霍尔木兹海峡大致范围：24-27N, 56-58E
          const lat = parseFloat(v.latitude);
          const lon = parseFloat(v.longitude);
          return lat >= 24 && lat <= 27 && lon >= 56 && lon <= 58;
        });
        
        // 统计波斯湾到阿曼湾航线船舶
        const gulfVessels = data.vessels.filter((v: any) => {
          // 波斯湾大致范围：24-30N, 48-58E
          const lat = parseFloat(v.latitude);
          const lon = parseFloat(v.longitude);
          return lat >= 24 && lat <= 30 && lon >= 48 && lon <= 58;
        });
        
        results.push({
          route: '霍尔木兹海峡',
          vessels: hormuzVessels.length,
          status: hormuzVessels.length > 50 ? '繁忙' : hormuzVessels.length > 20 ? '正常' : '稀少',
          lastUpdate: now,
          available: true
        });
        
        results.push({
          route: '波斯湾 → 阿曼湾',
          vessels: gulfVessels.length,
          status: gulfVessels.length > 100 ? '繁忙' : gulfVessels.length > 50 ? '正常' : '稀少',
          lastUpdate: now,
          available: true
        });
      } else {
        // API返回格式不符合预期
        results.push({
          route: '霍尔木兹海峡',
          vessels: 0,
          status: 'API返回格式异常',
          lastUpdate: now,
          available: false
        });
        
        results.push({
          route: '波斯湾 → 阿曼湾',
          vessels: 0,
          status: 'API返回格式异常',
          lastUpdate: now,
          available: false
        });
      }
    } else {
      // API调用失败
      const errorText = await response.text();
      errors.push(`Marinesia API调用失败: ${response.status} - ${errorText.substring(0, 100)}`);
      
      return NextResponse.json({
        success: false,
        error: 'Marinesia API调用失败',
        details: errors,
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
        note: '请检查API Key是否正确，或联系Marinesia支持'
      }, { status: 500 });
    }

    // 返回成功数据
    const response_data = NextResponse.json({
      success: true,
      data: results,
      errors: errors.length > 0 ? errors : undefined,
      lastUpdate: now,
      source: 'Marinesia API'
    });
    
    // 设置缓存控制：10分钟
    response_data.headers.set('Cache-Control', 'public, max-age=600, s-maxage=600');
    
    return response_data;

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
