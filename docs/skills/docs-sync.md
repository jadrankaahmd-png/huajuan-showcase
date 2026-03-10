# docs-sync - 使用文档

**生成时间**: 2026-03-10T13:41:14.442Z  
**Skill 名称**: docs-sync

---

## 📋 概述

审计知识库vs能力库，查找缺失、错误或过时的文档。当用户说"审计文档"、"同步知识库"、"检查文档完整性"、"验证知识条目"时使用。触发条件：添加新能力后、定期审计（每周）、发布前。 当用户说'审计文档'、'同步知识库'、'检查文档完整性'、'验证知识条目'时使用

---

## 🚀 使用方式

### 触发方式

- 用户说："审计文档"
- 用户说："审计文档"

### 使用示例

```bash
# 方式1：通过自然语言触发
用户说："审计文档"

# 方式2：手动运行脚本
node .agents/skills/docs-sync/scripts/main.js
```

---

## 📖 详细说明

### 功能特点

- 审计知识库vs能力库
- 查找缺失文档
- 检测错误或过时内容
- 生成同步报告

### 执行步骤

1. 读取能力库
2. 读取知识库
3. 比较一致性
4. 生成同步报告

---

## ⚠️ 故障排查

### 常见问题

**问题1: 知识条目缺失**
- 检查 public/knowledge_base/
- 运行 npm run sync

**问题2: 能力未同步**
- 检查 Redis 连接
- 重新运行 sync

---

## 📚 相关文档

- [Anthropic 官方 Skill 最佳实践](../knowledge_base/anthropic-skill-best-practices-2026-03-10.md)
- [OpenClaw Skills 文档](https://docs.openclaw.ai)

---

## 🔗 相关 Skills

- [code-change-verification](./code-change-verification.md)
- [heartbeat-orchestrator](./heartbeat-orchestrator.md)

---

_最后更新: 2026-03-10T13:41:14.442Z_
