/**
 * Home.jsx (메인 페이지)
 * - 홈 화면 구성(히어로 캐러셀 / 빠르게 가기 / 복지디자인 소식 / 공지·정보공개)
 * - CMS(markdown/mdx) 기반 콘텐츠를 Vite import.meta.glob 으로 로드해 리스트로 렌더링
 * - 모바일/터치 환경에서 hover/active 잔상 및 떨림(iOS Safari) 방지를 위한 스타일 처리 포함
 */
import { useState, useEffect, useMemo, useRef } from "react";
// 반응형(미디어 쿼리) 및 입력장치(터치/마우스) 상태를 감지하는 커스텀 훅
// - SSR 환경처럼 window가 없을 수 있는 상황을 고려해 안전장치(guard)를 포함
// - 전달된 미디어 쿼리(query)가 매칭되는지 boolean으로 반환
const useMedia = (query) => {
  const [match, setMatch] = useState(() => {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    try { return window.matchMedia(query).matches; } catch { return false; }
  });
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia(query);
    const handler = () => setMatch(mq.matches);
    handler();
    mq.addEventListener ? mq.addEventListener("change", handler) : mq.addListener(handler);
    return () => {
      mq.removeEventListener ? mq.removeEventListener("change", handler) : mq.removeListener(handler);
    };
  }, [query]);
  return match;
};
// =============================
// 외부 의존성 / 유틸 컴포넌트 import
// =============================
import matter from "gray-matter";
import { Link } from "react-router-dom";
import OptimizedImg from "../components/OptimizedImg";
import { cldFetch, cldSrcSet } from "../lib/image";
// =============================
// 디자인 토큰(컬러/그림자/라운드 등) — 인라인 스타일 기반 UI 일관성 유지
// =============================
// 팔레트 (우리 브랜드 컬러로, 레퍼런스 톤을 흉내냄)
const PALETTE = {
  orange: "#ED6A32",
  yellow: "#F4B731",
  teal: "#3BA7A0",
  grayBg: "#F5F7FA",
  mintPeachBg: "linear-gradient(180deg, #E8F4F2 0%, #FCE9E2 100%)",
  grayCard: "#FFFFFF",
  grayText: "#64748B",
  darkText: "#111827",
  line: "rgba(17, 24, 39, 0.08)",
  lineStrong: "rgba(17, 24, 39, 0.12)",
  shadowSm: "0 4px 12px rgba(0,0,0,.05)",
  shadow: "0 8px 24px rgba(0,0,0,.06)",
  heroBg: "#FFF6EE",
  heroTop: "#FFF3E6", // 상단 크림색
  heroBottom: "#FFFFFF", // 하단 화이트
  heroVignette: "rgba(0,0,0,0.04)",
  heroCreamTop: "#FFF5E9",
  heroCreamMid: "#FFF9F2",
  heroCreamEdge: "#FFEEDC",
  radius: 16,
  radiusLg: 22,
  radiusXl: 28,
  pageBg: "#F8FAFC",
  tealTint: "rgba(59,167,160,.10)",
};

// 페이지 기본 컨테이너 최대 폭(px)
const CONTAINER = 1360;

// HERO(상단) 캐러셀 이미지 경로 (public/images/hero 하위 정적 리소스)
// - 필요 시 파일만 교체하면 코드 변경 없이 이미지 교체 가능
const HERO_IMAGES = ["/images/hero/dog.png", "/images/hero/light.png"];
const HERO_INTERVAL = 10000; // 10초

/**
 * 파일명에서 날짜가 포함된 slug를 파싱
 * 예) 2025-01-01-my-post.md -> { date: '2025-01-01', slug: 'my-post', titleFromFile: 'my-post' }
 * - CMS 컨텐츠가 파일명 기반으로 라우팅/정렬될 때 안정적으로 사용
 */
function parseDatedSlug(filepath) {
  const name = filepath.split("/").pop() || "";
  const m = name.match(/^(\d{4}-\d{2}-\d{2})-(.+)\.(md|mdx)$/);
  if (!m) {
    return {
      date: null,
      slug: name.replace(/\.(md|mdx)$/i, ""),
      titleFromFile: name.replace(/\.(md|mdx)$/i, ""),
    };
  }
  const [, date, rest] = m;
  const slug = rest
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9가-힣-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
  return { date, slug, titleFromFile: rest };
}

// 날짜 포맷 정규화(YYYY-MM-DD). 문자열/Date 모두 처리.
function formatDate(v) {
  if (!v) return "";
  try {
    if (typeof v === "string") return v.slice(0, 10);
    if (v instanceof Date && !isNaN(v)) return v.toISOString().slice(0, 10);
  } catch {}
  return "";
}

/**
 * 공지 카테고리 표기 흔들림을 통일
 * - 예: "정보 공개"/"정보-공개"/"공모" 등의 값을 "정보공개"로 정규화
 */
function normalizeNoticeCategory(v) {
  const s = (v ?? "").toString().trim();
  if (!s) return "공지";
  // 공백/하이픈을 제거해 "정보 공개", "정보-공개" 같은 표기를 동일 기준으로 비교
  const compact = s.replace(/[\s-]/g, "");
  if (compact === "공모") return "정보공개";
  if (compact.includes("정보") && compact.includes("공개")) return "정보공개";
  if (s.startsWith("공지")) return "공지";
  return s; // 그 외 값은 원문 그대로 사용
}

// 레이아웃 섹션 컴포넌트
// - fullBleed=true: 배경은 화면 전체 폭, 내부 콘텐츠는 가운데 정렬 컨테이너
const Section = ({
  children,
  style,
  fullBleed = false,
  innerMaxWidth = CONTAINER,
}) => {
  if (fullBleed) {
    // 배경은 화면 전체 폭, 내부 콘텐츠는 중앙 컨테이너로 제한
    return (
      <section
        style={{
          ...(typeof window !== "undefined" && window.innerWidth <= 640
            ? {
                width: "100%",
                margin: 0,
                padding: "24px 0",
              }
            : {
                width: "100vw",
                margin: "0 calc(50% - 50vw)",
                padding: "40px 0",
              }),
          ...style,
        }}
      >
        <div
          style={{
            maxWidth: innerMaxWidth,
            margin: "0 auto",
            padding:
              typeof window !== "undefined" && window.innerWidth <= 640
                ? "0 16px"
                : "0 24px",
          }}
        >
          {children}
        </div>
      </section>
    );
  }
  // 일반 섹션: 컨테이너 폭으로 제한된 기본 레이아웃
  return (
    <section
      style={{
        maxWidth: CONTAINER,
        width: "100%",
        margin: "0 auto",
        padding:
          typeof window !== "undefined" && window.innerWidth <= 640
            ? "24px 16px"
            : "40px 24px",
        ...style,
      }}
    >
      {children}
    </section>
  );
};

// 필터/태그 버튼용 캡슐 UI (Story 필터 등에 사용)
const Pill = ({ label, icon, color, onClick }) => (
  <button
    onClick={onClick}
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      padding: "10px 14px",
      borderRadius: 999,
      border: `1px solid ${PALETTE.line}`,
      background: "#fff",
      boxShadow: "0 2px 6px rgba(0,0,0,.04)",
      fontWeight: 700,
      cursor: "pointer",
    }}
  >
    <span
      aria-hidden
      style={{
        width: 28,
        height: 28,
        borderRadius: 999,
        background: color,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 14,
        color: "#fff",
      }}
    >
      {icon}
    </span>
    <span>{label}</span>
  </button>
);

