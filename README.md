# Zhuxi Blog

极简静态博客模板，采用 ProArt 工业设计风格。专为 GitHub Pages 打造。

```
设计哲学: "精准。克制。工业优雅。"
```

## 特性

- [+] **ProArt 设计系统** - 深色主题 + 金色强调，无 emoji
- [+] **TOML 配置** - 简单配置文件管理站点设置
- [+] **外部 Markdown** - 从 GitHub 仓库或任意 URL 加载内容
- [+] **TOC 目录侧边栏** - 文章/章节页面自动生成目录导航
- [+] **GitHub Pages 就绪** - 纯静态，零构建步骤
- [+] **响应式设计** - 桌面/平板/移动端全适配
- [+] **快速加载** - 无框架，最小依赖
- [+] **安全** - DOMPurify 防护 XSS，URL 验证，HTML 检测
- [+] **GitHub API 集成** - 动态获取项目星标数，每日缓存

## 快速开始

### 1. 获取代码

```bash
git clone https://github.com/wzxzhuxi/blog.git
cd blog
```

### 2. 立即预览

开箱即用，模板自带演示配置：

```bash
python -m http.server 8000
# 或 npx serve
```

访问 `http://localhost:8000`，你会看到使用 GitHub octocat 账户的演示博客。

### 3. 配置博客

编辑 `blog.config.toml`：

```toml
[personal]
name = "你的名字"
github_username = "你的用户名"
email = "your@email.com"

[site]
title = "我的博客"
description = "一个技术博客"
copyright_year = 2025
lang = "zh"

[github]
default_branch = "main"
about_branch = "main"

[[social]]
label = "GitHub"
type = "github"
icon = "[+]"
```

### 4. 添加内容

**文章** - 编辑 `js/data/articles.js`：

```javascript
window.DataArticles = [
  {
    slug: 'my-article',
    title: '我的文章',
    date: '2025-01-21',
    summary: '文章描述',
    repo: 'my-repo',           // 使用该仓库的 README.md
    // 或 path: 'docs/post.md' // 指定文件路径
    // 或 url: 'https://...'   // 直接 URL
    tags: ['技术']
  }
];
```

**项目** - 编辑 `js/data/projects.js`：

```javascript
window.DataProjects = [
  {
    name: '我的项目',
    description: '项目描述',
    repo: 'my-project',
    language: 'Rust',
    tags: ['database']
  }
];
```

星标数自动从 GitHub API 获取。

### 5. 部署

1. 推送到 GitHub
2. Settings > Pages > Source: main 分支，根目录
3. 访问 `https://username.github.io/repo-name`

## 文件结构

```
zhuxiblog/
|-- index.html              # 主 SPA 页面
|-- 404.html                # GitHub Pages 回退
|-- blog.config.toml        # 站点配置
|-- css/
|   +-- style.css           # ProArt 设计系统
|-- js/
|   |-- config.js           # TOML 配置加载器
|   |-- markdown.js         # Markdown 获取与渲染
|   |-- router.js           # 哈希路由
|   |-- toc.js              # TOC 目录侧边栏
|   |-- github-api.js       # GitHub API 集成
|   |-- app.js              # 页面渲染逻辑
|   |-- lib/toml.min.js     # TOML 解析器
|   +-- data/
|       |-- articles.js     # 文章数据
|       |-- projects.js     # 项目数据
|       |-- diaries.js      # 日记数据
|       +-- collections.js  # 多章节教程
+-- docs/                   # 开发文档
```

## 路由

| 路由 | 页面 |
|------|------|
| `#/` | 文章列表 |
| `#/article/:slug` | 文章详情 |
| `#/projects` | 项目展示 |
| `#/collections` | 教程合集 |
| `#/collection/:slug` | 合集目录 |
| `#/collection/:slug/:n` | 章节内容 |
| `#/diary` | 日记列表 |
| `#/diary/:id` | 日记详情 |
| `#/about` | 关于页面 |

## ProArt 设计规范

### 配色

| 变量 | 值 | 用途 |
|------|------|------|
| `--bg-primary` | #0a0a0a | 主背景 |
| `--bg-secondary` | #121212 | 卡片 |
| `--bg-tertiary` | #1a1a1a | 悬停 |
| `--accent-gold` | #c9a962 | 强调色 |
| `--text-primary` | #ffffff | 标题 |
| `--text-secondary` | #e5e5e5 | 正文 |

### 标记符号

| 标记 | 含义 |
|------|------|
| `[+]` | 正面/成功 |
| `[-]` | 负面/错误 |
| `[!]` | 警告 |
| `[i]` | 信息 |
| `[/]` | 完成 |
| `[*]` | 星标 |
| `[#]` | 目录 |

禁用 emoji，使用几何标记。

## 依赖

通过 CDN 加载：

- [marked.js](https://marked.js.org/) - Markdown 解析
- [highlight.js](https://highlightjs.org/) - 代码高亮
- [DOMPurify](https://github.com/cure53/DOMPurify) - XSS 防护

## 文档

- 架构文档 docs/ARCHITECTURE.md - 系统设计与模块关系
- 接口文档 docs/INTERFACES.md   - API 参考
- 开发指南 docs/DEVELOPMENT.md  - 贡献与扩展

## 许可证

MIT

---

```
[/] 以精准与克制构建
```
