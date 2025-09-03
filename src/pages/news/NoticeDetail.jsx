// src/pages/news/Notices.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import matter from "gray-matter";

export default function NewsNotices() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    (async () => {
      const modules = import.meta.glob("/src/content/notices/*.md", {
        as: "raw",
      });
      const entries = await Promise.all(
        Object.entries(modules).map(async ([path, loader]) => {
          const raw = await loader();
          const { data } = matter(raw);
          // 파일명 => slug (예: 2025-09-03-hello-world.md -> 2025-09-03-hello-world)
          const slug = path.split("/").pop().replace(/\.md$/, "");
          return { ...data, slug };
        })
      );

      // 최신 날짜 우선 정렬
      entries.sort((a, b) => new Date(b.date) - new Date(a.date));
      setPosts(entries);
    })();
  }, []);

  return (
    <div className="max-w-screen-lg mx-auto px-4 py-12">
      <h1 className="text-3xl font-extrabold mb-6">공지/공모</h1>

      {!posts.length ? (
        <p className="text-gray-500">공지/공모 글 목록이 표시됩니다.</p>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <Link
              key={post.slug}
              to={`/news/notices/${post.slug}`} // ✅ 상세 링크
              className="block rounded-xl border p-4 hover:bg-gray-50"
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
                  <h3 className="font-semibold">{post.title}</h3>
                  <p className="text-sm text-gray-500">
                    {post.date &&
                      new Date(post.date).toISOString().slice(0, 10)}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
