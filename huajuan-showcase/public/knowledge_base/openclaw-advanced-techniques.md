# OpenClaw 三个高级技巧深度解析

**来源**：OpenClaw 社区最佳实践  
**日期**：2026-03-10  
**类型**：Agent 架构优化

---

## 📚 三个高级技巧概览

### **1️⃣ skill 嵌套 skill**

**定义**：一个 skill 声明依赖其他 skill，形成组合能力

**什么时候用**：
- ✅ 复杂多步骤任务（需要多个 skill 配合）
- ✅ 流程化操作（前一个 skill 的输出是后一个的输入）
- ✅ 层级验证（多层检查，每层由不同 skill 负责）

**怎么用**：
```yaml
---
name: final-release-review
description: 发布前检查兼容性、回归、迁移说明
dependencies:
  - test-coverage-improver
  - code-change-verification
  - docs-sync
---

# Final Release Review

## 执行步骤

1. 调用 `$test-coverage-improver` 检查覆盖率
2. 调用 `$code-change-verification` 验证代码质量
3. 调用 `$docs-sync` 审计文档同步
4. 比较上一个发布 vs 当前
5. 生成发布就绪性判断
```

**示例**：
- `agent-team-orchestration` 协调多个 agent
- `final-release-review` 组合多个检查 skill

---

### **2️⃣ script 嵌套 skill**

**定义**：脚本中调用 skill，实现"机制在脚本中，调用技能"

**什么时候用**：
- ✅ 需要确定性执行（脚本控制流程）
- ✅ 需要条件判断（根据结果决定是否调用下一个 skill）
- ✅ 需要错误处理（失败时跳过某些 skill）
- ✅ 需要并行执行（同时调用多个 skill）

**怎么用**：
```javascript
// scripts/audit-security.js

async function main() {
  // 1. 运行 code-change-verification skill
  await execSync('node .agents/skills/code-change-verification/scripts/verify.js');
  
  // 2. 如果成功，运行 docs-sync skill
  if (success) {
    await execSync('node .agents/skills/docs-sync/scripts/audit.js');
  }
  
  // 3. 生成综合报告
  generateReport();
}
```

**示例**：
- `heartbeat.js` 调用多个 skill（review、journal、scan）
- `audit-security.js` 调用 verification 和 sync skill

**与 skill 嵌套 skill 的区别**：
- **skill 嵌套 skill**：skill 声明依赖，由 OpenClaw 自动加载
- **script 嵌套 skill**：脚本显式调用 skill，完全控制流程

---

### **3️⃣ prune system prompts**

**定义**：精简系统提示词，优化 Token 使用和成本

**什么时候用**：
- ✅ Context window 接近上限
- ✅ Token 成本过高
- ✅ 响应速度变慢
- ✅ 内存文件过大（AGENTS.md、MEMORY.md 等）

**怎么用**：

#### **技巧1：Trim Workspace Files**
```bash
# 精简 AGENTS.md
- 保留核心规则，删除重复说明
- 合并相似章节
- 使用更简洁的语言

# 精简 MEMORY.md
- 压缩历史记录（保留关键信息）
- 删除过时内容
- 使用表格代替长文本

# 精简 daily memory
- 只保留今日重要事件
- 删除详细的命令输出
- 保留决策和结论
```

#### **技巧2：Context Pruning**
```bash
# OpenClaw 自动修剪 oversized tool outputs
# 手动配置：
openclaw config set pruning.enabled true
openclaw config set pruning.maxOutputSize 10000
```

#### **技巧3：Compaction**
```bash
# 压缩对话历史
- 合并相似问题
- 删除重复回答
- 保留关键决策点
```

#### **技巧4：Prompt Caching**
```bash
# 启用提示词缓存
openclaw config set caching.enabled true
openclaw config set caching.ttl 3600
```

#### **技巧5：Model Tiering**
```bash
# 简单任务用小模型
- Heartbeat: 用小模型（如 gpt-3.5）
- 简单查询: 用小模型
- 深度分析: 用大模型（如 gpt-4）
```

**工具**：
- `openclaw-token-optimizer` skill - 一键优化 Token 使用

---

## 💡 对花卷第一层的帮助

### **✅ 可以优化的现有能力**

#### **1. skill 嵌套 skill 优化**

| 现有能力 | 如何优化 |
|---------|---------|
| **Code Change Verification** | ✅ 嵌套 docs-sync skill（验证后自动审计文档） |
| **Final Release Review** | ✅ 嵌套 test-coverage-improver + code-change-verification + docs-sync |
| **Heartbeat 5件事** | ✅ 每件事都是一个 skill，主 skill 协调5个子 skill |
| **每晚审计** | ✅ audit-security skill 嵌套多个检查 skill |

---

#### **2. script 嵌套 skill 优化**

| 现有脚本 | 如何优化 |
|---------|---------|
| **heartbeat.js** | ✅ 脚本中调用 5 个 skill（review、journal、scan、health-check、refresh-dashboard） |
| **audit-security.js** | ✅ 脚本中调用 code-change-verification + docs-sync skill |
| **sync-to-redis.js** | ✅ 脚本中调用 validate-redis skill |
| **add-knowledge-from-url.js** | ✅ 脚本中调用 categorize-knowledge + generate-tags skill |

---

#### **3. prune system prompts 优化**

| 现有文件 | 如何优化 |
|---------|---------|
| **AGENTS.md** | ✅ 从 7.1KB 压缩到 4KB（删除重复说明，保留核心规则） |
| **MEMORY.md** | ✅ 已压缩到 3KB（继续精简历史记录） |
| **NOW.md** | ✅ 保持精简（只保留最重要的任务） |
| **daily memory** | ✅ 只保留关键决策，删除详细命令输出 |

