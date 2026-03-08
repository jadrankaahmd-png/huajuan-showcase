#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
IBKR连接测试 - Python 3.14兼容版
"""

import sys
import asyncio

# 在导入ib_insync之前设置事件循环
if sys.platform == 'darwin':
    asyncio.set_event_loop_policy(asyncio.DefaultEventLoopPolicy())

try:
    loop = asyncio.get_running_loop()
except RuntimeError:
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)

# 现在导入ib_insync
from ib_insync import IB, Stock, MarketOrder

print("🦐 IBKR连接测试 (Python 3.14兼容版)")
print("="*70)
print()

print("🔄 正在连接IBKR Paper Trading...")
print("   主机: 127.0.0.1")
print("   端口: 7497")
print()

# 创建IB实例并连接
ib = IB()

try:
    ib.connect('127.0.0.1', 7497, clientId=1, timeout=10)
    
    if ib.isConnected():
        print("✅ 连接成功!")
        print()
        
        # 获取账户
        accounts = ib.managedAccounts()
        print(f"📊 账户: {accounts}")
        print()
        
        # 获取账户摘要
        account = accounts[0]
        summary = ib.accountSummary(account)
        
        print("💰 账户摘要:")
        for item in summary:
            if item.tag in ['NetLiquidation', 'AvailableFunds', 'BuyingPower']:
                print(f"  {item.tag}: {item.value} {item.currency}")
        
        # 获取持仓
        positions = ib.positions()
        print(f"\n📈 持仓数量: {len(positions)}")
        
        # 测试获取价格
        print("\n🧪 测试获取价格...")
        contract = Stock('GFS', 'SMART', 'USD')
        ticker = ib.reqMktData(contract, '', False, False)
        
        ib.sleep(2)
        
        if ticker.last:
            print(f"✅ GFS当前价格: ${ticker.last:.2f}")
        else:
            print("⚠️ 无法获取价格 (可能是市场已关闭或数据延迟)")
        
        ib.cancelMktData(contract)
        
        # 断开
        ib.disconnect()
        print("\n" + "="*70)
        print("✅ 测试完成! IBKR连接正常!")
        print("="*70)
        
    else:
        print("❌ 连接失败: 未建立连接")
        
except Exception as e:
    print(f"❌ 连接失败: {e}")
    print()
    print("🔧 请检查:")
    print("  1. TWS是否已打开并登录到Paper Trading")
    print("  2. API是否已启用 (端口7497)")
    print("  3. 是否已重启TWS")
    print()
    import traceback
    traceback.print_exc()
