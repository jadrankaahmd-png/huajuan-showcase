#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
每日工作流 - Daily Workflow
作者：虾虾
创建时间：2026-02-08
用途：虾虾每日标准工作流程，检查所有监控数据，生成报告
"""

import os
import subprocess
from datetime import datetime
import time


class DailyWorkflow:
    """每日工作流"""
    
    def __init__(self):
        self.workspace = os.path.expanduser("~/.openclaw/workspace")
        self.tools_dir = f"{self.workspace}/tools"
    
    def run_tool(self, tool_name, args=''):
        """运行工具"""
        cmd = f"cd {self.tools_dir} && python3 {tool_name} {args}"
        try:
            result = subprocess.run(cmd, shell=True, capture_output=True, text=True, timeout=60)
            return result.returncode == 0
        except:
            return False
    
    def morning_routine(self):
        """早晨流程"""
        print("\n🌅 早晨流程 (06:00)")
        print("=" * 70)
        
        print("\n1️⃣ KOL监控...")
        self.run_tool("twitter_kol_monitor.py", "--all")
        
        print("\n2️⃣ 新闻聚合...")
        self.run_tool("news_aggregator.py")
        
        print("\n3️⃣ 全球市场...")
        self.run_tool("global_market_monitor.py")
        
        print("\n✅ 早晨流程完成！")
    
    def market_open_routine(self):
        """开盘前流程"""
        print("\n🔔 开盘前流程 (09:00)")
        print("=" * 70)
        
        print("\n1️⃣ 市场广度分析...")
        self.run_tool("market_breadth_analyzer.py")
        
        print("\n2️⃣ 板块轮动追踪...")
        self.run_tool("sector_rotation_tracker.py")
        
        print("\n3️⃣ 技术扫描...")
        self.run_tool("technical_scanner.py", "--scan NVDA TSM AMD INTC")
        
        print("\n✅ 开盘前流程完成！")
    
    def report_routine(self):
        """报告生成流程"""
        print("\n📊 报告生成流程 (17:00)")
        print("=" * 70)
        
        print("\n1️⃣ 财报监控...")
        self.run_tool("earnings_enhanced.py")
        
        print("\n2️⃣ 期权流分析...")
        self.run_tool("options_flow_analyzer.py")
        
        print("\n3️⃣ 分析师评级...")
        self.run_tool("analyst_rating_aggregator.py")
        
        print("\n4️⃣ 生成报告...")
        self.run_tool("report_generator.py")
        
        print("\n✅ 报告生成完成！")
    
    def evening_routine(self):
        """晚间流程"""
        print("\n🌙 晚间流程 (22:00)")
        print("=" * 70)
        
        print("\n1️⃣ 组合优化...")
        self.run_tool("portfolio_optimizer.py", "sharpe NVDA TSM AMD")
        
        print("\n2️⃣ 风险计算...")
        self.run_tool("risk_calculator.py", "NVDA TSM AMD")
        
        print("\n3️⃣ 数据备份...")
        self.run_tool("backup_tool.py")
        
        print("\n✅ 晚间流程完成！")
    
    def run_full_workflow(self):
        """运行完整工作流"""
        print("🦐 虾虾每日工作流")
        print(f"开始时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print("=" * 70)
        
        # 根据当前时间决定运行哪个阶段
        hour = datetime.now().hour
        
        if hour < 9:
            self.morning_routine()
        elif hour < 17:
            self.market_open_routine()
        elif hour < 22:
            self.report_routine()
        else:
            self.evening_routine()
        
        print("\n" + "=" * 70)
        print("✅ 每日工作流全部完成！")


def main():
    """主函数"""
    workflow = DailyWorkflow()
    workflow.run_full_workflow()


if __name__ == "__main__":
    main()
