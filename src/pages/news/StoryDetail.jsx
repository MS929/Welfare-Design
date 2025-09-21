// src/pages/news/StoryDetail.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import matter from "gray-matter";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * 동행이야기 상세 페이지
 * - CMS가 생성한 /src/content/stories/*.md 를 읽어서 렌더링
 * - Vite 5/7 호환: import.meta.glob 의 as:'raw' 대신 query:'?raw', import:'default'
 */
export default function StoryDetail() {
  const { slug } = useParams();
  const nav = useNavigate();
  const location = useLocation();
  // prefer explicit state from the list, but also accept ?tab=... on the URL
  const qs = new URLSearchParams(location.search);
  const stateTab = location.state?.tab || location.state?.activeTab || null;
  const urlTab = qs.get("tab");
  const effectiveTab = stateTab || urlTab || null;
  const backTo =
    location.state?.backTo ||
    (effectiveTab
      ? `/news/stories?tab=${encodeURIComponent(effectiveTab)}`
      : "/news/stories");
  const [post, setPost] = useState(null); // null: 로딩, undefined: not found

  useEffect(() => {
    (async () => {
      try {
        const modules = import.meta.glob("/src/content/stories/*.md", {
          query: "?raw",
          import: "default",
        });

        const key = Object.keys(modules).find((p) => p.endsWith(`${slug}.md`));
        if (!key) {
          setPost(undefined);
          return;
        }

        const raw = await modules[key]();
        const { data, content } = matter(raw);
        // frontmatter 예시: title, date, thumbnail, author 등
        setPost({
          title: data.title ?? "",
          date: data.date ?? "",
          thumbnail: data.thumbnail ?? "",
          author: data.author ?? "",
          content,
        });
      } catch (e) {
        console.error(e);
        setPost(undefined);
      }
    })();
  }, [slug]);

  if (post === undefined) {
    return (
      <div className="max-w-screen-md mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-3">글을 찾을 수 없습니다</h1>
        <button className="text-emerald-700 hover:underline" onClick={() => nav(backTo)}>
          목록으로
        </button>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-screen-md mx-auto px-4 py-20">
        <p className="text-gray-600">불러오는 중…</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
      <button
        onClick={() => nav(backTo)}
        className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 ring-1 ring-emerald-200 mb-6"
      >
        <span aria-hidden>←</span>
        <span>목록으로</span>
      </button>

      <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight text-gray-900">
        {post.title}
      </h1>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
        {post.date ? (
          <time
            dateTime={new Date(post.date).toISOString()}
            className="inline-flex items-center gap-1 rounded-full bg-gray-50 px-3 py-1 text-gray-600 ring-1 ring-gray-200"
          >
            {new Date(post.date).toISOString().slice(0, 10)}
          </time>
        ) : null}
        {post.author ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-gray-50 px-3 py-1 text-gray-600 ring-1 ring-gray-200">
            {post.author}
          </span>
        ) : null}
      </div>

      {post.thumbnail ? (
        <figure className="mt-6 overflow-hidden rounded-2xl ring-1 ring-gray-200 shadow-sm">
          <img
            src={post.thumbnail}
            alt=""
            className="w-full h-auto max-h-[520px] object-cover"
            loading="lazy"
          />
        </figure>
      ) : null}

      <hr className="my-6 md:my-8 border-gray-200" />

      <article className="prose prose-lg prose-gray max-w-none text-gray-800 prose-a:text-emerald-700 prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-headings:font-semibold prose-h2:mt-12 prose-h3:mt-8">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            img: ({ node, ...props }) => (
              <img
                {...props}
                loading="lazy"
                className="w-full h-auto rounded-xl my-6 shadow-sm ring-1 ring-gray-200"
              />
            ),
            a: ({ node, ...props }) => {
              const href = String(props.href || "");
              const isExternal = /^https?:\/\//i.test(href);
              return (
                <a
                  {...props}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noopener noreferrer" : undefined}
                  className="text-emerald-700 hover:underline"
                />
              );
            },
          }}
        >
          {post.content}
        </ReactMarkdown>
      </article>
    </div>
  );
}
