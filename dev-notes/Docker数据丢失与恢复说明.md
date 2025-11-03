# Docker 数据丢失与恢复说明

## 📋 文档用途

记录 Docker volumes 数据丢失事件，说明源代码与运行时数据的区别，避免将来混淆。

---

## 🔍 事件说明

### 发生时间
2025-10-29 下午

### 事件经过

1. **打包准备**：为了减小项目打包体积，尝试删除不必要的文件
2. **删除操作**：
   - ✅ 成功删除 `web/node_modules/` (1.2 GB) - 前端依赖包
   - ✅ 成功删除 `web/.next/` (1.1 GB) - Next.js 构建缓存
   - ⚠️ 尝试删除 `docker/volumes/` (625 MB) - Docker 数据卷
3. **结果**：Docker volumes 部分文件被删除，导致运行时数据丢失

### 丢失的内容

**Docker 运行时数据**（这些从未在 Git 中保存）：
- ❌ 数据库数据（PostgreSQL）
  - 创建的应用配置
  - API keys 和密钥
  - 用户信息
- ❌ 下载的插件及其缓存
- ❌ 对话历史和聊天记录
- ❌ 上传的文件
- ❌ 向量数据库数据（Weaviate）

### 保留的内容

**源代码和配置**（完整保存在 Git 中）：
- ✅ 所有前端品牌化代码
- ✅ 完整的 Git 历史（152 MB，10次提交）
- ✅ 所有开发文档（dev-notes/）
- ✅ Docker 配置文件（docker-compose.yaml 等）
- ✅ 前端源代码和后端 API 代码
- ✅ 依赖清单（package.json、pnpm-lock.yaml）

---

## 🎓 重要概念区分

### 源代码 vs 运行时数据

| 类型 | 示例 | 保存位置 | 是否提交 Git | 能否恢复 |
|------|------|---------|------------|---------|
| **源代码** | `.tsx`、`.css`、`.py` | 工作区 | ✅ 是 | ✅ 完全可恢复 |
| **配置文件** | `docker-compose.yaml` | 工作区 | ✅ 是 | ✅ 完全可恢复 |
| **文档** | `dev-notes/` | 工作区 | ✅ 是 | ✅ 完全可恢复 |
| **依赖包** | `node_modules/` | 工作区 | ❌ 否 | ✅ 可重新安装 |
| **构建缓存** | `.next/` | 工作区 | ❌ 否 | ✅ 自动重新生成 |
| **运行时数据** | `docker/volumes/` | Docker | ❌ 否 | ❌ **无法恢复** |

### 为什么运行时数据不在 Git 中？

1. **性质不同**：
   - 源代码：开发者编写，需要版本控制
   - 运行时数据：程序运行产生，每个环境都不同

2. **文件大小**：
   - 源代码：通常几 MB 到几十 MB
   - 运行时数据：可能几百 MB 到几 GB

3. **安全性**：
   - 运行时数据可能包含敏感信息（API keys、用户数据）
   - 不应该提交到 Git 仓库

4. **可移植性**：
   - 每个环境的数据都不同
   - 提交到 Git 会导致冲突

---

## 📊 Docker Volumes 详解

### 什么是 Docker Volumes？

**Docker Volumes** 是 Docker 容器用来持久化数据的机制。

```
docker/volumes/
├── db/              # PostgreSQL 数据库数据
│   └── data/        # 你创建的应用、用户、配置
├── redis/           # Redis 缓存数据
├── weaviate/        # 向量数据库数据
├── plugin_daemon/   # 下载的插件
└── sandbox/         # 沙箱环境数据
```

### 为什么需要 Volumes？

**没有 Volumes**：
- 容器删除后，数据全部丢失
- 每次重启都是全新的空环境

**有了 Volumes**：
- 数据持久化保存在宿主机
- 容器重启后数据仍然存在

### .gitignore 中的配置

查看项目的 `.gitignore`：
```
docker/volumes/*
!docker/volumes/README.md
```

**含义**：
- 排除 `docker/volumes/` 下的所有文件
- 但保留 `README.md` 说明文档

---

## 🔄 恢复流程

### 已恢复的内容

**用户操作**：重新配置了所有内容
- ✅ 重新创建应用
- ✅ 重新下载插件
- ✅ 重新生成测试数据

### Git 数据完整性验证

```bash
# 检查 Git 状态
git status
# 结果：On branch feature/brand-customization

# 检查提交历史
git log --oneline -5
# 结果：
# 12d780ae7 docs: 完成第二次 Docker 部署文档和记忆指南更新
# 07ff264e7 feat: 完成用户头像和品牌标识的品牌化定制
# 6ae7544db feat: 配置 Docker 使用品牌化镜像并完善部署文档
# ...

# 验证品牌化代码
grep "YOMY" web/app/components/base/chat/chat-with-history/sidebar/index.tsx
# 结果：✅ 代码完好

# 检查 Git 仓库大小
du -sh .git/
# 结果：152 MB（完整历史）
```

