// src/lib/loadFaq.js
export function loadFaqItems() {
  // For Vite: import Markdown files from either /content/faq or /src/content/faq
  const files = {
    ...import.meta.glob('/content/faq/*.md', { as: 'raw', eager: true }),
    ...import.meta.glob('/src/content/faq/*.md', { as: 'raw', eager: true }),
  };

  const items = Object.entries(files).map(([path, raw]) => {
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
