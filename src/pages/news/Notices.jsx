// src/pages/news/Notices.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import matter from "gray-matter";

export default function Notices() {
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState("전체");

  useEffect(() => {
    (async () => {
      const modules = import.meta.glob("/src/content/notices/*.md", {
        query: "?raw",
        import: "default",
      });
      const entries = await Promise.all(
        Object.entries(modules).map(async ([path, loader]) => {
          const raw = await loader();
          const { data } = matter(raw);
          // 파일명으로 slug 생성
          const slug = path.split("/").pop().replace(/\.md$/, "");
          return {
            slug,
            title: data.title ?? "",
            date: data.date ?? "",
            category: data.category ?? "공지",
            thumbnail: data.thumbnail ?? "", // ✅ 키 이름 'thumbnail'
          };
        })
      );
      // 최신순 정렬
      entries.sort((a, b) => (a.date < b.date ? 1 : -1));
      setPosts(entries);
    })();
  }, []);

  const filtered = posts.filter((p) =>
    filter === "전체" ? true : p.category === filter
  );

  return (
    <div className="max-w-screen-lg mx-auto px-4 py-10">
      <h1 className="text-3xl font-extrabold mb-6">공지/공모</h1>

      {/* 필터 */}
      <div className="flex gap-3 mb-6">
        {["전체", "공지", "공모"].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-3 py-1 rounded-full border ${
              filter === cat ? "bg-black text-white" : "bg-white"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 목록 */}
      <div className="grid gap-6">
        {filtered.length === 0 && (
          <p className="text-gray-500">등록된 글이 없습니다.</p>
        )}

        {filtered.map((post) => (
          <Link
            key={post.slug}
            to={`/news/notices/${post.slug}`}
            className="block rounded-2xl border p-5 hover:shadow-md transition"
          >
            <div className="w-full aspect-[16/9] overflow-hidden rounded-xl bg-gray-100">
              {post.thumbnail ? (
                <img
                  src={post.thumbnail}
                  alt=""
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              ) : null}
            </div>

            <div className="mt-3">
              <div className="text-sm text-gray-500">
                {post.category} ·{" "}
                {post.date
                  ? new Date(post.date).toISOString().slice(0, 10)
                  : ""}
              </div>
              <h2 className="mt-1 font-semibold text-lg line-clamp-2">
                {post.title}
              </h2>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
