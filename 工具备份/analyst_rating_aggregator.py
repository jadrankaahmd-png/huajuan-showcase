#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
分析师评级聚合器 - Analyst Rating Aggregator
作者：虾虾
创建时间：2026-02-08
用途：聚合华尔街分析师评级，目标价变化，升级降级统计
"""

import yfinance as yf
import pandas as pd
from datetime import datetime
import os


class AnalystRatingAggregator:
    """分析师评级聚合器"""
    
    def __init__(self):
        self.output_dir = os.path.expanduser("~/.openclaw/workspace/分析师评级数据")
        os.makedirs(self.output_dir, exist_ok=True)
        
        # 监控列表
        self.watchlist = ['NVDA', 'TSM', 'AMD', 'AAPL', 'MSFT', 'GOOGL', 'META', 'TSLA']
    
    def get_analyst_ratings(self, symbol):
        """
        获取分析师评级
        """
        try:
            stock = yf.Ticker(symbol)
            
            # 获取推荐
            recommendations = stock.recommendations
            if recommendations is None or recommendations.empty:
                return None
            
            # 获取目标价
            target_price = stock.info.get('targetMeanPrice', 0)
            current_price = stock.info.get('currentPrice', 0)
            
            # 计算上涨空间
            upside = (target_price / current_price - 1) * 100 if current_price > 0 else 0
            
            # 统计最近评级
            recent = recommendations.tail(30)  # 最近30天
            
            buy_count = len(recent[recent['To Grade'].isin(['Buy', 'Strong Buy'])])
            hold_count = len(recent[recent['To Grade'] == 'Hold'])
            sell_count = len(recent[recent['To Grade'].isin(['Sell', 'Strong Sell'])])
            
            total = buy_count + hold_count + sell_count
            
            return {
                'symbol': symbol,
                'current_price': current_price,
                'target_price': target_price,
                'upside': upside,
                'buy_count': buy_count,
                'hold_count': hold_count,
                'sell_count': sell_count,
                'buy_pct': buy_count / total * 100 if total > 0 else 0,
                'recommendation': '买入' if buy_count > sell_count else '卖出' if sell_count > buy_count else '持有'
            }
            
        except Exception as e:
            print(f"⚠️  获取{symbol}分析师评级失败: {e}")
            return None
    
    def generate_rating_report(self):
        """
        生成评级报告
        """
        print("🦐 分析师评级聚合报告")
        print("=" * 70)
        print(f"时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print("=" * 70)
        
        all_ratings = []
        
        for symbol in self.watchlist:
            rating = self.get_analyst_ratings(symbol)
            if rating:
                all_ratings.append(rating)
        
        # 按上涨空间排序
        all_ratings.sort(key=lambda x: x['upside'], reverse=True)
        
        print("\n📊 分析师目标价排名:")
        print("-" * 70)
        print(f"{'股票':<8} {'现价':>10} {'目标价':>10} {'上涨空间':>10} {'评级':>8}")
        print("-" * 70)
        
        for r in all_ratings:
            emoji = "🚀" if r['upside'] > 30 else "🟢" if r['upside'] > 10 else "⚪" if r['upside'] > 0 else "🔴"
            print(f"{emoji} {r['symbol']:<6} ${r['current_price']:>8.2f} ${r['target_price']:>8.2f} {r['upside']:>+8.1f}% {r['recommendation']:>8}")
        
        print("\n" + "=" * 70)
        print("✅ 分析师评级分析完成！")


def main():
    """主函数"""
    aggregator = AnalystRatingAggregator()
    aggregator.generate_rating_report()


if __name__ == "__main__":
    main()
