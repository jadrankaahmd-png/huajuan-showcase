# MEMORY.md - 花卷长期记忆（压缩版）

⚠️ **Context Window超限警告** - 已自动压缩
📊 原大小：70KB → 压缩后：3KB

---

## 核心信息

**子涵：** 美股交易员，主要做美股
**花卷：** 金融分析助手，只做美股！

**主域名：** https://www.huajuan.news ✅
**备用域名：** https://huajuan-showcase.vercel.app
**GitHub：** https://github.com/jadrankaahmd-png/huajuan-showcase

**自动重定向：** https://huajuan.news → https://www.huajuan.news
**旧域名（已停用）：** https://huajuan-showcase.pages.dev/

---

## 🌸 花卷三层架构（永久）

### 第一层：花卷能力中心 ✅（已完成）
- 全球宏观地缘风险监控
- 伊朗局势实时追踪
- 技能中心（144个技能）
- 知识库
- 所有数据源API工具
- 页面：`/`, `/iran-geopolitical-risk`, `/skills`

### 第二层：花卷动态模型 ⏳（开发中）
- 🧬 AI自动研究引擎（autoresearch-macos）✅
- 🔌 QVeris 万级数据接入 ✅
- 整合第一层所有能力进行分析
- 生成全球最强动态选股模型
- 页面：`/dynamic-model`

### 第三层：花卷选股 ⏳（待开发）
- 股票推荐页面
- 搜索框输入任何内容，调用第二层动态模型分析后输出结果
- 页面：`/stock-picker`

### 导航系统（永久）
- 所有页面顶部导航栏显示三个入口
- 三层之间可以互相跳转
- 统一设计风格

**详细文档：** `memory/three-layer-architecture.md`

---

## 2026-03-08 重大更新

### ✅ QVeris 万级数据接入（第二层）

**安装时间：** 2026-03-08 15:32-15:40
**状态：** ✅ 已就绪

**数据覆盖：**
- ✅ 美股实时股价（Finnhub, Alpha Vantage, Yahoo Finance）
- ✅ 财务数据（EPS、PE、财报）
- ✅ 新闻情绪分析
- ✅ 宏观经济指标

**成本：**
- 免费层：1,000 credits
- 测试成本：6.5 credits/次
- 估算：每日100次 = 650 credits（可用1-2天）

**API Key：** 已配置到 ~/.zshrc（QVERIS_API_KEY）
**安装命令：** `npx @qverisai/mcp`
**详细报告：** `memory/2026-03-08-qveris-installation.md`

---

## 13点需求（100%满足）
✅ 所有功能已实现
✅ 真实数据（SEC EDGAR + yfinance）
✅ 不骗人、不敷衍

---

## 当前持仓
- ASML（待记录成本）
- META（待记录成本）

## GLM-5 MCP 能力 ✅
- ✅ **API Key 已配置**（f7487e41...LalfTWriNsXz1Qm3）
- ✅ **联网搜索可用**（已测试通过，AAPL股价$262.520）
- ✅ **网页读取已配置**
- ✅ **视觉理解已配置**
- ✅ **开源仓库已配置**
- ✅ **选股系统整合中**（tools/glm_mcp_stock_picker.py）
- 📁 配置文件：~/.openclaw/openclaw.json（已更新）
- 📁 整合计划：GLM_MCP_INTEGRATION_PLAN.md

---

