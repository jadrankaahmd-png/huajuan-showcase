#!/usr/bin/env python3
"""
第一层能力管理系统 - 数据库初始化脚本
Phase 1: 数据库设计和创建
"""

import sqlite3
import json
import os
from datetime import datetime

# 数据库路径
DB_PATH = 'data/capabilities.db'

def create_database():
    """创建数据库和表结构"""
    print("📦 创建 SQLite 数据库...")
    
    # 确保目录存在
    os.makedirs('data', exist_ok=True)
    
    # 连接数据库（如果不存在则创建）
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # 创建 capabilities 表
    print("  ├─ 创建 capabilities 表...")
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS capabilities (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            category TEXT NOT NULL,
            name TEXT NOT NULL,
            description TEXT,
            status TEXT DEFAULT 'active',
            type TEXT,
            icon TEXT,
            details_json TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(category, name)
        )
    ''')
    
    # 创建索引
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_category ON capabilities(category)')
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_status ON capabilities(status)')
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_created ON capabilities(created_at)')
    
    print("  ✅ capabilities 表创建成功")
    
    # 创建 knowledge_base 表
    print("  ├─ 创建 knowledge_base 表...")
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS knowledge_base (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            file_path TEXT NOT NULL UNIQUE,
            title TEXT NOT NULL,
            source TEXT,
            date TEXT,
            summary TEXT,
            category TEXT,
            synced_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            in_capabilities INTEGER DEFAULT 0
        )
    ''')
    
    # 创建索引
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_kb_date ON knowledge_base(date)')
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_kb_synced ON knowledge_base(synced_at)')
    
    print("  ✅ knowledge_base 表创建成功")
    
    # 创建 statistics 表
    print("  ├─ 创建 statistics 表...")
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS statistics (
            id INTEGER PRIMARY KEY CHECK (id = 1),
            total_capabilities INTEGER DEFAULT 0,
            total_knowledge_base INTEGER DEFAULT 0,
            last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            version TEXT DEFAULT '1.0.0'
        )
    ''')
    
    # 插入初始统计记录
    cursor.execute('''
        INSERT OR IGNORE INTO statistics (id, total_capabilities, total_knowledge_base)
        VALUES (1, 0, 0)
    ''')
    
    print("  ✅ statistics 表创建成功")
    
    conn.commit()
    conn.close()
    
    print("✅ 数据库创建完成：data/capabilities.db\n")

def verify_database():
    """验证数据库结构"""
    print("🔍 验证数据库结构...")
    
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # 检查表是否存在
    cursor.execute("""
        SELECT name FROM sqlite_master 
        WHERE type='table' AND name IN ('capabilities', 'knowledge_base', 'statistics')
    """)
    tables = [row[0] for row in cursor.fetchall()]
    
    print(f"  ├─ 表结构：{', '.join(tables)}")
    
    # 检查索引
    cursor.execute("""
        SELECT name FROM sqlite_master 
        WHERE type='index' AND tbl_name IN ('capabilities', 'knowledge_base')
    """)
    indexes = [row[0] for row in cursor.fetchall()]
    
    print(f"  ├─ 索引数量：{len(indexes)}")
    
    # 检查统计信息
    cursor.execute("SELECT * FROM statistics WHERE id = 1")
    stats = cursor.fetchone()
    
    print(f"  ├─ 初始统计：capabilities={stats[1]}, knowledge_base={stats[2]}")
    
    conn.close()
    
    print("✅ 数据库验证通过\n")

if __name__ == '__main__':
    print("=" * 60)
    print("Phase 1: 数据库初始化")
    print("=" * 60)
    print()
    
    create_database()
    verify_database()
    
    print("=" * 60)
    print("✅ Phase 1 完成：数据库已创建")
    print("=" * 60)
