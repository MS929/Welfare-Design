// -----------------------------------------------------------------------------
// [페이지 목적]
//  - "복지디자인 이야기" 게시글 목록 페이지
//  - /src/content/stories/*.md(마크다운) frontmatter를 읽어 카드 목록을 구성
//
// [기능]
//  - 카테고리 탭 + 검색 + 페이지네이션 제공
//  - 상세로 이동할 때 현재 탭 정보를 쿼리스트링(type)에 유지하여 뒤로가기 UX를 안정화
//
// [구현 메모]
//  - normalizeCat(): 과거 표기/오타 등을 현재 카테고리 체계로 정규화
//  - OptimizedImg(): 우선순위(priority) 여부에 따라 즉시 로딩/지연 로딩을 분기
// -----------------------------------------------------------------------------
import { memo, useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import matter from "gray-matter";
// 카테고리 탭(화면 표시용) — 쿼리스트링(type/tab)과도 동기화됨
const CATEGORIES = ["전체", "사업", "교육", "회의", "기타"];

// 구(旧) 카테고리 값을 현재 탭 체계(사업/교육/회의/기타)로 정규화
// - frontmatter.category 값이 허용 목록에 없으면 과거 표기/오타 등을 매핑해서 정리
// - 매핑에 없으면 기본값은 "기타"
function normalizeCat(raw) {
  const v = (raw || "").trim();
  const allowed = ["사업", "교육", "회의", "기타"]; 
  if (allowed.includes(v)) return v;
  const map = {
    "인터뷰": "교육",
    "행사": "회의",
    "공탁": "사업",
    "공조동행": "기타",
    "공지": "기타",
  };
  return map[v] || "기타";
}

// 마크다운 본문(content)에서 카드용 요약문(excerpt) 생성
// - 이미지/링크/마크다운 기호를 제거하고, 지정 길이(max)까지만 잘라 표시
function toExcerpt(md = "", max = 80) {
  const text = md
    .replace(/!\[[^\]]*\]\([^)]+\)/g, "") // 이미지
    .replace(/\[[^\]]*\]\([^)]+\)/g, "") // 링크 표기
    .replace(/[#>*`_~-]/g, "") // 마크다운 기호
    .replace(/\s+/g, " ")
    .trim();
  return text.length > max ? text.slice(0, max) + "…" : text;
}

// 카테고리/라벨 등을 표시할 때 사용하는 작은 태그 UI
// - 현재 파일에서는 예비 컴포넌트(필요 시 StoryCard 등에 연결)
function Tag({ children }) {
  return (
    <span className="inline-block rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold px-2 py-1">
      {children}
    </span>
  );
}

// 이미지 로딩 최적화 컴포넌트
// - priority=true: 최초 화면(above-the-fold) 이미지는 즉시 로딩(eager) + 높은 우선순위
// - priority=false: IntersectionObserver로 뷰포트 근처에 왔을 때만 src를 주입해 지연 로딩
// - sizes: 반응형 이미지 힌트(브라우저가 적절한 리소스를 선택하도록 도움)
function OptimizedImg({ src, alt = "", className = "", priority = false, sizes = "(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw" }) {
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
        { rootMargin: "800px" } // 화면에 들어오기 전 여유 구간에서 미리 로딩(체감 속도 개선)
      );
      observer.observe(imgRef.current);
    } else {
      // IntersectionObserver 미지원 브라우저 대비: 즉시 로딩
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
      fetchpriority={priority ? "high" : "low"} // 브라우저에 로딩 우선순위 힌트 제공
      width="1280"
      height="720"
      sizes={sizes}
      onLoad={() => setLoaded(true)}
      className={`${className} transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
      style={{ background: "#F6F8FA" }}
    />
  );
}

// 카드 1개 렌더링(React.memo로 불필요한 재렌더 최소화)
// - 상세 페이지로 이동할 때 현재 탭(type)을 쿼리에 붙여, 뒤로 왔을 때 목록 상태를 유지
const StoryCard = memo(function StoryCard({ item, activeCat, backTo, priority = false }) {
  const date = item.date ? new Date(item.date).toISOString().slice(0, 10) : "";
  return (
    <Link
      to={`/news/stories/${item.slug}${activeCat && activeCat !== "전체" ? `?type=${encodeURIComponent(activeCat)}` : ""}`}
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
        <h3 className="line-clamp-1 text-lg font-bold text-gray-900">{item.title}</h3>
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
    // Vite의 import.meta.glob으로 마크다운 파일을 "문자열(raw)"로 읽어들인 뒤,
    // gray-matter로 frontmatter(data)와 본문(content)을 분리해 목록 데이터로 변환
    const modules = import.meta.glob("/src/content/stories/*.md", {
      query: "?raw",
      import: "default",
    });

    (async () => {
      const entries = await Promise.all(
        Object.entries(modules).map(async ([path, loader]) => {
          const raw = await loader();
          const { data, content } = matter(raw);
          const file = path.split("/").pop().replace(".md", "");

          return {
            slug: file, // 상세 라우팅에 그대로 사용
            title: data.title || "제목 없음",
            date: data.date || "",
            thumbnail: data.thumbnail || "",
            category: normalizeCat(data.category),
            excerpt: toExcerpt(content),
            _sort: data.date ? new Date(data.date).getTime() : 0,
          };
        })
      );

      // 최신 날짜가 위로 오도록 정렬(날짜가 없으면 _sort=0으로 뒤쪽)
      entries.sort((a, b) => b._sort - a._sort);
      setRawItems(entries);
    })();
  }, []);

  // URL 쿼리스트링(type 또는 tab)과 현재 탭 상태(activeCat)를 동기화
  // - 외부 링크/새로고침/뒤로가기에서도 동일한 탭이 유지되도록 함
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const typeParam = params.get("type") || params.get("tab"); // type / tab 키 모두 지원
    if (typeParam && CATEGORIES.includes(typeParam)) {
      setActiveCat(typeParam);
    } else if (!typeParam) {
      setActiveCat("전체");
    }
  }, [location.search]);

  // 탭 + 검색어 기준으로 목록 필터링(계산량을 줄이기 위해 useMemo 사용)
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

  // 탭/검색어가 바뀌면 현재 페이지를 1로 리셋(빈 페이지로 남는 상황 방지)
  useEffect(() => {
    setPage(1);
  }, [activeCat, q]);

  // 페이지네이션: 현재 페이지에 보여줄 구간만 잘라서 렌더
  const startIdx = (page - 1) * PAGE_SIZE;
  const endIdx = startIdx + PAGE_SIZE;
  const pagedItems = filtered.slice(startIdx, endIdx);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  // 상세 페이지에서 "목록으로" 돌아올 때 사용할 기준 URL(현재 탭 정보를 포함)
  const backTo = `/news/stories${activeCat && activeCat !== "전체" ? `?type=${encodeURIComponent(activeCat)}` : ""}`;

  // 페이지 번호나 탭이 바뀌면 상단으로 부드럽게 스크롤(사용자가 새 목록을 바로 볼 수 있게)
  useEffect(() => {
    // 레이아웃 계산 이후에 스크롤되도록 requestAnimationFrame으로 한 프레임 지연
    const id = requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    return () => cancelAnimationFrame(id);
  }, [page, activeCat]);

  return (
    <div className="bg-white">
      {/* ===== 브레드크럼 + 제목 (whatIs.jsx 동일 규격) ===== */}
      <section className="max-w-screen-xl mx-auto px-4 pt-10">
        <nav className="text-sm text-black">
          <Link to="/news" className="text-black">소식</Link> <span className="mx-1 text-gray-400">›</span> <span className="text-black">복지디자인 이야기</span>
        </nav>
        <h1 className="mt-3 text-3xl md:text-4xl font-extrabold tracking-tight text-black">복지디자인 이야기</h1>
      </section>

      {/* 아래부터 본문 컨테이너 */}
      <div className="max-w-screen-xl mx-auto px-4 py-10">
        {/* 탭 */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-6">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => {
                setActiveCat(c);
                const search = c && c !== "전체" ? `?type=${encodeURIComponent(c)}` : "";
                navigate({ pathname: "/news/stories", search }, { replace: false });
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`px-3 py-1.5 rounded-full border text-sm font-medium transition
                ${
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
                <StoryCard key={it.slug} item={it} activeCat={activeCat} backTo={backTo} priority={idx < 6} />
              ))}
            </div>
            {/* 페이지네이션 컨트롤 */}
            <div className="flex justify-center items-center gap-3 mt-8">
              <button
                onClick={() => { setPage((p) => Math.max(p - 1, 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }}
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
                onClick={() => { setPage((p) => Math.min(p + 1, totalPages)); window.scrollTo({ top: 0, behavior: "smooth" }); }}
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
