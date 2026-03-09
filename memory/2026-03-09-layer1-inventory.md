# 第一层能力完整清单

**生成时间：** 2026-03-09 20:08
**任务：** 彻底盘点第一层所有能力，确保一个不漏，永久记住每个能力的位置
**第一层范围：** /coe 及其下所有二级三级页面的全部能力

---

## 页面路径

1. `/coe` - 花卷能力中心（主页）
2. `/coe/knowledge-base` - 知识库
3. `/coe/iran-geopolitical-risk` - 伊朗局势监控
4. `/coe/telegram-news` - Telegram新闻流

---

## 能力统计

- **总分类数：** 40
- **总能力数：** 597
- **遗漏补充：** 19个能力
  - 知识库条目：11个
  - 伊朗监控模块：8个

---

## 盘点过程

### 1. /coe 主页能力

**能力来源：** `app/data/capabilities.ts`
**能力数量：** 578 个（补充前）
**分类数量：** 40 个

### 2. /coe/knowledge-base 知识库页面能力

**页面路径：** `/coe/knowledge-base`
**能力数量：** 15 个（补充前：4个）

**能力清单：**

#### 原有4个能力（已在 capabilities.ts 中）：
1. 知识库更新流程 - 自动学习和保存有价值的信息
2. 已保存的重要洞察 - 5个核心洞察（量化、量子计算、CTA模型、黄金投资）
3. 行业分析知识库 - 按行业分类的深度分析框架
4. 量化策略库 - 量化策略和学习材料

#### 新增11个能力（从页面补充）：
5. Interactive Benchmarks: 评估模型的交互学习能力
6. 选股系统的交互式学习应用
7. Agent Reach 数据抓取系统
8. $AAOI 深度投资分析：6.3倍上涨空间
9. Phase 3: 假设验证机制
10. Phase 1: 股票分析编排器
11. Phase 2: 分析工作空间管理
12. Phase 3: 工作流定义与配置解析
13. Phase 4: 分析可观察性系统
14. Phase 5: 集成测试完成
15. GLM MCP 深度测试成功

#### 书籍来源（4个，不计入能力）：
- Project Gutenberg
- Open Library
- SEC EDGAR
- Internet Archive

### 3. /coe/iran-geopolitical-risk 伊朗局势监控页面能力

**页面路径：** `/coe/iran-geopolitical-risk`
**能力数量：** 10 个（补充前：2个）

**能力清单：**

#### 原有2个能力（已在 capabilities.ts 中）：
1. 伊朗局势实时追踪 - 实时追踪伊朗局势和市场影响
2. 地缘政治影响分析 - 分析地缘政治对美股的影响

#### 新增8个能力（从页面补充）：
3. 股票模块（StockModule） - 监控伊朗局势相关股票（USO、XLE、LMT、RTX、BA、DAL）的实时价格
4. 宏观数据模块（MacroDataModule） - 监控宏观经济指标（联邦基金利率、CPI、失业率、GDP等）
5. 新闻模块（NewsModule） - 抓取伊朗局势相关新闻，支持情绪分析
6. 稳定性模块（StabilityModule） - 评估伊朗局势稳定性，提供稳定性指数
7. AI分析模块（AIAnalysisModule） - AI智能研判伊朗局势和投资建议
8. 情绪模块（SentimentModule） - 分析市场情绪和舆论情绪
9. 航班模块（FlightsModule） - 监控伊朗领空航班动态
10. 海运模块（ShippingModule） - 监控霍尔木兹海峡船只动态（WebSocket实时）

### 4. /coe/telegram-news Telegram新闻流页面能力

**页面路径：** `/coe/telegram-news`
**能力数量：** 1 个

**能力清单：**

#### 已有1个能力（已在 capabilities.ts 中）：
1. Telegram新闻流 - 实时抓取Telegram频道最新新闻：区块链、金融、科技

---

## 遗漏补充

### 补充前能力数：578
### 补充后能力数：597
### 补充能力数：19

### 补充详情：

#### 知识库条目（11个）：
添加到 `knowledge-base` 分类：
1. Interactive Benchmarks: 评估模型的交互学习能力
2. 选股系统的交互式学习应用
3. Agent Reach 数据抓取系统
4. $AAOI 深度投资分析：6.3倍上涨空间
5. Phase 3: 假设验证机制
6. Phase 1: 股票分析编排器
7. Phase 2: 分析工作空间管理
8. Phase 3: 工作流定义与配置解析
9. Phase 4: 分析可观察性系统
10. Phase 5: 集成测试完成
11. GLM MCP 深度测试成功

#### 伊朗监控模块（8个）：
添加到 `iran-tracker` 分类：
1. 股票模块（StockModule）
2. 宏观数据模块（MacroDataModule）
3. 新闻模块（NewsModule）
4. 稳定性模块（StabilityModule）
5. AI分析模块（AIAnalysisModule）
6. 情绪模块（SentimentModule）
7. 航班模块（FlightsModule）
8. 海运模块（ShippingModule）

---

## 最终统计

| 分类 | 补充前 | 补充后 | 增加 |
|------|--------|--------|------|
| knowledge-base | 4 | 15 | +11 |
| iran-tracker | 2 | 10 | +8 |
| 其他分类 | 572 | 572 | 0 |
| **总计** | **578** | **597** | **+19** |

---

## Git 提交

- Git 提交：0018288
- 提交信息：feat: 补充第一层遗漏能力18个（11个知识条目+7个伊朗监控模块）
- Vercel 自动部署已触发

---

## 直达链接

- 🌐 https://www.huajuan.news/coe
- 🌐 https://www.huajuan.news/coe/knowledge-base
- 🌐 https://www.huajuan.news/coe/iran-geopolitical-risk
- 🌐 https://www.huajuan.news/coe/telegram-news

---

_最后更新：2026-03-09 20:08_
_任务完成：✅ 全部完成_
_能力总数：597（最终确认）_
_遗漏补充：19个能力_
