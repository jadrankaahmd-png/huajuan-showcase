# Mockdown - ASCII Wireframe 编辑器

**来源**：mockdown.design  
**日期**：2026-03-10  
**类型**：AI 辅助设计工具

---

## 📋 核心概念

### **一句话总结**
> "AI agents read markdown better than they read your mind. Draw a wireframe in ASCII, paste it into Claude Code, get a working page back."

**翻译**：
> "AI 读取 markdown 比读取你的想法更好。用 ASCII 绘制 wireframe，粘贴到 Claude Code，获得可工作的页面。"

---

## 🔍 工具特性

### **1. ASCII Wireframe 编辑器**

**组件（20+）**：
- **基础组件**：Button, Input, Text, Line, Arrow, Box
- **高级组件**：Card, Table, Modal, Tabs, Image
- **绘图工具**：Pencil, Brush, Select

**特点**：
- ✅ 免费浏览器工具
- ✅ 无需注册
- ✅ 拖放式操作
- ✅ 导出为 Markdown

---

### **2. AI 辅助编程设计**

**核心理念**：
- ✅ AI 读取 wireframe 比读取文字描述更快
- ✅ 30秒绘制一个页面
- ✅ 粘贴到 Claude Code → 生成完整代码

**工作流程**：
```
1. 在 Mockdown 绘制 ASCII wireframe
   ↓
2. 导出为 Markdown
   ↓
3. 粘贴到 Claude Code
   ↓
4. Claude Code 生成完整页面
```

---

### **3. 与 Claude Code 集成**

**使用方法**：
1. 打开 https://mockdown.design
2. 拖放组件绘制 UI
3. 复制 Markdown 输出
4. 粘贴到 Claude Code
5. Claude Code 生成 HTML/CSS/React 代码

**示例**：

**ASCII Wireframe**：
```
+----------------------------------+
|  Logo          [Menu] [Cart]     |
+----------------------------------+
|                                  |
|  [Hero Image]                    |
|                                  |
|  Welcome to Our Store            |
|  [Shop Now]                      |
|                                  |
+----------------------------------+
|  Products                        |
|  +--------+  +--------+          |
|  | Item 1 |  | Item 2 |          |
|  | $99    |  | $149   |          |
|  +--------+  +--------+          |
+----------------------------------+
```

**Claude Code 生成**：
```html
<header>
  <div class="logo">Logo</div>
  <nav>
    <a href="#">Menu</a>
    <a href="#">Cart</a>
  </nav>
</header>

<section class="hero">
  <img src="hero.jpg" alt="Hero">
  <h1>Welcome to Our Store</h1>
  <button>Shop Now</button>
</section>

<section class="products">
  <div class="product">
    <img src="item1.jpg" alt="Item 1">
    <p>Item 1 - $99</p>
  </div>
  <div class="product">
    <img src="item2.jpg" alt="Item 2">
    <p>Item 2 - $149</p>
  </div>
</section>
```

---

## 💡 对花卷第一层的帮助

### **1. 快速原型设计能力**

**应用场景**：
- ✅ 快速设计新页面原型
- ✅ 测试 UI 布局
- ✅ 验证设计想法

**具体功能**：
1. 设计花卷第三层选股页面
2. 测试新的组件布局
3. 优化现有 UI

---

### **2. ASCII Wireframe → 代码生成**

**应用场景**：
- ✅ 文字描述 → UI 原型
- ✅ 原型 → 可用代码
- ✅ 快速迭代

**具体功能**：
1. 子涵描述想法 → ASCII wireframe
2. ASCII wireframe → React 组件
3. 快速验证和调整

---

### **3. UI 设计效率提升**

**对比传统方法**：
```
传统：
  文字描述（5分钟）
  ↓
  AI 理解（不准确）
  ↓
  生成代码（不符合预期）
  ↓
  多次修改（30分钟）
  总计：35分钟

Mockdown：
  ASCII wireframe（2分钟）
  ↓
  AI 准确理解
  ↓
  生成代码（符合预期）
  ↓
  小幅调整（5分钟）
  总计：7分钟

效率提升：5倍 ✅
```

---

## 🎯 可以做哪些具体功能

### **短期（本周）**

#### **1. 设计花卷第三层选股页面**

**步骤**：
1. 在 Mockdown 绘制选股页面布局
2. 导出 Markdown
3. 粘贴到 Claude Code
4. 生成 React 组件

**预计时间**：10分钟

---

#### **2. 优化现有 UI 组件**

**步骤**：
1. 绘制优化后的组件布局
2. 生成新代码
3. 对比和调整

**预计时间**：5分钟/组件

---

### **中期（2周内）**

#### **1. 建立花卷 UI 组件库**

**内容**：
- 导航栏组件
- 卡片组件
- 按钮组件
- 表单组件

**价值**：
- ✅ 统一设计语言
- ✅ 快速复用
- ✅ 提升开发效率

---

#### **2. 自动化设计流程**

**流程**：
```
子涵描述想法
  ↓
花卷生成 ASCII wireframe
  ↓
Claude Code 生成代码
  ↓
自动测试和优化
```

---

### **长期（1月内）**

#### **1. 集成到花卷工作流**

**功能**：
- ✅ 自动生成 UI 原型
- ✅ 快速迭代设计
- ✅ 版本控制

---

## 📊 技术细节

### **Markdown 格式示例**

```markdown
# Homepage

+----------------------------------+
|  Logo          [Menu] [Cart]     |
+----------------------------------+
|                                  |
|  [Hero Image]                    |
|                                  |
|  Welcome to Our Store            |
|  [Shop Now]                      |
|                                  |
+----------------------------------+
```

### **Claude Code 命令**

```bash
# 生成 React 组件
claude-code generate component <<EOF
+----------------------------------+
|  Logo          [Menu] [Cart]     |
+----------------------------------+
EOF

# 生成完整页面
claude-code generate page <<EOF
[ASCII wireframe]
EOF
```

---

## 🔗 相关资源

**官网**：https://mockdown.design  
**About 页面**：https://www.mockdown.design/about  
**GitHub**：（待查找）

---

## ⚠️ 注意事项

1. **需要 Claude Code**：依赖 Claude Code 或 Cursor
2. **学习曲线**：需要熟悉 ASCII wireframe 语法
3. **精度限制**：复杂 UI 可能需要手动调整

---

## 💡 最佳实践

### **1. 简单布局优先**
- 先绘制简单布局
- 逐步添加细节
- 避免过度复杂

### **2. 使用标准组件**
- 使用 Mockdown 提供的组件
- 避免自定义复杂组件
- 保持一致性

### **3. 迭代优化**
- 生成代码后快速验证
- 根据反馈调整 wireframe
- 多次迭代优化

---

_最后更新：2026-03-10_
_来源：mockdown.design_
_状态：已加入能力库_
