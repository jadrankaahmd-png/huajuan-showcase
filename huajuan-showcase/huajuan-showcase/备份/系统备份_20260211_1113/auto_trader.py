#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
自动交易执行器 - Auto Trader
作者：虾虾
创建时间：2026-02-08
用途：基于策略信号自动执行交易（模拟交易模式）
"""

import yfinance as yf
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import json
import os
import sys


class AutoTrader:
    """自动交易执行器"""
    
    def __init__(self, symbol, mode='paper'):
        self.symbol = symbol
        self.mode = mode  # 'paper' = 模拟交易, 'live' = 实盘
        self.data = None
        self.position = None
        self.trades = []
        
        # 加载或创建持仓记录
        self.load_position()
    
    def load_position(self):
        """加载持仓记录"""
        position_file = f'position_{self.symbol}.json'
        if os.path.exists(position_file):
            with open(position_file, 'r') as f:
                self.position = json.load(f)
        else:
            self.position = {
                'symbol': self.symbol,
                'shares': 0,
                'avg_cost': 0,
                'cash': 100000,  # 初始资金
                'trades': []
            }
    
    def save_position(self):
        """保存持仓记录"""
        position_file = f'position_{self.symbol}.json'
        with open(position_file, 'w') as f:
            json.dump(self.position, f, indent=2)
    
    def fetch_data(self, period="1mo"):
        """获取股票数据"""
        try:
            stock = yf.Ticker(self.symbol)
            self.data = stock.history(period=period)
            print(f"✅ 获取{self.symbol}数据成功")
            return True
        except Exception as e:
            print(f"❌ 获取{self.symbol}数据失败: {e}")
            return False
    
    def calculate_signals(self):
        """
        计算交易信号
        综合多种技术指标
        """
        if self.data is None or len(self.data) < 20:
            return None
        
        df = self.data.copy()
        
        # 1. 移动平均线
        df['sma5'] = df['Close'].rolling(5).mean()
        df['sma10'] = df['Close'].rolling(10).mean()
        df['sma20'] = df['Close'].rolling(20).mean()
        
        # 2. RSI
        delta = df['Close'].diff()
        gain = (delta.where(delta > 0, 0)).rolling(window=14).mean()
        loss = (-delta.where(delta < 0, 0)).rolling(window=14).mean()
        rs = gain / loss
        df['rsi'] = 100 - (100 / (1 + rs))
        
        # 3. MACD
        exp1 = df['Close'].ewm(span=12).mean()
        exp2 = df['Close'].ewm(span=26).mean()
        df['macd'] = exp1 - exp2
        df['signal'] = df['macd'].ewm(span=9).mean()
        
        # 4. 布林带
        df['sma20'] = df['Close'].rolling(20).mean()
        df['std20'] = df['Close'].rolling(20).std()
        df['upper_band'] = df['sma20'] + (df['std20'] * 2)
        df['lower_band'] = df['sma20'] - (df['std20'] * 2)
        
        # 获取最新数据
        latest = df.iloc[-1]
        prev = df.iloc[-2]
        
        # 计算信号强度
        buy_signals = 0
        sell_signals = 0
        
        # 均线金叉/死叉
        if prev['sma5'] < prev['sma20'] and latest['sma5'] > latest['sma20']:
            buy_signals += 2
        elif prev['sma5'] > prev['sma20'] and latest['sma5'] < latest['sma20']:
            sell_signals += 2
        
        # RSI超卖/超买
        if latest['rsi'] < 30:
            buy_signals += 2
        elif latest['rsi'] > 70:
            sell_signals += 2
        
        # MACD金叉/死叉
        if prev['macd'] < prev['signal'] and latest['macd'] > latest['signal']:
            buy_signals += 1
        elif prev['macd'] > prev['signal'] and latest['macd'] < latest['signal']:
            sell_signals += 1
        
        # 布林带
        if latest['Close'] < latest['lower_band']:
            buy_signals += 1
        elif latest['Close'] > latest['upper_band']:
            sell_signals += 1
        
        # 判断信号
        if buy_signals >= 3:
            signal = 'BUY'
            strength = '强' if buy_signals >= 4 else '中等'
        elif sell_signals >= 3:
            signal = 'SELL'
            strength = '强' if sell_signals >= 4 else '中等'
        else:
            signal = 'HOLD'
            strength = '无'
        
        return {
            'signal': signal,
            'strength': strength,
            'buy_signals': buy_signals,
            'sell_signals': sell_signals,
            'price': latest['Close'],
            'rsi': latest['rsi'],
            'macd': latest['macd']
        }
    
    def execute_trade(self, signal, amount=None):
        """
        执行交易
        模拟交易模式
        """
        if signal['signal'] == 'HOLD':
            return None
        
        current_price = signal['price']
        
        if signal['signal'] == 'BUY':
            # 买入逻辑
            if amount is None:
                # 默认买入可用资金的20%
                amount = self.position['cash'] * 0.2
            
            shares_to_buy = int(amount / current_price)
            
            if shares_to_buy <= 0:
                return {'status': 'skipped', 'reason': '资金不足'}
            
            cost = shares_to_buy * current_price
            
            if cost > self.position['cash']:
                return {'status': 'skipped', 'reason': '资金不足'}
            
            # 更新持仓
            total_cost = self.position['shares'] * self.position['avg_cost'] + cost
            self.position['shares'] += shares_to_buy
            self.position['avg_cost'] = total_cost / self.position['shares'] if self.position['shares'] > 0 else 0
            self.position['cash'] -= cost
            
            trade = {
                'date': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                'action': 'BUY',
                'symbol': self.symbol,
                'shares': shares_to_buy,
                'price': current_price,
                'amount': cost
            }
            
            self.position['trades'].append(trade)
            self.save_position()
            
            return {
                'status': 'executed',
                'action': 'BUY',
                'shares': shares_to_buy,
                'price': current_price,
                'amount': cost
            }
        
        elif signal['signal'] == 'SELL':
            # 卖出逻辑
            if self.position['shares'] <= 0:
                return {'status': 'skipped', 'reason': '无持仓'}
            
            if amount is None:
                # 默认卖出50%持仓
                shares_to_sell = int(self.position['shares'] * 0.5)
            else:
                shares_to_sell = int(amount / current_price)
            
            shares_to_sell = min(shares_to_sell, self.position['shares'])
            
            if shares_to_sell <= 0:
                return {'status': 'skipped', 'reason': '持仓不足'}
            
            proceeds = shares_to_sell * current_price
            
            # 更新持仓
            self.position['shares'] -= shares_to_sell
            if self.position['shares'] == 0:
                self.position['avg_cost'] = 0
            
            self.position['cash'] += proceeds
            
            # 计算盈亏
            cost_basis = shares_to_sell * self.position['avg_cost'] if self.position['avg_cost'] > 0 else 0
            pnl = proceeds - cost_basis
            
            trade = {
                'date': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                'action': 'SELL',
                'symbol': self.symbol,
                'shares': shares_to_sell,
                'price': current_price,
                'amount': proceeds,
                'pnl': pnl
            }
            
            self.position['trades'].append(trade)
            self.save_position()
            
            return {
                'status': 'executed',
                'action': 'SELL',
                'shares': shares_to_sell,
                'price': current_price,
                'amount': proceeds,
                'pnl': pnl
            }
    
    def get_portfolio_value(self):
        """计算组合价值"""
        if self.data is None:
            return None
        
        current_price = self.data['Close'][-1]
        position_value = self.position['shares'] * current_price
        total_value = self.position['cash'] + position_value
        
        # 计算盈亏
        cost_basis = self.position['shares'] * self.position['avg_cost'] if self.position['avg_cost'] > 0 else 0
        unrealized_pnl = position_value - cost_basis
        
        return {
            'cash': self.position['cash'],
            'shares': self.position['shares'],
            'avg_cost': self.position['avg_cost'],
            'current_price': current_price,
            'position_value': position_value,
            'total_value': total_value,
            'unrealized_pnl': unrealized_pnl
        }
    
    def run_strategy(self, auto_execute=False):
        """
        运行交易策略
        auto_execute: 是否自动执行交易
        """
        if not self.fetch_data():
            return None
        
        signal = self.calculate_signals()
        if signal is None:
            return None
        
        print(f"\n📊 信号分析:")
        print(f"   当前价格: ${signal['price']:.2f}")
        print(f"   RSI: {signal['rsi']:.1f}")
        print(f"   MACD: {signal['macd']:.4f}")
        print(f"   买入信号数: {signal['buy_signals']}")
        print(f"   卖出信号数: {signal['sell_signals']}")
        print(f"   建议操作: {signal['signal']} (强度: {signal['strength']})")
        
        if auto_execute and signal['signal'] != 'HOLD':
            result = self.execute_trade(signal)
            if result:
                print(f"\n🔄 交易执行:")
                print(f"   状态: {result['status']}")
                if result['status'] == 'executed':
                    print(f"   操作: {result['action']}")
                    print(f"   股数: {result['shares']}")
                    print(f"   价格: ${result['price']:.2f}")
                    print(f"   金额: ${result['amount']:.2f}")
                    if 'pnl' in result:
                        print(f"   盈亏: ${result['pnl']:.2f}")
                elif result['status'] == 'skipped':
                    print(f"   原因: {result['reason']}")
        
        return signal
    
    def print_portfolio(self):
        """打印持仓报告"""
        portfolio = self.get_portfolio_value()
        if portfolio is None:
            return
        
        print("\n" + "=" * 70)
        print(f"💼 {self.symbol} 模拟交易账户")
        print("=" * 70)
        
        print(f"\n📊 账户概况:")
        print("-" * 70)
        print(f"   现金: ${portfolio['cash']:,.2f}")
        print(f"   持仓: {portfolio['shares']} 股")
        print(f"   成本价: ${portfolio['avg_cost']:.2f}")
        print(f"   当前价: ${portfolio['current_price']:.2f}")
        print(f"   持仓市值: ${portfolio['position_value']:,.2f}")
        print(f"   总市值: ${portfolio['total_value']:,.2f}")
        print(f"   浮动盈亏: ${portfolio['unrealized_pnl']:,.2f}")
        
        # 交易历史
        if self.position['trades']:
            print(f"\n📋 交易历史:")
            print("-" * 70)
            for trade in self.position['trades'][-10:]:  # 显示最近10笔
                pnl_str = f" | 盈亏: ${trade['pnl']:,.2f}" if 'pnl' in trade else ""
                print(f"   {trade['date']}: {trade['action']} {trade['shares']}股 @ ${trade['price']:.2f}{pnl_str}")
        
        print("=" * 70)


def main():
    """主函数"""
    if len(sys.argv) < 2:
        print("🦐 自动交易执行器使用说明：")
        print("=" * 70)
        print("用法:")
        print("  查看持仓: python auto_trader.py <股票代码> --portfolio")
        print("  运行策略: python auto_trader.py <股票代码> --run")
        print("  自动交易: python auto_trader.py <股票代码> --auto")
        print("\n示例:")
        print("  python auto_trader.py AAPL --portfolio")
        print("  python auto_trader.py AAPL --run")
        print("  python auto_trader.py AAPL --auto")
        print("\n⚠️ 注意：默认模拟交易模式，不涉及真实资金")
        sys.exit(1)
    
    symbol = sys.argv[1]
    trader = AutoTrader(symbol)
    
    if len(sys.argv) >= 3:
        if sys.argv[2] == '--portfolio':
            trader.print_portfolio()
        elif sys.argv[2] == '--run':
            print(f"🦐 运行交易策略: {symbol}")
            trader.run_strategy(auto_execute=False)
            trader.print_portfolio()
        elif sys.argv[2] == '--auto':
            print(f"🦐 自动交易模式: {symbol}")
            print("⚠️  这将根据信号自动执行模拟交易")
            trader.run_strategy(auto_execute=True)
            trader.print_portfolio()
    else:
        trader.print_portfolio()


if __name__ == "__main__":
    main()
