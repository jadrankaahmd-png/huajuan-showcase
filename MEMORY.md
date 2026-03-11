# MEMORY.md - 花卷长期记忆（压缩版）

⚠️ Context window超限警告 - 已自动压缩
📊 原大小：70KB → 压缩后：3KB

---

## 🚨 永久红线规则（不可违反）

### **规则1：全站禁止模拟数据（2026-03-08 17:04 生效）**
- ❌ **绝对禁止**：第一层、第二层、第三层，全站任何地方出现模拟数据、假数据、 hardcoded 数据、 演示数据, placeholder 数据
- ✅ **唯一允许**：真实 API 调用
- ✅ **错误处理**：API 报错时显示"数据加载失败，请稍后重试", **绝对不能** fallback 到模拟数据
- ⚠️ **优先级**：这条规则优先级高于一切，不管任何理由都不能违反

---

## 📝 觘久规则
### **规则2：禁止擅自操作文件（2026-03-11 00:34 生效）**
**绝对禁止擅自移动或删除任何文件和目录！**
**必须先告诉子涵，得到确认后才能操作！**

#### **示例场景**
- ❌ 不要因为觉得文件在错误位置就移动
- ❌ 不要因为觉得文件多余就删除
- ✅ 先说明位置和意图
- ✅ 等待子涵确认
- ✅ 得到确认后再执行
---

_规则 2 添加时间： 2026-03-11 00:34
_原因：避免造成混乱，所有文件操作需要得到明确确认_

### **规则3：必须本地构建验证（2026-03-11 01:53 生效）**
**每次修改代码后必须先本地构建验证！**

#### **操作流程**
1. ✅ 修改代码
2. ✅ 运行 `npm run build` 本地构建
3. ✅ 确认无报错
4. ✅ 再执行 `git push`
#### **原因**
- ❌ 険免推送有错误的代码到 GitHub
- ❌ 避免 Vercel 部署失败
- ✅ 提前发现问题，节省时间
---

### **规则4：禁止 git pull --rebase（2026-03-11 01:53 生效）**
**禁止使用 `git pull --rebase`！**

#### **原因**
- ❌ 会导致合并冲突
- ❌ 会导致代码丢失
- ❌ 会导致本地和远程不同步
#### **正确做法**
- ✅ 使用 `git pull --no-rebase`
- ✅ 或使用 `git merge`

---
### **规则5：Vercel 项目地址（2026-03-11 01:53 生效）**
**永久记住 Vercel 正确地址！**

#### **正确地址**
- 🌐 https://vercel.com/ztrades-projects/huajuan-showcase
#### **重要提醒**
- ⚠️ **不是** jadrankaahmd-png
- ✅ 是 **ztrades-projects**

---

### **规则6：系统重启后检查 telethon 模块（2026-03-11 02:39 生效）**
**每次系统重启或环境变化后必须检查 telethon 模块！**

#### **问题原因**
- macOS Homebrew Python 受 PEP 668 保护
- pip 安装需要使用 `--break-system-packages` 标志
- 系统更新可能导致模块丢失
#### **检查命令**
```bash
pip3 show telethon
```
#### **安装命令**
```bash
pip3 install --break-system-packages telethon
```
#### **触发场景**
- ✅ 系统重启后
- ✅ Python 版本更新后
- ✅ Homebrew 更新后
- ✅ crontab 恢复后
#### **影响**
- ❌ Telegram 新闻抓取失败
- ❌ Telegram 新闻页面无数据

---
## 核心信息
**子涵： 美股交易员，主要做美股
**花卷: 金融分析助手,只做美股！

**主域名:** https://www.huajuan.news ✅
**备用域名:** https://huajuan-showcase.vercel.app
**GitHub:** https://github.com/jadrankaahmd-png/huajuan-showcase
**Vercel 项目:** https://vercel.com/ztrades-projects/huajuan-showcase

