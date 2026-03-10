#!/bin/bash

/**
 * 🌸 Claude Code 终端集成
 * 
 * 功能：
 * 1. 优化现有脚本质量
 * 2. 自动调试 scripts/ 目录下的脚本
 * 3. 生成测试用例
 */

echo "🌸 Claude Code 终端集成"
echo "======================"
echo ""

# 项目根目录
PROJECT_ROOT="/Users/fox/.openclaw/workspace/huajuan-showcase"
SCRIPTS_DIR="$PROJECT_ROOT/scripts"

# 检查 Claude Code 是否安装
if ! command -v claude-code &> /dev/null; then
    echo "⚠️  Claude Code 未安装"
    echo ""
    echo "📖 安装方法："
    echo ""
    echo "1. 安装 Claude CLI："
    echo "   npm install -g @anthropic-ai/claude-code"
    echo ""
    echo "2. 配置 API Key："
    echo "   export ANTHROPIC_API_KEY=your_api_key"
    echo ""
    echo "3. 验证安装："
    echo "   claude-code --version"
    echo ""
    echo "📚 文档：https://docs.anthropic.com/claude-code"
    exit 1
fi

echo "✅ Claude Code 已安装"
echo ""

# 功能1：优化脚本质量
echo "📝 功能1：优化脚本质量"
echo "----------------------"
echo ""

# 列出需要优化的脚本
echo "待优化脚本："
ls -1 "$SCRIPTS_DIR"/*.js 2>/dev/null | head -10
echo ""

echo "💡 优化建议："
echo ""
echo "1. 优化 heartbeat.js："
echo "   claude-code optimize $SCRIPTS_DIR/heartbeat.js"
echo ""
echo "2. 优化 memory-loader.js："
echo "   claude-code optimize $SCRIPTS_DIR/memory-loader.js"
echo ""
echo "3. 优化 audit-security.js："
echo "   claude-code optimize $SCRIPTS_DIR/audit-security.js"
echo ""

# 功能2：自动调试
echo "🐛 功能2：自动调试脚本"
echo "----------------------"
echo ""

echo "调试命令："
echo ""
echo "1. 调试错误："
echo "   claude-code debug $SCRIPTS_DIR/heartbeat.js"
echo ""
echo "2. 检查类型错误："
echo "   claude-code type-check $SCRIPTS_DIR/audit-security.js"
echo ""
echo "3. 性能分析："
echo "   claude-code analyze $SCRIPTS_DIR/memory-loader.js"
echo ""

# 功能3：生成测试用例
echo "🧪 功能3：生成测试用例"
echo "----------------------"
echo ""

TEST_DIR="$PROJECT_ROOT/tests"
mkdir -p "$TEST_DIR"

echo "测试用例生成："
echo ""
echo "1. 为 heartbeat.js 生成测试："
echo "   claude-code generate test $SCRIPTS_DIR/heartbeat.js > $TEST_DIR/heartbeat.test.js"
echo ""
echo "2. 为 memory-loader.js 生成测试："
echo "   claude-code generate test $SCRIPTS_DIR/memory-loader.js > $TEST_DIR/memory-loader.test.js"
echo ""
echo "3. 为 audit-security.js 生成测试："
echo "   claude-code generate test $SCRIPTS_DIR/audit-security.js > $TEST_DIR/audit-security.test.js"
echo ""

# 批量优化脚本
echo "🔄 批量优化脚本"
echo "----------------"
echo ""

echo "批量优化命令："
echo ""
echo "for script in $SCRIPTS_DIR/*.js; do"
echo "  echo \"优化: \$script\""
echo "  claude-code optimize \"\$script\""
echo "done"
echo ""

echo "✅ Claude Code 终端集成配置完成"
echo ""
echo "💡 提示："
echo "  - 确保已安装 Claude CLI"
echo "  - 设置 ANTHROPIC_API_KEY 环境变量"
echo "  - 使用 claude-code --help 查看更多命令"
