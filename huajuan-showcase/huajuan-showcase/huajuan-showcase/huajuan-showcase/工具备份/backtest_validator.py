#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
回测验证器 - Backtest Validator
作者：虾虾
创建时间：2026-02-09
用途：策略回测、参数优化、风险指标计算、策略可信度评分
"""

import os
import sys
import json
import yfinance as yf
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from typing import List, Dict, Optional, Tuple
import matplotlib.pyplot as plt


class BacktestValidator:
    """
    回测验证器
    
    功能：
    1. 多策略回测（SMA/RSI/MACD/多因子组合）
    2. 参数优化（找到最佳均线周期）
    3. 风险指标计算（最大回撤/夏普比率/胜率）
    4. 策略可信度评分
    
    核心思想：没有回测验证的策略=赌博！
    """
    
    def __init__(self):
        self.data_dir = os.path.expanduser("~/.openclaw/workspace/回测数据")
        os.makedirs(self.data_dir, exist_ok=True)
        
        print("🦐 回测验证器启动")
        print("📊 验证策略在历史数据上的表现")
        print("="*70)
    
    def fetch_data(self, symbol: str, period: str = "3y") -> pd.DataFrame:
        """获取历史数据"""
        try:
            ticker = yf.Ticker(symbol)
            hist = ticker.history(period=period)
            return hist
        except Exception as e:
            print(f"❌ 获取{symbol}数据失败: {e}")
            return pd.DataFrame()
    
    def sma_strategy(self, data: pd.DataFrame, short_window: int = 20, 
                     long_window: int = 50) -> pd.DataFrame:
        """
        简单均线策略
        
        信号：
        - 买入：短期均线上穿长期均线
        - 卖出：短期均线下穿长期均线
        """
        df = data.copy()
        df['SMA_short'] = df['Close'].rolling(window=short_window).mean()
        df['SMA_long'] = df['Close'].rolling(window=long_window).mean()
        
        # 生成信号
        df['Signal'] = 0
        df.loc[df['SMA_short'] > df['SMA_long'], 'Signal'] = 1  # 买入
        df.loc[df['SMA_short'] <= df['SMA_long'], 'Signal'] = -1  # 卖出
        
        # 交易信号（信号变化时）
        df['Position'] = df['Signal'].shift(1)
        df['Trade'] = df['Signal'].diff()
        
        return df
    
    def rsi_strategy(self, data: pd.DataFrame, period: int = 14,
                    oversold: int = 30, overbought: int = 70) -> pd.DataFrame:
        """
        RSI策略
        
        信号：
        - 买入：RSI从超卖区回升
        - 卖出：RSI从超买区回落
        """
        df = data.copy()
        
        # 计算RSI
        delta = df['Close'].diff()
        gain = (delta.where(delta > 0, 0)).rolling(window=period).mean()
        loss = (-delta.where(delta < 0, 0)).rolling(window=period).mean()
        rs = gain / loss
        df['RSI'] = 100 - (100 / (1 + rs))
        
        # 生成信号
        df['Signal'] = 0
        df.loc[df['RSI'] < oversold, 'Signal'] = 1  # 超卖，买入
        df.loc[df['RSI'] > overbought, 'Signal'] = -1  # 超买，卖出
        
        df['Position'] = df['Signal'].shift(1)
        
        return df
    
    def macd_strategy(self, data: pd.DataFrame) -> pd.DataFrame:
        """
        MACD策略
        
        信号：
        - 买入：MACD上穿信号线
        - 卖出：MACD下穿信号线
        """
        df = data.copy()
        
        # 计算MACD
        ema12 = df['Close'].ewm(span=12).mean()
        ema26 = df['Close'].ewm(span=26).mean()
        df['MACD'] = ema12 - ema26
        df['Signal_Line'] = df['MACD'].ewm(span=9).mean()
        
        # 生成信号
        df['Signal'] = 0
        df.loc[df['MACD'] > df['Signal_Line'], 'Signal'] = 1
        df.loc[df['MACD'] <= df['Signal_Line'], 'Signal'] = -1
        
        df['Position'] = df['Signal'].shift(1)
        
        return df
    
    def run_backtest(self, data: pd.DataFrame, strategy_df: pd.DataFrame,
                    initial_capital: float = 100000) -> Dict:
        """
        执行回测
        
        Returns:
            回测结果
        """
        df = strategy_df.copy()
        df['Returns'] = df['Close'].pct_change()
        df['Strategy_Returns'] = df['Position'] * df['Returns']
        
        # 计算累计收益
        df['Cumulative_Market'] = (1 + df['Returns']).cumprod()
        df['Cumulative_Strategy'] = (1 + df['Strategy_Returns']).cumprod()
        
        # 计算资金曲线
        df['Portfolio_Value'] = initial_capital * df['Cumulative_Strategy']
        
        # 计算指标
        total_return = df['Cumulative_Strategy'].iloc[-1] - 1
        market_return = df['Cumulative_Market'].iloc[-1] - 1
        
        # 年化收益
        days = len(df)
        years = days / 252
        annualized_return = (1 + total_return) ** (1/years) - 1 if years > 0 else 0
        
        # 波动率
        volatility = df['Strategy_Returns'].std() * np.sqrt(252)
        
        # 夏普比率（假设无风险利率2%）
        risk_free_rate = 0.02
        sharpe_ratio = (annualized_return - risk_free_rate) / volatility if volatility > 0 else 0
        
        # 最大回撤
        cumulative = df['Cumulative_Strategy']
        running_max = cumulative.expanding().max()
        drawdown = (cumulative - running_max) / running_max
        max_drawdown = drawdown.min()
        
        # 胜率
        trades = df[df['Trade'] != 0]
        if len(trades) > 0:
            winning_trades = trades[trades['Strategy_Returns'] > 0]
            win_rate = len(winning_trades) / len(trades)
        else:
            win_rate = 0
        
        # 交易次数
        num_trades = len(trades)
        
        return {
            'total_return': round(total_return * 100, 2),
            'market_return': round(market_return * 100, 2),
            'annualized_return': round(annualized_return * 100, 2),
            'volatility': round(volatility * 100, 2),
            'sharpe_ratio': round(sharpe_ratio, 2),
            'max_drawdown': round(max_drawdown * 100, 2),
            'win_rate': round(win_rate * 100, 2),
            'num_trades': num_trades,
            'data': df
        }
    
    def optimize_parameters(self, symbol: str, strategy_type: str = 'sma') -> Dict:
        """
        参数优化
        
        找到最佳参数组合
        """
        print(f"\n🔍 优化 {symbol} {strategy_type} 策略参数...")
        
        data = self.fetch_data(symbol, period="3y")
        if data.empty:
            return {'error': '数据不足'}
        
        results = []
        
        if strategy_type == 'sma':
            # 测试不同均线组合
            for short in [5, 10, 15, 20, 25]:
                for long in [30, 40, 50, 60, 70]:
                    if short >= long:
                        continue
                    
                    strategy_df = self.sma_strategy(data, short, long)
                    result = self.run_backtest(data, strategy_df)
                    
                    results.append({
                        'short': short,
                        'long': long,
                        'sharpe': result['sharpe_ratio'],
                        'return': result['total_return'],
                        'max_dd': result['max_drawdown'],
                        'win_rate': result['win_rate']
                    })
        
        elif strategy_type == 'rsi':
            # 测试不同RSI参数
            for period in [10, 14, 20]:
                for oversold in [20, 25, 30]:
                    for overbought in [70, 75, 80]:
                        strategy_df = self.rsi_strategy(data, period, oversold, overbought)
                        result = self.run_backtest(data, strategy_df)
                        
                        results.append({
                            'period': period,
                            'oversold': oversold,
                            'overbought': overbought,
                            'sharpe': result['sharpe_ratio'],
                            'return': result['total_return'],
                            'max_dd': result['max_drawdown'],
                            'win_rate': result['win_rate']
                        })
        
        # 按夏普比率排序
        results.sort(key=lambda x: x['sharpe'], reverse=True)
        
        return {
            'best_params': results[0] if results else None,
            'all_results': results[:10]  # 前10名
        }
    
    def calculate_strategy_credibility(self, backtest_result: Dict) -> Dict:
        """
        计算策略可信度评分
        
        评分标准：
        - 夏普比率 > 1.0: 优秀 (30分)
        - 最大回撤 < 20%: 优秀 (25分)
        - 胜率 > 55%: 良好 (20分)
        - 总收益 > 市场: 良好 (15分)
        - 交易次数 > 20: 样本足够 (10分)
        """
        result = backtest_result
        score = 0
        criteria = []
        
        # 1. 夏普比率 (30分)
        sharpe = result.get('sharpe_ratio', 0)
        if sharpe > 1.5:
            score += 30
            criteria.append("夏普比率>1.5，优秀")
        elif sharpe > 1.0:
            score += 25
            criteria.append("夏普比率>1.0，良好")
        elif sharpe > 0.5:
            score += 15
            criteria.append("夏普比率>0.5，一般")
        else:
            criteria.append("夏普比率<0.5，较差")
        
        # 2. 最大回撤 (25分)
        max_dd = abs(result.get('max_drawdown', 100))
        if max_dd < 15:
            score += 25
            criteria.append("最大回撤<15%，优秀")
        elif max_dd < 25:
            score += 20
            criteria.append("最大回撤<25%，良好")
        elif max_dd < 35:
            score += 10
            criteria.append("最大回撤<35%，一般")
        else:
            criteria.append("最大回撤>35%，风险高")
        
        # 3. 胜率 (20分)
        win_rate = result.get('win_rate', 0)
        if win_rate > 60:
            score += 20
            criteria.append("胜率>60%，优秀")
        elif win_rate > 55:
            score += 15
            criteria.append("胜率>55%，良好")
        elif win_rate > 50:
            score += 10
            criteria.append("胜率>50%，一般")
        else:
            criteria.append("胜率<50%，较差")
        
        # 4. 相对市场收益 (15分)
        total_return = result.get('total_return', 0)
        market_return = result.get('market_return', 0)
        if total_return > market_return + 20:
            score += 15
            criteria.append("超额收益>20%，优秀")
        elif total_return > market_return:
            score += 10
            criteria.append("跑赢市场，良好")
        elif total_return > 0:
            score += 5
            criteria.append("正收益但跑输市场")
        else:
            criteria.append("负收益")
        
        # 5. 样本量 (10分)
        num_trades = result.get('num_trades', 0)
        if num_trades > 50:
            score += 10
            criteria.append("交易次数>50，样本充足")
        elif num_trades > 20:
            score += 7
            criteria.append("交易次数>20，样本足够")
        elif num_trades > 10:
            score += 5
            criteria.append("交易次数>10，样本偏少")
        else:
            criteria.append("交易次数<10，样本不足")
        
        # 可信度等级
        if score >= 80:
            credibility = 'HIGH'
        elif score >= 60:
            credibility = 'MEDIUM'
        elif score >= 40:
            credibility = 'LOW'
        else:
            credibility = 'VERY_LOW'
        
        return {
            'score': score,
            'credibility': credibility,
            'criteria': criteria,
            'recommendation': '可信' if score >= 60 else '需谨慎' if score >= 40 else '不可信'
        }
    
    def validate_strategy(self, symbol: str, strategy: str = 'sma') -> Dict:
        """
        验证策略
        
        完整验证流程
        """
        print(f"\n🧪 验证 {symbol} {strategy.upper()} 策略...")
        print("="*70)
        
        # 获取数据
        data = self.fetch_data(symbol, period="3y")
        if data.empty:
            return {'error': '数据不足'}
        
        # 运行策略
        if strategy == 'sma':
            strategy_df = self.sma_strategy(data)
        elif strategy == 'rsi':
            strategy_df = self.rsi_strategy(data)
        elif strategy == 'macd':
            strategy_df = self.macd_strategy(data)
        else:
            return {'error': '未知策略'}
        
        # 回测
        result = self.run_backtest(data, strategy_df)
        
        # 计算可信度
        credibility = self.calculate_strategy_credibility(result)
        
        # 参数优化
        optimization = self.optimize_parameters(symbol, strategy)
        
        return {
            'symbol': symbol,
            'strategy': strategy,
            'backtest': result,
            'credibility': credibility,
            'optimization': optimization,
            'timestamp': datetime.now().isoformat()
        }
    
    def print_validation_report(self, result: Dict):
        """打印验证报告"""
        print("\n" + "="*70)
        print("📊 策略回测验证报告")
        print("="*70)
        
        symbol = result['symbol']
        strategy = result['strategy']
        backtest = result['backtest']
        credibility = result['credibility']
        
        print(f"\n🎯 {symbol} {strategy.upper()} 策略")
        
        # 回测结果
        print(f"\n📈 回测表现:")
        print("-"*70)
        print(f"  策略收益: {backtest['total_return']:.2f}%")
        print(f"  市场收益: {backtest['market_return']:.2f}%")
        print(f"  年化收益: {backtest['annualized_return']:.2f}%")
        print(f"  夏普比率: {backtest['sharpe_ratio']:.2f}")
        print(f"  最大回撤: {backtest['max_drawdown']:.2f}%")
        print(f"  胜率: {backtest['win_rate']:.1f}%")
        print(f"  交易次数: {backtest['num_trades']}")
        
        # 可信度
        print(f"\n✅ 策略可信度:")
        print("-"*70)
        print(f"  评分: {credibility['score']}/100")
        print(f"  等级: {credibility['credibility']}")
        print(f"  建议: {credibility['recommendation']}")
        
        print(f"\n  评分细则:")
        for criterion in credibility['criteria']:
            print(f"    • {criterion}")
        
        # 最优参数
        if 'optimization' in result and result['optimization']:
            opt = result['optimization']
            if 'best_params' in opt and opt['best_params']:
                print(f"\n🔧 最优参数:")
                print("-"*70)
                best = opt['best_params']
                if 'short' in best:
                    print(f"  短期均线: {best['short']}")
                    print(f"  长期均线: {best['long']}")
                print(f"  夏普比率: {best['sharpe']:.2f}")
                print(f"  总收益: {best['return']:.2f}%")
        
        # 结论
        print(f"\n💡 验证结论:")
        print("-"*70)
        if credibility['score'] >= 60:
            print(f"  ✅ 策略可信，可以考虑实盘应用")
            print(f"  📊 建议仓位: 标准仓位")
        elif credibility['score'] >= 40:
            print(f"  ⚠️  策略一般，需要进一步优化")
            print(f"  📊 建议仓位: 减小仓位测试")
        else:
            print(f"  ❌ 策略不可信，不建议使用")
            print(f"  📊 建议: 放弃该策略")
        
        print("="*70)


def main():
    """主函数"""
    import argparse
    
    parser = argparse.ArgumentParser(
        description='虾虾回测验证器',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
使用示例:
  # 验证SMA策略
  python3 backtest_validator.py --symbol NVDA --strategy sma
  
  # 验证RSI策略
  python3 backtest_validator.py --symbol AMD --strategy rsi
  
  # 参数优化
  python3 backtest_validator.py --symbol NVDA --optimize sma
        """
    )
    
    parser.add_argument('--symbol', '-s', type=str, required=True,
                       help='股票代码')
    parser.add_argument('--strategy', type=str, 
                       choices=['sma', 'rsi', 'macd'],
                       default='sma',
                       help='策略类型')
    parser.add_argument('--optimize', '-o', type=str,
                       choices=['sma', 'rsi'],
                       help='参数优化')
    
    args = parser.parse_args()
    
    validator = BacktestValidator()
    
    if args.optimize:
        result = validator.optimize_parameters(args.symbol, args.optimize)
        print(json.dumps(result, indent=2, default=str))
    else:
        result = validator.validate_strategy(args.symbol, args.strategy)
        validator.print_validation_report(result)


if __name__ == "__main__":
    main()
