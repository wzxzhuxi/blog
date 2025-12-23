# 接口文档

Zhuxi Blog 公开接口与数据结构定义。

---

## 1. 数据结构

### 1.1 文章 (Article)

```javascript
/**
 * @typedef {Object} Article
 * @property {string} slug - URL 标识符
 * @property {string} title - 文章标题
 * @property {string} date - 日期 (YYYY-MM-DD)
 * @property {string} summary - 摘要
 * @property {string[]} tags - 标签数组
 * @property {string} [repo] - 仓库名 (自动生成 URL)
 * @property {string} [path] - 仓库内路径 (默认 README.md)
 * @property {string} [url] - 直接 URL (覆盖 repo)
 * @property {Object} [external] - 外部仓库配置
 * @property {string} [external.username] - 外部用户名
 * @property {string} [external.repo] - 外部仓库名
 * @property {string} [external.branch] - 分支 (默认 main)
 * @property {string} [external.path] - 文件路径
 */
```

**示例**：

```javascript
// 方式 1: 自己仓库的 README
{
  slug: 'my-project',
  title: '我的项目',
  date: '2025-01-15',
  summary: '项目介绍',
  repo: 'my-project',
  tags: ['rust']
}

// 方式 2: 自己仓库的指定文件
{
  slug: 'docs-guide',
  title: '文档指南',
  date: '2025-01-15',
  summary: '如何写文档',
  repo: 'my-project',
  path: 'docs/guide.md',
  tags: ['docs']
}

// 方式 3: 直接 URL
{
  slug: 'external',
  title: '外部文章',
  date: '2025-01-15',
  summary: '外部来源',
  url: 'https://raw.githubusercontent.com/user/repo/main/file.md',
  tags: ['external']
}

// 方式 4: 外部仓库
{
  slug: 'from-other',
  title: '来自其他仓库',
  date: '2025-01-15',
  summary: '外部仓库文章',
  external: {
    username: 'other-user',
    repo: 'other-repo',
    branch: 'main',
    path: 'docs/article.md'
  },
  tags: ['external']
}
```

### 1.2 项目 (Project)

```javascript
/**
 * @typedef {Object} Project
 * @property {string} name - 显示名称
 * @property {string} description - 项目描述
 * @property {string} repo - 仓库名
 * @property {string} language - 主要语言
 * @property {string[]} tags - 标签数组
 * @property {number} [stars] - 静态星标数 (覆盖 API)
 * @property {string} [url] - 自定义 URL (覆盖自动生成)
 */
```

**示例**：

```javascript
{
  name: 'CharlieDB',
  description: '时序数据库',
  repo: 'CharlieDB',
  language: 'Rust',
  tags: ['database', 'timeseries']
}
```

### 1.3 日记 (Diary)

```javascript
/**
 * @typedef {Object} Diary
 * @property {string} id - 唯一标识符 (通常是日期)
 * @property {string} date - 日期 (YYYY-MM-DD)
 * @property {string} mood - 心情 (productive/thoughtful/happy/tired/neutral)
 * @property {string} weather - 天气 (sunny/cloudy/rainy/snowy)
 * @property {string} content - 日记内容 (支持段落和列表)
 * @property {string[]} tags - 标签数组
 */
```

**示例**：

```javascript
{
  id: '2025-12-22',
  date: '2025-12-22',
  mood: 'productive',
  weather: 'sunny',
  content: '今天完成了博客开发。\n\n- 实现了 TOC 功能\n- 修复了安全问题',
  tags: ['coding', 'blog']
}
```

### 1.4 合集 (Collection)

```javascript
/**
 * @typedef {Object} Collection
 * @property {string} slug - URL 标识符
 * @property {string} title - 合集标题
 * @property {string} description - 合集描述
 * @property {string} date - 日期 (YYYY-MM-DD)
 * @property {string[]} tags - 标签数组
 * @property {string} [author] - 作者名 (默认使用配置)
 * @property {Chapter[]} chapters - 章节列表
 */

/**
 * @typedef {Object} Chapter
 * @property {number} number - 章节编号
 * @property {string} title - 章节标题
 * @property {string} [repo] - 仓库名
 * @property {string} [path] - 仓库内路径
 * @property {string} [url] - 直接 URL
 * @property {Object} [external] - 外部仓库配置
 */
```

**示例**：

```javascript
{
  slug: 'rust-guide',
  title: 'Rust 系统编程',
  description: '从零构建系统组件',
  date: '2025-12-20',
  tags: ['Rust', 'systems'],
  chapters: [
    { number: 1, title: '线程池', repo: 'thread-pool' },
    { number: 2, title: '数据库', repo: 'CharlieDB', path: 'docs/intro.md' },
    { number: 3, title: '网络层', url: 'https://...' }
  ]
}
```

