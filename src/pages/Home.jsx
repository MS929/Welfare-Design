// src/pages/Home.jsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
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
  radius: 16,
  radiusLg: 24,
  gap: 28,
  gapSm: 14,
  container: 1280,
  shadow: "0 10px 28px rgba(15, 23, 42, .08)",
  shadowSm: "0 4px 14px rgba(15, 23, 42, .06)",
  shadowHover: "0 16px 36px rgba(15, 23, 42, .14)",
};

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
  const [heroSrc, setHeroSrc] = useState("/images/main.png");

  // CTA hover states (기본 흰색 → 호버 시 컬러 틴트)
  const [hoverIntro, setHoverIntro] = useState(false);     // 소개
  const [hoverSupport, setHoverSupport] = useState(false); // 후원
  const [hoverJoin, setHoverJoin] = useState(false);       // 조합 가입
  const [hoverEmail, setHoverEmail] = useState(false);     // 이메일 문의
  // 카드 hover 상태
  const [hoveredNotice, setHoveredNotice] = useState(null);
  const [hoveredStory, setHoveredStory] = useState(null);

  const NOTICE_CARD_MIN_H = 200; // 공지/공모 카드 공통 높이
  const NOTICE_THUMB_H = 120;    // 공모 썸네일 고정 높이

  // 공지: 실제 파일 로드 (Decap CMS가 커밋한 md 기준)
  useEffect(() => {
    try {
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
    } catch (e) {
      console.warn("공지 로드 실패:", e);
      setNotices([]);
    }
  }, []);

  // 스토리: 실제 파일 로드
  useEffect(() => {
    try {
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
    } catch (e) {
      console.warn("스토리 로드 실패:", e);
      setStories([]);
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

  return (
    <main>
      {/* 0) 상단 간격 */}
      <div style={{ height: 8 }} />

      {/* 1) HERO – 상단 배너: 좌측 텍스트/버튼, 우측 큰 이미지 */}
      <section
        aria-label="메인 히어로"
        style={{
          position: "relative",
          width: "100%",
          background: `linear-gradient(180deg, ${COLOR.primaryTint} 0%, #ffffff 65%)`,
          overflow: "hidden",
          borderBottom: "none",
          marginBottom: 16,
        }}
      >
        <div
          style={{
            maxWidth: TOKENS.container,
            margin: "0 auto",
            padding: "64px 24px",
            display: "grid",
            gridTemplateColumns: "1fr 1.1fr",
            alignItems: "center",
            gap: TOKENS.gap,
          }}
        >
          <div
            style={{
              textAlign: "center",
              color: COLOR.text,
              maxWidth: 760,
              margin: "0 auto",
            }}
          >
            <h1
              style={{
                margin: 0,
                fontSize: 44,
                lineHeight: 1.18,
                fontWeight: 900,
                letterSpacing: "-0.5px",
              }}
            >
              복지사각지대 없는 사회
              <br />
              <strong style={{ fontWeight: 900 }}>복지디자인 사회적협동조합</strong>이
              <br />
              함께 만들어갑니다
            </h1>
            <p
              style={{
                margin: "12px 0 22px",
                color: COLOR.textMuted,
                fontSize: 16,
              }}
            >
              주민·기관·전문가가 협력하는 맞춤형 복지 플랫폼을 설계·운영합니다.
            </p>
          </div>

          <div
            style={{
              position: "relative",
              height: 300,
              borderRadius: TOKENS.radiusLg,
              overflow: "hidden",
              boxShadow: TOKENS.shadow,
              background: `radial-gradient(75% 120% at 100% 0%, ${COLOR.secondaryTint} 0%, #fff 70%)`,
              border: `1px solid ${COLOR.line}`,
            }}
          >
            <img
              src={heroSrc}
              alt="메인 히어로"
              onError={() => {
                if (heroSrc !== "/main.png") setHeroSrc("/main.png");
              }}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        </div>
      </section>

      {/* 2) 공지사항 – 탭형 (공지 탭에 실제 데이터) */}
      <section
        aria-labelledby="notice-heading"
        style={{
          background: "#fff",
          marginBottom: 40,
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
            }}
          >
            <h2
              id="notice-heading"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                fontSize: 30,
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
            <div style={{ display: "flex", gap: 8 }}>
              {tabs.map((t) => (
                <button
                  key={t}
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
                    fontWeight: noticeTab === t ? 700 : 400,
                    fontSize: 14,
                    transition: "all 0.2s",
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
                }}
              >
                더 보기
              </Link>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
              gap: 28,
            }}
          >
            {(tabItems[noticeTab] || []).slice(0, 4).map((item) => (
              <Link
                key={item.id}
                to={item.to}
                role="article"
                style={{
                  border: `1px solid ${COLOR.line}`,
                  borderRadius: TOKENS.radius,
                  padding: 20,
                  boxShadow:
                    hoveredNotice === item.id
                      ? TOKENS.shadowHover
                      : TOKENS.shadowSm,
                  transform:
                    hoveredNotice === item.id
                      ? "translateY(-3px)"
                      : "translateY(0)",
                  transition: "all .18s ease",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  minHeight: NOTICE_CARD_MIN_H,
                  backgroundColor: "#fff",
                  textDecoration: "none",
                  color: "inherit",
                  outline:
                    hoveredNotice === item.id
                      ? `2px solid ${COLOR.primary}22`
                      : "none",
                }}
                onMouseEnter={() => setHoveredNotice(item.id)}
                onMouseLeave={() => setHoveredNotice(null)}
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
                          🖼️
                        </div>
                      )}
                    </div>
                    <h3
                      style={{
                        fontSize: 17,
                        fontWeight: 700,
                        margin: 0,
                        lineHeight: 1.3,
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
                          fontSize: 18,
                          fontWeight: 700,
                          marginBottom: 10,
                          lineHeight: 1.3,
                        }}
                      >
                        {item.title}
                      </h3>
                      {item.excerpt && (
                        <p
                          style={{
                            fontSize: 14,
                            color: COLOR.textMuted,
                            marginTop: 0,
                            marginBottom: 12,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            lineHeight: 1.4,
                          }}
                        >
                          {item.excerpt}
                        </p>
                      )}
                    </div>
                    {item.date && typeof item.date === "string" ? (
                      <time style={{ fontSize: 12, color: "#6B7280" }}>
                        {item.date}
                      </time>
                    ) : null}
                  </>
                )}
              </Link>
            ))}
            {(!tabItems[noticeTab] || tabItems[noticeTab].length === 0) && (
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
          marginBottom: 40,
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
            {/* 복지디자인 소개 */}
            <Link
              to="/about/what"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                borderRadius: TOKENS.radius,
                padding: 24,
                textDecoration: "none",
                color: "inherit",
                background: hoverIntro ? "#F4B7311A" : "#fff",
                boxShadow: hoverIntro ? TOKENS.shadowHover : TOKENS.shadowSm,
                minHeight: 150,
                gap: 12,
                transform: hoverIntro ? "translateY(-3px)" : "translateY(0)",
                transition: "all .18s ease",
                outline: "none",
              }}
              onMouseEnter={() => setHoverIntro(true)}
              onMouseLeave={() => setHoverIntro(false)}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 999,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: hoverIntro ? "#F4B73126" : COLOR.neutralTint,
                  color: "#F4B731",
                  fontSize: 24,
                }}
              >
                📘
              </div>
              <strong style={{ fontSize: 18, fontWeight: 700 }}>
                복지디자인 소개
              </strong>
              <span style={{ fontSize: 14, color: "#3a3a3a" }}>
                조합의 비전과 연혁을 확인하세요.
              </span>
            </Link>
            {/* 사업 안내 */}
            <Link
              to="/business/overview"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                borderRadius: TOKENS.radius,
                padding: 24,
                textDecoration: "none",
                color: "inherit",
                background: hoverEmail ? "#ED6A3214" : "#fff",
                boxShadow: hoverEmail ? TOKENS.shadowHover : TOKENS.shadowSm,
                minHeight: 150,
                gap: 12,
                transform: hoverEmail ? "translateY(-3px)" : "translateY(0)",
                transition: "all .18s ease",
                outline: "none",
              }}
              onMouseEnter={() => setHoverEmail(true)}
              onMouseLeave={() => setHoverEmail(false)}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 999,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: hoverEmail
                    ? "#ED6A3222"
                    : COLOR.neutralTint,
                  color: "#ED6A32",
                  fontSize: 24,
                }}
              >
                📊
              </div>
              <strong style={{ fontSize: 18, fontWeight: 700 }}>
                사업 안내
              </strong>
              <span style={{ fontSize: 14, color: "#3a3a3a" }}>
                복지디자인의 사업을 확인하세요.
              </span>
            </Link>
            {/* 후원 가입 신청하기 */}
            <Link
              to="/support/guide"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                borderRadius: TOKENS.radius,
                padding: 24,
                textDecoration: "none",
                color: "inherit",
                background: hoverSupport ? "#3BA7A01A" : "#fff",
                boxShadow: hoverSupport ? TOKENS.shadowHover : TOKENS.shadowSm,
                minHeight: 150,
                gap: 12,
                transform: hoverSupport ? "translateY(-3px)" : "translateY(0)",
                transition: "all .18s ease",
                outline: "none",
              }}
              onMouseEnter={() => setHoverSupport(true)}
              onMouseLeave={() => setHoverSupport(false)}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 999,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: hoverSupport
                    ? "#3BA7A026"
                    : COLOR.neutralTint,
                  color: "#3BA7A0",
                  fontSize: 24,
                }}
              >
                💙
              </div>
              <strong style={{ fontSize: 18, fontWeight: 700 }}>
                후원 가입 신청하기
              </strong>
              <span style={{ fontSize: 14, color: "#3a3a3a" }}>
                지속적 관심과 지지를 부탁드립니다.
              </span>
            </Link>
            {/* 조합 가입 신청하기 */}
            <Link
              to="/support"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                borderRadius: TOKENS.radius,
                padding: 24,
                textDecoration: "none",
                color: "inherit",
                background: hoverJoin ? "#ED6A3214" : "#fff",
                boxShadow: hoverJoin ? TOKENS.shadowHover : TOKENS.shadowSm,
                minHeight: 150,
                gap: 12,
                transform: hoverJoin ? "translateY(-3px)" : "translateY(0)",
                transition: "all .18s ease",
                outline: "none",
              }}
              onMouseEnter={() => setHoverJoin(true)}
              onMouseLeave={() => setHoverJoin(false)}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 999,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: hoverJoin
                    ? "#ED6A3222"
                    : COLOR.neutralTint,
                  color: "#ED6A32",
                  fontSize: 24,
                }}
              >
                🤝
              </div>
              <strong style={{ fontSize: 18, fontWeight: 700 }}>
                조합 가입 신청하기
              </strong>
              <span style={{ fontSize: 14, color: "#3a3a3a" }}>
                복지디자인의 미션에 함께해주세요.
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* 4) 복지디자인 소식 – 파란 패널 + 탭 풍의 보조 내비 + 필터 */}
      <section
        aria-labelledby="stories-heading"
        style={{
          background: COLOR.primaryTint, // 연한 청록 영역
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
              <small style={{ color: COLOR.textMuted, fontSize: 14 }}>
                행복한 소식을 만들어가는 복지디자인입니다.
              </small>
            </div>
            {/* 소식 카테고리 필터 */}
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              {storiesTabs.map((tab) => (
                <button
                  key={tab}
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
                    fontWeight: storiesTab === tab ? 700 : 400,
                    fontSize: 14,
                    transition: "all 0.2s",
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

          {filteredStories.length > 0 ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                gap: 22,
              }}
            >
              {filteredStories.slice(0, 4).map((item) => (
                <Link
                  key={item.id}
                  to={item.to}
                  style={{
                    borderRadius: TOKENS.radius,
                    background: "#fff",
                    boxShadow:
                      hoveredStory === item.id
                        ? TOKENS.shadowHover
                        : TOKENS.shadowSm,
                    transform:
                      hoveredStory === item.id
                        ? "translateY(-3px)"
                        : "translateY(0)",
                    transition: "all .18s ease",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    minHeight: 230,
                    textDecoration: "none",
                    color: "inherit",
                    // Remove border
                  }}
                  onMouseEnter={() => setHoveredStory(item.id)}
                  onMouseLeave={() => setHoveredStory(null)}
                >
                  {/* 썸네일 */}
                  <div
                    style={{
                      height: 150,
                      overflow: "hidden",
                      backgroundColor: COLOR.neutralTint,
                      borderBottom: `1px solid ${COLOR.line}`,
                    }}
                  >
                    {item.thumbnail ? (
                      <img
                        src={item.thumbnail}
                        alt={item.title}
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
                        📰
                      </div>
                    )}
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
                        fontSize: 18,
                        fontWeight: 700,
                        margin: 0,
                        marginBottom: 8,
                        lineHeight: 1.3,
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
                </Link>
              ))}
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                gap: 22,
              }}
            >
              {/* 소식 카드 4개 자리 – 데이터 없을 땐 플레이스홀더 링크 */}
              {[0, 1, 2, 3].map((i) => (
                <Link
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
                    📰
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
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
