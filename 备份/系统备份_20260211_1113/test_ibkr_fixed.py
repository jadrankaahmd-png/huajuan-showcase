#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
IBKR连接测试 - 修复版
"""

import sys
import asyncio
from ib_insync import IB, Stock, MarketOrder

print("🦐 IBKR连接测试 (修复版)")
print("="*70)
print()

# 设置事件循环
if sys.platform == 'darwin':  # macOS
    asyncio.set_event_loop_policy(asyncio.DefaultEventLoopPolicy())

try:
    loop = asyncio.get_event_loop()
except RuntimeError:
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)

print("🔄 正在连接IBKR Paper Trading...")
print("   主机: 127.0.0.1")
print("   端口: 7497 (Paper Trading)")
print()

# 创建IB实例
ib = IB()

# 尝试连接
try:
    ib.connect('127.0.0.1', 7497, clientId=1, timeout=10)
    
    if ib.isConnected():
        print("✅ 连接成功!")
        print()
        
        # 获取账户信息
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
        for pos in positions[:5]:  # 只显示前5个
            print(f"  {pos.contract.symbol}: {pos.position}股")
        
        # 测试获取价格
        print("\n🧪 测试获取GFS价格...")
        contract = Stock('GFS', 'SMART', 'USD')
        ticker = ib.reqMktData(contract, '', False, False)
        
        ib.sleep(2)  # 等待数据
        
        if ticker.last:
            print(f"✅ GFS当前价格: ${ticker.last:.2f}")
        else:
            print("⚠️ 无法获取价格")
        
        ib.cancelMktData(contract)
        
        # 断开
        ib.disconnect()
        print("\n✅ 测试完成! IBKR连接正常!")
        print("="*70)
        
    else:
        print("❌ 连接失败: 未建立连接")
        print()
        print("🔧 请检查:")
        print("  1. TWS是否已打开并登录到Paper Trading")
        print("  2. API是否已启用 (Edit → Global Configuration → API → Settings)")
        print("  3. Socket端口是否为7497")
        print("  4. 是否已重启TWS")
        
except Exception as e:
    print(f"❌ 连接失败: {e}")
    print()
    print("🔧 故障排除:")
    print("  1. 确认TWS已打开且登录成功")
    print("  2. 确认API已启用且端口为7497")
    print("  3. 重启TWS后重试")
    print("  4. 检查防火墙设置")
    print()
    print(f"错误详情: {str(e)}")
