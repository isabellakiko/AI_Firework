# Docker 镜像版本快速切换指南

## 📖 文档用途

本指南说明**如何在官方版本和品牌化版本之间快速切换**，无需重新构建镜像。

**适用场景**：
- 需要对比官方版本和品牌化版本
- 临时切换回官方版本测试
- 需要展示品牌化效果
- 验证修改前后的区别

---

## 🔑 核心概念

### 关键理解

**一行代码切换**：只需修改 `docker-compose.yaml` 的一行配置，就能在两个版本之间切换。

**为什么这么简单？**
- 两个 Docker 镜像都已经存在于系统中
- Docker Compose 只是**选择使用哪个镜像**
- 不需要重新构建，不需要重新下载
- 切换时间：约 10 秒

---

## 📦 可用的镜像版本

查看当前系统中的镜像：
```bash
docker images | grep dify-web
```

**输出示例**：
```
REPOSITORY           TAG                    IMAGE ID       CREATED        SIZE
langgenius/dify-web  brand-customization    d3b33c34b66d   1 天前         780MB
langgenius/dify-web  1.8.0                  d658a0d0ecf1   2 月前         777MB
```

### 两个版本对比

| 镜像标签 | 版本说明 | 视觉效果 |
|---------|---------|---------|
| `brand-customization` | 🎨 自定义品牌化版本 | 深灰侧边栏 + 黄色按钮 |
| `1.8.0` | 🏢 官方默认版本 | 白色侧边栏 + 蓝色按钮 |

---

## 🚀 快速切换方法

### 方法一：切换到官方版本

**步骤**：

1. **修改配置文件**

编辑 `docker/docker-compose.yaml` 第 659 行：

```yaml
# 修改前（品牌化版本）
web:
  image: langgenius/dify-web:brand-customization

# 修改后（官方版本）
web:
  image: langgenius/dify-web:1.8.0
```

2. **重启容器**

```bash
cd docker
docker compose restart web
```

3. **验证效果**

访问 http://localhost:80

**预期效果**：
- ✅ 侧边栏显示为白色/浅色
- ✅ New Chat 按钮显示为蓝色
- ✅ 发送按钮显示为蓝色
- ✅ 输入框文字显示为深色

---

### 方法二：切换到品牌化版本

**步骤**：

1. **修改配置文件**

编辑 `docker/docker-compose.yaml` 第 659 行：

```yaml
# 修改前（官方版本）
web:
  image: langgenius/dify-web:1.8.0

# 修改后（品牌化版本）
web:
  image: langgenius/dify-web:brand-customization
```

2. **重启容器**

```bash
cd docker
docker compose restart web
```

3. **验证效果**

访问 http://localhost:80

**预期效果**：
- ✅ 侧边栏显示为深灰色 #615e5f
- ✅ New Chat 按钮显示为黄色 #f2c823
- ✅ 发送按钮显示为黄色 #f2c823
- ✅ 输入框文字显示为黄色 #f2c823

---

## 📋 详细操作步骤

### 步骤 1：修改 docker-compose.yaml

**文件位置**：
```
docker/docker-compose.yaml
```

**修改位置**：第 659 行

**原始内容**：
```yaml
services:
  # ... 其他服务 ...

  web:
    image: langgenius/dify-web:brand-customization  # ← 修改这一行
    restart: always
    environment:
      # ... 环境变量 ...
```

**修改内容**：
- 官方版本：改为 `langgenius/dify-web:1.8.0`
- 品牌化版本：改为 `langgenius/dify-web:brand-customization`

---

### 步骤 2：重启 Web 容器

**进入 Docker 目录**：
```bash
cd /Users/stephen/Downloads/00_project/08_Dify_测试整体效果/01_测试前端分离/docker
```

**重启容器**：
```bash
docker compose restart web
```

**输出示例**：
```
Container docker-web-1  Restarting
Container docker-web-1  Started
```

**验证容器状态**：
```bash
docker compose ps | grep web
```

**输出示例**：
```
docker-web-1   langgenius/dify-web:1.8.0   Up 5 seconds   3000/tcp
```

**检查日志**（确认无错误）：
```bash
docker compose logs web --tail=10
```

**成功标志**：
```
✓ Ready in 47ms
PM2 log: App [dify-web] online
```

---

### 步骤 3：验证切换效果

**访问地址**：http://localhost:80

**验证清单**：
- [ ] 页面正常加载
- [ ] 看到预期的样式（官方 or 品牌化）
- [ ] 无控制台错误
- [ ] 功能正常工作

**对比要点**：

