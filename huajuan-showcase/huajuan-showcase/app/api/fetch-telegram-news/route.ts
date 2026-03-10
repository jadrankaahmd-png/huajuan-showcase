import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';

// 要抓取的频道列表
const CHANNELS = {
  blockchain: [
    { username: 'theblockbeats', name: 'BlockBeats', lang: 'zh' },
    { username: 'bitpush', name: 'BitPush', lang: 'zh' },
    { username: 'cointelegraph', name: 'Cointelegraph', lang: 'en' },
    { username: 'coindesk_official', name: 'CoinDesk', lang: 'en' }
  ]
};

// 时间过滤：只保留24小时内的新闻
const TIME_FILTER_HOURS = 24;

// 转换浏览量文本为数字
function convertViews(viewsText: string): number {
  const text = viewsText.trim().toUpperCase();
  if (!text) return 0;
  
  try {
    if (text.includes('K')) {
      return Math.floor(parseFloat(text.replace('K', '')) * 1000);
    } else if (text.includes('M')) {
      return Math.floor(parseFloat(text.replace('M', '')) * 1000000);
    } else {
      return parseInt(text, 10) || 0;
    }
  } catch {
    return 0;
  }
}

// 抓取单个频道的消息
async function fetchChannelWeb(channelUsername: string, limit: number = 25) {
  const messages: any[] = [];
  
  try {
    const url = `https://t.me/s/${channelUsername}`;
    console.log(`   📡 正在抓取网页: ${url}`);
    
    // 发送请求
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Connection': 'keep-alive'
      }
    });
    
    if (!response.ok) {
      console.log(`   ❌ HTTP ${response.status}: ${response.statusText}`);
      return messages;
    }
    
    const html = await response.text();
    const $ = cheerio.load(html);
    
    // 当前时间（UTC）
    const now = new Date();
    const cutoffTime = new Date(now.getTime() - TIME_FILTER_HOURS * 60 * 60 * 1000);
    
    // 查找所有消息
    $('.tgme_widget_message').slice(0, limit).each((index, element) => {
      try {
        const $msg = $(element);
        
        // 提取消息 ID
        const messageLink = $msg.find('a.tgme_widget_message_date').attr('href');
        if (!messageLink) return;
        
        const messageId = messageLink.split('/').pop();
        if (!messageId) return;
        
        // 提取消息文本
        const text = $msg.find('.tgme_widget_message_text').text().trim().slice(0, 500) || 'No text';
        
        // 提取时间
        const datetimeStr = $msg.find('time.time').attr('datetime');
        let timestamp: Date;
        
        if (datetimeStr) {
          timestamp = new Date(datetimeStr);
        } else {
          timestamp = now;
        }
        
        // ⏰ 时间过滤：只保留24小时内的新闻
        if (timestamp < cutoffTime) {
          return; // 跳过旧消息
        }
        
        // 提取浏览量
        const viewsText = $msg.find('.tgme_widget_message_views').text().trim();
        const views = convertViews(viewsText);
        
        messages.push({
          channel: channelUsername,
          message_id: messageId,
          text: text,
          timestamp: timestamp.toISOString(),
          views: views,
          link: `https://t.me/${channelUsername}/${messageId}`
        });
        
      } catch (error) {
        console.log(`      ⚠️ 解析消息失败:`, error);
      }
    });
    
    console.log(`   ✅ 抓取了 ${messages.length} 条消息（24小时内）`);
    
  } catch (error) {
    console.log(`   ❌ 抓取频道 @${channelUsername} 失败:`, error);
  }
  
  return messages;
}

export async function GET() {
  try {
    console.log('🚀 开始使用网页抓取 Telegram 频道...');
    console.log('⏰ 时间:', new Date().toISOString());
    console.log('🔑 方法: 网页抓取（无需 API 凭证）');
    
    const allMessages: any[] = [];
    const channelStats: { [key: string]: number } = {};
    
    // 抓取每个分类的频道
    for (const [category, channels] of Object.entries(CHANNELS)) {
      console.log(`\n📡 正在抓取 ${category} 分类...`);
      
      for (const channel of channels) {
        console.log(`   📡 正在抓取 @${channel.username}...`);
        
        const messages = await fetchChannelWeb(channel.username, 25);
        
        // 添加频道信息
        for (const msg of messages) {
          msg.channel_name = channel.name;
          msg.category = category;
          msg.lang = channel.lang;
        }
        
        allMessages.push(...messages);
        channelStats[channel.username] = messages.length;
      }
    }
    
    // ⏰ 按时间倒序排序（最新的排最前面）
    allMessages.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    // 按分类重新组织
    const newsData: any = {
      last_update: new Date().toISOString(),
      source: 'Telegram Web Scraping (网页抓取)',
      channels: {
        blockchain: [],
        finance: [],
        tech: []
      },
      total_messages: allMessages.length,
      channel_stats: channelStats,
      total_channels: Object.keys(channelStats).length,
      active_channels: Object.values(channelStats).filter(count => count > 0).length
    };
    
    for (const msg of allMessages) {
      if (msg.category && newsData.channels[msg.category]) {
        newsData.channels[msg.category].push(msg);
      }
    }
    
    // 保存到文件
    const outputPath = path.join(process.cwd(), 'data', 'telegram_news', 'latest.json');
    
    // 确保目录存在
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    fs.writeFileSync(outputPath, JSON.stringify(newsData, null, 2), 'utf-8');
    
    console.log(`\n✅ 抓取完成！`);
    console.log(`📊 统计:`);
    console.log(`   - 总消息数: ${newsData.total_messages}`);
    console.log(`   - 活跃频道: ${newsData.active_channels}`);
    console.log(`   - 最后更新: ${newsData.last_update}`);
    console.log(`   - 数据来源: ${newsData.source}`);
    console.log(`   - 保存位置: ${outputPath}`);
    
    return NextResponse.json({
      success: true,
      message: 'Telegram 新闻抓取成功',
      source: newsData.source,
      last_update: newsData.last_update,
      total_messages: newsData.total_messages,
      active_channels: newsData.active_channels,
      channel_stats: channelStats
    });
    
  } catch (error) {
    console.error('❌ 抓取失败:', error);
    return NextResponse.json({
      error: '抓取失败',
      message: error instanceof Error ? error.message : '未知错误'
    }, { status: 500 });
  }
}

// 支持 POST 请求（用于手动触发）
export async function POST() {
  return GET();
}
