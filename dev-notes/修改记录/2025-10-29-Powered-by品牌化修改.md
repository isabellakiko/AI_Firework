# Powered by 品牌化修改

## 修改信息

- **日期**：2025-10-29
- **修改类型**：样式 + 品牌化设计
- **影响范围**：侧边栏底部 "Powered by" 区域
- **测试状态**：✅ 已完成并通过测试

---

## 设计方案

**目标**：将侧边栏底部的 "Dify" Logo 替换为品牌名称 "YOMY"，使用品牌黄色。

**品牌色**：
- 黄色：#f2c823（品牌主色）

**设计思路**：
- 保持 "Powered by" 文字不变（灰色 #98a2b3）
- 将 Dify Logo 替换为文字 "YOMY"（黄色 #f2c823）
- 使用稍大的字体突出品牌名称
- 最小化代码改动，只修改必要的部分

---

## 修改详情

### 替换 Dify Logo 为 YOMY 文字

**文件**：`web/app/components/base/chat/chat-with-history/sidebar/index.tsx`

**位置**：第 157 行

**修改内容**：
```tsx
/* 修改前 */
{
  systemFeatures.branding.enabled && systemFeatures.branding.workspace_logo
    ? <img src={systemFeatures.branding.workspace_logo} alt='logo' className='block h-5 w-auto' />
    : appData?.custom_config?.replace_webapp_logo
      ? <img src={`${appData?.custom_config?.replace_webapp_logo}`} alt='logo' className='block h-5 w-auto' />
      : <DifyLogo size='small' />  // ← 原来是 Logo 组件
}

/* 修改后 */
{
  systemFeatures.branding.enabled && systemFeatures.branding.workspace_logo
    ? <img src={systemFeatures.branding.workspace_logo} alt='logo' className='block h-5 w-auto' />
    : appData?.custom_config?.replace_webapp_logo
      ? <img src={`${appData?.custom_config?.replace_webapp_logo}`} alt='logo' className='block h-5 w-auto' />
      : <span className='system-xs-semibold-uppercase' style={{ color: '#f2c823' }}>YOMY</span>  // ← 改为文字
}
```

**修改说明**：
- 移除了 `<DifyLogo size='small' />` 组件
- 替换为 `<span>` 标签显示文字 "YOMY"
- 使用 `system-xs-semibold-uppercase` 样式类（小字体、半粗体、自动大写）
- 应用品牌黄色 `#f2c823`
- 保留了系统级和应用级自定义 Logo 的优先级逻辑

---

## 文件修改总览

| 文件 | 行数 | 修改内容 |
|------|------|---------|
| `web/app/components/base/chat/chat-with-history/sidebar/index.tsx` | 157 | 将 DifyLogo 组件替换为黄色 YOMY 文字 |

**修改文件总数**：1 个文件

**修改要点总数**：1 处关键修改

---

## 颜色使用规范

### Powered by 区域颜色

| 元素 | 颜色 | 颜色值 | 用途 |
|------|------|--------|------|
| "Powered by" 文字 | ⬛ 中灰色 | #98a2b3 | 次要文字，保持低调 |
| "YOMY" 品牌名 | 🟨 黄色 | #f2c823 | 品牌主色，突出品牌 |

### 字体大小对比

| 元素 | 字体样式类 | 说明 |
|------|-----------|------|
| "Powered by" | `system-2xs-medium-uppercase` | 超小字体，中等粗细 |
| "YOMY" | `system-xs-semibold-uppercase` | 小字体，半粗体（比 Powered by 稍大）|

---

## 视觉效果预期

### 修改前
```
┌──────────────────────────────────┐
│ 侧边栏底部                         │
├──────────────────────────────────┤
│ [菜单] ▼      Powered by [Dify]  │
│                ↑         ↑       │
│              灰色      蓝色Logo   │
└──────────────────────────────────┘
```

### 修改后
```
┌──────────────────────────────────┐
│ 侧边栏底部（深灰背景 #615e5f）      │
├──────────────────────────────────┤
│ [菜单] ▼      Powered by YOMY    │
│                ↑         ↑       │
│              灰色      黄色文字   │
│            #98a2b3    #f2c823    │
└──────────────────────────────────┘
```

**视觉对比**：
- ✅ "YOMY" 使用品牌黄色，与 "New Chat" 按钮、发送按钮、选中对话颜色一致
- ✅ 文字形式比 Logo 更简洁，品牌名称更直观
- ✅ 字体稍大于 "Powered by"，突出品牌存在感
- ✅ 在深灰背景 #615e5f 上黄色文字清晰醒目

---

## 品牌一致性

### 与其他品牌元素的呼应

