# 🌸 花卷 Symphony 工作流配置

**项目**：花卷美股分析系统  
**日期**：2026-03-10  
**版本**：1.0

---

## 🎯 任务调度策略

### 1. 能力同步任务

**触发条件**：新增能力到 `data/custom-capabilities.json`

**执行步骤**：
1. 读取 `data/custom-capabilities.json`
2. 调用 `scripts/sync-to-redis.js`
3. 更新 Redis 统计数据
4. Git commit & push

**并发限制**：最多 2 个并发
**超时**：10 分钟
**重试**：失败后 5 分钟重试，最多 3 次

---

### 2. Telegram 新闻更新任务

**触发条件**：定时触发（每 15 分钟）

**执行步骤**：
1. 调用 `tools/telegram_channel_scraper.py`
2. 更新 `data/telegram_news/latest.json`
3. Git commit & push

**并发限制**：最多 1 个并发
**超时**：5 分钟
**重试**：失败后 5 分钟重试，最多 2 次

---

### 3. Redis 数据验证任务

**触发条件**：每日凌晨 00:00

**执行步骤**：
1. 验证 `capabilities:all` 数据完整性
2. 验证 `knowledge:items` 数据完整性
3. 验证 `stats:total` 统计准确性
4. 生成验证报告

**并发限制**：最多 1 个并发
**超时**：15 分钟
**重试**：失败后 10 分钟重试，最多 1 次

---

## 📊 并发控制

**全局上限**：最多 5 个并发任务

**按任务类型限制**：
- 能力同步：最多 2 个并发
- Telegram 更新：最多 1 个并发
- Redis 验证：最多 1 个并发

**停滞检测**：5 分钟无响应自动重试

**单次续跑**：最多 10 轮

---

## 🔧 配置参数

```yaml
# Symphony 配置
max_concurrent_runs: 5
task_timeout_minutes: 10
stall_detection_minutes: 5
max_retries: 3
max_continuation_rounds: 10

# 项目路径
project_root: /Users/fox/.openclaw/workspace/huajuan-showcase
data_dir: data/
scripts_dir: scripts/
tools_dir: tools/

# Redis 配置
redis_url: https://valued-hamster-37498.upstash.io
redis_token: AZJ6AAIncDE1YzRlYzY3NzI5OTU0MWIzOTM5YzNjMWE2NDkzMTkyZHAxMzc0OTg

# Git 配置
auto_commit: true
auto_push: true
commit_message_prefix: "symphony:"
```

---

## 🚀 快速启动

```bash
# 启动 Symphony 服务
symphony start

# 查看任务状态
symphony status

# 手动触发任务
symphony trigger capability-sync

# 查看日志
symphony logs --tail=50
```

---

## 📝 Agent 系统指令

**主要职责**：
1. 监控 `data/custom-capabilities.json` 变化
2. 自动同步能力到 Redis
3. 验证数据完整性
4. Git 自动提交和推送

**工作流程**：
```
检测变化 → 创建隔离工作区 → 执行同步任务 → 验证结果 → Git 提交
```

**安全策略**：
- ✅ 只读访问 SQLite 数据库
- ✅ 写入前备份数据
- ✅ 失败时自动回滚
- ✅ 人工审核关键操作

---

## 🔍 可观测性

**任务状态追踪**：
- 任务 ID
- 开始时间
- 结束时间
- 执行状态
- 错误日志

**性能监控**：
- 任务执行时间
- 资源使用情况
- 并发数量
- 重试次数

---

_最后更新：2026-03-10 16:18_
_状态：WORKFLOW.md 配置完成_
