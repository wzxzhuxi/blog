/**
 * ProArt Blog - Articles Data
 *
 * Article entries with flexible source configuration.
 * URLs are automatically generated based on the format used.
 *
 * Supported Formats:
 *
 *   Format 1: Own repo README (simplest)
 *   { slug: 'my-project', repo: 'my-project', title: '...', ... }
 *
 *   Format 2: Own repo with custom path (supports subdirectories)
 *   { slug: 'my-article', repo: 'my-repo', path: 'docs/article.md', title: '...', ... }
 *
 *   Format 3: Direct URL (any external source)
 *   { slug: 'external', url: 'https://raw.githubusercontent.com/...', title: '...', ... }
 *
 *   Format 4: External repo (structured)
 *   {
 *     slug: 'external-article',
 *     external: { username: 'other-user', repo: 'other-repo', branch: 'main', path: 'file.md' },
 *     title: '...', ...
 *   }
 */

window.DataArticles = [
  // ============================================
  // TEST CASES - Verify bug fix works
  // ============================================
  {
    slug: 'test-invalid-url',
    title: '[TEST] Invalid URL - Should Show Error',
    date: '2025-12-22',
    summary: 'This article has an invalid URL (#). Should display error, not render HTML.',
    url: '#',
    tags: ['test', 'bug-fix']
  },
  {
    slug: 'test-html-response',
    title: '[TEST] HTML Response - Should Show Error',
    date: '2025-12-22',
    summary: 'This URL returns HTML page. Should display error, not render the HTML.',
    url: 'https://github.com/octocat/Spoon-Knife',
    tags: ['test', 'bug-fix']
  },
  // ============================================
  // Real Articles
  // ============================================
  {
    slug: 'getting-started',
    title: 'Getting Started with This Blog',
    date: '2025-01-01',
    summary: 'A quick guide to setting up your own blog using this template.',
    // Using octocat's Spoon-Knife repo - a famous GitHub demo repo
    url: 'https://raw.githubusercontent.com/octocat/Spoon-Knife/main/README.md',
    tags: ['tutorial', 'getting-started']
  },
  {
    slug: 'hello-world',
    title: 'Hello World Example',
    date: '2025-01-02',
    summary: 'A simple hello world article demonstrating the blog template.',
    // Using octocat's Hello-World repo
    url: 'https://raw.githubusercontent.com/octocat/Hello-World/master/README',
    tags: ['demo', 'hello-world']
  }
];
