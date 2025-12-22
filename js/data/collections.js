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
    slug: 'cpp-fp-guide',
    title: 'C++ Functional Programming Guide',
    // author is optional - will use config.personal.name
    description: 'A comprehensive guide to functional programming patterns in modern C++. Covers pure functions, immutability, higher-order functions, and composition.',
    date: '2025-12-22',
    tags: ['C++', 'functional', 'tutorial'],
    chapters: [
      {
        number: 1,
        title: 'Introduction to Functional Programming',
        repo: 'cpp-functional-programming'
      },
      {
        number: 2,
        title: 'Pure Functions and Immutability',
        repo: 'cpp-functional-programming'
      },
      {
        number: 3,
        title: 'Higher-Order Functions',
        repo: 'cpp-functional-programming'
      }
    ]
  },
  {
    slug: 'rust-systems-programming',
    title: 'Rust Systems Programming',
    description: 'Building high-performance systems in Rust. Covers thread pools, database internals, and performance optimization techniques.',
    date: '2025-12-20',
    tags: ['Rust', 'systems', 'performance'],
    chapters: [
      {
        number: 1,
        title: 'Thread Pool Implementation',
        repo: 'Rust-dynamic-thread-pool'
      },
      {
        number: 2,
        title: 'Time Series Database Design',
        repo: 'CharlieDB'
      }
    ]
  }
];