**结论**：✅ 所有代码和 Git 历史完全没有损失

---

## 📝 经验教训

### ❌ 不应该做的

1. **删除 Docker Volumes**（即使是为了打包）
   - 会导致运行时数据永久丢失
   - 无法通过 Git 恢复

2. **在没有备份的情况下删除数据目录**
   - 应该先导出/备份重要数据

3. **混淆源代码和运行时数据**
   - 它们的性质和处理方式完全不同

### ✅ 应该做的

1. **打包项目时只删除可恢复的内容**：
   - ✅ `node_modules/` - 可以 `pnpm install` 恢复
   - ✅ `.next/` - 可以 `pnpm dev` 重新生成
   - ❌ `docker/volumes/` - **不要删除**

2. **理解 .gitignore 的作用**：
   - 被排除的文件不会被 Git 跟踪
   - 删除后无法通过 Git 恢复

3. **数据备份**：
   - 如果需要保留 Docker 数据，应该先导出
   - 使用 `docker export` 或数据库导出工具

4. **打包时的正确做法**：
   ```bash
   # 只删除可恢复的
   rm -rf web/node_modules
   rm -rf web/.next

   # 保留 volumes（即使打包体积大一些）
   # 或者提前导出重要数据
   ```

---

## 🎯 最佳实践

### 开发环境管理

1. **源代码**：
   - ✅ 提交到 Git
   - ✅ 定期 push 到远程仓库
   - ✅ 使用分支管理功能

2. **依赖包**：
   - ❌ 不提交到 Git
   - ✅ 使用 `package.json` 记录版本
   - ✅ 可以随时重新安装

3. **运行时数据**：
   - ❌ 不提交到 Git
   - ✅ 定期备份重要数据
   - ✅ 使用导出/导入功能

4. **配置文件**：
   - ✅ 提交模板到 Git
   - ❌ 不提交包含密钥的配置
   - ✅ 使用 `.env.example` 作为模板

### 项目打包建议

**打包给同事时**：

```bash
# 方案 1：使用 git bundle（推荐）
git bundle create project.bundle --all
# 优点：包含完整 Git 历史，文件小

# 方案 2：删除可恢复内容后打包
rm -rf web/node_modules web/.next
# 然后 Mac 右键压缩
# 优点：简单直接，保留 .git 目录

# 方案 3：推送到远程仓库
git push origin feature/brand-customization
# 优点：最佳协作方式，支持持续更新
```

**不要打包的内容**：
- ❌ `node_modules/` - 太大，可恢复
- ❌ `.next/` - 太大，可恢复
- ❌ `docker/volumes/` - 包含个人数据，不应分享

---

## 📚 相关文档

- [项目打包说明.md](../项目打包说明.md) - 打包操作指南
- [前端修改后重新部署指南.md](./前端修改后重新部署指南.md) - Docker 部署流程
- [AI恢复记忆指南.md](./AI恢复记忆指南.md) - 快速恢复项目上下文

---

## 🔐 数据备份建议

### 如果需要保留 Docker 数据

**数据库备份**：
```bash
# PostgreSQL 导出
docker exec docker-db-1 pg_dump -U postgres dify > backup.sql

# 恢复
docker exec -i docker-db-1 psql -U postgres dify < backup.sql
```

**完整备份**：
```bash
# 备份整个 volumes 目录
tar -czf volumes-backup.tar.gz docker/volumes/

# 恢复
tar -xzf volumes-backup.tar.gz
```

---

## ✅ 总结

### 关键要点

1. **源代码（Git）vs 运行时数据（Volumes）是完全不同的**
   - 源代码：可恢复，应该提交 Git
   - 运行时数据：不可恢复，不应该提交 Git

2. **Git 保护的是代码，不是数据**
   - `.gitignore` 排除的文件不会被跟踪
   - 删除后无法通过 Git 恢复

3. **打包项目时要谨慎**
   - 只删除明确可恢复的内容
   - 保留或备份重要的运行时数据

4. **本次事件的影响**
   - ❌ 运行时数据丢失（已重新配置）
   - ✅ 源代码完全没有损失
   - ✅ 所有品牌化工作成果保留

### 项目当前状态

| 项目 | 状态 |
|------|------|
| Git 历史 | ✅ 完整（152 MB，10次提交） |
| 品牌化代码 | ✅ 完整（YOMY、头像、侧边栏、发送框） |
| 开发文档 | ✅ 完整（14个文档） |
| Docker 配置 | ✅ 完整 |
| 应用数据 | ✅ 已重新配置 |

**结论**：项目可以正常打包和分享给后端同事。

---

*创建日期：2025-10-29*
*事件记录：Docker volumes 数据丢失与恢复*
*影响范围：仅运行时数据，源代码无损失*
