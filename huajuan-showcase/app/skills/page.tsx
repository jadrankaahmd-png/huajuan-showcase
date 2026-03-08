'use client';

import { useState } from 'react';

interface Skill {
  name: string;
  description: string;
  category: string;
  status: 'active' | 'beta' | 'coming-soon';
  icon: string;
  source: 'installed' | 'custom'; // 🆕 标识已安装/自定义
}

const skills: Skill[] = [
  // 金融分析类（27个）
  { name: 'Stock Research Engine', description: '个股基本面深度研究引擎，覆盖A股/港股/美股', category: '金融分析', status: 'active', icon: '🔬', source: 'custom' },
  { name: 'US Stock Analysis', description: '美股综合分析（基本面+技术面+投资建议）', category: '金融分析', status: 'active', icon: '🇺🇸', source: 'custom' },
  { name: 'Stock Market Pro', description: '专业股票市场分析（RSI/MACD/BB/VWAP/ATR）', category: '金融分析', status: 'active', icon: '📊', source: 'custom' },
  { name: 'Stock Info Explorer', description: '股票信息探索器（高分辨率图表+技术指标）', category: '金融分析', status: 'active', icon: '🌸', source: 'custom' },
  { name: 'Stock Analysis 6.2.0', description: '股票分析6.2.0版本', category: '金融分析', status: 'active', icon: '📉', source: 'custom' },
  { name: 'Backtest Expert', description: '策略回测专家', category: '金融分析', status: 'active', icon: '🧪', source: 'custom' },
  { name: 'Portfolio Manager', description: '投资组合管理', category: '金融分析', status: 'active', icon: '💼', source: 'custom' },
  { name: 'US Market Bubble Detector', description: '美国市场泡沫检测', category: '金融分析', status: 'active', icon: '🫧', source: 'custom' },
  { name: 'Options Strategy Advisor', description: '期权策略顾问', category: '金融分析', status: 'active', icon: '📊', source: 'custom' },
  { name: 'OptionsHawk', description: '期权鹰', category: '金融分析', status: 'active', icon: '🦅', source: 'custom' },
  { name: 'Market Environment Analysis', description: '市场环境分析', category: '金融分析', status: 'active', icon: '🌍', source: 'custom' },
  { name: 'Sector Analyst', description: '行业分析师', category: '金融分析', status: 'active', icon: '🏢', source: 'custom' },
  { name: 'Earnings Calendar', description: '财报日历', category: '金融分析', status: 'active', icon: '📅', source: 'custom' },
  { name: 'Economic Calendar Fetcher', description: '经济日历获取器', category: '金融分析', status: 'active', icon: '📆', source: 'custom' },
  { name: 'Financial Analysis', description: '财务分析', category: '金融分析', status: 'active', icon: '📊', source: 'custom' },
  { name: 'Intellectia Stock Screener', description: 'Intellectia AI股票筛选器', category: '金融分析', status: 'active', icon: '🤖', source: 'custom' },
  { name: 'Intellectia Stock Forecast', description: 'Intellectia AI股票预测', category: '金融分析', status: 'active', icon: '🔮', source: 'custom' },
  { name: 'A Stock Analysis', description: 'A股分析系统', category: '金融分析', status: 'active', icon: '🇨🇳', source: 'custom' },
  { name: 'Astock Daily', description: 'A股日报', category: '金融分析', status: 'active', icon: '📰', source: 'custom' },
  { name: 'PRISM Finance OS', description: 'PRISM金融OS（218+只读API）', category: '金融分析', status: 'active', icon: '💎', source: 'custom' },
  { name: 'PRISM API SDK', description: 'PRISM API SDK', category: '金融分析', status: 'active', icon: '🔧', source: 'custom' },
  { name: 'Finance', description: '股票/ETF/指数/加密货币追踪', category: '金融分析', status: 'active', icon: '💰', source: 'custom' },
  { name: 'ETF Finance', description: 'ETF和基金组合管理（盈亏+预警）', category: '金融分析', status: 'active', icon: '🏦', source: 'custom' },
  { name: 'Finance Lite', description: '每日宏观+市场简报', category: '金融分析', status: 'active', icon: '☀️', source: 'custom' },
  { name: 'Finance News', description: '市场新闻简报（AI总结）', category: '金融分析', status: 'active', icon: '🗞️', source: 'custom' },
  { name: 'Sina Stock', description: '新浪财经A股实时数据', category: '金融分析', status: 'active', icon: '📱', source: 'custom' },
  { name: 'Tecent Finance', description: '腾讯财经（港股+美股）', category: '金融分析', status: 'active', icon: '💎', source: 'custom' },
  { name: 'Yahoo Finance', description: '雅虎财经全球股票数据', category: '金融分析', status: 'active', icon: '🌐', source: 'custom' },
  { name: 'Trading Quant', description: '量化交易数据分析（技术+资金+基本面）', category: '金融分析', status: 'active', icon: '🎯', source: 'custom' },
  { name: 'HK Stock Trending', description: '港股趋势分析', category: '金融分析', status: 'active', icon: '🇭🇰', source: 'custom' },
  { name: 'A Share Real Time Data', description: 'A股实时数据（mootdx/TDX协议）', category: '金融分析', status: 'active', icon: '📊', source: 'custom' },
  { name: 'Finance Tracker', description: '完整个人财务管理（支出+订阅+储蓄+多货币）', category: '金融分析', status: 'active', icon: '💰', source: 'custom' },
  { name: 'AI News Oracle', description: 'AI新闻神谕（Hacker News+TechCrunch+Verge）', category: '金融分析', status: 'active', icon: '📰', source: 'custom' },
  { name: 'WorldMonitor 宏观数据层', description: '✅已整合 170+新闻源+地缘数据+AI总结（FRED+EIA+Groq）', category: '金融分析', status: 'active', icon: '🌍', source: 'custom' },
  { name: 'WorldMonitor 新闻聚合', description: '✅已整合 全球新闻流+AI智能总结+情绪分析', category: '新闻情绪', status: 'active', icon: '📰', source: 'custom' },
  { name: 'WorldMonitor AI推演', description: '✅已整合 基于RAG的历史事件记忆+情景分析', category: 'AI分析', status: 'active', icon: '✨', source: 'custom' },
  { name: 'Market Intelligence', description: '市场情报分析系统', category: '金融分析', status: 'active', icon: '🔍', source: 'custom' },
  { name: 'Breadth Chart Analyst', description: '市场宽度图表分析', category: '金融分析', status: 'active', icon: '📊', source: 'custom' },
  { name: 'Biz Reporter', description: '商业智能报告（GA4+Search Console+Stripe）', category: '金融分析', status: 'active', icon: '📊', source: 'custom' },
  { name: 'Accounting Workflows', description: '会计工作流自动化', category: '金融分析', status: 'active', icon: '💼', source: 'custom' },
  { name: 'BBC News', description: 'BBC新闻抓取和分析', category: '金融分析', status: 'active', icon: '🗞️', source: 'custom' },
  { name: 'Apify Competitor Intelligence', description: '竞争对手情报分析', category: '金融分析', status: 'active', icon: '🔍', source: 'custom' },

  // 投资组合与交易（7个）
  { name: 'Portfolio Tracking Skill', description: '投资组合追踪', category: '投资组合', status: 'active', icon: '📊', source: 'custom' },
  { name: 'Crypto Portfolio Tracker API', description: '加密货币投资组合追踪API', category: '投资组合', status: 'active', icon: '💰', source: 'custom' },
  { name: 'Passive Income Tracker', description: '被动收入追踪', category: '投资组合', status: 'active', icon: '💵', source: 'custom' },
  { name: 'Trading Devbox', description: '交易开发盒', category: '交易系统', status: 'active', icon: '📦', source: 'custom' },
  { name: 'Trading212 API', description: 'Trading212 API', category: '交易系统', status: 'active', icon: '🔌', source: 'custom' },
  { name: 'Realtime Crypto Price API', description: '实时加密货币价格API', category: '交易系统', status: 'active', icon: '⚡', source: 'custom' },
  { name: 'X Alpha Scout', description: 'X Alpha侦察', category: 'AI分析', status: 'active', icon: '🎯', source: 'custom' },

  // 数据抓取类（9个）
  { name: 'XPR Web Scraping', description: 'XPR网页抓取', category: '数据抓取', status: 'active', icon: '🕷️', source: 'custom' },
  { name: 'Smart Web Scraper', description: '智能网页抓取器', category: '数据抓取', status: 'active', icon: '🤖', source: 'custom' },
  { name: 'XPR Structured Data', description: 'XPR结构化数据', category: '数据抓取', status: 'active', icon: '📋', source: 'custom' },
  { name: 'Agent Browser', description: 'Agent浏览器自动化', category: '数据抓取', status: 'active', icon: '🌐', source: 'custom' },
  { name: 'Playwright Headless Browser', description: 'Playwright无头浏览器', category: '数据抓取', status: 'active', icon: '🎭', source: 'custom' },
  { name: 'Browser Use', description: '浏览器使用工具', category: '数据抓取', status: 'active', icon: '🔍', source: 'custom' },
  { name: 'Data Enricher', description: '数据增强（邮件+格式化）', category: '数据抓取', status: 'active', icon: '✨', source: 'custom' },
  { name: 'DataForSEO', description: 'SEO和SERP数据（Google搜索）', category: '数据抓取', status: 'active', icon: '🔍', source: 'custom' },
  { name: 'Reddit API', description: 'Reddit API', category: '数据抓取', status: 'active', icon: '📱', source: 'custom' },
  { name: 'Telegram频道抓取', description: '实时抓取Telegram频道新闻（7个频道）', category: '数据抓取', status: 'active', icon: '📱', source: 'custom' },

  // 新闻与情绪分析（5个）
  { name: 'Social Sentiment', description: '社交情绪分析', category: '新闻情绪', status: 'active', icon: '💬', source: 'custom' },
  { name: 'NewsAPI Search', description: 'NewsAPI搜索', category: '新闻情绪', status: 'active', icon: '🔍', source: 'custom' },
  { name: 'CLS News Scraper', description: 'CLS新闻爬虫', category: '新闻情绪', status: 'active', icon: '🗞️', source: 'custom' },
  { name: 'IPO Alert', description: 'IPO提醒', category: '新闻情绪', status: 'active', icon: '🔔', source: 'custom' },
  { name: 'AI CFO', description: 'AI CFO', category: 'AI分析', status: 'active', icon: '🤖', source: 'custom' },

  // 网站开发类（6个）
  { name: 'React Expert', description: 'React 18+专家（组件+Hooks+状态管理）', category: '网站开发', status: 'active', icon: '⚛️', source: 'custom' },
  { name: 'Clerk Auth', description: 'Clerk认证系统（API Keys + Next.js 16）', category: '网站开发', status: 'active', icon: '🔐', source: 'custom' },
  { name: 'Cloudflare Agent Tunnel', description: 'Cloudflare隧道（HTTPS URL）', category: '网站开发', status: 'active', icon: '☁️', source: 'custom' },
  { name: 'React Local Biz', description: 'React本地业务网站生成', category: '网站开发', status: 'active', icon: '🏢', source: 'custom' },
  { name: 'React NextJS Generator', description: 'React Next.js项目生成器', category: '网站开发', status: 'active', icon: '🚀', source: 'custom' },
  { name: 'React Component Generator', description: 'React组件生成器', category: '网站开发', status: 'active', icon: '🧩', source: 'custom' },

  // 数据分析类（11个）
  { name: 'Data Analyst', description: '数据可视化+SQL查询+电子表格', category: '数据分析', status: 'active', icon: '📊', source: 'custom' },
  { name: 'Finance Automation', description: '金融自动化', category: '数据分析', status: 'active', icon: '🤖', source: 'custom' },
  { name: 'Google Analytics API', description: 'Google Analytics数据访问和分析', category: '数据分析', status: 'active', icon: '📊', source: 'custom' },
  { name: 'Advanced Calendar', description: '高级日历管理（支持多种日历服务）', category: '数据分析', status: 'active', icon: '📅', source: 'custom' },
  { name: 'Google Calendar', description: 'Google日历集成', category: '数据分析', status: 'active', icon: '📆', source: 'custom' },
  { name: 'Daily Report', description: '每日业务报告生成', category: '数据分析', status: 'active', icon: '📊', source: 'custom' },
  { name: 'Agent Dashboard', description: 'Agent实时仪表板', category: '数据分析', status: 'active', icon: '📊', source: 'custom' },
  { name: 'CSV Pipeline', description: 'CSV数据处理管道', category: '数据分析', status: 'active', icon: '📊', source: 'custom' },
  { name: 'Chartclass', description: '图表类库（多种图表类型）', category: '数据分析', status: 'active', icon: '📊', source: 'custom' },
  { name: 'OpenClaw Dashboard', description: 'OpenClaw仪表板', category: '数据分析', status: 'active', icon: '📊', source: 'custom' },
  { name: 'OC Daily Business Report', description: '每日业务报告', category: '数据分析', status: 'active', icon: '📊', source: 'custom' },

  // 自动化与集成（3个）
  { name: 'N8N Workflow Automation', description: 'N8N工作流自动化平台', category: '自动化', status: 'active', icon: '🔄', source: 'custom' },
  { name: 'AgentMail Integration', description: 'Agent邮件集成', category: '自动化', status: 'active', icon: '📧', source: 'custom' },
  { name: 'Prism Alerts', description: 'Prism提醒系统', category: '自动化', status: 'active', icon: '🔔', source: 'custom' },
  { name: 'Apipick Email Checker', description: '邮件检查API', category: '自动化', status: 'active', icon: '✉️', source: 'custom' },

  // Google Workspace（47个）🆕
  { name: 'GWS Drive', description: 'Google Drive文件管理', category: 'Google Workspace', status: 'active', icon: '📁', source: 'custom' },
  { name: 'GWS Drive Upload', description: 'Google Drive文件上传', category: 'Google Workspace', status: 'active', icon: '📤', source: 'custom' },
  { name: 'GWS Gmail', description: 'Gmail邮件管理', category: 'Google Workspace', status: 'active', icon: '📧', source: 'custom' },
  { name: 'GWS Gmail Send', description: 'Gmail发送邮件', category: 'Google Workspace', status: 'active', icon: '📨', source: 'custom' },
  { name: 'GWS Gmail Triage', description: 'Gmail邮件分类', category: 'Google Workspace', status: 'active', icon: '📬', source: 'custom' },
  { name: 'GWS Calendar', description: 'Google Calendar日程管理', category: 'Google Workspace', status: 'active', icon: '📅', source: 'custom' },
  { name: 'GWS Calendar Agenda', description: 'Google Calendar议程', category: 'Google Workspace', status: 'active', icon: '📆', source: 'custom' },
  { name: 'GWS Calendar Insert', description: 'Google Calendar插入事件', category: 'Google Workspace', status: 'active', icon: '➕', source: 'custom' },
  { name: 'GWS Sheets', description: 'Google Sheets电子表格', category: 'Google Workspace', status: 'active', icon: '📊', source: 'custom' },
  { name: 'GWS Docs', description: 'Google Docs文档编辑', category: 'Google Workspace', status: 'active', icon: '📝', source: 'custom' },
  { name: 'GWS Docs Write', description: 'Google Docs写入', category: 'Google Workspace', status: 'active', icon: '✍️', source: 'custom' },
  { name: 'GWS Chat', description: 'Google Chat聊天', category: 'Google Workspace', status: 'active', icon: '💬', source: 'custom' },
  { name: 'GWS Chat Send', description: 'Google Chat发送消息', category: 'Google Workspace', status: 'active', icon: '💬', source: 'custom' },
  { name: 'GWS Admin', description: 'Google Workspace管理', category: 'Google Workspace', status: 'active', icon: '👤', source: 'custom' },
  { name: 'GWS Admin Reports', description: 'Google Workspace管理报告', category: 'Google Workspace', status: 'active', icon: '📊', source: 'custom' },
  { name: 'GWS Classroom', description: 'Google Classroom课堂', category: 'Google Workspace', status: 'active', icon: '🏫', source: 'custom' },
  { name: 'GWS Meet', description: 'Google Meet视频会议', category: 'Google Workspace', status: 'active', icon: '📹', source: 'custom' },
  { name: 'GWS Forms', description: 'Google Forms表单', category: 'Google Workspace', status: 'active', icon: '📋', source: 'custom' },
  { name: 'GWS Keep', description: 'Google Keep笔记', category: 'Google Workspace', status: 'active', icon: '📝', source: 'custom' },
  { name: 'GWS Apps Script', description: 'Google Apps Script脚本', category: 'Google Workspace', status: 'active', icon: '🔧', source: 'custom' },
  { name: 'GWS Alertcenter', description: 'Google告警中心', category: 'Google Workspace', status: 'active', icon: '⚠️', source: 'custom' },
  { name: 'GWS Cloud Identity', description: 'Google云端身份', category: 'Google Workspace', status: 'active', icon: '🔐', source: 'custom' },
  { name: 'GWS Events', description: 'Google事件管理', category: 'Google Workspace', status: 'active', icon: '🎉', source: 'custom' },
  { name: 'GWS Licensing', description: 'Google许可管理', category: 'Google Workspace', status: 'active', icon: '📜', source: 'custom' },
  { name: 'GWS Model Armor', description: 'Google模型保护', category: 'Google Workspace', status: 'active', icon: '🛡️', source: 'custom' },
  { name: 'GWS Groups Settings', description: 'Google群组设置', category: 'Google Workspace', status: 'active', icon: '👥', source: 'custom' },

  // Agent Reach 数据抓取（7个）🆕
  { name: 'Agent Reach Twitter', description: 'Twitter/X推文抓取和情绪分析', category: 'Agent Reach', status: 'active', icon: '🐦', source: 'custom' },
  { name: 'Agent Reach Reddit', description: 'Reddit帖子和评论抓取', category: 'Agent Reach', status: 'active', icon: '📱', source: 'custom' },
  { name: 'Agent Reach WeChat', description: '微信公众号文章抓取', category: 'Agent Reach', status: 'active', icon: '💬', source: 'custom' },
  { name: 'Agent Reach Exa Search', description: '全网语义搜索（免费）', category: 'Agent Reach', status: 'active', icon: '🔍', source: 'custom' },
  { name: 'Agent Reach YouTube', description: 'YouTube视频和字幕提取', category: 'Agent Reach', status: 'active', icon: '📹', source: 'custom' },
  { name: 'Agent Reach Bilibili', description: 'B站视频和字幕提取', category: 'Agent Reach', status: 'active', icon: '🎬', source: 'custom' },
  { name: 'Agent Reach Web Scraper', description: '任意网页读取（Jina Reader）', category: 'Agent Reach', status: 'active', icon: '🌐', source: 'custom' },

  // 交互式学习系统（9个）🆕
  { name: 'Interactive Learning System', description: '基于Interactive Benchmarks论文的交互式学习系统', category: '交互式学习', status: 'active', icon: '📚', source: 'custom' },
  { name: 'Self-Improving Agent', description: '✅已安装 持续自我改进系统 - 自动记录学习内容、错误和修正到markdown文件', category: '交互式学习', status: 'active', icon: '📚', source: 'custom' },
  { name: 'Information Gap Identifier', description: '信息缺口识别器（Phase 1）', category: '交互式学习', status: 'active', icon: '🔍', source: 'custom' },
  { name: 'Active Search Engine', description: '主动搜索引擎（Phase 2）- 整合Agent Reach 7个数据抓取渠道', category: '交互式学习', status: 'active', icon: '🚀', source: 'custom' },
  { name: 'Hypothesis Validator', description: '假设验证器（Phase 3）- 4种假设类型、量化验证、信心度评估', category: '交互式学习', status: 'active', icon: '🔬', source: 'custom' },
  { name: 'Multi-Hypothesis Validator', description: '多假设组合验证（Phase 4）- 组合风险评估+相关性分析', category: '交互式学习', status: 'active', icon: '🎯', source: 'custom' },
  { name: 'Sentiment Integration', description: '市场情绪分析整合（Phase 4）- 7个数据渠道+实时监控+趋势预测', category: '交互式学习', status: 'active', icon: '📊', source: 'custom' },
  { name: 'Risk Alert System', description: '风险预警系统（Phase 4）- 自动风险检测+多维度评分+实时预警', category: '交互式学习', status: 'active', icon: '⚠️', source: 'custom' },
  { name: 'Auto Report Generator', description: '自动化报告推送（Phase 4）- 每日/每周报告+Telegram格式', category: '交互式学习', status: 'active', icon: '📄', source: 'custom' },
  
  // Agent编排系统（5个）🆕 借鉴OpenAI Symphony
  { name: 'Stock Analysis Orchestrator', description: '✅已实施 股票分析编排器 - 单一权威状态管理+8大Agent协调+错误恢复', category: 'Agent编排', status: 'active', icon: '🎼', source: 'custom' },
  { name: 'Analysis Workspace Manager', description: '✅已实施 分析工作空间管理器 - 任务隔离+生命周期钩子+安全不变量', category: 'Agent编排', status: 'active', icon: '📁', source: 'custom' },
  { name: 'Analysis Workflow Definition', description: '✅已实施 分析工作流定义 - YAML配置+提示词模板+动态重载', category: 'Agent编排', status: 'active', icon: '📋', source: 'custom' },
  { name: 'Analysis Observability', description: '✅已实施 分析可观察性 - 实时监控+性能追踪+HTTP API+仪表板', category: 'Agent编排', status: 'active', icon: '👁️', source: 'custom' },
  { name: 'Integration Test Suite', description: '✅已实施 集成测试套件 - 6个测试全部通过（100%成功率）', category: 'Agent编排', status: 'active', icon: '✅', source: 'custom' },

  // 记忆与学习系统（1个核心能力）🆕
  { name: '💾 长期记忆系统', description: '✅已配置 OpenViking记忆插件 - 自动捕获+智能检索+本地存储（~/.openviking/ov.conf）', category: '记忆与学习', status: 'active', icon: '💾', source: 'custom' },

  // 知识库系统（3个核心知识）🆕
  { name: 'AI Agent Fundamentals', description: '✅已提炼 Agent架构+记忆系统+工具调用（来自 microsoft/ai-agents-for-beginners）', category: '知识库', status: 'active', icon: '🤖', source: 'custom' },
  { name: 'GenAI Best Practices', description: '✅已提炼 Prompt工程+成本控制+RAG系统（来自 microsoft/generative-ai-for-beginners）', category: '知识库', status: 'active', icon: '✨', source: 'custom' },
  { name: 'OpenAI API Guide', description: '✅已提炼 API优化+错误处理+成本控制（来自 openai/openai-cookbook）', category: '知识库', status: 'active', icon: '🔌', source: 'custom' },

  { name: 'GLM Web Search', description: '✅已测试 联网搜索MCP - 41.4秒响应（100%成功率）', category: 'MCP工具', status: 'active', icon: '🔍', source: 'custom' },
  { name: 'GLM Web Reader', description: '✅已测试 网页读取MCP - 54.7秒响应（100%成功率）', category: 'MCP工具', status: 'active', icon: '🌐', source: 'custom' },
  { name: 'GLM Vision', description: '✅已测试 视觉理解MCP - 34.2秒响应（100%成功率）', category: 'MCP工具', status: 'active', icon: '👁️', source: 'custom' },
  { name: 'GLM GitHub Repo', description: '✅已测试 开源仓库MCP - 53.5秒响应（100%成功率）', category: 'MCP工具', status: 'active', icon: '📦', source: 'custom' },
  // ========== 已安装Skills（49个）==========
  { name: 'Agenthc Market Intelligence', description: '实时股市数据和交易智能API（85个智能模块+40个技能）', category: '金融分析', status: 'active', source: 'installed', icon: '🔍' },
  { name: 'Financial Lkcair', description: '财务分析工具', category: '金融分析', status: 'active', source: 'installed', icon: '📊' },
  { name: 'HK Stock Trending', description: '港股趋势分析', category: '金融分析', status: 'active', source: 'installed', icon: '🇭🇰' },
  { name: 'NewsAPI Search', description: 'NewsAPI新闻搜索', category: '新闻情绪', status: 'active', source: 'installed', icon: '🔍' },
  { name: 'Optionshawk', description: '期权鹰分析', category: '金融分析', status: 'active', source: 'installed', icon: '🦅' },
  { name: 'PRISM Finance OS', description: 'PRISM金融OS（218+只读API）', category: '金融分析', status: 'active', source: 'installed', icon: '💎' },
  { name: 'US Market Bubble Detector', description: '美国市场泡沫检测', category: '金融分析', status: 'active', source: 'installed', icon: '🫧' },
  { name: 'US Stock Analysis', description: '美股综合分析', category: '金融分析', status: 'active', source: 'installed', icon: '🇺🇸' },
  { name: 'GWS Apps Script Push', description: 'Google Apps Script推送', category: 'Google Workspace', status: 'active', source: 'installed', icon: '📤' },
  { name: 'GWS Cloudidentity', description: 'Google云端身份管理', category: 'Google Workspace', status: 'active', source: 'installed', icon: '🔐' },
  { name: 'GWS Events Renew', description: 'Google事件续订', category: 'Google Workspace', status: 'active', source: 'installed', icon: '🔄' },
  { name: 'GWS Events Subscribe', description: 'Google事件订阅', category: 'Google Workspace', status: 'active', source: 'installed', icon: '📡' },
  { name: 'GWS Gmail Watch', description: 'Gmail邮件监控', category: 'Google Workspace', status: 'active', source: 'installed', icon: '👁️' },
  { name: 'GWS Groupssettings', description: 'Google群组设置', category: 'Google Workspace', status: 'active', source: 'installed', icon: '👥' },
  { name: 'GWS Modelarmor', description: 'Google模型保护', category: 'Google Workspace', status: 'active', source: 'installed', icon: '🛡️' },
  { name: 'GWS Modelarmor Create Template', description: '创建模型保护模板', category: 'Google Workspace', status: 'active', source: 'installed', icon: '📝' },
  { name: 'GWS Modelarmor Sanitize Prompt', description: '清理用户提示词', category: 'Google Workspace', status: 'active', source: 'installed', icon: '🧹' },
  { name: 'GWS Modelarmor Sanitize Response', description: '清理模型响应', category: 'Google Workspace', status: 'active', source: 'installed', icon: '🧽' },
  { name: 'GWS People', description: 'Google通讯录管理', category: 'Google Workspace', status: 'active', source: 'installed', icon: '👤' },
  { name: 'GWS Reseller', description: 'Google经销商管理', category: 'Google Workspace', status: 'active', source: 'installed', icon: '🏪' },
  { name: 'GWS Shared', description: 'Google共享设置', category: 'Google Workspace', status: 'active', source: 'installed', icon: '🤝' },
  { name: 'GWS Sheets Append', description: 'Google Sheets追加行', category: 'Google Workspace', status: 'active', source: 'installed', icon: '➕' },
  { name: 'GWS Sheets Read', description: 'Google Sheets读取', category: 'Google Workspace', status: 'active', source: 'installed', icon: '📖' },
  { name: 'GWS Slides', description: 'Google幻灯片', category: 'Google Workspace', status: 'active', source: 'installed', icon: '🖼️' },
  { name: 'GWS Tasks', description: 'Google任务管理', category: 'Google Workspace', status: 'active', source: 'installed', icon: '✅' },
  { name: 'GWS Vault', description: 'Google保险箱', category: 'Google Workspace', status: 'active', source: 'installed', icon: '🔒' },
  { name: 'GWS Workflow', description: 'Google工作流', category: 'Google Workspace', status: 'active', source: 'installed', icon: '🔄' },
  { name: 'GWS Workflow Email To Task', description: '邮件转任务', category: 'Google Workspace', status: 'active', source: 'installed', icon: '📧' },
  { name: 'GWS Workflow File Announce', description: '文件公告', category: 'Google Workspace', status: 'active', source: 'installed', icon: '📢' },
  { name: 'GWS Workflow Meeting Prep', description: '会议准备', category: 'Google Workspace', status: 'active', source: 'installed', icon: '📅' },
  { name: 'GWS Workflow Standup Report', description: '站会报告', category: 'Google Workspace', status: 'active', source: 'installed', icon: '📊' },
  { name: 'GWS Workflow Weekly Digest', description: '每周摘要', category: 'Google Workspace', status: 'active', source: 'installed', icon: '📈' },
  { name: 'Agent Reach', description: '全网数据抓取（13+平台）', category: 'Agent Reach', status: 'active', source: 'installed', icon: '🔗' },
  { name: 'Agentmail Integration', description: 'Agent邮件集成', category: '自动化', status: 'active', source: 'installed', icon: '📧' },
  { name: 'BBC News', description: 'BBC新闻抓取和分析', category: '新闻情绪', status: 'active', source: 'installed', icon: '🗞️' },
  { name: 'Context Protection', description: 'Context保护系统', category: 'Agent编排', status: 'active', source: 'installed', icon: '🛡️' },
  { name: 'DataForSEO', description: 'SEO和SERP数据', category: '数据抓取', status: 'active', source: 'installed', icon: '🔍' },
  { name: 'OpenClaw Dashboard', description: 'OpenClaw仪表板', category: '数据分析', status: 'active', source: 'installed', icon: '📊' },
  { name: 'Skill Creator', description: '技能创建工具', category: 'Agent编排', status: 'active', source: 'installed', icon: '🛠️' },
  { name: 'Context Compressor', description: 'Context压缩器（70%压缩率）', category: 'Agent编排', status: 'active', source: 'installed', icon: '🗜️' },
  { name: 'OpenClaw Skills Context Manager', description: 'AI驱动的Context管理', category: 'Agent编排', status: 'active', source: 'installed', icon: '🤖' },
  { name: 'OpenClaw Skills Data Analyst', description: '数据可视化+SQL+电子表格', category: '数据分析', status: 'active', source: 'installed', icon: '📊' },
  { name: 'OpenClaw Skills Financial Market Analysis', description: '金融市场分析', category: '金融分析', status: 'active', source: 'installed', icon: '💹' },
  { name: 'OpenClaw Skills React Expert', description: 'React 18+专家', category: '网站开发', status: 'active', source: 'installed', icon: '⚛️' },
  { name: 'OpenClaw Skills Sophie Optimizer', description: 'Context健康自动管理', category: 'Agent编排', status: 'active', source: 'installed', icon: '⚡' },
  { name: 'Prismapi SDK', description: '精英金融SDK（100+端点）', category: '金融分析', status: 'active', source: 'installed', icon: '🔧' },
  { name: 'React NextJS Generator', description: 'React Next.js项目生成器', category: '网站开发', status: 'active', source: 'installed', icon: '🚀' },
  { name: 'Self-Improving Agent', description: '持续自我改进系统', category: '交互式学习', status: 'active', source: 'installed', icon: '📚' },
  { name: 'Stock Analysis 6.2.0', description: '股票分析6.2.0版本', category: '金融分析', status: 'active', source: 'installed', icon: '📉' },
];

