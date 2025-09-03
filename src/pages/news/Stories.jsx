// src/pages/news/Stories.jsx
import { Link } from "react-router-dom";

// Vite: 뉴스 폴더의 md 파일을 raw로 모두 불러오기
const rawModules = import.meta.glob("/src/content/news/*.md", {
  eager: true,
  as: "raw",
});

// --- front-matter 파싱 도우미 ---
function parseFrontMatter(md) {
  const fmMatch = md.match(/^---([\s\S]*?)---\s*/);
  const fmBlock = fmMatch ? fmMatch[1] : "";
  const body = md.replace(/^---[\s\S]*?---\s*/, "").trim();

  const fm = {};
  fmBlock
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .forEach((line) => {
      const idx = line.indexOf(":");
      if (idx === -1) return;
      const key = line.slice(0, idx).trim();
      let value = line.slice(idx + 1).trim();
      value = value.replace(/^"(.*)"$/, "$1");
      fm[key] = value;
    });

  return { frontmatter: fm, body };
}

const posts = Object.entries(rawModules)
  .map(([path, raw]) => {
    const { frontmatter, body } = parseFrontMatter(raw);
    const slug = path.split("/").pop().replace(".md", "");
    return {
      title: frontmatter.title || "(제목 없음)",
      date: frontmatter.date || "",
      thumbnail: frontmatter.thumbnail || "",
      body,
      slug,
    };
  })
  .sort((a, b) => new Date(b.date) - new Date(a.date));

export default function NewsStories() {
  return (
    <div className="max-w-screen-xl mx-auto px-4 py-12">
      {/* 브레드크럼 */}
      <p className="text-sm text-gray-500 mb-2">소식 &gt; 동행이야기</p>
      <h1 className="text-3xl md:text-4xl font-extrabold mb-8">동행이야기</h1>

      {!posts.length ? (
        <p className="text-gray-500">아직 등록된 글이 없습니다.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((p) => (
            <article
              key={p.slug}
              className="rounded-xl border bg-white shadow-sm overflow-hidden"
            >
              {p.thumbnail ? (
                <img
                  src={p.thumbnail}
                  alt={p.title}
                  className="w-full h-44 object-cover"
                />
              ) : null}
              <div className="p-4">
                <time className="text-xs text-gray-500">
                  {p.date?.slice(0, 10)}
                </time>
                <h3 className="mt-1 font-semibold line-clamp-2">{p.title}</h3>
                <p className="mt-2 text-sm text-gray-600 line-clamp-3">
                  {p.body.replace(/\n+/g, " ").slice(0, 120)}
                  {p.body.length > 120 ? "…" : ""}
                </p>
                <Link
                  to={`/news/stories/${p.slug}`}
                  className="mt-3 inline-block text-sky-700 text-sm"
                >
                  자세히 보기 →
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
