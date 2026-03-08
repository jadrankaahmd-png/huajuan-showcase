#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
期权流分析器 - Options Flow Analyzer
作者：虾虾
创建时间：2026-02-08
用途：分析期权市场资金流向，大单追踪，异常成交量检测
"""

import yfinance as yf
import pandas as pd
from datetime import datetime
import os


class OptionsFlowAnalyzer:
    """期权流分析器"""
    
    def __init__(self):
        self.output_dir = os.path.expanduser("~/.openclaw/workspace/期权流数据")
        os.makedirs(self.output_dir, exist_ok=True)
        
        # 监控列表
        self.watchlist = ['NVDA', 'TSLA', 'AAPL', 'AMZN', 'META', 'AMD', 'COIN', 'PLTR']
    
    def get_unusual_options_activity(self, symbol):
        """
        获取异常期权成交量
        """
        try:
            stock = yf.Ticker(symbol)
            
            # 获取期权链
            options = stock.options
            if not options:
                return None
            
            # 取最近的到期日
            nearest_expiry = options[0]
            
            # 获取期权链数据
            opt_chain = stock.option_chain(nearest_expiry)
            calls = opt_chain.calls
            puts = opt_chain.puts
            
            # 计算异常成交量（简化版）
            unusual_calls = calls[calls['volume'] > calls['openInterest'] * 2] if 'openInterest' in calls.columns else calls.head(5)
            unusual_puts = puts[puts['volume'] > puts['openInterest'] * 2] if 'openInterest' in puts.columns else puts.head(5)
            
            return {
                'symbol': symbol,
                'expiry': nearest_expiry,
                'unusual_calls': unusual_calls.to_dict('records') if not unusual_calls.empty else [],
                'unusual_puts': unusual_puts.to_dict('records') if not unusual_puts.empty else []
            }
            
        except Exception as e:
            print(f"⚠️  获取{symbol}期权数据失败: {e}")
            return None
    
    def analyze_options_flow(self, symbol):
        """
        分析期权流向
        """
        flow = self.get_unusual_options_activity(symbol)
        if not flow:
            return None
        
        # 简化分析
        call_volume = sum(c.get('volume', 0) for c in flow['unusual_calls'])
        put_volume = sum(p.get('volume', 0) for p in flow['unusual_puts'])
        
        total_volume = call_volume + put_volume
        if total_volume == 0:
            return None
        
        put_call_ratio = put_volume / call_volume if call_volume > 0 else float('inf')
        
        # 判断情绪
        if put_call_ratio < 0.7:
            sentiment = "🟢 看涨情绪浓厚"
        elif put_call_ratio > 1.3:
            sentiment = "🔴 看跌情绪浓厚"
        else:
            sentiment = "⚪ 情绪中性"
        
        return {
            'symbol': symbol,
            'put_call_ratio': put_call_ratio,
            'call_volume': call_volume,
            'put_volume': put_volume,
            'sentiment': sentiment
        }
    
    def generate_flow_report(self):
        """
        生成期权流报告
        """
        print("🦐 期权流分析报告")
        print("=" * 70)
        print(f"时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print("=" * 70)
        
        all_flows = []
        
        for symbol in self.watchlist:
            print(f"\n分析 {symbol}...")
            flow = self.analyze_options_flow(symbol)
            if flow:
                all_flows.append(flow)
                print(f"   Put/Call比率: {flow['put_call_ratio']:.2f}")
                print(f"   情绪: {flow['sentiment']}")
        
        # 排序
        all_flows.sort(key=lambda x: x['put_call_ratio'])
        
        print("\n" + "=" * 70)
        print("📊 期权流汇总:")
        print("-" * 70)
        
        print("\n🟢 看涨情绪（Put/Call < 0.7）:")
        for flow in all_flows:
            if flow['put_call_ratio'] < 0.7:
                print(f"   {flow['symbol']}: P/C={flow['put_call_ratio']:.2f}")
        
        print("\n🔴 看跌情绪（Put/Call > 1.3）:")
        for flow in all_flows:
            if flow['put_call_ratio'] > 1.3:
                print(f"   {flow['symbol']}: P/C={flow['put_call_ratio']:.2f}")
        
        print("\n" + "=" * 70)
        print("✅ 期权流分析完成！")


def main():
    """主函数"""
    analyzer = OptionsFlowAnalyzer()
    analyzer.generate_flow_report()


if __name__ == "__main__":
    main()
