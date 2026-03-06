import { NextResponse } from 'next/server';

// 强制动态渲染（Next.js 16要求）
export const dynamic = 'force-dynamic';

// 设置缓存控制：15分钟
export const fetchCache = 'force-no-store';
export const revalidate = 900;

interface SentimentData {
  platform: string;
  sentiment: 'bullish' | 'bearish' | 'neutral' | 'extreme_fear' | 'extreme_greed' | 'fear' | 'greed';
  score: number;
  volume: string;
  lastUpdate: string;
  available: boolean;
  description?: string;
}

export async function GET() {
  const now = new Date().toLocaleTimeString('zh-CN');
  const sentimentResults: SentimentData[] = [];
  const errors: string[] = [];

  // 1. Alternative.me Crypto Fear & Greed Index（主要数据源）
  try {
    const fearGreedResponse = await fetch('https://api.alternative.me/fng/?limit=1', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      }
    });
    
    if (fearGreedResponse.ok) {
      const data = await fearGreedResponse.json();
      
      if (data.data && data.data.length > 0) {
        const fngData = data.data[0];
        const value = parseInt(fngData.value);
        const classification = fngData.value_classification;
        
        // 映射到通用情绪
        let sentiment: SentimentData['sentiment'] = 'neutral';
        if (value <= 25) {
          sentiment = 'extreme_fear';
        } else if (value <= 45) {
          sentiment = 'fear';
        } else if (value <= 55) {
          sentiment = 'neutral';
        } else if (value <= 75) {
          sentiment = 'greed';
        } else {
          sentiment = 'extreme_greed';
        }
        
        sentimentResults.push({
          platform: 'Crypto Fear & Greed Index',
          sentiment,
          score: value,
          volume: classification,
          lastUpdate: now,
          available: true,
          description: `市场情绪：${classification}（${value}/100）`
        });
      }
    }
  } catch (err) {
    errors.push(`Fear & Greed Index API失败: ${err}`);
  }

  // 2. Reddit r/wallstreetbets RSS（备用数据源）
  try {
    const redditResponse = await fetch('https://www.reddit.com/r/wallstreetbets/.rss', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      }
    });
    
    if (redditResponse.ok) {
      const rssText = await redditResponse.text();
      
      // 简单解析RSS，提取帖子数量
      const entryMatches = rssText.match(/<entry>/g);
      const postCount = entryMatches ? entryMatches.length : 0;
      
      // 简单的情绪分析：基于关键词
      const bullishKeywords = ['moon', 'rocket', 'buy', 'long', 'calls', 'bullish', '🚀', '📈'];
      const bearishKeywords = ['crash', 'dump', 'sell', 'short', 'puts', 'bearish', '📉'];
      
      let bullishCount = 0;
      let bearishCount = 0;
      
      const lowerText = rssText.toLowerCase();
      for (const keyword of bullishKeywords) {
        const matches = lowerText.match(new RegExp(keyword.toLowerCase(), 'g'));
        if (matches) bullishCount += matches.length;
      }
      
      for (const keyword of bearishKeywords) {
        const matches = lowerText.match(new RegExp(keyword.toLowerCase(), 'g'));
        if (matches) bearishCount += matches.length;
      }
      
      // 计算情绪分数（-1到1）
      const totalKeywords = bullishCount + bearishCount;
      let sentimentScore = 0;
      let sentiment: 'bullish' | 'bearish' | 'neutral' = 'neutral';
      
      if (totalKeywords > 0) {
        sentimentScore = (bullishCount - bearishCount) / totalKeywords;
        
        if (sentimentScore > 0.2) {
          sentiment = 'bullish';
        } else if (sentimentScore < -0.2) {
          sentiment = 'bearish';
        }
      }
      
      sentimentResults.push({
        platform: 'Reddit r/wallstreetbets',
        sentiment,
        score: Math.abs(sentimentScore),
        volume: `${postCount}个最新帖子`,
        lastUpdate: now,
        available: true
      });
    }
  } catch (err) {
    errors.push(`Reddit RSS获取失败: ${err}`);
  }

  // 如果所有数据都获取失败，返回错误
  if (sentimentResults.length === 0) {
    const response = NextResponse.json({
      success: false,
      error: '情绪数据暂时无法获取',
      details: errors,
      hint: '所有情绪数据源都失败了，请稍后重试'
    }, { status: 500 });
    
    response.headers.set('Cache-Control', 'public, max-age=60, s-maxage=60');
    return response;
  }

  // 返回成功数据
  const response = NextResponse.json({
    success: true,
    data: sentimentResults,
    errors: errors.length > 0 ? errors : undefined,
    lastUpdate: now,
    source: 'Alternative.me Fear & Greed Index + Reddit RSS'
  });
  
  // 设置缓存控制：15分钟
  response.headers.set('Cache-Control', 'public, max-age=900, s-maxage=900');
  return response;
}
