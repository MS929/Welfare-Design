// -----------------------------------------------------------------------------
// [페이지 목적]
//  - "복지디자인 이야기"(스토리) 목록 페이지
//  - /src/content/stories/*.md[x] CMS markdown 파일을 빌드 시점에 읽어 목록을 구성
//
// [데이터 구성 규칙]
//  - CMS 저장 위치: src/content/stories/*.md[x]
//  - GitHub API 실시간 호출 없이 Vite import.meta.glob 로 로컬 CMS markdown을 사용
//  - 최신 날짜가 위로 오도록 내림차순 정렬
// -----------------------------------------------------------------------------
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const STORY_INDEX_MODULES = import.meta.glob("../../content/stories/*.{md,mdx}", {
  query: "?raw",
  import: "default",
  eager: true,
});

// -----------------------------------------------------------------------------
// [유틸] 파일명에서 날짜/슬러그 추출
//  - 파일명 규칙: YYYY-MM-DD-제목(or-slug).md / .mdx
// -----------------------------------------------------------------------------
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

// -----------------------------------------------------------------------------
// [유틸] 날짜 값을 "YYYY-MM-DD" 형태 문자열로 정규화
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

function parseFrontmatter(rawText) {
  const text = String(rawText || "");
  const match = text.match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/);

  if (!match) {
    return { data: {}, content: text.trim() };
  }

  const [, yaml, content] = match;
  const data = {};

  yaml.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;

    const idx = trimmed.indexOf(":");
    if (idx === -1) return;

    const key = trimmed.slice(0, idx).trim();
    let value = trimmed.slice(idx + 1).trim();

    value = value.replace(/^[']|[']$/g, "").replace(/^[\"]|[\"]$/g, "");
    data[key] = value;
  });

  return { data, content: content.trim() };
}

async function fetchStoryIndexItems() {
  const list = Object.entries(STORY_INDEX_MODULES).map(([path, raw]) => {
    const fileName = path.split("/").pop() || "";
    const { data, content } = parseFrontmatter(raw);
    const meta = parseDatedSlug(fileName);
    const slug = fileName.replace(/\.(md|mdx)$/i, "");
    const title = String(data?.title || meta.titleFromFile || "제목 없음").trim();
    const date = formatDate(data?.date) || formatDate(meta.date);
    const excerpt = String(data?.excerpt || content?.slice(0, 120) || "")
      .replace(/\n/g, " ")
      .trim();

    return {
      id: path,
      title,
      date,
      excerpt,
      to: `/news/stories/${encodeURIComponent(slug)}`,
    };
  });

  return list.filter(Boolean).sort((a, b) => {
    if (a.date === b.date) return String(b.id).localeCompare(String(a.id));
    return a.date > b.date ? -1 : 1;
  });
}

export default function NewsIndex() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    fetchStoryIndexItems()
      .then((list) => {
        if (!alive) return;
        setItems(list);
      })
      .catch((e) => {
        console.warn("뉴스 목록 CMS 데이터 로드 실패:", e);
        if (alive) setItems([]);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, []);

  return (
    <main style={{ maxWidth: 960, margin: "0 auto", padding: "24px 16px" }}>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 16 }}>
        복지디자인 이야기
      </h1>

      {loading ? (
        <p style={{ color: "#666" }}>소식을 불러오는 중입니다.</p>
      ) : items.length === 0 ? (
        <p style={{ color: "#666" }}>등록된 소식이 아직 없습니다.</p>
      ) : (
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
              <Link to={item.to} style={{ textDecoration: "none", color: "inherit" }}>
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
      )}
    </main>
  );
}
