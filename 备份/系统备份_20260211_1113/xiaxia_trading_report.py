#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
虾虾交易报告系统 - XiaXia Trading Report System
作者：虾虾
创建时间：2026-02-10
用途：记录买入原因、跟踪表现、反馈优化投资逻辑
"""

import os
import json
import sys
from datetime import datetime, timedelta
from typing import Dict, List, Optional
import yfinance as yf

# 添加工具路径
sys.path.insert(0, '/Users/fox/.openclaw/workspace/tools')
from telegram_notifier import TelegramNotifier


class XiaXiaTradingReport:
    """
    虾虾交易报告系统
    
    核心功能：
    1. 记录买入时的完整分析（为什么买）
    2. 每日跟踪持仓表现
    3. 卖出时总结投资逻辑验证结果
    4. 生成投资逻辑优化建议
    5. 持续改进虾虾的评分模型
    """
    
    def __init__(self):
        """初始化报告系统"""
        self.data_dir = '/Users/fox/.openclaw/workspace/虾虾交易报告'
        os.makedirs(self.data_dir, exist_ok=True)
        
        # 子目录
        self.buy_reports_dir = os.path.join(self.data_dir, '买入报告')
        self.track_dir = os.path.join(self.data_dir, '持仓跟踪')
        self.sell_reports_dir = os.path.join(self.data_dir, '卖出总结')
        self.feedback_dir = os.path.join(self.data_dir, '逻辑优化')
        
        for d in [self.buy_reports_dir, self.track_dir, self.sell_reports_dir, self.feedback_dir]:
            os.makedirs(d, exist_ok=True)
        
        # 统计文件
        self.stats_file = os.path.join(self.data_dir, '交易统计.json')
        
        print("🦐 虾虾交易报告系统初始化完成")
        print(f"  数据目录: {self.data_dir}")
    
    def record_buy_report(self, symbol: str, entry_price: float, quantity: int,
                         score: int, factors: Dict, reasoning: str, 
                         target_price: float, stop_loss: float,
                         confidence: str = "medium") -> str:
        """
        记录买入报告
        
        Args:
            symbol: 股票代码
            entry_price: 买入价格
            quantity: 数量
            score: 多因子评分
            factors: 各因子得分详情
            reasoning: 买入理由
            target_price: 目标价
            stop_loss: 止损价
            confidence: 置信度
        
        Returns:
            报告ID
        """
        report_id = f"{symbol}_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        
        report = {
            'id': report_id,
            'symbol': symbol,
            'entry_price': entry_price,
            'quantity': quantity,
            'entry_date': datetime.now().strftime('%Y-%m-%d'),
            'entry_time': datetime.now().strftime('%H:%M:%S'),
            'score': score,
            'factors': factors,
            'reasoning': reasoning,
            'target_price': target_price,
            'stop_loss': stop_loss,
            'confidence': confidence,
            'status': 'HOLDING',
            'daily_tracking': [],
            'created_at': datetime.now().isoformat()
        }
        
        # 保存报告
        filepath = os.path.join(self.buy_reports_dir, f"{report_id}.json")
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(report, f, ensure_ascii=False, indent=2)
        
        print(f"✅ 买入报告已记录: {report_id}")
        return report_id
    
    def daily_tracking(self, report_id: str) -> Optional[Dict]:
        """
        每日跟踪持仓表现
        
        Args:
            report_id: 报告ID
        
        Returns:
            更新后的报告
        """
        # 查找报告
        filepath = os.path.join(self.buy_reports_dir, f"{report_id}.json")
        if not os.path.exists(filepath):
            print(f"❌ 未找到报告: {report_id}")
            return None
        
        with open(filepath, 'r', encoding='utf-8') as f:
            report = json.load(f)
        
        symbol = report['symbol']
        entry_price = report['entry_price']
        
        try:
            # 获取当前价格
            ticker = yf.Ticker(symbol)
            current_price = ticker.history(period="1d")['Close'].iloc[-1]
            
            # 计算收益
            return_pct = (current_price - entry_price) / entry_price * 100
            days_held = (datetime.now() - datetime.fromisoformat(report['created_at'])).days
            
            # 今日跟踪数据
            tracking_data = {
                'date': datetime.now().strftime('%Y-%m-%d'),
                'current_price': round(current_price, 2),
                'return_pct': round(return_pct, 2),
                'days_held': days_held,
                'target_distance': round((report['target_price'] - current_price) / current_price * 100, 2),
                'stop_distance': round((current_price - report['stop_loss']) / current_price * 100, 2),
                'timestamp': datetime.now().isoformat()
            }
            
            # 添加跟踪记录
            report['daily_tracking'].append(tracking_data)
            
            # 保存更新
            with open(filepath, 'w', encoding='utf-8') as f:
                json.dump(report, f, ensure_ascii=False, indent=2)
            
            print(f"📊 {symbol} 跟踪更新: 收益{return_pct:+.2f}% ({days_held}天)")
            return report
            
        except Exception as e:
            print(f"❌ 跟踪失败 {symbol}: {e}")
            return None
    
    def record_sell_report(self, report_id: str, exit_price: float, 
                          exit_reason: str, lessons_learned: str) -> Optional[Dict]:
        """
        记录卖出总结报告
        
        Args:
            report_id: 买入报告ID
            exit_price: 卖出价格
            exit_reason: 卖出原因
            lessons_learned: 经验教训
        
        Returns:
            完整交易报告
        """
        # 查找买入报告
        buy_filepath = os.path.join(self.buy_reports_dir, f"{report_id}.json")
        if not os.path.exists(buy_filepath):
            print(f"❌ 未找到买入报告: {report_id}")
            return None
        
        with open(buy_filepath, 'r', encoding='utf-8') as f:
            buy_report = json.load(f)
        
        # 计算最终收益
        entry_price = buy_report['entry_price']
        quantity = buy_report['quantity']
        total_return = (exit_price - entry_price) * quantity
        return_pct = (exit_price - entry_price) / entry_price * 100
        days_held = (datetime.now() - datetime.fromisoformat(buy_report['created_at'])).days
        
        # 判断投资逻辑是否正确
        logic_correct = self._evaluate_logic(buy_report, exit_price, exit_reason)
        
        # 完整交易报告
        complete_report = {
            **buy_report,
            'exit_price': exit_price,
            'exit_date': datetime.now().strftime('%Y-%m-%d'),
            'exit_reason': exit_reason,
            'total_return': round(total_return, 2),
            'return_pct': round(return_pct, 2),
            'days_held': days_held,
            'lessons_learned': lessons_learned,
            'logic_correct': logic_correct,
            'status': 'CLOSED'
        }
        
        # 保存卖出总结
        sell_filepath = os.path.join(self.sell_reports_dir, f"{report_id}_sell.json")
        with open(sell_filepath, 'w', encoding='utf-8') as f:
            json.dump(complete_report, f, ensure_ascii=False, indent=2)
        
        # 更新买入报告状态
        buy_report['status'] = 'CLOSED'
        with open(buy_filepath, 'w', encoding='utf-8') as f:
            json.dump(buy_report, f, ensure_ascii=False, indent=2)
        
        # 生成本次交易反馈
        self._generate_feedback(complete_report)
        
        print(f"✅ 卖出总结已记录: {report_id}")
        print(f"   收益: {return_pct:+.2f}% ({total_return:+.2f}$)")
        print(f"   持仓: {days_held}天")
        
        return complete_report
    
    def _evaluate_logic(self, buy_report: Dict, exit_price: float, exit_reason: str) -> bool:
        """
        评估投资逻辑是否正确
        
        判断标准：
        - 如果目标价达成后卖出 → 正确
        - 如果止损触发但避免更大损失 → 正确
        - 如果提前卖出但错过大涨 → 错误
        """
        target_price = buy_report['target_price']
        stop_loss = buy_report['stop_loss']
        
        if exit_price >= target_price * 0.95:  # 达成目标价(允许5%误差)
            return True
        elif exit_price <= stop_loss and '止损' in exit_reason:  # 触发止损
            return True
        else:
            return False
    
    def _generate_feedback(self, complete_report: Dict):
        """生成投资逻辑优化建议"""
        feedback = {
            'report_id': complete_report['id'],
            'symbol': complete_report['symbol'],
            'date': datetime.now().strftime('%Y-%m-%d'),
            'logic_correct': complete_report['logic_correct'],
            'lessons': complete_report['lessons_learned'],
            'score_accuracy': self._evaluate_score_accuracy(complete_report),
            'timing_analysis': self._analyze_timing(complete_report),
            'improvement_suggestions': self._generate_suggestions(complete_report)
        }
        
        # 保存反馈
        feedback_path = os.path.join(self.feedback_dir, f"{complete_report['id']}_feedback.json")
        with open(feedback_path, 'w', encoding='utf-8') as f:
            json.dump(feedback, f, ensure_ascii=False, indent=2)
        
        print(f"💡 投资逻辑反馈已生成")
    
    def _evaluate_score_accuracy(self, report: Dict) -> str:
        """评估评分准确性"""
        score = report['score']
        return_pct = report['return_pct']
        
        if score >= 80 and return_pct > 10:
            return "评分准确: 高分股确实上涨"
        elif score >= 80 and return_pct < 0:
            return "评分失效: 高分股下跌，需检查评分模型"
        elif score < 60 and return_pct > 10:
            return "评分遗漏: 低分股大涨，可能漏掉机会"
        else:
            return "评分正常"
    
    def _analyze_timing(self, report: Dict) -> str:
        """分析入场时机"""
        days_held = report['days_held']
        return_pct = report['return_pct']
        
        if days_held <= 3 and return_pct > 5:
            return "入场时机优秀: 快速获利"
        elif days_held <= 3 and return_pct < -5:
            return "入场时机差: 买入即下跌，可能追高"
        elif days_held > 10 and return_pct > 10:
            return "持有耐心获得回报"
        else:
            return "时机一般"
    
    def _generate_suggestions(self, report: Dict) -> List[str]:
        """生成改进建议"""
        suggestions = []
        
        # 基于评分准确性
        score_accuracy = self._evaluate_score_accuracy(report)
        if "失效" in score_accuracy:
            suggestions.append("需要调整评分权重，基本面因子可能权重过高")
        if "遗漏" in score_accuracy:
            suggestions.append("技术面因子权重可能需要提升")
        
        # 基于时机
        timing = self._analyze_timing(report)
        if "追高" in timing:
            suggestions.append("避免在短期大涨后买入，等待回调")
        
        # 基于止损
        if report['return_pct'] < -8:
            suggestions.append("止损执行需要更严格，避免深套")
        
        return suggestions if suggestions else ["继续保持当前策略"]
    
    def generate_weekly_feedback_report(self) -> str:
        """生成每周投资逻辑优化报告"""
        # 统计本周所有卖出交易
        sell_reports = []
        for filename in os.listdir(self.sell_reports_dir):
            if filename.endswith('.json'):
                with open(os.path.join(self.sell_reports_dir, filename), 'r') as f:
                    report = json.load(f)
                    # 检查是否是本周
                    if report.get('exit_date', '').startswith(datetime.now().strftime('%Y-%m-%d')[:7]):
                        sell_reports.append(report)
        
        if not sell_reports:
            return "本周无卖出交易，暂无反馈报告"
        
        # 统计分析
        total_trades = len(sell_reports)
        winning_trades = [r for r in sell_reports if r['return_pct'] > 0]
        correct_logic = [r for r in sell_reports if r.get('logic_correct', False)]
        
        avg_return = sum([r['return_pct'] for r in sell_reports]) / total_trades
        win_rate = len(winning_trades) / total_trades * 100
        logic_accuracy = len(correct_logic) / total_trades * 100
        
        # 生成报告
        report_content = f"""
