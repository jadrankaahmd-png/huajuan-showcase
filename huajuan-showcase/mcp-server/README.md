# 🌸 花卷 MCP 服务器

**版本**：1.0.0  
**日期**：2026-03-10  
**类型**：Model Context Protocol 服务器

---

## 📋 功能列表

### 工具（Tools）

#### 1. get_stock_price
**描述**：获取股票实时价格

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

---

#### 2. search_knowledge
**描述**：搜索花卷知识库

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

---

#### 3. get_capabilities_stats
**描述**：获取花卷能力统计

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

---

### 资源（Resources）

#### 1. huajuan://knowledge-base
**描述**：访问花卷的所有知识条目  
**类型**：application/json  
**大小**：约 32 个条目

---

#### 2. huajuan://capabilities
**描述**：访问花卷的所有能力  
**类型**：application/json  
**大小**：约 629 个能力

---

## 🚀 使用方法

### 启动服务器

```bash
cd /Users/fox/.openclaw/workspace/huajuan-showcase/mcp-server
npm install
npm start
```

### Claude Desktop 配置

在 Claude Desktop 配置文件中添加：

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`

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

### Claude Code 配置

在项目中创建 `.mcp/config.json`：

```json
{
  "servers": {
    "huajuan": {
      "command": "node",
      "args": ["./mcp-server/index.js"]
    }
  }
}
```

---

## 🔧 技术栈

- **MCP SDK**: @modelcontextprotocol/sdk@1.0.0
- **Redis**: @upstash/redis@1.34.0
- **传输**: Stdio

---

## 📊 架构设计

```
Claude AI
  ↓ (MCP Protocol)
花卷 MCP 服务器
  ↓ (Redis API)
Upstash Redis
  ↓
数据存储
  - capabilities:all (629个能力)
  - knowledge:items (32个知识条目)
  - stats:total (统计数据)
```

---

## 💡 应用场景

### 1. Claude 直接访问知识库
```
Claude: "搜索花卷知识库中关于HBM4的内容"
  → 调用 search_knowledge("HBM4")
  → 返回相关条目
```

### 2. Claude 查询股票价格
```
Claude: "查询NVDA的股票价格"
  → 调用 get_stock_price("NVDA")
  → 返回实时价格
```

### 3. Claude 了解能力统计
```
Claude: "花卷现在有多少能力？"
  → 调用 get_capabilities_stats()
  → 返回统计数据
```

---

## ⚠️ 注意事项

1. **Redis 连接**：需要 Upstash Redis URL 和 Token
2. **股票 API**：当前使用模拟数据，需接入 QVeris API
3. **权限**：确保 Claude Desktop 有执行权限

---

## 🔮 未来扩展

1. ✅ 接入真实股票 API（QVeris）
2. ✅ 添加更多工具（财报分析、行业研究）
3. ✅ 支持流式响应
4. ✅ 添加认证和授权

---

_最后更新：2026-03-10_
_状态：MCP 服务器已创建_
_版本：1.0.0_
