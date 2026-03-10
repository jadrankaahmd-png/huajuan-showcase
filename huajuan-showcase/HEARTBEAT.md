# HEARTBEAT.md - 花卷定期唤醒任务清单

**作用**：定期唤醒花卷执行5件事，保持系统活跃和自我监控  
**配置**：crontab 定期唤醒（每30分钟）  
**日期**：2026-03-10

---

## 🌸 花卷唤醒必须执行的5件事

### 1️⃣ **回顾（Review）**
- 回顾最近24小时的工作
- 检查完成的任务
- 记录重要决策
- 总结学习要点

**执行**：
```bash
- 读取 memory/YYYY-MM-DD.md
- 检查任务完成情况
- 更新 MEMORY.md
```

---

### 2️⃣ **日记（Journal）**
- 记录重要事件和学习
- 写入 `memory/YYYY-MM-DD.md`
- 保存关键信息
- 更新长期记忆

**执行**：
```bash
- 写入 memory/YYYY-MM-DD.md
- 更新 MEMORY.md（如果是重要事件）
```

---

### 3️⃣ **扫描（Scan）**
- 扫描环境和数据变化
- 检查邮箱（重要邮件）
- 检查日历（即将到来的事件）
- 检查天气（相关提醒）

**执行**：
```bash
- 检查邮箱：是否有未读重要邮件
- 检查日历：未来24小时事件
- 检查天气：是否有需要提醒的天气变化
```

---

### 4️⃣ **健康检查（Health Check）**
- 检查系统状态和数据完整性
- Redis 数据完整性验证
- Git 同步状态
- 统计数字准确性

**执行**：
```bash
- 运行 scripts/audit-security.js（每晚00:00）
- 验证 Redis 数据完整性
- 检查 Git 同步状态
```

---

### 5️⃣ **刷新状态板（Refresh Dashboard）**
- 更新统计和状态显示
- 更新能力总数
- 刷新知识库统计
- 同步最新数据

**执行**：
```bash
- 读取 Redis stats:total
- 更新 NOW.md（当前任务状态）
- 刷新统计数字
```

---

## 📊 执行优先级

1. **每30分钟**：回顾 + 日记 + 扫描
2. **每小时**：刷新状态板
3. **每晚00:00**：健康检查（完整审计）

---

## 🔄 Crontab 配置

```bash
# 每30分钟执行 Heartbeat
*/30 * * * * cd /Users/fox/.openclaw/workspace && node scripts/heartbeat.js >> /tmp/huajuan-heartbeat.log 2>&1

# 每晚00:00执行完整审计
0 0 * * * cd /Users/fox/.openclaw/workspace/huajuan-showcase && /opt/homebrew/bin/node scripts/audit-security.js >> /tmp/huajuan-audit-cron.log 2>&1
```

---

## 💾 持久化

**执行结果保存位置**：
- `/tmp/huajuan-heartbeat.log` - Heartbeat 执行日志
- `memory/YYYY-MM-DD.md` - 每日日记
- `MEMORY.md` - 长期记忆
- `NOW.md` - 当前状态

---

## ⚠️ 注意事项

1. **不要重复执行** - 检查上次执行时间，避免重复
2. **保持简洁** - 每次执行不超过5分钟
3. **错误处理** - 失败时记录日志，不影响下次执行
4. **资源限制** - 避免同时执行多个任务

---

_最后更新：2026-03-10 16:52_
_状态：5件事已定义_
_配置：crontab 每30分钟执行_
