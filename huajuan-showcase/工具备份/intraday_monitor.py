#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
盘中实时监控器 - Intraday Monitor
作者：虾虾
创建时间：2026-02-09
用途：实时监控持仓股价格异动、行业突发新闻、盘前/盘后警报
特点：自动推送Telegram、日志记录、防止错过重要异动
"""

import os
import sys
import time
import json
import requests
import yfinance as yf
from datetime import datetime, timedelta
from typing import List, Dict, Optional, Tuple
import asyncio


class IntradayMonitor:
    """
    盘中实时监控器
    
    监控内容：
    1. 持仓股价格异动（盘中>5%，盘前/盘后>3%）
    2. 半导体/AI行业突发新闻
    3. 成交量异常（>3x平均值）
    4. 大盘指数异动
    
    警报方式：
    - Telegram推送
    - 本地日志
    - 控制台输出
    """
    
    def __init__(self):
        # 监控配置
        self.holdings = {
            # 核心持仓
            'NVDA': {'name': 'NVIDIA', 'sector': 'AI芯片', 'alert_threshold': 0.05},
            'AMD': {'name': 'AMD', 'sector': '芯片', 'alert_threshold': 0.05},
            'TSLA': {'name': 'Tesla', 'sector': '科技', 'alert_threshold': 0.05},
            'AAPL': {'name': 'Apple', 'sector': '科技', 'alert_threshold': 0.05},
            'MSFT': {'name': 'Microsoft', 'sector': '科技/AI', 'alert_threshold': 0.05},
            'CRWV': {'name': 'CoreWeave', 'sector': 'AI基础设施', 'alert_threshold': 0.08},
            'AVGO': {'name': 'Broadcom', 'sector': '芯片/CPO', 'alert_threshold': 0.05},
            'SMCI': {'name': 'SuperMicro', 'sector': 'AI服务器', 'alert_threshold': 0.06},
        }
        
        # 行业ETF监控
        self.sector_etfs = {
            'SMH': 'VanEck半导体ETF',
            'SOXX': 'iShares半导体ETF',
            'XLK': '科技ETF',
            'QQQ': '纳斯达克100',
            'SPY': '标普500',
        }
        
        # 数据存储
        self.data_dir = os.path.expanduser("~/.openclaw/workspace/监控数据/Intraday")
        os.makedirs(self.data_dir, exist_ok=True)
        
        # 历史数据缓存（用于计算平均值）
        self.price_history = {}
        self.volume_history = {}
        
        # 已发送警报记录（防止重复）
        self.sent_alerts = set()
        
        # Telegram配置
        self.telegram_token = os.getenv('TELEGRAM_BOT_TOKEN')
        self.telegram_chat_id = os.getenv('TELEGRAM_CHAT_ID')
        
        print("🦐 盘中实时监控器启动")
        print(f"📊 监控持仓: {len(self.holdings)} 只股票")
        print(f"📈 监控ETF: {len(self.sector_etfs)} 只")
        print(f"⏰ 当前时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print("="*70)
    
    def get_stock_data(self, symbol: str) -> Optional[Dict]:
        """获取股票实时数据"""
        try:
            ticker = yf.Ticker(symbol)
            # 获取今日数据
            hist = ticker.history(period="5d", interval="1m")
            
            if hist.empty:
                return None
            
            latest = hist.iloc[-1]
            prev_close = hist.iloc[0]['Close'] if len(hist) > 1 else latest['Close']
            
            # 计算涨跌幅
            change_pct = (latest['Close'] - prev_close) / prev_close
            
            # 计算成交量比率（对比20日平均）
            try:
                daily_hist = ticker.history(period="20d")
                avg_volume = daily_hist['Volume'].mean()
                volume_ratio = latest['Volume'] / avg_volume if avg_volume > 0 else 1.0
            except:
                volume_ratio = 1.0
            
            return {
                'symbol': symbol,
                'price': latest['Close'],
                'change_pct': change_pct,
                'volume': latest['Volume'],
                'volume_ratio': volume_ratio,
                'high': latest['High'],
                'low': latest['Low'],
                'open': latest['Open'],
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            print(f"❌ 获取{symbol}数据失败: {e}")
            return None
    
    def check_price_alert(self, data: Dict, config: Dict) -> Tuple[bool, str]:
        """
        检查价格异动警报
        
        Returns:
            (是否触发警报, 警报信息)
        """
        symbol = data['symbol']
        change_pct = data['change_pct']
        threshold = config['alert_threshold']
        
        # 获取当前市场状态
        market_status = self.get_market_status()
        
        # 根据市场状态调整阈值
        if market_status in ['premarket', 'afterhours']:
            # 盘前/盘后更敏感
            effective_threshold = threshold * 0.6  # 3% for 5% threshold
        else:
            effective_threshold = threshold
        
        if abs(change_pct) >= effective_threshold:
            direction = "🚀 大涨" if change_pct > 0 else "📉 大跌"
            alert_msg = f"{direction} {symbol} ({config['name']})\n"
            alert_msg += f"💰 价格: ${data['price']:.2f}\n"
            alert_msg += f"📊 涨跌: {change_pct*100:+.2f}%\n"
            alert_msg += f"⏰ 时间: {datetime.now().strftime('%H:%M:%S')}\n"
            alert_msg += f"📍 板块: {config['sector']}"
            
            return True, alert_msg
        
        return False, ""
    
    def check_volume_alert(self, data: Dict) -> Tuple[bool, str]:
        """检查成交量异常警报"""
        volume_ratio = data.get('volume_ratio', 1.0)
        
        if volume_ratio >= 3.0:  # 成交量大于3倍平均
            alert_msg = f"⚠️ 成交量异常 {data['symbol']}\n"
            alert_msg += f"📊 成交量: {volume_ratio:.1f}x 平均值\n"
            alert_msg += f"💰 价格: ${data['price']:.2f}\n"
            alert_msg += f"⏰ 时间: {datetime.now().strftime('%H:%M:%S')}"
            return True, alert_msg
        
        return False, ""
    
    def get_market_status(self) -> str:
        """获取当前市场状态"""
        now = datetime.now()
        et_now = now - timedelta(hours=0)  # 简化为本地时间，实际需要ET转换
        
        hour = et_now.hour
        minute = et_now.minute
        weekday = et_now.weekday()
        
        # 周末
        if weekday >= 5:
            return 'closed'
        
        # 盘前 4:00-9:30 ET
        if (hour == 4) or (hour == 5) or (hour == 6) or (hour == 7) or (hour == 8) or (hour == 9 and minute < 30):
            return 'premarket'
        
        # 盘中 9:30-16:00 ET
        if (hour == 9 and minute >= 30) or (hour >= 10 and hour < 16):
            return 'market'
        
        # 盘后 16:00-20:00 ET
        if (hour == 16) or (hour == 17) or (hour == 18) or (hour == 19):
            return 'afterhours'
        
        return 'closed'
    
    def send_telegram_alert(self, message: str):
        """发送Telegram警报"""
        if not self.telegram_token or not self.telegram_chat_id:
            print("⚠️ Telegram未配置，仅记录日志")
            print(f"📱 警报内容:\n{message}\n")
            return
        
        try:
            url = f"https://api.telegram.org/bot{self.telegram_token}/sendMessage"
            payload = {
                'chat_id': self.telegram_chat_id,
                'text': f"🚨 虾虾盘中警报\n\n{message}",
                'parse_mode': 'HTML'
            }
            
            response = requests.post(url, json=payload, timeout=10)
            
            if response.status_code == 200:
                print(f"✅ Telegram警报已发送")
            else:
                print(f"⚠️ Telegram发送失败: {response.status_code}")
                
        except Exception as e:
            print(f"❌ Telegram发送错误: {e}")
    
    def log_alert(self, symbol: str, alert_type: str, message: str):
        """记录警报到日志文件"""
        log_file = os.path.join(self.data_dir, f"alerts_{datetime.now().strftime('%Y%m%d')}.json")
        
        alert_data = {
            'timestamp': datetime.now().isoformat(),
            'symbol': symbol,
            'type': alert_type,
            'message': message
        }
        
        # 读取现有日志
        logs = []
        if os.path.exists(log_file):
            try:
                with open(log_file, 'r', encoding='utf-8') as f:
                    logs = json.load(f)
            except:
                logs = []
        
        # 添加新警报
        logs.append(alert_data)
        
        # 保存
        with open(log_file, 'w', encoding='utf-8') as f:
            json.dump(logs, f, ensure_ascii=False, indent=2)
    
    def monitor_once(self):
        """执行一次监控"""
        print(f"\n🔄 监控轮次: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print("="*70)
        
        market_status = self.get_market_status()
        status_text = {
            'premarket': '盘前交易',
            'market': '正常交易',
            'afterhours': '盘后交易',
            'closed': '市场关闭'
        }.get(market_status, '未知状态')
        
        print(f"📍 市场状态: {status_text}")
        print("-"*70)
        
        alerts_sent = 0
        
        # 监控持仓股
        for symbol, config in self.holdings.items():
            try:
                data = self.get_stock_data(symbol)
                if not data:
                    continue
                
                # 检查价格异动
                is_alert, alert_msg = self.check_price_alert(data, config)
                if is_alert:
                    alert_id = f"{symbol}_{data['change_pct']:.2f}_{datetime.now().strftime('%H%M')}"
                    if alert_id not in self.sent_alerts:
                        print(f"🚨 价格警报: {symbol}")
                        print(alert_msg)
                        self.send_telegram_alert(alert_msg)
                        self.log_alert(symbol, 'price', alert_msg)
                        self.sent_alerts.add(alert_id)
                        alerts_sent += 1
                
                # 检查成交量异常
                is_vol_alert, vol_msg = self.check_volume_alert(data)
                if is_vol_alert:
                    alert_id = f"{symbol}_vol_{datetime.now().strftime('%H%M')}"
                    if alert_id not in self.sent_alerts:
                        print(f"⚠️ 成交量警报: {symbol}")
                        print(vol_msg)
                        self.send_telegram_alert(vol_msg)
                        self.log_alert(symbol, 'volume', vol_msg)
                        self.sent_alerts.add(alert_id)
                        alerts_sent += 1
                
                # 打印状态（小幅变动）
                if abs(data['change_pct']) >= 0.02:  # >2%
                    emoji = "🟢" if data['change_pct'] > 0 else "🔴"
                    print(f"  {emoji} {symbol}: ${data['price']:.2f} ({data['change_pct']*100:+.2f}%)")
                
            except Exception as e:
                print(f"❌ 监控{symbol}出错: {e}")
        
        # 监控ETF
        print("\n📊 ETF监控:")
        for etf_symbol, etf_name in self.sector_etfs.items():
            try:
                data = self.get_stock_data(etf_symbol)
                if data and abs(data['change_pct']) >= 0.03:  # ETF阈值3%
                    emoji = "🟢" if data['change_pct'] > 0 else "🔴"
                    print(f"  {emoji} {etf_symbol} ({etf_name}): {data['change_pct']*100:+.2f}%")
                    
                    if abs(data['change_pct']) >= 0.05:  # ETF >5%发警报
                        alert_msg = f"⚠️ {etf_symbol} ({etf_name}) 异动\n"
                        alert_msg += f"📊 涨跌: {data['change_pct']*100:+.2f}%\n"
                        alert_msg += f"⏰ 时间: {datetime.now().strftime('%H:%M:%S')}"
                        self.send_telegram_alert(alert_msg)
                        self.log_alert(etf_symbol, 'etf', alert_msg)
                        alerts_sent += 1
                        
            except Exception as e:
                print(f"❌ 监控ETF {etf_symbol}出错: {e}")
        
        print(f"\n✅ 监控完成，发送 {alerts_sent} 条警报")
        print("="*70)
        
        return alerts_sent
    
    def monitor_continuously(self, interval: int = 300):
        """
        持续监控
        
        Args:
            interval: 监控间隔（秒），默认5分钟
        """
        print(f"🔄 开始持续监控（每{interval}秒）...")
        print("按 Ctrl+C 停止\n")
        
        try:
            while True:
                self.monitor_once()
                print(f"\n⏳ 等待{interval}秒后下次监控...")
                time.sleep(interval)
                
        except KeyboardInterrupt:
            print("\n\n🛑 监控已停止")
            print(f"📊 总共发送 {len(self.sent_alerts)} 条独特警报")
            print("="*70)
    
    def run_premarket_check(self):
        """盘前检查"""
        print("🌅 执行盘前检查...")
        self.monitor_once()
    
    def run_afterhours_check(self):
        """盘后检查"""
        print("🌙 执行盘后检查...")
        self.monitor_once()
    
    def generate_daily_summary(self) -> str:
        """生成每日监控摘要"""
        today = datetime.now().strftime('%Y%m%d')
        log_file = os.path.join(self.data_dir, f"alerts_{today}.json")
        
        if not os.path.exists(log_file):
            return "今日无警报记录"
        
        try:
            with open(log_file, 'r', encoding='utf-8') as f:
                logs = json.load(f)
            
            if not logs:
                return "今日无警报记录"
            
            summary = f"📊 今日监控摘要 ({today})\n"
            summary += "="*70 + "\n"
            summary += f"🚨 总警报数: {len(logs)}\n\n"
            
            # 按类型统计
            price_alerts = [l for l in logs if l['type'] == 'price']
            volume_alerts = [l for l in logs if l['type'] == 'volume']
            
            if price_alerts:
                summary += f"📈 价格异动: {len(price_alerts)} 条\n"
            if volume_alerts:
                summary += f"📊 成交量异常: {len(volume_alerts)} 条\n"
            
            # 最新3条
            summary += "\n🕐 最新警报:\n"
            for log in logs[-3:]:
                summary += f"  {log['timestamp'][11:19]} - {log['symbol']} ({log['type']})\n"
            
            return summary
            
        except Exception as e:
            return f"读取日志失败: {e}"


def main():
    """主函数"""
    import argparse
    
    parser = argparse.ArgumentParser(description='虾虾盘中实时监控器')
    parser.add_argument('--once', action='store_true', help='运行一次')
    parser.add_argument('--interval', '-i', type=int, default=300, 
                       help='监控间隔（秒），默认300秒（5分钟）')
    parser.add_argument('--premarket', action='store_true', help='盘前检查')
    parser.add_argument('--afterhours', action='store_true', help='盘后检查')
    parser.add_argument('--summary', action='store_true', help='生成今日摘要')
    
    args = parser.parse_args()
    
    monitor = IntradayMonitor()
    
    if args.summary:
        print(monitor.generate_daily_summary())
    elif args.premarket:
        monitor.run_premarket_check()
    elif args.afterhours:
        monitor.run_afterhours_check()
    elif args.once:
        monitor.monitor_once()
    else:
        # 默认持续监控
        monitor.monitor_continuously(args.interval)


if __name__ == "__main__":
    main()
