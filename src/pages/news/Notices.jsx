// src/pages/news/Notices.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import matter from "gray-matter";

export default function NewsNotices() {
  const [items, setItems] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        // ✅ Vite에서 안전한 절대경로 글로빙
        const modules = import.meta.glob("/src/content/notices/*.md", {
          as: "raw",
        });

        const entries = await Promise.all(
          Object.entries(modules).map(async ([path, loader]) => {
            const raw = await loader();
            const { data } = matter(raw);
            // 파일명으로 slug 생성 (예: 2025-09-03-제목.md -> 2025-09-03-제목)
            const slug = path.split("/").pop().replace(/\.md$/i, "");
            return { slug, ...(data ?? {}) };
          })
        );

        // 최신순 정렬 (frontmatter에 date가 없으면 파일명기준이 되도 OK)
        entries.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
        setItems(entries);
      } catch (e) {
        console.error("[notices] load error:", e);
        setItems([]);
      }
    })();
  }, []);

  if (!items) return null;

  return (
    <div className="max-w-screen-lg mx-auto px-4 py-10">
      <h1 className="text-3xl font-extrabold mb-8">공지/공모</h1>

      {items.length === 0 ? (
        <p className="text-gray-500">등록된 글이 없습니다.</p>
      ) : (
        <ul className="space-y-6">
          {items.map((post) => (
            <li key={post.slug}>
              <Link
                to={`/news/notices/${encodeURIComponent(post.slug)}`}
                className="block border rounded-xl p-4 hover:bg-gray-50 transition"
              >
                <div className="flex items-center gap-4">
                  {post.thumbnail && (
                    <img
                      src={post.thumbnail}
                      alt=""
                      className="w-28 h-20 object-cover rounded-lg"
                    />
                  )}
                  <div>
                    <h2 className="text-lg font-semibold">
                      {post.title || post.slug}
                    </h2>
                    {post.date && (
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(post.date).toISOString().slice(0, 10)}
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
