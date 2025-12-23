# 开发指南

Zhuxi Blog 开发、扩展与贡献指南。

---

## 1. 开发环境

### 1.1 启动本地服务器

```bash
# Python
python -m http.server 8000

# Node.js
npx serve

# 访问
open http://localhost:8000
```

[!] 不能直接打开 index.html，因为 XHR 请求需要 HTTP 服务器。

### 1.2 目录结构

```
zhuxiblog/
|-- index.html              # SPA 入口
|-- 404.html                # GitHub Pages 回退
|-- blog.config.toml        # 站点配置
|-- css/
|   +-- style.css           # 样式 (ProArt 设计系统)
|-- js/
|   |-- config.js           # 配置加载
|   |-- markdown.js         # Markdown 渲染
|   |-- router.js           # 哈希路由
|   |-- toc.js              # 目录侧边栏
|   |-- github-api.js       # GitHub API
|   |-- app.js              # 页面渲染
|   |-- lib/
|   |   +-- toml.min.js     # TOML 解析
|   +-- data/
|       |-- articles.js     # 文章数据
|       |-- projects.js     # 项目数据
|       |-- diaries.js      # 日记数据
|       +-- collections.js  # 合集数据
+-- docs/                   # 文档
```

---

## 2. 添加内容

### 2.1 添加文章

编辑 js/data/articles.js：

```javascript
window.DataArticles = [
  {
    slug: 'my-article',        // URL 路径: #/article/my-article
    title: '文章标题',
    date: '2025-01-21',
    summary: '文章摘要',
    repo: 'my-repo',           // 使用 README.md
    // 或 path: 'docs/post.md' // 指定路径
    // 或 url: 'https://...'   // 直接 URL
    tags: ['标签1', '标签2']
  },
  // 更多文章...
];
```

### 2.2 添加项目

编辑 js/data/projects.js：

```javascript
window.DataProjects = [
  {
    name: '项目名',
    description: '项目描述',
    repo: 'repo-name',         // 仓库名
    language: 'Rust',          // 语言
    tags: ['tag1', 'tag2']
  },
  // 更多项目...
];
```

