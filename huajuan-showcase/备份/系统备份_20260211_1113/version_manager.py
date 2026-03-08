#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
版本管理器 - Version Manager
作者：虾虾
创建时间：2026-02-09
用途：工具版本管理，更新检查，回滚功能
"""

import os
import json
import shutil
from datetime import datetime


class VersionManager:
    """版本管理器"""
    
    def __init__(self):
        self.tools_dir = os.path.expanduser("~/.openclaw/workspace/tools")
        self.backup_dir = os.path.expanduser("~/.openclaw/workspace/版本备份")
        self.version_file = os.path.expanduser("~/.openclaw/workspace/tool_versions.json")
        os.makedirs(self.backup_dir, exist_ok=True)
    
    def get_tool_version(self, tool_name):
        """获取工具版本信息"""
        tool_path = os.path.join(self.tools_dir, f"{tool_name}.py")
        
        if not os.path.exists(tool_path):
            return None
        
        # 使用文件修改时间作为版本
        mtime = os.path.getmtime(tool_path)
        return {
            'name': tool_name,
            'version': datetime.fromtimestamp(mtime).strftime('%Y%m%d_%H%M%S'),
            'modified': datetime.fromtimestamp(mtime).isoformat()
        }
    
    def list_all_versions(self):
        """列出所有工具版本"""
        print("🦐 工具版本管理")
        print("=" * 70)
        
        tools = []
        for file in os.listdir(self.tools_dir):
            if file.endswith('.py'):
                tool_name = file[:-3]
                version = self.get_tool_version(tool_name)
                if version:
                    tools.append(version)
        
        # 按修改时间排序
        tools.sort(key=lambda x: x['modified'], reverse=True)
        
        print(f"\n共 {len(tools)} 个工具:\n")
        print(f"{'工具名称':<30} {'版本':<20} {'修改时间':<20}")
        print("-" * 70)
        
        for tool in tools[:20]:  # 显示最近20个
            print(f"{tool['name']:<30} {tool['version']:<20} {tool['modified'][:19]:<20}")
        
        print("\n" + "=" * 70)
    
    def backup_tool(self, tool_name):
        """备份工具"""
        tool_path = os.path.join(self.tools_dir, f"{tool_name}.py")
        
        if not os.path.exists(tool_path):
            print(f"❌ 工具不存在: {tool_name}")
            return
        
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        backup_path = os.path.join(self.backup_dir, f"{tool_name}_{timestamp}.py")
        
        shutil.copy2(tool_path, backup_path)
        print(f"✅ 已备份: {backup_path}")
    
    def restore_tool(self, tool_name, version):
        """恢复工具到指定版本"""
        backup_file = os.path.join(self.backup_dir, f"{tool_name}_{version}.py")
        tool_path = os.path.join(self.tools_dir, f"{tool_name}.py")
        
        if not os.path.exists(backup_file):
            print(f"❌ 备份不存在: {backup_file}")
            return
        
        # 先备份当前版本
        self.backup_tool(tool_name)
        
        # 恢复
        shutil.copy2(backup_file, tool_path)
        print(f"✅ 已恢复: {tool_name} -> {version}")


def main():
    """主函数"""
    import sys
    
    vm = VersionManager()
    
    if len(sys.argv) > 1:
        if sys.argv[1] == '--list':
            vm.list_all_versions()
        elif sys.argv[1] == '--backup' and len(sys.argv) > 2:
            vm.backup_tool(sys.argv[2])
        elif sys.argv[1] == '--restore' and len(sys.argv) > 3:
            vm.restore_tool(sys.argv[2], sys.argv[3])
        else:
            print("用法:")
            print("  python version_manager.py --list")
            print("  python version_manager.py --backup <工具名>")
            print("  python version_manager.py --restore <工具名> <版本>")
    else:
        vm.list_all_versions()


if __name__ == "__main__":
    main()
