import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import matter from 'gray-matter';
import ReactMarkdown from 'react-markdown';
export default function NoticeDetail() {
  const { slug } = useParams();
  const nav = useNavigate();
  const location = useLocation();
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

  // Determine badge text (force "정보공개" when the current route is an information-disclosure page)
  const path = (location.pathname || "").toLowerCase();
  const infoKeywords = ['open-data', 'opendata', 'open', 'disclosure', 'info', 'public', 'information', 'data'];
  const koreanKeywords = ['정보공개', '공시', '공개'];
  const isInfoPath = infoKeywords.some(keyword => path.includes(keyword)) ||
    koreanKeywords.some(keyword => location.pathname.includes(keyword)) ||
    location.state?.section === 'info';

  if (import.meta.env.DEV) {
    console.log(`[NoticeDetail] pathname: "${location.pathname}", isInfoPath: ${isInfoPath}`);
  }

  let badgeText = isInfoPath ? "정보공개" : (post.category || post.type || "공지");
  const isInfo = badgeText === "정보공개";

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
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => nav('/news/notices')}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded border border-gray-300 text-gray-700 hover:bg-gray-50 transition text-sm font-medium"
          aria-label="Back to notice list"
        >
          <span aria-hidden>←</span> 목록으로
        </button>
        <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold select-none ${
          isInfo ? 'bg-emerald-100 text-emerald-700' : 'bg-sky-100 text-sky-700'
        }`}>
          {badgeText}
        </span>
      </div>

      <article className="bg-white shadow-sm ring-1 ring-gray-200 rounded-lg p-8 text-gray-900">
        <header className="mb-6">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">{post.title || slug}</h1>
          {post.date && (
            <time
              dateTime={new Date(post.date).toISOString()}
              className="block mt-1 text-gray-500 text-sm font-medium select-none"
            >
              {new Date(post.date).toLocaleDateString(undefined, {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
              })}
            </time>
          )}
        </header>

        {post.thumbnail && (
          <img
            src={post.thumbnail}
            alt=""
            loading="lazy"
            decoding="async"
            className="mb-6 w-full rounded-lg object-cover"
          />
        )}

        <div className="prose max-w-none text-[17px] leading-8 text-gray-800">
          <ReactMarkdown components={markdownComponents}>{post.content}</ReactMarkdown>
        </div>
      </article>
    </div>
  );
}
