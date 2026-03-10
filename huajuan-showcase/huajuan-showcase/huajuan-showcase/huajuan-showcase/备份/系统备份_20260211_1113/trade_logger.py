#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
交易日志 - Trade Logger
作者：虾虾
创建时间：2026-02-08
用途：自动记录交易，盈亏分析，策略效果追踪
"""

import json
import os
from datetime import datetime


class TradeLogger:
    """交易日志"""
    
    def __init__(self):
        self.log_file = os.path.expanduser("~/.openclaw/workspace/trade_log.json")
        self.trades = self.load_trades()
    
    def load_trades(self):
        """加载交易记录"""
        if os.path.exists(self.log_file):
            with open(self.log_file, 'r') as f:
                return json.load(f)
        return []
    
    def save_trades(self):
        """保存交易记录"""
        with open(self.log_file, 'w') as f:
            json.dump(self.trades, f, indent=2)
    
    def log_trade(self, symbol, action, shares, price, strategy=''):
        """
        记录交易
        """
        trade = {
            'id': len(self.trades) + 1,
            'date': datetime.now().isoformat(),
            'symbol': symbol,
            'action': action,  # BUY or SELL
            'shares': shares,
            'price': price,
            'amount': shares * price,
            'strategy': strategy
        }
        
        self.trades.append(trade)
        self.save_trades()
        
        print(f"✅ 交易已记录: {action} {shares}股 {symbol} @ ${price}")
        return trade
    
    def calculate_pnl(self):
        """
        计算盈亏
        """
        positions = {}
        realized_pnl = 0
        
        for trade in self.trades:
            symbol = trade['symbol']
            
            if symbol not in positions:
                positions[symbol] = {'shares': 0, 'cost': 0}
            
            if trade['action'] == 'BUY':
                positions[symbol]['shares'] += trade['shares']
                positions[symbol]['cost'] += trade['amount']
            elif trade['action'] == 'SELL':
                if positions[symbol]['shares'] > 0:
                    avg_cost = positions[symbol]['cost'] / positions[symbol]['shares']
                    realized_pnl += (trade['price'] - avg_cost) * trade['shares']
                    positions[symbol]['shares'] -= trade['shares']
                    positions[symbol]['cost'] -= avg_cost * trade['shares']
        
        return {
            'realized_pnl': realized_pnl,
            'open_positions': positions
        }
    
    def generate_report(self):
        """
        生成交易报告
        """
        print("🦐 交易日志报告")
        print("=" * 70)
        print(f"总交易次数: {len(self.trades)}")
        
        if not self.trades:
            print("暂无交易记录")
            return
        
        # 计算盈亏
        pnl = self.calculate_pnl()
        
        print(f"\n💰 已实现盈亏: ${pnl['realized_pnl']:,.2f}")
        
        print("\n📊 最近交易:")
        print("-" * 70)
        for trade in self.trades[-5:]:  # 最近5笔
            print(f"{trade['date'][:10]} {trade['action']:4} {trade['symbol']:6} "
                  f"{trade['shares']:4}股 @ ${trade['price']:.2f} = ${trade['amount']:,.2f}")


def main():
    """主函数"""
    logger = TradeLogger()
    
    import sys
    if len(sys.argv) > 4:
        symbol = sys.argv[1].upper()
        action = sys.argv[2].upper()
        shares = int(sys.argv[3])
        price = float(sys.argv[4])
        strategy = sys.argv[5] if len(sys.argv) > 5 else ''
        
        logger.log_trade(symbol, action, shares, price, strategy)
    else:
        logger.generate_report()


if __name__ == "__main__":
    main()
