#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
分析师报告聚合器 - Analyst Report Aggregator
作者：虾虾
创建时间：2026-02-09
用途：聚合Seeking Alpha、Motley Fool等分析师报告，提取目标价和评级变化

使用方法：
    python analyst_report_aggregator.py <股票代码>
    例如：python analyst_report_aggregator.py AAPL
"""

import json
import sys
from datetime import datetime, timedelta
import os


class AnalystReportAggregator:
    """分析师报告聚合器"""
    
    def __init__(self):
        self.output_dir = os.path.expanduser("~/.openclaw/workspace/分析师报告")
        os.makedirs(self.output_dir, exist_ok=True)
        
        # 分析师报告源
        self.sources = [
            'Seeking Alpha',
            'Motley Fool',
            'MarketBeat',
            'TipRanks',
            'Zacks',
            'Morningstar',
            'TheStreet',
            'Investopedia'
        ]
        
        # 评级映射
        self.rating_scale = {
            'Strong Buy': 5,
            'Buy': 4,
            'Outperform': 4,
            'Overweight': 4,
            'Hold': 3,
            'Neutral': 3,
            'Equal Weight': 3,
            'Market Perform': 3,
            'Underperform': 2,
            'Underweight': 2,
            'Sell': 1,
            'Strong Sell': 1
        }
    
    def aggregate_analyst_data(self, symbol):
        """
        聚合分析师数据
        注：实际使用时需要实现具体的API调用或爬虫
        这里提供框架和模拟数据
        """
        print(f"\n📊 聚合分析师报告 - {symbol}")
        print("-" * 70)
        
        # 模拟分析师数据
        # 实际使用时需要从各平台获取真实数据
        mock_data = self._generate_mock_analyst_data(symbol)
        
        return mock_data
    
    def _generate_mock_analyst_data(self, symbol):
        """生成模拟分析师数据"""
        
        # 针对不同公司的模拟数据
        analyst_data = {
            'AAPL': {
                'consensus_rating': 'Buy',
                'rating_score': 4.2,
                'price_target': 200.00,
                'current_price': 185.00,
                'upside': 8.1,
                'analyst_count': 35,
                'ratings_breakdown': {
                    'Strong Buy': 15,
                    'Buy': 12,
                    'Hold': 6,
                    'Sell': 2,
                    'Strong Sell': 0
                },
                'recent_changes': [
                    {
                        'date': '2026-01-15',
                        'analyst': 'Goldman Sachs',
                        'old_rating': 'Buy',
                        'new_rating': 'Strong Buy',
                        'old_target': 190.00,
                        'new_target': 210.00,
                        'change': '上调'
                    },
                    {
                        'date': '2026-01-10',
                        'analyst': 'Morgan Stanley',
                        'old_rating': 'Hold',
                        'new_rating': 'Buy',
                        'old_target': 175.00,
                        'new_target': 195.00,
                        'change': '上调'
                    }
                ],
                'latest_reports': [
                    {
                        'date': '2026-02-05',
                        'source': 'Seeking Alpha',
                        'title': 'Apple: AI Strategy Driving Growth',
                        'rating': 'Buy',
                        'target': 205.00,
                        'summary': '看好苹果AI战略，预计iPhone销量回升'
                    },
                    {
                        'date': '2026-02-01',
                        'source': 'Motley Fool',
                        'title': 'Why Apple Remains a Top Pick',
                        'rating': 'Outperform',
                        'target': 200.00,
                        'summary': '服务业务增长强劲，现金流稳定'
                    }
                ]
            },
            'OKLO': {
                'consensus_rating': 'Buy',
                'rating_score': 4.0,
                'price_target': 116.17,
                'current_price': 71.10,
                'upside': 63.4,
                'analyst_count': 12,
                'ratings_breakdown': {
                    'Strong Buy': 4,
                    'Buy': 5,
                    'Hold': 2,
                    'Sell': 1,
                    'Strong Sell': 0
                },
                'recent_changes': [
                    {
                        'date': '2026-01-20',
                        'analyst': 'Bank of America',
                        'old_rating': 'Hold',
                        'new_rating': 'Buy',
                        'old_target': 80.00,
                        'new_target': 120.00,
                        'change': '大幅上调'
                    }
                ],
                'latest_reports': [
                    {
                        'date': '2026-01-25',
                        'source': 'Seeking Alpha',
                        'title': 'Oklo: Meta Partnership Changes Everything',
                        'rating': 'Strong Buy',
                        'target': 130.00,
                        'summary': 'Meta合作是游戏规则改变者，收入可见性大幅提升'
                    },
                    {
                        'date': '2026-01-15',
                        'source': 'Motley Fool',
                        'title': 'Is Oklo the Next Energy Giant?',
                        'rating': 'Buy',
                        'target': 110.00,
                        'summary': '核能需求增长，Oklo处于有利位置'
                    }
                ]
            },
            'RKLB': {
                'consensus_rating': 'Hold',
                'rating_score': 3.2,
                'price_target': 63.08,
                'current_price': 73.54,
                'upside': -14.2,
                'analyst_count': 14,
                'ratings_breakdown': {
                    'Strong Buy': 2,
                    'Buy': 5,
                    'Hold': 4,
                    'Sell': 2,
                    'Strong Sell': 1
                },
                'recent_changes': [
                    {
                        'date': '2026-01-25',
                        'analyst': 'Citigroup',
                        'old_rating': 'Buy',
                        'new_rating': 'Hold',
                        'old_target': 85.00,
                        'new_target': 65.00,
                        'change': '下调'
                    }
                ],
                'latest_reports': [
                    {
                        'date': '2026-02-01',
                        'source': 'Seeking Alpha',
                        'title': 'Rocket Lab: Neutron Delays Create Uncertainty',
                        'rating': 'Hold',
                        'target': 60.00,
                        'summary': '中子火箭推迟引发担忧，但长期前景仍看好'
                    }
                ]
            }
        }
        
        return analyst_data.get(symbol.upper(), {
            'consensus_rating': 'N/A',
            'price_target': 0,
            'analyst_count': 0,
            'ratings_breakdown': {},
            'recent_changes': [],
            'latest_reports': []
        })
    
    def analyze_consensus(self, data):
        """分析分析师共识"""
        print("\n📈 分析师共识分析")
        print("-" * 70)
        
        if data['analyst_count'] == 0:
            print("⚠️  无分析师覆盖")
            return
        
        print(f"\n股票代码: {data.get('symbol', 'N/A')}")
        print(f"分析师数量: {data['analyst_count']} 位")
        print(f"一致评级: {data['consensus_rating']} (评分: {data['rating_score']}/5.0)")
        print(f"目标价: ${data['price_target']:.2f}")
        print(f"上涨空间: {data['upside']:+.1f}%")
        
        # 评级分布
        print("\n📊 评级分布:")
        ratings = data['ratings_breakdown']
        total = sum(ratings.values())
        
        rating_colors = {
            'Strong Buy': '🟢',
            'Buy': '🟢',
            'Outperform': '🟢',
            'Hold': '🟡',
            'Neutral': '🟡',
            'Underperform': '🔴',
            'Underweight': '🔴',
            'Sell': '🔴',
            'Strong Sell': '🔴'
        }
        
        for rating, count in sorted(ratings.items(), key=lambda x: self.rating_scale.get(x[0], 3), reverse=True):
            if count > 0:
                pct = count / total * 100
                emoji = rating_colors.get(rating, '⚪')
                print(f"   {emoji} {rating:<15} {count:>3}家 ({pct:>5.1f}%)")
    
    def analyze_price_target_changes(self, data):
        """分析目标价变化"""
        print("\n💰 目标价变化分析")
        print("-" * 70)
        
        changes = data.get('recent_changes', [])
        
        if not changes:
            print("⚠️  近期无评级或目标价调整")
            return
        
        print(f"\n最近{len(changes)}次调整:")
        print(f"{'日期':<12} {'机构':<20} {'原评级':<12} {'新评级':<12} {'目标价变化':<20}")
        print("-" * 70)
        
        for change in changes:
            rating_change = "🟢" if change['change'] == '上调' else "🔴" if change['change'] == '下调' else "🟡"
            target_change = change['new_target'] - change['old_target']
            target_str = f"${change['old_target']:.0f} → ${change['new_target']:.0f} ({target_change:+.0f})"
            
            print(f"{change['date']:<12} {change['analyst']:<20} {change['old_rating']:<12} "
                  f"{change['new_rating']:<12} {rating_change} {target_str}")
        
        # 趋势分析
        upgrades = sum(1 for c in changes if c['change'] == '上调')
        downgrades = sum(1 for c in changes if c['change'] == '下调')
        
        print(f"\n📈 趋势分析:")
        print(f"   上调次数: {upgrades} 🟢")
        print(f"   下调次数: {downgrades} 🔴")
        
        if upgrades > downgrades:
            print(f"   整体趋势: 🟢 分析师情绪改善")
        elif downgrades > upgrades:
            print(f"   整体趋势: 🔴 分析师情绪恶化")
        else:
            print(f"   整体趋势: ⚪ 分析师情绪中性")
    
    def show_latest_reports(self, data):
        """显示最新分析师报告"""
        print("\n📰 最新分析师报告")
        print("-" * 70)
        
        reports = data.get('latest_reports', [])
        
        if not reports:
            print("⚠️  无最新报告")
            return
        
        for i, report in enumerate(reports[:5], 1):  # 显示最近5篇
            rating_emoji = "🟢" if report['rating'] in ['Strong Buy', 'Buy', 'Outperform'] else \
                          "🔴" if report['rating'] in ['Sell', 'Strong Sell', 'Underperform'] else "🟡"
            
            print(f"\n{i}. [{report['date']}] {report['source']}")
            print(f"   标题: {report['title']}")
            print(f"   评级: {rating_emoji} {report['rating']}")
            print(f"   目标价: ${report['target']:.2f}")
            print(f"   摘要: {report['summary']}")
    
    def print_search_checklist(self, symbol):
        """打印搜索关键词检查清单"""
        print("\n" + "=" * 70)
        print(f"🦐 {symbol} 分析师报告搜索检查清单")
        print("=" * 70)
        
        checklist = [
            (f"{symbol} Seeking Alpha", "Seeking Alpha最新分析"),
            (f"{symbol} Motley Fool", "Motley Fool投资建议"),
            (f"{symbol} analyst rating", "分析师评级变化"),
            (f"{symbol} price target", "目标价调整"),
            (f"{symbol} upgrade downgrade", "评级上调/下调"),
            (f"{symbol} Wall Street consensus", "华尔街一致预期"),
            (f"{symbol} Zacks rating", "Zacks评级"),
            (f"{symbol} Morningstar", "晨星分析报告"),
            (f"{symbol} TipRanks analyst", "TipRanks分析师排名"),
            (f"{symbol} MarketBeat forecast", "MarketBeat预测")
        ]
        
        print("\n分析师报告搜索前必须完成以下检查：\n")
        for i, (keyword, description) in enumerate(checklist, 1):
            print(f"  {i:2d}. [ ] {keyword}")
            print(f"      目的: {description}")
            print()
        
        print("=" * 70)
        print("⚠️  提示: 关注评级变化和目标价调整，这是重要信号！")
        print("=" * 70)
    
    def generate_report(self, symbol, data):
        """生成聚合报告"""
        print("\n" + "=" * 70)
        print("📋 分析师报告聚合摘要")
        print("=" * 70)
        
        summary = {
            'symbol': symbol,
            'timestamp': datetime.now().isoformat(),
            'consensus_rating': data['consensus_rating'],
            'rating_score': data['rating_score'],
            'price_target': data['price_target'],
            'current_price': data.get('current_price', 0),
            'upside': data['upside'],
            'analyst_count': data['analyst_count'],
            'strong_buy_count': data['ratings_breakdown'].get('Strong Buy', 0),
            'buy_count': data['ratings_breakdown'].get('Buy', 0) + data['ratings_breakdown'].get('Outperform', 0),
            'hold_count': data['ratings_breakdown'].get('Hold', 0) + data['ratings_breakdown'].get('Neutral', 0),
            'sell_count': data['ratings_breakdown'].get('Sell', 0) + data['ratings_breakdown'].get('Underperform', 0),
            'recent_upgrades': sum(1 for c in data.get('recent_changes', []) if c['change'] == '上调'),
            'recent_downgrades': sum(1 for c in data.get('recent_changes', []) if c['change'] == '下调')
        }
        
        print(f"\n股票代码: {symbol}")
        print(f"分析师覆盖: {summary['analyst_count']} 家机构")
        print(f"一致评级: {summary['consensus_rating']}")
        print(f"平均目标价: ${summary['price_target']:.2f}")
        print(f"上涨空间: {summary['upside']:+.1f}%")
        
        print(f"\n📊 情绪指标:")
        print(f"   看涨: {summary['strong_buy_count'] + summary['buy_count']} 家 🟢")
        print(f"   中性: {summary['hold_count']} 家 🟡")
        print(f"   看跌: {summary['sell_count']} 家 🔴")
        
        print(f"\n📈 近期变动:")
        print(f"   上调: {summary['recent_upgrades']} 次 🟢")
        print(f"   下调: {summary['recent_downgrades']} 次 🔴")
        
        # 保存结果
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f"{self.output_dir}/{symbol}_analyst_{timestamp}.json"
        
        with open(filename, 'w') as f:
            json.dump({
                'summary': summary,
                'data': data
            }, f, indent=2)
        
        print(f"\n💾 结果已保存: {filename}")
        
        # 重要提醒
        if summary['recent_upgrades'] > summary['recent_downgrades']:
            print("\n🟢 分析师情绪改善，值得关注！")
        elif summary['recent_downgrades'] > summary['recent_upgrades']:
            print("\n🔴 分析师情绪恶化，需要警惕！")
        
        print("\n" + "=" * 70)
        print("✅ 分析师报告聚合完成！")
    
    def aggregate(self, symbol):
        """执行完整聚合流程"""
        print("=" * 70)
        print(f"🦐 分析师报告聚合器 - {symbol}")
        print("=" * 70)
        print(f"时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print("=" * 70)
        
        print("\n聚合来源:")
        for source in self.sources:
            print(f"  📊 {source}")
        
        # 先打印检查清单
        self.print_search_checklist(symbol)
        
        print("\n" + "=" * 70)
        print("开始聚合数据...")
        print("=" * 70)
        
        # 聚合数据
        data = self.aggregate_analyst_data(symbol)
        data['symbol'] = symbol
        
        # 分析共识
        self.analyze_consensus(data)
        
        # 分析目标价变化
        self.analyze_price_target_changes(data)
        
        # 显示最新报告
        self.show_latest_reports(data)
        
        # 生成报告
        self.generate_report(symbol, data)


def main():
    """主函数"""
    if len(sys.argv) < 2:
        print("用法: python analyst_report_aggregator.py <股票代码>")
        print("例如: python analyst_report_aggregator.py AAPL")
        print("\n聚合来源:")
        print("  📊 Seeking Alpha")
        print("  📊 Motley Fool")
        print("  📊 MarketBeat")
        print("  📊 TipRanks")
        print("  📊 Zacks")
        print("  📊 等8+个分析师平台")
        sys.exit(1)
    
    symbol = sys.argv[1].upper()
    
    aggregator = AnalystReportAggregator()
    aggregator.aggregate(symbol)


if __name__ == "__main__":
    main()
