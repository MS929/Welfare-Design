// src/pages/Home.jsx
import { useEffect, useMemo, useState } from "react";
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
  // 히어로 이미지: 우선 순위 경로 → 존재하지 않으면 /public/main.png 로 폴백
  const [heroSrc, setHeroSrc] = useState("/images/hero/dog.png");

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

  const heroImgH = useMemo(() => {
    if (width >= 1280) return 340; // desktop
    if (width >= 1024) return 300; // laptop/tablet landscape
    if (width >= 640)  return 260; // tablet portrait
    return 200;                     // mobile
  }, [width]);

  const [loadingNotices, setLoadingNotices] = useState(true);
  const [loadingStories, setLoadingStories] = useState(true);

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

      {/* 1) HERO – 좌 텍스트 / 우 이미지 카드 */}
      <section
        aria-label="메인 히어로"
        style={{
          position: "relative",
          width: "100vw",
          marginLeft: "calc(50% - 50vw)",
          marginRight: "calc(50% - 50vw)",
          background: "#FFFFFF",
          borderBottom: "none",
          marginBottom: isMobile ? 12 : 16,
        }}
      >
        <div
          style={{
            maxWidth: TOKENS.container,
            margin: "0 auto",
            padding: isMobile ? "36px 20px 40px" : "56px 24px 64px",
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1.05fr 1fr",
            alignItems: "center",
            gap: TOKENS.gap,
          }}
        >
          {/* 좌측: 타이틀/설명/CTA */}
          <div style={{ textAlign: "left", color: COLOR.text, maxWidth: 720 }}>

            <h1
              style={{
                margin: 0,
                fontSize: "clamp(24px, 4.6vw, 48px)",
                lineHeight: 1.18,
                fontWeight: 900,
                letterSpacing: "-0.5px",
                color: "#000",
                wordBreak: "keep-all",
                textWrap: "balance",
              }}
            >
              <span style={{ display: "block" }}>현장과 지역을 잇는 <br />맞춤형 복지를 설계하며</span>
              <span style={{ display: "block", marginTop: 6 }}>복지디자인 사회적협동조합이</span>
              <span style={{ display: "block", marginTop: 6 }}>지역과 함께합니다.</span>
            </h1>

            <p style={{ margin: "16px 0 0", color: COLOR.textMuted, fontSize: 16, maxWidth: 640 }}>
              주민·기관·전문가가 협력하는 맞춤형 복지 플랫폼을 설계·운영합니다.
            </p>
          </div>

          {/* 우측: 이미지 카드 */}
          <div
            style={{
              borderRadius: TOKENS.radiusLg,
              overflow: "hidden",
              boxShadow: TOKENS.shadow,
              border: `1px solid ${COLOR.line}`,
              height: heroImgH,
              background: COLOR.neutralTint,
            }}
          >
            <img
              src={heroSrc}
              alt="복지디자인 활동 이미지"
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              loading="eager"
              decoding="async"
            />
          </div>
        </div>
      </section>

      {/* 2) 공지사항 – 탭형 (공지 탭에 실제 데이터) */}
      <section
        aria-labelledby="notice-heading"
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
              marginBottom: 16,
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <h2
              id="notice-heading"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                fontSize: 32,
                fontWeight: 800,
                margin: 0,
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 26,
                  background: COLOR.secondary,
                  borderRadius: 3,
                }}
              />
              공지사항
            </h2>
            <div style={{ display: "flex", gap: 8, whiteSpace: "nowrap" }} role="tablist" aria-label="공지사항 구분">
              {tabs.map((t, idx) => (
                <button
                  key={t}
                  id={`notice-tab-${idx}`}
                  role="tab"
                  aria-selected={noticeTab === t}
                  aria-controls={`notice-panel-${idx}`}
                  onClick={() => setNoticeTab(t)}
                  style={{
                    padding: "6px 14px",
                    borderRadius: 999,
                    border:
                      noticeTab === t
                        ? `2px solid ${COLOR.primary}`
                        : `1px solid ${COLOR.line}`,
                    background: noticeTab === t ? COLOR.primaryTint : "#fff",
                    color: noticeTab === t ? COLOR.primary : COLOR.text,
                    cursor: "pointer",
                    fontWeight: noticeTab === t ? 600 : 400,
                    fontSize: 14,
                    transition: "all 0.2s",
                    outline: "none",
                  }}
                >
                  {t}
                </button>
              ))}
              <Link
                to="/news/notices"
                style={{
                  fontSize: 14,
                  color: COLOR.primary,
                  marginLeft: 8,
                  alignSelf: "center",
                  textDecoration: "none",
                  fontWeight: 600,
                }}
              >
                더 보기
              </Link>
            </div>
          </div>

          <div
            role="tabpanel"
            id={`notice-panel-${tabs.indexOf(noticeTab)}`}
            aria-labelledby={`notice-tab-${tabs.indexOf(noticeTab)}`}
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${noticeCols}, minmax(0, 1fr))`,
              gap: 28,
            }}
          >
            {loadingNotices ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} aria-hidden
                  style={{
                    border: `1px solid #EAEAEA`,
                    borderRadius: TOKENS.radius,
                    padding: 20,
                    boxShadow: TOKENS.shadowSm,
                    minHeight: NOTICE_CARD_MIN_H,
                    background: "#fff",
                  }}
                >
                  <div style={{
                    height: 16, width: "60%", background: COLOR.neutralTint,
                    borderRadius: 6, marginBottom: 12
                  }} />
                  <div style={{ height: 12, width: "90%", background: COLOR.neutralTint, borderRadius: 6, marginBottom: 8 }} />
                  <div style={{ height: 12, width: "80%", background: COLOR.neutralTint, borderRadius: 6 }} />
                </div>
              ))
            ) : (tabItems[noticeTab] || []).slice(0, 4).map((item) => (
              <ClickCard
                key={item.id}
                to={item.to}
                role="article"
                data-reveal
                style={{
                  border: `1px solid #EAEAEA`,
                  borderRadius: TOKENS.radius,
                  padding: 16,
                  boxShadow:
                    hoveredNotice === item.id
                      ? TOKENS.shadowHover
                      : TOKENS.shadowSm,
                  transform:
                    hoveredNotice === item.id
                      ? "translateY(-4px)"
                      : "translateY(0)",
                  transition: "all .18s ease",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  minHeight: noticeTab === "공모" ? NOTICE_CARD_MIN_H : 120,
                  backgroundColor: "#fff",
                  textDecoration: "none",
                  color: "inherit",
                  outline:
                    hoveredNotice === item.id
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
                  e.currentTarget.style.outline = hoveredNotice === item.id ? `2px solid ${COLOR.primary}` : "none";
                  e.currentTarget.style.outlineOffset = hoveredNotice === item.id ? "2px" : "0";
                }}
                onMouseEnter={() => { if (!hoverCapable) return; setHoveredNotice(item.id); }}
                onMouseLeave={() => { if (!hoverCapable) return; setHoveredNotice(null); }}
              >
                {noticeTab === "공모" ? (
                  <>
                    <div
                      style={{
                        height: NOTICE_THUMB_H,
                        marginBottom: 12,
                        borderRadius: 10,
                        overflow: "hidden",
                        background: COLOR.neutralTint,
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
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#bbb",
                            fontSize: 36,
                          }}
                        >
                          <span aria-hidden="true">🖼️</span>
                        </div>
                      )}
                    </div>
                    <h3
                      style={{
                        fontSize: 17.5,
                        fontWeight: 700,
                        margin: 0,
                        lineHeight: 1.3,
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
                      <time
                        style={{ fontSize: 12, color: "#6B7280", marginTop: 6 }}
                      >
                        {item.date}
                      </time>
                    ) : null}
                  </>
                ) : (
                  <>
                    <div>
                      <h3
                        style={{
                          fontSize: 16,
                          fontWeight: 700,
                          marginBottom: 6,
                          lineHeight: 1.3,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {item.title}
                      </h3>
                    </div>
                    {item.date && typeof item.date === "string" ? (
                      <time style={{ fontSize: 12, color: "#6B7280" }}>
                        {item.date}
                      </time>
                    ) : null}
                  </>
                )}
              </ClickCard>
            ))}
            {!loadingNotices && (!tabItems[noticeTab] || tabItems[noticeTab].length === 0) && (
              <div
                style={{
                  gridColumn: "1 / -1",
                  color: "#888",
                  fontSize: 14,
                  textAlign: "center",
                  padding: 24,
                }}
              >
                표시할 항목이 없습니다.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 3) 가입/후원/문의 CTA 박스 */}
      <section
        aria-label="가입/후원/문의"
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
              display: "grid",
              gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
              gap: 24,
            }}
          >
            {[
              {
                to: "/about/what",
                title: "복지디자인 소개",
                desc: "조합의 비전과 연혁을 확인하세요.",
                color: COLOR.secondary, // 오렌지
                tint: COLOR.secondaryTint,
                iconSrc: "/images/icons/introduction.png",
              },
              {
                to: "/business/overview",
                title: "사업 안내",
                desc: "복지디자인의 사업을 확인하세요.",
                color: COLOR.primary, // 틸
                tint: COLOR.primaryTint,
                iconSrc: "/images/icons/needs-survey.png",
              },
              {
                to: "/support/guide",
                title: "후원 가입 신청하기",
                desc: "지속적인 관심과 지지를 부탁드립니다.",
                color: COLOR.accent, // 노랑
                tint: COLOR.accentTint,
                iconSrc: "/images/icons/donation.png",
              },
              {
                to: "/support/combination",
                title: "조합 가입 신청하기",
                desc: "복지디자인의 미션에 함께해주세요.",
                color: COLOR.primary, // 틸(반복)
                tint: COLOR.primaryTint,
                iconSrc: "/images/icons/member-services.png",
              },
            ].map((item, idx) => (
              <ClickCard
                key={idx}
                to={item.to}
                data-reveal
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  gap: 18,
                  padding: 24,
                  borderRadius: TOKENS.radius,
                  background: item.tint,
                  border: `1px solid ${item.color}22`,
                  boxShadow: TOKENS.shadowSm,
                  textDecoration: "none",
                  color: "inherit",
                  minHeight: 132,
                  transition:
                    "transform .16s ease, box-shadow .16s ease, background .16s ease",
                }}
                onMouseEnter={(e) => {
                  if (!hoverCapable) return;
                  const el = e.currentTarget;
                  el.style.boxShadow = TOKENS.shadowHover;
                  el.style.transform = "translateY(-4px)";
                  el.style.background = `${item.tint}`;
                  const title = el.querySelector("strong");
                  const arrow = el.querySelector('[data-arrow]');
                  if (title) title.style.color = item.color;
                  if (arrow) arrow.style.color = item.color;
                }}
                onMouseLeave={(e) => {
                  if (!hoverCapable) return;
                  const el = e.currentTarget;
                  el.style.boxShadow = TOKENS.shadowSm;
                  el.style.transform = "translateY(0)";
                  el.style.background = item.tint;
                  const title = el.querySelector("strong");
                  const arrow = el.querySelector('[data-arrow]');
                  if (title) title.style.color = item.color;
                  if (arrow) arrow.style.color = item.color;
                }}
                tabIndex={0}
                onFocus={(e) => {
                  if (!focusVisible) return;
                  e.currentTarget.style.outline = `2px solid ${item.color}`;
                  e.currentTarget.style.outlineOffset = "2px";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.outline = "none";
                  e.currentTarget.style.outlineOffset = "0";
                }}
              >
                {/* 아이콘 슬롯 (사용자가 교체 가능) */}
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 14,
                    background: "#ffffff",
                    border: `1px solid ${item.color}33`,
                    boxShadow: "0 4px 12px rgba(0,0,0,.06)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flex: "0 0 auto",
                  }}
                >
                  {/* 아이콘은 사용자 삽입 예정 */}
                  <img
                    src={item.iconSrc}
                    alt=""
                    style={{ width: 28, height: 28 }}
                  />
                </div>

                {/* 텍스트 영역 */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 12,
                    }}
                  >
                    <strong
                      style={{
                        fontSize: 18,
                        fontWeight: 800,
                        color: item.color,
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                      }}
                    >
                      {item.title}
                    </strong>
                    {/* 우측 화살표 */}
                    <span
                      data-arrow
                      aria-hidden
                      style={{
                        color: item.color,
                        fontWeight: 700,
                        opacity: 0.85,
                      }}
                    >
                      ›
                    </span>
                  </div>
                  <p
                    style={{
                      margin: "8px 0 0",
                      fontSize: 14,
                      color: COLOR.text,
                      opacity: 0.9,
                    }}
                  >
                    {item.desc}
                  </p>
                </div>
              </ClickCard>
            ))}
          </div>
        </div>
      </section>

      {/* 4) 복지디자인 소식 – 파란 패널 + 탭 풍의 보조 내비 + 필터 */}
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
    </main>
  );
}
