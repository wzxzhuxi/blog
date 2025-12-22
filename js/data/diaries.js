/**
 * ProArt Blog - Diaries Data
 *
 * Personal diary entries.
 */

window.DataDiaries = [
  {
    id: '2025-12-22',
    date: '2025-12-22',
    mood: 'productive',
    weather: 'sunny',
    content: `Today I completed the diary feature for my blog. It was a productive coding session - the architecture came together nicely with clean separation between data, routing, and rendering layers.

Key accomplishments:

- [+] Implemented hash-based routing for diary pages
- [+] Created diary card and detail view components
- [+] Added mood and weather indicators using text markers
- [+] Maintained ProArt design consistency

The functional approach made testing straightforward - pure functions with predictable outputs.

Tomorrow I'll add search functionality.`,
    tags: ['coding', 'blog']
  },
  {
    id: '2025-12-21',
    date: '2025-12-21',
    mood: 'thoughtful',
    weather: 'cloudy',
    content: `Spent the day thinking about database design for CharlieDB. Time series data presents unique challenges - the write patterns are append-heavy, but queries need to be fast across time ranges.

Considering:

- LSM trees for write optimization
- Time-based partitioning for query efficiency
- Compression strategies for historical data

Read some DDIA chapters again. Kleppmann's explanations remain remarkably clear.`,
    tags: ['database', 'rust', 'architecture']
  },
  {
    id: '2025-12-20',
    date: '2025-12-20',
    mood: 'happy',
    weather: 'sunny',
    content: `Good news - the RKNN NPU acceleration project hit 83 stars on GitHub. The thread pool optimization really paid off.

Had a great discussion with someone from the embedded community about edge deployment strategies. They're using similar patterns for video analytics.

[i] Note to self: Write a blog post about NPU optimization techniques.`,
    tags: ['open-source', 'npu', 'community']
  }
];
