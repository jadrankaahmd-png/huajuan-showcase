#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
虾虾Obsidian整合模块 - Obsidian Integration
自动将交易记录、分析报告保存到Obsidian知识库
"""

import os
import subprocess
import json
from datetime import datetime
from typing import Dict, Optional


class ObsidianIntegration:
    """
    Obsidian知识库整合
    
    功能：
    1. 自动保存交易记录到Obsidian
    2. 保存个股分析报告
    3. 保存每日交易报告
    4. 保存KOL观点汇总
    5. 建立投资知识库
    """
    
    def __init__(self, vault_name: str = "StockResearch"):
        """
        初始化Obsidian整合
        
        Args:
            vault_name: Obsidian库名称
        """
        self.vault_name = vault_name
        self.cli_available = self._check_cli()
        
        if self.cli_available:
            # 设置默认vault
            self._set_default_vault()
            print(f"✅ Obsidian整合已初始化 (Vault: {vault_name})")
        else:
            print("⚠️  Obsidian CLI未安装，将跳过Obsidian保存")
    
    def _check_cli(self) -> bool:
        """检查Obsidian CLI是否可用"""
        try:
            result = subprocess.run(['which', 'obsidian-cli'], 
                                  capture_output=True, text=True)
            return result.returncode == 0
        except:
            return False
    
    def _set_default_vault(self):
        """设置默认Vault"""
        try:
            subprocess.run(['obsidian-cli', 'set-default', self.vault_name],
                         capture_output=True, timeout=5)
        except:
            pass
    
    def _run_cli(self, command: list, timeout: int = 10) -> bool:
        """运行Obsidian CLI命令"""
        if not self.cli_available:
            return False
        
        try:
            result = subprocess.run(['obsidian-cli'] + command,
                                  capture_output=True, text=True, timeout=timeout)
            return result.returncode == 0
        except Exception as e:
            print(f"❌ Obsidian CLI错误: {e}")
            return False
    
    def record_trade(self, symbol: str, action: str, price: float, 
                    quantity: int, reasoning: str, score: int = None,
                    target_price: float = 0, stop_loss: float = 0) -> bool:
        """
        记录交易到Obsidian
        
        Args:
            symbol: 股票代码
            action: BUY/SELL
            price: 价格
            quantity: 数量
            reasoning: 交易理由
            score: 多因子评分
            target_price: 目标价
            stop_loss: 止损价
        """
        date_str = datetime.now().strftime('%Y-%m-%d')
        time_str = datetime.now().strftime('%H:%M:%S')
        
        # 笔记标题
        title = f"交易日志/{date_str}-{symbol}-{action}"
        
        # 笔记内容
        content = f"""# {symbol} {action} 交易记录

**交易时间:** {date_str} {time_str}  
**股票代码:** {symbol}  
**操作类型:** {action}  
**成交价格:** ${price:.2f}  
**成交数量:** {quantity}股  
**成交金额:** ${price * quantity:,.2f}

## 📊 交易决策

**多因子评分:** {score if score else 'N/A'}/100  
**买入理由:**
{reasoning}

## 🎯 交易计划

**目标价格:** ${target_price:.2f}  
**止损价格:** ${stop_loss:.2f}  
**预期收益:** {((target_price - price) / price * 100):.1f}%  
**最大亏损:** {((price - stop_loss) / price * 100):.1f}%

## 📝 投资逻辑

- [ ] 技术面确认
- [ ] 基本面验证
- [ ] 市场情绪
- [ ] 风险控制

## 📈 后续跟踪

- [ ] 每日更新价格
- [ ] 记录收益变化
- [ ] 达到目标后卖出
- [ ] 总结交易经验

## 💡 复盘总结

**买入后表现:**
- 持有天数:
- 最高收益:
- 最终收益:

**逻辑验证:**
- 买入理由是否成立:
- 评分是否准确:
- 下次改进:

---
*记录时间: {datetime.now().isoformat()}*  
*记录者: 🦐 虾虾*
"""
        
        # 使用echo和管道创建笔记
        try:
            # 创建临时文件
            temp_file = f"/tmp/obsidian_trade_{symbol}_{action}.md"
            with open(temp_file, 'w', encoding='utf-8') as f:
                f.write(content)
            
            # 使用obsidian-cli创建笔记
            cmd = ['obsidian-cli', 'create', title, '--content', content]
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=10)
            
            if result.returncode == 0 or "already exists" in result.stderr:
                print(f"✅ 交易记录已保存到Obsidian: {title}")
                return True
            else:
                # 如果创建失败，尝试追加
                append_cmd = ['obsidian-cli', 'append', title, '--content', 
                             f"\n\n---\n\n**更新 {time_str}:** {action}执行"]
                subprocess.run(append_cmd, capture_output=True, timeout=10)
                return True
                
        except Exception as e:
            print(f"⚠️  Obsidian保存失败 (将保存到本地): {e}")
            # 保存到本地备份
            backup_file = f"{os.path.expanduser('~')}/.openclaw/workspace/Obsidian备份/{title.replace('/', '_')}.md"
            os.makedirs(os.path.dirname(backup_file), exist_ok=True)
            with open(backup_file, 'w', encoding='utf-8') as f:
                f.write(content)
            return False
    
    def save_stock_analysis(self, symbol: str, analysis_content: str, 
                           report_type: str = "个股分析") -> bool:
        """
        保存个股分析报告到Obsidian
        
        Args:
            symbol: 股票代码
            analysis_content: 分析报告内容
            report_type: 报告类型
        """
        date_str = datetime.now().strftime('%Y-%m-%d')
        title = f"{report_type}/{symbol}-{date_str}"
        
        # 添加Obsidian frontmatter
        content = f"""---
