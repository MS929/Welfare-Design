import { useState, useEffect, useMemo, useRef } from "react";
import matter from "gray-matter";
// src/pages/Home1.jsx
// 팔레트 (우리 브랜드 컬러로, 레퍼런스 톤을 흉내냄)
const PALETTE = {
  orange: "#ED6A32",
  yellow: "#F4B731",
  teal: "#3BA7A0",
  tealLight: "#E6F5F2",
  mintBar: "#D8F3EC",
  beige: "#FBF6EF",
  grayBg: "#F5F7FA",
  grayCard: "#FFFFFF",
  grayText: "#64748B",
  darkText: "#111827",
  line: "rgba(17, 24, 39, 0.08)",
  lineStrong: "rgba(17, 24, 39, 0.12)",
  shadowSm: "0 4px 12px rgba(0,0,0,.05)",
  shadow: "0 8px 24px rgba(0,0,0,.06)",
  radius: 16,
  radiusLg: 22,
  radiusXl: 28,
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
        <div style={{ maxWidth: innerMaxWidth, margin: "0 auto", padding: "0 24px" }}>
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
        transition: "transform .12s ease, box-shadow .12s ease",
      }}
    >
      <div
        aria-hidden
        style={{
          height: 160,
          overflow: "hidden",
          borderBottom: `1px solid ${PALETTE.line}`,
          background: thumbnail
            ? "#fff"
            : "radial-gradient(120% 80% at 50% 20%, rgba(59,167,160,.25), rgba(237,106,50,.18))",
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

  // --- HERO carousel state ---
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
        return {
          id: path,
          title: data?.title || meta.titleFromFile,
          date: formatDate(data?.date) || formatDate(meta.date) || "",
          to: `/news/notices/${encodeURIComponent(base)}`,
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

  return (
    <main style={{ background: "#fff" }}>
      {/* HERO (레퍼런스형: 베이지 배경 + 좌측 반원 이미지 + 우측 텍스트) */}
      <Section fullBleed innerMaxWidth={1500} style={{ paddingTop: 72, paddingBottom: 88, background: PALETTE.beige }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.1fr 1fr",
            gap: 28,
            alignItems: "center",
            padding: "0 0",
          }}
        >
          {/* 좌측 이미지 프레임 (수동/자동 캐러셀) */}
          <div
            style={{
              position: "relative",
              height: 340,
              borderRadius: PALETTE.radiusLg,
              border: `1px solid ${PALETTE.line}`,
              overflow: "hidden",
              boxShadow: "0 6px 16px rgba(0,0,0,.08)",
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
                onError={(e) => {
                  const t = e.currentTarget;
                  // 1차 폴백: 라이트 이미지
                  if (!t.dataset.fallback1) {
                    t.dataset.fallback1 = "1";
                    t.src = "/images/hero/light.png";
                    return;
                  }
                  // 2차 폴백: 도그 이미지
                  if (!t.dataset.fallback2) {
                    t.dataset.fallback2 = "1";
                    t.src = "/images/hero/dog.png";
                  } else {
                    t.onerror = null;
                  }
                }}
              />
            ))}
          </div>

          {/* 우측 텍스트 */}
          <div>
            <h1
              style={{
                fontSize: 32,
                lineHeight: 1.35,
                margin: 0,
                letterSpacing: -0.2,
              }}
            >
              현장과 지역을 잇는 <b>맞춤형 복지</b>를 설계하며
              <br />
              <b>복지디자인 사회적협동조합</b>이
              <br />
              지역과 함께합니다.
            </h1>
            <p style={{ color: PALETTE.grayText, marginTop: 10 }}>
              주민·기관·전문가가 협력하는 맞춤형 복지 플랫폼을 설계·운영합니다.
            </p>

            {/* 캐러셀 도트 + 이전/다음 컨트롤 (텍스트 아래) */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginTop: 12,
                flexWrap: "wrap",
              }}
            >
              {/* 도트 */}
              <div style={{ display: "flex", gap: 8 }}>
                {HERO_IMAGES.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    aria-label={`이미지 ${i + 1} 보기`}
                    onClick={() => goTo(i)}
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 999,
                      border: "none",
                      background: i === heroIndex ? PALETTE.teal : "#D1D5DB",
                      boxShadow: "0 1px 2px rgba(0,0,0,.08)",
                      cursor: "pointer",
                    }}
                  />
                ))}
              </div>

              {/* 이전/다음 버튼 */}
              <div style={{ display: "flex", gap: 8, marginLeft: 4 }}>
                <button
                  type="button"
                  aria-label="이전 이미지"
                  onClick={prevHero}
                  style={{
                    padding: "6px 10px",
                    borderRadius: 10,
                    border: `1px solid ${PALETTE.line}`,
                    background: "#fff",
                    boxShadow: "0 2px 6px rgba(0,0,0,.08)",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  이전
                </button>
                <button
                  type="button"
                  aria-label="다음 이미지"
                  onClick={nextHero}
                  style={{
                    padding: "6px 10px",
                    borderRadius: 10,
                    border: `1px solid ${PALETTE.line}`,
                    background: "#fff",
                    boxShadow: "0 2px 6px rgba(0,0,0,.08)",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  다음
                </button>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* 빠르게가기 (민트색 스트립 + 헤드라인 + 4개 카드 링크) */}
      <div
        style={{
          background: PALETTE.mintBar,
          padding: "28px 0",
          width: "100vw",
          marginLeft: "calc(50% - 50vw)",
          marginRight: "calc(50% - 50vw)",
        }}
      >
        <Section style={{ padding: 0 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(220px, 1fr) 2fr",
              gap: 18,
              alignItems: "center",
            }}
          >
            {/* 좌측: 설명 영역 */}
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
                자주 찾는 메뉴를 한 번에. 소개·사업·후원·가입 페이지로 바로
                이동하세요.
              </p>
            </div>

            {/* 우측: 카드 링크 4개 */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, minmax(0,1fr))",
                gap: 14,
              }}
            >
              {[
                {
                  href: "/about/what",
                  iconsrc: "/images/icons/introduction.png",
                  label: "복지디자인 소개",
                  desc: "비전·연혁·조직",
                },
                {
                  href: "/business/overview",
                  iconsrc: "/images/icons/needs-survey.png",
                  label: "사업 안내",
                  desc: "운영사업 한눈에",
                },
                {
                  href: "/support/guide",
                  iconsrc: "/images/icons/donation.png",
                  label: "후원 안내",
                  desc: "지지와 참여 방법",
                },
                {
                  href: "/support/combination",
                  iconsrc: "/images/icons/member-services.png",
                  label: "조합 가입",
                  desc: "함께하는 동료되기",
                },
              ].map((it, i) => (
                <a
                  key={i}
                  href={it.href}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: 14,
                    borderRadius: 16,
                    background: "#fff",
                    border: `1px solid ${PALETTE.line}`,
                    boxShadow: "0 3px 10px rgba(0,0,0,.06)",
                    textDecoration: "none",
                    color: "inherit",
                    transition: "transform .12s ease, box-shadow .12s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-3px)";
                    e.currentTarget.style.boxShadow =
                      "0 8px 18px rgba(0,0,0,.10)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "none";
                    e.currentTarget.style.boxShadow =
                      "0 3px 10px rgba(0,0,0,.06)";
                  }}
                >
                  <div
                    aria-hidden
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 12,
                      background: "#ffffff",
                      border: `1px solid ${PALETTE.teal}33`,
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
                      style={{ width: 22, height: 22, objectFit: "contain" }}
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
                        marginTop: 4,
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
                </a>
              ))}
            </div>
          </div>
        </Section>
      </div>

      {/* 동행이야기(=소식) 그리드 */}
      <Section>
        {/* 좌측 설명 + 우측 리스트 레이아웃 */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "260px 1fr",
            gap: 24,
            alignItems: "start",
          }}
        >
          {/* 좌측 고정 영역 */}
          {(() => {
            const [active, setActive] = useState("전체");
            const [items, setItems] = useState([]);

            useEffect(() => {
              try {
                const modules = import.meta.glob(
                  "/src/content/stories/*.{md,mdx}",
                  {
                    eager: true,
                    query: "?raw",
                    import: "default",
                  }
                );

                const mapped = Object.entries(modules).map(([path, raw]) => {
                  const { data } = matter(raw);
                  const meta = parseDatedSlug(path);
                  const base = (path.split("/").pop() || "").replace(
                    /\.(md|mdx)$/i,
                    ""
                  );
                  const rawType = (
                    data?.category ||
                    data?.type ||
                    "기타"
                  ).trim();
                  const typeMap = {
                    행사안내: "행사",
                    이벤트: "행사",
                    활동소식: "활동",
                    인터뷰: "인터뷰",
                    공탁: "공탁",
                    공조동행: "공조동행",
                  };
                  const type = typeMap[rawType] || rawType;
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
                  if (
                    !isNaN(bd) &&
                    !isNaN(ad) &&
                    bd.getTime() !== ad.getTime()
                  ) {
                    return bd.getTime() - ad.getTime();
                  }
                  return (b.id || "").localeCompare(a.id || "");
                });
                setItems(mapped);
              } catch (e) {
                console.warn("스토리 로드 실패:", e);
                setItems([]);
              }
            }, []);

            // 동적 탭: 데이터에 있는 카테고리로 생성 (Home.jsx와 동일 경험)
            const pills = useMemo(() => {
              const banned = new Set(["공지", "활동후기"]);
              const cats = Array.from(
                new Set(
                  items.map((i) => i.type).filter((t) => t && !banned.has(t))
                )
              );
              const order = ["인터뷰", "행사", "활동", "공탁", "공조동행"]; // 선호 순서
              cats.sort((a, b) => {
                const ia = order.indexOf(a);
                const ib = order.indexOf(b);
                if (ia !== -1 && ib !== -1) return ia - ib;
                if (ia !== -1) return -1;
                if (ib !== -1) return 1;
                return a.localeCompare(b, "ko");
              });
              return ["전체", ...cats];
            }, [items]);

            const filtered = items.filter(
              (d) => active === "전체" || d.type === active
            );

            return (
              <>
                <div>
                  <h2
                    style={{
                      margin: "0 0 8px 0",
                      fontSize: 22,
                      fontWeight: 900,
                    }}
                  >
                    복지디자인 이야기
                  </h2>
                  <p
                    style={{
                      margin: "0 0 10px 0",
                      color: PALETTE.grayText,
                      fontSize: 14,
                    }}
                  >
                    복지디자인의 최신 소식을 전해드려요
                  </p>
                  <a
                    href="/news/stories"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      textDecoration: "none",
                      color: PALETTE.teal,
                      fontWeight: 800,
                      marginBottom: 10,
                    }}
                  >
                    더보기 <span aria-hidden>›</span>
                  </a>
                  {/* 필터 탭: 더보기 아래 세로 동그라미 */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 12,
                      marginTop: 28,
                    }}
                  >
                    {pills.map((label) => {
                      const isActive = active === label;
                      return (
                        <button
                          key={label}
                          onClick={() => setActive(label)}
                          style={{
                            cursor: "pointer",
                            width: 84,
                            height: 84,
                            borderRadius: 16,
                            border: `1px solid ${PALETTE.line}`,
                            background: isActive ? PALETTE.teal : "#fff",
                            color: isActive ? "#fff" : PALETTE.darkText,
                            fontWeight: 800,
                            boxShadow: "0 2px 6px rgba(0,0,0,.04)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            textAlign: "center",
                            lineHeight: 1.2,
                            padding: 8,
                            wordBreak: "keep-all",
                          }}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 우측: 카드 그리드 */}
                <div style={{ marginTop: 96 }}>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(3, minmax(0,1fr))",
                      gap: 18,
                    }}
                  >
                    {filtered.slice(0, 6).map((n) => (
                      <StoryCard
                        key={n.slug}
                        title={n.title}
                        date={n.date}
                        href={`/news/stories/${encodeURIComponent(n.slug)}`}
                        thumbnail={n.thumbnail}
                      />
                    ))}
                  </div>
                </div>
              </>
            );
          })()}
        </div>
      </Section>

      {/* 지원사업 영역 (민트 스트립 배경) */}
      <div
        style={{
          background: PALETTE.mintBar,
          padding: "12px 0",
          width: "100vw",
          marginLeft: "calc(50% - 50vw)",
          marginRight: "calc(50% - 50vw)",
        }}
      >
        <Section id="support" style={{ padding: "16px 20px" }}>
          <h2 style={{ margin: "0 0 6px 0", fontSize: 22, fontWeight: 900 }}>
            지원사업 영역
          </h2>
          <p
            style={{
              margin: "0 0 16px 0",
              color: PALETTE.grayText,
              fontSize: 14,
            }}
          >
            복지디자인이 수행하는 주요 지원사업을 한눈에 살펴보세요.
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0,1fr))",
              gap: 16,
            }}
          >
            {[
              {
                icon: "/images/icons/rental.png",
                label: "휠체어 및 복지용구 무료 대여",
              },
              {
                icon: "/images/icons/apply-help.png",
                label: "보조기기·복지용구 신청 안내 지원",
              },
              {
                icon: "/images/icons/donation.png",
                label: "보조기기 기증 캠페인",
              },
              {
                icon: "/images/icons/ewc-insurance.png",
                label: "취약 계층 전동 휠체어 보험금 지원",
              },
              {
                icon: "/images/icons/needs-survey.png",
                label: "취약 계층 복지욕구 실태조사",
              },
              {
                icon: "/images/icons/member-services.png",
                label: "조합원 지원 서비스",
                 },
            ].map((it, i) => (
              <div
                key={i}
                style={{
                  background: PALETTE.teal,
                  color: "#fff",
                  borderRadius: PALETTE.radiusLg,
                  padding: 20,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  boxShadow: "0 8px 18px rgba(59,167,160,.25)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    aria-hidden
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 12,
                      background: "rgba(255,255,255,.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {typeof it.icon === "string" ? (() => {
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
                          style={{ width: 24, height: 24, objectFit: "contain" }}
                        />
                      );
                    })() : (
                      it.icon
                    )}
                  </div>
                  <div style={{ fontWeight: 900 }}>{it.label}</div>
                </div>
                <span style={{ opacity: 0.9, fontSize: 12 }}>바로가기 ›</span>
              </div>
            ))}
          </div>
        </Section>
      </div>

      {/* 공지사항 – 최신 5개 리스트 (CMS 파일 연동) */}
      <Section style={{ paddingTop: 38 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginBottom: 12,
          }}
        >
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 900 }}>공지사항</h2>
          <a
            href="/news/notices"
            style={{
              color: PALETTE.teal,
              fontWeight: 800,
              textDecoration: "none",
            }}
          >
            더보기 ›
          </a>
        </div>

        <div style={{ display: "grid", gap: 18 }}>
          {(loadingNotices
            ? Array.from({ length: 4 })
            : notices.slice(0, 5)
          ).map((item, i) =>
            loadingNotices ? (
              <div
                key={i}
                aria-hidden
                style={{
                  background: "#fff",
                  border: `1px solid ${PALETTE.line}`,
                  borderRadius: 14,
                  padding: "16px 18px",
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
                  padding: "16px 18px",
                  boxShadow: PALETTE.shadowSm,
                  textDecoration: "none",
                  color: "inherit",
                  transition: "transform .12s ease, box-shadow .12s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 10px 22px rgba(0,0,0,.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.boxShadow = PALETTE.shadowSm;
                }}
              >
                <div
                  style={{
                    fontWeight: 800,
                    fontSize: 18,
                    lineHeight: 1.35,
                    marginBottom: 6,
                  }}
                >
                  {item.title}
                </div>
                {item.date && (
                  <time style={{ color: PALETTE.grayText, fontSize: 12 }}>
                    {item.date}
                  </time>
                )}
              </a>
            )
          )}

          {!loadingNotices && notices.length === 0 && (
            <div style={{ color: PALETTE.grayText, fontSize: 14 }}>
              표시할 공지가 없습니다.
            </div>
          )}
        </div>
      </Section>
      {/* 바닥 간격 */}
      <div style={{ height: 36 }} />
    </main>
  );
}
