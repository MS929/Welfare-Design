// -----------------------------------------------------------------------------
// [페이지 목적]
//  - 동행이야기(스토리) 상세 페이지
//  - /src/content/stories/*.md[x] CMS markdown 파일을 빌드 시점에 읽어 본문을 렌더링
//
// [상태 유지/이동 동선]
//  - 목록 화면의 탭(tab) 상태를 location.state 또는 URL 쿼리(?tab=...)로 전달받음
//  - "목록으로" 버튼 및 이전/다음 글 이동 후에도 동일 탭으로 복귀할 수 있도록 backTo를 유지
//
// [UX/성능 포인트]
//  - 상단 고정 스크롤 진행률 바 표시
//  - 마크다운 이미지 로딩을 SmartImage로 교체해 초기 렌더 비용과 레이아웃 시프트를 줄임
//  - GitHub API 실시간 호출 없이 Vite import.meta.glob 로 로컬 CMS markdown을 사용
// -----------------------------------------------------------------------------

import { useEffect, useState, useRef, useMemo } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const STORY_DETAIL_MODULES = import.meta.glob("../../content/stories/*.{md,mdx}", {
  query: "?raw",
  import: "default",
  eager: true,
});

function parseFrontmatter(rawText) {
  const text = String(rawText || "");
  const match = text.match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/);

  if (!match) {
    return { data: {}, content: text.trim() };
  }

  const [, yaml, content] = match;
  const data = {};

  yaml.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;

    const idx = trimmed.indexOf(":");
    if (idx === -1) return;

    const key = trimmed.slice(0, idx).trim();
    let value = trimmed.slice(idx + 1).trim();

    value = value.replace(/^[']|[']$/g, "").replace(/^[\"]|[\"]$/g, "");
    data[key] = value;
  });

  return { data, content: content.trim() };
}

async function fetchStoryEntries() {
  const entries = Object.entries(STORY_DETAIL_MODULES).map(([path, raw]) => {
    const fileName = path.split("/").pop() || "";
    const slugFromPath = fileName.replace(/\.(md|mdx)$/i, "");
    const { data, content } = parseFrontmatter(raw);

    return {
      slug: slugFromPath,
      data,
      content,
    };
  });

  return entries.filter(Boolean);
}

// -----------------------------------------------------------------------------
// SmartImage: 지연 로딩 + 뷰포트 근접 시 로드하는 이미지 컴포넌트
// -----------------------------------------------------------------------------
function SmartImage({ src, alt, className, priority = false, placeholderMin = 220 }) {
  const [shouldLoad, setShouldLoad] = useState(priority);
  const [size, setSize] = useState({ width: undefined, height: undefined });
  const ref = useRef(null);

  useEffect(() => {
    if (priority) {
      setShouldLoad(true);
      return;
    }
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "1000px" }
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [priority]);

  const currentSrc = shouldLoad ? src : "";

  return (
    <div
      ref={ref}
      className={`${className} rounded-xl bg-gray-100`}
      style={{ minHeight: placeholderMin }}
    >
      {currentSrc && (
        <img
          src={currentSrc}
          alt={alt || ""}
          decoding="async"
          loading={priority ? "eager" : "lazy"}
          className={`${className} transition-opacity duration-300 opacity-100`}
          width={size.width}
          height={size.height}
          style={{ willChange: "opacity", backfaceVisibility: "hidden" }}
          onLoad={(e) => {
            if (!size.width || !size.height) {
              setSize({
                width: e.currentTarget.naturalWidth,
                height: e.currentTarget.naturalHeight,
              });
            }
          }}
        />
      )}
    </div>
  );
}

/**
 * 동행이야기(스토리) 상세 페이지
 * - CMS가 생성한 src/content/stories/*.md 파일을 빌드 시점에 읽어 렌더링
 * - 새 글/수정 글은 CMS 저장 후 Netlify 재배포가 끝나면 반영됨
 */
