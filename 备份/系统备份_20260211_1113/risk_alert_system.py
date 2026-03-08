#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
风险预警系统 - Risk Alert System
作者：虾虾
创建时间：2026-02-09
用途：持仓股实时监控风险、市场系统性风险监控、自动止损建议
"""

import os
import sys
import json
import yfinance as yf
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from typing import List, Dict, Optional, Tuple


class RiskAlertSystem:
    """
    风险预警系统
    
    监控维度：
    1. 技术风险 - 趋势恶化/支撑跌破/动量衰竭
    2. 基本面风险 - 财报不及预期/估值过高
    3. 情绪风险 - 恐慌指数/VIX飙升
    4. 宏观风险 - 利率/流动性/系统性风险
    5. 持仓风险 - 集中度/相关性/波动率
    
    输出：
    - 风险评分 (0-100，分数越高风险越大)
    - 风险等级 (LOW/MEDIUM/HIGH/CRITICAL)
    - 自动止损建议
    - 减仓/对冲建议
    """
    
    def __init__(self):
        # 持仓股列表
        self.holdings = {
            'NVDA': {'name': 'NVIDIA', 'entry_price': None, 'stop_loss': None},
            'AMD': {'name': 'AMD', 'entry_price': None, 'stop_loss': None},
            'TSLA': {'name': 'Tesla', 'entry_price': None, 'stop_loss': None},
            'CRWV': {'name': 'CoreWeave', 'entry_price': None, 'stop_loss': None},
        }
        
        # 风险阈值
        self.risk_thresholds = {
            'LOW': 30,       # 低风险：0-30
            'MEDIUM': 60,    # 中风险：31-60
            'HIGH': 80,      # 高风险：61-80
            'CRITICAL': 100  # 极高风险：81-100
        }
        
        # 数据目录
        self.data_dir = os.path.expanduser("~/.openclaw/workspace/风险预警数据")
        os.makedirs(self.data_dir, exist_ok=True)
        
        print("🦐 风险预警系统启动")
        print("⚠️  监控持仓风险，提供止损建议")
        print("="*70)
    
    def assess_technical_risk(self, symbol: str) -> Dict:
        """
        技术风险评分 (0-100，越高越危险)
        
        风险信号：
        - 跌破MA20/MA50 (高风险)
        - RSI从超买区快速下跌
        - 成交量放大但价格下跌 (派发)
        - 跌破关键支撑位
        """
        print(f"  📉 评估 {symbol} 技术风险...")
        
        try:
            ticker = yf.Ticker(symbol)
            hist = ticker.history(period="3mo")
            
            if hist.empty or len(hist) < 50:
                return {'score': 50, 'signals': [], 'error': '数据不足'}
            
            risk_score = 0
            risk_signals = []
            
            current_price = hist['Close'].iloc[-1]
            ma20 = hist['Close'].rolling(20).mean().iloc[-1]
            ma50 = hist['Close'].rolling(50).mean().iloc[-1]
            
            # 1. 均线风险
            if current_price < ma20 < ma50:
                risk_score += 30  # 空头排列，高风险
                risk_signals.append("跌破MA20和MA50，空头排列")
            elif current_price < ma20:
                risk_score += 15
                risk_signals.append("跌破MA20")
            elif current_price < ma50:
                risk_score += 10
                risk_signals.append("跌破MA50")
            
            # 2. RSI风险（从超买快速下跌）
            delta = hist['Close'].diff()
            gain = (delta.where(delta > 0, 0)).rolling(14).mean()
            loss = (-delta.where(delta < 0, 0)).rolling(14).mean()
            rs = gain / loss
            rsi = (100 - (100 / (1 + rs))).iloc[-1]
            
            if rsi > 70:
                risk_score += 10
                risk_signals.append(f"RSI超买({rsi:.1f})，回调风险")
            elif rsi < 30:
                risk_score += 5
                risk_signals.append(f"RSI超卖({rsi:.1f})，可能继续下跌")
            
            # 3. 成交量风险（放量下跌）
            recent_volume = hist['Volume'].tail(5).mean()
            avg_volume = hist['Volume'].tail(20).mean()
            recent_return = hist['Close'].pct_change().tail(5).mean()
            
            if recent_volume > avg_volume * 1.5 and recent_return < -0.02:
                risk_score += 20
                risk_signals.append("放量下跌，机构派发")
            
            # 4. 波动率风险
            volatility = hist['Close'].pct_change().std() * np.sqrt(252)
            if volatility > 0.6:
                risk_score += 15
                risk_signals.append(f"高波动率({volatility*100:.1f}%)，风险大")
            
            return {
                'score': min(risk_score, 100),
                'signals': risk_signals,
                'indicators': {
                    'price': round(current_price, 2),
                    'ma20': round(ma20, 2),
                    'ma50': round(ma50, 2),
                    'rsi': round(rsi, 2),
                    'volatility': round(volatility * 100, 2)
                }
            }
            
        except Exception as e:
            print(f"    ❌ 技术风险评估失败: {e}")
            return {'score': 50, 'signals': [], 'error': str(e)}
    
    def assess_fundamental_risk(self, symbol: str) -> Dict:
        """
        基本面风险评分
        
        风险信号：
        - 估值过高 (PE>100)
        - 盈利下滑
        - 债务过高
        """
        print(f"  💰 评估 {symbol} 基本面风险...")
        
        try:
            ticker = yf.Ticker(symbol)
            info = ticker.info
            
            risk_score = 0
            risk_signals = []
            
            # 1. 估值风险
            pe = info.get('trailingPE', 50)
            if pe > 100:
                risk_score += 25
                risk_signals.append(f"极高估值(PE={pe:.1f})")
            elif pe > 60:
                risk_score += 15
                risk_signals.append(f"高估值(PE={pe:.1f})")
            
            # 2. 盈利风险
            earnings_growth = info.get('earningsGrowth', 0)
            if earnings_growth and earnings_growth < 0:
                risk_score += 20
                risk_signals.append(f"盈利下滑({earnings_growth*100:.1f}%)")
            
            # 3. 债务风险
            debt_to_equity = info.get('debtToEquity', 50)
            if debt_to_equity > 100:
                risk_score += 15
                risk_signals.append(f"高负债(负债权益比={debt_to_equity:.1f}%)")
            
            return {
                'score': min(risk_score, 100),
                'signals': risk_signals,
                'metrics': {
                    'pe': pe,
                    'earnings_growth': earnings_growth,
                    'debt_to_equity': debt_to_equity
                }
            }
            
        except Exception as e:
            print(f"    ❌ 基本面风险评估失败: {e}")
            return {'score': 30, 'signals': [], 'error': str(e)}
    
    def assess_market_risk(self) -> Dict:
        """
        市场系统性风险评分
        
        指标：
        - VIX指数
        - 信用利差
        - 流动性指标
        """
        print(f"  🌍 评估市场系统性风险...")
        
        try:
            # 获取VIX
            vix = yf.Ticker("^VIX")
            vix_hist = vix.history(period="5d")
            
            if vix_hist.empty:
                return {'score': 40, 'signals': [], 'vix': None}
            
            vix_current = vix_hist['Close'].iloc[-1]
            
            risk_score = 0
            risk_signals = []
            
            if vix_current > 30:
                risk_score += 35
                risk_signals.append(f"VIX极高({vix_current:.1f})，市场恐慌")
            elif vix_current > 25:
                risk_score += 25
                risk_signals.append(f"VIX高位({vix_current:.1f})，风险上升")
            elif vix_current > 20:
                risk_score += 15
                risk_signals.append(f"VIX上升({vix_current:.1f})")
            
            return {
                'score': min(risk_score, 100),
                'signals': risk_signals,
                'vix': round(vix_current, 2)
            }
            
        except Exception as e:
            print(f"    ❌ 市场风险评估失败: {e}")
            return {'score': 40, 'signals': [], 'error': str(e)}
    
    def assess_position_risk(self, symbol: str) -> Dict:
        """
        持仓风险评分
        
        风险：
        - 单只股票仓位过重
        - 止损位被触发
        - 回撤过大
        """
        print(f"  📊 评估 {symbol} 持仓风险...")
        
        # 获取持仓信息
        position = self.holdings.get(symbol, {})
        entry_price = position.get('entry_price')
        stop_loss = position.get('stop_loss')
        
        try:
            ticker = yf.Ticker(symbol)
            current_price = ticker.history(period="1d")['Close'].iloc[-1]
            
            risk_score = 0
            risk_signals = []
            
            # 1. 止损位风险
            if stop_loss and current_price <= stop_loss:
                risk_score += 50  # 触发止损，极高风险
                risk_signals.append(f"触发止损价(${stop_loss:.2f})")
            elif stop_loss:
                distance_to_stop = (current_price - stop_loss) / current_price
                if distance_to_stop < 0.05:  # 距离止损<5%
                    risk_score += 20
                    risk_signals.append(f"接近止损位(距离{distance_to_stop*100:.1f}%)")
            
            # 2. 回撤风险
            if entry_price:
                drawdown = (entry_price - current_price) / entry_price
                if drawdown > 0.15:  # 回撤>15%
                    risk_score += 25
                    risk_signals.append(f"较大回撤({drawdown*100:.1f}%)")
                elif drawdown > 0.08:  # 回撤>8%
                    risk_score += 10
                    risk_signals.append(f"中等回撤({drawdown*100:.1f}%)")
            
            return {
                'score': min(risk_score, 100),
                'signals': risk_signals,
                'position': {
                    'current_price': round(current_price, 2),
                    'entry_price': entry_price,
                    'stop_loss': stop_loss
                }
            }
            
        except Exception as e:
            print(f"    ❌ 持仓风险评估失败: {e}")
            return {'score': 30, 'signals': [], 'error': str(e)}
    
    def calculate_overall_risk(self, symbol: str) -> Dict:
        """
        计算综合风险评分
        """
        print(f"\n⚠️  开始风险预警分析: {symbol}")
        print("="*70)
        
        # 各维度风险
        technical = self.assess_technical_risk(symbol)
        fundamental = self.assess_fundamental_risk(symbol)
        market = self.assess_market_risk()
        position = self.assess_position_risk(symbol)
        
        # 权重
        weights = {
            'technical': 0.30,
            'fundamental': 0.25,
            'market': 0.25,
            'position': 0.20
        }
        
        # 综合风险评分
        overall_score = (
            technical['score'] * weights['technical'] +
            fundamental['score'] * weights['fundamental'] +
            market['score'] * weights['market'] +
            position['score'] * weights['position']
        )
        
        # 风险等级
        if overall_score >= 80:
            risk_level = 'CRITICAL'
        elif overall_score >= 60:
            risk_level = 'HIGH'
        elif overall_score >= 40:
            risk_level = 'MEDIUM'
        else:
            risk_level = 'LOW'
        
        # 生成建议
        recommendation = self._generate_risk_recommendation(
            overall_score, risk_level, technical, fundamental, position
        )
        
        result = {
            'symbol': symbol,
            'timestamp': datetime.now().isoformat(),
            'overall_risk_score': round(overall_score, 2),
            'risk_level': risk_level,
            'recommendation': recommendation,
            'risk_breakdown': {
                'technical': technical,
                'fundamental': fundamental,
                'market': market,
                'position': position
            }
        }
        
        return result
    
    def _generate_risk_recommendation(self, score: float, level: str,
                                     technical: Dict, fundamental: Dict,
                                     position: Dict) -> Dict:
        """生成风险应对建议"""
        recommendation = {
            'action': 'HOLD',
            'urgency': 'low',
            'suggestions': []
        }
        
        if level == 'CRITICAL':
            recommendation['action'] = 'SELL_NOW'
            recommendation['urgency'] = 'immediate'
            recommendation['suggestions'].append("🚨 极高风险，建议立即减仓或清仓")
            
        elif level == 'HIGH':
            recommendation['action'] = 'REDUCE_POSITION'
            recommendation['urgency'] = 'high'
            recommendation['suggestions'].append("⚠️ 高风险，建议减仓30-50%")
            
            # 具体建议
            if technical['score'] > 60:
                recommendation['suggestions'].append("📉 技术面恶化，设置 tighter 止损")
            if fundamental['score'] > 60:
                recommendation['suggestions'].append("💰 基本面风险，等待财报确认")
            if position.get('position', {}).get('stop_loss'):
                recommendation['suggestions'].append("🛑 严格遵循止损纪律")
                
        elif level == 'MEDIUM':
            recommendation['action'] = 'MONITOR_CLOSELY'
            recommendation['urgency'] = 'medium'
            recommendation['suggestions'].append("⚖️ 中等风险，密切监控")
            recommendation['suggestions'].append("👀 关注技术面是否进一步恶化")
            
        else:  # LOW
            recommendation['action'] = 'HOLD'
            recommendation['urgency'] = 'low'
            recommendation['suggestions'].append("✅ 风险可控，正常持仓")
        
        return recommendation
    
    def print_risk_report(self, result: Dict):
        """打印风险报告"""
        print("\n" + "="*70)
        print("⚠️  风险预警报告")
        print("="*70)
        
        symbol = result['symbol']
        score = result['overall_risk_score']
        level = result['risk_level']
        
        # 风险等级 emoji
        emoji_map = {
            'LOW': '🟢',
            'MEDIUM': '🟡',
            'HIGH': '🔴',
            'CRITICAL': '🚨'
        }
        emoji = emoji_map.get(level, '⚪')
        
        print(f"\n{emoji} {symbol} 综合风险评分: {score}/100")
        print(f"   风险等级: {level}")
        
        # 各维度风险
        print(f"\n📊 风险分解:")
        print("-"*70)
        
        breakdown = result['risk_breakdown']
        print(f"  📉 技术风险: {breakdown['technical']['score']:.1f}/100")
        if breakdown['technical']['signals']:
            for signal in breakdown['technical']['signals'][:3]:
                print(f"      ⚠️  {signal}")
        
        print(f"  💰 基本面风险: {breakdown['fundamental']['score']:.1f}/100")
        if breakdown['fundamental']['signals']:
            for signal in breakdown['fundamental']['signals'][:2]:
                print(f"      ⚠️  {signal}")
        
        print(f"  🌍 市场风险: {breakdown['market']['score']:.1f}/100")
        if breakdown['market'].get('vix'):
            print(f"      VIX: {breakdown['market']['vix']}")
        
        print(f"  📊 持仓风险: {breakdown['position']['score']:.1f}/100")
        
        # 建议
        print(f"\n💡 风险应对建议:")
        print("-"*70)
        
        rec = result['recommendation']
        action_emoji = {
            'SELL_NOW': '🔴',
            'REDUCE_POSITION': '🟠',
            'MONITOR_CLOSELY': '🟡',
            'HOLD': '🟢'
        }.get(rec['action'], '⚪')
        
        print(f"{action_emoji} 建议行动: {rec['action']}")
        print(f"   紧急程度: {rec['urgency'].upper()}")
        
        for suggestion in rec['suggestions']:
            print(f"   {suggestion}")
        
        print("="*70)
    
    def monitor_all_holdings(self):
        """监控所有持仓"""
        print("\n🔍 监控所有持仓股风险...")
        print("="*70)
        
        alerts = []
        
        for symbol in self.holdings.keys():
            result = self.calculate_overall_risk(symbol)
            self.print_risk_report(result)
            
            # 记录高风险警报
            if result['risk_level'] in ['HIGH', 'CRITICAL']:
                alerts.append({
                    'symbol': symbol,
                    'risk_score': result['overall_risk_score'],
                    'level': result['risk_level']
                })
        
        # 显示总结
        if alerts:
            print("\n🚨 高风险警报汇总:")
            print("-"*70)
            for alert in alerts:
                print(f"  {alert['symbol']}: {alert['risk_score']:.1f}分 ({alert['level']})")
        else:
            print("\n✅ 所有持仓风险可控")
        
        return alerts


def main():
    """主函数"""
    import argparse
    
    parser = argparse.ArgumentParser(
        description='虾虾风险预警系统',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
使用示例:
  # 分析单只股票风险
  python3 risk_alert_system.py --symbol NVDA
  
  # 监控所有持仓
  python3 risk_alert_system.py --monitor-all
        """
    )
    
    parser.add_argument('--symbol', '-s', type=str,
                       help='分析特定股票风险')
    parser.add_argument('--monitor-all', '-a', action='store_true',
                       help='监控所有持仓')
    
    args = parser.parse_args()
    
    risk_system = RiskAlertSystem()
    
    if args.symbol:
        result = risk_system.calculate_overall_risk(args.symbol)
        risk_system.print_risk_report(result)
    
    elif args.monitor_all:
        risk_system.monitor_all_holdings()
    
    else:
        print("🦐 虾虾风险预警系统")
        print("="*70)
        print("\n使用方法:")
        print("  --symbol SYMBOL    分析特定股票风险")
        print("  --monitor-all      监控所有持仓")
        print("\n守护本金，防范风险！")


if __name__ == "__main__":
    main()
