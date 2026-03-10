import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: 'https://valued-hamster-37498.upstash.io',
  token: 'AZJ6AAIncDE1YzRlYzY3NzI5OTU0MWIzOTM5YzNjMWE2NDkzMTkyZHAxMzc0OTg',
});

export async function GET() {
  const data = await redis.get('telegram:news:latest');
  return NextResponse.json({
    total_messages: data?.total_messages || 0,
    last_update: data?.last_update?.substring(0, 19) || '无',
    source: data?.source || '无'
  });
}
