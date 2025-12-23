# 架构文档

Zhuxi Blog 系统架构与设计决策。

---

## 1. 系统概览

```
+------------------+     +-------------------+     +------------------+
|   GitHub Pages   | --> |   静态资源        | --> |   浏览器         |
|   (托管)         |     |   (HTML/CSS/JS)   |     |   (SPA 客户端)   |
+------------------+     +-------------------+     +------------------+
                                                          |
                              +---------------------------+---------------------------+
                              |                           |                           |
                              v                           v                           v
                   +-------------------+       +-------------------+       +-------------------+
                   |  GitHub Raw       |       |  GitHub API       |       |  localStorage     |
                   |  (Markdown 内容)  |       |  (仓库星标数)     |       |  (API 缓存)       |
                   +-------------------+       +-------------------+       +-------------------+
```

**设计原则**：
- [+] 零构建 - 纯静态文件，无需编译
- [+] 客户端渲染 - 所有逻辑在浏览器执行
- [+] 外部内容 - Markdown 从 GitHub 仓库加载
- [+] 增量数据 - API 数据按需获取并缓存

---

## 2. 模块加载顺序

```
index.html 加载顺序:

1. toml.min.js          # TOML 解析器 (本地)
2. marked.min.js        # Markdown 解析 (CDN)
3. purify.min.js        # XSS 防护 (CDN)
4. highlight.min.js     # 代码高亮 (CDN)
5. js/data/*.js         # 数据文件 -> window.Data* 全局变量
6. js/config.js         # ConfigLoader -> 解析 TOML，处理数据
7. js/github-api.js     # GitHubAPI -> 获取星标数
8. js/markdown.js       # Markdown -> 获取/渲染外部内容
9. js/toc.js            # TOC -> 目录侧边栏
10. js/router.js        # Router -> 哈希路由
11. js/app.js           # App -> 页面渲染

初始化序列:
ConfigLoader.load() -> ConfigLoader.updatePageMeta() -> App.init() -> Router.init()
```

[!] **关键依赖**：Router 依赖 Config，App 依赖 Router。必须按序初始化。

---

## 3. 核心模块

### 3.1 ConfigLoader (config.js)

**职责**：加载配置，处理数据，生成 URL

```
blog.config.toml + js/data/*.js
          |
          v
    [ConfigLoader]
          |
          +-- 解析 TOML
          +-- 合并默认配置
          +-- 处理文章/项目/合集数据
          +-- 从 repo 名生成 URL
          |
          v
    window.Config (全局配置对象)
```

**URL 生成策略**：

| 输入格式 | 生成 URL |
|----------|----------|
| `repo: 'name'` | `https://raw.githubusercontent.com/{user}/{name}/{branch}/README.md` |
| `repo + path` | `https://raw.githubusercontent.com/{user}/{repo}/{branch}/{path}` |
| `url: '...'` | 直接使用 |
| `external: {...}` | 根据 external 对象构建 URL |

### 3.2 Markdown (markdown.js)

**职责**：获取、解析、安全渲染 Markdown

```
外部 URL
    |
    v
[fetchMarkdown] --> 会话缓存 (Map)
    |
    v
[isHTMLContent] --> 拒绝 HTML 内容
    |
    v
[renderMarkdown] --> marked.parse()
    |
    v
[sanitizeHTML] --> DOMPurify.sanitize()
    |
    v
[applyHighlighting] --> hljs.highlightElement()
    |
    v
安全 DOM 插入
```

**安全措施**：
- [+] URL 验证 - 仅允许 http(s) 和相对路径
- [+] HTML 检测 - 拒绝 <!doctype、<html> 等
- [+] XSS 防护 - 所有输出经 DOMPurify 净化
- [+] 安全插入 - 使用 DOMParser 而非 innerHTML

### 3.3 TOC (toc.js)

**职责**：提取标题，构建目录，滚动监听

```
渲染后的内容
    |
    v
[extractHeadings] --> 提取 h1-h4，生成 ID
    |
    v
[buildTOC] --> 构建目录 DOM
    |
    v
[initScrollSpy] --> IntersectionObserver 监听
    |
    v
[setActiveHeading] --> 高亮当前标题
```

**特性**：
- 自动为无 ID 标题生成 slug
- 支持中文标题
- 移动端抽屉模式
- 平滑滚动定位

### 3.4 Router (router.js)

**职责**：哈希路由，URL 解析，导航状态

```
URL 哈希变化
    |
    v
[parseHash] --> { path, params }
    |
    v
[routes.get(path)] --> 路由处理器
    |
    v
[updateActiveNav] --> 更新导航高亮
```

**路由表**：

| 模式 | 参数 | 处理器 |
|------|------|--------|
| `/` | - | renderArticleList |
| `/article/:slug` | slug | renderArticleDetail |
| `/projects` | - | renderProjects |
| `/collections` | - | renderCollectionsList |
| `/collection/:slug` | slug | renderCollectionDetail |
| `/collection/:slug/:chapter` | slug, chapter | renderChapterDetail |
| `/diary` | - | renderDiaryList |
| `/diary/:id` | id | renderDiaryDetail |
| `/about` | - | renderAbout |
| `/404` | - | renderNotFound |

### 3.5 GitHubAPI (github-api.js)

**职责**：获取仓库数据，管理缓存

