---
name: prune-system-prompts
description: 自动扫描和精简 workspace 文件（AGENTS.md、MEMORY.md、NOW.md），超过阈值时自动精简，保留关键信息，删除冗余内容，节省 Token
---

# Prune System Prompts

## 什么时候使用

**自动触发**：
- ✅ Heartbeat 时自动运行
- ✅ 每周运行一次
- ✅ 手动运行 `node .agents/skills/prune-system-prompts/scripts/prune.js`

**作用**：
- 扫描 workspace 文件大小
- 识别可以精简的文件
- 自动精简 AGENTS.md、MEMORY.md、NOW.md
- 压缩 daily memory
- 生成精简报告

---

## 精简规则

### **1. AGENTS.md**
- **阈值**：5KB
- **保留**：核心规则、永久禁止事项、必读内容
- **删除**：重复说明、冗长描述、详细命令输出
- **目标**：7.1KB → 4KB（节省44%）

### **2. MEMORY.md**
- **阈值**：4KB
- **保留**：永久规则、关键决策、重要学习
- **删除**：详细过程、冗长日志、过时内容
- **目标**：3KB → 2KB（节省33%）

### **3. NOW.md**
- **阈值**：2KB
- **保留**：当前任务、最近更新、待处理事项
- **删除**：旧任务、详细描述、已完成事项
- **目标**：保持精简（只保留最重要的任务）

### **4. daily memory (memory/YYYY-MM-DD.md)**
- **阈值**：10KB
- **保留**：关键决策、重要事件、学习总结
- **删除**：详细命令输出、冗长日志、重复内容
- **目标**：5KB → 2KB（节省60%）

---

## 精简策略

### **策略1：删除重复内容**
```bash
# 查找重复的章节标题
# 合并相似的内容
# 删除冗长的说明
```

### **策略2：压缩详细描述**
```bash
# 将长段落改为列表
# 将详细步骤改为简短命令
# 将代码块改为注释
```

### **策略3：保留核心规则**
```bash
# 永久规则必须保留
# API Keys 必须保留
# 关键决策必须保留
```

---

## 执行脚本

**位置**：`.agents/skills/prune-system-prompts/scripts/prune.js`

**工作流程**：
```javascript
async function main() {
  // 1. 扫描 workspace 文件大小
  const files = scanFiles();
  
  // 2. 识别可以精简的文件
  const toPrune = identifyFilesToPrune(files);
  
  // 3. 自动精简
  for (const file of toPrune) {
    pruneFile(file);
  }
  
  // 4. 生成精简报告
  generateReport();
}
```

---

## 配置

**crontab 配置**（可选）：
```bash
# 每周运行一次（周日 00:00）
0 0 * * 0 cd /Users/fox/.openclaw/workspace && node .agents/skills/prune-system-prompts/scripts/prune.js
```

---

## 输出

**日志位置**：
- `/tmp/huajuan-prune.log` - 完整精简日志

**输出格式**：
```
🔍 Prune System Prompts
=======================

📊 扫描文件:
  AGENTS.md: 7.1KB ✅ 需要精简
  MEMORY.md: 3.0KB ✅ 无需精简
  NOW.md: 1.9KB ✅ 无需精简
  memory/2026-03-10.md: 15.2KB ⚠️  需要精简

📊 精简结果:
  AGENTS.md: 7.1KB → 4.0KB ✅ 节省44%
  memory/2026-03-10.md: 15.2KB → 2.0KB ✅ 节省87%

📊 总节省:
  Token: 16.4KB → 8KB（节省51%）
```

---

## 优势

**相比手动精简**：
- ✅ 自动化，无需人工干预
- ✅ 可配置阈值
- ✅ 保留关键信息
- ✅ 生成详细报告
- ✅ 可回滚（备份原文件）

---

_最后更新：2026-03-10_
_版本：1.0.0_
_状态：已创建_
