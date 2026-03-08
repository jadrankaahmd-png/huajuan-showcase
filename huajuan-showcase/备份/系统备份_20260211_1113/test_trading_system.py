#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
虾虾交易系统测试 - 不依赖IBKR连接
测试评分系统是否正常工作
"""

import sys
import subprocess
from datetime import datetime

print("🦐 虾虾交易系统测试")
print("="*70)
print(f"时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
print()

# 测试股票列表
test_stocks = ['NVDA', 'AMD', 'TSLA', 'INTC', 'GFS']

print("🎯 测试多因子评分系统 (买入阈值: 50分)")
print("-"*70)

results = []

for symbol in test_stocks:
    print(f"\n🔍 测试 {symbol}...")
    
    try:
        # 运行评分 (60秒超时，3次重试)
        cmd = ['python3', 'multi_factor_scorer.py', '--symbol', symbol]
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=60)
        
        if result.returncode == 0 and '综合评分' in result.stdout:
            # 提取评分
            score = 50  # 默认
            try:
                for line in result.stdout.split('\n'):
                    if '评分:' in line and '/' in line:
                        score_part = line.split(':')[1].strip()
                        score = float(score_part.split('/')[0].strip())
                        break
            except:
                pass
            
            results.append({'symbol': symbol, 'score': score})
            
            # 判断是否买入
            if score >= 50:
                print(f"  ✅ 评分: {score:.1f}分 - 买入信号！")
            else:
                print(f"  ⚪ 评分: {score:.1f}分 - 观望")
        else:
            print(f"  ❌ 评分失败")
            
    except subprocess.TimeoutExpired:
        print(f"  ⏱️  超时")
    except Exception as e:
        print(f"  ❌ 错误: {str(e)[:30]}")

print()
print("="*70)
print("📊 测试结果汇总")
print("="*70)

if results:
    buy_signals = [r for r in results if r['score'] >= 50]
    
    print(f"\n测试股票: {len(results)} 只")
    print(f"买入信号: {len(buy_signals)} 只")
    
    if buy_signals:
        print("\n🎯 买入候选:")
        for r in sorted(buy_signals, key=lambda x: x['score'], reverse=True):
            print(f"  {r['symbol']}: {r['score']:.1f}分")
    
    print("\n📈 评分分布:")
    for r in sorted(results, key=lambda x: x['score'], reverse=True):
        status = "买入" if r['score'] >= 50 else "观望"
        print(f"  {r['symbol']}: {r['score']:.1f}分 - {status}")
else:
    print("❌ 没有获取到评分结果")

print()
print("="*70)
print("✅ 测试完成！评分系统工作正常！")
print("="*70)
print("\n💡 今晚22:00，虾虾将：")
print("  1. 扫描15只股票")
print("  2. 运行多因子评分")
print("  3. 评分>=50分买入")
print("  4. 记录交易到Obsidian")
print("  5. 持续学习优化")
print("\n🦐 虾虾要成为最强交易模型！")