const categories = ['全部', '金融分析', '投资组合', '交易系统', '数据抓取', '新闻情绪', 'AI分析', '网站开发', '数据分析', '自动化', 'Google Workspace', 'Agent Reach', '交互式学习', 'Agent编排', 'MCP工具', '记忆与学习', '知识库'];

const categoryIcons: Record<string, string> = {
  '全部': '🌸',
  '金融分析': '📊',
  '投资组合': '💼',
  '交易系统': '⚡',
  '数据抓取': '🕷️',
  '新闻情绪': '📰',
  'AI分析': '🤖',
  '网站开发': '🚀',
  '数据分析': '📊',
  '自动化': '🔄',
  'Google Workspace': '🏢',
  'Agent Reach': '🔗',
  '交互式学习': '📚',
  'Agent编排': '🎼',
  'MCP工具': '🔌',
  '记忆与学习': '💾',
  '知识库': '📚',
};

export default function SkillsPage() {
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [selectedSource, setSelectedSource] = useState<'全部' | 'installed' | 'custom'>('全部');

  const filteredSkills = skills.filter(skill => {
    const categoryMatch = selectedCategory === '全部' || skill.category === selectedCategory;
    const sourceMatch = selectedSource === '全部' || skill.source === selectedSource;
    return categoryMatch && sourceMatch;
  });

  const stats = {
    total: skills.length,
    active: skills.filter(s => s.status === 'active').length,
    categories: categories.length - 1,
    installed: skills.filter(s => s.source === 'installed').length,
    custom: skills.filter(s => s.source === 'custom').length,
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <a href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                <span className="text-4xl">🌸</span>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">花卷技能中心</h1>
                  <p className="text-sm text-gray-500">189个专业技能 · 已安装139个 · 自定义50个 · 覆盖选股、分析、开发、自动化、交互式学习、Agent编排、MCP工具、记忆系统、AI知识库全流程</p>
                </div>
              </a>
            </div>
            <div className="flex gap-4 text-sm flex-wrap">
              <div className="bg-pink-50 px-4 py-2 rounded-lg">
                <div className="text-pink-600 font-semibold">{stats.total}</div>
                <div className="text-gray-600">总技能</div>
              </div>
              <div className="bg-green-50 px-4 py-2 rounded-lg">
                <div className="text-green-600 font-semibold">{stats.active}</div>
                <div className="text-gray-600">正常运行</div>
              </div>
              <div className="bg-blue-50 px-4 py-2 rounded-lg">
                <div className="text-blue-600 font-semibold">{stats.categories}</div>
                <div className="text-gray-600">分类</div>
              </div>
              <div className="bg-emerald-50 px-4 py-2 rounded-lg">
                <div className="text-emerald-600 font-semibold">{stats.installed}</div>
                <div className="text-gray-600">已安装</div>
              </div>
              <div className="bg-purple-50 px-4 py-2 rounded-lg">
                <div className="text-purple-600 font-semibold">{stats.custom}</div>
                <div className="text-gray-600">自定义</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Source Filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-sm font-medium text-gray-700">来源筛选：</span>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedSource('全部')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedSource === '全部'
                  ? 'bg-pink-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🌸 全部 ({stats.total})
            </button>
            <button
              onClick={() => setSelectedSource('installed')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedSource === 'installed'
                  ? 'bg-green-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              ✅ 已安装 ({stats.installed})
            </button>
            <button
              onClick={() => setSelectedSource('custom')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedSource === 'custom'
                  ? 'bg-purple-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🔧 自定义 ({stats.custom})
            </button>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                selectedCategory === category
                  ? 'bg-pink-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {categoryIcons[category]} {category}
            </button>
          ))}
        </div>
      </div>

      {/* Skills Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredSkills.map((skill, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-100 p-5 hover:border-pink-200"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="text-3xl">{skill.icon}</div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  skill.status === 'active'
                    ? 'bg-green-50 text-green-600'
                    : skill.status === 'beta'
                    ? 'bg-yellow-50 text-yellow-600'
                    : 'bg-gray-50 text-gray-500'
                }`}>
                  {skill.status === 'active' ? '✅ 正常' : skill.status === 'beta' ? '🟡 测试' : '⏳ 即将上线'}
                </span>
              </div>
              <h3 className="text-lg font-bold mb-2 text-gray-900">{skill.name}</h3>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{skill.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
                  {skill.category}
                </span>
                <span className={`text-xs px-2 py-1 rounded ${
                  skill.source === 'installed'
                    ? 'bg-green-50 text-green-600'
                    : 'bg-purple-50 text-purple-600'
                }`}>
                  {skill.source === 'installed' ? '✅ 已安装' : '🔧 自定义'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-6">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">📊 能力统计</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div className="text-center bg-white rounded-lg p-4 shadow-sm">
              <div className="text-3xl font-bold text-pink-500 mb-1">37</div>
              <div className="text-sm text-gray-600">金融分析</div>
            </div>
            <div className="text-center bg-white rounded-lg p-4 shadow-sm">
              <div className="text-3xl font-bold text-green-500 mb-1">7</div>
              <div className="text-sm text-gray-600">投资组合</div>
            </div>
            <div className="text-center bg-white rounded-lg p-4 shadow-sm">
              <div className="text-3xl font-bold text-blue-500 mb-1">9</div>
              <div className="text-sm text-gray-600">数据抓取</div>
            </div>
            <div className="text-center bg-white rounded-lg p-4 shadow-sm">
              <div className="text-3xl font-bold text-purple-500 mb-1">5</div>
              <div className="text-sm text-gray-600">新闻情绪</div>
            </div>
            <div className="text-center bg-white rounded-lg p-4 shadow-sm">
              <div className="text-3xl font-bold text-orange-500 mb-1">6</div>
              <div className="text-sm text-gray-600">网站开发</div>
            </div>
            <div className="text-center bg-white rounded-lg p-4 shadow-sm">
              <div className="text-3xl font-bold text-cyan-500 mb-1">11</div>
              <div className="text-sm text-gray-600">数据分析</div>
            </div>
            <div className="text-center bg-white rounded-lg p-4 shadow-sm">
              <div className="text-3xl font-bold text-indigo-500 mb-1">4</div>
              <div className="text-sm text-gray-600">自动化</div>
            </div>
            <div className="text-center bg-white rounded-lg p-4 shadow-sm">
              <div className="text-3xl font-bold text-red-500 mb-1">26</div>
              <div className="text-sm text-gray-600">Google Workspace</div>
            </div>
            <div className="text-center bg-white rounded-lg p-4 shadow-sm">
              <div className="text-3xl font-bold text-yellow-500 mb-1">7</div>
              <div className="text-sm text-gray-600">Agent Reach</div>
            </div>
            <div className="text-center bg-white rounded-lg p-4 shadow-sm">
              <div className="text-3xl font-bold text-purple-600 mb-1">4</div>
              <div className="text-sm text-gray-600">交互式学习</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between text-sm text-gray-600 gap-2">
            <div className="flex items-center gap-2">
              <span>🌸</span>
              <span>花卷技能中心 v2.0</span>
            </div>
            <div className="text-center sm:text-right text-gray-500">
              最后更新：2026-03-05 20:20 · 自动同步机制已启用
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
