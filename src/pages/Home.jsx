// src/pages/Home.jsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import matter from "gray-matter";

// 브랜드 컬러 팔레트 (로고 기준)
const COLOR = {
  primary: "#0EA5A3",     // 청록(메인)
  secondary: "#F59E0B",   // 주황(보조)
  accent: "#16A34A",      // 초록(강조)
  text: "#111827",
  textMuted: "#4B5563",
  line: "#E5E7EB",
  bg: "#F5F7FA",
  primaryTint: "#E6FAF9",
  secondaryTint: "#FFF7E6",
  accentTint: "#E9F9EE",
  neutralTint: "#F9FAFB",
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

  const NOTICE_CARD_MIN_H = 220; // 공지/공모 카드 공통 높이
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
    <main className="home-wrap">
      <style>{`
  /* ===== Home local styles (scoped-ish) ===== */
  .home-wrap{--c-primary:#0EA5A3;--c-secondary:#F59E0B;--c-accent:#16A34A;--c-text:#111827;--c-muted:#6B7280;--c-line:#E5E7EB;--c-bg:#F5F7FA;--c-tint:#E6FAF9;}
  .hero{background: radial-gradient(1200px 600px at 20% -10%, #E6FAF9 0, transparent 70%),
                   radial-gradient(1200px 600px at 120% 10%, #FFF7E6 0, transparent 70%),
                   linear-gradient(180deg, #FFFFFF, #F9FAFB);border-bottom:1px solid var(--c-line)}
  .hero .inner{max-width:1440px;margin:0 auto;padding:32px 24px;display:grid;grid-template-columns:1.1fr 1fr;gap:28px;align-items:center}
  .hero h1{margin:0 0 6px;font-weight:900;line-height:1.2;font-size:clamp(24px,2.6vw,36px);color:var(--c-text)}
  .hero .subtitle{color:var(--c-muted);font-size:clamp(13px,1.4vw,16px);margin-bottom:10px}
  .hero .img{height:300px;border-radius:16px;overflow:hidden;box-shadow:0 16px 40px rgba(0,0,0,.12);border:1px solid var(--c-line)}
  .hero .img img{width:100%;height:100%;object-fit:cover}

  .quick-grid{display:flex;gap:16px;flex-wrap:wrap;justify-content:center;margin-top:22px}
  .quick-card{width:230px;min-height:120px;border-radius:16px;background:#FFF7E6;border:1px solid var(--c-line);
              display:grid;place-items:center;text-decoration:none;color:inherit;box-shadow:0 6px 16px rgba(0,0,0,.08);
              transition:transform .18s ease, box-shadow .18s ease}
  .quick-card:hover{transform:translateY(-2px);box-shadow:0 10px 20px rgba(0,0,0,.12)}

  .section{max-width:1440px;margin:0 auto;padding:0 24px}
  .section-head{display:flex;justify-content:space-between;align-items:center;margin:8px 0 16px}
  .section-title{font-size:28px;font-weight:800;letter-spacing:-.2px;position:relative;display:inline-block}
  .section-title:after{content:"";position:absolute;left:0;bottom:-6px;width:42%;height:3px;background:linear-gradient(90deg,var(--c-primary),#34d399);border-radius:3px}

  .tabs{display:flex;gap:8px;align-items:center}
  .pill{padding:7px 14px;border-radius:999px;border:1px solid var(--c-line);background:#fff;color:var(--c-text);
        font-size:14px;cursor:pointer;transition:all .2s}
  .pill.active{border:2px solid var(--c-primary);background:#E6FAF9;color:var(--c-primary);font-weight:700}
  .more{color:var(--c-primary);text-decoration:none;font-weight:600}

  .grid-4{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:24px}
  .card{background:#fff;border:1px solid var(--c-line);border-radius:12px;box-shadow:0 4px 14px rgba(0,0,0,.06);padding:22px;
        display:flex;flex-direction:column;justify-content:space-between;min-height:210px;color:inherit;text-decoration:none;
        transition:transform .18s ease, box-shadow .18s ease}
  .card:hover{transform:translateY(-3px);box-shadow:0 10px 24px rgba(0,0,0,.10)}
  .card h3{font-size:16px;line-height:1.3;margin:0 0 10px}
  .card .meta{font-size:12px;color:var(--c-muted)}
  .thumb{height:120px;border-radius:8px;overflow:hidden;background:#F5F7FA;margin-bottom:12px}
  .thumb img{width:100%;height:100%;object-fit:cover}

  .cta-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:24px}
  .cta{display:flex;flex-direction:column;align-items:flex-start;border-radius:12px;padding:24px;text-decoration:none;color:inherit;
       min-height:160px;gap:12px;border:1px solid var(--c-line);box-shadow:0 6px 16px rgba(0,0,0,.06);transition:transform .18s ease}
  .cta:hover{transform:translateY(-2px)}

  .stories{background:#E6FAF9;border-top:1px solid var(--c-line);border-bottom:1px solid var(--c-line)}
  .story-card{background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 8px 18px rgba(0,0,0,.1);text-decoration:none;color:inherit;display:flex;flex-direction:column;min-height:230px;transition:transform .18s ease}
  .story-card:hover{transform:translateY(-3px)}
  .story-thumb{height:140px;background:#F5F7FA;overflow:hidden}
  .story-thumb img{width:100%;height:100%;object-fit:cover}

  @media (max-width: 1100px){
    .hero .inner{grid-template-columns:1fr}
    .hero .img{height:240px}
    .grid-4,.cta-grid{grid-template-columns:repeat(2,minmax(0,1fr))}
  }
  @media (max-width: 640px){
    .grid-4,.cta-grid{grid-template-columns:1fr}
  }
`}</style>
      {/* 0) 상단 간격 */}
      <div style={{ height: 8 }} />

      {/* 1) HERO – 상단 배너: 좌측 텍스트/버튼, 우측 큰 이미지 */}
      <section aria-label="메인 히어로" className="hero">
        <div className="inner">
          {/* 좌측 카피 + 동그라미 버튼들 */}
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            color: COLOR.text,
          }}>
            <div className="subtitle">지역의 이웃과 함께 성장하는 협동조합</div>
            <h1>
              복지 사각지대 없는 사회
              <br />
              <span style={{ display: "inline-block", marginTop: 6 }}>
                <strong>복지디자인 사회적협동조합</strong>이 함께 만들어갑니다
              </span>
            </h1>
            {/* 바로가기 카드 (복지디자인 사업) */}
            <div className="quick-grid">
              <Link to="/business/overview" className="quick-card">
                <div style={{ textAlign: "center", lineHeight: 1.25 }}>
                  <div style={{ fontSize: 28, marginBottom: 6 }}>📌</div>
                  <div style={{ fontSize: 15, color: COLOR.textMuted, fontWeight: 800 }}>
                    복지디자인 사업
                  </div>
                </div>
              </Link>
            </div>
          </div>
          {/* 우측 큰 이미지 */}
          <div className="img">
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
      <section aria-labelledby="notice-heading" className="section">
        <div className="section-head">
          <h2 id="notice-heading" className="section-title">
            공지사항
          </h2>
          <div className="tabs">
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => setNoticeTab(t)}
                className={"pill" + (noticeTab === t ? " active" : "")}
              >
                {t}
              </button>
            ))}
            <Link to="/news/notices" className="more">
              더 보기
            </Link>
          </div>
        </div>
        <div className="grid-4">
          {(tabItems[noticeTab] || []).slice(0, 4).map((item) => (
            <Link
              key={item.id}
              to={item.to}
              role="article"
              className="card"
            >
              {noticeTab === "공모" ? (
                <>
                  <div className="thumb">
                    {item.thumbnail ? (
                      <img src={item.thumbnail} alt={item.title} />
                    ) : (
                      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#bbb", fontSize: 36 }}>🖼️</div>
                    )}
                  </div>
                  <h3>{item.title}</h3>
                  {item.date && typeof item.date === "string" ? (
                    <time className="meta">{item.date}</time>
                  ) : null}
                </>
              ) : (
                <>
                  <div>
                    <h3>{item.title}</h3>
                    {item.excerpt && (
                      <p style={{ fontSize: 14, color: COLOR.textMuted, marginTop: 0, marginBottom: 12, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", lineHeight: 1.4 }}>
                        {item.excerpt}
                      </p>
                    )}
                  </div>
                  {item.date && typeof item.date === "string" ? (
                    <time className="meta">{item.date}</time>
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
      </section>

      {/* 3) 가입/후원/문의 CTA 박스 */}
      <section aria-label="가입/후원/문의" className="section">
        <div className="cta-grid">
          {/* 복지디자인 소개 */}
          <Link to="/about/what" className="cta" style={{ backgroundColor: COLOR.accentTint }}>
            <div style={{ fontSize: 36, lineHeight: 1, color: COLOR.accent }}>
              📘
            </div>
            <strong style={{ fontSize: 18, fontWeight: 700 }}>
              복지디자인 소개
            </strong>
            <span style={{ fontSize: 14, color: "#3a3a3a" }}>
              조합의 비전과 연혁을 확인하세요.
            </span>
          </Link>
          {/* 후원 가입 신청하기 */}
          <Link to="/support/guide" className="cta" style={{ backgroundColor: COLOR.primaryTint }}>
            <div style={{ fontSize: 36, lineHeight: 1, color: COLOR.primary }}>
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
          <Link to="/support" className="cta" style={{ backgroundColor: COLOR.secondaryTint }}>
            <div style={{ fontSize: 36, lineHeight: 1, color: COLOR.secondary }}>
              🤝
            </div>
            <strong style={{ fontSize: 18, fontWeight: 700 }}>
              조합 가입 신청하기
            </strong>
            <span style={{ fontSize: 14, color: "#3a3a3a" }}>
              복지디자인의 미션에 함께해주세요.
            </span>
          </Link>
          {/* 이메일로 문의하기 */}
          <a href="mailto:welfarecoop@naver.com" className="cta" style={{ backgroundColor: COLOR.neutralTint }}>
            <div style={{ fontSize: 36, lineHeight: 1, color: COLOR.textMuted }}>
              ✉️
            </div>
            <strong style={{ fontSize: 18, fontWeight: 700 }}>
              이메일로 문의하기
            </strong>
            <span style={{ fontSize: 14, color: "#3a3a3a" }}>
              궁금하신 사항이 있으시면 메일을 보내주세요.
            </span>
          </a>
        </div>
      </section>


      {/* 4) 복지디자인 소식 – 파란 패널 + 탭 풍의 보조 내비 + 필터 */}
      <section aria-labelledby="stories-heading" className="stories">
        <div className="section">
          <div className="section-head">
            <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
              <h2 id="stories-heading" style={{ fontSize: 26, fontWeight: 800, margin: 0, color: COLOR.primary }}>
                복지디자인 소식
              </h2>
              <small style={{ color: COLOR.textMuted, fontSize: 14 }}>
                행복한 소식을 만들어가는 복지디자인입니다.
              </small>
            </div>
            {/* 소식 카테고리 필터 */}
            <div className="tabs">
              {storiesTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setStoriesTab(tab)}
                  className={"pill" + (storiesTab === tab ? " active" : "")}
                >
                  {tab}
                </button>
              ))}
              <Link to="/news/stories" className="more">
                전체보기
              </Link>
            </div>
          </div>
          {filteredStories.length > 0 ? (
            <div className="grid-4">
              {filteredStories.slice(0, 4).map((item) => (
                <Link
                  key={item.id}
                  to={item.to}
                  className="story-card"
                >
                  {/* 썸네일 */}
                  <div className="story-thumb">
                    {item.thumbnail ? (
                      <img
                        src={item.thumbnail}
                        alt={item.title}
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
                  <div style={{
                    padding: 16,
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}>
                    <h3 style={{
                      fontSize: 18,
                      fontWeight: 700,
                      margin: 0,
                      marginBottom: 10,
                      lineHeight: 1.3,
                    }}>
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
            <div className="grid-4">
              {/* 소식 카드 4개 자리 – 데이터 없을 땐 플레이스홀더 링크 */}
              {[0, 1, 2, 3].map((i) => (
                <Link
                  key={i}
                  to="/news/stories"
                  className="story-card"
                  style={{
                    padding: 24,
                    display: "flex",
                    flexDirection: "column",
                    minHeight: 230,
                  }}
                >
                  <div
                    className="story-thumb"
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      fontSize: 48,
                      color: "#a3a3a3",
                      userSelect: "none",
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
