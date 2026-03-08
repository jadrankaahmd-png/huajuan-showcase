#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
资金流向追踪器 - Fund Flow Tracker
作者：虾虾
创建时间：2026-02-08
用途：追踪股票的资金流向，识别主力资金动向
"""

import yfinance as yf
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import sys


class FundFlowTracker:
    """资金流向追踪器"""
    
    def __init__(self, symbol, period="3mo"):
        self.symbol = symbol
        self.period = period
        self.data = None
        
    def fetch_data(self):
        """获取股票数据"""
        try:
            stock = yf.Ticker(self.symbol)
            self.data = stock.history(period=self.period)
            if self.data.empty:
                raise ValueError(f"无法获取{self.symbol}的数据")
            
            print(f"✅ 获取{self.symbol}数据成功")
            print(f"   时间范围: {self.data.index[0].strftime('%Y-%m-%d')} 至 {self.data.index[-1].strftime('%Y-%m-%d')}")
            return True
        except Exception as e:
            print(f"❌ 获取{self.symbol}数据失败: {e}")
            return False
    
    def calculate_money_flow(self):
        """
        计算资金流向指标
        使用经典的资金流指标（CMF - Chaikin Money Flow）
        """
        if self.data is None:
            return None
        
        # 计算资金流乘数
        money_flow_multiplier = ((self.data['Close'] - self.data['Low']) - 
                                (self.data['High'] - self.data['Close'])) / \
                               (self.data['High'] - self.data['Low'])
        
        # 计算资金流体积
        money_flow_volume = money_flow_multiplier * self.data['Volume']
        
        # 计算CMF（20日）
        cmf_20 = money_flow_volume.rolling(window=20).sum() / self.data['Volume'].rolling(window=20).sum()
        
        # 计算CMF（5日）短期
        cmf_5 = money_flow_volume.rolling(window=5).sum() / self.data['Volume'].rolling(window=5).sum()
        
        # 计算累积资金流
        cumulative_flow = money_flow_volume.cumsum()
        
        return {
            'cmf_20': cmf_20,
            'cmf_5': cmf_5,
            'money_flow_volume': money_flow_volume,
            'cumulative_flow': cumulative_flow,
            'current_cmf_20': cmf_20.iloc[-1],
            'current_cmf_5': cmf_5.iloc[-1]
        }
    
    def calculate_volume_analysis(self):
        """成交量分析"""
        if self.data is None:
            return None
        
        # 成交量均线
        vol_sma_20 = self.data['Volume'].rolling(window=20).mean()
        vol_sma_5 = self.data['Volume'].rolling(window=5).mean()
        
        # 当前成交量与均值比较
        current_volume = self.data['Volume'][-1]
        avg_volume_20 = vol_sma_20.iloc[-1]
        avg_volume_5 = vol_sma_5.iloc[-1]
        
        volume_ratio_20 = current_volume / avg_volume_20 if avg_volume_20 > 0 else 0
        volume_ratio_5 = current_volume / avg_volume_5 if avg_volume_5 > 0 else 0
        
        # 放量/缩量判断
        if volume_ratio_20 > 1.5:
            volume_status = "🔴 显著放量"
        elif volume_ratio_20 > 1.2:
            volume_status = "🟠 温和放量"
        elif volume_ratio_20 < 0.7:
            volume_status = "🔵 明显缩量"
        else:
            volume_status = "⚪ 成交量正常"
        
        return {
            'current_volume': current_volume,
            'avg_volume_20': avg_volume_20,
            'avg_volume_5': avg_volume_5,
            'volume_ratio_20': volume_ratio_20,
            'volume_ratio_5': volume_ratio_5,
            'volume_status': volume_status
        }
    
    def calculate_price_volume_trend(self):
        """计算价量趋势（PVT）"""
        if self.data is None:
            return None
        
        # 计算日收益率
        daily_return = self.data['Close'].pct_change()
        
        # 计算PVT
        pvt = (daily_return * self.data['Volume']).cumsum()
        
        # PVT趋势
        pvt_sma_20 = pvt.rolling(window=20).mean()
        pvt_trend = "上升" if pvt.iloc[-1] > pvt_sma_20.iloc[-1] else "下降"
        
        return {
            'pvt': pvt,
            'pvt_sma_20': pvt_sma_20,
            'current_pvt': pvt.iloc[-1],
            'pvt_trend': pvt_trend
        }
    
    def identify_accumulation_distribution(self):
        """
        识别吸筹/派发阶段
        """
        if self.data is None:
            return None
        
        # 使用A/D线（Accumulation/Distribution Line）
        money_flow_multiplier = ((self.data['Close'] - self.data['Low']) - 
                                (self.data['High'] - self.data['Close'])) / \
                               (self.data['High'] - self.data['Low'])
        
        ad_line = (money_flow_multiplier * self.data['Volume']).cumsum()
        
        # 比较A/D线和价格趋势
        price_trend = self.data['Close'].iloc[-1] - self.data['Close'].iloc[-20]
        ad_trend = ad_line.iloc[-1] - ad_line.iloc[-20]
        
        # 背离分析
        if price_trend > 0 and ad_trend < 0:
            signal = "⚠️ 顶背离 - 价格上升但资金流出，可能见顶"
            phase = "派发阶段"
        elif price_trend < 0 and ad_trend > 0:
            signal = "✨ 底背离 - 价格下跌但资金流入，可能见底"
            phase = "吸筹阶段"
        elif price_trend > 0 and ad_trend > 0:
            signal = "✅ 量价齐升 - 健康上涨趋势"
            phase = "上涨阶段"
        elif price_trend < 0 and ad_trend < 0:
            signal = "❌ 量价齐跌 - 下跌趋势确认"
            phase = "下跌阶段"
        else:
            signal = "➡️ 趋势不明"
            phase = "震荡阶段"
        
        return {
            'ad_line': ad_line,
            'current_ad': ad_line.iloc[-1],
            'signal': signal,
            'phase': phase,
            'divergence': '顶背离' if price_trend > 0 and ad_trend < 0 else 
                         '底背离' if price_trend < 0 and ad_trend > 0 else '无'
        }
    
    def smart_money_indicator(self):
        """
        聪明钱指标（识别机构资金动向）
        """
        if self.data is None or len(self.data) < 20:
            return None
        
        # 大单指标：收盘价接近高点+放量 = 机构买入
        # 收盘价接近低点+放量 = 机构卖出
        
        position_in_range = (self.data['Close'] - self.data['Low']) / \
                           (self.data['High'] - self.data['Low'])
        
        # 聪明钱信号
        smart_money_signal = position_in_range * self.data['Volume']
        smart_money_sma = smart_money_signal.rolling(window=20).mean()
        
        current_signal = smart_money_signal.iloc[-1]
        current_sma = smart_money_sma.iloc[-1]
        
        if current_signal > current_sma * 1.2:
            interpretation = "🔴 机构资金流入 - 收盘价接近高点且放量"
        elif current_signal < current_sma * 0.8:
            interpretation = "🔵 机构资金流出 - 收盘价接近低点且放量"
        else:
            interpretation = "⚪ 机构资金中性"
        
        return {
            'smart_money_signal': current_signal,
            'smart_money_sma': current_sma,
            'interpretation': interpretation
        }
    
    def get_fund_flow_summary(self):
        """获取资金流向汇总"""
        money_flow = self.calculate_money_flow()
        volume_analysis = self.calculate_volume_analysis()
        pvt = self.calculate_price_volume_trend()
        ad = self.identify_accumulation_distribution()
        smart_money = self.smart_money_indicator()
        
        return {
            'cmf_20': money_flow['current_cmf_20'] if money_flow else 0,
            'cmf_5': money_flow['current_cmf_5'] if money_flow else 0,
            'volume_status': volume_analysis['volume_status'] if volume_analysis else "未知",
            'volume_ratio': volume_analysis['volume_ratio_20'] if volume_analysis else 0,
            'pvt_trend': pvt['pvt_trend'] if pvt else "未知",
            'phase': ad['phase'] if ad else "未知",
            'signal': ad['signal'] if ad else "未知",
            'smart_money': smart_money['interpretation'] if smart_money else "未知"
        }
    
    def print_report(self):
        """打印资金流向报告"""
        print("\n" + "=" * 70)
        print(f"💰 {self.symbol} 资金流向分析报告")
        print("=" * 70)
        
        current_price = self.data['Close'][-1]
        price_change = (self.data['Close'][-1] / self.data['Close'][-2] - 1) * 100
        
        print(f"\n📊 当前状态:")
        print(f"   价格: ${current_price:.2f} ({price_change:+.2f}%)")
        print(f"   成交量: {self.data['Volume'][-1]:,.0f}")
        
        # 1. 资金流向指标
        money_flow = self.calculate_money_flow()
        if money_flow:
            print(f"\n💧 Chaikin Money Flow (资金流向):")
            print("-" * 70)
            cmf_20 = money_flow['current_cmf_20']
            cmf_5 = money_flow['current_cmf_5']
            
            print(f"   CMF (20日): {cmf_20:.3f}", end=" ")
            if cmf_20 > 0.1:
                print("🟢 强劲流入")
            elif cmf_20 > 0:
                print("🟡 温和流入")
            elif cmf_20 > -0.1:
                print("🟠 温和流出")
            else:
                print("🔴 强劲流出")
            
            print(f"   CMF (5日):  {cmf_5:.3f} (短期)")
            
            # CMF趋势
            if cmf_5 > cmf_20:
                print(f"   趋势: 短期资金流改善 (↑)")
            else:
                print(f"   趋势: 短期资金流恶化 (↓)")
        
        # 2. 成交量分析
        volume_analysis = self.calculate_volume_analysis()
        if volume_analysis:
            print(f"\n📈 成交量分析:")
            print("-" * 70)
            print(f"   {volume_analysis['volume_status']}")
            print(f"   当前成交量: {volume_analysis['current_volume']:,.0f}")
            print(f"   20日均量:   {volume_analysis['avg_volume_20']:,.0f}")
            print(f"   量比(20日): {volume_analysis['volume_ratio_20']:.2f}x")
            print(f"   量比(5日):  {volume_analysis['volume_ratio_5']:.2f}x")
        
        # 3. 价量趋势
        pvt = self.calculate_price_volume_trend()
        if pvt:
            print(f"\n📊 价量趋势 (PVT):")
            print("-" * 70)
            print(f"   PVT趋势: {pvt['pvt_trend']}")
            if pvt['pvt_trend'] == "上升":
                print(f"   ✅ 资金持续流入，支持价格上涨")
            else:
                print(f"   ⚠️ 资金流出，价格可能承压")
        
        # 4. 吸筹/派发阶段
        ad = self.identify_accumulation_distribution()
        if ad:
            print(f"\n🎯 市场阶段识别:")
            print("-" * 70)
            print(f"   当前阶段: {ad['phase']}")
            print(f"   信号: {ad['signal']}")
            if ad['divergence'] != '无':
                print(f"   ⚡ 发现{ad['divergence']}信号")
        
        # 5. 聪明钱指标
        smart_money = self.smart_money_indicator()
        if smart_money:
            print(f"\n🧠 聪明钱指标 (机构资金):")
            print("-" * 70)
            print(f"   {smart_money['interpretation']}")
        
        # 6. 综合判断
        print(f"\n🎲 综合资金流向判断:")
        print("-" * 70)
        
        summary = self.get_fund_flow_summary()
        
        # 计算得分
        score = 0
        if summary['cmf_20'] > 0.05:
            score += 2
        elif summary['cmf_20'] > 0:
            score += 1
        elif summary['cmf_20'] < -0.05:
            score -= 2
        else:
            score -= 1
        
        if '流入' in summary['smart_money']:
            score += 2
        elif '流出' in summary['smart_money']:
            score -= 2
        
        if summary['volume_ratio'] > 1.2 and summary['cmf_20'] > 0:
            score += 1
        
        if '吸筹' in summary['phase'] or '底背离' in summary['signal']:
            score += 2
        elif '派发' in summary['phase'] or '顶背离' in summary['signal']:
            score -= 2
        
        # 最终判断
        if score >= 3:
            verdict = "🟢 资金流入强劲 - 建议买入或持有"
        elif score >= 1:
            verdict = "🟡 资金温和流入 - 可持有或小幅加仓"
        elif score <= -3:
            verdict = "🔴 资金流出明显 - 建议减仓或观望"
        elif score <= -1:
            verdict = "🟠 资金温和流出 - 谨慎持有"
        else:
            verdict = "⚪ 资金流向中性 - 观望为主"
        
        print(f"   资金流向得分: {score:+d}")
        print(f"   建议: {verdict}")
        
        print("=" * 70)


def track_multiple(symbols):
    """追踪多只股票的资金流"""
    print(f"\n🦐 批量追踪 {len(symbols)} 只股票的资金流向...")
    print("=" * 70)
    
    results = []
    
    for symbol in symbols:
        tracker = FundFlowTracker(symbol)
        if tracker.fetch_data():
            summary = tracker.get_fund_flow_summary()
            results.append({
                'symbol': symbol,
                'cmf_20': summary['cmf_20'],
                'phase': summary['phase'],
                'smart_money': '流入' if '流入' in summary['smart_money'] else '流出' if '流出' in summary['smart_money'] else '中性'
            })
    
    # 按CMF排序
    results.sort(key=lambda x: x['cmf_20'], reverse=True)
    
    print(f"\n💰 资金流向排名（按CMF）：")
    print("-" * 70)
    print(f"{'排名':<4} {'股票':<8} {'CMF(20日)':>12} {'聪明钱':<8} {'阶段':<10}")
    print("-" * 70)
    
    for i, r in enumerate(results, 1):
        cmf_str = f"{r['cmf_20']:+.3f}"
        print(f"{i:<4} {r['symbol']:<8} {cmf_str:>12} {r['smart_money']:<8} {r['phase']:<10}")
    
    print("=" * 70)


def main():
    """主函数"""
    if len(sys.argv) < 2:
        print("🦐 资金流向追踪器使用说明：")
        print("=" * 70)
        print("用法:")
        print("  单只股票: python fund_flow_tracker.py <股票代码>")
        print("  批量追踪: python fund_flow_tracker.py --track <股票1> <股票2> ...")
        print("\n示例:")
        print("  python fund_flow_tracker.py AAPL")
        print("  python fund_flow_tracker.py --track AAPL TSLA NVDA AMD")
        sys.exit(1)
    
    if sys.argv[1] == '--track':
        symbols = sys.argv[2:]
        track_multiple(symbols)
    else:
        symbol = sys.argv[1]
        tracker = FundFlowTracker(symbol)
        if tracker.fetch_data():
            tracker.print_report()


if __name__ == "__main__":
    main()
