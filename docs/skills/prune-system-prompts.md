# prune-system-prompts - 使用文档

**生成时间**: 2026-03-10T13:41:14.442Z  
**Skill 名称**: prune-system-prompts

---

## 📋 概述

自动扫描和精简 workspace 文件（AGENTS.md、MEMORY.md、NOW.md），超过阈值时自动精简，保留关键信息，删除冗余内容，节省 Token。当用户说"精简系统提示词"、"节省 Token"、"压缩 MEMORY.md"、"清理冗余"时使用。

---

## 🚀 使用方式

### 触发方式

- 用户说："精简系统提示词"

### 使用示例

```bash
# 方式1：通过自然语言触发
用户说："精简系统提示词"

# 方式2：手动运行脚本
node .agents/skills/prune-system-prompts/scripts/main.js
```

---

## 📖 详细说明

### 功能特点

- 自动扫描文件大小
- 识别可精简文件
- 保留关键信息
- 生成精简报告

### 执行步骤

1. 扫描 workspace 文件
2. 识别可精简文件
3. 自动精简
4. 生成精简报告

---

## ⚠️ 故障排查

### 常见问题

**问题1: 精简后文件损坏**
- 检查备份文件
- 恢复备份

**问题2: 精简过度**
- 调整阈值
- 增加保留规则

---

## 📚 相关文档

- [Anthropic 官方 Skill 最佳实践](../knowledge_base/anthropic-skill-best-practices-2026-03-10.md)
- [OpenClaw Skills 文档](https://docs.openclaw.ai)

---

## 🔗 相关 Skills

- [heartbeat-orchestrator](./heartbeat-orchestrator.md)
- [docs-sync](./docs-sync.md)

---

_最后更新: 2026-03-10T13:41:14.442Z_
