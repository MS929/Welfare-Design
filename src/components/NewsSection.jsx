// src/components/NewsSection.jsx
import { Link } from "react-router-dom";

/**
 * Vite: 모든 마크다운을 raw 텍스트로 불러오기
 * - /src/content/news/*.md 파일을 전부 읽어옵니다.
 * - as: 'raw' 로 하면 문자열 그대로 들어옵니다.
 */
const rawModules = import.meta.glob("/src/content/news/*.md", {
  eager: true,
  as: "raw",
});

// front-matter(--- ---) 파싱
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
      // 따옴표 제거
      value = value.replace(/^"(.*)"$/, "$1");
      fm[key] = value;
    });

  return { frontmatter: fm, body };
}

// 파일들을 [{title, date, thumbnail, body, slug}] 형태로 가공
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
  .sort((a, b) => new Date(b.date) - new Date(a.date)); // 최신순 정렬

export default function NewsSection() {
  if (!posts.length) {
    return (
      <section className="max-w-screen-xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-4">소식</h2>
        <p className="text-gray-500">등록된 소식이 아직 없습니다.</p>
      </section>
    );
  }

  const top = posts.slice(0, 3); // 메인에는 3개만

  return (
    <section className="max-w-screen-xl mx-auto px-4 py-12">
      <div className="flex items-end justify-between mb-6">
        <h2 className="text-2xl font-bold">소식</h2>
        <Link to="/news" className="text-sm text-sky-700 hover:underline">
          전체 보기
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {top.map((p) => (
          <article
            key={p.slug}
            className="rounded-xl border bg-white shadow-sm overflow-hidden"
          >
            {p.thumbnail ? (
              <img
                src={p.thumbnail}
                alt={p.title}
                className="w-full h-44 object-cover"
                onError={(e) => (e.currentTarget.style.display = "none")}
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

              {/* 상세 페이지 라우팅을 아직 안 만들었으면 링크 제거해도 됨 */}
              {/* <Link to={`/news/${p.slug}`} className="mt-3 inline-block text-sky-700 text-sm">
                자세히 보기 →
              </Link> */}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
