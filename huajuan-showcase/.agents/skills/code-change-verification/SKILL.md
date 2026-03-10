---
name: code-change-verification
description: 运行强制验证栈（npm run sync、Redis 验证、统计验证）当能力或知识库改变时。触发条件：修改 data/custom-capabilities.json、public/knowledge_base/、scripts/ 后必须运行。
---

# Code Change Verification

## 什么时候使用

**必须使用的情况**：
- ✅ 修改 `data/custom-capabilities.json`
- ✅ 修改 `public/knowledge_base/`
- ✅ 修改 `scripts/`
- ✅ 修改 Redis 相关配置
- ✅ Git push 前

---

## 执行步骤

### 1. 运行 npm run sync

```bash
cd /Users/fox/.openclaw/workspace/huajuan-showcase
npm run sync
```

**预期输出**：
```
✅ 从 SQLite 读取 612 条能力
✅ 从 custom-capabilities.json 读取 69 条自定义能力
📊 合并后总能力数: 642 条
✅ 写入 capabilities:all (642 条)
✅ 写入 stats:total
```

---

### 2. 验证 Redis 数据完整性

```bash
node scripts/verify-redis.js
```

**检查内容**：
- ✅ `capabilities:all` 是否存在
- ✅ `knowledge:items` 是否存在
- ✅ `stats:total` 是否存在
- ✅ 统计数字是否准确

---

### 3. 验证统计数字准确性

**公式**：
```
总计 = 主能力 + 知识库 + 子页面
     = (SQLite + 自定义能力) + (knowledge + books) + (iran + telegram + qveris)
     = (573 + 69) + (36 + 4) + (10 + 9 + 6)
     = 642 + 40 + 25
     = 707
```

**验证命令**：
```bash
node -e "
const { Redis } = require('@upstash/redis');
const redis = new Redis({
  url: 'https://valued-hamster-37498.upstash.io',
  token: 'AZJ6AAIncDE1YzRlYzY3NzI5OTU0MWIzOTM5YzNjMWE2NDkzMTkyZHAxMzc0OTg',
});
(async () => {
  const stats = await redis.get('stats:total');
  const expected = stats.mainCapabilities + stats.knowledge + stats.books + stats.iran + stats.telegram + stats.qveris;
  if (stats.grandTotal === expected) {
    console.log('✅ 统计数字准确:', stats.grandTotal);
  } else {
    console.log('❌ 统计数字不准确:');
    console.log('  预期:', expected);
    console.log('  实际:', stats.grandTotal);
  }
})();
"
```

---

### 4. 生成验证报告

**输出格式**：
```markdown
# Code Change Verification Report

**时间**：2026-03-10 18:30:00
**状态**：✅ 通过

---

## 验证结果

### 1. npm run sync
- ✅ 成功
- ✅ 主能力：642
- ✅ 自定义能力：69

### 2. Redis 数据完整性
- ✅ capabilities:all - 642 条
- ✅ knowledge:items - 36 条
- ✅ stats:total - 存在

### 3. 统计数字准确性
- ✅ 准确
- ✅ 总计：707

---

## 结论

✅ 所有验证通过，可以安全提交
```

---

## 输出

**成功时**：
```
✅ Code Change Verification 通过
✅ Redis 数据完整
✅ 统计数字准确
✅ 总计：707
```

**失败时**：
```
❌ Code Change Verification 失败

问题：
1. npm run sync 失败
2. Redis 数据不完整
3. 统计数字不准确

建议：
1. 运行 npm run sync
2. 检查 Redis 连接
3. 验证数据文件
```

---

## 自动化

### Git Hook 集成

**`.git/hooks/pre-push`**：
```bash
#!/bin/bash

echo "🔄 Git push 前自动验证..."

# 运行 code-change-verification
cd /Users/fox/.openclaw/workspace/huajuan-showcase
npm run sync

if [ $? -ne 0 ]; then
  echo "❌ 验证失败，取消 push"
  exit 1
fi

echo "✅ 验证通过，继续 push"
exit 0
```

---

## 相关 Skills

- `$docs-sync` - 文档同步审计
- `$final-release-review` - 发布前检查

---

_最后更新：2026-03-10_
_版本：1.0.0_
