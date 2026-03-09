import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const execAsync = promisify(exec);

export async function GET() {
  try {
    console.log('🚀 开始执行 Telegram 新闻抓取...');
    
    // 执行抓取脚本
    const scriptPath = path.join(process.cwd(), 'scripts', 'fetch-telegram-news.js');
    
    // 检查脚本是否存在
    if (!fs.existsSync(scriptPath)) {
      return NextResponse.json({ 
        error: '抓取脚本不存在',
        message: '请先创建 scripts/fetch-telegram-news.js'
      }, { status: 500 });
    }
    
    // 执行脚本
    const { stdout, stderr } = await execAsync(`node ${scriptPath}`, {
      cwd: process.cwd(),
      env: process.env,
      maxBuffer: 1024 * 1024 * 10 // 10MB buffer
    });
    
    console.log('脚本输出:', stdout);
    if (stderr) {
      console.error('脚本错误:', stderr);
    }
    
    // 读取更新后的数据
    const dataPath = path.join(process.cwd(), 'data', 'telegram_news', 'latest.json');
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    
    return NextResponse.json({
      success: true,
      message: 'Telegram 新闻抓取成功',
      last_update: data.last_update,
      total_messages: data.total_messages,
      active_channels: data.active_channels,
      output: stdout
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
