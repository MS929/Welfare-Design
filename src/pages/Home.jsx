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

  // 공지: 실제 파일 로드 (Decap CMS가 커밋한 md 기준)
  useEffect(() => {
    try {
      const modules = import.meta.glob("/src/content/notices/*.{md,mdx}", {
        eager: true,
        query: "?raw",
        import: "default",
      });

      const items = Object.entries(modules).map(([path, raw]) => {
        const { data } = matter(raw);
        const meta = parseDatedSlug(path);
        return {
          id: path,
          title: data?.title || meta.titleFromFile,
          date: formatDate(data?.date) || formatDate(meta.date) || "",
          to: `/notices/${meta.slug}`,
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
        return {
          id: path,
          title: data?.title || meta.titleFromFile,
          date: formatDate(data?.date) || formatDate(meta.date) || "",
          to: meta.slug ? `/stories/${meta.slug}` : "/about",
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

      {/* 1) HERO – 좌 텍스트/우 이미지 */}
      <section
        aria-label="메인 히어로"
        style={{ maxWidth: 1200, margin: "0 auto", padding: "0 16px", marginBottom: 40 }}
      >
        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 24, alignItems: "center" }}>
          {/* 왼쪽 – 카피 + 4개 원형 바로가기 */}
          <div>
            <p style={{ fontSize: 28, lineHeight: 1.5, margin: 0, fontWeight: 700 }}>
              복지 사각지대 없는 사회
              <br />
              <span style={{ color: "#0ea5e9" }}>복지디자인 사회적협동조합</span>이 함께
              <br />
              만들어갑니다.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 80px)", gap: 16, marginTop: 20 }}>
              {[
                { label: "조합원 지원", to: "/support" },
                { label: "사회공헌", to: "/business" },
                { label: "지정기탁", to: "/support" },
                { label: "운영소식", to: "/news" },
              ].map((b) => (
                <Link
                  key={b.label}
                  to={b.to}
                  style={{ width: 80, height: 80, borderRadius: "50%", display: "grid", placeItems: "center", textDecoration: "none", color: "#333", border: "1px solid #eee", background: "#fff" }}
                >
                  <span style={{ fontSize: 12, textAlign: "center" }}>{b.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* 오른쪽 – 고정 이미지 (1번 사진) */}
          <div style={{ borderRadius: 12, overflow: "hidden" }}>
            <img src="/images/main.jpeg" alt="메인 히어로" style={{ width: "100%", height: "auto" }} />
          </div>
        </div>
      </section>

      {/* 2) 공지사항 – 탭형 (공지 탭에 실제 데이터) */}
      <section aria-labelledby="notice-heading" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 16px", marginBottom: 40 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h2 id="notice-heading" style={{ fontSize: 20, fontWeight: 700 }}>공지사항</h2>
          <div style={{ display: "flex", gap: 8 }}>
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => setNoticeTab(t)}
                style={{ padding: "6px 10px", borderRadius: 999, border: noticeTab === t ? "1px solid #0ea5e9" : "1px solid #e6e6e6", background: noticeTab === t ? "#e6f7ff" : "#fff", color: "#333", cursor: "pointer" }}
              >
                {t}
              </button>
            ))}
            <Link to="/news" style={{ fontSize: 14, color: "#2a7ae4", marginLeft: 8 }}>더 보기</Link>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 16 }}>
          {(tabItems[noticeTab] || []).slice(0, 3).map((item) => (
            <article key={item.id} style={{ border: "1px solid #eee", borderRadius: 8, padding: 16 }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>
                <Link to={item.to} style={{ color: "inherit", textDecoration: "none" }}>
                  {item.title}
                </Link>
              </h3>
              {item.date && typeof item.date === "string" ? (
                <time style={{ fontSize: 12, color: "#999" }}>{item.date}</time>
              ) : null}
            </article>
          ))}
          {(!tabItems[noticeTab] || tabItems[noticeTab].length === 0) && (
            <div style={{ gridColumn: "1 / -1", color: "#888", fontSize: 14 }}>표시할 항목이 없습니다.</div>
          )}
        </div>
      </section>

      {/* 5) 복지디자인 이야기 섹션 */}
      <section aria-labelledby="stories-heading" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 16px", marginBottom: 48 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h2 id="stories-heading" style={{ fontSize: 20, fontWeight: 700 }}>복지디자인 이야기</h2>
          <Link to="/about" style={{ fontSize: 14, color: "#2a7ae4" }}>더 보기</Link>
        </div>

        {stories.length > 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 16 }}>
            {stories.slice(0, 3).map((item) => (
              <article key={item.id} style={{ border: "1px solid #eee", borderRadius: 8, padding: 16 }}>
                <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>
                  <Link to={item.to} style={{ color: "inherit", textDecoration: "none" }}>
                    {item.title}
                  </Link>
                </h3>
                {item.date && typeof item.date === "string" ? (
                  <time style={{ fontSize: 12, color: "#999" }}>{item.date}</time>
                ) : null}
              </article>
            ))}
          </div>
        ) : (
          <Link to="/about" style={{ display: "block", border: "1px solid #eee", borderRadius: 8, padding: 24, textDecoration: "none", color: "inherit", textAlign: "center" }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>복지디자인 이야기</h3>
            <p style={{ fontSize: 14, color: "#666" }}>우리 활동과 소식을 만나보세요.</p>
          </Link>
        )}
      </section>

      {/* 4) 가입/후원/문의 CTA 박스 */}
      <section aria-label="가입/후원/문의" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 16px", marginBottom: 40 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 16 }}>
          <Link to="/support" style={{ display: "block", border: "1px solid #eaeaea", borderRadius: 12, padding: 20, textDecoration: "none", color: "inherit" }}>
            <strong style={{ display: "block", marginBottom: 8 }}>조합 가입 신청하기</strong>
            <span style={{ fontSize: 14, color: "#666" }}>복지디자인의 미션에 함께해주세요.</span>
          </Link>

          <Link to="/support" style={{ display: "block", border: "1px solid #eaeaea", borderRadius: 12, padding: 20, textDecoration: "none", color: "inherit" }}>
            <strong style={{ display: "block", marginBottom: 8 }}>후원 가입 신청하기</strong>
            <span style={{ fontSize: 14, color: "#666" }}>지속적 관심과 지지를 부탁드립니다.</span>
          </Link>

          <a href="mailto:welfarecoop@naver.com" style={{ display: "block", border: "1px solid #eaeaea", borderRadius: 12, padding: 20, textDecoration: "none", color: "inherit" }}>
            <strong style={{ display: "block", marginBottom: 8 }}>이메일로 문의하기</strong>
            <span style={{ fontSize: 14, color: "#666" }}>궁금하신 사항이 있으시면 메일을 보내주세요.</span>
          </a>
        </div>
      </section>
    </main>
  );
}
