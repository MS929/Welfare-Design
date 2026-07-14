// -----------------------------------------------------------------------------
// Stories.jsx
// [페이지 목적]
//  - "복지디자인 이야기" 게시글 목록 페이지
//  - src/content/stories/*.md[x] CMS markdown 파일을 빌드 시점에 읽어 카드 목록을 구성
//
// [데이터 흐름]
//  - Vite import.meta.glob으로 stories 폴더의 markdown 원문을 raw 문자열로 로드
//  - frontmatter에서 제목/날짜/카테고리/썸네일 정보를 파싱
//  - 카테고리 탭, 검색어, 페이지네이션 상태에 따라 목록을 필터링하여 표시
//
// [상태 유지]
//  - 상세 페이지로 이동할 때 현재 탭 정보를 URL 쿼리스트링(type)에 유지
//  - 뒤로가기 또는 목록으로 이동 시 기존 카테고리 탭 상태를 복원
//
// [운영 참고]
//  - 새 글 또는 수정 글은 CMS 저장 후 Netlify 재배포가 완료되어야 반영됨
//  - 카테고리 탭을 추가하려면 CATEGORIES 배열과 CMS config.yml의 category 옵션을 함께 수정
// -----------------------------------------------------------------------------
import { memo, useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

// 목록 화면에 표시할 카테고리 탭
// - CMS category 값과 연결되므로 config.yml의 stories category 옵션과 함께 관리
const CATEGORIES = ["전체", "사업", "교육", "회의", "기타"];

// CMS 스토리 원문 로드
// - stories 폴더의 md/mdx 파일을 raw 문자열로 가져옴
// - 목록 페이지에서는 이 데이터로 카드 목록을 구성함
const STORY_MODULES = import.meta.glob("../../content/stories/*.{md,mdx}", {
  query: "?raw",
  import: "default",
  eager: true,
});

// 복지디자인 이야기 카테고리 정규화
// - 과거 표기나 오타성 분류명을 현재 탭 체계(사업/교육/회의/기타)에 맞춤
// - 허용되지 않는 값은 기타로 처리하여 필터 오류를 방지
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

// 카드용 요약문 생성
// - markdown 이미지/링크/기호를 제거하고 짧은 설명 텍스트만 추출
// - 검색어 필터링에도 excerpt 값을 함께 사용
function toExcerpt(md = "", max = 80) {
  const text = md
    .replace(/!\[[^\]]*\]\([^)]+\)/g, "")
    .replace(/\[[^\]]*\]\([^)]+\)/g, "")
    .replace(/[#>*`_~-]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  return text.length > max ? text.slice(0, max) + "…" : text;
}

// Markdown frontmatter 파싱
// - 상단 --- 영역의 key:value 값을 data 객체로 변환
// - 나머지 본문은 content로 분리하여 excerpt 생성에 사용
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

// 복지디자인 이야기 목록 데이터 생성
// - STORY_MODULES의 markdown 파일들을 순회하며 카드에 필요한 데이터로 변환
// - 최신 날짜순으로 정렬하여 반환
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

// 작은 태그 UI 컴포넌트
// - 현재 화면에서는 사용하지 않는 예비 컴포넌트
// - 추후 카드에 카테고리 배지를 표시할 때 재사용 가능
function Tag({ children }) {
  return (
    <span className="inline-block rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold px-2 py-1">
      {children}
    </span>
  );
}

// 카드 썸네일 이미지 컴포넌트
// - priority=true인 상단 카드 이미지는 즉시 로딩
// - 나머지 이미지는 IntersectionObserver로 화면 근처에 왔을 때 지연 로딩
// - opacity 전환으로 이미지가 자연스럽게 나타나도록 처리
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

// 복지디자인 이야기 카드 1개 렌더링
// - 상세 페이지로 이동할 때 현재 카테고리 탭 정보를 query/state로 함께 전달
// - React.memo로 불필요한 카드 재렌더링을 줄임
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

// 복지디자인 이야기 목록 페이지 컴포넌트
// - CMS 글 목록 로드, 탭 필터, 검색, 페이지네이션을 관리
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

  // URL 쿼리스트링(type 또는 tab)과 현재 탭 상태 동기화
  // - 외부 링크/새로고침/상세에서 목록 복귀 시에도 같은 카테고리 탭을 유지
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const typeParam = params.get("type") || params.get("tab");

    if (typeParam && CATEGORIES.includes(typeParam)) {
      setActiveCat(typeParam);
    } else if (!typeParam) {
      setActiveCat("전체");
    }
  }, [location.search]);

  // 탭 + 검색어 기준 목록 필터링
  // - 먼저 카테고리로 필터링하고, 검색어가 있으면 제목/excerpt에서 한 번 더 검색
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

  // 탭/검색어 변경 시 페이지를 1로 리셋
  // - 이전 페이지 번호가 남아 빈 목록이 보이는 상황을 방지
  useEffect(() => {
    setPage(1);
  }, [activeCat, q]);

  // 페이지네이션 계산
  // - 전체 필터링 결과 중 현재 페이지에 보여줄 9개 항목만 잘라냄
  const startIdx = (page - 1) * PAGE_SIZE;
  const endIdx = startIdx + PAGE_SIZE;
  const pagedItems = filtered.slice(startIdx, endIdx);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE) || 1;

  // 상세 페이지에서 목록으로 돌아올 때 사용할 경로
  // - 현재 카테고리 탭을 querystring으로 포함해 목록 상태를 유지
  const backTo = `/news/stories${
    activeCat && activeCat !== "전체"
      ? `?type=${encodeURIComponent(activeCat)}`
      : ""
  }`;

  // 페이지 또는 카테고리 변경 시 상단으로 이동
  // - 목록이 바뀌었을 때 사용자가 새 카드 목록을 바로 볼 수 있도록 처리
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
        {/* 카테고리 탭
            - 클릭 시 URL query(type)를 함께 갱신하여 뒤로가기/새로고침 상태를 유지 */}
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

          {/* 검색 입력
              - 제목과 요약문(excerpt)을 대상으로 필터링 */}
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

        {/* 카드 그리드
            - 모바일 1열, 태블릿 2열, 데스크톱 3열 구조 */}
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

            {/* 페이지네이션 컨트롤
                - 한 페이지에 PAGE_SIZE(9개)씩 표시 */}
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
