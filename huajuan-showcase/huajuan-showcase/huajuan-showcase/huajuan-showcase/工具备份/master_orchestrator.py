#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
多工具自动化编排器 - Master Orchestrator
作者：虾虾
创建时间：2026-02-09
用途：一键运行所有相关工具，自动收集数据，生成综合报告，调度定时任务
"""

import os
import sys
import json
import subprocess
import time
from datetime import datetime, timedelta
from typing import List, Dict, Optional, Tuple
import asyncio
from concurrent.futures import ThreadPoolExecutor, as_completed


class MasterOrchestrator:
    """
    多工具自动化编排器
    
    功能：
    1. 定义和执行工作流
    2. 自动收集数据
    3. 生成综合报告
    4. 调度定时任务
    5. 管理工具依赖关系
    """
    
    def __init__(self):
        self.tools_dir = os.path.expanduser("~/.openclaw/workspace/tools")
        self.output_dir = os.path.expanduser("~/.openclaw/workspace/自动化报告")
        os.makedirs(self.output_dir, exist_ok=True)
        
        # 工具注册表
        self.tools = self._register_tools()
        
        # 工作流定义
        self.workflows = self._define_workflows()
        
        # 执行日志
        self.execution_log = []
        
        print("🦐 多工具自动化编排器启动")
        print(f"📂 工具目录: {self.tools_dir}")
        print(f"📂 输出目录: {self.output_dir}")
        print("="*70)
    
    def _register_tools(self) -> Dict:
        """注册所有可用工具"""
        tools = {
            # 新闻/社交监控
            'comprehensive_news_search': {
                'file': 'comprehensive_news_search.py',
                'type': 'python',
                'description': '综合新闻搜索',
                'args': ['--query', '--days'],
                'output': 'json'
            },
            'reddit_monitor': {
                'file': 'reddit_monitor.py',
                'type': 'python',
                'description': 'Reddit监控',
                'args': ['--stock', '--keyword', '--subreddit'],
                'output': 'json'
            },
            'pushshift_monitor': {
                'file': 'pushshift_monitor.py',
                'type': 'python',
                'description': 'Pushshift Reddit监控（免费）',
                'args': ['--stock', '--keyword', '--time'],
                'output': 'json'
            },
            'twitter_kol_monitor': {
                'file': 'twitter_kol_monitor.py',
                'type': 'python',
                'description': 'Twitter KOL监控',
                'args': ['--all', '--user'],
                'output': 'json'
            },
            
            # 财务分析
            'financial_analyzer': {
                'file': 'financial_analyzer.py',
                'type': 'python',
                'description': '财务深度分析',
                'args': ['--symbol'],
                'output': 'json'
            },
            'valuation_calculator': {
                'file': 'valuation_calculator.py',
                'type': 'python',
                'description': '估值计算器',
                'args': ['--symbol'],
                'output': 'json'
            },
            'earnings_surprise_analyzer': {
                'file': 'earnings_surprise_analyzer.py',
                'type': 'python',
                'description': '盈利超预期分析',
                'args': ['--symbol'],
                'output': 'json'
            },
            'management_evaluator': {
                'file': 'management_evaluator.py',
                'type': 'python',
                'description': '管理层质量评估',
                'args': ['--symbol'],
                'output': 'json'
            },
            
            # 市场分析
            'options_analyzer': {
                'file': 'options_analyzer.py',
                'type': 'python',
                'description': '期权分析',
                'args': ['--symbol'],
                'output': 'json'
            },
            'technical_scanner': {
                'file': 'technical_scanner.py',
                'type': 'python',
                'description': '技术扫描',
                'args': ['--symbol'],
                'output': 'json'
            },
            'sentiment_analyzer': {
                'file': 'sentiment_analyzer.py',
                'type': 'python',
                'description': '情绪分析',
                'args': ['--symbol', '--market'],
                'output': 'json'
            },
            'macro_monitor': {
                'file': 'macro_monitor.py',
                'type': 'python',
                'description': '宏观监控',
                'args': [],
                'output': 'json'
            },
            
            # 回测/策略
            'portfolio_backtest': {
                'file': 'portfolio_backtest.py',
                'type': 'python',
                'description': '组合回测',
                'args': ['--symbol', '--strategy'],
                'output': 'json'
            },
            'risk_calculator': {
                'file': 'risk_calculator.py',
                'type': 'python',
                'description': '风险计算',
                'args': ['--symbol'],
                'output': 'json'
            },
            
            # 实时监控
            'intraday_monitor': {
                'file': 'intraday_monitor.py',
                'type': 'python',
                'description': '盘中监控',
                'args': ['--once', '--interval'],
                'output': 'console'
            },
            'news_aggregator': {
                'file': 'news_aggregator.py',
                'type': 'python',
                'description': '新闻聚合',
                'args': ['--save'],
                'output': 'json'
            },
        }
        
        return tools
    
    def _define_workflows(self) -> Dict:
        """定义工作流"""
        workflows = {
            # 工作流1: 个股深度分析
            'individual_stock_analysis': {
                'name': '个股深度分析',
                'description': '对单只股票进行全面分析',
                'steps': [
                    {
                        'name': '价格数据获取',
                        'tool': None,
                        'function': 'get_price_data',
                        'description': '获取股票价格和成交量'
                    },
                    {
                        'name': '新闻搜索',
                        'tool': 'comprehensive_news_search',
                        'args': {'days': 7},
                        'parallel': False
                    },
                    {
                        'name': 'Reddit监控',
                        'tool': 'pushshift_monitor',
                        'args': {'time': '7d'},
                        'parallel': True
                    },
                    {
                        'name': '财务分析',
                        'tool': 'financial_analyzer',
                        'args': {},
                        'parallel': False
                    },
                    {
                        'name': '估值分析',
                        'tool': 'valuation_calculator',
                        'args': {},
                        'parallel': False
                    },
                    {
                        'name': '期权分析',
                        'tool': 'options_analyzer',
                        'args': {},
                        'parallel': True
                    },
                    {
                        'name': '技术分析',
                        'tool': 'technical_scanner',
                        'args': {},
                        'parallel': True
                    },
                    {
                        'name': '管理层评估',
                        'tool': 'management_evaluator',
                        'args': {},
                        'parallel': False
                    },
                    {
                        'name': '回测分析',
                        'tool': 'portfolio_backtest',
                        'args': {'strategy': 'sma'},
                        'parallel': True
                    },
                    {
                        'name': '情绪分析',
                        'tool': 'sentiment_analyzer',
                        'args': {},
                        'parallel': True
                    },
                    {
                        'name': '整合报告',
                        'tool': None,
                        'function': 'generate_stock_report',
                        'description': '整合所有分析结果'
                    }
                ]
            },
            
            # 工作流2: 每日监控
            'daily_monitoring': {
                'name': '每日监控',
                'description': '每日市场监控和简报',
                'steps': [
                    {
                        'name': '盘前监控',
                        'tool': 'intraday_monitor',
                        'args': {'once': True, 'premarket': True},
                        'parallel': False
                    },
                    {
                        'name': '新闻聚合',
                        'tool': 'news_aggregator',
                        'args': {'save': True},
                        'parallel': True
                    },
                    {
                        'name': '情绪分析',
                        'tool': 'sentiment_analyzer',
                        'args': {'market': True},
                        'parallel': True
                    },
                    {
                        'name': '宏观监控',
                        'tool': 'macro_monitor',
                        'args': {},
                        'parallel': True
                    },
                    {
                        'name': '社交监控',
                        'tool': 'pushshift_monitor',
                        'args': {'stock': 'NVDA', 'time': '24h'},
                        'parallel': True
                    },
                    {
                        'name': '生成每日报告',
                        'tool': None,
                        'function': 'generate_daily_report',
                        'description': '整合每日监控数据'
                    }
                ]
            },
            
            # 工作流3: 财报季准备
            'earnings_season_prep': {
                'name': '财报季准备',
                'description': '财报季前风险评估',
                'steps': [
                    {
                        'name': '获取财报日历',
                        'tool': 'earnings_surprise_analyzer',
                        'args': {'calendar': True},
                        'parallel': False
                    },
                    {
                        'name': '持仓股财报检查',
                        'tool': None,
                        'function': 'check_holdings_earnings',
                        'description': '检查持仓股未来财报'
                    },
                    {
                        'name': '期权IV分析',
                        'tool': 'options_analyzer',
                        'args': {'check_iv': True},
                        'parallel': True
                    },
                    {
                        'name': '历史超预期分析',
                        'tool': 'earnings_surprise_analyzer',
                        'args': {'history': True},
                        'parallel': True
                    },
                    {
                        'name': '生成财报风险报告',
                        'tool': None,
                        'function': 'generate_earnings_report',
                        'description': '整合财报风险数据'
                    }
                ]
            },
            
            # 工作流4: 快速扫描
            'quick_scan': {
                'name': '快速扫描',
                'description': '快速扫描多只股票',
                'steps': [
                    {
                        'name': '并行扫描',
                        'tool': None,
                        'function': 'parallel_stock_scan',
                        'description': '并行扫描多只股票'
                    }
                ]
            }
        }
        
        return workflows
    
    def execute_tool(self, tool_name: str, symbol: str = None, 
                    extra_args: Dict = None) -> Tuple[bool, str, Dict]:
        """
        执行单个工具
        
        Returns:
            (成功/失败, 输出信息, 结果数据)
        """
        if tool_name not in self.tools:
            return False, f"未知工具: {tool_name}", {}
        
        tool = self.tools[tool_name]
        tool_path = os.path.join(self.tools_dir, tool['file'])
        
        if not os.path.exists(tool_path):
            return False, f"工具文件不存在: {tool_path}", {}
        
        # 构建命令
        if tool['type'] == 'python':
            cmd = ['python3', tool_path]
        else:
            cmd = [tool_path]
        
        # 添加参数
        if symbol:
            cmd.extend(['--symbol', symbol])
        
        if extra_args:
            for key, value in extra_args.items():
                cmd.append(f"--{key}")
                if value is not True:  # 不是flag参数
                    cmd.append(str(value))
        
        # 执行
        try:
            print(f"  🔄 执行: {tool_name} ...")
            result = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                timeout=120  # 2分钟超时
            )
            
            if result.returncode == 0:
                print(f"  ✅ {tool_name} 成功")
                
                # 尝试解析JSON输出
                try:
                    output_data = json.loads(result.stdout)
                except:
                    output_data = {'stdout': result.stdout}
                
                return True, result.stdout, output_data
            else:
                print(f"  ❌ {tool_name} 失败: {result.stderr}")
                return False, result.stderr, {}
                
        except subprocess.TimeoutExpired:
            print(f"  ⏱️ {tool_name} 超时")
            return False, "执行超时", {}
        except Exception as e:
            print(f"  ❌ {tool_name} 异常: {e}")
            return False, str(e), {}
    
    def run_workflow(self, workflow_name: str, symbol: str = None,
                    parallel: bool = True) -> Dict:
        """
        运行工作流
        
        Args:
            workflow_name: 工作流名称
            symbol: 股票代码（如果适用）
            parallel: 是否并行执行
            
        Returns:
            工作流执行结果
        """
        if workflow_name not in self.workflows:
            print(f"❌ 未知工作流: {workflow_name}")
            return {}
        
        workflow = self.workflows[workflow_name]
        print(f"\n🔄 启动工作流: {workflow['name']}")
        print(f"📋 {workflow['description']}")
        print(f"📊 共 {len(workflow['steps'])} 个步骤")
        if symbol:
            print(f"🎯 目标股票: {symbol}")
        print("="*70)
        
        results = {
            'workflow': workflow_name,
            'symbol': symbol,
            'start_time': datetime.now().isoformat(),
            'steps': [],
            'success': True
        }
        
        # 串行执行
        if not parallel:
            for step in workflow['steps']:
                step_result = self._execute_step(step, symbol)
                results['steps'].append(step_result)
                if not step_result['success']:
                    results['success'] = False
        
        # 并行执行（按批次）
        else:
            i = 0
            while i < len(workflow['steps']):
                # 收集可并行的步骤
                parallel_steps = []
                while i < len(workflow['steps']) and workflow['steps'][i].get('parallel', False):
                    parallel_steps.append(workflow['steps'][i])
                    i += 1
                
                # 如果有串行步骤，先执行
                if i < len(workflow['steps']) and not workflow['steps'][i].get('parallel', False):
                    step_result = self._execute_step(workflow['steps'][i], symbol)
                    results['steps'].append(step_result)
                    if not step_result['success']:
                        results['success'] = False
                    i += 1
                
                # 并行执行收集的步骤
                if parallel_steps:
                    print(f"\n🚀 并行执行 {len(parallel_steps)} 个步骤...")
                    with ThreadPoolExecutor(max_workers=3) as executor:
                        futures = {
                            executor.submit(self._execute_step, step, symbol): step 
                            for step in parallel_steps
                        }
                        for future in as_completed(futures):
                            step_result = future.result()
                            results['steps'].append(step_result)
                            if not step_result['success']:
                                results['success'] = False
        
        results['end_time'] = datetime.now().isoformat()
        
        # 保存结果
        self._save_workflow_result(results)
        
        # 打印摘要
        self._print_workflow_summary(results)
        
        return results
    
    def _execute_step(self, step: Dict, symbol: str) -> Dict:
        """执行单个步骤"""
        step_name = step['name']
        print(f"\n▶️ 步骤: {step_name}")
        
        result = {
            'name': step_name,
            'start_time': datetime.now().isoformat(),
            'success': False,
            'output': '',
            'data': {}
        }
        
        # 执行工具
        if step.get('tool'):
            tool_name = step['tool']
            extra_args = step.get('args', {})
            
            success, output, data = self.execute_tool(tool_name, symbol, extra_args)
            
            result['success'] = success
            result['output'] = output
            result['data'] = data
        
        # 执行内置函数
        elif step.get('function'):
            func_name = step['function']
            if hasattr(self, func_name):
                func = getattr(self, func_name)
                try:
                    data = func(symbol) if symbol else func()
                    result['success'] = True
                    result['data'] = data
                except Exception as e:
                    result['success'] = False
                    result['output'] = str(e)
            else:
                result['output'] = f"未知函数: {func_name}"
        
        result['end_time'] = datetime.now().isoformat()
        
        return result
    
    def _save_workflow_result(self, results: Dict):
        """保存工作流结果"""
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        symbol = results.get('symbol', 'general')
        workflow = results['workflow']
        
        filename = f"{workflow}_{symbol}_{timestamp}.json"
        filepath = os.path.join(self.output_dir, filename)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(results, f, ensure_ascii=False, indent=2)
        
        print(f"\n💾 结果已保存: {filepath}")
    
    def _print_workflow_summary(self, results: Dict):
        """打印工作流摘要"""
        print("\n" + "="*70)
        print("📊 工作流执行摘要")
        print("="*70)
        
        total_steps = len(results['steps'])
        successful_steps = sum(1 for s in results['steps'] if s['success'])
        
        print(f"总步骤: {total_steps}")
        print(f"成功: {successful_steps}")
        print(f"失败: {total_steps - successful_steps}")
        print(f"成功率: {successful_steps/total_steps*100:.1f}%")
        
        # 执行时间
        start = datetime.fromisoformat(results['start_time'])
        end = datetime.fromisoformat(results['end_time'])
        duration = (end - start).total_seconds()
        print(f"执行时间: {duration:.1f}秒")
        
        print("\n步骤详情:")
        for i, step in enumerate(results['steps'], 1):
            status = "✅" if step['success'] else "❌"
            print(f"  {i}. {status} {step['name']}")
        
        print("="*70)
    
    def list_workflows(self):
        """列出所有工作流"""
        print("\n📋 可用工作流:")
        print("="*70)
        
        for name, workflow in self.workflows.items():
            print(f"\n{name}:")
            print(f"  名称: {workflow['name']}")
            print(f"  描述: {workflow['description']}")
            print(f"  步骤数: {len(workflow['steps'])}")
        
        print("\n" + "="*70)
    
    def list_tools(self):
        """列出所有工具"""
        print("\n🛠️ 可用工具:")
        print("="*70)
        
        for name, tool in self.tools.items():
            print(f"\n{name}:")
            print(f"  文件: {tool['file']}")
            print(f"  描述: {tool['description']}")
            print(f"  参数: {', '.join(tool['args'])}")
        
        print("\n" + "="*70)


def main():
    """主函数"""
    import argparse
    
    parser = argparse.ArgumentParser(
        description='虾虾多工具自动化编排器',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
使用示例:
  # 运行个股分析工作流
  python3 master_orchestrator.py --workflow individual_stock_analysis --symbol NVDA
  
  # 运行每日监控
  python3 master_orchestrator.py --workflow daily_monitoring
  
  # 列出所有工作流
  python3 master_orchestrator.py --list-workflows
  
  # 列出所有工具
  python3 master_orchestrator.py --list-tools
  
  # 串行执行（不并行）
  python3 master_orchestrator.py --workflow quick_scan --symbol NVDA --no-parallel
        """
    )
    
    parser.add_argument('--workflow', '-w', type=str, 
                       help='工作流名称')
    parser.add_argument('--symbol', '-s', type=str,
                       help='股票代码')
    parser.add_argument('--list-workflows', action='store_true',
                       help='列出所有工作流')
    parser.add_argument('--list-tools', action='store_true',
                       help='列出所有工具')
    parser.add_argument('--no-parallel', action='store_true',
                       help='禁用并行执行')
    
    args = parser.parse_args()
    
    orchestrator = MasterOrchestrator()
    
    if args.list_workflows:
        orchestrator.list_workflows()
    elif args.list_tools:
        orchestrator.list_tools()
    elif args.workflow:
        results = orchestrator.run_workflow(
            args.workflow,
            args.symbol,
            parallel=not args.no_parallel
        )
    else:
        print("🦐 虾虾多工具自动化编排器")
        print("="*70)
        print("\n使用方法:")
        print("  --workflow NAME    运行指定工作流")
        print("  --symbol SYMBOL    指定股票代码")
        print("  --list-workflows   列出所有工作流")
        print("  --list-tools       列出所有工具")
        print("\n详细帮助:")
        print("  python3 master_orchestrator.py --help")


if __name__ == "__main__":
    main()
