// -----------------------------------------------------------------------------
// [페이지 목적]
//  - "복지디자인 이야기" 게시글 목록 페이지
//  - /src/content/stories/*.md(마크다운) frontmatter를 빌드 시점에 읽어 카드 목록을 구성
//
// [기능]
//  - 카테고리 탭 + 검색 + 페이지네이션 제공
//  - 상세로 이동할 때 현재 탭 정보를 쿼리스트링(type)에 유지하여 뒤로가기 UX를 안정화
//
// [구현 메모]
//  - normalizeCat(): 과거 표기/오타 등을 현재 카테고리 체계로 정규화
//  - OptimizedImg(): 우선순위(priority) 여부에 따라 즉시 로딩/지연 로딩을 분기
//  - GitHub API 실시간 호출 없이 Vite import.meta.glob 로 로컬 CMS markdown을 사용
// -----------------------------------------------------------------------------
import { memo, useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

// 카테고리 탭(화면 표시용) — 쿼리스트링(type/tab)과도 동기화됨
const CATEGORIES = ["전체", "사업", "교육", "회의", "기타"];

const STORY_MODULES = import.meta.glob("../../content/stories/*.{md,mdx}", {
  query: "?raw",
  import: "default",
  eager: true,
});

// 구(旧) 카테고리 값을 현재 탭 체계(사업/교육/회의/기타)로 정규화
function normalizeCat(raw) {
  const v = (raw || "").trim();
  const allowed = ["사업", "교육", "회의", "기타"];
  if (allowed.includes(v)) return v;

  const map = {
    인터뷰: "교육",
    행사: "회의",
    공탁: "사업",
    공조동행: "기타",
    공지: "기타",
  };

  return map[v] || "기타";
}

// 마크다운 본문(content)에서 카드용 요약문(excerpt) 생성
function toExcerpt(md = "", max = 80) {
  const text = md
    .replace(/!\[[^\]]*\]\([^)]+\)/g, "")
    .replace(/\[[^\]]*\]\([^)]+\)/g, "")
    .replace(/[#>*`_~-]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  return text.length > max ? text.slice(0, max) + "…" : text;
}

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

async function fetchStoryItems() {
  const entries = Object.entries(STORY_MODULES).map(([path, raw]) => {
    const fileName = path.split("/").pop() || "";
    const { data, content } = parseFrontmatter(raw);
    const slug = fileName.replace(/\.(md|mdx)$/i, "");
    const date = String(data?.date || "").trim();

    return {
      slug,
      title: String(data?.title || "제목 없음").trim(),
      date,
      thumbnail: String(data?.thumbnail || "").trim(),
      category: normalizeCat(data?.category),
      excerpt: toExcerpt(content),
      _sort: date ? new Date(date).getTime() : 0,
    };
  });

  return entries.filter(Boolean).sort((a, b) => b._sort - a._sort);
}

// 카테고리/라벨 등을 표시할 때 사용하는 작은 태그 UI
function Tag({ children }) {
  return (
    <span className="inline-block rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold px-2 py-1">
      {children}
    </span>
  );
}

// 이미지 로딩 최적화 컴포넌트
function OptimizedImg({
  src,
  alt = "",
  className = "",
  priority = false,
  sizes = "(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw",
}) {
  const imgRef = useRef(null);
  const [realSrc, setRealSrc] = useState(priority ? src : "");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (priority || !imgRef.current) {
      setRealSrc(src || "");
      return;
    }

    let observer;

    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setRealSrc(src || "");
              observer.disconnect();
            }
          });
        },
        { rootMargin: "800px" }
      );
      observer.observe(imgRef.current);
    } else {
      setRealSrc(src || "");
    }

    return () => observer && observer.disconnect();
  }, [src, priority]);

  return (
    <img
      ref={imgRef}
      src={realSrc}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      fetchpriority={priority ? "high" : "low"}
      width="1280"
      height="720"
      sizes={sizes}
      onLoad={() => setLoaded(true)}
      className={`${className} transition-opacity duration-300 ${
        loaded ? "opacity-100" : "opacity-0"
      }`}
      style={{ background: "#F6F8FA" }}
    />
  );
}

// 카드 1개 렌더링
const StoryCard = memo(function StoryCard({
  item,
  activeCat,
  backTo,
  priority = false,
}) {
  const date = item.date ? new Date(item.date).toISOString().slice(0, 10) : "";

  return (
    <Link
      to={`/news/stories/${item.slug}${
        activeCat && activeCat !== "전체"
          ? `?type=${encodeURIComponent(activeCat)}`
          : ""
      }`}
      state={{ backTo }}
      className="group block overflow-hidden rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-[#33A49C] transition-all bg-white"
    >
      <div className="mt-6 w-full aspect-[4/3] bg-gray-50 overflow-hidden rounded-xl">
        {item.thumbnail ? (
          <OptimizedImg
            src={item.thumbnail}
            alt=""
            priority={priority}
            sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-400 text-sm">
            No image
          </div>
        )}
      </div>

      <div className="p-4 sm:p-5">
        <h3 className="line-clamp-1 text-lg font-bold text-gray-900">
          {item.title}
        </h3>
        <p className="mt-1 text-sm text-gray-500">{date}</p>
      </div>
    </Link>
  );
});

