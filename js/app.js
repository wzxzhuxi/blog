/**
 * ProArt Blog - Application Logic
 *
 * Main application module handling all page rendering.
 * Uses functional composition for UI components.
 */

const App = (function() {
  const mainContent = function() {
    return document.getElementById('app-content');
  };

  // Render ID to prevent race conditions during async operations
  let currentRenderId = 0;

  // Page type constants for explicit identification
  const PAGE_TYPES = {
    ARTICLE_LIST: 'article-list',
    ARTICLE_DETAIL: 'article-detail',
    PROJECT_LIST: 'project-list',
    COLLECTION_LIST: 'collection-list',
    COLLECTION_DETAIL: 'collection-detail',
    CHAPTER_DETAIL: 'chapter-detail',
    DIARY_LIST: 'diary-list',
    DIARY_DETAIL: 'diary-detail',
    ABOUT: 'about',
    NOT_FOUND: 'not-found'
  };

  /**
   * Clear the main content area completely before rendering a new page.
   * This prevents any DOM pollution from previous pages.
   * @param {string} pageType - The type of page being rendered
   */
  function clearAndPrepare(pageType) {
    const container = mainContent();
    // Force complete DOM replacement - remove all children
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    // Set data attribute to identify current page type
    container.setAttribute('data-page-type', pageType);
    return container;
  }

  // ============================================
  // Component Builders (Pure Functions)
  // ============================================

  /**
   * Create page title with underline
   */
  function createPageTitle(text) {
    return '<div class="page-title">' +
      '<h1 class="page-title__text">' + escapeHtml(text) + '</h1>' +
      '<div class="page-title__line"></div>' +
    '</div>';
  }

  /**
   * Create tag element
   */
  function createTag(tag) {
    return '<span class="tag">' + escapeHtml(tag) + '</span>';
  }

  /**
   * Create tags list
   */
  function createTags(tags) {
    if (!tags || tags.length === 0) return '';
    return '<div class="article-card__tags">' +
      tags.map(createTag).join('') +
    '</div>';
  }

  /**
   * Create back link
   */
  function createBackLink(href, text) {
    return '<a href="' + href + '" class="back-link">' +
      '<span class="text-gold">[&lt;]</span> ' + escapeHtml(text) +
    '</a>';
  }

  /**
   * Escape HTML to prevent XSS
   */
  function escapeHtml(text) {
    if (typeof text !== 'string') return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Format date for display
   */
  function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  // ============================================
  // Article Components
  // ============================================

  function createArticleCard(article) {
    return '<article class="article-card">' +
      '<div class="article-card__date">' + escapeHtml(article.date) + '</div>' +
      '<h2 class="article-card__title">' +
        '<a href="#/article/' + escapeHtml(article.slug) + '">' +
          escapeHtml(article.title) +
        '</a>' +
      '</h2>' +
      '<p class="article-card__summary">' + escapeHtml(article.summary) + '</p>' +
      createTags(article.tags) +
    '</article>';
  }

  function renderArticleList() {
    Router.updateActiveNav('/');
    clearAndPrepare(PAGE_TYPES.ARTICLE_LIST);

    const html = createPageTitle('Articles') +
      '<div class="article-list fade-in">' +
        Config.articles.map(createArticleCard).join('') +
      '</div>';

    mainContent().innerHTML = html;
  }

  function renderArticleDetail(params) {
    Router.updateActiveNav('/');
    clearAndPrepare(PAGE_TYPES.ARTICLE_DETAIL);

    // Increment render ID to invalidate any pending async operations
    const renderId = ++currentRenderId;

    const article = Config.articles.find(function(a) {
      return a.slug === params.slug;
    });

    if (!article) {
      renderNotFound();
      return;
    }

    const html = createBackLink('#/', 'Back to Articles') +
      '<article class="article-content fade-in">' +
        '<header class="article-content__header">' +
          '<h1 class="article-content__title">' + escapeHtml(article.title) + '</h1>' +
          '<div class="article-content__meta">' +
            '<span class="font-mono">' + escapeHtml(article.date) + '</span>' +
            createTags(article.tags) +
          '</div>' +
        '</header>' +
        '<div id="article-body" class="article-content__body">' +
          '<div class="loading-state">' +
            '<div class="loading-state__spinner"></div>' +
            '<span class="loading-state__text">Loading content...</span>' +
          '</div>' +
        '</div>' +
      '</article>';

    mainContent().innerHTML = html;

    // Load external markdown (with render ID check and page type validation)
    if (article.url && window.Markdown) {
      const bodyEl = document.getElementById('article-body');
      // Only proceed if this render is still current
      if (renderId === currentRenderId) {
        Markdown.renderExternalMarkdown(article.url, bodyEl, PAGE_TYPES.ARTICLE_DETAIL);
      }
    }
  }

  // ============================================
  // Project Components
  // ============================================

  function createProjectCard(project) {
    const langColor = Config.languageColors[project.language] || '#666';
    const hasStaticStars = typeof project.stars === 'number' && project.stars > 0;
    // Show loading state if no static stars but has repo (will be fetched from API)
    const hasRepo = !!project.repo;
    const starsContent = hasStaticStars ? '[*] ' + project.stars : (hasRepo ? '[*] ...' : '');
    const starsVisible = hasStaticStars || hasRepo;

    return '<article class="project-card" data-repo="' + escapeHtml(project.repo || '') + '">' +
      '<div class="project-card__header">' +
        '<h3 class="project-card__name">' +
          '<a href="' + escapeHtml(project.url) + '" target="_blank" rel="noopener noreferrer">' +
            escapeHtml(project.name) +
          '</a>' +
        '</h3>' +
        '<span class="project-card__stars"' + (starsVisible ? '' : ' style="display:none"') + '>' +
          starsContent +
        '</span>' +
      '</div>' +
      '<div class="project-card__lang">' +
        '<span class="lang-dot" style="background-color: ' + langColor + ';"></span>' +
        '<span>' + escapeHtml(project.language) + '</span>' +
      '</div>' +
      '<p class="project-card__desc">' + escapeHtml(project.description) + '</p>' +
      '<div class="project-card__tags">' +
        project.tags.map(createTag).join('') +
      '</div>' +
    '</article>';
  }

  function renderProjects() {
    Router.updateActiveNav('/projects');
    clearAndPrepare(PAGE_TYPES.PROJECT_LIST);

    // Sort by stars descending (use 0 if no static stars)
    const sortedProjects = Config.projects.slice().sort(function(a, b) {
      return (b.stars || 0) - (a.stars || 0);
    });

    const html = createPageTitle('Projects') +
      '<p class="page-desc text-tertiary">Open source projects I maintain. Sorted by stars.</p>' +
      '<div class="projects-grid fade-in">' +
        sortedProjects.map(createProjectCard).join('') +
      '</div>';

    mainContent().innerHTML = html;

    // Dynamically fetch star counts from GitHub API
    if (window.GitHubAPI && Config.personal && Config.personal.github_username) {
      GitHubAPI.updateProjectStars(Config.personal.github_username, Config.projects);
    }
  }

  // ============================================
  // Diary Components
  // ============================================

  function createDiaryCard(diary) {
    const moodIcon = Config.moodIcons[diary.mood] || '[.]';
    const weatherIcon = Config.weatherIcons[diary.weather] || '[.]';
    const preview = diary.content.split('\n')[0].substring(0, 150);

    return '<article class="diary-card">' +
      '<a href="#/diary/' + escapeHtml(diary.id) + '" class="diary-card__link">' +
        '<div class="diary-card__header">' +
          '<span class="diary-card__date">' + formatDate(diary.date) + '</span>' +
          '<div class="diary-card__indicators">' +
            '<span class="diary-card__mood">' + moodIcon + ' ' + escapeHtml(diary.mood) + '</span>' +
            '<span class="diary-card__weather">' + weatherIcon + ' ' + escapeHtml(diary.weather) + '</span>' +
          '</div>' +
        '</div>' +
        '<p class="diary-card__preview">' + escapeHtml(preview) + (diary.content.length > 150 ? '...' : '') + '</p>' +
        '<div class="diary-card__tags">' +
          diary.tags.map(createTag).join('') +
        '</div>' +
      '</a>' +
    '</article>';
  }

  function renderDiaryList() {
    Router.updateActiveNav('/diary');
    clearAndPrepare(PAGE_TYPES.DIARY_LIST);

    const html = createPageTitle('Diary') +
      '<div class="diary-list fade-in">' +
        Config.diaries.map(createDiaryCard).join('') +
      '</div>';

    mainContent().innerHTML = html;
  }

  function renderDiaryDetail(params) {
    Router.updateActiveNav('/diary');
    clearAndPrepare(PAGE_TYPES.DIARY_DETAIL);

    const diary = Config.diaries.find(function(d) {
      return d.id === params.id;
    });

    if (!diary) {
      renderNotFound();
      return;
    }

    const moodIcon = Config.moodIcons[diary.mood] || '[.]';
    const weatherIcon = Config.weatherIcons[diary.weather] || '[.]';

    // Convert content to simple HTML
    const contentHtml = diary.content
      .split('\n\n')
      .map(function(para) {
        if (para.startsWith('- ')) {
          // It's a list
          const items = para.split('\n').map(function(item) {
            return '<li>' + escapeHtml(item.replace(/^- /, '')) + '</li>';
          }).join('');
          return '<ul>' + items + '</ul>';
        }
        return '<p>' + escapeHtml(para) + '</p>';
      })
      .join('');

    const html = createBackLink('#/diary', 'Back to Diary') +
      '<article class="diary-content fade-in">' +
        '<header class="diary-content__header">' +
          '<h1 class="diary-content__date">' + formatDate(diary.date) + '</h1>' +
          '<div class="diary-content__meta">' +
            '<span class="diary-content__mood">' + moodIcon + ' ' + escapeHtml(diary.mood) + '</span>' +
            '<span class="diary-content__weather">' + weatherIcon + ' ' + escapeHtml(diary.weather) + '</span>' +
            createTags(diary.tags) +
          '</div>' +
        '</header>' +
        '<div class="diary-content__body">' +
          contentHtml +
        '</div>' +
      '</article>';

    mainContent().innerHTML = html;
  }

  // ============================================
  // Collection Components
  // ============================================

  function createCollectionCard(collection) {
    const chapterCount = collection.chapters ? collection.chapters.length : 0;

    return '<article class="collection-card">' +
      '<a href="#/collection/' + escapeHtml(collection.slug) + '" class="collection-card__link">' +
        '<div class="collection-card__header">' +
          '<h2 class="collection-card__title">' + escapeHtml(collection.title) + '</h2>' +
          '<span class="collection-card__chapters">[i] ' + chapterCount + ' chapters</span>' +
        '</div>' +
        '<div class="collection-card__meta">' +
          '<span class="collection-card__author">by ' + escapeHtml(collection.author) + '</span>' +
          '<span class="collection-card__date">' + escapeHtml(collection.date) + '</span>' +
        '</div>' +
        '<p class="collection-card__desc">' + escapeHtml(collection.description) + '</p>' +
        '<div class="collection-card__tags">' +
          collection.tags.map(createTag).join('') +
        '</div>' +
      '</a>' +
    '</article>';
  }

  function renderCollectionsList() {
    Router.updateActiveNav('/collections');
    clearAndPrepare(PAGE_TYPES.COLLECTION_LIST);

    const html = createPageTitle('Collections') +
      '<p class="page-desc text-tertiary">Structured tutorials and book-length content. Each collection contains multiple chapters.</p>' +
      '<div class="collections-list fade-in">' +
        Config.collections.map(createCollectionCard).join('') +
      '</div>';

    mainContent().innerHTML = html;
  }

  function renderCollectionDetail(params) {
    Router.updateActiveNav('/collections');
    clearAndPrepare(PAGE_TYPES.COLLECTION_DETAIL);

    const collection = Config.collections.find(function(c) {
      return c.slug === params.slug;
    });

    if (!collection) {
      renderNotFound();
      return;
    }

    const chapterCount = collection.chapters ? collection.chapters.length : 0;

    const chaptersHtml = collection.chapters.map(function(chapter) {
      return '<li class="chapter-list__item">' +
        '<a href="#/collection/' + escapeHtml(collection.slug) + '/' + chapter.number + '" class="chapter-link">' +
          '<span class="chapter-link__number">' + String(chapter.number).padStart(2, '0') + '</span>' +
          '<span class="chapter-link__title">' + escapeHtml(chapter.title) + '</span>' +
        '</a>' +
      '</li>';
    }).join('');

    const html = createBackLink('#/collections', 'Back to Collections') +
      '<article class="collection-detail fade-in">' +
        '<header class="collection-detail__header">' +
          '<h1 class="collection-detail__title">' + escapeHtml(collection.title) + '</h1>' +
          '<div class="collection-detail__meta">' +
            '<span>by ' + escapeHtml(collection.author) + '</span>' +
            '<span class="font-mono">' + escapeHtml(collection.date) + '</span>' +
            '<span class="text-gold">[i] ' + chapterCount + ' chapters</span>' +
          '</div>' +
          '<p class="collection-detail__desc">' + escapeHtml(collection.description) + '</p>' +
          '<div class="collection-detail__tags">' +
            collection.tags.map(createTag).join('') +
          '</div>' +
        '</header>' +
        '<div class="collection-detail__toc">' +
          '<h2 class="toc-title">Table of Contents</h2>' +
          '<div class="toc-title__line"></div>' +
          '<ol class="chapter-list">' +
            chaptersHtml +
          '</ol>' +
        '</div>' +
      '</article>';

    mainContent().innerHTML = html;
  }

  function renderChapterDetail(params) {
    Router.updateActiveNav('/collections');
    clearAndPrepare(PAGE_TYPES.CHAPTER_DETAIL);

    // Increment render ID to invalidate any pending async operations
    const renderId = ++currentRenderId;

    const collection = Config.collections.find(function(c) {
      return c.slug === params.slug;
    });

    if (!collection) {
      renderNotFound();
      return;
    }

    const chapter = collection.chapters.find(function(ch) {
      return ch.number === params.chapter;
    });

    if (!chapter) {
      renderNotFound();
      return;
    }

    // Find previous and next chapters
    const chapterIndex = collection.chapters.findIndex(function(ch) {
      return ch.number === params.chapter;
    });
    const prevChapter = chapterIndex > 0 ? collection.chapters[chapterIndex - 1] : null;
    const nextChapter = chapterIndex < collection.chapters.length - 1 ? collection.chapters[chapterIndex + 1] : null;

    const navHtml = '<div class="chapter-nav">' +
      (prevChapter ?
        '<a href="#/collection/' + escapeHtml(collection.slug) + '/' + prevChapter.number + '" class="chapter-nav__link chapter-nav__prev">' +
          '<span class="text-gold">[&lt;]</span> Previous' +
        '</a>' :
        '<span class="chapter-nav__link chapter-nav__disabled">[&lt;] Previous</span>') +
      '<a href="#/collection/' + escapeHtml(collection.slug) + '" class="chapter-nav__toc">[#] Contents</a>' +
      (nextChapter ?
        '<a href="#/collection/' + escapeHtml(collection.slug) + '/' + nextChapter.number + '" class="chapter-nav__link chapter-nav__next">' +
          'Next <span class="text-gold">[&gt;]</span>' +
        '</a>' :
        '<span class="chapter-nav__link chapter-nav__disabled">Next [&gt;]</span>') +
    '</div>';

    const html = createBackLink('#/collection/' + escapeHtml(collection.slug), 'Back to ' + escapeHtml(collection.title)) +
      '<article class="chapter-content fade-in">' +
        '<header class="chapter-content__header">' +
          '<div class="chapter-content__number">Chapter ' + String(chapter.number).padStart(2, '0') + '</div>' +
          '<h1 class="chapter-content__title">' + escapeHtml(chapter.title) + '</h1>' +
          '<div class="chapter-content__collection">' +
            'from <a href="#/collection/' + escapeHtml(collection.slug) + '">' + escapeHtml(collection.title) + '</a>' +
          '</div>' +
        '</header>' +
        '<div id="chapter-body" class="chapter-content__body">' +
          '<div class="loading-state">' +
            '<div class="loading-state__spinner"></div>' +
            '<span class="loading-state__text">Loading chapter...</span>' +
          '</div>' +
        '</div>' +
        navHtml +
      '</article>';

    mainContent().innerHTML = html;

    // Load external markdown (with render ID check and page type validation)
    if (chapter.url && window.Markdown) {
      const bodyEl = document.getElementById('chapter-body');
      // Only proceed if this render is still current
      if (renderId === currentRenderId) {
        Markdown.renderExternalMarkdown(chapter.url, bodyEl, PAGE_TYPES.CHAPTER_DETAIL);
      }
    }
  }

  // ============================================
  // About Page
  // ============================================

  function renderAbout() {
    Router.updateActiveNav('/about');
    clearAndPrepare(PAGE_TYPES.ABOUT);

    // Build social links
    var socialLinks = Config.social.map(function(link) {
      return '<a href="' + escapeHtml(link.url) + '" class="social-link" target="_blank" rel="noopener noreferrer">' +
        '<span class="text-gold">' + escapeHtml(link.icon) + '</span>' +
        '<span>' + escapeHtml(link.label) + '</span>' +
      '</a>';
    }).join('');

    var html = '<div class="about-content fade-in">' +
      createPageTitle('About') +

      '<div class="about-content__section">' +
        '<div id="about-body" class="about-body">' +
          '<div class="loading-state">' +
            '<div class="loading-state__spinner"></div>' +
            '<span class="loading-state__text">Loading profile...</span>' +
          '</div>' +
        '</div>' +
      '</div>' +

      '<div class="about-content__section">' +
        '<h2>Connect</h2>' +
        '<div class="social-links">' +
          socialLinks +
        '</div>' +
      '</div>' +
    '</div>';

    mainContent().innerHTML = html;

    // Load GitHub profile README from blog branch
    // GitHub profile repo: github.com/{username}/{username}
    // Uses about_branch config (default: 'blog') for blog-style content
    var username = Config.personal.github_username;
    var aboutBranch = Config.github_about_branch || 'blog';
    var profileReadmeUrl = 'https://raw.githubusercontent.com/' +
      username + '/' + username + '/' +
      aboutBranch + '/README.md';

    if (window.Markdown) {
      var bodyEl = document.getElementById('about-body');
      Markdown.renderExternalMarkdown(profileReadmeUrl, bodyEl, PAGE_TYPES.ABOUT);
    }
  }

  // ============================================
  // 404 Page
  // ============================================

  function renderNotFound() {
    clearAndPrepare(PAGE_TYPES.NOT_FOUND);

    const html = '<div class="fade-in" style="text-align: center; padding: 48px 0;">' +
      '<div style="font-size: 4rem; color: var(--accent-gold); font-family: var(--font-mono);">404</div>' +
      '<h1 style="margin: 16px 0;">Page Not Found</h1>' +
      '<p class="text-tertiary">The page you\'re looking for doesn\'t exist.</p>' +
      '<p style="margin-top: 24px;">' +
        '<a href="#/" class="text-gold">[+] Back to Home</a>' +
      '</p>' +
    '</div>';

    mainContent().innerHTML = html;
  }

  // ============================================
  // Navigation
  // ============================================

  function initNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const siteNav = document.querySelector('.site-nav');

    if (navToggle && siteNav) {
      navToggle.addEventListener('click', function() {
        siteNav.classList.toggle('is-open');
      });
    }
  }

  // ============================================
  // Route Setup & Init
  // ============================================

  function setupRoutes() {
    Router
      .on('/', renderArticleList)
      .on('/articles', renderArticleList)
      .on('/article/:slug', renderArticleDetail)
      .on('/projects', renderProjects)
      .on('/collections', renderCollectionsList)
      .on('/collection/:slug', renderCollectionDetail)
      .on('/collection/:slug/:chapter', renderChapterDetail)
      .on('/diary', renderDiaryList)
      .on('/diary/:id', renderDiaryDetail)
      .on('/about', renderAbout)
      .on('/404', renderNotFound);
  }

  function init() {
    initNavigation();
    setupRoutes();
    Router.init();
  }

  // Note: Auto-init is disabled.
  // App.init() is called from index.html after ConfigLoader.load() completes.
  // This ensures config is available before routing begins.

  return {
    init: init,
    renderArticleList: renderArticleList,
    renderArticleDetail: renderArticleDetail,
    renderProjects: renderProjects,
    renderCollectionsList: renderCollectionsList,
    renderCollectionDetail: renderCollectionDetail,
    renderChapterDetail: renderChapterDetail,
    renderDiaryList: renderDiaryList,
    renderDiaryDetail: renderDiaryDetail,
    renderAbout: renderAbout,
    renderNotFound: renderNotFound
  };
})();

window.App = App;
