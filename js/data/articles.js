/**
 * ProArt Blog - Articles Data
 *
 * Article entries with flexible source configuration.
 * URLs are automatically generated based on the format used.
 *
 * Supported Formats:
 *   Format 1: Own repo README
 *   { slug: 'my-project', repo: 'my-project', title: '...', ... }
 *
 *   Format 2: Own repo with custom path
 *   { slug: 'my-article', repo: 'my-repo', path: 'docs/article.md', title: '...', ... }
 *
 *   Format 3: Direct URL
 *   { slug: 'external', url: 'https://raw.githubusercontent.com/...', title: '...', ... }
 */

window.DataArticles = [
  {
    slug: 'rknn-yolo-deploy',
    title: 'RKNN-3588 NPU 部署 YOLOv5',
    date: '2024-12-01',
    summary: '在 RK3588 开发板上部署 YOLOv5，使用线程池实现 NPU 推理加速',
    repo: 'rknn-3588-npu-yolo-accelerate',
    tags: ['RKNN', 'YOLOv5', 'NPU', '深度学习']
  },
  {
    slug: 'rust-thread-pool',
    title: 'Rust 动态线程池实现',
    date: '2024-11-01',
    summary: '用 Rust 从零实现一个简单的动态线程池',
    repo: 'Rust-dynamic-thread-pool',
    tags: ['Rust', '并发', '线程池']
  },
  {
    slug: 'charlie-db',
    title: 'CharlieDB 时序数据库',
    date: '2024-10-01',
    summary: '参考 DDIA 用 Rust 从零构建简单时序数据库',
    repo: 'CharlieDB',
    tags: ['Rust', '数据库', 'TSDB']
  },
  {
    slug: 'pool-factory-tutorial',
    title: '通用资源池设计与实现',
    date: '2025-01-01',
    summary: '函数式编程工厂模式实践，使用纯函数实现通用池化技术',
    repo: 'pool-factory',
    path: 'docs/tutorial.md',
    tags: ['C++', '函数式编程', '设计模式', '资源池']
  },
  {
    slug: 'fp-actor',
    title: '函数式风格 actor',
    date: '2025-12-26',
    summary: 'fp 风格 actor 组件，C++ 函数式编程结题项目',
    repo: 'fp-actor',
    path: 'docs/fp-actor-实现指南.md',
    tags: ['C++', '函数式编程', 'actor', '设计模式']
  },
];
