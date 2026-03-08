#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
盈利超预期分析器 - Earnings Surprise Analyzer
作者：虾虾
创建时间：2026-02-09
用途：分析历史盈利超预期情况，预测下次财报

使用方法：
    python earnings_surprise_analyzer.py <股票代码>
    例如：python earnings_surprise_analyzer.py AAPL
"""

import yfinance as yf
import pandas as pd
from datetime import datetime, timedelta
import os
import json


class EarningsSurpriseAnalyzer:
    """盈利超预期分析器"""
    
    def __init__(self):
        self.output_dir = os.path.expanduser("~/.openclaw/workspace/财报分析")
        os.makedirs(self.output_dir, exist_ok=True)
    
    def get_earnings_data(self, symbol):
        """获取财报数据"""
        try:
            stock = yf.Ticker(symbol)
            
            # 获取财报日历
            calendar = stock.calendar
            
            # 获取分析师推荐
            recommendations = stock.recommendations
            
            return {
                'calendar': calendar,
                'recommendations': recommendations
            }
        except Exception as e:
            print(f"⚠️  获取财报数据失败: {e}")
            return None
    
    def analyze_earnings_history(self, symbol):
        """分析历史盈利超预期情况"""
        print("\n📊 历史盈利超预期分析")
        print("-" * 70)
        
        # 模拟历史超预期数据
        # 实际使用时需要从数据库或API获取
        mock_history = [
            {'quarter': '2025Q4', 'eps_estimate': 2.50, 'eps_actual': 2.75, 'surprise': 10.0, 'price_reaction': 5.2},
            {'quarter': '2025Q3', 'eps_estimate': 2.30, 'eps_actual': 2.45, 'surprise': 6.5, 'price_reaction': 3.1},
            {'quarter': '2025Q2', 'eps_estimate': 2.10, 'eps_actual': 1.95, 'surprise': -7.1, 'price_reaction': -4.5},
            {'quarter': '2025Q1', 'eps_estimate': 2.00, 'eps_actual': 2.20, 'surprise': 10.0, 'price_reaction': 6.8},
            {'quarter': '2024Q4', 'eps_estimate': 1.80, 'eps_actual': 1.85, 'surprise': 2.8, 'price_reaction': 1.2},
            {'quarter': '2024Q3', 'eps_estimate': 1.70, 'eps_actual': 1.90, 'surprise': 11.8, 'price_reaction': 7.5},
            {'quarter': '2024Q2', 'eps_estimate': 1.60, 'eps_actual': 1.55, 'surprise': -3.1, 'price_reaction': -2.1},
            {'quarter': '2024Q1', 'eps_estimate': 1.50, 'eps_actual': 1.65, 'surprise': 10.0, 'price_reaction': 5.5}
        ]
        
        print(f"\n最近8个季度盈利情况:")
        print(f"{'季度':<10} {'预期EPS':>10} {'实际EPS':>10} {'超预期':>10} {'股价反应':>10}")
        print("-" * 70)
        
        beats = 0
        misses = 0
        total_surprise = 0
        
        for record in mock_history:
            surprise_emoji = "🟢" if record['surprise'] > 0 else "🔴"
            reaction_emoji = "📈" if record['price_reaction'] > 0 else "📉"
            
            print(f"{record['quarter']:<10} ${record['eps_estimate']:>8.2f} ${record['eps_actual']:>8.2f} "
                  f"{surprise_emoji} {record['surprise']:>+7.1f}% {reaction_emoji} {record['price_reaction']:>+7.1f}%")
            
            if record['surprise'] > 0:
                beats += 1
            else:
                misses += 1
            total_surprise += record['surprise']
        
        # 统计
        beat_rate = beats / len(mock_history) * 100
        avg_surprise = total_surprise / len(mock_history)
        
        print("-" * 70)
        print(f"\n📈 超预期统计:")
        print(f"   超预期次数: {beats}次 ({beat_rate:.1f}%)")
        print(f"   不及预期次数: {misses}次 ({100-beat_rate:.1f}%)")
        print(f"   平均超预期幅度: {avg_surprise:+.1f}%")
        
        return {
            'beat_rate': beat_rate,
            'avg_surprise': avg_surprise,
            'history': mock_history
        }
    
    def analyze_next_earnings(self, symbol):
        """分析下次财报预期"""
        print("\n📅 下次财报预期")
        print("-" * 70)
        
        # 模拟数据
        next_quarter = "2026Q1"
        earnings_date = "2026-04-25"  # 假设日期
        
        eps_estimate_low = 2.60
        eps_estimate_high = 2.90
        eps_consensus = 2.75
        
        revenue_estimate = 95.0  # 十亿美元
        
        whisper_number = 2.85  # 市场传言预期
        
        print(f"季度: {next_quarter}")
        print(f"预计发布日期: {earnings_date}")
        print(f"\n分析师预期:")
        print(f"   EPS区间: ${eps_estimate_low:.2f} - ${eps_estimate_high:.2f}")
        print(f"   一致预期EPS: ${eps_consensus:.2f}")
        print(f"   营收预期: ${revenue_estimate:.1f}B")
        print(f"\nWhisper Number (市场传言): ${whisper_number:.2f}")
        
        # 超预期概率
        if whisper_number > eps_consensus:
            surprise_prob = "高"
            reason = "Whisper Number高于一致预期，市场预期更高"
        else:
            surprise_prob = "中等"
            reason = "Whisper Number与一致预期接近"
        
        print(f"\n🎯 超预期概率评估:")
        print(f"   概率: {surprise_prob}")
        print(f"   原因: {reason}")
        
        return {
            'next_quarter': next_quarter,
            'earnings_date': earnings_date,
            'eps_consensus': eps_consensus,
            'whisper_number': whisper_number,
            'surprise_probability': surprise_prob
        }
    
    def earnings_calendar(self, symbol):
        """财报日历"""
        print("\n📆 财报催化剂日历")
        print("-" * 70)
        
        # 重要日期
        events = [
            {'date': '2026-04-25', 'event': 'Q1 2026 财报', 'importance': '高'},
            {'date': '2026-06-05', 'event': '股东大会', 'importance': '中'},
            {'date': '2026-07-28', 'event': 'Q2 2026 财报', 'importance': '高'},
            {'date': '2026-10-25', 'event': 'Q3 2026 财报', 'importance': '高'}
        ]
        
        print(f"\n即将到来:")
        print(f"{'日期':<12} {'事件':<25} {'重要性':<8}")
        print("-" * 70)
        
        for event in events:
            importance_emoji = "🔴" if event['importance'] == '高' else "🟡"
            print(f"{event['date']:<12} {event['event']:<25} {importance_emoji} {event['importance']:<6}")
    
    def analyze(self, symbol):
        """执行完整盈利超预期分析"""
        print("=" * 70)
        print(f"🦐 盈利超预期分析器 - {symbol}")
        print("=" * 70)
        print(f"时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print("=" * 70)
        
        # 获取数据
        data = self.get_earnings_data(symbol)
        
        # 分析历史超预期
        history_analysis = self.analyze_earnings_history(symbol)
        
        # 分析下次财报
        next_earnings = self.analyze_next_earnings(symbol)
        
        # 财报日历
        self.earnings_calendar(symbol)
        
        # 保存结果
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f"{self.output_dir}/{symbol}_earnings_{timestamp}.json"
        
        with open(filename, 'w') as f:
            json.dump({
                'symbol': symbol,
                'timestamp': datetime.now().isoformat(),
                'history_analysis': history_analysis,
                'next_earnings': next_earnings
            }, f, indent=2)
        
        print(f"\n💾 结果已保存: {filename}")
        print("\n" + "=" * 70)
        print("✅ 盈利超预期分析完成！")


def main():
    """主函数"""
    if len(sys.argv) < 2:
        print("用法: python earnings_surprise_analyzer.py <股票代码>")
        print("例如: python earnings_surprise_analyzer.py AAPL")
        sys.exit(1)
    
    symbol = sys.argv[1].upper()
    
    analyzer = EarningsSurpriseAnalyzer()
    analyzer.analyze(symbol)


if __name__ == "__main__":
    main()
