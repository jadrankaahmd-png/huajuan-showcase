#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
纸面交易追踪系统 - Paper Trading Tracker
作者：虾虾
创建时间：2026-02-09
用途：记录虾虾的买入建议、追踪建议后的实际表现、统计胜率、生成准确度报告

核心功能：验证虾虾"说的准不准"！
"""

import os
import sys
import json
import yfinance as yf
import pandas as pd
from datetime import datetime, timedelta
from typing import List, Dict, Optional, Tuple
import csv


class PaperTradingTracker:
    """
    纸面交易追踪系统
    
    为什么重要：
    - 验证虾虾建议的准确性
    - 统计胜率、平均收益、最大回撤
    - 建立可信度记录
    - 优化多因子权重
    
    核心思想：纸面验证通过后再实仓！
    """
    
    def __init__(self):
        self.data_dir = os.path.expanduser("~/.openclaw/workspace/纸面交易数据")
        os.makedirs(self.data_dir, exist_ok=True)
        
        # 交易记录文件
        self.trades_file = os.path.join(self.data_dir, "paper_trades.json")
        self.performance_file = os.path.join(self.data_dir, "performance_stats.json")
        
        # 初始化文件
        self._init_files()
        
        print("🦐 纸面交易追踪系统启动")
        print("📊 记录每一笔建议，验证虾虾的准确度")
        print("="*70)
    
    def _init_files(self):
        """初始化数据文件"""
        if not os.path.exists(self.trades_file):
            with open(self.trades_file, 'w', encoding='utf-8') as f:
                json.dump([], f)
        
        if not os.path.exists(self.performance_file):
            with open(self.performance_file, 'w', encoding='utf-8') as f:
                json.dump({
                    'total_trades': 0,
                    'winning_trades': 0,
                    'losing_trades': 0,
                    'total_return': 0,
                    'avg_return': 0,
                    'max_drawdown': 0,
                    'win_rate': 0,
                    'last_updated': datetime.now().isoformat()
                }, f)
    
    def record_trade(self, symbol: str, action: str, price: float, 
                    reason: str, confidence: str, score: int = None) -> Dict:
        """
        记录交易建议
        
        Args:
            symbol: 股票代码
            action: BUY/SELL/HOLD
            price: 建议时的价格
            reason: 建议理由
            confidence: 置信度 (high/medium/low)
            score: 多因子评分
        
        Returns:
            交易记录
        """
        trade = {
            'id': f"{symbol}_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
            'symbol': symbol,
            'action': action,
            'entry_price': price,
            'entry_date': datetime.now().strftime('%Y-%m-%d'),
            'reason': reason,
            'confidence': confidence,
            'score': score,
            'status': 'OPEN',  # OPEN/CLOSED
            'exit_price': None,
            'exit_date': None,
            'return_pct': None,
            'holding_days': 0,
            'timestamp': datetime.now().isoformat()
        }
        
        # 读取现有记录
        trades = self._load_trades()
        trades.append(trade)
        
        # 保存
        with open(self.trades_file, 'w', encoding='utf-8') as f:
            json.dump(trades, f, ensure_ascii=False, indent=2)
        
        print(f"✅ 已记录交易: {symbol} {action} @ ${price:.2f}")
        print(f"   理由: {reason[:50]}...")
        print(f"   置信度: {confidence}")
        
        return trade
    
    def close_trade(self, trade_id: str, exit_price: float, 
                   exit_reason: str = "time_based") -> Dict:
        """
        平仓并计算收益
        
        Args:
            trade_id: 交易ID
            exit_price: 平仓价格
            exit_reason: 平仓理由 (time_based/target/stop_loss)
        """
        trades = self._load_trades()
        
        # 找到交易
        for trade in trades:
            if trade['id'] == trade_id and trade['status'] == 'OPEN':
                entry_price = trade['entry_price']
                entry_date = datetime.strptime(trade['entry_date'], '%Y-%m-%d')
                exit_date = datetime.now()
                
                # 计算收益
                if trade['action'] == 'BUY':
                    return_pct = (exit_price - entry_price) / entry_price * 100
                else:  # SELL (做空)
                    return_pct = (entry_price - exit_price) / entry_price * 100
                
                holding_days = (exit_date - entry_date).days
                
                # 更新交易
                trade['status'] = 'CLOSED'
                trade['exit_price'] = round(exit_price, 2)
                trade['exit_date'] = exit_date.strftime('%Y-%m-%d')
                trade['return_pct'] = round(return_pct, 2)
                trade['holding_days'] = holding_days
                trade['exit_reason'] = exit_reason
                
                # 保存
                with open(self.trades_file, 'w', encoding='utf-8') as f:
                    json.dump(trades, f, ensure_ascii=False, indent=2)
                
                print(f"✅ 已平仓: {trade['symbol']}")
                print(f"   收益: {return_pct:+.2f}%")
                print(f"   持仓: {holding_days}天")
                
                # 更新统计
                self._update_statistics()
                
                return trade
        
        print(f"❌ 未找到交易: {trade_id}")
        return None
    
    def auto_update_trades(self):
        """
        自动更新所有开仓交易的表现
        
        每天运行一次，更新未平仓交易的当前收益
        """
        print("\n🔄 自动更新交易表现...")
        
        trades = self._load_trades()
        open_trades = [t for t in trades if t['status'] == 'OPEN']
        
        if not open_trades:
            print("  没有开仓交易")
            return
        
        for trade in open_trades:
            symbol = trade['symbol']
            entry_date = datetime.strptime(trade['entry_date'], '%Y-%m-%d')
            holding_days = (datetime.now() - entry_date).days
            
            try:
                # 获取当前价格
                ticker = yf.Ticker(symbol)
                current_price = ticker.history(period="1d")['Close'].iloc[-1]
                
                # 计算当前收益
                if trade['action'] == 'BUY':
                    current_return = (current_price - trade['entry_price']) / trade['entry_price'] * 100
                else:
                    current_return = (trade['entry_price'] - current_price) / trade['entry_price'] * 100
                
                trade['current_price'] = round(current_price, 2)
                trade['current_return'] = round(current_return, 2)
                trade['holding_days'] = holding_days
                
                print(f"  {symbol}: 当前收益 {current_return:+.2f}% ({holding_days}天)")
                
                # 自动平仓条件
                if holding_days >= 5:  # 5天后自动平仓
                    print(f"    ⏰ 达到5天，自动平仓")
                    self.close_trade(trade['id'], current_price, "time_based")
                
            except Exception as e:
                print(f"  ⚠️ 更新{symbol}失败: {e}")
        
        # 保存更新
        with open(self.trades_file, 'w', encoding='utf-8') as f:
            json.dump(trades, f, ensure_ascii=False, indent=2)
    
    def calculate_statistics(self) -> Dict:
        """
        计算交易统计
        """
        trades = self._load_trades()
        closed_trades = [t for t in trades if t['status'] == 'CLOSED']
        
        if not closed_trades:
            return {'error': '没有已平仓交易'}
        
        total_trades = len(closed_trades)
        winning_trades = [t for t in closed_trades if t['return_pct'] > 0]
        losing_trades = [t for t in closed_trades if t['return_pct'] <= 0]
        
        win_count = len(winning_trades)
        loss_count = len(losing_trades)
        win_rate = win_count / total_trades * 100 if total_trades > 0 else 0
        
        # 收益统计
        returns = [t['return_pct'] for t in closed_trades]
        avg_return = sum(returns) / len(returns)
        total_return = sum(returns)
        
        # 最大回撤（简化版）
        cumulative = 0
        max_drawdown = 0
        peak = 0
        for ret in returns:
            cumulative += ret
            if cumulative > peak:
                peak = cumulative
            drawdown = peak - cumulative
            if drawdown > max_drawdown:
                max_drawdown = drawdown
        
        # 按置信度统计
        high_conf_trades = [t for t in closed_trades if t['confidence'] == 'high']
        high_conf_win_rate = len([t for t in high_conf_trades if t['return_pct'] > 0]) / len(high_conf_trades) * 100 if high_conf_trades else 0
        
        stats = {
            'total_trades': total_trades,
            'winning_trades': win_count,
            'losing_trades': loss_count,
            'win_rate': round(win_rate, 2),
            'avg_return': round(avg_return, 2),
            'total_return': round(total_return, 2),
            'max_drawdown': round(max_drawdown, 2),
            'high_conf_win_rate': round(high_conf_win_rate, 2),
            'avg_holding_days': round(sum([t['holding_days'] for t in closed_trades]) / len(closed_trades), 1),
            'last_updated': datetime.now().isoformat()
        }
        
        # 保存统计
        with open(self.performance_file, 'w', encoding='utf-8') as f:
            json.dump(stats, f, ensure_ascii=False, indent=2)
        
        return stats
    
    def generate_accuracy_report(self) -> str:
        """
        生成虾虾准确度报告
        """
        stats = self.calculate_statistics()
        trades = self._load_trades()
        closed_trades = [t for t in trades if t['status'] == 'CLOSED']
        
        report = []
        report.append("="*70)
        report.append("🦐 虾虾准确度报告")
        report.append(f"生成时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        report.append("="*70)
        
        if 'error' in stats:
            report.append(f"\n{stats['error']}")
            return "\n".join(report)
        
        # 总体统计
        report.append(f"\n📊 总体表现:")
        report.append("-"*70)
        report.append(f"  总交易数: {stats['total_trades']}")
        report.append(f"  盈利次数: {stats['winning_trades']}")
        report.append(f"  亏损次数: {stats['losing_trades']}")
        report.append(f"  🎯 胜率: {stats['win_rate']}%")
        report.append(f"  📈 平均收益: {stats['avg_return']:.2f}%")
        report.append(f"  💰 累计收益: {stats['total_return']:.2f}%")
        report.append(f"  📉 最大回撤: {stats['max_drawdown']:.2f}%")
        report.append(f"  ⏱️ 平均持仓: {stats['avg_holding_days']}天")
        
        # 高置信度表现
        if stats['high_conf_win_rate'] > 0:
            report.append(f"\n🌟 高置信度建议表现:")
            report.append("-"*70)
            report.append(f"  胜率: {stats['high_conf_win_rate']}%")
            if stats['high_conf_win_rate'] > stats['win_rate']:
                report.append(f"  ✅ 高置信度确实更准确！")
        
        # 最近交易
        if closed_trades:
            report.append(f"\n📋 最近10笔交易:")
            report.append("-"*70)
            for trade in closed_trades[-10:]:
                emoji = "🟢" if trade['return_pct'] > 0 else "🔴"
                report.append(f"  {emoji} {trade['symbol']}: {trade['return_pct']:+.2f}% "
                            f"({trade['holding_days']}天) - {trade['confidence']}置信度")
        
        # 评级
        report.append(f"\n🏆 虾虾评级:")
        report.append("-"*70)
        
        win_rate = stats['win_rate']
        if win_rate >= 70:
            rating = "A+ 优秀分析师"
            desc = "建议可信，可以跟随"
        elif win_rate >= 60:
            rating = "A 良好分析师"
            desc = "建议基本可靠，需验证"
        elif win_rate >= 50:
            rating = "B 一般分析师"
            desc = "建议参考价值有限，需优化"
        else:
            rating = "C 需改进"
            desc = "建议准确率较低，需大幅优化"
        
        report.append(f"  评级: {rating}")
        report.append(f"  评价: {desc}")
        
        report.append("="*70)
        
        return "\n".join(report)
    
    def _load_trades(self) -> List[Dict]:
        """加载交易记录"""
        try:
            with open(self.trades_file, 'r', encoding='utf-8') as f:
                return json.load(f)
        except:
            return []
    
    def _update_statistics(self):
        """更新统计"""
        self.calculate_statistics()


def main():
    """主函数"""
    import argparse
    
    parser = argparse.ArgumentParser(
        description='虾虾纸面交易追踪系统',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
使用示例:
  # 记录买入建议
  python3 paper_trading_tracker.py --record NVDA BUY 180.5 "多因子评分85" high
  
  # 平仓
  python3 paper_trading_tracker.py --close NVDA_20260209_123456 195.0
  
  # 更新所有交易
  python3 paper_trading_tracker.py --update
  
  # 生成准确度报告
  python3 paper_trading_tracker.py --report
        """
    )
    
    parser.add_argument('--record', nargs=5, 
                       metavar=('SYMBOL', 'ACTION', 'PRICE', 'REASON', 'CONF'),
                       help='记录交易')
    parser.add_argument('--close', nargs=2,
                       metavar=('TRADE_ID', 'EXIT_PRICE'),
                       help='平仓')
    parser.add_argument('--update', action='store_true',
                       help='更新所有交易')
    parser.add_argument('--report', '-r', action='store_true',
                       help='生成准确度报告')
    
    args = parser.parse_args()
    
    tracker = PaperTradingTracker()
    
    if args.record:
        symbol, action, price, reason, conf = args.record
        tracker.record_trade(symbol, action, float(price), reason, conf)
    
    elif args.close:
        trade_id, exit_price = args.close
        tracker.close_trade(trade_id, float(exit_price))
    
    elif args.update:
        tracker.auto_update_trades()
    
    elif args.report:
        report = tracker.generate_accuracy_report()
        print(report)
    
    else:
        print("🦐 虾虾纸面交易追踪系统")
        print("="*70)
        print("\n使用方法:")
        print("  --record SYM ACT PRICE REASON CONF  记录交易")
        print("  --close ID EXIT_PRICE               平仓")
        print("  --update                            更新交易")
        print("  --report                            生成报告")
        print("\n验证虾虾的准确度，建立可信度！")


if __name__ == "__main__":
    main()
