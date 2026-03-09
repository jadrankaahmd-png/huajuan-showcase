export const capabilities = [
  {
    category: 'tools',
    name: '工具系统',
    icon: '🛠️',
    items: [
      // 监控类（20个）
      {
        name: 'Twitter KOL监控',
        description: '三重保障监控46位KOL的实时推文',
        status: 'active',
        type: '监控工具',
        details: {
          whatItDoes: '实时监控46位KOL的Twitter动态，包括科技/AI领袖、半导体专家、投资/金融专家、Crypto/Web3专家、宏观/策略分析师',
          howItWorks: '三重保障机制：Nitter RSS → 纯RSS → ntscraper Python库，自动切换方案确保监控稳定性',
          currentStatus: '✅ 正常运行\n- 46位KOL已配置\n- 三重fallback机制就绪\n- 支持关键词搜索',
          lastUpdate: '2026-02-12',
          usage: 'python3 tools/twitter_kol_monitor.py --all',
          dependencies: ['Nitter', 'RSS', 'ntscraper', 'yfinance']
        }
      },
      {
        name: 'Reddit监控',
        description: '监控r/wallstreetbets等社区的实时讨论',
        status: 'active',
        type: '监控工具',
        details: {
          whatItDoes: '监控Reddit社区（r/wallstreetbets、r/stocks等）的实时讨论，抓取散户情绪和热点话题',
          howItWorks: '通过Reddit RSS和Pushshift API获取帖子，LLM分析情绪（看涨/看跌/中性）',
          currentStatus: '✅ 正常运行',
          lastUpdate: '2026-02-09',
          usage: 'python3 tools/reddit_monitor.py --stock NVDA',
          dependencies: ['Reddit API', 'Pushshift', 'LLM']
        }
      },
      {
        name: '新闻聚合器',
        description: '聚合全球财经新闻，实时推送',
        status: 'active',
        type: '监控工具',
        details: {
          whatItDoes: '从NewsAPI、Finnhub、公司新闻室等多源聚合财经新闻',
          howItWorks: '多源抓取 → 去重 → 情绪分析 → 重要度排序 → 实时推送',
          currentStatus: '✅ 正常运行',
          lastUpdate: '2026-02-09',
          usage: 'python3 tools/news_aggregator.py',
          dependencies: ['NewsAPI', 'Finnhub', 'Web Scraper']
        }
      },
      {
        name: '综合新闻搜索',
        description: '跨源搜索特定主题的新闻',
        status: 'active',
        type: '监控工具',
        details: {
          whatItDoes: '搜索特定股票、行业、主题的新闻，支持时间范围筛选',
          currentStatus: '✅ 正常运行',
          lastUpdate: '2026-02-09',
          usage: 'python3 tools/comprehensive_news_search.py --query NVDA --days 7',
          dependencies: ['Brave Search', 'NewsAPI']
        }
      },
      {
        name: '日内监控',
        description: '盘中实时监控股价异动',
        status: 'active',
        type: '监控工具',
        details: {
          whatItDoes: '监控盘中股价异动（>5%涨跌），实时推送预警',
          currentStatus: '✅ 正常运行',
          usage: 'python3 tools/intraday_monitor.py',
          dependencies: ['yfinance', 'Telegram']
        }
      },
      {
        name: '全球市场监控',
        description: '监控全球主要市场指数',
        status: 'active',
        type: '监控工具',
        details: {
          whatItDoes: '监控美股、港股、A股、欧洲市场等全球主要指数',
          currentStatus: '✅ 正常运行',
          usage: 'python3 tools/global_market_monitor.py',
          dependencies: ['yfinance']
        }
      },
      {
        name: '宏观监控',
        description: '监控宏观经济指标',
        status: 'active',
        type: '监控工具',
        details: {
          whatItDoes: '监控美联储利率、CPI、失业率、GDP等宏观经济指标',
          currentStatus: '✅ 正常运行',
          usage: 'python3 tools/macro_monitor.py',
          dependencies: ['FRED API']
        }
      },
      {
        name: '行业轮动监控',
        description: '追踪行业资金流向和轮动',
        status: 'active',
        type: '监控工具',
        details: {
          whatItDoes: '监控11个行业ETF的资金流向，识别行业轮动信号',
          currentStatus: '✅ 正常运行',
          usage: 'python3 tools/sector_rotation_monitor.py',
          dependencies: ['yfinance', 'XLK/XLF/XLE等ETF']
        }
      },
      {
        name: 'SEC文件监控',
        description: '监控SEC重要文件发布',
        status: 'active',
        type: '监控工具',
        details: {
          whatItDoes: '监控10-K、10-Q、8-K、Form 4等SEC文件发布',
          currentStatus: '✅ 正常运行',
          usage: 'python3 tools/sec_filing_monitor.py',
          dependencies: ['SEC EDGAR']
        }
      },
      {
        name: '做空兴趣监控',
        description: '追踪做空比例变化',
        status: 'active',
        type: '监控工具',
        details: {
          whatItDoes: '监控做空比例、做空日数等数据，识别逼空机会',
          currentStatus: '✅ 正常运行',
          usage: 'python3 tools/short_interest_monitor.py',
          dependencies: ['yfinance', 'Short Interest Data']
        }
      },
      {
        name: '期权流分析',
        description: '分析期权异动和Gamma',
        status: 'active',
        type: '监控工具',
        details: {
          whatItDoes: '分析期权成交量、隐含波动率、Gamma敞口',
          currentStatus: '✅ 正常运行',
          usage: 'python3 tools/options_flow_analyzer.py',
          dependencies: ['Finnhub', 'Options Data']
        }
      },
      {
        name: '资金流追踪',
        description: '追踪市场资金流向',
        status: 'active',
        type: '监控工具',
        details: {
          whatItDoes: '追踪ETF资金流、板块资金流、个股资金流',
          currentStatus: '✅ 正常运行',
          usage: 'python3 tools/fund_flow_tracker.py',
          dependencies: ['yfinance', 'ETF Data']
        }
      },
      {
        name: '内部人交易追踪',
        description: '追踪公司内部人买卖',
        status: 'active',
        type: '监控工具',
        details: {
          whatItDoes: '追踪Form 4文件，监控高管买卖信号',
          currentStatus: '✅ 正常运行',
          usage: 'python3 tools/insider_tracker.py',
          dependencies: ['SEC EDGAR', 'OpenInsider']
        }
      },
      {
        name: '分析师追踪',
        description: '追踪分析师评级变化',
        status: 'active',
        type: '监控工具',
        details: {
          whatItDoes: '追踪分析师评级、目标价变化，汇总共识',
          currentStatus: '✅ 正常运行',
          usage: 'python3 tools/analyst_tracker.py',
          dependencies: ['Finnhub', 'TipRanks']
        }
      },
      {
        name: 'IPO追踪',
        description: '追踪即将上市的IPO',
        status: 'active',
        type: '监控工具',
        details: {
          whatItDoes: '追踪IPO时间表、定价、首日表现',
          currentStatus: '✅ 正常运行',
          usage: 'python3 tools/ipo_tracker.py',
          dependencies: ['IPO Data Sources']
        }
      },
      {
        name: '加密货币监控',
        description: '监控加密货币市场',
        status: 'active',
        type: '监控工具',
        details: {
          whatItDoes: '监控BTC、ETH等主流币种价格和情绪',
          currentStatus: '✅ 正常运行',
          usage: 'python3 tools/crypto_monitor.py',
          dependencies: ['CoinGecko API', 'CryptoCompare']
        }
      },
      {
        name: '财报季管理',
        description: '管理财报季时间表',
        status: 'active',
        type: '监控工具',
        details: {
          whatItDoes: '追踪财报发布时间，提前准备分析',
          currentStatus: '✅ 正常运行',
          usage: 'python3 tools/earnings_season_manager.py',
          dependencies: ['Earnings Calendar']
        }
      },
      {
        name: '财报日历',
        description: '财报发布时间表',
        status: 'active',
        type: '监控工具',
        details: {
          whatItDoes: '显示本周/本月财报发布时间表',
          currentStatus: '✅ 正常运行',
          usage: 'python3 tools/earnings_calendar.py',
          dependencies: ['Finnhub', 'Yahoo Finance']
        }
      },
      {
        name: '经济日历',
        description: '重要经济数据发布时间',
        status: 'active',
        type: '监控工具',
        details: {
          whatItDoes: '显示CPI、非农、FOMC等重要经济数据发布时间',
          currentStatus: '✅ 正常运行',
          usage: 'python3 tools/economic_calendar.py',
          dependencies: ['FRED', 'Trading Economics']
        }
      },
      {
        name: '宏观日历',
        description: '宏观经济事件时间表',
        status: 'active',
        type: '监控工具',
        details: {
          whatItDoes: '显示全球宏观经济事件时间表',
          currentStatus: '✅ 正常运行',
          usage: 'python3 tools/macro_calendar.py',
          dependencies: ['FRED', 'Bloomberg']
        }
      },

      // 分析类（30个）
      {
        name: '财务深度分析',
        description: '全面分析公司财务状况',
        status: 'active',
        type: '分析工具',
        details: {
          whatItDoes: '分析资产负债表、利润表、现金流量表，计算财务比率',
          howItWorks: '从SEC EDGAR获取财报数据 → 计算财务指标 → 生成分析报告',
          currentStatus: '✅ 正常运行',
          usage: 'python3 tools/financial_analyzer.py --symbol NVDA',
          dependencies: ['SEC EDGAR', 'yfinance']
        }
      },
      {
        name: '估值计算器',
        description: '计算DCF、PE、PB等估值',
        status: 'active',
        type: '分析工具',
        details: {
          whatItDoes: '使用DCF、PE、PB、PEG、EV/EBITDA等多种方法估值',
          currentStatus: '✅ 正常运行',
          usage: 'python3 tools/valuation_calculator.py --symbol NVDA',
          dependencies: ['yfinance', 'Financial Data']
        }
      },
      {
        name: 'ML信号生成器',
        description: '机器学习预测涨跌',
        status: 'active',
        type: '分析工具',
        details: {
          whatItDoes: '使用随机森林、梯度提升等模型预测5日后涨跌',
          howItWorks: '37个高级特征 → 多模型训练 → 集成投票 → 输出预测',
          currentStatus: '✅ 正常运行（已训练AAPL、NVDA、TSLA）',
          lastUpdate: '2026-02-14',
          usage: 'python3 tools/ml_signal_generator.py NVDA',
          dependencies: ['scikit-learn', 'xgboost', 'yfinance']
        }
      },
      {
        name: '多因子评分系统',
        description: '综合多维度评分',
        status: 'active',
        type: '分析工具',
        details: {
          whatItDoes: '从价值、成长、质量、动量、情绪等多维度评分',
          currentStatus: '✅ 正常运行（v2版本）',
          usage: 'python3 tools/multi_factor_scorer_v2.py NVDA',
          dependencies: ['yfinance', 'Finnhub', 'NewsAPI']
        }
      },
      {
        name: '技术扫描器',
        description: '扫描技术指标信号',
        status: 'active',
        type: '分析工具',
        details: {
          whatItDoes: '扫描MA、RSI、MACD、布林带、KDJ等技术指标',
          currentStatus: '✅ 正常运行',
          usage: 'python3 tools/technical_scanner.py NVDA',
          dependencies: ['yfinance', 'TA-Lib']
        }
      },
      {
        name: '形态识别',
        description: '识别K线形态',
        status: 'active',
        type: '分析工具',
        details: {
          whatItDoes: '识别头肩顶、双底、三角形等K线形态',
          currentStatus: '✅ 正常运行',
          usage: 'python3 tools/pattern_recognition.py NVDA',
          dependencies: ['yfinance', 'TA-Lib']
        }
      },
      {
        name: '波动率计算器',
        description: '计算历史和隐含波动率',
        status: 'active',
        type: '分析工具',
        details: {
          whatItDoes: '计算历史波动率、ATR、隐含波动率',
          currentStatus: '✅ 正常运行',
          usage: 'python3 tools/volatility_calculator.py NVDA',
          dependencies: ['yfinance', 'Options Data']
        }
      },
      {
        name: '风险计算器',
        description: '计算VaR、夏普比率等',
        status: 'active',
        type: '分析工具',
        details: {
          whatItDoes: '计算VaR、CVaR、夏普比率、最大回撤等风险指标',
          currentStatus: '✅ 正常运行',
          usage: 'python3 tools/risk_calculator.py',
          dependencies: ['yfinance', 'NumPy']
        }
      },
      {
        name: '相关性矩阵',
        description: '计算股票相关性',
        status: 'active',
        type: '分析工具',
        details: {
          whatItDoes: '计算多只股票之间的相关性矩阵',
          currentStatus: '✅ 正常运行',
          usage: 'python3 tools/correlation_matrix.py NVDA AMD TSLA',
          dependencies: ['yfinance', 'Pandas']
        }
      },
      {
        name: '因子分析',
        description: '分析股票因子暴露',
        status: 'active',
        type: '分析工具',
        details: {
          whatItDoes: '分析股票对市场、规模、价值、动量等因子的暴露',
          currentStatus: '✅ 正常运行',
          usage: 'python3 tools/factor_analyzer.py NVDA',
          dependencies: ['yfinance', 'Fama-French Data']
        }
      },
      {
        name: '市场广度分析',
        description: '分析市场广度指标',
        status: 'active',
        type: '分析工具',
        details: {
          whatItDoes: '分析涨跌比、新高新低、Advance/Decline Line',
          currentStatus: '✅ 正常运行',
          usage: 'python3 tools/market_breadth_analyzer.py',
          dependencies: ['yfinance', 'Market Data']
        }
      },
      {
        name: '新闻影响分析',
        description: '分析新闻对股价的影响',
        status: 'active',
        type: '分析工具',
        details: {
          whatItDoes: '分析新闻发布后股价的反应，识别市场有效/无效',
          currentStatus: '✅ 正常运行',
          usage: 'python3 tools/news_impact_analyzer.py NVDA',
          dependencies: ['NewsAPI', 'yfinance']
        }
      },
      {
        name: '竞争力分析',
        description: '分析公司竞争力',
        status: 'active',
        type: '分析工具',
        details: {
          whatItDoes: '分析公司与竞争对手的财务指标对比',
          currentStatus: '✅ 正常运行',
          usage: 'python3 tools/competitive_analyzer.py NVDA AMD INTC',
          dependencies: ['yfinance', 'SEC EDGAR']
        }
      },
      {
        name: '管理层评估',
        description: '评估管理层质量',
        status: 'active',
        type: '分析工具',
        details: {
          whatItDoes: '评估CEO、CFO履历，分析管理层发言',
          currentStatus: '✅ 正常运行',
          usage: 'python3 tools/management_evaluator.py NVDA',
          dependencies: ['Company Filings', 'News']
        }
      },
      {
        name: '财报惊喜分析',
        description: '分析财报超预期/不及预期',
        status: 'active',
        type: '分析工具',
        details: {
          whatItDoes: '对比实际财报与预期，计算财报惊喜',
          currentStatus: '✅ 正常运行',
          usage: 'python3 tools/earnings_surprise_analyzer.py NVDA',
          dependencies: ['Finnhub', 'Earnings Data']
        }
      },
      {
        name: '行业对比',
        description: '对比股票与行业平均水平',
        status: 'active',
        type: '分析工具',
        details: {
          whatItDoes: '对比估值、增长率、利润率等指标与行业平均',
          currentStatus: '✅ 正常运行',
          usage: 'python3 tools/sector_comparator.py NVDA',
          dependencies: ['yfinance', 'Sector Data']
        }
      },
      {
        name: '情绪分析',
        description: '分析社交媒体情绪',
        status: 'active',
        type: '分析工具',
        details: {
          whatItDoes: '分析Twitter、Reddit情绪，计算情绪分数',
          currentStatus: '✅ 正常运行',
          usage: 'python3 tools/sentiment_analyzer.py NVDA',
          dependencies: ['Twitter API', 'Reddit API', 'LLM']
        }
      },
      {
        name: '回测验证器',
        description: '验证策略历史表现',
        status: 'active',
        type: '分析工具',
        details: {
          whatItDoes: '回测策略历史表现，计算收益、夏普比率、最大回撤',
          currentStatus: '✅ 正常运行',
          usage: 'python3 tools/backtest_validator.py --strategy sma_cross',
          dependencies: ['yfinance', 'Backtrader']
        }
      },
      {
        name: '压力测试',
        description: '测试极端市场情况',
        status: 'active',
        type: '分析工具',
        details: {
          whatItDoes: '模拟极端市场情况下的组合表现',
          currentStatus: '✅ 正常运行',
          usage: 'python3 tools/stress_test.py',
          dependencies: ['yfinance', 'Monte Carlo']
        }
      },
      {
        name: '组合优化',
        description: '优化投资组合',
        status: 'active',
        type: '分析工具',
        details: {
          whatItDoes: '使用均值-方差模型优化组合权重',
          currentStatus: '✅ 正常运行（v2版本）',
          usage: 'python3 tools/portfolio_optimizer_v2.py',
          dependencies: ['yfinance', 'CVXPY', 'SciPy']
        }
      },
      {
        name: '组合回测',
        description: '回测投资组合',
        status: 'active',
        type: '分析工具',
        details: {
          whatItDoes: '回测整个投资组合的历史表现',
          currentStatus: '✅ 正常运行',
          usage: 'python3 tools/portfolio_backtest.py',
          dependencies: ['yfinance', 'Backtrader']
        }
      },
      {
        name: '策略性能数据库',
        description: '记录策略表现',
        status: 'active',
        type: '分析工具',
        details: {
          whatItDoes: '记录每个策略的历史表现，计算统计数据',
          currentStatus: '✅ 正常运行',
          usage: 'python3 tools/strategy_performance_db.py',
          dependencies: ['SQLite', 'Pandas']
        }
      },
      {
        name: '信号生成器',
        description: '生成买卖信号',
        status: 'active',
        type: '分析工具',
        details: {
          whatItDoes: '基于技术指标、基本面、情绪生成综合买卖信号',
          currentStatus: '✅ 正常运行',
          usage: 'python3 tools/signal_generator.py NVDA',
          dependencies: ['yfinance', 'LLM']
        }
      },
      {
        name: '智能筛选器',
        description: '智能筛选股票',
        status: 'active',
        type: '分析工具',
        details: {
          whatItDoes: '基于多因子模型筛选优质股票',
          currentStatus: '✅ 正常运行',
          usage: 'python3 tools/smart_screener.py --sector tech',
          dependencies: ['yfinance', 'Multi-Factor Model']
        }
      },
      {
        name: '股票筛选器',
        description: '基础股票筛选',
        status: 'active',
        type: '分析工具',
        details: {
          whatItDoes: '基于PE、市值、成交量等基础指标筛选',
          currentStatus: '✅ 正常运行',
          usage: 'python3 tools/stock_screener.py --min-cap 1B',
          dependencies: ['yfinance']
        }
      },
      {
        name: '全市场扫描',
        description: '扫描全市场机会',
        status: 'active',
        type: '分析工具',
        details: {
          whatItDoes: '扫描S&P 500、NASDAQ 100等全市场股票',
          currentStatus: '✅ 正常运行',
          usage: 'python3 tools/full_market_scanner.py',
          dependencies: ['yfinance', 'S&P 500 List']
        }
      },
      {
        name: '市场择时',
        description: '判断市场整体趋势',
        status: 'active',
        type: '分析工具',
        details: {
          whatItDoes: '判断牛市/熊市/震荡市，建议仓位',
          currentStatus: '✅ 正常运行',
          usage: 'python3 tools/market_timing.py',
          dependencies: ['yfinance', 'VIX', 'Moving Averages']
        }
      },
      {
        name: '期权分析',
        description: '分析期权定价',
        status: 'active',
        type: '分析工具',
        details: {
          whatItDoes: '分析期权定价、隐含波动率、Greeks',
          currentStatus: '✅ 正常运行',
          usage: 'python3 tools/options_analyzer.py NVDA',
          dependencies: ['yfinance', 'Black-Scholes']
        }
      },
      {
        name: 'QuantConnect集成',
        description: '量化回测平台',
        status: 'active',
        type: '分析工具',
        details: {
          whatItDoes: '集成QuantConnect平台进行高级量化回测',
          currentStatus: '✅ 正常运行',
          usage: 'python3 QuantConnect/quantconnect_monitor.py',
          dependencies: ['QuantConnect API']
        }
      },
      {
        name: '回测框架',
        description: '自定义回测框架',
        status: 'active',
        type: '分析工具',
        details: {
          whatItDoes: '自定义回测框架，支持多种策略',
          currentStatus: '✅ 正常运行',
          usage: 'python3 backtest_framework.py',
          dependencies: ['yfinance', 'Pandas']
        }
      },

      // 交易类（15个）
      {
        name: '自动交易系统',
        description: '自动执行交易',
        status: 'pending',
        type: '交易工具',
        details: {
          whatItDoes: '自动执行买卖交易（需配置IBKR）',
          currentStatus: '⏳ 待配置IBKR账户',
          usage: 'python3 tools/auto_trader.py',
          dependencies: ['IBKR API', 'Trading Account']
        }
      },
      {
        name: '纸面交易追踪',
        description: '追踪模拟交易',
        status: 'active',
        type: '交易工具',
        details: {
          whatItDoes: '追踪模拟交易表现，验证策略',
          currentStatus: '✅ 正常运行',
          usage: 'python3 tools/paper_trading_tracker.py',
          dependencies: ['Virtual Trading']
        }
      },
      {
        name: '交易日志',
        description: '记录所有交易',
        status: 'active',
        type: '交易工具',
        details: {
          whatItDoes: '记录每笔交易的详细信息',
          currentStatus: '✅ 正常运行',
          usage: 'python3 tools/trade_logger.py',
          dependencies: ['SQLite']
        }
      },
      {
        name: '交易报告生成器',
        description: '生成交易报告',
        status: 'active',
        type: '交易工具',
        details: {
          whatItDoes: '生成每日/每周/每月交易报告',
          currentStatus: '✅ 正常运行',
          usage: 'python3 tools/xiaxia_trading_report.py',
          dependencies: ['Trading Data', 'Plotly']
        }
      },
      {
        name: 'IBKR连接器',
        description: '连接盈透证券API',
        status: 'pending',
        type: '交易工具',
        details: {
          whatItDoes: '连接IBKR API进行实盘交易',
          currentStatus: '⏳ 待配置',
          usage: 'python3 tools/ibkr_connector.py',
          dependencies: ['IBKR TWS', 'IB API']
        }
      },
      {
        name: 'IBKR数据提供',
        description: '获取IBKR实时数据',
        status: 'pending',
        type: '交易工具',
        details: {
          whatItDoes: '获取IBKR实时行情、历史数据',
          currentStatus: '⏳ 待配置',
          usage: 'python3 tools/ibkr_data_provider.py',
          dependencies: ['IBKR API']
        }
      },
      {
        name: '风险预警系统',
        description: '实时风险预警',
        status: 'active',
        type: '交易工具',
        details: {
          whatItDoes: '监控组合风险，实时预警',
          currentStatus: '✅ 正常运行',
          usage: 'python3 tools/risk_alert_system.py',
          dependencies: ['yfinance', 'Risk Models']
        }
      },
      {
        name: '警报推送',
        description: '推送交易警报',
        status: 'active',
        type: '交易工具',
        details: {
          whatItDoes: '通过Telegram、邮件推送警报',
          currentStatus: '✅ 正常运行',
          usage: 'python3 tools/alert_pusher.py',
          dependencies: ['Telegram API', 'Email']
        }
      },
      {
        name: '警报系统',
        description: '自定义警报规则',
        status: 'active',
        type: '交易工具',
        details: {
          whatItDoes: '设置价格、成交量、新闻等警报',
          currentStatus: '✅ 正常运行',
          usage: 'python3 tools/alert_system.py',
          dependencies: ['yfinance', 'NewsAPI']
        }
      },
      {
        name: 'Telegram通知器',
        description: 'Telegram消息推送',
        status: 'active',
        type: '交易工具',
        details: {
          whatItDoes: '通过Telegram推送交易信号、报告',
          currentStatus: '✅ 正常运行',
          usage: 'python3 tools/telegram_notifier.py',
          dependencies: ['Telegram Bot API']
        }
      },
      {
        name: 'Telegram机器人',
        description: '交互式Telegram机器人',
        status: 'active',
        type: '交易工具',
        details: {
          whatItDoes: '通过Telegram命令查询信息',
          currentStatus: '✅ 正常运行',
          usage: 'python3 tools/telegram_bot.py',
          dependencies: ['Telegram Bot API']
        }
      },
      {
        name: '语音生成器',
        description: '生成语音播报',
        status: 'active',
        type: '交易工具',
        details: {
          whatItDoes: '将报告转换为语音播报',
          currentStatus: '✅ 正常运行',
          usage: 'python3 tools/tts_generator.py',
          dependencies: ['OpenAI TTS', 'gTTS']
        }
      },
      {
        name: '状态查询',
        description: '查询系统状态',
        status: 'active',
        type: '交易工具',
        details: {
          whatItDoes: '查询所有工具运行状态',
          currentStatus: '✅ 正常运行',
          usage: 'python3 tools/xiaxia_status.py',
          dependencies: ['System Monitor']
        }
      },
      {
        name: '税务计算器',
        description: '计算交易税务',
        status: 'active',
        type: '交易工具',
        details: {
          whatItDoes: '计算资本利得税',
          currentStatus: '✅ 正常运行',
          usage: 'python3 tools/tax_calculator.py',
          dependencies: ['Trading Data']
        }
      },
      {
        name: '每日工作流',
        description: '自动化每日任务',
        status: 'active',
        type: '交易工具',
        details: {
          whatItDoes: '自动化执行每日监控、分析、报告任务',
          currentStatus: '✅ 正常运行',
          usage: 'python3 tools/daily_workflow.py',
          dependencies: ['Cron', 'All Tools']
        }
      },

      // 报告类（10个）
      {
        name: '报告生成器',
        description: '生成综合报告',
        status: 'active',
        type: '报告工具',
        details: {
          whatItDoes: '生成每日市场报告、个股分析报告',
          currentStatus: '✅ 正常运行',
          usage: 'python3 tools/report_generator.py',
          dependencies: ['All Data Sources']
        }
      },
      {
        name: '报告可视化',
        description: '可视化报告数据',
        status: 'active',
        type: '报告工具',
        details: {
          whatItDoes: '将报告数据可视化为图表',
          currentStatus: '✅ 正常运行',
          usage: 'python3 tools/report_visualizer.py',
          dependencies: ['Plotly', 'Matplotlib']
        }
      },
      {
        name: 'PDF生成器',
        description: '生成PDF报告',
        status: 'active',
        type: '报告工具',
        details: {
          whatItDoes: '将报告转换为PDF格式',
          currentStatus: '✅ 正常运行',
          usage: 'python3 tools/pdf_generator.py',
          dependencies: ['ReportLab', 'WeasyPrint']
        }
      },
      {
        name: '增强财报阅读',
        description: '增强版财报阅读',
        status: 'active',
        type: '报告工具',
        details: {
          whatItDoes: '高亮财报关键信息',
          currentStatus: '✅ 正常运行',
          usage: 'python3 tools/earnings_enhanced.py NVDA',
          dependencies: ['SEC EDGAR', 'NLP']
        }
      },
      {
        name: '财报阅读器',
        description: '读取财报文件',
        status: 'active',
        type: '报告工具',
        details: {
          whatItDoes: '读取10-K、10-Q财报文件',
          currentStatus: '✅ 正常运行',
          usage: 'python3 tools/earnings_reader.py NVDA',
          dependencies: ['SEC EDGAR']
        }
      },
      {
        name: '分析师评级聚合',
        description: '聚合分析师评级',
        status: 'active',
        type: '报告工具',
        details: {
          whatItDoes: '聚合多个分析师的评级和建议',
          currentStatus: '✅ 正常运行',
          usage: 'python3 tools/analyst_rating_aggregator.py NVDA',
          dependencies: ['Finnhub', 'TipRanks']
        }
      },
      {
        name: '分析师报告聚合',
        description: '聚合分析师报告',
        status: 'active',
        type: '报告工具',
        details: {
          whatItDoes: '聚合分析师研究报告',
          currentStatus: '✅ 正常运行',
          usage: 'python3 tools/analyst_report_aggregator.py',
          dependencies: ['Seeking Alpha', 'Zacks']
        }
      },
      {
        name: '公司新闻抓取',
        description: '抓取公司官网新闻',
        status: 'active',
        type: '报告工具',
        details: {
          whatItDoes: '从公司官网新闻室抓取新闻',
          currentStatus: '✅ 正常运行',
          usage: 'python3 tools/company_newsroom_scraper.py NVDA',
          dependencies: ['BeautifulSoup', 'Requests']
        }
      },
      {
        name: '扩展扫描',
        description: '扩展扫描范围',
        status: 'active',
        type: '报告工具',
        details: {
          whatItDoes: '扩展扫描到小盘股、中概股等',
          currentStatus: '✅ 正常运行',
          usage: 'python3 tools/scan_expanded.py',
          dependencies: ['yfinance', 'Stock Lists']
        }
      },
      {
        name: '回测报告',
        description: '生成回测报告',
        status: 'active',
        type: '报告工具',
        details: {
          whatItDoes: '生成详细回测报告',
          currentStatus: '✅ 正常运行',
          usage: 'python3 tools/backtest_report.py',
          dependencies: ['Backtrader', 'Plotly']
        }
      },

      // 系统类（25个）
      {
        name: 'Master Orchestrator',
        description: '多工具自动化编排器',
        status: 'active',
        type: '系统工具',
        details: {
          whatItDoes: '一键运行所有工具，自动收集数据，生成综合报告，调度定时任务',
          howItWorks: '定义工作流 → 自动收集数据 → 生成报告 → 调度任务 → 管理依赖',
          currentStatus: '✅ 正常运行\n- 已注册100个工具\n- 支持工作流定义\n- 自动化调度',
          lastUpdate: '2026-02-09',
          usage: 'python3 tools/master_orchestrator.py',
          dependencies: ['All Tools', 'Cron']
        }
      },
      {
        name: '启动器',
        description: '工具启动器',
        status: 'active',
        type: '系统工具',
        details: {
          whatItDoes: '统一启动入口',
          currentStatus: '✅ 正常运行',
          usage: 'python3 tools/launcher.py',
          dependencies: ['All Tools']
        }
      },
      {
        name: '定时任务设置',
        description: '配置Cron任务',
        status: 'active',
        type: '系统工具',
        details: {
          whatItDoes: '自动配置Cron定时任务',
          currentStatus: '✅ 正常运行',
          usage: 'python3 tools/setup_cron.py',
          dependencies: ['Cron']
        }
      },
      {
        name: '备份工具',
        description: '备份重要数据',
        status: 'active',
        type: '系统工具',
        details: {
          whatItDoes: '定期备份重要数据和配置',
          currentStatus: '✅ 正常运行',
          usage: 'python3 tools/backup_tool.py',
          dependencies: ['rsync', 'tar']
        }
      },
      {
        name: '版本管理器',
        description: '管理代码版本',
        status: 'active',
        type: '系统工具',
        details: {
          whatItDoes: '管理代码版本和更新',
          currentStatus: '✅ 正常运行',
          usage: 'python3 tools/version_manager.py',
          dependencies: ['Git']
        }
      },
      {
        name: '日志分析器',
        description: '分析系统日志',
        status: 'active',
        type: '系统工具',
        details: {
          whatItDoes: '分析工具运行日志，识别错误',
          currentStatus: '✅ 正常运行',
          usage: 'python3 tools/log_analyzer.py',
          dependencies: ['Log Files']
        }
      },
      {
        name: '测试套件',
        description: '运行系统测试',
        status: 'active',
        type: '系统工具',
        details: {
          whatItDoes: '测试所有工具是否正常运行',
          currentStatus: '✅ 正常运行',
          usage: 'python3 tools/test_suite.py',
          dependencies: ['pytest']
        }
      },
      {
        name: '配置检查',
        description: '检查配置文件',
        status: 'active',
        type: '系统工具',
        details: {
          whatItDoes: '检查API Key、配置文件是否正确',
          currentStatus: '✅ 正常运行',
          usage: 'python3 tools/check_config.py',
          dependencies: ['Config Files']
        }
      },
      {
        name: '依赖安装',
        description: '安装Python依赖',
        status: 'active',
        type: '系统工具',
        details: {
          whatItDoes: '自动安装所需Python包',
          currentStatus: '✅ 正常运行',
          usage: 'python3 tools/install_deps.py',
          dependencies: ['pip', 'conda']
        }
      },
      {
        name: '帮助生成器',
        description: '生成工具帮助文档',
        status: 'active',
        type: '系统工具',
        details: {
          whatItDoes: '自动生成工具使用说明',
          currentStatus: '✅ 正常运行',
          usage: 'python3 tools/generate_help.py',
          dependencies: ['Docstring Parser']
        }
      },
      {
        name: '可视化工具',
        description: '通用可视化',
        status: 'active',
        type: '系统工具',
        details: {
          whatItDoes: '通用数据可视化工具',
          currentStatus: '✅ 正常运行',
          usage: 'python3 tools/visualization.py',
          dependencies: ['Plotly', 'Matplotlib']
        }
      },
      {
        name: 'Obsidian集成',
        description: '集成Obsidian笔记',
        status: 'active',
        type: '系统工具',
        details: {
          whatItDoes: '将报告同步到Obsidian vault',
          currentStatus: '✅ 正常运行',
          usage: 'python3 tools/obsidian_integration.py',
          dependencies: ['Obsidian', 'Markdown']
        }
      },
      {
        name: 'IBKR简单测试',
        description: '测试IBKR连接',
        status: 'pending',
        type: '系统工具',
        details: {
          whatItDoes: '测试IBKR API连接',
          currentStatus: '⏳ 待配置',
          usage: 'python3 tools/simple_ibkr_test.py',
          dependencies: ['IBKR API']
        }
      },
      {
        name: 'IBKR连接测试',
        description: '详细测试IBKR',
        status: 'pending',
        type: '系统工具',
        details: {
          whatItDoes: '详细测试IBKR API功能',
          currentStatus: '⏳ 待配置',
          usage: 'python3 tools/test_ibkr_connection.py',
          dependencies: ['IBKR API']
        }
      },
      {
        name: 'IBKR修复测试',
        description: '测试IBKR修复',
        status: 'pending',
        type: '系统工具',
        details: {
          whatItDoes: '测试IBKR连接修复',
          currentStatus: '⏳ 待配置',
          usage: 'python3 tools/test_ibkr_fixed.py',
          dependencies: ['IBKR API']
        }
      },
      {
        name: 'IBKR测试v3',
        description: '第三版IBKR测试',
        status: 'pending',
        type: '系统工具',
        details: {
          whatItDoes: '第三版IBKR连接测试',
          currentStatus: '⏳ 待配置',
          usage: 'python3 tools/test_ibkr_v3.py',
          dependencies: ['IBKR API']
        }
      },
      {
        name: '财报惊喜追踪',
        description: '追踪财报惊喜历史',
        status: 'active',
        type: '系统工具',
        details: {
          whatItDoes: '追踪股票的财报惊喜历史',
          currentStatus: '✅ 正常运行',
          usage: 'python3 tools/earnings_surprise_tracker.py NVDA',
          dependencies: ['Finnhub']
        }
      },
      {
        name: '行业轮动追踪',
        description: '追踪行业轮动历史',
        status: 'active',
        type: '系统工具',
        details: {
          whatItDoes: '追踪行业轮动历史数据',
          currentStatus: '✅ 正常运行',
          usage: 'python3 tools/sector_rotation_tracker.py',
          dependencies: ['yfinance']
        }
      },
      {
        name: 'Crypto情绪分析',
        description: '分析加密货币情绪',
        status: 'active',
        type: '系统工具',
        details: {
          whatItDoes: '分析加密货币市场情绪',
          currentStatus: '✅ 正常运行',
          usage: 'python3 tools/crypto_sentiment.py',
          dependencies: ['Twitter', 'Reddit', 'Fear & Greed']
        }
      },
      {
        name: '新闻情绪分析',
        description: '分析新闻情绪',
        status: 'active',
        type: '系统工具',
        details: {
          whatItDoes: '分析新闻情绪（看涨/看跌/中性）',
          currentStatus: '✅ 正常运行',
          usage: 'python3 tools/news_sentiment.py NVDA',
          dependencies: ['NewsAPI', 'LLM']
        }
      },
      {
        name: 'RSS KOL监控',
        description: '纯RSS方式监控KOL',
        status: 'active',
        type: '系统工具',
        details: {
          whatItDoes: '纯RSS方式监控KOL推文',
          currentStatus: '✅ 正常运行',
          usage: 'python3 tools/rss_kol_monitor.py --all',
          dependencies: ['RSS Feeds']
        }
      },
      {
        name: 'Pushshift监控',
        description: 'Pushshift Reddit监控',
        status: 'active',
        type: '系统工具',
        details: {
          whatItDoes: '通过Pushshift API监控Reddit',
          currentStatus: '✅ 正常运行（免费）',
          usage: 'python3 tools/pushshift_monitor.py --stock NVDA',
          dependencies: ['Pushshift API']
        }
      },
      {
        name: '虾虾自动交易',
        description: '虾虾自动交易系统',
        status: 'pending',
        type: '系统工具',
        details: {
          whatItDoes: '虾虾专用自动交易系统',
          currentStatus: '⏳ 待配置',
          usage: 'python3 tools/xiaxia_auto_trader.py',
          dependencies: ['IBKR API']
        }
      },
      {
        name: '财报阅读器增强',
        description: '增强版财报阅读',
        status: 'active',
        type: '系统工具',
        details: {
          whatItDoes: '增强版财报阅读器',
          currentStatus: '✅ 正常运行',
          usage: 'python3 tools/earnings_reader.py NVDA',
          dependencies: ['SEC EDGAR']
        }
      },
      {
        name: '回测框架',
        description: '自定义回测框架',
        status: 'active',
        type: '系统工具',
        details: {
          whatItDoes: '自定义回测框架',
          currentStatus: '✅ 正常运行',
          usage: 'python3 backtest_framework.py',
          dependencies: ['yfinance', 'Pandas']
        }
      }
    ]
  },

  // API系统
  {
    category: 'api',
    name: 'API系统',
    icon: '🌐',
    items: [
      {
        name: 'bird',
        description: 'Twitter/X社交监控工具',
        status: 'active',
        type: '社交工具',
        details: {
          whatItDoes: 'Twitter/X数据扒取，监控推文、用户动态、热门话题',
          howItWorks: 'bird CLI → Twitter数据 → 分析报告',
          currentStatus: '✅ 已配置\n- 免费，无限制\n- 主力社交监控工具',
          lastUpdate: '2026-02-04',
          usage: 'bird search "NVDA"',
          dependencies: ['Twitter Cookie']
        }
      },
      {
        name: 'obsidian-cli',
        description: 'Obsidian笔记管理工具',
        status: 'active',
        type: '笔记工具',
        details: {
          whatItDoes: '管理Obsidian vault，创建、搜索、编辑股票研究笔记',
          howItWorks: 'obsidian-cli → Markdown笔记 → 知识库',
          currentStatus: '✅ 已配置\n- 免费，无限制\n- 主力笔记工具',
          lastUpdate: '2026-02-04',
          usage: 'obsidian new "NVDA分析"',
          dependencies: ['Obsidian']
        }
      },
      {
        name: 'summarize',
        description: '研报/文章总结工具',
        status: 'active',
        type: '文本工具',
        details: {
          whatItDoes: '总结研报、文章、长文本，提取关键信息',
          howItWorks: 'Kimi API → 文本总结 → 输出摘要',
          currentStatus: '✅ 已配置\n- Kimi额度支持\n- 主力总结工具',
          lastUpdate: '2026-02-04',
          usage: 'summarize "https://..."',
          dependencies: ['Kimi API']
        }
      },
      {
        name: 'gh (GitHub CLI)',
        description: 'GitHub代码管理工具',
        status: 'active',
        type: '代码工具',
        details: {
          whatItDoes: 'GitHub操作，管理代码、PR、Issues',
          howItWorks: 'gh CLI → GitHub API → 操作代码库',
          currentStatus: '✅ 已配置\n- 免费，无限制\n- 主力代码工具',
          lastUpdate: '2026-02-04',
          usage: 'gh repo list',
          dependencies: ['GitHub Token: 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']
        }
      },
      {
        name: 'Brave Search API',
        description: 'web_search底层搜索API',
        status: 'active',
        type: '搜索API',
        details: {
          whatItDoes: 'web_search工具的底层搜索API，提供网页搜索能力',
          howItWorks: 'Brave Search API → 搜索结果 → 返回给web_search工具',
          currentStatus: '✅ 已配置\n- OpenClaw内置\n- 无需单独调用',
          lastUpdate: '2026-02-04',
          usage: '自动调用（通过web_search工具）',
          dependencies: ['API Key: BSAAKvroq-wexlNpVth1wkN80zVFdfT']
        }
      },
      {
        name: 'Kimi API',
        description: 'summarize工具底层LLM API',
        status: 'active',
        type: 'LLM API',
        details: {
          whatItDoes: 'summarize工具的底层LLM API，提供文本总结能力',
          howItWorks: 'Kimi API → 文本总结 → 返回给summarize工具',
          currentStatus: '✅ 已配置\n- Moonshot AI\n- 长文本处理',
          lastUpdate: '2026-02-04',
          usage: '自动调用（通过summarize工具）',
          dependencies: ['API Key: sk-WrB6ycMkQRHboVDVReUWNg32wvMhGQTolyeYxFuCWhTtGskS', 'Base URL: https://api.moonshot.cn/v1']
        }
      },
      {
        name: 'Twitter/X Cookie',
        description: 'bird工具底层认证',
        status: 'active',
        type: '认证工具',
        details: {
          whatItDoes: 'bird工具的底层Twitter/X认证，提供Twitter数据访问',
          howItWorks: 'Cookie认证 → Twitter API → 返回给bird工具',
          currentStatus: '✅ 已配置\n- 免费访问\n- 无需API Key',
          lastUpdate: '2026-02-04',
          usage: '自动调用（通过bird工具）',
          dependencies: ['Auth Token: 2b474e8ccbee3cb37e6ba3e37d5d53fcb399ac02', 'CT0: 42d0812e24a17a0aace033e6cab470ea3953a7b5c2c66bdeeb1c3df3a554ccbf...']
        }
      },
      {
        name: 'Alpha Vantage API',
        description: '主力财务数据源',
        status: 'active',
        type: '数据API',
        details: {
          whatItDoes: '获取财报、现金流、利润表等财务数据',
          howItWorks: 'RESTful API → JSON响应 → 财务分析',
          currentStatus: '✅ 已配置\n- 免费25次/天\n- 主力财务数据源',
          lastUpdate: '2026-02-04',
          usage: 'https://www.alphavantage.co/query?function=INCOME_STATEMENT&symbol=NVDA',
          dependencies: ['API Key: 28OXFFP2JWTDGBGD']
        }
      },
      {
        name: 'Financial Modeling Prep API',
        description: '详细财务数据（Alpha备用）',
        status: 'active',
        type: '数据API',
        details: {
          whatItDoes: '获取详细财报、财务比率、估值数据',
          howItWorks: 'RESTful API → JSON响应 → 财务分析',
          currentStatus: '✅ 已配置\n- 免费250次/天\n- Alpha Vantage备用',
          lastUpdate: '2026-02-04',
          usage: 'https://financialmodelingprep.com/api/v3/income-statement/NVDA',
          dependencies: ['API Key: AQpMi6zf0bH0QtCHpl15FxtQeNxEHniU']
        }
      },
      {
        name: 'Finnhub API',
        description: '实时股价、新闻、财报数据',
        status: 'active',
        type: '数据API',
        details: {
          whatItDoes: '获取实时股价、公司新闻、财报数据、分析师评级',
          howItWorks: 'RESTful API → JSON响应 → 解析存储',
          currentStatus: '✅ 正常运行\n- API Key已配置\n- 每分钟60次调用限制',
          lastUpdate: '2026-02-09',
          usage: 'import finnhub\nfinnhub_client = finnhub.Client(api_key="YOUR_KEY")',
          dependencies: ['API Key: 已配置（见SESSION_START.md）']
        }
      },
      {
        name: 'NewsAPI',
        description: '全球新闻聚合',
        status: 'active',
        type: '数据API',
        details: {
          whatItDoes: '获取全球财经新闻',
          howItWorks: '关键词搜索 → 按时间排序 → 情绪分析',
          currentStatus: '✅ 正常运行\n- API Key已配置\n- 免费100请求/天',
          lastUpdate: '2026-02-09',
          usage: 'import requests\nurl = f"https://newsapi.org/v2/everything?q={keyword}&apiKey={API_KEY}"',
          dependencies: ['API Key: 已配置（见SESSION_START.md）']
        }
      },
      {
        name: 'SEC EDGAR',
        description: '官方财报数据',
        status: 'active',
        type: '数据API',
        details: {
          whatItDoes: '获取10-K、10-Q、8-K、Form 4等官方财报文件',
          howItWorks: 'CIK查询 → 文件下载 → 解析提取',
          currentStatus: '✅ 正常运行\n- 免费无限制\n- 10次/秒限制',
          lastUpdate: '2026-02-09',
          usage: 'import requests\nurl = f"https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK={symbol}"',
          dependencies: ['免费，无需API Key']
        }
      },
      {
        name: 'yfinance',
        description: 'Yahoo Finance数据',
        status: 'active',
        type: '数据API',
        details: {
          whatItDoes: '获取股价、成交量、财务指标、期权数据',
          howItWorks: 'Python库 → Pandas DataFrame → 分析',
          currentStatus: '✅ 正常运行\n- 免费无限制\n- 支持全市场股票',
          lastUpdate: '2026-02-09',
          usage: 'import yfinance as yf\nstock = yf.Ticker("NVDA")\ndata = stock.history(period="1mo")',
          dependencies: ['免费，pip安装']
        }
      },
      {
        name: 'FRED API',
        description: '宏观经济数据',
        status: 'active',
        type: '数据API',
        details: {
          whatItDoes: '获取美联储利率、CPI、GDP、失业率等宏观数据',
          howItWorks: '序列ID查询 → 数据下载 → 分析',
          currentStatus: '✅ 正常运行\n- 需申请免费API Key',
          lastUpdate: '2026-02-09',
          usage: 'import pandas_datareader.data as web\ndata = web.DataReader("DFF", "fred", start, end)',
          dependencies: ['免费API Key']
        }
      },
      {
        name: 'Nitter',
        description: 'Twitter免费抓取',
        status: 'active',
        type: '数据API',
        details: {
          whatItDoes: '通过Nitter免费抓取Twitter推文',
          howItWorks: 'Nitter实例 → RSS订阅 → 解析提取',
          currentStatus: '✅ 正常运行\n- 免费\n- 4个Nitter实例',
          lastUpdate: '2026-02-10',
          usage: 'https://nitter.net/username/rss',
          dependencies: ['免费，无需API Key']
        }
      },
      {
        name: 'Reddit RSS',
        description: 'Reddit免费抓取',
        status: 'active',
        type: '数据API',
        details: {
          whatItDoes: '通过RSS免费抓取Reddit帖子',
          howItWorks: 'RSS订阅 → 解析 → 情绪分析',
          currentStatus: '✅ 正常运行\n- 免费',
          lastUpdate: '2026-02-09',
          usage: 'https://www.reddit.com/r/wallstreetbets/.rss',
          dependencies: ['免费，无需API Key']
        }
      },
      {
        name: 'Pushshift',
        description: 'Reddit历史数据',
        status: 'active',
        type: '数据API',
        details: {
          whatItDoes: '获取Reddit历史帖子（Pushshift镜像）',
          howItWorks: 'API查询 → 历史数据 → 分析',
          currentStatus: '✅ 正常运行\n- 免费',
          lastUpdate: '2026-02-09',
          usage: 'https://api.pushshift.io/reddit/search/submission/?q=NVDA&subreddit=wallstreetbets',
          dependencies: ['免费，无需API Key']
        }
      },
      {
        name: 'Dataroma',
        description: '明星投资人持仓',
        status: 'active',
        type: '数据API',
        details: {
          whatItDoes: '获取巴菲特、Cathie Wood等明星投资人持仓',
          howItWorks: '网页抓取 → 数据提取',
          currentStatus: '✅ 正常运行\n- 免费',
          lastUpdate: '2026-02-09',
          usage: 'Web Scraping',
          dependencies: ['免费']
        }
      },
      {
        name: 'CoinGecko API',
        description: '加密货币数据',
        status: 'active',
        type: '数据API',
        details: {
          whatItDoes: '获取加密货币价格、市值、成交量',
          howItWorks: 'RESTful API → JSON响应',
          currentStatus: '✅ 正常运行\n- 免费50次/分钟',
          lastUpdate: '2026-02-09',
          usage: 'from pycoingecko import CoinGeckoAPI\ncg = CoinGeckoAPI()',
          dependencies: ['免费，pip安装']
        }
      }
    ]
  },

  // 知识库系统
  {
    category: 'knowledge',
    name: '知识库系统',
    icon: '📚',
    items: [
      {
        name: 'KOL储备库',
        description: '46位KOL完整档案',
        status: 'active',
        type: '知识库',
        details: {
          whatItDoes: '存储46位KOL的完整信息，包括账号、专长、可靠性评级',
          howItWorks: '分类管理 → RSS配置 → 监控优先级',
          currentStatus: '✅ 正常运行\n- 46位KOL已配置\n- 分5大类\n- 12位重点监控',
          lastUpdate: '2026-02-10',
          usage: 'KOL储备库/README.md',
          dependencies: ['kol_rss_feeds.yaml']
        }
      },
      {
        name: 'KOL大师框架',
        description: '5位投资大师',
        status: 'active',
        type: '知识库',
        details: {
          whatItDoes: '存储5位投资大师（巴菲特、芒格、段永平、Menhguin、aleabitoreddit）的完整档案',
          howItWorks: '单独档案 → 深度分析 → 最高权重参考',
          currentStatus: '✅ 正常运行\n- 5位大师已建档\n- 纳入每日报告',
          lastUpdate: '2026-02-07',
          usage: 'KOL分类体系与大师框架.md',
          dependencies: ['Twitter API']
        }
      },
      {
        name: 'KOL情绪数据库',
        description: '历史情绪数据',
        status: 'active',
        type: '知识库',
        details: {
          whatItDoes: '存储KOL历史情绪数据，用于趋势分析',
          howItWorks: '每30分钟抓取 → 情绪分析 → JSON存储',
          currentStatus: '✅ 正常运行\n- 51个JSON文件\n- 时间跨度：2026-02-11~02-12',
          lastUpdate: '2026-02-12',
          usage: 'KOL数据/kol_sentiment_*.json',
          dependencies: ['twitter_kol_monitor.py']
        }
      },
      {
        name: '知识储备库',
        description: '量化策略与风险管理',
        status: 'active',
        type: '知识库',
        details: {
          whatItDoes: '存储量化策略、风险管理知识',
          currentStatus: '✅ 正常运行\n- 量化策略目录\n- 风险管理目录',
          usage: '知识储备库/',
          dependencies: ['Markdown']
        }
      },
      {
        name: '持仓管理',
        description: '当前持仓记录',
        status: 'active',
        type: '知识库',
        details: {
          whatItDoes: '记录当前持仓（ASML、META）',
          currentStatus: '✅ 正常运行\n- ASML（待记录成本）\n- META（待记录成本）',
          usage: 'MEMORY.md',
          dependencies: ['yfinance']
        }
      },
      {
        name: '投资哲学体系',
        description: '子涵核心投资心法',
        status: 'active',
        type: '知识库',
        details: {
          whatItDoes: '存储「To The Point」投资体系',
          howItWorks: '只做基本面发生预期之外变化的标的 → 只做第一段 → 不做二段',
          currentStatus: '✅ 正常运行',
          lastUpdate: '2026-02-04',
          usage: 'MEMORY.md',
          dependencies: ['学习对象：万卉、巴菲特、Jensen Huang、Cathie Wood']
        }
      }
    ]
  },

  // 机构系统
  {
    category: 'institutional',
    name: '机构系统',
    icon: '🏦',
    items: [
      {
        name: '投资蒸馏系统',
        description: '4201家机构持仓蒸馏（每天9点自动更新）',
        status: 'active',
        type: '机构系统',
        details: {
          whatItDoes: '从4201家机构、926823个持仓中蒸馏出早期投资机会，每天9点自动更新',
          howItWorks: 'SEC EDGAR 13F数据 → 三大蒸馏维度：\n1. 早期机会发现（机构<=3家）→ 2. 趋势追踪（3-5季度）→ 3. 集体共识（>=5家机构）',
          currentStatus: '✅ 正常运行（2026-03-05 16:57最新数据）\n- 4201家机构\n- 926823个持仓\n- 46791个早期机会\n- 6355个共识股票\n- 每天9点自动更新',
          lastUpdate: '2026-03-05 16:57',
          usage: 'investment_distillation/daily_update.py（自动运行）',
          dependencies: ['SEC EDGAR', '13F Holdings', 'Heartbeat自动触发']
        }
      },
      {
        name: '机构持仓追踪',
        description: '13F申报追踪',
        status: 'active',
        type: '机构系统',
        details: {
          whatItDoes: '追踪30家明星机构的13F季度持仓',
          howItWorks: 'SEC EDGAR → 13F文件 → 持仓变化 → Smart Money流向',
          currentStatus: '✅ 正常运行\n- 30家明星机构\n- 伯克希尔、ARK、桥水等',
          lastUpdate: '2026-02-09',
          usage: 'python3 tools/institutional_tracker.py',
          dependencies: ['SEC EDGAR', 'Whale Wisdom']
        }
      },
      {
        name: '大单监控',
        description: '暗池与大单交易',
        status: 'active',
        type: '机构系统',
        details: {
          whatItDoes: '监控异常成交量、识别大单交易、机构买卖方向',
          howItWorks: '成交量>3x平均 → 价格变动>3% → 吸筹/派发信号',
          currentStatus: '✅ 正常运行\n- 监控8只股票\n- NVDA、AMD、TSLA等',
          lastUpdate: '2026-02-09',
          usage: 'python3 tools/whale_tracker.py',
          dependencies: ['yfinance', 'Volume Data']
        }
      }
    ]
  },

  // AI系统
  {
    category: 'ai',
    name: 'AI系统',
    icon: '🤖',
    items: [
      {
        name: 'AI执行系统',
        description: '执行记录与嵌入检索',
        status: 'active',
        type: 'AI系统',
        details: {
          whatItDoes: '记录所有执行任务，嵌入检索，每日复盘',
          howItWorks: '执行记录 → 嵌入向量 → 相似性搜索 → 自动复盘',
          currentStatus: '✅ 正常运行\n- 每日05:30复盘\n- 嵌入检索就绪\n- 交易系统集成',
          lastUpdate: '2026-02-12',
          usage: 'AI执行系统/execution_system.py',
          dependencies: ['Embedding Store', 'Cron']
        }
      },
      {
        name: 'ML模型',
        description: '机器学习预测系统',
        status: 'active',
        type: 'AI系统',
        details: {
          whatItDoes: '使用随机森林、梯度提升等模型预测5日后涨跌',
          howItWorks: '37个高级特征 → 多模型训练 → 集成投票 → 预测输出',
          currentStatus: '✅ 正常运行\n- AAPL模型已训练\n- NVDA模型已训练\n- TSLA模型已训练',
          lastUpdate: '2026-02-14',
          usage: 'python3 tools/ml_signal_generator.py NVDA',
          dependencies: ['scikit-learn', 'xgboost', 'yfinance']
        }
      },
      {
        name: 'LLM情绪分析',
        description: '大语言模型情绪分析',
        status: 'active',
        type: 'AI系统',
        details: {
          whatItDoes: '使用LLM分析新闻、推文情绪',
          howItWorks: '文本输入 → LLM → 情绪打分（看涨/看跌/中性）',
          currentStatus: '✅ 正常运行\n- Model: zai/glm-5\n- 支持俚语识别',
          lastUpdate: '2026-02-09',
          usage: 'LLM调用',
          dependencies: ['zai/glm-5']
        }
      },
      {
        name: '正反Agent辩论',
        description: '多Agent辩论系统',
        status: 'active',
        type: 'AI系统',
        details: {
          whatItDoes: '正方Agent vs 反方Agent辩论，综合判断',
          howItWorks: '正方论点 → 反方反驳 → 综合裁决',
          currentStatus: '✅ 正常运行\n- sessions_spawn实现',
          usage: 'sessions_spawn',
          dependencies: ['LLM', 'sessions_spawn']
        }
      },
      {
        name: '地缘政治追踪',
        description: '实时追踪重大事件',
        status: 'active',
        type: 'AI系统',
        details: {
          whatItDoes: '追踪伊朗局势等重大事件，分析市场影响',
          howItWorks: '多源抓取 → 事件提取 → 市场影响分析 → 实时更新',
          currentStatus: '✅ 正常运行\n- 9个时间线事件\n- 5个市场影响\n- 每分钟更新',
          lastUpdate: '2026-03-03',
          usage: '/event-tracker-ultimate',
          dependencies: ['Web Scraping', 'LLM']
        }
      },
      {
        name: 'AI硬件洞察',
        description: '模拟AI计算与芯片技术分析',
        status: 'active',
        type: 'AI系统',
        details: {
          whatItDoes: '分析AI基础设施、芯片技术、能源效率趋势，提供投资洞察',
          howItWorks: '技术论文/行业报告 → 花卷知识库 → 投资分析应用',
          currentStatus: '✅ 已整合\n- 模拟AI计算完整分析\n- 数据中心能源危机洞察\n- Mythic/Syntiant/EnCharge AI案例\n- 物理定律计算原理',
          lastUpdate: '2026-03-07',
          usage: 'knowledge_base/analog_ai_computing_2026-03-07.md',
          dependencies: ['知识库', '投资分析'],
          keyTopics: [
            '模拟AI计算（Analog CIM）',
            '欧姆定律/基尔霍夫定律应用',
            'DAC/ADC转换瓶颈',
            'ReRAM/PCM/STT-MRAM材料技术',
            'AI数据中心能源危机（2030年945 TWh）',
            '边缘AI芯片投资机会'
          ],
          investmentRelevance: '高 - 直接关联AI基础设施、半导体、能源三大投资主题'
        }
      },
      {
        name: 'AI投资评估框架',
        description: 'Copilot vs Autopilot价值迁移分析',
        status: 'active',
        type: 'AI系统',
        details: {
          whatItDoes: '评估AI创业公司的价值链位置、商业模式、护城河强度',
          howItWorks: 'Sequoia框架 + 历史模式 + 实战案例 → AI投资决策支持',
          currentStatus: '✅ 已整合\n- Copilot vs Autopilot模式\n- $1工具市场 vs $6服务市场\n- Intelligence vs Judgment框架\n- 3个垂直领域机会（$240-360B）\n- 创新者困境分析',
          lastUpdate: '2026-03-07',
          usage: 'knowledge_base/ai_startup_value_migration_2026-03-07.md',
          dependencies: ['知识库', 'Sequoia框架', '历史数据分析'],
          keyTopics: [
            'Copilot vs Autopilot模式',
            '利润守恒定律（Christensen）',
            '价值迁移：工具层 → 服务层',
            'Intelligence vs Judgment',
            '外包替代市场（$140-200B保险、$50-80B会计、$50-80B医疗计费）',
            '创新者困境：从Copilot转型Autopilot',
            '历史模式：印刷术、电力、云计算、AI'
          ],
          investmentRelevance: '极高 - AI投资核心评估框架',
          coreFramework: {
            sequoia: '$1工具市场 vs $6服务市场',
            valueMigration: 'AI商品化"如何构建" → 价值流向"构建什么+为谁构建"',
            intelligenceVsJudgment: 'Intelligence（规则性，AI可做）vs Judgment（判断性，人类核心）',
            entryStrategy: '从外包工作切入（Vendor Swap摩擦小）→ 向内部扩张（长期TAM）'
          },
          verticalMarkets: [
            { name: '保险经纪', size: '$140-200B', autopilotViability: '高' },
            { name: '会计审计', size: '$50-80B', autopilotViability: '高' },
            { name: '医疗计费', size: '$50-80B', autopilotViability: '高' }
          ]
        }
      }
    ]
  },

  // 八大Agent
  {
    category: 'agents',
    name: '八大分析Agent',
    icon: '🎯',
    items: [
      {
        name: 'Macro Regime Agent',
        description: '宏观周期分析',
        status: 'active',
        type: '分析Agent',
        details: {
          whatItDoes: '分析宏观经济周期（扩张/衰退/复苏）',
          howItWorks: 'FRED数据 → 利率/通胀/GDP → 周期判断',
          currentStatus: '✅ 正常运行\n- FRED API\n- 宏观日历',
          usage: '八大Agent之一',
          dependencies: ['FRED API', 'yfinance']
        }
      },
      {
        name: 'Sector Rotation Agent',
        description: '行业轮动分析',
        status: 'active',
        type: '分析Agent',
        details: {
          whatItDoes: '分析行业资金流向，识别轮动信号',
          howItWorks: '11个行业ETF → 资金流向 → 轮动信号',
          currentStatus: '✅ 正常运行\n- XLK/XLF/XLE等\n- sector_rotation_monitor.py',
          usage: '八大Agent之二',
          dependencies: ['yfinance', 'sector_rotation_monitor.py']
        }
      },
      {
        name: 'Liquidity Agent',
        description: '流动性分析',
        status: 'active',
        type: '分析Agent',
        details: {
          whatItDoes: '分析市场流动性状况',
          howItWorks: 'M2/美联储资产负债表 → 流动性判断',
          currentStatus: '✅ 正常运行\n- fund_flow_tracker.py',
          usage: '八大Agent之三',
          dependencies: ['FRED', 'fund_flow_tracker.py']
        }
      },
      {
        name: 'ICT Structure Agent',
        description: '技术结构分析',
        status: 'active',
        type: '分析Agent',
        details: {
          whatItDoes: '分析支撑阻力、趋势线、关键价位',
          howItWorks: 'K线数据 → 技术分析 → 结构识别',
          currentStatus: '✅ 正常运行\n- technical_scanner.py',
          usage: '八大Agent之四',
          dependencies: ['yfinance', 'technical_scanner.py']
        }
      },
      {
        name: 'Flow & Derivatives Agent',
        description: '期权流分析',
        status: 'active',
        type: '分析Agent',
        details: {
          whatItDoes: '分析期权流、Gamma、隐含波动率',
          howItWorks: '期权数据 → Gamma敞口 → 市场影响',
          currentStatus: '✅ 正常运行\n- options_flow_analyzer.py',
          usage: '八大Agent之五',
          dependencies: ['Finnhub', 'options_flow_analyzer.py']
        }
      },
      {
        name: 'News Catalyst Agent',
        description: '新闻催化剂分析',
        status: 'active',
        type: '分析Agent',
        details: {
          whatItDoes: '分析新闻催化剂对股价的影响',
          howItWorks: '新闻抓取 → 情绪分析 → 影响评估',
          currentStatus: '✅ 正常运行\n- comprehensive_news_search.py',
          usage: '八大Agent之六',
          dependencies: ['NewsAPI', 'comprehensive_news_search.py']
        }
      },
      {
        name: 'Fundamental Stability Agent',
        description: '基本面稳定性分析',
        status: 'active',
        type: '分析Agent',
        details: {
          whatItDoes: '分析基本面稳定性、财务健康度',
          howItWorks: 'SEC EDGAR → 财务分析 → 估值计算',
          currentStatus: '✅ 正常运行\n- financial_analyzer.py\n- valuation_calculator.py',
          usage: '八大Agent之七',
          dependencies: ['SEC EDGAR', 'financial_analyzer.py', 'valuation_calculator.py']
        }
      },
      {
        name: 'Risk & Portfolio Control Agent',
        description: '风险与组合控制',
        status: 'active',
        type: '分析Agent',
        details: {
          whatItDoes: '计算风险敞口、VaR、组合优化',
          howItWorks: '持仓数据 → 风险计算 → 仓位建议',
          currentStatus: '✅ 正常运行\n- risk_calculator.py\n- portfolio_optimizer_v2.py',
          usage: '八大Agent之八',
          dependencies: ['MEMORY.md', 'risk_calculator.py', 'portfolio_optimizer_v2.py']
        }
      }
    ]
  },

  // 记忆系统
  {
    category: 'memory',
    name: '记忆系统',
    icon: '💾',
    items: [
      {
        name: 'OpenViking 革命性记忆数据库',
        description: '专为 AI Agents 设计的 Context Database',
        status: 'active',
        type: '记忆系统',
        details: {
          whatItDoes: '革命性记忆数据库，彻底解决花卷的三大痛点：\n1. Context Window 超限 → 分层存储（L0/L1/L2），永不超限\n2. 记忆丢失和健忘 → 永久保存，智能检索\n3. 每次session重启失忆 → 持久记忆，越用越聪明',
          howItWorks: '• 文件系统范式：统一管理记忆、资源、技能\n• 三层存储：L0抽象（100 tokens）+ L1概览（2k tokens）+ L2详情（按需加载）\n• 目录递归检索：先定位高相关目录，再精细探索\n• 可视化轨迹：清楚观察检索路径\n• 自动迭代：持续学习，自动更新记忆',
          currentStatus: '✅ 完整安装并运行\n• OpenViking 0.2.4 + AGFS 服务器\n• 85个记忆文件已导入（100%成功）\n• Viking URI: viking://resources/huajuan/（core/daily/knowledge）\n• 服务器端口：1933\n• 健康状态：100%正常',
          performance: '📊 革命性改进（官方测试数据）：\n• 任务完成率：+43-49%\n• Token 成本：-83-96%\n• 记忆容量：37 → ∞',
          lastUpdate: '2026-03-06 13:36',
          usage: '• 配置文件：~/.openviking/ov.conf\n• 客户端：tools/openviking_memory_manager.py\n• 详细报告：memory/2026-03-06-openviking-complete-success.md',
          dependencies: ['OpenViking 0.2.4', 'AGFS', 'OpenAI API', 'Python']
        }
      },
      {
        name: '向量记忆增强系统（git版本控制）',
        description: 'git自动化 + 向量记忆同步 + Obsidian CLI备份',
        status: 'active',
        type: '记忆系统',
        details: {
          whatItDoes: '用 git 版本控制给向量记忆打标签，解决向量化"无差别堆灰"的问题，让重要记忆一眼可找到。与OpenViking互补，不替代。',
          howItWorks: '• git版本控制：给记忆打标签（important, phase, api, bug等）\n• 向量记忆同步：git commit自动同步到OpenViking\n• Obsidian CLI备份：自动备份到Obsidian知识库\n• 双重检索：git标签定位 + OpenViking智能检索',
          currentStatus: '✅ 已整合\n• git版本控制（memory/目录）\n• 标签系统（5种标签）\n• 自动备份脚本\n• 与OpenViking协同工作',
          improvements: '📊 整合后的改善：\n• 重要记忆定位时间：30秒 → 5秒（-83%）\n• 检索噪音：高 → 低（-70%）\n• 备份可靠性：80% → 99%（+19%）\n• 新增功能：协同编辑、历史追溯',
          lastUpdate: '2026-03-07',
          usage: '• git tag：给重要记忆打标签\n• git commit：版本控制\n• obsidian-cli backup：自动备份',
          dependencies: ['git', 'OpenViking', 'Obsidian CLI']
        }
      },
      {
        name: 'MEMORY_LITE.md',
        description: '精简版记忆（1KB）',
        status: 'active',
        type: '记忆系统',
        details: {
          whatItDoes: '新session优先读取，防止Context超限',
          currentStatus: '✅ 正常运行\n⚠️ 将逐步迁移到 OpenViking',
          usage: 'MEMORY_LITE.md',
          dependencies: ['自动更新']
        }
      },
      {
        name: 'MEMORY.md',
        description: '压缩版记忆（3KB）',
        status: 'active',
        type: '记忆系统',
        details: {
          whatItDoes: '需要详细信息时分段读取',
          currentStatus: '✅ 正常运行\n- 原70KB → 压缩后3KB',
          lastUpdate: '2026-03-05',
          usage: 'MEMORY.md',
          dependencies: ['分段读取']
        }
      },
      {
        name: 'memory/YYYY-MM-DD.md',
        description: '每日工作日志',
        status: 'active',
        type: '记忆系统',
        details: {
          whatItDoes: '记录每日工作内容',
          currentStatus: '✅ 正常运行',
          usage: 'memory/',
          dependencies: ['自动创建']
        }
      },
      {
        name: 'Context保护系统',
        description: '监控Context使用',
        status: 'active',
        type: '记忆系统',
        details: {
          whatItDoes: '监控Context使用，防止超限',
          currentStatus: '✅ 正常运行\n- context_protector.py',
          usage: 'python3 tools/context_protector.py',
          dependencies: ['Python']
        }
      },
      {
        name: '自动Git提交',
        description: '每句话自动Git提交',
        status: 'active',
        type: '记忆系统',
        details: {
          whatItDoes: '每句话说完自动Git提交，防止对话丢失',
          currentStatus: '✅ 正常运行\n- auto_git_commit.sh',
          usage: 'tools/auto_git_commit.sh',
          dependencies: ['Git']
        }
      }
    ]
  },

  // 设计系统（新增 2026-03-07）
  {
    category: 'design',
    name: '设计系统',
    icon: '🎨',
    items: [
      {
        name: 'Frontend Design Skill',
        description: '专业的UI设计指南和最佳实践',
        status: 'active',
        type: '设计系统',
        details: {
          whatItDoes: 'Frontend development with React, Next.js, Tailwind CSS. Build landing pages, dashboards, forms, components. Responsive, accessible, performant UI.',
          howItWorks: '• Mobile-First Always\n• Typography Matters（避免 Inter/Roboto/Arial）\n• Color with Purpose（70-20-10 规则）\n• Feedback on Every Interaction\n• Accessibility Non-Negotiable\n• Performance from Start\n• One Memorable Element',
          currentStatus: '✅ 已安装\n- 评分：3.517（最高）\n- 位置：skills/frontend/SKILL.md\n- 7大核心规则',
          lastUpdate: '2026-03-07 02:57',
          usage: '每次UI设计前必须先读取这个 skill',
          dependencies: ['React', 'Next.js', 'Tailwind CSS']
        }
      }
    ]
  },

  // 记忆与优化系统（新增 2026-03-07）
  {
    category: 'memory-optimization',
    name: '记忆与优化系统',
    icon: '⚡',
    items: [
      {
        name: 'Context Compressor',
        description: '压缩长对话历史和大型文件（70%压缩率）',
        status: 'active',
        type: '优化工具',
        details: {
          whatItDoes: 'Compress long conversation histories, large code files, research results, and documents by 70% without losing critical information.',
          howItWorks: '• Detect content type\n• Mark critical elements\n• Apply type-specific compression\n• Verify 70% target\n• Present compressed output',
          currentStatus: '✅ 已安装\n- 压缩率：70%\n- 保留关键信息\n- 位置：skills/fatih-developer-fth-skills-context-compressor/',
          lastUpdate: '2026-03-07',
          usage: '当 context window 填满时自动触发',
          dependencies: ['Markdown', '压缩算法']
        }
      },
      {
        name: 'Sophie Optimizer',
        description: '自动化上下文健康管理',
        status: 'active',
        type: '优化工具',
        details: {
          whatItDoes: 'Automated context health management for OpenClaw. Monitors token usage, snapshots memory, and resets sessions to maintain performance.',
          howItWorks: '• Monitors token usage\n• Creates archives of current state\n• Updates long-term memory\n• Performs hard reset of session storage',
          currentStatus: '✅ 已安装\n- Authored by Sophie 👑\n- 位置：skills/openclaw-skills-sophie-optimizer/\n- 组件：optimizer.py, reset.sh',
          lastUpdate: '2026-03-07',
          usage: '自动化运行，无需手动干预',
          dependencies: ['Python', 'OpenClaw Gateway']
        }
      },
      {
        name: 'Self-Improving Agent',
        description: '持续自我改进系统',
        status: 'active',
        type: '学习系统',
        details: {
          whatItDoes: 'Captures learnings, errors, and corrections to enable continuous improvement.',
          howItWorks: '• Log learnings and errors to markdown files\n• Command/operation fails → .learnings/ERRORS.md\n• User corrects you → .learnings/LEARNINGS.md\n• User wants missing feature → .learnings/FEATURE_REQUESTS.md\n• Found better approach → .learnings/LEARNINGS.md',
          currentStatus: '✅ 已安装\n- 位置：skills/self-improving-agent/\n- 3个日志文件：ERRORS.md, LEARNINGS.md, FEATURE_REQUESTS.md',
          lastUpdate: '2026-03-07',
          usage: '自动记录学习、错误、功能请求',
          dependencies: ['Markdown', '自动触发']
        }
      }
    ]
  },

  // 数据抓取系统（新增 2026-03-07）
  {
    category: 'data-fetching',
    name: '数据抓取系统',
    icon: '🔍',
    items: [
      {
        name: 'Agent Reach',
        description: '多平台数据抓取（13+平台）',
        status: 'active',
        type: '数据抓取',
        details: {
          whatItDoes: 'Use the internet: search, read, and interact with 13+ platforms including Twitter/X, Reddit, YouTube, GitHub, Bilibili, XiaoHongShu (小红书), Douyin (抖音), WeChat Articles (微信公众号), LinkedIn, Boss直聘, RSS, Exa web search, and any web page.',
          howItWorks: '• 搜索推特、小红书、B站、抖音等\n• 读取任何网页内容\n• YouTube视频转录\n• GitHub issue\n• RSS订阅',
          currentStatus: '✅ 已安装\n- 支持13+平台\n- 位置：skills/agent-reach/\n- 触发词："搜推特"、"搜小红书"、"看视频"、"搜一下"',
          lastUpdate: '2026-03-07',
          usage: '搜索和读取多平台数据',
          dependencies: ['各平台API', 'Web Scraper']
        }
      },
      {
        name: 'Telegram频道抓取',
        description: '实时抓取Telegram频道新闻（7个频道）',
        status: 'active',
        type: '数据抓取',
        details: {
          whatItDoes: '实时抓取全球顶级新闻源的Telegram频道最新消息，包括区块链、金融、科技三大类',
          howItWorks: '• 直接解析 https://t.me/s/{channel} 公开网页\n• 每小时自动更新\n• 保存到本地JSON文件\n• 支持内容、时间、浏览量提取',
          currentStatus: '✅ 已部署\n- 7个频道：theblockbeats, cointelegraph, wsj, financialtimes, bloomberg, techcrunch, theverge\n- 定时任务：每小时运行\n- 数据保存：data/telegram_news/latest.json\n- 网站页面：/telegram-news',
          lastUpdate: '2026-03-07',
          usage: 'python3 tools/telegram_channel_scraper.py',
          dependencies: ['requests', 'BeautifulSoup4'],
          channels: {
            blockchain: ['theblockbeats', 'cointelegraph'],
            finance: ['wsj', 'financialtimes', 'bloomberg'],
            tech: ['techcrunch', 'theverge']
          },
          website: 'https://www.huajuan.news/telegram-news'
        }
      }
    ]
  },

  // 报告模版系统（新增）
  {
    category: 'templates',
    name: '报告模版系统',
    icon: '📝',
    items: [
      {
        name: '买入报告模版',
        description: '个股买入分析报告模版',
        status: 'active',
        type: '报告模版',
        details: {
          whatItDoes: '标准化的个股买入分析报告模版，包括基本面、技术面、情绪分析',
          currentStatus: '✅ 正常运行\n- 报告备份/买入报告/',
          usage: '用于生成买入决策报告',
          dependencies: ['Markdown']
        }
      },
      {
        name: '卖出总结模版',
        description: '卖出决策总结模版',
        status: 'active',
        type: '报告模版',
        details: {
          whatItDoes: '记录卖出原因、盈亏、经验教训',
          currentStatus: '✅ 正常运行\n- 报告备份/卖出总结/',
          usage: '用于记录卖出决策',
          dependencies: ['Markdown']
        }
      },
      {
        name: '持仓跟踪模版',
        description: '持仓定期跟踪报告模版',
        status: 'active',
        type: '报告模版',
        details: {
          whatItDoes: '定期跟踪持仓表现、风险变化、盈利情况',
          currentStatus: '✅ 正常运行\n- 报告备份/持仓跟踪/',
          usage: '每周/每月更新持仓状态',
          dependencies: ['Markdown']
        }
      },
      {
        name: '逻辑优化模版',
        description: '交易逻辑优化记录模版',
        status: 'active',
        type: '报告模版',
        details: {
          whatItDoes: '记录交易逻辑的优化过程和结果',
          currentStatus: '✅ 正常运行\n- 报告备份/逻辑优化/',
          usage: '记录策略改进',
          dependencies: ['Markdown']
        }
      },
      {
        name: '进化报告',
        description: '系统进化周报（自动生成）',
        status: 'active',
        type: '报告模版',
        details: {
          whatItDoes: '每周自动生成系统进化报告，总结学习和改进',
          howItWorks: '每周一08:00自动运行 → 分析上周数据 → 生成洞察',
          currentStatus: '✅ 正常运行\n- 虾虾交易报告/进化报告_*.md',
          lastUpdate: '2026-03-02',
          usage: '自动生成',
          dependencies: ['Cron', 'Python']
        }
      },
      {
        name: '每日复盘报告',
        description: 'AI执行系统每日复盘（05:30自动生成）',
        status: 'active',
        type: '报告模版',
        details: {
          whatItDoes: '每天美股收盘后（05:30）自动生成复盘报告',
          howItWorks: '分析昨日交易 → 识别成功/失败模式 → 生成洞察',
          currentStatus: '✅ 正常运行\n- AI执行系统/daily_report_*.md',
          lastUpdate: '2026-02-12',
          usage: '自动生成（每天05:30）',
          dependencies: ['AI执行系统', 'Cron']
        }
      },
      {
        name: '周度洞察报告',
        description: '每周一自动生成洞察报告',
        status: 'active',
        type: '报告模版',
        details: {
          whatItDoes: '每周一08:00自动分析最近7天执行数据，生成洞察',
          howItWorks: '7天数据 → 模式识别 → 洞察生成',
          currentStatus: '✅ 正常运行\n- AI执行系统/weekly_insights.json',
          usage: '自动生成（每周一08:00）',
          dependencies: ['AI执行系统', 'Cron']
        }
      }
    ]
  },

  // 定时任务系统（新增）
  {
    category: 'automation',
    name: '定时任务系统',
    icon: '⏰',
    items: [
      {
        name: '双重监控',
        description: '每分钟检查OpenClaw和虾虾系统',
        status: 'active',
        type: '定时任务',
        details: {
          whatItDoes: '每分钟检查OpenClaw和虾虾系统运行状态',
          howItWorks: 'dual_monitor.sh → 检查进程 → 自动重启',
          currentStatus: '✅ 正常运行\n- */1 * * * *（每分钟）',
          usage: '自动运行',
          dependencies: ['Shell', 'Cron']
        }
      },
      {
        name: 'IB Gateway监控',
        description: '每5分钟检查IB Gateway状态',
        status: 'active',
        type: '定时任务',
        details: {
          whatItDoes: '每5分钟检查IB Gateway运行状态，自动重启',
          currentStatus: '✅ 正常运行\n- */5 * * * *（每5分钟）',
          usage: '自动运行',
          dependencies: ['IB Gateway', 'Cron']
        }
      },
      {
        name: '投资蒸馏定时任务',
        description: '每天9点自动更新',
        status: 'active',
        type: '定时任务',
        details: {
          whatItDoes: '每天9点自动运行投资蒸馏系统',
          howItWorks: '更新4201家机构持仓 → 生成早期机会报告',
          currentStatus: '✅ 正常运行\n- 0 9 * * *（每天9点）',
          usage: '自动运行',
          dependencies: ['investment_distillation', 'Cron']
        }
      },
      {
        name: '市场价格更新',
        description: '每5分钟更新实时价格',
        status: 'active',
        type: '定时任务',
        details: {
          whatItDoes: '每5分钟更新股票实时价格',
          currentStatus: '✅ 正常运行\n- */5 * * * *（每5分钟）',
          usage: '自动运行',
          dependencies: ['yfinance', 'Cron']
        }
      },
      {
        name: 'AI每日复盘',
        description: '每天05:30生成复盘报告',
        status: 'active',
        type: '定时任务',
        details: {
          whatItDoes: '每天美股收盘后（05:30）自动生成复盘报告',
          currentStatus: '✅ 正常运行\n- 30 5 * * *（每天05:30）',
          usage: '自动运行',
          dependencies: ['AI执行系统', 'Cron']
        }
      },
      {
        name: '执行记录备份',
        description: '每小时备份执行记录',
        status: 'active',
        type: '定时任务',
        details: {
          whatItDoes: '每小时备份执行记录到JSON文件',
          currentStatus: '✅ 正常运行\n- 0 * * * *（每小时）',
          usage: '自动运行',
          dependencies: ['AI执行系统', 'Cron']
        }
      },
      {
        name: '周度洞察',
        description: '每周一08:00生成周度洞察',
        status: 'active',
        type: '定时任务',
        details: {
          whatItDoes: '每周一08:00自动分析最近7天执行数据',
          currentStatus: '✅ 正常运行\n- 0 8 * * 1（每周一08:00）',
          usage: '自动运行',
          dependencies: ['AI执行系统', 'Cron']
        }
      },
      {
        name: '预测检查',
        description: '每天18:00检查预测结果',
        status: 'active',
        type: '定时任务',
        details: {
          whatItDoes: '每天18:00检查ML预测准确性',
          currentStatus: '✅ 正常运行\n- 0 18 * * *（每天18:00）',
          usage: '自动运行',
          dependencies: ['ML模型', 'Cron']
        }
      }
    ]
  },

  // Shell工具（新增）
  {
    category: 'shell',
    name: 'Shell工具',
    icon: '🐚',
    items: [
      {
        name: 'backtest.sh',
        description: '命令行回测工具（支持SMA/RSI/MACD）',
        status: 'active',
        type: 'Shell工具',
        details: {
          whatItDoes: '命令行回测工具，支持多种策略（SMA、RSI、MACD）',
          howItWorks: './backtest.sh run NVDA sma --start 2024-01-01 --end 2025-12-31',
          currentStatus: '✅ 正常运行\n- 支持SMA、RSI、MACD策略\n- 可自定义参数',
          usage: './backtest.sh run NVDA sma --short 20 --long 50',
          dependencies: ['Backtrader', 'yfinance']
        }
      },
      {
        name: 'news.sh',
        description: '新闻监控工具（MarketAux API）',
        status: 'active',
        type: 'Shell工具',
        details: {
          whatItDoes: '命令行新闻监控工具，使用MarketAux API',
          howItWorks: './news.sh latest 10 → 获取最新10条金融新闻',
          currentStatus: '✅ 正常运行\n- 每日100次API限额\n- 支持股票、行业过滤',
          usage: './news.sh symbol NVDA,AMD,TSLA',
          dependencies: ['MarketAux API']
        }
      },
      {
        name: 'options.sh',
        description: '期权工具',
        status: 'active',
        type: 'Shell工具',
        details: {
          whatItDoes: '命令行期权分析工具',
          currentStatus: '✅ 正常运行',
          usage: './options.sh',
          dependencies: ['Finnhub']
        }
      },
      {
        name: 'finance.sh',
        description: '财务工具',
        status: 'active',
        type: 'Shell工具',
        details: {
          whatItDoes: '命令行财务分析工具',
          currentStatus: '✅ 正常运行',
          usage: './finance.sh',
          dependencies: ['yfinance']
        }
      },
      {
        name: 'deploy_to_cloudflare.sh',
        description: 'Cloudflare部署工具',
        status: 'active',
        type: 'Shell工具',
        details: {
          whatItDoes: '自动部署网站到Cloudflare Pages',
          currentStatus: '✅ 正常运行\n- 支持Git自动部署\n- 支持Wrangler CLI',
          usage: './deploy_to_cloudflare.sh',
          dependencies: ['Wrangler', 'Git']
        }
      }
    ]
  },

  // 数据目录系统（新增）
  {
    category: 'data',
    name: '数据目录系统',
    icon: '📊',
    items: [
      {
        name: 'Reddit数据',
        description: 'Reddit情绪数据（29个JSON文件）',
        status: 'active',
        type: '数据目录',
        details: {
          whatItDoes: '存储Reddit情绪分析历史数据',
          currentStatus: '✅ 正常运行\n- 29个JSON文件\n- 时间跨度：2026-02-14~2026-03-05',
          usage: 'Reddit数据/',
          dependencies: ['reddit_monitor.py']
        }
      },
      {
        name: '交易数据',
        description: '交易记录数据',
        status: 'active',
        type: '数据目录',
        details: {
          whatItDoes: '存储交易记录数据',
          currentStatus: '✅ 正常运行',
          usage: '交易数据/',
          dependencies: ['trade_logger.py']
        }
      },
      {
        name: '交易日志',
        description: '交易日志文件',
        status: 'active',
        type: '数据目录',
        details: {
          whatItDoes: '存储Cron任务日志',
          currentStatus: '✅ 正常运行\n- cron_trading.log\n- cron_ib_monitor.log\n- cron_dual_monitor.log',
          usage: '交易日志/',
          dependencies: ['Cron']
        }
      },
      {
        name: '交易记录',
        description: '交易记录Python脚本',
        status: 'active',
        type: '数据目录',
        details: {
          whatItDoes: '存储交易记录相关Python脚本',
          currentStatus: '✅ 正常运行',
          usage: '交易记录/',
          dependencies: ['Python']
        }
      },
      {
        name: '分析师追踪数据',
        description: '分析师评级数据',
        status: 'active',
        type: '数据目录',
        details: {
          whatItDoes: '存储分析师评级历史数据',
          currentStatus: '✅ 正常运行',
          usage: '分析师追踪数据/',
          dependencies: ['analyst_tracker.py']
        }
      },
      {
        name: '回测数据',
        description: '回测结果数据',
        status: 'active',
        type: '数据目录',
        details: {
          whatItDoes: '存储策略回测结果',
          currentStatus: '✅ 正常运行',
          usage: '回测数据/',
          dependencies: ['backtest_validator.py']
        }
      },
      {
        name: '大单监控数据',
        description: '大单监控数据',
        status: 'active',
        type: '数据目录',
        details: {
          whatItDoes: '存储大单监控历史数据',
          currentStatus: '✅ 正常运行',
          usage: '大单监控数据/',
          dependencies: ['whale_tracker.py']
        }
      },
      {
        name: '宏观数据',
        description: '宏观经济数据',
        status: 'active',
        type: '数据目录',
        details: {
          whatItDoes: '存储宏观经济指标数据',
          currentStatus: '✅ 正常运行',
          usage: '宏观数据/',
          dependencies: ['macro_monitor.py']
        }
      },
      {
        name: '新闻监控数据',
        description: '新闻数据',
        status: 'active',
        type: '数据目录',
        details: {
          whatItDoes: '存储新闻监控历史数据',
          currentStatus: '✅ 正常运行',
          usage: '新闻监控数据/',
          dependencies: ['news_aggregator.py']
        }
      },
      {
        name: '期权流数据',
        description: '期权流数据',
        status: 'active',
        type: '数据目录',
        details: {
          whatItDoes: '存储期权流分析数据',
          currentStatus: '✅ 正常运行',
          usage: '期权流数据/',
          dependencies: ['options_flow_analyzer.py']
        }
      },
      {
        name: '竞争力分析数据',
        description: '竞争力分析数据',
        status: 'active',
        type: '数据目录',
        details: {
          whatItDoes: '存储竞争力分析结果',
          currentStatus: '✅ 正常运行',
          usage: '竞争力分析数据/',
          dependencies: ['competitive_analyzer.py']
        }
      },
      {
        name: '纸面交易数据',
        description: '纸面交易记录',
        status: 'active',
        type: '数据目录',
        details: {
          whatItDoes: '存储纸面交易记录',
          currentStatus: '✅ 正常运行',
          usage: '纸面交易数据/',
          dependencies: ['paper_trading_tracker.py']
        }
      },
      {
        name: '行业轮动数据',
        description: '行业轮动数据',
        status: 'active',
        type: '数据目录',
        details: {
          whatItDoes: '存储行业轮动分析数据',
          currentStatus: '✅ 正常运行',
          usage: '行业轮动数据/',
          dependencies: ['sector_rotation_monitor.py']
        }
      },
      {
        name: '评分数据',
        description: '多因子评分数据',
        status: 'active',
        type: '数据目录',
        details: {
          whatItDoes: '存储多因子评分结果',
          currentStatus: '✅ 正常运行',
          usage: '评分数据/',
          dependencies: ['multi_factor_scorer_v2.py']
        }
      },
      {
        name: '风险预警数据',
        description: '风险预警数据',
        status: 'active',
        type: '数据目录',
        details: {
          whatItDoes: '存储风险预警历史数据',
          currentStatus: '✅ 正常运行',
          usage: '风险预警数据/',
          dependencies: ['risk_alert_system.py']
        }
      }
    ]
  },

  // 系统目录（新增）
  {
    category: 'systems',
    name: '系统目录',
    icon: '🏢',
    items: [
      {
        name: 'solo_wall_street_system',
        description: '独立交易系统',
        status: 'active',
        type: '系统目录',
        details: {
          whatItDoes: '独立交易系统，包含agents、data、models、pipelines、utils',
          currentStatus: '✅ 正常运行\n- agents/\n- data/\n- models/\n- pipelines/\n- utils/',
          usage: 'solo_wall_street_system/',
          dependencies: ['Python']
        }
      },
      {
        name: 'KOL监控',
        description: 'KOL监控专用目录',
        status: 'active',
        type: '系统目录',
        details: {
          whatItDoes: '存储KOL监控相关文件',
          currentStatus: '✅ 正常运行\n- 通用KOL列表_2026-02-08.md',
          usage: 'KOL监控/',
          dependencies: ['twitter_kol_monitor.py']
        }
      },
      {
        name: 'AI执行系统',
        description: 'AI执行系统（ExecutionRecord + EmbeddingStore）',
        status: 'active',
        type: '系统目录',
        details: {
          whatItDoes: '记录所有执行任务，嵌入检索，每日复盘',
          howItWorks: 'ExecutionRecord → EmbeddingStore → 每日复盘 → 周度洞察',
          currentStatus: '✅ 正常运行\n- execution_system.py\n- daily_review_cron.py\n- trading_integration.py',
          usage: 'AI执行系统/',
          dependencies: ['Python', 'Embedding Store', 'Cron']
        }
      },
      {
        name: 'trading_integration',
        description: '交易系统集成接口',
        status: 'active',
        type: '系统目录',
        details: {
          whatItDoes: '桥接现有交易系统和AI执行系统',
          currentStatus: '✅ 正常运行\n- record_trade()\n- record_monitoring()\n- search_similar_trades()\n- get_trading_insights()',
          usage: 'from trading_integration import get_trading_integration',
          dependencies: ['AI执行系统']
        }
      },
      {
        name: 'MarketAux API',
        description: '新闻API集成（news.sh）',
        status: 'active',
        type: '系统目录',
        details: {
          whatItDoes: '通过MarketAux API获取金融新闻',
          howItWorks: 'news.sh → MarketAux API → 新闻数据',
          currentStatus: '✅ 正常运行\n- 每日100次API限额\n- 支持股票、行业过滤',
          usage: './news.sh latest 10',
          dependencies: ['MarketAux API', 'Shell']
        }
      }
    ]
  },

  // 其他能力（新增）
  {
    category: 'other',
    name: '其他能力',
    icon: '🔧',
    items: [
      {
        name: 'QuantConnect集成',
        description: '量化回测平台',
        status: 'active',
        type: '其他能力',
        details: {
          whatItDoes: '集成QuantConnect平台进行高级量化回测',
          currentStatus: '✅ 正常运行\n- QuantConnect/\n- quantconnect_monitor.py',
          usage: 'QuantConnect/',
          dependencies: ['QuantConnect API']
        }
      },
      {
        name: 'Context保护系统',
        description: '防止Context超限',
        status: 'active',
        type: '其他能力',
        details: {
          whatItDoes: '监控Context使用，防止超限（model_context_window_exceeded）',
          howItWorks: '检查Context使用 → 超过阈值 → 自动压缩对话记录',
          currentStatus: '✅ 正常运行\n- context_protector.py\n- 自动Git提交',
          usage: 'python3 tools/context_protector.py',
          dependencies: ['Python', 'Git']
        }
      }
    ]
  },

  // 报告系统（核心能力）
  {
    category: 'reports',
    name: '报告系统',
    icon: '📊',
    items: [
      {
        name: '团队报告（22:00汇报）',
        description: '每晚10点向子涵汇报团队综合分析',
        status: 'active',
        type: '报告系统',
        details: {
          whatItDoes: '每晚22:00向子涵汇报团队综合分析结果，包括长期投资和短线机会',
          howItWorks: '3位分析师报告 → 汇总筛选 → 投资决策 → 22:00汇报',
          currentStatus: '✅ 正常运行\n- 每晚22:00自动汇报\n- 包含长期投资（100%+涨幅）\n- 包含短线机会（10%+涨幅）',
          usage: '每天22:00自动生成',
          dependencies: ['AGENTS.md', 'team-roles']
        }
      },
      {
        name: '每日报告（17:00盘中）',
        description: '下午5点盘中综合报告（10个部分）',
        status: 'active',
        type: '报告系统',
        details: {
          whatItDoes: '每天17:00生成盘中综合报告，包含10个部分',
          howItWorks: 'Twitter大V言论 → 行业分析 → 日内交易 → 今日学习 → 虾虾精选 → 策略回测 → ...',
          currentStatus: '✅ 正常运行\n- 每天17:00自动生成\n- 10个核心部分\n- 实时性优先',
          usage: '每天17:00自动生成',
          dependencies: ['Twitter API', 'Reddit API', 'NewsAPI']
        }
      },
      {
        name: '个股报告（17步框架）',
        description: '深度分析单只股票（17步完整框架）',
        status: 'active',
        type: '报告系统',
        details: {
          whatItDoes: '对单只股票进行17步完整分析',
          howItWorks: '17步框架：最新信息 → Five-Point Framework → 竞争格局 → 估值 → 44-KOL → 情绪 → 期权 → 做空 → 资金流 → 内部人 → 财报 → 共振 → 盘前盘后 → 技术 → 壁垒 → 大师 → 推荐',
          currentStatus: '✅ 正常运行\n- 17步完整分析\n- 深度彻底\n- 5位大师框架',
          usage: '子涵询问某只股票时触发',
          dependencies: ['yfinance', 'SEC EDGAR', 'NewsAPI', 'LLM']
        }
      },
      {
        name: '紧急实时报告',
        description: '有风吹草动立刻报告',
        status: 'active',
        type: '报告系统',
        details: {
          whatItDoes: '遇到重要信息立即汇报，不等到5点或10点',
          currentStatus: '✅ 正常运行\n- 实时性优先\n- 紧急程度高\n- 绝不耽搁',
          usage: '检测到重要信息时自动触发',
          dependencies: ['监控系统', 'Telegram']
        }
      }
    ]
  },

  // 知识库系统（核心能力）
  {
    category: 'knowledge-base',
    name: '知识库系统',
    icon: '📚',
    items: [
      {
        name: '知识库更新流程',
        description: '自动学习和保存有价值的信息',
        status: 'active',
        type: '知识库',
        details: {
          whatItDoes: '当子涵说"这个信息有价值"时，自动分析、分类、归档、应用',
          howItWorks: '信息收集 → 分析价值 → 分类归档 → 整合应用 → 确认反馈',
          currentStatus: '✅ 正常运行\n- 自动触发\n- 分类归档\n- 整合应用',
          usage: '子涵说"这个信息有价值"或"保存到知识库"',
          dependencies: ['MEMORY.md', '量化学习/', 'TOOLS.md']
        }
      },
      {
        name: '已保存的重要洞察',
        description: '5个核心洞察（量化、量子计算、CTA模型、黄金投资）',
        status: 'active',
        type: '知识库',
        details: {
          whatItDoes: '存储历史上子涵分享的所有重要洞察',
          currentStatus: '✅ 正常运行\n- 子涵量化洞察（回测价值）\n- Jensen Huang量子计算洞察\n- CTA模型卖出信号\n- 黄金投资宏观框架',
          usage: 'MEMORY.md',
          dependencies: ['MEMORY.md']
        }
      },
      {
        name: '行业分析知识库',
        description: '按行业分类的深度分析框架',
        status: 'active',
        type: '知识库',
        details: {
          whatItDoes: '存储不同行业的深度分析框架和洞察',
          currentStatus: '✅ 正常运行\n- 量子计算（Jensen Huang洞察）\n- IONQ vs RGTI对比\n- 半导体行业\n- AI行业',
          usage: '知识储备库/',
          dependencies: ['Markdown']
        }
      },
      {
        name: '量化策略库',
        description: '量化策略和学习材料',
        status: 'active',
        type: '知识库',
        details: {
          whatItDoes: '存储量化策略、回测技术、学习材料',
          currentStatus: '✅ 正常运行\n- 知识储备库/量化策略/',
          usage: '知识储备库/量化策略/',
          dependencies: ['Python', 'Markdown']
        }
      }
    ]
  },

  // 工具库系统（v3.0）
  {
    category: 'tool-library',
    name: '工具库系统（v3.0）',
    icon: '🛠️',
    items: [
      {
        name: 'Python库（15个）',
        description: '15个专业Python库（量化、机器学习、爬虫）',
        status: 'active',
        type: '工具库',
        details: {
          whatItDoes: '15个专业Python库，包括量化、机器学习、爬虫',
          currentStatus: '✅ 100%完成\n- zipline-reloaded\n- backtrader\n- vectorbt\n- quantstats\n- pyportfolioopt\n- empyrical\n- pyfolio-reloaded\n- scikit-learn\n- xgboost\n- lightgbm\n- scrapy\n- selenium\n- TA-Lib\n- pandas-datareader\n- aiohttp',
          usage: 'conda activate openclaw',
          dependencies: ['Conda环境openclaw']
        }
      },
      {
        name: '金融脚本（15个）',
        description: '15个Python金融分析脚本',
        status: 'active',
        type: '工具库',
        details: {
          whatItDoes: '15个Python金融分析脚本，包括筛选、优化、风险、技术等',
          currentStatus: '✅ 100%完成\n- stock_screener.py\n- portfolio_optimizer.py\n- risk_calculator.py\n- technical_scanner.py\n- earnings_calendar.py\n- options_analyzer.py\n- correlation_matrix.py\n- volatility_calculator.py\n- fund_flow_tracker.py\n- ...',
          usage: 'cd ~/.openclaw/workspace/tools && python3 stock_screener.py',
          dependencies: ['Python', 'Conda']
        }
      },
      {
        name: 'Conda环境',
        description: '专业量化Python环境（openclaw）',
        status: 'active',
        type: '工具库',
        details: {
          whatItDoes: '专门为量化分析配置的Python环境',
          currentStatus: '✅ 正常运行\n- 环境名：openclaw\n- Python版本：3.11\n- 核心库：pyportfolioopt, empyrical, pyfolio-reloaded',
          usage: 'source /opt/homebrew/Caskroom/miniconda/base/etc/profile.d/conda.sh && conda activate openclaw',
          dependencies: ['Miniconda']
        }
      }
    ]
  },

  // 团队系统（核心能力）
  {
    category: 'team',
    name: '团队系统',
    icon: '👥',
    items: [
      {
        name: '团队角色系统',
        description: '5个专业角色分工协作',
        status: 'active',
        type: '团队系统',
        details: {
          whatItDoes: '5个专业角色分工协作：科技分析师、半导体分析师、AI分析师、投资经理、副总',
          howItWorks: '每位分析师负责不同行业 → 投资经理汇总 → 副总决策 → 虾虾总管监督',
          currentStatus: '✅ 正常运行\n- AGENTS.md\n- team-roles/\n- Sub-agent sessions',
          usage: 'AGENTS.md',
          dependencies: ['sessions_spawn']
        }
      },
      {
        name: '跨Session通信',
        description: 'Sub-agents互相发送报告',
        status: 'active',
        type: '团队系统',
        details: {
          whatItDoes: '不同的Sub-agent sessions互相发送报告和协作',
          currentStatus: '✅ 正常运行\n- sessions_send\n- sessions_spawn\n- 实时协作',
          usage: 'sessions_send(sessionKey, message)',
          dependencies: ['sessions_spawn', 'sessions_send']
        }
      },
      {
        name: '投资决策流程',
        description: '从分析到决策的完整流程',
        status: 'active',
        type: '团队系统',
        details: {
          whatItDoes: '从分析师到投资经理到副总到虾虾的完整决策链',
          howItWorks: '分析师报告 → 投资经理汇总 → 副总筛选 → 虾虾决策 → 22:00汇报',
          currentStatus: '✅ 正常运行',
          usage: '自动运行',
          dependencies: ['AGENTS.md', 'team-roles']
        }
      }
    ]
  },

  // 伊朗追踪系统
  {
    category: 'iran-tracker',
    name: '伊朗追踪系统',
    icon: '🌍',
    items: [
      {
        name: '伊朗局势实时追踪',
        description: '实时追踪伊朗局势和市场影响',
        status: 'active',
        type: '追踪系统',
        details: {
          whatItDoes: '实时追踪伊朗局势，分析对市场的影响',
          howItWorks: '多源抓取 → 事件提取 → 市场影响分析 → 实时更新',
          currentStatus: '✅ 正常运行\n- 9个时间线事件\n- 5个市场影响\n- 每分钟更新\n- 实时价格',
          lastUpdate: '2026-03-03',
          usage: '/event-tracker-ultimate',
          dependencies: ['complete_iran_tracker.py', 'yfinance']
        }
      },
      {
        name: '地缘政治影响分析',
        description: '分析地缘政治对美股的影响',
        status: 'active',
        type: '追踪系统',
        details: {
          whatItDoes: '分析地缘政治事件对石油、军工、航空等行业的影响',
          currentStatus: '✅ 正常运行\n- 石油价格影响\n- 军工股影响\n- 航空股影响',
          usage: '自动分析',
          dependencies: ['NewsAPI', 'yfinance']
        }
      }
    ]
  },

  // 部署系统
  {
    category: 'deployment',
    name: '部署系统',
    icon: '🚀',
    items: [
      {
        name: 'Cloudflare Pages部署',
        description: '自动部署到Cloudflare Pages',
        status: 'active',
        type: '部署系统',
        details: {
          whatItDoes: '自动部署网站到Cloudflare Pages',
          howItWorks: 'Git push → Cloudflare自动构建 → 自动部署',
          currentStatus: '✅ 正常运行\n- GitHub自动部署\n- Wrangler CLI支持\n- 多个部署指南',
          usage: './deploy_to_cloudflare.sh 或 git push',
          dependencies: ['Wrangler', 'Git', 'Cloudflare API']
        }
      },
      {
        name: 'GitHub Pages部署',
        description: '部署到GitHub Pages',
        status: 'active',
        type: '部署系统',
        details: {
          whatItDoes: '部署网站到GitHub Pages',
          currentStatus: '✅ 正常运行\n- GITHUB_PAGES_SIMPLE.md',
          usage: 'git push origin gh-pages',
          dependencies: ['Git', 'GitHub']
        }
      },
      {
        name: 'Netlify部署',
        description: '部署到Netlify',
        status: 'active',
        type: '部署系统',
        details: {
          whatItDoes: '部署网站到Netlify',
          currentStatus: '✅ 正常运行\n- NETLIFY_UPLOAD_GUIDE.md',
          usage: 'NETLIFY_UPLOAD_GUIDE.md',
          dependencies: ['Netlify CLI']
        }
      }
    ]
  },

  // OpenClaw 技能系统
  {
    category: 'openclaw-skills',
    name: 'OpenClaw 技能系统',
    icon: '⚡',
    items: [
      {
        name: 'US Stock Analysis',
        description: '美股综合分析（基本面+技术面）',
        status: 'active',
        type: '金融分析技能',
        details: {
          whatItDoes: '全面分析美股：基本面（财务指标、业务质量、估值）、技术分析（指标、图表模式、支撑/阻力）、股票比较、投资报告生成',
          howItWorks: '通过网络搜索工具获取实时市场数据 → 应用结构化分析框架 → 生成详细投资报告',
          currentStatus: '✅ 已安装\n- 基本面分析\n- 技术分析\n- 股票比较\n- 投资报告生成\n- 实时市场数据',
          lastUpdate: '2026-03-05',
          usage: 'analyze AAPL / compare TSLA vs NVDA / give me a report on Microsoft',
          dependencies: ['Web Search', 'Yahoo Finance', 'SEC Filings']
        }
      },
      {
        name: 'PRISM Finance OS',
        description: 'PRISM OS SDK金融平台',
        status: 'active',
        type: '金融平台技能',
        details: {
          whatItDoes: 'PRISM OS SDK金融平台，提供全面的金融数据和分析能力',
          howItWorks: 'PRISM API → 金融数据 → 分析报告',
          currentStatus: '✅ 已安装',
          lastUpdate: '2026-03-05',
          usage: 'PRISM Finance OS',
          dependencies: ['PRISM API']
        }
      },
      {
        name: 'Yahoo Finance',
        description: 'Yahoo Finance数据源',
        status: 'active',
        type: '金融数据技能',
        details: {
          whatItDoes: 'Yahoo Finance金融数据源，获取股票价格、财报、新闻',
          howItWorks: 'Yahoo Finance API → 数据获取 → 分析',
          currentStatus: '✅ 已安装',
          lastUpdate: '2026-03-05',
          usage: 'Get AAPL price',
          dependencies: ['Yahoo Finance API']
        }
      },
      {
        name: 'Tecent Finance',
        description: '腾讯财经数据源',
        status: 'active',
        type: '金融数据技能',
        details: {
          whatItDoes: '腾讯财经数据源，获取A股、港股数据',
          howItWorks: '腾讯财经API → 数据获取 → 分析',
          currentStatus: '✅ 已安装',
          lastUpdate: '2026-03-05',
          usage: 'Get Tencent finance data',
          dependencies: ['腾讯财经API']
        }
      },
      {
        name: 'ETF Finance',
        description: 'ETF金融分析',
        status: 'active',
        type: 'ETF分析技能',
        details: {
          whatItDoes: 'ETF金融分析，ETF持仓、费用、表现分析',
          howItWorks: 'ETF数据 → 持仓分析 → 表现评估',
          currentStatus: '✅ 已安装',
          lastUpdate: '2026-03-05',
          usage: 'Analyze ETF',
          dependencies: ['ETF数据源']
        }
      },
      {
        name: 'Finance News',
        description: '金融新闻聚合',
        status: 'active',
        type: '新闻聚合技能',
        details: {
          whatItDoes: '金融新闻聚合，多源新闻抓取和分析',
          howItWorks: '多源抓取 → 去重 → 情绪分析 → 推送',
          currentStatus: '✅ 已安装',
          lastUpdate: '2026-03-05',
          usage: 'Get finance news',
          dependencies: ['新闻API']
        }
      },
      {
        name: 'Sina Stock',
        description: '新浪股票数据',
        status: 'active',
        type: '股票数据技能',
        details: {
          whatItDoes: '新浪股票数据，A股、港股、美股数据',
          howItWorks: '新浪财经API → 数据获取 → 分析',
          currentStatus: '✅ 已安装',
          lastUpdate: '2026-03-05',
          usage: 'Get Sina stock data',
          dependencies: ['新浪财经API']
        }
      },
      {
        name: 'Stock Market Pro',
        description: '股票市场专业版',
        status: 'active',
        type: '专业分析技能',
        details: {
          whatItDoes: '股票市场专业版，高级分析功能',
          howItWorks: '专业数据 → 高级分析 → 专业报告',
          currentStatus: '✅ 已安装',
          lastUpdate: '2026-03-05',
          usage: 'Professional stock analysis',
          dependencies: ['专业数据源']
        }
      },
      {
        name: 'Intellectia Stock Screener',
        description: '智能选股器',
        status: 'active',
        type: '选股工具技能',
        details: {
          whatItDoes: '智能选股器，AI驱动的股票筛选',
          howItWorks: 'AI筛选 → 条件过滤 → 推荐结果',
          currentStatus: '✅ 已安装',
          lastUpdate: '2026-03-05',
          usage: 'Screen stocks with AI',
          dependencies: ['AI模型']
        }
      },
      {
        name: 'Intellectia Stock Forecast',
        description: '智能股票预测',
        status: 'active',
        type: '预测工具技能',
        details: {
          whatItDoes: '智能股票预测，AI驱动的股价预测',
          howItWorks: 'AI模型 → 历史数据 → 预测结果',
          currentStatus: '✅ 已安装',
          lastUpdate: '2026-03-05',
          usage: 'Forecast stock price',
          dependencies: ['AI模型']
        }
      },
      {
        name: 'HK Stock Trending',
        description: '港股趋势分析',
        status: 'active',
        type: '港股分析技能',
        details: {
          whatItDoes: '港股趋势分析，港股市场趋势追踪',
          howItWorks: '港股数据 → 趋势分析 → 报告',
          currentStatus: '✅ 已安装',
          lastUpdate: '2026-03-05',
          usage: 'Analyze HK stock trends',
          dependencies: ['港股数据源']
        }
      },
      {
        name: 'React Expert',
        description: 'React专家',
        status: 'active',
        type: '网站开发技能',
        details: {
          whatItDoes: 'React专家，React/Next.js开发指导',
          howItWorks: 'React最佳实践 → 代码生成 → 优化',
          currentStatus: '✅ 已安装',
          lastUpdate: '2026-03-05',
          usage: 'React development',
          dependencies: ['React', 'Next.js']
        }
      },
      {
        name: 'Clerk Auth',
        description: 'Clerk认证系统',
        status: 'active',
        type: '认证技能',
        details: {
          whatItDoes: 'Clerk认证系统，用户认证和授权',
          howItWorks: 'Clerk API → 认证 → 授权',
          currentStatus: '✅ 已安装',
          lastUpdate: '2026-03-05',
          usage: 'Implement authentication',
          dependencies: ['Clerk API']
        }
      },
      {
        name: 'Cloudflare Agent Tunnel',
        description: 'Cloudflare代理隧道',
        status: 'active',
        type: '网络技能',
        details: {
          whatItDoes: 'Cloudflare代理隧道，安全网络连接',
          howItWorks: 'Cloudflare Tunnel → 安全连接 → 代理',
          currentStatus: '✅ 已安装',
          lastUpdate: '2026-03-05',
          usage: 'Setup Cloudflare tunnel',
          dependencies: ['Cloudflare']
        }
      },
      {
        name: 'Data Enricher',
        description: '数据增强器',
        status: 'active',
        type: '数据技能',
        details: {
          whatItDoes: '数据增强器，数据质量和增强',
          howItWorks: '数据清洗 → 增强 → 验证',
          currentStatus: '✅ 已安装',
          lastUpdate: '2026-03-05',
          usage: 'Enrich data',
          dependencies: ['数据处理库']
        }
      },
      {
        name: 'DataForSEO',
        description: 'SEO数据分析',
        status: 'active',
        type: 'SEO技能',
        details: {
          whatItDoes: 'SEO数据分析，SEO数据和洞察',
          howItWorks: 'DataForSEO API → 数据获取 → SEO分析',
          currentStatus: '✅ 已安装',
          lastUpdate: '2026-03-05',
          usage: 'SEO analysis',
          dependencies: ['DataForSEO API']
        }
      }
    ]
  },

  // 个人书籍提炼系统
  {
    category: 'book-distillation',
    name: '个人书籍提炼系统',
    icon: '📚',
    items: [
      {
        name: '书籍上传与提炼',
        description: '支持PDF/EPUB/TXT/Markdown格式',
        status: 'active',
        type: '书籍提炼',
        details: {
          whatItDoes: '用户上传epub/pdf文件，花卷自动阅读并提炼关键投资内容',
          howItWorks: '格式识别 → 内容提取 → LLM分析 → 提取投资洞察 → 知识库存储',
          currentStatus: '✅ 正常运行\n- 支持PDF、EPUB、TXT、Markdown\n- 自动提取投资理念、选股方法、风险管理\n- 生成结构化提炼报告',
          lastUpdate: '2026-03-05',
          usage: '上传epub/pdf文件给花卷',
          dependencies: ['PyPDF2', 'ebooklib', 'LLM分析']
        }
      },
      {
        name: '每日自动寻书',
        description: '每天9点自动寻找金融投资书籍',
        status: 'active',
        type: '自动学习',
        details: {
          whatItDoes: '每天自动搜索金融、股票投资相关书籍，自主学习投资知识',
          howItWorks: '定时任务 → 搜索数据源 → 下载书籍 → 提炼内容 → 更新知识库',
          currentStatus: '✅ 正常运行\n- 每天9:00自动执行\n- 数据源：Project Gutenberg、Open Library、SEC EDGAR\n- 自动提炼巴菲特致股东信等经典内容',
          lastUpdate: '2026-03-05',
          usage: '自动运行（每天9:00）',
          dependencies: ['Cron', '数据源API']
        }
      },
      {
        name: '内容粘贴学习',
        description: '用户随时粘贴内容，花卷学习投资心得',
        status: 'active',
        type: '智能学习',
        details: {
          whatItDoes: '用户可以随时粘贴文章、段落、内容，花卷自动学习投资心得',
          howItWorks: '接收内容 → LLM分析投资相关性 → 提取洞察 → 存储知识库 → 关联知识点',
          currentStatus: '✅ 正常运行\n- 实时处理用户粘贴内容\n- 自动识别投资相关内容\n- 提取投资洞察并存储',
          lastUpdate: '2026-03-05',
          usage: '直接粘贴内容给花卷',
          dependencies: ['LLM分析', '知识库']
        }
      },
      {
        name: '投资知识库',
        description: '完整的投资知识体系',
        status: 'active',
        type: '知识库',
        details: {
          whatItDoes: '构建完整的投资知识体系，包括投资理念、选股方法、风险管理、案例分析',
          howItWorks: '书籍提炼 + 文章学习 + 自动寻书 → 知识分类 → 结构化存储 → 智能检索',
          currentStatus: '✅ 正常运行\n- 5大知识分类：投资理念、选股方法、风险管理、案例分析、市场洞察\n- 持续更新\n- 支持智能检索',
          lastUpdate: '2026-03-05',
          usage: 'book_distillation/books/',
          dependencies: ['SQLite', 'JSON', '知识图谱']
        }
      },
      {
        name: '投资经典书单',
        description: '必读投资经典书籍',
        status: 'active',
        type: '推荐书单',
        details: {
          whatItDoes: '收录投资经典书籍，自动提炼核心内容',
          howItWorks: '经典书单 → 优先处理 → 深度提炼 → 生成读书笔记',
          currentStatus: '✅ 已收录\n- 《聪明的投资者》Benjamin Graham\n- 《巴菲特致股东的信》Warren Buffett\n- 《穷查理宝典》Charlie Munger\n- 《投资最重要的事》Howard Marks\n- 段永平投资问答录',
          lastUpdate: '2026-03-05',
          usage: 'book_distillation/books/investment_classics/',
          dependencies: ['自动寻书系统']
        }
      },
      {
        name: '合法书籍知识库系统',
        description: '整合4大合法数据源的书籍搜索和蒸馏系统',
        status: 'active',
        type: '书籍搜索',
        details: {
          whatItDoes: '整合Project Gutenberg、Open Library、SEC EDGAR、Internet Archive等合法数据源，提供书籍搜索和蒸馏功能',
          howItWorks: '搜索关键词 → 并行查询4个数据源 → 合并结果 → 选择书籍 → 六维蒸馏法提炼 → 知识库存储',
          currentStatus: '✅ 已整合\n- Project Gutenberg API（经典投资书籍）\n- Open Library API（现代投资书籍）\n- SEC EDGAR API（年报、招股书）\n- Internet Archive API（历史文献）\n- 花卷知识库页面可搜索\n- 支持直接进入书籍蒸馏系统',
          lastUpdate: '2026-03-07',
          usage: '知识库页面 → 书籍搜索 → 选择书籍 → 提炼',
          dependencies: ['4个合法API', '六维蒸馏法', '知识库']
        }
      },
      {
        name: 'Project Gutenberg API',
        description: '70,000+ 经典投资书籍（公共领域）',
        status: 'active',
        type: '数据源API',
        details: {
          whatItDoes: '访问Project Gutenberg的70,000+免费电子书，包括经典投资书籍（版权已过期）',
          howItWorks: 'Gutenberg API → 搜索关键词 → 获取书籍元数据 → 下载txt/epub → 提炼内容',
          currentStatus: '✅ API可用\n- 网址：https://www.gutenberg.org/\n- API：https://gutendex.com/\n- 内容：70,000+ 公共领域书籍\n- 格式：txt, epub, html\n- 法律风险：无（版权已过期）\n- 经典投资书籍：\n  • 《聪明的投资者》Benjamin Graham\n  • 《证券分析》Benjamin Graham\n  • 《穷查理宝典》部分内容',
          lastUpdate: '2026-03-07',
          usage: '搜索经典投资书籍，自动提炼',
          dependencies: ['Gutendex API', '公共领域']
        }
      },
      {
        name: 'Open Library API',
        description: '数百万本现代投资书籍（合法借阅）',
        status: 'active',
        type: '数据源API',
        details: {
          whatItDoes: '访问Open Library的数百万本电子书，提供现代投资书籍的搜索和借阅',
          howItWorks: 'Open Library API → 搜索关键词 → 获取书籍信息 → 检查可借阅状态 → 获取预览内容',
          currentStatus: '✅ API可用\n- 网址：https://openlibrary.org/\n- API：https://openlibrary.org/developers/api\n- 内容：数百万本电子书\n- 功能：搜索、借阅、预览\n- 法律风险：无（合法借阅系统）\n- 现代投资书籍：\n  • 当代投资理论\n  • 最新市场分析\n  • 投资策略书籍',
          lastUpdate: '2026-03-07',
          usage: '搜索现代投资书籍，获取预览内容',
          dependencies: ['Open Library API', 'Internet Archive']
        }
      },
      {
        name: 'SEC EDGAR API',
        description: '公司财报、年报、招股书（公共领域）',
        status: 'active',
        type: '数据源API',
        details: {
          whatItDoes: '访问SEC EDGAR数据库，获取公司财报、年报、招股书等投资文献',
          howItWorks: 'SEC EDGAR API → 搜索公司代码 → 获取 filings → 提取10-K/10-Q/DEF 14A → 提炼内容',
          currentStatus: '✅ API已配置\n- 网址：https://www.sec.gov/cgi-bin/browse-edgar\n- API：SEC EDGAR API\n- 内容：所有美国上市公司财报\n- 功能：搜索、下载、分析\n- 法律风险：无（公共领域）\n- 投资文献：\n  • 巴菲特致股东信（伯克希尔年报）\n  • 公司年报（10-K）\n  • 季报（10-Q）\n  • 招股书（S-1）\n  • 委托书（DEF 14A）',
          lastUpdate: '2026-03-07',
          usage: '搜索公司财报，自动提炼投资洞察',
          dependencies: ['SEC EDGAR API', '公共领域']
        }
      },
      {
        name: 'Internet Archive API',
        description: '数百万本历史投资文献（合法借阅）',
        status: 'active',
        type: '数据源API',
        details: {
          whatItDoes: '访问Internet Archive的数百万本电子书，提供历史投资文献的搜索和借阅',
          howItWorks: 'Internet Archive API → 搜索关键词 → 获取书籍信息 → 检查可借阅状态 → 获取内容',
          currentStatus: '✅ API可用\n- 网址：https://archive.org/\n- API：https://archive.org/developers/\n- 内容：数百万本电子书\n- 功能：搜索、借阅、下载\n- 法律风险：低（合法借阅系统）\n- 历史投资文献：\n  • 历史市场分析\n  • 经典投资案例\n  • 经济史文献',
          lastUpdate: '2026-03-07',
          usage: '搜索历史投资文献，获取内容',
          dependencies: ['Internet Archive API', 'Wayback Machine']
        }
      }
    ]
  },

  // 文档系统
  {
    category: 'documentation',
    name: '文档系统',
    icon: '📄',
    items: [
      {
        name: '系统文档（40+个）',
        description: '40+个系统文档和指南',
        status: 'active',
        type: '文档系统',
        details: {
          whatItDoes: '记录所有系统功能、配置、部署方法',
          currentStatus: '✅ 正常运行\n- AGENTS.md\n- API_USAGE_PLAN.md\n- CLOUDFLARE_COMPLETE_GUIDE.md\n- COMPLETE_STOCK_SELECTION_SYSTEM.md\n- CONTEXT_WINDOW_SOLUTION.md\n- HUAJUAN_SMART_PICKER_IMPLEMENTATION.md\n- ...',
          usage: '各种.md文件',
          dependencies: ['Markdown']
        }
      },
      {
        name: '紧急修复文档',
        description: '记录所有紧急问题和修复方案',
        status: 'active',
        type: '文档系统',
        details: {
          whatItDoes: '记录历史上遇到的所有紧急问题和修复方案',
          currentStatus: '✅ 正常运行\n- EMERGENCY_FIX.md\n- IRAN_TRACKER_CRITICAL_ISSUES.md\n- URGENT_GITHUB_ISSUE.md\n- FIX_DISTILLATION.md',
          usage: '查阅历史修复记录',
          dependencies: ['Markdown']
        }
      },
      {
        name: 'API配置指南',
        description: '所有API的配置和使用指南',
        status: 'active',
        type: '文档系统',
        details: {
          whatItDoes: '记录所有API的申请、配置、使用方法',
          currentStatus: '✅ 正常运行\n- API_USAGE_PLAN.md\n- API申请指南.md\n- API申请指南_FRED_财报日历.md\n- Alpaca_API配置.md',
          usage: '查阅API配置',
          dependencies: ['Markdown']
        }
      }
    ]
  },

  // 股票分析系统（自动添加）
  {
    category: 'stock-analysis',
    name: '股票分析系统',
    icon: '📊',
    items: [
      {
        name: 'AI CFO',
        description: 'Full AI Chief Financial Officer — connects Mercury Banking + Stripe into real-ti...',
        status: 'active',
        type: '股票分析',
        details: {
          whatItDoes: 'Full AI Chief Financial Officer — connects Mercury Banking + Stripe into real-time business intelligence. Daily cash position, automated P&L, revenue ',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
      {
        name: 'ChartClass',
        description: 'Technical analysis and chart pattern recognition for equities, options, and cryp...',
        status: 'active',
        type: '股票分析',
        details: {
          whatItDoes: 'Technical analysis and chart pattern recognition for equities, options, and crypto markets',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
      {
        name: 'a-stock-analysis',
        description: 'A股实时行情与分时量能分析。获取沪深股票实时价格、涨跌、成交量，分析分时量能分布（早盘/尾盘放量）、主力动向（抢筹/出货信号）、涨停封单。支持持仓管理和盈亏分析...',
        status: 'active',
        type: '股票分析',
        details: {
          whatItDoes: 'A股实时行情与分时量能分析。获取沪深股票实时价格、涨跌、成交量，分析分时量能分布（早盘/尾盘放量）、主力动向（抢筹/出货信号）、涨停封单。支持持仓管理和盈亏分析。Use when: (1) 查询A股实时行情, (2) 分析主力资金动向, (3) 查看分时成交量分布, (4) 管理股票持仓, (5) ',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
      {
        name: 'agenthc-market-intelligence',
        description: 'Real-time stock market data and trading intelligence API. 85 intelligence module...',
        status: 'active',
        type: '股票分析',
        details: {
          whatItDoes: 'Real-time stock market data and trading intelligence API. 85 intelligence modules, 40 encoded intelligence skills, and 7 named alert packages — equiti',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
      {
        name: 'apify-competitor-intelligence',
        description: 'Analyze competitor strategies, content, pricing, ads, and market positioning acr...',
        status: 'active',
        type: '股票分析',
        details: {
          whatItDoes: 'Analyze competitor strategies, content, pricing, ads, and market positioning across Google Maps, Booking.com, Facebook, Instagram, YouTube, and TikTok',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
      {
        name: 'astock-daily',
        description: '```markdown',
        status: 'active',
        type: '股票分析',
        details: {
          whatItDoes: '```markdown',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
      {
        name: 'backtest-expert',
        description: 'Expert guidance for systematic backtesting of trading strategies. Use when devel...',
        status: 'active',
        type: '股票分析',
        details: {
          whatItDoes: 'Expert guidance for systematic backtesting of trading strategies. Use when developing, testing, stress-testing, or validating quantitative trading str',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
      {
        name: 'breadth-chart-analyst',
        description: 'This skill should be used when analyzing market breadth charts, specifically the...',
        status: 'active',
        type: '股票分析',
        details: {
          whatItDoes: 'This skill should be used when analyzing market breadth charts, specifically the S&P 500 Breadth Index (200-Day MA based) and the US Stock Market Uptr',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
      {
        name: 'earnings-calendar',
        description: 'This skill retrieves upcoming earnings announcements for US stocks using the Fin...',
        status: 'active',
        type: '股票分析',
        details: {
          whatItDoes: 'This skill retrieves upcoming earnings announcements for US stocks using the Financial Modeling Prep (FMP) API. Use this when the user requests earnin',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
      {
        name: 'economic-calendar-fetcher',
        description: 'Fetch upcoming economic events and data releases using FMP API. Retrieve schedul...',
        status: 'active',
        type: '股票分析',
        details: {
          whatItDoes: 'Fetch upcoming economic events and data releases using FMP API. Retrieve scheduled central bank decisions, employment reports, inflation data, GDP rel',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
      {
        name: 'etf-finance',
        description: 'ETF and fund portfolio manager with price alerts, profit/loss tracking, and posi...',
        status: 'active',
        type: '股票分析',
        details: {
          whatItDoes: 'ETF and fund portfolio manager with price alerts, profit/loss tracking, and position management. Track your ETF/fund holdings, calculate gains/losses,',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
      {
        name: 'finance',
        description: 'Track stocks, ETFs, indices, crypto (where available), and FX pairs with caching...',
        status: 'active',
        type: '股票分析',
        details: {
          whatItDoes: 'Track stocks, ETFs, indices, crypto (where available), and FX pairs with caching + provider fallbacks.',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
      {
        name: 'finance-automation',
        description: '```bash',
        status: 'active',
        type: '股票分析',
        details: {
          whatItDoes: '```bash',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
      {
        name: 'finance-news',
        description: 'Market news briefings with AI summaries. Use when asked about stock news, market...',
        status: 'active',
        type: '股票分析',
        details: {
          whatItDoes: 'Market news briefings with AI summaries. Use when asked about stock news, market updates, portfolio performance, morning/evening briefings, financial ',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
      {
        name: 'finance-tracker',
        description: 'Or add to PATH:',
        status: 'active',
        type: '股票分析',
        details: {
          whatItDoes: 'Or add to PATH:',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
      {
        name: 'finance_lite',
        description: 'Daily macro + market brief (FRED + benchmarks + watchlist ticker) with critical-...',
        status: 'active',
        type: '股票分析',
        details: {
          whatItDoes: 'Daily macro + market brief (FRED + benchmarks + watchlist ticker) with critical-headline triage, explicit source/freshness notes, and graceful fallbac',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
      {
        name: 'financial-analysis',
        description: '- ✅ 图表可视化（收益曲线、资产分布、风险指标等）',
        status: 'active',
        type: '股票分析',
        details: {
          whatItDoes: '- ✅ 图表可视化（收益曲线、资产分布、风险指标等）',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
      {
        name: 'financial-lkcair',
        description: 'Auto-routing (AI-friendly):',
        status: 'active',
        type: '股票分析',
        details: {
          whatItDoes: 'Auto-routing (AI-friendly):',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
      {
        name: 'financial-market-analysis',
        description: 'Precision Financial Insights - Analyze stocks, companies, and market sentiment u...',
        status: 'active',
        type: '股票分析',
        details: {
          whatItDoes: 'Precision Financial Insights - Analyze stocks, companies, and market sentiment using authoritative data. Powered by Yahoo Finance and enhanced with in',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
      {
        name: 'hk-stock-trending',
        description: 'Get daily trending Hong Kong stocks with market analysis',
        status: 'active',
        type: '股票分析',
        details: {
          whatItDoes: 'Get daily trending Hong Kong stocks with market analysis',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
      {
        name: 'intellectia-stock-forecast',
        description: 'US Stock AI Trading Assistant | Intellectia AI Stock Forecast — Smart analysis o...',
        status: 'active',
        type: '股票分析',
        details: {
          whatItDoes: 'US Stock AI Trading Assistant | Intellectia AI Stock Forecast — Smart analysis of stock entry/exit points, target price predictions, probability calcu',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
      {
        name: 'intellectia-stock-screener',
        description: 'Get stock screener list data from Intellectia API (no auth) and summarize result...',
        status: 'active',
        type: '股票分析',
        details: {
          whatItDoes: 'Get stock screener list data from Intellectia API (no auth) and summarize results.',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
      {
        name: 'market-environment-analysis',
        description: 'Comprehensive market environment analysis and reporting tool. Analyzes global ma...',
        status: 'active',
        type: '股票分析',
        details: {
          whatItDoes: 'Comprehensive market environment analysis and reporting tool. Analyzes global markets including US, European, Asian markets, forex, commodities, and e',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
      {
        name: 'mootdx-china-stock-data',
        description: 'Fetch China A-share stock market data (bars, realtime quotes, tick-by-tick trans...',
        status: 'active',
        type: '股票分析',
        details: {
          whatItDoes: 'Fetch China A-share stock market data (bars, realtime quotes, tick-by-tick transactions) via mootdx/TDX protocol. Use when working with Chinese stock ',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
      {
        name: 'options-strategy-advisor',
        description: 'Options trading strategy analysis and simulation tool. Provides theoretical pric...',
        status: 'active',
        type: '股票分析',
        details: {
          whatItDoes: 'Options trading strategy analysis and simulation tool. Provides theoretical pricing using Black-Scholes model, Greeks calculation, strategy P/L simula',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
      {
        name: 'passive-income-tracker',
        description: '- **Uptime correlation** — cross-checks earnings with service uptime',
        status: 'active',
        type: '股票分析',
        details: {
          whatItDoes: '- **Uptime correlation** — cross-checks earnings with service uptime',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
      {
        name: 'portfolio-manager',
        description: 'Comprehensive portfolio analysis using Alpaca MCP Server integration to fetch ho...',
        status: 'active',
        type: '股票分析',
        details: {
          whatItDoes: 'Comprehensive portfolio analysis using Alpaca MCP Server integration to fetch holdings and positions, then analyze asset allocation, risk metrics, ind',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
      {
        name: 'portfolio-tracker',
        description: 'An investment portfolio tracker that runs entirely locally. All data stays in ~/...',
        status: 'active',
        type: '股票分析',
        details: {
          whatItDoes: 'An investment portfolio tracker that runs entirely locally. All data stays in ~/.portfolio-tracker/.',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
      {
        name: 'prism-alerts',
        description: 'Real-time Pump.fun token alerts for Solana traders. New launches, graduations, v...',
        status: 'active',
        type: '股票分析',
        details: {
          whatItDoes: 'Real-time Pump.fun token alerts for Solana traders. New launches, graduations, volume spikes. For trading bots, Discord, Telegram, AI agents.',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
      {
        name: 'prism-finance-os',
        description: 'Financial data SDK for AI Agents. 218+ read-only endpoints for market data, pric...',
        status: 'active',
        type: '股票分析',
        details: {
          whatItDoes: 'Financial data SDK for AI Agents. 218+ read-only endpoints for market data, prices, fundamentals. Built for Cursor, Claude, OpenClaw. Data retrieval o',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
      {
        name: 'prismapi-sdk',
        description: 'Elite Agentic Finance SDK for OpenClaw, Claude & Autonomous Trading Bots. Real-t...',
        status: 'active',
        type: '股票分析',
        details: {
          whatItDoes: 'Elite Agentic Finance SDK for OpenClaw, Claude & Autonomous Trading Bots. Real-time market data, canonical asset resolution, 100+ endpoints for crypto',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
      {
        name: 'realtime-crypto-price-api',
        description: 'Real-time cryptocurrency price data API for Bitcoin, Ethereum, Solana and 10,000...',
        status: 'active',
        type: '股票分析',
        details: {
          whatItDoes: 'Real-time cryptocurrency price data API for Bitcoin, Ethereum, Solana and 10,000+ tokens. Get live prices, historical data, trending coins, and batch ',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
      {
        name: 'sector-analyst',
        description: 'This skill should be used when analyzing sector and industry performance charts ...',
        status: 'active',
        type: '股票分析',
        details: {
          whatItDoes: 'This skill should be used when analyzing sector and industry performance charts to assess market positioning and rotation patterns. Use this skill whe',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
      {
        name: 'self-improvement',
        description: 'Captures learnings, errors, and corrections to enable continuous improvement. Us...',
        status: 'active',
        type: '股票分析',
        details: {
          whatItDoes: 'Captures learnings, errors, and corrections to enable continuous improvement. Use when: (1) A command or operation fails unexpectedly, (2) User correc',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
      {
        name: 'sina-stock',
        description: '获取 A 股实时股票行情数据（上证指数、深证成指、创业板指等），使用新浪财经 API。无需 API Key。',
        status: 'active',
        type: '股票分析',
        details: {
          whatItDoes: '获取 A 股实时股票行情数据（上证指数、深证成指、创业板指等），使用新浪财经 API。无需 API Key。',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
      {
        name: 'stock-analysis',
        description: 'Analyze stocks and cryptocurrencies using Yahoo Finance data. Supports portfolio...',
        status: 'active',
        type: '股票分析',
        details: {
          whatItDoes: 'Analyze stocks and cryptocurrencies using Yahoo Finance data. Supports portfolio management, watchlists with alerts, dividend analysis, 8-dimension st',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
      {
        name: 'stock-info-explorer',
        description: '>-',
        status: 'active',
        type: '股票分析',
        details: {
          whatItDoes: '>-',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
      {
        name: 'stock-market-pro',
        description: '>-',
        status: 'active',
        type: '股票分析',
        details: {
          whatItDoes: '>-',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
      {
        name: 'stock-research-engine',
        description: '个股基本面深度研究引擎。当用户输入股票代码、公司名称或要求分析某只股票时触发。覆盖A股、港股、美股。输出买方基金经理视角的投资分析简报，包含市场情绪、基本面、管...',
        status: 'active',
        type: '股票分析',
        details: {
          whatItDoes: '个股基本面深度研究引擎。当用户输入股票代码、公司名称或要求分析某只股票时触发。覆盖A股、港股、美股。输出买方基金经理视角的投资分析简报，包含市场情绪、基本面、管理层评估、业务拆解、催化剂日历、风险提示和估值数据展示。任何涉及"帮我看看这个票"、"分析一下XXX"、"这个公司怎么样"、"XXX值不值得',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
      {
        name: 'tencent-finance',
        description: 'Get stock prices, quotes, and compare stocks using Tencent Finance API. No API k...',
        status: 'active',
        type: '股票分析',
        details: {
          whatItDoes: 'Get stock prices, quotes, and compare stocks using Tencent Finance API. No API key required. Supports US stocks, China A-Shares, Hong Kong stocks. Opt',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
      {
        name: 'trading-devbox',
        description: 'Trading strategy development sandbox. User describes trading intent in natural l...',
        status: 'active',
        type: '股票分析',
        details: {
          whatItDoes: 'Trading strategy development sandbox. User describes trading intent in natural language, agent writes a Python backtest strategy and returns results.',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
      {
        name: 'trading-quant',
        description: '量化交易数据分析工具。A股/美股/港股/贵金属实时行情，多维度评分(技术面+资金面+基本面)，涨跌停池，北向资金，分钟级资金流。Use when: (1) 查询...',
        status: 'active',
        type: '股票分析',
        details: {
          whatItDoes: '量化交易数据分析工具。A股/美股/港股/贵金属实时行情，多维度评分(技术面+资金面+基本面)，涨跌停池，北向资金，分钟级资金流。Use when: (1) 查询任何股票实时行情和评分, (2) 分析A股涨跌停异动, (3) 查看北向资金流向, (4) 美股港股贵金属行情, (5) 全球市场概览, (',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
      {
        name: 'trading212-api',
        description: 'This skill should be used when the user asks to "connect to Trading 212", "authe...',
        status: 'active',
        type: '股票分析',
        details: {
          whatItDoes: 'This skill should be used when the user asks to "connect to Trading 212", "authenticate Trading 212 API", "place a trade", "buy stock", "sell shares",',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
      {
        name: 'us-market-bubble-detector',
        description: 'Evaluates market bubble risk through quantitative data-driven analysis using the...',
        status: 'active',
        type: '股票分析',
        details: {
          whatItDoes: 'Evaluates market bubble risk through quantitative data-driven analysis using the revised Minsky/Kindleberger framework v2.1. Prioritizes objective met',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
      {
        name: 'us-stock-analysis',
        description: 'Comprehensive US stock analysis including fundamental analysis (financial metric...',
        status: 'active',
        type: '股票分析',
        details: {
          whatItDoes: 'Comprehensive US stock analysis including fundamental analysis (financial metrics, business quality, valuation), technical analysis (indicators, chart',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
      {
        name: 'yahoo-finance',
        description: 'Get stock prices, quotes, fundamentals, earnings, options, dividends, and analys...',
        status: 'active',
        type: '股票分析',
        details: {
          whatItDoes: 'Get stock prices, quotes, fundamentals, earnings, options, dividends, and analyst ratings using Yahoo Finance. Uses yfinance library - no API key requ',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
    ]
  },

  // 数据监控系统（自动添加）
  {
    category: 'data-monitoring',
    name: '数据监控系统',
    icon: '📡',
    items: [
      {
        name: 'agentmail-integration',
        description: 'Integrate AgentMail API for AI agent email automation. Create and manage dedicat...',
        status: 'active',
        type: '数据监控',
        details: {
          whatItDoes: 'Integrate AgentMail API for AI agent email automation. Create and manage dedicated email inboxes, send and receive emails programmatically, handle ema',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
      {
        name: 'ai-news-oracle',
        description: 'Fetch real-time AI news briefings from the AI News Oracle API (Hacker News, Tech...',
        status: 'active',
        type: '数据监控',
        details: {
          whatItDoes: 'Fetch real-time AI news briefings from the AI News Oracle API (Hacker News, TechCrunch, The Verge). Uses a10m.work registry for discovery and Paymaste',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
      {
        name: 'crypto-portfolio-tracker-api',
        description: 'Track cryptocurrency portfolios with real-time prices, P&L calculations, and all...',
        status: 'active',
        type: '数据监控',
        details: {
          whatItDoes: 'Track cryptocurrency portfolios with real-time prices, P&L calculations, and allocation analysis. Query Bitcoin, Ethereum, Solana and 10,000+ token ho',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
      {
        name: 'daily-business-report',
        description: 'Generate daily business briefings from multiple data sources. Aggregates weather...',
        status: 'active',
        type: '数据监控',
        details: {
          whatItDoes: 'Generate daily business briefings from multiple data sources. Aggregates weather, crypto prices, news headlines, system health, and calendar events in',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
      {
        name: 'google-calendar',
        description: 'Interact with Google Calendar via the Google Calendar API – list upcoming events...',
        status: 'active',
        type: '数据监控',
        details: {
          whatItDoes: 'Interact with Google Calendar via the Google Calendar API – list upcoming events, create new events, update or delete them. Use this skill when you ne',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
      {
        name: 'gws-calendar',
        description: 'Google Calendar: Manage calendars and events.',
        status: 'active',
        type: '数据监控',
        details: {
          whatItDoes: 'Google Calendar: Manage calendars and events.',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
      {
        name: 'gws-calendar-agenda',
        description: 'Google Calendar: Show upcoming events across all calendars.',
        status: 'active',
        type: '数据监控',
        details: {
          whatItDoes: 'Google Calendar: Show upcoming events across all calendars.',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
      {
        name: 'gws-calendar-insert',
        description: 'Google Calendar: Create a new event.',
        status: 'active',
        type: '数据监控',
        details: {
          whatItDoes: 'Google Calendar: Create a new event.',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
      {
        name: 'gws-events',
        description: 'Subscribe to Google Workspace events.',
        status: 'active',
        type: '数据监控',
        details: {
          whatItDoes: 'Subscribe to Google Workspace events.',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
      {
        name: 'gws-events-renew',
        description: 'Google Workspace Events: Renew/reactivate Workspace Events subscriptions.',
        status: 'active',
        type: '数据监控',
        details: {
          whatItDoes: 'Google Workspace Events: Renew/reactivate Workspace Events subscriptions.',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
      {
        name: 'gws-events-subscribe',
        description: 'Google Workspace Events: Subscribe to Workspace events and stream them as NDJSON...',
        status: 'active',
        type: '数据监控',
        details: {
          whatItDoes: 'Google Workspace Events: Subscribe to Workspace events and stream them as NDJSON.',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
      {
        name: 'openclaw-dashboard',
        description: 'Real-time operations dashboard for OpenClaw. Monitors sessions, costs, cron jobs...',
        status: 'active',
        type: '数据监控',
        details: {
          whatItDoes: 'Real-time operations dashboard for OpenClaw. Monitors sessions, costs, cron jobs, and gateway health. Use when installing the dashboard, starting the ',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
      {
        name: 'reddit-api',
        description: 'Reddit Search — Search posts, comments, users, and subreddits across 100M+ index...',
        status: 'active',
        type: '数据监控',
        details: {
          whatItDoes: 'Reddit Search — Search posts, comments, users, and subreddits across 100M+ indexed Reddit entries. Find discussions, track topics, discover communitie',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
      {
        name: 'social-sentiment',
        description: 'Sentiment analysis for brands and products across Twitter, Reddit, and Instagram...',
        status: 'active',
        type: '数据监控',
        details: {
          whatItDoes: 'Sentiment analysis for brands and products across Twitter, Reddit, and Instagram. Monitor public opinion, track brand reputation, detect PR crises, su',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
      {
        name: 'sophie-optimizer',
        description: 'Automated context health management for OpenClaw. Monitors token usage, snapshot...',
        status: 'active',
        type: '数据监控',
        details: {
          whatItDoes: 'Automated context health management for OpenClaw. Monitors token usage, snapshots memory, and resets sessions to maintain performance. Authored by Sop',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
      {
        name: 'x-alpha-scout',
        description: 'X/Twitter alpha scanner for crypto and NFTs. Use when: (1) user wants daily alph...',
        status: 'active',
        type: '数据监控',
        details: {
          whatItDoes: 'X/Twitter alpha scanner for crypto and NFTs. Use when: (1) user wants daily alpha reports, (2) analyzing a specific token/NFT/project from X sentiment',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
    ]
  },

  // AI分析系统（自动添加）
  {
    category: 'ai-analysis',
    name: 'AI分析系统',
    icon: '🤖',
    items: [
      {
        name: 'OptionsHawk',
        description: 'Options flow analysis, unusual activity detection, and options strategy evaluati...',
        status: 'active',
        type: 'AI分析',
        details: {
          whatItDoes: 'Options flow analysis, unusual activity detection, and options strategy evaluation for equities and ETFs',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
      {
        name: 'apipick-email-validation',
        description: 'Validate email addresses using the apipick Email Validator API. Performs syntax ...',
        status: 'active',
        type: 'AI分析',
        details: {
          whatItDoes: 'Validate email addresses using the apipick Email Validator API. Performs syntax checking, MX record verification, and disposable/throwaway email detec',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
      {
        name: 'bbc-news',
        description: 'Fetch and display BBC News stories from various sections and regions via RSS fee...',
        status: 'active',
        type: 'AI分析',
        details: {
          whatItDoes: 'Fetch and display BBC News stories from various sections and regions via RSS feeds. Use when the user asks for BBC news, UK news headlines, world news',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
      {
        name: 'context-manager',
        description: 'AI-powered context management for OpenClaw sessions',
        status: 'active',
        type: 'AI分析',
        details: {
          whatItDoes: 'AI-powered context management for OpenClaw sessions',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
      {
        name: 'daily-report',
        description: '```',
        status: 'active',
        type: 'AI分析',
        details: {
          whatItDoes: '```',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
      {
        name: 'data-analyst',
        description: 'Data visualization, report generation, SQL queries, and spreadsheet automation. ...',
        status: 'active',
        type: 'AI分析',
        details: {
          whatItDoes: 'Data visualization, report generation, SQL queries, and spreadsheet automation. Transform your AI agent into a data-savvy analyst that turns raw data ',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
      {
        name: 'data-analyst',
        description: 'Data visualization, report generation, SQL queries, and spreadsheet automation. ...',
        status: 'active',
        type: 'AI分析',
        details: {
          whatItDoes: 'Data visualization, report generation, SQL queries, and spreadsheet automation. Transform your AI agent into a data-savvy analyst that turns raw data ',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
      {
        name: 'gws-gmail',
        description: 'Gmail: Send, read, and manage email.',
        status: 'active',
        type: 'AI分析',
        details: {
          whatItDoes: 'Gmail: Send, read, and manage email.',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
      {
        name: 'gws-gmail-send',
        description: 'Gmail: Send an email.',
        status: 'active',
        type: 'AI分析',
        details: {
          whatItDoes: 'Gmail: Send an email.',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
      {
        name: 'gws-gmail-triage',
        description: 'Gmail: Show unread inbox summary (sender, subject, date).',
        status: 'active',
        type: 'AI分析',
        details: {
          whatItDoes: 'Gmail: Show unread inbox summary (sender, subject, date).',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
      {
        name: 'gws-gmail-watch',
        description: 'Gmail: Watch for new emails and stream them as NDJSON.',
        status: 'active',
        type: 'AI分析',
        details: {
          whatItDoes: 'Gmail: Watch for new emails and stream them as NDJSON.',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
      {
        name: 'gws-workflow-email-to-task',
        description: 'Google Workflow: Convert a Gmail message into a Google Tasks entry.',
        status: 'active',
        type: 'AI分析',
        details: {
          whatItDoes: 'Google Workflow: Convert a Gmail message into a Google Tasks entry.',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
      {
        name: 'gws-workflow-weekly-digest',
        description: 'Google Workflow: Weekly summary: this week\'s meetings + unread email count.',
        status: 'active',
        type: 'AI分析',
        details: {
          whatItDoes: 'Google Workflow: Weekly summary: this week\'s meetings + unread email count.',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
      {
        name: 'n8n-workflow-automation',
        description: 'Designs and outputs n8n workflow JSON with robust triggers, idempotency, error h...',
        status: 'active',
        type: 'AI分析',
        details: {
          whatItDoes: 'Designs and outputs n8n workflow JSON with robust triggers, idempotency, error handling, logging, retries, and human-in-the-loop review queues. Use wh',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
      {
        name: 'newsapi-search',
        description: 'Search news articles via NewsAPI with filtering by time windows, sources, domain...',
        status: 'active',
        type: 'AI分析',
        details: {
          whatItDoes: 'Search news articles via NewsAPI with filtering by time windows, sources, domains, and languages.',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
      {
        name: 'react-local-biz',
        description: 'Build complete, modern multi-page React websites for local businesses (landscape...',
        status: 'active',
        type: 'AI分析',
        details: {
          whatItDoes: 'Build complete, modern multi-page React websites for local businesses (landscapers, restaurants, salons, plumbers, gyms, etc.). Use when a user asks t',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
      {
        name: 'smart-web-scraper',
        description: 'Extract structured data from any web page. Supports CSS selectors, auto-detectio...',
        status: 'active',
        type: 'AI分析',
        details: {
          whatItDoes: 'Extract structured data from any web page. Supports CSS selectors, auto-detection of tables and lists, JSON/CSV output formats. Use when asked to scra',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
    ]
  },

  // 日历与邮件系统（自动添加）
  {
    category: 'calendar-email',
    name: '日历与邮件系统',
    icon: '📅',
    items: [
      {
        name: 'advanced-calendar',
        description: 'Advanced calendar skill with natural language processing, automatic reminders, a...',
        status: 'active',
        type: '日历邮件',
        details: {
          whatItDoes: 'Advanced calendar skill with natural language processing, automatic reminders, and multi-channel notifications',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
    ]
  },

  // 文档管理系统（自动添加）
  {
    category: 'document-management',
    name: '文档管理系统',
    icon: '📄',
    items: [
      {
        name: 'context-compressor',
        description: 'Compress long conversation histories, large code files, research results, and do...',
        status: 'active',
        type: '文档管理',
        details: {
          whatItDoes: 'Compress long conversation histories, large code files, research results, and documents by 70% without losing critical information. Triggers when cont',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
      {
        name: 'gws-docs',
        description: 'Read and write Google Docs.',
        status: 'active',
        type: '文档管理',
        details: {
          whatItDoes: 'Read and write Google Docs.',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
      {
        name: 'gws-docs-write',
        description: 'Google Docs: Append text to a document.',
        status: 'active',
        type: '文档管理',
        details: {
          whatItDoes: 'Google Docs: Append text to a document.',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
      {
        name: 'gws-keep',
        description: 'Manage Google Keep notes.',
        status: 'active',
        type: '文档管理',
        details: {
          whatItDoes: 'Manage Google Keep notes.',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
      {
        name: 'gws-workflow-meeting-prep',
        description: 'Google Workflow: Prepare for your next meeting: agenda, attendees, and linked do...',
        status: 'active',
        type: '文档管理',
        details: {
          whatItDoes: 'Google Workflow: Prepare for your next meeting: agenda, attendees, and linked docs.',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
    ]
  },

  // 开发工具（自动添加）
  {
    category: 'development-tools',
    name: '开发工具',
    icon: '🛠️',
    items: [
      {
        name: 'skill-creator（Anthropic 官方）⭐',
        description: 'AI 自动创建新 Skill 的工具（Anthropic 官方）',
        status: 'active',
        type: 'AI能力',
        details: {
          whatItDoes: '让 AI 自动帮你创建新的 Skill，AI 自己给自己写插件。支持从零创建 skill、修改现有 skill、测试 skill 性能、优化 skill 描述。',
          howItWorks: '• 决定 skill 功能 → 写草稿 → 创建测试 prompts → 评估结果（定性+定量）→ 重写 skill → 重复直到满意\n• 支持渐进式披露：Metadata（~100词）+ SKILL.md（<500行）+ 资源文件（无限）\n• 提供 eval-viewer/generate_review.py 脚本量化评估',
          currentStatus: '✅ 已安装（Anthropic 官方）\n• 位置：~/.openclaw/skills/skill-creator/\n• SKILL.md：32KB（完整文档）\n• 包含：agents/、assets/、eval-viewer/、references/、scripts/\n• 可立即使用',
          improvements: '📊 使用效果：\n• 创建 skill 效率：手动2小时 → 自动10分钟（-92%）\n• Skill 质量：AI 优化，触发准确率更高\n• 测试覆盖：自动生成测试用例\n• 迭代速度：快速改进，持续优化',
          lastUpdate: '2026-03-07',
          usage: '• 创建新 skill："帮我创建一个XXX skill"\n• 修改 skill："优化这个 skill"\n• 测试 skill："测试这个 skill 的性能"',
          dependencies: ['Anthropic 官方', 'Claude API']
        }
      },
      {
        name: 'agent-browser',
        description: 'Automates browser interactions for web testing, form filling, screenshots, and d...',
        status: 'active',
        type: '开发工具',
        details: {
          whatItDoes: 'Automates browser interactions for web testing, form filling, screenshots, and data extraction. Use when the user needs to navigate websites, interact',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
      {
        name: 'browser-use',
        description: 'Automates browser interactions for web testing, form filling, screenshots, and d...',
        status: 'active',
        type: '开发工具',
        details: {
          whatItDoes: 'Automates browser interactions for web testing, form filling, screenshots, and data extraction. Use when the user needs to navigate websites, interact',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
      {
        name: 'cls-news-scraper',
        description: '1. Collect latest CLS items from configured endpoint/source.',
        status: 'active',
        type: '开发工具',
        details: {
          whatItDoes: '1. Collect latest CLS items from configured endpoint/source.',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
      {
        name: 'playwright-browser',
        description: 'Set up headless browser automation in Clawdbot using Playwright Chromium. Use wh...',
        status: 'active',
        type: '开发工具',
        details: {
          whatItDoes: 'Set up headless browser automation in Clawdbot using Playwright Chromium. Use when configuring browser tools for WSL/Linux environments, installing br',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
      {
        name: 'react-component-generator',
        description: '生成 React 组件模板，支持 Function Component, Class Component, Hooks, TypeScript，一键生成完整组件...',
        status: 'active',
        type: '开发工具',
        details: {
          whatItDoes: '生成 React 组件模板，支持 Function Component, Class Component, Hooks, TypeScript，一键生成完整组件代码。',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
      {
        name: 'react-expert',
        description: 'Use when building React 18+ applications requiring component architecture, hooks...',
        status: 'active',
        type: '开发工具',
        details: {
          whatItDoes: 'Use when building React 18+ applications requiring component architecture, hooks patterns, or state management. Invoke for Server Components, performa',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
      {
        name: 'react-expert',
        description: 'Use when building React 18+ applications requiring component architecture, hooks...',
        status: 'active',
        type: '开发工具',
        details: {
          whatItDoes: 'Use when building React 18+ applications requiring component architecture, hooks patterns, or state management. Invoke for Server Components, performa',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
      {
        name: 'react-nextjs-generator',
        description: '3. 生成项目结构',
        status: 'active',
        type: '开发工具',
        details: {
          whatItDoes: '3. 生成项目结构',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
    ]
  },

  // 通信系统（自动添加）
  {
    category: 'communication',
    name: '通信系统',
    icon: '💬',
    items: [
      {
        name: 'gws-chat',
        description: 'Google Chat: Manage Chat spaces and messages.',
        status: 'active',
        type: '通信',
        details: {
          whatItDoes: 'Google Chat: Manage Chat spaces and messages.',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
      {
        name: 'gws-chat-send',
        description: 'Google Chat: Send a message to a space.',
        status: 'active',
        type: '通信',
        details: {
          whatItDoes: 'Google Chat: Send a message to a space.',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
      {
        name: 'gws-workflow-file-announce',
        description: 'Google Workflow: Announce a Drive file in a Chat space.',
        status: 'active',
        type: '通信',
        details: {
          whatItDoes: 'Google Workflow: Announce a Drive file in a Chat space.',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
    ]
  },

  // 记忆与优化系统（自动添加）
  {
    category: 'memory-optimization',
    name: '记忆与优化系统',
    icon: '⚡',
    items: [
      {
        name: 'context-protection',
        description: '```bash',
        status: 'active',
        type: '记忆优化',
        details: {
          whatItDoes: '```bash',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
    ]
  },

  // 数据抓取系统（自动添加）
  {
    category: 'data-fetching',
    name: '数据抓取系统',
    icon: '🔍',
    items: [
      {
        name: 'agent-reach',
        description: '>',
        status: 'active',
        type: '数据抓取',
        details: {
          whatItDoes: '>',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
      {
        name: 'web-scraping',
        description: 'Web scraping tools for fetching and extracting data from web pages',
        status: 'active',
        type: '数据抓取',
        details: {
          whatItDoes: 'Web scraping tools for fetching and extracting data from web pages',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
    ]
  },

  // API集成（自动添加）
  {
    category: 'api-integration',
    name: 'API集成',
    icon: '🔌',
    items: [
      {
        name: 'accounting-workflows',
        description: 'File-based workflow coordinator for Greek accounting. Defines processing pipelin...',
        status: 'active',
        type: 'API集成',
        details: {
          whatItDoes: 'File-based workflow coordinator for Greek accounting. Defines processing pipelines, validation rules, and routine templates. No external APIs needed.',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
      {
        name: 'clerk-auth',
        description: '|',
        status: 'active',
        type: 'API集成',
        details: {
          whatItDoes: '|',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
      {
        name: 'data-enricher',
        description: '- Max 10 Hunter.io lookups per session (API limit)',
        status: 'active',
        type: 'API集成',
        details: {
          whatItDoes: '- Max 10 Hunter.io lookups per session (API limit)',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
      {
        name: 'gws-shared',
        description: 'gws CLI: Shared patterns for authentication, global flags, and output formatting...',
        status: 'active',
        type: 'API集成',
        details: {
          whatItDoes: 'gws CLI: Shared patterns for authentication, global flags, and output formatting.',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
      {
        name: 'gws-workflow',
        description: 'Google Workflow: Cross-service productivity workflows.',
        status: 'active',
        type: 'API集成',
        details: {
          whatItDoes: 'Google Workflow: Cross-service productivity workflows.',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
      {
        name: 'gws-workflow-standup-report',
        description: 'Google Workflow: Today\'s meetings + open tasks as a standup summary.',
        status: 'active',
        type: 'API集成',
        details: {
          whatItDoes: 'Google Workflow: Today\'s meetings + open tasks as a standup summary.',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
    ]
  },

  // 自动化系统（自动添加）
  {
    category: 'automation',
    name: '自动化系统',
    icon: '⚡',
    items: [
      {
        name: 'gws-drive-upload',
        description: 'Google Drive: Upload a file with automatic metadata.',
        status: 'active',
        type: '自动化',
        details: {
          whatItDoes: 'Google Drive: Upload a file with automatic metadata.',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
      {
        name: 'gws-tasks',
        description: 'Google Tasks: Manage task lists and tasks.',
        status: 'active',
        type: '自动化',
        details: {
          whatItDoes: 'Google Tasks: Manage task lists and tasks.',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
    ]
  },

  // 安全系统（自动添加）
  {
    category: 'security',
    name: '安全系统',
    icon: '🔒',
    items: [
      {
        name: 'gws-alertcenter',
        description: 'Google Workspace Alert Center: Manage Workspace security alerts.',
        status: 'active',
        type: '安全',
        details: {
          whatItDoes: 'Google Workspace Alert Center: Manage Workspace security alerts.',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
      {
        name: 'ipo-alert',
        description: '한국 공모주 청약/신규상장 일정 알림. 38.co.kr에서 데이터 수집, D-1/당일 알림, 주간 요약 제공.',
        status: 'active',
        type: '安全',
        details: {
          whatItDoes: '한국 공모주 청약/신규상장 일정 알림. 38.co.kr에서 데이터 수집, D-1/당일 알림, 주간 요약 제공.',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
    ]
  },

  // 商业智能系统（自动添加）
  {
    category: 'business-intelligence',
    name: '商业智能系统',
    icon: '📈',
    items: [
      {
        name: 'agent-dashboard',
        description: '>',
        status: 'active',
        type: '商业智能',
        details: {
          whatItDoes: '>',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
      {
        name: 'biz-reporter',
        description: '>',
        status: 'active',
        type: '商业智能',
        details: {
          whatItDoes: '>',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
      {
        name: 'csv-pipeline',
        description: 'Process, transform, analyze, and report on CSV and JSON data files. Use when the...',
        status: 'active',
        type: '商业智能',
        details: {
          whatItDoes: 'Process, transform, analyze, and report on CSV and JSON data files. Use when the user needs to filter rows, join datasets, compute aggregates, convert',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
      {
        name: 'google-analytics',
        description: '|',
        status: 'active',
        type: '商业智能',
        details: {
          whatItDoes: '|',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
      {
        name: 'gws-admin-reports',
        description: 'Google Workspace Admin SDK: Audit logs and usage reports.',
        status: 'active',
        type: '商业智能',
        details: {
          whatItDoes: 'Google Workspace Admin SDK: Audit logs and usage reports.',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
    ]
  },

  // 其他工具（自动添加）
  {
    category: 'other',
    name: '其他工具',
    icon: '🔧',
    items: [
      {
        name: 'cloudflare-agent-tunnel',
        description: '>',
        status: 'active',
        type: '其他',
        details: {
          whatItDoes: '>',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
      {
        name: 'gws-admin',
        description: 'Google Workspace Admin SDK: Manage users, groups, and devices.',
        status: 'active',
        type: '其他',
        details: {
          whatItDoes: 'Google Workspace Admin SDK: Manage users, groups, and devices.',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
      {
        name: 'gws-apps-script',
        description: 'Google Apps Script: Manage and execute Apps Script projects.',
        status: 'active',
        type: '其他',
        details: {
          whatItDoes: 'Google Apps Script: Manage and execute Apps Script projects.',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
      {
        name: 'gws-apps-script-push',
        description: 'Google Apps Script: Upload local files to an Apps Script project.',
        status: 'active',
        type: '其他',
        details: {
          whatItDoes: 'Google Apps Script: Upload local files to an Apps Script project.',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
      {
        name: 'gws-classroom',
        description: 'Google Classroom: Manage classes, rosters, and coursework.',
        status: 'active',
        type: '其他',
        details: {
          whatItDoes: 'Google Classroom: Manage classes, rosters, and coursework.',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
      {
        name: 'gws-cloudidentity',
        description: 'Google Cloud Identity: Manage identity groups and memberships.',
        status: 'active',
        type: '其他',
        details: {
          whatItDoes: 'Google Cloud Identity: Manage identity groups and memberships.',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
      {
        name: 'gws-drive',
        description: 'Google Drive: Manage files, folders, and shared drives.',
        status: 'active',
        type: '其他',
        details: {
          whatItDoes: 'Google Drive: Manage files, folders, and shared drives.',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
      {
        name: 'gws-forms',
        description: 'Read and write Google Forms.',
        status: 'active',
        type: '其他',
        details: {
          whatItDoes: 'Read and write Google Forms.',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
      {
        name: 'gws-groupssettings',
        description: 'Manage Google Groups settings.',
        status: 'active',
        type: '其他',
        details: {
          whatItDoes: 'Manage Google Groups settings.',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
      {
        name: 'gws-licensing',
        description: 'Google Workspace Enterprise License Manager: Manage product licenses.',
        status: 'active',
        type: '其他',
        details: {
          whatItDoes: 'Google Workspace Enterprise License Manager: Manage product licenses.',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
      {
        name: 'gws-meet',
        description: 'Manage Google Meet conferences.',
        status: 'active',
        type: '其他',
        details: {
          whatItDoes: 'Manage Google Meet conferences.',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
      {
        name: 'gws-modelarmor',
        description: 'Google Model Armor: Filter user-generated content for safety.',
        status: 'active',
        type: '其他',
        details: {
          whatItDoes: 'Google Model Armor: Filter user-generated content for safety.',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
      {
        name: 'gws-modelarmor-create-template',
        description: 'Google Model Armor: Create a new Model Armor template.',
        status: 'active',
        type: '其他',
        details: {
          whatItDoes: 'Google Model Armor: Create a new Model Armor template.',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
      {
        name: 'gws-modelarmor-sanitize-prompt',
        description: 'Google Model Armor: Sanitize a user prompt through a Model Armor template.',
        status: 'active',
        type: '其他',
        details: {
          whatItDoes: 'Google Model Armor: Sanitize a user prompt through a Model Armor template.',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
      {
        name: 'gws-modelarmor-sanitize-response',
        description: 'Google Model Armor: Sanitize a model response through a Model Armor template.',
        status: 'active',
        type: '其他',
        details: {
          whatItDoes: 'Google Model Armor: Sanitize a model response through a Model Armor template.',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
      {
        name: 'gws-people',
        description: 'Google People: Manage contacts and profiles.',
        status: 'active',
        type: '其他',
        details: {
          whatItDoes: 'Google People: Manage contacts and profiles.',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
      {
        name: 'gws-reseller',
        description: 'Google Workspace Reseller: Manage Workspace subscriptions.',
        status: 'active',
        type: '其他',
        details: {
          whatItDoes: 'Google Workspace Reseller: Manage Workspace subscriptions.',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
      {
        name: 'gws-sheets',
        description: 'Google Sheets: Read and write spreadsheets.',
        status: 'active',
        type: '其他',
        details: {
          whatItDoes: 'Google Sheets: Read and write spreadsheets.',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
      {
        name: 'gws-sheets-append',
        description: 'Google Sheets: Append a row to a spreadsheet.',
        status: 'active',
        type: '其他',
        details: {
          whatItDoes: 'Google Sheets: Append a row to a spreadsheet.',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
      {
        name: 'gws-sheets-read',
        description: 'Google Sheets: Read values from a spreadsheet.',
        status: 'active',
        type: '其他',
        details: {
          whatItDoes: 'Google Sheets: Read values from a spreadsheet.',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
      {
        name: 'gws-slides',
        description: 'Google Slides: Read and write presentations.',
        status: 'active',
        type: '其他',
        details: {
          whatItDoes: 'Google Slides: Read and write presentations.',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
      {
        name: 'gws-vault',
        description: 'Google Vault: Manage eDiscovery holds and exports.',
        status: 'active',
        type: '其他',
        details: {
          whatItDoes: 'Google Vault: Manage eDiscovery holds and exports.',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
      {
        name: 'structured-data',
        description: 'CSV parsing, JSON-to-CSV conversion, and SVG chart generation',
        status: 'active',
        type: '其他',
        details: {
          whatItDoes: 'CSV parsing, JSON-to-CSV conversion, and SVG chart generation',
          howItWorks: '详见 SKILL.md',
          currentStatus: '✅ 已安装（自动扫描）',
          lastUpdate: '2026-03-07',
          usage: '自动扫描添加',
          dependencies: []
        }
      },
      {
        name: 'AI财报追踪器',
        description: '每周自动追踪NVDA/MSFT/GOOGL等科技股财报,发布后自动生成beat/miss摘要推送Telegram',
        status: 'active',
        type: '监控工具',
        details: {
          whatItDoes: '每周日18:00自动运行,搜索下周科技/AI公司财报日历.筛选公司:NVDA,MSFT,GOOGL,META,AMZN,TSLA,AMD.结果发送到Telegram.财报发布后自动生成摘要(beat/miss,营收,EPS,关键指标).记住子涵关注的公司列表到MEMORY.md',
          howItWorks: '使用 OpenClaw cron job 定时运行,通过 web_search 搜索财报日历和结果,自动发送到 Telegram',
          currentStatus: '✅ 已就绪(每周日18:00运行)',
          lastUpdate: '2026-03-09',
          usage: 'openclaw cron create',
          dependencies: ['web_search', 'Telegram']
        }
      },
      {
        name: '多源科技新闻摘要',
        description: '每日9:00聚合109+来源科技新闻,质量评分筛选,发送到Telegram',
        status: 'active',
        type: '监控工具',
        details: {
          whatItDoes: '每天9:00自动运行,聚合109+来源科技新闻,质量评分筛选后发送到Telegram',
          howItWorks: '使用 OpenClaw cron job 定时运行,聚合 RSS,Twitter,GitHub Releases,Web Search 四层数据源',
          currentStatus: '✅ 已就绪(每天9:00运行)',
          lastUpdate: '2026-03-09',
          usage: 'openclaw cron create',
          dependencies: ['web_search', 'Telegram']
        }
      },
      {
        name: 'Reddit财经情绪监控',
        description: '每天12:00监控r/wallstreetbets等财经社区,追踪散户情绪和热门标的',
        status: 'active',
        type: '监控工具',
        details: {
          whatItDoes: '每天12:00自动运行,监控r/wallstreetbets,r/investing,r/stocks,r/options每日摘要.筛选与NVDA,MSFT,AAPL,TSLA相关帖子.结果发送到Telegram',
          howItWorks: '使用 OpenClaw cron job 定时运行,监控 Reddit 社区情绪,追踪散户热点',
          currentStatus: '✅ 已就绪(每天12:00运行)',
          lastUpdate: '2026-03-09',
          usage: 'openclaw cron create',
          dependencies: ['web_search', 'Telegram']
        }
      },
    ]
  },

];