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
    slug: 'charliedb',
    title: 'CharlieDB',
    date: '2025-12-21',
    summary: 'A simple time series database built from scratch in Rust, featuring components from DDIA.',
    repo: 'CharlieDB',
    tags: ['Rust', 'database', 'timeseries']
  },
  {
    slug: 'pool-factory',
    title: 'Pool Factory',
    date: '2025-12-19',
    summary: 'Functional programming factory pattern using pure functions for generic pooling.',
    repo: 'pool-factory',
    tags: ['C++', 'functional', 'design-pattern']
  },
  {
    slug: 'rknn-3588-npu-yolo-accelerate',
    title: 'RKNN-3588 NPU YOLO Accelerate',
    date: '2025-12-18',
    summary: 'YOLOv5 deployment on RKNN-3588 with thread pool for NPU inference acceleration.',
    repo: 'rknn-3588-npu-yolo-accelerate',
    tags: ['C++', 'NPU', 'YOLO', 'embedded']
  },
  {
    slug: 'lambda-waybar',
    title: 'Lambda Waybar',
    date: '2025-12-17',
    summary: 'Personal waybar configuration with lambda style and Gruvbox Dark color scheme.',
    repo: 'lambda_waybar',
    tags: ['Shell', 'linux', 'waybar']
  },
  {
    slug: 'fp-cpp-init',
    title: 'FP C++ Init',
    date: '2025-12-07',
    summary: 'Cross-platform C++ project scaffolding with functional architecture design.',
    repo: 'fp-cpp-init',
    tags: ['C++', 'scaffolding', 'template']
  },
  {
    slug: 'cpp-functional-programming',
    title: 'C++ Functional Programming',
    date: '2025-12-06',
    summary: 'C++ functional programming tutorial - pure functions, immutability, and composition.',
    repo: 'cpp-functional-programming',
    tags: ['C++', 'functional', 'tutorial']
  },
  {
    slug: 'rust-dynamic-thread-pool',
    title: 'Rust Dynamic Thread Pool',
    date: '2025-12-01',
    summary: 'Simple dynamic thread pool implementation written in Rust.',
    repo: 'Rust-dynamic-thread-pool',
    tags: ['Rust', 'concurrency', 'threadpool']
  }
];