**自动重定向:** https://huajuan.news → https://www.huajuan.news
**旧域名（已停用):** https://huajuan-showcase.pages.dev/

---
## 🌸 花卷三层架构（永久）

### 第一层：花卷能力中心 ✅（已完成）
- 全球宏观地缘风险监控
- 伊朗局势实时追踪
- 技能中心（762个技能）
- 知识库
- 所有数据源API工具
- 页面: `/`, `/iran-geopolitical-risk`, `/skills`
### 第二层: 花卷动态模型 ⏳（开发中）
- 🧬 AI自动研究引擎（autoresearch-macos）✅
- 🔌 QVeris 万级数据接入 ✅
- 整合第一层所有能力进行分析
- 生成全球最强动态选股模型
- 页面: `/dynamic-model`
### 第三层: 花卷选股 ⏳（待开发）
- 股票推荐页面
- 搜索框输入任何内容,调用第二层动态模型分析后输出结果
- 页面: `/stock-picker`
### 导航系统（永久）
- 所有页面顶部导航栏显示三个入口
- 三层之间可以互相跳转
- 统一设计风格

**详细文档:** `memory/three-layer-architecture.md`
---
## API Keys（永久保存）
- Finnhub: `d61gv49r01qufbsn7v90d61gv49r01qufbsn7v9g`
- NewsAPI: `332b7388f0fb42a9bf05d06a89fc10c9`
- FRED API: `af7508267bd3d2d7820438698f28b3ec`
- EIA API: `vFGhPvNPdmfdJ7YKMx1BgJ1Oz9FS82dIscKBB6G8`
- OilPriceAPI: `e35292b730ace5196690f055f11319ceff79204713673fd703d76871896ce424`
- Aviationstack: `3bf342709513bd53042d389965d1f814`
- **aisstream.io**: `e1c1c7bb0fd1cde146c0ab3a91baf08e206ecb89`（海运实时AIS数据,WebSocket,推荐）
- Marinesia: `wQIYUyrFIRNCpmHPYPeyOHANL`（备用,HTTP REST API）
- NASA FIRMS: `04d70a06913c6da0fdb433ed6bc1d854`
- **QVeris**: `sk-YFaMAuNb1r1qBE4_0Pr3wZYtvzqHbKL8Ths6SvWOiRU`（10,000+数据接口）✅
---
## 2026-03-08 今日工作总结
### ✅ 已完成任务（17:00-21:03）
1. **QVeris 四大组件部署**（16:19）
   - 美股实时查询
   - 美股涨幅实时榜单
   - 个股深度研判
   - 价格预警设置
2. **三个 Bug 修复**（17:01）
   - Bug 1: 美股实时查询崩溃 → 添加数据验证
   - Bug 2: 个股深度研判缺少参数 → 智能参数处理
   - Bug 3: 价格预警功能未真实 → 实现真实 API 调用
3. **全站清除模拟数据**（17:04）
   - 清除硬编码数据
   - StockRanking 改用真实 API
   - 添加永久红线规则（全站禁止模拟数据）
4. **个股深度研判改进**（17:12）
   - 财务指标卡片化
   - 真实 AI 研判结论
5. **美股量化策略回测组件**（20:47）
   - QVeris API 集成
   - Recharts 图表展示
   - 频率限制（每IP每分钟5次）
   - 响应式布局
6. **量化回测 API 修复**（20:54）
   - 修复 Execute API 端点：/tools/execute
   - 修复参数传递方式：tool_id 在 URL 中
   - 增强错误处理和数据解析
7. **记忆文件写入修复**（21:03）
   - 诊断并修复权限问题
   - 创建永久预防机制（crontab）
   - 每天 00:00 自动初始化
