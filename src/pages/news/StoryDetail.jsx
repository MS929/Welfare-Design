// src/pages/news/StoryDetail.jsx
// 동행이야기(스토리) 상세 페이지
// - /src/content/stories/*.md(마크다운) 파일을 로드해 상세 내용을 렌더링
// - 목록 화면에서 선택한 탭(tab) 상태를 URL(state/query)로 받아 "목록으로" 이동 시 유지
// - 스크롤 진행률(상단 바) 표시

import { useEffect, useState, useRef, useMemo } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import matter from "gray-matter";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// 지연 로딩 + 뷰포트 근접 시 로드하는 이미지 컴포넌트
// - priority=true: 즉시 로드(상단 썸네일 등)
// - 그 외: IntersectionObserver로 화면 근처(rootMargin)에서만 로드하여 초기 렌더 비용 절감
// - 로드 전에는 회색 플레이스홀더(minHeight)로 레이아웃 흔들림(레이아웃 시프트) 최소화
function SmartImage({ src, alt, className, priority = false, placeholderMin = 220 }) {
  const [shouldLoad, setShouldLoad] = useState(priority);
  const [loaded, setLoaded] = useState(false);
  const [size, setSize] = useState({ width: undefined, height: undefined });
  const ref = useRef(null);

  useEffect(() => {
    if (priority) {
      setShouldLoad(true);
      return;
    }
    if (!ref.current) return;

    let observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "1000px" }
    );
    observer.observe(ref.current);

    return () => observer && observer.disconnect();
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
          alt={alt}
          decoding="async"
          loading={priority ? "eager" : "lazy"}
          className={`${className} transition-opacity duration-300 opacity-100`}
          width={size.width}
          height={size.height}
          style={{ willChange: "opacity", backfaceVisibility: "hidden" }}
          onLoad={(e) => {
            setLoaded(true);
            if (!size.width || !size.height) {
              setSize({ width: e.target.naturalWidth, height: e.target.naturalHeight });
            }
          }}
        />
      )}
    </div>
  );
}

/**
 * 동행이야기 상세 페이지
 * - CMS가 생성한 /src/content/stories/*.md 를 읽어서 렌더링
 * - Vite 5/7 호환: import.meta.glob 의 as:'raw' 대신 query:'?raw', import:'default'
 */
export default function StoryDetail() {
  const { slug } = useParams();
  const nav = useNavigate();
  const location = useLocation();
  // 목록 화면에서 전달된 state(tab) 우선, 없으면 URL의 ?tab=... 도 허용
  const qs = new URLSearchParams(location.search);
  const stateTab = location.state?.tab || location.state?.activeTab || null;
  const urlTab = qs.get("tab");
  const effectiveTab = stateTab || urlTab || null;
  const backTo =
    location.state?.backTo ||
    (effectiveTab
      ? `/news/stories?tab=${encodeURIComponent(effectiveTab)}`
      : "/news/stories");
  const [post, setPost] = useState(null); // null=로딩 중, undefined=글 없음(404), 객체=정상 데이터
  const [neighbors, setNeighbors] = useState({ prev: null, next: null });
  const [copied, setCopied] = useState(false);
  const progressRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        // Vite의 import.meta.glob으로 스토리 마크다운 파일을 "문자열(raw)"로 한 번에 수집
        // - query:"?raw" + import:"default" 조합은 Vite 5/7 환경에서 raw 로딩 호환을 위한 설정
        const modules = import.meta.glob("/src/content/stories/*.md", {
          query: "?raw",
          import: "default",
        });

        // 각 파일을 읽어 frontmatter(메타데이터)와 본문(content)을 분리하고, 파일명에서 slug를 만든다
        const entries = await Promise.all(
          Object.entries(modules).map(async ([path, resolver]) => {
            const raw = await resolver();
            const { data, content } = matter(raw);
            const slugFromPath = path.split("/").pop().replace(/\.md$/, "");
            return { slug: slugFromPath, data, content };
          })
        );

        // URL slug와 일치하는 글을 찾는다. 없으면 not found 처리
        const currentIndex = entries.findIndex((e) => e.slug === slug);
        if (currentIndex === -1) {
          setPost(undefined);
          return;
        }

        // 상세 화면에서 사용할 데이터(제목/날짜/썸네일/작성자/본문)를 상태로 저장
        const currentEntry = entries[currentIndex];
        setPost({
          title: currentEntry.data.title ?? "",
          date: currentEntry.data.date ?? "",
          thumbnail: currentEntry.data.thumbnail ?? "",
          author: currentEntry.data.author ?? "",
          content: currentEntry.content,
        });

        // 날짜 내림차순으로 정렬(날짜가 없으면 파일명(slug)로 보조 정렬)
        const sorted = entries.slice().sort((a, b) => {
          const dateA = a.data.date ? new Date(a.data.date).getTime() : 0;
          const dateB = b.data.date ? new Date(b.data.date).getTime() : 0;
          if (dateA !== dateB) return dateB - dateA;
          return a.slug.localeCompare(b.slug);
        });

        const sortedIndex = sorted.findIndex((e) => e.slug === slug);

        // 정렬된 목록 기준으로 이전/다음 글 네비게이션 정보를 만든다
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
    // 페이지 스크롤 위치에 따라 상단 진행률 바(progressRef)의 너비를 갱신
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

  // 마크다운 본문을 ReactMarkdown으로 렌더링
  // - img: SmartImage로 교체해 이미지 로딩/성능 최적화
  // - a: 외부 링크는 새 탭 + 보안(rel) 처리
  // - useMemo로 본문(content)이 바뀔 때만 렌더 결과를 재계산
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
        {post.content}
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
      {/* 스크롤 진행률 바(상단 고정) */}
      <div className="fixed left-0 right-0 top-0 h-0.5 z-40">
        <div
          ref={progressRef}
          className="h-full bg-emerald-600/80 transition-[width] duration-200"
          style={{ width: "0%" }}
        />
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        {/* 목록(탭 유지)으로 돌아가기 */}
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
            <>
              {/* 이전/다음 이동 시에도 탭과 backTo를 state로 넘겨 목록 복귀 동선을 유지 */}
              <button
                onClick={() => nav(`/news/stories/${neighbors.prev.slug}`, { state: { tab: effectiveTab, backTo } })}
                className="group text-left inline-flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-white hover:shadow-sm"
              >
                <span className="text-gray-400 group-hover:text-emerald-700">←</span>
                <span className="text-sm text-gray-600">이전 글</span>
                <span className="font-semibold text-gray-800 line-clamp-1">{neighbors.prev.title}</span>
              </button>
            </>
          ) : (
            <span className="text-gray-300 select-none"> </span>
          )}

          {neighbors.next ? (
            <>
              {/* 이전/다음 이동 시에도 탭과 backTo를 state로 넘겨 목록 복귀 동선을 유지 */}
              <button
                onClick={() => nav(`/news/stories/${neighbors.next.slug}`, { state: { tab: effectiveTab, backTo } })}
                className="group text-right inline-flex items-center gap-2 rounded-lg px-3 py-2 self-end sm:self-auto hover:bg-white hover:shadow-sm"
              >
                <span className="font-semibold text-gray-800 line-clamp-1">{neighbors.next.title}</span>
                <span className="text-gray-400 group-hover:text-emerald-700">→</span>
                <span className="text-sm text-gray-600">다음 글</span>
              </button>
            </>
          ) : (
            <span className="text-gray-300 select-none"> </span>
          )}
        </nav>
      </div>
    </>
  );
}
