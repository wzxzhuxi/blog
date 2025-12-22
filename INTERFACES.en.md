# Zhuxi Blog - Interface Definitions

**[Chinese](INTERFACES.md)** | English

---

## 1. Data Structures

### Article Object

```javascript
/**
 * @typedef {Object} Article
 * @property {string} slug - URL-friendly identifier
 * @property {string} title - Article title
 * @property {string} date - ISO date string (YYYY-MM-DD)
 * @property {string} summary - Short description
 * @property {string} [repo] - GitHub repo name (auto-generates URL)
 * @property {string} [path] - Path within repo (default: README.md)
 * @property {string} [url] - Direct URL (overrides repo)
 * @property {Object} [external] - External repo config
 * @property {string[]} tags - Article tags
 */

// Example 1: Own repo README
{
  slug: "my-project",
  title: "My Project",
  date: "2025-01-15",
  summary: "A cool project I made",
  repo: "my-project",
  tags: ["rust", "systems"]
}

// Example 2: Own repo with path
{
  slug: "docs-guide",
  title: "Documentation Guide",
  date: "2025-01-15",
  summary: "How to write docs",
  repo: "my-project",
  path: "docs/guide.md",
  tags: ["docs"]
}

// Example 3: Direct URL
{
  slug: "external-article",
  title: "External Article",
  date: "2025-01-15",
  summary: "An article from elsewhere",
  url: "https://raw.githubusercontent.com/user/repo/main/file.md",
  tags: ["external"]
}
```

### Project Object

```javascript
/**
 * @typedef {Object} Project
 * @property {string} name - Display name
 * @property {string} description - Project description
 * @property {string} repo - GitHub repo name
 * @property {string} language - Primary language
 * @property {string[]} tags - Project tags
 * @property {number} [stars] - Static star count (overrides API)
 */

// Example
{
  name: "CharlieDB",
  description: "A time series database in Rust",
  repo: "CharlieDB",
  language: "Rust",
  tags: ["database", "timeseries"]
}
```

### Diary Object

```javascript
/**
 * @typedef {Object} Diary
 * @property {string} id - Unique identifier (usually date)
 * @property {string} date - ISO date string
 * @property {string} mood - Mood identifier
 * @property {string} weather - Weather identifier
 * @property {string} content - Diary content (plain text)
 * @property {string[]} tags - Entry tags
 */

// Example
{
  id: "2025-12-22",
  date: "2025-12-22",
  mood: "productive",
  weather: "sunny",
  content: "Today I built a blog...",
  tags: ["coding", "blog"]
}
```

### Collection Object

```javascript
/**
 * @typedef {Object} Collection
 * @property {string} slug - URL-friendly identifier
 * @property {string} title - Collection title
 * @property {string} [author] - Author name (defaults to config)
 * @property {string} description - Collection description
 * @property {string} date - ISO date string
 * @property {string[]} tags - Collection tags
 * @property {Chapter[]} chapters - Chapter list
 */

/**
 * @typedef {Object} Chapter
 * @property {number} number - Chapter number
 * @property {string} title - Chapter title
 * @property {string} [repo] - GitHub repo name
 * @property {string} [path] - Path within repo
 * @property {string} [url] - Direct URL
 */

// Example
{
  slug: "rust-guide",
  title: "Rust Systems Programming",
  description: "Building systems in Rust",
  date: "2025-12-20",
  tags: ["Rust", "systems"],
  chapters: [
    { number: 1, title: "Thread Pools", repo: "thread-pool" },
    { number: 2, title: "Database Design", repo: "CharlieDB" }
  ]
}
```

---

## 2. Configuration (blog.config.toml)

```toml
[personal]
name = "Your Name"
github_username = "username"
email = "email@example.com"

[site]
title = "Blog Title"
description = "Blog description"
copyright_year = 2025
lang = "en"

[github]
default_branch = "main"
about_branch = "main"

[[social]]
label = "GitHub"
type = "github"
icon = "[+]"
```

---

## 3. Module Interfaces

### ConfigLoader (config.js)

```javascript
/**
 * Load configuration from TOML file
 * @param {function} callback - Callback(error, config)
 */
ConfigLoader.load(callback);

/**
 * Update page metadata from config
 * @param {Object} config - Configuration object
 */
ConfigLoader.updatePageMeta(config);

/**
 * Generate GitHub repo URL
 * @param {string} username - GitHub username
 * @param {string} [repo] - Repository name
 * @returns {string} URL
 */
ConfigLoader.getGitHubRepoUrl(username, repo);

/**
 * Generate GitHub raw content URL
 * @param {string} username - GitHub username
 * @param {string} repo - Repository name
 * @param {string} [path] - File path
 * @param {string} [branch] - Branch name
 * @returns {string} URL
 */
ConfigLoader.getGitHubRawUrl(username, repo, path, branch);
```

### Markdown (markdown.js)

