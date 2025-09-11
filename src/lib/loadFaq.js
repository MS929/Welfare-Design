

// src/lib/loadFaq.js
// Load FAQ markdown files written with frontmatter.
// Supports both "/content/faq" and "/src/content/faq" paths so it works
// in local dev and on Netlify.

export function loadFaqItems() {
  // Eagerly import raw markdown files at build-time
  const files = {
    ...import.meta.glob('/content/faq/*.md', { as: 'raw', eager: true }),
    ...import.meta.glob('/src/content/faq/*.md', { as: 'raw', eager: true }),
  };

  const items = Object.entries(files).map(([path, raw]) => {
    // Parse frontmatter
    const match = /^---([\s\S]*?)---\n?([\s\S]*)$/m.exec(raw);
    const fm = Object.fromEntries(
      (match?.[1] || '')
        .split('\n')
        .filter(Boolean)
        .map((line) => {
          const idx = line.indexOf(':');
          const key = line.slice(0, idx).trim();
          const val = line.slice(idx + 1).trim().replace(/^"|"$/g, '');
          return [key, val];
        })
    );

    const body = (match?.[2] || '').trim();

    return {
      path,
      title: fm.title || '',
      category: fm.category || '전체',
      order: Number(fm.order || 0),
      published: String(fm.published || 'true') !== 'false',
      body,
    };
  });

  return items
    .filter((it) => it.published)
    .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
}