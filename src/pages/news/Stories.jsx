import { Link } from "react-router-dom";

// Vite가 빌드타임에 src/content/stories/*.md 를 모두 가져오게 함
const files = import.meta.glob("../../content/stories/*.md", {
  eager: true,
  as: "raw",
});

function parseFrontmatter(raw) {
  // --- frontmatter --- + 본문 분리 (아주 단순 파서)
  const m = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/m.exec(raw);
  if (!m) return { data: {}, content: raw };
  const yaml = m[1];
  const content = m[2];
  const data = {};
  yaml.split("\n").forEach((line) => {
    const idx = line.indexOf(":");
    if (idx > -1) {
      const k = line.slice(0, idx).trim();
      let v = line.slice(idx + 1).trim();
      v = v.replace(/^"(.*)"$/, "$1").replace(/^'(.*)'$/, "$1");
      data[k] = v;
    }
  });
  return { data, content };
}

function buildPosts() {
  return Object.entries(files)
    .map(([path, raw]) => {
      const { data } = parseFrontmatter(raw);
      // slug는 파일명(확장자 제외)
      const slug = path.split("/").pop().replace(/\.md$/, "");
      return {
        slug,
        title: data.title || "제목 없음",
        date: data.date || "",
        thumbnail: data.thumbnail || "/uploads/placeholder.jpg",
      };
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export default function Stories() {
  const posts = buildPosts();

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-extrabold mb-8">동행이야기</h1>

      {posts.length === 0 ? (
        <p className="text-gray-500">스토리/블로그 글 목록이 표시됩니다.</p>
      ) : (
        <ul className="space-y-4">
          {posts.map((p) => (
            <li key={p.slug}>
              <Link
                to={`/news/stories/${p.slug}`}
                className="flex items-center gap-4 rounded-xl border p-4 hover:bg-gray-50"
              >
                <img
                  src={p.thumbnail}
                  alt=""
                  className="w-20 h-20 rounded-lg object-cover"
                />
                <div>
                  <div className="font-semibold">{p.title}</div>
                  {p.date && (
                    <div className="text-sm text-gray-500">
                      {p.date.slice(0, 10)}
                    </div>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
