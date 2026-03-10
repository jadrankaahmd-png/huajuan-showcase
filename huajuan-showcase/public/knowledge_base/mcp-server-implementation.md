# MCP 服务器集成实现 - 花卷

**来源**：Anthropic AI 学院学习 + 实际实现  
**日期**：2026-03-10  
**类型**：MCP 服务器实现

---

## 📋 功能列表

### 工具（Tools）

#### 1. get_stock_price
**功能**：获取股票实时价格

**参数**：
```json
{
  "ticker": "AAPL"
}
```

**返回**：
```json
{
  "ticker": "AAPL",
  "price": 150.25,
  "change": 2.35,
  "changePercent": 1.59,
  "timestamp": "2026-03-10T09:00:00Z"
}
```

**应用场景**：
- Claude 直接查询股票价格
- 投资决策辅助
- 实时行情监控

---

#### 2. search_knowledge
**功能**：搜索花卷知识库

**参数**：
```json
{
  "query": "HBM4",
  "limit": 5
}
```

**返回**：
```json
{
  "query": "HBM4",
  "total": 3,
  "results": [
    {
      "title": "HBM4技术竞争格局深度分析",
      "date": "2026-03-10",
      "summary": "..."
    }
  ]
}
```

**应用场景**：
- Claude 搜索知识库
- 知识检索和推荐
- 上下文增强

---

#### 3. get_capabilities_stats
**功能**：获取花卷能力统计

**返回**：
```json
{
  "主能力": 629,
  "自定义能力": 56,
  "知识库": 36,
  "子页面": 25,
  "总计": 690,
  "最后更新": "2026-03-10T09:00:00Z"
}
```

**应用场景**：
- Claude 了解系统能力
- 统计数据查询
- 系统状态监控

---

### 资源（Resources）

#### 1. huajuan://knowledge-base
**描述**：访问花卷的所有知识条目  
**类型**：application/json  
**大小**：32 个条目

**应用场景**：
- Claude 读取完整知识库
- 批量知识处理
- 深度分析

---

#### 2. huajuan://capabilities
**描述**：访问花卷的所有能力  
**类型**：application/json  
**大小**：629 个能力

**应用场景**：
- Claude 了解所有能力
- 能力推荐
- 系统分析

---

## 🚀 使用方法

### 启动服务器

```bash
cd /Users/fox/.openclaw/workspace/huajuan-showcase/mcp-server
npm install
npm start
```

### Claude Desktop 配置

**配置文件**：`~/Library/Application Support/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "huajuan": {
      "command": "node",
      "args": ["/Users/fox/.openclaw/workspace/huajuan-showcase/mcp-server/index.js"]
    }
  }
}
```

---

## 🔧 技术实现

### 依赖
```json
{
  "@modelcontextprotocol/sdk": "^1.0.0",
  "@upstash/redis": "^1.34.0"
}
```

### 架构
```
Claude AI
  ↓ (MCP Protocol)
花卷 MCP 服务器
  ↓ (Redis API)
Upstash Redis
  ↓
数据存储
```

---

## 💡 应用场景

### 1. Claude 直接访问知识库

**用户**："搜索花卷知识库中关于HBM4的内容"

**流程**：
```
Claude → 调用 search_knowledge("HBM4")
  → MCP 服务器查询 Redis
  → 返回相关条目
  → Claude 总结回答
```

---

### 2. Claude 查询股票价格

**用户**："查询NVDA的股票价格"

**流程**：
```
Claude → 调用 get_stock_price("NVDA")
  → MCP 服务器返回价格
  → Claude 展示结果
```

---

### 3. Claude 了解能力统计

**用户**："花卷现在有多少能力？"

**流程**：
```
Claude → 调用 get_capabilities_stats()
  → MCP 服务器返回统计
  → Claude 展示统计
```

---

## 📊 高级功能

### 智能知识采样

**脚本**：`scripts/advanced-mcp.js`

**功能**：
1. 关键词匹配
2. 相关性排序
3. 智能采样

**使用**：
```bash
node scripts/advanced-mcp.js sample "HBM4" 3
```

---

### 实时价格预警

**功能**：
1. 设置价格预警
2. 检查预警条件
3. 发送 Telegram 通知

**使用**：
```bash
# 设置预警
node scripts/advanced-mcp.js alert NVDA 900 above

# 检查预警
node scripts/advanced-mcp.js check-alerts
```

---

### 主动通知推送

**功能**：
1. 推送每日摘要
2. 自定义通知
3. Telegram 集成

**使用**：
```bash
node scripts/advanced-mcp.js push-summary
```

---

## ⚠️ 注意事项

1. **Redis 连接**：需要 Upstash Redis URL 和 Token
2. **股票 API**：当前使用模拟数据，需接入 QVeris API
3. **Telegram**：需要配置 Bot Token 和 Chat ID

---

## 🔮 未来扩展

1. ✅ 接入真实股票 API（QVeris）
2. ✅ 添加更多工具（财报分析、行业研究）
3. ✅ 支持流式响应
4. ✅ 添加认证和授权

---

_最后更新：2026-03-10_
_状态：MCP 服务器已实现_
_版本：1.0.0_
