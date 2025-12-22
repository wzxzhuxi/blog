# Zhuxi Blog

**中文** | [English](README.en.md)

---

极简静态博客平台，采用工业优雅设计风格。专为 GitHub Pages 打造。

```
设计哲学: "精准。克制。工业优雅。"
```

## 特性

- [+] **ProArt 设计系统** - 深色主题配金色强调
- [+] **TOML 配置** - 简单配置文件管理站点设置
- [+] **外部 Markdown** - 从任意 URL 加载文章
- [+] **GitHub Pages 就绪** - 纯静态，无需构建
- [+] **响应式设计** - 适配所有设备
- [+] **快速加载** - 无框架，最小依赖
- [+] **安全** - 通过 DOMPurify 防止 XSS
- [+] **GitHub API 集成** - 动态获取项目星标数

## 快速开始

### 1. Fork 或克隆

```bash
git clone https://github.com/wzxzhuxi/zhuxiblog.git
cd zhuxiblog
```

### 2. 配置你的博客

复制模板并编辑配置：

```bash
cp blog.config.template.toml blog.config.toml
```

编辑 `blog.config.toml`：

```toml
[personal]
name = "你的名字"
github_username = "你的GitHub用户名"
email = "your@email.com"

[site]
title = "我的博客"
description = "一个关于编程的个人博客"
copyright_year = 2025
lang = "zh"

[github]
default_branch = "main"
about_branch = "main"

[[social]]
label = "GitHub"
type = "github"
icon = "[+]"

[[social]]
label = "邮箱"
type = "email"
icon = "[+]"
```

### 3. 添加文章

编辑 `js/data/articles.js`：

```javascript
window.DataArticles = [
  {
    slug: 'my-first-post',
    title: '我的第一篇文章',
    date: '2025-01-21',
    summary: '文章简短描述',
    repo: 'my-repo-name',  // 使用该仓库的 README.md
    tags: ['介绍']
  }
];
```

文章来源支持：
- **自己仓库的 README**: `{ repo: 'my-project' }`
- **自己仓库的指定路径**: `{ repo: 'my-project', path: 'docs/article.md' }`
- **直接 URL**: `{ url: 'https://raw.githubusercontent.com/...' }`
- **外部仓库**: `{ external: { username: 'other', repo: 'repo', path: 'file.md' } }`

### 4. 添加项目

编辑 `js/data/projects.js`：

```javascript
window.DataProjects = [
  {
    name: '我的项目',
    description: '一个很酷的项目',
    repo: 'my-project',
    language: 'Rust',
    tags: ['rust', 'systems']
  }
];
```

星标数会自动从 GitHub API 获取。

### 5. 部署到 GitHub Pages

1. 推送到 GitHub
2. 进入 Settings > Pages
3. 设置 Source 为 "main" 分支，根目录
4. 你的博客将在 `https://username.github.io/repo-name` 上线

## 本地开发

直接用浏览器打开 `index.html`，或使用本地服务器：

```bash
# Python
python -m http.server 8000

# Node.js
npx serve
```

访问 `http://localhost:8000`

## 文件结构

```
zhuxiblog/
|-- index.html              # 主 SPA 页面
|-- 404.html                # GitHub Pages 回退页
|-- blog.config.toml        # 站点配置
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
+-- README.md               # 本文件
```

## 配置参考

### blog.config.toml

| 节 | 键 | 说明 |
|---|---|---|
| `[personal]` | `name` | 显示名称 |
| `[personal]` | `github_username` | GitHub 用户名，用于 URL 生成 |
| `[personal]` | `email` | 社交链接邮箱 |
| `[site]` | `title` | 博客标题 |
| `[site]` | `description` | Meta 描述 |
| `[site]` | `copyright_year` | 页脚版权年份 |
| `[site]` | `lang` | 语言代码 (en, zh) |
| `[github]` | `default_branch` | 仓库默认分支 |
| `[github]` | `about_branch` | About 页面 README 分支 |
| `[[social]]` | `label`, `type`, `icon` | 社交链接条目 |

### 数据文件

每个数据文件导出一个全局数组：

- `window.DataArticles` - 博客文章
- `window.DataProjects` - GitHub 项目
- `window.DataDiaries` - 个人日记
- `window.DataCollections` - 多章节教程

## 依赖 (CDN)

- [marked.js](https://marked.js.org/) - Markdown 解析
- [highlight.js](https://highlightjs.org/) - 代码语法高亮
- [DOMPurify](https://github.com/cure53/DOMPurify) - XSS 防护

## 设计规范

### 颜色

| 变量 | 值 | 用途 |
|------|------|------|
| `--bg-primary` | #0a0a0a | 主背景 |
| `--bg-secondary` | #121212 | 卡片、区块 |
| `--bg-tertiary` | #1a1a1a | 悬停、提升 |
| `--accent-gold` | #c9a962 | 强调、高亮 |
| `--text-primary` | #ffffff | 标题 |
| `--text-secondary` | #e5e5e5 | 正文 |

### 标记符号 (禁用 Emoji)

| 标记 | 含义 |
|------|------|
| `[+]` | 正面 / 成功 |
| `[-]` | 负面 / 错误 |
| `[!]` | 警告 / 重要 |
| `[i]` | 信息 / 说明 |
| `[/]` | 完成 / 检查 |
| `[*]` | 星标 / 精选 |

## 许可证

MIT 许可证。自由使用。

---

```
[/] 以精准与克制构建。
```