```
项目列表
    |
    v
[getCache] --> localStorage 检查
    |
    +-- 命中 --> 返回缓存数据
    |
    +-- 未命中 --> [fetchRepoData]
                      |
                      v
                  GitHub API
                      |
                      v
                  [setCache] --> 存储到 localStorage
```

**缓存策略**：
- 存储位置：localStorage
- 有效期：当日有效，午夜过期
- 键名：`github_repo_cache`
- 内容：`{ date: 'YYYY-MM-DD', repos: {...} }`

### 3.6 App (app.js)

**职责**：页面渲染，组件构建，DOM 操作

```
路由触发
    |
    v
[renderXxx] --> 构建 HTML 字符串
    |
    v
[mainContent().innerHTML] --> DOM 更新
    |
    +-- 需要外部内容 --> Markdown.renderExternalMarkdown()
    |                          |
    |                          v
    |                    TOC.update() --> 更新目录
    |
    +-- 需要 API 数据 --> GitHubAPI.updateProjectStars()
```

**组件函数**：
- `createPageTitle()` - 页面标题 + 金色下划线
- `createTag()` - 标签元素
- `createBackLink()` - 返回链接
- `createArticleCard()` - 文章卡片
- `createProjectCard()` - 项目卡片
- `createDiaryCard()` - 日记卡片
- `createCollectionCard()` - 合集卡片

---

## 4. 数据流

### 4.1 配置加载流程

```
blog.config.toml                    js/data/*.js
       |                                  |
       v                                  v
 [XHR 请求]                    [script 标签加载]
       |                                  |
       v                                  v
 [toml.parse()]              window.DataArticles
       |                     window.DataProjects
       v                     window.DataDiaries
 parsed TOML                 window.DataCollections
       |                                  |
       +----------------------------------+
                      |
                      v
            [buildConfig()]
                      |
                      +-- processArticles()
                      +-- processProjects()
                      +-- processCollections()
                      |
                      v
              window.Config
```

### 4.2 页面渲染流程

```
hashchange 事件
       |
       v
[Router.handleRouteChange]
       |
       v
[parseHash] --> { path: '/article/:slug', params: { slug: 'xxx' } }
       |
       v
[App.renderArticleDetail(params)]
       |
       +-- 构建页面骨架 HTML
       +-- 插入到 #app-content
       +-- 调用 Markdown.renderExternalMarkdown()
       |        |
       |        +-- 显示加载状态
       |        +-- 获取 Markdown
       |        +-- 解析 + 净化
       |        +-- 插入内容
       |        +-- 代码高亮
       |
       +-- 调用 TOC.update()
                |
                +-- 提取标题
                +-- 构建目录
                +-- 启动滚动监听
```

---

## 5. 安全模型

### 5.1 XSS 防护

| 层级 | 措施 |
|------|------|
| 输入验证 | URL 必须以 http/https/相对路径开头 |
| 内容检测 | 拒绝 HTML 文档 (<!doctype, <html>) |
| 输出净化 | 所有 Markdown 输出经 DOMPurify 处理 |
| DOM 操作 | 用户数据使用 escapeHtml() 转义 |
| 安全插入 | 使用 DOMParser 而非 innerHTML |

### 5.2 escapeHtml 实现

```javascript
function escapeHtml(text) {
  if (typeof text !== 'string') return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
```

---

## 6. 缓存策略

| 缓存类型 | 存储位置 | 有效期 | 用途 |
|----------|----------|--------|------|
| Markdown | 内存 Map | 会话期间 | 避免重复获取相同文章 |
| GitHub API | localStorage | 当日 | 减少 API 调用 |

---

## 7. 响应式设计

### 断点

| 断点 | 宽度 | 布局变化 |
|------|------|----------|
| 移动端 | < 640px | 导航折叠，单列布局 |
| 平板 | < 960px | TOC 变为抽屉模式 |
| 桌面 | >= 960px | TOC 侧边栏常驻 |

### TOC 适配

```css
/* 桌面: 侧边栏 */
.content-with-toc {
  display: flex;
  gap: 32px;
}

/* 移动端: 抽屉 */
@media (max-width: 960px) {
  .content-with-toc__sidebar {
    position: fixed;
    right: -280px;
    transition: right 200ms;
  }
  .content-with-toc__sidebar.is-open {
    right: 0;
  }
}
```

---

## 8. 性能优化

- [+] **懒加载** - 文章内容按需获取
- [+] **会话缓存** - Markdown 内容缓存在内存
- [+] **每日缓存** - API 数据存储在 localStorage
- [+] **最小 DOM** - 使用字符串拼接后一次性插入
- [+] **CDN 加载** - 外部库使用 CDN

---

## 9. GitHub Pages 兼容

- [+] **相对路径** - 所有资源使用相对路径
- [+] **哈希路由** - 避免 404 问题
- [+] **CORS 友好** - 使用 raw.githubusercontent.com
- [+] **无服务端** - 纯静态文件

---

## 10. 扩展点

| 扩展 | 实现方式 |
|------|----------|
| 添加新路由 | Router.on() + App.renderXxx() |
| 添加新内容类型 | js/data/新文件.js + ConfigLoader 处理 |
| 添加新组件 | App 中添加 createXxxCard() |
| 修改主题 | 编辑 css/style.css 变量 |
| 添加 API 集成 | 新建 js/xxx-api.js 模块 |
