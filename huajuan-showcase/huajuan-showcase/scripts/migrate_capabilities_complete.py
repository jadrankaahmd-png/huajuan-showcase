#!/usr/bin/env python3
"""
第一层能力管理系统 - 数据迁移脚本（完整版）
Phase 1: 将现有 capabilities.ts 迁移到数据库
使用 Node.js 辅助提取，确保完整性
"""

import sqlite3
import json
import subprocess
import os
from datetime import datetime

DB_PATH = 'data/capabilities.db'

def extract_capabilities_via_node():
    """使用 Node.js 提取能力数据（确保完整）"""
    print(f"📄 使用 Node.js 提取 capabilities.ts...")
    
    # Node.js 脚本
    node_script = """
const { capabilities, getTotalCapabilities } = require('./app/data/capabilities.ts');

const result = [];
capabilities.forEach(cat => {
    cat.items.forEach(item => {
        result.push({
            category: cat.category,
            name: item.name,
            description: item.description || (cat.name + ' - ' + item.name),
            status: item.status || 'active',
            type: item.type || 'capability',
            icon: item.icon || '⭐',
            details: item.details || {}
        });
    });
});

console.log(JSON.stringify({
    total: result.length,
    expectedTotal: getTotalCapabilities(),
    capabilities: result
}, null, 2));
"""
    
    # 保存脚本
    with open('/tmp/extract_capabilities.js', 'w', encoding='utf-8') as f:
        f.write(node_script)
    
    # 执行脚本
    result = subprocess.run(
        ['node', '/tmp/extract_capabilities.js'],
        capture_output=True,
        text=True,
        cwd=os.getcwd()
    )
    
    if result.returncode != 0:
        print(f"  ❌ Node.js 执行失败：{result.stderr}")
        return []
    
    # 解析输出
    try:
        data = json.loads(result.stdout)
        print(f"  ├─ 提取了 {data['total']} 个能力")
        print(f"  ├─ 期望总数：{data['expectedTotal']} 个")
        print(f"  ✅ 提取完成\n")
        return data['capabilities']
    except json.JSONDecodeError as e:
        print(f"  ❌ JSON 解析失败：{e}")
        return []

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
    print("Phase 1: 能力数据迁移（完整版）")
    print("=" * 60)
    print()
    
    capabilities = extract_capabilities_via_node()
    
    if capabilities:
        migrate_capabilities_to_db(capabilities)
        success = verify_migration(len(capabilities))
        
        print("=" * 60)
        if success:
            print(f"✅ Phase 1 完成：已迁移 {len(capabilities)} 个能力")
        else:
            print(f"⚠️  Phase 1 部分完成：迁移了 {len(capabilities)} 个能力")
        print("=" * 60)
    else:
        print("❌ Phase 1 失败：无法提取能力数据")
