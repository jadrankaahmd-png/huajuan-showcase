import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const execAsync = promisify(exec);

export async function POST() {
  try {
    console.log('=== 手动触发 Telegram 新闻抓取 ===');
    
    // Python 脚本路径
    const scriptPath = path.join(process.cwd(), 'tools', 'telegram_channel_scraper.py');
    
    // 检查脚本是否存在
    if (!fs.existsSync(scriptPath)) {
      return NextResponse.json(
        { error: 'Telegram 抓取脚本不存在' },
        { status: 404 }
      );
    }
    
    // 执行 Python 脚本
    console.log('执行 Python 脚本:', scriptPath);
    const { stdout, stderr } = await execAsync(`python3 ${scriptPath}`, {
      timeout: 60000, // 60秒超时
    });
    
    if (stderr) {
      console.error('Python 脚本错误:', stderr);
    }
    
    console.log('Python 脚本输出:', stdout);
    
    // 读取更新后的数据
    const dataPath = path.join(process.cwd(), 'data', 'telegram_news', 'latest.json');
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    
    console.log('=== Telegram 新闻抓取完成 ===');
    
    return NextResponse.json({
      success: true,
      message: '新闻抓取成功',
      last_update: data.last_update,
      total_messages: data.total_messages,
      active_channels: data.active_channels,
    });
    
  } catch (error: any) {
    console.error('Telegram 新闻抓取失败:', error);
    return NextResponse.json(
      { error: error.message || '抓取失败' },
      { status: 500 }
    );
  }
}