```javascript
/**
 * Fetch markdown from URL
 * @param {string} url - Markdown URL
 * @returns {Promise<string>} Raw markdown
 */
Markdown.fetchMarkdown(url);

/**
 * Parse markdown to HTML
 * @param {string} markdown - Raw markdown
 * @returns {string} HTML
 */
Markdown.renderMarkdown(markdown);

/**
 * Apply syntax highlighting
 * @param {HTMLElement} container - Container element
 */
Markdown.applyHighlighting(container);

/**
 * Full render pipeline
 * @param {string} url - Markdown URL
 * @param {HTMLElement} container - Target container
 * @returns {Promise<boolean>} Success
 */
Markdown.renderExternalMarkdown(url, container);

/**
 * Clear markdown cache
 */
Markdown.clearCache();
```

### Router (router.js)

```javascript
/**
 * Register route handler
 * @param {string} path - Route path
 * @param {function} handler - Handler function
 * @returns {Router} Router instance
 */
Router.on(path, handler);

/**
 * Navigate to path
 * @param {string} path - Target path
 */
Router.navigate(path);

/**
 * Get current route
 * @returns {Object} Route object
 */
Router.getCurrentRoute();

/**
 * Initialize router
 */
Router.init();

/**
 * Update active nav link
 * @param {string} path - Current path
 */
Router.updateActiveNav(path);
```

### GitHubAPI (github-api.js)

```javascript
/**
 * Fetch single repo data
 * @param {string} username - GitHub username
 * @param {string} repoName - Repository name
 * @param {function} callback - Callback(error, data)
 */
GitHubAPI.fetchRepoData(username, repoName, callback);

/**
 * Fetch multiple repos
 * @param {string} username - GitHub username
 * @param {string[]} repoNames - Repository names
 * @param {function} callback - Callback(error, results)
 */
GitHubAPI.fetchMultipleRepos(username, repoNames, callback);

/**
 * Update project card star counts
 * @param {string} username - GitHub username
 * @param {Object[]} projects - Project list
 */
GitHubAPI.updateProjectStars(username, projects);

/**
 * Clear API cache
 */
GitHubAPI.clearCache();
```

### App (app.js)

```javascript
/**
 * Initialize application
 */
App.init();

/**
 * Render article list
 */
App.renderArticleList();

/**
 * Render article detail
 * @param {Object} params - Route params
 */
App.renderArticleDetail(params);

/**
 * Render projects page
 */
App.renderProjects();

/**
 * Render collections list
 */
App.renderCollectionsList();

/**
 * Render collection detail
 * @param {Object} params - Route params
 */
App.renderCollectionDetail(params);

/**
 * Render chapter detail
 * @param {Object} params - Route params
 */
App.renderChapterDetail(params);

/**
 * Render diary list
 */
App.renderDiaryList();

/**
 * Render diary detail
 * @param {Object} params - Route params
 */
App.renderDiaryDetail(params);

/**
 * Render about page
 */
App.renderAbout();

/**
 * Render 404 page
 */
App.renderNotFound();
```

---

## 4. HTML Structure

### Main Container

```html
<div id="app-content">
  <!-- Content rendered by router -->
</div>
```

### Component Classes

```html
<!-- Article Card -->
<article class="article-card">
  <div class="article-card__date">[date]</div>
  <h2 class="article-card__title">[title]</h2>
  <p class="article-card__summary">[summary]</p>
  <div class="article-card__tags">[tags]</div>
</article>

<!-- Project Card -->
<article class="project-card" data-repo="[repo]">
  <div class="project-card__header">
    <h3 class="project-card__name">[name]</h3>
    <span class="project-card__stars">[*] [count]</span>
  </div>
  <div class="project-card__lang">[language]</div>
  <p class="project-card__desc">[description]</p>
</article>

<!-- Diary Card -->
<article class="diary-card">
  <a class="diary-card__link">
    <div class="diary-card__header">
      <span class="diary-card__date">[date]</span>
      <div class="diary-card__indicators">[mood] [weather]</div>
    </div>
    <p class="diary-card__preview">[preview]</p>
  </a>
</article>

<!-- Collection Card -->
<article class="collection-card">
  <a class="collection-card__link">
    <div class="collection-card__header">
      <h2 class="collection-card__title">[title]</h2>
      <span class="collection-card__chapters">[count]</span>
    </div>
    <p class="collection-card__desc">[description]</p>
  </a>
</article>

<!-- Loading State -->
<div class="loading-state">
  <div class="loading-state__spinner"></div>
  <span class="loading-state__text">Loading...</span>
</div>

<!-- Error State -->
<div class="error-state">
  <span class="error-state__icon">[-]</span>
  <span class="error-state__message">[message]</span>
</div>
```

---

## 5. Global Objects

```javascript
// Configuration (after load)
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

// Data files (before config load)
window.DataArticles = [...];
window.DataProjects = [...];
window.DataDiaries = [...];
window.DataCollections = [...];

// Modules
window.ConfigLoader = {...};
window.Markdown = {...};
window.Router = {...};
window.GitHubAPI = {...};
window.App = {...};

// CDN libraries
window.marked = {...};
window.hljs = {...};
window.DOMPurify = {...};
window.toml = {...};
```
