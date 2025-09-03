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
        Object.entries(modules).map(async ([path, resolver]) => {
          const raw = await resolver();
          const { data } = matter(raw);
          const slug = path.split("/").pop().replace(".md", "");
          return { ...data, slug };
        })
      );
      setPosts(entries.sort((a, b) => new Date(b.date) - new Date(a.date)));
    })();
  }, []);

  return (
    <div className="max-w-screen-md mx-auto px-4 py-10">
      <h1 className="text-3xl font-extrabold mb-8">공지/공모</h1>

      {posts.length === 0 ? (
        <p className="text-gray-500">등록된 글이 없습니다.</p>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <Link
              key={post.slug}
              to={`/news/notices/${post.slug}`}
              className="block border rounded-lg p-5 hover:bg-gray-50 transition"
            >
              {post.thumbnail && (
                <img
                  src={post.thumbnail}
                  alt=""
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
              )}
              <h2 className="text-xl font-semibold">{post.title}</h2>
              {post.date && (
                <p className="text-gray-500 text-sm mt-1">
                  {new Date(post.date).toISOString().slice(0, 10)}
                </p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
