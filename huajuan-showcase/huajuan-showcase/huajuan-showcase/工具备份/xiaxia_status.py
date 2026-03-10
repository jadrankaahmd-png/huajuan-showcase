#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
虾虾交易情况查询 - 快速生成交易报告
用法: python3 xiaxia_status.py
"""

import os
import json
import glob
from datetime import datetime, timedelta


def get_trading_status():
    """获取虾虾当前交易情况"""
    
    report = []
    report.append("🦐 虾虾交易情况报告")
    report.append("="*70)
    report.append(f"📅 报告时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    report.append("")
    
    # 检查持仓
    buy_dir = '/Users/fox/.openclaw/workspace/虾虾交易报告/买入报告'
    sell_dir = '/Users/fox/.openclaw/workspace/虾虾交易报告/卖出总结'
    
    holding_reports = []
    closed_reports = []
    
    if os.path.exists(buy_dir):
        for f in glob.glob(os.path.join(buy_dir, '*.json')):
            with open(f, 'r') as file:
                data = json.load(file)
                if data.get('status') == 'HOLDING':
                    holding_reports.append(data)
                elif data.get('status') == 'CLOSED':
                    # 查找对应的卖出报告
                    report_id = data['id']
                    sell_file = os.path.join(sell_dir, f"{report_id}_sell.json")
                    if os.path.exists(sell_file):
                        with open(sell_file, 'r') as sf:
                            sell_data = json.load(sf)
                            closed_reports.append(sell_data)
    
    # 当前持仓
    report.append("📈 当前持仓")
    report.append("-"*70)
    
    if holding_reports:
        for h in holding_reports[:5]:  # 最多显示5个
            symbol = h['symbol']
            entry = h['entry_price']
            latest_track = h.get('daily_tracking', [{}])[-1]
            current = latest_track.get('current_price', entry)
            ret = latest_track.get('return_pct', 0)
            days = latest_track.get('days_held', 0)
            emoji = "🟢" if ret >= 0 else "🔴"
            
            report.append(f"{emoji} {symbol}: ${current:.2f} (买入${entry:.2f})")
            report.append(f"   收益: {ret:+.2f}% | 持仓: {days}天")
            report.append(f"   理由: {h.get('reasoning', 'N/A')[:40]}...")
            report.append("")
    else:
        report.append("暂无持仓")
        report.append("")
    
    # 最近卖出
    report.append("📉 最近卖出")
    report.append("-"*70)
    
    if closed_reports:
        # 按卖出日期排序
        closed_reports.sort(key=lambda x: x.get('exit_date', ''), reverse=True)
        for c in closed_reports[:3]:  # 最近3笔
            symbol = c['symbol']
            ret = c.get('return_pct', 0)
            days = c.get('days_held', 0)
            emoji = "🟢" if ret >= 0 else "🔴"
            
            report.append(f"{emoji} {symbol}: {ret:+.2f}% ({days}天)")
            report.append(f"   卖出原因: {c.get('exit_reason', 'N/A')[:30]}...")
            if c.get('lessons_learned'):
                report.append(f"   经验: {c['lessons_learned'][:30]}...")
            report.append("")
    else:
        report.append("暂无卖出记录")
        report.append("")
    
    # 统计数据
    report.append("📊 交易统计")
    report.append("-"*70)
    
    total_trades = len(holding_reports) + len(closed_reports)
    if closed_reports:
        win_trades = [c for c in closed_reports if c.get('return_pct', 0) > 0]
        lose_trades = [c for c in closed_reports if c.get('return_pct', 0) <= 0]
        
        win_rate = len(win_trades) / len(closed_reports) * 100 if closed_reports else 0
        avg_return = sum([c.get('return_pct', 0) for c in closed_reports]) / len(closed_reports)
        
        report.append(f"总交易数: {total_trades}")
        report.append(f"已平仓: {len(closed_reports)}")
        report.append(f"持仓中: {len(holding_reports)}")
        report.append(f"胜率: {win_rate:.1f}%")
        report.append(f"平均收益: {avg_return:+.2f}%")
        
        if win_trades:
            best = max(win_trades, key=lambda x: x.get('return_pct', 0))
            report.append(f"最佳交易: {best['symbol']} +{best.get('return_pct', 0):.2f}%")
        
        if lose_trades:
            worst = min(lose_trades, key=lambda x: x.get('return_pct', 0))
            report.append(f"最差交易: {worst['symbol']} {worst.get('return_pct', 0):.2f}%")
    else:
        report.append(f"持仓中: {len(holding_reports)}")
        report.append("暂无已平仓交易")
    
    report.append("")
    
    # 虾虾自我评级
    if closed_reports:
        correct_logic = [c for c in closed_reports if c.get('logic_correct', False)]
        logic_rate = len(correct_logic) / len(closed_reports) * 100
        
        if logic_rate >= 70:
            rating = "A+ 🏆"
        elif logic_rate >= 60:
            rating = "A ⭐"
        elif logic_rate >= 50:
            rating = "B 📊"
        else:
            rating = "C ⚠️"
        
        report.append("🦐 虾虾自我评级")
        report.append("-"*70)
        report.append(f"投资逻辑正确率: {logic_rate:.1f}%")
        report.append(f"综合评级: {rating}")
        report.append("")
    
    report.append("="*70)
    report.append("💡 提示: 使用 xiaxia_trading_report.py 查看详细报告")
    report.append("="*70)
    
    return "\n".join(report)


if __name__ == "__main__":
    print(get_trading_status())
