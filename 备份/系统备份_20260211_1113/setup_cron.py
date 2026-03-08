#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Cron任务设置脚本 - Cron Setup
作者：虾虾
创建时间：2026-02-08
用途：设置定时任务，每日自动运行工具
"""

import os
from datetime import datetime


class CronSetup:
    """Cron设置"""
    
    def __init__(self):
        self.workspace = os.path.expanduser("~/.openclaw/workspace")
        self.tools_dir = f"{self.workspace}/tools"
    
    def generate_cron_jobs(self):
        """生成cron任务"""
        jobs = [
            # 早晨6点：KOL监控 + 新闻聚合
            "0 6 * * * cd {tools} && python3 twitter_kol_monitor.py --all >> /tmp/kol_monitor.log 2>&1",
            "5 6 * * * cd {tools} && python3 news_aggregator.py >> /tmp/news_agg.log 2>&1",
            
            # 上午9点：市场分析
            "0 9 * * * cd {tools} && python3 market_breadth_analyzer.py >> /tmp/market_breadth.log 2>&1",
            "5 9 * * * cd {tools} && python3 sector_rotation_tracker.py >> /tmp/sector_rotation.log 2>&1",
            
            # 下午5点：生成报告
            "0 17 * * * cd {tools} && python3 earnings_enhanced.py >> /tmp/earnings.log 2>&1",
            "10 17 * * * cd {tools} && python3 report_generator.py >> /tmp/report_gen.log 2>&1",
            
            # 晚上10点：备份
            "0 22 * * * cd {tools} && python3 backup_tool.py >> /tmp/backup.log 2>&1",
            
            # 每小时：价格监控（可选）
            "0 * * * * cd {tools} && python3 technical_scanner.py --scan NVDA TSM >> /tmp/tech_scan.log 2>&1"
        ]
        
        return [job.format(tools=self.tools_dir) for job in jobs]
    
    def show_cron_config(self):
        """显示cron配置"""
        print("🦐 Cron任务配置")
        print("=" * 70)
        print(f"生成时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print("=" * 70)
        
        print("\n📅 定时任务安排:")
        print("-" * 70)
        
        schedule = [
            ("06:00", "KOL监控 + 新闻聚合"),
            ("09:00", "市场广度 + 板块轮动"),
            ("17:00", "财报监控 + 报告生成"),
            ("22:00", "数据备份"),
            ("每小时", "技术扫描"),
        ]
        
        for time, task in schedule:
            print(f"  🕐 {time:<8} - {task}")
        
        print("\n" + "=" * 70)
        print("🔧 设置方法:")
        print("-" * 70)
        print("\n1. 打开crontab编辑器:")
        print("   crontab -e")
        
        print("\n2. 添加以下任务（复制粘贴）:")
        print("   # 虾虾金融工具定时任务")
        
        for job in self.generate_cron_jobs():
            print(f"   {job}")
        
        print("\n3. 保存并退出")
        
        print("\n4. 验证设置:")
        print("   crontab -l")
        
        print("\n5. 查看日志:")
        print("   tail -f /tmp/kol_monitor.log")
        
        print("\n" + "=" * 70)
        print("💡 提示:")
        print("   • 确保Python路径正确")
        print("   • 日志文件会保存在/tmp/目录")
        print("   • 可通过'crontab -r'删除所有任务")
        print("=" * 70)


def main():
    """主函数"""
    setup = CronSetup()
    setup.show_cron_config()


if __name__ == "__main__":
    main()
