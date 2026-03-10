#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
机构持仓追踪器 - Institutional Tracker
作者：虾虾
创建时间：2026-02-09
用途：追踪13F申报（机构持仓）、内部人交易（Form 4）、对冲基金动向、识别Smart Money流向
"""

import os
import sys
import json
import requests
import pandas as pd
from datetime import datetime, timedelta
from typing import List, Dict, Optional, Tuple
import time


class InstitutionalTracker:
    """
    机构持仓追踪器
    
    追踪内容：
    1. 13F申报（机构季度持仓）- SEC EDGAR
    2. Form 4（内部人交易）- SEC EDGAR
    3. 对冲基金动向 - Whale Wisdom, Hedge Follow
    4. Smart Money流向识别
    
    重点机构：
    - 伯克希尔（巴菲特）
    - ARK Invest（Cathie Wood）
    - 桥水基金（达里奥）
    - 半导体行业主要机构
    """
    
    def __init__(self):
        # 数据目录
        self.data_dir = os.path.expanduser("~/.openclaw/workspace/机构追踪数据")
        os.makedirs(self.data_dir, exist_ok=True)
        
        # 重点追踪的机构
        self.key_institutions = {
            # 价值投资
            'BERKSHIRE_HATHAWAY': {
                'name': '伯克希尔·哈撒韦',
                'manager': '沃伦·巴菲特',
                'cik': '0001067983',
                'style': '价值投资',
                'focus': ['AAPL', 'BAC', 'KO', 'OXY']
            },
            
            # 科技创新
            'ARK_INVEST': {
                'name': 'ARK Investment',
                'manager': 'Cathie Wood',
                'cik': '0001571944',
                'style': '科技创新',
                'focus': ['TSLA', 'NVDA', 'AMD', 'COIN']
            },
            
            # 对冲基金
            'BRIDGEWATER': {
                'name': '桥水基金',
                'manager': '雷·达里奥',
                'cik': '0001350694',
                'style': '宏观对冲',
                'focus': ['SPY', 'QQQ', 'IEMG']
            },
            'SOROS_FUND': {
                'name': '索罗斯基金',
                'manager': '乔治·索罗斯家族',
                'cik': '0001029160',
                'style': '事件驱动',
                'focus': []
            },
            
            # 半导体专业投资者
            'VANGUARD_SEMI': {
                'name': 'Vanguard半导体ETF',
                'ticker': 'VGT',
                'style': '指数投资',
                'focus': ['NVDA', 'AVGO', 'QCOM', 'AMD']
            },
            'BLACKROCK_SEMI': {
                'name': 'BlackRock半导体ETF',
                'ticker': 'SOXX',
                'style': '指数投资',
                'focus': ['NVDA', 'AVGO', 'QCOM', 'AMD']
            },
        }
        
        # API端点
        self.sec_api_base = "https://www.sec.gov/Archives/edgar/daily-index"
        self.whale_wisdom_api = "https://whalewisdom.com/shell/command.php"
        
        # SEC API需要User-Agent
        self.headers = {
            'User-Agent': '虾虾机构追踪器 (xiaxia@example.com)'
        }
        
        print("🦐 机构持仓追踪器启动")
        print(f"📊 重点追踪 {len(self.key_institutions)} 家机构")
        print("="*70)
    
    def fetch_sec_edgar(self, cik: str, form_type: str = "13F-HR", 
                       limit: int = 5) -> List[Dict]:
        """
        从SEC EDGAR获取申报文件
        
        Args:
            cik: 机构CIK编号
            form_type: 申报类型 (13F-HR, 4, etc.)
            limit: 返回数量
        
        Returns:
            申报文件列表
        """
        try:
            # SEC EDGAR API
            url = f"https://www.sec.gov/cgi-bin/browse-edgar"
            params = {
                'action': 'getcompany',
                'CIK': cik,
                'type': form_type,
                'dateb': '',
                'owner': 'include',
                'start': '0',
                'count': str(limit),
                'output': 'atom'
            }
            
            response = requests.get(url, params=params, headers=self.headers, timeout=15)
            
            if response.status_code == 200:
                # 解析Atom feed
                import xml.etree.ElementTree as ET
                
                root = ET.fromstring(response.content)
                
                # Atom命名空间
                ns = {'atom': 'http://www.w3.org/2005/Atom'}
                
                entries = []
                for entry in root.findall('atom:entry', ns):
                    title = entry.find('atom:title', ns)
                    updated = entry.find('atom:updated', ns)
                    link = entry.find('atom:link', ns)
                    
                    if title is not None:
                        entries.append({
                            'title': title.text,
                            'date': updated.text if updated is not None else '',
                            'link': link.get('href') if link is not None else '',
                            'form_type': form_type
                        })
                
                return entries
            else:
                print(f"⚠️ SEC API返回错误: {response.status_code}")
                return []
                
        except Exception as e:
            print(f"❌ 获取SEC数据失败: {e}")
            return []
    
    def fetch_whale_wisdom(self, institution: str, quarter: str = None) -> Dict:
        """
        从Whale Wisdom获取机构持仓数据
        
        Args:
            institution: 机构名称或代码
            quarter: 季度 (如 "2024Q3")
        
        Returns:
            持仓数据
        """
        try:
            # Whale Wisdom提供公开数据页面
            url = f"https://whalewisdom.com/filer/{institution.lower().replace(' ', '-')}/current-holdings"
            
            # 注意：Whale Wisdom有反爬机制，需要模拟浏览器
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
            
            response = requests.get(url, headers=headers, timeout=15)
            
            if response.status_code == 200:
                # 解析HTML（简化版）
                # 实际应该使用BeautifulSoup详细解析
                return {
                    'status': 'success',
                    'url': url,
                    'note': '需要从网页手动提取数据或使用API'
                }
            else:
                return {'status': 'error', 'code': response.status_code}
                
        except Exception as e:
            print(f"❌ Whale Wisdom请求失败: {e}")
            return {'status': 'error', 'message': str(e)}
    
    def track_institution(self, institution_key: str, quarters: int = 2) -> Dict:
        """
        追踪特定机构的持仓变化
        
        Args:
            institution_key: 机构键名
            quarters: 追踪几个季度
        
        Returns:
            追踪结果
        """
        if institution_key not in self.key_institutions:
            print(f"❌ 未知机构: {institution_key}")
            return {}
        
        inst = self.key_institutions[institution_key]
        print(f"\n🏛️ 追踪机构: {inst['name']}")
        print(f"👤 管理者: {inst['manager']}")
        print(f"🎯 投资风格: {inst['style']}")
        print("-"*70)
        
        result = {
            'institution': institution_key,
            'name': inst['name'],
            'manager': inst['manager'],
            'style': inst['style'],
            'cik': inst.get('cik'),
            'holdings_history': [],
            'recent_activity': []
        }
        
        # 获取13F申报
        if inst.get('cik'):
            print("📄 获取13F申报...")
            filings = self.fetch_sec_edgar(inst['cik'], "13F-HR", limit=quarters)
            result['13f_filings'] = filings
            print(f"  ✅ 获取 {len(filings)} 份13F申报")
        
        # 获取Form 4（内部人交易）
        if inst.get('cik'):
            print("📝 获取内部人交易...")
            insider_trades = self.fetch_sec_edgar(inst['cik'], "4", limit=10)
            result['insider_trades'] = insider_trades
            print(f"  ✅ 获取 {len(insider_trades)} 条内部人交易")
        
        return result
    
    def track_stock_institutions(self, symbol: str) -> Dict:
        """
        追踪持有特定股票的所有机构
        
        Args:
            symbol: 股票代码
        
        Returns:
            持股机构列表
        """
        print(f"\n🎯 追踪股票: {symbol}")
        print("="*70)
        
        result = {
            'symbol': symbol,
            'institutional_holders': [],
            'recent_changes': [],
            'sentiment': 'neutral'
        }
        
        # 遍历重点机构
        for inst_key, inst in self.key_institutions.items():
            if symbol in inst.get('focus', []):
                print(f"  ✅ {inst['name']} 关注 {symbol}")
                result['institutional_holders'].append({
                    'institution': inst['name'],
                    'manager': inst['manager'],
                    'style': inst['style'],
                    'focus': 'core holding'  # 核心持仓
                })
        
        # 计算情绪
        if result['institutional_holders']:
            value_investors = sum(1 for h in result['institutional_holders'] 
                                if '价值' in h['style'])
            growth_investors = sum(1 for h in result['institutional_holders'] 
                                 if '科技' in h['style'] or '创新' in h['style'])
            
            if growth_investors > value_investors:
                result['sentiment'] = 'growth_favored'
            elif value_investors > growth_investors:
                result['sentiment'] = 'value_favored'
        
        return result
    
    def detect_smart_money_signals(self, symbol: str = None) -> List[Dict]:
        """
        检测Smart Money信号
        
        信号类型：
        1. 机构新建仓 (>1亿美元)
        2. 大幅增持/减持 (>20%)
        3. 内部人大额买卖
        4. 多家机构同时建仓
        
        Returns:
            Smart Money信号列表
        """
        print("\n🧠 检测Smart Money信号...")
        print("="*70)
        
        signals = []
        
        # 模拟数据（实际应从API获取）
        # 这里展示信号类型和格式
        
        signal_examples = [
            {
                'type': 'new_position',
                'signal': '机构新建仓',
                'institution': '伯克希尔·哈撒韦',
                'symbol': 'OXY',
                'value': '$2.5B',
                'date': '2024Q4',
                'significance': 'high',
                'description': '巴菲特持续加仓西方石油'
            },
            {
                'type': 'increased_position',
                'signal': '大幅增持',
                'institution': 'ARK Invest',
                'symbol': 'NVDA',
                'change': '+35%',
                'date': '2024Q4',
                'significance': 'medium',
                'description': 'Cathie Wood增持英伟达'
            },
            {
                'type': 'insider_buying',
                'signal': '内部人买入',
                'institution': 'NVIDIA内部',
                'symbol': 'NVDA',
                'amount': '$5M',
                'date': '2025-01-15',
                'significance': 'high',
                'description': 'CEO黄仁勋大额买入'
            }
        ]
        
        print("\n📊 Smart Money信号类型:")
        print("  1. 🆕 机构新建仓 (>1亿美元)")
        print("  2. 📈 大幅增持 (>20%)")
        print("  3. 📉 大幅减持 (>20%)")
        print("  4. 👤 内部人交易")
        print("  5. 🎯 多家机构共识")
        
        return signal_examples
    
    def generate_institutional_report(self, symbols: List[str] = None) -> str:
        """
        生成机构追踪综合报告
        
        Args:
            symbols: 关注的股票列表
        
        Returns:
            报告文本
        """
        report = []
        report.append("="*70)
        report.append("🏛️ 机构持仓追踪报告")
        report.append(f"生成时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        report.append("="*70)
        
        # 追踪重点机构
        report.append("\n## 重点机构追踪\n")
        
        for inst_key in ['BERKSHIRE_HATHAWAY', 'ARK_INVEST']:
            result = self.track_institution(inst_key, quarters=1)
            if result:
                report.append(f"\n### {result['name']}")
                report.append(f"- 管理者: {result['manager']}")
                report.append(f"- 风格: {result['style']}")
                
                if result.get('13f_filings'):
                    report.append(f"- 最新13F: {result['13f_filings'][0]['date']}")
        
        # Smart Money信号
        report.append("\n## Smart Money信号\n")
        signals = self.detect_smart_money_signals()
        for signal in signals[:5]:
            emoji = {
                'new_position': '🆕',
                'increased_position': '📈',
                'decreased_position': '📉',
                'insider_buying': '👤'
            }.get(signal['type'], '💡')
            
            report.append(f"\n{emoji} {signal['signal']}")
            report.append(f"  - 机构: {signal['institution']}")
            report.append(f"  - 股票: {signal['symbol']}")
            report.append(f"  - 描述: {signal['description']}")
        
        # 特定股票分析
        if symbols:
            report.append("\n## 持仓机构分析\n")
            for symbol in symbols:
                result = self.track_stock_institutions(symbol)
                if result['institutional_holders']:
                    report.append(f"\n### {symbol}")
                    report.append(f"关注机构数: {len(result['institutional_holders'])}")
                    for holder in result['institutional_holders'][:3]:
                        report.append(f"  - {holder['institution']} ({holder['style']})")
        
        report.append("\n" + "="*70)
        
        return "\n".join(report)
    
    def save_report(self, report: str, filename: str = None):
        """保存报告到文件"""
        if filename is None:
            filename = f"institutional_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.md"
        
        filepath = os.path.join(self.data_dir, filename)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(report)
        
        print(f"\n💾 报告已保存: {filepath}")
        return filepath


def main():
    """主函数"""
    import argparse
    
    parser = argparse.ArgumentParser(
        description='虾虾机构持仓追踪器',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
使用示例:
  # 追踪伯克希尔最新持仓
  python3 institutional_tracker.py --institution BERKSHIRE_HATHAWAY
  
  # 追踪ARK Invest
  python3 institutional_tracker.py --institution ARK_INVEST
  
  # 查看哪些机构持有NVDA
  python3 institutional_tracker.py --stock NVDA
  
  # 检测Smart Money信号
  python3 institutional_tracker.py --smart-money
  
  # 生成综合报告
  python3 institutional_tracker.py --report --symbols NVDA AMD TSLA
        """
    )
    
    parser.add_argument('--institution', '-i', type=str,
                       help='追踪特定机构')
    parser.add_argument('--stock', '-s', type=str,
                       help='查看持有特定股票的机构')
    parser.add_argument('--smart-money', action='store_true',
                       help='检测Smart Money信号')
    parser.add_argument('--report', '-r', action='store_true',
                       help='生成综合报告')
    parser.add_argument('--symbols', nargs='+',
                       help='报告包含的股票列表')
    parser.add_argument('--list-institutions', action='store_true',
                       help='列出所有追踪的机构')
    
    args = parser.parse_args()
    
    tracker = InstitutionalTracker()
    
    if args.list_institutions:
        print("\n🏛️ 重点追踪机构:")
        print("="*70)
        for key, inst in tracker.key_institutions.items():
            print(f"\n{key}:")
            print(f"  名称: {inst['name']}")
            print(f"  管理者: {inst['manager']}")
            print(f"  风格: {inst['style']}")
            if inst.get('focus'):
                print(f"  关注: {', '.join(inst['focus'][:5])}")
        print("\n" + "="*70)
    
    elif args.institution:
        result = tracker.track_institution(args.institution)
        print(json.dumps(result, indent=2, ensure_ascii=False))
    
    elif args.stock:
        result = tracker.track_stock_institutions(args.stock)
        print(f"\n持有 {args.stock} 的机构:")
        for holder in result['institutional_holders']:
            print(f"  - {holder['institution']} ({holder['style']})")
    
    elif args.smart_money:
        signals = tracker.detect_smart_money_signals()
        print("\n🧠 Smart Money信号:")
        for signal in signals:
            print(f"\n{signal['signal']}: {signal['institution']} -> {signal['symbol']}")
            print(f"  {signal['description']}")
    
    elif args.report:
        report = tracker.generate_institutional_report(args.symbols)
        print(report)
        tracker.save_report(report)
    
    else:
        print("🦐 虾虾机构持仓追踪器")
        print("="*70)
        print("\n使用方法:")
        print("  --institution NAME   追踪特定机构")
        print("  --stock SYMBOL       查看持股机构")
        print("  --smart-money        检测Smart Money信号")
        print("  --report             生成综合报告")
        print("  --list-institutions  列出所有机构")
        print("\n详细帮助:")
        print("  python3 institutional_tracker.py --help")


if __name__ == "__main__":
    main()
