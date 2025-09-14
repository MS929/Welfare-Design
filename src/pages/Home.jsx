// src/pages/Home.jsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import matter from "gray-matter";

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
  // 히어로 이미지: 우선 순위 경로 → 존재하지 않으면 /public/main.png 로 폴백
  const [heroSrc, setHeroSrc] = useState("/images/hero-hands.jpg");

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
        const meta = parseDatedSlug(path);
        const excerptSource = data?.description || content || "";
        const excerpt = excerptSource.replace(/\n/g, " ").slice(0, 200);
        return {
          id: path,
          title: data?.title || meta.titleFromFile,
          date: formatDate(data?.date) || formatDate(meta.date) || "",
          to: `/notices/${meta.slug}`,
          excerpt,
        };
      });

      items.sort((a, b) => (a.date > b.date ? -1 : 1));
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
        const meta = parseDatedSlug(path);
        const slugPart = meta.date ? `${meta.date}-${meta.slug}` : meta.slug;
        const to = slugPart ? `/news/stories/${slugPart}` : "/news";
        return {
          id: path,
          title: data?.title || meta.titleFromFile,
          date: formatDate(data?.date) || formatDate(meta.date) || "",
          to,
          thumbnail: data?.thumbnail || null,
        };
      });

      items.sort((a, b) => (a.date > b.date ? -1 : 1));
      setStories(items);
    } catch (e) {
      console.warn("스토리 로드 실패:", e);
      setStories([]);
    }
  }, []);

  // 탭 정의 (공지 외 탭은 우선 공지와 동일 목록/또는 비워 두기)
  const tabs = ["공지", "채용", "교육", "자료", "기타"];
  const tabItems = useMemo(() => ({
    공지: notices,
    채용: [],
    교육: [],
    자료: [],
    기타: [],
  }), [notices]);

  return (
    <main>
      {/* 0) 상단 간격 */}
      <div style={{ height: 8 }} />

      {/* 1) HERO – 상단 배너: 좌측 텍스트/버튼, 우측 큰 이미지 */}
      <section aria-label="메인 히어로" style={{ position: "relative", width: "100%", background: "#f4f6f7", overflow: "hidden", borderBottom: "1px solid #e5e7eb", marginBottom: 24 }}>
        <div style={{
          maxWidth: 1400,
          margin: "0 auto",
          padding: "48px 24px",
          display: "grid",
          gridTemplateColumns: "minmax(520px, 1fr) minmax(520px, 1fr)",
          alignItems: "center",
          gap: 24,
        }}>
          {/* 좌측 카피 + 동그라미 버튼들 */}
          <div>
            <h1 style={{ margin: 0, fontSize: 40, lineHeight: 1.35, fontWeight: 900 }}>
              복지 사각지대 없는 사회
              <br />
              <span style={{ display: "inline-block", marginTop: 6 }}>
                <strong>복지디자인 사회적협동조합</strong>이 함께 만들어갑니다
              </span>
            </h1>

            {/* 원형 버튼 3개 */}
            <div style={{ display: "flex", gap: 36, marginTop: 36, flexWrap: "wrap" }}>
              {[
                { label: "복지동행\n운영사업", color: "#dff0da", icon: "🤝", to: "/business" },
                { label: "지역사회\n복지사업", color: "#e4eefc", icon: "🏙️", to: "/about" },
                { label: "복지시설\n운영사업", color: "#f7dee5", icon: "🏢", to: "/support" },
              ].map((b) => (
                <Link
                  key={b.label}
                  to={b.to}
                  style={{
                    width: 160,
                    height: 160,
                    borderRadius: "50%",
                    background: b.color,
                    display: "grid",
                    placeItems: "center",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
                    textDecoration: "none",
                    color: "inherit",
                    border: "1px solid #e5e7eb",
                  }}
                >
                  <div style={{ textAlign: "center", lineHeight: 1.25, whiteSpace: "pre-line" }}>
                    <div style={{ fontSize: 34, marginBottom: 8 }}>{b.icon}</div>
                    <div style={{ fontSize: 14, color: "#374151", fontWeight: 700 }}>{b.label}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* 우측 큰 이미지 */}
          <div style={{ position: "relative", height: 360, borderRadius: 12, overflow: "hidden", boxShadow: "0 8px 20px rgba(0,0,0,0.08)", background: "#fff" }}>
            <img
              src={heroSrc}
              alt="메인 히어로"
              onError={() => { if (heroSrc !== "/main.png") setHeroSrc("/main.png"); }}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        </div>
      </section>

      {/* 2) 공지사항 – 탭형 (공지 탭에 실제 데이터) */}
      <section aria-labelledby="notice-heading" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 16px", marginBottom: 40 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <h2 id="notice-heading" style={{ fontSize: 20, fontWeight: 700 }}>공지사항</h2>
          <div style={{ display: "flex", gap: 8 }}>
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => setNoticeTab(t)}
                style={{
                  padding: "6px 14px",
                  borderRadius: 999,
                  border: noticeTab === t ? "2px solid #0ea5e9" : "1px solid #e6e6e6",
                  background: noticeTab === t ? "#e6f7ff" : "#fff",
                  color: "#333",
                  cursor: "pointer",
                  fontWeight: noticeTab === t ? 700 : 400,
                  fontSize: 14,
                  transition: "all 0.2s",
                }}
              >
                {t}
              </button>
            ))}
            <Link to="/news" style={{ fontSize: 14, color: "#2a7ae4", marginLeft: 8, alignSelf: "center" }}>더 보기</Link>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 20 }}>
          {(tabItems[noticeTab] || []).slice(0, 3).map((item) => (
            <article
              key={item.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: 12,
                padding: 20,
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                minHeight: 180,
                backgroundColor: "#fff",
              }}
            >
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, lineHeight: 1.3 }}>
                  <Link to={item.to} style={{ color: "#111", textDecoration: "none" }}>
                    {item.title}
                  </Link>
                </h3>
                {item.excerpt && (
                  <p
                    style={{
                      fontSize: 14,
                      color: "#555",
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
                <time style={{ fontSize: 12, color: "#888" }}>{item.date}</time>
              ) : null}
            </article>
          ))}
          {(!tabItems[noticeTab] || tabItems[noticeTab].length === 0) && (
            <div style={{ gridColumn: "1 / -1", color: "#888", fontSize: 14, textAlign: "center", padding: 24 }}>표시할 항목이 없습니다.</div>
          )}
        </div>
      </section>

      {/* 3) 가입/후원/문의 CTA 박스 */}
      <section aria-label="가입/후원/문의" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 16px", marginBottom: 40 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 20 }}>
          <Link
            to="/support"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              borderRadius: 12,
              padding: 24,
              textDecoration: "none",
              color: "inherit",
              backgroundColor: "#e9f6ef",
              boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
              minHeight: 160,
              gap: 12,
            }}
          >
            <div style={{ fontSize: 36, lineHeight: 1, color: "#34a853" }}>🤝</div>
            <strong style={{ fontSize: 18, fontWeight: 700 }}>조합 가입 신청하기</strong>
            <span style={{ fontSize: 14, color: "#3a3a3a" }}>복지디자인의 미션에 함께해주세요.</span>
          </Link>

          <Link
            to="/support"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              borderRadius: 12,
              padding: 24,
              textDecoration: "none",
              color: "inherit",
              backgroundColor: "#eef5ff",
              boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
              minHeight: 160,
              gap: 12,
            }}
          >
            <div style={{ fontSize: 36, lineHeight: 1, color: "#3b82f6" }}>💙</div>
            <strong style={{ fontSize: 18, fontWeight: 700 }}>후원 가입 신청하기</strong>
            <span style={{ fontSize: 14, color: "#3a3a3a" }}>지속적 관심과 지지를 부탁드립니다.</span>
          </Link>

          <a
            href="mailto:welfarecoop@naver.com"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              borderRadius: 12,
              padding: 24,
              textDecoration: "none",
              color: "inherit",
              backgroundColor: "#f9e9ee",
              boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
              minHeight: 160,
              gap: 12,
            }}
          >
            <div style={{ fontSize: 36, lineHeight: 1, color: "#ef4444" }}>✉️</div>
            <strong style={{ fontSize: 18, fontWeight: 700 }}>이메일로 문의하기</strong>
            <span style={{ fontSize: 14, color: "#3a3a3a" }}>궁금하신 사항이 있으시면 메일을 보내주세요.</span>
          </a>
        </div>
      </section>

      {/* 4) 복지디자인 소식 – 파란 패널 + 탭 풍의 보조 내비 */}
      <section
        aria-labelledby="stories-heading"
        style={{
          background: "#d9f0e7", // 연한 파란-초록 영역 느낌
          borderTop: "1px solid #c3e0d4",
          borderBottom: "1px solid #c3e0d4",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 16px 40px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
              <h2 id="stories-heading" style={{ fontSize: 24, fontWeight: 800, margin: 0, color: "#0f5132" }}>복지디자인 소식</h2>
              <small style={{ color: "#3a6351", fontSize: 14 }}>행복한 소식을 만들어가는 복지디자인입니다.</small>
            </div>
            {/* 보조 탭 (링크) */}
            <nav aria-label="소식 분류" style={{ display: "flex", gap: 16, flexShrink: 0 }}>
              <Link to="/news" style={{ fontSize: 14, color: "#0f5132", textDecoration: "none", fontWeight: 600 }}>활동소식</Link>
              <span style={{ color: "#a3b8ac" }}>|</span>
              <Link to="/about" style={{ fontSize: 14, color: "#0f5132", textDecoration: "none", fontWeight: 600 }}>소식지</Link>
              <span style={{ color: "#a3b8ac" }}>|</span>
              <Link to="/support" style={{ fontSize: 14, color: "#0f5132", textDecoration: "none", fontWeight: 600 }}>복지알리미</Link>
            </nav>
          </div>

          {stories.length > 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 20 }}>
              {stories.slice(0, 3).map((item) => (
                <article
                  key={item.id}
                  style={{
                    borderRadius: 12,
                    background: "#fff",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    minHeight: 240,
                  }}
                >
                  {/* 썸네일 */}
                  <div style={{ height: 140, overflow: "hidden", backgroundColor: "#f0f0f0" }}>
                    {item.thumbnail ? (
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    ) : (
                      <div style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        color: "#a3a3a3",
                        fontSize: 48,
                        userSelect: "none",
                      }}>
                        📰
                      </div>
                    )}
                  </div>
                  <div style={{ padding: 16, flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0, marginBottom: 10, lineHeight: 1.3 }}>
                      <Link to={item.to} style={{ color: "#0f5132", textDecoration: "none" }}>{item.title}</Link>
                    </h3>
                    {item.date && typeof item.date === "string" ? (
                      <time style={{ fontSize: 13, color: "#5b7a62" }}>{item.date}</time>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 20 }}>
              {/* 소식 카드 3개 자리 – 데이터 없을 땐 플레이스홀더 링크 */}
              {[0,1,2].map((i) => (
                <Link key={i} to="/news" style={{ borderRadius: 12, background: "#fff", padding: 24, textDecoration: "none", color: "inherit", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", display: "flex", flexDirection: "column", minHeight: 240 }}>
                  <div style={{ height: 140, backgroundColor: "#f0f0f0", display: "flex", justifyContent: "center", alignItems: "center", fontSize: 48, color: "#a3a3a3", userSelect: "none" }}>📰</div>
                  <strong style={{ display: "block", fontSize: 18, marginTop: 16, marginBottom: 8, color: "#0f5132" }}>복지디자인 이야기</strong>
                  <span style={{ fontSize: 14, color: "#5b7a62" }}>우리 활동과 소식을 만나보세요.</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