| 检查项 | 官方版本 (1.8.0) | 品牌化版本 (brand-customization) |
|--------|-----------------|--------------------------------|
| 侧边栏背景 | 白色/浅色 | 深灰色 #615e5f |
| New Chat 按钮 | 蓝色 #155aef | 黄色 #f2c823 |
| 发送按钮 | 蓝色 #155aef | 黄色 #f2c823 |
| 发送按钮图标 | 白色 | 深灰色 #615e5f |
| 输入框文字 | 深色 #1d2939 | 黄色 #f2c823 |
| 选中对话 | 蓝色强调 | 黄色强调 #f2c823 |

---

## ⚡ 常用命令速查

### 查看当前使用的镜像

```bash
cd docker
docker compose ps | grep web
```

**输出解读**：
```
docker-web-1   langgenius/dify-web:brand-customization   Up 2 hours   3000/tcp
                                  ↑
                          这里显示当前使用的镜像标签
```

---

### 查看所有可用镜像

```bash
docker images | grep dify-web
```

**输出示例**：
```
langgenius/dify-web   brand-customization   d3b33c34b66d   1 天前   780MB
langgenius/dify-web   1.8.0                 d658a0d0ecf1   2 月前   777MB
```

---

### 完整切换命令（一键复制）

**切换到官方版本**：
```bash
# 1. 修改 docker-compose.yaml 第 659 行为：
#    image: langgenius/dify-web:1.8.0

# 2. 重启容器
cd /Users/stephen/Downloads/00_project/08_Dify_测试整体效果/01_测试前端分离/docker
docker compose restart web

# 3. 验证
docker compose ps | grep web
```

**切换到品牌化版本**：
```bash
# 1. 修改 docker-compose.yaml 第 659 行为：
#    image: langgenius/dify-web:brand-customization

# 2. 重启容器
cd /Users/stephen/Downloads/00_project/08_Dify_测试整体效果/01_测试前端分离/docker
docker compose restart web

# 3. 验证
docker compose ps | grep web
```

---

## 🎯 使用场景示例

### 场景 1：对比展示品牌化效果

**需求**：向客户展示品牌化前后的对比

**操作**：
1. 访问 http://localhost:80（当前品牌化版本）
2. 截图保存
3. 切换到官方版本（修改配置 + 重启）
4. 刷新页面，截图保存
5. 对比两张截图展示差异

**耗时**：约 1 分钟

---

### 场景 2：临时测试官方版本功能

**需求**：验证某个功能是否是官方版本的行为

**操作**：
1. 切换到官方版本
2. 测试功能
3. 切换回品牌化版本
4. 继续开发

**耗时**：每次切换约 10 秒

---

### 场景 3：验证修改是否正确

**需求**：确认某个样式修改只影响品牌化版本

**操作**：
1. 在品牌化版本中查看修改效果
2. 切换到官方版本
3. 确认官方版本未受影响
4. 切换回品牌化版本

**耗时**：约 30 秒

---

## 🚨 常见问题

### Q1: 切换后看不到效果？

**A**: 可能的原因

1. **浏览器缓存**
   - 解决：强制刷新（Cmd+Shift+R / Ctrl+Shift+F5）

2. **容器未重启**
   - 解决：确认执行了 `docker compose restart web`

3. **修改了错误的文件**
   - 解决：确认修改的是 `docker/docker-compose.yaml`

4. **修改了错误的行**
   - 解决：确认修改的是第 659 行的 `image:` 配置

---

### Q2: 切换需要多长时间？

**A**: 时间分解

| 步骤 | 时间 |
|------|------|
| 修改配置文件 | ~5 秒 |
| 重启容器 | ~5 秒 |
| 页面刷新 | ~1 秒 |
| **总计** | **~10 秒** |

**对比**：
- 切换镜像：10 秒
- 重新构建镜像：5-10 分钟

---

### Q3: 切换会丢失数据吗？

**A**: 不会！

**原因**：
- 用户数据存储在数据库容器中（`docker-db-1`）
- 对话历史、配置等都不在 Web 容器中
- 切换 Web 镜像不影响数据库
- 所有数据都会保留

**验证**：
1. 在品牌化版本中创建对话
2. 切换到官方版本
3. 对话历史依然存在
4. 切换回品牌化版本
5. 数据完整无损

---

### Q4: 可以删除某个镜像吗？

**A**: 可以，但需谨慎

**删除官方镜像**（不推荐）：
```bash
docker rmi langgenius/dify-web:1.8.0
```

