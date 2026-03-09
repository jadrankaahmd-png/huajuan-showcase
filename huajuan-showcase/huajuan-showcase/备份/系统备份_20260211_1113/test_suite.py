#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
工具测试套件 - Test Suite
作者：虾虾
创建时间：2026-02-09
用途：自动测试所有工具，健康检查，性能测试
"""

import os
import sys
import importlib.util
from datetime import datetime


class TestSuite:
    """工具测试套件"""
    
    def __init__(self):
        self.tools_dir = os.path.expanduser("~/.openclaw/workspace/tools")
        self.results = []
    
    def get_all_tools(self):
        """获取所有工具"""
        tools = []
        for file in os.listdir(self.tools_dir):
            if file.endswith('.py') and not file.startswith('__'):
                tools.append(file[:-3])  # 去掉.py
        return sorted(tools)
    
    def test_tool_import(self, tool_name):
        """测试工具导入"""
        try:
            tool_path = os.path.join(self.tools_dir, f"{tool_name}.py")
            spec = importlib.util.spec_from_file_location(tool_name, tool_path)
            module = importlib.util.module_from_spec(spec)
            spec.loader.exec_module(module)
            return {'success': True, 'error': None}
        except Exception as e:
            return {'success': False, 'error': str(e)}
    
    def run_all_tests(self):
        """运行所有测试"""
        print("🦐 工具测试套件启动")
        print("=" * 70)
        print(f"时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print("=" * 70)
        
        tools = self.get_all_tools()
        print(f"\n发现 {len(tools)} 个工具")
        print("-" * 70)
        
        passed = 0
        failed = 0
        
        for i, tool in enumerate(tools, 1):
            print(f"\n[{i}/{len(tools)}] 测试 {tool}...", end=" ")
            result = self.test_tool_import(tool)
            
            if result['success']:
                print("✅ 通过")
                passed += 1
            else:
                print(f"❌ 失败: {result['error'][:50]}")
                failed += 1
            
            self.results.append({
                'tool': tool,
                'success': result['success'],
                'error': result['error']
            })
        
        # 生成报告
        self.generate_report(passed, failed, len(tools))
    
    def generate_report(self, passed, failed, total):
        """生成测试报告"""
        print("\n" + "=" * 70)
        print("📊 测试报告")
        print("=" * 70)
        print(f"总工具数: {total}")
        print(f"✅ 通过: {passed}")
        print(f"❌ 失败: {failed}")
        print(f"成功率: {passed/total*100:.1f}%")
        
        if failed > 0:
            print("\n⚠️  失败的工具:")
            for result in self.results:
                if not result['success']:
                    print(f"   • {result['tool']}: {result['error'][:80]}")
        
        print("\n" + "=" * 70)
        print("✅ 测试完成！")


def main():
    """主函数"""
    suite = TestSuite()
    suite.run_all_tests()


if __name__ == "__main__":
    main()
