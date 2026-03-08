#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
数据可视化工具 - Data Visualization Tool
作者：虾虾
创建时间：2026-02-08
用途：生成专业图表，股价走势，技术指标，组合收益
"""

import matplotlib.pyplot as plt
import yfinance as yf
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import os


class Visualizer:
    """数据可视化工具"""
    
    def __init__(self):
        self.output_dir = os.path.expanduser("~/.openclaw/workspace/图表输出")
        os.makedirs(self.output_dir, exist_ok=True)
        
    def plot_stock_chart(self, symbol, period="3mo", save=True):
        """
        绘制股价走势图
        """
        try:
            stock = yf.Ticker(symbol)
            data = stock.history(period=period)
            
            if data.empty:
                print(f"❌ 无法获取{symbol}数据")
                return None
            
            fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(12, 8), 
                                           gridspec_kw={'height_ratios': [3, 1]})
            
            # 股价
            ax1.plot(data.index, data['Close'], label='Close', linewidth=2)
            ax1.plot(data.index, data['Close'].rolling(20).mean(), label='SMA20', alpha=0.7)
            ax1.plot(data.index, data['Close'].rolling(50).mean(), label='SMA50', alpha=0.7)
            ax1.set_title(f'{symbol} Stock Price', fontsize=14, fontweight='bold')
            ax1.set_ylabel('Price ($)')
            ax1.legend()
            ax1.grid(True, alpha=0.3)
            
            # 成交量
            ax2.bar(data.index, data['Volume'], alpha=0.7, color='gray')
            ax2.set_ylabel('Volume')
            ax2.set_xlabel('Date')
            
            plt.tight_layout()
            
            if save:
                filename = f"{self.output_dir}/{symbol}_chart_{datetime.now().strftime('%Y%m%d')}.png"
                plt.savefig(filename, dpi=150, bbox_inches='tight')
                print(f"✅ 图表已保存: {filename}")
            
            return fig
            
        except Exception as e:
            print(f"❌ 绘图失败: {e}")
            return None
    
    def plot_technical_indicators(self, symbol):
        """
        绘制技术指标图
        """
        try:
            stock = yf.Ticker(symbol)
            data = stock.history(period="3mo")
            
            # 计算RSI
            delta = data['Close'].diff()
            gain = (delta.where(delta > 0, 0)).rolling(window=14).mean()
            loss = (-delta.where(delta < 0, 0)).rolling(window=14).mean()
            rs = gain / loss
            data['RSI'] = 100 - (100 / (1 + rs))
            
            # 计算MACD
            exp1 = data['Close'].ewm(span=12).mean()
            exp2 = data['Close'].ewm(span=26).mean()
            data['MACD'] = exp1 - exp2
            data['Signal'] = data['MACD'].ewm(span=9).mean()
            
            fig, (ax1, ax2, ax3) = plt.subplots(3, 1, figsize=(12, 10))
            
            # 股价
            ax1.plot(data.index, data['Close'], label='Close')
            ax1.set_title(f'{symbol} Technical Analysis', fontsize=14, fontweight='bold')
            ax1.set_ylabel('Price ($)')
            ax1.legend()
            ax1.grid(True, alpha=0.3)
            
            # RSI
            ax2.plot(data.index, data['RSI'], label='RSI', color='purple')
            ax2.axhline(y=70, color='r', linestyle='--', alpha=0.5)
            ax2.axhline(y=30, color='g', linestyle='--', alpha=0.5)
            ax2.set_ylabel('RSI')
            ax2.set_ylim(0, 100)
            ax2.legend()
            ax2.grid(True, alpha=0.3)
            
            # MACD
            ax3.plot(data.index, data['MACD'], label='MACD', color='blue')
            ax3.plot(data.index, data['Signal'], label='Signal', color='red')
            ax3.set_ylabel('MACD')
            ax3.set_xlabel('Date')
            ax3.legend()
            ax3.grid(True, alpha=0.3)
            
            plt.tight_layout()
            
            filename = f"{self.output_dir}/{symbol}_technical_{datetime.now().strftime('%Y%m%d')}.png"
            plt.savefig(filename, dpi=150, bbox_inches='tight')
            print(f"✅ 技术指标图已保存: {filename}")
            
            return fig
            
        except Exception as e:
            print(f"❌ 绘图失败: {e}")
            return None
    
    def plot_portfolio_performance(self, portfolio_data):
        """
        绘制组合收益图
        """
        # 这里将生成组合收益曲线
        pass


if __name__ == "__main__":
    viz = Visualizer()
    
    import sys
    if len(sys.argv) > 1:
        symbol = sys.argv[1].upper()
        print(f"🦐 生成{symbol}图表...")
        viz.plot_stock_chart(symbol)
        viz.plot_technical_indicators(symbol)
    else:
        print("🦐 数据可视化工具")
        print("用法: python visualization.py <股票代码>")
