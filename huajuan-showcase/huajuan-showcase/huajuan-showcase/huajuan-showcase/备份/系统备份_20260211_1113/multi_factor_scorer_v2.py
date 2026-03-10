#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
多因子评分模型 v2.0 - IBKR版本
优先使用IBKR数据，降级使用yfinance
"""

import os
import sys
import json
import subprocess
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from typing import List, Dict, Optional, Tuple

# 导入IBKR数据提供器
sys.path.insert(0, '/Users/fox/.openclaw/workspace/tools')
from ibkr_data_provider import IBKRDataProvider


class MultiFactorScorerV2:
    """
    多因子评分模型 v2.0
    
    数据源优先级：
    1. IBKR (最准确)
    2. yfinance (备用)
    
    整合维度：
    1. 技术面 (25%)
    2. 基本面 (25%)
    3. 情绪面 (20%)
    4. 资金面 (20%)
    5. 宏观面 (10%)
    """
    
    def __init__(self):
        # 权重配置
        self.weights = {
            'technical': 0.25,
            'fundamental': 0.25,
            'sentiment': 0.20,
            'fund_flow': 0.20,
            'macro': 0.10
        }
        
        # 阈值
        self.thresholds = {
            'strong_buy': 85,
            'buy': 70,
            'neutral_high': 60,
            'neutral_low': 40,
            'sell': 30,
            'strong_sell': 15
        }
        
        # 尝试连接IBKR
        self.ibkr = IBKRDataProvider()
        self.use_ibkr = self.ibkr.connect(timeout=5)
        
        if self.use_ibkr:
            print("✅ 使用IBKR数据源")
        else:
            print("⚠️  IBKR不可用，降级使用yfinance")
            import yfinance as yf
            self.yf = yf
    
    def __del__(self):
        """析构时断开IBKR连接"""
        if hasattr(self, 'ibkr') and self.ibkr:
            self.ibkr.disconnect()
    
    def get_historical_data(self, symbol: str, period: str = "6mo") -> Optional[pd.DataFrame]:
        """获取历史数据 (优先IBKR)"""
        # 尝试IBKR
        if self.use_ibkr:
            bars = self.ibkr.get_historical_data(symbol, duration="6 M", bar_size="1 day")
            if bars:
                # 转换为DataFrame
                data = []
                for bar in bars:
                    data.append({
                        'Open': bar.open,
                        'High': bar.high,
                        'Low': bar.low,
                        'Close': bar.close,
                        'Volume': bar.volume
                    })
                df = pd.DataFrame(data)
                return df
        
        # 降级使用yfinance
        try:
            import yfinance as yf
            ticker = yf.Ticker(symbol)
            hist = ticker.history(period=period)
            return hist if not hist.empty else None
        except:
            return None
    
    def get_current_price(self, symbol: str) -> Optional[float]:
        """获取当前价格 (优先IBKR)"""
        if self.use_ibkr:
            price = self.ibkr.get_current_price(symbol)
            if price:
                return price
        
        # 降级使用yfinance
        try:
            import yfinance as yf
            ticker = yf.Ticker(symbol)
            info = ticker.info
            return info.get('currentPrice') or info.get('regularMarketPrice')
        except:
            return None
    
    def calculate_technical_score(self, symbol: str) -> Dict:
        """技术面评分"""
        print(f"  📈 计算技术面评分...")
        
        hist = self.get_historical_data(symbol)
        if hist is None or len(hist) < 50:
            return {'score': 50, 'details': {}, 'error': '数据不足'}
        
        scores = {}
        current_price = hist['Close'].iloc[-1]
        
        # 1. 趋势方向
        ma20 = hist['Close'].rolling(20).mean().iloc[-1]
        ma50 = hist['Close'].rolling(50).mean().iloc[-1]
        
        if current_price > ma20 > ma50:
            trend_score = 90
        elif current_price > ma20:
            trend_score = 70
        elif current_price > ma50:
            trend_score = 50
        else:
            trend_score = 30
        scores['trend'] = trend_score
        
        # 2. 动量 (RSI简化版)
        delta = hist['Close'].diff()
        gain = (delta.where(delta > 0, 0)).rolling(window=14).mean()
        loss = (-delta.where(delta < 0, 0)).rolling(window=14).mean()
        rs = gain / loss
        rsi = 100 - (100 / (1 + rs))
        current_rsi = rsi.iloc[-1]
        
        if 50 <= current_rsi <= 70:
            momentum_score = 80
        elif 40 <= current_rsi < 50:
            momentum_score = 70
        elif 30 <= current_rsi < 40:
            momentum_score = 50
        else:
            momentum_score = 40
        scores['momentum'] = momentum_score
        
        # 3. 波动率 (ATR简化)
        high_low = hist['High'] - hist['Low']
        high_close = abs(hist['High'] - hist['Close'].shift())
        low_close = abs(hist['Low'] - hist['Close'].shift())
        ranges = pd.concat([high_low, high_close, low_close], axis=1)
        true_range = ranges.max(axis=1)
        atr = true_range.rolling(14).mean()
        current_atr = atr.iloc[-1]
        avg_price = hist['Close'].mean()
        volatility = current_atr / avg_price
        
        if 0.02 <= volatility <= 0.04:
            volatility_score = 80
        elif volatility < 0.02:
            volatility_score = 60
        else:
            volatility_score = 50
        scores['volatility'] = volatility_score
        
        # 综合技术面评分
        technical_score = (
            scores['trend'] * 0.4 +
            scores['momentum'] * 0.3 +
            scores['volatility'] * 0.3
        )
        
        return {
            'score': round(technical_score, 1),
            'details': scores
        }
    
    def calculate_fundamental_score(self, symbol: str) -> Dict:
        """基本面评分"""
        print(f"  📊 计算基本面评分...")
        
        # 从yfinance获取基本面数据
        try:
            import yfinance as yf
            ticker = yf.Ticker(symbol)
            info = ticker.info
            
            scores = {}
            
            # 盈利能力
            roe = info.get('returnOnEquity', 0)
            if roe and roe > 0.15:
                scores['profitability'] = 90
            elif roe and roe > 0.10:
                scores['profitability'] = 70
            else:
                scores['profitability'] = 50
            
            # 估值
            pe = info.get('trailingPE', 0)
            if pe and 10 <= pe <= 25:
                scores['valuation'] = 80
            elif pe and pe < 10:
                scores['valuation'] = 70
            else:
                scores['valuation'] = 50
            
            # 成长性
            growth = info.get('earningsGrowth', 0)
            if growth and growth > 0.20:
                scores['growth'] = 90
            elif growth and growth > 0.10:
                scores['growth'] = 75
            else:
                scores['growth'] = 50
            
            fundamental_score = sum(scores.values()) / len(scores)
            
            return {
                'score': round(fundamental_score, 1),
                'details': scores
            }
        except:
            return {'score': 50, 'details': {}, 'error': '数据获取失败'}
    
    def calculate_sentiment_score(self, symbol: str) -> Dict:
        """情绪面评分"""
        print(f"  😊 计算情绪面评分...")
        
        # 简化版：基于价格动量
        hist = self.get_historical_data(symbol, period="1mo")
        if hist is None or len(hist) < 5:
            return {'score': 50, 'details': {}}
        
        # 短期动量
        price_1d = hist['Close'].iloc[-1]
        price_5d = hist['Close'].iloc[-5]
        momentum_5d = (price_1d / price_5d - 1) * 100
        
        if momentum_5d > 5:
            sentiment_score = 80
        elif momentum_5d > 0:
            sentiment_score = 70
        elif momentum_5d > -5:
            sentiment_score = 50
        else:
            sentiment_score = 40
        
        return {
            'score': sentiment_score,
            'details': {'5d_momentum': round(momentum_5d, 2)}
        }
    
    def calculate_fund_flow_score(self, symbol: str) -> Dict:
        """资金面评分"""
        print(f"  💰 计算资金面评分...")
        
        hist = self.get_historical_data(symbol, period="1mo")
        if hist is None or len(hist) < 5:
            return {'score': 50, 'details': {}}
        
        # 成交量分析
        recent_volume = hist['Volume'].tail(5).mean()
        avg_volume = hist['Volume'].mean()
        volume_ratio = recent_volume / avg_volume if avg_volume > 0 else 1
        
        if volume_ratio > 1.5:
            fund_flow_score = 80
        elif volume_ratio > 1.2:
            fund_flow_score = 70
        elif volume_ratio > 0.8:
            fund_flow_score = 60
        else:
            fund_flow_score = 40
        
        return {
            'score': fund_flow_score,
            'details': {'volume_ratio': round(volume_ratio, 2)}
        }
    
    def calculate_macro_score(self, symbol: str) -> Dict:
        """宏观面评分"""
        print(f"  🌍 计算宏观面评分...")
        
        # 简化：默认中性
        return {
            'score': 60,
            'details': {'market_condition': 'neutral'}
        }
    
    def calculate_overall_score(self, symbol: str) -> Dict:
        """计算综合评分"""
        print(f"\n🎯 开始评分: {symbol}")
        print("-"*70)
        
        # 计算各维度评分
        technical = self.calculate_technical_score(symbol)
        fundamental = self.calculate_fundamental_score(symbol)
        sentiment = self.calculate_sentiment_score(symbol)
        fund_flow = self.calculate_fund_flow_score(symbol)
        macro = self.calculate_macro_score(symbol)
        
        # 综合评分
        overall_score = (
            technical['score'] * self.weights['technical'] +
            fundamental['score'] * self.weights['fundamental'] +
            sentiment['score'] * self.weights['sentiment'] +
            fund_flow['score'] * self.weights['fund_flow'] +
            macro['score'] * self.weights['macro']
        )
        
        # 投资建议
        if overall_score >= self.thresholds['strong_buy']:
            recommendation = 'STRONG_BUY'
        elif overall_score >= self.thresholds['buy']:
            recommendation = 'BUY'
        elif overall_score >= self.thresholds['neutral_high']:
            recommendation = 'NEUTRAL_BULLISH'
        elif overall_score >= self.thresholds['neutral_low']:
            recommendation = 'NEUTRAL'
        elif overall_score >= self.thresholds['sell']:
            recommendation = 'NEUTRAL_BEARISH'
        else:
            recommendation = 'SELL'
        
        result = {
            'symbol': symbol,
            'timestamp': datetime.now().isoformat(),
            'overall_score': round(overall_score, 1),
            'recommendation': recommendation,
            'breakdown': {
                'technical': technical,
                'fundamental': fundamental,
                'sentiment': sentiment,
                'fund_flow': fund_flow,
                'macro': macro
            },
            'data_source': 'IBKR' if self.use_ibkr else 'yfinance'
        }
        
        # 打印结果
        print(f"\n📊 评分结果:")
        print(f"  综合评分: {result['overall_score']}/100")
        print(f"  投资建议: {result['recommendation']}")
        print(f"  数据来源: {result['data_source']}")
        print(f"  技术面: {technical['score']}")
        print(f"  基本面: {fundamental['score']}")
        print(f"  情绪面: {sentiment['score']}")
        print(f"  资金面: {fund_flow['score']}")
        print(f"  宏观面: {macro['score']}")
        
        return result


def main():
    """主函数"""
    import argparse
    
    parser = argparse.ArgumentParser(description='多因子评分模型 v2.0')
    parser.add_argument('--symbol', type=str, required=True, help='股票代码')
    parser.add_argument('--output', type=str, help='输出JSON文件')
    
    args = parser.parse_args()
    
    # 创建评分器
    scorer = MultiFactorScorerV2()
    
    # 计算评分
    result = scorer.calculate_overall_score(args.symbol)
    
    # 保存结果
    if args.output:
        with open(args.output, 'w') as f:
            json.dump(result, f, indent=2)
        print(f"\n✅ 结果已保存: {args.output}")
    
    # 断开连接
    scorer.ibkr.disconnect()
    
    return result


if __name__ == "__main__":
    main()
