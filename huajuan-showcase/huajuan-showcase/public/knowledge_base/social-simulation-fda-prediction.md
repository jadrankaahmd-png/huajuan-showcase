# 社会模拟预测 FDA 事件市场传导

**来源**：oaker-io/sim-predict 项目  
**日期**：2026-03-10  
**类型**：量化预测方法论

---

## 🎯 核心 Thesis

**Alpha 不来自知道信息，而来自预测信息被 price in 需要多长时间**

---

## 🏗️ 架构

```
FDA事件 → OASIS多Agent社会模拟（5类角色传导）→ 预测 → 对比真实市场数据 → AI自动调参 → 🔄
```

---

## 🔍 如何工作

### 1. 注入 FDA 事件
- 例如："FDA 批准 Lecanemab 用于阿尔茨海默症"
- 作为种子帖子注入模拟系统

### 2. 模拟信息传播
- 通过 5 类 Agent 传播信息
- 信息流：`FDA → 分析师/机构 → KOL → 记者 → 散户`

### 3. 提取预测
- 价格方向（上涨/下跌）
- Price-in 时间（信息被完全消化需要多久）
- 讨论量曲线（信息传播速度）

### 4. 评分
- 对比真实市场数据（股价、社交媒体量）
- 计算准确率

### 5. 进化
- AI agent 调整模拟参数
- 保留改进，丢弃回归
- 循环优化

---

## 📊 Agent 类型

| 类型 | 角色 | 行为特征 |
|------|------|---------|
| **分析师** | 卖方/买方 | 最早获取信息，深度分析但速度慢 |
| **生物技术 KOL** | Twitter 意见领袖 | 传播快，情绪化，互相引用 |
| **记者** | 医药/金融媒体 | 落后于 KOL，但覆盖面广 |
| **散户** | 个人投资者 | 最后接收信息，羊群行为 |
| **机构** | 投资组合经理 | 独立判断，数据驱动 |

---

## 📈 基线结果

**实验配置**：29 个 agents，30 轮，3 个 FDA 事件

| 指标 | 分数 | 描述 |
|------|------|------|
| **mean_score** | **0.554** | 综合得分（优于随机 = 0.5） |
| direction_accuracy | 0.667 | 股价方向预测正确率 2/3 |
| path_similarity | 0.921 | 传播曲线形状匹配真实数据 |
| time_accuracy | 0.340 | Price-in 时间预测（最弱，需改进） |

---

## 🔄 Autoresearch 循环

**进化机制**（受 Karpathy's autoresearch 启发）：

1. AI agent 读取 `program.md`（研究指令）
2. 修改 `config.yaml` 中的 1-2 个参数
3. 运行 `python run_experiment.py`
4. 如果 `mean_score` 提升 → 保留（git commit），更新基线
5. 如果未提升 → 丢弃（git checkout）
6. 记录到 `results.tsv`，重复循环

---

## ⚙️ 可调参数（config.yaml）

```yaml
agents:
  analyst:  { count: 4,  influence: 0.9, speed: 0.3, skepticism: 0.7 }
  kol:      { count: 8,  influence: 0.7, speed: 0.9, skepticism: 0.3 }
  journalist: { count: 3, influence: 0.5, speed: 0.5, skepticism: 0.5 }
  retail:   { count: 10, influence: 0.1, speed: 0.4, skepticism: 0.2 }
  institutional: { count: 4, influence: 0.8, speed: 0.6, skepticism: 0.9 }

topology:
  analyst_to_kol: 0.8
  kol_to_kol: 0.4
  kol_to_journalist: 0.6
  journalist_to_retail: 0.7
  retail_to_retail: 0.3

simulation:
  rounds: 30
  platform: twitter
  recsys: twhin-bert
```

---

## 🧪 评估指标

**综合得分**（权重锁定，AI agent 无法作弊）：

```
score = 0.5 × time_accuracy + 0.3 × direction_accuracy + 0.2 × path_similarity
```

### 指标定义

- **time_accuracy**: `1 - |predicted - actual| / actual`，限制在 [0, 1]
- **direction_accuracy**: 二元评估 —— 模拟是否正确预测涨跌？
- **path_similarity**: 模拟 vs 真实讨论量曲线的 DTW 距离，归一化到 [0, 1]

---

## 🛠️ 技术栈

- **OASIS (camel-oasis)** — 多 Agent 社会模拟
- **CAMEL** — Agent 框架
- **DeepSeek V3** — LLM 后端（通过 OpenAI 兼容 API）
- **DTW (dtw-python)** — 时间序列比较
- **yfinance** — 市场数据

---

## 💡 对花卷第一层的启发

### **1. 信息传播时间预测**

**核心理念**：
- 不是知道信息，而是预测信息何时被 price in
- 信息传播有延迟，这个延迟就是 alpha 来源

**应用场景**：
- FDA 药物批准事件
- 财报发布
- 央行政策公告
- 地缘政治事件

---

### **2. 多Agent角色传导机制**

**5类投资者角色**：
```
分析师（最早）→ KOL（快速）→ 记者（广泛）→ 散户（最后）
              ↓
           机构（独立）
```

**对花卷的启发**：
- 可以构建"信息传播路径预测"能力
- 预测不同类型投资者何时反应
- 识别市场中的"信息滞后"机会

---

### **3. Autoresearch 自我进化**

**AI agent 自动优化**：
- 读取实验结果
- 调整参数
- 保留改进，丢弃回归
- 循环进化

**对花卷的启发**：
- 可以构建"自动参数优化"能力
- AI 自动调整模型参数
- 持续进化，无需人工干预

---

## 🎯 可做功能

### **功能1：FDA 事件传导预测器**

**输入**：FDA 药物批准事件  
**输出**：
- 价格方向预测
- Price-in 时间预测
- 信息传播曲线

**技术栈**：
- OASIS 多 Agent 模拟
- 5 类投资者角色
- 对比真实市场数据验证

---

### **功能2：财报事件传导预测器**

**输入**：公司财报发布  
**输出**：
- 价格方向预测
- Price-in 时间预测
- 社交媒体讨论量预测

---

### **功能3：信息滞后机会扫描器**

**输入**：重大新闻事件  
**输出**：
- 信息传播到不同投资者群体的时间
- 识别"信息滞后"交易机会
- 预测股价何时完全消化信息

---

## 📊 预期效果

**基于 sim-predict 的基线结果**：

| 指标 | 当前水平 | 预期改进 |
|------|---------|---------|
| **方向准确率** | 66.7% | 70-75% |
| **传播曲线匹配** | 92.1% | 90-95% |
| **Price-in 时间** | 34% | 40-50%（需优化） |

---

## 🔑 关键学习

### **1. Alpha 来源**
- ❌ 不是：比别人更早知道信息
- ✅ 是：预测信息被 price in 需要多长时间

### **2. 信息传播路径**
- 信息不是瞬间传播
- 不同类型投资者反应时间不同
- 这个时间差就是 alpha

### **3. 自动进化**
- AI 可以自动优化参数
- 不需要人工干预
- 持续进化，不断改进

---

## 🚀 花卷可以做什么

### **短期（1周）**
1. 实现"信息传播时间预测"能力
2. 实现"多Agent角色传导"能力

### **中期（1月）**
3. 实现"FDA 事件传导预测器"
4. 实现"财报事件传导预测器"

### **长期（3月）**
5. 实现"自动参数优化"能力
6. 实现"信息滞后机会扫描器"

---

_最后更新：2026-03-10_
_来源：oaker-io/sim-predict_
_状态：已加入知识库_
