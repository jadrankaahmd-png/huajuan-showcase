#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
新闻事件影响分析器 - News Impact Analyzer
作者：虾虾
创建时间：2026-02-09
用途：自动识别新闻类型、历史相似事件回测、预测影响幅度、情绪强度分析
"""

import os
import sys
import json
import re
from datetime import datetime, timedelta
from typing import List, Dict, Optional, Tuple


class NewsImpactAnalyzer:
    """
    新闻事件影响分析器
    
    核心思想：不是新闻多重要，而是市场对新闻的反应才重要！
    
    功能：
    1. 自动识别新闻类型（业绩/并购/监管/产品）
    2. 历史相似事件回测（类似新闻后股价如何走）
    3. 预测影响幅度（+5%? +10%? -8%?）
    4. 情绪强度分析（极度乐观/恐慌）
    """
    
    def __init__(self):
        self.data_dir = os.path.expanduser("~/.openclaw/workspace/新闻影响数据")
        os.makedirs(self.data_dir, exist_ok=True)
        
        # 新闻类型关键词
        self.news_patterns = {
            'earnings': {
                'keywords': ['earnings', 'revenue', 'profit', 'EPS', 'beat', 'miss', 'guidance', 'forecast'],
                'name': '财报',
                'typical_impact': '±5-15%'
            },
            'merger_acquisition': {
                'keywords': ['acquisition', 'merge', 'buyout', 'acquire', 'takeover', 'deal'],
                'name': '并购',
                'typical_impact': '±10-30%'
            },
            'regulatory': {
                'keywords': ['FDA', 'approval', 'regulator', 'investigation', 'lawsuit', 'ban', 'tariff'],
                'name': '监管',
                'typical_impact': '±5-20%'
            },
            'product': {
                'keywords': ['launch', 'product', 'release', 'new', 'innovation', 'partnership', 'contract'],
                'name': '产品/合作',
                'typical_impact': '±3-10%'
            },
            'executive': {
                'keywords': ['CEO', 'CFO', 'executive', 'resign', 'depart', 'appointment', 'board'],
                'name': '高管变动',
                'typical_impact': '±2-8%'
            },
            'macro': {
                'keywords': ['Fed', 'rate', 'inflation', 'GDP', 'recession', 'economy', 'policy'],
                'name': '宏观',
                'typical_impact': '±2-5%'
            }
        }
        
        # 历史事件数据库（简化版）
        self.historical_events = {
            'NVDA': [
                {'date': '2024-02-21', 'type': 'earnings', 'headline': 'NVDA earnings beat', 'impact': 16.4},
                {'date': '2024-05-22', 'type': 'earnings', 'headline': 'NVDA stock split', 'impact': 9.3},
                {'date': '2024-08-28', 'type': 'earnings', 'headline': 'NVDA guidance strong', 'impact': -2.1},
            ],
            'AMD': [
                {'date': '2024-01-30', 'type': 'earnings', 'headline': 'AMD AI revenue miss', 'impact': -5.5},
                {'date': '2024-04-30', 'type': 'earnings', 'headline': 'AMD beat expectations', 'impact': 8.2},
            ],
            'TSLA': [
                {'date': '2024-01-24', 'type': 'earnings', 'headline': 'TSLA warns on growth', 'impact': -12.1},
                {'date': '2024-04-23', 'type': 'earnings', 'headline': 'TSLA robotaxi promise', 'impact': 12.0},
            ]
        }
        
        print("🦐 新闻事件影响分析器启动")
        print("📰 分析新闻类型，预测市场反应")
        print("="*70)
    
    def classify_news(self, headline: str) -> Dict:
        """
        自动识别新闻类型
        
        Args:
            headline: 新闻标题
        
        Returns:
            新闻分类结果
        """
        headline_lower = headline.lower()
        
        scores = {}
        for news_type, info in self.news_patterns.items():
            score = 0
            for keyword in info['keywords']:
                if keyword in headline_lower:
                    score += 1
            scores[news_type] = score
        
        # 找出最匹配的类型
        if max(scores.values()) > 0:
            news_type = max(scores, key=scores.get)
            confidence = min(scores[news_type] / 3, 1.0)  # 最多3个关键词匹配=100%置信度
        else:
            news_type = 'unknown'
            confidence = 0
        
        return {
            'type': news_type,
            'type_name': self.news_patterns.get(news_type, {}).get('name', '未知'),
            'confidence': round(confidence, 2),
            'typical_impact': self.news_patterns.get(news_type, {}).get('typical_impact', '未知')
        }
    
    def analyze_sentiment_intensity(self, headline: str) -> Dict:
        """
        分析情绪强度
        
        Returns:
            情绪分析结果
        """
        headline_lower = headline.lower()
        
        # 极度乐观词汇
        extremely_positive = ['surge', 'soar', 'rocket', 'explode', 'breakthrough', 'massive', 'huge']
        
        # 乐观词汇
        positive = ['beat', 'exceed', 'strong', 'growth', 'gain', 'rise', 'up', 'positive']
        
        # 极度悲观词汇
        extremely_negative = ['crash', 'plunge', 'collapse', 'disaster', 'crisis', 'devastating']
        
        # 悲观词汇
        negative = ['miss', 'decline', 'fall', 'drop', 'weak', 'down', 'loss', 'negative', 'warn']
        
        score = 0
        intensity = 'neutral'
        
        # 检查极度乐观
        for word in extremely_positive:
            if word in headline_lower:
                score += 3
                intensity = 'extremely_positive'
        
        # 检查乐观
        for word in positive:
            if word in headline_lower:
                score += 1
                if intensity == 'neutral':
                    intensity = 'positive'
        
        # 检查极度悲观
        for word in extremely_negative:
            if word in headline_lower:
                score -= 3
                intensity = 'extremely_negative'
        
        # 检查悲观
        for word in negative:
            if word in headline_lower:
                score -= 1
                if intensity == 'neutral':
                    intensity = 'negative'
        
        return {
            'score': score,
            'intensity': intensity,
            'direction': 'positive' if score > 0 else ('negative' if score < 0 else 'neutral')
        }
    
    def find_similar_historical_events(self, symbol: str, news_type: str) -> List[Dict]:
        """
        查找历史相似事件
        """
        if symbol not in self.historical_events:
            return []
        
        events = self.historical_events[symbol]
        similar = [e for e in events if e['type'] == news_type]
        
        return similar
    
    def predict_impact(self, symbol: str, headline: str) -> Dict:
        """
        预测新闻影响
        """
        print(f"\n🔮 分析新闻影响: {headline[:50]}...")
        
        # 1. 分类新闻
        classification = self.classify_news(headline)
        
        # 2. 分析情绪
        sentiment = self.analyze_sentiment_intensity(headline)
        
        # 3. 查找历史类似事件
        historical = self.find_similar_historical_events(symbol, classification['type'])
        
        # 4. 预测影响幅度
        if historical:
            avg_impact = sum(e['impact'] for e in historical) / len(historical)
            
            # 根据情绪强度调整
            if sentiment['intensity'] == 'extremely_positive':
                predicted_impact = avg_impact * 1.5
            elif sentiment['intensity'] == 'extremely_negative':
                predicted_impact = avg_impact * 1.5
            elif sentiment['intensity'] in ['positive', 'negative']:
                predicted_impact = avg_impact * 1.2
            else:
                predicted_impact = avg_impact
        else:
            # 基于典型影响估算
            typical = classification.get('typical_impact', '±5%')
            if sentiment['direction'] == 'positive':
                predicted_impact = 5
            elif sentiment['direction'] == 'negative':
                predicted_impact = -5
            else:
                predicted_impact = 0
        
        # 5. 计算置信度
        if len(historical) >= 3:
            confidence = 'high'
        elif len(historical) >= 1:
            confidence = 'medium'
        else:
            confidence = 'low'
        
        return {
            'symbol': symbol,
            'headline': headline,
            'classification': classification,
            'sentiment': sentiment,
            'historical_events': historical,
            'predicted_impact': round(predicted_impact, 2),
            'confidence': confidence,
            'timestamp': datetime.now().isoformat()
        }
    
    def print_analysis(self, result: Dict):
        """打印分析结果"""
        print("\n" + "="*70)
        print("📰 新闻影响分析报告")
        print("="*70)
        
        print(f"\n🎯 {result['symbol']}")
        print(f"📰 新闻: {result['headline'][:80]}...")
        
        # 分类
        cls = result['classification']
        print(f"\n📊 新闻分类:")
        print(f"  类型: {cls['type_name']}")
        print(f"  置信度: {cls['confidence']*100:.0f}%")
        print(f"  典型影响: {cls['typical_impact']}")
        
        # 情绪
        sentiment = result['sentiment']
        emoji_map = {
            'extremely_positive': '🚀',
            'positive': '📈',
            'neutral': '➡️',
            'negative': '📉',
            'extremely_negative': '💥'
        }
        emoji = emoji_map.get(sentiment['intensity'], '➡️')
        print(f"\n{emoji} 情绪强度:")
        print(f"  强度: {sentiment['intensity']}")
        print(f"  得分: {sentiment['score']}")
        print(f"  方向: {sentiment['direction']}")
        
        # 历史事件
        historical = result['historical_events']
        if historical:
            print(f"\n📚 历史类似事件 ({len(historical)}次):")
            for event in historical:
                impact_emoji = "📈" if event['impact'] > 0 else "📉"
                print(f"  {impact_emoji} {event['date']}: {event['impact']:+.1f}%")
        
        # 预测
        print(f"\n🔮 影响预测:")
        print(f"  预期影响: {result['predicted_impact']:+.1f}%")
        print(f"  预测置信度: {result['confidence'].upper()}")
        
        # 建议
        print(f"\n💡 交易建议:")
        impact = result['predicted_impact']
        confidence = result['confidence']
        
        if confidence == 'high' and abs(impact) > 8:
            print(f"  ⚠️  高置信度大幅波动预警！")
            if impact > 0:
                print(f"  📈 预期大涨{impact:.1f}%，可考虑提前布局")
            else:
                print(f"  📉 预期大跌{abs(impact):.1f}%，考虑减仓或对冲")
        elif confidence == 'medium':
            print(f"  ⚖️ 中等置信度，建议观望确认")
        else:
            print(f"  ❓ 历史数据不足，谨慎对待")
        
        print("="*70)


def main():
    """主函数"""
    import argparse
    
    parser = argparse.ArgumentParser(
        description='虾虾新闻事件影响分析器',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
使用示例:
  # 分析新闻影响
  python3 news_impact_analyzer.py --symbol NVDA --headline "NVDA earnings beat expectations"
        """
    )
    
    parser.add_argument('--symbol', '-s', type=str, required=True,
                       help='股票代码')
    parser.add_argument('--headline', type=str, required=True,
                       help='新闻标题')
    
    args = parser.parse_args()
    
    analyzer = NewsImpactAnalyzer()
    
    result = analyzer.predict_impact(args.symbol, args.headline)
    analyzer.print_analysis(result)


if __name__ == "__main__":
    main()