🦐 虾虾每周投资逻辑优化报告
{'='*70}

📊 本周交易统计
{'-'*70}
总交易数: {total_trades}
胜率: {win_rate:.1f}%
平均收益: {avg_return:+.2f}%
投资逻辑正确率: {logic_accuracy:.1f}%

🎯 关键发现
{'-'*70}
"""
        
        # 分析成功案例
        if winning_trades:
            best_trade = max(winning_trades, key=lambda x: x['return_pct'])
            report_content += f"""
✅ 最佳交易: {best_trade['symbol']}
   收益: +{best_trade['return_pct']:.2f}%
   逻辑: {best_trade['reasoning'][:50]}...
"""
        
        # 分析失败案例
        losing_trades = [r for r in sell_reports if r['return_pct'] < 0]
        if losing_trades:
            worst_trade = min(losing_trades, key=lambda x: x['return_pct'])
            report_content += f"""
❌ 最差交易: {worst_trade['symbol']}
   亏损: {worst_trade['return_pct']:.2f}%
   教训: {worst_trade.get('lessons_learned', '无')[:50]}...
"""
        
        # 优化建议
        all_suggestions = []
        for r in sell_reports:
            feedback_path = os.path.join(self.feedback_dir, f"{r['id']}_feedback.json")
            if os.path.exists(feedback_path):
                with open(feedback_path, 'r') as f:
                    feedback = json.load(f)
                    all_suggestions.extend(feedback.get('improvement_suggestions', []))
        
        # 去重
        unique_suggestions = list(set(all_suggestions))
        
        report_content += f"""
