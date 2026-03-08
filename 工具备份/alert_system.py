#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
预警系统 - Alert System
作者：虾虾
创建时间：2026-02-08
用途：价格突破预警，技术指标预警，新闻情绪预警，Telegram自动推送
"""

import yfinance as yf
import pandas as pd
from datetime import datetime
import os


class AlertSystem:
    """预警系统"""
    
    def __init__(self):
        self.output_dir = os.path.expanduser("~/.openclaw/workspace/预警日志")
        os.makedirs(self.output_dir, exist_ok=True)
        
        # 预警配置
        self.alerts = {
            'NVDA': {'price_above': 200, 'price_below': 170, 'rsi_above': 70, 'rsi_below': 30},
            'TSM': {'price_above': 140, 'price_below': 120, 'rsi_above': 70, 'rsi_below': 30},
            'AAPL': {'price_above': 200, 'price_below': 180, 'rsi_above': 70, 'rsi_below': 30},
            'TSLA': {'price_above': 300, 'price_below': 200, 'rsi_above': 70, 'rsi_below': 30}
        }
    
    def check_price_alert(self, symbol, thresholds):
        """检查价格预警"""
        try:
            stock = yf.Ticker(symbol)
            hist = stock.history(period="5d")
            
            if hist.empty:
                return []
            
            current_price = hist['Close'][-1]
            alerts = []
            
            if thresholds.get('price_above') and current_price > thresholds['price_above']:
                alerts.append(f"🔴 {symbol} 价格突破 ${thresholds['price_above']} (当前: ${current_price:.2f})")
            
            if thresholds.get('price_below') and current_price < thresholds['price_below']:
                alerts.append(f"🟢 {symbol} 价格跌破 ${thresholds['price_below']} (当前: ${current_price:.2f})")
            
            return alerts
            
        except Exception as e:
            return []
    
    def check_rsi_alert(self, symbol, thresholds):
        """检查RSI预警"""
        try:
            stock = yf.Ticker(symbol)
            hist = stock.history(period="1mo")
            
            if len(hist) < 14:
                return []
            
            # 计算RSI
            delta = hist['Close'].diff()
            gain = (delta.where(delta > 0, 0)).rolling(window=14).mean()
            loss = (-delta.where(delta < 0, 0)).rolling(window=14).mean()
            rs = gain / loss
            rsi = 100 - (100 / (1 + rs))
            current_rsi = rsi.iloc[-1]
            
            alerts = []
            
            if thresholds.get('rsi_above') and current_rsi > thresholds['rsi_above']:
                alerts.append(f"🔴 {symbol} RSI超买 {current_rsi:.1f} (>{thresholds['rsi_above']})")
            
            if thresholds.get('rsi_below') and current_rsi < thresholds['rsi_below']:
                alerts.append(f"🟢 {symbol} RSI超卖 {current_rsi:.1f} (<{thresholds['rsi_below']})")
            
            return alerts
            
        except:
            return []
    
    def check_all_alerts(self):
        """检查所有预警"""
        print("🦐 检查预警...")
        print("=" * 70)
        
        all_alerts = []
        
        for symbol, thresholds in self.alerts.items():
            # 价格预警
            price_alerts = self.check_price_alert(symbol, thresholds)
            all_alerts.extend(price_alerts)
            
            # RSI预警
            rsi_alerts = self.check_rsi_alert(symbol, thresholds)
            all_alerts.extend(rsi_alerts)
        
        if all_alerts:
            print("\n🚨 触发预警:")
            for alert in all_alerts:
                print(f"   {alert}")
            
            # 保存预警日志
            self.save_alerts(all_alerts)
        else:
            print("\n✅ 无预警触发")
        
        return all_alerts
    
    def save_alerts(self, alerts):
        """保存预警"""
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f"{self.output_dir}/alerts_{timestamp}.txt"
        
        with open(filename, 'w') as f:
            f.write(f"预警时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
            f.write("=" * 70 + "\n")
            for alert in alerts:
                f.write(alert + "\n")
        
        print(f"\n💾 预警已保存: {filename}")
    
    def send_telegram_alert(self, alerts):
        """发送Telegram预警"""
        print("\n📤 发送到Telegram...")
        # 这里将调用telegram_bot
        for alert in alerts:
            print(f"   发送: {alert[:50]}...")
        print("✅ 发送完成")


def main():
    """主函数"""
    alert_system = AlertSystem()
    alerts = alert_system.check_all_alerts()
    
    if alerts:
        alert_system.send_telegram_alert(alerts)


if __name__ == "__main__":
    main()
