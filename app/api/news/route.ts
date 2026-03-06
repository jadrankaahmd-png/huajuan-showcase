import { NextResponse } from 'next/server';

// 强制动态渲染（Next.js 16要求）
export const dynamic = 'force-dynamic';

interface NewsItem {
  title: string;
  summary: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  time: string;
  source: string;
  url: string;
}

export async function GET() {
  const now = new Date().toLocaleTimeString('zh-CN');
  const newsResults: NewsItem[] = [];
  const errors: string[] = [];

  // 方案1: 尝试使用免费的新闻RSS feeds
  const rssFeeds = [
    { name: 'Reuters中东新闻', url: 'https://www.reutersagency.com/feed/?taxonomy=best-topics&post_type=best' },
    { name: 'BBC World News', url: 'http://feeds.bbci.co.uk/news/world/rss.xml' },
    { name: 'Al Jazeera English', url: 'https://www.aljazeera.com/xml/rss/all.xml' }
  ];

  for (const feed of rssFeeds) {
    try {
      const rssResponse = await fetch(feed.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        }
      });
      
      if (rssResponse.ok) {
        const rssText = await rssResponse.text();
        
        // 简单解析RSS XML（提取标题和链接）
        const titleMatches = rssText.matchAll(/<title><!\[CDATA\[(.*?)\]\]><\/title>|<title>(.*?)<\/title>/g);
        const linkMatches = rssText.matchAll(/<link>(.*?)<\/link>/g);
        
        const titles: string[] = [];
        const links: string[] = [];
        
        for (const match of titleMatches) {
          const title = match[1] || match[2];
          if (title && !title.includes(feed.name) && title.length > 10) {
            titles.push(title.trim());
          }
        }
        
        for (const match of linkMatches) {
          const link = match[1];
          if (link && link.startsWith('http')) {
            links.push(link.trim());
          }
        }
        
        // 只取前3条
        const count = Math.min(3, titles.length, links.length);
        for (let i = 0; i < count; i++) {
          newsResults.push({
            title: titles[i],
            summary: '来自RSS feed',
            sentiment: 'neutral',
            time: now,
            source: feed.name,
            url: links[i] || '#'
          });
        }
        
        if (newsResults.length >= 5) {
          break; // 已经有足够的新闻了
        }
      }
    } catch (err) {
      errors.push(`${feed.name} RSS获取失败: ${err}`);
    }
  }

  // 方案2: 如果RSS feeds都没有获取到数据，尝试NewsAPI（需要API Key）
  if (newsResults.length === 0) {
    try {
      const NEWS_API_KEY = process.env.NEWS_API_KEY || '332b7388f0fb42a9bf05d06a89fc10c9';
      const newsResponse = await fetch(
        `https://newsapi.org/v2/everything?q=Iran%20OR%20Israel%20OR%20Middle%20East%20oil&language=en&sortBy=publishedAt&pageSize=5&apiKey=${NEWS_API_KEY}`
      );
      
      if (newsResponse.ok) {
        const newsData = await newsResponse.json();
        
        if (newsData.articles && newsData.articles.length > 0) {
          for (const article of newsData.articles.slice(0, 5)) {
            newsResults.push({
              title: article.title || '无标题',
              summary: article.description?.substring(0, 150) || '暂无摘要',
              sentiment: 'neutral',
              time: new Date(article.publishedAt).toLocaleTimeString('zh-CN'),
              source: article.source?.name || '未知来源',
              url: article.url || '#'
            });
          }
        }
      } else if (newsResponse.status === 426) {
        errors.push('NewsAPI免费版不支持服务器端调用，需要升级付费版');
      }
    } catch (err) {
      errors.push(`NewsAPI获取失败: ${err}`);
    }
  }

  // 如果所有方案都失败，返回错误
  if (newsResults.length === 0) {
    return NextResponse.json({
      success: false,
      error: '所有新闻API调用失败',
      details: errors,
      hint: '建议：检查RSS feeds是否可访问，或升级NewsAPI到付费版'
    }, { status: 500 });
  }

  // 返回成功数据
  return NextResponse.json({
    success: true,
    data: newsResults.slice(0, 5), // 最多返回5条
    source: newsResults[0]?.source || 'RSS',
    errors: errors.length > 0 ? errors : undefined,
    lastUpdate: now
  });
}
