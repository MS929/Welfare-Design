// src/pages/news/StoryDetail.jsx
import { useEffect, useState, useRef } from "react";
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
  const [neighbors, setNeighbors] = useState({ prev: null, next: null });
  const [copied, setCopied] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const modules = import.meta.glob("/src/content/stories/*.md", {
          query: "?raw",
          import: "default",
        });

        const entries = await Promise.all(
          Object.entries(modules).map(async ([path, resolver]) => {
            const raw = await resolver();
            const { data, content } = matter(raw);
            const slugFromPath = path.split("/").pop().replace(/\.md$/, "");
            return { slug: slugFromPath, data, content };
          })
        );

        const currentIndex = entries.findIndex((e) => e.slug === slug);
        if (currentIndex === -1) {
          setPost(undefined);
          return;
        }

        const currentEntry = entries[currentIndex];
        setPost({
          title: currentEntry.data.title ?? "",
          date: currentEntry.data.date ?? "",
          thumbnail: currentEntry.data.thumbnail ?? "",
          author: currentEntry.data.author ?? "",
          content: currentEntry.content,
        });

        // sort by date descending (fallback to filename)
        const sorted = entries.slice().sort((a, b) => {
          const dateA = a.data.date ? new Date(a.data.date).getTime() : 0;
          const dateB = b.data.date ? new Date(b.data.date).getTime() : 0;
          if (dateA !== dateB) return dateB - dateA;
          return a.slug.localeCompare(b.slug);
        });

        const sortedIndex = sorted.findIndex((e) => e.slug === slug);

        const prev = sortedIndex > 0 ? sorted[sortedIndex - 1] : null;
        const next = sortedIndex < sorted.length - 1 ? sorted[sortedIndex + 1] : null;

        setNeighbors({
          prev: prev ? { slug: prev.slug, title: prev.data.title ?? "" } : null,
          next: next ? { slug: next.slug, title: next.data.title ?? "" } : null,
        });
      } catch (e) {
        console.error(e);
        setPost(undefined);
      }
    })();
  }, [slug]);

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const total = el.scrollHeight - el.clientHeight;
      const scrolled = total > 0 ? el.scrollTop / total : 0;
      setProgress(Math.min(100, Math.max(0, scrolled * 100)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

  const readingMinutes = post?.content
    ? Math.max(1, Math.round((post.content.split(/\s+/).length || 0) / 200))
    : null;

  return (
    <>
      <div className="fixed left-0 right-0 top-0 h-0.5 z-40">
        <div
          className="h-full bg-emerald-600/80 transition-[width] duration-200"
          style={{ width: `${progress}%` }}
        />
      </div>

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
          {readingMinutes ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-gray-50 px-3 py-1 text-gray-600 ring-1 ring-gray-200">
              {readingMinutes}분 읽기
            </span>
          ) : null}
          <span className="grow" />
          <button
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
              } catch (e) {
                console.error(e);
              }
            }}
            className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 ring-1 ring-emerald-200"
          >
            링크 복사{copied ? "됨" : ""}
          </button>
        </div>

        {post.thumbnail ? (
          <figure className="mt-6 overflow-hidden rounded-2xl ring-1 ring-gray-100 bg-white shadow-sm">
            <img
              src={post.thumbnail}
              alt=""
              className="w-full h-auto max-h-[520px] object-cover"
              loading="lazy"
            />
          </figure>
        ) : null}

        <hr className="my-8 md:my-10 border-t-0 h-[1px] bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-6 md:p-8">
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

        <nav className="mt-10 rounded-xl bg-gray-50 ring-1 ring-gray-200 p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {neighbors.prev ? (
            <button
              onClick={() => nav(`/news/stories/${neighbors.prev.slug}`, { state: { tab: effectiveTab, backTo } })}
              className="group text-left inline-flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-white hover:shadow-sm"
            >
              <span className="text-gray-400 group-hover:text-emerald-700">←</span>
              <span className="text-sm text-gray-600">이전 글</span>
              <span className="font-semibold text-gray-800 line-clamp-1">{neighbors.prev.title}</span>
            </button>
          ) : (
            <span className="text-gray-300 select-none"> </span>
          )}

          {neighbors.next ? (
            <button
              onClick={() => nav(`/news/stories/${neighbors.next.slug}`, { state: { tab: effectiveTab, backTo } })}
              className="group text-right inline-flex items-center gap-2 rounded-lg px-3 py-2 self-end sm:self-auto hover:bg-white hover:shadow-sm"
            >
              <span className="font-semibold text-gray-800 line-clamp-1">{neighbors.next.title}</span>
              <span className="text-gray-400 group-hover:text-emerald-700">→</span>
              <span className="text-sm text-gray-600">다음 글</span>
            </button>
          ) : (
            <span className="text-gray-300 select-none"> </span>
          )}
        </nav>
      </div>
    </>
  );
}
