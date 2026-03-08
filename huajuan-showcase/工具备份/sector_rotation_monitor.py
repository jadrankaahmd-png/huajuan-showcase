#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
行业轮动监控器 - Sector Rotation Monitor
作者：虾虾
创建时间：2026-02-09
用途：监控半导体/软件/AI行业资金流向、识别板块轮动信号、相对强弱分析（RS）
"""

import os
import sys
import json
import yfinance as yf
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from typing import List, Dict, Optional, Tuple


class SectorRotationMonitor:
    """
    行业轮动监控器
    
    功能：
    1. 监控半导体/软件/AI行业资金流向
    2. 识别板块轮动信号
    3. 相对强弱分析（RS）
    4. 生成轮动热力图
    """
    
    def __init__(self):
        # 行业ETF定义
        self.sectors = {
            # 半导体
            'semiconductors': {
                'name': '半导体',
                'etfs': ['SMH', 'SOXX', 'PSI'],
                'stocks': ['NVDA', 'AMD', 'AVGO', 'QCOM', 'MU', 'SMCI', 'INTC'],
                'weight': 0.4  # 在组合中的权重
            },
            
            # 软件/AI
            'software_ai': {
                'name': '软件/AI',
                'etfs': ['IGV', 'SKYY', 'BOTZ'],
                'stocks': ['MSFT', 'GOOGL', 'META', 'AMZN', 'NFLX', 'CRM'],
                'weight': 0.3
            },
            
            # 硬件/科技
            'hardware_tech': {
                'name': '硬件/科技',
                'etfs': ['XLK', 'VGT'],
                'stocks': ['AAPL', 'TSLA', 'DELL', 'HPQ', 'STX'],
                'weight': 0.2
            },
            
            # 通信/云计算
            'cloud_communication': {
                'name': '云计算/通信',
                'etfs': ['XLC', 'WCLD'],
                'stocks': ['CRM', 'NOW', 'TEAM', 'ZM', 'NET'],
                'weight': 0.1
            }
        }
        
        # 基准指数
        self.benchmarks = {
            'SPY': '标普500',
            'QQQ': '纳斯达克100',
            'IWM': '罗素2000'
        }
        
        # 数据目录
        self.data_dir = os.path.expanduser("~/.openclaw/workspace/行业轮动数据")
        os.makedirs(self.data_dir, exist_ok=True)
        
        print("🦐 行业轮动监控器启动")
        print(f"📊 监控 {len(self.sectors)} 个行业板块")
        print("="*70)
    
    def get_sector_performance(self, period: str = "1mo") -> Dict:
        """
        获取各行业板块表现
        
        Args:
            period: 时间周期 (1d, 5d, 1mo, 3mo, 6mo, 1y)
        
        Returns:
            各板块表现数据
        """
        print(f"\n📈 计算板块表现 ({period})...")
        
        performance = {}
        
        for sector_key, sector_info in self.sectors.items():
            print(f"  分析 {sector_info['name']}...")
            
            # 使用ETF代表板块表现
            etf = sector_info['etfs'][0]  # 使用第一个ETF
            
            try:
                ticker = yf.Ticker(etf)
                hist = ticker.history(period=period)
                
                if not hist.empty:
                    # 计算收益率
                    start_price = hist['Close'].iloc[0]
                    end_price = hist['Close'].iloc[-1]
                    return_pct = (end_price - start_price) / start_price
                    
                    # 计算波动率
                    volatility = hist['Close'].pct_change().std() * np.sqrt(252)
                    
                    performance[sector_key] = {
                        'name': sector_info['name'],
                        'etf': etf,
                        'return_1d': None,  # 需要单独计算
                        'return_1w': None,
                        'return_1m': None,
                        'return_3m': None,
                        'volatility': volatility,
                        'current_price': end_price,
                        'data': hist
                    }
                    
                    # 根据不同周期填充
                    if period == "1d":
                        performance[sector_key]['return_1d'] = return_pct
                    elif period == "5d":
                        performance[sector_key]['return_1w'] = return_pct
                    elif period == "1mo":
                        performance[sector_key]['return_1m'] = return_pct
                    elif period == "3mo":
                        performance[sector_key]['return_3m'] = return_pct
                
            except Exception as e:
                print(f"    ⚠️ 获取{etf}数据失败: {e}")
        
        return performance
    
    def calculate_relative_strength(self, sector: str, 
                                   benchmark: str = "SPY",
                                   period: str = "3mo") -> Dict:
        """
        计算相对强弱（RS）
        
        RS = 板块收益率 / 基准收益率
        RS > 1: 板块强于大盘
        RS < 1: 板块弱于大盘
        
        Args:
            sector: 板块代码
            benchmark: 基准指数
            period: 时间周期
        
        Returns:
            RS分析结果
        """
        try:
            # 获取板块ETF
            sector_etf = self.sectors[sector]['etfs'][0]
            
            # 获取数据
            sector_ticker = yf.Ticker(sector_etf)
            benchmark_ticker = yf.Ticker(benchmark)
            
            sector_hist = sector_ticker.history(period=period)
            benchmark_hist = benchmark_ticker.history(period=period)
            
            if sector_hist.empty or benchmark_hist.empty:
                return None
            
            # 计算收益率
            sector_return = (sector_hist['Close'].iloc[-1] - sector_hist['Close'].iloc[0]) / sector_hist['Close'].iloc[0]
            benchmark_return = (benchmark_hist['Close'].iloc[-1] - benchmark_hist['Close'].iloc[0]) / benchmark_hist['Close'].iloc[0]
            
            # 计算RS
            if benchmark_return != 0:
                rs_ratio = sector_return / benchmark_return
            else:
                rs_ratio = 1.0
            
            # 计算RS移动平均线
            sector_hist['RS'] = sector_hist['Close'] / benchmark_hist['Close']
            rs_ma20 = sector_hist['RS'].rolling(20).mean().iloc[-1]
            rs_current = sector_hist['RS'].iloc[-1]
            
            # RS趋势
            rs_trend = "up" if rs_current > rs_ma20 else "down"
            
            return {
                'sector': sector,
                'sector_name': self.sectors[sector]['name'],
                'benchmark': benchmark,
                'period': period,
                'sector_return': sector_return,
                'benchmark_return': benchmark_return,
                'rs_ratio': rs_ratio,
                'rs_current': rs_current,
                'rs_ma20': rs_ma20,
                'rs_trend': rs_trend,
                'strength': 'strong' if rs_ratio > 1.1 else ('weak' if rs_ratio < 0.9 else 'neutral')
            }
            
        except Exception as e:
            print(f"  ❌ 计算RS失败: {e}")
            return None
    
    def detect_rotation_signals(self) -> List[Dict]:
        """
        检测板块轮动信号
        
        信号类型：
        1. 动量突破：板块突破20日/50日均线
        2. RS改善：RS从下行转为上行
        3. 资金流入：成交量放大 + 价格上涨
        4. 相对强弱反转：从弱于大盘转为强于大盘
        
        Returns:
            轮动信号列表
        """
        print("\n🔄 检测板块轮动信号...")
        
        signals = []
        
        for sector_key in self.sectors.keys():
            # 计算RS
            rs_data = self.calculate_relative_strength(sector_key, period="1mo")
            
            if not rs_data:
                continue
            
            # 信号1: RS改善
            if rs_data['rs_trend'] == 'up' and rs_data['strength'] == 'strong':
                signals.append({
                    'type': 'rs_improvement',
                    'sector': rs_data['sector_name'],
                    'signal': 'RS改善',
                    'description': f"{rs_data['sector_name']}相对强弱改善，强于大盘",
                    'strength': 'strong',
                    'data': rs_data
                })
            
            # 信号2: 相对强弱反转（从弱转强）
            # 简化版：需要历史数据对比
            if rs_data['rs_ratio'] > 1.05:
                signals.append({
                    'type': 'strength_reversal',
                    'sector': rs_data['sector_name'],
                    'signal': '相对强势',
                    'description': f"{rs_data['sector_name']}开始跑赢大盘",
                    'strength': 'medium',
                    'data': rs_data
                })
        
        # 按信号强度排序
        strength_order = {'strong': 0, 'medium': 1, 'weak': 2}
        signals.sort(key=lambda x: strength_order.get(x['strength'], 3))
        
        return signals
    
    def generate_rotation_report(self) -> str:
        """
        生成行业轮动报告
        
        Returns:
            报告文本
        """
        report = []
        report.append("="*70)
        report.append("🔄 行业轮动监控报告")
        report.append(f"生成时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        report.append("="*70)
        
        # 1. 板块表现（多时间周期）
        report.append("\n## 📊 板块表现对比\n")
        
        periods = [
            ('1d', '1日'),
            ('5d', '1周'),
            ('1mo', '1月'),
            ('3mo', '3月')
        ]
        
        for period_code, period_name in periods:
            performance = self.get_sector_performance(period=period_code)
            
            if performance:
                report.append(f"\n### {period_name}收益率")
                
                # 排序
                sorted_perf = sorted(
                    performance.items(),
                    key=lambda x: x[1].get(f'return_{period_code}', 0) or 0,
                    reverse=True
                )
                
                for sector_key, data in sorted_perf:
                    return_val = data.get(f'return_{period_code}', 0) or 0
                    emoji = "🟢" if return_val > 0 else "🔴"
                    report.append(f"{emoji} {data['name']}: {return_val*100:+.2f}%")
        
        # 2. 相对强弱分析
        report.append("\n## 📈 相对强弱分析 (RS)\n")
        report.append("相对于标普500的表现:\n")
        
        for sector_key in self.sectors.keys():
            rs_data = self.calculate_relative_strength(sector_key, period="1mo")
            
            if rs_data:
                rs_emoji = "📈" if rs_data['rs_trend'] == 'up' else "📉"
                strength_emoji = {"strong": "💪", "neutral": "➡️", "weak": "😰"}.get(rs_data['strength'], "➡️")
                report.append(f"{rs_emoji} {rs_data['sector_name']}: {strength_emoji} "
                            f"RS={rs_data['rs_ratio']:.2f} (趋势: {rs_data['rs_trend']})")
        
        # 3. 轮动信号
        report.append("\n## 🚨 轮动信号\n")
        
        signals = self.detect_rotation_signals()
        
        if signals:
            for signal in signals[:5]:  # 只显示前5个
                emoji = {"strong": "🔥", "medium": "⚠️", "weak": "💡"}.get(signal['strength'], "💡")
                report.append(f"\n{emoji} {signal['signal']}")
                report.append(f"  板块: {signal['sector']}")
                report.append(f"  描述: {signal['description']}")
        else:
            report.append("暂无显著轮动信号")
        
        # 4. 投资建议
        report.append("\n## 💡 板块轮动策略建议\n")
        
        # 找出最强的板块
        rs_scores = {}
        for sector_key in self.sectors.keys():
            rs_data = self.calculate_relative_strength(sector_key, period="1mo")
            if rs_data:
                rs_scores[sector_key] = rs_data['rs_ratio']
        
        if rs_scores:
            strongest = max(rs_scores.items(), key=lambda x: x[1])
            weakest = min(rs_scores.items(), key=lambda x: x[1])
            
            report.append(f"1. 🚀 当前最强板块: {self.sectors[strongest[0]]['name']} (RS={strongest[1]:.2f})")
            report.append(f"   建议: 超配或持有")
            report.append(f"\n2. 😰 当前最弱板块: {self.sectors[weakest[0]]['name']} (RS={weakest[1]:.2f})")
            report.append(f"   建议: 低配或等待轮动")
            report.append(f"\n3. 🔄 轮动策略:")
            report.append(f"   - 当板块RS>1.1时考虑超配")
            report.append(f"   - 当板块RS<0.9时考虑低配")
            report.append(f"   - 关注RS趋势变化（突破20日均线）")
        
        report.append("\n" + "="*70)
        
        return "\n".join(report)
    
    def save_report(self, report: str, filename: str = None):
        """保存报告"""
        if filename is None:
            filename = f"sector_rotation_{datetime.now().strftime('%Y%m%d')}.md"
        
        filepath = os.path.join(self.data_dir, filename)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(report)
        
        print(f"\n💾 报告已保存: {filepath}")
        return filepath


def main():
    """主函数"""
    import argparse
    
    parser = argparse.ArgumentParser(
        description='虾虾行业轮动监控器',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
使用示例:
  # 生成板块表现报告
  python3 sector_rotation_monitor.py --performance
  
  # 计算相对强弱
  python3 sector_rotation_monitor.py --rs semiconductors
  
  # 检测轮动信号
  python3 sector_rotation_monitor.py --signals
  
  # 生成综合报告
  python3 sector_rotation_monitor.py --report
        """
    )
    
    parser.add_argument('--performance', '-p', action='store_true',
                       help='显示板块表现')
    parser.add_argument('--rs', type=str,
                       help='计算特定板块相对强弱')
    parser.add_argument('--signals', '-s', action='store_true',
                       help='检测轮动信号')
    parser.add_argument('--report', '-r', action='store_true',
                       help='生成综合报告')
    
    args = parser.parse_args()
    
    monitor = SectorRotationMonitor()
    
    if args.performance:
        perf = monitor.get_sector_performance("1mo")
        print("\n📊 板块1月表现:")
        print("="*70)
        for sector_key, data in sorted(perf.items(), key=lambda x: x[1].get('return_1m', 0) or 0, reverse=True):
            return_val = data.get('return_1m', 0) or 0
            print(f"{'🟢' if return_val > 0 else '🔴'} {data['name']}: {return_val*100:+.2f}%")
    
    elif args.rs:
        rs = monitor.calculate_relative_strength(args.rs)
        if rs:
            print(json.dumps(rs, indent=2, ensure_ascii=False))
    
    elif args.signals:
        signals = monitor.detect_rotation_signals()
        print("\n🔄 轮动信号:")
        print("="*70)
        for signal in signals:
            print(f"\n{signal['signal']}: {signal['sector']}")
            print(f"  {signal['description']}")
    
    elif args.report:
        report = monitor.generate_rotation_report()
        print(report)
        monitor.save_report(report)
    
    else:
        print("🦐 虾虾行业轮动监控器")
        print("="*70)
        print("\n使用方法:")
        print("  --performance    显示板块表现")
        print("  --rs SECTOR      计算相对强弱")
        print("  --signals        检测轮动信号")
        print("  --report         生成综合报告")
        print("\n详细帮助:")
        print("  python3 sector_rotation_monitor.py --help")


if __name__ == "__main__":
    main()