### 📊 部署统计
**Git 提交数量:** 9 次
**新增文件数量:** 10+ 个
**修改文件数量:** 20+ 个
**新增依赖:** recharts
**直达链接:** https://www.huajuan.news/dynamic-model
---
## 详细文档位置
- `memory/2026-03-08-qveris-four-components.md`（QVeris 四大组件）
- `memory/2026-03-08-qveris-bug-fix.md`（三个 Bug 修复）
- `memory/2026-03-08-remove-mock-data.md`（清除模拟数据）
- `memory/2026-03-08-stock-analysis-card.md`（个股深度研判改进）
- `memory/2026-03-08-backtest-component.md`（量化回测组件）
- `memory/2026-03-08-backtest-api-fix.md`（量化回测 API 修复）
- `memory/2026-03-08-memory-write-fix.md`（记忆文件写入修复）
---
_最后更新：2026-03-08 21:03_
_今日任务:✅ 全部完成_
_预防机制:✅ 已启用（crontab 每天 00:00)_

---

## 🚨 规则7：数据一致性强制规范（2026-03-11 19:55 生效）

**新增任何能力、知识条目或任何内容时，必须同步到网站，必须完善统一管理，禁止出现数据不一致的情况！**

### 具体要求
- ✅ 新增能力 → 必须运行 `npm run add-capability` + `npm run sync`
- ✅ 新增知识条目 → 必须创建对应 Markdown 文件 + 运行 `npm run sync`
- ✅ 任何数据变更 → 必须验证 Redis 和文件系统一致
- ✅ 网站显示数字必须与实际数据完全匹配

### 禁止事项
- ❌ 禁止只更新 Redis 不更新文件
- ❌ 禁止只更新文件不更新 Redis
- ❌ 禁止显示不存在的知识条目
- ❌ 禁止能力数量与实际不符

### 验证流程
每次变更后执行：
```bash
# 验证知识库数量
ls public/knowledge_base/*.md | wc -l  # 文件数
# 对比 Redis: knowledge:items 数量
```

---

### **规则8：编辑文件防错规范（2026-03-11 20:02 生效）**

**编辑 MEMORY.md 或其他包含多个相同分隔符的文件时，必须使用更具体的上下文进行匹配！**

#### 问题原因
- MEMORY.md 中有 14 个 "---" 分隔符
- edit 工具依赖精确字符串匹配
- 多个相同的分隔符会导致匹配失败，报错 "XXX chars edit failed"

#### 解决方案
- ✅ 使用更具体的上下文（如包含标题行的完整段落）
- ✅ 避免仅使用 "---" 或短通用字符串
- ✅ 编辑前先检查目标区域的唯一性

#### 正确示例
```javascript
// ❌ 错误 - 会匹配多个
oldText: "---"

// ✅ 正确 - 使用唯一上下文
oldText: "_规则7 添加时间： 2026-03-11 19:55"
```

---

### **规则9：能力统计规范（2026-03-11 20:15 生效）**

**统一能力统计口径，确保网站显示数字与实际数据完全一致！**

#### 数字定义（网站显示 716 = 650 + 37 + 4 + 10 + 9 + 6）