export default function StoryDetail() {
  const { slug } = useParams();
  const nav = useNavigate();
  const location = useLocation();

  const qs = new URLSearchParams(location.search);
  const stateTab = location.state?.tab || location.state?.activeTab || null;
  const urlTab = qs.get("tab") || qs.get("type");
  const effectiveTab = stateTab || urlTab || null;
  const backTo =
    location.state?.backTo ||
    (effectiveTab
      ? `/news/stories?type=${encodeURIComponent(effectiveTab)}`
      : "/news/stories");

  const [post, setPost] = useState(null);
  const [neighbors, setNeighbors] = useState({ prev: null, next: null });
  const progressRef = useRef(null);

  useEffect(() => {
    let alive = true;

    fetchStoryEntries()
      .then((entries) => {
        const currentIndex = entries.findIndex((e) => e.slug === slug);

        if (currentIndex === -1) {
          if (alive) setPost(undefined);
          return;
        }

        const currentEntry = entries[currentIndex];

        if (alive) {
          setPost({
            title: currentEntry.data.title ?? "",
            date: currentEntry.data.date ?? "",
            thumbnail: currentEntry.data.thumbnail ?? "",
            author: currentEntry.data.author ?? "",
            content: currentEntry.content,
          });
        }

        const sorted = entries.slice().sort((a, b) => {
          const dateA = a.data.date ? new Date(a.data.date).getTime() : 0;
          const dateB = b.data.date ? new Date(b.data.date).getTime() : 0;
          if (dateA !== dateB) return dateB - dateA;
          return a.slug.localeCompare(b.slug);
        });

        const sortedIndex = sorted.findIndex((e) => e.slug === slug);
        const prev = sortedIndex > 0 ? sorted[sortedIndex - 1] : null;
        const next = sortedIndex < sorted.length - 1 ? sorted[sortedIndex + 1] : null;

        if (alive) {
          setNeighbors({
            prev: prev ? { slug: prev.slug, title: prev.data.title ?? "" } : null,
            next: next ? { slug: next.slug, title: next.data.title ?? "" } : null,
          });
        }
      })
      .catch((e) => {
        console.error("[story detail] CMS load error:", e);
        if (alive) setPost(undefined);
      });

    return () => {
      alive = false;
    };
  }, [slug]);

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const total = el.scrollHeight - el.clientHeight;
      const scrolled = total > 0 ? el.scrollTop / total : 0;
      if (progressRef.current) {
        progressRef.current.style.width = `${Math.min(100, Math.max(0, scrolled * 100))}%`;
      }
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const markdownContent = useMemo(() => {
    if (!post) return null;

    return (
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          img: ({ node, ...props }) => (
            <SmartImage {...props} className="block w-full h-auto rounded-xl my-6" />
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
        {post.content || ""}
      </ReactMarkdown>
    );
  }, [post?.content]);

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
    <>
      <div className="fixed left-0 right-0 top-0 h-0.5 z-40">
        <div
          ref={progressRef}
          className="h-full bg-emerald-600/80 transition-[width] duration-200"
          style={{ width: "0%" }}
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
              dateTime={post.date}
              className="inline-flex items-center gap-1 rounded-full bg-gray-50 px-3 py-1 text-gray-600 ring-1 ring-gray-200"
            >
              {String(post.date).slice(0, 10)}
            </time>
          ) : null}
          {post.author ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-gray-50 px-3 py-1 text-gray-600 ring-1 ring-gray-200">
              {post.author}
            </span>
          ) : null}
          <span className="grow" />
        </div>

        {post.thumbnail ? (
          <figure className="mt-6">
            <SmartImage src={post.thumbnail} alt="" className="block w-full h-auto rounded-2xl" priority />
          </figure>
        ) : null}

        <hr className="my-8 md:my-10 border-t-0 h-[1px] bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-6 md:p-8">
          <article className="prose prose-lg prose-gray max-w-none text-gray-800 prose-a:text-emerald-700 prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-headings:font-semibold prose-h2:mt-12 prose-h3:mt-8">
            {markdownContent}
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
            <span className="text-gray-300 select-none">&nbsp;</span>
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
            <span className="text-gray-300 select-none">&nbsp;</span>
          )}
        </nav>
      </div>
    </>
  );
}
