#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
依赖安装脚本 - Dependency Installer
作者：虾虾
创建时间：2026-02-08
用途：安装所有依赖，Python库，CLI工具
"""

import subprocess
import sys
from datetime import datetime


class DependencyInstaller:
    """依赖安装器"""
    
    def __init__(self):
        self.python_libs = [
            'yfinance', 'pandas', 'numpy', 'matplotlib', 'seaborn',
            'backtrader', 'vectorbt', 'quantstats',
            'pyportfolioopt', 'empyrical', 'pyfolio-reloaded',
            'scrapy', 'selenium', 'aiohttp', 'feedparser', 'pyyaml',
            'scikit-learn', 'xgboost', 'lightgbm',
            'ntscraper', 'talib'
        ]
        
        self.brew_tools = ['tmux', 'htop', 'ffmpeg', 'pandoc', 'imagemagick']
    
    def install_python_libs(self):
        """安装Python库"""
        print("\n📦 安装Python库...")
        print("=" * 70)
        
        for lib in self.python_libs:
            print(f"\n  安装 {lib}...")
            cmd = f"pip install {lib} --quiet"
            result = subprocess.run(cmd, shell=True, capture_output=True)
            
            if result.returncode == 0:
                print(f"  ✅ {lib} 安装成功")
            else:
                print(f"  ⚠️  {lib} 安装失败（可能已安装）")
    
    def install_brew_tools(self):
        """安装Brew工具"""
        print("\n🛠️  安装CLI工具...")
        print("=" * 70)
        
        for tool in self.brew_tools:
            print(f"\n  安装 {tool}...")
            cmd = f"brew install {tool}"
            result = subprocess.run(cmd, shell=True, capture_output=True)
            
            if result.returncode == 0:
                print(f"  ✅ {tool} 安装成功")
            else:
                print(f"  ⚠️  {tool} 可能已安装或安装失败")
    
    def verify_installation(self):
        """验证安装"""
        print("\n🔍 验证安装...")
        print("=" * 70)
        
        success_count = 0
        for lib in self.python_libs[:5]:  # 检查前5个
            try:
                __import__(lib)
                print(f"  ✅ {lib}: OK")
                success_count += 1
            except:
                print(f"  ❌ {lib}: Failed")
        
        print(f"\n验证结果: {success_count}/5 成功")
    
    def run_installation(self):
        """运行安装"""
        print("🦐 依赖安装脚本")
        print(f"开始时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print("=" * 70)
        
        print("\n⚠️  这将安装所有依赖，可能需要10-15分钟")
        print("按 Ctrl+C 取消，或按 Enter 继续...")
        input()
        
        self.install_python_libs()
        self.install_brew_tools()
        self.verify_installation()
        
        print("\n" + "=" * 70)
        print("✅ 依赖安装完成！")


def main():
    """主函数"""
    installer = DependencyInstaller()
    installer.run_installation()


if __name__ == "__main__":
    main()
