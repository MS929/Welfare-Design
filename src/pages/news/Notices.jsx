// src/pages/news/Notices.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import matter from "gray-matter";

// /src/content/notices/*.md 를 읽어 목록으로 렌더
export default function NewsNotices() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    (async () => {
      const modules = import.meta.glob("/src/content/notices/*.md", {
        as: "raw",
      });
      const entries = await Promise.all(
        Object.entries(modules).map(async ([path, loader]) => {
          const raw = await loader();
          const { data } = matter(raw);
          const slug = path.split("/").pop().replace(/\.md$/, ""); // 파일명=slug
          return { slug, ...data };
        })
      );
      entries.sort((a, b) => new Date(b.date) - new Date(a.date));
      setItems(entries);
    })();
  }, []);

  return (
    <div className="max-w-screen-lg mx-auto px-4 py-10">
      <h1 className="text-3xl font-extrabold mb-8">공지/공모</h1>

      {items.length === 0 ? (
        <p className="text-gray-500">공지/공모 글 목록이 표시됩니다.</p>
      ) : (
        <ul className="space-y-4">
          {items.map((n) => (
            <li key={n.slug}>
              <Link
                to={`/news/notices/${n.slug}`}
                className="block rounded-xl border p-4 hover:bg-gray-50"
              >
                <div className="flex items-center gap-4">
                  {n.thumbnail && (
                    <img
                      src={n.thumbnail}
                      alt=""
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  )}
                  <div>
                    <h3 className="font-semibold">{n.title}</h3>
                    {n.date && (
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(n.date).toISOString().slice(0, 10)}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
