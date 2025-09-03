// src/pages/news/Stories.jsx
import { Link } from "react-router-dom";

/** frontmatter + body 파서 */
function parseMD(raw) {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) return { frontmatter: {}, body: raw };
  const [, fmBlock, body] = m;
  const fm = {};
  fmBlock.split("\n").forEach((line) => {
    const idx = line.indexOf(":");
    if (idx === -1) return;
    const key = line.slice(0, idx).trim();
    const val = line
      .slice(idx + 1)
      .trim()
      .replace(/^"|"$/g, "");
    fm[key] = val;
  });
  return { frontmatter: fm, body: body?.trim() ?? "" };
}

/** 파일 경로에서 slug 뽑기 */
function slugFromPath(path) {
  // 예: /src/content/stories/2025-09-03-abc.md -> 2025-09-03-abc
  return path.split("/").pop().replace(/\.md$/, "");
}

export default function NewsStories() {
  // md 파일 내용을 문자열(raw)로 eager import
  const files = import.meta.glob("/src/content/stories/*.md", {
    eager: true,
    as: "raw",
  });

  // 파싱 + slug 붙이기
  const posts = Object.entries(files).map(([path, raw]) => {
    const { frontmatter, body } = parseMD(raw);
    return {
      slug: slugFromPath(path),
      title: frontmatter.title || "제목 없음",
      date: frontmatter.date || "",
      thumbnail: frontmatter.thumbnail || "", // /uploads/xxx.jpg (public 폴더 기준)
      body,
    };
  });

  // 날짜 내림차순
  posts.sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-extrabold mb-8">동행이야기</h1>

      {posts.length === 0 && (
        <p className="text-gray-500">스토리/블로그 글 목록이 표시됩니다.</p>
      )}

      <div className="space-y-5">
        {posts.map((p) => (
          <Link
            key={p.slug}
            to={`/news/stories/${p.slug}`} // ✅ 상세로 이동
            className="block rounded-xl border hover:shadow-md transition bg-white"
          >
            <div className="flex items-center gap-4 p-5">
              {/* 썸네일 */}
              <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                {p.thumbnail ? (
                  <img
                    src={p.thumbnail}
                    alt={p.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                    No Image
                  </div>
                )}
              </div>

              {/* 제목/날짜 */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold truncate">{p.title}</h3>
                {p.date && (
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(p.date).toISOString().slice(0, 10)}
                  </p>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
