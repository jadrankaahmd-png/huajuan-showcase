#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
股票筛选器 - Stock Screener
作者：虾虾
创建时间：2026-02-08
用途：基于多种条件筛选股票
"""

import yfinance as yf
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import sys

class StockScreener:
    """股票筛选器类"""
    
    def __init__(self):
        self.results = []
        
    def get_stock_data(self, symbol, period="1y"):
        """获取股票数据"""
        try:
            stock = yf.Ticker(symbol)
            hist = stock.history(period=period)
            info = stock.info
            return hist, info
        except Exception as e:
            print(f"❌ 获取{symbol}数据失败: {e}")
            return None, None
    
    def calculate_technical_indicators(self, hist):
        """计算技术指标"""
        if hist is None or len(hist) < 50:
            return None
        
        # 移动平均线
        hist['SMA_20'] = hist['Close'].rolling(window=20).mean()
        hist['SMA_50'] = hist['Close'].rolling(window=50).mean()
        
        # RSI
        delta = hist['Close'].diff()
        gain = (delta.where(delta > 0, 0)).rolling(window=14).mean()
        loss = (-delta.where(delta < 0, 0)).rolling(window=14).mean()
        rs = gain / loss
        hist['RSI'] = 100 - (100 / (1 + rs))
        
        # MACD
        exp1 = hist['Close'].ewm(span=12).mean()
        exp2 = hist['Close'].ewm(span=26).mean()
        hist['MACD'] = exp1 - exp2
        hist['MACD_Signal'] = hist['MACD'].ewm(span=9).mean()
        
        # 波动率
        hist['Volatility'] = hist['Close'].pct_change().rolling(window=20).std() * np.sqrt(252)
        
        return hist
    
    def screen_stock(self, symbol, criteria):
        """
        筛选单个股票
        criteria: 筛选条件字典
        """
        hist, info = self.get_stock_data(symbol)
        if hist is None or info is None:
            return None
        
        hist = self.calculate_technical_indicators(hist)
        if hist is None:
            return None
        
        current_price = hist['Close'][-1]
        current_rsi = hist['RSI'][-1]
        current_volatility = hist['Volatility'][-1]
        
        result = {
            'symbol': symbol,
            'name': info.get('longName', 'N/A'),
            'price': current_price,
            'rsi': current_rsi,
            'volatility': current_volatility,
            'market_cap': info.get('marketCap', 0),
            'pe_ratio': info.get('trailingPE', 0),
            'pb_ratio': info.get('priceToBook', 0),
            'sector': info.get('sector', 'N/A'),
            'passed': True,
            'reasons': []
        }
        
        # 应用筛选条件
        if 'min_price' in criteria and current_price < criteria['min_price']:
            result['passed'] = False
            result['reasons'].append(f"价格低于{criteria['min_price']}")
        
        if 'max_price' in criteria and current_price > criteria['max_price']:
            result['passed'] = False
            result['reasons'].append(f"价格高于{criteria['max_price']}")
        
        if 'rsi_range' in criteria:
            min_rsi, max_rsi = criteria['rsi_range']
            if current_rsi < min_rsi or current_rsi > max_rsi:
                result['passed'] = False
                result['reasons'].append(f"RSI不在{min_rsi}-{max_rsi}范围内")
        
        if 'min_market_cap' in criteria and result['market_cap'] < criteria['min_market_cap']:
            result['passed'] = False
            result['reasons'].append(f"市值低于{criteria['min_market_cap']}")
        
        if 'max_volatility' in criteria and current_volatility > criteria['max_volatility']:
            result['passed'] = False
            result['reasons'].append(f"波动率高于{criteria['max_volatility']}")
        
        return result
    
    def screen_multiple(self, symbols, criteria):
        """筛选多个股票"""
        print(f"🦐 开始筛选 {len(symbols)} 只股票...")
        print("=" * 60)
        
        results = []
        passed_count = 0
        
        for i, symbol in enumerate(symbols, 1):
            print(f"\n[{i}/{len(symbols)}] 分析 {symbol}...", end=" ")
            result = self.screen_stock(symbol, criteria)
            
            if result:
                results.append(result)
                if result['passed']:
                    print("✅ 通过")
                    passed_count += 1
                else:
                    print(f"❌ 未通过: {', '.join(result['reasons'])}")
            else:
                print("❌ 数据获取失败")
        
        print("\n" + "=" * 60)
        print(f"✅ 筛选完成！{passed_count}/{len(symbols)} 只股票通过筛选")
        
        return results
    
    def get_passed_stocks(self, results):
        """获取通过筛选的股票"""
        passed = [r for r in results if r['passed']]
        return pd.DataFrame(passed)
    
    def print_results(self, results):
        """打印筛选结果"""
        passed_stocks = self.get_passed_stocks(results)
        
        if len(passed_stocks) == 0:
            print("\n❌ 没有股票通过筛选")
            return
        
        print("\n🎯 通过筛选的股票：")
        print("-" * 60)
        
        display_cols = ['symbol', 'name', 'price', 'rsi', 'pe_ratio', 'sector']
        print(passed_stocks[display_cols].to_string(index=False))
        
        print("-" * 60)


# 预设筛选策略
SCREENING_STRATEGIES = {
    'value': {
        'name': '价值投资策略',
        'criteria': {
            'min_price': 10,
            'max_price': 500,
            'rsi_range': (30, 70),
            'min_market_cap': 10_000_000_000,  # 100亿
            'max_volatility': 0.5
        }
    },
    'growth': {
        'name': '成长型策略',
        'criteria': {
            'min_price': 5,
            'rsi_range': (40, 80),
            'min_market_cap': 1_000_000_000,  # 10亿
            'max_volatility': 0.8
        }
    },
    'momentum': {
        'name': '动量策略',
        'criteria': {
            'min_price': 10,
            'rsi_range': (60, 80),
            'max_volatility': 0.6
        }
    },
    'oversold': {
        'name': '超卖反弹策略',
        'criteria': {
            'rsi_range': (0, 35),
            'max_volatility': 0.5
        }
    }
}


def main():
    """主函数"""
    if len(sys.argv) < 2:
        print("🦐 股票筛选器使用说明：")
        print("=" * 60)
        print("用法: python stock_screener.py <策略> <股票1> <股票2> ...")
        print("\n可用策略：")
        for key, strategy in SCREENING_STRATEGIES.items():
            print(f"  - {key}: {strategy['name']}")
        print("\n示例:")
        print("  python stock_screener.py value AAPL MSFT GOOGL NVDA")
        print("  python stock_screener.py momentum AMD TSM INTC")
        sys.exit(1)
    
    strategy_name = sys.argv[1]
    symbols = sys.argv[2:]
    
    if strategy_name not in SCREENING_STRATEGIES:
        print(f"❌ 未知策略: {strategy_name}")
        print(f"可用策略: {', '.join(SCREENING_STRATEGIES.keys())}")
        sys.exit(1)
    
    strategy = SCREENING_STRATEGIES[strategy_name]
    print(f"🦐 使用策略: {strategy['name']}")
    print(f"筛选条件: {strategy['criteria']}")
    print("")
    
    screener = StockScreener()
    results = screener.screen_multiple(symbols, strategy['criteria'])
    screener.print_results(results)


if __name__ == "__main__":
    main()
