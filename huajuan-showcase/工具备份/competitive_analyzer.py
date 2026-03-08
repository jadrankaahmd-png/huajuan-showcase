#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
竞争力分析器 - Competitive Analyzer
作者：虾虾
创建时间：2026-02-09
用途：同行业多股对比、护城河评估、市场份额变化、相对强弱排名
"""

import os
import sys
import json
import yfinance as yf
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from typing import List, Dict, Optional, Tuple


class CompetitiveAnalyzer:
    """
    竞争力分析器
    
    功能：
    1. 同行业多股对比（财务/估值/增长/技术）
    2. 护城河评估（品牌/专利/成本优势）
    3. 市场份额变化趋势
    4. 相对强弱排名（行业内得分）
    
    核心思想：要买就买行业龙头，不买平庸公司！
    """
    
    def __init__(self):
        self.data_dir = os.path.expanduser("~/.openclaw/workspace/竞争力分析数据")
        os.makedirs(self.data_dir, exist_ok=True)
        
        # 行业分类
        self.sectors = {
            'semiconductors': {
                'name': '半导体',
                'stocks': ['NVDA', 'AMD', 'AVGO', 'QCOM', 'MU', 'INTC', 'SMCI', 'TSM'],
                'benchmark': 'SMH'
            },
            'software': {
                'name': '软件/AI',
                'stocks': ['MSFT', 'GOOGL', 'META', 'AMZN', 'NFLX', 'CRM', 'ORCL'],
                'benchmark': 'IGV'
            },
            'hardware': {
                'name': '硬件/消费电子',
                'stocks': ['AAPL', 'DELL', 'HPQ', 'STX', 'WDC'],
                'benchmark': 'XLK'
            },
            'ai_infrastructure': {
                'name': 'AI基础设施',
                'stocks': ['NVDA', 'CRWV', 'SMCI', 'PLTR'],
                'benchmark': 'SKYY'
            }
        }
        
        print("🦐 竞争力分析器启动")
        print("⚔️  对比行业竞争格局，识别真正龙头")
        print("="*70)
    
    def get_stock_fundamentals(self, symbol: str) -> Dict:
        """
        获取股票基本面数据
        """
        try:
            ticker = yf.Ticker(symbol)
            info = ticker.info
            
            return {
                'symbol': symbol,
                'name': info.get('shortName', symbol),
                'sector': info.get('sector', 'Unknown'),
                'market_cap': info.get('marketCap', 0),
                'revenue': info.get('totalRevenue', 0),
                'profit_margin': info.get('profitMargins', 0),
                'revenue_growth': info.get('revenueGrowth', 0),
                'earnings_growth': info.get('earningsGrowth', 0),
                'roe': info.get('returnOnEquity', 0),
                'debt_to_equity': info.get('debtToEquity', 0),
                'pe_ratio': info.get('trailingPE', 0),
                'forward_pe': info.get('forwardPE', 0),
                'ps_ratio': info.get('priceToSalesTrailing12Months', 0),
                'pb_ratio': info.get('priceToBook', 0),
                'gross_margin': info.get('grossMargins', 0),
                'operating_margin': info.get('operatingMargins', 0)
            }
            
        except Exception as e:
            print(f"❌ 获取{symbol}基本面失败: {e}")
            return {'symbol': symbol, 'error': str(e)}
    
    def compare_stocks(self, symbols: List[str]) -> pd.DataFrame:
        """
        对比多只股票
        """
        print(f"\n⚔️  对比 {len(symbols)} 只股票...")
        
        data = []
        for symbol in symbols:
            fundamentals = self.get_stock_fundamentals(symbol)
            if 'error' not in fundamentals:
                data.append(fundamentals)
        
        if not data:
            return pd.DataFrame()
        
        df = pd.DataFrame(data)
        
        # 计算相对排名
        metrics = ['revenue_growth', 'profit_margin', 'roe', 'gross_margin']
        for metric in metrics:
            if metric in df.columns:
                df[f'{metric}_rank'] = df[metric].rank(ascending=False)
        
        return df
    
    def calculate_moat_score(self, symbol: str) -> Dict:
        """
        计算护城河评分
        
        维度：
        - 品牌优势（市场份额）
        - 技术优势（研发投入）
        - 成本优势（毛利率）
        - 客户粘性（收入增长稳定性）
        """
        print(f"  🏰 评估 {symbol} 护城河...")
        
        try:
            fundamentals = self.get_stock_fundamentals(symbol)
            
            if 'error' in fundamentals:
                return {'score': 50, 'details': {}}
            
            moat_scores = {}
            
            # 1. 规模优势（市值排名）
            market_cap = fundamentals.get('market_cap', 0)
            if market_cap > 500e9:  # >500B
                moat_scores['scale'] = 90
            elif market_cap > 100e9:  # >100B
                moat_scores['scale'] = 75
            elif market_cap > 10e9:  # >10B
                moat_scores['scale'] = 60
            else:
                moat_scores['scale'] = 40
            
            # 2. 盈利能力（毛利率）
            gross_margin = fundamentals.get('gross_margin', 0)
            if gross_margin > 0.6:
                moat_scores['profitability'] = 90
            elif gross_margin > 0.4:
                moat_scores['profitability'] = 75
            elif gross_margin > 0.2:
                moat_scores['profitability'] = 60
            else:
                moat_scores['profitability'] = 40
            
            # 3. 增长优势
            revenue_growth = fundamentals.get('revenue_growth', 0)
            if revenue_growth > 0.3:
                moat_scores['growth'] = 85
            elif revenue_growth > 0.15:
                moat_scores['growth'] = 70
            elif revenue_growth > 0:
                moat_scores['growth'] = 55
            else:
                moat_scores['growth'] = 35
            
            # 4. 资本效率（ROE）
            roe = fundamentals.get('roe', 0)
            if roe > 0.25:
                moat_scores['efficiency'] = 90
            elif roe > 0.15:
                moat_scores['efficiency'] = 75
            elif roe > 0.1:
                moat_scores['efficiency'] = 60
            else:
                moat_scores['efficiency'] = 40
            
            # 综合护城河评分
            moat_score = np.mean(list(moat_scores.values()))
            
            return {
                'score': round(moat_score, 2),
                'details': moat_scores,
                'level': self._interpret_moat_score(moat_score)
            }
            
        except Exception as e:
            print(f"    ❌ 护城河评估失败: {e}")
            return {'score': 50, 'details': {}, 'error': str(e)}
    
    def _interpret_moat_score(self, score: float) -> str:
        """解读护城河等级"""
        if score >= 80:
            return 'WIDE_MOAT'  # 宽阔护城河
        elif score >= 60:
            return 'NARROW_MOAT'  # 窄护城河
        else:
            return 'NO_MOAT'  # 无护城河
    
    def rank_in_sector(self, symbol: str) -> Dict:
        """
        计算股票在行业内的排名
        """
        print(f"\n📊 计算 {symbol} 行业排名...")
        
        # 确定行业
        fundamentals = self.get_stock_fundamentals(symbol)
        sector = fundamentals.get('sector', '')
        
        # 找到对应的行业分组
        sector_key = None
        for key, info in self.sectors.items():
            if symbol in info['stocks']:
                sector_key = key
                break
        
        if not sector_key:
            return {'error': '未找到对应行业'}
        
        # 对比行业内所有股票
        sector_stocks = self.sectors[sector_key]['stocks']
        comparison = self.compare_stocks(sector_stocks)
        
        if comparison.empty:
            return {'error': '对比数据不足'}
        
        # 找到目标股票的排名
        stock_row = comparison[comparison['symbol'] == symbol]
        if stock_row.empty:
            return {'error': '未找到股票数据'}
        
        # 计算综合排名
        total_stocks = len(comparison)
        
        rankings = {}
        for metric in ['revenue_growth', 'profit_margin', 'roe', 'market_cap']:
            if metric in stock_row.columns:
                rank = comparison[metric].rank(ascending=False)[stock_row.index[0]]
                rankings[metric] = {
                    'rank': int(rank),
                    'total': total_stocks,
                    'percentile': round((total_stocks - rank) / total_stocks * 100, 1)
                }
        
        return {
            'symbol': symbol,
            'sector': self.sectors[sector_key]['name'],
            'rankings': rankings,
            'is_leader': rankings.get('market_cap', {}).get('rank', 999) <= 3
        }
    
    def generate_competitive_report(self, symbol: str) -> Dict:
        """
        生成竞争力分析报告
        """
        print(f"\n🎯 生成 {symbol} 竞争力分析报告")
        print("="*70)
        
        # 基本面
        fundamentals = self.get_stock_fundamentals(symbol)
        
        # 护城河
        moat = self.calculate_moat_score(symbol)
        
        # 行业排名
        ranking = self.rank_in_sector(symbol)
        
        # 对比数据
        if 'sector' in ranking:
            sector_key = None
            for key, info in self.sectors.items():
                if info['name'] == ranking['sector']:
                    sector_key = key
                    break
            
            if sector_key:
                comparison = self.compare_stocks(self.sectors[sector_key]['stocks'])
            else:
                comparison = pd.DataFrame()
        else:
            comparison = pd.DataFrame()
        
        result = {
            'symbol': symbol,
            'timestamp': datetime.now().isoformat(),
            'fundamentals': fundamentals,
            'moat': moat,
            'ranking': ranking,
            'comparison': comparison.to_dict('records') if not comparison.empty else []
        }
        
        return result
    
    def print_report(self, result: Dict):
        """打印报告"""
        print("\n" + "="*70)
        print("⚔️  竞争力分析报告")
        print("="*70)
        
        symbol = result['symbol']
        fundamentals = result['fundamentals']
        moat = result['moat']
        ranking = result['ranking']
        
        # 基本信息
        print(f"\n🎯 {symbol} - {fundamentals.get('name', 'N/A')}")
        print(f"   行业: {fundamentals.get('sector', 'N/A')}")
        print(f"   市值: ${fundamentals.get('market_cap', 0)/1e9:.1f}B")
        
        # 护城河
        print(f"\n🏰 护城河评估:")
        print("-"*70)
        moat_emoji = {
            'WIDE_MOAT': '🏰🏰🏰',
            'NARROW_MOAT': '🏰',
            'NO_MOAT': '❌'
        }.get(moat.get('level'), '❓')
        
        print(f"  {moat_emoji} 护城河评分: {moat.get('score', 0):.1f}/100")
        print(f"     等级: {moat.get('level', 'N/A')}")
        
        if 'details' in moat:
            print(f"\n  细分维度:")
            for dimension, score in moat['details'].items():
                print(f"    • {dimension}: {score}分")
        
        # 行业排名
        print(f"\n📊 行业排名:")
        print("-"*70)
        if 'rankings' in ranking:
            for metric, data in ranking['rankings'].items():
                rank = data.get('rank', 0)
                total = data.get('total', 0)
                percentile = data.get('percentile', 0)
                
                emoji = "🥇" if rank == 1 else ("🥈" if rank == 2 else ("🥉" if rank == 3 else "📈"))
                print(f"  {emoji} {metric}: 第{rank}/{total}名 (前{percentile}%)")
        
        if ranking.get('is_leader'):
            print(f"\n  ⭐ {symbol} 是行业龙头之一！")
        
        # 投资建议
        print(f"\n💡 竞争力投资建议:")
        print("-"*70)
        
        if moat.get('level') == 'WIDE_MOAT' and ranking.get('is_leader'):
            print(f"  ✅ 强烈看好 - 宽阔护城河 + 行业龙头")
            print(f"  📊 建议：长期持有，逢低加仓")
        elif moat.get('level') == 'WIDE_MOAT':
            print(f"  ✅ 看好 - 有护城河但非龙头")
            print(f"  📊 建议：可以配置，关注行业地位变化")
        elif moat.get('level') == 'NARROW_MOAT':
            print(f"  ⚖️ 中性 - 护城河较窄")
            print(f"  📊 建议：谨慎配置，关注竞争格局")
        else:
            print(f"  ❌ 回避 - 缺乏护城河")
            print(f"  📊 建议：寻找有护城河的标的")
        
        print("="*70)


def main():
    """主函数"""
    import argparse
    
    parser = argparse.ArgumentParser(
        description='虾虾竞争力分析器',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
使用示例:
  # 分析单只股票竞争力
  python3 competitive_analyzer.py --symbol NVDA
  
  # 对比行业内多股
  python3 competitive_analyzer.py --compare NVDA AMD AVGO QCOM
        """
    )
    
    parser.add_argument('--symbol', '-s', type=str,
                       help='分析特定股票')
    parser.add_argument('--compare', '-c', nargs='+',
                       help='对比多只股票')
    
    args = parser.parse_args()
    
    analyzer = CompetitiveAnalyzer()
    
    if args.symbol:
        result = analyzer.generate_competitive_report(args.symbol)
        analyzer.print_report(result)
    
    elif args.compare:
        df = analyzer.compare_stocks(args.compare)
        if not df.empty:
            print("\n📊 竞争力对比:")
            print(df[['symbol', 'market_cap', 'revenue_growth', 'profit_margin', 'roe']].to_string(index=False))
    
    else:
        print("🦐 虾虾竞争力分析器")
        print("="*70)
        print("\n使用方法:")
        print("  --symbol SYMBOL    分析特定股票")
        print("  --compare SYM...   对比多只股票")
        print("\n要买就买行业龙头！")


if __name__ == "__main__":
    main()
