import { useParams, Link } from "react-router-dom";
import { marked } from "marked";

const files = import.meta.glob("../../content/stories/*.md", {
  eager: true,
  as: "raw",
});

function parseFrontmatter(raw) {
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

export default function StoryDetail() {
  const { slug } = useParams();
  const match = Object.entries(files).find(([path]) =>
    path.endsWith(`${slug}.md`)
  );

  if (!match) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        <p className="text-gray-500">글을 찾을 수 없습니다.</p>
        <Link className="text-sky-600 mt-4 inline-block" to="/news/stories">
          ← 목록으로
        </Link>
      </div>
    );
  }

  const raw = match[1];
  const { data, content } = parseFrontmatter(raw);
  const html = marked.parse(content || "");

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Link className="text-sky-600" to="/news/stories">
        ← 목록으로
      </Link>

      <h1 className="mt-4 text-3xl md:text-4xl font-extrabold">
        {data.title || "제목 없음"}
      </h1>
      {data.date && (
        <p className="text-gray-500 mt-2">{String(data.date).slice(0, 10)}</p>
      )}

      {data.thumbnail && (
        <img
          src={data.thumbnail}
          alt=""
          className="mt-6 w-full rounded-xl object-cover"
        />
      )}

      <article
        className="prose max-w-none mt-8"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
