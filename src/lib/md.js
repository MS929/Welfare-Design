export function parseFrontMatter(raw) {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  const body = m ? m[2].trim() : raw;
  const fm = {};
  if (m) {
    m[1].split("\n").forEach((line) => {
      const idx = line.indexOf(":");
      if (idx > -1) {
        const k = line.slice(0, idx).trim();
        const v = line
          .slice(idx + 1)
          .trim()
          .replace(/^['"]|['"]$/g, "");
        fm[k] = v;
      }
    });
  }
  return { frontMatter: fm, content: body };
}

export function loadPosts(globs) {
  // globs: import.meta.glob 결과들을 머지해서 받기
  const rawModules = Object.assign({}, ...globs);
  return Object.entries(rawModules)
    .map(([path, raw]) => {
      const { frontMatter, content } = parseFrontMatter(raw);
      const slug = path.split("/").pop().replace(/\.md$/, "");
      return {
        slug,
        title: frontMatter.title || slug,
        date: new Date(frontMatter.date || Date.now()),
        thumbnail: frontMatter.thumbnail || "",
        content,
      };
    })
    .sort((a, b) => b.date - a.date);
}
