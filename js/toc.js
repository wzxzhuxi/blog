/**
 * ProArt Blog - Table of Contents Module
 *
 * Extracts headings from rendered content and builds a sticky TOC sidebar.
 * Includes scroll spy for active heading highlighting.
 */

const TOC = (function() {
  // Configuration
  const HEADING_SELECTOR = 'h1, h2, h3, h4';
  const SCROLL_OFFSET = 80;
  const MIN_HEADINGS = 2;

  // State
  let observer = null;
  let headingElements = [];

  // DOM references
  const getSidebar = function() {
    return document.getElementById('toc-sidebar');
  };
  const getToggle = function() {
    return document.getElementById('toc-toggle');
  };
  const getOverlay = function() {
    return document.getElementById('toc-overlay');
  };

  /**
   * Generate URL-safe slug from text
   * Preserves Chinese characters
   */
  function slugify(text) {
    const slug = text
      .toLowerCase()
      .trim()
      .replace(/[^\w\u4e00-\u9fff\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
    return slug || 'heading';
  }

  /**
   * Ensure unique ID by appending counter if needed
   */
  function ensureUniqueId(id, existingIds) {
    let uniqueId = id;
    let counter = 1;
    while (existingIds.has(uniqueId)) {
      uniqueId = id + '-' + counter;
      counter++;
    }
    existingIds.add(uniqueId);
    return uniqueId;
  }

  /**
   * Extract headings from container and add IDs
   */
  function extractHeadings(container) {
    const headings = [];
    const existingIds = new Set();

    container.querySelectorAll(HEADING_SELECTOR).forEach(function(el) {
      const text = el.textContent.trim();
      if (!text) return;

      // Generate or use existing ID
      let id = el.id;
      if (!id) {
        id = ensureUniqueId(slugify(text), existingIds);
        el.id = id;
      } else {
        existingIds.add(id);
      }

      const level = parseInt(el.tagName.charAt(1), 10);
      headings.push({ id: id, text: text, level: level, element: el });
    });

    return headings;
  }

  /**
   * Build TOC using safe DOM methods
   */
  function buildTOC(headings) {
    if (headings.length < MIN_HEADINGS) {
      return null;
    }

    const container = document.createDocumentFragment();

    // Title
    const title = document.createElement('div');
    title.className = 'toc-sidebar__title';
    title.textContent = '[#] Contents';
    container.appendChild(title);

    // List
    const list = document.createElement('ul');
    list.className = 'toc-sidebar__list';

    headings.forEach(function(h) {
      const item = document.createElement('li');
      item.className = 'toc-sidebar__item';
      item.dataset.level = h.level;

      const link = document.createElement('a');
      link.href = '#' + h.id;
      link.className = 'toc-sidebar__link';
      link.dataset.id = h.id;
      link.textContent = h.text;

      item.appendChild(link);
      list.appendChild(item);
    });

    container.appendChild(list);
    return container;
  }

  /**
   * Set active heading in TOC
   */
  function setActiveHeading(id) {
    const sidebar = getSidebar();
    if (!sidebar) return;

    sidebar.querySelectorAll('.toc-sidebar__link').forEach(function(link) {
      if (link.dataset.id === id) {
        link.classList.add('is-active');
      } else {
        link.classList.remove('is-active');
      }
    });
  }

  /**
   * Initialize IntersectionObserver for scroll spy
   */
  function initScrollSpy(headings) {
    if (observer) {
      observer.disconnect();
    }

    if (!('IntersectionObserver' in window)) return;

    headingElements = headings.map(function(h) {
      return h.element;
    });

    observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          setActiveHeading(entry.target.id);
        }
      });
    }, {
      rootMargin: '-' + SCROLL_OFFSET + 'px 0px -66% 0px'
    });

    headingElements.forEach(function(el) {
      observer.observe(el);
    });
  }

  /**
   * Smooth scroll to heading on click
   */
  function handleTOCClick(event) {
    const link = event.target.closest('.toc-sidebar__link');
    if (!link) return;

    event.preventDefault();
    const id = link.dataset.id;
    const target = document.getElementById(id);

    if (target) {
      const top = target.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET;
      window.scrollTo({ top: top, behavior: 'smooth' });
      setActiveHeading(id);
      closeDrawer();
    }
  }

  /**
   * Toggle mobile drawer
   */
  function toggleDrawer() {
    const sidebar = getSidebar();
    const overlay = getOverlay();

    if (sidebar) {
      sidebar.classList.toggle('is-open');
    }
    if (overlay) {
      overlay.classList.toggle('is-visible');
    }
  }

  /**
   * Close drawer
   */
  function closeDrawer() {
    const sidebar = getSidebar();
    const overlay = getOverlay();

    if (sidebar) sidebar.classList.remove('is-open');
    if (overlay) overlay.classList.remove('is-visible');
  }

  /**
   * Show TOC toggle button
   */
  function showToggle() {
    const toggle = getToggle();
    if (toggle) toggle.classList.add('is-visible');
  }

  /**
   * Hide TOC toggle button
   */
  function hideToggle() {
    const toggle = getToggle();
    if (toggle) toggle.classList.remove('is-visible');
  }

  /**
   * Clear sidebar content safely
   */
  function clearSidebar(sidebar) {
    while (sidebar.firstChild) {
      sidebar.removeChild(sidebar.firstChild);
    }
  }

  /**
   * Update TOC for given content container
   */
  function update(contentContainer) {
    const sidebar = getSidebar();

    if (!sidebar || !contentContainer) return;

    const headings = extractHeadings(contentContainer);
    const tocFragment = buildTOC(headings);

    if (!tocFragment) {
      clearSidebar(sidebar);
      sidebar.classList.add('toc-sidebar--empty');
      hideToggle();
      return;
    }

    clearSidebar(sidebar);
    sidebar.appendChild(tocFragment);
    sidebar.classList.remove('toc-sidebar--empty');
    showToggle();

    // Add click handler
    sidebar.addEventListener('click', handleTOCClick);

    // Initialize scroll spy
    initScrollSpy(headings);

    // Set initial active (first heading)
    if (headings.length > 0) {
      setActiveHeading(headings[0].id);
    }
  }

  /**
   * Cleanup
   */
  function destroy() {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
    headingElements = [];

    const sidebar = getSidebar();
    if (sidebar) {
      clearSidebar(sidebar);
      sidebar.classList.add('toc-sidebar--empty');
    }

    hideToggle();
    closeDrawer();
  }

  /**
   * Initialize toggle and overlay listeners
   */
  function init() {
    const toggle = getToggle();
    const overlay = getOverlay();

    if (toggle) {
      toggle.addEventListener('click', toggleDrawer);
    }
    if (overlay) {
      overlay.addEventListener('click', closeDrawer);
    }

    // Cleanup on route change
    window.addEventListener('hashchange', destroy);
  }

  // Auto-init when DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return {
    update: update,
    destroy: destroy,
    toggleDrawer: toggleDrawer
  };
})();

window.TOC = TOC;
