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

  async function fetchMarkdown(url) {
    if (cache.has(url)) {
      return cache.get(url);
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch: ' + response.status);
    }

    const content = await response.text();
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

  async function renderExternalMarkdown(url, container) {
    try {
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
      container.appendChild(createLoadingElement());

      var markdown = await fetchMarkdown(url);
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
