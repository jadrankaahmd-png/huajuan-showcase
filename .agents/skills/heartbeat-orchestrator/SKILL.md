---
name: heartbeat-orchestrator
description: 统一调度 Heartbeat 5件事（回顾、日记、扫描、健康检查、刷新状态板），每30分钟自动运行，协调5个子 skill。当用户说"运行 heartbeat"、"执行心跳检查"、"检查系统状态"、"刷新状态板"时使用。
---

# Heartbeat Orchestrator

## 什么时候使用

**自动触发**：
- ✅ crontab 每30分钟触发
- ✅ 手动运行 `node .agents/skills/heartbeat-orchestrator/scripts/orchestrator.js`

**作用**：
- 协调5个子 skill 的执行
- 管理执行顺序和依赖
- 汇总执行结果
- 更新 NOW.md 状态

---

## 执行流程

```
heartbeat-orchestrator
  ↓
1. review-last-24h（回顾最近24小时）
  ↓
2. journal-events（记录重要事件）
  ↓
3. scan-environment（扫描环境变化）
  ↓
4. health-check（健康检查）
  ↓
5. refresh-dashboard（刷新状态板）
  ↓
汇总报告
```

---

## 依赖的5个子 skill

### **1. review-last-24h**
**位置**：`.agents/skills/review-last-24h/`
**功能**：回顾最近24小时的工作、完成的任务、重要决策

### **2. journal-events**
**位置**：`.agents/skills/journal-events/`
**功能**：记录重要事件和学习到 memory/YYYY-MM-DD.md

### **3. scan-environment**
**位置**：`.agents/skills/scan-environment/`
**功能**：扫描 Git 状态、数据变化、环境变化

### **4. health-check**
**位置**：`.agents/skills/health-check/`
**功能**：检查 Redis 数据完整性、Git 同步状态、系统健康

### **5. refresh-dashboard**
**位置**：`.agents/skills/refresh-dashboard/`
**功能**：更新 NOW.md 统计、刷新状态板、更新总能力数

---

## 执行脚本

**位置**：`.agents/skills/heartbeat-orchestrator/scripts/orchestrator.js`

**工作流程**：
```javascript
async function main() {
  // 1. 回顾最近24小时
  await runSkill('review-last-24h');
  
  // 2. 记录重要事件
  await runSkill('journal-events');
  
  // 3. 扫描环境变化
  await runSkill('scan-environment');
  
  // 4. 健康检查
  await runSkill('health-check');
  
  // 5. 刷新状态板
  await runSkill('refresh-dashboard');
  
  // 6. 生成汇总报告
  generateSummaryReport();
}
```

---

## 配置

**crontab 配置**：
```bash
*/30 * * * * cd /Users/fox/.openclaw/workspace && node .agents/skills/heartbeat-orchestrator/scripts/orchestrator.js >> /tmp/huajuan-heartbeat.log 2>&1
```

---

## 输出

**日志位置**：
- `/tmp/huajuan-heartbeat.log` - 完整执行日志
- `memory/YYYY-MM-DD.md` - 每日日记（journal-events 写入）
- `NOW.md` - 当前状态（refresh-dashboard 更新）

**输出格式**：
```
🔍 Heartbeat Orchestrator
=========================

1️⃣  Review: ✅ 完成
2️⃣  Journal: ✅ 完成
3️⃣  Scan: ✅ 完成
4️⃣  Health Check: ✅ Redis 正常（714条）
5️⃣  Refresh Dashboard: ✅ NOW.md 已更新

📊 汇总报告:
- 任务完成: 5/5
- 用时: 12秒
- 下次执行: 19:28
```

---

## 优势

**相比原 heartbeat.js**：
- ✅ 每个子 skill 独立可测试
- ✅ 可以单独运行某个子 skill
- ✅ 更容易维护和扩展
- ✅ 符合 OpenClaw skill 嵌套最佳实践
- ✅ 减少 heartbeat.js 的代码量

---

_最后更新：2026-03-10_
_版本：1.0.0_
_状态：已创建_
