#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
配置检查脚本 - Config Checker
作者：虾虾
创建时间：2026-02-08
用途：检查所有配置，API密钥，Python库，文件权限
"""

import os
import sys
import subprocess
from datetime import datetime


class ConfigChecker:
    """配置检查器"""
    
    def __init__(self):
        self.workspace = os.path.expanduser("~/.openclaw/workspace")
        self.check_results = []
    
    def check_api_keys(self):
        """检查API密钥"""
        print("\n🔑 检查API密钥...")
        
        required_apis = [
            'MARKETAUX_API_KEY',
            'NEWSAPI_KEY',
            'BRAVE_API_KEY',
            'ALPHA_VANTAGE_API_KEY',
            'FINNHUB_API_KEY'
        ]
        
        for api in required_apis:
            value = os.getenv(api, '')
            if value:
                print(f"  ✅ {api}: 已配置")
                self.check_results.append({'item': api, 'status': 'OK'})
            else:
                print(f"  ❌ {api}: 未配置")
                self.check_results.append({'item': api, 'status': 'MISSING'})
    
    def check_python_libs(self):
        """检查Python库"""
        print("\n📦 检查Python库...")
        
        required_libs = [
            'yfinance', 'pandas', 'numpy', 'matplotlib',
            'backtrader', 'vectorbt', 'quantstats',
            'sklearn', 'xgboost', 'lightgbm'
        ]
        
        for lib in required_libs:
            try:
                __import__(lib)
                print(f"  ✅ {lib}: 已安装")
                self.check_results.append({'item': lib, 'status': 'OK'})
            except ImportError:
                print(f"  ❌ {lib}: 未安装")
                self.check_results.append({'item': lib, 'status': 'MISSING'})
    
    def check_cli_tools(self):
        """检查CLI工具"""
        print("\n🛠️  检查CLI工具...")
        
        tools = ['tmux', 'htop', 'ffmpeg', 'pandoc']
        
        for tool in tools:
            result = subprocess.run(['which', tool], capture_output=True)
            if result.returncode == 0:
                print(f"  ✅ {tool}: 已安装")
                self.check_results.append({'item': tool, 'status': 'OK'})
            else:
                print(f"  ❌ {tool}: 未安装")
                self.check_results.append({'item': tool, 'status': 'MISSING'})
    
    def check_directories(self):
        """检查目录结构"""
        print("\n📁 检查目录结构...")
        
        required_dirs = [
            'tools',
            'KOL储备库',
            '大师储备库',
            '知识储备库',
            '工具库',
            'memory'
        ]
        
        for dir_name in required_dirs:
            path = f"{self.workspace}/{dir_name}"
            if os.path.exists(path):
                print(f"  ✅ {dir_name}: 存在")
                self.check_results.append({'item': dir_name, 'status': 'OK'})
            else:
                print(f"  ❌ {dir_name}: 不存在")
                self.check_results.append({'item': dir_name, 'status': 'MISSING'})
    
    def generate_report(self):
        """生成检查报告"""
        print("\n" + "=" * 70)
        print("📊 配置检查报告")
        print("=" * 70)
        
        ok_count = sum(1 for r in self.check_results if r['status'] == 'OK')
        missing_count = len(self.check_results) - ok_count
        
        print(f"\n总计: {len(self.check_results)} 项")
        print(f"✅ 正常: {ok_count}")
        print(f"❌ 缺失: {missing_count}")
        print(f"成功率: {ok_count/len(self.check_results)*100:.1f}%")
        
        if missing_count > 0:
            print("\n⚠️  需要修复的项目:")
            for r in self.check_results:
                if r['status'] == 'MISSING':
                    print(f"   • {r['item']}")
        
        print("\n" + "=" * 70)
        print(f"检查时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print("✅ 配置检查完成！")
    
    def run_all_checks(self):
        """运行所有检查"""
        print("🦐 配置检查脚本")
        print(f"开始时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print("=" * 70)
        
        self.check_api_keys()
        self.check_python_libs()
        self.check_cli_tools()
        self.check_directories()
        self.generate_report()


def main():
    """主函数"""
    checker = ConfigChecker()
    checker.run_all_checks()


if __name__ == "__main__":
    main()
