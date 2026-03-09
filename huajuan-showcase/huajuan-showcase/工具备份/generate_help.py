#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
使用指南生成器 - Help Generator
作者：虾虾
创建时间：2026-02-08
用途：生成工具使用手册，Markdown格式
"""

import os
from datetime import datetime


class HelpGenerator:
    """使用指南生成器"""
    
    def __init__(self):
        self.workspace = os.path.expanduser("~/.openclaw/workspace")
        self.tools_dir = f"{self.workspace}/tools"
        self.output_file = f"{self.workspace}/工具使用手册.md"
    
    def get_tools_list(self):
        """获取工具列表"""
        tools = []
        
        if os.path.exists(self.tools_dir):
            for file in os.listdir(self.tools_dir):
                if file.endswith('.py'):
                    tools.append(file)
        
        return sorted(tools)
    
    def generate_manual(self):
        """生成使用手册"""
        print("🦐 生成工具使用手册...")
        
        tools = self.get_tools_list()
        
        content = []
        content.append("# 虾虾金融工具使用手册")
        content.append(f"\n**生成时间:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        content.append(f"\n**工具总数:** {len(tools)} 个")
        content.append("\n---\n")
        
        # 分类
        categories = {
            '数据分析': ['screener', 'optimizer', 'risk', 'correlation', 'technical', 'volatility', 'backtest', 'macro'],
            '市场情绪': ['sentiment', 'news', 'pattern', 'short', 'flow', 'breadth'],
            '资金流向': ['fund', 'insider', 'earnings'],
            '期权': ['options'],
            '报告': ['report', 'visualization', 'pdf', 'tts'],
            '监控': ['twitter', 'rss', 'telegram', 'ipo', 'crypto', 'global'],
            '系统': ['backup', 'check', 'install', 'setup', 'master', 'workflow']
        }
        
        for category, keywords in categories.items():
            content.append(f"\n## {category}类工具\n")
            
            for tool in tools:
                if any(kw in tool.lower() for kw in keywords):
                    content.append(f"\n### {tool}\n")
                    content.append(f"**命令:** `python3 {tool}`\n")
                    content.append(f"**位置:** `tools/{tool}`\n")
                    content.append("\n---\n")
        
        # 保存
        with open(self.output_file, 'w', encoding='utf-8') as f:
            f.write('\n'.join(content))
        
        print(f"✅ 使用手册已生成: {self.output_file}")
        print(f"   包含 {len(tools)} 个工具的说明")


def main():
    """主函数"""
    generator = HelpGenerator()
    generator.generate_manual()


if __name__ == "__main__":
    main()
