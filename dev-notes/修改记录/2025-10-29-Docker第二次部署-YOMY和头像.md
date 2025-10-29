# Docker 第二次部署 - Powered by YOMY + 用户头像品牌化

## 修改信息

- **日期**：2025-10-29
- **部署批次**：第 2 次 Docker 部署
- **修改类型**：品牌化增强 + Docker 部署修复
- **影响范围**：Docker 部署环境（http://localhost:80）
- **测试状态**：✅ 已完成并验证通过

---

## 与第一次部署的区别

### 第一次部署（2025-10-29 早上）

**包含的修改**：
- ✅ 侧边栏品牌化（深灰背景 + 黄色按钮）
- ✅ 发送框品牌化（黄色发送按钮 + 黄色输入文字）

**部署时间**：凌晨 1:16
**镜像 SHA**：`d3b33c34b66d`

### 第二次部署（2025-10-29 下午）

**新增的修改**：
- ✅ Powered by YOMY（侧边栏底部品牌标识）
- ✅ 用户头像品牌化（深灰背景 + 黄色人物剪影）

**部署时间**：下午 17:27
**镜像 SHA**：`980129f247ea`
**Git 提交**：`07ff264e7` - "feat: 完成用户头像和品牌标识的品牌化定制"

---

## 部署背景

### 问题描述

第一次部署后，又增加了两个品牌化修改：
1. 将 "Powered by Dify" 改为 "Powered by YOMY"
2. 用户消息头像改为品牌色（深灰 + 黄色）

需要重新构建 Docker 镜像并部署，让这些新修改在 Docker 环境（http://localhost:80）中生效。

---

## 部署过程

### 步骤 1：确认 Git 状态

```bash
git status
```

**结果**：
```
On branch feature/brand-customization
nothing to commit, working tree clean
```

✅ 所有修改已提交（Git commit: `07ff264e7`）

---

### 步骤 2：构建新的 Docker 镜像

**执行命令**：
```bash
docker build -t langgenius/dify-web:brand-customization ./web
```

**构建时间**：~2.5 分钟

**构建输出**（关键信息）：
```
✓ Compiled successfully in 112s
✓ Generating static pages (29/29)
✓ Finalizing page optimization
🔧 Optimizing standalone output...
✅ Optimization complete!
```

**结果**：
- 新镜像 ID：`980129f247ea`
- 构建时间：2025-10-29 17:06:33
- 镜像大小：780MB
- 状态：✅ 构建成功

---

### 步骤 3：第一次尝试重启容器（失败）

**执行命令**：
```bash
cd docker
docker compose restart web
```

**结果**：
```
Container docker-web-1  Restarting
Container docker-web-1  Started
```

**验证**：访问 http://localhost:80

**问题**：❌ **看不到新的修改！**（Powered by YOMY 和新头像都没有）

---

## 🚨 踩坑记录 - 关键问题

### 问题现象

重启容器后，访问 http://localhost:80 仍然看不到新的品牌化修改（YOMY 和新头像）。

---

### 问题排查过程

#### 排查 1：检查容器使用的镜像

```bash
docker inspect docker-web-1 --format='Image: {{.Image}}'
```

**发现**：
- 容器使用的镜像 SHA：`d3b33c34b66d`
- 最新构建的镜像 SHA：`980129f247ea`

**结论**：容器使用的是**旧镜像**！

---

#### 排查 2：对比容器和镜像的创建时间

```bash
# 容器信息
docker inspect docker-web-1 --format='Created: {{.Created}}'
# 输出：Created: 2025-10-29T01:16:26（凌晨1点，8小时前）

# 镜像信息
docker image inspect langgenius/dify-web:brand-customization --format='Created: {{.Created}}'
# 输出：Created: 2025-10-29T09:06:33（刚才构建）
```

**时间线**：
```
01:16:26  容器创建（使用第一次部署的镜像 d3b33c34b66d）
   ↓
09:06:33  构建新镜像 (980129f247ea)
   ↓      覆盖了 brand-customization 标签
   ↓      旧镜像 d3b33c34b66d 变成 dangling
   ↓
09:07:10  执行 docker compose restart web
   ↓      ❌ 只重启了容器进程
   ↓      容器仍然绑定到创建时的镜像 (d3b33c34b66d)
```

**发现**：容器是在镜像构建**之前**创建的（8小时前），所以使用的是旧镜像的缓存层。

---

#### 排查 3：验证 docker-compose.yaml 配置

```bash
cat docker/docker-compose.yaml | grep -A 5 "web:"
```

**结果**：
```yaml
web:
  image: langgenius/dify-web:brand-customization  # ✅ 配置正确
```