支持的语言颜色：
- C++ (#f34b7d)
- Rust (#dea584)
- Shell (#89e051)
- JavaScript (#f1e05a)
- TypeScript (#2b7489)
- Python (#3572A5)
- Go (#00ADD8)
- Haskell (#5e5086)
- Java (#b07219)
- C (#555555)
- Zig (#ec915c)

### 2.3 添加日记

编辑 js/data/diaries.js：

```javascript
window.DataDiaries = [
  {
    id: '2025-01-21',          // 唯一 ID
    date: '2025-01-21',
    mood: 'productive',        // productive/thoughtful/happy/tired/neutral
    weather: 'sunny',          // sunny/cloudy/rainy/snowy
    content: '今天的内容...',
    tags: ['工作', '生活']
  },
  // 更多日记...
];
```

### 2.4 添加合集

编辑 js/data/collections.js：

```javascript
window.DataCollections = [
  {
    slug: 'my-tutorial',
    title: '教程标题',
    description: '教程描述',
    date: '2025-01-21',
    tags: ['教程'],
    chapters: [
      { number: 1, title: '第一章', repo: 'chapter1-repo' },
      { number: 2, title: '第二章', repo: 'tutorial', path: 'ch02/README.md' },
      { number: 3, title: '第三章', url: 'https://...' }
    ]
  },
  // 更多合集...
];
```

---

## 3. 扩展功能

### 3.1 添加新路由

1. 在 app.js 添加渲染函数：

```javascript
function renderNewPage(params) {
  Router.updateActiveNav('/newpage');

  const html = createPageTitle('New Page') +
    '<div class="fade-in">页面内容...</div>';

  mainContent().textContent = '';
  mainContent().insertAdjacentHTML('beforeend', html);
}
```

2. 在 setupRoutes() 注册：

```javascript
Router
  .on('/newpage', renderNewPage)
  // ...
```

3. 在 index.html 导航添加链接：

```html
<a href="#/newpage" class="site-nav__link">New Page</a>
```

### 3.2 添加新组件

在 app.js 添加组件函数：

```javascript
function createNewCard(data) {
  return '<article class="new-card">' +
    '<h3>' + escapeHtml(data.title) + '</h3>' +
    '<p>' + escapeHtml(data.description) + '</p>' +
  '</article>';
}
```

在 style.css 添加样式：

```css
.new-card {
  background-color: var(--bg-secondary);
  border-left: 2px solid var(--accent-gold);
  padding: var(--space-3);
}
```

### 3.3 添加新数据类型

1. 创建 js/data/newtype.js：

```javascript
window.DataNewType = [
  { id: 1, title: '...' }
];
```

2. 在 index.html 添加脚本：

```html
<script src="js/data/newtype.js"></script>
```

3. 在 config.js 的 buildConfig() 处理：

```javascript
return {
  // ...
  newtype: window.DataNewType || [],
};
```

---

## 4. 样式定制

### 4.1 修改主题色

编辑 css/style.css 的 :root：

```css
:root {
  /* 改为蓝色主题 */
  --accent-gold: #4a90d9;
  --accent-gold-dim: #2d5a87;

  /* 改为更深背景 */
  --bg-primary: #000000;
  --bg-secondary: #0a0a0a;
  --bg-tertiary: #141414;
}
```

### 4.2 添加新组件样式

遵循 BEM 命名和 ProArt 设计原则：

```css
/* 组件名 */
.my-component {
  background-color: var(--bg-secondary);
  border-left: 2px solid var(--accent-gold);
  padding: var(--space-3);
}

/* 元素 */
.my-component__title {
  color: var(--text-primary);
  font-weight: 600;
}

/* 修饰符 */
.my-component--highlighted {
  border-color: var(--accent-gold);
  background-color: var(--bg-tertiary);
}
```

### 4.3 响应式适配

```css
/* 移动端 */
@media (max-width: 640px) {
  .my-component {
    padding: var(--space-2);
  }
}

/* 平板 */
@media (max-width: 960px) {
  .my-component__sidebar {
    display: none;
  }
}
```

---

## 5. 安全注意事项

### 5.1 用户输入

[!] 所有用户可控数据必须使用 escapeHtml() 转义：

```javascript
// 正确
'<h3>' + escapeHtml(article.title) + '</h3>'

// 错误 - XSS 风险
'<h3>' + article.title + '</h3>'
```

### 5.2 外部内容

[!] 外部 Markdown 已通过 DOMPurify 净化，但添加新的内容源时需注意：

```javascript
// 正确 - 使用 Markdown 模块
Markdown.renderExternalMarkdown(url, container);

// 错误 - 直接插入未净化内容
// 不要这样做
```

### 5.3 URL 验证

[!] 新增 URL 输入时需验证：

```javascript
// 检查 URL 协议
if (!url.startsWith('http') && !url.startsWith('./') && !url.startsWith('/')) {
  throw new Error('Invalid URL');
}
```

---

## 6. 调试

### 6.1 控制台日志

模块使用统一格式的日志：

```javascript
console.log('[+] 成功信息');
console.warn('[!] 警告信息');
console.error('[-] 错误信息');
```

### 6.2 检查配置

```javascript
// 在控制台查看加载的配置
console.log(window.Config);

// 查看原始数据
console.log(window.DataArticles);
console.log(window.DataProjects);
```

### 6.3 检查路由

```javascript
// 当前路由
console.log(Router.getCurrentRoute());

// 解析哈希
console.log(Router.parseHash('#/article/my-post'));
```

### 6.4 清除缓存

```javascript
// 清除 Markdown 缓存
Markdown.clearCache();

// 清除 GitHub API 缓存
GitHubAPI.clearCache();
```

---

## 7. 代码规范

### 7.1 JavaScript

- 使用 var (兼容性) 或 const/let
- 使用 IIFE 封装模块
- 导出到 window 全局对象
- 函数式风格，纯函数优先

```javascript
const Module = (function() {
  function pureFunction(input) {
    return output;
  }

  return {
    pureFunction: pureFunction
  };
})();

window.Module = Module;
```

### 7.2 CSS

- 使用 CSS 变量
- BEM 命名规范
- 移动优先响应式
- 仅使用 fade 动画

### 7.3 HTML

- 语义化标签
- 无障碍属性 (aria-label)
- 最小化内联样式

---

## 8. 发布检查清单

部署前确认：

- [ ] 所有路径使用相对路径
- [ ] 无控制台错误
- [ ] 移动端布局正常
- [ ] TOC 功能正常
- [ ] 外部链接正常
- [ ] 配置文件正确
- [ ] 数据文件格式正确

---

## 9. 贡献流程

### 9.1 提交 Issue

- Bug 报告：提供复现步骤
- 功能请求：说明使用场景

### 9.2 提交 PR

1. Fork 仓库
2. 创建功能分支
3. 提交更改
4. 创建 PR

### 9.3 Commit 格式

```
类型: 简短描述

详细说明 (可选)
```

类型：
- feat - 新功能
- fix - Bug 修复
- docs - 文档更新
- style - 样式调整
- refactor - 代码重构
- perf - 性能优化

---

## 10. 常见问题

### Q: 文章内容不显示

检查：
1. Markdown URL 是否正确
2. 是否 CORS 问题 (使用 raw.githubusercontent.com)
3. 控制台是否有错误

### Q: 星标数不显示

检查：
1. 仓库名是否正确
2. 仓库是否公开
3. 是否超过 API 限制 (60次/小时)

### Q: TOC 不显示

检查：
1. 文章是否有足够标题 (至少 2 个)
2. 内容是否正确渲染
3. 控制台是否有错误

### Q: 本地预览空白

检查：
1. 是否使用 HTTP 服务器 (不能直接打开文件)
2. blog.config.toml 是否存在
3. 控制台是否有 404 错误
