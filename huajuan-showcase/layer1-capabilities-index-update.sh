#!/bin/bash
# 更新 layer1-capabilities-index.md 的 knowledge-base 分类

FILE="/Users/fox/.openclaw/workspace/layer1-capabilities-index.md"

# 先解锁文件
chflags nouchg "$FILE"

# 使用 sed 替换 knowledge-base 分类
sed -i.bak 's/### 18. 知识库系统 (knowledge-base) - 15个/### 18. 知识库系统 (knowledge-base) - 16个/' "$FILE"

# 在 knowledge-base 分类末尾添加新能力
sed -i.bak '/GLM MCP 深度测试成功$/a\
、$AAOI 1.6T数据中心收发器首单分析 ⭐ 新增' "$FILE"

# 更新总能力数
sed -i.bak 's/\*\*小计：\*\* 603 个能力/**小计：** 604 个能力/' "$FILE"

echo "✅ layer1-capabilities-index.md 已更新"
