// src/pages/news/index.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import matter from "gray-matter";

// 파일명에서 날짜/슬러그 추출
function parseDatedSlug(filepath) {
  const name = filepath.split("/").pop() || "";
  const m = name.match(/^(\d{4}-\d{2}-\d{2})-(.+)\.(md|mdx)$/);
  if (!m)
    return {
      date: null,
      slug: name.replace(/\.(md|mdx)$/i, ""),
      titleFromFile: name,
    };
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
      // stories 폴더의 md/mdx를 모두 읽기
      const modules = import.meta.glob("/src/content/stories/*.{md,mdx}", {
        eager: true,
        query: "?raw",
        import: "default",
      });

      const list = Object.entries(modules).map(([path, raw]) => {
        const { data, content } = matter(raw);
        const meta = parseDatedSlug(path);
        return {
          id: path,
          title: data?.title || meta.titleFromFile,
          date: formatDate(data?.date) || formatDate(meta.date),
          excerpt: (data?.excerpt || content?.slice(0, 120) || "").replace(
            /\n/g,
            " "
          ),
          to: `/news/stories/${meta.slug}`,
        };
      });

      list.sort((a, b) => (a.date > b.date ? -1 : 1));
      setItems(list);
    } catch (e) {
      console.warn("뉴스 목록 로드 실패:", e);
      setItems([]);
    }
  }, []);

  return (
    <main style={{ maxWidth: 960, margin: "0 auto", padding: "24px 16px" }}>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 16 }}>
        복지디자인 이야기
      </h1>

      {items.length === 0 ? (
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
      )}
    </main>
  );
}
