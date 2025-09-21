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
        <button className="text-sky-600 underline" onClick={() => nav('/news/notices')}>
          목록으로
        </button>
      </div>
    );
  }

  if (!post) return null;

  const markdownComponents = {
    img: ({node, ...props}) => (
      <img
        {...props}
        loading="lazy"
        decoding="async"
        className="rounded-xl shadow-md mt-6 w-full"
        alt={props.alt || ""}
      />
    )
  };

  return (
    <div className="max-w-screen-md mx-auto px-4 py-10">
      <header className="flex items-center justify-between mb-6">
        <button
          onClick={() => nav('/news/notices')}
          className="px-3 py-1 rounded-full border border-sky-600 text-sky-600 text-sm font-semibold hover:bg-sky-50 transition"
          aria-label="Back to notice list"
        >
          ← 목록으로
        </button>
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 flex-1 text-center">
          {post.title || slug}
        </h1>
        <div className="w-24" />
      </header>

      <div className="flex items-center space-x-3 mb-8 justify-center">
        <span className="inline-block bg-sky-600 text-white text-xs font-semibold px-3 py-1 rounded-full select-none">
          공지
        </span>
        {post.date && (
          <time
            className="text-gray-500 text-sm font-medium select-none"
            dateTime={new Date(post.date).toISOString()}
          >
            {new Date(post.date).toLocaleDateString(undefined, {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })}
          </time>
        )}
      </div>

      {post.thumbnail && (
        <img
          src={post.thumbnail}
          alt=""
          loading="lazy"
          decoding="async"
          className="rounded-xl shadow-md mb-8 w-full object-cover"
          style={{willChange: "transform"}}
        />
      )}

      <article className="prose prose-sky max-w-none rounded-xl ring-1 ring-gray-200 shadow-md p-8 bg-white">
        <ReactMarkdown components={markdownComponents}>{post.content}</ReactMarkdown>
      </article>
    </div>
  );
}
