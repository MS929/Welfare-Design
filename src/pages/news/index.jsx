// src/pages/news/index.jsx
// '복지디자인 이야기' 목록 페이지
// - /src/content/stories 폴더의 md/mdx 파일을 읽어 목록을 만든다.
// - 파일명(YYYY-MM-DD-슬러그.md[x]) 또는 프론트매터(title/date/excerpt)를 기준으로
//   제목/날짜/요약을 구성하고, 최신 날짜가 위로 오도록 정렬한다.
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import matter from "gray-matter";

// 파일명에서 날짜/슬러그를 파싱한다.
// - 파일명 규칙: YYYY-MM-DD-제목(or-slug).md / .mdx
// - 날짜가 없으면 date=null 로 두고, slug는 확장자 제거 후 사용한다.
// - slug는 URL 경로에 쓰이므로 영문/숫자/한글/하이픈 중심으로 정규화한다.
function parseDatedSlug(filepath) {
  const name = filepath.split("/").pop() || "";
  // 예: 2025-12-31-welfare-design-story.mdx
  const m = name.match(/^(\d{4}-\d{2}-\d{2})-(.+)\.(md|mdx)$/);
  if (!m)
    return {
      date: null,
      slug: name.replace(/\.(md|mdx)$/i, ""),
      titleFromFile: name,
    };
  const [, date, rest] = m;
  // 유니코드 결합문자(악센트 등)를 제거하고, 허용 문자 외에는 하이픈으로 치환
  // - normalize("NFKD") + 결합문자 제거: á → a 처럼 URL 친화적으로 변환
  // - 공백/특수문자 → '-' 로 치환하고, 앞뒤 하이픈은 제거
  const slug = rest
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9가-힣-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
  return { date, slug, titleFromFile: rest };
}

// 날짜 값을 "YYYY-MM-DD" 형태 문자열로 정규화
// - 프론트매터 date가 문자열/Date/객체 형태로 들어와도 안전하게 처리
// - 파싱 실패 시 빈 문자열 반환
function formatDate(v) {
  if (!v) return "";
  try {
    if (typeof v === "string") return v.slice(0, 10);
    if (v instanceof Date && !isNaN(v)) return v.toISOString().slice(0, 10);
    if (typeof v === "object") {
      const d = new Date(v);
      if (!isNaN(d)) return d.toISOString().slice(0, 10);
    }
  } catch {}
  return "";
}

export default function NewsIndex() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    try {
      // stories 폴더의 md/mdx를 모두 읽어(빌드 시점 eager 로딩) 목록 데이터로 변환
      // Vite 기능: glob으로 파일들을 한 번에 가져온다.
      // - eager: true  → 빌드/로딩 시점에 즉시 로드
      // - query: '?raw' → 파일 내용을 문자열(raw)로 가져옴
      // - import: 'default' → default export(문자열) 사용
      const modules = import.meta.glob("/src/content/stories/*.{md,mdx}", {
        eager: true,
        query: "?raw",
        import: "default",
      });

      // 각 파일(raw markdown)을 gray-matter로 파싱하여 메타데이터/본문을 분리
      const list = Object.entries(modules).map(([path, raw]) => {
        const { data, content } = matter(raw);
        const meta = parseDatedSlug(path);
        return {
          id: path,
          title: data?.title || meta.titleFromFile,
          date: formatDate(data?.date) || formatDate(meta.date),
          // excerpt가 없으면 본문 앞 120자 정도를 대체 요약으로 사용
          // 줄바꿈은 한 줄로 정리하여 리스트에서 깔끔하게 보이도록 처리
          excerpt: (data?.excerpt || content?.slice(0, 120) || "").replace(
            /\n/g,
            " "
          ),
          to: `/news/stories/${meta.slug}`,
        };
      });

      // 최신 날짜가 먼저 오도록 내림차순 정렬
      list.sort((a, b) => (a.date > b.date ? -1 : 1));
      setItems(list);
    } catch (e) {
      // 런타임에서 파일 로딩/파싱에 실패해도 화면이 깨지지 않게 빈 배열로 폴백
      console.warn("뉴스 목록 로드 실패:", e);
      setItems([]);
    }
  }, []);

  // 화면 구성: 제목 + (비어있으면 안내 문구 / 있으면 카드형 리스트)
  return (
    <main style={{ maxWidth: 960, margin: "0 auto", padding: "24px 16px" }}>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 16 }}>
        복지디자인 이야기
      </h1>

      {/* 데이터가 없을 때 */}
      {items.length === 0 ? (
        <p style={{ color: "#666" }}>등록된 소식이 아직 없습니다.</p>
      ) : (
        <>
          {/* 데이터가 있을 때: 간단한 카드 리스트 */}
          <ul
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(1, minmax(0,1fr))",
              gap: 12,
              listStyle: "none",
              padding: 0,
            }}
          >
            {items.map((item) => (
              <li
                key={item.id}
                style={{
                  border: "1px solid #eee",
                  borderRadius: 10,
                  padding: 16,
                }}
              >
                {/* 카드 전체를 클릭하면 상세(/news/stories/:slug)로 이동 */}
                <Link
                  to={item.to}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <strong style={{ fontSize: 16 }}>{item.title}</strong>
                  <div style={{ fontSize: 12, color: "#8a8f93", marginTop: 6 }}>
                    {item.date}
                  </div>
                  {item.excerpt && (
                    <p style={{ fontSize: 14, color: "#555", marginTop: 8 }}>
                      {item.excerpt}
                    </p>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </main>
  );
}