// "더보기"용 캡슐 링크 (모바일 터치/뒤로가기 시 스타일 잔상 방지 처리 포함)
const MorePill = ({ href, children }) => (
  <a
    href={href}
    data-reset-touch="true"
    data-reset-kind="pill"
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      height:
        typeof window !== "undefined" && window.innerWidth <= 640 ? 32 : 36,
      padding:
        typeof window !== "undefined" && window.innerWidth <= 640
          ? "0 12px"
          : "0 14px",
      borderRadius: 999,
      border: `1px solid ${PALETTE.teal}`,
      background: "#fff",
      color: PALETTE.teal,
      fontWeight: 800,
      textDecoration: "none",
      boxShadow: "0 2px 6px rgba(0,0,0,.04)",
      fontSize:
        typeof window !== "undefined" && window.innerWidth <= 640 ? 13 : 14,
      transition:
        "background .15s ease, color .15s ease, border-color .15s ease",
      WebkitTapHighlightColor: "transparent",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.background = PALETTE.teal;
      e.currentTarget.style.color = "#fff";
      e.currentTarget.style.borderColor = PALETTE.teal;
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.background = "#fff";
      e.currentTarget.style.color = PALETTE.teal;
      e.currentTarget.style.borderColor = PALETTE.teal;
    }}
    onTouchStart={(e) => {
      // 모바일 터치 눌림 시 hover와 동일하게 표시
      e.currentTarget.style.background = PALETTE.teal;
      e.currentTarget.style.color = "#fff";
      e.currentTarget.style.borderColor = PALETTE.teal;
    }}
    onTouchEnd={(e) => {
      // 터치 종료 및 뒤로가기 복귀 시 기본값 복구
      e.currentTarget.style.background = "#fff";
      e.currentTarget.style.color = PALETTE.teal;
      e.currentTarget.style.borderColor = PALETTE.teal;
    }}
    onFocus={(e) => {
      // 모바일 브라우저에서 focus 잔상 방지
      e.currentTarget.style.background = "#fff";
      e.currentTarget.style.color = PALETTE.teal;
      e.currentTarget.style.borderColor = PALETTE.teal;
    }}
    onBlur={(e) => {
      e.currentTarget.style.background = "#fff";
      e.currentTarget.style.color = PALETTE.teal;
      e.currentTarget.style.borderColor = PALETTE.teal;
    }}
  >
    <span style={{ fontWeight: 900 }}>{children}</span>
    <span aria-hidden style={{ fontWeight: 900 }}>›</span>
  </a>
);

// CMS thumbnail 필드가 다양한 형태(문자열/객체/배열)로 들어올 수 있어 URL을 안전하게 추출
function extractThumbSrc(v) {
  const normalize = (u) => {
    if (!u) return "";
    const s = String(u).trim();
    if (!s) return "";

    // 이미 절대 URL(또는 data/blob)이면 그대로 사용
    if (/^(https?:)?\/\//i.test(s) || /^data:/i.test(s) || /^blob:/i.test(s)) {
      return s;
    }

    // Netlify CMS에서 흔한 상대 경로 형태 정리: ./, ../ 제거
    let p = s.replace(/^\.\//, "");
    p = p.replace(/^\.\.\//, "");

    // 최종적으로는 루트 기준(/...)로 맞춰서 Vite/Netlify에서 안정적으로 서빙되게 함
    if (!p.startsWith("/")) p = `/${p}`;

    // 공백 등 특수문자가 있으면 브라우저에서 깨질 수 있어 인코딩
    try {
      // 이미 인코딩된 경우를 크게 해치지 않도록, path 부분만 안전 인코딩
      const [path, query] = p.split("?");
      const safePath = path
        .split("/")
        .map((seg) => encodeURIComponent(decodeURIComponent(seg)))
        .join("/");
      return query ? `${safePath}?${query}` : safePath;
    } catch {
      return p;
    }
  };

  if (!v) return "";
  if (typeof v === "string") return normalize(v);

  try {
    if (Array.isArray(v)) {
      for (const it of v) {
        const u = extractThumbSrc(it);
        if (u) return u;
      }
      return "";
    }

    if (typeof v === "object") {
      const candidate =
        (typeof v.url === "string" && v.url) ||
        (typeof v.secure_url === "string" && v.secure_url) ||
        (typeof v.src === "string" && v.src) ||
        (typeof v.path === "string" && v.path) ||
        (typeof v.download_url === "string" && v.download_url) ||
        "";
      return normalize(candidate);
    }
  } catch {}

  return "";
}
/**
 * StoryCard(소식 카드)
 * - 썸네일 유무에 따라 이미지/플레이스홀더를 분기 렌더링
 * - Cloudinary URL 여부에 따라 CDN 처리 방식을 분기
 * - iOS/터치 환경에서 hover/transition로 인한 떨림을 최소화
 */
const StoryCard = (props) => {
  const {
    title,
    date,
    href = "/news/stories",
    thumbnail,
    priority = false,
    //  모바일/터치에서 hover/transition 끄기 위한 플래그
    isTouchDevice = false,
    isMobile = false,
    isTablet = false,
    objectPosition = "50% 30%",
  } = props;

  const thumbSrc = extractThumbSrc(thumbnail);
  const hasThumb = typeof thumbSrc === "string" && thumbSrc.length > 0;
  const isCloudinary = hasThumb && /res\.cloudinary\.com\//.test(thumbSrc);

  // Cloudinary 최적화는 `image/upload` URL 변환만 사용한다.
  // (image/fetch는 계정 설정에 따라 401이 발생할 수 있어 사용하지 않음)
  const isCloudinaryUpload =
    isCloudinary && /\/image\/upload\//.test(thumbSrc);

  const withCldUploadTransform = (url, w) => {
    if (!url || !isCloudinaryUpload) return url;
    // 기존 변환이 이미 붙어있으면 중복 삽입을 피한다.
    // 예) .../image/upload/c_limit,w_800/... 또는 .../image/upload/w_800,...
    const marker = "/image/upload/";
    const idx = url.indexOf(marker);
    if (idx === -1) return url;

    const before = url.slice(0, idx + marker.length);
    const after = url.slice(idx + marker.length);

    // 이미 변환 문자열이 있는 경우(첫 세그먼트에 쉼표가 있거나 c_/w_로 시작)
    const firstSeg = after.split("/")[0] || "";
    const alreadyHasTransform =
      /(^|,)(c_|w_|q_|f_|dpr_)/.test(firstSeg) || firstSeg.includes(",");

    const transform = `c_limit,f_auto,q_auto,w_${w}`;
    if (alreadyHasTransform) return url;

    return `${before}${transform}/${after}`;
  };

  const cardW = isMobile ? 640 : isTablet ? 900 : 1100;
  const optimizedThumbSrc = withCldUploadTransform(thumbSrc, cardW);
  const optimizedThumbSrcSet = isCloudinaryUpload
    ? [480, 800, 1200]
        .map((w) => `${withCldUploadTransform(thumbSrc, w)} ${w}w`)
        .join(", ")
    : undefined;

  return (
    <a href={href} style={{ textDecoration: "none", color: "inherit" }}>
      <article
        style={{
          background: "#fff",
          borderRadius: PALETTE.radiusLg,
          border: `1px solid ${PALETTE.line}`,
          boxShadow: isTouchDevice ? "0 2px 6px rgba(0,0,0,.04)" : PALETTE.shadowSm,
          overflow: "hidden",
          //  모바일에서는 transition/hover 제거 → 떨림 방지
          transition: isTouchDevice
            ? "none"
            : "transform .12s ease, box-shadow .12s ease, border-color .12s ease",

          //  iOS Safari에서 스크롤 시 카드 떨림 방지(레이어 고정)
          transform: "translateZ(0)",
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
          willChange: isTouchDevice ? "auto" : "transform",

          // content-visibility는 iOS에서 떨림을 유발할 수 있어 터치 환경에서는 비활성화
          ...(isTouchDevice
            ? {}
            : { contentVisibility: "auto", containIntrinsicSize: "268px 220px" }),
        }}
        //  터치 디바이스에서는 hover 핸들러 자체를 달지 않음
        onMouseEnter={
          !isTouchDevice
            ? (e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = `0 14px 28px rgba(15,23,42,.12), 0 0 0 3px ${PALETTE.teal}22`;
                e.currentTarget.style.borderColor = PALETTE.teal;
              }
            : undefined
        }
        onMouseLeave={
          !isTouchDevice
            ? (e) => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow = PALETTE.shadowSm;
                e.currentTarget.style.borderColor = PALETTE.line;
              }
            : undefined
        }
      >
        <div
          aria-hidden
          style={{
            aspectRatio: '16 / 9',
            height: 'auto',
            overflow: "hidden",
            borderBottom: `1px solid ${PALETTE.line}`,
            background: hasThumb ? "#fff" : PALETTE.grayBg,
          }}
        >
          {hasThumb ? (
            <OptimizedImg
              src={optimizedThumbSrc}
              srcSet={optimizedThumbSrcSet}
              alt=""
              priority={priority}
              sizes="(min-width: 1024px) 33vw, 100vw"
              style={{ width: "100%", height: "100%" }}
              // Cloudinary URL이면 Cloudinary 변환을 사용하므로 Netlify CDN은 끔
              useCdn={!isCloudinary}
              cdnWidth={isMobile ? 480 : isTablet ? 800 : 1000}
              cdnQuality={72}
              imgStyle={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: objectPosition,
                display: "block",
              }}
            />
          ) : (
            // 썸네일이 없을 때 깔끔한 플레이스홀더 표시
            <div
              style={{
                width: "100%",
                height: "100%",
                background: "linear-gradient(180deg, #f3f4f6 0%, #e5e7eb 100%)",
              }}
            />
          )}
        </div>
        <div
          style={{
            padding: 16,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontWeight: 800,
              lineHeight: 1.25,
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              overflow: "hidden",
            }}
          >
            {title}
          </div>
          <div style={{ color: PALETTE.grayText, fontSize: 12, marginTop: 10 }}>
            {date}
          </div>
        </div>
      </article>
    </a>
  );
};