| 位置 | 元素 | 颜色 | 说明 |
|------|------|------|------|
| 侧边栏 | New Chat 按钮 | 🟨 #f2c823 | 行动按钮 |
| 侧边栏 | 选中对话 | 🟨 #f2c823 | 强调状态 |
| 发送框 | 发送按钮 | 🟨 #f2c823 | 行动按钮 |
| 发送框 | 输入文字 | 🟨 #f2c823 | 品牌强调 |
| **侧边栏底部** | **YOMY 品牌名** | **🟨 #f2c823** | **品牌标识** ✨ 新增 |

**设计语言统一**：
- ✅ 所有品牌关键元素统一使用黄色 #f2c823
- ✅ 深灰色 #615e5f 用于容器背景
- ✅ 形成完整的品牌色系统

---

## 热更新验证

- ✅ 修改 sidebar/index.tsx 后自动刷新
- ✅ 无需修改 CSS 文件，无需强制刷新
- ✅ 前端开发服务器 (pnpm dev) 可立即看到效果

**开发服务器测试**：
```bash
# 访问前端开发服务器
http://localhost:3000/chat/l8BpY79pZD0AVs9E

# 查看侧边栏底部
# 应该显示：Powered by YOMY（YOMY 为黄色）
```

**Docker 部署测试**：
```bash
# 1. 构建新镜像
docker build -t langgenius/dify-web:brand-customization ./web

# 2. 重启容器
cd docker && docker compose restart web

# 3. 访问
http://localhost:80
```

---

## 测试结果

- [x] "Powered by" 文字显示正常（灰色 #98a2b3）
- [x] "YOMY" 文字显示正常（黄色 #f2c823）
- [x] 字体大小适中，清晰可读
- [x] 在深灰背景上对比度良好
- [x] 与侧边栏其他品牌元素颜色一致
- [x] 热更新工作正常
- [x] 无控制台错误
- [x] 整体品牌一致性强

**状态**：✅ 所有功能测试通过

---

## 技术说明

### 为什么用 `<span>` 而不是 `<DifyLogo>`？

**优势**：
1. **改动最小**：只需修改 1 行代码
2. **灵活性高**：可随时修改文字内容、颜色、大小
3. **无需资源**：不需要设计或导入新的 SVG/图片文件
4. **加载更快**：纯文本渲染，无需加载额外图片资源
5. **响应式好**：文字自动适应容器尺寸

**保留的功能**：
- ✅ 仍然支持系统级品牌化 Logo（优先级最高）
- ✅ 仍然支持应用级自定义 Logo（优先级第二）
- ✅ 只有在没有自定义 Logo 时才显示 "YOMY"

### CSS 类说明

**`system-xs-semibold-uppercase`**：
- `xs`: Extra Small 字体大小
- `semibold`: 半粗体（font-weight: 600）
- `uppercase`: 文字自动转大写（text-transform: uppercase）

这个类比 "Powered by" 使用的 `system-2xs-medium-uppercase` 稍大一点，让品牌名更突出。

---

## 下一步优化建议（可选）

如果当前效果满意，后续可以考虑：

1. **统一品牌标识**
   - 可以在页面其他位置也使用 "YOMY" 品牌名
   - 替换应用图标和标题中的品牌元素

2. **字体优化**
   - 如果有品牌专用字体，可以为 "YOMY" 应用自定义字体
   - 增强品牌识别度

3. **国际化文本**
   - 如果需要，可以将 "Powered by" 改为中文 "由...提供支持"
   - 修改 `web/i18n/zh-Hans/share.ts` 文件

4. **添加品牌链接**
   - 可以为 "YOMY" 添加点击链接，跳转到公司官网
   - 增加品牌曝光

---

## 相关修改记录

- [2025-10-28-方案1品牌配色实现.md](./2025-10-28-方案1品牌配色实现.md) - 侧边栏品牌化（包括 "Powered by" 文字颜色修改）
- [2025-10-28-发送框品牌化定制.md](./2025-10-28-发送框品牌化定制.md) - 发送框品牌化
- [2025-10-29-Docker部署品牌化镜像.md](./2025-10-29-Docker部署品牌化镜像.md) - Docker 部署配置

---

## 注意事项

1. **Logo 优先级保持不变**
   - 如果在系统级或应用级配置了自定义 Logo，仍然会优先显示自定义 Logo
   - "YOMY" 文字只在没有自定义 Logo 时显示

2. **文字大小写**
   - 由于使用了 `uppercase` 类，输入的文字会自动转为大写
   - 即使写成 "yomy" 也会显示为 "YOMY"

3. **颜色一致性**
   - 确保所有品牌元素统一使用 #f2c823
   - 避免使用其他黄色色值

---

*创建日期：2025-10-29*
*最后更新：2025-10-29*
