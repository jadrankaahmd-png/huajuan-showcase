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
          dependencies: ['API Key: d61gv49r01qufbsn7v90d61gv49r01qufbsn7v9g']
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
          dependencies: ['API Key: 332b7388f0fb42a9bf05d06a89fc10c9']
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
        description: '4201家机构持仓蒸馏',
        status: 'active',
        type: '机构系统',
        details: {
          whatItDoes: '从4201家机构、926823个持仓中蒸馏出早期投资机会',
          howItWorks: '早期机会发现（机构<=3家）→ 趋势追踪（3-5季度）→ 集体共识（>=5家机构）',
          currentStatus: '✅ 正常运行\n- 4201家机构\n- 926823个持仓\n- 46791个早期机会\n- 6355个共识股票',
          lastUpdate: '2026-03-03',
          usage: 'investment_distillation/daily_update.py',
          dependencies: ['SEC EDGAR', '13F Holdings']
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
    icon: '🧠',
    items: [
      {
        name: 'MEMORY_LITE.md',
        description: '精简版记忆（1KB）',
        status: 'active',
        type: '记忆系统',
        details: {
          whatItDoes: '新session优先读取，防止Context超限',
          currentStatus: '✅ 正常运行',
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
  }
];