**结论**：配置文件没问题。

---

### 根本原因分析

**核心问题**：`docker compose restart` **不会更新容器使用的镜像**！

#### Docker 命令对比

| 命令 | 作用 | 是否使用新镜像 | 适用场景 |
|------|------|--------------|---------|
| `docker compose restart web` | 停止并启动容器**进程** | ❌ 否 | 修改环境变量、配置后重启 |
| `docker compose up -d web` | 检查并可能重建容器 | ⚠️ 可能不会 | 配置文件有变化时 |
| `docker compose up -d --force-recreate web` | **强制重新创建**容器 | ✅ **是** | 镜像更新后必须用这个 |
| `docker compose down && up -d` | 删除并重建所有容器 | ✅ 是 | 完全重置环境 |

#### 为什么 restart 不会更新镜像？

1. **容器创建时镜像绑定**：
   - 容器创建时，会绑定到具体的镜像层（SHA）
   - 即使镜像标签（tag）被覆盖，容器仍然使用创建时的镜像层

2. **restart 只重启进程**：
   - `restart` 命令只是停止和启动容器内的进程
   - 不会检查镜像标签是否更新
   - 不会重新创建容器
   - 容器的镜像绑定不变

3. **镜像标签覆盖机制**：
   - 构建新镜像时使用相同标签（`brand-customization`）
   - Docker 会将标签指向新镜像
   - 旧镜像变成 `<none>`（dangling）
   - 但已创建的容器仍引用旧镜像的层

---

### 正确的解决方案

**步骤 4：强制重新创建容器（成功）**

```bash
cd docker
docker compose up -d --force-recreate web
```

**输出**：
```
Container docker-web-1  Recreate
Container docker-web-1  Recreated
Container docker-web-1  Starting
Container docker-web-1  Started
```

**验证容器使用的镜像**：
```bash
docker inspect docker-web-1 --format='Image: {{.Image}}'
# 输出：sha256:980129f247ea...  ✅ 新镜像！
```

**对比结果**：

| 时间 | 容器创建时间 | 镜像 SHA | 包含修改 |
|------|------------|---------|---------|
| **之前** | 2025-10-29 01:16:26 | `d3b33c34b66d` | 侧边栏 + 发送框 |
| **现在** | 2025-10-29 09:27:45 | `980129f247ea` | 侧边栏 + 发送框 + YOMY + 头像 ✅ |

**容器日志**：
```
09:27:47 0|dify-web  |  ✓ Ready in 49ms
09:27:47 1|dify-web  |  ✓ Ready in 47ms
```

✅ 容器启动成功，使用新镜像！

---

## 经验总结

### 🔴 关键教训

1. **Docker 镜像更新后必须重新创建容器**
   - `restart` 不够，必须用 `--force-recreate`
   - 容器创建时绑定的镜像层不会自动更新

2. **验证容器使用的镜像 SHA**
   - 不能只看镜像标签，要检查实际的 SHA
   - 使用 `docker inspect` 验证容器使用的镜像

3. **理解 Docker 命令的区别**
   - `restart` = 重启进程
   - `up -d` = 可能重建（如果配置变了）
   - `up -d --force-recreate` = 必定重建

### 📝 标准 Docker 部署流程（修订版）

每次修改前端代码后的正确流程：

```bash
# 1. 确认 Git 提交
git add .
git commit -m "描述修改"

# 2. 构建新镜像
docker build -t langgenius/dify-web:brand-customization ./web

# 3. 强制重新创建容器（⭐ 关键步骤）
cd docker
docker compose up -d --force-recreate web

# 4. 验证镜像 SHA
docker inspect docker-web-1 --format='Image: {{.Image}}'

# 5. 检查日志
docker compose logs web --tail=20

# 6. 访问验证
# http://localhost:80
```

**时间消耗**：
- 构建镜像：2-3 分钟
- 重新创建容器：10-15 秒
- **总计**：~3 分钟

---

## 本次部署包含的修改

### 修改 1：Powered by YOMY

**文件**：`web/app/components/base/chat/chat-with-history/sidebar/index.tsx`

**位置**：第 156 行

**修改内容**：
```tsx
// 修改前
<DifyLogo size='small' />

// 修改后
<span className='system-xs-semibold-uppercase' style={{ color: '#f2c823' }}>YOMY</span>
```

**效果**：侧边栏底部 "Powered by" 后显示黄色 "YOMY" 文字

---

### 修改 2：用户头像品牌化

**文件 1**：`web/app/components/base/icons/assets/public/avatar/user.svg`