**删除品牌化镜像**（可以重新构建）：
```bash
docker rmi langgenius/dify-web:brand-customization
```

**注意**：
- 删除后需要重新下载或构建
- 建议保留两个镜像以便快速切换
- 磁盘空间不足时再考虑删除

---

### Q5: 如何查看当前使用哪个版本？

**A**: 三种方法

**方法 1：查看容器状态**
```bash
docker compose ps | grep web
```

**方法 2：查看配置文件**
```bash
grep "image:" docker/docker-compose.yaml | grep web
```

**方法 3：查看页面样式**
- 侧边栏是深灰色 → 品牌化版本
- 侧边栏是白色 → 官方版本

---

## 📊 切换对比表

### 视觉效果对比

| 元素 | 官方版本 (1.8.0) | 品牌化版本 (brand-customization) |
|------|-----------------|--------------------------------|
| **侧边栏** |  |  |
| - 背景色 | 白色/浅色 | 深灰色 #615e5f |
| - 应用标题 | 深色 | 浅色 #f9fafb |
| - 对话列表文字 | 深色 | 浅灰 #e0e0e0 |
| - 选中对话 | 蓝色背景 | 黄色文字 + 半透明黄色背景 |
| **按钮** |  |  |
| - New Chat 按钮 | 蓝色 #155aef | 黄色 #f2c823 |
| - 发送按钮 | 蓝色 #155aef | 黄色 #f2c823 |
| - 发送按钮图标 | 白色 | 深灰 #615e5f |
| **发送框** |  |  |
| - 输入框文字 | 深色 #1d2939 | 黄色 #f2c823 |
| - Placeholder | 灰色 | 黄色 70% 透明 |
| - Focus 边框 | 蓝色 | 黄色 #f2c823 |
| - Focus 发光 | 蓝色 | 浅黄色 |

---

### 技术细节对比

| 项目 | 官方版本 | 品牌化版本 |
|------|---------|-----------|
| 镜像标签 | `1.8.0` | `brand-customization` |
| 镜像大小 | 777MB | 780MB |
| 构建时间 | - | ~2 分钟 |
| 修改文件数 | 0 | 10 |
| 修改代码行数 | 0 | 14 处 |
| Git 提交 | 官方代码 | +5 提交 |

---

## 🛠 进阶技巧

### 同时运行两个版本

如果需要同时对比两个版本：

**方法 1：使用不同端口**
```yaml
# docker-compose.yaml
web:
  image: langgenius/dify-web:1.8.0
  ports:
    - "8080:3000"  # 映射到不同端口

web-brand:
  image: langgenius/dify-web:brand-customization
  ports:
    - "8081:3000"
```

**方法 2：使用本地开发 + Docker**
```bash
# Docker 运行官方版本（http://localhost:80）
cd docker
docker compose up -d

# 本地运行品牌化版本（http://localhost:3000）
cd ../web
pnpm dev
```

---

### 创建版本标签

为了更好地管理，可以创建多个版本：

```bash
# 创建版本 1.0
docker tag langgenius/dify-web:brand-customization \
           langgenius/dify-web:brand-v1.0

# 创建版本 2.0（有新修改后）
docker build -t langgenius/dify-web:brand-v2.0 ./web

# 在 docker-compose.yaml 中使用
image: langgenius/dify-web:brand-v1.0  # 或 brand-v2.0
```

---

## 📖 相关文档

- [前端修改后重新部署指南](./前端修改后重新部署指南.md) - 如何构建新的 Docker 镜像
- [2025-10-29-Docker部署品牌化镜像.md](./修改记录/2025-10-29-Docker部署品牌化镜像.md) - 首次部署品牌化镜像的记录
- [修改记录索引](./修改记录/README.md) - 所有品牌化修改的详细记录

---

## 🔄 快速参考卡片

```
┌─────────────────────────────────────────────────┐
│  Docker 镜像版本快速切换 - 10 秒完成             │
├─────────────────────────────────────────────────┤
│                                                 │
│  📝 修改文件                                     │
│     docker/docker-compose.yaml (第 659 行)      │
│                                                 │
│  🏢 切换到官方版本                               │
│     image: langgenius/dify-web:1.8.0            │
│                                                 │
│  🎨 切换到品牌化版本                             │
│     image: langgenius/dify-web:                 │
│            brand-customization                  │
│                                                 │
│  🔄 重启容器                                     │
│     cd docker && docker compose restart web     │
│                                                 │
│  ✅ 验证效果                                     │
│     http://localhost:80                         │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

*创建日期：2025-10-29*
*最后更新：2025-10-29*
