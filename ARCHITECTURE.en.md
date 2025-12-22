# Zhuxi Blog - Architecture

**[Chinese](ARCHITECTURE.md)** | English

---

## 1. System Overview

A GitHub Pages static blog with ProArt design style.

```
+------------------+     +-------------------+     +------------------+
|   GitHub Pages   | --> |   Static Assets   | --> |   Browser        |
|   (Hosting)      |     |   (HTML/CSS/JS)   |     |   (Client)       |
+------------------+     +-------------------+     +------------------+
                                                          |
                                                          v
                                               +-------------------+
                                               |  External URLs    |
                                               |  (Markdown Files) |
                                               +-------------------+
                                                          |
                                                          v
                                               +-------------------+
                                               |  GitHub API       |
                                               |  (Star Counts)    |
                                               +-------------------+
```

## 2. Directory Structure

```
zhuxiblog/
|-- index.html              # Main SPA page
|-- 404.html                # GitHub Pages fallback
|-- blog.config.toml        # User configuration
|-- blog.config.template.toml # Template for new users
|-- css/
|   +-- style.css           # ProArt design system
|-- js/
|   |-- config.js           # TOML config loader
|   |-- markdown.js         # Markdown rendering
|   |-- router.js           # Hash-based routing
|   |-- github-api.js       # GitHub API integration
|   |-- app.js              # Application logic
|   |-- lib/
|   |   +-- toml.min.js     # TOML parser
|   +-- data/
|       |-- articles.js     # Article entries
|       |-- projects.js     # Project entries
|       |-- diaries.js      # Diary entries
|       +-- collections.js  # Multi-chapter tutorials
+-- README.md               # Documentation
```

## 3. Core Modules

### 3.1 Configuration Module (config.js)
- Loads and parses `blog.config.toml`
- Processes data files (articles, projects, diaries, collections)
- Generates URLs from repo names using user config
- Provides fallback defaults

### 3.2 Markdown Module (markdown.js)
- Fetches Markdown from external URLs
- Parses using marked.js
- Applies syntax highlighting with highlight.js
- Uses DOMPurify for XSS protection
- Handles loading states and errors

### 3.3 Router Module (router.js)
- Hash-based routing (#/, #/article/:slug, etc.)
- Route parsing and navigation
- Active nav state management

### 3.4 GitHub API Module (github-api.js)
- Fetches repository data (star counts)
- Daily cache in localStorage
- Updates project cards with live data

### 3.5 Application Module (app.js)
- Page rendering for all routes
- Component builders (cards, lists, etc.)
- Navigation management

## 4. Data Flow

```
[blog.config.toml]     [js/data/*.js]
        |                    |
        v                    v
   [ConfigLoader]  ---> [Data Processing]
        |                    |
        v                    v
   [Config Object] <--- [Processed Data]
        |
        v
    [Router]
        |
        v
    [App Renderer]
        |
        v
   [DOM Updates]
```

## 5. External Dependencies (CDN)

- marked.js: Markdown parsing
- highlight.js: Syntax highlighting
- DOMPurify: XSS protection

## 6. ProArt Design Constants

```css
/* Background Layers */
--bg-primary: #0a0a0a;
--bg-secondary: #121212;
--bg-tertiary: #1a1a1a;

/* Accent - Gold Only */
--accent-gold: #c9a962;
--accent-gold-dim: #8b7355;

/* Text Hierarchy */
--text-primary: #ffffff;
--text-secondary: #e5e5e5;
--text-tertiary: #a3a3a3;
--text-muted: #525252;

/* Semantic (Minimal Use) */
--semantic-error: #7f2d2d;
--semantic-success: #14532d;
```

## 7. Routes

| Route | Page | Description |
|-------|------|-------------|
| `#/` | Articles | Article list |
| `#/article/:slug` | Article | Single article view |
| `#/projects` | Projects | Project grid |
| `#/collections` | Collections | Collection list |
| `#/collection/:slug` | Collection | Collection TOC |
| `#/collection/:slug/:chapter` | Chapter | Chapter content |
| `#/diary` | Diary | Diary list |
| `#/diary/:id` | Diary Entry | Single diary view |
| `#/about` | About | About page |

## 8. Responsive Breakpoints

- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## 9. Performance Considerations

- Lazy loading of article content
- Session caching for fetched Markdown
- Daily caching for GitHub API data
- Minimal DOM operations
- Avoid unnecessary re-renders

## 10. GitHub Pages Compatibility

- All paths are relative
- No server-side processing needed
- Hash-based routing (no 404 issues)
- Uses CORS-friendly external URLs (GitHub raw, Gist)
