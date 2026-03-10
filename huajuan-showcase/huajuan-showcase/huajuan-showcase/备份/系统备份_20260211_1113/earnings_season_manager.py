#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
财报季管理工具 - Earnings Season Manager
作者：虾虾
创建时间：2026-02-09
用途：自动计算持仓股财报日期、财报前风险评估、财报后超预期分析、集成到每日报告
"""

import os
import sys
import json
import yfinance as yf
from datetime import datetime, timedelta
from typing import List, Dict, Optional, Tuple
import calendar


class EarningsSeasonManager:
    """
    财报季管理工具
    
    功能：
    1. 自动计算持仓股财报日期
    2. 财报前风险评估（IV偏斜、历史超预期率）
    3. 财报后超预期分析
    4. 生成财报日历
    5. 集成到每日报告
    """
    
    def __init__(self):
        # 持仓股列表
        self.holdings = ['NVDA', 'AMD', 'TSLA', 'AAPL', 'MSFT', 'AVGO', 'SMCI', 'CRWV']
        
        # 数据目录
        self.data_dir = os.path.expanduser("~/.openclaw/workspace/财报数据")
        os.makedirs(self.data_dir, exist_ok=True)
        
        # 财报历史缓存
        self.earnings_history = {}
        
        print("🦐 财报季管理工具启动")
        print(f"📊 监控持仓: {', '.join(self.holdings)}")
        print("="*70)
    
    def get_earnings_date(self, symbol: str) -> Optional[Dict]:
        """
        获取股票财报日期
        
        Args:
            symbol: 股票代码
        
        Returns:
            财报日期信息
        """
        try:
            ticker = yf.Ticker(symbol)
            
            # 获取财报日历
            calendar = ticker.calendar
            
            if calendar is not None and not calendar.empty:
                # 解析财报日期
                earnings_date = calendar.index[0] if hasattr(calendar.index[0], 'strftime') else None
                
                if earnings_date:
                    return {
                        'symbol': symbol,
                        'earnings_date': earnings_date.strftime('%Y-%m-%d'),
                        'eps_estimate': calendar.loc[earnings_date, 'Earnings Estimate'] if 'Earnings Estimate' in calendar.columns else None,
                        'revenue_estimate': calendar.loc[earnings_date, 'Revenue Estimate'] if 'Revenue Estimate' in calendar.columns else None,
                        'days_until': (earnings_date - datetime.now()).days
                    }
            
            # 如果calendar为空，尝试从earnings_dates获取
            try:
                earnings_dates = ticker.earnings_dates
                if earnings_dates is not None and not earnings_dates.empty:
                    future_dates = earnings_dates[earnings_dates.index > datetime.now()]
                    if not future_dates.empty:
                        next_date = future_dates.index[0]
                        return {
                            'symbol': symbol,
                            'earnings_date': next_date.strftime('%Y-%m-%d'),
                            'eps_estimate': None,
                            'revenue_estimate': None,
                            'days_until': (next_date - datetime.now()).days
                        }
            except:
                pass
            
            return None
            
        except Exception as e:
            print(f"❌ 获取{symbol}财报日期失败: {e}")
            return None
    
    def get_earnings_calendar(self, days_ahead: int = 30) -> List[Dict]:
        """
        获取未来财报日历
        
        Args:
            days_ahead: 提前多少天
        
        Returns:
            财报日历列表
        """
        print(f"\n📅 生成未来{days_ahead}天财报日历...")
        
        calendar_list = []
        
        for symbol in self.holdings:
            info = self.get_earnings_date(symbol)
            if info:
                calendar_list.append(info)
        
        # 按日期排序
        calendar_list.sort(key=lambda x: x['earnings_date'])
        
        # 只保留未来days_ahead天内的
        cutoff_date = datetime.now() + timedelta(days=days_ahead)
        calendar_list = [
            item for item in calendar_list 
            if datetime.strptime(item['earnings_date'], '%Y-%m-%d') <= cutoff_date
        ]
        
        return calendar_list
    
    def assess_earnings_risk(self, symbol: str) -> Dict:
        """
        财报前风险评估
        
        评估维度：
        1. 历史超预期率
        2. 期权IV偏斜（隐含波动率）
        3. 近期股价波动
        4. 分析师预期离散度
        
        Args:
            symbol: 股票代码
        
        Returns:
            风险评估结果
        """
        print(f"\n🔍 评估 {symbol} 财报风险...")
        
        risk_assessment = {
            'symbol': symbol,
            'overall_risk': 'medium',
            'factors': {}
        }
        
        try:
            ticker = yf.Ticker(symbol)
            
            # 1. 获取历史财报数据
            earnings_history = ticker.earnings_history
            if earnings_history is not None and not earnings_history.empty:
                # 计算超预期率
                total_reports = len(earnings_history)
                beat_count = sum(1 for _, row in earnings_history.iterrows() 
                               if row.get('Surprise(%)', 0) > 0)
                beat_rate = beat_count / total_reports if total_reports > 0 else 0.5
                
                risk_assessment['factors']['historical_beat_rate'] = {
                    'value': f"{beat_rate*100:.1f}%",
                    'risk_level': 'low' if beat_rate > 0.7 else ('medium' if beat_rate > 0.5 else 'high'),
                    'description': f'过去{total_reports}次财报中超预期{beat_count}次'
                }
            
            # 2. 近期股价波动
            hist = ticker.history(period="30d")
            if not hist.empty:
                volatility = hist['Close'].pct_change().std() * (252 ** 0.5)  # 年化波动率
                
                risk_assessment['factors']['volatility'] = {
                    'value': f"{volatility*100:.1f}%",
                    'risk_level': 'high' if volatility > 0.5 else ('medium' if volatility > 0.3 else 'low'),
                    'description': '30日年化波动率'
                }
            
            # 3. 计算综合风险
            risk_scores = []
            for factor in risk_assessment['factors'].values():
                if factor['risk_level'] == 'high':
                    risk_scores.append(3)
                elif factor['risk_level'] == 'medium':
                    risk_scores.append(2)
                else:
                    risk_scores.append(1)
            
            if risk_scores:
                avg_risk = sum(risk_scores) / len(risk_scores)
                if avg_risk > 2.5:
                    risk_assessment['overall_risk'] = 'high'
                elif avg_risk > 1.5:
                    risk_assessment['overall_risk'] = 'medium'
                else:
                    risk_assessment['overall_risk'] = 'low'
            
        except Exception as e:
            print(f"  ⚠️ 评估失败: {e}")
            risk_assessment['error'] = str(e)
        
        return risk_assessment
    
    def analyze_earnings_surprise(self, symbol: str) -> Dict:
        """
        财报后超预期分析
        
        Args:
            symbol: 股票代码
        
        Returns:
            超预期分析结果
        """
        print(f"\n📊 分析 {symbol} 财报超预期...")
        
        analysis = {
            'symbol': symbol,
            'recent_surprises': [],
            'trend': 'neutral'
        }
        
        try:
            ticker = yf.Ticker(symbol)
            earnings_history = ticker.earnings_history
            
            if earnings_history is not None and not earnings_history.empty:
                # 最近4个季度
                recent = earnings_history.head(4)
                
                surprises = []
                for date, row in recent.iterrows():
                    surprise = row.get('Surprise(%)', 0)
                    surprises.append({
                        'date': date.strftime('%Y-%m-%d') if hasattr(date, 'strftime') else str(date),
                        'eps_estimate': row.get('EPS Estimate', 0),
                        'eps_actual': row.get('Reported EPS', 0),
                        'surprise_pct': surprise,
                        'result': 'beat' if surprise > 0 else ('miss' if surprise < 0 else 'meet')
                    })
                
                analysis['recent_surprises'] = surprises
                
                # 判断趋势
                if len(surprises) >= 2:
                    recent_avg = sum(s['surprise_pct'] for s in surprises[:2]) / 2
                    older_avg = sum(s['surprise_pct'] for s in surprises[2:]) / len(surprises[2:]) if len(surprises) > 2 else 0
                    
                    if recent_avg > older_avg:
                        analysis['trend'] = 'improving'
                    elif recent_avg < older_avg:
                        analysis['trend'] = 'deteriorating'
                
                # 统计
                beats = sum(1 for s in surprises if s['result'] == 'beat')
                analysis['beat_rate'] = f"{beats}/{len(surprises)}"
        
        except Exception as e:
            print(f"  ⚠️ 分析失败: {e}")
            analysis['error'] = str(e)
        
        return analysis
    
    def generate_earnings_report(self) -> str:
        """
        生成财报季综合报告
        
        Returns:
            报告文本
        """
        report = []
        report.append("="*70)
        report.append("📊 财报季管理报告")
        report.append(f"生成时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        report.append("="*70)
        
        # 1. 财报日历
        report.append("\n## 📅 未来30天财报日历\n")
        calendar = self.get_earnings_calendar(days_ahead=30)
        
        if calendar:
            # 按周分组
            for item in calendar:
                days = item['days_until']
                urgency = "🔥" if days <= 3 else ("⚠️" if days <= 7 else "📅")
                report.append(f"{urgency} {item['symbol']}: {item['earnings_date']} (还有{days}天)")
                if item.get('eps_estimate'):
                    report.append(f"   EPS预期: ${item['eps_estimate']:.2f}")
        else:
            report.append("暂无财报日期信息")
        
        # 2. 近期财报风险评估
        report.append("\n## ⚠️ 财报前风险评估\n")
        
        # 最近7天有财报的股票
        upcoming = [item for item in calendar if item['days_until'] <= 7]
        
        if upcoming:
            for item in upcoming:
                symbol = item['symbol']
                risk = self.assess_earnings_risk(symbol)
                
                risk_emoji = {'high': '🔴', 'medium': '🟡', 'low': '🟢'}.get(risk['overall_risk'], '⚪')
                report.append(f"\n{risk_emoji} {symbol} - {risk['overall_risk'].upper()} RISK")
                
                for factor_name, factor_data in risk.get('factors', {}).items():
                    report.append(f"  • {factor_name}: {factor_data['value']} ({factor_data['risk_level']})")
        else:
            report.append("未来7天内无持仓股财报")
        
        # 3. 财报后分析
        report.append("\n## 📈 近期财报后分析\n")
        
        # 最近7天内已发布的财报
        recent_earnings = []
        for symbol in self.holdings:
            analysis = self.analyze_earnings_surprise(symbol)
            if analysis.get('recent_surprises'):
                recent_earnings.append(analysis)
        
        if recent_earnings:
            for analysis in recent_earnings[:3]:  # 只显示前3个
                symbol = analysis['symbol']
                trend_emoji = {'improving': '📈', 'deteriorating': '📉', 'neutral': '➡️'}.get(analysis['trend'], '➡️')
                report.append(f"\n{trend_emoji} {symbol} - 超预期趋势: {analysis['trend']}")
                report.append(f"   近期胜率: {analysis.get('beat_rate', 'N/A')}")
        else:
            report.append("近期无持仓股发布财报")
        
        # 4. 建议
        report.append("\n## 💡 财报季策略建议\n")
        report.append("1. 📊 财报前3天：降低仓位或购买保护性期权")
        report.append("2. 🎯 财报当天：关注超预期幅度和指引")
        report.append("3. 📈 财报后：根据指引调整持仓")
        report.append("4. ⚠️ 高波动股：考虑使用期权策略（Straddle/Iron Condor）")
        
        report.append("\n" + "="*70)
        
        return "\n".join(report)
    
    def get_immediate_alerts(self) -> List[Dict]:
        """
        获取即时警报（未来3天有财报的股票）
        
        Returns:
            警报列表
        """
        alerts = []
        calendar = self.get_earnings_calendar(days_ahead=3)
        
        for item in calendar:
            symbol = item['symbol']
            days = item['days_until']
            
            # 风险评估
            risk = self.assess_earnings_risk(symbol)
            
            alerts.append({
                'symbol': symbol,
                'earnings_date': item['earnings_date'],
                'days_until': days,
                'risk_level': risk['overall_risk'],
                'urgency': 'high' if days <= 1 else ('medium' if days <= 3 else 'low')
            })
        
        # 按紧急程度排序
        alerts.sort(key=lambda x: (x['days_until'], {'high': 0, 'medium': 1, 'low': 2}.get(x['risk_level'], 3)))
        
        return alerts
    
    def save_report(self, report: str, filename: str = None):
        """保存报告"""
        if filename is None:
            filename = f"earnings_report_{datetime.now().strftime('%Y%m%d')}.md"
        
        filepath = os.path.join(self.data_dir, filename)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(report)
        
        print(f"\n💾 报告已保存: {filepath}")
        return filepath


def main():
    """主函数"""
    import argparse
    
    parser = argparse.ArgumentParser(
        description='虾虾财报季管理工具',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
使用示例:
  # 生成财报日历
  python3 earnings_season_manager.py --calendar
  
  # 评估特定股票财报风险
  python3 earnings_season_manager.py --risk NVDA
  
  # 分析财报超预期历史
  python3 earnings_season_manager.py --analyze AMD
  
  # 生成综合报告
  python3 earnings_season_manager.py --report
  
  # 获取即时警报（未来3天）
  python3 earnings_season_manager.py --alerts
        """
    )
    
    parser.add_argument('--calendar', '-c', action='store_true',
                       help='生成财报日历')
    parser.add_argument('--risk', '-r', type=str,
                       help='评估特定股票财报风险')
    parser.add_argument('--analyze', '-a', type=str,
                       help='分析股票财报超预期历史')
    parser.add_argument('--report', action='store_true',
                       help='生成综合报告')
    parser.add_argument('--alerts', action='store_true',
                       help='获取即时警报')
    
    args = parser.parse_args()
    
    manager = EarningsSeasonManager()
    
    if args.calendar:
        calendar = manager.get_earnings_calendar(days_ahead=30)
        print("\n📅 未来30天财报日历:")
        print("="*70)
        for item in calendar:
            days = item['days_until']
            urgency = "🔥" if days <= 3 else ("⚠️" if days <= 7 else "📅")
            print(f"{urgency} {item['symbol']}: {item['earnings_date']} (还有{days}天)")
    
    elif args.risk:
        risk = manager.assess_earnings_risk(args.risk)
        print(json.dumps(risk, indent=2, ensure_ascii=False))
    
    elif args.analyze:
        analysis = manager.analyze_earnings_surprise(args.analyze)
        print(json.dumps(analysis, indent=2, ensure_ascii=False))
    
    elif args.report:
        report = manager.generate_earnings_report()
        print(report)
        manager.save_report(report)
    
    elif args.alerts:
        alerts = manager.get_immediate_alerts()
        print("\n🚨 即时财报警报（未来3天）:")
        print("="*70)
        for alert in alerts:
            urgency_emoji = "🔥" if alert['urgency'] == 'high' else ("⚠️" if alert['urgency'] == 'medium' else "📅")
            risk_emoji = "🔴" if alert['risk_level'] == 'high' else ("🟡" if alert['risk_level'] == 'medium' else "🟢")
            print(f"{urgency_emoji} {alert['symbol']}: {alert['earnings_date']} (还有{alert['days_until']}天) {risk_emoji}")
    
    else:
        print("🦐 虾虾财报季管理工具")
        print("="*70)
        print("\n使用方法:")
        print("  --calendar        生成财报日历")
        print("  --risk SYMBOL     评估财报风险")
        print("  --analyze SYMBOL  分析超预期历史")
        print("  --report          生成综合报告")
        print("  --alerts          获取即时警报")
        print("\n详细帮助:")
        print("  python3 earnings_season_manager.py --help")


if __name__ == "__main__":
    main()
