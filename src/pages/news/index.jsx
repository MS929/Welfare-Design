// -----------------------------------------------------------------------------
// "복지디자인 이야기" 목록 페이지입니다.
// src/content/stories 폴더의 CMS 마크다운 파일을 빌드 시점에 읽어 최신순으로 보여줍니다.
// -----------------------------------------------------------------------------
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const STORY_INDEX_MODULES = import.meta.glob("../../content/stories/*.{md,mdx}", {
  query: "?raw",
  import: "default",
  eager: true,
});

// 파일명 규칙(YYYY-MM-DD-title.md[x])에 맞춰 날짜와 URL용 slug를 추출합니다.
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

// frontmatter나 파일명에서 얻은 날짜 값을 화면에 표시할 YYYY-MM-DD 형식으로 맞춥니다.
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

// 간단한 YAML frontmatter를 파싱해 목록 카드에 사용할 제목, 날짜, 요약 정보를 가져옵니다.
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

// 로드한 마크다운 파일을 목록 아이템 형태로 변환하고 최신 날짜순으로 정렬합니다.
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
    // 컴포넌트가 사라진 뒤 비동기 결과가 state를 변경하지 않도록 방지합니다.
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
