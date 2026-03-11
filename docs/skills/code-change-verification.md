# code-change-verification - 使用文档

**生成时间**: 2026-03-10T13:41:14.441Z  
**Skill 名称**: code-change-verification

---

## 📋 概述

运行强制验证栈（npm run sync、Redis 验证、统计验证）当能力或知识库改变时。当用户说"验证代码变更"、"检查 Redis 数据"、"同步能力"、"验证统计"时使用。触发条件：修改 data/custom-capabilities.json、public/knowledge_base/、scripts/ 后必须运行。

---

## 🚀 使用方式

### 触发方式

- 用户说："验证代码变更"

### 使用示例

```bash
# 方式1：通过自然语言触发
用户说："验证代码变更"

# 方式2：手动运行脚本
node .agents/skills/code-change-verification/scripts/main.js
```

---

## 📖 详细说明

### 功能特点

- 自动运行验证栈
- 检查 Redis 数据完整性
- 验证统计数字准确性
- 生成详细报告

### 执行步骤

1. 运行 `npm run sync`
2. 验证 Redis 数据
3. 验证统计数字
4. 生成验证报告

---

## ⚠️ 故障排查

### 常见问题

**问题1: npm run sync 失败**
- 检查 Redis 连接
- 检查数据文件

**问题2: 统计数字不准确**
- 重新运行 sync
- 检查 custom-capabilities.json

---

## 📚 相关文档

- [Anthropic 官方 Skill 最佳实践](../knowledge_base/anthropic-skill-best-practices-2026-03-10.md)
- [OpenClaw Skills 文档](https://docs.openclaw.ai)

---

## 🔗 相关 Skills

- [docs-sync](./docs-sync.md)
- [heartbeat-orchestrator](./heartbeat-orchestrator.md)

---

_最后更新: 2026-03-10T13:41:14.442Z_
