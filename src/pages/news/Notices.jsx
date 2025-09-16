// src/pages/news/Notices.jsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import matter from "gray-matter";

// Vite 최신 권장: as:'raw' 대신 query:'?raw'
const modules = import.meta.glob("/src/content/notices/*.md", {
  query: "?raw",
  import: "default",
});

function normalizeDate(v) {
  try {
    // ISO, YYYY-MM-DD 모두 대응
    const d = new Date(v);
    if (!isNaN(d.getTime())) return d;
  } catch (_) {}
  return null;
}

export default function Notices() {
  const [items, setItems] = useState([]);
  const [tab, setTab] = useState("전체"); // 전체 | 공지 | 정보공개
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 9;

  useEffect(() => {
    (async () => {
      const entries = await Promise.all(
        Object.entries(modules).map(async ([path, loader]) => {
          const raw = await loader();
          const { data, content } = matter(raw);

          // /src/content/notices/2025-09-03-foo.md -> 2025-09-03-foo
          const slug = path.split("/").pop().replace(/\.md$/, "");

          const rawCategory = data.category ?? "공지";
          const category = rawCategory === "공모" ? "정보공개" : rawCategory;

          return {
            slug,
            title: data.title ?? "",
            date: data.date ?? "",
            dateObj: normalizeDate(data.date),
            thumbnail: data.thumbnail ?? "",
            category,
            excerpt:
              content
                .replace(/\n+/g, " ")
                .replace(/!\[[^\]]*\]\([^)]+\)/g, "") // 마크다운 이미지 제거
                .slice(0, 120) + (content.length > 120 ? "…" : ""),
          };
        })
      );

      // 최신순 정렬
      entries.sort((a, b) => {
        const ta = a.dateObj ? a.dateObj.getTime() : 0;
        const tb = b.dateObj ? b.dateObj.getTime() : 0;
        return tb - ta;
      });

      setItems(entries);
    })();
  }, []);

  const filtered = useMemo(() => {
    return items.filter((it) => {
      const byTab = tab === "전체" ? true : it.category === tab;
      const query = q.trim().toLowerCase();
      const byQ =
        query === ""
          ? true
          : (it.title ?? "").toLowerCase().includes(query) ||
            (it.excerpt ?? "").toLowerCase().includes(query);
      return byTab && byQ;
    });
  }, [items, tab, q]);

  // Reset page to 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [tab, q]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginatedItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-extrabold mb-6">공지사항</h1>

      {/* 필터 + 검색 */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        {["전체", "공지", "정보공개"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-full border ${
              tab === t
                ? "bg-black text-white border-black"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            {t}
          </button>
        ))}

        <div className="ml-auto w-full sm:w-72">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search"
            className="w-full rounded-full border px-4 py-2 outline-none focus:ring-2 focus:ring-sky-300"
          />
        </div>
      </div>

      {/* 카드 그리드 */}
      {paginatedItems.length === 0 ? (
        <p className="text-gray-500">등록된 글이 없습니다.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {paginatedItems.map((it) => (
            <Link
              key={it.slug}
              to={`/news/notices/${encodeURIComponent(it.slug)}`}
              className="group block rounded-xl border overflow-hidden shadow-sm hover:shadow-md transition"
            >
              {/* 썸네일 + 카테고리 배지 오버레이 */}
              <div className="relative">
                {it.thumbnail ? (
                  <img
                    src={it.thumbnail}
                    alt={it.title}
                    className="w-full h-48 object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-100" />
                )}
                <span className="absolute top-2 left-2 inline-flex items-center rounded-full bg-emerald-600/90 text-white text-xs font-semibold px-2 py-1 shadow">
                  {it.category}
                </span>
              </div>

              <div className="p-4">
                <h3 className="text-lg font-semibold group-hover:underline mt-0">
                  {it.title || "제목 없음"}
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  {(it.dateObj && it.dateObj.toISOString().slice(0, 10)) ||
                    it.date ||
                    ""}
                </p>

                {/* 간단 요약 (2줄) */}
                <p className="mt-2 text-sm text-gray-700 overflow-hidden text-ellipsis line-clamp-2">
                  {it.excerpt}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex justify-center items-center gap-4 mt-8">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className={`px-4 py-2 rounded border ${
            page === 1
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          이전
        </button>
        <span className="text-gray-700">
          {page} / {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className={`px-4 py-2 rounded border ${
            page === totalPages
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          다음
        </button>
      </div>
    </div>
  );
}
