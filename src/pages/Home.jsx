import { useState, useEffect, useMemo, useRef } from "react";
import matter from "gray-matter";
import { Link } from "react-router-dom";
// src/pages/Home.jsx
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

const CONTAINER = 1360;

// Hero carousel images (2개만 사용)
// 아래 두 파일을 교체해서 쓰세요: /public/images/hero/hero1.jpg, /public/images/hero/hero2.jpg
const HERO_IMAGES = ["/images/hero/dog.png", "/images/hero/light.png"];
const HERO_INTERVAL = 10000; // 10초

// ===== Utils (match Home.jsx behavior) =====
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

function formatDate(v) {
  if (!v) return "";
  try {
    if (typeof v === "string") return v.slice(0, 10);
    if (v instanceof Date && !isNaN(v)) return v.toISOString().slice(0, 10);
  } catch {}
  return "";
}

// Normalize notice categories coming from CMS (e.g., "공모" -> "정보공개", "정보 공개" -> "정보공개")
function normalizeNoticeCategory(v) {
  const s = (v ?? "").toString().trim();
  if (!s) return "공지";
  // remove spaces/hyphens to compare variants like "정보 공개", "정보-공개"
  const compact = s.replace(/[\s-]/g, "");
  if (compact === "공모") return "정보공개";
  if (compact.includes("정보") && compact.includes("공개")) return "정보공개";
  if (s.startsWith("공지")) return "공지";
  return s; // otherwise keep as-is
}

const Section = ({
  children,
  style,
  fullBleed = false,
  innerMaxWidth = CONTAINER,
}) => {
  if (fullBleed) {
    // full-bleed background stripe, with an inner centered container
    return (
      <section
        style={{
          width: "100vw",
          margin: "0 calc(50% - 50vw)",
          padding: "40px 0",
          ...style,
        }}
      >
        <div
          style={{
            maxWidth: innerMaxWidth,
            margin: "0 auto",
            padding: "0 24px",
          }}
        >
          {children}
        </div>
      </section>
    );
  }
  // normal constrained section
  return (
    <section
      style={{
        maxWidth: CONTAINER,
        width: "100%",
        margin: "0 auto",
        padding: "40px 24px",
        ...style,
      }}
    >
      {children}
    </section>
  );
};

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

