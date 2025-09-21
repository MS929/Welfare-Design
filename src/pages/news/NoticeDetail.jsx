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
        const modules = import.meta.glob('/src/content/notices/*.md', { query: '?raw', import: 'default' });
        const fileKey = Object.keys(modules).find((p) => p.endsWith(`${slug}.md`));

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

  // Calmer, consistent image rendering for markdown
  const markdownComponents = {
    img: ({ node, ...props }) => (
      <img
        {...props}
        loading="lazy"
        decoding="async"
        className="mt-6 rounded-lg border border-gray-200 w-full max-h-[70vh] object-contain"
        alt={props.alt || ""}
      />
    ),
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* Top line: back button */}
      <div className="mb-6">
        <button
          onClick={() => nav('/news/notices')}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded border border-gray-300 text-gray-700 hover:bg-gray-50 transition text-sm font-medium"
          aria-label="Back to notice list"
        >
          <span aria-hidden>←</span> 목록으로
        </button>
      </div>

      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 mb-2">{post.title || slug}</h1>

      {/* Meta */}
      <div className="flex items-center gap-3 text-gray-500 text-sm font-medium select-none">
        <span className="inline-flex items-center rounded-full bg-sky-100 text-sky-700 px-2 py-0.5">공지</span>
        {post.date && (
          <time dateTime={new Date(post.date).toISOString()}>
            {new Date(post.date).toLocaleDateString(undefined, {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
            })}
          </time>
        )}
      </div>

      <div className="mt-6 h-px bg-gray-200" />

      {/* Thumbnail (optional) */}
      {post.thumbnail && (
        <img
          src={post.thumbnail}
          alt=""
          loading="lazy"
          decoding="async"
          className="mt-6 w-full rounded-lg object-cover"
        />
      )}

      {/* Content */}
      <article className="text-[17px] leading-8 text-gray-800 space-y-6 mt-8">
        <ReactMarkdown components={markdownComponents}>{post.content}</ReactMarkdown>
      </article>
    </div>
  );
}
