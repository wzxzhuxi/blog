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
  {
    slug: 'getting-started',
    title: 'Getting Started with This Blog',
    date: '2025-01-01',
    summary: 'A quick guide to setting up your own blog using this template.',
    repo: 'blog',
    path: 'README.md',
    tags: ['tutorial', 'getting-started']
  }
];
