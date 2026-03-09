import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const execAsync = promisify(exec);

export async function GET() {
  try {
    console.log('🚀 开始执行 Telegram 新闻抓取（Vercel Cron Job）...');
    console.log('⏰ 时间:', new Date().toISOString());
    
    // 从环境变量读取 API 凭证
    const apiId = process.env.TELEGRAM_API_ID;
    const apiHash = process.env.TELEGRAM_API_HASH;
    
    if (!apiId || !apiHash) {
      return NextResponse.json({ 
        error: '缺少 API 凭证',
        message: '请在 Vercel 环境变量中配置 TELEGRAM_API_ID 和 TELEGRAM_API_HASH'
      }, { status: 500 });
    }
    
    console.log('🔑 API ID:', apiId);
    
    // 执行 Python Telethon 脚本
    const scriptPath = path.join(process.cwd(), 'tools', 'telegram_channel_scraper_telethon.py');
    const outputPath = path.join(process.cwd(), 'data', 'telegram_news', 'latest.json');
    
    // 构建频道列表
    const channels = [
      'blockchain:theblockbeats',
      'blockchain:bitpush',
      'blockchain:cointelegraph',
      'blockchain:coindesk_official',
      'finance:investing_com',
      'finance:forex_live',
      'finance:financial_times',
      'tech:wired',
      'tech:hacker_news',
      'tech:product_hunt'
    ].join(',');
    
    // 执行脚本（Vercel 环境使用 python3）
    const command = `python3 "${scriptPath}" --api-id "${apiId}" --api-hash "${apiHash}" --channels "${channels}" --output "${outputPath}"`;
    
    console.log('📡 正在调用 Telegram API...');
    
    try {
      const { stdout, stderr } = await execAsync(command, {
        cwd: process.cwd(),
        env: {
          ...process.env,
          TELEGRAM_API_ID: apiId,
          TELEGRAM_API_HASH: apiHash
        },
        maxBuffer: 1024 * 1024 * 10,
        timeout: 60000 // 60秒超时
      });
      
      console.log('脚本输出:', stdout);
      if (stderr) {
        console.error('脚本警告:', stderr);
      }
    } catch (execError) {
      console.error('脚本执行失败:', execError);
      // 如果脚本执行失败，返回错误但不中断
      return NextResponse.json({
        error: 'Telegram API 调用失败',
        message: execError instanceof Error ? execError.message : '未知错误',
        note: 'Vercel 环境可能需要配置代理或检查网络连接'
      }, { status: 500 });
    }
    
    // 读取更新后的数据
    if (fs.existsSync(outputPath)) {
      const data = JSON.parse(fs.readFileSync(outputPath, 'utf-8'));
      
      return NextResponse.json({
        success: true,
        message: 'Telegram 新闻抓取成功',
        source: data.source || 'Telegram MTProto API',
        last_update: data.last_update,
        total_messages: data.total_messages,
        active_channels: data.active_channels
      });
    } else {
      return NextResponse.json({
        error: '数据文件未生成',
        message: '抓取脚本执行完成，但未生成数据文件'
      }, { status: 500 });
    }
    
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
