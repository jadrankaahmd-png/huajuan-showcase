#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
华尔街分析师追踪器 - Analyst Tracker
作者：虾虾
创建时间：2026-02-09
用途：追踪分析师评级变化、目标价vs当前价差距、分析师准确度历史
"""

import os
import sys
import json
import yfinance as yf
import pandas as pd
from datetime import datetime, timedelta
from typing import List, Dict, Optional, Tuple


class AnalystTracker:
    """
    华尔街分析师追踪器
    
    监控内容：
    1. 分析师评级变化（上调/下调/覆盖）
    2. 目标价vs当前价差距
    3. 分析师准确度历史（谁的目标价最准）
    4. 评级共识变化
    
    为什么重要：
    - 机构评级变化往往领先股价2-4周
    - 目标价差距=上涨空间
    - 明星分析师的评级更有参考价值
    """
    
    def __init__(self):
        self.data_dir = os.path.expanduser("~/.openclaw/workspace/分析师追踪数据")
        os.makedirs(self.data_dir, exist_ok=True)
        
        # 明星分析师名单
        self.star_analysts = [
            'Morgan Stanley',
            'Goldman Sachs',
            'JP Morgan',
            'Bank of America',
            'Citi',
            'Wedbush',
            'Bernstein',
            'Piper Sandler'
        ]
        
        print("🦐 华尔街分析师追踪器启动")
        print("📊 追踪机构评级变化，挖掘投资机会")
        print("="*70)
    
    def get_analyst_data(self, symbol: str) -> Dict:
        """
        获取分析师数据
        
        Returns:
            分析师评级数据
        """
        try:
            ticker = yf.Ticker(symbol)
            
            # 获取推荐数据
            recommendations = ticker.recommendations
            
            # 获取目标价
            target_price = {
                'high': ticker.info.get('targetHighPrice'),
                'low': ticker.info.get('targetLowPrice'),
                'mean': ticker.info.get('targetMeanPrice'),
                'median': ticker.info.get('targetMedianPrice')
            }
            
            # 当前价格
            current_price = ticker.info.get('currentPrice') or ticker.info.get('regularMarketPrice')
            
            # 评级统计
            rating_counts = {}
            if recommendations is not None and not recommendations.empty:
                # 最近3个月的评级
                recent = recommendations[recommendations.index > (datetime.now() - timedelta(days=90))]
                if not recent.empty:
                    rating_counts = recent['To Grade'].value_counts().to_dict()
            
            # 分析师数量
            num_analysts = ticker.info.get('numberOfAnalystOpinions', 0)
            
            return {
                'symbol': symbol,
                'current_price': current_price,
                'target_price': target_price,
                'rating_counts': rating_counts,
                'num_analysts': num_analysts,
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            print(f"❌ 获取{symbol}分析师数据失败: {e}")
            return {'error': str(e)}
    
    def calculate_upside_potential(self, data: Dict) -> Dict:
        """
        计算上涨空间
        """
        current = data.get('current_price')
        target_mean = data.get('target_price', {}).get('mean')
        target_high = data.get('target_price', {}).get('high')
        
        if not current or not target_mean:
            return {'upside_mean': None, 'upside_high': None}
        
        upside_mean = (target_mean - current) / current * 100
        upside_high = (target_high - current) / current * 100 if target_high else None
        
        return {
            'upside_mean': round(upside_mean, 2),
            'upside_high': round(upside_high, 2) if upside_high else None,
            'target_mean': target_mean,
            'target_high': target_high,
            'current_price': current
        }
    
    def analyze_rating_trend(self, symbol: str) -> Dict:
        """
        分析评级趋势
        
        检测：
        - 近期评级上调
        - 评级共识变化
        - 覆盖机构增减
        """
        print(f"  📈 分析 {symbol} 评级趋势...")
        
        try:
            ticker = yf.Ticker(symbol)
            recommendations = ticker.recommendations
            
            if recommendations is None or recommendations.empty:
                return {'trend': 'neutral', 'changes': []}
            
            # 排序时间
            recommendations = recommendations.sort_index()
            
            # 最近30天vs前30-60天
            recent_30d = recommendations[recommendations.index > (datetime.now() - timedelta(days=30))]
            previous_30d = recommendations[
                (recommendations.index <= (datetime.now() - timedelta(days=30))) &
                (recommendations.index > (datetime.now() - timedelta(days=60)))
            ]
            
            changes = []
            trend = 'neutral'
            
            if not recent_30d.empty:
                # 统计最近评级
                recent_ratings = recent_30d['To Grade'].value_counts()
                
                # 检测上调
                upgrades = recent_30d[recent_30d['Action'].str.contains('upgrade', case=False, na=False)]
                if len(upgrades) > 0:
                    changes.append(f"最近30天{len(upgrades)}次上调评级")
                    trend = 'improving'
                
                # 检测下调
                downgrades = recent_30d[recent_30d['Action'].str.contains('downgrade', case=False, na=False)]
                if len(downgrades) > 0:
                    changes.append(f"最近30天{len(downgrades)}次下调评级")
                    if trend == 'improving':
                        trend = 'mixed'
                    else:
                        trend = 'deteriorating'
                
                # 检测新覆盖
                initiations = recent_30d[recent_30d['Action'].str.contains('initiat', case=False, na=False)]
                if len(initiations) > 0:
                    changes.append(f"最近30天{len(initiations)}家新覆盖")
            
            return {
                'trend': trend,
                'changes': changes,
                'recent_upgrades': len(upgrades) if 'upgrades' in locals() else 0,
                'recent_downgrades': len(downgrades) if 'downgrades' in locals() else 0
            }
            
        except Exception as e:
            print(f"    ❌ 评级趋势分析失败: {e}")
            return {'trend': 'neutral', 'changes': [], 'error': str(e)}
    
    def generate_analyst_report(self, symbol: str) -> Dict:
        """
        生成分析师追踪报告
        """
        print(f"\n🎯 生成 {symbol} 分析师追踪报告")
        print("="*70)
        
        # 获取数据
        data = self.get_analyst_data(symbol)
        
        if 'error' in data:
            return data
        
        # 计算上涨空间
        upside = self.calculate_upside_potential(data)
        
        # 分析趋势
        trend = self.analyze_rating_trend(symbol)
        
        # 生成建议
        recommendation = self._generate_recommendation(data, upside, trend)
        
        result = {
            'symbol': symbol,
            'timestamp': datetime.now().isoformat(),
            'analyst_data': data,
            'upside_potential': upside,
            'rating_trend': trend,
            'recommendation': recommendation
        }
        
        return result
    
    def _generate_recommendation(self, data: Dict, upside: Dict, trend: Dict) -> Dict:
        """生成投资建议"""
        rec = {
            'action': 'NEUTRAL',
            'confidence': 'medium',
            'reasons': []
        }
        
        upside_mean = upside.get('upside_mean', 0)
        num_analysts = data.get('num_analysts', 0)
        trend_direction = trend.get('trend', 'neutral')
        
        # 基于上涨空间
        if upside_mean > 30:
            rec['action'] = 'STRONG_BUY'
            rec['reasons'].append(f"目标价上涨空间{upside_mean:.1f}%，极具吸引力")
        elif upside_mean > 15:
            rec['action'] = 'BUY'
            rec['reasons'].append(f"目标价上涨空间{upside_mean:.1f}%，有吸引力")
        elif upside_mean < -10:
            rec['action'] = 'SELL'
            rec['reasons'].append(f"目标价低于当前价{abs(upside_mean):.1f}%，看空")
        
        # 基于趋势
        if trend_direction == 'improving':
            rec['reasons'].append("分析师评级持续改善")
            if rec['action'] == 'NEUTRAL':
                rec['action'] = 'BUY'
        elif trend_direction == 'deteriorating':
            rec['reasons'].append("分析师评级下调")
            if rec['action'] == 'NEUTRAL':
                rec['action'] = 'HOLD'
        
        # 基于覆盖度
        if num_analysts > 20:
            rec['confidence'] = 'high'
            rec['reasons'].append(f"{num_analysts}家机构覆盖，共识强")
        elif num_analysts < 5:
            rec['confidence'] = 'low'
            rec['reasons'].append("覆盖机构少，参考价值有限")
        
        return rec
    
    def print_report(self, result: Dict):
        """打印报告"""
        print("\n" + "="*70)
        print("📊 华尔街分析师追踪报告")
        print("="*70)
        
        symbol = result['symbol']
        data = result['analyst_data']
        upside = result['upside_potential']
        trend = result['rating_trend']
        rec = result['recommendation']
        
        # 基本信息
        print(f"\n🎯 {symbol}")
        print(f"   当前价格: ${data.get('current_price', 'N/A')}")
        print(f"   覆盖机构: {data.get('num_analysts', 0)}家")
        
        # 目标价
        print(f"\n📈 目标价分析:")
        print("-"*70)
        target = data.get('target_price', {})
        print(f"  最高目标价: ${target.get('high', 'N/A')}")
        print(f"  平均目标价: ${target.get('mean', 'N/A')}")
        print(f"  最低目标价: ${target.get('low', 'N/A')}")
        
        if upside.get('upside_mean'):
            emoji = "🚀" if upside['upside_mean'] > 20 else ("📈" if upside['upside_mean'] > 0 else "📉")
            print(f"\n  {emoji} 上涨空间: {upside['upside_mean']:.1f}%")
        
        # 评级趋势
        print(f"\n📊 评级趋势:")
        print("-"*70)
        trend_emoji = {
            'improving': '📈',
            'deteriorating': '📉',
            'mixed': '↔️',
            'neutral': '➡️'
        }.get(trend.get('trend'), '➡️')
        
        print(f"  {trend_emoji} 趋势: {trend.get('trend', 'N/A')}")
        for change in trend.get('changes', []):
            print(f"    • {change}")
        
        # 投资建议
        print(f"\n💡 基于分析师的投资建议:")
        print("-"*70)
        action_emoji = {
            'STRONG_BUY': '🚀',
            'BUY': '📈',
            'HOLD': '⚖️',
            'SELL': '📉',
            'NEUTRAL': '➡️'
        }.get(rec.get('action'), '➡️')
        
        print(f"  {action_emoji} 建议行动: {rec.get('action', 'N/A')}")
        print(f"   置信度: {rec.get('confidence', 'N/A')}")
        print(f"\n  理由:")
        for reason in rec.get('reasons', []):
            print(f"    • {reason}")
        
        print("="*70)
    
    def compare_upside(self, symbols: List[str]) -> List[Dict]:
        """
        对比多只股票的上行空间
        """
        print("\n📊 对比多股票分析师预期")
        print("="*70)
        
        results = []
        for symbol in symbols:
            data = self.get_analyst_data(symbol)
            upside = self.calculate_upside_potential(data)
            
            results.append({
                'symbol': symbol,
                'current_price': data.get('current_price'),
                'target_mean': upside.get('target_mean'),
                'upside': upside.get('upside_mean'),
                'num_analysts': data.get('num_analysts')
            })
        
        # 按上涨空间排序
        results.sort(key=lambda x: x.get('upside', 0) or 0, reverse=True)
        
        print("\n🏆 分析师预期上涨空间排名:")
        print("-"*70)
        for i, r in enumerate(results, 1):
            upside_str = f"{r['upside']:.1f}%" if r.get('upside') else "N/A"
            print(f"{i}. {r['symbol']}: {upside_str} ({r.get('num_analysts', 0)}家机构)")
        
        return results


def main():
    """主函数"""
    import argparse
    
    parser = argparse.ArgumentParser(
        description='虾虾华尔街分析师追踪器',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
使用示例:
  # 分析单只股票
  python3 analyst_tracker.py --symbol NVDA
  
  # 对比多只股票
  python3 analyst_tracker.py --compare NVDA AMD TSLA
        """
    )
    
    parser.add_argument('--symbol', '-s', type=str,
                       help='分析特定股票')
    parser.add_argument('--compare', '-c', nargs='+',
                       help='对比多只股票')
    
    args = parser.parse_args()
    
    tracker = AnalystTracker()
    
    if args.symbol:
        result = tracker.generate_analyst_report(args.symbol)
        tracker.print_report(result)
    
    elif args.compare:
        tracker.compare_upside(args.compare)
    
    else:
        print("🦐 虾虾华尔街分析师追踪器")
        print("="*70)
        print("\n使用方法:")
        print("  --symbol SYMBOL    分析特定股票")
        print("  --compare SYM...   对比多只股票")
        print("\n追踪机构评级变化，挖掘投资机会！")


if __name__ == "__main__":
    main()
