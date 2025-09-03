import { Link, useParams } from "react-router-dom";
import { loadPosts } from "../../lib/md";

// 둘 다 대비(상대/절대) — 빌드 환경차 안전장치
const gAbs = import.meta.glob("/src/content/stories/*.md", {
  eager: true,
  as: "raw",
});
const gRel = import.meta.glob("../../content/stories/*.md", {
  eager: true,
  as: "raw",
});
const posts = loadPosts([gAbs, gRel]);

export default function StoriesPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">동행이야기</h1>
      {posts.length === 0 ? (
        <p className="text-gray-500">등록된 글이 없습니다.</p>
      ) : (
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <li
              key={p.slug}
              className="border rounded-xl overflow-hidden bg-white"
            >
              {p.thumbnail && (
                <img
                  src={p.thumbnail}
                  alt=""
                  className="w-full h-40 object-cover"
                />
              )}
              <div className="p-4">
                <time className="text-xs text-gray-500">
                  {p.date.toLocaleDateString()}
                </time>
                <h3 className="font-semibold mt-1">{p.title}</h3>
                <Link
                  to={`/news/stories/${encodeURIComponent(p.slug)}`}
                  className="text-sky-600 text-sm mt-2 inline-block"
                >
                  자세히 보기 →
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function StoryDetail() {
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
