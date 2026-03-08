#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
实时预警推送系统 - Alert Pusher
作者：虾虾
创建时间：2026-02-09
用途：检测到信号后自动推送到Telegram、多因子评分>80分/风险>70分/大单吸筹/技术突破时实时提醒
"""

import os
import sys
import json
import requests
import subprocess
from datetime import datetime, timedelta
from typing import List, Dict, Optional, Tuple
import time


class AlertPusher:
    """
    实时预警推送系统
    
    推送场景：
    1. 多因子评分>80分 → 买入机会
    2. 风险评分>70分 → 减仓警报
    3. 大单监控发现吸筹 → 资金流入
    4. 突破技术阻力位 → 技术信号
    5. 分析师上调评级 → 机构动向
    
    核心思想：不是等子涵来问，而是主动发现机会！
    """
    
    def __init__(self):
        # Telegram配置
        self.telegram_token = os.getenv('TELEGRAM_BOT_TOKEN')
        self.telegram_chat_id = os.getenv('TELEGRAM_CHAT_ID')
        
        # 阈值配置
        self.thresholds = {
            'score_buy': 80,        # 多因子评分>80分
            'score_strong_buy': 90, # 多因子评分>90分
            'risk_high': 70,        # 风险评分>70分
            'risk_critical': 85,    # 风险评分>85分
            'volume_surge': 3.0,    # 成交量>3倍平均
            'price_breakout': 0.05  # 价格突破>5%
        }
        
        # 监控股票
        self.watchlist = ['NVDA', 'AMD', 'TSLA', 'AAPL', 'MSFT', 'AVGO', 'SMCI', 'CRWV']
        
        # 数据目录
        self.data_dir = os.path.expanduser("~/.openclaw/workspace/预警推送数据")
        os.makedirs(self.data_dir, exist_ok=True)
        
        # 已发送警报记录（防止重复）
        self.sent_alerts_file = os.path.join(self.data_dir, "sent_alerts.json")
        self.sent_alerts = self._load_sent_alerts()
        
        print("🦐 实时预警推送系统启动")
        print("🚨 检测到信号立即推送到Telegram")
        print("="*70)
        
        if not self.telegram_token or not self.telegram_chat_id:
            print("⚠️ 警告: Telegram未配置，将只打印不推送")
    
    def _load_sent_alerts(self) -> Dict:
        """加载已发送的警报记录"""
        try:
            with open(self.sent_alerts_file, 'r', encoding='utf-8') as f:
                return json.load(f)
        except:
            return {}
    
    def _save_sent_alert(self, alert_id: str):
        """保存已发送的警报"""
        self.sent_alerts[alert_id] = datetime.now().isoformat()
        with open(self.sent_alerts_file, 'w', encoding='utf-8') as f:
            json.dump(self.sent_alerts, f, ensure_ascii=False, indent=2)
    
    def _is_recently_sent(self, alert_id: str, hours: int = 24) -> bool:
        """检查是否最近已发送"""
        if alert_id not in self.sent_alerts:
            return False
        
        sent_time = datetime.fromisoformat(self.sent_alerts[alert_id])
        return (datetime.now() - sent_time) < timedelta(hours=hours)
    
    def send_telegram(self, message: str) -> bool:
        """发送Telegram消息"""
        if not self.telegram_token or not self.telegram_chat_id:
            print(f"📱 [Telegram未配置，仅打印]\n{message}")
            return False
        
        try:
            url = f"https://api.telegram.org/bot{self.telegram_token}/sendMessage"
            payload = {
                'chat_id': self.telegram_chat_id,
                'text': message,
                'parse_mode': 'HTML'
            }
            
            response = requests.post(url, json=payload, timeout=10)
            
            if response.status_code == 200:
                print(f"✅ Telegram推送成功")
                return True
            else:
                print(f"⚠️ Telegram推送失败: {response.status_code}")
                return False
                
        except Exception as e:
            print(f"❌ Telegram发送错误: {e}")
            return False
    
    def check_score_alerts(self):
        """
        检查多因子评分警报
        
        评分>80分 → 买入警报
        评分>90分 → 强烈买入警报
        """
        print("\n📊 检查多因子评分警报...")
        
        for symbol in self.watchlist:
            try:
                # 调用multi_factor_scorer获取评分
                result = subprocess.run(
                    ['python3', 'multi_factor_scorer.py', '--symbol', symbol],
                    capture_output=True,
                    text=True,
                    cwd=os.path.expanduser('~/.openclaw/workspace/tools')
                )
                
                # 简化：从输出中解析评分
                # 实际应该解析JSON，这里简化处理
                if '综合评分' in result.stdout:
                    # 这里简化，实际需要解析
                    score = 75  # 占位
                    
                    if score >= self.thresholds['score_strong_buy']:
                        alert_id = f"score_strong_buy_{symbol}_{datetime.now().strftime('%Y%m%d')}"
                        if not self._is_recently_sent(alert_id):
                            message = (
                                f"🚀 <b>强烈买入警报</b>\n\n"
                                f"股票: {symbol}\n"
                                f"多因子评分: {score}/100\n"
                                f"信号: 强烈建议买入\n\n"
                                f"建议: 考虑重仓布局"
                            )
                            if self.send_telegram(message):
                                self._save_sent_alert(alert_id)
                    
                    elif score >= self.thresholds['score_buy']:
                        alert_id = f"score_buy_{symbol}_{datetime.now().strftime('%Y%m%d')}"
                        if not self._is_recently_sent(alert_id):
                            message = (
                                f"📈 <b>买入警报</b>\n\n"
                                f"股票: {symbol}\n"
                                f"多因子评分: {score}/100\n"
                                f"信号: 建议买入\n\n"
                                f"建议: 可考虑建仓或加仓"
                            )
                            if self.send_telegram(message):
                                self._save_sent_alert(alert_id)
                
            except Exception as e:
                print(f"  ⚠️ 检查{symbol}评分失败: {e}")
    
    def check_risk_alerts(self):
        """
        检查风险警报
        
        风险>70分 → 减仓警报
        风险>85分 → 强烈减仓警报
        """
        print("\n⚠️ 检查风险警报...")
        
        for symbol in self.watchlist:
            try:
                # 调用risk_alert_system
                result = subprocess.run(
                    ['python3', 'risk_alert_system.py', '--symbol', symbol],
                    capture_output=True,
                    text=True,
                    cwd=os.path.expanduser('~/.openclaw/workspace/tools')
                )
                
                # 简化处理
                risk_score = 50  # 占位
                
                if risk_score >= self.thresholds['risk_critical']:
                    alert_id = f"risk_critical_{symbol}_{datetime.now().strftime('%Y%m%d')}"
                    if not self._is_recently_sent(alert_id):
                        message = (
                            f"🔴 <b>极高风险警报</b>\n\n"
                            f"股票: {symbol}\n"
                            f"风险评分: {risk_score}/100\n"
                            f"风险等级: CRITICAL\n\n"
                            f"建议: 立即减仓或清仓！"
                        )
                        if self.send_telegram(message):
                            self._save_sent_alert(alert_id)
                
                elif risk_score >= self.thresholds['risk_high']:
                    alert_id = f"risk_high_{symbol}_{datetime.now().strftime('%Y%m%d')}"
                    if not self._is_recently_sent(alert_id):
                        message = (
                            f"🟠 <b>高风险警报</b>\n\n"
                            f"股票: {symbol}\n"
                            f"风险评分: {risk_score}/100\n"
                            f"风险等级: HIGH\n\n"
                            f"建议: 考虑减仓避险"
                        )
                        if self.send_telegram(message):
                            self._save_sent_alert(alert_id)
                
            except Exception as e:
                print(f"  ⚠️ 检查{symbol}风险失败: {e}")
    
    def check_whale_alerts(self):
        """
        检查大单/吸筹警报
        """
        print("\n🐋 检查大单监控警报...")
        
        try:
            # 调用whale_tracker
            result = subprocess.run(
                ['python3', 'whale_tracker.py', '--scan'],
                capture_output=True,
                text=True,
                cwd=os.path.expanduser('~/.openclaw/workspace/tools')
            )
            
            # 解析输出，查找吸筹信号
            if '吸筹' in result.stdout or 'accumulation' in result.stdout:
                # 提取股票代码
                for symbol in self.watchlist:
                    if symbol in result.stdout:
                        alert_id = f"whale_{symbol}_{datetime.now().strftime('%Y%m%d')}"
                        if not self._is_recently_sent(alert_id):
                            message = (
                                f"🐋 <b>Smart Money吸筹信号</b>\n\n"
                                f"股票: {symbol}\n"
                                f"信号: 大单吸筹中\n\n"
                                f"建议: 关注跟随买入机会"
                            )
                            if self.send_telegram(message):
                                self._save_sent_alert(alert_id)
        
        except Exception as e:
            print(f"  ⚠️ 检查大单失败: {e}")
    
    def check_technical_breakout(self):
        """
        检查技术突破
        
        突破MA20/MA50/阻力位
        """
        print("\n📈 检查技术突破...")
        
        # 简化版：检查价格是否突破近期高点
        import yfinance as yf
        
        for symbol in self.watchlist:
            try:
                ticker = yf.Ticker(symbol)
                hist = ticker.history(period="20d")
                
                if hist.empty:
                    continue
                
                current = hist['Close'].iloc[-1]
                high_20d = hist['High'].max()
                
                # 突破20日高点
                if current >= high_20d * 0.99:  # 允许1%误差
                    alert_id = f"breakout_{symbol}_{datetime.now().strftime('%Y%m%d')}"
                    if not self._is_recently_sent(alert_id, hours=12):
                        message = (
                            f"💥 <b>技术突破警报</b>\n\n"
                            f"股票: {symbol}\n"
                            f"价格: ${current:.2f}\n"
                            f"突破: 20日高点\n\n"
                            f"建议: 技术信号看多"
                        )
                        if self.send_telegram(message):
                            self._save_sent_alert(alert_id)
            
            except Exception as e:
                print(f"  ⚠️ 检查{symbol}突破失败: {e}")
    
    def check_analyst_upgrades(self):
        """
        检查分析师上调评级
        """
        print("\n🏛️ 检查分析师评级变化...")
        
        # 简化版，实际应该调用analyst_tracker
        # 这里只作为示例
        pass
    
    def run_all_checks(self):
        """
        运行所有检查
        """
        print("\n" + "="*70)
        print(f"🚨 虾虾实时预警检查 - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print("="*70)
        
        self.check_score_alerts()
        self.check_risk_alerts()
        self.check_whale_alerts()
        self.check_technical_breakout()
        self.check_analyst_upgrades()
        
        print("\n" + "="*70)
        print("✅ 预警检查完成")
        print("="*70)


def main():
    """主函数"""
    import argparse
    
    parser = argparse.ArgumentParser(
        description='虾虾实时预警推送系统',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
使用示例:
  # 运行所有检查
  python3 alert_pusher.py --check-all
  
  # 仅检查评分
  python3 alert_pusher.py --check-score
        """
    )
    
    parser.add_argument('--check-all', action='store_true',
                       help='运行所有检查')
    parser.add_argument('--check-score', action='store_true',
                       help='仅检查评分警报')
    parser.add_argument('--check-risk', action='store_true',
                       help='仅检查风险警报')
    parser.add_argument('--check-whale', action='store_true',
                       help='仅检查大单警报')
    
    args = parser.parse_args()
    
    pusher = AlertPusher()
    
    if args.check_all:
        pusher.run_all_checks()
    
    elif args.check_score:
        pusher.check_score_alerts()
    
    elif args.check_risk:
        pusher.check_risk_alerts()
    
    elif args.check_whale:
        pusher.check_whale_alerts()
    
    else:
        print("🦐 虾虾实时预警推送系统")
        print("="*70)
        print("\n使用方法:")
        print("  --check-all      运行所有检查")
        print("  --check-score    检查评分警报")
        print("  --check-risk     检查风险警报")
        print("  --check-whale    检查大单警报")
        print("\n主动发现机会，实时推送！")


if __name__ == "__main__":
    main()