| 名称 | 数量 | 定义 | 数据来源 |
|------|------|------|----------|
| **主能力** | 650 | SQLite (573) + 自定义 (77) 的合并去重结果 | Redis capabilities:all |
| **自定义能力** | 77 | 用户添加的自定义能力 | data/custom-capabilities.json |
| **SQLite能力** | 573 | 数据库原有能力（去重后） | data/capabilities.db |
| **知识条目** | 37 | Markdown 文件 | public/knowledge_base/*.md |
| **书籍** | 4 | 书籍来源 | public/knowledge_base/book-sources.json |
| **伊朗局势** | 10 | 伊朗相关能力 | Redis irian:capabilities |
| **Telegram** | 9 | Telegram 频道 | Redis telegram:channels |
| **QVeris** | 6 | QVeris 相关能力 | Redis qveris:capabilities |
| **总能力** | **716** | 主能力 + 知识库 + 子页面 | grandTotal |

#### 计算公式
```
grandTotal = mainCapabilities + knowledge + books + iran + telegram + qveris
           = 650 + 37 + 4 + 10 + 9 + 6
           = 716
```

#### 禁止事项
- ❌ 禁止 SQLite 能力出现重复名称（会导致覆盖丢失）
- ❌ 禁止自定义能力出现重复名称
- ❌ 禁止主能力数量与 Redis capabilities:all 不一致
- ❌ 禁止网站显示数字与 Redis stats:total 不一致

#### 验证命令
```bash
# 验证主能力数量
npm run sync
# 检查输出中的 "主能力" 数量
```

---

_规则9 添加时间： 2026-03-11 20:15
_原因：统一能力统计口径，网站显示 716 = 650 + 37 + 4 + 10 + 9 + 6

---

### **规则10：QVeris API 禁用规则（2026-03-11 21:50 生效）**

**QVeris API 只在用户明确说"使用QVeris"时才调用，其他任何情况不得自动触发！**

#### 具体要求
- ✅ `/api/market-analyst` - 已改用 MiniMax，只有手动调用才触发
- ✅ `/api/backtest` - 量化回测，需要用户输入才调用
- ✅ `/api/qveris/*` - 所有 QVeris 组件已禁用（显示"功能待开发"）
- ✅ 禁止任何页面自动调用 QVeris API
- ✅ 禁止 cron/定时任务自动调用 QVeris

#### 已禁用的组件（全部显示"功能待开发"）
- StockQuery (美股实时查询)
- StockRanking (美股涨幅实时榜单)
- StockAnalysis (个股深度研判)
- AlertSettings (价格预警设置)
- Backtest (量化策略回测)
- MarketAnalyst (AI市场分析师)

#### 触发条件
只有以下情况可以调用 QVeris：
- 用户明确输入"使用QVeris"或类似指令
- 用户主动点击某个需要QVeris的功能按钮

---

_规则10 添加时间： 2026-03-11 21:50
_原因：QVeris API credits 有限，仅供第三层选股推荐使用

### **规则11：QVeris tool_id 必须动态获取（2026-03-11 22:05 生效）**

**禁止 hardcode 任何 tool_id，必须动态从 Search API 获取！**

#### 具体要求
- ✅ 调用 QVeris 前必须先调用 Search API 获取可用工具列表
- ✅ 从搜索结果中筛选正确的 tool_id
- ✅ 缓存 tool_id 避免重复搜索
- ✅ 代码示例：先 search "stock historical price eod"，再从结果中提取 tool_id

#### 错误示例
```javascript
// ❌ 禁止 hardcode
const TOOL_ID = 'eodhd.eod.retrieve.v1.34f25103';
```

#### 正确示例
```javascript
// ✅ 动态获取
const searchResult = await fetch('/api/v1/search', { query: 'stock historical price eod' });
const toolId = searchResult.results[0].tool_id;
```

---

_规则11 添加时间： 2026-03-11 22:05
_原因：之前 hardcode tool_id 导致数据为0，必须动态获取

---

### **规则12：禁止使用edit工具（永久生效）**

**绝对禁止对任何文件使用edit工具进行修改！**

#### 允许的修改方式

1. **sed 命令**（推荐）
   ```bash
   sed -i '' 's|旧字符串|新字符串|g' 文件路径
   ```

2. **整文件重写**
   ```bash
   cat > 文件路径 << 'EOF'
   文件内容
   EOF
   ```

3. **Python/Node脚本处理**
   ```javascript
   const fs = require('fs');
   let content = fs.readFileSync('file', 'utf8');
   content = content.replace(/旧/g, '新');
   fs.writeFileSync('file', content);
   ```

#### 禁止方式
- ❌ **禁止使用 edit 工具**
- ❌ **禁止使用 patch 方式编辑**

#### 原因
edit 工具在文件有多个相同字符串时会匹配失败，导致 "XXX chars edit failed" 错误。

---

_规则12 添加时间： 2026-03-11 22:45
_原因：edit 工具频繁失败，必须禁止使用