title: {symbol} 分析报告
date: {date_str}
type: {report_type}
source: 虾虾分析
---

{analysis_content}

---
*生成时间: {datetime.now().isoformat()}*  
*分析师: 🦐 虾虾*
"""
        
        try:
            cmd = ['obsidian-cli', 'create', title, '--content', content]
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=10)
            
            if result.returncode == 0:
                print(f"✅ 分析报告已保存到Obsidian: {title}")
                return True
            else:
                # 保存到备份
                backup_file = f"{os.path.expanduser('~')}/.openclaw/workspace/Obsidian备份/{title.replace('/', '_')}.md"
                os.makedirs(os.path.dirname(backup_file), exist_ok=True)
                with open(backup_file, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f"✅ 分析报告已保存到本地备份")
                return True
                
        except Exception as e:
            print(f"⚠️  保存失败: {e}")
            return False
    
    def save_daily_report(self, report_content: str, date: str = None) -> bool:
        """
        保存每日交易报告到Obsidian
        
        Args:
            report_content: 报告内容
            date: 日期 (默认今天)
        """
        if not date:
            date = datetime.now().strftime('%Y-%m-%d')
        
        title = f"每日报告/{date}-交易日报"
        
        content = f"""---
title: {date} 交易日报
date: {date}
type: 每日报告
---

{report_content}

---
*生成时间: {datetime.now().isoformat()}*  
*报告者: 🦐 虾虾*
"""
        
        try:
            cmd = ['obsidian-cli', 'create', title, '--content', content]
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=10)
            
            if result.returncode == 0:
                print(f"✅ 每日报告已保存到Obsidian: {title}")
                return True
            else:
                # 保存到备份
                backup_file = f"{os.path.expanduser('~')}/.openclaw/workspace/Obsidian备份/{title.replace('/', '_')}.md"
                os.makedirs(os.path.dirname(backup_file), exist_ok=True)
                with open(backup_file, 'w', encoding='utf-8') as f:
                    f.write(content)
                return True
                
        except Exception as e:
            print(f"⚠️  保存失败: {e}")
            return False
    
    def create_investment_note(self, title: str, content: str, 
                               folder: str = "投资笔记") -> bool:
        """
        创建投资笔记
        
        Args:
            title: 笔记标题
            content: 笔记内容
            folder: 文件夹
        """
        full_title = f"{folder}/{title}"
        
        try:
            cmd = ['obsidian-cli', 'create', full_title, '--content', content]
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=10)
            
            if result.returncode == 0:
                print(f"✅ 投资笔记已保存: {full_title}")
                return True
            else:
                # 保存到备份
                backup_file = f"{os.path.expanduser('~')}/.openclaw/workspace/Obsidian备份/{full_title.replace('/', '_')}.md"
                os.makedirs(os.path.dirname(backup_file), exist_ok=True)
                with open(backup_file, 'w', encoding='utf-8') as f:
                    f.write(content)
                return True
                
        except Exception as e:
            print(f"⚠️  保存失败: {e}")
            return False
    
    def search_notes(self, query: str) -> list:
        """
        搜索Obsidian笔记
        
        Args:
            query: 搜索关键词
        
        Returns:
            搜索结果列表
        """
        try:
            cmd = ['obsidian-cli', 'search', query]
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=10)
            
            if result.returncode == 0:
                return result.stdout.strip().split('\n')
            else:
                return []
        except:
            return []


# 测试函数
def test_obsidian_integration():
    """测试Obsidian整合"""
    print("🦐 测试Obsidian整合")
    print("="*70)
    
    obs = ObsidianIntegration(vault_name="StockResearch")
    
    # 测试记录交易
    print("\n1️⃣ 测试记录交易...")
    obs.record_trade(
        symbol='GFS',
        action='BUY',
        price=43.10,
        quantity=100,
        reasoning='多因子评分85分，技术突破MA20，NVTS GaN代工催化',
        score=85,
        target_price=55.0,
        stop_loss=38.0
    )
    
    # 测试保存分析
    print("\n2️⃣ 测试保存分析报告...")
    analysis = """## GFS 分析报告

### 基本面
- 收入: $6.79B
- 毛利率: 24%
- 估值合理

### 技术面
- 多头排列
- RSI健康

### 结论
买入评级
"""
    obs.save_stock_analysis('GFS', analysis)
    
    print("\n✅ 测试完成!")


if __name__ == "__main__":
    test_obsidian_integration()
