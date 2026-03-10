# Financial Datasets MCP Server 集成指南 - 2026-03-10

**来源**：Financial Datasets AI  
**日期**：2026-03-10  
**作用**：通过 MCP 服务器访问 17,000+ 家公司 30 年财务数据

---

## 🎯 **核心功能**

### **数据范围**
- ✅ **公司数量**：17,000+ 家上市公司
- ✅ **时间跨度**：过去 30 年历史数据
- ✅ **数据类型**：
  - 损益表（Income Statement）
  - 资产负债表（Balance Sheet）
  - 现金流量表（Cash Flow Statement）
  - 股价数据（Stock Prices）
  - SEC 文件（SEC Filings）
  - 加密货币数据（Crypto）
  - 市场新闻（Market News）

### **查询方式**
- ✅ **自然语言查询**：无需编写 SQL，直接用英文提问
- ✅ **示例**：
  - "What is Apple's revenue growth over the last 10 years?"
  - "Compare the balance sheets of AMD and NVDA"
  - "Show me Tesla's cash flow for Q4 2025"

---

## 🔧 **集成方式**

### **方式1：Interactive（推荐）**
**适用场景**：Claude, Claude Code, OpenClaw, Cursor 等 AI 助手

**认证方式**：OAuth 认证，**无需 API 密钥**

**连接步骤**：
1. 在 Claude Code 中运行：
   ```bash
   claude mcp add financial-datasets
   ```

2. 或者手动添加到 MCP 配置文件：
   ```json
   {
     "mcpServers": {
       "financial-datasets": {
         "command": "uvx",
         "args": ["financial-datasets-mcp"]
       }
     }
   }
   ```

---

### **方式2：Self-hosted**
**适用场景**：需要自定义部署或离线使用

**认证方式**：需要 Financial Datasets API 密钥

**连接步骤**：
1. 获取 API 密钥：https://financialdatasets.ai
2. 安装 MCP 服务器：
   ```bash
   pip install financial-datasets-mcp
   ```

3. 配置环境变量：
   ```bash
   export FINANCIAL_DATASETS_API_KEY="your-api-key"
   ```

---

## 📚 **可用工具**

### **1. get_income_statement**
**功能**：获取公司损益表  
**参数**：
- `ticker`（股票代码，如 "AAPL"）
- `period`（周期：annual/quarterly）
- `years`（年数，如 10）

**示例**：
```
Get Apple's income statement for the last 10 years
```

---

### **2. get_balance_sheet**
**功能**：获取公司资产负债表  
**参数**：
- `ticker`（股票代码）
- `period`（周期）
- `years`（年数）

**示例**：
```
Compare balance sheets of NVDA and AMD
```

---

### **3. get_cash_flow_statement**
**功能**：获取公司现金流量表  
**参数**：
- `ticker`（股票代码）
- `period`（周期）
- `years`（年数）

**示例**：
```
Show Tesla's cash flow for Q4 2025
```

---

### **4. get_stock_prices**
**功能**：获取股价历史数据  
**参数**：
- `ticker`（股票代码）
- `start_date`（开始日期）
- `end_date`（结束日期）

**示例**：
```
Get NVDA stock prices from 2020 to 2025
```

---

### **5. search_sec_filings**
**功能**：搜索 SEC 文件  
**参数**：
- `ticker`（股票代码）
- `filing_type`（文件类型：10-K/10-Q/8-K）
- `query`（搜索关键词）

**示例**：
```
Search Apple's 10-K filings for "AI"
```

---

### **6. get_crypto_prices**
**功能**：获取加密货币价格  
**参数**：
- `symbol`（币种符号，如 "BTC"）
- `start_date`（开始日期）
- `end_date`（结束日期）

**示例**：
```
Get Bitcoin prices for 2025
```

---

## 💡 **对花卷第一层能力的优化**

### **可以优化的现有能力（6个）**

#### **1️⃣ 财报事件传导预测器**
**现有痛点**：
- ❌ 手动查找财报数据
- ❌ 无法快速对比多家公司

**优化方案**：
- ✅ 直接通过 MCP 获取损益表、现金流表
- ✅ 自动计算同比/环比增长率
- ✅ 识别超预期/不及预期公司

**示例用法**：
```
获取 NVDA 过去 10 年收入增长率，识别加速/减速拐点
```

---

#### **2️⃣ AI 五层架构投资分析**
**现有痛点**：
- ❌ 缺少财务数据支撑
- ❌ 无法深度分析公司基本面

**优化方案**：
- ✅ 获取能源/芯片/基建层公司财务数据
- ✅ 计算毛利率、净利率、ROE 等指标
- ✅ 对比同层公司财务表现

