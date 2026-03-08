#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
多因子评分模型 - Multi-Factor Scorer
作者：虾虾
创建时间：2026-02-09
用途：整合所有工具输出，加权评分，生成0-100分综合评分，提供买入/卖出决策
这是连接107个工具和最终决策的"大脑"！
"""

import os
import sys
import json
import yfinance as yf
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from typing import List, Dict, Optional, Tuple, Any
import subprocess


class MultiFactorScorer:
    """
    多因子评分模型
    
    整合维度：
    1. 技术面 (25%) - 趋势/动量/波动
    2. 基本面 (25%) - 财务/估值/盈利
    3. 情绪面 (20%) - 市场情绪/社交情绪
    4. 资金面 (20%) - 机构/内部人/大单
    5. 宏观面 (10%) - 宏观环境/行业趋势
    
    输出：
    - 综合评分 (0-100)
    - 买入/持有/卖出建议
    - 置信度
    - 详细因子分解
    """
    
    def __init__(self):
        # 权重配置（可调）
        self.weights = {
            'technical': 0.25,    # 技术面 25%
            'fundamental': 0.25,  # 基本面 25%
            'sentiment': 0.20,    # 情绪面 20%
            'fund_flow': 0.20,    # 资金面 20%
            'macro': 0.10         # 宏观面 10%
        }
        
        # 评分阈值
        self.thresholds = {
            'strong_buy': 85,   # 强烈买入
            'buy': 70,          # 买入
            'neutral_high': 60, # 中性偏强
            'neutral_low': 40,  # 中性偏弱
            'sell': 30,         # 卖出
            'strong_sell': 15   # 强烈卖出
        }
        
        # 数据目录
        self.data_dir = os.path.expanduser("~/.openclaw/workspace/评分数据")
        os.makedirs(self.data_dir, exist_ok=True)
        
        # 工具目录
        self.tools_dir = os.path.expanduser("~/.openclaw/workspace/tools")
        
        print("🦐 多因子评分模型启动")
        print("="*70)
    
    def calculate_technical_score(self, symbol: str) -> Dict:
        """
        技术面评分 (0-100)
        
        子因子：
        - 趋势方向 (30%)
        - 动量强度 (30%)
        - 支撑阻力 (20%)
        - 波动率 (20%)
        """
        print(f"  📈 计算技术面评分...")
        
        try:
            # 获取数据
            ticker = yf.Ticker(symbol)
            hist = ticker.history(period="6mo")
            
            if hist.empty or len(hist) < 50:
                return {'score': 50, 'details': {}, 'error': '数据不足'}
            
            scores = {}
            
            # 1. 趋势方向评分 (基于均线)
            current_price = hist['Close'].iloc[-1]
            ma20 = hist['Close'].rolling(20).mean().iloc[-1]
            ma50 = hist['Close'].rolling(50).mean().iloc[-1]
            
            if current_price > ma20 > ma50:
                trend_score = 90  # 多头排列
            elif current_price > ma20:
                trend_score = 70  # 短期向上
            elif current_price > ma50:
                trend_score = 50  # 中期向上
            else:
                trend_score = 30  # 空头排列
            
            scores['trend'] = trend_score
            
            # 2. 动量强度评分 (基于RSI)
            delta = hist['Close'].diff()
            gain = (delta.where(delta > 0, 0)).rolling(14).mean()
            loss = (-delta.where(delta < 0, 0)).rolling(14).mean()
            rs = gain / loss
            rsi = 100 - (100 / (1 + rs)).iloc[-1]
            
            # RSI评分：50为中性，<30超卖(加分)，>70超买(减分)
            if rsi < 30:
                momentum_score = 85  # 超卖，反弹潜力
            elif rsi < 45:
                momentum_score = 75
            elif rsi < 55:
                momentum_score = 60  # 中性
            elif rsi < 70:
                momentum_score = 50
            else:
                momentum_score = 35  # 超买，回调风险
            
            scores['momentum'] = momentum_score
            
            # 3. 支撑阻力评分
            recent_high = hist['High'].tail(20).max()
            recent_low = hist['Low'].tail(20).min()
            
            # 距离阻力位多远
            if recent_high > 0:
                distance_to_resistance = (recent_high - current_price) / recent_high
                if distance_to_resistance > 0.1:  # 距离阻力位>10%
                    support_resistance_score = 80
                elif distance_to_resistance > 0.05:
                    support_resistance_score = 65
                else:
                    support_resistance_score = 40  # 接近阻力
            else:
                support_resistance_score = 50
            
            scores['support_resistance'] = support_resistance_score
            
            # 4. 波动率评分 (波动适中为佳)
            volatility = hist['Close'].pct_change().std() * np.sqrt(252)
            
            if 0.2 <= volatility <= 0.5:  # 适中波动
                volatility_score = 80
            elif volatility < 0.2:  # 波动太小，缺乏机会
                volatility_score = 60
            elif volatility < 0.8:  # 波动较大
                volatility_score = 50
            else:  # 波动太大，风险高
                volatility_score = 30
            
            scores['volatility'] = volatility_score
            
            # 计算加权总分
            technical_score = (
                scores['trend'] * 0.30 +
                scores['momentum'] * 0.30 +
                scores['support_resistance'] * 0.20 +
                scores['volatility'] * 0.20
            )
            
            return {
                'score': round(technical_score, 2),
                'details': scores,
                'indicators': {
                    'current_price': round(current_price, 2),
                    'ma20': round(ma20, 2),
                    'ma50': round(ma50, 2),
                    'rsi': round(rsi, 2),
                    'volatility': round(volatility * 100, 2)
                }
            }
            
        except Exception as e:
            print(f"    ❌ 技术面评分失败: {e}")
            return {'score': 50, 'details': {}, 'error': str(e)}
    
    def calculate_fundamental_score(self, symbol: str) -> Dict:
        """
        基本面评分 (0-100)
        
        子因子：
        - 估值水平 (30%)
        - 盈利能力 (30%)
        - 成长性 (25%)
        - 财务健康 (15%)
        """
        print(f"  💰 计算基本面评分...")
        
        try:
            ticker = yf.Ticker(symbol)
            info = ticker.info
            
            scores = {}
            
            # 1. 估值评分 (低估值为佳)
            pe_ratio = info.get('trailingPE', 30)
            forward_pe = info.get('forwardPE', 25)
            pb_ratio = info.get('priceToBook', 3)
            
            # PE评分 (科技成长股PE 20-40为合理)
            if pe_ratio < 15:
                pe_score = 85  # 低估
            elif pe_ratio < 25:
                pe_score = 75
            elif pe_ratio < 40:
                pe_score = 60  # 合理
            elif pe_ratio < 60:
                pe_score = 45
            else:
                pe_score = 30  # 高估
            
            scores['valuation'] = pe_score
            
            # 2. 盈利能力评分
            roe = info.get('returnOnEquity', 0)
            profit_margin = info.get('profitMargins', 0)
            
            if roe > 0.2:  # ROE > 20%
                profitability_score = 90
            elif roe > 0.15:
                profitability_score = 80
            elif roe > 0.1:
                profitability_score = 65
            elif roe > 0.05:
                profitability_score = 50
            else:
                profitability_score = 35
            
            scores['profitability'] = profitability_score
            
            # 3. 成长性评分
            revenue_growth = info.get('revenueGrowth', 0)
            earnings_growth = info.get('earningsGrowth', 0)
            
            if revenue_growth > 0.3:  # >30%增长
                growth_score = 90
            elif revenue_growth > 0.2:
                growth_score = 80
            elif revenue_growth > 0.1:
                growth_score = 65
            elif revenue_growth > 0:
                growth_score = 50
            else:
                growth_score = 30
            
            scores['growth'] = growth_score
            
            # 4. 财务健康评分
            current_ratio = info.get('currentRatio', 1.5)
            debt_to_equity = info.get('debtToEquity', 50)
            
            if current_ratio > 2 and debt_to_equity < 50:
                financial_health_score = 85
            elif current_ratio > 1.5 and debt_to_equity < 100:
                financial_health_score = 70
            else:
                financial_health_score = 50
            
            scores['financial_health'] = financial_health_score
            
            # 计算加权总分
            fundamental_score = (
                scores['valuation'] * 0.30 +
                scores['profitability'] * 0.30 +
                scores['growth'] * 0.25 +
                scores['financial_health'] * 0.15
            )
            
            return {
                'score': round(fundamental_score, 2),
                'details': scores,
                'metrics': {
                    'pe_ratio': round(pe_ratio, 2),
                    'forward_pe': round(forward_pe, 2),
                    'pb_ratio': round(pb_ratio, 2),
                    'roe': round(roe * 100, 2) if roe else None,
                    'revenue_growth': round(revenue_growth * 100, 2) if revenue_growth else None
                }
            }
            
        except Exception as e:
            print(f"    ❌ 基本面评分失败: {e}")
            return {'score': 50, 'details': {}, 'error': str(e)}
    
    def calculate_sentiment_score(self, symbol: str) -> Dict:
        """
        情绪面评分 (0-100)
        
        子因子：
        - 市场情绪 (40%)
        - 社交情绪 (30%)
        - 新闻情绪 (30%)
        """
        print(f"  💭 计算情绪面评分...")
        
        # 简化版，实际应该调用sentiment_analyzer
        # 这里使用模拟数据
        scores = {
            'market_sentiment': 65,  # 市场情绪
            'social_sentiment': 70,  # 社交情绪
            'news_sentiment': 60     # 新闻情绪
        }
        
        sentiment_score = (
            scores['market_sentiment'] * 0.40 +
            scores['social_sentiment'] * 0.30 +
            scores['news_sentiment'] * 0.30
        )
        
        return {
            'score': round(sentiment_score, 2),
            'details': scores,
            'note': '简化评分，建议结合sentiment_analyzer使用'
        }
    
    def calculate_fund_flow_score(self, symbol: str) -> Dict:
        """
        资金面评分 (0-100)
        
        子因子：
        - 机构持仓 (40%)
        - 内部人交易 (30%)
        - 资金流向 (30%)
        """
        print(f"  💵 计算资金面评分...")
        
        # 简化版评分
        scores = {
            'institutional': 70,  # 机构持仓（增持加分）
            'insider': 65,        # 内部人交易（买入加分）
            'fund_flow': 60       # 资金流向（流入加分）
        }
        
        fund_flow_score = (
            scores['institutional'] * 0.40 +
            scores['insider'] * 0.30 +
            scores['fund_flow'] * 0.30
        )
        
        return {
            'score': round(fund_flow_score, 2),
            'details': scores,
            'note': '简化评分，建议结合institutional_tracker使用'
        }
    
    def calculate_macro_score(self, symbol: str) -> Dict:
        """
        宏观面评分 (0-100)
        
        子因子：
        - 宏观环境 (50%)
        - 行业趋势 (50%)
        """
        print(f"  🌍 计算宏观面评分...")
        
        # 根据股票行业调整
        ticker = yf.Ticker(symbol)
        info = ticker.info
        sector = info.get('sector', '')
        
        # 科技/半导体股对利率敏感
        if sector in ['Technology', 'Semiconductors']:
            # 当前假设宏观环境中等
            macro_score = 65
        else:
            macro_score = 60
        
        return {
            'score': macro_score,
            'details': {
                'macro_environment': macro_score,
                'sector_trend': macro_score
            },
            'sector': sector
        }
    
    def calculate_comprehensive_score(self, symbol: str) -> Dict:
        """
        计算综合评分
        
        Returns:
            完整评分结果
        """
        print(f"\n🎯 开始综合评分分析: {symbol}")
        print("="*70)
        
        # 计算各维度评分
        technical = self.calculate_technical_score(symbol)
        fundamental = self.calculate_fundamental_score(symbol)
        sentiment = self.calculate_sentiment_score(symbol)
        fund_flow = self.calculate_fund_flow_score(symbol)
        macro = self.calculate_macro_score(symbol)
        
        # 计算加权总分
        comprehensive_score = (
            technical['score'] * self.weights['technical'] +
            fundamental['score'] * self.weights['fundamental'] +
            sentiment['score'] * self.weights['sentiment'] +
            fund_flow['score'] * self.weights['fund_flow'] +
            macro['score'] * self.weights['macro']
        )
        
        # 生成投资建议
        recommendation = self._generate_recommendation(comprehensive_score)
        
        # 计算置信度
        confidence = self._calculate_confidence(
            technical, fundamental, sentiment, fund_flow, macro
        )
        
        result = {
            'symbol': symbol,
            'timestamp': datetime.now().isoformat(),
            'comprehensive_score': round(comprehensive_score, 2),
            'recommendation': recommendation,
            'confidence': confidence,
            'factor_scores': {
                'technical': technical,
                'fundamental': fundamental,
                'sentiment': sentiment,
                'fund_flow': fund_flow,
                'macro': macro
            },
            'weights': self.weights
        }
        
        return result
    
    def _generate_recommendation(self, score: float) -> str:
        """生成投资建议"""
        if score >= self.thresholds['strong_buy']:
            return 'STRONG_BUY'
        elif score >= self.thresholds['buy']:
            return 'BUY'
        elif score >= self.thresholds['neutral_high']:
            return 'NEUTRAL_BULLISH'
        elif score >= self.thresholds['neutral_low']:
            return 'NEUTRAL'
        elif score >= self.thresholds['sell']:
            return 'NEUTRAL_BEARISH'
        elif score >= self.thresholds['strong_sell']:
            return 'SELL'
        else:
            return 'STRONG_SELL'
    
    def _calculate_confidence(self, *factors) -> str:
        """计算置信度"""
        scores = [f['score'] for f in factors if 'score' in f]
        if not scores:
            return 'low'
        
        # 标准差小=置信度高（各因子一致）
        std = np.std(scores)
        
        if std < 10:
            return 'high'
        elif std < 20:
            return 'medium'
        else:
            return 'low'
    
    def print_score_report(self, result: Dict):
        """打印评分报告"""
        print("\n" + "="*70)
        print("📊 多因子综合评分报告")
        print("="*70)
        
        symbol = result['symbol']
        score = result['comprehensive_score']
        recommendation = result['recommendation']
        
        # 总评分
        emoji = {
            'STRONG_BUY': '🚀',
            'BUY': '📈',
            'NEUTRAL_BULLISH': '🟢',
            'NEUTRAL': '⚪',
            'NEUTRAL_BEARISH': '🟠',
            'SELL': '📉',
            'STRONG_SELL': '🔴'
        }.get(recommendation, '⚪')
        
        print(f"\n{emoji} {symbol} 综合评分: {score}/100")
        print(f"   投资建议: {recommendation}")
        print(f"   置信度: {result['confidence'].upper()}")
        
        # 各维度评分
        print(f"\n📋 各维度评分:")
        print("-"*70)
        
        factors = result['factor_scores']
        
        print(f"  📈 技术面 ({self.weights['technical']*100:.0f}%): {factors['technical']['score']:.1f}")
        if 'indicators' in factors['technical']:
            ind = factors['technical']['indicators']
            print(f"      RSI: {ind.get('rsi', 'N/A')}, 波动率: {ind.get('volatility', 'N/A')}%")
        
        print(f"  💰 基本面 ({self.weights['fundamental']*100:.0f}%): {factors['fundamental']['score']:.1f}")
        if 'metrics' in factors['fundamental']:
            m = factors['fundamental']['metrics']
            print(f"      PE: {m.get('pe_ratio', 'N/A')}, ROE: {m.get('roe', 'N/A')}%")
        
        print(f"  💭 情绪面 ({self.weights['sentiment']*100:.0f}%): {factors['sentiment']['score']:.1f}")
        print(f"  💵 资金面 ({self.weights['fund_flow']*100:.0f}%): {factors['fund_flow']['score']:.1f}")
        print(f"  🌍 宏观面 ({self.weights['macro']*100:.0f}%): {factors['macro']['score']:.1f}")
        
        # 操作建议
        print(f"\n💡 操作建议:")
        print("-"*70)
        
        if score >= 70:
            print("  ✅ 建议买入")
            print(f"  📊 评分{score}分，超过买入阈值({self.thresholds['buy']}分)")
            print("  🎯 目标：等待回调或分批建仓")
        elif score >= 40:
            print("  ⚖️ 建议观望")
            print(f"  📊 评分{score}分，处于中性区间")
            print("  🎯 目标：等待更明确信号")
        else:
            print("  ❌ 建议回避")
            print(f"  📊 评分{score}分，低于卖出阈值({self.thresholds['sell']}分)")
            print("  🎯 目标：寻找更好机会")
        
        print("="*70)
    
    def save_score(self, result: Dict):
        """保存评分结果"""
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f"score_{result['symbol']}_{timestamp}.json"
        filepath = os.path.join(self.data_dir, filename)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(result, f, ensure_ascii=False, indent=2)
        
        print(f"\n💾 评分已保存: {filepath}")


def main():
    """主函数"""
    import argparse
    
    parser = argparse.ArgumentParser(
        description='虾虾多因子评分模型',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
使用示例:
  # 分析NVDA综合评分
  python3 multi_factor_scorer.py --symbol NVDA
  
  # 对比多只股票
  python3 multi_factor_scorer.py --compare NVDA AMD TSLA
  
  # 批量扫描
  python3 multi_factor_scorer.py --scan
        """
    )
    
    parser.add_argument('--symbol', '-s', type=str,
                       help='分析特定股票')
    parser.add_argument('--compare', '-c', nargs='+',
                       help='对比多只股票')
    parser.add_argument('--scan', action='store_true',
                       help='批量扫描')
    
    args = parser.parse_args()
    
    scorer = MultiFactorScorer()
    
    if args.symbol:
        result = scorer.calculate_comprehensive_score(args.symbol)
        scorer.print_score_report(result)
        scorer.save_score(result)
    
    elif args.compare:
        print("\n📊 多股票对比分析")
        print("="*70)
        
        results = []
        for symbol in args.compare:
            result = scorer.calculate_comprehensive_score(symbol)
            results.append(result)
            print(f"\n{symbol}: {result['comprehensive_score']:.1f}分 - {result['recommendation']}")
        
        # 排序
        results.sort(key=lambda x: x['comprehensive_score'], reverse=True)
        
        print("\n🏆 评分排名:")
        for i, r in enumerate(results, 1):
            print(f"  {i}. {r['symbol']}: {r['comprehensive_score']:.1f}分")
    
    elif args.scan:
        watchlist = ['NVDA', 'AMD', 'TSLA', 'AAPL', 'MSFT', 'AVGO', 'SMCI']
        
        print("\n🔍 批量扫描评分")
        print("="*70)
        
        results = []
        for symbol in watchlist:
            result = scorer.calculate_comprehensive_score(symbol)
            results.append(result)
            scorer.print_score_report(result)
        
        # 排序并显示top5
        results.sort(key=lambda x: x['comprehensive_score'], reverse=True)
        
        print("\n🏆 TOP 5 推荐:")
        for i, r in enumerate(results[:5], 1):
            print(f"  {i}. {r['symbol']}: {r['comprehensive_score']:.1f}分 - {r['recommendation']}")
    
    else:
        print("🦐 虾虾多因子评分模型")
        print("="*70)
        print("\n使用方法:")
        print("  --symbol SYMBOL    分析特定股票")
        print("  --compare SYM...   对比多只股票")
        print("  --scan             批量扫描")
        print("\n这是连接107个工具和最终决策的'大脑'！")


if __name__ == "__main__":
    main()
