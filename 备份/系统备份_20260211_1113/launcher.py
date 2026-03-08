#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
虾虾自动交易启动器 - 冬令时版
显示当前时区信息并启动交易
"""

import sys
sys.path.insert(0, '/Users/fox/.openclaw/workspace/tools')

from datetime import datetime
from pytz import timezone

print("🦐 虾虾自动交易系统 - 启动器")
print("="*70)
print()

# 检测时区
ny_tz = timezone('America/New_York')
now = datetime.now(ny_tz)
is_dst = bool(now.dst())

if is_dst:
    print("🌍 当前时区: 夏令时 (DST)")
    print("   美股开盘: 北京时间 21:30")
    print("   美股收盘: 北京时间 04:00")
    print("   虾虾交易: 21:00 - 05:00")
else:
    print("🌍 当前时区: 冬令时 (Standard Time) ❄️")
    print("   美股开盘: 北京时间 22:30")
    print("   美股收盘: 北京时间 05:00")  
    print("   虾虾交易: 22:00 - 06:00")

print()
print(f"📅 当前时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
print(f"🗽 纽约时间: {now.strftime('%Y-%m-%d %H:%M:%S')}")
print()

# 检查是否在交易时间
bj_now = datetime.now()
bj_hour = bj_now.hour

if is_dst:
    # 夏令时: 21:00-05:00是交易时间
    is_trading = (bj_hour >= 21 or bj_hour < 5)
else:
    # 冬令时: 22:00-06:00是交易时间
    is_trading = (bj_hour >= 22 or bj_hour < 6)

if is_trading:
    print("🟢 当前处于美股交易时间！")
    print()
    print("🚀 启动虾虾自动交易系统...")
    print("="*70)
    print()
    
    # 启动交易
    from xiaxia_auto_trader import XiaXiaAutoTrader
    
    trader = XiaXiaAutoTrader(paper_trading=True)
    success = trader.run_daily()
    
    if success:
        print("\n✅ 交易完成！")
    else:
        print("\n❌ 交易失败！")
else:
    print("⚠️  当前不在美股交易时间")
    print()
    if is_dst:
        print("⏰ 夏令时交易时间: 21:00 - 05:00 (北京时间)")
    else:
        print("⏰ 冬令时交易时间: 22:00 - 06:00 (北京时间)")
    print()
    print("💡 提示: 可以手动运行 xiaxia_auto_trader.py 进行测试")

print()
print("="*70)
print("📱 Telegram通知: 交易执行后将自动推送")
print("📊 纸面交易记录: ~/.openclaw/workspace/纸面交易数据/")
print("📈 交易日志: ~/.openclaw/workspace/交易日志/")
print("="*70)