**示例用法**：
```
对比 NVDA vs AMD vs AVGO 过去 5 年毛利率
```

---

#### **3️⃣ AI 能源层投资监控器**
**现有痛点**：
- ❌ 缺少财务数据验证

**优化方案**：
- ✅ 获取能源公司（NEE/VST/CEG）现金流表
- ✅ 分析资本支出（CAPEX）趋势
- ✅ 评估财务健康度

**示例用法**：
```
获取 NEE 过去 10 年自由现金流，评估股息可持续性
```

---

#### **4️⃣ AI 芯片层投资监控器**
**现有痛点**：
- ❌ 缺少研发支出对比

**优化方案**：
- ✅ 获取 R&D 支出数据
- ✅ 计算研发强度（R&D/Revenue）
- ✅ 对比竞争对研发投入

**示例用法**：
```
对比 NVDA vs AMD vs Intel 过去 5 年研发支出占比
```

---

#### **5️⃣ 供应链监控器**
**现有痛点**：
- ❌ 缺少供应商财务健康度评估

**优化方案**：
- ✅ 获取供应链公司资产负债表
- ✅ 评估流动比率、速动比率
- ✅ 识别财务风险供应商

**示例用法**：
```
获取 TSM 资产负债表，评估短期偿债能力
```

---

#### **6️⃣ 光模块供应链监控器**
**现有痛点**：
- ❌ 缺少 LITE/COHR/FN 财务深度分析

**优化方案**：
- ✅ 获取光模块公司损益表
- ✅ 计算毛利率趋势
- ✅ 分析订单增长对利润率影响

**示例用法**：
```
对比 Lumentum vs Coherent 过去 5 年毛利率
```

---

## 🚀 **可以做的新功能**

### **功能1：财报快速扫描器**
**作用**：一键扫描任意公司财报核心指标  
**输入**：股票代码  
**输出**：
- 收入增长率（5年）
- 毛利率趋势
- 净利率趋势
- 自由现金流趋势
- ROE 趋势

**示例**：
```
扫描 NVDA 财报核心指标
```

---

### **功能2：公司对比分析器**
**作用**：自动对比多家公司财务表现  
**输入**：多个股票代码  
**输出**：
- 收入规模对比
- 增长率对比
- 利润率对比
- 估值倍数对比（需要股价数据）

**示例**：
```
对比 NVDA vs AMD vs Intel 财务表现
```

---

### **功能3：SEC 文件关键词追踪器**
**作用**：追踪 SEC 文件中的关键词出现频率  
**输入**：股票代码 + 关键词列表  
**输出**：
- 关键词出现次数趋势
- 关键词首次出现时间
- 相关段落引用

**示例**：
```
追踪 NVDA 10-K 文件中 "AI" 出现次数趋势
```

---

## 📊 **集成到花卷的步骤**

### **第一步：测试 MCP 连接**

在花卷中运行：
```bash
claude mcp add financial-datasets
```

### **第二步：测试基本查询**

```
获取 Apple 过去 10 年收入增长数据
```

### **第三步：集成到现有监控器**

修改现有脚本，添加 MCP 调用：
```javascript
// 在财报事件传导预测器中添加
const incomeStatement = await mcp.call('get_income_statement', {
  ticker: 'NVDA',
  period: 'annual',
  years: 10
});
```

---

## 📝 **API 密钥获取（如果需要）**

如果选择 Self-hosted 方式：

1. 访问：https://financialdatasets.ai
2. 注册账号
3. 获取 API 密钥
4. 配置到环境变量：
   ```bash
   export FINANCIAL_DATASETS_API_KEY="your-api-key"
   ```

---

## 💡 **使用示例**

### **示例1：查询 NVDA 收入增长**
```
获取 NVDA 过去 10 年收入数据，计算年复合增长率
```

### **示例2：对比 AMD vs NVDA**
```
对比 AMD 和 NVDA 过去 5 年毛利率和研发支出
```

### **示例3：分析 Tesla 现金流**
```
分析 Tesla 过去 10 年自由现金流趋势
```

---

## ⚠️ **注意事项**

1. **数据延迟**：财务数据可能有季度延迟
2. **API 限制**：免费版可能有调用次数限制
3. **数据准确性**：建议与官方财报交叉验证
4. **成本控制**：大量查询可能产生费用

---

_来源：Financial Datasets AI (2026-03-10)_  
_GitHub：https://github.com/financial-datasets/mcp-server_  
_文档：https://docs.financialdatasets.ai/mcp-server_  
_状态：已研究，待集成_
