// src/pages/Home.jsx
import { useEffect, useMemo, useState, useRef } from "react";
// Viewport & input utilities
function useViewport() {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1280);
  useEffect(() => {
    const onR = () => setW(window.innerWidth);
    window.addEventListener("resize", onR);
    return () => window.removeEventListener("resize", onR);
  }, []);
  return { width: w, isMobile: w < 640, isTablet: w >= 640 && w < 1024 };
}

function useHoverCapable() {
  const [hoverCapable, setHoverCapable] = useState(true);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(hover: hover)");
    setHoverCapable(mq.matches);
    const onChange = (e) => setHoverCapable(e.matches);
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);
  return hoverCapable;
}

function useFocusVisible() {
  const [focusVisible, setFocusVisible] = useState(false);
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Tab") setFocusVisible(true); };
    const onMouse = () => setFocusVisible(false);
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onMouse);
    window.addEventListener("touchstart", onMouse);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onMouse);
      window.removeEventListener("touchstart", onMouse);
    };
  }, []);
  return focusVisible;
}
import { Link, useNavigate } from "react-router-dom";
function ClickCard({ to, children, style, ...rest }) {
  const navigate = useNavigate();
  return (
    <div
      role="link"
      tabIndex={0}
      onClick={() => navigate(to)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          navigate(to);
        }
      }}
      style={{ cursor: "pointer", textDecoration: "none", color: "inherit", ...style }}
      {...rest}
    >
      {children}
    </div>
  );
}
import matter from "gray-matter";

// Brand palette (requested)
const COLOR = {
  primary: "#3BA7A0",     // Teal
  secondary: "#ED6A32",   // Orange
  accent: "#F4B731",      // Yellow (used for highlights)
  text: "#000000",        // Black text per brand
  textMuted: "#6B7280",   // Muted text (kept neutral for readability)
  line: "#E5E7EB",
  bg: "#F5F7FA",
  // Soft tints derived for hovers/backgrounds
  primaryTint: "#E8F7F6",   // Teal tint
  secondaryTint: "#FDE9E1", // Orange tint
  accentTint: "#FFF6D5",    // Yellow tint
  neutralTint: "#F9FAFB",
  yellowTint: "#FFF6D5",
};

// 디자인 토큰 (간격/라운드/그리드)
const TOKENS = { 
  radius: 12,
  radiusLg: 18,
  gap: 28,
  gapSm: 14,
  container: 1280,
  shadow: "0 8px 22px rgba(15,23,42,.08)",
  shadowSm: "0 6px 18px rgba(15,23,42,.06)",
  shadowHover: "0 12px 26px rgba(15,23,42,.12)",
};

// ---- Home1 helpers moved here ----
const PALETTE = {
  orange: "#ED6A32",
  yellow: "#F4B731",
  teal: "#3BA7A0",
  grayBg: "#F5F7FA",
  mintPeachBg: "linear-gradient(180deg, #E8F4F2 0%, #FCE9E2 100%)",
  grayText: "#64748B",
  darkText: "#111827",
  line: "rgba(17,24,39,.10)",
};

function Section({ children, style, fullBleed = false, innerMaxWidth = TOKENS.container }) {
  if (fullBleed) {
    return (
      <section style={{ width: "100vw", margin: "0 calc(50% - 50vw)", padding: "40px 0", ...style }}>
        <div style={{ maxWidth: innerMaxWidth, margin: "0 auto", padding: "0 24px" }}>{children}</div>
      </section>
    );
  }
  return (
    <section style={{ maxWidth: TOKENS.container, width: "100%", margin: "0 auto", padding: "40px 24px", ...style }}>
      {children}
    </section>
  );
}

function normalizeNoticeCategory(v) {
  const s = (v ?? "").toString().trim();
  if (!s) return "공지";
  const compact = s.replace(/[\s-]/g, "");
  if (compact === "공모") return "정보공개";
  if (compact.includes("정보") && compact.includes("공개")) return "정보공개";
  if (s.startsWith("공지")) return "공지";
  return s;
}

// Hero carousel assets
const HERO_IMAGES = ["/images/hero/dog.png", "/images/hero/light.png"];
const HERO_INTERVAL = 10000; // ms

