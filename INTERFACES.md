# Zhuxi Blog - 接口定义

**中文** | [English](INTERFACES.en.md)

---

## 1. 数据结构

### 文章对象

```javascript
/**
 * @typedef {Object} Article
 * @property {string} slug - URL 友好的标识符
 * @property {string} title - 文章标题
 * @property {string} date - ISO 日期字符串 (YYYY-MM-DD)
 * @property {string} summary - 简短描述
 * @property {string} [repo] - GitHub 仓库名（自动生成 URL）
 * @property {string} [path] - 仓库内路径（默认: README.md）
 * @property {string} [url] - 直接 URL（覆盖 repo）
 * @property {Object} [external] - 外部仓库配置
 * @property {string[]} tags - 文章标签
 */

// 示例 1: 自己仓库的 README
{
  slug: "my-project",
  title: "我的项目",
  date: "2025-01-15",
  summary: "一个很酷的项目",
  repo: "my-project",
  tags: ["rust", "systems"]
}

// 示例 2: 自己仓库的指定路径
{
  slug: "docs-guide",
  title: "文档指南",
  date: "2025-01-15",
  summary: "如何编写文档",
  repo: "my-project",
  path: "docs/guide.md",
  tags: ["docs"]
}

// 示例 3: 直接 URL
{
  slug: "external-article",
  title: "外部文章",
  date: "2025-01-15",
  summary: "来自其他地方的文章",
  url: "https://raw.githubusercontent.com/user/repo/main/file.md",
  tags: ["external"]
}
```

### 项目对象

```javascript
/**
 * @typedef {Object} Project
 * @property {string} name - 显示名称
 * @property {string} description - 项目描述
 * @property {string} repo - GitHub 仓库名
 * @property {string} language - 主要语言
 * @property {string[]} tags - 项目标签
 * @property {number} [stars] - 静态星标数（覆盖 API）
 */

// 示例
{
  name: "CharlieDB",
  description: "Rust 实现的时序数据库",
  repo: "CharlieDB",
  language: "Rust",
  tags: ["database", "timeseries"]
}
```

### 日记对象

```javascript
/**
 * @typedef {Object} Diary
 * @property {string} id - 唯一标识符（通常是日期）
 * @property {string} date - ISO 日期字符串
 * @property {string} mood - 心情标识符
 * @property {string} weather - 天气标识符
 * @property {string} content - 日记内容（纯文本）
 * @property {string[]} tags - 条目标签
 */

// 示例
{
  id: "2025-12-22",
  date: "2025-12-22",
  mood: "productive",
  weather: "sunny",
  content: "今天我搭建了一个博客...",
  tags: ["coding", "blog"]
}
```

### 合集对象

```javascript
/**
 * @typedef {Object} Collection
 * @property {string} slug - URL 友好的标识符
 * @property {string} title - 合集标题
 * @property {string} [author] - 作者名（默认使用配置）
 * @property {string} description - 合集描述
 * @property {string} date - ISO 日期字符串
 * @property {string[]} tags - 合集标签
 * @property {Chapter[]} chapters - 章节列表
 */

/**
 * @typedef {Object} Chapter
 * @property {number} number - 章节编号
 * @property {string} title - 章节标题
 * @property {string} [repo] - GitHub 仓库名
 * @property {string} [path] - 仓库内路径
 * @property {string} [url] - 直接 URL
 */

// 示例
{
  slug: "rust-guide",
  title: "Rust 系统编程",
  description: "用 Rust 构建系统",
  date: "2025-12-20",
  tags: ["Rust", "systems"],
  chapters: [
    { number: 1, title: "线程池", repo: "thread-pool" },
    { number: 2, title: "数据库设计", repo: "CharlieDB" }
  ]
}
```

---

## 2. 配置文件 (blog.config.toml)

```toml
[personal]
name = "你的名字"
github_username = "用户名"
email = "email@example.com"

[site]
title = "博客标题"
description = "博客描述"
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

---

## 3. 模块接口

### ConfigLoader (config.js)

```javascript
/**
 * 从 TOML 文件加载配置
 * @param {function} callback - 回调函数(error, config)
 */
ConfigLoader.load(callback);

/**
 * 从配置更新页面元数据
 * @param {Object} config - 配置对象
 */
ConfigLoader.updatePageMeta(config);

/**
 * 生成 GitHub 仓库 URL
 * @param {string} username - GitHub 用户名
 * @param {string} [repo] - 仓库名
 * @returns {string} URL
 */
ConfigLoader.getGitHubRepoUrl(username, repo);

/**
 * 生成 GitHub 原始内容 URL
 * @param {string} username - GitHub 用户名
 * @param {string} repo - 仓库名
 * @param {string} [path] - 文件路径
 * @param {string} [branch] - 分支名
 * @returns {string} URL
 */
ConfigLoader.getGitHubRawUrl(username, repo, path, branch);
```

### Markdown (markdown.js)

```javascript
/**
 * 从 URL 获取 Markdown
 * @param {string} url - Markdown URL
 * @returns {Promise<string>} 原始 Markdown
 */
Markdown.fetchMarkdown(url);

/**
 * 解析 Markdown 为 HTML
 * @param {string} markdown - 原始 Markdown
 * @returns {string} HTML
 */
Markdown.renderMarkdown(markdown);

/**
 * 应用语法高亮
 * @param {HTMLElement} container - 容器元素
 */
