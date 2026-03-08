#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
期权分析工具 - Options Analyzer
作者：虾虾
创建时间：2026-02-08
用途：分析期权链数据，提供策略建议
"""

import yfinance as yf
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from scipy.stats import norm
import sys


class OptionsAnalyzer:
    """期权分析器"""
    
    def __init__(self, symbol):
        self.symbol = symbol
        self.stock = None
        self.current_price = None
        self.options_dates = []
        
    def fetch_data(self):
        """获取股票和期权数据"""
        try:
            self.stock = yf.Ticker(self.symbol)
            self.current_price = self.stock.info.get('currentPrice', self.stock.info.get('regularMarketPrice', 0))
            self.options_dates = self.stock.options
            
            print(f"✅ 获取{self.symbol}数据成功")
            print(f"   当前价格: ${self.current_price:.2f}")
            print(f"   可用期权到期日: {len(self.options_dates)}个")
            return True
        except Exception as e:
            print(f"❌ 获取{self.symbol}数据失败: {e}")
            return False
    
    def get_options_chain(self, expiration_date=None):
        """
        获取期权链
        expiration_date: 到期日 (YYYY-MM-DD)，默认最近一个
        """
        if not self.options_dates:
            print("❌ 无可用期权数据")
            return None
        
        if expiration_date is None:
            expiration_date = self.options_dates[0]
        
        try:
            opt_chain = self.stock.option_chain(expiration_date)
            return {
                'calls': opt_chain.calls,
                'puts': opt_chain.puts,
                'expiration': expiration_date
            }
        except Exception as e:
            print(f"❌ 获取期权链失败: {e}")
            return None
    
    def calculate_max_pain(self, options_chain):
        """
        计算Max Pain（最大痛点）
        即让期权买方损失最大、卖方获利最大的价格
        """
        if options_chain is None:
            return None
        
        calls = options_chain['calls']
        puts = options_chain['puts']
        
        # 获取所有行权价
        strikes = sorted(set(calls['strike'].tolist() + puts['strike'].tolist()))
        
        pains = []
        for strike in strikes:
            # 计算该行权价下的总权利金
            call_pain = ((calls['strike'] - strike).clip(lower=0) * calls['openInterest']).sum()
            put_pain = ((strike - puts['strike']).clip(lower=0) * puts['openInterest']).sum()
            total_pain = call_pain + put_pain
            pains.append({'strike': strike, 'pain': total_pain})
        
        pain_df = pd.DataFrame(pains)
        max_pain_strike = pain_df.loc[pain_df['pain'].idxmin(), 'strike']
        
        return {
            'max_pain_price': max_pain_strike,
            'current_price': self.current_price,
            'distance': ((max_pain_strike - self.current_price) / self.current_price * 100)
        }
    
    def analyze_iv_skew(self, options_chain):
        """
        分析IV偏斜（Volatility Skew）
        """
        if options_chain is None:
            return None
        
        calls = options_chain['calls']
        puts = options_chain['puts']
        
        # 筛选ATM附近的期权
        atm_calls = calls.iloc[(calls['strike'] - self.current_price).abs().argsort()[:5]]
        atm_puts = puts.iloc[(puts['strike'] - self.current_price).abs().argsort()[:5]]
        
        call_iv = atm_calls['impliedVolatility'].mean()
        put_iv = atm_puts['impliedVolatility'].mean()
        
        skew = put_iv - call_iv
        
        interpretation = ""
        if skew > 0.05:
            interpretation = "Put IV显著高于Call，市场情绪偏空"
        elif skew < -0.05:
            interpretation = "Call IV显著高于Put，市场情绪偏多"
        else:
            interpretation = "IV偏斜中性，市场情绪平衡"
        
        return {
            'call_iv': call_iv,
            'put_iv': put_iv,
            'skew': skew,
            'interpretation': interpretation
        }
    
    def find_unusual_volume(self, options_chain, threshold=2.0):
        """
        寻找异常成交量的期权
        """
        if options_chain is None:
            return None
        
        calls = options_chain['calls']
        puts = options_chain['puts']
        
        # 计算平均成交量
        avg_call_volume = calls['volume'].mean()
        avg_put_volume = puts['volume'].mean()
        
        # 筛选异常成交量
        unusual_calls = calls[calls['volume'] > avg_call_volume * threshold].copy()
        unusual_puts = puts[puts['volume'] > avg_put_volume * threshold].copy()
        
        unusual_calls['type'] = 'CALL'
        unusual_puts['type'] = 'PUT'
        
        return {
            'calls': unusual_calls[['strike', 'volume', 'openInterest', 'impliedVolatility', 'type']].head(5),
            'puts': unusual_puts[['strike', 'volume', 'openInterest', 'impliedVolatility', 'type']].head(5)
        }
    
    def suggest_strategies(self, outlook='neutral'):
        """
        根据 outlook 提供期权策略建议
        outlook: 'bullish', 'bearish', 'neutral', 'volatile'
        """
        strategies = {
            'bullish': {
                'name': '看涨策略',
                'strategies': [
                    {
                        'name': 'Long Call',
                        'setup': f'买入{self.symbol} Call期权',
                        'max_profit': '无限',
                        'max_loss': '权利金',
                        'when_to_use': '强烈看涨，预期大幅上涨'
                    },
                    {
                        'name': 'Bull Call Spread',
                        'setup': '买入低行权价Call + 卖出高行权价Call',
                        'max_profit': '有限（行权价差-净权利金）',
                        'max_loss': '净权利金',
                        'when_to_use': '温和看涨，降低权利金成本'
                    },
                    {
                        'name': 'Cash-Secured Put',
                        'setup': f'卖出{self.symbol} Put期权',
                        'max_profit': '权利金',
                        'max_loss': '行权价-权利金',
                        'when_to_use': '想在低位买入股票，收权利金等待'
                    }
                ]
            },
            'bearish': {
                'name': '看跌策略',
                'strategies': [
                    {
                        'name': 'Long Put',
                        'setup': f'买入{self.symbol} Put期权',
                        'max_profit': '行权价-权利金',
                        'max_loss': '权利金',
                        'when_to_use': '强烈看跌，预期大幅下跌'
                    },
                    {
                        'name': 'Bear Put Spread',
                        'setup': '买入高行权价Put + 卖出低行权价Put',
                        'max_profit': '有限（行权价差-净权利金）',
                        'max_loss': '净权利金',
                        'when_to_use': '温和看跌，降低权利金成本'
                    },
                    {
                        'name': 'Covered Call',
                        'setup': f'持有{self.symbol}股票 + 卖出Call期权',
                        'max_profit': '权利金+涨幅',
                        'max_loss': '股票下跌-权利金',
                        'when_to_use': '持有股票，预期震荡或小幅上涨'
                    }
                ]
            },
            'neutral': {
                'name': '中性策略',
                'strategies': [
                    {
                        'name': 'Iron Condor',
                        'setup': '卖出宽跨式 + 买入更远宽跨式（保护）',
                        'max_profit': '净权利金',
                        'max_loss': '行权价差-净权利金',
                        'when_to_use': '预期股价在区间内震荡'
                    },
                    {
                        'name': 'Calendar Spread',
                        'setup': '卖出近期期权 + 买入远期同价期权',
                        'max_profit': '时间价值衰减差',
                        'max_loss': '净权利金',
                        'when_to_use': '预期短期震荡，长期有方向'
                    },
                    {
                        'name': 'Butterfly Spread',
                        'setup': '买入1低+卖出2中+买入1高（同类型）',
                        'max_profit': '行权价差-净权利金',
                        'max_loss': '净权利金',
                        'when_to_use': '预期股价接近中间行权价'
                    }
                ]
            },
            'volatile': {
                'name': '高波动策略',
                'strategies': [
                    {
                        'name': 'Long Straddle',
                        'setup': '同时买入同价Call和Put',
                        'max_profit': '无限',
                        'max_loss': '总权利金',
                        'when_to_use': '预期大波动但不确定方向（如财报前）'
                    },
                    {
                        'name': 'Long Strangle',
                        'setup': '买入OTM Call + 买入OTM Put',
                        'max_profit': '无限',
                        'max_loss': '总权利金',
                        'when_to_use': '比Straddle成本低，需要更大波动'
                    }
                ]
            }
        }
        
        return strategies.get(outlook, strategies['neutral'])
    
    def print_analysis(self, expiration_date=None):
        """打印完整分析报告"""
        print("\n" + "=" * 70)
        print(f"📊 {self.symbol} 期权分析报告")
        print("=" * 70)
        
        print(f"\n💰 股票信息：")
        print(f"   当前价格: ${self.current_price:.2f}")
        
        # 获取期权链
        chain = self.get_options_chain(expiration_date)
        if chain:
            print(f"   期权到期日: {chain['expiration']}")
            
            # Max Pain
            max_pain = self.calculate_max_pain(chain)
            if max_pain:
                print(f"\n🎯 Max Pain（最大痛点）:")
                print(f"   价格: ${max_pain['max_pain_price']:.2f}")
                print(f"   距离当前: {max_pain['distance']:.1f}%")
                if abs(max_pain['distance']) > 5:
                    direction = "下跌" if max_pain['distance'] > 0 else "上涨"
                    print(f"   提示: 期权市场倾向于股价向Max Pain{direction}")
            
            # IV分析
            iv_skew = self.analyze_iv_skew(chain)
            if iv_skew:
                print(f"\n📈 隐含波动率分析:")
                print(f"   Call IV: {iv_skew['call_iv']*100:.1f}%")
                print(f"   Put IV: {iv_skew['put_iv']*100:.1f}%")
                print(f"   偏斜: {iv_skew['skew']*100:.1f}%")
                print(f"   解读: {iv_skew['interpretation']}")
            
            # 异常成交量
            unusual = self.find_unusual_volume(chain)
            if unusual:
                print(f"\n🔥 异常成交量期权:")
                if not unusual['calls'].empty:
                    print("   Call期权:")
                    for _, row in unusual['calls'].iterrows():
                        print(f"     行权价${row['strike']:.1f}: 成交量{row['volume']}, OI{row['openInterest']}, IV{row['impliedVolatility']*100:.0f}%")
                
                if not unusual['puts'].empty:
                    print("   Put期权:")
                    for _, row in unusual['puts'].iterrows():
                        print(f"     行权价${row['strike']:.1f}: 成交量{row['volume']}, OI{row['openInterest']}, IV{row['impliedVolatility']*100:.0f}%")
            
            # 策略建议
            print(f"\n💡 期权策略建议:")
            for outlook in ['bullish', 'bearish', 'neutral', 'volatile']:
                strategy = self.suggest_strategies(outlook)
                print(f"\n  {strategy['name']}:")
                for s in strategy['strategies'][:2]:  # 只显示前2个
                    print(f"    • {s['name']}: {s['when_to_use']}")
        
        print("=" * 70)


def main():
    """主函数"""
    if len(sys.argv) < 2:
        print("🦐 期权分析工具使用说明：")
        print("=" * 70)
        print("用法: python options_analyzer.py <股票代码> [到期日]")
        print("\n示例:")
        print("  python options_analyzer.py AAPL")
        print("  python options_analyzer.py NVDA 2026-02-14")
        sys.exit(1)
    
    symbol = sys.argv[1]
    expiration = sys.argv[2] if len(sys.argv) > 2 else None
    
    analyzer = OptionsAnalyzer(symbol)
    if analyzer.fetch_data():
        analyzer.print_analysis(expiration)


if __name__ == "__main__":
    main()
