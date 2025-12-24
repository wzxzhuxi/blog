/**
 * ProArt Blog - Configuration Loader
 *
 * Reads blog.config.toml and provides configuration to the app.
 * Implements dependency injection - all user-specific info comes from TOML.
 */

(function() {
  'use strict';

  // ============================================
  // Default Configuration (Fallback)
  // ============================================

  var defaultConfig = {
    personal: {
      name: 'Blog Owner',
      github_username: '',
      email: ''
    },
    site: {
      title: 'My Blog',
      description: 'A personal blog',
      copyright_year: new Date().getFullYear(),
      lang: 'en'
    },
    github: {
      default_branch: 'main',
      about_branch: 'blog'
    },
    social: []
  };

  // ============================================
  // URL Generator Functions
  // ============================================

  /**
   * Generate GitHub repository URL
   * @param {string} username - GitHub username
   * @param {string} [repo] - Repository name (optional)
   * @returns {string} GitHub URL
   */
  function getGitHubRepoUrl(username, repo) {
    if (!username) return '#';
    if (!repo) return 'https://github.com/' + username;
    return 'https://github.com/' + username + '/' + repo;
  }

  /**
   * Generate GitHub raw content URL
   * Supports subdirectory paths like '03-pure-functions/README.md'
   * @param {string} username - GitHub username
   * @param {string} repo - Repository name
   * @param {string} [path] - File path including subdirectories (default: README.md)
   * @param {string} [branch] - Branch name (default: main)
   * @returns {string} Raw GitHub URL
   */
  function getGitHubRawUrl(username, repo, path, branch) {
    if (!username || !repo) return '#';
    branch = branch || 'main';
    path = path || 'README.md';
    return 'https://raw.githubusercontent.com/' + username + '/' + repo + '/' + branch + '/' + path;
  }

  /**
   * Get social link URL based on type
   * @param {string} type - Social type (github, email, or full URL)
   * @param {object} config - Parsed config
   * @returns {string} URL
   */
  function getSocialUrl(type, config) {
    if (type === 'github') {
      return getGitHubRepoUrl(config.personal.github_username);
    }
    if (type === 'email') {
      return 'mailto:' + config.personal.email;
    }
    // Assume it's a full URL
    return type;
  }

  // ============================================
  // Data Processors
  // ============================================

  /**
   * Process articles - inject URLs from repo names
   * Supports multiple formats:
   *   1. repo only: uses config username, default branch, README.md
   *   2. repo + path: uses config username, default branch, custom path
   *   3. repo + branch: uses specified branch instead of default
   *   4. url: uses provided URL directly
   *   5. external: { username, repo, branch, path } for external repos
   *
   * @param {Array} articles - Raw articles data
   * @param {object} config - Parsed config
   * @returns {Array} Processed articles
   */
  function processArticles(articles, config) {
    if (!articles || !Array.isArray(articles)) return [];

    return articles.map(function(article) {
      var processed = Object.assign({}, article);

      // Format 1: Already has URL - use directly
      if (article.url) {
        return processed;
      }

      // Format 2: External repository configuration
      if (article.external) {
        processed.url = getGitHubRawUrl(
          article.external.username,
          article.external.repo,
          article.external.path || 'README.md',
          article.external.branch || 'main'
        );
        return processed;
      }

      // Format 3 & 4: Own repository (repo only or repo + path + branch)
      if (article.repo) {
        processed.url = getGitHubRawUrl(
          config.personal.github_username,
          article.repo,
          article.path || article.file || 'README.md',  // Support both 'path' and legacy 'file'
          article.branch || config.github.default_branch  // Allow per-article branch override
        );
      }

      return processed;
    });
  }

  /**
   * Process projects - inject URLs from repo names
   * @param {Array} projects - Raw projects data
   * @param {object} config - Parsed config
   * @returns {Array} Processed projects
   */
  function processProjects(projects, config) {
    if (!projects || !Array.isArray(projects)) return [];

    return projects.map(function(project) {
      var processed = Object.assign({}, project);

      // If repo is specified and no URL, generate URL
      if (project.repo && !project.url) {
        processed.url = getGitHubRepoUrl(
          config.personal.github_username,
          project.repo
        );
      }

      return processed;
    });
  }

  /**
   * Process collections - inject URLs for chapters
   * Supports multiple chapter formats:
   *   1. repo only: uses config username, default branch, README.md
   *   2. repo + path: uses config username, default branch, custom path (e.g., '03-pure-functions/README.md')
   *   3. repo + branch: uses specified branch instead of default
   *   4. url: uses provided URL directly
   *   5. external: { username, repo, branch, path } for external repos
   *
   * @param {Array} collections - Raw collections data
   * @param {object} config - Parsed config
   * @returns {Array} Processed collections
   */
  function processCollections(collections, config) {
    if (!collections || !Array.isArray(collections)) return [];

    return collections.map(function(collection) {
      var processed = Object.assign({}, collection);

      // Use config author if not specified
      if (!processed.author) {
        processed.author = config.personal.name;
      }

      // Process chapters
      if (collection.chapters && Array.isArray(collection.chapters)) {
        processed.chapters = collection.chapters.map(function(chapter) {
          var processedChapter = Object.assign({}, chapter);

          // Format 1: Already has URL - use directly
          if (chapter.url) {
            return processedChapter;
          }

          // Format 2: External repository configuration
          if (chapter.external) {
            processedChapter.url = getGitHubRawUrl(
              chapter.external.username,
              chapter.external.repo,
              chapter.external.path || 'README.md',
              chapter.external.branch || 'main'
            );
            return processedChapter;
          }

          // Format 3 & 4: Own repository (repo only or repo + path + branch)
          if (chapter.repo) {
            processedChapter.url = getGitHubRawUrl(
              config.personal.github_username,
              chapter.repo,
              chapter.path || chapter.file || 'README.md',  // Support both 'path' and legacy 'file'
              chapter.branch || config.github.default_branch  // Allow per-chapter branch override
            );
          }

          return processedChapter;
        });
      }

      return processed;
    });
  }

  // ============================================
  // Build Final Config
  // ============================================

  /**
   * Build the final Config object from parsed TOML
   * @param {object} tomlConfig - Parsed TOML configuration
   * @returns {object} Final configuration object
   */
  function buildConfig(tomlConfig) {
    // Merge with defaults
    var config = {
      personal: Object.assign({}, defaultConfig.personal, tomlConfig.personal || {}),
      site: Object.assign({}, defaultConfig.site, tomlConfig.site || {}),
      github: Object.assign({}, defaultConfig.github, tomlConfig.github || {}),
      social: tomlConfig.social || defaultConfig.social
    };

    // Process social links
    var social = (config.social || []).map(function(link) {
      return {
        label: link.label || '',
        url: link.url || getSocialUrl(link.type, config),
        icon: link.icon || '[+]'
      };
    });

    // Build final Config object
    return {
      site: {
        title: config.site.title,
        author: config.personal.name,
        description: config.site.description,
        github: getGitHubRepoUrl(config.personal.github_username),
        lang: config.site.lang || 'en',
        copyright_year: config.site.copyright_year
      },

      personal: config.personal,
      social: social,
      github_default_branch: config.github.default_branch || 'main',
      github_about_branch: config.github.about_branch || 'blog',

      navigation: [
        { label: 'Articles', path: '#/', icon: '[/]' },
        { label: 'Projects', path: '#/projects', icon: '[+]' },
        { label: 'Collections', path: '#/collections', icon: '[#]' },
        { label: 'Diary', path: '#/diary', icon: '[...]' },
        { label: 'About', path: '#/about', icon: '[i]' }
      ],

      // Process data files
      articles: processArticles(window.DataArticles || [], config),
      projects: processProjects(window.DataProjects || [], config),
      diaries: window.DataDiaries || [],
      collections: processCollections(window.DataCollections || [], config),

      // Language colors for project cards
      languageColors: {
        'C++': '#f34b7d',
        'Rust': '#dea584',
        'Shell': '#89e051',
        'JavaScript': '#f1e05a',
        'TypeScript': '#2b7489',
        'Python': '#3572A5',
        'Go': '#00ADD8',
        'Haskell': '#5e5086',
        'Java': '#b07219',
        'C': '#555555',
        'Zig': '#ec915c'
      },

      // Mood icons for diary
      moodIcons: {
        'productive': '[+]',
        'thoughtful': '[?]',
        'happy': '[*]',
        'tired': '[-]',
        'neutral': '[.]'
      },

      // Weather icons for diary
      weatherIcons: {
        'sunny': '[*]',
        'cloudy': '[~]',
        'rainy': '[/]',
        'snowy': '[o]'
      }
    };
  }

  // ============================================
  // Config Loader
  // ============================================

  /**
   * Load TOML configuration file
   * @param {function} callback - Callback(error, config)
   */
  function loadConfig(callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'blog.config.toml', true);

    xhr.onreadystatechange = function() {
      if (xhr.readyState !== 4) return;

      if (xhr.status === 200 || xhr.status === 0) {
        try {
          // Check if toml parser is available
          if (typeof toml === 'undefined' || typeof toml.parse !== 'function') {
            throw new Error('TOML parser not loaded');
          }

          var parsed = toml.parse(xhr.responseText);
          window.Config = buildConfig(parsed);
          callback(null, window.Config);
        } catch (e) {
          console.error('[-] Failed to parse blog.config.toml:', e);
          window.Config = buildConfig(defaultConfig);
          callback(e, window.Config);
        }
      } else {
        console.warn('[!] blog.config.toml not found (status: ' + xhr.status + '), using defaults');
        window.Config = buildConfig(defaultConfig);
        callback(null, window.Config);
      }
    };

    xhr.onerror = function() {
      console.warn('[!] Failed to load blog.config.toml, using defaults');
      window.Config = buildConfig(defaultConfig);
      callback(null, window.Config);
    };

    xhr.send();
  }

  /**
   * Update page metadata from config
   * @param {object} config - Configuration object
   */
  function updatePageMeta(config) {
    // Update document title
    document.title = config.site.title;

    // Update lang attribute
    document.documentElement.lang = config.site.lang;

    // Update meta tags
    var descMeta = document.querySelector('meta[name="description"]');
    if (descMeta) {
      descMeta.content = config.site.description;
    }

    var authorMeta = document.querySelector('meta[name="author"]');
    if (authorMeta) {
      authorMeta.content = config.site.author;
    }

    // Update site logo
    var logoText = document.querySelector('.site-logo span:not(.site-logo__icon)');
    if (logoText) {
      logoText.textContent = config.site.title;
    }

    // Update footer
    var copyright = document.querySelector('.site-footer__copyright');
    if (copyright) {
      copyright.textContent = '[c] ' + config.site.copyright_year + ' ' + config.personal.name;
    }

    var footerGithub = document.querySelector('.site-footer__links a');
    if (footerGithub) {
      footerGithub.href = config.site.github;
    }
  }

  // ============================================
  // Export
  // ============================================

  window.ConfigLoader = {
    load: loadConfig,
    updatePageMeta: updatePageMeta,
    getGitHubRepoUrl: getGitHubRepoUrl,
    getGitHubRawUrl: getGitHubRawUrl
  };

})();