**修改内容**：
```svg
<!-- 背景：蓝色 → 深灰 -->
<rect fill="#615e5f" />

<!-- 头部和身体：白色 → 黄色 -->
<circle fill="#f2c823" />
<ellipse fill="#f2c823" />
```

**文件 2**：`web/app/components/base/icons/src/public/avatar/User.json` ⭐ **关键文件**

**修改内容**：
```json
{
  "rect": {
    "fill": "#615e5f"  // 背景改为深灰
  },
  "circle": {
    "opacity": "0.99",  // ⭐ 从 0.68 改为 0.99（避免颜色混合）
    "fill": "#f2c823"   // 头部改为黄色
  },
  "ellipse": {
    "opacity": "0.99",  // ⭐ 从 0.68 改为 0.99
    "fill": "#f2c823"   // 身体改为黄色
  }
}
```

**关键改进**：
- 不透明度从 68% → 99%
- 避免颜色混合：`(#f2c823 × 0.68) + (背景 × 0.32)` 会产生深橙色
- 99% 保持品牌色纯正

**效果**：用户消息头像显示为深灰背景 + 黄色人物剪影

---

## 完整的品牌化成果

### 部署验证清单

访问 http://localhost:80，确认以下效果：

- [x] **侧边栏背景**：深灰 #615e5f ✅
- [x] **New Chat 按钮**：黄色 #f2c823 ✅
- [x] **选中对话**：黄色强调 ✅
- [x] **发送按钮**：黄色背景 + 深灰图标 ✅
- [x] **输入框文字**：黄色 #f2c823 ✅
- [x] **输入框 Focus**：黄色边框 + 发光效果 ✅
- [x] **Powered by YOMY**：黄色文字 ✅ **新增**
- [x] **用户头像**：深灰背景 + 黄色人物 ✅ **新增**

### 品牌色应用统计

| 元素 | 颜色 | 用途 | 部署批次 |
|------|------|------|---------|
| 侧边栏背景 | #615e5f | 容器/专业 | 第1次 |
| New Chat 按钮 | #f2c823 | 行动号召 | 第1次 |
| 发送按钮 | #f2c823 | 行动号召 | 第1次 |
| 发送按钮图标 | #615e5f | 品牌呼应 | 第1次 |
| 输入文字 | #f2c823 | 品牌强调 | 第1次 |
| 选中对话 | #f2c823 | 强调状态 | 第1次 |
| **YOMY 品牌名** | **#f2c823** | **品牌标识** | **第2次** ⭐ |
| **用户头像背景** | **#615e5f** | **容器呼应** | **第2次** ⭐ |
| **用户头像人物** | **#f2c823** | **品牌主色** | **第2次** ⭐ |

---

## 技术要点

### Docker 镜像更新机制

1. **镜像标签 vs 镜像 SHA**
   - 标签（tag）只是一个指针，可以改变指向
   - SHA 是镜像内容的唯一标识，不可变
   - 容器绑定的是 SHA，不是标签

2. **容器的镜像绑定**
   ```
   docker create/run
         ↓
   容器创建时记录镜像 SHA
         ↓
   容器启动时使用该 SHA 的镜像层
         ↓
   即使标签指向新镜像，容器仍用旧 SHA
   ```

3. **为什么需要重新创建容器**
   - 只有创建容器时才会重新解析镜像标签
   - `restart` 不会重新创建，只重启进程
   - 必须删除旧容器，创建新容器

### 验证命令速查

```bash
# 查看容器使用的镜像 SHA
docker inspect <container> --format='{{.Image}}'

# 查看镜像的 SHA
docker images --no-trunc | grep <tag>

# 查看容器创建时间
docker inspect <container> --format='{{.Created}}'

# 查看镜像创建时间
docker image inspect <image> --format='{{.Created}}'

# 对比容器和镜像
echo "容器:" && docker inspect docker-web-1 --format='{{.Image}}' && \
echo "镜像:" && docker image inspect langgenius/dify-web:brand-customization --format='{{.Id}}'
```

---

## Git 提交信息

**提交哈希**：`07ff264e7`