export default function NewsStories() {
  const [rawItems, setRawItems] = useState([]);
  const [activeCat, setActiveCat] = useState("전체");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 9;

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    let alive = true;

    fetchStoryItems()
      .then((entries) => {
        if (!alive) return;
        setRawItems(entries);
      })
      .catch((e) => {
        console.warn("복지디자인 이야기 CMS 데이터 로드 실패:", e);
        if (alive) setRawItems([]);
      });

    return () => {
      alive = false;
    };
  }, []);

  // URL 쿼리스트링(type 또는 tab)과 현재 탭 상태(activeCat)를 동기화
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const typeParam = params.get("type") || params.get("tab");

    if (typeParam && CATEGORIES.includes(typeParam)) {
      setActiveCat(typeParam);
    } else if (!typeParam) {
      setActiveCat("전체");
    }
  }, [location.search]);

  // 탭 + 검색어 기준으로 목록 필터링
  const filtered = useMemo(() => {
    const byCat =
      activeCat === "전체"
        ? rawItems
        : rawItems.filter((it) => (it.category || "기타") === activeCat);

    const keyword = q.trim().toLowerCase();
    if (!keyword) return byCat;

    return byCat.filter(
      (it) =>
        it.title.toLowerCase().includes(keyword) ||
        (it.excerpt || "").toLowerCase().includes(keyword)
    );
  }, [rawItems, activeCat, q]);

  // 탭/검색어가 바뀌면 현재 페이지를 1로 리셋
  useEffect(() => {
    setPage(1);
  }, [activeCat, q]);

  const startIdx = (page - 1) * PAGE_SIZE;
  const endIdx = startIdx + PAGE_SIZE;
  const pagedItems = filtered.slice(startIdx, endIdx);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE) || 1;

  const backTo = `/news/stories${
    activeCat && activeCat !== "전체"
      ? `?type=${encodeURIComponent(activeCat)}`
      : ""
  }`;

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    return () => cancelAnimationFrame(id);
  }, [page, activeCat]);

  return (
    <div className="bg-white">
      {/* ===== 브레드크럼 + 제목 ===== */}
      <section className="max-w-screen-xl mx-auto px-4 pt-10">
        <nav className="text-sm text-black">
          <Link to="/news" className="text-black">
            소식
          </Link>{" "}
          <span className="mx-1 text-gray-400">›</span>{" "}
          <span className="text-black">복지디자인 이야기</span>
        </nav>
        <h1 className="mt-3 text-3xl md:text-4xl font-extrabold tracking-tight text-black">
          복지디자인 이야기
        </h1>
      </section>

      <div className="max-w-screen-xl mx-auto px-4 py-10">
        {/* 탭 */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-6">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => {
                setActiveCat(c);
                const search =
                  c && c !== "전체" ? `?type=${encodeURIComponent(c)}` : "";
                navigate(
                  { pathname: "/news/stories", search },
                  { replace: false }
                );
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`px-3 py-1.5 rounded-full border text-sm font-medium transition ${
                activeCat === c
                  ? "bg-[#33A49C] border-[#33A49C] text-white"
                  : "bg-white border-gray-300 text-gray-700 hover:border-emerald-400"
              }`}
            >
              {c}
            </button>
          ))}

          {/* 검색 */}
          <div className="ml-auto w-full sm:w-72">
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search"
              className="w-full rounded-full border border-gray-300 px-4 py-2 text-sm outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* 카드 그리드 */}
        {filtered.length === 0 ? (
          <p className="text-gray-500">등록된 글이 없습니다.</p>
        ) : (
          <>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {pagedItems.map((it, idx) => (
                <StoryCard
                  key={it.slug}
                  item={it}
                  activeCat={activeCat}
                  backTo={backTo}
                  priority={idx < 6}
                />
              ))}
            </div>

            {/* 페이지네이션 컨트롤 */}
            <div className="flex justify-center items-center gap-3 mt-8">
              <button
                onClick={() => {
                  setPage((p) => Math.max(p - 1, 1));
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                disabled={page <= 1}
                className={`px-4 py-2 rounded border text-sm font-medium ${
                  page <= 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white border-gray-300 text-gray-700 hover:border-emerald-400"
                }`}
              >
                이전
              </button>

              <span className="text-sm font-semibold">
                {page} / {totalPages}
              </span>

              <button
                onClick={() => {
                  setPage((p) => Math.min(p + 1, totalPages));
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                disabled={page >= totalPages}
                className={`px-4 py-2 rounded border text-sm font-medium ${
                  page >= totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white border-gray-300 text-gray-700 hover:border-emerald-400"
                }`}
              >
                다음
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
