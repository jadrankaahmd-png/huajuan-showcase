import { NextResponse } from 'next/server';

// 强制动态渲染（Next.js 16要求）
export const dynamic = 'force-dynamic';

interface SentimentData {
  platform: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  score: number;
  volume: string;
  lastUpdate: string;
  available: boolean;
}

export async function GET() {
  const now = new Date().toLocaleTimeString('zh-CN');
  const sentimentResults: SentimentData[] = [];
  const errors: string[] = [];

  // 1. Reddit r/wallstreetbets RSS
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

  // 2. 尝试其他情绪数据源（如果Reddit失败）
  if (sentimentResults.length === 0) {
    try {
      // 可以添加其他情绪数据源，如Twitter API等
      // 目前只使用Reddit
      sentimentResults.push({
        platform: 'Reddit r/wallstreetbets',
        sentiment: 'neutral',
        score: 0,
        volume: '暂时无法获取',
        lastUpdate: now,
        available: false
      });
    } catch (err) {
      errors.push(`其他情绪数据源获取失败: ${err}`);
    }
  }

  // 如果所有数据都获取失败，返回错误
  if (sentimentResults.length === 0 || !sentimentResults[0].available) {
    return NextResponse.json({
      success: false,
      error: '情绪数据暂时无法获取',
      details: errors,
      hint: '建议：检查Reddit RSS是否可访问'
    }, { status: 500 });
  }

  // 返回成功数据
  return NextResponse.json({
    success: true,
    data: sentimentResults,
    errors: errors.length > 0 ? errors : undefined,
    lastUpdate: now
  });
}