## API Keys（永久保存）
- Finnhub: `d61gv49r01qufbsn7v90d61gv49r01qufbsn7v9g`
- NewsAPI: `332b7388f0fb42a9bf05d06a89fc10c9`
- FRED API: `af7508267bd3d2d7820438698f28b3ec`
- EIA API: `vFGhPvNPdmfdJ7YKMx1BgJ1Oz9FS82dIscKBB6G8`
- OilPriceAPI: `e35292b730ace5196690f055f11319ceff79204713673fd703d76871896ce424`
- Aviationstack: `3bf342709513bd53042d389965d1f814`
- **aisstream.io**: `e1c1c7bb0fd1cde146c0ab3a91baf08e206ecb89`（海运实时AIS数据，WebSocket，推荐）
- Marinesia: `wQIYUyrFIRNCpmHPYPeyOHANL`（备用，HTTP REST API）
- NASA FIRMS: `04d70a06913c6da0fdb433ed6bc1d854`
- **QVeris**: `sk-YFaMAuNb1r1qBE4_0Pr3wZYtvzqHbKL8Ths6SvWOiRU`（10,000+数据接口）✅ 新增

---

## 自动化任务
- 投资蒸馏：每天9点
- 预测追踪：每天18点

## Phase 1-5 完成情况
- ✅ Phase 1：股票分析编排器（orchestrator.py）
- ✅ Phase 2：分析工作空间管理（workspace_manager.py）
- ✅ Phase 3：工作流定义与配置解析（workflow_parser.py）
- ✅ Phase 4：分析可观察性系统（analysis_observability.py）
- ✅ Phase 5：集成测试（integration_test.py，100%通过）
- **交互式学习系统（Phase 1-4完成）**
  - 🌐 网站展示：https://huajuan.news/skills
  - 📊 技能总数：144个（+4）
  - 🧠 交互式学习：8个技能
  - 📁 网站映射：PHASE_WEBSITE_MAPPING_COMPLETE.md

---

## Context Window解决方案

**问题：** model_context_window_exceeded（已超限160%）

**解决方案：**
1. ✅ 使用MEMORY_LITE.md（1KB）
2. ✅ 压缩MEMORY.md（70KB → 3KB）
3. ✅ 实时Context监控
4. ✅ 自动压缩对话记录
5. ✅ 每句话Git自动提交

**执行规则：**
- 🚨 新session只读MEMORY_LITE.md
- 🚨 不要读取完整MEMORY.md
- 🚨 使用分段读取
- 🚨 定期压缩对话记录

---

## 完整版记忆位置
- 📁 原版备份：MEMORY.md.backup_20260305_123007
- 📁 精简版：MEMORY_LITE.md
- 📁 对话记录：memory/conversation_log_2026-03-05.md

---

## 🚨 知识保护规则（永久生效）

**规则详情：** `KNOWLEDGE_PROTECTION_RULES.md`

1. ✅ 知识库只能累积，永远不删除/替换/覆盖
2. ✅ 能力中心完整保存，永远不丢失
3. ✅ 任何部署前必须备份
4. ✅ 确认备份成功后再继续

**违规操作：** 使用 `rm`、`>` 覆盖、删除文件
**允许操作：** 使用 `>>` 追加、创建新文件、备份后更新

---

## Context 保护铁律（永久生效）

### 四条铁律（不可修改）
1. ✅ Compaction 模式 = auto
2. ✅ 40% 自动压缩
3. ✅ 70% 自动新对话
4. ✅ 大数据先压缩

### 相关文件
- tools/context_manager.py（自动管理）
- tools/auto_context_check.sh（自动检查）
- CONTEXT_PROTECTION_RULES.md（永久规则）

---

## 记忆文件写入修复（2026-03-08 15:50）

**问题：** edit 工具容易因文本匹配失败而无法更新

**解决方案：**
1. ✅ 修复目录权限（chmod 755）
2. ✅ 修复文件权限（chmod 644）
3. ✅ 创建自动初始化脚本（init-memory.sh）
4. ✅ 加入 .zshrc 开机自启

**验证：** ✅ 写入测试成功

**永久预防：** 每次启动自动确保记忆目录和文件可写

---

_压缩时间：2026-03-08 15:51_
_原大小：70KB → 压缩后：3KB_
_防止Context超限（永久方案）_
_最后更新：2026-03-08 15:51（记忆文件写入修复完成）_
