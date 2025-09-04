// src/pages/news/NoticeDetail.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import matter from "gray-matter";
import ReactMarkdown from "react-markdown";

export default function NoticeDetail() {
  const { slug } = useParams();
  const nav = useNavigate();
  const [post, setPost] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const modules = import.meta.glob('/src/content/notices/*.md', { query: '?raw', import: 'default' })
        const fileKey = Object.keys(modules).find((p) =>
          p.endsWith(`${slug}.md`)
        );

        if (!fileKey) {
          setPost(undefined);
          return;
        }

        const raw = await modules[fileKey]();
        const { data, content } = matter(raw);
        setPost({ ...(data ?? {}), content });
      } catch (e) {
        console.error("[notice detail] load error:", e);
        setPost(undefined);
      }
    })();
  }, [slug]);

  if (post === undefined) {
    return (
      <div className="max-w-screen-md mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-3">글을 찾을 수 없습니다</h1>
        <button className="text-sky-600 underline" onClick={() => nav(-1)}>
          목록으로
        </button>
      </div>
    );
  }

  if (!post) return null;

  return (
    <div className="max-w-screen-md mx-auto px-4 py-10">
      <button className="text-sky-600 text-sm mb-4" onClick={() => nav(-1)}>
        ← 목록으로
      </button>

      <h1 className="text-3xl font-extrabold">{post.title || slug}</h1>
      {post.date && (
        <p className="text-gray-500 mt-2">
          {new Date(post.date).toISOString().slice(0, 10)}
        </p>
      )}

      {post.thumbnail && (
        <img src={post.thumbnail} alt="" className="mt-6 w-full rounded-xl" />
      )}

      <article className="prose max-w-none mt-8">
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </article>
    </div>
  );
}
