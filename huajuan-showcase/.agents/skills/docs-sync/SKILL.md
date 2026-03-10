---
name: docs-sync
description: 审计知识库vs能力库，查找缺失、错误或过时的文档。触发条件：添加新能力后、定期审计（每周）、发布前。
---

# Docs Sync 自动审计

## 什么时候使用

**必须使用的情况**：
- ✅ 添加新能力后
- ✅ 定期审计（每周）
- ✅ 发布前
- ✅ 发现知识库与能力库不一致时

---

## 执行步骤

### 1. 读取能力库

```bash
# 从 Redis 读取所有能力
node -e "
const { Redis } = require('@upstash/redis');
const redis = new Redis({
  url: 'https://valued-hamster-37498.upstash.io',
  token: 'AZJ6AAIncDE1YzRlYzY3NzI5OTU0MWIzOTM5YzNjMWE2NDkzMTkyZHAxMzc0OTg',
});
(async () => {
  const capabilities = await redis.get('capabilities:all');
  console.log('能力总数:', capabilities.length);
  
  // 提取能力名称
  const names = capabilities.map(c => c.name);
  console.log('能力名称:', names.slice(0, 10));
})();
"
```

---

### 2. 读取知识库

```bash
# 读取 public/knowledge_base/ 目录
ls -1 public/knowledge_base/*.md | wc -l
```

---

### 3. 比较知识库 vs 能力库

**检查1：知识条目没有对应能力**
```bash
# 读取知识条目标题
for file in public/knowledge_base/*.md; do
  title=$(head -1 "$file" | sed 's/^# //')
  echo "知识条目: $title"
done

# 检查是否有对应能力
# （需要手动对比或使用脚本）
```

**检查2：能力没有对应知识条目**
```bash
# 读取能力名称
node -e "
const { Redis } = require('@upstash/redis');
const redis = new Redis({
  url: 'https://valued-hamster-37498.upstash.io',
  token: 'AZJ6AAIncDE1YzRlYzY3NzI5OTU0MWIzOTM5YzNjMWE2NDkzMTkyZHAxMzc0OTg',
});
(async () => {
  const capabilities = await redis.get('capabilities:all');
  const names = capabilities.map(c => c.name);
  
  // 检查是否有知识条目
  // （需要对比 public/knowledge_base/ 文件名）
  console.log('能力数:', names.length);
})();
"
```

---

### 4. 生成同步报告

**输出格式**：
```markdown
# Docs Sync Report

**时间**：2026-03-10 18:30:00
**状态**：⚠️ 需要同步

---

## 知识库统计

- **知识条目**：36 个
- **能力库**：642 个
- **覆盖率**：5.6%

---

## 不一致列表

### 知识条目缺少对应能力（0 个）
无

### 能力缺少知识条目（606 个）

**高优先级（10 个）**：
1. HBM4技术竞争格局深度分析 - stock-analysis
2. DRAM技术路线图追踪 - stock-analysis
3. 半导体行业竞争分析能力 - stock-analysis
4. MCP服务器集成实现 - api
5. Claude Code终端集成 - development-tools
6. 高级MCP模式实现 - api
7. AGENTS.md仓库级指令系统 - systems
8. Code Change Verification - automation
9. Docs Sync自动审计 - documentation
10. Examples Auto Run - automation

**低优先级（596 个）**：
（略）

---

## 建议

1. ✅ 为高优先级能力创建知识条目
2. ⏳ 定期更新知识条目
3. ⏳ 建立自动化同步机制

---

_最后更新：2026-03-10 18:30:00_
```

---

## 输出

**一致时**：
```
✅ Docs Sync 通过
✅ 知识库与能力库一致
✅ 覆盖率：100%
```

**不一致时**：
```
⚠️ Docs Sync 发现不一致

知识条目缺少对应能力：0 个
能力缺少知识条目：606 个

建议：
1. 为高优先级能力创建知识条目
2. 建立自动化同步机制
```

---

## 自动化

### 定期审计

**crontab 配置**：
```bash
# 每周一 09:00 运行 docs-sync
0 9 * * 1 cd /Users/fox/.openclaw/workspace && node .agents/skills/docs-sync/scripts/audit.js
```

---

## 相关 Skills

- `$code-change-verification` - 代码变更验证
- `$final-release-review` - 发布前检查

---

_最后更新：2026-03-10_
_版本：1.0.0_
