# Zhuxi Blog - 架构文档

**中文** | [English](ARCHITECTURE.en.md)

---

## 1. 系统概览

采用 ProArt 设计风格的 GitHub Pages 静态博客。

```
+------------------+     +-------------------+     +------------------+
|   GitHub Pages   | --> |   静态资源        | --> |   浏览器         |
|   (托管)         |     |   (HTML/CSS/JS)   |     |   (客户端)       |
+------------------+     +-------------------+     +------------------+
                                                          |
                                                          v
                                               +-------------------+
                                               |  外部 URL         |
                                               |  (Markdown 文件)  |
                                               +-------------------+
                                                          |
                                                          v
                                               +-------------------+
                                               |  GitHub API       |
                                               |  (星标数)         |
                                               +-------------------+
```

## 2. 目录结构

```
zhuxiblog/
|-- index.html              # 主 SPA 页面
|-- 404.html                # GitHub Pages 回退页
|-- blog.config.toml        # 用户配置
|-- blog.config.template.toml # 新用户模板
|-- css/
|   +-- style.css           # ProArt 设计系统
|-- js/
|   |-- config.js           # TOML 配置加载器
|   |-- markdown.js         # Markdown 渲染
|   |-- router.js           # 哈希路由
|   |-- github-api.js       # GitHub API 集成
|   |-- app.js              # 应用逻辑
|   |-- lib/
|   |   +-- toml.min.js     # TOML 解析器
|   +-- data/
|       |-- articles.js     # 文章数据
|       |-- projects.js     # 项目数据
|       |-- diaries.js      # 日记数据
|       +-- collections.js  # 多章节教程
+-- README.md               # 文档
```

## 3. 核心模块

### 3.1 配置模块 (config.js)
- 加载并解析 `blog.config.toml`
- 处理数据文件（文章、项目、日记、合集）
- 根据用户配置从仓库名生成 URL
- 提供默认回退值

### 3.2 Markdown 模块 (markdown.js)
- 从外部 URL 获取 Markdown
- 使用 marked.js 解析
- 使用 highlight.js 语法高亮
- 使用 DOMPurify 防止 XSS
- 处理加载状态和错误

### 3.3 路由模块 (router.js)
- 哈希路由 (#/, #/article/:slug 等)
- 路由解析与导航
- 激活导航状态管理

### 3.4 GitHub API 模块 (github-api.js)
- 获取仓库数据（星标数）
- localStorage 每日缓存
- 用实时数据更新项目卡片

### 3.5 应用模块 (app.js)
- 所有路由的页面渲染
- 组件构建器（卡片、列表等）
- 导航管理

## 4. 数据流

```
[blog.config.toml]     [js/data/*.js]
        |                    |
        v                    v
   [ConfigLoader]  ---> [数据处理]
        |                    |
        v                    v
   [Config 对象] <--- [处理后的数据]
        |
        v
    [Router]
        |
        v
    [App 渲染器]
        |
        v
   [DOM 更新]
```

## 5. 外部依赖 (CDN)

- marked.js: Markdown 解析
- highlight.js: 语法高亮
- DOMPurify: XSS 防护

## 6. ProArt 设计常量

```css
/* 背景层级 */
--bg-primary: #0a0a0a;
--bg-secondary: #121212;
--bg-tertiary: #1a1a1a;

/* 强调色 - 仅金色 */
--accent-gold: #c9a962;
--accent-gold-dim: #8b7355;

/* 文字层级 */
--text-primary: #ffffff;
--text-secondary: #e5e5e5;
--text-tertiary: #a3a3a3;
--text-muted: #525252;

/* 语义色（最小化使用） */
--semantic-error: #7f2d2d;
--semantic-success: #14532d;
```

## 7. 路由表

| 路由 | 页面 | 说明 |
|------|------|------|
| `#/` | 文章 | 文章列表 |
| `#/article/:slug` | 文章 | 单篇文章 |
| `#/projects` | 项目 | 项目网格 |
| `#/collections` | 合集 | 合集列表 |
| `#/collection/:slug` | 合集 | 合集目录 |
| `#/collection/:slug/:chapter` | 章节 | 章节内容 |
| `#/diary` | 日记 | 日记列表 |
| `#/diary/:id` | 日记 | 单篇日记 |
| `#/about` | 关于 | 关于页面 |

## 8. 响应式断点

- 移动端: < 640px
- 平板: 640px - 1024px
- 桌面: > 1024px

## 9. 性能考量

- 文章内容懒加载
- 已获取 Markdown 的会话缓存
- GitHub API 数据每日缓存
- 最小化 DOM 操作
- 避免不必要的重渲染

## 10. GitHub Pages 兼容性

- 所有路径使用相对路径
- 无需服务端处理
- 哈希路由（无 404 问题）
- 使用 CORS 友好的外部 URL（GitHub raw、Gist）
