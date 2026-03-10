#!/usr/bin/env node
/**
 * 同步第二层和第三层数据到 Redis
 */

const { Redis } = require('@upstash/redis');
const fs = require('fs');

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || 'https://valued-hamster-37498.upstash.io',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || 'AZJ6AAIncDE1YzRlYzY3NzI5OTU0MWIzOTM5YzNjMWE2NDkzMTkyZHAxMzc0OTg',
});

async function syncLayer2() {
  console.log('\n📦 同步第二层数据...\n');
  
  const layer2Data = {
    capabilities: [
      {
        id: 'layer2-1',
        name: 'AI自动研究引擎',
        description: 'AI自主循环优化选股模型参数，每5分钟一次实验',
        status: 'active',
        category: 'dynamic-model',
        icon: '🧬',
        details: {
          localPath: '~/.openclaw/workspace/autoresearch-macos/',
          github: 'https://github.com/miolini/autoresearch-macos',
          features: ['固定时间预算', '自主优化', '性能追踪']
        }
      },
      {
        id: 'layer2-2',
        name: 'Zread 源码自检系统',
        description: '花卷可以检索自己的 OpenClaw 源代码，进行自我分析和优化',
        status: 'active',
        category: 'dynamic-model',
        icon: '🔍',
        details: {
          features: ['自我分析', '代码优化', '能力提升']
        }
      },
      {
        id: 'layer2-3',
        name: '量化策略回测',
        description: '支持多种量化策略的历史数据回测',
        status: 'active',
        category: 'dynamic-model',
        icon: '📊',
        details: {
          strategies: ['均线策略', '动量策略', '均值回归']
        }
      },
      {
        id: 'layer2-4',
        name: 'AI美股市场分析师',
        description: 'LLM驱动的市场分析系统',
        status: 'active',
        category: 'dynamic-model',
        icon: '🤖',
        details: {
          features: ['全球指标监控', '板块分析', '异常识别']
        }
      },
      {
        id: 'layer2-5',
        name: 'QVeris 万级数据接入',
        description: '接入 QVeris API 的万级数据接口',
        status: 'active',
        category: 'dynamic-model',
        icon: '📈',
        details: {
          dataPoints: '10,000+',
          apis: ['实时行情', '历史数据', '财务指标']
        }
      }
    ],
    stats: {
      total: 5,
      active: 5,
      inactive: 0,
      lastUpdate: new Date().toISOString()
    }
  };
  
  await redis.set('layer2:capabilities', layer2Data.capabilities);
  await redis.set('layer2:stats', layer2Data.stats);
  
  console.log('✅ 写入 layer2:capabilities (5 条)');
  console.log('✅ 写入 layer2:stats');
  
  return layer2Data;
}

async function syncLayer3() {
  console.log('\n📦 同步第三层数据...\n');
  
  const layer3Data = {
    capabilities: [
      {
        id: 'layer3-1',
        name: '智能搜索',
        description: '输入任何内容，获得深度分析报告',
        status: 'inactive',
        category: 'stock-picker',
        icon: '🔎'
      },
      {
        id: 'layer3-2',
        name: '个性化推荐',
        description: '根据投资偏好推荐最佳股票',
        status: 'inactive',
        category: 'stock-picker',
        icon: '⭐'
      },
      {
        id: 'layer3-3',
        name: '详细分析',
        description: '整合第一层所有能力的全面分析',
        status: 'inactive',
        category: 'stock-picker',
        icon: '📊'
      },
      {
        id: 'layer3-4',
        name: '投资组合',
        description: '管理和优化你的投资组合',
        status: 'inactive',
        category: 'stock-picker',
        icon: '💼'
      }
    ],
    stats: {
      total: 4,
      active: 0,
      inactive: 4,
      progress: 0,
      lastUpdate: new Date().toISOString()
    }
  };
  
  await redis.set('layer3:capabilities', layer3Data.capabilities);
  await redis.set('layer3:stats', layer3Data.stats);
  
  console.log('✅ 写入 layer3:capabilities (4 条)');
  console.log('✅ 写入 layer3:stats');
  
  return layer3Data;
}

async function updateGlobalStats() {
  console.log('\n📦 更新全站统计...\n');
  
  const layer1Stats = await redis.get('stats:total');
  const layer2Stats = await redis.get('layer2:stats');
  const layer3Stats = await redis.get('layer3:stats');
  
  const globalStats = {
    layer1: {
      total: layer1Stats?.grandTotal || 631,
      capabilities: layer1Stats?.mainCapabilities || 573,
      knowledge: (layer1Stats?.knowledge || 29) + (layer1Stats?.books || 4),
      subpages: (layer1Stats?.iran || 10) + (layer1Stats?.telegram || 9) + (layer1Stats?.qveris || 6)
    },
    layer2: {
      total: layer2Stats?.total || 5,
      active: layer2Stats?.active || 5
    },
    layer3: {
      total: layer3Stats?.total || 4,
      active: layer3Stats?.active || 0,
      progress: layer3Stats?.progress || 0
    },
    grandTotal: (layer1Stats?.grandTotal || 631) + (layer2Stats?.total || 5) + (layer3Stats?.total || 4),
    lastUpdate: new Date().toISOString()
  };
  
  await redis.set('global:stats', globalStats);
  
  console.log('✅ 写入 global:stats');
  console.log('\n📊 全站统计:');
  console.log('  - 第一层:', globalStats.layer1.total, '条');
  console.log('  - 第二层:', globalStats.layer2.total, '条');
  console.log('  - 第三层:', globalStats.layer3.total, '条');
  console.log('  - 总计:', globalStats.grandTotal, '条');
  
  return globalStats;
}

async function main() {
  console.log('🚀 开始同步第二层和第三层数据到 Redis...\n');
  
  try {
    await syncLayer2();
    await syncLayer3();
    const globalStats = await updateGlobalStats();
    
    console.log('\n✅ 同步完成！');
    console.log('\n📊 最终统计:');
    console.log('  - 第一层:', globalStats.layer1.total, '条');
    console.log('  - 第二层:', globalStats.layer2.total, '条');
    console.log('  - 第三层:', globalStats.layer3.total, '条');
    console.log('  - 总计:', globalStats.grandTotal, '条');
    
  } catch (error) {
    console.error('❌ 同步失败:', error);
    process.exit(1);
  }
}

main();
