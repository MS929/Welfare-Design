// src/pages/news/StoryDetail.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import matter from "gray-matter";
import ReactMarkdown from "react-markdown";

export default function StoryDetail() {
  const { slug: rawSlug } = useParams();
  const slug = decodeURIComponent(rawSlug); // ← 디코딩
  const nav = useNavigate();
  const [post, setPost] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const modules = import.meta.glob("/src/content/stories/*.md", {
          query: "?raw",
          import: "default",
        });

        const targetKey = Object.keys(modules).find((p) =>
          p.endsWith(`${slug}.md`)
        );

        if (!targetKey) {
          setNotFound(true);
          return;
        }

        const raw = await modules[targetKey]();
        const { data, content } = matter(raw);
        setPost({ ...data, content });
      } catch (e) {
        console.error(e);
        setNotFound(true);
      }
    })();
  }, [slug]);

  if (notFound) {
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
    <div className="max-w-screen-lg mx-auto px-4 py-10">
      <button className="text-sky-600 text-sm mb-4" onClick={() => nav(-1)}>
        ← 목록으로
      </button>

      <h1 className="text-3xl font-extrabold">{post.title}</h1>
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