Markdown.applyHighlighting(container);

/**
 * 完整渲染流程
 * @param {string} url - Markdown URL
 * @param {HTMLElement} container - 目标容器
 * @returns {Promise<boolean>} 是否成功
 */
Markdown.renderExternalMarkdown(url, container);

/**
 * 清除 Markdown 缓存
 */
Markdown.clearCache();
```

### Router (router.js)

```javascript
/**
 * 注册路由处理器
 * @param {string} path - 路由路径
 * @param {function} handler - 处理函数
 * @returns {Router} Router 实例
 */
Router.on(path, handler);

/**
 * 导航到指定路径
 * @param {string} path - 目标路径
 */
Router.navigate(path);

/**
 * 获取当前路由
 * @returns {Object} 路由对象
 */
Router.getCurrentRoute();

/**
 * 初始化路由器
 */
Router.init();

/**
 * 更新激活的导航链接
 * @param {string} path - 当前路径
 */
Router.updateActiveNav(path);
```

### GitHubAPI (github-api.js)

```javascript
/**
 * 获取单个仓库数据
 * @param {string} username - GitHub 用户名
 * @param {string} repoName - 仓库名
 * @param {function} callback - 回调函数(error, data)
 */
GitHubAPI.fetchRepoData(username, repoName, callback);

/**
 * 批量获取仓库数据
 * @param {string} username - GitHub 用户名
 * @param {string[]} repoNames - 仓库名列表
 * @param {function} callback - 回调函数(error, results)
 */
GitHubAPI.fetchMultipleRepos(username, repoNames, callback);

/**
 * 更新项目卡片的星标数
 * @param {string} username - GitHub 用户名
 * @param {Object[]} projects - 项目列表
 */
GitHubAPI.updateProjectStars(username, projects);

/**
 * 清除 API 缓存
 */
GitHubAPI.clearCache();
```

### App (app.js)

```javascript
/**
 * 初始化应用
 */
App.init();

/**
 * 渲染文章列表
 */
App.renderArticleList();

/**
 * 渲染文章详情
 * @param {Object} params - 路由参数
 */
App.renderArticleDetail(params);

/**
 * 渲染项目页面
 */
App.renderProjects();

/**
 * 渲染合集列表
 */
App.renderCollectionsList();

/**
 * 渲染合集详情
 * @param {Object} params - 路由参数
 */
App.renderCollectionDetail(params);

/**
 * 渲染章节详情
 * @param {Object} params - 路由参数
 */
App.renderChapterDetail(params);

/**
 * 渲染日记列表
 */
App.renderDiaryList();

/**
 * 渲染日记详情
 * @param {Object} params - 路由参数
 */
App.renderDiaryDetail(params);

/**
 * 渲染关于页面
 */
App.renderAbout();

/**
 * 渲染 404 页面
 */
App.renderNotFound();
```

---

## 4. HTML 结构

### 主容器

```html
<div id="app-content">
  <!-- 路由渲染的内容 -->
</div>
```

### 组件类名

```html
<!-- 文章卡片 -->
<article class="article-card">
  <div class="article-card__date">[日期]</div>
  <h2 class="article-card__title">[标题]</h2>
  <p class="article-card__summary">[摘要]</p>
  <div class="article-card__tags">[标签]</div>
</article>

<!-- 项目卡片 -->
<article class="project-card" data-repo="[仓库名]">
  <div class="project-card__header">
    <h3 class="project-card__name">[名称]</h3>
    <span class="project-card__stars">[*] [数量]</span>
  </div>
  <div class="project-card__lang">[语言]</div>
  <p class="project-card__desc">[描述]</p>
</article>

<!-- 日记卡片 -->
<article class="diary-card">
  <a class="diary-card__link">
    <div class="diary-card__header">
      <span class="diary-card__date">[日期]</span>
      <div class="diary-card__indicators">[心情] [天气]</div>
    </div>
    <p class="diary-card__preview">[预览]</p>
  </a>
</article>

<!-- 合集卡片 -->
<article class="collection-card">
  <a class="collection-card__link">
    <div class="collection-card__header">
      <h2 class="collection-card__title">[标题]</h2>
      <span class="collection-card__chapters">[章节数]</span>
    </div>
    <p class="collection-card__desc">[描述]</p>
  </a>
</article>

<!-- 加载状态 -->
<div class="loading-state">
  <div class="loading-state__spinner"></div>
  <span class="loading-state__text">加载中...</span>
</div>

<!-- 错误状态 -->
<div class="error-state">
  <span class="error-state__icon">[-]</span>
  <span class="error-state__message">[消息]</span>
</div>
```

---

## 5. 全局对象

```javascript
// 配置（加载后）
window.Config = {
  site: { title, author, description, github, lang, copyright_year },
  personal: { name, github_username, email },
  social: [...],
  articles: [...],
  projects: [...],
  diaries: [...],
  collections: [...],
  languageColors: {...},
  moodIcons: {...},
  weatherIcons: {...}
};

// 数据文件（配置加载前）
window.DataArticles = [...];
window.DataProjects = [...];
window.DataDiaries = [...];
window.DataCollections = [...];

// 模块
window.ConfigLoader = {...};
window.Markdown = {...};
window.Router = {...};
window.GitHubAPI = {...};
window.App = {...};

// CDN 库
window.marked = {...};
window.hljs = {...};
window.DOMPurify = {...};
window.toml = {...};
```
