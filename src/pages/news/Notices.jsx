// src/pages/news/Notices.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import matter from "gray-matter";

export default function NewsNotices() {
  const [items, setItems] = useState(null); // null=로딩, []=비었음
  const [debug, setDebug] = useState("");

  useEffect(() => {
    (async () => {
      try {
        // 기본 경로
        const a = import.meta.glob("./src/content/notices/*.md", { as: "raw" });
        // 혹시 과거에 다른 위치에 저장된 적이 있다면(임시 백업 경로)
        const b = import.meta.glob("./src/content/notice/*.md", { as: "raw" });
        const c = import.meta.glob("./src/content/news/*.md", { as: "raw" });

        const modules = { ...a, ...b, ...c };
        const paths = Object.keys(modules);

        if (paths.length === 0) {
          setDebug("glob 결과가 0개입니다. (경로 확인 필요)");
          setItems([]);
          return;
        }

        const loaded = await Promise.all(
          paths.map(async (p) => {
            const raw = await modules[p]();
            const { data, content } = matter(raw);
            // slug = 파일명 (확장자 제외)
            const slug = p.split("/").pop().replace(/\.md$/, "");
            return { slug, ...data, content };
          })
        );

        // frontmatter에 date가 있다면 최신순 정렬
        loaded.sort((x, y) => {
          const dx = x.date ? new Date(x.date).getTime() : 0;
          const dy = y.date ? new Date(y.date).getTime() : 0;
          return dy - dx;
        });

        setItems(loaded);
        setDebug(`로드 개수: ${loaded.length} (${paths.length} 파일 감지)`);
      } catch (e) {
        setDebug(`에러: ${e.message}`);
        setItems([]);
      }
    })();
  }, []);

  if (items === null) {
    return (
      <div className="max-w-screen-md mx-auto px-4 py-16">
        <h1 className="text-3xl font-extrabold">공지/공모</h1>
        <p className="text-gray-500 mt-2">로딩 중…</p>
      </div>
    );
  }

  return (
    <div className="max-w-screen-md mx-auto px-4 py-16">
      <h1 className="text-3xl font-extrabold">공지/공모</h1>
      <p className="text-gray-500 mt-2">공지/공모 글 목록이 표시됩니다.</p>

      {/* 디버그(임시) — 문제가 있을 때만 보려고 희미하게 */}
      <p className="mt-3 text-xs text-gray-400">{debug}</p>

      <div className="mt-8 space-y-4">
        {items.length === 0 ? (
          <div className="text-gray-500">등록된 글이 없습니다.</div>
        ) : (
          items.map((n) => (
            <Link
              key={n.slug}
              to={`/news/notices/${n.slug}`}
              className="block border rounded-xl p-4 hover:bg-gray-50"
            >
              <div className="flex gap-4 items-center">
                {/* 썸네일 */}
                {n.thumbnail ? (
                  <img
                    src={n.thumbnail}
                    alt=""
                    className="w-28 h-20 rounded-lg object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-28 h-20 rounded-lg bg-gray-100" />
                )}

                <div className="min-w-0">
                  <h3 className="text-lg font-semibold truncate">{n.title}</h3>
                  {n.date && (
                    <p className="text-sm text-gray-500">
                      {new Date(n.date).toISOString().slice(0, 10)}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
