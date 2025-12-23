/**
 * ProArt Blog - Markdown Module
 *
 * Handles fetching and rendering external markdown content.
 * Uses DOMPurify for XSS protection - sanitization is REQUIRED.
 */

const Markdown = (function() {
  const cache = new Map();

  function configureMarked() {
    if (typeof marked === 'undefined') {
      console.error('[-] marked.js not loaded');
      return;
    }

    marked.setOptions({
      breaks: true,
      gfm: true
    });
  }

  /**
   * Sanitize HTML using DOMPurify - REQUIRED for security
   */
  function sanitizeHTML(html) {
    if (typeof DOMPurify === 'undefined') {
      console.error('[-] DOMPurify not loaded - refusing to render unsafe HTML');
      return '<p class="text-muted">[!] Security library not available</p>';
    }
    return DOMPurify.sanitize(html, {
      USE_PROFILES: { html: true },
      ADD_ATTR: ['target', 'rel'],
      ADD_TAGS: ['iframe']
    });
  }

  /**
   * Check if content appears to be HTML rather than Markdown
   * @param {string} content - Content to check
   * @returns {boolean} True if content looks like HTML
   */
  function isHTMLContent(content) {
    var trimmed = content.trim().toLowerCase();
    // Check for HTML document markers
    return trimmed.startsWith('<!doctype') ||
           trimmed.startsWith('<html') ||
           trimmed.startsWith('<?xml') ||
           // Check for common HTML-only patterns (full page structure)
           (trimmed.includes('<head>') && trimmed.includes('<body>'));
  }

  async function fetchMarkdown(url) {
    if (cache.has(url)) {
      return cache.get(url);
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch: ' + response.status);
    }

    const content = await response.text();

    // Validate content is markdown, not HTML
    if (isHTMLContent(content)) {
      throw new Error('Received HTML instead of Markdown');
    }

    cache.set(url, content);
    return content;
  }

  function renderMarkdown(markdown) {
    if (typeof marked === 'undefined') {
      return '<p class="text-muted">[!] Markdown parser not available</p>';
    }
    try {
      return marked.parse(markdown);
    } catch (error) {
      console.error('[-] Parse error:', error);
      return '<p class="text-muted">[!] Failed to parse markdown</p>';
    }
  }

  function applyHighlighting(container) {
    if (typeof hljs === 'undefined') return;
    container.querySelectorAll('pre code').forEach(function(block) {
      hljs.highlightElement(block);
    });
  }

  function createLoadingElement() {
    var div = document.createElement('div');
    div.className = 'loading-state fade-in';
    var spinner = document.createElement('div');
    spinner.className = 'loading-state__spinner';
    var text = document.createElement('span');
    text.className = 'loading-state__text';
    text.textContent = 'Loading content...';
    div.appendChild(spinner);
    div.appendChild(text);
    return div;
  }

  function createErrorElement(message) {
    var div = document.createElement('div');
    div.className = 'error-state fade-in';
    var icon = document.createElement('span');
    icon.className = 'error-state__icon';
    icon.textContent = '[-]';
    var text = document.createElement('span');
    text.className = 'error-state__message';
    text.textContent = 'Failed to load content: ' + message;
    div.appendChild(icon);
    div.appendChild(text);
    return div;
  }

  async function renderExternalMarkdown(url, container, expectedPageType) {
    try {
      // Validate URL before fetching
      // Allow: http(s) URLs, relative paths (./ or /), and same-origin paths
      if (!url || url === '#') {
        throw new Error('Invalid content URL');
      }
      var isValidUrl = url.startsWith('http') ||
                       url.startsWith('./') ||
                       url.startsWith('/');
      if (!isValidUrl) {
        throw new Error('Invalid content URL');
      }

      // Validate container still exists and is in the DOM
      if (!container || !container.parentNode) {
        console.warn('[!] Container no longer in DOM, aborting markdown render');
        return false;
      }

      // If expectedPageType is provided, validate the current page type
      if (expectedPageType) {
        var appContent = document.getElementById('app-content');
        var currentPageType = appContent ? appContent.getAttribute('data-page-type') : null;
        if (currentPageType !== expectedPageType) {
          console.warn('[!] Page type changed during fetch, aborting. Expected:', expectedPageType, 'Current:', currentPageType);
          return false;
        }
      }


      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
      container.appendChild(createLoadingElement());

      var markdown = await fetchMarkdown(url);

      // Re-validate container and page type after async fetch
      if (!container || !container.parentNode) {
        console.warn('[!] Container no longer in DOM after fetch, aborting');
        return false;
      }

      if (expectedPageType) {
        var appContent = document.getElementById('app-content');
        var currentPageType = appContent ? appContent.getAttribute('data-page-type') : null;
        if (currentPageType !== expectedPageType) {
          console.warn('[!] Page type changed after fetch, aborting. Expected:', expectedPageType, 'Current:', currentPageType);
          return false;
        }
      }

      var html = renderMarkdown(markdown);
      var sanitized = sanitizeHTML(html);

      var wrapper = document.createElement('div');
      wrapper.className = 'fade-in';

      // Use DOMParser for safe HTML insertion
      var parser = new DOMParser();
      var doc = parser.parseFromString(sanitized, 'text/html');
      Array.from(doc.body.childNodes).forEach(function(node) {
        wrapper.appendChild(node.cloneNode(true));
      });

      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
      container.appendChild(wrapper);

      applyHighlighting(container);
      return true;
    } catch (error) {
      // Final check before inserting error - container must still be valid
      if (!container || !container.parentNode) {
        console.warn('[!] Container gone, cannot show error');
        return false;
      }
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
      container.appendChild(createErrorElement(error.message));
      return false;
    }
  }

  function clearCache() {
    cache.clear();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', configureMarked);
  } else {
    configureMarked();
  }

  return {
    fetchMarkdown: fetchMarkdown,
    renderMarkdown: renderMarkdown,
    applyHighlighting: applyHighlighting,
    renderExternalMarkdown: renderExternalMarkdown,
    clearCache: clearCache
  };
})();

window.Markdown = Markdown;
