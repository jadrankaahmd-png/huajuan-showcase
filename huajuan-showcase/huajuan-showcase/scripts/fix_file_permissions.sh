#!/bin/bash
#
# 文件权限自动修复脚本
# 
# 用法：bash scripts/fix_file_permissions.sh
#
# 功能：
# 1. 解锁所有文件（移除 uchg 标志）
# 2. 设置可写权限
# 3. 验证修复结果
#

WORKSPACE="/Users/fox/.openclaw/workspace/huajuan-showcase"

echo "🔧 开始修复文件权限..."
echo ""

# 1. 解锁文件
echo "📦 步骤1：解锁文件（移除 uchg 标志）..."
chflags -R nouchg "$WORKSPACE" 2>/dev/null
echo "✅ 完成"
echo ""

# 2. 设置可写权限
echo "🔐 步骤2：设置可写权限..."
chmod -R u+w "$WORKSPACE" 2>/dev/null
echo "✅ 完成"
echo ""

# 3. 验证
echo "✅ 步骤3：验证修复结果..."
LOCKED_FILES=$(find "$WORKSPACE" -flags uchg 2>/dev/null | wc -l)

if [ "$LOCKED_FILES" -eq 0 ]; then
  echo "✅ 所有文件已解锁"
else
  echo "⚠️  发现 $LOCKED_FILES 个文件仍被锁定"
  find "$WORKSPACE" -flags uchg 2>/dev/null
fi

echo ""
echo "🎉 文件权限修复完成！"