---

## 2. 配置文件

### blog.config.toml

```toml
# 个人信息
[personal]
name = "你的名字"           # 显示名称
github_username = "用户名"  # GitHub 用户名，用于 URL 生成
email = "email@example.com" # 邮箱

# 站点配置
[site]
title = "博客标题"          # 浏览器标题和 Logo
description = "博客描述"    # Meta 描述
copyright_year = 2025       # 页脚年份
lang = "zh"                 # 语言代码

# GitHub 设置
[github]
default_branch = "main"     # 默认分支
about_branch = "main"       # About 页面 README 分支

# 社交链接 (可多个)
[[social]]
label = "GitHub"            # 显示文本
type = "github"             # 类型: github/email/完整URL
icon = "[+]"                # 图标标记
```

---

## 3. 模块接口

### 3.1 ConfigLoader

```javascript
window.ConfigLoader = {
  /**
   * 加载配置文件
   * @param {function(Error|null, Object)} callback - 回调
   */
  load: function(callback) {},

  /**
   * 更新页面元数据 (标题、描述等)
   * @param {Object} config - 配置对象
   */
  updatePageMeta: function(config) {},

  /**
   * 生成 GitHub 仓库 URL
   * @param {string} username
   * @param {string} [repo]
   * @returns {string}
   */
  getGitHubRepoUrl: function(username, repo) {},

  /**
   * 生成 GitHub 原始内容 URL
   * @param {string} username
   * @param {string} repo
   * @param {string} [path='README.md']
   * @param {string} [branch='main']
   * @returns {string}
   */
  getGitHubRawUrl: function(username, repo, path, branch) {}
};
```

### 3.2 Markdown

```javascript
window.Markdown = {
  /**
   * 获取 Markdown 内容 (带缓存)
   * @param {string} url
   * @returns {Promise<string>}
   */
  fetchMarkdown: async function(url) {},

  /**
   * 解析 Markdown 为 HTML
   * @param {string} markdown
   * @returns {string}
   */
  renderMarkdown: function(markdown) {},

  /**
   * 应用代码高亮
   * @param {HTMLElement} container
   */
  applyHighlighting: function(container) {},

  /**
   * 完整渲染流程 (获取 + 解析 + 安全处理 + 高亮)
   * @param {string} url
   * @param {HTMLElement} container
   * @returns {Promise<boolean>}
   */
  renderExternalMarkdown: async function(url, container) {},

  /**
   * 清除缓存
   */
  clearCache: function() {}
};
```

### 3.3 TOC

```javascript
window.TOC = {
  /**
   * 更新目录 (提取标题并构建 TOC)
   * @param {HTMLElement} contentContainer - 内容容器
   */
  update: function(contentContainer) {},

  /**
   * 销毁目录 (清理监听器)
   */
  destroy: function() {},

  /**
   * 切换移动端抽屉
   */
  toggleDrawer: function() {}
};
```

### 3.4 Router

```javascript
window.Router = {
  /**
   * 注册路由
   * @param {string} path - 路由模式
   * @param {function(Object)} handler - 处理函数
   * @returns {Router}
   */
  on: function(path, handler) {},

  /**
   * 导航到路由
   * @param {string} path
   */
  navigate: function(path) {},

  /**
   * 获取当前路由
   * @returns {{path: string, params: Object}}
   */
  getCurrentRoute: function() {},

  /**
   * 初始化路由器
   */
  init: function() {},

  /**
   * 更新导航高亮
   * @param {string} path
   */
  updateActiveNav: function(path) {},

  /**
   * 解析哈希
   * @param {string} hash
   * @returns {{path: string, params: Object}}
   */
  parseHash: function(hash) {}
};
```

### 3.5 GitHubAPI

```javascript
window.GitHubAPI = {
  /**
   * 获取单个仓库数据
   * @param {string} username
   * @param {string} repoName
   * @param {function(Error|null, Object)} callback
   */
  fetchRepoData: function(username, repoName, callback) {},

  /**
   * 批量获取仓库数据
   * @param {string} username
   * @param {string[]} repoNames
   * @param {function(Error|null, Object)} callback
   */
  fetchMultipleRepos: function(username, repoNames, callback) {},

  /**
   * 更新项目卡片星标数
   * @param {string} username
   * @param {Object[]} projects
   */
  updateProjectStars: function(username, projects) {},

  /**
   * 清除缓存
   */
  clearCache: function() {}
};
```

