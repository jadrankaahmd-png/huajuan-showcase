/**
 * 🌸 花卷 MCP 服务器
 * 
 * 功能：
 * 1. 让 Claude 直接访问花卷知识库
 * 2. 提供股票查询工具
 * 3. 实现 AI ↔ 外部服务连接
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { Redis } from '@upstash/redis';

// Redis 配置
const redis = new Redis({
  url: 'https://valued-hamster-37498.upstash.io',
  token: 'AZJ6AAIncDE1YzRlYzY3NzI5OTU0MWIzOTM5YzNjMWE2NDkzMTkyZHAxMzc0OTg',
});

// 创建 MCP 服务器
const server = new Server({
  name: 'huajuan-mcp-server',
  version: '1.0.0',
}, {
  capabilities: {
    tools: {},
    resources: {},
  },
});

// 工具列表
server.setRequestHandler('tools/list', async () => {
  return {
    tools: [
      {
        name: 'get_stock_price',
        description: '获取股票实时价格',
        inputSchema: {
          type: 'object',
          properties: {
            ticker: {
              type: 'string',
              description: '股票代码（如：AAPL, NVDA）',
            },
          },
          required: ['ticker'],
        },
      },
      {
        name: 'search_knowledge',
        description: '搜索花卷知识库',
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: '搜索关键词',
            },
            limit: {
              type: 'number',
              description: '返回结果数量（默认：5）',
            },
          },
          required: ['query'],
        },
      },
      {
        name: 'get_capabilities_stats',
        description: '获取花卷能力统计',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
    ],
  };
});

// 工具执行
server.setRequestHandler('tools/call', async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case 'get_stock_price': {
      const { ticker } = args;
      // 这里可以接入真实的股票 API
      // 暂时返回模拟数据
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              ticker: ticker.toUpperCase(),
              price: 150.25,
              change: +2.35,
              changePercent: +1.59,
              timestamp: new Date().toISOString(),
              note: '（演示数据，实际需接入QVeris API）',
            }, null, 2),
          },
        ],
      };
    }

    case 'search_knowledge': {
      const { query, limit = 5 } = args;
      
      try {
        // 从 Redis 搜索知识库
        const knowledge = await redis.get('knowledge:items');
        
        if (!knowledge) {
          return {
            content: [
              {
                type: 'text',
                text: '知识库为空',
              },
            ],
          };
        }
        
        // 简单关键词搜索
        const results = knowledge.filter(item => 
          item.title?.toLowerCase().includes(query.toLowerCase()) ||
          item.content?.toLowerCase().includes(query.toLowerCase())
        ).slice(0, limit);
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                query: query,
                total: results.length,
                results: results.map(r => ({
                  title: r.title,
                  date: r.date,
                  summary: r.content?.substring(0, 200) + '...',
                })),
              }, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `搜索失败: ${error.message}`,
            },
          ],
        };
      }
    }

    case 'get_capabilities_stats': {
      try {
        const stats = await redis.get('stats:total');
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                主能力: stats.mainCapabilities,
                自定义能力: stats.customCapabilities,
                知识库: stats.knowledge + stats.books,
                子页面: stats.iran + stats.telegram + stats.qveris,
                总计: stats.grandTotal,
                最后更新: stats.lastUpdate,
              }, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `获取统计失败: ${error.message}`,
            },
          ],
        };
      }
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
});

// 资源列表
server.setRequestHandler('resources/list', async () => {
  return {
    resources: [
      {
        uri: 'huajuan://knowledge-base',
        name: '花卷知识库',
        description: '访问花卷的所有知识条目',
        mimeType: 'application/json',
      },
      {
        uri: 'huajuan://capabilities',
        name: '花卷能力库',
        description: '访问花卷的所有能力',
        mimeType: 'application/json',
      },
    ],
  };
});

// 资源读取
server.setRequestHandler('resources/read', async (request) => {
  const { uri } = request.params;

  if (uri === 'huajuan://knowledge-base') {
    const knowledge = await redis.get('knowledge:items');
    return {
      contents: [
        {
          uri: uri,
          mimeType: 'application/json',
          text: JSON.stringify(knowledge, null, 2),
        },
      ],
    };
  }

  if (uri === 'huajuan://capabilities') {
    const capabilities = await redis.get('capabilities:all');
    return {
      contents: [
        {
          uri: uri,
          mimeType: 'application/json',
          text: JSON.stringify(capabilities, null, 2),
        },
      ],
    };
  }

  throw new Error(`Unknown resource: ${uri}`);
});

// 启动服务器
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('🌸 花卷 MCP 服务器已启动');
}

main().catch((error) => {
  console.error('❌ 启动失败:', error);
  process.exit(1);
});
