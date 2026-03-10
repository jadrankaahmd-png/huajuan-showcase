#!/usr/bin/env python3
"""
第一层能力管理系统 - 知识库迁移脚本
Phase 1: 将 knowledge_base/ 目录文件迁移到数据库
"""

import sqlite3
import json
import os
import re
from datetime import datetime

DB_PATH = 'data/capabilities.db'
KNOWLEDGE_BASE_DIR = 'public/knowledge_base'

def extract_knowledge_from_md(file_path):
    """从 Markdown 文件提取知识条目"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 提取标题
    title_match = re.search(r'^#\s+(.+)$', content, re.MULTILINE)
    title = title_match.group(1) if title_match else os.path.basename(file_path).replace('.md', '')
    
    # 提取日期
    date_match = re.search(r'\*\*日期：\*\*\s*(\d{4}-\d{2}-\d{2})', content)
    date = date_match.group(1) if date_match else datetime.now().strftime('%Y-%m-%d')
    
    # 提取来源
    source_match = re.search(r'\*\*来源：\*\*\s*(.+)', content)
    source = source_match.group(1).strip() if source_match else '个人书籍提炼系统'
    
    # 提取分类
    category_match = re.search(r'_分类：(.+?)_', content)
    category = category_match.group(1).split('（')[0] if category_match else '投资分析'
    
    # 提取摘要（第一段非标题内容）
    lines = content.split('\n')
    summary = ''
    for line in lines[1:]:
        if line.strip() and not line.startswith('#') and not line.startswith('**') and not line.startswith('---'):
            summary = line.strip()
            break
    
    return {
        'title': title,
        'source': source,
        'date': date,
        'category': category,
        'summary': summary[:200] if summary else '投资分析文档'
    }

def migrate_knowledge_base():
    """迁移 knowledge_base/ 目录到数据库"""
    print(f"📚 迁移 knowledge_base/ 目录...")
    
    if not os.path.exists(KNOWLEDGE_BASE_DIR):
        print(f"  ⚠️  目录不存在：{KNOWLEDGE_BASE_DIR}")
        return
    
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # 扫描所有 .md 文件
    files = [f for f in os.listdir(KNOWLEDGE_BASE_DIR) if f.endswith('.md')]
    print(f"  ├─ 发现 {len(files)} 个文件")
    
    success_count = 0
    duplicate_count = 0
    
    for file in sorted(files):
        file_path = os.path.join(KNOWLEDGE_BASE_DIR, file)
        print(f"  ├─ 处理：{file}")
        
        try:
            # 提取知识条目
            knowledge = extract_knowledge_from_md(file_path)
            
            # 插入数据库
            cursor.execute('''
                INSERT INTO knowledge_base (file_path, title, source, date, category, summary, in_capabilities)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            ''', (
                file_path,
                knowledge['title'],
                knowledge['source'],
                knowledge['date'],
                knowledge['category'],
                knowledge['summary'],
                1  # 标记为已在 capabilities 中
            ))
            success_count += 1
            print(f"  │    ✅ {knowledge['title'][:50]}...")
        except sqlite3.IntegrityError:
            duplicate_count += 1
            print(f"  │    ⏭️  已存在")
    
    # 更新统计信息
    cursor.execute('''
        UPDATE statistics 
        SET total_knowledge_base = (SELECT COUNT(*) FROM knowledge_base),
            last_updated = CURRENT_TIMESTAMP
        WHERE id = 1
    ''')
    
    conn.commit()
    conn.close()
    
    print(f"  ✅ 迁移完成：{success_count} 个知识条目\n")

def verify_knowledge_migration():
    """验证知识库迁移结果"""
    print(f"🔍 验证知识库迁移...")
    
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # 统计总数
    cursor.execute("SELECT COUNT(*) FROM knowledge_base")
    total = cursor.fetchone()[0]
    
    # 列出所有知识条目
    cursor.execute("""
        SELECT title, date, category 
        FROM knowledge_base 
        ORDER BY date DESC
    """)
    items = cursor.fetchall()
    
    print(f"  ├─ 总知识条目：{total}")
    print(f"  ├─ 知识列表：")
    for title, date, category in items:
        print(f"  │    - {date} | {title[:40]}...")
    
    # 检查统计表
    cursor.execute("SELECT total_knowledge_base FROM statistics WHERE id = 1")
    stats = cursor.fetchone()
    
    print(f"  ├─ 统计表：{stats[0]} 个知识条目")
    
    conn.close()
    
    # 验证总数（期望26：17个 capabilities.ts + 5个 knowledge_base/ + 4个 bookSources）
    if total == 5:
        print(f"  ✅ 迁移成功（5个知识文件）\n")
    else:
        print(f"  ⚠️  数量不一致（期望5，实际{total}）\n")
    
    return total

if __name__ == '__main__':
    print("=" * 60)
    print("Phase 1: 知识库数据迁移")
    print("=" * 60)
    print()
    
    migrate_knowledge_base()
    total = verify_knowledge_migration()
    
    print("=" * 60)
    print(f"✅ Phase 1 完成：已迁移 {total} 个知识条目")
    print("=" * 60)
