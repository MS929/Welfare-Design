// src/pages/news/Story.jsx
import { useParams, Link } from "react-router-dom";

const rawModules = import.meta.glob("/src/content/news/*.md", {
  eager: true,
  as: "raw",
});

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

export default function StoryDetail() {
  const { slug } = useParams();

  const matchPath = Object.keys(rawModules).find((p) =>
    p.endsWith(`${slug}.md`)
  );
  if (!matchPath) {
    return (
      <div className="max-w-screen-xl mx-auto px-4 py-12">
        <p className="text-gray-500">글을 찾을 수 없습니다.</p>
      </div>
    );
  }

  const raw = rawModules[matchPath];
  const { frontmatter, body } = parseFrontMatter(raw);

  return (
    <div className="max-w-screen-md mx-auto px-4 py-12">
      <p className="text-sm text-gray-500 mb-2">
        <Link to="/news/stories" className="hover:underline">
          소식 &gt; 동행이야기
        </Link>{" "}
        &gt; 상세
      </p>

      <h1 className="text-3xl font-bold">{frontmatter.title}</h1>
      <time className="block text-sm text-gray-500 mt-2 mb-6">
        {frontmatter.date?.slice(0, 10)}
      </time>

      {frontmatter.thumbnail ? (
        <img
          src={frontmatter.thumbnail}
          alt=""
          className="w-full rounded-xl mb-6"
        />
      ) : null}

      <div className="prose max-w-none">
        {body.split("\n").map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </div>
    </div>
  );
}
