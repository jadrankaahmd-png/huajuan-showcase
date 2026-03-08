#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
宏观经济日历 - Macro Economic Calendar
作者：虾虾
创建时间：2026-02-09
用途：美联储利率决议提醒、CPI/PPI/就业数据日历、影响评估（对半导体/AI的影响）
"""

import os
import sys
import json
import requests
from datetime import datetime, timedelta
from typing import List, Dict, Optional, Tuple
import calendar


class MacroCalendar:
    """
    宏观经济日历
    
    功能：
    1. 美联储利率决议提醒
    2. CPI/PPI/就业数据日历
    3. 重要经济数据追踪
    4. 影响评估（对半导体/AI的影响）
    5. 生成宏观事件提醒
    
    为什么重要：
    - 宏观数据影响整体市场情绪
    - 利率决议影响估值模型
    - 通胀数据影响成长股定价
    - 半导体/AI股对利率敏感
    """
    
    def __init__(self):
        # 数据目录
        self.data_dir = os.path.expanduser("~/.openclaw/workspace/宏观数据")
        os.makedirs(self.data_dir, exist_ok=True)
        
        # FOMC 2026年会议日程（预计）
        self.fomc_meetings_2026 = [
            {'date': '2026-01-28', 'type': '会议声明'},
            {'date': '2026-03-18', 'type': '利率决议+发布会'},
            {'date': '2026-05-06', 'type': '会议声明'},
            {'date': '2026-06-17', 'type': '利率决议+发布会'},
            {'date': '2026-07-29', 'type': '会议声明'},
            {'date': '2026-09-16', 'type': '利率决议+发布会'},
            {'date': '2026-11-04', 'type': '会议声明'},
            {'date': '2026-12-16', 'type': '利率决议+发布会'},
        ]
        
        # 重要经济数据发布日（每月）
        self.monthly_indicators = {
            'CPI': {
                'name': '消费者价格指数',
                'description': '通胀核心指标',
                'release_day': '每月中旬',
                'impact': 'high',
                'affects': ['科技股', '成长股']
            },
            'PPI': {
                'name': '生产者价格指数',
                'description': '生产端通胀',
                'release_day': '每月中旬',
                'impact': 'medium',
                'affects': ['制造业']
            },
            'Nonfarm_Payrolls': {
                'name': '非农就业数据',
                'description': '劳动力市场',
                'release_day': '每月第一个周五',
                'impact': 'high',
                'affects': ['全市场']
            },
            'Unemployment_Rate': {
                'name': '失业率',
                'description': '就业状况',
                'release_day': '每月第一个周五',
                'impact': 'high',
                'affects': ['全市场']
            },
            'GDP': {
                'name': 'GDP',
                'description': '经济增长',
                'release_day': '每季度末',
                'impact': 'high',
                'affects': ['全市场']
            },
            'Retail_Sales': {
                'name': '零售销售',
                'description': '消费状况',
                'release_day': '每月中旬',
                'impact': 'medium',
                'affects': ['消费股']
            },
            'Industrial_Production': {
                'name': '工业生产',
                'description': '制造业活动',
                'release_day': '每月中旬',
                'impact': 'medium',
                'affects': ['工业股', '半导体']
            }
        }
        
        print("🦐 宏观经济日历启动")
        print("📊 监控美联储会议+重要经济数据")
        print("="*70)
    
    def get_upcoming_fomc(self, days_ahead: int = 90) -> List[Dict]:
        """
        获取未来FOMC会议
        
        Args:
            days_ahead: 提前多少天
        
        Returns:
            FOMC会议列表
        """
        today = datetime.now()
        cutoff = today + timedelta(days=days_ahead)
        
        upcoming = []
        for meeting in self.fomc_meetings_2026:
            meeting_date = datetime.strptime(meeting['date'], '%Y-%m-%d')
            if today <= meeting_date <= cutoff:
                days_until = (meeting_date - today).days
                
                upcoming.append({
                    'date': meeting['date'],
                    'type': meeting['type'],
                    'days_until': days_until,
                    'urgency': 'high' if days_until <= 7 else ('medium' if days_until <= 30 else 'low')
                })
        
        return upcoming
    
    def get_next_nfp_date(self) -> Dict:
        """
        获取下次非农就业数据发布日期
        
        Returns:
            NFP发布信息
        """
        today = datetime.now()
        
        # 找到下个月第一个周五
        if today.month == 12:
            next_month = 1
            next_year = today.year + 1
        else:
            next_month = today.month + 1
            next_year = today.year
        
        # 获取下个月第一天是星期几
        first_day = datetime(next_year, next_month, 1)
        first_friday = first_day + timedelta(days=(4 - first_day.weekday() + 7) % 7)
        
        days_until = (first_friday - today).days
        
        return {
            'date': first_friday.strftime('%Y-%m-%d'),
            'indicator': 'Nonfarm Payrolls',
            'days_until': days_until,
            'urgency': 'high' if days_until <= 3 else 'medium'
        }
    
    def get_economic_calendar(self, days_ahead: int = 30) -> List[Dict]:
        """
        获取未来经济数据日历
        
        Args:
            days_ahead: 提前多少天
        
        Returns:
            经济事件列表
        """
        today = datetime.now()
        events = []
        
        # 添加FOMC会议
        fomc_meetings = self.get_upcoming_fomc(days_ahead)
        for meeting in fomc_meetings:
            events.append({
                'date': meeting['date'],
                'event': f"FOMC {meeting['type']}",
                'category': '货币政策',
                'impact': 'high',
                'days_until': meeting['days_until'],
                'urgency': meeting['urgency']
            })
        
        # 添加NFP
        nfp = self.get_next_nfp_date()
        if nfp['days_until'] <= days_ahead:
            events.append({
                'date': nfp['date'],
                'event': '非农就业数据',
                'category': '就业',
                'impact': 'high',
                'days_until': nfp['days_until'],
                'urgency': nfp['urgency']
            })
        
        # 添加CPI（每月15日左右）
        for i in range(3):  # 未来3个月
            if today.month + i > 12:
                cpi_month = today.month + i - 12
                cpi_year = today.year + 1
            else:
                cpi_month = today.month + i
                cpi_year = today.year
            
            cpi_date = datetime(cpi_year, cpi_month, 15)
            days_until = (cpi_date - today).days
            
            if 0 <= days_until <= days_ahead:
                events.append({
                    'date': cpi_date.strftime('%Y-%m-%d'),
                    'event': 'CPI通胀数据',
                    'category': '通胀',
                    'impact': 'high',
                    'days_until': days_until,
                    'urgency': 'high' if days_until <= 3 else 'medium'
                })
        
        # 按日期排序
        events.sort(key=lambda x: x['days_until'])
        
        return events
    
    def assess_macro_impact(self, event_type: str) -> Dict:
        """
        评估宏观事件对半导体/AI股的影响
        
        Args:
            event_type: 事件类型
        
        Returns:
            影响评估
        """
        impact_map = {
            'FOMC 利率决议+发布会': {
                'impact_level': '极高',
                'mechanism': '利率变化影响估值模型折现率',
                'semiconductor_impact': '高 - 成长股对利率敏感',
                'ai_impact': '高 - 长期现金流折现敏感',
                'typical_reaction': {
                    '加息': '成长股下跌，价值股相对抗跌',
                    '降息': '成长股上涨，估值扩张',
                    '维持': '取决于前瞻指引'
                }
            },
            'CPI通胀数据': {
                'impact_level': '高',
                'mechanism': '通胀影响实际利率和Fed政策预期',
                'semiconductor_impact': '中高 - 成本端和利率双重影响',
                'ai_impact': '中高 - 资金成本敏感',
                'typical_reaction': {
                    '超预期': '紧缩预期升温，科技股承压',
                    '低于预期': '宽松预期，科技股受益'
                }
            },
            '非农就业数据': {
                'impact_level': '高',
                'mechanism': '就业强劲=经济好=加息可能',
                'semiconductor_impact': '中等 - 经济景气度相关',
                'ai_impact': '中等 - 资本支出预期相关',
                'typical_reaction': {
                    '强劲': '紧缩担忧，科技股回调',
                    '疲软': '宽松预期，科技股上涨'
                }
            },
            'GDP': {
                'impact_level': '中等',
                'mechanism': '经济增长预期',
                'semiconductor_impact': '中等 - 周期股属性',
                'ai_impact': '低 - 长期增长相对独立',
                'typical_reaction': {
                    '超预期': '周期性上涨',
                    '低于预期': '避险需求'
                }
            }
        }
        
        return impact_map.get(event_type, {
            'impact_level': '未知',
            'mechanism': '未定义'
        })
    
    def get_immediate_alerts(self) -> List[Dict]:
        """
        获取即时警报（未来3天的重要事件）
        
        Returns:
            警报列表
        """
        events = self.get_economic_calendar(days_ahead=3)
        
        alerts = []
        for event in events:
            if event['impact'] == 'high':
                impact_assessment = self.assess_macro_impact(event['event'])
                
                alerts.append({
                    'date': event['date'],
                    'event': event['event'],
                    'days_until': event['days_until'],
                    'urgency': event['urgency'],
                    'impact_level': impact_assessment.get('impact_level', '未知'),
                    'ai_semiconductor_impact': impact_assessment.get('ai_impact', '未知')
                })
        
        return alerts
    
    def generate_macro_report(self) -> str:
        """
        生成宏观日历报告
        
        Returns:
            报告文本
        """
        report = []
        report.append("="*70)
        report.append("🌍 宏观经济日历报告")
        report.append(f"生成时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        report.append("="*70)
        
        # 1. 未来30天重要事件
        report.append("\n## 📅 未来30天重要宏观事件\n")
        
        events = self.get_economic_calendar(days_ahead=30)
        
        for event in events:
            urgency_emoji = "🔥" if event['urgency'] == 'high' else ("⚠️" if event['urgency'] == 'medium' else "📅")
            impact_emoji = "🔴" if event['impact'] == 'high' else "🟡"
            
            report.append(f"{urgency_emoji} {event['date']} ({event['days_until']}天后)")
            report.append(f"   {impact_emoji} {event['event']}")
            report.append(f"   类别: {event['category']}")
            
            # 添加影响评估
            impact = self.assess_macro_impact(event['event'])
            if impact.get('ai_impact'):
                report.append(f"   AI/半导体影响: {impact['ai_impact']}")
            report.append("")
        
        # 2. FOMC会议详情
        report.append("\n## 🏦 FOMC会议日程（2026年）\n")
        
        fomc = self.get_upcoming_fomc(days_ahead=365)
        for meeting in fomc[:4]:  # 显示接下来4次
            emoji = "🔥" if meeting['urgency'] == 'high' else "📅"
            report.append(f"{emoji} {meeting['date']} - {meeting['type']}")
            if meeting['days_until'] <= 30:
                report.append(f"   还有 {meeting['days_until']} 天")
        
        # 3. 即时警报
        report.append("\n## 🚨 即时宏观警报（未来3天）\n")
        
        alerts = self.get_immediate_alerts()
        if alerts:
            for alert in alerts:
                report.append(f"🔥 {alert['date']} - {alert['event']}")
                report.append(f"   还有 {alert['days_until']} 天")
                report.append(f"   AI/半导体影响: {alert['ai_semiconductor_impact']}")
                report.append("")
        else:
            report.append("未来3天无高影响宏观事件")
        
        # 4. 宏观投资策略
        report.append("\n## 💡 宏观事件投资策略\n")
        
        report.append("### 美联储利率决议应对:\n")
        report.append("• 加息前1周: 降低成长股仓位，增加现金")
        report.append("• 加息当天: 关注前瞻指引措辞")
        report.append("• 加息后: 若措辞鸽派，逢低买入优质成长股\n")
        
        report.append("### CPI数据应对:\n")
        report.append("• 通胀超预期: 减持科技股，关注实际利率")
        report.append("• 通胀低于预期: 加仓成长股，估值扩张\n")
        
        report.append("### 非农数据应对:\n")
        report.append("• 就业强劲: 关注紧缩预期对科技股影响")
        report.append("• 就业疲软: 宽松预期，成长股受益\n")
        
        report.append("### 半导体/AI股特别提示:\n")
        report.append("• 高利率环境: 压缩估值，关注基本面")
        report.append("• 低利率环境: 估值扩张，把握上涨")
        report.append("• 数据发布前: 考虑降低仓位或对冲")
        
        report.append("\n" + "="*70)
        
        return "\n".join(report)
    
    def save_report(self, report: str, filename: str = None):
        """保存报告"""
        if filename is None:
            filename = f"macro_calendar_{datetime.now().strftime('%Y%m%d')}.md"
        
        filepath = os.path.join(self.data_dir, filename)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(report)
        
        print(f"\n💾 报告已保存: {filepath}")
        return filepath


def main():
    """主函数"""
    import argparse
    
    parser = argparse.ArgumentParser(
        description='虾虾宏观经济日历',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
使用示例:
  # 查看FOMC会议
  python3 macro_calendar.py --fomc
  
  # 获取经济数据日历
  python3 macro_calendar.py --calendar
  
  # 查看即时警报
  python3 macro_calendar.py --alerts
  
  # 评估事件影响
  python3 macro_calendar.py --impact "CPI通胀数据"
  
  # 生成综合报告
  python3 macro_calendar.py --report
        """
    )
    
    parser.add_argument('--fomc', action='store_true',
                       help='查看FOMC会议日程')
    parser.add_argument('--calendar', '-c', action='store_true',
                       help='获取经济数据日历')
    parser.add_argument('--alerts', '-a', action='store_true',
                       help='获取即时警报')
    parser.add_argument('--impact', type=str,
                       help='评估特定事件影响')
    parser.add_argument('--report', '-r', action='store_true',
                       help='生成综合报告')
    
    args = parser.parse_args()
    
    macro = MacroCalendar()
    
    if args.fomc:
        fomc = macro.get_upcoming_fomc(days_ahead=365)
        print("\n🏦 FOMC会议日程（2026年）:")
        print("="*70)
        for meeting in fomc:
            print(f"📅 {meeting['date']} - {meeting['type']}")
    
    elif args.calendar:
        events = macro.get_economic_calendar(days_ahead=30)
        print("\n📅 未来30天经济事件:")
        print("="*70)
        for event in events:
            emoji = "🔥" if event['urgency'] == 'high' else "📅"
            print(f"{emoji} {event['date']} - {event['event']} ({event['days_until']}天)")
    
    elif args.alerts:
        alerts = macro.get_immediate_alerts()
        print("\n🚨 即时宏观警报:")
        print("="*70)
        if alerts:
            for alert in alerts:
                print(f"🔥 {alert['date']} - {alert['event']}")
                print(f"   影响: {alert['ai_semiconductor_impact']}")
        else:
            print("未来3天无高影响事件")
    
    elif args.impact:
        impact = macro.assess_macro_impact(args.impact)
        print(json.dumps(impact, indent=2, ensure_ascii=False))
    
    elif args.report:
        report = macro.generate_macro_report()
        print(report)
        macro.save_report(report)
    
    else:
        print("🦐 虾虾宏观经济日历")
        print("="*70)
        print("\n使用方法:")
        print("  --fomc            查看FOMC会议")
        print("  --calendar        获取经济日历")
        print("  --alerts          获取即时警报")
        print("  --impact EVENT    评估事件影响")
        print("  --report          生成综合报告")
        print("\n详细帮助:")
        print("  python3 macro_calendar.py --help")


if __name__ == "__main__":
    main()
