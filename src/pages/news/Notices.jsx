// src/pages/news/Notices.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import matter from "gray-matter";

export default function NewsNotices() {
  const [items, setItems] = useState(null); // null=로딩, []=없음
  const [debug, setDebug] = useState({}); // 어떤 패턴이 몇 개 잡혔는지 표시

  useEffect(() => {
    (async () => {
      try {
        // ✅ 세 가지 패턴을 모두 시도해서 뭐가 잡히는지 화면에 표기
        const g1 = import.meta.glob("/src/content/notices/*.md", { as: "raw" });
        const g2 = import.meta.glob("./src/content/notices/*.md", {
          as: "raw",
        });
        const g3 = import.meta.glob("../content/notices/*.md", { as: "raw" }); // 현재 파일 위치 기준( src/pages/news )

        const all = { ...g1, ...g2, ...g3 };
        const keysByPattern = {
          "/src/content/notices/*.md": Object.keys(g1),
          "./src/content/notices/*.md": Object.keys(g2),
          "../content/notices/*.md": Object.keys(g3),
        };

        setDebug({
          matchedCounts: {
            "/src/content/notices/*.md":
              keysByPattern["/src/content/notices/*.md"].length,
            "./src/content/notices/*.md":
              keysByPattern["./src/content/notices/*.md"].length,
            "../content/notices/*.md":
              keysByPattern["../content/notices/*.md"].length,
          },
          matchedPaths: [
            ...keysByPattern["/src/content/notices/*.md"],
            ...keysByPattern["./src/content/notices/*.md"],
            ...keysByPattern["../content/notices/*.md"],
          ],
        });

        const paths = Object.keys(all);
        if (paths.length === 0) {
          setItems([]);
          return;
        }

        const loaded = await Promise.all(
          paths.map(async (p) => {
            const raw = await all[p]();
            const { data, content } = matter(raw);
            const slug = p.split("/").pop().replace(/\.md$/, "");
            return { slug, ...data, content };
          })
        );

        loaded.sort((a, b) => {
          const da = a.date ? new Date(a.date).getTime() : 0;
          const db = b.date ? new Date(b.date).getTime() : 0;
          return db - da;
        });

        setItems(loaded);
      } catch (e) {
        setDebug((d) => ({ ...d, error: e.message }));
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

      {/* ===== 디버그 박스 (임시) ===== */}
      <div className="mt-6 rounded-lg border bg-gray-50 p-4">
        <div className="text-xs text-gray-600 font-mono">
          <div className="font-semibold mb-1">[DEBUG] matchedCounts</div>
          <pre>{JSON.stringify(debug.matchedCounts, null, 2)}</pre>
          <div className="font-semibold mt-3 mb-1">[DEBUG] matchedPaths</div>
          <pre className="max-h-40 overflow-auto">
            {JSON.stringify(debug.matchedPaths, null, 2)}
          </pre>
          {debug.error && (
            <>
              <div className="font-semibold mt-3 mb-1">[DEBUG] error</div>
              <pre>{debug.error}</pre>
            </>
          )}
        </div>
      </div>
      {/* ============================ */}

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
