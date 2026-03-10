#!/usr/bin/env python3
"""
第一层能力管理系统 - 数据迁移脚本
Phase 1: 将现有 capabilities.ts 迁移到数据库
"""

import sqlite3
import json
import re
import os
from datetime import datetime

DB_PATH = 'data/capabilities.db'
CAPABILITIES_FILE = 'app/data/capabilities.ts'

def extract_capabilities_from_ts():
    """从 capabilities.ts 提取能力数据"""
    print(f"📄 读取 capabilities.ts...")
    
    with open(CAPABILITIES_FILE, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 提取 capabilities 数组
    # 匹配格式：{ category: 'xxx', name: 'xxx', ... }
    capabilities = []
    
    # 使用正则表达式提取分类
    category_pattern = r"\{\s*category:\s*'([^']+)',\s*name:\s*'([^']+)',.*?items:\s*\[(.*?)\]\s*\}"
    
    matches = re.finditer(category_pattern, content, re.DOTALL)
    
    for match in matches:
        category = match.group(1)
        category_name = match.group(2)
        items_str = match.group(3)
        
        print(f"  ├─ 处理分类：{category} ({category_name})")
        
        # 提取该分类下的所有条目
        item_pattern = r"\{\s*name:\s*'([^']*(?:\\'[^']*)*)'"
        item_matches = re.finditer(item_pattern, items_str)
        
        for item_match in item_matches:
            item_name = item_match.group(1).replace("\\'", "'")
            capabilities.append({
                'category': category,
                'name': item_name,
                'description': f'{category_name} - {item_name}',
                'status': 'active',
                'type': 'capability',
                'icon': '⭐'
            })
    
    print(f"  ✅ 提取了 {len(capabilities)} 个能力\n")
    return capabilities

def migrate_capabilities_to_db(capabilities):
    """将能力迁移到数据库"""
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
                json.dumps({}, ensure_ascii=False)
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

def verify_migration():
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
    """)
    categories = cursor.fetchall()
    
    print(f"  ├─ 总能力数：{total}")
    print(f"  ├─ 分类数量：{len(categories)}")
    print(f"  ├─ 前5个分类：")
    for cat, count in categories[:5]:
        print(f"  │    - {cat}: {count} 个")
    
    # 检查统计表
    cursor.execute("SELECT total_capabilities, last_updated FROM statistics WHERE id = 1")
    stats = cursor.fetchone()
    
    print(f"  ├─ 统计表：{stats[0]} 个能力")
    print(f"  ├─ 最后更新：{stats[1]}")
    
    conn.close()
    
    # 验证总数
    if total == 608:
        print(f"  ✅ 迁移成功（608个能力）\n")
    else:
        print(f"  ⚠️  数量不一致（期望608，实际{total}）\n")
    
    return total

if __name__ == '__main__':
    print("=" * 60)
    print("Phase 1: 能力数据迁移")
    print("=" * 60)
    print()
    
    capabilities = extract_capabilities_from_ts()
    migrate_capabilities_to_db(capabilities)
    total = verify_migration()
    
    print("=" * 60)
    print(f"✅ Phase 1 完成：已迁移 {total} 个能力")
    print("=" * 60)
