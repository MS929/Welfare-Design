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
    <div className="max-w-screen-xl mx-auto pl-2 pr-4 sm:pl-3 sm:pr-6 lg:pl-4 lg:pr-8 pt-8 md:pt-10 pb-14 antialiased tracking-[-0.01em]">
      <h1 className="text-[28px] md:text-[34px] leading-[1.2] font-extrabold tracking-tight text-gray-900 mb-6">공지사항</h1>

      {/* 필터 + 검색 */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        {["전체", "공지", "정보공개"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-full border transition ${
              tab === t
                ? "bg-gray-900 text-white border-gray-900 shadow-sm"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
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
            className="w-full rounded-full border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-300 shadow-sm"
          />
        </div>
      </div>

      {/* 리스트(글) 형식 */}
      {paginatedItems.length === 0 ? (
        <p className="text-gray-500">등록된 글이 없습니다.</p>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-lg">
          <table className="w-full text-sm">
            <thead className="bg-gray-50/90 backdrop-blur supports-[backdrop-filter]:bg-gray-50/75 text-gray-600 sticky top-0 z-10 border-b border-gray-100">
              <tr>
                <th className="w-16 py-3.5 pl-4 pr-2 text-center font-medium text-gray-600">번호</th>
                <th className="py-3.5 px-4 text-center font-medium text-gray-600">제목</th>
                <th className="w-32 py-3.5 px-2 text-center font-medium text-gray-600">구분</th>
                <th className="w-44 py-3.5 px-4 text-left font-medium text-gray-600">작성일</th>
              </tr>
            </thead>
            <tbody>
              {paginatedItems.map((it, idx) => {
                const number = filtered.length - ((page - 1) * PAGE_SIZE + idx);
                const dateStr = (it.dateObj && it.dateObj.toISOString().slice(0, 10)) || it.date || "";
                const isNotice = it.category === "공지";
                const circleChip = (
                  <span className="inline-flex items-center rounded-full border border-gray-300 bg-white text-gray-700 px-5 py-1.5 shadow-sm">
                    <span className="text-[15px] font-medium tracking-tight">{it.category}</span>
                  </span>
                );
                return (
                  <tr key={it.slug} className="border-t border-gray-100 odd:bg-white even:bg-gray-50/40 hover:bg-gray-100/60 transition-colors">
                    <td className="py-4 pl-4 pr-2 text-gray-400 align-top text-center">{number}</td>
                    <td className="py-4 pl-4 pr-2 align-top">
                      <Link
                        to={`/news/notices/${encodeURIComponent(it.slug)}`}
                        className="inline-flex items-center hover:underline decoration-2 decoration-sky-300 underline-offset-2 max-w-[720px] truncate"
                      >
                        <span className="text-gray-900 font-medium truncate">{it.title || "제목 없음"}</span>
                      </Link>
                    </td>
                    <td className="py-4 px-2 align-top text-center">
                      {circleChip}
                    </td>
                    <td className="py-4 px-4 text-gray-600 align-top whitespace-nowrap">{dateStr}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
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
