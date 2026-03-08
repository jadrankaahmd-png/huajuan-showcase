#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
简单的IBKR连接测试
"""

import sys
sys.path.insert(0, '/Users/fox/.openclaw/workspace/tools')

from ibkr_connector import IBKRConnector

print("🦐 测试IBKR连接")
print("="*70)
print()

# 创建连接器
connector = IBKRConnector(paper_trading=True, client_id=1)

# 尝试连接
print("🔄 正在连接IBKR Paper Trading...")
print("   主机: 127.0.0.1")
print("   端口: 7497")
print()

# 使用try-except捕获详细错误
try:
    result = connector.connect()
    
    if result:
        print("✅ 连接成功!")
        print()
        
        # 获取账户信息
        connector.print_portfolio_summary()
        
        # 断开
        connector.disconnect()
        print("\n✅ 测试完成!")
    else:
        print("❌ 连接失败!")
        print()
        print("🔧 请检查:")
        print("  1. TWS是否已打开并登录到Paper Trading")
        print("  2. API是否在TWS中启用:")
        print("     Edit → Global Configuration → API → Settings")
        print("     ✅ Enable ActiveX and Socket Clients")
        print("     端口: 7497")
        print("  3. 是否已重启TWS")
        print()
        
except Exception as e:
    print(f"❌ 错误: {e}")
    print()
    print("🔧 故障排除:")
    print("  请确保TWS已完全打开并登录")
    print("  检查API设置后重启TWS")
