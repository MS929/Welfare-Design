// src/pages/news/Stories.jsx
import { Link } from "react-router-dom";
import matter from "gray-matter";
import { useEffect, useState } from "react";

export default function NewsStories() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    (async () => {
      const modules = import.meta.glob("/src/content/stories/*.md", {
        query: "?raw",
        import: "default",
      });
      const paths = Object.keys(modules).sort().reverse();

      const out = [];
      for (const p of paths) {
        const raw = await modules[p]();
        const { data } = matter(raw);
        const fileSlug = p.split("/").pop().replace(/\.md$/, ""); // 파일명 기반
        out.push({
          slug: fileSlug,
          title: data.title ?? fileSlug,
          date: data.date,
          thumbnail: data.thumbnail,
        });
      }
      setItems(out);
    })();
  }, []);

  if (!items.length) {
    return (
      <div className="max-w-screen-md mx-auto px-4 py-16">
        <h1 className="text-3xl font-extrabold mb-6">동행이야기</h1>
        <p className="text-gray-500">등록된 글이 없습니다.</p>
      </div>
    );
  }

  return (
    <section className="max-w-screen-md mx-auto px-4 py-10">
      <h1 className="text-3xl font-extrabold mb-6">동행이야기</h1>

      <ul className="space-y-4">
        {items.map((it) => (
          <li key={it.slug}>
            <Link
              to={`/news/stories/${encodeURIComponent(it.slug)}`} // ← 인코딩 필수
              className="block rounded-xl border p-4 hover:bg-gray-50"
            >
              <div className="flex gap-4 items-center">
                {it.thumbnail && (
                  <img
                    src={it.thumbnail}
                    alt=""
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                )}
                <div>
                  <div className="font-semibold">{it.title}</div>
                  {it.date && (
                    <div className="text-sm text-gray-500">
                      {new Date(it.date).toISOString().slice(0, 10)}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