💡 优化建议汇总
{'-'*70}
"""
        for i, suggestion in enumerate(unique_suggestions[:5], 1):
            report_content += f"{i}. {suggestion}\n"
        
        report_content += f"""
🦐 虾虾自我评级: {'A+' if logic_accuracy >= 70 else 'A' if logic_accuracy >= 60 else 'B'}

{'='*70}
报告生成时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
"""
        
        # 保存报告
        report_path = os.path.join(self.feedback_dir, f"weekly_feedback_{datetime.now().strftime('%Y%m%d')}.txt")
        with open(report_path, 'w', encoding='utf-8') as f:
            f.write(report_content)
        
        print(f"✅ 每周反馈报告已生成: {report_path}")
        return report_content


# 测试函数
def test_trading_report():
    """测试交易报告系统"""
    print("🦐 测试虾虾交易报告系统")
    print("="*70)
    
    report_system = XiaXiaTradingReport()
    
    # 测试记录买入
    print("\n1️⃣ 测试记录买入...")
    report_id = report_system.record_buy_report(
        symbol='GFS',
        entry_price=43.10,
        quantity=100,
        score=85,
        factors={
            'technical': 80,
            'fundamental': 70,
            'sentiment': 85,
            'fund_flow': 75,
            'macro': 80
        },
        reasoning='多因子评分85分，技术突破MA20，NVTS GaN代工催化',
        target_price=55.0,
        stop_loss=38.0,
        confidence='high'
    )
    
    # 测试每日跟踪
    print("\n2️⃣ 测试每日跟踪...")
    report_system.daily_tracking(report_id)
    
    # 测试记录卖出
    print("\n3️⃣ 测试记录卖出...")
    report_system.record_sell_report(
        report_id=report_id,
        exit_price=52.0,
        exit_reason='达到目标价，获利了结',
        lessons_learned='技术分析准确，基本面催化验证，下次可以继续使用类似逻辑'
    )
    
    # 测试每周报告
    print("\n4️⃣ 测试每周反馈报告...")
    weekly_report = report_system.generate_weekly_feedback_report()
    print(weekly_report)
    
    print("\n✅ 测试完成!")


if __name__ == "__main__":
    test_trading_report()
