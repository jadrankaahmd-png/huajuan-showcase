#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
虾虾全市场扫描系统 - XiaXia Market Scanner
扫描全市场寻找交易机会
"""

import sys
import asyncio
import yfinance as yf
import pandas as pd
from datetime import datetime, timedelta

sys.path.insert(0, '/Users/fox/.openclaw/workspace/tools')

# 设置事件循环
if sys.platform == 'darwin':
    asyncio.set_event_loop_policy(asyncio.DefaultEventLoopPolicy())

try:
    loop = asyncio.get_running_loop()
except RuntimeError:
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)

from ib_insync import IB


class MarketScanner:
    """
    全市场扫描器
    
    扫描流程：
    1. 获取全市场股票列表 (约8000只)
    2. 初筛：流动性/价格/市值过滤 (剩1000只)
    3. 二筛：技术形态/成交量异常 (剩200只)
    4. 精筛：多因子评分 (剩20只>70分)
    5. 推荐：评分>80分的买入标的
    """
    
    def __init__(self):
        """初始化扫描器"""
        self.universe = self._get_stock_universe()
        print(f"🦐 全市场扫描系统初始化")
        print(f"📊 全市场股票: {len(self.universe)} 只")
        
    def _get_stock_universe(self) -> list:
        """获取股票池 (使用预设的热门股票+可扩展)"""
        # 标普500成分股 (约500只)
        sp500 = [
            'AAPL', 'MSFT', 'AMZN', 'NVDA', 'GOOGL', 'META', 'TSLA', 'BRK-B', 
            'AVGO', 'WMT', 'JPM', 'V', 'UNH', 'HD', 'PG', 'MA', 'JNJ', 'LLY',
            'MRK', 'CVX', 'PEP', 'ABBV', 'KO', 'BAC', 'COST', 'MCD', 'TMO',
            'CSCO', 'ABT', 'ACN', 'NKE', 'DIS', 'VZ', 'ADBE', 'CMCSA', 'TXN',
            'CRM', 'PFE', 'NEE', 'RTX', 'HON', 'NFLX', 'PM', 'QCOM', 'BMY',
            # ... 更多标普500股票
        ]
        
        # 热门中概股
        china_stocks = ['BABA', 'JD', 'PDD', 'BIDU', 'NIO', 'XPEV', 'LI']
        
        # 热门科技股
        tech_stocks = [
            'PLTR', 'SNOW', 'CRWD', 'DDOG', 'NET', 'OKTA', 'ZM', 'DOCU',
            'SHOP', 'SQ', 'PYPL', 'SOFI', 'COIN', 'HOOD', 'ABNB', 'UBER',
            'LYFT', 'ROKU', 'TWLO', 'FSLY', 'DDOG', 'S', 'ZI', 'ASAN'
        ]
        
        # 半导体
        semi_stocks = [
            'NVDA', 'AMD', 'INTC', 'QCOM', 'AVGO', 'TXN', 'AMAT', 'LRCX',
            'MU', 'MRVL', 'NXPI', 'SWKS', 'QRVO', 'KLAC', 'TER', 'ENTG'
        ]
        
        # 新能源
        ev_stocks = [
            'TSLA', 'RIVN', 'LCID', 'NIO', 'XPEV', 'LI', 'FSR', 'GOEV',
            'ENPH', 'SEDG', 'FSLR', 'RUN', 'NOVA', 'SPWR', 'MAXN'
        ]
        
        # AI相关
        ai_stocks = [
            'NVDA', 'MSFT', 'GOOGL', 'META', 'AMZN', 'PLTR', 'AI', 'UPST',
            'SOUN', 'BBAI', 'SMCI', 'CRWV', 'TSM', 'ASML', 'AVGO'
        ]
        
        # 合并去重
        all_stocks = list(set(
            sp500 + china_stocks + tech_stocks + semi_stocks + 
            ev_stocks + ai_stocks
        ))
        
        return sorted(all_stocks)
    
    def filter_liquidity(self, stocks: list) -> list:
        """
        初筛：流动性过滤
        - 日均成交量 > 100万股
        - 股价 > $5
        - 市值 > $10亿
        """
        print(f"\n🔄 初筛流动性 ({len(stocks)}只)...")
        filtered = []
        
        for i, symbol in enumerate(stocks, 1):
            if i % 100 == 0:
                print(f"  已处理 {i}/{len(stocks)}...")
            
            try:
                ticker = yf.Ticker(symbol)
                info = ticker.info
                
                # 检查市值
                market_cap = info.get('marketCap', 0)
                if market_cap < 1e9:  # 10亿美元
                    continue
                
                # 检查股价
                current_price = info.get('currentPrice', 0)
                if current_price < 5:
                    continue
                
                # 检查成交量
                volume = info.get('volume', 0)
                avg_volume = info.get('averageVolume', 0)
                if avg_volume < 1e6:  # 100万股
                    continue
                
                filtered.append(symbol)
                
            except:
                continue
        
        print(f"✅ 初筛完成: {len(filtered)} 只")
        return filtered
    
    def filter_technical(self, stocks: list) -> list:
        """
        二筛：技术形态过滤
        - 近期有成交量放大 或
        - 价格突破均线 或
        - RSI处于合理区间
        """
        print(f"\n📈 二筛技术形态 ({len(stocks)}只)...")
        filtered = []
        
        for i, symbol in enumerate(stocks[:200], 1):  # 只处理前200只
            if i % 50 == 0:
                print(f"  已处理 {i}/{min(len(stocks), 200)}...")
            
            try:
                ticker = yf.Ticker(symbol)
                hist = ticker.history(period="20d")
                
                if len(hist) < 20:
                    continue
                
                # 检查成交量放大
                avg_vol = hist['Volume'].mean()
                latest_vol = hist['Volume'].iloc[-1]
                volume_surge = latest_vol > avg_vol * 1.2
                
                # 检查价格动量
                price_change_5d = (hist['Close'].iloc[-1] / hist['Close'].iloc[-5] - 1) * 100
                has_momentum = abs(price_change_5d) > 2  # 5天涨跌>2%
                
                # 检查均线
                ma20 = hist['Close'].rolling(20).mean().iloc[-1]
                current = hist['Close'].iloc[-1]
                near_ma = abs(current / ma20 - 1) < 0.05  # 在MA20附近5%
                
                # 满足任一条件
                if volume_surge or has_momentum or near_ma:
                    filtered.append(symbol)
                
            except:
                continue
        
        print(f"✅ 二筛完成: {len(filtered)} 只")
        return filtered
    
    def scan_with_scorer(self, stocks: list) -> list:
        """
        精筛：多因子评分
        """
        import subprocess
        
        print(f"\n🎯 精筛多因子评分 ({len(stocks)}只)...")
        print("  (每只约需15秒，请耐心等待...)")
        print()
        
        scored_stocks = []
        
        for i, symbol in enumerate(stocks, 1):
            print(f"[{i}/{len(stocks)}] {symbol} ...", end=' ', flush=True)
            
            try:
                cmd = ['python3', '/Users/fox/.openclaw/workspace/tools/multi_factor_scorer.py', 
                       '--symbol', symbol]
                result = subprocess.run(cmd, capture_output=True, text=True, timeout=20)
                
                # 解析评分
                score = None
                for line in result.stdout.split('\n'):
                    if '综合评分' in line and ':' in line:
                        try:
                            score = float(line.split(':')[1].split('/')[0].strip())
                        except:
                            pass
                
                if score:
                    print(f"{score:.1f}分")
                    scored_stocks.append({
                        'symbol': symbol,
                        'score': score
                    })
                else:
                    print("无法评分")
                    
            except Exception as e:
                print(f"错误")
        
        # 按分数排序
        scored_stocks.sort(key=lambda x: x['score'], reverse=True)
        
        print(f"\n✅ 精筛完成: {len(scored_stocks)} 只已评分")
        return scored_stocks
    
    def generate_daily_report(self, all_scored: list):
        """生成每日扫描报告"""
        
        # 筛选高分股票
        high_score = [s for s in all_scored if s['score'] >= 80]
        good_score = [s for s in all_scored if 70 <= s['score'] < 80]
        
        report = []
        report.append("🦐 虾虾全市场每日扫描报告")
        report.append("="*70)
        report.append(f"📅 日期: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        report.append(f"📊 扫描范围: {len(self.universe)} 只股票")
        report.append("")
        
        # 强烈推荐 (>80分)
        if high_score:
            report.append("🔥 强烈推荐 (>80分)")
            report.append("-"*70)
            for s in high_score[:10]:
                report.append(f"  ⭐ {s['symbol']}: {s['score']:.1f}分")
            report.append("")
        
        # 值得关注 (70-80分)
        if good_score:
            report.append("👀 值得关注 (70-80分)")
            report.append("-"*70)
            for s in good_score[:10]:
                report.append(f"  🟡 {s['symbol']}: {s['score']:.1f}分")
            report.append("")
        
        # 统计数据
        report.append("📈 统计")
        report.append("-"*70)
        report.append(f"扫描总数: {len(self.universe)}")
        report.append(f">80分: {len(high_score)} 只")
        report.append(f"70-80分: {len(good_score)} 只")
        report.append(f"平均评分: {sum([s['score'] for s in all_scored])/len(all_scored):.1f}" if all_scored else "N/A")
        report.append("")
        
        report.append("="*70)
        report.append("💡 建议: 关注>80分股票，查看详细分析报告")
        report.append("="*70)
        
        return "\n".join(report)
    
    def run_full_scan(self):
        """运行完整扫描"""
        print("\n" + "="*70)
        print("🚀 启动全市场扫描")
        print("="*70)
        print()
        
        start_time = datetime.now()
        
        # 步骤1: 初筛流动性
        step1 = self.filter_liquidity(self.universe)
        
        # 步骤2: 二筛技术形态
        step2 = self.filter_technical(step1)
        
        # 步骤3: 精筛多因子评分
        scored = self.scan_with_scorer(step2[:50])  # 只评分前50只
        
        # 生成报告
        report = self.generate_daily_report(scored)
        
        # 保存报告
        report_file = f'/Users/fox/.openclaw/workspace/交易日志/daily_scan_{datetime.now().strftime("%Y%m%d")}.txt'
        with open(report_file, 'w', encoding='utf-8') as f:
            f.write(report)
        
        # 打印报告
        print("\n" + report)
        
        end_time = datetime.now()
        duration = (end_time - start_time).total_seconds() / 60
        
        print(f"\n⏱️  扫描耗时: {duration:.1f} 分钟")
        print(f"📄 报告已保存: {report_file}")
        
        return scored


def main():
    """主函数"""
    scanner = MarketScanner()
    scanner.run_full_scan()


if __name__ == "__main__":
    main()
