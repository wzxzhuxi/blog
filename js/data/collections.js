/**
 * ProArt Blog - Collections Data
 *
 * Book/tutorial collections with chapters.
 * Each collection contains multiple chapters loaded from external markdown.
 *
 * Collection Format:
 *   author: 'Name'             - Optional, defaults to config.personal.name
 *
 * Chapter Formats (same as articles):
 *
 *   Format 1: Own repo README
 *   { number: 1, title: 'Chapter 1', repo: 'my-repo' }
 *
 *   Format 2: Own repo with custom path (supports subdirectories)
 *   { number: 2, title: 'Chapter 2', repo: 'my-repo', path: '02-chapter/README.md' }
 *
 *   Format 3: Direct URL
 *   { number: 3, title: 'Chapter 3', url: 'https://raw.githubusercontent.com/...' }
 *
 *   Format 4: External repo (structured)
 *   {
 *     number: 4,
 *     title: 'Chapter 4',
 *     external: { username: 'other-user', repo: 'other-repo', branch: 'main', path: 'chapter.md' }
 *   }
 */

window.DataCollections = [
  {
    slug: 'github-demo-series',
    title: 'GitHub Demo Series',
    description: 'A collection of demo content from GitHub official examples.',
    date: '2025-01-01',
    tags: ['demo', 'github'],
    chapters: [
      {
        number: 1,
        title: 'Spoon-Knife Introduction',
        url: 'https://raw.githubusercontent.com/octocat/Spoon-Knife/main/README.md'
      },
      {
        number: 2,
        title: 'Hello World',
        url: 'https://raw.githubusercontent.com/octocat/Hello-World/master/README'
      }
    ]
  }
];
