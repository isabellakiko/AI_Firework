# AI 恢复记忆指南

## 📖 文档用途

**适用场景**：当 Claude Code 新进入本项目时，按照本指南恢复项目上下文和开发记忆。

**核心理念**：不是阅读所有细节，而是**系统化地**按优先级获取关键信息，快速建立项目全貌。

---

## 🚀 快速恢复流程（5分钟）

### 第1步：读取核心索引（必读）

**按顺序读取这3个文档**：

```bash
1. dev-notes/README.md                    # 项目总览和进度
2. dev-notes/修改记录/README.md           # 修改记录索引
3. dev-notes/04-组件位置索引.md           # 组件文件速查
```

**目标**：
- ✅ 了解项目背景和目标
- ✅ 知道已完成的工作（2次提交、14处修改）
- ✅ 掌握品牌色体系（黄色 #f2c823 + 深灰 #615e5f）
- ✅ 快速定位组件文件位置

---

### 第2步：了解最新修改（重要）

**读取最新的2个修改记录**：

```bash
1. dev-notes/修改记录/2025-10-28-方案1品牌配色实现.md    # 侧边栏品牌化
2. dev-notes/修改记录/2025-10-28-发送框品牌化定制.md    # 发送框品牌化
```

**目标**：
- ✅ 理解每处修改的原因、位置、代码
- ✅ 知道修复了哪些原代码 bug
- ✅ 掌握品牌色的应用规则

---

### 第3步：验证环境状态（检查）

**运行这些命令**：

```bash
# 检查 Git 状态
git status
git log --oneline -3

# 检查 Docker 状态（如果需要启动后端）
cd docker && docker compose ps

# 检查前端是否运行（如果需要测试）
# curl http://localhost:3000
```

**目标**：
- ✅ 确认当前分支（应该是 `feature/brand-customization`）
- ✅ 确认工作树状态（应该是干净的）
- ✅ 确认后端是否运行

---

## 📚 深度探索流程（按需）

### 当需要了解项目背景时

**读取**：`dev-notes/01-项目背景.md`

**内容**：
- 为什么需要前后端分离
- 技术栈详情
- 遇到的核心挑战

---

### 当需要了解环境配置时

**读取**：`dev-notes/02-配置进度.md`

**内容**：
- 7步环境配置详解
- Docker 端口映射配置
- 前端环境变量配置
- 插件安装问题解决

---

### 当需要了解组件架构时

**读取**：`dev-notes/03-聊天页面探索.md`

**内容**：
- 5层组件层次结构
- 页面布局详解
- 状态管理说明

---

### 当需要修改特定组件时

**查看**：`dev-notes/04-组件位置索引.md`

**用法**：
- 按功能查找组件文件位置
- 查看关键修改位置和行号
- 了解常见修改场景

---

## 🎯 关键信息速查

### 项目路径
```
/Users/stephen/Downloads/00_project/08_Dify_测试整体效果/01_测试前端分离
```

### 开发环境
- **后端**：Docker（http://localhost:5001）
- **前端**：pnpm dev（http://localhost:3000）
- **目标页面**：http://localhost:3000/chat/l8BpY79pZD0AVs9E
- **应用名称**：YBP消防助手

### 品牌色
- **黄色**：`#f2c823`（行动按钮、输入文字、强调状态）
- **深灰**：`#615e5f`（侧边栏背景、图标）

### Git 状态
- **当前分支**：`feature/brand-customization`
- **主分支**：`main`
- **提交数**：4 次（2次功能 + 2次文档）

### 已修改文件（10个）
```
侧边栏品牌化（7个文件）：
- web/app/components/base/chat/chat-with-history/index.tsx
- web/app/components/base/chat/chat-with-history/sidebar/index.tsx
- web/app/components/base/chat/chat-with-history/sidebar/item.tsx
- web/app/components/base/chat/chat-with-history/sidebar/list.tsx
- web/app/components/base/chat/chat-with-history/header-in-mobile.tsx
- web/app/components/base/button/index.css
- web/themes/light.css

发送框品牌化（3个文件）：
- web/app/components/base/chat/chat/chat-input-area/index.tsx
- web/app/components/base/chat/chat/chat-input-area/operation.tsx
- web/themes/light.css

环境配置（2个文件）：
- docker/docker-compose.yaml
- web/.env.local
```

