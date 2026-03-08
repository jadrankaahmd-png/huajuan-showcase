#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
做空监控系统 - Short Interest Monitor
作者：虾虾
创建时间：2026-02-08
用途：监控股票做空情况，识别逼空机会和风险
"""

import yfinance as yf
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import sys


class ShortInterestMonitor:
    """做空监控器"""
    
    def __init__(self, symbol):
        self.symbol = symbol
        self.stock = None
        self.info = None
        
    def fetch_data(self):
        """获取股票数据"""
        try:
            self.stock = yf.Ticker(self.symbol)
            self.info = self.stock.info
            print(f"✅ 获取{self.symbol}数据成功")
            return True
        except Exception as e:
            print(f"❌ 获取{self.symbol}数据失败: {e}")
            return False
    
    def get_short_interest_data(self):
        """
        获取做空数据
        注意：yfinance提供的做空数据有限，这里使用可用数据
        """
        if self.info is None:
            return None
        
        # 从info中提取相关数据
        short_data = {}
        
        # 做空比例（Short Ratio）
        short_data['short_ratio'] = self.info.get('shortRatio', None)
        
        # 做空股份数
        short_data['shares_short'] = self.info.get('sharesShort', None)
        
        # 做空股份数（上期）
        short_data['shares_short_prior'] = self.info.get('sharesShortPriorMonth', None)
        
        # 流通股份数
        short_data['float'] = self.info.get('floatShares', None)
        
        # 总股份数
        short_data['shares_outstanding'] = self.info.get('sharesOutstanding', None)
        
        # 计算做空占流通盘比例
        if short_data['shares_short'] and short_data['float']:
            short_data['short_pct_float'] = short_data['shares_short'] / short_data['float']
        else:
            short_data['short_pct_float'] = None
        
        # 计算做空变化
        if short_data['shares_short'] and short_data['shares_short_prior']:
            short_data['short_change'] = short_data['shares_short'] - short_data['shares_short_prior']
            short_data['short_change_pct'] = (short_data['short_change'] / short_data['shares_short_prior']) * 100
        else:
            short_data['short_change'] = None
            short_data['short_change_pct'] = None
        
        return short_data
    
    def calculate_days_to_cover(self, avg_volume_20d=None):
        """计算做空天数（Days to Cover）"""
        if self.info is None:
            return None
        
        shares_short = self.info.get('sharesShort', None)
        
        if avg_volume_20d is None:
            # 获取历史数据计算平均成交量
            try:
                hist = self.stock.history(period="20d")
                avg_volume_20d = hist['Volume'].mean()
            except:
                avg_volume_20d = None
        
        if shares_short and avg_volume_20d and avg_volume_20d > 0:
            days_to_cover = shares_short / avg_volume_20d
            return days_to_cover
        
        return None
    
    def assess_squeeze_risk(self):
        """评估逼空风险"""
        short_data = self.get_short_interest_data()
        days_to_cover = self.calculate_days_to_cover()
        
        if short_data is None:
            return {'risk_level': '未知', 'score': 0}
        
        score = 0
        risk_factors = []
        
        # 1. 做空比例（占流通盘）
        short_pct = short_data.get('short_pct_float', 0) or 0
        if short_pct > 0.3:
            score += 3
            risk_factors.append("做空比例极高(>30%)")
        elif short_pct > 0.2:
            score += 2
            risk_factors.append("做空比例高(>20%)")
        elif short_pct > 0.1:
            score += 1
            risk_factors.append("做空比例中等(>10%)")
        
        # 2. 做空天数
        if days_to_cover and days_to_cover > 10:
            score += 3
            risk_factors.append(f"做空天数极高({days_to_cover:.1f}天)")
        elif days_to_cover and days_to_cover > 5:
            score += 2
            risk_factors.append(f"做空天数高({days_to_cover:.1f}天)")
        elif days_to_cover and days_to_cover > 3:
            score += 1
            risk_factors.append(f"做空天数中等({days_to_cover:.1f}天)")
        
        # 3. 做空变化
        short_change_pct = short_data.get('short_change_pct', 0) or 0
        if short_change_pct > 20:
            score += 2
            risk_factors.append("做空数量大幅增加")
        elif short_change_pct < -20:
            score -= 1
            risk_factors.append("做空数量减少")
        
        # 4. 市值因素（小市值更容易被做空）
        market_cap = self.info.get('marketCap', 0) or 0
        if market_cap > 0 and market_cap < 10e9:  # 小于100亿
            score += 1
            risk_factors.append("小市值股票")
        
        # 风险评级
        if score >= 5:
            risk_level = "🔴 极高逼空风险"
        elif score >= 3:
            risk_level = "🟠 高逼空风险"
        elif score >= 1:
            risk_level = "🟡 中等逼空风险"
        else:
            risk_level = "🟢 低逼空风险"
        
        return {
            'risk_level': risk_level,
            'score': score,
            'factors': risk_factors,
            'short_pct_float': short_pct,
            'days_to_cover': days_to_cover
        }
    
    def get_short_squeeze_opportunity(self):
        """识别逼空机会"""
        squeeze_risk = self.assess_squeeze_risk()
        
        if squeeze_risk['score'] >= 3:
            return {
                'opportunity': True,
                'level': squeeze_risk['risk_level'],
                'description': f"该股票有{squeeze_risk['risk_level']}，如果出现利好消息或技术性买盘，可能引发逼空行情",
                'factors': squeeze_risk['factors']
            }
        else:
            return {
                'opportunity': False,
                'level': squeeze_risk['risk_level'],
                'description': "当前逼空风险较低",
                'factors': []
            }
    
    def print_report(self):
        """打印做空监控报告"""
        print("\n" + "=" * 70)
        print(f"🐻 {self.symbol} 做空监控报告")
        print("=" * 70)
        
        if not self.fetch_data():
            print("❌ 无法获取数据")
            return
        
        # 基本信息
        current_price = self.info.get('currentPrice', self.info.get('previousClose', 0))
        market_cap = self.info.get('marketCap', 0)
        
        print(f"\n💰 基本信息:")
        print(f"   当前价格: ${current_price:.2f}")
        if market_cap:
            print(f"   市值: ${market_cap/1e9:.2f}B")
        
        # 做空数据
        short_data = self.get_short_interest_data()
        if short_data:
            print(f"\n📊 做空数据:")
            print("-" * 70)
            
            if short_data['shares_short']:
                print(f"   做空股数: {short_data['shares_short']:,.0f}")
            
            if short_data['float']:
                print(f"   流通股本: {short_data['float']:,.0f}")
            
            if short_data['short_pct_float']:
                print(f"   做空占流通盘: {short_data['short_pct_float']*100:.2f}%")
            
            if short_data['short_ratio']:
                print(f"   做空比例(Short Ratio): {short_data['short_ratio']:.2f}")
            
            if short_data['short_change']:
                change_str = f"+{short_data['short_change']:,.0f}" if short_data['short_change'] > 0 else f"{short_data['short_change']:,.0f}"
                print(f"   做空变化: {change_str} ({short_data['short_change_pct']:+.1f}%)")
        
        # 做空天数
        days_to_cover = self.calculate_days_to_cover()
        if days_to_cover:
            print(f"   做空天数(Days to Cover): {days_to_cover:.1f}天")
            if days_to_cover > 10:
                print(f"   ⚠️  做空天数极高，逼空风险大")
            elif days_to_cover > 5:
                print(f"   🟡 做空天数较高")
            else:
                print(f"   🟢 做空天数正常")
        
        # 逼空风险评估
        squeeze_risk = self.assess_squeeze_risk()
        print(f"\n🎯 逼空风险评估:")
        print("-" * 70)
        print(f"   {squeeze_risk['risk_level']}")
        print(f"   风险评分: {squeeze_risk['score']}/10")
        
        if squeeze_risk['factors']:
            print(f"\n   风险因素:")
            for factor in squeeze_risk['factors']:
                print(f"   • {factor}")
        
        # 逼空机会
        opportunity = self.get_short_squeeze_opportunity()
        print(f"\n💡 逼空机会分析:")
        print("-" * 70)
        if opportunity['opportunity']:
            print(f"   ✅ 发现逼空机会！")
            print(f"   {opportunity['level']}")
            print(f"   {opportunity['description']}")
        else:
            print(f"   {opportunity['description']}")
        
        # 投资建议
        print(f"\n🎲 投资建议:")
        print("-" * 70)
        
        if squeeze_risk['score'] >= 5:
            print("   • 🔴 高逼空风险 - 适合寻找逼空机会")
            print("   • 关注：利好消息、技术指标突破")
            print("   • 策略：可小仓位参与逼空行情")
            print("   • 风险：如果利空出现，可能加速下跌")
        elif squeeze_risk['score'] >= 3:
            print("   • 🟡 中等逼空风险 - 值得关注")
            print("   • 保持观察，等待逼空触发因素")
        else:
            print("   • 🟢 低逼空风险 - 正常交易")
            print("   • 没有明显的逼空机会")
        
        print("=" * 70)
        print("\n⚠️ 注意：做空数据可能存在延迟，仅供参考")


def monitor_multiple(symbols):
    """监控多只股票"""
    print(f"\n🦐 批量监控 {len(symbols)} 只股票的做空情况...")
    print("=" * 70)
    
    results = []
    
    for symbol in symbols:
        monitor = ShortInterestMonitor(symbol)
        if monitor.fetch_data():
            squeeze_risk = monitor.assess_squeeze_risk()
            results.append({
                'symbol': symbol,
                'score': squeeze_risk['score'],
                'risk_level': squeeze_risk['risk_level'],
                'short_pct': squeeze_risk.get('short_pct_float', 0) or 0
            })
        else:
            results.append({
                'symbol': symbol,
                'score': 0,
                'risk_level': '无数据',
                'short_pct': 0
            })
    
    # 按风险评分排序
    results.sort(key=lambda x: x['score'], reverse=True)
    
    print(f"\n🐻 逼空风险排名（从高到低）：")
    print("-" * 70)
    print(f"{'排名':<4} {'股票':<8} {'风险评分':>10} {'做空比例':>12} {'评级':<15}")
    print("-" * 70)
    
    for i, r in enumerate(results, 1):
        short_pct_str = f"{r['short_pct']*100:.1f}%" if r['short_pct'] else "N/A"
        print(f"{i:<4} {r['symbol']:<8} {r['score']:>10} {short_pct_str:>12} {r['risk_level']:<15}")
    
    print("=" * 70)


def main():
    """主函数"""
    if len(sys.argv) < 2:
        print("🦐 做空监控系统使用说明：")
        print("=" * 70)
        print("用法:")
        print("  单只股票: python short_interest_monitor.py <股票代码>")
        print("  批量监控: python short_interest_monitor.py --monitor <股票1> <股票2> ...")
        print("\n示例:")
        print("  python short_interest_monitor.py GME")
        print("  python short_interest_monitor.py --monitor GME AMC TSLA NVDA")
        sys.exit(1)
    
    if sys.argv[1] == '--monitor':
        symbols = sys.argv[2:]
        monitor_multiple(symbols)
    else:
        symbol = sys.argv[1]
        monitor = ShortInterestMonitor(symbol)
        monitor.print_report()


if __name__ == "__main__":
    main()
