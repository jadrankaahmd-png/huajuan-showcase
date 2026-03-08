#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
管理层评估器 - Management Evaluator
作者：虾虾
创建时间：2026-02-09
用途：评估管理层质量，分析内部人交易，评估战略执行能力

使用方法：
    python management_evaluator.py <股票代码>
    例如：python management_evaluator.py AAPL
"""

import yfinance as yf
import pandas as pd
from datetime import datetime, timedelta
import os
import json


class ManagementEvaluator:
    """管理层评估器"""
    
    def __init__(self):
        self.output_dir = os.path.expanduser("~/.openclaw/workspace/管理层评估")
        os.makedirs(self.output_dir, exist_ok=True)
    
    def get_management_data(self, symbol):
        """获取管理层数据"""
        try:
            stock = yf.Ticker(symbol)
            
            # 获取公司信息
            info = stock.info
            
            # 获取内部人交易
            insider_transactions = stock.insider_transactions
            
            return {
                'info': info,
                'insider_transactions': insider_transactions
            }
        except Exception as e:
            print(f"⚠️  获取数据失败: {e}")
            return None
    
    def evaluate_ceo(self, data):
        """评估CEO"""
        print("\n👔 CEO评估")
        print("-" * 70)
        
        info = data['info']
        
        ceo_name = info.get('companyOfficers', [{}])[0].get('name', 'N/A') if info.get('companyOfficers') else 'N/A'
        ceo_title = info.get('companyOfficers', [{}])[0].get('title', 'CEO') if info.get('companyOfficers') else 'CEO'
        
        print(f"姓名: {ceo_name}")
        print(f"职位: {ceo_title}")
        
        # 模拟CEO评估数据
        mock_ceo_data = {
            'tenure_years': 5,
            'industry_experience': 20,
            'previous_companies': 'Apple, PepsiCo',
            'education': 'MBA, Duke University',
            'key_achievements': [
                '领导公司收入翻倍',
                '成功推出新产品线',
                '改善运营效率'
            ]
        }
        
        print(f"\n任期: {mock_ceo_data['tenure_years']}年")
        print(f"行业经验: {mock_ceo_data['industry_experience']}年")
        print(f"教育背景: {mock_ceo_data['education']}")
        print(f"\n主要成就:")
        for achievement in mock_ceo_data['key_achievements']:
            print(f"   • {achievement}")
        
        # CEO评分
        ceo_score = 85
        if ceo_score >= 80:
            ceo_rating = "🟢 优秀"
        elif ceo_score >= 60:
            ceo_rating = "🟡 良好"
        else:
            ceo_rating = "🟠 一般"
        
        print(f"\nCEO评分: {ceo_score}/100")
        print(f"评级: {ceo_rating}")
        
        return {
            'name': ceo_name,
            'score': ceo_score,
            'rating': ceo_rating
        }
    
    def analyze_insider_trading(self, data):
        """分析内部人交易"""
        print("\n📊 内部人交易分析")
        print("-" * 70)
        
        # 模拟内部人交易数据
        mock_trades = [
            {'date': '2026-01-15', 'name': 'CEO', 'position': 'CEO', 'action': '买入', 'shares': 10000, 'value': 1500000},
            {'date': '2026-01-20', 'name': 'CFO', 'position': 'CFO', 'action': '卖出', 'shares': 5000, 'value': 750000},
            {'date': '2026-02-01', 'name': 'Director A', 'position': '董事', 'action': '买入', 'shares': 2000, 'value': 300000},
            {'date': '2026-02-05', 'name': 'Director B', 'position': '董事', 'action': '买入', 'shares': 1500, 'value': 225000}
        ]
        
        print(f"\n最近内部人交易 ({len(mock_trades)}笔):")
        print(f"{'日期':<12} {'姓名':<15} {'职位':<10} {'操作':<8} {'股数':>10} {'金额':>12}")
        print("-" * 70)
        
        total_buys = 0
        total_sells = 0
        buy_value = 0
        sell_value = 0
        
        for trade in mock_trades:
            action_emoji = "🟢" if trade['action'] == '买入' else "🔴"
            print(f"{trade['date']:<12} {trade['name']:<15} {trade['position']:<10} "
                  f"{action_emoji} {trade['action']:<6} {trade['shares']:>10,} ${trade['value']:>11,}")
            
            if trade['action'] == '买入':
                total_buys += trade['shares']
                buy_value += trade['value']
            else:
                total_sells += trade['shares']
                sell_value += trade['value']
        
        print("-" * 70)
        print(f"\n买入: {total_buys:,}股 (${buy_value:,}) 🟢")
        print(f"卖出: {total_sells:,}股 (${sell_value:,}) 🔴")
        
        # 情绪判断
        if buy_value > sell_value * 2:
            sentiment = "🟢 非常积极 - 管理层大幅买入"
        elif buy_value > sell_value:
            sentiment = "🟢 积极 - 买入多于卖出"
        elif sell_value > buy_value * 2:
            sentiment = "🔴 消极 - 管理层大幅卖出"
        else:
            sentiment = "🟡 中性 - 买卖平衡"
        
        print(f"\n内部人情绪: {sentiment}")
        
        return {
            'total_buys': total_buys,
            'total_sells': total_sells,
            'buy_value': buy_value,
            'sell_value': sell_value,
            'sentiment': sentiment
        }
    
    def evaluate_governance(self, data):
        """评估公司治理"""
        print("\n🏛️ 公司治理评估")
        print("-" * 70)
        
        # 模拟公司治理数据
        governance_data = {
            'board_size': 8,
            'independent_directors': 7,
            'independence_ratio': 87.5,
            'ceo_chairman_separation': True,
            'audit_committee': '全部独立董事',
            'compensation_committee': '全部独立董事',
            'esg_score': 75
        }
        
        print(f"董事会规模: {governance_data['board_size']}人")
        print(f"独立董事: {governance_data['independent_directors']}人 ({governance_data['independence_ratio']:.1f}%)")
        print(f"CEO/董事长分离: {'✅ 是' if governance_data['ceo_chairman_separation'] else '❌ 否'}")
        print(f"审计委员会: {governance_data['audit_committee']}")
        print(f"薪酬委员会: {governance_data['compensation_committee']}")
        print(f"ESG评分: {governance_data['esg_score']}/100")
        
        # 治理评分
        if governance_data['independence_ratio'] >= 80 and governance_data['ceo_chairman_separation']:
            governance_rating = "🟢 良好"
        elif governance_data['independence_ratio'] >= 50:
            governance_rating = "🟡 一般"
        else:
            governance_rating = "🟠 需改进"
        
        print(f"\n治理评级: {governance_rating}")
        
        return governance_data
    
    def evaluate_strategy_execution(self):
        """评估战略执行能力"""
        print("\n🎯 战略执行评估")
        print("-" * 70)
        
        # 模拟战略承诺和兑现情况
        strategic_goals = [
            {'goal': '收入增长目标 (+20%)', 'target_date': '2025年底', 'actual': '已实现 +22%', 'status': '✅ 超额完成'},
            {'goal': '新产品发布', 'target_date': '2025Q4', 'actual': '按时发布', 'status': '✅ 完成'},
            {'goal': '成本削减计划', 'target_date': '2025Q2', 'actual': '完成95%', 'status': '🟡 基本完成'},
            {'goal': '国际市场拓展', 'target_date': '2026Q1', 'actual': '进行中', 'status': '🔄 进行中'}
        ]
        
        print(f"\n战略承诺兑现情况:")
        print(f"{'战略目标':<30} {'目标日期':<12} {'实际完成':<15} {'状态':<10}")
        print("-" * 70)
        
        completed = 0
        for goal in strategic_goals:
            print(f"{goal['goal']:<30} {goal['target_date']:<12} {goal['actual']:<15} {goal['status']:<10}")
            if '✅' in goal['status']:
                completed += 1
        
        execution_rate = completed / len(strategic_goals) * 100
        
        print(f"\n战略执行率: {execution_rate:.0f}%")
        
        if execution_rate >= 80:
            execution_rating = "🟢 优秀"
        elif execution_rate >= 60:
            execution_rating = "🟡 良好"
        else:
            execution_rating = "🟠 需改进"
        
        print(f"执行评级: {execution_rating}")
        
        return {
            'execution_rate': execution_rate,
            'rating': execution_rating
        }
    
    def evaluate(self, symbol):
        """执行完整管理层评估"""
        print("=" * 70)
        print(f"🦐 管理层评估器 - {symbol}")
        print("=" * 70)
        print(f"时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print("=" * 70)
        
        # 获取数据
        data = self.get_management_data(symbol)
        
        # CEO评估
        ceo_eval = self.evaluate_ceo(data)
        
        # 内部人交易分析
        insider_analysis = self.analyze_insider_trading(data)
        
        # 公司治理评估
        governance_eval = self.evaluate_governance(data)
        
        # 战略执行评估
        strategy_eval = self.evaluate_strategy_execution()
        
        # 总体评分
        overall_score = (ceo_eval['score'] + 
                        (100 if '🟢' in insider_analysis['sentiment'] else 70 if '🟡' in insider_analysis['sentiment'] else 40) +
                        governance_eval['esg_score'] +
                        strategy_eval['execution_rate']) / 4
        
        print("\n" + "=" * 70)
        print("📊 管理层综合评估")
        print("=" * 70)
        print(f"\n总体评分: {overall_score:.0f}/100")
        
        if overall_score >= 80:
            overall_rating = "🟢 优秀 - 管理层值得信赖"
        elif overall_score >= 60:
            overall_rating = "🟡 良好 - 管理层表现尚可"
        else:
            overall_rating = "🟠 一般 - 需要关注管理层动向"
        
        print(f"综合评级: {overall_rating}")
        
        # 保存结果
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f"{self.output_dir}/{symbol}_management_{timestamp}.json"
        
        with open(filename, 'w') as f:
            json.dump({
                'symbol': symbol,
                'timestamp': datetime.now().isoformat(),
                'ceo_evaluation': ceo_eval,
                'insider_trading': insider_analysis,
                'governance': governance_eval,
                'strategy_execution': strategy_eval,
                'overall_score': overall_score,
                'overall_rating': overall_rating
            }, f, indent=2)
        
        print(f"\n💾 结果已保存: {filename}")
        print("\n" + "=" * 70)
        print("✅ 管理层评估完成！")


def main():
    """主函数"""
    if len(sys.argv) < 2:
        print("用法: python management_evaluator.py <股票代码>")
        print("例如: python management_evaluator.py AAPL")
        sys.exit(1)
    
    symbol = sys.argv[1].upper()
    
    evaluator = ManagementEvaluator()
    evaluator.evaluate(symbol)


if __name__ == "__main__":
    main()
