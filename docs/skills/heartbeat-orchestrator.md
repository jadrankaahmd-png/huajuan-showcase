# heartbeat-orchestrator - 使用文档

**生成时间**: 2026-03-10T13:41:14.442Z  
**Skill 名称**: heartbeat-orchestrator

---

## 📋 概述

统一调度 Heartbeat 5件事（回顾、日记、扫描、健康检查、刷新状态板），每30分钟自动运行，协调5个子 skill。当用户说"运行 heartbeat"、"执行心跳检查"、"检查系统状态"、"刷新状态板"时使用。

---

## 🚀 使用方式

### 触发方式

- 用户说："运行 heartbeat"

### 使用示例

```bash
# 方式1：通过自然语言触发
用户说："运行 heartbeat"

# 方式2：手动运行脚本
node .agents/skills/heartbeat-orchestrator/scripts/main.js
```

---

## 📖 详细说明

### 功能特点

- 统一调度5件事
- 管理执行顺序
- 汇总执行结果
- 更新状态板

### 执行步骤

1. 执行 review-last-24h
2. 执行 journal-events
3. 执行 scan-environment
4. 执行 health-check
5. 执行 refresh-dashboard

---

## ⚠️ 故障排查

### 常见问题

**问题1: 某个子 skill 失败**
- 检查日志文件
- 单独运行失败的 skill

**问题2: 重复执行**
- 检查 crontab 配置
- 检查上次执行时间

---

## 📚 相关文档

- [Anthropic 官方 Skill 最佳实践](../knowledge_base/anthropic-skill-best-practices-2026-03-10.md)
- [OpenClaw Skills 文档](https://docs.openclaw.ai)

---

## 🔗 相关 Skills

- [code-change-verification](./code-change-verification.md)
- [docs-sync](./docs-sync.md)
- [prune-system-prompts](./prune-system-prompts.md)

---

_最后更新: 2026-03-10T13:41:14.442Z_
