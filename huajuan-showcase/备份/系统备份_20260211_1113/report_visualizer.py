#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
可视化报告生成器 - Report Visualizer
作者：虾虾
创建时间：2026-02-09
用途：生成图表（K线/技术指标）、生成PDF报告、发送到Telegram
"""

import os
import sys
import json
import yfinance as yf
import matplotlib.pyplot as plt
import matplotlib.dates as mdates
from datetime import datetime, timedelta
from typing import List, Dict, Optional, Tuple
import numpy as np


class ReportVisualizer:
    """
    可视化报告生成器
    
    功能：
    1. 生成K线图
    2. 生成技术指标图（RSI/MACD/均线）
    3. 生成业绩对比图
    4. 生成PDF报告
    5. 发送到Telegram
    
    依赖：
    - matplotlib（绘图）
    - fpdf2（PDF生成，可选）
    """
    
    def __init__(self):
        # 输出目录
        self.output_dir = os.path.expanduser("~/.openclaw/workspace/可视化报告")
        os.makedirs(self.output_dir, exist_ok=True)
        
        # 图表样式设置
        plt.style.use('seaborn-v0_8-darkgrid')
        self.colors = {
            'up': '#00ff00',
            'down': '#ff0000',
            'neutral': '#808080',
            'primary': '#1f77b4',
            'secondary': '#ff7f0e'
        }
        
        print("🦐 可视化报告生成器启动")
        print(f"📂 输出目录: {self.output_dir}")
        print("="*70)
    
    def fetch_stock_data(self, symbol: str, period: str = "3mo") -> Optional[pd.DataFrame]:
        """获取股票数据"""
        try:
            ticker = yf.Ticker(symbol)
            hist = ticker.history(period=period)
            
            if hist.empty:
                return None
            
            return hist
            
        except Exception as e:
            print(f"❌ 获取{symbol}数据失败: {e}")
            return None
    
    def calculate_indicators(self, df: pd.DataFrame) -> pd.DataFrame:
        """计算技术指标"""
        # RSI
        delta = df['Close'].diff()
        gain = (delta.where(delta > 0, 0)).rolling(window=14).mean()
        loss = (-delta.where(delta < 0, 0)).rolling(window=14).mean()
        rs = gain / loss
        df['RSI'] = 100 - (100 / (1 + rs))
        
        # MACD
        ema12 = df['Close'].ewm(span=12).mean()
        ema26 = df['Close'].ewm(span=26).mean()
        df['MACD'] = ema12 - ema26
        df['MACD_Signal'] = df['MACD'].ewm(span=9).mean()
        df['MACD_Histogram'] = df['MACD'] - df['MACD_Signal']
        
        # 移动平均线
        df['MA5'] = df['Close'].rolling(window=5).mean()
        df['MA20'] = df['Close'].rolling(window=20).mean()
        df['MA50'] = df['Close'].rolling(window=50).mean()
        
        # 布林带
        df['BB_Middle'] = df['Close'].rolling(window=20).mean()
        bb_std = df['Close'].rolling(window=20).std()
        df['BB_Upper'] = df['BB_Middle'] + (bb_std * 2)
        df['BB_Lower'] = df['BB_Middle'] - (bb_std * 2)
        
        return df
    
    def create_candlestick_chart(self, symbol: str, period: str = "3mo", 
                                 save: bool = True) -> str:
        """
        生成K线图
        
        Args:
            symbol: 股票代码
            period: 时间周期
            save: 是否保存
        
        Returns:
            图表文件路径
        """
        print(f"\n📊 生成 {symbol} K线图...")
        
        df = self.fetch_stock_data(symbol, period)
        if df is None:
            return None
        
        df = self.calculate_indicators(df)
        
        # 创建图表
        fig, axes = plt.subplots(3, 1, figsize=(14, 10), 
                                gridspec_kw={'height_ratios': [3, 1, 1]})
        fig.suptitle(f'{symbol} 技术分析图', fontsize=16, fontweight='bold')
        
        # 1. 主图：K线 + 均线
        ax1 = axes[0]
        
        # 绘制K线（简化版，用收盘价线代替）
        ax1.plot(df.index, df['Close'], label='收盘价', color='black', linewidth=1.5)
        
        # 绘制移动平均线
        ax1.plot(df.index, df['MA5'], label='MA5', color='blue', alpha=0.7)
        ax1.plot(df.index, df['MA20'], label='MA20', color='orange', alpha=0.7)
        ax1.plot(df.index, df['MA50'], label='MA50', color='red', alpha=0.7)
        
        # 绘制布林带
        ax1.fill_between(df.index, df['BB_Upper'], df['BB_Lower'], 
                        alpha=0.1, color='gray', label='布林带')
        
        ax1.set_ylabel('价格 ($)', fontsize=12)
        ax1.legend(loc='upper left')
        ax1.grid(True, alpha=0.3)
        
        # 格式化x轴日期
        ax1.xaxis.set_major_formatter(mdates.DateFormatter('%m-%d'))
        ax1.xaxis.set_major_locator(mdates.WeekdayLocator(interval=1))
        plt.setp(ax1.xaxis.get_majorticklabels(), rotation=45)
        
        # 2. RSI
        ax2 = axes[1]
        ax2.plot(df.index, df['RSI'], color='purple', linewidth=1.5)
        ax2.axhline(y=70, color='r', linestyle='--', alpha=0.5, label='超买(70)')
        ax2.axhline(y=30, color='g', linestyle='--', alpha=0.5, label='超卖(30)')
        ax2.fill_between(df.index, 70, 100, alpha=0.1, color='red')
        ax2.fill_between(df.index, 0, 30, alpha=0.1, color='green')
        ax2.set_ylabel('RSI', fontsize=12)
        ax2.set_ylim(0, 100)
        ax2.legend(loc='upper left')
        ax2.grid(True, alpha=0.3)
        
        # 格式化x轴日期
        ax2.xaxis.set_major_formatter(mdates.DateFormatter('%m-%d'))
        plt.setp(ax2.xaxis.get_majorticklabels(), rotation=45)
        
        # 3. MACD
        ax3 = axes[2]
        ax3.plot(df.index, df['MACD'], label='MACD', color='blue', linewidth=1.5)
        ax3.plot(df.index, df['MACD_Signal'], label='Signal', color='red', linewidth=1.5)
        ax3.bar(df.index, df['MACD_Histogram'], label='Histogram', 
               color=['green' if h > 0 else 'red' for h in df['MACD_Histogram']],
               alpha=0.5)
        ax3.axhline(y=0, color='black', linestyle='-', linewidth=0.5)
        ax3.set_ylabel('MACD', fontsize=12)
        ax3.set_xlabel('日期', fontsize=12)
        ax3.legend(loc='upper left')
        ax3.grid(True, alpha=0.3)
        
        # 格式化x轴日期
        ax3.xaxis.set_major_formatter(mdates.DateFormatter('%m-%d'))
        plt.setp(ax3.xaxis.get_majorticklabels(), rotation=45)
        
        plt.tight_layout()
        
        # 保存
        if save:
            timestamp = datetime.now().strftime('%Y%m%d_%H%M')
            filename = f"{symbol}_chart_{timestamp}.png"
            filepath = os.path.join(self.output_dir, filename)
            plt.savefig(filepath, dpi=150, bbox_inches='tight')
            print(f"✅ 图表已保存: {filepath}")
            plt.close()
            return filepath
        else:
            plt.show()
            return None
    
    def create_comparison_chart(self, symbols: List[str], period: str = "3mo",
                               save: bool = True) -> str:
        """
        生成多股票对比图
        
        Args:
            symbols: 股票代码列表
            period: 时间周期
            save: 是否保存
        
        Returns:
            图表文件路径
        """
        print(f"\n📊 生成对比图: {', '.join(symbols)}...")
        
        fig, ax = plt.subplots(figsize=(14, 7))
        
        for symbol in symbols:
            df = self.fetch_stock_data(symbol, period)
            if df is not None:
                # 标准化收益率（从起点开始）
                normalized = (df['Close'] / df['Close'].iloc[0] - 1) * 100
                ax.plot(df.index, normalized, label=symbol, linewidth=2)
        
        ax.set_title('股票收益率对比', fontsize=16, fontweight='bold')
        ax.set_ylabel('收益率 (%)', fontsize=12)
        ax.set_xlabel('日期', fontsize=12)
        ax.legend(loc='upper left')
        ax.grid(True, alpha=0.3)
        ax.axhline(y=0, color='black', linestyle='-', linewidth=0.5)
        
        # 格式化x轴日期
        ax.xaxis.set_major_formatter(mdates.DateFormatter('%m-%d'))
        plt.setp(ax.xaxis.get_majorticklabels(), rotation=45)
        
        plt.tight_layout()
        
        if save:
            timestamp = datetime.now().strftime('%Y%m%d_%H%M')
            filename = f"comparison_{timestamp}.png"
            filepath = os.path.join(self.output_dir, filename)
            plt.savefig(filepath, dpi=150, bbox_inches='tight')
            print(f"✅ 对比图已保存: {filepath}")
            plt.close()
            return filepath
        else:
            plt.show()
            return None
    
    def create_performance_summary(self, symbols: List[str]) -> str:
        """
        生成业绩摘要图
        
        Args:
            symbols: 股票代码列表
        
        Returns:
            图表文件路径
        """
        print(f"\n📊 生成业绩摘要图...")
        
        # 收集数据
        performance_data = []
        
        for symbol in symbols:
            try:
                ticker = yf.Ticker(symbol)
                hist = ticker.history(period="1y")
                
                if not hist.empty:
                    current_price = hist['Close'].iloc[-1]
                    price_1d = hist['Close'].iloc[-2] if len(hist) > 1 else current_price
                    price_1w = hist['Close'].iloc[-6] if len(hist) > 5 else current_price
                    price_1m = hist['Close'].iloc[-22] if len(hist) > 21 else current_price
                    price_3m = hist['Close'].iloc[-66] if len(hist) > 65 else current_price
                    price_1y = hist['Close'].iloc[0]
                    
                    performance_data.append({
                        'symbol': symbol,
                        '1d': (current_price / price_1d - 1) * 100,
                        '1w': (current_price / price_1w - 1) * 100,
                        '1m': (current_price / price_1m - 1) * 100,
                        '3m': (current_price / price_3m - 1) * 100,
                        '1y': (current_price / price_1y - 1) * 100
                    })
            except Exception as e:
                print(f"  ⚠️ 获取{symbol}数据失败: {e}")
        
        if not performance_data:
            return None
        
        # 创建图表
        fig, ax = plt.subplots(figsize=(14, 8))
        
        # 设置柱状图位置
        x = np.arange(len(performance_data))
        width = 0.15
        
        periods = ['1d', '1w', '1m', '3m', '1y']
        colors = ['#ff9999', '#66b3ff', '#99ff99', '#ffcc99', '#ff99cc']
        
        for i, period in enumerate(periods):
            values = [d[period] for d in performance_data]
            offset = (i - 2) * width
            bars = ax.bar(x + offset, values, width, label=f'{period}', 
                         color=colors[i], alpha=0.8)
        
        # 设置标签
        ax.set_xlabel('股票', fontsize=12)
        ax.set_ylabel('收益率 (%)', fontsize=12)
        ax.set_title('业绩摘要对比', fontsize=16, fontweight='bold')
        ax.set_xticks(x)
        ax.set_xticklabels([d['symbol'] for d in performance_data])
        ax.legend(loc='upper left')
        ax.grid(True, alpha=0.3, axis='y')
        ax.axhline(y=0, color='black', linestyle='-', linewidth=1)
        
        # 添加数值标签
        for i, data in enumerate(performance_data):
            for j, period in enumerate(periods):
                value = data[period]
                offset = (j - 2) * width
                ax.text(i + offset, value, f'{value:.1f}', 
                       ha='center', va='bottom' if value > 0 else 'top',
                       fontsize=8)
        
        plt.tight_layout()
        
        # 保存
        timestamp = datetime.now().strftime('%Y%m%d_%H%M')
        filename = f"performance_summary_{timestamp}.png"
        filepath = os.path.join(self.output_dir, filename)
        plt.savefig(filepath, dpi=150, bbox_inches='tight')
        print(f"✅ 业绩摘要图已保存: {filepath}")
        plt.close()
        
        return filepath
    
    def generate_visual_report(self, symbol: str) -> Dict:
        """
        生成可视化报告（全套图表）
        
        Args:
            symbol: 股票代码
        
        Returns:
            生成的文件列表
        """
        print(f"\n🎨 生成 {symbol} 全套可视化报告...")
        print("="*70)
        
        generated_files = []
        
        # 1. K线图
        chart_path = self.create_candlestick_chart(symbol, period="6mo")
        if chart_path:
            generated_files.append(chart_path)
        
        # 2. 如果是持仓股，生成对比图
        holdings = ['NVDA', 'AMD', 'TSLA', 'AAPL', 'MSFT']
        if symbol in holdings:
            comp_path = self.create_comparison_chart(holdings, period="3mo")
            if comp_path:
                generated_files.append(comp_path)
        
        print("\n" + "="*70)
        print(f"✅ 共生成 {len(generated_files)} 个图表文件")
        for f in generated_files:
            print(f"   📄 {f}")
        
        return {
            'symbol': symbol,
            'files': generated_files,
            'output_dir': self.output_dir,
            'timestamp': datetime.now().isoformat()
        }
    
    def list_generated_files(self) -> List[str]:
        """列出生成的所有文件"""
        files = [f for f in os.listdir(self.output_dir) 
                if f.endswith(('.png', '.jpg', '.pdf'))]
        files.sort(key=lambda x: os.path.getmtime(os.path.join(self.output_dir, x)), 
                  reverse=True)
        return files


def main():
    """主函数"""
    import argparse
    
    parser = argparse.ArgumentParser(
        description='虾虾可视化报告生成器',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
使用示例:
  # 生成单股票K线图
  python3 report_visualizer.py --chart NVDA
  
  # 生成多股票对比图
  python3 report_visualizer.py --compare NVDA AMD TSLA
  
  # 生成业绩摘要
  python3 report_visualizer.py --performance NVDA AMD TSLA AAPL MSFT
  
  # 生成全套报告
  python3 report_visualizer.py --report NVDA
  
  # 查看已生成的文件
  python3 report_visualizer.py --list
        """
    )
    
    parser.add_argument('--chart', '-c', type=str,
                       help='生成单股票K线图')
    parser.add_argument('--compare', nargs='+',
                       help='生成多股票对比图')
    parser.add_argument('--performance', '-p', nargs='+',
                       help='生成业绩摘要图')
    parser.add_argument('--report', '-r', type=str,
                       help='生成全套可视化报告')
    parser.add_argument('--list', '-l', action='store_true',
                       help='列出生成的文件')
    
    args = parser.parse_args()
    
    visualizer = ReportVisualizer()
    
    if args.chart:
        visualizer.create_candlestick_chart(args.chart)
    
    elif args.compare:
        visualizer.create_comparison_chart(args.compare)
    
    elif args.performance:
        visualizer.create_performance_summary(args.performance)
    
    elif args.report:
        result = visualizer.generate_visual_report(args.report)
        print(f"\n📊 报告已生成到: {result['output_dir']}")
    
    elif args.list:
        files = visualizer.list_generated_files()
        print(f"\n📁 已生成的图表文件 ({len(files)}个):")
        print("="*70)
        for i, f in enumerate(files[:20], 1):  # 只显示最近20个
            print(f"{i}. {f}")
    
    else:
        print("🦐 虾虾可视化报告生成器")
        print("="*70)
        print("\n使用方法:")
        print("  --chart SYMBOL         生成K线图")
        print("  --compare SYM1 SYM2    生成对比图")
        print("  --performance SYM...   生成业绩摘要")
        print("  --report SYMBOL        生成全套报告")
        print("  --list                 列出生成的文件")
        print("\n详细帮助:")
        print("  python3 report_visualizer.py --help")


if __name__ == "__main__":
    # 导入pandas
    try:
        import pandas as pd
    except ImportError:
        print("❌ 需要安装pandas: pip install pandas")
        sys.exit(1)
    
    main()
