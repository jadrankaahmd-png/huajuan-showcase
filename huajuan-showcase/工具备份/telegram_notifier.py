#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
虾虾Telegram推送系统 - Telegram Notification System
作者：虾虾
创建时间：2026-02-10
用途：自动推送交易通知、每日报告、风险预警到Telegram
"""

import os
import json
import logging
from datetime import datetime
from typing import Dict, Optional
import requests

# 配置日志
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class TelegramNotifier:
    """
    Telegram推送系统
    
    推送场景：
    1. 交易执行通知 (买入/卖出)
    2. 每日交易报告
    3. 风险预警
    4. 市场开盘提醒
    5. 盘中机会提醒
    """
    
    def __init__(self):
        """初始化Telegram通知器"""
        # 从环境变量获取配置
        self.bot_token = os.getenv('TELEGRAM_BOT_TOKEN')
        self.chat_id = os.getenv('TELEGRAM_CHAT_ID')
        
        # API基础URL
        self.base_url = f"https://api.telegram.org/bot{self.bot_token}"
        
        # 检查配置
        if not self.bot_token or not self.chat_id:
            logger.warning("⚠️ Telegram配置未设置，将只打印不推送")
            self.enabled = False
        else:
            self.enabled = True
            logger.info("✅ Telegram通知器已初始化")
    
    def send_message(self, message: str, parse_mode: str = 'HTML') -> bool:
        """
        发送Telegram消息
        
        Args:
            message: 消息内容
            parse_mode: 解析模式 (HTML/Markdown)
        
        Returns:
            是否发送成功
        """
        if not self.enabled:
            # 未配置时只打印
            print(f"\n📱 [Telegram未配置，仅打印]\n{message}\n")
            return False
        
        try:
            url = f"{self.base_url}/sendMessage"
            payload = {
                'chat_id': self.chat_id,
                'text': message,
                'parse_mode': parse_mode,
                'disable_web_page_preview': True
            }
            
            response = requests.post(url, json=payload, timeout=10)
            
            if response.status_code == 200:
                logger.info("✅ Telegram推送成功")
                return True
            else:
                logger.error(f"❌ Telegram推送失败: {response.status_code}")
                return False
                
        except Exception as e:
            logger.error(f"❌ Telegram发送错误: {e}")
            return False
    
    def send_trade_notification(self, symbol: str, action: str, quantity: int, 
                               price: float, reason: str = ""):
        """
        发送交易执行通知
        
        Args:
            symbol: 股票代码
            action: BUY/SELL
            quantity: 数量
            price: 价格
            reason: 交易理由
        """
        emoji = "🟢" if action == "BUY" else "🔴"
        action_text = "买入" if action == "BUY" else "卖出"
        
        message = f"""
{emoji} <b>虾虾自动交易执行</b> {emoji}

<b>股票:</b> {symbol}
<b>操作:</b> {action_text}
<b>数量:</b> {quantity}股
<b>价格:</b> ${price:.2f}
<b>金额:</b> ${quantity * price:.2f}

<b>理由:</b> {reason}

<i>时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}</i>
"""
        
        self.send_message(message)
    
    def send_daily_report(self, account_value: float, day_pnl: float, 
                         positions: list, trades: list):
        """
        发送每日交易报告
        
        Args:
            account_value: 账户总值
            day_pnl: 当日盈亏
            positions: 持仓列表
            trades: 交易列表
        """
        pnl_emoji = "🟢" if day_pnl >= 0 else "🔴"
        pnl_sign = "+" if day_pnl >= 0 else ""
        
        # 持仓摘要
        positions_text = ""
        if positions:
            for pos in positions[:5]:  # 最多显示5只
                positions_text += f"• {pos['symbol']}: {pos['position']}股\n"
        else:
            positions_text = "无持仓\n"
        
        # 交易摘要
        trades_text = ""
        if trades:
            for trade in trades[:5]:
                emoji = "🟢" if trade['action'] == 'BUY' else "🔴"
                trades_text += f"{emoji} {trade['symbol']} {trade['action']} {trade['quantity']}股 @ ${trade['price']:.2f}\n"
        else:
            trades_text = "今日无交易\n"
        
        message = f"""
📊 <b>虾虾每日交易报告</b> 📊

<b>账户总值:</b> ${account_value:,.2f}
<b>当日盈亏:</b> {pnl_emoji} {pnl_sign}${day_pnl:,.2f}

<b>📈 当前持仓:</b>
{positions_text}

<b>📝 今日交易:</b>
{trades_text}

<i>报告时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}</i>
"""
        
        self.send_message(message)
    
    def send_risk_alert(self, symbol: str, risk_level: str, current_price: float,
                       stop_loss_price: float, reason: str):
        """
        发送风险预警
        
        Args:
            symbol: 股票代码
            risk_level: 风险等级
            current_price: 当前价格
            stop_loss_price: 止损价格
            reason: 预警原因
        """
        message = f"""
🚨 <b>风险预警</b> 🚨

