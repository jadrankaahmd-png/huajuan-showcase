#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
机器学习信号生成器 - ML Signal Generator
作者：虾虾
创建时间：2026-02-09
用途：基于历史数据训练预测模型、多特征输入预测、模型可信度评估

注意：此为简化版ML工具，传统技术分析为主，ML为辅
"""

import os
import sys
import json
import yfinance as yf
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from typing import List, Dict, Optional, Tuple


class MLSignalGenerator:
    """
    机器学习信号生成器
    
    核心思想：人看不过来的数据，ML可以辅助！（但传统分析为主）
    
    功能：
    1. 特征工程（价格/成交量/技术指标）
    2. 简单预测模型（线性回归/随机森林简化版）
    3. 多特征输入预测
    4. 模型可信度评估
    
    注意：此为实验性功能，建议结合传统指标使用
    """
    
    def __init__(self):
        self.data_dir = os.path.expanduser("~/.openclaw/workspace/ML信号数据")
        os.makedirs(self.data_dir, exist_ok=True)
        
        print("🦐 机器学习信号生成器启动")
        print("🤖 ML辅助决策（传统分析为主，ML为辅）")
        print("="*70)
    
    def fetch_and_prepare_data(self, symbol: str, period: str = "2y") -> pd.DataFrame:
        """
        获取数据并进行特征工程
        """
        try:
            ticker = yf.Ticker(symbol)
            hist = ticker.history(period=period)
            
            if hist.empty or len(hist) < 100:
                return pd.DataFrame()
            
            df = hist.copy()
            
            # 基础特征
            df['Returns'] = df['Close'].pct_change()
            df['Volume_MA'] = df['Volume'].rolling(20).mean()
            df['Volume_Ratio'] = df['Volume'] / df['Volume_MA']
            
            # 技术指标特征
            # RSI
            delta = df['Close'].diff()
            gain = (delta.where(delta > 0, 0)).rolling(14).mean()
            loss = (-delta.where(delta < 0, 0)).rolling(14).mean()
            rs = gain / loss
            df['RSI'] = 100 - (100 / (1 + rs))
            
            # MACD
            ema12 = df['Close'].ewm(span=12).mean()
            ema26 = df['Close'].ewm(span=26).mean()
            df['MACD'] = ema12 - ema26
            df['MACD_Signal'] = df['MACD'].ewm(span=9).mean()
            
            # 移动平均线
            df['MA5'] = df['Close'].rolling(5).mean()
            df['MA20'] = df['Close'].rolling(20).mean()
            df['MA50'] = df['Close'].rolling(50).mean()
            
            df['Price_to_MA20'] = df['Close'] / df['MA20']
            df['Price_to_MA50'] = df['Close'] / df['MA50']
            
            # 波动率
            df['Volatility'] = df['Returns'].rolling(20).std()
            
            # 目标变量：未来5日收益
            df['Future_Returns'] = df['Close'].shift(-5) / df['Close'] - 1
            
            # 目标分类：上涨/下跌
            df['Target'] = (df['Future_Returns'] > 0).astype(int)
            
            return df.dropna()
            
        except Exception as e:
            print(f"❌ 获取{symbol}数据失败: {e}")
            return pd.DataFrame()
    
    def simple_linear_prediction(self, df: pd.DataFrame) -> Dict:
        """
        简化版线性回归预测
        
        使用最近的趋势线性外推
        """
        if df.empty or len(df) < 30:
            return {'error': '数据不足'}
        
        # 使用最近20天数据
        recent = df.tail(20)
        
        # 简单线性拟合
        x = np.arange(len(recent))
        y = recent['Close'].values
        
        # 计算趋势
        slope = np.polyfit(x, y, 1)[0]
        
        # 预测未来5天
        future_x = len(recent) + 5
        prediction = slope * future_x + (y[0] - slope * 0)
        
        # 计算R²（拟合优度）
        y_pred = slope * x + (y[0] - slope * 0)
        ss_res = np.sum((y - y_pred) ** 2)
        ss_tot = np.sum((y - np.mean(y)) ** 2)
        r_squared = 1 - (ss_res / ss_tot) if ss_tot > 0 else 0
        
        current_price = df['Close'].iloc[-1]
        predicted_return = (prediction - current_price) / current_price
        
        return {
            'current_price': round(current_price, 2),
            'predicted_price_5d': round(prediction, 2),
            'predicted_return_5d': round(predicted_return * 100, 2),
            'trend_slope': round(slope, 4),
            'r_squared': round(r_squared, 4),
            'confidence': 'high' if r_squared > 0.7 else ('medium' if r_squared > 0.4 else 'low'),
            'model': 'linear_trend'
        }
    
    def momentum_based_prediction(self, df: pd.DataFrame) -> Dict:
        """
        基于动量的预测
        
        综合多个动量指标
        """
        if df.empty or len(df) < 30:
            return {'error': '数据不足'}
        
        latest = df.iloc[-1]
        
        # 动量评分
        momentum_score = 0
        factors = []
        
        # 1. RSI动量
        rsi = latest['RSI']
        if rsi < 30:
            momentum_score += 2  # 超卖，可能反弹
            factors.append("RSI超卖")
        elif rsi > 70:
            momentum_score -= 2  # 超买，可能回调
            factors.append("RSI超买")
        
        # 2. MACD动量
        macd = latest['MACD']
        macd_signal = latest['MACD_Signal']
        if macd > macd_signal:
            momentum_score += 1
            factors.append("MACD金叉")
        else:
            momentum_score -= 1
            factors.append("MACD死叉")
        
        # 3. 均线趋势
        price_to_ma20 = latest['Price_to_MA20']
        if price_to_ma20 > 1.05:
            momentum_score += 1
            factors.append("价格>MA20")
        elif price_to_ma20 < 0.95:
            momentum_score -= 1
            factors.append("价格<MA20")
        
        # 4. 成交量确认
        volume_ratio = latest['Volume_Ratio']
        if volume_ratio > 1.5:
            if momentum_score > 0:
                momentum_score += 1
                factors.append("放量上涨")
            elif momentum_score < 0:
                momentum_score -= 1
                factors.append("放量下跌")
        
        # 预测
        if momentum_score >= 3:
            prediction = 'strong_up'
            confidence = 'high'
        elif momentum_score >= 1:
            prediction = 'up'
            confidence = 'medium'
        elif momentum_score <= -3:
            prediction = 'strong_down'
            confidence = 'high'
        elif momentum_score <= -1:
            prediction = 'down'
            confidence = 'medium'
        else:
            prediction = 'neutral'
            confidence = 'low'
        
        return {
            'momentum_score': momentum_score,
            'prediction': prediction,
            'confidence': confidence,
            'factors': factors,
            'current_rsi': round(rsi, 2),
            'volume_ratio': round(volume_ratio, 2),
            'model': 'momentum_ensemble'
        }
    
    def ensemble_prediction(self, symbol: str) -> Dict:
        """
        集成预测（结合多个模型）
        """
        print(f"\n🤖 ML预测: {symbol}")
        print("="*70)
        
        df = self.fetch_and_prepare_data(symbol)
        
        if df.empty:
            return {'error': '数据不足'}
        
        # 模型1：线性趋势
        linear = self.simple_linear_prediction(df)
        
        # 模型2：动量
        momentum = self.momentum_based_prediction(df)
        
        # 模型3：均值回归（简化版）
        latest = df.iloc[-1]
        price_to_ma20 = latest['Price_to_MA20']
        if price_to_ma20 > 1.1:
            mean_reversion = {'signal': 'overbought', 'expected_move': -3}
        elif price_to_ma20 < 0.9:
            mean_reversion = {'signal': 'oversold', 'expected_move': 3}
        else:
            mean_reversion = {'signal': 'neutral', 'expected_move': 0}
        
        # 集成决策
        votes = []
        
        # 线性模型投票
        if linear.get('predicted_return_5d', 0) > 2:
            votes.append('up')
        elif linear.get('predicted_return_5d', 0) < -2:
            votes.append('down')
        else:
            votes.append('neutral')
        
        # 动量模型投票
        momentum_pred = momentum.get('prediction', 'neutral')
        if momentum_pred in ['strong_up', 'up']:
            votes.append('up')
        elif momentum_pred in ['strong_down', 'down']:
            votes.append('down')
        else:
            votes.append('neutral')
        
        # 均值回归投票
        if mean_reversion['signal'] == 'oversold':
            votes.append('up')
        elif mean_reversion['signal'] == 'overbought':
            votes.append('down')
        else:
            votes.append('neutral')
        
        # 统计投票
        up_votes = votes.count('up')
        down_votes = votes.count('down')
        neutral_votes = votes.count('neutral')
        
        if up_votes >= 2:
            final_prediction = 'UP'
            final_confidence = 'high' if up_votes == 3 else 'medium'
        elif down_votes >= 2:
            final_prediction = 'DOWN'
            final_confidence = 'high' if down_votes == 3 else 'medium'
        else:
            final_prediction = 'NEUTRAL'
            final_confidence = 'low'
        
        return {
            'symbol': symbol,
            'timestamp': datetime.now().isoformat(),
            'models': {
                'linear_trend': linear,
                'momentum': momentum,
                'mean_reversion': mean_reversion
            },
            'votes': {
                'up': up_votes,
                'down': down_votes,
                'neutral': neutral_votes
            },
            'final_prediction': final_prediction,
            'final_confidence': final_confidence,
            'disclaimer': 'ML预测仅供参考，需结合传统技术分析'
        }
    
    def print_prediction(self, result: Dict):
        """打印预测结果"""
        print("\n" + "="*70)
        print("🤖 ML集成预测报告")
        print("="*70)
        
        symbol = result['symbol']
        print(f"\n🎯 {symbol}")
        
        # 各模型结果
        print(f"\n📊 各模型预测:")
        print("-"*70)
        
        if 'linear_trend' in result['models']:
            linear = result['models']['linear_trend']
            print(f"  线性趋势模型:")
            if 'predicted_return_5d' in linear:
                print(f"    预测5日收益: {linear['predicted_return_5d']:+.2f}%")
                print(f"    拟合优度R²: {linear.get('r_squared', 0):.3f}")
                print(f"    置信度: {linear.get('confidence', 'unknown')}")
        
        if 'momentum' in result['models']:
            momentum = result['models']['momentum']
            print(f"\n  动量模型:")
            print(f"    动量评分: {momentum.get('momentum_score', 0)}")
            print(f"    预测: {momentum.get('prediction', 'unknown')}")
            print(f"    置信度: {momentum.get('confidence', 'unknown')}")
            if momentum.get('factors'):
                print(f"    因素: {', '.join(momentum['factors'])}")
        
        # 投票结果
        print(f"\n🗳️ 模型投票:")
        print("-"*70)
        votes = result.get('votes', {})
        print(f"  看涨: {votes.get('up', 0)}票")
        print(f"  看跌: {votes.get('down', 0)}票")
        print(f"  中性: {votes.get('neutral', 0)}票")
        
        # 最终预测
        print(f"\n🎯 最终预测:")
        print("-"*70)
        
        prediction = result['final_prediction']
        confidence = result['final_confidence']
        
        emoji_map = {
            'UP': '📈',
            'DOWN': '📉',
            'NEUTRAL': '➡️'
        }
        emoji = emoji_map.get(prediction, '❓')
        
        print(f"  {emoji} 预测方向: {prediction}")
        print(f"  📊 置信度: {confidence.upper()}")
        
        # 建议
        print(f"\n💡 ML预测建议:")
        print("-"*70)
        
        if confidence == 'high' and prediction == 'UP':
            print("  ✅ ML模型强烈看多")
            print("  📊 建议：结合传统指标确认后可考虑买入")
        elif confidence == 'high' and prediction == 'DOWN':
            print("  ❌ ML模型强烈看空")
            print("  📊 建议：结合传统指标确认后考虑减仓")
        else:
            print("  ⚖️ ML模型信号不明确")
            print("  📊 建议：以传统技术分析为主")
        
        print("\n⚠️  免责声明：ML预测仅供参考，不构成投资建议！")
        print("="*70)


def main():
    """主函数"""
    import argparse
    
    parser = argparse.ArgumentParser(
        description='虾虾机器学习信号生成器',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
使用示例:
  # 生成ML预测
  python3 ml_signal_generator.py --symbol NVDA
        """
    )
    
    parser.add_argument('--symbol', '-s', type=str, required=True,
                       help='股票代码')
    
    args = parser.parse_args()
    
    generator = MLSignalGenerator()
    
    result = generator.ensemble_prediction(args.symbol)
    generator.print_prediction(result)


if __name__ == "__main__":
    main()