---

## 🎯 可以做哪些具体功能？

### **短期（本周）**

#### **1. 重构 Heartbeat 5件事为 skill 嵌套**

**主 skill**：`heartbeat-orchestrator`

**子 skills**：
- `review-last-24h` - 回顾最近24小时
- `journal-events` - 记录重要事件
- `scan-environment` - 扫描环境变化
- `health-check` - 健康检查
- `refresh-dashboard` - 刷新状态板

**文件结构**：
```
.agents/skills/heartbeat-orchestrator/
├── SKILL.md
└── scripts/
    └── orchestrator.js（调用5个子 skill）
```

---

#### **2. 重构 audit-security 为 script 嵌套 skill**

**脚本**：`scripts/audit-security.js`

**调用的 skills**：
- `$code-change-verification` - 验证代码质量
- `$docs-sync` - 审计文档同步
- `$validate-redis` - 验证 Redis 数据
- `$check-git-status` - 检查 Git 状态

**优势**：
- ✅ 确定性执行（脚本控制流程）
- ✅ 条件判断（失败时跳过某些检查）
- ✅ 错误处理（生成综合报告）

---

#### **3. 实现 prune-system-prompts skill**

**文件位置**：`.agents/skills/prune-system-prompts/SKILL.md`

**功能**：
1. 扫描 workspace 文件大小
2. 识别可以精简的文件
3. 自动精简 AGENTS.md、MEMORY.md、NOW.md
4. 压缩 daily memory
5. 生成精简报告

**使用方法**：
```bash
$prune-system-prompts
```

---

### **中期（2周内）**

#### **4. 实现 final-release-review skill 组合**

**主 skill**：`final-release-review`

**依赖 skills**：
- `test-coverage-improver`
- `code-change-verification`
- `docs-sync`
- `integration-tests`
- `changeset-validation`

**工作流程**：
```
1. 调用 test-coverage-improver
2. 调用 code-change-verification
3. 调用 docs-sync
4. 调用 integration-tests
5. 调用 changeset-validation
6. 比较上一个发布 vs 当前
7. 生成发布就绪性判断
```

---

#### **5. 实现 token-optimizer skill**

**基于**：`openclaw-token-optimizer` 官方 skill

**功能**：
1. 审计 context injection
2. 精简 workspace 文件
3. 启用 prompt caching
4. 配置 context pruning
5. 配置 compaction
6. 配置 model tiering
7. 优化 cron frequency

---

### **长期（1月内）**

#### **6. 实现多 agent 协作架构**

**基于**：`agent-team-orchestration` skill

**架构**：
```
主 Agent（花卷）
  ↓
协调 Agent（Orchestrator）
  ↓
专业 Agent（第一层、第二层、第三层）
  ↓
技能 Agent（具体能力）
```

**使用场景**：
- 复杂分析任务（需要多层能力配合）
- 大规模数据处理（并行执行）
- 长时间任务（异步协作）

---

## 📊 预期效果

### **Token 节省**

| 优化项 | 之前 | 之后 | 节省 |
|--------|------|------|------|
| **AGENTS.md** | 7.1KB | 4KB | 44% |
| **MEMORY.md** | 3KB | 2KB | 33% |
| **daily memory** | 5KB | 2KB | 60% |
| **总计** | 15.1KB | 8KB | **47%** |

---

### **成本节省**

| 场景 | 之前 | 之后 | 节省 |
|------|------|------|------|
| **Heartbeat** | $0.10/次 | $0.03/次 | 70% |
| **简单查询** | $0.05/次 | $0.01/次 | 80% |
| **深度分析** | $0.50/次 | $0.30/次 | 40% |
| **总计** | - | - | **60%** |

---

### **性能提升**

| 指标 | 之前 | 之后 | 提升 |
|------|------|------|------|
| **响应速度** | 3秒 | 1.5秒 | 50% |
| **并发能力** | 5个 | 10个 | 100% |
| **稳定性** | 95% | 99% | 4% |

---

## 🔑 核心原则

### **1. 优先使用 skill 嵌套 skill**
- ✅ 当任务天然是流程化时
- ✅ 当需要 OpenClaw 自动管理依赖时
- ✅ 当需要 skill 重用时

---

### **2. 使用 script 嵌套 skill 当需要控制流**
- ✅ 需要条件判断时
- ✅ 需要错误处理时
- ✅ 需要并行执行时
- ✅ 需要确定性执行时

---

### **3. 定期 prune system prompts**
- ✅ 每周精简一次 workspace 文件
- ✅ 每天压缩 daily memory
- ✅ 启用 prompt caching 和 context pruning
- ✅ 使用 model tiering

---

## 🚨 注意事项

### **skill 嵌套 skill 限制**
- ⚠️ 避免循环依赖（A 依赖 B，B 依赖 A）
- ⚠️ 避免过深嵌套（最多3层）
- ⚠️ 确保子 skill 是独立的、可重用的

---

### **script 嵌套 skill 限制**
- ⚠️ 需要手动管理 skill 调用
- ⚠️ 需要自己处理错误
- ⚠️ 需要确保 skill 路径正确

---

### **prune system prompts 限制**
- ⚠️ 不要删除关键信息（永久规则、API Keys）
- ⚠️ 不要过度精简（保留可读性）
- ⚠️ 精简前备份原文件

---

_最后更新：2026-03-10_
_来源：OpenClaw 社区最佳实践_
_状态：已加入知识库_
