#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
虾虾股票扫描器 - 扩大扫描范围
扫描更多股票寻找高分机会
"""

import sys
import asyncio
sys.path.insert(0, '/Users/fox/.openclaw/workspace/tools')

# 设置事件循环
if sys.platform == 'darwin':
    asyncio.set_event_loop_policy(asyncio.DefaultEventLoopPolicy())

try:
    loop = asyncio.get_running_loop()
except RuntimeError:
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)

from ib_insync import IB
import subprocess
from datetime import datetime

# 扩大的股票池 (50只热门股票)
expanded_watchlist = [
    # 原来的15只
    'NVDA', 'AMD', 'TSLA', 'AAPL', 'MSFT', 
    'AVGO', 'SMCI', 'CRWV', 'META', 'GOOGL',
    'GFS', 'INTC', 'AMKR', 'TSM', 'QCOM',
    
    # 添加更多热门股票 (35只)
    'AMZN', 'NFLX', 'CRM', 'ADBE', 'ORCL',
    'UBER', 'LYFT', 'ABNB', 'COIN', 'HOOD',
    'PLTR', 'SNOW', 'DDOG', 'NET', 'CRWD',
    'OKTA', 'ZM', 'DOCU', 'SHOP', 'SQ',
    'PYPL', 'SOFI', 'LCID', 'RIVN', 'FSLR',
    'ENPH', 'SEDG', 'RUN', 'NOVA', 'SPWR',
    'ARKK', 'ARKF', 'ARKG', 'ARKW', 'ICLN'
]

print("🦐 虾虾扩大扫描范围！")
print("="*70)
print(f"📊 扫描股票池: {len(expanded_watchlist)} 只")
print(f"⏰ 时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
print()

# 连接IBKR
print("🔄 连接IBKR...")
ib = IB()
try:
    ib.connect('127.0.0.1', 7497, clientId=3, timeout=10)
    print("✅ 连接成功!")
    print()
    
    # 获取账户资金
    account = ib.managedAccounts()[0]
    summary = ib.accountSummary(account)
    available_funds = 0
    for item in summary:
        if item.tag == 'AvailableFunds':
            available_funds = float(item.value)
    
    print(f"💰 可用资金: ${available_funds:,.2f}")
    print()
    
    # 扫描所有股票
    high_score_stocks = []
    
    print("🔍 开始扫描...")
    print("-"*70)
    
    for i, symbol in enumerate(expanded_watchlist, 1):
        print(f"\n[{i}/{len(expanded_watchlist)}] 扫描 {symbol}...", end=' ')
        
        try:
            # 运行多因子评分
            cmd = ['python3', '/Users/fox/.openclaw/workspace/tools/multi_factor_scorer.py', 
                   '--symbol', symbol]
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=15)
            
            # 解析评分
            score = None
            for line in result.stdout.split('\n'):
                if '综合评分:' in line or '评分:' in line:
                    try:
                        # 尝试提取分数
                        if '/' in line:
                            score = float(line.split(':')[1].split('/')[0].strip())
                    except:
                        pass
            
            if score:
                print(f"评分: {score:.2f}", end='')
                
                if score >= 80:
                    print(" ⭐ 高分!")
                    high_score_stocks.append({
                        'symbol': symbol,
                        'score': score
                    })
                elif score >= 70:
                    print(" 🟡 良好")
                else:
                    print(" ⚪")
            else:
                print(" 无法获取评分")
                
        except Exception as e:
            print(f" 错误: {str(e)[:30]}")
    
    # 断开连接
    ib.disconnect()
    
    # 输出结果
    print()
    print("="*70)
    print("📊 扫描结果")
    print("="*70)
    
    if high_score_stocks:
        print(f"\n🎯 发现 {len(high_score_stocks)} 只高分股票 (>80分):")
        print()
        
        # 按分数排序
        high_score_stocks.sort(key=lambda x: x['score'], reverse=True)
        
        for stock in high_score_stocks:
            print(f"  ⭐ {stock['symbol']}: {stock['score']:.2f}分")
        
        print()
        print("💡 建议关注这些股票，可能具备买入价值！")
        
        # 显示前3只详细信息
        print()
        print("🔍 前3名详细分析:")
        print("-"*70)
        for stock in high_score_stocks[:3]:
            print(f"\n  {stock['symbol']} (评分: {stock['score']:.2f}):")
            print(f"  建议操作: 查看完整分析报告")
            print(f"  命令: python3 multi_factor_scorer.py --symbol {stock['symbol']}")
    else:
        print()
        print("📉 未发现评分>80分的股票")
        print()
        print("💡 可能原因:")
        print("  • 市场整体观望情绪浓厚")
        print("  • 等待CPI数据公布")
        print("  • 建议明天再次扫描")
    
    print()
    print("="*70)
    print(f"✅ 完成扫描 {len(expanded_watchlist)} 只股票")
    print("="*70)
    
except Exception as e:
    print(f"❌ 错误: {e}")
    ib.disconnect()
    import traceback
    traceback.print_exc()