### 3.6 App

```javascript
window.App = {
  /** 初始化应用 */
  init: function() {},

  /** 渲染文章列表 */
  renderArticleList: function() {},

  /** 渲染文章详情 */
  renderArticleDetail: function(params) {},

  /** 渲染项目页面 */
  renderProjects: function() {},

  /** 渲染合集列表 */
  renderCollectionsList: function() {},

  /** 渲染合集详情 */
  renderCollectionDetail: function(params) {},

  /** 渲染章节详情 */
  renderChapterDetail: function(params) {},

  /** 渲染日记列表 */
  renderDiaryList: function() {},

  /** 渲染日记详情 */
  renderDiaryDetail: function(params) {},

  /** 渲染关于页面 */
  renderAbout: function() {},

  /** 渲染 404 页面 */
  renderNotFound: function() {}
};
```

---

## 4. 全局对象

### 4.1 window.Config

配置加载后可用：

```javascript
window.Config = {
  // 站点信息
  site: {
    title: string,
    author: string,
    description: string,
    github: string,
    lang: string,
    copyright_year: number
  },

  // 个人信息
  personal: {
    name: string,
    github_username: string,
    email: string
  },

  // 社交链接
  social: [{ label, url, icon }],

  // GitHub 分支
  github_default_branch: string,
  github_about_branch: string,

  // 导航
  navigation: [{ label, path, icon }],

  // 内容数据 (已处理，包含 URL)
  articles: Article[],
  projects: Project[],
  diaries: Diary[],
  collections: Collection[],

  // 辅助映射
  languageColors: { [lang]: color },
  moodIcons: { [mood]: icon },
  weatherIcons: { [weather]: icon }
};
```

### 4.2 数据全局变量

配置加载前由数据文件设置：

```javascript
window.DataArticles = Article[];
window.DataProjects = Project[];
window.DataDiaries = Diary[];
window.DataCollections = Collection[];
```

### 4.3 CDN 库

```javascript
window.marked = { parse: function(md) {} };
window.hljs = { highlightElement: function(el) {} };
window.DOMPurify = { sanitize: function(html, opts) {} };
window.toml = { parse: function(str) {} };
```

---

## 5. CSS 类名规范

### 5.1 BEM 命名

```
组件名__元素名--修饰符

示例:
.article-card
.article-card__title
.article-card__tags
.toc-sidebar--empty
```

### 5.2 状态类

```
.is-active    - 激活状态
.is-open      - 展开状态
.is-visible   - 可见状态
```

### 5.3 工具类

```
.text-gold       - 金色文字
.text-primary    - 主要文字色
.text-secondary  - 次要文字色
.text-tertiary   - 三级文字色
.text-muted      - 弱化文字色
.text-sm         - 小字号
.text-xs         - 更小字号
.font-mono       - 等宽字体
.font-semibold   - 半粗字体
.uppercase       - 大写
.tracking-wide   - 字间距
.fade-in         - 淡入动画
.hidden          - 隐藏
```

---

## 6. HTML 结构

### 6.1 主容器

```html
<main class="main-content">
  <div class="container" id="app-content">
    <!-- 路由渲染内容 -->
  </div>
</main>
```

### 6.2 文章卡片

```html
<article class="article-card">
  <div class="article-card__date">[日期]</div>
  <h2 class="article-card__title">
    <a href="#/article/[slug]">[标题]</a>
  </h2>
  <p class="article-card__summary">[摘要]</p>
  <div class="article-card__tags">
    <span class="tag">[标签]</span>
  </div>
</article>
```

### 6.3 带 TOC 的内容页

```html
<div class="content-with-toc">
  <div class="content-with-toc__main">
    <!-- 主内容 -->
  </div>
  <aside class="content-with-toc__sidebar toc-sidebar" id="toc-sidebar">
    <!-- TOC 目录 -->
  </aside>
</div>
```

### 6.4 状态组件

```html
<!-- 加载状态 -->
<div class="loading-state">
  <div class="loading-state__spinner"></div>
  <span class="loading-state__text">Loading...</span>
</div>

<!-- 错误状态 -->
<div class="error-state">
  <span class="error-state__icon">[-]</span>
  <span class="error-state__message">[错误信息]</span>
</div>
```

---

## 7. 事件

### 7.1 路由事件

```javascript
// 监听路由变化
window.addEventListener('hashchange', function() {
  // Router 自动处理
});
```

### 7.2 TOC 事件

```javascript
// TOC 在路由变化时自动清理
window.addEventListener('hashchange', TOC.destroy);
```
