/**
 * ProArt Blog - Hash Router
 *
 * Simple hash-based SPA routing.
 * Pure functional approach - routes are just data.
 */

const Router = (function() {
  const routes = new Map();
  let currentRoute = null;

  /**
   * Parse hash into route object
   * @param {string} hash - URL hash
   * @returns {object} Route object with path and params
   */
  function parseHash(hash) {
    const cleanHash = hash.replace(/^#\/?/, '') || '';
    const parts = cleanHash.split('/').filter(Boolean);

    if (parts.length === 0) {
      return { path: '/', params: {} };
    }

    // Check for parameterized routes
    if (parts[0] === 'article' && parts[1]) {
      return { path: '/article/:slug', params: { slug: parts[1] } };
    }

    if (parts[0] === 'diary' && parts[1]) {
      return { path: '/diary/:id', params: { id: parts[1] } };
    }

    // Collection routes
    if (parts[0] === 'collection' && parts[1]) {
      if (parts[2]) {
        // Chapter detail: /collection/:slug/:chapter
        return {
          path: '/collection/:slug/:chapter',
          params: { slug: parts[1], chapter: parseInt(parts[2], 10) }
        };
      }
      // Collection detail: /collection/:slug
      return { path: '/collection/:slug', params: { slug: parts[1] } };
    }

    return { path: '/' + parts.join('/'), params: {} };
  }

  /**
   * Register a route handler
   * @param {string} path - Route path
   * @param {function} handler - Handler function
   */
  function on(path, handler) {
    routes.set(path, handler);
    return Router;
  }

  /**
   * Navigate to a route
   * @param {string} path - Route path
   */
  function navigate(path) {
    window.location.hash = path.startsWith('#') ? path : '#' + path;
  }

  /**
   * Get current route info
   * @returns {object} Current route
   */
  function getCurrentRoute() {
    return currentRoute;
  }

  /**
   * Handle route change
   */
  function handleRouteChange() {
    const parsed = parseHash(window.location.hash);
    currentRoute = parsed;

    // Try exact match first
    if (routes.has(parsed.path)) {
      routes.get(parsed.path)(parsed.params);
      return;
    }

    // 404 fallback
    if (routes.has('/404')) {
      routes.get('/404')(parsed);
    } else {
      console.error('[-] Route not found:', parsed.path);
    }
  }

  /**
   * Initialize router
   */
  function init() {
    window.addEventListener('hashchange', handleRouteChange);

    // Handle initial route
    if (!window.location.hash) {
      window.location.hash = '#/';
    } else {
      handleRouteChange();
    }
  }

  /**
   * Update active nav link
   * @param {string} path - Current path
   */
  function updateActiveNav(path) {
    const navLinks = document.querySelectorAll('.site-nav__link');
    navLinks.forEach(function(link) {
      const href = link.getAttribute('href');
      const isActive = (path === '/' && (href === '#/' || href === '#/articles')) ||
                      (path.startsWith('/article') && (href === '#/' || href === '#/articles')) ||
                      (path !== '/' && href === '#' + path) ||
                      (path.startsWith('/diary') && href === '#/diary') ||
                      (path.startsWith('/projects') && href === '#/projects') ||
                      (path.startsWith('/collection') && href === '#/collections');

      if (isActive) {
        link.classList.add('is-active');
      } else {
        link.classList.remove('is-active');
      }
    });
  }

  return {
    on: on,
    navigate: navigate,
    getCurrentRoute: getCurrentRoute,
    init: init,
    updateActiveNav: updateActiveNav,
    parseHash: parseHash
  };
})();

window.Router = Router;