**提交信息**：
```
feat: 完成用户头像和品牌标识的品牌化定制

- 将 "Powered by Dify" 替换为黄色 "YOMY" 文字
- 用户消息头像改为深灰背景 + 黄色人物剪影
- 调整头像不透明度至 99% 确保品牌色纯正
- 新增 2 个详细的修改记录文档

修改文件：
- sidebar/index.tsx: Powered by 品牌化
- user.svg + User.json: 用户头像品牌化

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

**包含文件**：
```
web/app/components/base/chat/chat-with-history/sidebar/index.tsx
web/app/components/base/icons/assets/public/avatar/user.svg
web/app/components/base/icons/src/public/avatar/User.json
dev-notes/修改记录/2025-10-29-Powered-by品牌化修改.md
dev-notes/修改记录/2025-10-29-用户头像品牌化修改.md
dev-notes/README.md
dev-notes/修改记录/README.md
```

---

## 文件修改总览

### 本次新增修改（第2次部署）

| 文件 | 修改类型 | 修改位置 | 说明 |
|------|---------|---------|------|
| `sidebar/index.tsx` | 代码修改 | 第 156 行 | DifyLogo → YOMY 文字 |
| `user.svg` | SVG 修改 | 第 3-5 行 | 颜色修改（源文件） |
| `User.json` | JSON 修改 | 第 28, 36, 40, 48, 53 行 | 颜色 + 不透明度修改 |

### 累计修改统计（两次部署）

**代码修改**：
- 第 1 次部署：14 处修改（10 个文件）
- 第 2 次部署：8 处修改（3 个文件）
- **总计**：22 处关键修改（12 个文件）

**Git 提交**：
- 侧边栏品牌化：`eff396de3`
- 发送框品牌化：`b45b9de50`
- YOMY + 头像：`07ff264e7`
- **总计**：3 次功能提交

**Docker 镜像**：
- 第 1 次：`d3b33c34b66d`（已覆盖）
- 第 2 次：`980129f247ea`（当前使用）

**文档记录**：
- 修改记录：7 个文档
- 指南文档：4 个文档
- **总计**：11 个文档

---

## 下次部署注意事项

### ⚠️ 必须使用 --force-recreate

**错误做法**：
```bash
docker compose restart web  # ❌ 不会使用新镜像
```

**正确做法**：
```bash
docker compose up -d --force-recreate web  # ✅ 强制重建容器
```

### 验证步骤

每次部署后必须验证：

1. **检查镜像 SHA 是否匹配**
   ```bash
   docker inspect docker-web-1 --format='{{.Image}}'
   docker image inspect langgenius/dify-web:brand-customization --format='{{.Id}}'
   # 两个 SHA 必须一致！
   ```

2. **检查容器创建时间**
   ```bash
   docker inspect docker-web-1 --format='{{.Created}}'
   # 必须是刚刚创建的时间，不是几小时前
   ```

3. **检查容器日志**
   ```bash
   docker compose logs web --tail=20
   # 确认 ✓ Ready 无错误
   ```

4. **浏览器验证**
   - 访问 http://localhost:80
   - 强制刷新（Cmd+Shift+R）
   - 检查所有品牌化元素

---

## 相关文档

- [前端修改后重新部署指南](../前端修改后重新部署指南.md) - 标准部署流程
- [2025-10-29-Docker部署品牌化镜像.md](./2025-10-29-Docker部署品牌化镜像.md) - 第一次部署记录
- [2025-10-29-Powered-by品牌化修改.md](./2025-10-29-Powered-by品牌化修改.md) - YOMY 修改详情
- [2025-10-29-用户头像品牌化修改.md](./2025-10-29-用户头像品牌化修改.md) - 头像修改详情
- [修改记录/README.md](./README.md) - 所有修改索引

---

## 未来优化建议

### 1. 自动化部署脚本

创建 `deploy.sh`：
```bash
#!/bin/bash
set -e

echo "🚀 开始部署..."

# 1. 检查 Git 状态
if [[ -n $(git status -s) ]]; then
  echo "❌ 有未提交的修改，请先提交"
  exit 1
fi

# 2. 构建镜像
echo "📦 构建 Docker 镜像..."
docker build -t langgenius/dify-web:brand-customization ./web

# 3. 强制重建容器
echo "🔄 重新创建容器..."
cd docker
docker compose up -d --force-recreate web

# 4. 验证
echo "✅ 验证部署..."
docker inspect docker-web-1 --format='镜像: {{.Image}}'
docker compose logs web --tail=5

echo "🎉 部署完成！访问 http://localhost:80"
```

### 2. 使用语义化版本

避免覆盖同名标签：
```bash
# 使用版本号
docker build -t langgenius/dify-web:brand-v1.0.0 ./web
docker build -t langgenius/dify-web:brand-v1.1.0 ./web

# 使用日期
docker build -t langgenius/dify-web:brand-2025-10-29 ./web
```

### 3. 镜像清理策略

定期清理 dangling 镜像：
```bash
# 查看悬空镜像
docker images -f "dangling=true"

# 清理悬空镜像
docker image prune -f
```

---

*创建日期：2025-10-29*
*部署时间：17:27*
*镜像 SHA：980129f247ea*
*容器状态：✅ 运行中*
