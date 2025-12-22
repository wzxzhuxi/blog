# Zhuxi Blog

**[Chinese](README.md)** | English

---

A minimalist static blog platform with industrial elegant design. Built for GitHub Pages.

```
Design Philosophy: "Precision. Restraint. Industrial elegance."
```

## Features

- [+] **ProArt Design System** - Dark theme with gold accents
- [+] **TOML Configuration** - Simple config file for site settings
- [+] **External Markdown** - Load articles from any URL
- [+] **GitHub Pages Ready** - Pure static, no build step
- [+] **Responsive Design** - Works on all devices
- [+] **Fast Loading** - No framework, minimal dependencies
- [+] **Secure** - XSS protection via DOMPurify
- [+] **GitHub API Integration** - Dynamic star counts for projects

## Quick Start

### 1. Fork or Clone

```bash
git clone https://github.com/wzxzhuxi/zhuxiblog.git
cd zhuxiblog
```

### 2. Configure Your Blog

Copy the template and edit your configuration:

```bash
cp blog.config.template.toml blog.config.toml
```

Edit `blog.config.toml`:

```toml
[personal]
name = "Your Name"
github_username = "your-github-username"
email = "your@email.com"

[site]
title = "My Blog"
description = "A personal blog about programming"
copyright_year = 2025
lang = "en"

[github]
default_branch = "main"
about_branch = "main"

[[social]]
label = "GitHub"
type = "github"
icon = "[+]"

[[social]]
label = "Email"
type = "email"
icon = "[+]"
```

### 3. Add Articles

Edit `js/data/articles.js`:

```javascript
window.DataArticles = [
  {
    slug: 'my-first-post',
    title: 'My First Post',
    date: '2025-01-21',
    summary: 'A short description of the article.',
    repo: 'my-repo-name',  // Uses README.md from this repo
    tags: ['intro']
  }
];
```

Article sources can be:
- **Own repo README**: `{ repo: 'my-project' }`
- **Own repo with path**: `{ repo: 'my-project', path: 'docs/article.md' }`
- **Direct URL**: `{ url: 'https://raw.githubusercontent.com/...' }`
- **External repo**: `{ external: { username: 'other', repo: 'repo', path: 'file.md' } }`

### 4. Add Projects

Edit `js/data/projects.js`:

```javascript
window.DataProjects = [
  {
    name: 'My Project',
    description: 'A cool project I made',
    repo: 'my-project',
    language: 'Rust',
    tags: ['rust', 'systems']
  }
];
```

Star counts are fetched automatically from the GitHub API.

### 5. Deploy to GitHub Pages

1. Push to GitHub
2. Go to Settings > Pages
3. Set Source to "main" branch, root directory
4. Your blog will be live at `https://username.github.io/repo-name`

## Local Development

Open `index.html` directly in browser, or use a local server:

```bash
# Python
python -m http.server 8000

# Node.js
npx serve
```

Visit `http://localhost:8000`

## File Structure

```
zhuxiblog/
|-- index.html              # Main SPA page
|-- 404.html                # GitHub Pages fallback
|-- blog.config.toml        # Site configuration
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

## Configuration Reference

### blog.config.toml

| Section | Key | Description |
|---------|-----|-------------|
| `[personal]` | `name` | Your display name |
| `[personal]` | `github_username` | GitHub username for URL generation |
| `[personal]` | `email` | Email for social links |
| `[site]` | `title` | Blog title |
| `[site]` | `description` | Meta description |
| `[site]` | `copyright_year` | Footer copyright year |
| `[site]` | `lang` | Language code (en, zh) |
| `[github]` | `default_branch` | Default branch for repos |
| `[github]` | `about_branch` | Branch for About page README |
| `[[social]]` | `label`, `type`, `icon` | Social link entries |

### Data Files

Each data file exports a global array:

- `window.DataArticles` - Blog articles
- `window.DataProjects` - GitHub projects
- `window.DataDiaries` - Personal diary entries
- `window.DataCollections` - Multi-chapter tutorials

## Dependencies (CDN)

- [marked.js](https://marked.js.org/) - Markdown parsing
- [highlight.js](https://highlightjs.org/) - Code syntax highlighting
- [DOMPurify](https://github.com/cure53/DOMPurify) - XSS protection

## Design Specifications

### Colors

| Variable | Value | Usage |
|----------|-------|-------|
| `--bg-primary` | #0a0a0a | Main background |
| `--bg-secondary` | #121212 | Cards, sections |
| `--bg-tertiary` | #1a1a1a | Hover, elevated |
| `--accent-gold` | #c9a962 | Accent, highlight |
| `--text-primary` | #ffffff | Headings |
| `--text-secondary` | #e5e5e5 | Body text |

### Markers (No Emoji)

| Marker | Meaning |
|--------|---------|
| `[+]` | Positive / Success |
| `[-]` | Negative / Error |
| `[!]` | Warning / Important |
| `[i]` | Info / Note |
| `[/]` | Complete / Check |
| `[*]` | Star / Featured |

## License

MIT License. Use freely.

---

```
[/] Built with precision and restraint.
```
