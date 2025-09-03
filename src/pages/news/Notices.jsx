import { Link, useParams } from "react-router-dom";
import { loadPosts } from "../../lib/md";

const gAbs = import.meta.glob("/src/content/notices/*.md", {
  eager: true,
  as: "raw",
});
const gRel = import.meta.glob("../../content/notices/*.md", {
  eager: true,
  as: "raw",
});
const posts = loadPosts([gAbs, gRel]);

export default function NoticesPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">공지/공모</h1>
      {posts.length === 0 ? (
        <p className="text-gray-500">등록된 글이 없습니다.</p>
      ) : (
        <ul className="space-y-4">
          {posts.map((p) => (
            <li
              key={p.slug}
              className="border rounded-xl bg-white p-4 flex items-center gap-4"
            >
              {p.thumbnail && (
                <img
                  src={p.thumbnail}
                  alt=""
                  className="w-20 h-20 object-cover rounded"
                />
              )}
              <div className="flex-1">
                <time className="text-xs text-gray-500">
                  {p.date.toLocaleDateString()}
                </time>
                <h3 className="font-semibold mt-1">
                  <Link
                    to={`/news/notices/${encodeURIComponent(p.slug)}`}
                    className="hover:underline"
                  >
                    {p.title}
                  </Link>
                </h3>
              </div>
              <Link
                to={`/news/notices/${encodeURIComponent(p.slug)}`}
                className="text-sky-600 text-sm shrink-0"
              >
                자세히 →
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function NoticeDetail() {
  const { slug } = useParams();
  const post = posts.find((p) => p.slug === slug);
  if (!post)
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">글을 찾을 수 없습니다.</div>
    );
  return (
    <article className="max-w-3xl mx-auto px-4 py-12 prose">
      <h1>{post.title}</h1>
      <time className="text-sm text-gray-500 block mb-6">
        {post.date.toLocaleString()}
      </time>
      {post.thumbnail && (
        <img src={post.thumbnail} alt="" className="rounded-lg mb-6" />
      )}
      <pre style={{ whiteSpace: "pre-wrap" }}>{post.content}</pre>
    </article>
  );
}