<b>股票:</b> {symbol}
<b>风险等级:</b> {risk_level}
<b>当前价格:</b> ${current_price:.2f}
<b>止损价格:</b> ${stop_loss_price:.2f}
<b>潜在亏损:</b> {((stop_loss_price/current_price - 1) * 100):.1f}%

<b>原因:</b> {reason}

⚠️ 建议立即检查持仓！

<i>预警时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}</i>
"""
        
        self.send_message(message)
    
    def send_market_open_reminder(self, premarket_movers: list = None):
        """
        发送开盘提醒
        
        Args:
            premarket_movers: 盘前异动股票列表
        """
        movers_text = ""
        if premarket_movers:
            for stock in premarket_movers[:5]:
                emoji = "🟢" if stock['change'] > 0 else "🔴"
                movers_text += f"{emoji} {stock['symbol']}: {stock['change']:+.2f}%\n"
        else:
            movers_text = "暂无重大盘前异动\n"
        
        message = f"""
🔔 <b>美股开盘提醒</b> 🔔

<b>开盘时间:</b> {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

<b>📊 盘前异动:</b>
{movers_text}

🦐 虾虾已准备就绪，开始自动交易！
"""
        
        self.send_message(message)
    
    def send_opportunity_alert(self, symbol: str, score: int, 
                              current_price: float, reason: str):
        """
        发送交易机会提醒
        
        Args:
            symbol: 股票代码
            score: 多因子评分
            current_price: 当前价格
            reason: 推荐理由
        """
        emoji = "🚀" if score >= 85 else "📈"
        
        message = f"""
{emoji} <b>交易机会提醒</b> {emoji}

<b>股票:</b> {symbol}
<b>评分:</b> {score}/100
<b>当前价格:</b> ${current_price:.2f}

<b>推荐理由:</b>
{reason}

⏰ 建议关注，准备买入！

<i>提醒时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}</i>
"""
        
        self.send_message(message)
    
    def send_weekly_summary(self, week_pnl: float, win_rate: float,
                           total_trades: int, best_trade: str, worst_trade: str):
        """
        发送每周总结
        
        Args:
            week_pnl: 本周盈亏
            win_rate: 胜率
            total_trades: 总交易次数
            best_trade: 最佳交易
            worst_trade: 最差交易
        """
        pnl_emoji = "🟢" if week_pnl >= 0 else "🔴"
        pnl_sign = "+" if week_pnl >= 0 else ""
        
        # 虾虾评级
        if win_rate >= 70:
            rating = "A+ 优秀"
            rating_emoji = "🏆"
        elif win_rate >= 60:
            rating = "A 良好"
            rating_emoji = "⭐"
        elif win_rate >= 50:
            rating = "B 一般"
            rating_emoji = "📊"
        else:
            rating = "C 需改进"
            rating_emoji = "⚠️"
        
        message = f"""
📈 <b>虾虾每周交易总结</b> 📈

<b>本周盈亏:</b> {pnl_emoji} {pnl_sign}${week_pnl:,.2f}
<b>交易次数:</b> {total_trades}次
<b>胜率:</b> {win_rate:.1f}%

<b>🏆 最佳交易:</b>
{best_trade}

<b>📉 最差交易:</b>
{worst_trade}

<b>{rating_emoji} 虾虾评级:</b> {rating}

<i>总结时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}</i>
"""
        
        self.send_message(message)


# 全局实例
notifier = TelegramNotifier()


def test_notifications():
    """测试所有通知类型"""
    print("🦐 测试Telegram推送系统")
    print("="*70)
    
    # 测试交易通知
    print("\n1️⃣ 测试交易通知...")
    notifier.send_trade_notification(
        symbol="GFS",
        action="BUY",
        quantity=100,
        price=43.10,
        reason="多因子评分85分，突破MA20"
    )
    
    # 测试风险预警
    print("\n2️⃣ 测试风险预警...")
    notifier.send_risk_alert(
        symbol="NVDA",
        risk_level="HIGH",
        current_price=850.0,
        stop_loss_price=780.0,
        reason="跌破止损线，触发自动卖出"
    )
    
    # 测试每日报告
    print("\n3️⃣ 测试每日报告...")
    notifier.send_daily_report(
        account_value=1041500.83,
        day_pnl=5230.50,
        positions=[
            {'symbol': 'GFS', 'position': 100},
            {'symbol': 'AMD', 'position': 50}
        ],
        trades=[
            {'symbol': 'GFS', 'action': 'BUY', 'quantity': 100, 'price': 43.10}
        ]
    )
    
    # 测试开盘提醒
    print("\n4️⃣ 测试开盘提醒...")
    notifier.send_market_open_reminder(
        premarket_movers=[
            {'symbol': 'AMKR', 'change': 5.2},
            {'symbol': 'INTC', 'change': -2.1}
        ]
    )
    
    print("\n✅ 测试完成!")


if __name__ == "__main__":
    test_notifications()
