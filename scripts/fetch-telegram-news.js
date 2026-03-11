#!/usr/bin/env node
/**
 * Telegram 新闻真实数据抓取脚本
 * 使用 Telethon (Python) 通过子进程调用
 */

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const { Redis } = require('@upstash/redis');

// Telegram API 凭证（从环境变量读取）
const API_ID = process.env.TELEGRAM_API_ID || '34904583';
const API_HASH = process.env.TELEGRAM_API_HASH || '733a2b8ea83e199d80123f0780893067';

// Redis 客户端配置
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || 'https://valued-hamster-37498.upstash.io',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || 'AZJ6AAIncDE1YzRlYzY3NzI5OTU0MWIzOTM5YzNjMWE2NDkzMTkyZHAxMzc0OTg',
});

// 要抓取的频道列表
const CHANNELS = {
  blockchain: [
    'theblockbeats',
    'bitpush',
    'cointelegraph',
    'coindesk_official'
  ],
  finance: [
    'investing_com',
    'forex_live',
    'financial_times'
  ],
  tech: [
    'wired',
    'hacker_news',
    'product_hunt'
  ]
};

async function main() {
  console.log('🚀 开始抓取 Telegram 新闻（真实 API）...');
  console.log('⏰ 时间:', new Date().toISOString());
  console.log('🔑 API ID:', API_ID ? '✅ 已配置' : '❌ 未配置');
  
  // 调用 Python Telethon 脚本
  const pythonScript = path.join(__dirname, '..', 'tools', 'telegram_channel_scraper_telethon.py');
  
  if (!fs.existsSync(pythonScript)) {
    console.error('❌ Python 脚本不存在:', pythonScript);
    process.exit(1);
  }
  
  // 构建频道列表参数
  const allChannels = [];
  for (const [category, channels] of Object.entries(CHANNELS)) {
    channels.forEach(ch => allChannels.push(`${category}:${ch}`));
  }
  
  const channelsArg = allChannels.join(',');
  const outputPath = path.join(__dirname, '..', 'data', 'telegram_news', 'latest.json');
  
  // 调用 Python 脚本（明确指定 Python 路径以避免 crontab 环境问题）
  const pythonPath = '/opt/homebrew/bin/python3';
  const command = `${pythonPath} "${pythonScript}" --api-id "${API_ID}" --api-hash "${API_HASH}" --channels "${channelsArg}" --output "${outputPath}"`;
  
  console.log('\n📡 调用 Python Telethon 脚本...');
  console.log('📝 命令:', command.replace(API_HASH, '***'));
  
  exec(command, { maxBuffer: 1024 * 1024 * 10 }, (error, stdout, stderr) => {
    if (error) {
      console.error('❌ 执行失败:', error.message);
      console.error('STDERR:', stderr);
      process.exit(1);
    }
    
    console.log('\n✅ Python 脚本输出:');
    console.log(stdout);
    
    if (stderr) {
      console.error('\n⚠️ 警告:');
      console.error(stderr);
    }
    
    // 验证输出文件
    if (fs.existsSync(outputPath)) {
      const data = JSON.parse(fs.readFileSync(outputPath, 'utf-8'));
      console.log('\n📊 抓取结果:');
      console.log('   - 最后更新:', data.last_update);
      console.log('   - 总消息数:', data.total_messages);
      console.log('   - 活跃频道:', data.active_channels);
      console.log('   - 数据来源:', data.source || '真实 Telegram API');
      
      // 保存到 Redis（新增）
      console.log('\n💾 保存到 Redis...');
      redis.set('telegram:news:latest', data)
        .then(() => {
          console.log('✅ 已保存到 Redis');
        })
        .catch((redisError) => {
          console.error('❌ Redis 保存失败:', redisError.message);
          // Redis 保存失败不影响文件存储
        });
      
      console.log('\n✅ 抓取完成！');
    } else {
      console.error('\n❌ 输出文件不存在');
      process.exit(1);
    }
  });
}

main();
