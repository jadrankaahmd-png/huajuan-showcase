#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
加密货币情绪监控器 - Crypto Sentiment Monitor
作者：虾虾
创建时间：2026-02-09
用途：监控BTC/ETH与美股相关性、Crypto恐惧贪婪指数、辅助判断宏观情绪
"""

import os
import sys
import json
import requests
import yfinance as yf
from datetime import datetime, timedelta
from typing import List, Dict, Optional, Tuple


class CryptoSentimentMonitor:
    """
    加密货币情绪监控器
    
    功能：
    1. 监控BTC/ETH价格走势
    2. 分析Crypto与美股相关性
    3. 获取恐惧贪婪指数
    4. 辅助判断宏观风险情绪
    
    为什么监控Crypto：
    - Crypto是高风险资产，反映市场情绪
    - BTC被称为"数字黄金"，有时与美股脱钩
    - Crypto暴跌往往预示风险资产回调
    - 辅助判断市场情绪周期
    """
    
    def __init__(self):
        # 监控的加密货币
        self.cryptos = {
            'BTC-USD': {
                'name': 'Bitcoin',
                'symbol': 'BTC',
                'type': 'major',
                'market_cap_rank': 1
            },
            'ETH-USD': {
                'name': 'Ethereum',
                'symbol': 'ETH',
                'type': 'major',
                'market_cap_rank': 2
            },
            'SOL-USD': {
                'name': 'Solana',
                'symbol': 'SOL',
                'type': 'alt',
                'market_cap_rank': 5
            },
            'COIN': {
                'name': 'Coinbase',
                'symbol': 'COIN',
                'type': 'stock',
                'market_cap_rank': None,
                'note': 'Crypto概念股'
            }
        }
        
        # 美股对比基准
        self.equity_benchmarks = {
            'SPY': '标普500',
            'QQQ': '纳斯达克100',
            'NVDA': '英伟达',
            'COIN': 'Coinbase'
        }
        
        # 数据目录
        self.data_dir = os.path.expanduser("~/.openclaw/workspace/Crypto监控数据")
        os.makedirs(self.data_dir, exist_ok=True)
        
        print("🦐 加密货币情绪监控器启动")
        print(f"📊 监控: BTC, ETH, SOL + COIN股票")
        print("="*70)
    
    def get_crypto_data(self, symbol: str, period: str = "30d") -> Optional[Dict]:
        """
        获取加密货币数据
        
        Args:
            symbol: 交易对（如 BTC-USD）
            period: 时间周期
        
        Returns:
            价格数据
        """
        try:
            ticker = yf.Ticker(symbol)
            hist = ticker.history(period=period)
            
            if hist.empty:
                return None
            
            latest = hist.iloc[-1]
            prev_close = hist.iloc[-2]['Close'] if len(hist) > 1 else latest['Close']
            
            # 计算收益率
            returns = {}
            for p in ['1d', '7d', '30d']:
                if p == '1d' and len(hist) >= 2:
                    returns[p] = (hist['Close'].iloc[-1] - hist['Close'].iloc[-2]) / hist['Close'].iloc[-2]
                elif p == '7d' and len(hist) >= 8:
                    returns[p] = (hist['Close'].iloc[-1] - hist['Close'].iloc[-8]) / hist['Close'].iloc[-8]
                elif p == '30d' and len(hist) >= 30:
                    returns[p] = (hist['Close'].iloc[-1] - hist['Close'].iloc[-30]) / hist['Close'].iloc[-30]
                else:
                    returns[p] = None
            
            return {
                'symbol': symbol,
                'price': latest['Close'],
                'change_1d': returns['1d'],
                'change_7d': returns['7d'],
                'change_30d': returns['30d'],
                'volume': latest['Volume'],
                'high_24h': latest['High'],
                'low_24h': latest['Low'],
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            print(f"❌ 获取{symbol}数据失败: {e}")
            return None
    
    def get_fear_greed_index(self) -> Dict:
        """
        获取恐惧贪婪指数
        
        Returns:
            恐惧贪婪指数数据
        """
        try:
            # Alternative.me API
            url = "https://api.alternative.me/fng/?limit=2"
            response = requests.get(url, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                
                if 'data' in data and len(data['data']) > 0:
                    latest = data['data'][0]
                    
                    value = int(latest['value'])
                    classification = latest['value_classification']
                    timestamp = datetime.fromtimestamp(int(latest['timestamp']))
                    
                    # 解读
                    sentiment = self._interpret_fgi(value)
                    
                    return {
                        'value': value,
                        'classification': classification,
                        'sentiment': sentiment,
                        'timestamp': timestamp.isoformat(),
                        'interpretation': self._get_fgi_interpretation(value)
                    }
            
            # API失败返回模拟数据
            return {
                'value': 50,
                'classification': 'Neutral',
                'sentiment': 'neutral',
                'timestamp': datetime.now().isoformat(),
                'interpretation': 'API获取失败，显示默认值',
                'note': '使用备用数据'
            }
            
        except Exception as e:
            print(f"⚠️ 恐惧贪婪指数获取失败: {e}")
            return {
                'value': None,
                'error': str(e)
            }
    
    def _interpret_fgi(self, value: int) -> str:
        """解读恐惧贪婪指数"""
        if value <= 20:
            return 'extreme_fear'
        elif value <= 40:
            return 'fear'
        elif value <= 60:
            return 'neutral'
        elif value <= 80:
            return 'greed'
        else:
            return 'extreme_greed'
    
    def _get_fgi_interpretation(self, value: int) -> str:
        """获取指数解读"""
        interpretations = {
            'extreme_fear': '极度恐惧 - 可能是买入机会',
            'fear': '恐惧 - 市场情绪谨慎',
            'neutral': '中性 - 情绪平衡',
            'greed': '贪婪 - 市场乐观',
            'extreme_greed': '极度贪婪 - 可能过热'
        }
        
        sentiment = self._interpret_fgi(value)
        return interpretations.get(sentiment, '未知')
    
    def calculate_correlation(self, crypto_symbol: str = "BTC-USD", 
                            equity_symbol: str = "SPY",
                            period: str = "90d") -> Dict:
        """
        计算Crypto与美股的相关性
        
        Args:
            crypto_symbol: 加密货币
            equity_symbol: 美股标的
            period: 时间周期
        
        Returns:
            相关性分析
        """
        print(f"\n📊 计算 {crypto_symbol} 与 {equity_symbol} 相关性...")
        
        try:
            # 获取数据
            crypto_ticker = yf.Ticker(crypto_symbol)
            equity_ticker = yf.Ticker(equity_symbol)
            
            crypto_hist = crypto_ticker.history(period=period)
            equity_hist = equity_ticker.history(period=period)
            
            if crypto_hist.empty or equity_hist.empty:
                return {'error': '数据不足'}
            
            # 对齐日期
            combined = pd.DataFrame({
                'crypto': crypto_hist['Close'],
                'equity': equity_hist['Close']
            }).dropna()
            
            # 计算日收益率
            combined['crypto_return'] = combined['crypto'].pct_change()
            combined['equity_return'] = combined['equity'].pct_change()
            
            # 计算相关性
            correlation = combined['crypto_return'].corr(combined['equity_return'])
            
            # 计算Beta（Crypto相对于美股的弹性）
            crypto_volatility = combined['crypto_return'].std()
            equity_volatility = combined['equity_return'].std()
            beta = correlation * (crypto_volatility / equity_volatility) if equity_volatility > 0 else 0
            
            # 解读相关性
            corr_interpretation = self._interpret_correlation(correlation)
            
            return {
                'crypto': crypto_symbol,
                'equity': equity_symbol,
                'period': period,
                'correlation': round(correlation, 4),
                'beta': round(beta, 4),
                'crypto_volatility': round(crypto_volatility * 100, 2),
                'equity_volatility': round(equity_volatility * 100, 2),
                'interpretation': corr_interpretation,
                'sample_size': len(combined)
            }
            
        except Exception as e:
            print(f"❌ 计算相关性失败: {e}")
            return {'error': str(e)}
    
    def _interpret_correlation(self, corr: float) -> str:
        """解读相关性"""
        if abs(corr) < 0.3:
            return '弱相关 - Crypto与美股走势独立'
        elif abs(corr) < 0.7:
            if corr > 0:
                return '中度正相关 - Crypto与美股同向波动'
            else:
                return '中度负相关 - Crypto与美股反向波动'
        else:
            if corr > 0:
                return '强正相关 - Crypto与美股高度同步'
            else:
                return '强负相关 - Crypto与美股高度反向'
    
    def analyze_market_regime(self) -> Dict:
        """
        分析市场环境（基于Crypto和美股）
        
        Returns:
            市场环境分析
        """
        print("\n🌍 分析市场环境...")
        
        # 获取数据
        btc_data = self.get_crypto_data('BTC-USD', '7d')
        eth_data = self.get_crypto_data('ETH-USD', '7d')
        fgi = self.get_fear_greed_index()
        
        # 计算与美股相关性
        btc_spy_corr = self.calculate_correlation('BTC-USD', 'SPY', '30d')
        
        # 判断市场环境
        regime = self._determine_regime(btc_data, eth_data, fgi, btc_spy_corr)
        
        return {
            'timestamp': datetime.now().isoformat(),
            'crypto_data': {
                'btc': btc_data,
                'eth': eth_data
            },
            'fear_greed': fgi,
            'correlation': btc_spy_corr,
            'market_regime': regime
        }
    
    def _determine_regime(self, btc_data, eth_data, fgi, correlation) -> Dict:
        """判断市场环境"""
        regime = {
            'risk_on_off': 'neutral',
            'description': '',
            'implications': []
        }
        
        # 基于Crypto表现判断
        if btc_data and eth_data:
            btc_7d = btc_data.get('change_7d', 0) or 0
            eth_7d = eth_data.get('change_7d', 0) or 0
            
            if btc_7d > 0.1 and eth_7d > 0.15:  # 大涨
                regime['risk_on_off'] = 'risk_on'
                regime['description'] = 'Crypto强劲上涨 - 风险偏好高'
                regime['implications'].append('市场情绪乐观，风险资产可能受益')
                
            elif btc_7d < -0.1 and eth_7d < -0.15:  # 大跌
                regime['risk_on_off'] = 'risk_off'
                regime['description'] = 'Crypto大幅下跌 - 风险偏好低'
                regime['implications'].append('市场情绪谨慎，注意美股回调风险')
        
        # 基于恐惧贪婪指数
        if fgi and fgi.get('value'):
            fgi_value = fgi['value']
            if fgi_value >= 75:  # 极度贪婪
                regime['implications'].append('Crypto市场过热，警惕回调')
            elif fgi_value <= 25:  # 极度恐惧
                regime['implications'].append('Crypto市场恐慌，可能是机会')
        
        # 基于相关性
        if correlation and correlation.get('correlation'):
            corr = correlation['correlation']
            if corr > 0.6:
                regime['implications'].append('Crypto与美股高度相关，同涨同跌')
            elif corr < 0.3:
                regime['implications'].append('Crypto与美股脱钩，独立行情')
        
        return regime
    
    def generate_sentiment_report(self) -> str:
        """
        生成情绪监控报告
        
        Returns:
            报告文本
        """
        report = []
        report.append("="*70)
        report.append("🪙 加密货币情绪监控报告")
        report.append(f"生成时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        report.append("="*70)
        
        # 1. Crypto价格
        report.append("\n## 📊 主要加密货币价格\n")
        
        for symbol, info in self.cryptos.items():
            data = self.get_crypto_data(symbol, '7d')
            if data:
                change_24h = data.get('change_1d', 0) or 0
                emoji = "🟢" if change_24h > 0 else "🔴"
                report.append(f"{emoji} {info['name']} ({info['symbol']}): "
                            f"${data['price']:,.2f} ({change_24h*100:+.2f}%)")
        
        # 2. 恐惧贪婪指数
        report.append("\n## 😰😁 恐惧贪婪指数\n")
        
        fgi = self.get_fear_greed_index()
        if fgi and fgi.get('value'):
            value = fgi['value']
            
            # 显示指数条
            bar_length = 50
            filled = int(value / 100 * bar_length)
            bar = "█" * filled + "░" * (bar_length - filled)
            
            emoji = "😰" if value < 30 else ("😐" if value < 70 else "😁")
            report.append(f"{emoji} 指数值: {value}/100")
            report.append(f"   [{bar}]")
            report.append(f"   情绪: {fgi.get('classification', 'N/A')}")
            report.append(f"   解读: {fgi.get('interpretation', 'N/A')}")
        
        # 3. 与美股相关性
        report.append("\n## 📈 Crypto与美股相关性\n")
        
        for equity_symbol in ['SPY', 'QQQ', 'NVDA']:
            corr_data = self.calculate_correlation('BTC-USD', equity_symbol, '30d')
            if corr_data and 'correlation' in corr_data:
                corr = corr_data['correlation']
                emoji = "🔗" if abs(corr) > 0.5 else "🔄"
                report.append(f"{emoji} BTC vs {equity_symbol}: "
                            f"相关性 = {corr:.3f}")
        
        # 4. 市场环境
        report.append("\n## 🌍 市场环境判断\n")
        
        analysis = self.analyze_market_regime()
        regime = analysis.get('market_regime', {})
        
        risk_emoji = {"risk_on": "🚀", "risk_off": "🛡️", "neutral": "⚖️"}.get(
            regime.get('risk_on_off'), "⚖️"
        )
        
        report.append(f"{risk_emoji} 风险情绪: {regime.get('risk_on_off', 'N/A')}")
        report.append(f"   描述: {regime.get('description', 'N/A')}")
        
        if regime.get('implications'):
            report.append("\n   影响:")
            for impl in regime['implications'][:3]:
                report.append(f"   • {impl}")
        
        # 5. 投资建议
        report.append("\n## 💡 Crypto情绪辅助投资建议\n")
        report.append("1. 🪙 Crypto作为情绪指标：")
        report.append("   • Crypto大涨 → 风险偏好高，美股可能继续涨")
        report.append("   • Crypto大跌 → 风险偏好低，注意美股回调")
        report.append("\n2. 😰 恐惧贪婪指数应用：")
        report.append("   • <20 (极度恐惧): 市场恐慌，可能是机会")
        report.append("   • >80 (极度贪婪): 市场过热，警惕回调")
        report.append("\n3. 🔗 相关性应用：")
        report.append("   • 高相关(>0.6): Crypto与美股同步")
        report.append("   • 低相关(<0.3): Crypto独立行情")
        
        report.append("\n" + "="*70)
        
        return "\n".join(report)
    
    def save_report(self, report: str, filename: str = None):
        """保存报告"""
        if filename is None:
            filename = f"crypto_sentiment_{datetime.now().strftime('%Y%m%d')}.md"
        
        filepath = os.path.join(self.data_dir, filename)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(report)
        
        print(f"\n💾 报告已保存: {filepath}")
        return filepath


def main():
    """主函数"""
    import argparse
    
    parser = argparse.ArgumentParser(
        description='虾虾加密货币情绪监控器',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
使用示例:
  # 查看Crypto价格
  python3 crypto_sentiment.py --prices
  
  # 获取恐惧贪婪指数
  python3 crypto_sentiment.py --fear-greed
  
  # 计算与美股相关性
  python3 crypto_sentiment.py --correlation BTC-USD SPY
  
  # 生成综合报告
  python3 crypto_sentiment.py --report
        """
    )
    
    parser.add_argument('--prices', '-p', action='store_true',
                       help='显示Crypto价格')
    parser.add_argument('--fear-greed', '-f', action='store_true',
                       help='获取恐惧贪婪指数')
    parser.add_argument('--correlation', '-c', nargs=2,
                       metavar=('CRYPTO', 'EQUITY'),
                       help='计算相关性')
    parser.add_argument('--regime', '-r', action='store_true',
                       help='分析市场环境')
    parser.add_argument('--report', action='store_true',
                       help='生成综合报告')
    
    args = parser.parse_args()
    
    monitor = CryptoSentimentMonitor()
    
    if args.prices:
        print("\n📊 Crypto价格:")
        print("="*70)
        for symbol, info in monitor.cryptos.items():
            data = monitor.get_crypto_data(symbol)
            if data:
                change = data.get('change_1d', 0) or 0
                emoji = "🟢" if change > 0 else "🔴"
                print(f"{emoji} {info['name']}: ${data['price']:,.2f} ({change*100:+.2f}%)")
    
    elif args.fear_greed:
        fgi = monitor.get_fear_greed_index()
        print(json.dumps(fgi, indent=2, ensure_ascii=False))
    
    elif args.correlation:
        crypto, equity = args.correlation
        corr = monitor.calculate_correlation(crypto, equity)
        print(json.dumps(corr, indent=2, ensure_ascii=False))
    
    elif args.regime:
        regime = monitor.analyze_market_regime()
        print(json.dumps(regime, indent=2, ensure_ascii=False))
    
    elif args.report:
        report = monitor.generate_sentiment_report()
        print(report)
        monitor.save_report(report)
    
    else:
        print("🦐 虾虾加密货币情绪监控器")
        print("="*70)
        print("\n使用方法:")
        print("  --prices           显示Crypto价格")
        print("  --fear-greed       获取恐惧贪婪指数")
        print("  --correlation C E  计算相关性")
        print("  --regime           分析市场环境")
        print("  --report           生成综合报告")
        print("\n详细帮助:")
        print("  python3 crypto_sentiment.py --help")


if __name__ == "__main__":
    main()
