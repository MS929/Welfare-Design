// -----------------------------------------------------------------------------
// [페이지 목적]
//  - "복지디자인 이야기"(스토리) 목록 페이지
//  - /src/content/stories 폴더의 md/mdx 파일을 읽어 목록을 구성
//
// [데이터 구성 규칙]
//  - 파일명 규칙(권장): YYYY-MM-DD-슬러그.md[x]
//  - 또는 프론트매터(title/date/excerpt)를 우선 사용
//  - 최신 날짜가 위로 오도록 내림차순 정렬
// -----------------------------------------------------------------------------
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import matter from "gray-matter";

// -----------------------------------------------------------------------------
// [유틸] 파일명에서 날짜/슬러그 추출
//  - 파일명 규칙: YYYY-MM-DD-제목(or-slug).md / .mdx
//  - 날짜가 없으면 date=null 로 처리
//  - slug는 URL 경로에 사용되므로 영문/숫자/한글/하이픈 위주로 정규화
// -----------------------------------------------------------------------------
function parseDatedSlug(filepath) {
  const name = filepath.split("/").pop() || "";
  // 예) 2025-12-31-welfare-design-story.mdx
  const m = name.match(/^(\d{4}-\d{2}-\d{2})-(.+)\.(md|mdx)$/);
  if (!m)
    return {
      date: null,
      slug: name.replace(/\.(md|mdx)$/i, ""),
      titleFromFile: name,
    };
  const [, date, rest] = m;
  // URL에 안전하게 쓰기 위해 문자열을 정규화
  //  - normalize("NFKD") + 결합문자 제거: á → a 처럼 분리/단순화
  //  - 공백/특수문자 → '-' 치환, 앞뒤 하이픈 제거, 소문자 변환
  const slug = rest
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9가-힣-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
  return { date, slug, titleFromFile: rest };
}

// -----------------------------------------------------------------------------
// [유틸] 날짜 값을 "YYYY-MM-DD" 형태 문자열로 정규화
//  - 프론트매터 date가 문자열/Date/객체 형태여도 최대한 안전하게 처리
//  - 파싱 실패 시 빈 문자열 반환
// -----------------------------------------------------------------------------
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
      // stories 폴더의 md/mdx를 모두 읽어 목록 데이터로 변환
      // Vite의 import.meta.glob 기능을 사용해 파일을 한 번에 가져온다.
      //  - eager: true        → 빌드/로딩 시점에 즉시 로드
      //  - query: "?raw"      → 파일 내용을 문자열(raw)로 가져옴
      //  - import: "default"  → default export(문자열) 사용
      const modules = import.meta.glob("/src/content/stories/*.{md,mdx}", {
        eager: true,
        query: "?raw",
        import: "default",
      });

      // 각 파일의 raw markdown을 gray-matter로 파싱하여 프론트매터/본문을 분리
      const list = Object.entries(modules).map(([path, raw]) => {
        const { data, content } = matter(raw);
        const meta = parseDatedSlug(path);
        return {
          id: path,
          title: data?.title || meta.titleFromFile,
          date: formatDate(data?.date) || formatDate(meta.date),
          // excerpt가 없으면 본문 앞 120자 정도를 대체 요약으로 사용
          // 줄바꿈은 한 줄로 정리해 리스트에서 깔끔하게 보이도록 처리
          excerpt: (data?.excerpt || content?.slice(0, 120) || "").replace(
            /\n/g,
            " "
          ),
          to: `/news/stories/${meta.slug}`,
        };
      });

      // 최신 날짜가 먼저 보이도록 내림차순 정렬
      list.sort((a, b) => (a.date > b.date ? -1 : 1));
      setItems(list);
    } catch (e) {
      // 파일 로딩/파싱에 실패해도 화면이 깨지지 않도록 빈 배열로 폴백
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
