#!/usr/bin/env python3
"""
第一层能力管理系统 - 数据迁移脚本（JSON版）
Phase 1: 从 JSON 文件迁移能力到数据库
"""

import sqlite3
import json
import os
from datetime import datetime

DB_PATH = 'data/capabilities.db'
JSON_PATH = '/tmp/capabilities.json'

def migrate_from_json():
    """从 JSON 文件迁移能力到数据库"""
    print(f"📄 读取 JSON 文件...")
    
    with open(JSON_PATH, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    total_extracted = data['total']
    total_expected = data['expectedTotal']
    capabilities = data['capabilities']
    
    print(f"  ├─ 提取了 {total_extracted} 个能力")
    print(f"  ├─ 期望总数 {total_expected} 个")
    print(f"  ✅ 数据加载完成\n")
    
    print(f"💾 迁移能力到数据库...")
    
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    success_count = 0
    duplicate_count = 0
    
    for cap in capabilities:
        try:
            cursor.execute('''
                INSERT INTO capabilities (category, name, description, status, type, icon, details_json)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            ''', (
                cap['category'],
                cap['name'],
                cap['description'],
                cap['status'],
                cap['type'],
                cap['icon'],
                json.dumps(cap['details'], ensure_ascii=False)
            ))
            success_count += 1
        except sqlite3.IntegrityError:
            duplicate_count += 1
    
    # 更新统计信息
    cursor.execute('''
        UPDATE statistics 
        SET total_capabilities = (SELECT COUNT(*) FROM capabilities),
            last_updated = CURRENT_TIMESTAMP
        WHERE id = 1
    ''')
    
    conn.commit()
    conn.close()
    
    print(f"  ├─ 成功迁移：{success_count} 个")
    print(f"  ├─ 重复跳过：{duplicate_count} 个")
    print(f"  ✅ 迁移完成\n")
    
    return success_count

def verify_migration(expected_total):
    """验证迁移结果"""
    print(f"🔍 验证迁移结果...")
    
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # 统计总数
    cursor.execute("SELECT COUNT(*) FROM capabilities")
    total = cursor.fetchone()[0]
    
    # 按分类统计
    cursor.execute("""
        SELECT category, COUNT(*) as count 
        FROM capabilities 
        GROUP BY category 
        ORDER BY count DESC
        LIMIT 10
    """)
    categories = cursor.fetchall()
    
    print(f"  ├─ 总能力数：{total}")
    print(f"  ├─ 期望数量：{expected_total}")
    print(f"  ├─ 分类数量：{len(categories)}")
    print(f"  ├─ 前10个分类：")
    for cat, count in categories:
        print(f"  │    - {cat}: {count} 个")
    
    # 检查统计表
    cursor.execute("SELECT total_capabilities, last_updated FROM statistics WHERE id = 1")
    stats = cursor.fetchone()
    
    print(f"  ├─ 统计表：{stats[0]} 个能力")
    print(f"  ├─ 最后更新：{stats[1]}")
    
    conn.close()
    
    # 验证总数
    if total == expected_total:
        print(f"  ✅ 迁移成功（{total}个能力）\n")
        return True
    else:
        print(f"  ⚠️  数量不一致（期望{expected_total}，实际{total}）\n")
        return False

if __name__ == '__main__':
    print("=" * 60)
    print("Phase 1: 能力数据迁移（JSON版）")
    print("=" * 60)
    print()
    
    success_count = migrate_from_json()
    success = verify_migration(success_count)
    
    print("=" * 60)
    if success:
        print(f"✅ Phase 1 完成：已迁移 {success_count} 个能力")
    else:
        print(f"⚠️  Phase 1 部分完成：迁移了 {success_count} 个能力")
    print("=" * 60)