---

## 💡 工作流程建议

### 当用户要求新的样式修改时

1. **先探索**：使用 Glob/Grep 查找相关组件
2. **读取代码**：Read 工具读取目标文件
3. **提出方案**：说明修改思路，等待用户确认
4. **执行修改**：使用 Edit 工具修改代码
5. **创建记录**：在 `dev-notes/修改记录/` 创建新文档
6. **Git 提交**：使用规范的提交信息

### 当用户要求恢复记忆时

1. **告知用户**：正在恢复项目记忆
2. **按流程执行**：按照本指南的"快速恢复流程"执行
3. **总结汇报**：简要汇报项目状态和已完成工作
4. **等待指令**：询问用户下一步要做什么

### 当遇到不清楚的信息时

**优先查找顺序**：
1. 查看 `04-组件位置索引.md`（文件位置）
2. 查看 `修改记录/README.md`（修改历史）
3. 使用 Grep 搜索相关代码
4. 询问用户

---

## 🔧 常用命令速查

### 启动开发环境
```bash
# 启动 Docker 后端
cd /Users/stephen/Downloads/00_project/08_Dify_测试整体效果/01_测试前端分离/docker
docker compose up -d

# 启动前端（新终端）
cd /Users/stephen/Downloads/00_project/08_Dify_测试整体效果/01_测试前端分离/web
pnpm dev
```

### Git 操作
```bash
# 查看状态
git status
git log --oneline -5

# 查看修改
git diff
git show <commit-hash>

# 提交修改
git add .
git commit -m "..."
```

### 文件搜索
```bash
# 使用 Glob 工具查找文件
pattern: "**/*sidebar*.tsx"

# 使用 Grep 工具搜索内容
pattern: "button|发送"
output_mode: "files_with_matches"
```

---

## 📋 恢复记忆检查清单

完成快速恢复流程后，确认以下信息：

- [ ] 知道项目是 Dify 1.8.0 前端样式定制
- [ ] 知道品牌色是黄色 #f2c823 + 深灰 #615e5f
- [ ] 知道已完成侧边栏和发送框品牌化
- [ ] 知道当前在 feature/brand-customization 分支
- [ ] 知道如何查找组件文件位置
- [ ] 知道如何创建修改记录文档
- [ ] 知道热更新环境已配置好

---

## 🎯 记忆恢复模板（复制使用）

**当用户说"恢复记忆"或"查看项目状态"时，使用此模板回复**：

```
好的！我正在恢复项目记忆...

[读取 3 个核心文档...]
[读取最新修改记录...]

✅ 记忆恢复完成！

## 项目状态
- 📁 项目：Dify 1.8.0 前端样式定制（YBP消防助手）
- 🎨 品牌色：黄色 #f2c823 + 深灰 #615e5f
- ✅ 已完成：侧边栏品牌化 + 发送框品牌化
- 📊 成果：2次Git提交，14处修改，10个文件
- 🌿 分支：feature/brand-customization
- 📝 文档：完整（4个基础文档 + 3个修改记录）

## 环境状态
- ✅ Docker 后端：http://localhost:5001
- ✅ 前端开发：http://localhost:3000
- ✅ 热更新：正常工作

准备就绪！请问接下来需要做什么？
```

---

## 🚨 重要提醒

1. **每次修改前先探索**：不要盲目修改，理解现有代码结构
2. **等待用户确认**：提出方案后等用户说"开始"或"好的"再执行
3. **使用 TodoWrite**：复杂任务使用 TodoWrite 跟踪进度
4. **记录所有修改**：每次修改后创建详细的文档记录
5. **注意三种侧边栏**：修改侧边栏时考虑正常/Hover/移动端三种模式

---

## 📖 相关文档

- [项目总览](./README.md)
- [项目背景](./01-项目背景.md)
- [配置进度](./02-配置进度.md)
- [聊天页面探索](./03-聊天页面探索.md)
- [组件位置索引](./04-组件位置索引.md)
- [修改记录索引](./修改记录/README.md)

---

*创建日期：2025-10-28*
*最后更新：2025-10-28*
