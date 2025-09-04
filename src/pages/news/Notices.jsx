// src/pages/news/Notices.jsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import matter from "gray-matter";

// Card 컴포넌트를 이미 사용 중이라면 그대로 재사용
// (없다면 간단한 카드 UI를 여기서 작성하거나 기존 Stories 카드 import)
import Card from "../../components/Card";

// Buffer 폴리필이 src/main.jsx에서 window.Buffer = Buffer 로 세팅되어 있어야 합니다.

export default function NewsNotices() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    (async () => {
      // Decap v3 권장 방식: '?raw' 사용
      const modules = import.meta.glob("/src/content/notices/*.md", {
        query: "?raw",
        import: "default",
      });

      const files = await Promise.all(
        Object.entries(modules).map(async ([path, loader]) => {
          const raw = await loader();
          const { data, content } = matter(raw);
          const slug = path.split("/").pop().replace(/\.md$/, "");
          return {
            ...data,
            content,
            slug,
            // 날짜 정렬용 (없으면 0)
            _ts: data?.date ? new Date(data.date).getTime() : 0,
          };
        })
      );

      files.sort((a, b) => b._ts - a._ts);
      setItems(files);
    })();
  }, []);

  const grid = useMemo(
    () =>
      items.map((p) => (
        <Link
          key={p.slug}
          to={`/news/notices/${encodeURIComponent(p.slug)}`}
          className="block"
        >
          <Card
            title={p.title}
            date={p.date}
            thumbnail={p.thumbnail}
            // 필요 시 배지/카테고리 등 확장 가능
          />
        </Link>
      )),
    [items]
  );

  return (
    <div className="max-w-screen-lg mx-auto px-4 py-10">
      <h1 className="text-3xl font-extrabold mb-6">공지/공모</h1>

      {items.length === 0 ? (
        <p className="text-gray-500">등록된 글이 없습니다.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{grid}</div>
      )}
    </div>
  );
}
