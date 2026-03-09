#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
日志分析器 - Log Analyzer
作者：虾虾
创建时间：2026-02-09
用途：分析运行日志，错误统计，性能优化建议
"""

import os
import glob
import json
from datetime import datetime
from collections import Counter


class LogAnalyzer:
    """日志分析器"""
    
    def __init__(self):
        self.log_dirs = [
            os.path.expanduser("~/.openclaw/workspace/主控日志"),
            os.path.expanduser("~/.openclaw/workspace/预警日志")
        ]
    
    def find_all_logs(self):
        """查找所有日志文件"""
        logs = []
        for log_dir in self.log_dirs:
            if os.path.exists(log_dir):
                logs.extend(glob.glob(f"{log_dir}/*.json"))
                logs.extend(glob.glob(f"{log_dir}/*.txt"))
        return logs
    
    def analyze_json_log(self, log_file):
        """分析JSON日志"""
        try:
            with open(log_file, 'r') as f:
                data = json.load(f)
            
            results = data.get('results', [])
            
            success_count = sum(1 for r in results if r.get('success'))
            failed_count = len(results) - success_count
            
            return {
                'file': os.path.basename(log_file),
                'total': len(results),
                'success': success_count,
                'failed': failed_count,
                'success_rate': success_count / len(results) * 100 if results else 0
            }
        except:
            return None
    
    def generate_analysis(self):
        """生成分析报告"""
        print("🦐 日志分析报告")
        print("=" * 70)
        print(f"时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print("=" * 70)
        
        logs = self.find_all_logs()
        
        if not logs:
            print("\n⚠️  未找到日志文件")
            return
        
        print(f"\n发现 {len(logs)} 个日志文件")
        print("-" * 70)
        
        all_stats = []
        for log_file in logs:
            stats = self.analyze_json_log(log_file)
            if stats:
                all_stats.append(stats)
        
        if all_stats:
            print("\n📊 日志统计:")
            print(f"{'文件':<30} {'总数':>8} {'成功':>8} {'失败':>8} {'成功率':>10}")
            print("-" * 70)
            
            for stats in all_stats:
                print(f"{stats['file']:<30} {stats['total']:>8} {stats['success']:>8} "
                      f"{stats['failed']:>8} {stats['success_rate']:>9.1f}%")
            
            # 总计
            total_all = sum(s['total'] for s in all_stats)
            success_all = sum(s['success'] for s in all_stats)
            failed_all = sum(s['failed'] for s in all_stats)
            
            print("-" * 70)
            print(f"{'总计':<30} {total_all:>8} {success_all:>8} {failed_all:>8} "
                  f"{success_all/total_all*100:>9.1f}%")
            
            print("\n💡 分析建议:")
            if failed_all > 0:
                print(f"   ⚠️  发现 {failed_all} 次失败，建议检查失败原因")
            else:
                print("   ✅ 所有工具运行正常")
        
        print("\n" + "=" * 70)


def main():
    """主函数"""
    analyzer = LogAnalyzer()
    analyzer.generate_analysis()


if __name__ == "__main__":
    main()