// 메인(Home) 페이지 컴포넌트
// - 반응형/터치 감지, 히어로 캐러셀, 공지/소식 데이터 로딩 및 렌더 담당
export default function Home1() {
  // 뷰포트/입력장치 상태 (레이아웃 분기용)
  const isMobile = useMedia("(max-width: 640px)");
  const isTablet = useMedia("(max-width: 1024px)");
  const isTouch = useMedia("(hover: none) and (pointer: coarse)");
  // 공지/정보공개 목록 데이터
  const [notices, setNotices] = useState([]);
  const [loadingNotices, setLoadingNotices] = useState(true);
  // 복지디자인 소식 필터(카테고리) 상태
  const [storyActive, setStoryActive] = useState("전체");
  const [storyItems, setStoryItems] = useState([]);
  const storyPills = useMemo(
    () => ["전체", "사업", "교육", "회의", "기타"],
    []
  );
  const storyFiltered = useMemo(
    () =>
      storyItems.filter(
        (d) => storyActive === "전체" || d.type === storyActive
      ),
    [storyItems, storyActive]
  );
  // 공지 범위 토글 UI는 제거하고, 항상 두 컬럼(공지/정보공개)을 함께 표시

  // 히어로(상단) 캐러셀: 현재 인덱스 + 자동재생 타이머
  const [heroIndex, setHeroIndex] = useState(0);
  const timerRef = useRef(null);

  // 사용자 OS/브라우저의 접근성 설정에 따라 애니메이션 동작 여부를 결정
  // - 사용자가 '동작 줄이기(reduce motion)'를 선호하면 자동재생을 비활성화
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    try {
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch {
      return false;
    }
  }, []);

  // 캐러셀 자동재생 타이머 재시작(사용자 조작 시에도 초기화)
  const restartTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (prefersReducedMotion) return; // reduce motion이면 자동재생 건너뜀
    timerRef.current = setInterval(() => {
      setHeroIndex((i) => (i + 1) % HERO_IMAGES.length);
    }, HERO_INTERVAL);
  };

  const goTo = (i) => {
    const len = HERO_IMAGES.length || 1;
    const next = ((i % len) + len) % len;
    setHeroIndex(next);
    restartTimer();
  };
  const nextHero = () => goTo(heroIndex + 1);
  const prevHero = () => goTo(heroIndex - 1);

  // prefers-reduced-motion 변경에 따라 자동재생 활성/비활성 및 정리(clean-up)
  useEffect(() => {
    restartTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [prefersReducedMotion]);

  // 공지/정보공개 콘텐츠 로드 (md/mdx -> frontmatter 파싱 -> 최신순 정렬)
  useEffect(() => {
    try {
      setLoadingNotices(true);
      const modules = import.meta.glob("/src/content/notices/*.{md,mdx}", {
        eager: true,
        query: "?raw",
        import: "default",
      });

      const mapped = Object.entries(modules).map(([path, raw]) => {
        const { data } = matter(raw);
        const meta = parseDatedSlug(path);
        const base = (path.split("/").pop() || "").replace(/\.(md|mdx)$/i, "");
        const category = normalizeNoticeCategory(data?.category);
        return {
          id: path,
          title: data?.title || meta.titleFromFile,
          date: formatDate(data?.date) || formatDate(meta.date) || "",
          to: `/news/notices/${encodeURIComponent(base)}`,
          category,
        };
      });

      // 최신순 + 파일명 역순(안정 정렬)
      mapped.sort((a, b) => {
        const ad = a.date ? new Date(a.date) : new Date(0);
        const bd = b.date ? new Date(b.date) : new Date(0);
        if (!isNaN(bd) && !isNaN(ad) && bd.getTime() !== ad.getTime()) {
          return bd.getTime() - ad.getTime();
        }
        return (b.id || "").localeCompare(a.id || "");
      });

      setNotices(mapped);
    } catch (e) {
      console.warn("공지 로드 실패:", e);
      setNotices([]);
    } finally {
      setLoadingNotices(false);
    }
  }, []);

  // 복지디자인 소식(스토리) 콘텐츠 로드 (구버전 카테고리명을 현재 카테고리로 매핑)
  useEffect(() => {
    try {
      const modules = import.meta.glob("/src/content/stories/*.{md,mdx}", {
        eager: true,
        query: "?raw",
        import: "default",
      });
      const mapped = Object.entries(modules).map(([path, raw]) => {
        const { data } = matter(raw);
        const meta = parseDatedSlug(path);
        const base = (path.split("/").pop() || "").replace(/\.(md|mdx)$/i, "");
        const rawType = (data?.category || data?.type || "기타").trim();
        const legacyToNew = {
          인터뷰: "교육",
          교육: "교육",
          행사: "회의",
          행사안내: "회의",
          이벤트: "회의",
          공탁: "사업",
          사업: "사업",
          공조동행: "기타",
          활동: "기타",
          활동소식: "기타",
          공지: "기타",
        };
        let type = legacyToNew[rawType] || rawType;
        if (!["사업", "교육", "회의", "기타"].includes(type)) type = "기타";
        return {
          id: path,
          title: data?.title || meta.titleFromFile,
          date: formatDate(data?.date) || formatDate(meta.date),
          slug: base,
          type,
          thumbnail: data?.thumbnail || null,
          // frontmatter에서 썸네일 포커스 위치를 지정할 수 있도록 허용 (예: "50% 20%")
          thumbPosition:
            data?.thumbPosition ||
            data?.thumb_position ||
            data?.focal ||
            "50% 30%",
        };
      });
      mapped.sort((a, b) => {
        const ad = a.date ? new Date(a.date) : new Date(0);
        const bd = b.date ? new Date(b.date) : new Date(0);
        if (!isNaN(bd) && !isNaN(ad) && bd.getTime() !== ad.getTime()) {
          return bd.getTime() - ad.getTime();
        }
        return (b.id || "").localeCompare(a.id || "");
      });
      setStoryItems(mapped);
    } catch (e) {
      console.warn("스토리 로드 실패:", e);
      setStoryItems([]);
    }
  }, []);

  // iOS BFCache(뒤로가기 캐시) 복귀 시 눌림/hover 잔상을 제거하기 위한 스타일 초기화
  useEffect(() => {
    const resetStyles = () => {
      const nodes = document.querySelectorAll('[data-reset-touch="true"]');
      nodes.forEach((el) => {
        // 공통 초기화
        el.style.transform = "none";
        el.style.boxShadow = PALETTE.shadowSm;
        el.style.background = "#fff";
        const kind = el.getAttribute("data-reset-kind");
        // 컴포넌트 종류별 기본값 복구
        if (kind === "pill") {
          // MorePill 기본 스타일 복구
          el.style.color = PALETTE.teal;
          el.style.borderColor = PALETTE.teal;
        } else {
          // 공지/정보공개 카드 기본값
          el.style.borderColor = PALETTE.line;
        }
      });
    };
    // 최초 진입 및 BFCache 복귀 시 모두 초기화
    resetStyles();
    window.addEventListener("pageshow", resetStyles);
    return () => window.removeEventListener("pageshow", resetStyles);
  }, []);

  // 공지 데이터를 카테고리(공지/정보공개) 기준으로 분리해 화면에 표시하기 위한 전처리
  const noticesSplit = useMemo(() => {
    const norm = (c) => normalizeNoticeCategory(c);
    const notice = notices.filter((n) => norm(n.category) === "공지");
    const info = notices.filter((n) => norm(n.category) === "정보공개");
    return { 공지: notice, 정보공개: info };
  }, [notices]);

  return (
    <>
      <style
        id="page-text-guard"
        dangerouslySetInnerHTML={{
          __html: `
/* 브라우저별 자동 텍스트 크기 조절 방지 (모바일 확대 이슈 대응) */
html {
  -webkit-text-size-adjust: 100%;
  text-size-adjust: 100%;
}

/* 모든 요소의 박스 모델을 border-box로 통일하고,
   최소 너비 및 하이픈 처리 기준을 안정화 */
*, *::before, *::after {
  box-sizing: border-box;
  min-width: 0;
  hyphens: manual;
  -webkit-hyphens: manual;
}

/* 본문 텍스트 기본 렌더링 품질 및 줄바꿈 정책 */
body {
  line-height: 1.5;                 /* 가독성을 위한 기본 줄간격 */
  -webkit-font-smoothing: antialiased; /* macOS/iOS 글꼴 렌더링 개선 */
  -moz-osx-font-smoothing: grayscale;  /* Firefox macOS 렌더링 보정 */
  text-rendering: optimizeLegibility;  /* 가독성 우선 렌더링 */

  word-break: keep-all;             /* 한글 단어 중간 분리 방지 */
  overflow-wrap: anywhere;          /* 긴 영문/URL도 안전하게 줄바꿈 */
  -webkit-line-break: after-white-space; /* iOS 줄바꿈 안정화 */
}

/* 제목 계열 텍스트 줄 균형 맞추기 (지원 브라우저 한정) */
h1, h2, .heading-balance {
  text-wrap: balance;
}

/* text-wrap 미지원 브라우저 대응용 대체 스타일 */
@supports not (text-wrap: balance) {
  h1, h2, .heading-balance {
    line-height: 1.25;   /* 제목 줄간격을 조여 시각적 균형 유지 */
    max-width: 45ch;     /* 한 줄 길이 제한으로 줄바꿈 유도 */
  }
}

/* 강조 텍스트(mark, 하이라이트)의 배경 잘림 방지 */
mark, [data-hl] {
  -webkit-box-decoration-break: clone;
  box-decoration-break: clone;
  padding: 0 .08em;
  border-radius: 2px;
}

/* 줄바꿈을 허용하지 않는 유틸리티 클래스 */
.nowrap {
  white-space: nowrap;
}

/* 어디서든 줄바꿈 허용 (영문/URL 대응용 유틸) */
.u-wrap-anywhere {
  overflow-wrap: anywhere;
  word-break: keep-all;
}

/* 한 줄 말줄임 처리 유틸리티 */
.u-ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
    `,
        }}
      />
      <main style={{ background: "#fff", overflowX: "hidden" }}>
        {/* ================= HERO(상단 캐러셀) ================= */}
        <Section
          fullBleed
          innerMaxWidth={CONTAINER}
          style={{
            paddingTop: isMobile ? 36 : isTablet ? 60 : 80,
            paddingBottom: isMobile ? 40 : isTablet ? 72 : 96,
            background: "linear-gradient(180deg, #FAEEE0 0%, #FFFFFF 72%)",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isTablet ? "1fr" : "1.1fr 1.4fr",
              gap: isTablet ? 20 : 36,
              alignItems: "center",
              padding: "0 32px",
            }}
          >
            {/* 좌측 이미지 프레임 (수동/자동 캐러셀) + 하단 컨트롤 */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "stretch",
              }}
            >
              <div
                style={{
                  position: "relative",
                  height: isMobile ? 220 : isTablet ? 300 : 360,
                  borderRadius: PALETTE.radiusLg,
                  overflow: "hidden",
                  boxShadow: "0 12px 28px rgba(0,0,0,.10)",
                  background: "#fff",
                }}
              >
                {/* HERO 캐러셀 이미지 렌더링 (현재 인덱스만 표시) */}
                {HERO_IMAGES.map((src, i) => (
                  <OptimizedImg
                    key={src}
                    src={src}
                    srcSet={undefined}
                    alt="복지디자인 활동 이미지"
                    // 현재 보이는 것만 우선 로드(high)
                    priority={i === heroIndex}
                    loading={i === heroIndex ? "eager" : "lazy"}
                    fetchpriority={i === heroIndex ? "high" : "low"}
                    decoding="async"
                    useCdn={false}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 1200px"
                    // wrapper(<picture>) 스타일: 위치/페이드
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      opacity: heroIndex === i ? 1 : 0,
                      transition: "opacity 700ms ease-in-out",
                      willChange: "opacity",
                      pointerEvents: "none",
                      display: "block",
                    }}
                    // 내부 <img> 스타일: 채우기
                    imgStyle={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                ))}
              </div>
              {/* 캐러셀 수동 조작 컨트롤 (이전 / 다음 / 위치 표시) */}
              {/* 캐러셀 외부 컨트롤 (이미지 아래) */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 12,
                  marginTop: 10,
                }}
              >
                <button
                  type="button"
                  aria-label="이전 이미지"
                  onClick={prevHero}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    border: `1px solid ${PALETTE.line}`,
                    background: "#fff",
                    boxShadow: "0 2px 8px rgba(0,0,0,.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 800,
                    fontSize: 16,
                    cursor: "pointer",
                    color: PALETTE.darkText,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#FAFAFA";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#fff";
                  }}
                >
                  {"‹"}
                </button>

                {/* 캐러셀 위치 표시 점(dots) */}
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  {HERO_IMAGES.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      aria-label={`이미지 ${i + 1} 보기`}
                      onClick={() => goTo(i)}
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: 999,
                        border: "1px solid rgba(0,0,0,.15)",
                        background: i === heroIndex ? PALETTE.teal : "#fff",
                        boxShadow: "0 1px 2px rgba(0,0,0,.12)",
                        cursor: "pointer",
                        transform: i === heroIndex ? "scale(1.1)" : "none",
                        transition: "transform .2s ease, background .2s ease",
                      }}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  aria-label="다음 이미지"
                  onClick={nextHero}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    border: `1px solid ${PALETTE.line}`,
                    background: "#fff",
                    boxShadow: "0 2px 8px rgba(0,0,0,.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 800,
                    fontSize: 16,
                    cursor: "pointer",
                    color: PALETTE.darkText,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#FAFAFA";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#fff";
                  }}
                >
                  {"›"}
                </button>
              </div>
            </div>

            {/* 우측 텍스트 */}
            <div
              style={{
                marginTop: isTablet ? 10 : -36,
                textAlign: isTablet ? "center" : "left",
                maxWidth: isMobile ? "34ch" : isTablet ? "42ch" : "60ch",
                width: isTablet ? "auto" : "60ch",
                marginInline: isTablet ? "auto" : 0,
              }}
            >
              {/* Eyebrow / 작은 포인트 배지 */}
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "6px 10px",
                  borderRadius: 999,
                  border: `1px solid ${PALETTE.line}`,
                  background: "#fff",
                  boxShadow: PALETTE.shadowSm,
                  marginBottom: 10,
                }}
              >
                <span
                  aria-hidden
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: PALETTE.orange,
                  }}
                />
                <span
                  style={{
                    fontWeight: 800,
                    fontSize: 12,
                    letterSpacing: 0.4,
                    color: "#111827",
                  }}
                >
                  WELFARE&nbsp;DESIGN
                </span>
              </div>

              <h1
                style={{
                  fontSize: isMobile ? 24 : isTablet ? 30 : 38,
                  lineHeight: 1.35,
                  margin: 0,
                  letterSpacing: -0.2,
                  fontWeight: 600,
                  textWrap: "balance",
                }}
              >
                <span style={{ whiteSpace: isTablet ? "normal" : "nowrap" }}>
                  현장과 지역을 잇는{" "}
                  <span
                    style={{
                      boxDecorationBreak: "clone",
                      WebkitBoxDecorationBreak: "clone",
                      backgroundImage:
                        "linear-gradient(transparent 70%, rgba(59,167,160,.28) 0)",
                      fontWeight: 600,
                    }}
                  >
                    맞춤형 복지
                  </span>
                  를 설계하며
                </span>
                <br />
                <span
                  style={{
                    boxDecorationBreak: "clone",
                    WebkitBoxDecorationBreak: "clone",
                    backgroundImage:
                      "linear-gradient(transparent 70%, rgba(237,106,50,.22) 0)",
                    fontWeight: 600,
                  }}
                >
                  복지디자인 사회적협동조합
                </span>
                이
                <br />
                지역과 함께합니다.
              </h1>

              <p
                style={{
                  color: PALETTE.grayText,
                  marginTop: 12,
                  fontSize: isMobile ? 14 : 16,
                }}
              >
                주민·기관·전문가가 협력하는 맞춤형 복지 플랫폼을
                설계·운영합니다.
              </p>
            </div>
          </div>
        </Section>

        {/* ================= 빠르게 가기(퀵링크) ================= */}
        <div
          style={{
            // 빠르게 가기 영역 배경을 화면 전체 폭으로 깔아주는 래퍼(전체 너비 배경)
            background: PALETTE.pageBg, // was PALETTE.mintPeachBg
            borderTop: `1px solid ${PALETTE.line}`,
            borderBottom: `1px solid ${PALETTE.line}`,
            boxShadow: "inset 0 1px 0 rgba(255,255,255,.6)",
            width: "100vw",
            marginLeft: "calc(50% - 50vw)",
            marginRight: "calc(50% - 50vw)",
            padding: "28px 0",
          }}
        >
          <Section style={{ paddingTop: 6, paddingBottom: 6 }}>
            {(() => {
              const quickLinks = [
                {
                  href: "/about/what",
                  iconsrc: "/images/icons/introduction.png",
                  label: "복지디자인 소개",
                  desc: "설립·비전·연혁",
                  theme: {
                    bg: "linear-gradient(180deg, #F06E2E 0%, #E35D23 100%)",
                    border: "#D9541F",
                    text: "#111827",
                  },
                },
                {
                  href: "/business/overview",
                  iconsrc: "/images/icons/needs-survey.png",
                  label: "사업 안내",
                  desc: "운영사업 한눈에",
                  theme: {
                    bg: "linear-gradient(180deg, #36A7A0 0%, #2E9C96 100%)",
                    border: "#2A8D8A",
                    text: "#111827",
                  },
                },
                {
                  href: "/support/guide",
                  iconsrc: "/images/icons/donation.png",
                  label: "후원 안내",
                  desc: "지지와 참여 방법",
                  theme: { bg: "#FEF3D6", border: "#F5E3A6", text: "#D6A216" },
                },
                {
                  href: "/support/combination",
                  iconsrc: "/images/icons/member-services.png",
                  label: "조합 가입",
                  desc: "함께하는 동료되기",
                  theme: { bg: "#E9F5FA", border: "#D1EAF4", text: "#2196C8" },
                },
              ];

              return (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: isTablet
                      ? "1fr"
                      : "minmax(220px, 1fr) 2fr",
                    gap: isTablet ? 14 : 18,
                    alignItems: isTablet ? "stretch" : "center",
                  }}
                >
                  {/* 좌측: 섹션 제목 및 설명 영역 (빠르게 가기) */}
                  <div style={{ textAlign: isMobile ? "center" : "left" }}>
                    <h3
                      style={{
                        margin: 0,
                        fontSize: 20,
                        fontWeight: 900,
                        letterSpacing: -0.2,
                        color: PALETTE.darkText,
                        textAlign: isMobile ? "center" : "left",
                      }}
                    >
                      빠르게 가기
                    </h3>
                    <p
                      style={{
                        margin: "6px 0 0",
                        color: PALETTE.grayText,
                        lineHeight: 1.5,
                        textAlign: isMobile ? "center" : "left",
                      }}
                    >
                      자주 찾는 메뉴를 한 번에 <br />
                      소개·사업·후원·가입 페이지로 바로 이동하세요.
                    </p>
                  </div>

                  {/* 우측: 빠르게 가기 카드 4개 영역 (퀵링크 카드) */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: isMobile
                        ? "repeat(1, minmax(0,1fr))"
                        : isTablet
                        ? "repeat(2, minmax(0,1fr))"
                        : "repeat(4, minmax(0,1fr))",
                      gap: 10,
                    }}
                  >
                    {quickLinks.map((it, i) => (
                      <Link
                        key={i}
                        to={it.href}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          padding: "12px 14px",
                          borderRadius: 16,
                          background: "#fff",
                          border: `1px solid ${PALETTE.line}`,
                          boxShadow: "0 2px 8px rgba(0,0,0,.04)",
                          textDecoration: "none",
                          color: "inherit",
                          transition:
                            "transform .12s ease, box-shadow .12s ease",
                          width: "100%",
                          minHeight: 64,
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "translateY(-2px)";
                          e.currentTarget.style.boxShadow =
                            "0 6px 14px rgba(0,0,0,.08)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "none";
                          e.currentTarget.style.boxShadow =
                            "0 2px 8px rgba(0,0,0,.04)";
                        }}
                      >
                        <div
                          aria-hidden
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: 12,
                            background: `linear-gradient(180deg,#FFFFFF 0%, ${PALETTE.grayBg} 100%)`,
                            border: `1px solid ${PALETTE.lineStrong}`,
                            boxShadow: "0 2px 6px rgba(0,0,0,.06)",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flex: "0 0 auto",
                          }}
                        >
                          <img
                            src={it.iconsrc}
                            alt=""
                            loading="lazy"
                            decoding="async"
                            style={{
                              width: 22,
                              height: 22,
                              objectFit: "contain",
                            }}
                          />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div
                            style={{
                              fontWeight: 900,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {it.label}
                          </div>
                          <div
                            style={{
                              fontSize: 12,
                              color: PALETTE.grayText,
                              marginTop: 2,
                            }}
                          >
                            {it.desc}
                          </div>
                        </div>
                        <span
                          aria-hidden
                          style={{ color: PALETTE.teal, fontWeight: 800 }}
                        >
                          ›
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })()}
          </Section>
        </div>

        {/* ================= 복지디자인 소식(스토리) ================= */}
        <Section>
          {/* 상단 헤더: 좌측 제목/설명, 우측 필터 및 전체보기 링크 (소식 섹션) */}
          <div
            style={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              alignItems: isMobile ? "flex-start" : "flex-end",
              justifyContent: isMobile ? "flex-start" : "space-between",
              gap: isMobile ? 12 : 16,
              marginBottom: isMobile ? 16 : 24,
            }}
          >
            <div style={{ textAlign: "left" }}>
              <h2
                style={{
                  margin: 0,
                  fontSize: 28,
                  fontWeight: 900,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  textAlign: "left",
                }}
              >
                <span
                  aria-hidden
                  style={{
                    width: 8,
                    height: 24,
                    background: PALETTE.teal,
                    borderRadius: 3,
                    display: "inline-block",
                  }}
                />
                복지디자인 소식
              </h2>
              <p
                style={{
                  margin: isMobile ? "6px 0 0" : "6px 0 0",
                  color: PALETTE.grayText,
                  fontSize: 14,
                  textAlign: "left",
                }}
              >
                행복한 소식을 만들어가는 복지디자인입니다.
              </p>
            </div>

            {/* 우측: 가로 필터 + 전체보기 */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                flexWrap: "wrap",
                justifyContent: "flex-start",
                rowGap: 8,
                marginTop: isMobile ? 10 : 0,
              }}
            >
              {storyPills.map((label) => {
                const active = storyActive === label;
                return (
                  <button
                    key={label}
                    onClick={() => setStoryActive(label)}
                    style={{
                      cursor: "pointer",
                      height: isMobile ? 32 : 36,
                      padding: isMobile ? "0 12px" : "0 16px",
                      fontSize: isMobile ? 13 : 14,
                      borderRadius: 999,
                      border: `1px solid ${
                        active ? PALETTE.teal : PALETTE.line
                      }`,
                      background: active ? PALETTE.teal : "#fff",
                      color: active ? "#fff" : PALETTE.darkText,
                      fontWeight: 800,
                      boxShadow: "0 2px 6px rgba(0,0,0,.04)",
                      transition:
                        "background .15s ease, border-color .15s ease, color .15s ease",
                      minWidth: isMobile ? "auto" : 64,
                      flexShrink: 0,
                    }}
                  >
                    {label}
                  </button>
                );
              })}
              <a
                href={
                  storyActive === "전체"
                    ? "/news/stories"
                    : `/news/stories?type=${encodeURIComponent(storyActive)}`
                }
                style={{
                  textDecoration: "none",
                  color: PALETTE.teal,
                  fontWeight: 800,
                  marginLeft: 6,
                  whiteSpace: "nowrap",
                }}
              >
                전체보기 ›
              </a>
            </div>
          </div>

          {/* 카드 그리드 (소식 카드 목록) */}
          {(() => {
            const list = storyFiltered.slice(0, 6);
            const placeholders = Math.max(0, 6 - list.length);

            return (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: isMobile
                    ? "1fr"
                    : isTablet
                    ? "repeat(2, minmax(0,1fr))"
                    : "repeat(3, minmax(0,1fr))",
                  gap: 24,
                }}
              >
                {list.map((n, idx) => (
                  <StoryCard
                    key={n.slug}
                    title={n.title}
                    date={n.date}
                    href={`/news/stories/${encodeURIComponent(n.slug)}${
                      n.type ? `?type=${encodeURIComponent(n.type)}` : ""
                    }`}
                    thumbnail={n.thumbnail}
                    priority={idx < 3}
                    //  모바일/터치에서 hover/transition 비활성화
                    isTouchDevice={isMobile || isTouch}
                    isMobile={isMobile}
                    isTablet={isTablet}
                    objectPosition={n.thumbPosition}
                  />
                ))}

                {/* 카테고리별 게시물이 6개 미만이면 동일한 카드 슬롯을 채워 레이아웃을 고정 */}
                {Array.from({ length: placeholders }).map((_, i) => (
                  <div
                    key={`story-ph-${i}`}
                    aria-hidden
                    style={{
                      background: "#fff",
                      borderRadius: PALETTE.radiusLg,
                      border: `1px solid ${PALETTE.line}`,
                      boxShadow: PALETTE.shadowSm,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        aspectRatio: "16 / 9",
                        background:
                          "linear-gradient(180deg, #f3f4f6 0%, #e5e7eb 100%)",
                        borderBottom: `1px solid ${PALETTE.line}`,
                      }}
                    />
                    <div
                      style={{
                        padding: 16,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        textAlign: "center",
                      }}
                    >
                      <div
                        style={{
                          height: 16,
                          width: "55%",
                          background: "#EEF2F7",
                          borderRadius: 6,
                        }}
                      />
                      <div
                        style={{
                          height: 12,
                          width: 90,
                          background: "#EEF2F7",
                          borderRadius: 6,
                          marginTop: 10,
                        }}
                      />
                    </div>
                  </div>
                ))}

                {storyFiltered.length === 0 && (
                  <div style={{ color: PALETTE.grayText, gridColumn: "1/-1" }}>
                    표시할 소식이 없습니다.
                  </div>
                )}
              </div>
            );
          })()}
        </Section>

        {/* ================= 지원사업(바로가기 카드) ================= */}
        <div
          style={{
            background: PALETTE.pageBg,
            borderTop: `1px solid ${PALETTE.line}`,
            padding: "28px 0",
            width: "100vw",
            marginLeft: "calc(50% - 50vw)",
            marginRight: "calc(50% - 50vw)",
          }}
        >
          <Section id="support" style={{ padding: "24px 20px" }}>
            <h2
              style={{
                margin: "0 0 6px 0",
                fontSize: 24,
                fontWeight: 900,
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <span
                aria-hidden
                style={{
                  width: 8,
                  height: 24,
                  background: PALETTE.yellow,
                  borderRadius: 3,
                  display: "inline-block",
                }}
              />
              지원사업 영역
            </h2>
            <p
              style={{
                margin: "0 0 16px 0",
                color: PALETTE.grayText,
                fontSize: 13,
                opacity: 0.9,
              }}
            >
              복지디자인이 수행하는 주요 지원사업을 한눈에 살펴보세요.
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile
                  ? "1fr"
                  : isTablet
                  ? "repeat(2, minmax(0,1fr))"
                  : "repeat(3, minmax(0,1fr))",
                gap: 20,
              }}
            >
              {[
                {
                  icon: "/images/icons/rental.png",
                  label: "휠체어 및 복지용구 무료 대여",
                  href: "/business/Rental",
                },
                {
                  icon: "/images/icons/apply-help.png",
                  label: "보조기기·복지용구 신청 안내 지원",
                  href: "/business/apply-help",
                },
                {
                  icon: "/images/icons/donation.png",
                  label: "보조기기 기증 캠페인",
                  href: "/business/donation",
                },
                {
                  icon: "/images/icons/ewc-insurance.png",
                  label: "취약 계층 전동 휠체어 보험금 지원",
                  href: "/business/ewc-insurance",
                },
                {
                  icon: "/images/icons/needs-survey.png",
                  label: "취약 계층 복지욕구 실태조사",
                  href: "/business/needs-survey",
                },
                {
                  icon: "/images/icons/member-services.png",
                  label: "조합원 지원 서비스",
                  href: "/business/member-services",
                },
              ].map((it, i) => (
                <Link
                  key={i}
                  to={it.href}
                  style={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    background: "#fff",
                    border: `1px solid ${PALETTE.line}`,
                    color: PALETTE.darkText,
                    borderRadius: PALETTE.radiusLg,
                    padding: 22,
                    boxShadow: PALETTE.shadowSm,
                    textDecoration: "none",
                    transition: "transform .18s ease, box-shadow .18s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = `0 10px 22px rgba(0,0,0,.08), 0 0 0 3px ${PALETTE.yellow}33`;
                    e.currentTarget.style.borderColor = PALETTE.yellow;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "none";
                    e.currentTarget.style.boxShadow = PALETTE.shadowSm;
                    e.currentTarget.style.borderColor = PALETTE.line;
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 12 }}
                  >
                    <div
                      aria-hidden
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 14,
                        background: "#fff",
                        border: `1px solid ${PALETTE.line}`,
                        boxShadow: "0 2px 6px rgba(0,0,0,.06)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {typeof it.icon === "string"
                        ? (() => {
                            const base = it.icon.replace(/\.(png|svg)$/i, "");
                            return (
                              <img
                                src={`${base}.svg`}
                                onError={(e) => {
                                  // SVG 파일이 없을 경우 한 번만 PNG로 대체
                                  e.currentTarget.onerror = null;
                                  e.currentTarget.src = `${base}.png`;
                                }}
                                alt=""
                                loading="lazy"
                                decoding="async"
                                style={{
                                  width: 24,
                                  height: 24,
                                  objectFit: "contain",
                                }}
                              />
                            );
                          })()
                        : it.icon}
                    </div>
                    <div style={{ fontWeight: 900 }}>{it.label}</div>
                  </div>
                  <span style={{ opacity: 0.9, fontSize: 12 }}>바로가기 ›</span>
                </Link>
              ))}
            </div>
          </Section>
        </div>

        {/* ================= 공지/정보공개(리스트) ================= */}
        <Section style={{ paddingTop: 52 }}>
          {/* 상단 타이틀 (공지사항) */}
          <div
            style={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              alignItems: isMobile ? "flex-start" : "center",
              justifyContent: isMobile ? "flex-start" : "space-between",
              gap: isMobile ? 8 : 12,
              marginBottom: isMobile ? 16 : 20,
            }}
          >
            <h2
              style={{
                margin: 0,
                fontSize: 28,
                fontWeight: 900,
                display: "flex",
                alignItems: "center",
                gap: 10,
                textAlign: isMobile ? "center" : "left",
              }}
            >
              <span
                aria-hidden
                style={{
                  width: 8,
                  height: 24,
                  background: PALETTE.orange,
                  borderRadius: 3,
                  display: "inline-block",
                }}
              />
              공지사항
            </h2>
          </div>

          {/* 두 칼럼 그리드 (공지/정보공개) */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isTablet
                ? "1fr"
                : "repeat(2, minmax(0,1fr))",
              gap: isTablet ? 18 : 28,
            }}
          >
            {/* 공지 (공지사항 리스트) */}
            <div>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 8,
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: isMobile ? 10 : 12,
                  textAlign: "left",
                }}
              >
                <h2 style={{ margin: 0, fontSize: 22, fontWeight: 900 }}>
                  공지
                </h2>
                <MorePill href="/news/notices?category=공지">더보기</MorePill>
              </div>
              <div style={{ display: "grid", gap: 22 }}>
                {(loadingNotices
                  ? Array.from({ length: 4 })
                  : (noticesSplit.공지 || []).slice(0, 5)
                ).map((item, i) =>
                  loadingNotices ? (
                    <div
                      key={i}
                      aria-hidden
                      style={{
                        background: "#fff",
                        border: `1px solid ${PALETTE.line}`,
                        borderRadius: 14,
                        padding: isMobile ? "14px 16px" : "18px 20px",
                        boxShadow: PALETTE.shadowSm,
                      }}
                    >
                      <div
                        style={{
                          height: 18,
                          width: "70%",
                          background: "#EEF2F7",
                          borderRadius: 6,
                          marginBottom: 10,
                        }}
                      />
                      <div
                        style={{
                          height: 12,
                          width: 120,
                          background: "#EEF2F7",
                          borderRadius: 6,
                        }}
                      />
                    </div>
                  ) : (
                    <a
                      key={item.id}
                      href={item.to}
                      data-reset-touch="true"
                      style={{
                        display: "block",
                        background: "#fff",
                        border: `1px solid ${PALETTE.line}`,
                        borderRadius: 14,
                        padding: isMobile ? "14px 16px" : "18px 20px",
                        boxShadow: PALETTE.shadowSm,
                        textDecoration: "none",
                        color: "inherit",
                        transition:
                          isMobile || isTouch
                            ? "none"
                            : "transform .12s ease, box-shadow .12s ease, border-color .12s ease",
                      }}
                      onTouchEnd={(e) => {
                        // 모바일에서 뒤로가기 시 active 스타일 잔상 제거
                        e.currentTarget.style.transform = "none";
                        e.currentTarget.style.boxShadow = PALETTE.shadowSm;
                        e.currentTarget.style.borderColor = PALETTE.line;
                      }}
                      onFocus={(e) => {
                        if (isMobile || isTouch) {
                          e.currentTarget.style.transform = "none";
                          e.currentTarget.style.boxShadow = PALETTE.shadowSm;
                          e.currentTarget.style.borderColor = PALETTE.line;
                        }
                      }}
                      onBlur={(e) => {
                        if (isMobile || isTouch) {
                          e.currentTarget.style.transform = "none";
                          e.currentTarget.style.boxShadow = PALETTE.shadowSm;
                          e.currentTarget.style.borderColor = PALETTE.line;
                        }
                      }}
                      onMouseEnter={
                        !(isMobile || isTouch)
                          ? (e) => {
                              e.currentTarget.style.transform =
                                "translateY(-2px)";
                              e.currentTarget.style.boxShadow = `0 10px 22px rgba(0,0,0,.08), 0 0 0 3px ${PALETTE.orange}22`;
                              e.currentTarget.style.borderColor =
                                PALETTE.orange;
                            }
                          : undefined
                      }
                      onMouseLeave={
                        !(isMobile || isTouch)
                          ? (e) => {
                              e.currentTarget.style.transform = "none";
                              e.currentTarget.style.boxShadow =
                                PALETTE.shadowSm;
                              e.currentTarget.style.borderColor = PALETTE.line;
                            }
                          : undefined
                      }
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: 12,
                          marginBottom: 6,
                        }}
                      >
                        <div
                          style={{
                            fontWeight: 800,
                            fontSize: 18,
                            lineHeight: 1.35,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {item.title}
                        </div>
                        <span aria-hidden style={{ color: PALETTE.grayText }}>
                          ›
                        </span>
                      </div>
                      {item.date && (
                        <time style={{ color: PALETTE.grayText, fontSize: 12 }}>
                          {item.date}
                        </time>
                      )}
                    </a>
                  )
                )}
                {!loadingNotices && (noticesSplit.공지 || []).length === 0 && (
                  <div style={{ color: PALETTE.grayText, fontSize: 14 }}>
                    표시할 공지가 없습니다.
                  </div>
                )}
              </div>
            </div>

            {/* 정보공개 (정보공개 리스트) */}
            <div>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 8,
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: isMobile ? 10 : 12,
                  textAlign: "left",
                }}
              >
                <h2 style={{ margin: 0, fontSize: 22, fontWeight: 900 }}>
                  정보공개
                </h2>
                <MorePill href="/news/notices?category=정보공개">
                  더보기
                </MorePill>
              </div>
              <div style={{ display: "grid", gap: 22 }}>
                {(loadingNotices
                  ? Array.from({ length: 4 })
                  : (noticesSplit.정보공개 || []).slice(0, 5)
                ).map((item, i) =>
                  loadingNotices ? (
                    <div
                      key={i}
                      aria-hidden
                      style={{
                        background: "#fff",
                        border: `1px solid ${PALETTE.line}`,
                        borderRadius: 14,
                        padding: "18px 20px",
                        boxShadow: PALETTE.shadowSm,
                      }}
                    >
                      <div
                        style={{
                          height: 18,
                          width: "70%",
                          background: "#EEF2F7",
                          borderRadius: 6,
                          marginBottom: 10,
                        }}
                      />
                      <div
                        style={{
                          height: 12,
                          width: 120,
                          background: "#EEF2F7",
                          borderRadius: 6,
                        }}
                      />
                    </div>
                  ) : (
                    <a
                      key={item.id}
                      href={item.to}
                      data-reset-touch="true"
                      style={{
                        display: "block",
                        background: "#fff",
                        border: `1px solid ${PALETTE.line}`,
                        borderRadius: 14,
                        padding: "18px 20px",
                        boxShadow: PALETTE.shadowSm,
                        textDecoration: "none",
                        color: "inherit",
                        transition:
                          isMobile || isTouch
                            ? "none"
                            : "transform .12s ease, box-shadow .12s ease, border-color .12s ease",
                      }}
                      onTouchEnd={(e) => {
                        // 모바일에서 뒤로가기 시 active 스타일 잔상 제거
                        e.currentTarget.style.transform = "none";
                        e.currentTarget.style.boxShadow = PALETTE.shadowSm;
                        e.currentTarget.style.borderColor = PALETTE.line;
                      }}
                      onFocus={(e) => {
                        if (isMobile || isTouch) {
                          e.currentTarget.style.transform = "none";
                          e.currentTarget.style.boxShadow = PALETTE.shadowSm;
                          e.currentTarget.style.borderColor = PALETTE.line;
                        }
                      }}
                      onBlur={(e) => {
                        if (isMobile || isTouch) {
                          e.currentTarget.style.transform = "none";
                          e.currentTarget.style.boxShadow = PALETTE.shadowSm;
                          e.currentTarget.style.borderColor = PALETTE.line;
                        }
                      }}
                      onMouseEnter={
                        !(isMobile || isTouch)
                          ? (e) => {
                              e.currentTarget.style.transform =
                                "translateY(-2px)";
                              e.currentTarget.style.boxShadow = `0 10px 22px rgba(0,0,0,.08), 0 0 0 3px ${PALETTE.orange}22`;
                              e.currentTarget.style.borderColor =
                                PALETTE.orange;
                            }
                          : undefined
                      }
                      onMouseLeave={
                        !(isMobile || isTouch)
                          ? (e) => {
                              e.currentTarget.style.transform = "none";
                              e.currentTarget.style.boxShadow =
                                PALETTE.shadowSm;
                              e.currentTarget.style.borderColor = PALETTE.line;
                            }
                          : undefined
                      }
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: 12,
                          marginBottom: 6,
                        }}
                      >
                        <div
                          style={{
                            fontWeight: 800,
                            fontSize: 18,
                            lineHeight: 1.35,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {item.title}
                        </div>
                        <span aria-hidden style={{ color: PALETTE.grayText }}>
                          ›
                        </span>
                      </div>
                      {item.date && (
                        <time style={{ color: PALETTE.grayText, fontSize: 12 }}>
                          {item.date}
                        </time>
                      )}
                    </a>
                  )
                )}
                {!loadingNotices &&
                  (noticesSplit.정보공개 || []).length === 0 && (
                    <div style={{ color: PALETTE.grayText, fontSize: 14 }}>
                      표시할 정보공개가 없습니다.
                    </div>
                  )}
              </div>
            </div>
          </div>
        </Section>
        {/* 바닥 간격 */}
        <div style={{ height: 36 }} />
      </main>
    </>
  );
}