// 반응형 그리드 열 수 (모바일 1, 태블릿 2, 데스크톱 4)
function useCols() {
  const [cols, setCols] = useState(4);
  useEffect(() => {
    const update = () => {
      const w = typeof window !== "undefined" ? window.innerWidth : 1280;
      setCols(w < 640 ? 1 : w < 1024 ? 2 : 4);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return cols;
}

// 유틸: 파일명 → { date: 'YYYY-MM-DD', slug: '...' }
function parseDatedSlug(filepath) {
  // 예: /src/content/notices/2025-09-11-공지제목.md
  const name = filepath.split("/").pop() || "";
  const m = name.match(/^(\d{4}-\d{2}-\d{2})-(.+)\.(md|mdx)$/);
  if (!m) {
    return { date: null, slug: name.replace(/\.(md|mdx)$/i, ""), titleFromFile: name.replace(/\.(md|mdx)$/i, "") };
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

// 유틸: 프론트매터 or 파일명으로 제목 얻기
function getTitle(mod, fallback) {
  // 일부 md 로더는 `mod.attributes` 또는 `mod.frontmatter`에 제목이 실림
  const fm = mod?.attributes || mod?.frontmatter || {};
  return fm.title || fallback || "제목 없음";
}

// 유틸: 날짜를 화면에 안전하게 표시 (Date/Object → YYYY-MM-DD string)
function formatDate(v) {
  if (!v) return "";
  try {
    if (typeof v === "string") {
      // 이미 YYYY-MM-DD 또는 ISO라면 앞 10글자만
      return v.slice(0, 10);
    }
    // gray-matter가 Date 객체로 파싱하는 경우
    if (v instanceof Date && !isNaN(v)) {
      return v.toISOString().slice(0, 10);
    }
    // YAML 파서가 객체로 줄 수 있는 경우 (예: { year: 2025, month: 9, day: 12 })
    if (typeof v === "object") {
      const d = new Date(v);
      if (!isNaN(d)) return d.toISOString().slice(0, 10);
    }
  } catch {}
  return "";
}

export default function Home() {
  const [noticeTab, setNoticeTab] = useState("공지");
  const [notices, setNotices] = useState([]);
  const [stories, setStories] = useState([]);
  // 스토리 탭 필터: 전체, 행사, 활동, 기타
  const [storiesTab, setStoriesTab] = useState("전체");

  // (삭제됨) CTA hover states
  // 카드 hover 상태
  const [hoveredNotice, setHoveredNotice] = useState(null);
  const [hoveredStory, setHoveredStory] = useState(null);

  const NOTICE_CARD_MIN_H = 200; // 공지/공모 카드 공통 높이
  const NOTICE_THUMB_H = 120;    // 공모 썸네일 고정 높이

  const { width, isMobile, isTablet } = useViewport();
  // 히어로 배경 크기(오른쪽 데코를 축소)
  const hoverCapable = useHoverCapable();
  const focusVisible = useFocusVisible();
  const sectionGap = isMobile ? 32 : 48;
  const revealDuration = isMobile ? 0.28 : 0.4;

  const [loadingNotices, setLoadingNotices] = useState(true);
  const [loadingStories, setLoadingStories] = useState(true);

  // --- HERO carousel state (moved from Home1) ---
  const [heroIndex, setHeroIndex] = useState(0);
  const timerRef = useRef(null);
  const restartTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
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

  useEffect(() => {
    restartTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  useEffect(() => {
    HERO_IMAGES.forEach((src) => { const img = new Image(); img.src = src; });
  }, []);

  // 공지: 실제 파일 로드 (Decap CMS가 커밋한 md 기준)
  useEffect(() => {
    try {
      setLoadingNotices(true);
      const modules = import.meta.glob("/src/content/notices/*.{md,mdx}", {
        eager: true,
        query: "?raw",
        import: "default",
      });

      const items = Object.entries(modules).map(([path, raw]) => {
        const { data, content } = matter(raw);
        const category = (data?.category || "공지").trim();
        const thumbnail = data?.thumbnail || null;
        const meta = parseDatedSlug(path);
        const excerptSource = data?.description || content || "";
        const excerpt = excerptSource.replace(/\n/g, " ").slice(0, 200);
        // IMPORTANT: build the link from the *raw filename* so it matches the detail route exactly
        const base = (path.split("/").pop() || "").replace(/\.(md|mdx)$/i, "");
        const href = `/news/notices/${encodeURIComponent(base)}`;
        return {
          id: path,
          title: data?.title || meta.titleFromFile,
          date: formatDate(data?.date) || formatDate(meta.date) || "",
          to: href,
          excerpt,
          category,
          thumbnail,
        };
      });

      // 최신순(날짜 내림차순), 날짜가 같으면 파일명(역순)로 안정적으로 정렬
      items.sort((a, b) => {
        const ad = a.date ? new Date(a.date) : new Date(0);
        const bd = b.date ? new Date(b.date) : new Date(0);
        if (!isNaN(bd) && !isNaN(ad) && bd.getTime() !== ad.getTime()) {
          return bd.getTime() - ad.getTime(); // 최신이 앞으로
        }
        return (b.id || "").localeCompare(a.id || "");
      });
      setNotices(items);
      setLoadingNotices(false);
    } catch (e) {
      console.warn("공지 로드 실패:", e);
      setNotices([]);
      setLoadingNotices(false);
    }
  }, []);

  // 스토리: 실제 파일 로드
  useEffect(() => {
    try {
      setLoadingStories(true);
      const modules = import.meta.glob("/src/content/stories/*.{md,mdx}", {
        eager: true,
        query: "?raw",
        import: "default",
      });

      const items = Object.entries(modules).map(([path, raw]) => {
        const { data } = matter(raw);
        const category = (data?.category || "전체").trim();
        const meta = parseDatedSlug(path);
        const base = (path.split("/").pop() || "").replace(/\.(md|mdx)$/i, "");
        const to = base ? `/news/stories/${encodeURIComponent(base)}` : "/news/stories";
        return {
          id: path,
          title: data?.title || meta.titleFromFile,
          date: formatDate(data?.date) || formatDate(meta.date) || "",
          to,
          thumbnail: data?.thumbnail || null,
          category,
        };
      });

      // 최신순(날짜 내림차순), 날짜가 같으면 파일명(역순)로 안정적으로 정렬
      items.sort((a, b) => {
        const ad = a.date ? new Date(a.date) : new Date(0);
        const bd = b.date ? new Date(b.date) : new Date(0);
        if (!isNaN(bd) && !isNaN(ad) && bd.getTime() !== ad.getTime()) {
          return bd.getTime() - ad.getTime(); // 최신이 앞으로
        }
        return (b.id || "").localeCompare(a.id || "");
      });
      setStories(items);
      setLoadingStories(false);
    } catch (e) {
      console.warn("스토리 로드 실패:", e);
      setStories([]);
      setLoadingStories(false);
    }
  }, []);

  // 스토리 필터링 (전체, 행사, 활동, 기타)
  const storiesTabs = ["전체", "행사", "활동", "기타"];
  const filteredStories = useMemo(() => {
    if (storiesTab === "전체") return stories;
    if (storiesTab === "기타") {
      // 기타: 행사/활동 외의 카테고리
      return stories.filter(
        (s) => s.category !== "행사" && s.category !== "활동"
      );
    }
    return stories.filter((s) => s.category === storiesTab);
  }, [stories, storiesTab]);

  // 탭 정의 (공지 외 탭은 우선 공지와 동일 목록/또는 비워 두기)
  const tabs = ["공지", "공모"];
  const tabItems = useMemo(() => {
    const notice = notices.filter((n) => (n.category || "공지") !== "공모");
    const contest = notices.filter((n) => (n.category || "공지") === "공모");
    return { 공지: notice, 공모: contest };
  }, [notices]);

  // Two-column lists for notice types (Home1 style)
  const noticesSplit = useMemo(() => {
    const notice = notices.filter((n) => normalizeNoticeCategory(n.category) === "공지");
    const info = notices.filter((n) => normalizeNoticeCategory(n.category) === "정보공개");
    return { 공지: notice, 정보공개: info };
  }, [notices]);

  // 반응형 그리드 열 수
  const noticeCols = useCols();
  const storyCols = useCols();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) return;

    const els = document.querySelectorAll("[data-reveal]");
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          el.style.opacity = "1";
          el.style.transform = "none";
          io.unobserve(el);
        }
      });
    }, { threshold: 0.12 });

    els.forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(8px)";
      el.style.transition = `opacity ${revealDuration}s ease, transform ${revealDuration}s ease`;
      io.observe(el);
    });

    return () => io.disconnect();
  }, [revealDuration]);

  return (
    <main role="main">

      {/* 1) HERO – 이미지 캐러셀 + 우측 텍스트 (Home1 스타일) */}
      <Section fullBleed innerMaxWidth={1500} style={{ paddingTop: 80, paddingBottom: 96, background: "linear-gradient(180deg, #FBF6ED 0%, #FFFFFF 70%)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 36, alignItems: "center" }}>
          {/* 좌측: 캐러셀 */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "stretch" }}>
            <div style={{ position: "relative", height: 360, borderRadius: TOKENS.radiusLg, border: `1px solid ${PALETTE.line}`, overflow: "hidden", boxShadow: "0 10px 24px rgba(0,0,0,.10)", background: "#fff" }}>
              {HERO_IMAGES.map((src, i) => (
                <img key={src} src={src} alt="복지디자인 활동 이미지" loading={i === heroIndex ? "eager" : "lazy"} decoding="async" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: heroIndex === i ? 1 : 0, transition: "opacity 700ms ease-in-out", pointerEvents: "none" }} />
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginTop: 10 }}>
              <button type="button" aria-label="이전 이미지" onClick={prevHero} style={{ width: 36, height: 36, borderRadius: "50%", border: `1px solid ${PALETTE.line}`, background: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,.08)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 16, cursor: "pointer", color: PALETTE.darkText }}>‹</button>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {HERO_IMAGES.map((_, i) => (
                  <button key={i} type="button" aria-label={`이미지 ${i + 1} 보기`} onClick={() => goTo(i)} style={{ width: 12, height: 12, borderRadius: 999, border: "1px solid rgba(0,0,0,.15)", background: i === heroIndex ? PALETTE.teal : "#fff", boxShadow: "0 1px 2px rgba(0,0,0,.12)", cursor: "pointer", transform: i === heroIndex ? "scale(1.1)" : "none", transition: "transform .2s ease, background .2s ease" }} />
                ))}
              </div>
              <button type="button" aria-label="다음 이미지" onClick={nextHero} style={{ width: 36, height: 36, borderRadius: "50%", border: `1px solid ${PALETTE.line}`, background: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,.08)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 16, cursor: "pointer", color: PALETTE.darkText }}>›</button>
            </div>
          </div>

          {/* 우측: 텍스트 */}
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 10px", borderRadius: 999, border: `1px solid ${PALETTE.line}`, background: "#fff", boxShadow: TOKENS.shadowSm, marginBottom: 10 }}>
              <span aria-hidden style={{ width: 8, height: 8, borderRadius: "50%", background: COLOR.secondary }} />
              <span style={{ fontWeight: 800, fontSize: 12, letterSpacing: 0.4, color: "#111827" }}>WELFARE&nbsp;DESIGN</span>
            </div>
            <h1 style={{ fontSize: 32, lineHeight: 1.35, margin: 0, letterSpacing: -0.2 }}>
              현장과 지역을 잇는 <span style={{ boxDecorationBreak: "clone", WebkitBoxDecorationBreak: "clone", backgroundImage: "linear-gradient(transparent 70%, rgba(59,167,160,.28) 0)" }}>맞춤형 복지</span>를 설계하며<br />
              <span style={{ boxDecorationBreak: "clone", WebkitBoxDecorationBreak: "clone", backgroundImage: "linear-gradient(transparent 70%, rgba(237,106,50,.22) 0)" }}>복지디자인 사회적협동조합</span>이<br />지역과 함께합니다.
            </h1>
            <p style={{ color: PALETTE.grayText, marginTop: 10 }}>주민·기관·전문가가 협력하는 맞춤형 복지 플랫폼을 설계·운영합니다.</p>
          </div>
        </div>
      </Section>

      {/* 2) 빠르게 가기 */}
      <Section style={{ padding: "24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "minmax(220px, 1fr) 2fr", gap: 18, alignItems: "center" }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 20, fontWeight: 900, letterSpacing: -0.2, color: "#111827" }}>빠르게 가기</h3>
            <p style={{ margin: "6px 0 0", color: PALETTE.grayText, lineHeight: 1.5 }}>자주 찾는 메뉴를 한 번에 <br />소개·사업·후원·가입 페이지로 바로 이동하세요.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: 14 }}>
            {[{href:"/about/what",iconsrc:"/images/icons/introduction.png",label:"복지디자인 소개",desc:"설립·비전·연혁"},{href:"/business/overview",iconsrc:"/images/icons/needs-survey.png",label:"사업 안내",desc:"운영사업 한눈에"},{href:"/support/guide",iconsrc:"/images/icons/donation.png",label:"후원 안내",desc:"지지와 참여 방법"},{href:"/support/combination",iconsrc:"/images/icons/member-services.png",label:"조합 가입",desc:"함께하는 동료되기"}].map((it,i)=> (
              <Link key={i} to={it.href} style={{ display:"flex", alignItems:"center", gap:12, padding:14, borderRadius:16, background:"#fff", border: `1px solid ${PALETTE.line}`, boxShadow:"0 3px 10px rgba(0,0,0,.06)", textDecoration:"none", color:"inherit", transition:"transform .12s ease, box-shadow .12s ease" }}
                onMouseEnter={(e)=>{ e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.boxShadow='0 8px 18px rgba(0,0,0,.10)'; }}
                onMouseLeave={(e)=>{ e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='0 3px 10px rgba(0,0,0,.06)'; }}>
                <div aria-hidden style={{ width:36, height:36, borderRadius:12, background:`linear-gradient(180deg,#FFFFFF 0%, ${PALETTE.grayBg} 100%)`, border: `1px solid ${PALETTE.line}`, boxShadow:"0 2px 6px rgba(0,0,0,.06)", display:"inline-flex", alignItems:"center", justifyContent:"center", flex:"0 0 auto" }}>
                  <img src={it.iconsrc} alt="" loading="lazy" decoding="async" style={{ width:22, height:22, objectFit:"contain" }} />
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontWeight:900, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{it.label}</div>
                  <div style={{ fontSize:12, color:PALETTE.grayText, marginTop:4 }}>{it.desc}</div>
                </div>
                <span aria-hidden style={{ color: PALETTE.teal, fontWeight: 800 }}>›</span>
              </Link>
            ))}
          </div>
        </div>
      </Section>

      {/* 3) 복지디자인 소식 – 파란 패널 + 탭 풍의 보조 내비 + 필터 */}
      <section
        aria-labelledby="stories-heading"
        style={{
          background: "#fff",
          marginBottom: sectionGap,
        }}
      >
        <div
          style={{
            maxWidth: TOKENS.container,
            margin: "0 auto",
            padding: "20px 24px 32px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
              flexWrap: "wrap",
              gap: 12,
            }}
          >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 6,
              flex: 1,
              minWidth: 0,
            }}
          >
              <h2
                id="stories-heading"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  fontSize: 26,
                  fontWeight: 800,
                  margin: 0,
                  color: COLOR.primary,
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 24,
                    background: COLOR.primary,
                    borderRadius: 3,
                  }}
                />
                복지디자인 소식
              </h2>
              <small style={{ color: COLOR.textMuted, fontSize: 14, marginLeft: 6 }}>
                행복한 소식을 만들어가는 복지디자인입니다.
              </small>
            </div>
            {/* 소식 카테고리 필터 */}
            <div style={{ display: "flex", gap: 8, alignItems: "center" }} role="tablist" aria-label="소식 분류">
              {storiesTabs.map((tab) => (
                <button
                  key={tab}
                  id={`stories-tab-${tab}`}
                  role="tab"
                  aria-selected={storiesTab === tab}
                  aria-controls={`stories-panel`}
                  onClick={() => setStoriesTab(tab)}
                  style={{
                    padding: "6px 16px",
                    borderRadius: 999,
                    border:
                      storiesTab === tab
                        ? `2px solid ${COLOR.primary}`
                        : `1px solid ${COLOR.line}`,
                    background: storiesTab === tab ? COLOR.primaryTint : "#fff",
                    color: storiesTab === tab ? COLOR.primary : COLOR.text,
                    cursor: "pointer",
                    fontWeight: storiesTab === tab ? 600 : 400,
                    fontSize: 14,
                    transition: "all 0.2s",
                    outline: "none",
                  }}
                >
                  {tab}
                </button>
              ))}
              <Link
                to="/news/stories"
                style={{
                  fontSize: 14,
                  color: COLOR.primary,
                  marginLeft: 8,
                  textDecoration: "none",
                  fontWeight: 600,
                  alignSelf: "center",
                }}
              >
                전체보기
              </Link>
            </div>
          </div>

          {loadingStories ? (
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${storyCols}, minmax(0, 1fr))`, gap: 22 }}>
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} aria-hidden style={{ borderRadius: TOKENS.radius, background: "#fff", boxShadow: TOKENS.shadowSm, border: "1px solid #EAEAEA", minHeight: 230, overflow: "hidden" }}>
                  <div style={{ height: 150, background: COLOR.neutralTint, borderBottom: `1px solid ${COLOR.line}` }} />
                  <div style={{ padding: 16 }}>
                    <div style={{ height: 16, width: "70%", background: COLOR.neutralTint, borderRadius: 6, marginBottom: 10 }} />
                    <div style={{ height: 12, width: "40%", background: COLOR.neutralTint, borderRadius: 6 }} />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredStories.length > 0 ? (
            <div
              role="tabpanel"
              id="stories-panel"
              aria-labelledby={`stories-tab-${storiesTab}`}
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${storyCols}, minmax(0, 1fr))`,
                gap: 22,
              }}
            >
              {filteredStories.slice(0, 4).map((item) => (
                <ClickCard
                  key={item.id}
                  to={item.to}
                  data-reveal
                  style={{
                    borderRadius: TOKENS.radius,
                    background: "#fff",
                    boxShadow:
                      hoveredStory === item.id
                        ? TOKENS.shadowHover
                        : TOKENS.shadowSm,
                    transform:
                      hoveredStory === item.id
                        ? "translateY(-4px)"
                        : "translateY(0)",
                    transition: "all .18s ease",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    minHeight: 230,
                    textDecoration: "none",
                    color: "inherit",
                    border: "1px solid #EAEAEA",
                    outline:
                      hoveredStory === item.id
                        ? `2px solid ${COLOR.primary}`
                        : "none",
                  }}
                  tabIndex={0}
                  onFocus={(e) => {
                    if (!focusVisible) return;
                    e.currentTarget.style.outline = `2px solid ${COLOR.primary}`;
                    e.currentTarget.style.outlineOffset = "2px";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.outline = hoveredStory === item.id ? `2px solid ${COLOR.primary}` : "none";
                    e.currentTarget.style.outlineOffset = hoveredStory === item.id ? "2px" : "0";
                  }}
                  onMouseEnter={() => { if (!hoverCapable) return; setHoveredStory(item.id); }}
                  onMouseLeave={() => { if (!hoverCapable) return; setHoveredStory(null); }}
                >
                  {/* 썸네일 */}
                  <div
                    style={{
                      height: 150,
                      overflow: "hidden",
                      backgroundColor: COLOR.neutralTint,
                      borderBottom: "none",
                      position: "relative",
                    }}
                  >
                    {item.thumbnail ? (
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        loading="lazy"
                        decoding="async"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          color: "#a3a3a3",
                          fontSize: 48,
                          userSelect: "none",
                        }}
                      >
                        <span aria-hidden="true">📰</span>
                      </div>
                    )}
                    <span
                      style={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        padding: "2px 8px",
                        fontSize: 12,
                        borderRadius: 999,
                        background: COLOR.primaryTint,
                        border: `1px solid ${COLOR.primary}22`,
                        color: COLOR.primary,
                        boxShadow: TOKENS.shadowSm,
                      }}
                    >
                      {item.category}
                    </span>
                  </div>
                  <div
                    style={{
                      padding: 16,
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <h3
                      style={{
                        fontSize: 17.5,
                        fontWeight: 700,
                        margin: 0,
                        marginBottom: 8,
                        lineHeight: 1.35,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {item.title}
                    </h3>
                    {item.date && typeof item.date === "string" ? (
                      <time style={{ fontSize: 13, color: COLOR.textMuted }}>
                        {item.date}
                      </time>
                    ) : null}
                  </div>
                </ClickCard>
              ))}
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${storyCols}, minmax(0, 1fr))`,
                gap: 22,
              }}
            >
              {/* 소식 카드 4개 자리 – 데이터 없을 땐 플레이스홀더 링크 */}
              {[0, 1, 2, 3].map((i) => (
                <ClickCard
                  key={i}
                  to="/news/stories"
                  style={{
                    borderRadius: TOKENS.radius,
                    background: "#fff",
                    padding: 24,
                    textDecoration: "none",
                    color: "inherit",
                    boxShadow: TOKENS.shadowSm,
                    display: "flex",
                    flexDirection: "column",
                    minHeight: 230,
                  }}
                >
                  <div
                    style={{
                      height: 150,
                      backgroundColor: COLOR.neutralTint,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      fontSize: 48,
                      color: "#a3a3a3",
                      userSelect: "none",
                      borderBottom: `1px solid ${COLOR.line}`,
                    }}
                  >
                    <span aria-hidden="true">📰</span>
                  </div>
                  <strong
                    style={{
                      display: "block",
                      fontSize: 18,
                      marginTop: 16,
                      marginBottom: 8,
                      color: COLOR.primary,
                    }}
                  >
                    복지디자인 이야기
                  </strong>
                  <span style={{ fontSize: 14, color: COLOR.textMuted }}>
                    우리 활동과 소식을 만나보세요.
                  </span>
                </ClickCard>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4) 지원 사업 */}
      <Section id="support" style={{ padding: "16px 20px" }}>
        <h2 style={{ margin: "0 0 6px 0", fontSize: 22, fontWeight: 900 }}>지원 사업</h2>
        <p style={{ margin: "0 0 16px 0", color: PALETTE.grayText, fontSize: 14 }}>복지디자인이 수행하는 주요 지원사업을 한눈에 살펴보세요.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 16 }}>
          {[
            { icon: "/images/icons/rental.png", label: "휠체어 및 복지용구 무료 대여", href: "/business/rental" },
            { icon: "/images/icons/apply-help.png", label: "보조기기·복지용구 신청 안내 지원", href: "/business/apply-help" },
            { icon: "/images/icons/donation.png", label: "보조기기 기증 캠페인", href: "/business/donation" },
            { icon: "/images/icons/ewc-insurance.png", label: "취약 계층 전동 휠체어 보험금 지원", href: "/business/ewc-insurance" },
            { icon: "/images/icons/needs-survey.png", label: "취약 계층 복지욕구 실태조사", href: "/business/needs-survey" },
            { icon: "/images/icons/member-services.png", label: "조합원 지원 서비스", href: "/business/member-services" },
          ].map((it, i) => (
            <Link key={i} to={it.href} style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", background: "#fff", border: `1px solid ${PALETTE.line}`, color: "#111827", borderRadius: TOKENS.radiusLg, padding: 20, boxShadow: "0 12px 28px rgba(59,167,160,.10), 0 6px 14px rgba(237,106,50,.06)", textDecoration: "none", transition: "transform .18s ease, box-shadow .18s ease" }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 18px 36px rgba(59,167,160,.16), 0 10px 22px rgba(237,106,50,.10)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 12px 28px rgba(59,167,160,.10), 0 6px 14px rgba(237,106,50,.06)"; }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div aria-hidden style={{ width: 44, height: 44, borderRadius: 14, background: `linear-gradient(180deg, #FFFFFF 0%, rgba(255,255,255,.85) 100%)`, border: `1px solid ${PALETTE.line}`, boxShadow: "inset 0 1px 0 rgba(255,255,255,.6), 0 6px 14px rgba(0,0,0,.06)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <img src={it.icon.replace(/\.(png|svg)$/i, ".svg")} onError={(e)=>{ e.currentTarget.onerror=null; e.currentTarget.src=it.icon; }} alt="" loading="lazy" decoding="async" style={{ width: 24, height: 24, objectFit: "contain" }} />
                </div>
                <div style={{ fontWeight: 900 }}>{it.label}</div>
              </div>
              <span style={{ opacity: 0.9, fontSize: 12 }}>바로가기 ›</span>
            </Link>
          ))}
        </div>
      </Section>

      {/* 5) 공지/정보공개 – 두 칼럼 리스트 (Home1 스타일) */}
      <Section style={{ paddingTop: 38 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: "space-between", marginBottom: 20 }}>
          <h2 style={{ margin: 0, fontSize: 28, fontWeight: 900, display: "flex", alignItems: "center", gap: 10 }}>
            <span aria-hidden style={{ width: 8, height: 24, background: PALETTE.orange, borderRadius: 3, display: "inline-block" }} />
            공지사항
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0,1fr))", gap: 24 }}>
          {/* 공지 */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
              <h2 style={{ margin: 0, fontSize: 22, fontWeight: 900 }}>공지</h2>
              <Link to="/news/notices" style={{ color: PALETTE.teal, fontWeight: 800, textDecoration: "none", border: `1px solid ${PALETTE.teal}33`, borderRadius: 999, padding: "6px 10px", background: "#fff" }}>더보기 ›</Link>
            </div>
            <div style={{ display: "grid", gap: 18 }}>
              {(loadingNotices ? Array.from({ length: 4 }) : (noticesSplit.공지 || []).slice(0, 5)).map((item, i) => (
                loadingNotices ? (
                  <div key={i} aria-hidden style={{ background: "#fff", border: `1px solid ${PALETTE.line}`, borderRadius: 14, padding: "16px 18px", boxShadow: TOKENS.shadowSm }}>
                    <div style={{ height: 18, width: "70%", background: "#EEF2F7", borderRadius: 6, marginBottom: 10 }} />
                    <div style={{ height: 12, width: 120, background: "#EEF2F7", borderRadius: 6 }} />
                  </div>
                ) : (
                  <Link key={item.id} to={item.to} style={{ display: "block", background: "#fff", border: `1px solid ${PALETTE.line}`, borderRadius: 14, padding: "16px 18px", boxShadow: TOKENS.shadowSm, textDecoration: "none", color: "inherit", transition: "transform .12s ease, box-shadow .12s ease" }}
                    onMouseEnter={(e)=>{ e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 10px 22px rgba(0,0,0,.08)'; }}
                    onMouseLeave={(e)=>{ e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow=TOKENS.shadowSm; }}>
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:12, marginBottom:6 }}>
                      <div style={{ fontWeight:800, fontSize:18, lineHeight:1.35, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{item.title}</div>
                      <span aria-hidden style={{ color: PALETTE.grayText }}>›</span>
                    </div>
                    {item.date && (<time style={{ color: PALETTE.grayText, fontSize: 12 }}>{item.date}</time>)}
                  </Link>
                )
              ))}
            </div>
          </div>

          {/* 정보공개 */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
              <h2 style={{ margin: 0, fontSize: 22, fontWeight: 900 }}>정보공개</h2>
              <Link to="/news/notices" style={{ color: PALETTE.teal, fontWeight: 800, textDecoration: "none", border: `1px solid ${PALETTE.teal}33`, borderRadius: 999, padding: "6px 10px", background: "#fff" }}>더보기 ›</Link>
            </div>
            <div style={{ display: "grid", gap: 18 }}>
              {(loadingNotices ? Array.from({ length: 4 }) : (noticesSplit.정보공개 || []).slice(0, 5)).map((item, i) => (
                loadingNotices ? (
                  <div key={i} aria-hidden style={{ background: "#fff", border: `1px solid ${PALETTE.line}`, borderRadius: 14, padding: "16px 18px", boxShadow: TOKENS.shadowSm }}>
                    <div style={{ height: 18, width: "70%", background: "#EEF2F7", borderRadius: 6, marginBottom: 10 }} />
                    <div style={{ height: 12, width: 120, background: "#EEF2F7", borderRadius: 6 }} />
                  </div>
                ) : (
                  <Link key={item.id} to={item.to} style={{ display: "block", background: "#fff", border: `1px solid ${PALETTE.line}`, borderRadius: 14, padding: "16px 18px", boxShadow: TOKENS.shadowSm, textDecoration: "none", color: "inherit", transition: "transform .12s ease, box-shadow .12s ease" }}
                    onMouseEnter={(e)=>{ e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 10px 22px rgba(0,0,0,.08)'; }}
                    onMouseLeave={(e)=>{ e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow=TOKENS.shadowSm; }}>
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:12, marginBottom:6 }}>
                      <div style={{ fontWeight:800, fontSize:18, lineHeight:1.35, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{item.title}</div>
                      <span aria-hidden style={{ color: PALETTE.grayText }}>›</span>
                    </div>
                    {item.date && (<time style={{ color: PALETTE.grayText, fontSize: 12 }}>{item.date}</time>)}
                  </Link>
                )
              ))}
            </div>
          </div>
        </div>
      </Section>

    </main>
  );
}
