#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
策略表现数据库 - Strategy Performance DB
作者：虾虾
创建时间：2026-02-09
用途：保存每次评分结果、追踪5日/10日/30日后表现、分析哪些因子最准确、优化权重配置
"""

import os
import sys
import json
import yfinance as yf
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from typing import List, Dict, Optional, Tuple


class StrategyPerformanceDB:
    """
    策略表现数据库
    
    核心功能：
    1. 保存每次多因子评分记录
    2. 自动追踪未来表现（5日/10日/30日）
    3. 分析各因子准确性
    4. 优化权重配置建议
    
    为什么重要：
    - 数据驱动的权重优化
    - 识别哪些因子在特定市场更有效
    - 持续改进虾虾的评分模型
    """
    
    def __init__(self):
        self.data_dir = os.path.expanduser("~/.openclaw/workspace/策略表现数据库")
        os.makedirs(self.data_dir, exist_ok=True)
        
        # 数据库文件
        self.scores_db = os.path.join(self.data_dir, "score_history.json")
        self.performance_db = os.path.join(self.data_dir, "performance_tracking.json")
        self.factor_analysis_db = os.path.join(self.data_dir, "factor_analysis.json")
        
        # 初始化
        self._init_databases()
        
        print("🦐 策略表现数据库启动")
        print("📊 追踪每一次评分，持续优化模型")
        print("="*70)
    
    def _init_databases(self):
        """初始化数据库文件"""
        for db_file in [self.scores_db, self.performance_db, self.factor_analysis_db]:
            if not os.path.exists(db_file):
                with open(db_file, 'w', encoding='utf-8') as f:
                    json.dump([] if 'history' in db_file or 'tracking' in db_file else {}, f)
    
    def record_score(self, symbol: str, score_data: Dict) -> str:
        """
        记录评分结果
        
        Args:
            symbol: 股票代码
            score_data: 多因子评分结果
        
        Returns:
            记录ID
        """
        record_id = f"{symbol}_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        
        record = {
            'id': record_id,
            'symbol': symbol,
            'date': datetime.now().strftime('%Y-%m-%d'),
            'comprehensive_score': score_data.get('comprehensive_score'),
            'factor_scores': score_data.get('factor_scores', {}),
            'weights': score_data.get('weights', {}),
            'current_price': score_data.get('current_price'),
            'timestamp': datetime.now().isoformat()
        }
        
        # 读取并追加
        scores = self._load_json(self.scores_db)
        scores.append(record)
        
        with open(self.scores_db, 'w', encoding='utf-8') as f:
            json.dump(scores, f, ensure_ascii=False, indent=2)
        
        print(f"✅ 已记录评分: {symbol} - {score_data.get('comprehensive_score')}分")
        
        return record_id
    
    def update_performance(self):
        """
        更新所有评分的历史表现
        
        检查5日/10日/30日后的价格，计算收益
        """
        print("\n🔄 更新评分表现追踪...")
        
        scores = self._load_json(self.scores_db)
        performance = self._load_json(self.performance_db)
        
        for record in scores:
            record_id = record['id']
            symbol = record['symbol']
            score_date = datetime.strptime(record['date'], '%Y-%m-%d')
            entry_price = record.get('current_price')
            
            if not entry_price:
                continue
            
            # 检查是否已有表现记录
            existing = [p for p in performance if p['score_id'] == record_id]
            if existing:
                perf_record = existing[0]
            else:
                perf_record = {
                    'score_id': record_id,
                    'symbol': symbol,
                    'score_date': record['date'],
                    'entry_price': entry_price,
                    'score': record.get('comprehensive_score')
                }
                performance.append(perf_record)
            
            # 计算不同时间点的收益
            days_passed = (datetime.now() - score_date).days
            
            try:
                ticker = yf.Ticker(symbol)
                hist = ticker.history(start=score_date, period="max")
                
                if hist.empty:
                    continue
                
                # 5日收益
                if days_passed >= 5 and 'return_5d' not in perf_record:
                    if len(hist) >= 6:
                        price_5d = hist['Close'].iloc[5]
                        perf_record['return_5d'] = round((price_5d - entry_price) / entry_price * 100, 2)
                        perf_record['price_5d'] = round(price_5d, 2)
                
                # 10日收益
                if days_passed >= 10 and 'return_10d' not in perf_record:
                    if len(hist) >= 11:
                        price_10d = hist['Close'].iloc[10]
                        perf_record['return_10d'] = round((price_10d - entry_price) / entry_price * 100, 2)
                        perf_record['price_10d'] = round(price_10d, 2)
                
                # 30日收益
                if days_passed >= 30 and 'return_30d' not in perf_record:
                    if len(hist) >= 31:
                        price_30d = hist['Close'].iloc[30]
                        perf_record['return_30d'] = round((price_30d - entry_price) / entry_price * 100, 2)
                        perf_record['price_30d'] = round(price_30d, 2)
                
            except Exception as e:
                print(f"  ⚠️ 更新{symbol}表现失败: {e}")
        
        # 保存
        with open(self.performance_db, 'w', encoding='utf-8') as f:
            json.dump(performance, f, ensure_ascii=False, indent=2)
        
        print(f"✅ 已更新{len(performance)}条表现记录")
    
    def analyze_factor_accuracy(self) -> Dict:
        """
        分析各因子的准确性
        
        找出哪些因子与最终收益最相关
        """
        print("\n🔍 分析因子准确性...")
        
        scores = self._load_json(self.scores_db)
        performance = self._load_json(self.performance_db)
        
        if not scores or not performance:
            return {'error': '数据不足'}
        
        # 合并数据
        analysis = {
            'technical': {'correct': 0, 'total': 0, 'correlation': 0},
            'fundamental': {'correct': 0, 'total': 0, 'correlation': 0},
            'sentiment': {'correct': 0, 'total': 0, 'correlation': 0},
            'fund_flow': {'correct': 0, 'total': 0, 'correlation': 0},
            'macro': {'correct': 0, 'total': 0, 'correlation': 0}
        }
        
        for perf in performance:
            if 'return_5d' not in perf:
                continue
            
            score_id = perf['score_id']
            actual_return = perf['return_5d']
            
            # 找到对应的评分记录
            score_record = next((s for s in scores if s['id'] == score_id), None)
            if not score_record:
                continue
            
            factor_scores = score_record.get('factor_scores', {})
            
            # 分析每个因子
            for factor_name in ['technical', 'fundamental', 'sentiment', 'fund_flow', 'macro']:
                if factor_name in factor_scores:
                    factor_score = factor_scores[factor_name].get('score', 50)
                    
                    # 简单判断：因子高分且收益正 = 正确
                    if factor_score > 60 and actual_return > 0:
                        analysis[factor_name]['correct'] += 1
                        analysis[factor_name]['total'] += 1
                    elif factor_score < 40 and actual_return < 0:
                        analysis[factor_name]['correct'] += 1
                        analysis[factor_name]['total'] += 1
                    elif factor_score >= 40 and factor_score <= 60:
                        # 中性不算对错
                        pass
                    else:
                        analysis[factor_name]['total'] += 1
        
        # 计算准确率
        for factor in analysis:
            total = analysis[factor]['total']
            if total > 0:
                analysis[factor]['accuracy'] = round(analysis[factor]['correct'] / total * 100, 2)
            else:
                analysis[factor]['accuracy'] = 0
        
        # 保存分析结果
        with open(self.factor_analysis_db, 'w', encoding='utf-8') as f:
            json.dump(analysis, f, ensure_ascii=False, indent=2)
        
        return analysis
    
    def suggest_weight_optimization(self) -> Dict:
        """
        基于表现数据建议权重优化
        """
        analysis = self.analyze_factor_accuracy()
        
        if 'error' in analysis:
            return analysis
        
        print("\n💡 权重优化建议:")
        print("-"*70)
        
        # 找出最准确的因子
        accuracies = {k: v['accuracy'] for k, v in analysis.items() if v['total'] > 10}
        
        if not accuracies:
            return {'error': '数据不足，无法优化'}
        
        # 排序
        sorted_factors = sorted(accuracies.items(), key=lambda x: x[1], reverse=True)
        
        # 建议新权重
        total_accuracy = sum(accuracies.values())
        
        suggested_weights = {}
        for factor, accuracy in accuracies.items():
            # 按准确率比例分配权重
            suggested_weights[factor] = round(accuracy / total_accuracy, 2)
        
        # 归一化到总和为1
        weight_sum = sum(suggested_weights.values())
        for factor in suggested_weights:
            suggested_weights[factor] = round(suggested_weights[factor] / weight_sum, 2)
        
        return {
            'current_accuracy': analysis,
            'suggested_weights': suggested_weights,
            'best_performing_factor': sorted_factors[0][0] if sorted_factors else None,
            'worst_performing_factor': sorted_factors[-1][0] if sorted_factors else None
        }
    
    def generate_performance_report(self) -> str:
        """
        生成策略表现报告
        """
        self.update_performance()
        analysis = self.analyze_factor_accuracy()
        
        scores = self._load_json(self.scores_db)
        performance = self._load_json(self.performance_db)
        
        report = []
        report.append("="*70)
        report.append("📊 策略表现数据库报告")
        report.append(f"生成时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        report.append("="*70)
        
        # 总体统计
        total_scores = len(scores)
        tracked_performance = len([p for p in performance if 'return_5d' in p])
        
        report.append(f"\n📈 总体统计:")
        report.append("-"*70)
        report.append(f"  总评分记录: {total_scores}")
        report.append(f"  已追踪表现: {tracked_performance}")
        
        # 各因子准确性
        if 'error' not in analysis:
            report.append(f"\n🎯 各因子准确性:")
            report.append("-"*70)
            for factor, data in analysis.items():
                if data['total'] > 0:
                    accuracy = data['accuracy']
                    emoji = "🟢" if accuracy > 60 else ("🟡" if accuracy > 50 else "🔴")
                    report.append(f"  {emoji} {factor}: {accuracy}% ({data['correct']}/{data['total']})")
        
        # 优化建议
        optimization = self.suggest_weight_optimization()
        if 'error' not in optimization:
            report.append(f"\n💡 权重优化建议:")
            report.append("-"*70)
            
            current_weights = {
                'technical': 0.25,
                'fundamental': 0.25,
                'sentiment': 0.20,
                'fund_flow': 0.20,
                'macro': 0.10
            }
            
            report.append(f"  {'因子':<15} {'当前权重':<12} {'建议权重':<12}")
            report.append(f"  {'-'*40}")
            
            for factor in current_weights:
                current = current_weights[factor]
                suggested = optimization['suggested_weights'].get(factor, current)
                report.append(f"  {factor:<15} {current:<12.2f} {suggested:<12.2f}")
            
            if optimization.get('best_performing_factor'):
                report.append(f"\n  ⭐ 表现最佳因子: {optimization['best_performing_factor']}")
            if optimization.get('worst_performing_factor'):
                report.append(f"  ⚠️  表现最差因子: {optimization['worst_performing_factor']}")
        
        report.append("="*70)
        
        return "\n".join(report)
    
    def _load_json(self, filepath: str):
        """加载JSON文件"""
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                return json.load(f)
        except:
            return []


def main():
    """主函数"""
    import argparse
    
    parser = argparse.ArgumentParser(
        description='虾虾策略表现数据库',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
使用示例:
  # 更新表现追踪
  python3 strategy_performance_db.py --update
  
  # 分析因子准确性
  python3 strategy_performance_db.py --analyze
  
  # 生成完整报告
  python3 strategy_performance_db.py --report
        """
    )
    
    parser.add_argument('--update', action='store_true',
                       help='更新表现追踪')
    parser.add_argument('--analyze', action='store_true',
                       help='分析因子准确性')
    parser.add_argument('--optimize', action='store_true',
                       help='生成权重优化建议')
    parser.add_argument('--report', '-r', action='store_true',
                       help='生成完整报告')
    
    args = parser.parse_args()
    
    db = StrategyPerformanceDB()
    
    if args.update:
        db.update_performance()
    
    elif args.analyze:
        analysis = db.analyze_factor_accuracy()
        print(json.dumps(analysis, indent=2))
    
    elif args.optimize:
        optimization = db.suggest_weight_optimization()
        print(json.dumps(optimization, indent=2))
    
    elif args.report:
        report = db.generate_performance_report()
        print(report)
    
    else:
        print("🦐 虾虾策略表现数据库")
        print("="*70)
        print("\n使用方法:")
        print("  --update      更新表现追踪")
        print("  --analyze     分析因子准确性")
        print("  --optimize    权重优化建议")
        print("  --report      生成完整报告")
        print("\n数据驱动的持续优化！")


if __name__ == "__main__":
    main()
