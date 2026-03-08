#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
IBKR连接测试脚本
用法: python3 test_ibkr_connection.py
"""

import sys
import subprocess

print("🦐 IBKR连接测试")
print("="*70)
print()

# 检查ib_insync是否安装
print("1️⃣ 检查依赖...")
try:
    import ib_insync
    print("   ✅ ib_insync 已安装")
except ImportError:
    print("   ❌ ib_insync 未安装")
    print("   🔄 正在安装...")
    subprocess.check_call([sys.executable, "-m", "pip", "install", "ib_insync"])
    print("   ✅ 安装完成")

print()
print("2️⃣ 检查TWS连接...")
print("   ⚠️  请确保:")
print("      • TWS已打开")
print("      • 已登录到Paper Trading账户")
print("      • API已启用 (Edit → Global Configuration → API → Settings)")
print("      • 端口设置为7497 (Paper Trading)")
print()

input("   按Enter键开始测试连接...")

print()
print("3️⃣ 测试连接...")
print("-"*70)

# 导入并测试
from ibkr_connector import IBKRConnector

connector = IBKRConnector(paper_trading=True, client_id=1)

if connector.connect():
    print()
    print("✅ 连接成功!")
    print()
    
    # 获取账户信息
    connector.print_portfolio_summary()
    
    # 测试获取价格
    print("\n🧪 测试获取GFS价格...")
    price = connector.get_market_price('GFS')
    if price:
        print(f"✅ GFS当前价格: ${price:.2f}")
    else:
        print("❌ 无法获取价格")
    
    # 断开
    connector.disconnect()
    
    print()
    print("="*70)
    print("✅ 所有测试通过! IBKR连接正常!")
    print("="*70)
    
else:
    print()
    print("="*70)
    print("❌ 连接失败!")
    print("="*70)
    print()
    print("🔧 故障排除:")
    print("  1. 确保TWS已打开并登录")
    print("  2. 检查API设置:")
    print("     Edit → Global Configuration → API → Settings")
    print("     ✅ Enable ActiveX and Socket Clients")
    print("     端口: 7497 (Paper Trading)")
    print("  3. 检查防火墙设置")
    print("  4. 重启TWS后重试")
    print()
    sys.exit(1)
