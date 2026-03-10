/**
 * Redis 客户端配置
 * 
 * Upstash Redis 是唯一数据源
 * capabilities.ts 和 SQLite 只是备份
 */

import { Redis } from '@upstash/redis';

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || 'https://valued-hamster-37498.upstash.io',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || 'AZJ6AAIncDE1YzRlYzY3NzI5OTU0MWIzOTM5YzNjMWE2NDkzMTkyZHAxMzc0OTg',
});

/**
 * 获取总能力数（从 Redis 读取）
 */
export async function getTotalCapabilities(): Promise<number> {
  const stats = await redis.get('stats:total') as any;
  return stats?.capabilities || 0;
}

/**
 * 获取所有能力（从 Redis 读取）
 */
export async function getAllCapabilities(): Promise<any[]> {
  return await redis.get('capabilities:all') as any[] || [];
}

/**
 * 获取按分类的能力（从 Redis 读取）
 */
export async function getCapabilitiesByCategory(category: string): Promise<any[]> {
  return await redis.get(`capabilities:category:${category}`) as any[] || [];
}

/**
 * 获取所有知识条目（从 Redis 读取）
 */
export async function getAllKnowledge(): Promise<any[]> {
  return await redis.get('knowledge:items') as any[] || [];
}

/**
 * 获取所有书籍来源（从 Redis 读取）
 */
export async function getAllBooks(): Promise<any[]> {
  return await redis.get('knowledge:books') as any[] || [];
}

/**
 * 获取统计数据（从 Redis 读取）
 */
export async function getStats(): Promise<any> {
  return await redis.get('stats:total') as any;
}
