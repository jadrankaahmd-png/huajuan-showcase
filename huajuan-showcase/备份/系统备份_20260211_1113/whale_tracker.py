#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
大单监控器 - Whale Tracker
作者：虾虾
创建时间：2026-02-09
用途：监控暗池交易、识别大单买卖、机构买卖方向、异常成交量检测
"""

import os
import sys
import json
import yfinance as yf
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from typing import List, Dict, Optional, Tuple


class WhaleTracker:
    """
    大单监控器 (Whale Tracker)
    
    核心思想：Smart Money的行动先于价格！
    
    功能：
    1. 监控异常成交量（>3x平均）
    2. 识别大单交易（通过成交量和价格行为推断）
    3. 机构买卖方向（吸筹/派发信号）
    4. 资金流向分析
    
    注意：由于暗池数据获取困难，本工具主要通过价格和成交量行为推断
    """
    
    def __init__(self):
        self.data_dir = os.path.expanduser("~/.openclaw/workspace/大单监控数据")
        os.makedirs(self.data_dir, exist_ok=True)
        
        # 监控股票
        self.watchlist = ['NVDA', 'AMD', 'TSLA', 'AAPL', 'MSFT', 'AVGO', 'SMCI', 'CRWV']
        
        # 大单阈值
        self.thresholds = {
            'volume_surge': 3.0,      # 成交量 > 3x平均
            'price_move': 0.03,       # 价格变动 > 3%
            'block_trade': 1000000    # 大单金额 > 100万（模拟）
        }
        
        print("🦐 大单监控器 (Whale Tracker) 启动")
        print("🐋 追踪Smart Money的足迹")
        print("="*70)
    
    def detect_volume_anomaly(self, symbol: str, period: str = "20d") -> Dict:
        """
        检测成交量异常
        
        Returns:
            成交量分析结果
        """
        try:
            ticker = yf.Ticker(symbol)
            hist = ticker.history(period=period)
            
            if hist.empty or len(hist) < 5:
                return {'error': '数据不足'}
            
            # 计算平均成交量（排除最近一天）
            avg_volume = hist['Volume'][:-1].mean()
            latest_volume = hist['Volume'].iloc[-1]
            latest_price = hist['Close'].iloc[-1]
            
            # 成交量比率
            volume_ratio = latest_volume / avg_volume if avg_volume > 0 else 1.0
            
            # 计算资金流向（简化版）
            price_change = (hist['Close'].iloc[-1] - hist['Open'].iloc[-1]) / hist['Open'].iloc[-1]
            
            # 判断是吸筹还是派发
            if volume_ratio > 2.0:
                if price_change > 0.02:  # 放量上涨
                    signal = 'accumulation'  # 吸筹
                    confidence = 'high' if volume_ratio > 3.0 else 'medium'
                elif price_change < -0.02:  # 放量下跌
                    signal = 'distribution'  # 派发
                    confidence = 'high' if volume_ratio > 3.0 else 'medium'
                else:
                    signal = 'churn'  # 换手
                    confidence = 'low'
            else:
                signal = 'normal'
                confidence = 'low'
            
            # 估算大单金额
            estimated_value = latest_volume * latest_price
            
            return {
                'symbol': symbol,
                'latest_volume': int(latest_volume),
                'avg_volume': int(avg_volume),
                'volume_ratio': round(volume_ratio, 2),
                'price_change': round(price_change * 100, 2),
                'signal': signal,
                'confidence': confidence,
                'estimated_value': estimated_value,
                'is_whale_activity': volume_ratio > self.thresholds['volume_surge']
            }
            
        except Exception as e:
            print(f"❌ 检测{symbol}成交量异常失败: {e}")
            return {'error': str(e)}
    
    def analyze_intraday_pattern(self, symbol: str) -> Dict:
        """
        分析日内交易模式
        
        识别：
        - 开盘跳空（机构盘前交易）
        - 尾盘拉升/打压
        - 盘中大单痕迹
        """
        try:
            # 获取日线数据
            ticker = yf.Ticker(symbol)
            hist = ticker.history(period="5d")
            
            if hist.empty:
                return {'error': '数据不足'}
            
            latest = hist.iloc[-1]
            prev_close = hist.iloc[-2]['Close'] if len(hist) > 1 else latest['Open']
            
            # 计算各种价格变动
            gap = (latest['Open'] - prev_close) / prev_close  # 开盘跳空
            intraday_move = (latest['Close'] - latest['Open']) / latest['Open']  # 日内变动
            
            patterns = []
            
            # 跳空高开 + 持续上涨
            if gap > 0.02 and intraday_move > 0.01:
                patterns.append({
                    'pattern': 'gap_up_rally',
                    'name': '跳空高开高走',
                    'signal': 'bullish',
                    'description': '机构抢筹，强烈看多'
                })
            
            # 跳空低开 + 持续下跌
            elif gap < -0.02 and intraday_move < -0.01:
                patterns.append({
                    'pattern': 'gap_down_sell',
                    'name': '跳空低开低走',
                    'signal': 'bearish',
                    'description': '机构出逃，强烈看空'
                })
            
            # 高开低走（派发）
            elif gap > 0.01 and intraday_move < -0.01:
                patterns.append({
                    'pattern': 'gap_up_reversal',
                    'name': '高开低走',
                    'signal': 'bearish',
                    'description': '可能是机构出货'
                })
            
            # 低开高走（吸筹）
            elif gap < -0.01 and intraday_move > 0.01:
                patterns.append({
                    'pattern': 'gap_down_rally',
                    'name': '低开高走',
                    'signal': 'bullish',
                    'description': '可能是机构吸筹'
                })
            
            return {
                'symbol': symbol,
                'date': latest.name.strftime('%Y-%m-%d'),
                'gap': round(gap * 100, 2),
                'intraday_move': round(intraday_move * 100, 2),
                'patterns': patterns,
                'volume': int(latest['Volume'])
            }
            
        except Exception as e:
            print(f"❌ 分析{symbol}日内模式失败: {e}")
            return {'error': str(e)}
    
    def calculate_money_flow(self, symbol: str, period: str = "20d") -> Dict:
        """
        计算资金流向
        
        使用Chaikin Money Flow (CMF) 简化版
        """
        try:
            ticker = yf.Ticker(symbol)
            hist = ticker.history(period=period)
            
            if hist.empty:
                return {'error': '数据不足'}
            
            # 计算Money Flow
            hist['Money_Flow_Multiplier'] = ((hist['Close'] - hist['Low']) - (hist['High'] - hist['Close'])) / (hist['High'] - hist['Low'])
            hist['Money_Flow_Volume'] = hist['Money_Flow_Multiplier'] * hist['Volume']
            
            # 20日CMF
            cmf_20 = hist['Money_Flow_Volume'].rolling(20).sum() / hist['Volume'].rolling(20).sum()
            latest_cmf = cmf_20.iloc[-1]
            
            # 解读
            if latest_cmf > 0.1:
                trend = 'strong_inflow'  # 强流入
            elif latest_cmf > 0.05:
                trend = 'moderate_inflow'  # 中等流入
            elif latest_cmf > -0.05:
                trend = 'neutral'
            elif latest_cmf > -0.1:
                trend = 'moderate_outflow'  # 中等流出
            else:
                trend = 'strong_outflow'  # 强流出
            
            return {
                'symbol': symbol,
                'cmf_20': round(latest_cmf, 4),
                'trend': trend,
                'interpretation': self._interpret_cmf(latest_cmf)
            }
            
        except Exception as e:
            print(f"❌ 计算{symbol}资金流向失败: {e}")
            return {'error': str(e)}
    
    def _interpret_cmf(self, cmf: float) -> str:
        """解读CMF指标"""
        if cmf > 0.1:
            return "机构资金持续流入，吸筹中"
        elif cmf > 0.05:
            return "资金净流入，看好"
        elif cmf > -0.05:
            return "资金流向平衡"
        elif cmf > -0.1:
            return "资金净流出，谨慎"
        else:
            return "机构资金持续流出，派发中"
    
    def scan_for_whale_activity(self) -> List[Dict]:
        """
        扫描所有股票的大单活动
        """
        print("\n🐋 扫描大单活动...")
        print("="*70)
        
        whale_alerts = []
        
        for symbol in self.watchlist:
            print(f"\n  扫描 {symbol}...")
            
            # 成交量异常
            volume_data = self.detect_volume_anomaly(symbol)
            
            # 日内模式
            pattern_data = self.analyze_intraday_pattern(symbol)
            
            # 资金流向
            flow_data = self.calculate_money_flow(symbol)
            
            # 判断是否有大单活动
            is_whale = (
                volume_data.get('is_whale_activity', False) or
                (pattern_data.get('patterns') and len(pattern_data['patterns']) > 0) or
                flow_data.get('cmf_20', 0) > 0.1 or
                flow_data.get('cmf_20', 0) < -0.1
            )
            
            if is_whale:
                alert = {
                    'symbol': symbol,
                    'volume_anomaly': volume_data,
                    'pattern': pattern_data,
                    'money_flow': flow_data,
                    'timestamp': datetime.now().isoformat()
                }
                whale_alerts.append(alert)
                
                print(f"    🐋 检测到Smart Money活动！")
                if volume_data.get('signal'):
                    print(f"       信号: {volume_data['signal']}")
                if flow_data.get('trend'):
                    print(f"       资金流向: {flow_data['trend']}")
        
        return whale_alerts
    
    def generate_whale_report(self, alerts: List[Dict]) -> str:
        """
        生成大单监控报告
        """
        report = []
        report.append("="*70)
        report.append("🐋 Smart Money大单监控报告")
        report.append(f"生成时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        report.append("="*70)
        
        if not alerts:
            report.append("\n✅ 今日未发现明显大单活动")
            return "\n".join(report)
        
        # 分类
        accumulation = [a for a in alerts if a['volume_anomaly'].get('signal') == 'accumulation']
        distribution = [a for a in alerts if a['volume_anomaly'].get('signal') == 'distribution']
        others = [a for a in alerts if a not in accumulation and a not in distribution]
        
        # 吸筹信号
        if accumulation:
            report.append("\n🟢 吸筹信号 (机构买入):")
            report.append("-"*70)
            for alert in accumulation:
                symbol = alert['symbol']
                vol = alert['volume_anomaly']
                flow = alert['money_flow']
                report.append(f"\n  📈 {symbol}")
                report.append(f"     成交量: {vol.get('volume_ratio', 0):.1f}x 平均")
                report.append(f"     CMF: {flow.get('cmf_20', 0):.3f}")
                report.append(f"     建议: 关注跟随买入机会")
        
        # 派发信号
        if distribution:
            report.append("\n🔴 派发信号 (机构卖出):")
            report.append("-"*70)
            for alert in distribution:
                symbol = alert['symbol']
                vol = alert['volume_anomaly']
                flow = alert['money_flow']
                report.append(f"\n  📉 {symbol}")
                report.append(f"     成交量: {vol.get('volume_ratio', 0):.1f}x 平均")
                report.append(f"     CMF: {flow.get('cmf_20', 0):.3f}")
                report.append(f"     建议: 警惕减仓风险")
        
        # 其他信号
        if others:
            report.append("\n⚪ 其他异常:")
            report.append("-"*70)
            for alert in others:
                symbol = alert['symbol']
                report.append(f"\n  {symbol}: 需要进一步观察")
        
        report.append("\n" + "="*70)
        report.append("💡 提示：大单信号仅供参考，需结合基本面和技术面综合判断")
        report.append("="*70)
        
        return "\n".join(report)


def main():
    """主函数"""
    import argparse
    
    parser = argparse.ArgumentParser(
        description='虾虾大单监控器 (Whale Tracker)',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
使用示例:
  # 扫描所有监控股票
  python3 whale_tracker.py --scan
  
  # 分析单只股票
  python3 whale_tracker.py --symbol NVDA
        """
    )
    
    parser.add_argument('--scan', '-s', action='store_true',
                       help='扫描所有股票')
    parser.add_argument('--symbol', type=str,
                       help='分析单只股票')
    
    args = parser.parse_args()
    
    tracker = WhaleTracker()
    
    if args.scan:
        alerts = tracker.scan_for_whale_activity()
        report = tracker.generate_whale_report(alerts)
        print(report)
    
    elif args.symbol:
        volume = tracker.detect_volume_anomaly(args.symbol)
        pattern = tracker.analyze_intraday_pattern(args.symbol)
        flow = tracker.calculate_money_flow(args.symbol)
        
        print(f"\n🐋 {args.symbol} 大单分析:")
        print("="*70)
        print(f"\n成交量异常:")
        print(json.dumps(volume, indent=2, default=str))
        print(f"\n日内模式:")
        print(json.dumps(pattern, indent=2, default=str))
        print(f"\n资金流向:")
        print(json.dumps(flow, indent=2, default=str))
    
    else:
        print("🦐 虾虾大单监控器 (Whale Tracker)")
        print("="*70)
        print("\n使用方法:")
        print("  --scan           扫描所有股票")
        print("  --symbol SYM     分析单只股票")
        print("\n追踪Smart Money的足迹！")


if __name__ == "__main__":
    main()