const StoryCard = ({ title, date, href = "/news/stories", thumbnail }) => (
  <a href={href} style={{ textDecoration: "none", color: "inherit" }}>
    <article
      style={{
        background: "#fff",
        borderRadius: PALETTE.radiusLg,
        border: `1px solid ${PALETTE.line}`,
        boxShadow: PALETTE.shadowSm,
        overflow: "hidden",
        transition: "transform .12s ease, box-shadow .12s ease, border-color .12s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = `0 14px 28px rgba(15,23,42,.12), 0 0 0 3px ${PALETTE.teal}22`;
        e.currentTarget.style.borderColor = PALETTE.teal;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "none";
        e.currentTarget.style.boxShadow = PALETTE.shadowSm;
        e.currentTarget.style.borderColor = PALETTE.line;
      }}
    >
      <div
        aria-hidden
        style={{
          height: 160,
          overflow: "hidden",
          borderBottom: `1px solid ${PALETTE.line}`,
          background: thumbnail ? "#fff" : PALETTE.grayBg,
        }}
      >
        {thumbnail ? (
          <img
            src={thumbnail}
            alt=""
            loading="lazy"
            decoding="async"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : null}
      </div>
      <div style={{ padding: 16 }}>
        <div style={{ fontWeight: 800, lineHeight: 1.25 }}>{title}</div>
        <div style={{ color: PALETTE.grayText, fontSize: 12, marginTop: 10 }}>
          {date}
        </div>
      </div>
    </article>
  </a>
);

export default function Home1() {
  const [notices, setNotices] = useState([]);
  const [loadingNotices, setLoadingNotices] = useState(true);
  // --- Stories (복지디자인 소식) state ---
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
  // Removed noticeScope filter UI; always show both columns

  // --- HERO carousel state ---
  const [heroIndex, setHeroIndex] = useState(0);
  const timerRef = useRef(null);

  // 저감 모션 환경설정 시 자동재생 비활성화
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    try {
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch {
      return false;
    }
  }, []);

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

  useEffect(() => {
    restartTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [prefersReducedMotion]);

  // pre-load hero images for smoother transitions
  useEffect(() => {
    HERO_IMAGES.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

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

  // Load stories list (for 복지디자인 소식)
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

  const noticesSplit = useMemo(() => {
    const norm = (c) => normalizeNoticeCategory(c);
    const notice = notices.filter((n) => norm(n.category) === "공지");
    const info = notices.filter((n) => norm(n.category) === "정보공개");
    return { 공지: notice, 정보공개: info };
  }, [notices]);

  return (
    <main style={{ background: "#fff" }}>
      {/* 1) HERO – 이미지 캐러셀 + 우측 텍스트 (Home1 스타일) */}
      <Section
        fullBleed
        innerMaxWidth={CONTAINER}
        style={{
          paddingTop: 80,
          paddingBottom: 96,
          background: "linear-gradient(180deg, #FAEEE0 0%, #FFFFFF 72%)",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.15fr",
            gap: 36,
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
                height: 360,
                borderRadius: PALETTE.radiusLg,
                overflow: "hidden",
                boxShadow: "0 12px 28px rgba(0,0,0,.10)",
                background: "#fff",
              }}
            >
              {HERO_IMAGES.map((src, i) => (
                <img
                  key={src}
                  src={src}
                  alt="복지디자인 활동 이미지"
                  loading={i === heroIndex ? "eager" : "lazy"}
                  decoding="async"
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    opacity: heroIndex === i ? 1 : 0,
                    transition: "opacity 700ms ease-in-out",
                    willChange: "opacity",
                    pointerEvents: "none",
                  }}
                />
              ))}
            </div>
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

              {/* dots */}
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
          <div style={{ marginTop: -36 }}>
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
                fontSize: 38,
                lineHeight: 1.35,
                margin: 0,
                letterSpacing: -0.2,
                fontWeight: 600,
              }}
            >
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

            <p style={{ color: PALETTE.grayText, marginTop: 12, fontSize: 16 }}>
              주민·기관·전문가가 협력하는 맞춤형 복지 플랫폼을 설계·운영합니다.
            </p>
          </div>
        </div>
      </Section>

      {/* 2) 빠르게 가기 */}
      <div
        style={{
          // full-bleed soft background behind the quick links (match photo 1)
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
                  gridTemplateColumns: "minmax(220px, 1fr) 2fr",
                  gap: 18,
                  alignItems: "center",
                }}
              >
                {/* Left: heading + description */}
                <div>
                  <h3
                    style={{
                      margin: 0,
                      fontSize: 20,
                      fontWeight: 900,
                      letterSpacing: -0.2,
                      color: PALETTE.darkText,
                    }}
                  >
                    빠르게 가기
                  </h3>
                  <p
                    style={{
                      margin: "6px 0 0",
                      color: PALETTE.grayText,
                      lineHeight: 1.5,
                    }}
                  >
                    자주 찾는 메뉴를 한 번에 <br />
                    소개·사업·후원·가입 페이지로 바로 이동하세요.
                  </p>
                </div>

                {/* Right: 4 cards unchanged */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
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
                        transition: "transform .12s ease, box-shadow .12s ease",
                        width: "100%",
                        minHeight: 64,
                        alignItems: "center",
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

      {/* 복지디자인 소식 */}
      <Section>
        {/* 헤더: 좌측 제목/설명, 우측 필터 + 전체보기 */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 16,
            marginBottom: 24,
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: 28,
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
                  background: PALETTE.teal,
                  borderRadius: 3,
                  display: "inline-block",
                }}
              />
              복지디자인 소식
            </h2>
            <p
              style={{
                margin: "6px 0 0",
                color: PALETTE.grayText,
                fontSize: 14,
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
                    height: 36,
                    padding: "0 16px",
                    borderRadius: 999,
                    border: active
                      ? `2px solid ${PALETTE.teal}`
                      : `1px solid ${PALETTE.line}`,
                    background: active ? PALETTE.tealTint : "#fff",
                    color: active ? PALETTE.teal : PALETTE.darkText,
                    fontWeight: 800,
                    boxShadow: "0 2px 6px rgba(0,0,0,.04)",
                    transition:
                      "background .15s ease, border-color .15s ease, color .15s ease",
                  }}
                >
                  {label}
                </button>
              );
            })}
            <a
              href="/news/stories"
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

        {/* 카드 그리드 */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0,1fr))",
            gap: 24,
          }}
        >
          {storyFiltered.slice(0, 6).map((n) => (
            <StoryCard
              key={n.slug}
              title={n.title}
              date={n.date}
              href={`/news/stories/${encodeURIComponent(n.slug)}`}
              thumbnail={n.thumbnail}
            />
          ))}
          {storyFiltered.length === 0 && (
            <div style={{ color: PALETTE.grayText, gridColumn: "1/-1" }}>
              표시할 소식이 없습니다.
            </div>
          )}
        </div>
      </Section>

      {/* 지원사업 영역 (민트 스트립 배경) */}
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
          <h2 style={{ margin: "0 0 6px 0", fontSize: 24, fontWeight: 900 }}>
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
              gridTemplateColumns: "repeat(3, minmax(0,1fr))",
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
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.88) 0%, rgba(255,255,255,0.76) 100%)",
                  border: "1px solid rgba(255,255,255,0.6)",
                  color: PALETTE.darkText,
                  borderRadius: PALETTE.radiusLg,
                  padding: 22,
                  boxShadow:
                    "0 12px 28px rgba(59,167,160,.10), 0 6px 14px rgba(237,106,50,.06)",
                  textDecoration: "none",
                  transition: "transform .18s ease, box-shadow .18s ease",
                  backdropFilter: "saturate(150%) blur(8px)",
                  WebkitBackdropFilter: "saturate(150%) blur(8px)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow =
                    "0 18px 36px rgba(59,167,160,.16), 0 10px 22px rgba(237,106,50,.10)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.boxShadow =
                    "0 12px 28px rgba(59,167,160,.10), 0 6px 14px rgba(237,106,50,.06)";
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    aria-hidden
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 14,
                      background: `linear-gradient(180deg, ${PALETTE.grayCard} 0%, rgba(255,255,255,.85) 100%)`,
                      border: `1px solid ${PALETTE.line}`,
                      boxShadow:
                        "inset 0 1px 0 rgba(255,255,255,.6), 0 6px 14px rgba(0,0,0,.06)",
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
                                // If SVG is missing, fall back to PNG once
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

      {/* 공지/정보공개 – 두 칼럼 리스트 */}
      <Section style={{ paddingTop: 52 }}>
        {/* 상단 타이틀 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            justifyContent: "space-between",
            marginBottom: 20,
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

        {/* 두 칼럼 그리드 */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0,1fr))",
            gap: 28,
          }}
        >
          {/* 공지 */}
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                marginBottom: 12,
              }}
            >
              <h2 style={{ margin: 0, fontSize: 22, fontWeight: 900 }}>공지</h2>
              <a
                href="/news/notices?category=공지"
                style={{
                  color: PALETTE.teal,
                  fontWeight: 800,
                  textDecoration: "none",
                  border: `1px solid ${PALETTE.teal}33`,
                  borderRadius: 999,
                  padding: "6px 10px",
                  background: "#fff",
                }}
              >
                더보기 ›
              </a>
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
                    style={{
                      display: "block",
                      background: "#fff",
                      border: `1px solid ${PALETTE.line}`,
                      borderRadius: 14,
                      padding: "18px 20px",
                      boxShadow: PALETTE.shadowSm,
                      textDecoration: "none",
                      color: "inherit",
                      transition: "transform .12s ease, box-shadow .12s ease, border-color .12s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow =
                        `0 10px 22px rgba(0,0,0,.08), 0 0 0 3px ${PALETTE.orange}22`;
                      e.currentTarget.style.borderColor = PALETTE.orange;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "none";
                      e.currentTarget.style.boxShadow = PALETTE.shadowSm;
                      e.currentTarget.style.borderColor = PALETTE.line;
                    }}
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

          {/* 정보공개 */}
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                marginBottom: 12,
              }}
            >
              <h2 style={{ margin: 0, fontSize: 22, fontWeight: 900 }}>
                정보공개
              </h2>
              <a
                href="/news/notices?category=정보공개"
                style={{
                  color: PALETTE.teal,
                  fontWeight: 800,
                  textDecoration: "none",
                  border: `1px solid ${PALETTE.teal}33`,
                  borderRadius: 999,
                  padding: "6px 10px",
                  background: "#fff",
                }}
              >
                더보기 ›
              </a>
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
                    style={{
                      display: "block",
                      background: "#fff",
                      border: `1px solid ${PALETTE.line}`,
                      borderRadius: 14,
                      padding: "18px 20px",
                      boxShadow: PALETTE.shadowSm,
                      textDecoration: "none",
                      color: "inherit",
                      transition: "transform .12s ease, box-shadow .12s ease, border-color .12s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow =
                        `0 10px 22px rgba(0,0,0,.08), 0 0 0 3px ${PALETTE.orange}22`;
                      e.currentTarget.style.borderColor = PALETTE.orange;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "none";
                      e.currentTarget.style.boxShadow = PALETTE.shadowSm;
                      e.currentTarget.style.borderColor = PALETTE.line;
                    }}
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
  );
}
