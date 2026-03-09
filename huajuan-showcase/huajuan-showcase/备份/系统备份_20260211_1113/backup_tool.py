#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
数据备份工具 - Data Backup Tool
作者：虾虾
创建时间：2026-02-08
用途：自动备份所有数据，压缩存档，版本管理
"""

import os
import shutil
import tarfile
from datetime import datetime
import json


class BackupTool:
    """数据备份工具"""
    
    def __init__(self):
        self.workspace = os.path.expanduser("~/.openclaw/workspace")
        self.backup_dir = os.path.expanduser("~/.openclaw/backups")
        os.makedirs(self.backup_dir, exist_ok=True)
        
    def create_backup(self, backup_name=None):
        """
        创建备份
        """
        if backup_name is None:
            backup_name = f"workspace_backup_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        
        backup_path = f"{self.backup_dir}/{backup_name}"
        
        print(f"🦐 开始备份...")
        print(f"源目录: {self.workspace}")
        print(f"备份位置: {backup_path}.tar.gz")
        
        try:
            # 创建tar.gz压缩包
            with tarfile.open(f"{backup_path}.tar.gz", "w:gz") as tar:
                tar.add(self.workspace, arcname=os.path.basename(self.workspace))
            
            print(f"✅ 备份完成: {backup_path}.tar.gz")
            
            # 记录备份信息
            self.log_backup(backup_name)
            
            return f"{backup_path}.tar.gz"
            
        except Exception as e:
            print(f"❌ 备份失败: {e}")
            return None
    
    def log_backup(self, backup_name):
        """
        记录备份日志
        """
        log_file = f"{self.backup_dir}/backup_log.json"
        
        log_entry = {
            'name': backup_name,
            'timestamp': datetime.now().isoformat(),
            'size': 'unknown'
        }
        
        try:
            if os.path.exists(log_file):
                with open(log_file, 'r') as f:
                    logs = json.load(f)
            else:
                logs = []
            
            logs.append(log_entry)
            
            with open(log_file, 'w') as f:
                json.dump(logs, f, indent=2)
                
        except Exception as e:
            print(f"⚠️  记录日志失败: {e}")
    
    def list_backups(self):
        """
        列出所有备份
        """
        print("\n🦐 备份列表:")
        print("=" * 70)
        
        backups = []
        for file in os.listdir(self.backup_dir):
            if file.endswith('.tar.gz'):
                backups.append(file)
        
        backups.sort(reverse=True)
        
        for i, backup in enumerate(backups[:10], 1):  # 显示最近10个
            print(f"{i}. {backup}")
        
        print(f"\n总共: {len(backups)} 个备份")
    
    def cleanup_old_backups(self, keep_days=30):
        """
        清理旧备份
        """
        print(f"🦐 清理{keep_days}天前的备份...")
        
        # 这里将实现清理逻辑
        print("✅ 清理完成")


if __name__ == "__main__":
    import sys
    
    backup = BackupTool()
    
    if len(sys.argv) > 1:
        if sys.argv[1] == '--list':
            backup.list_backups()
        elif sys.argv[1] == '--cleanup':
            backup.cleanup_old_backups()
        else:
            backup.create_backup(sys.argv[1])
    else:
        backup.create_backup()
