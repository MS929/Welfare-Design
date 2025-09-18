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

      {/* 리스트(글) 형식 */}
      {paginatedItems.length === 0 ? (
        <p className="text-gray-500">등록된 글이 없습니다.</p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="w-16 py-3 pl-4 pr-2 text-left font-medium">번호</th>
                <th className="py-3 pl-6 pr-2 text-left font-medium">제목</th>
                <th className="w-24 py-3 px-2 text-center font-medium">구분</th>
                <th className="w-44 py-3 px-3 text-left font-medium">작성일</th>
              </tr>
            </thead>
            <tbody>
              {paginatedItems.map((it, idx) => {
                const number = filtered.length - ((page - 1) * PAGE_SIZE + idx);
                const dateStr = (it.dateObj && it.dateObj.toISOString().slice(0, 10)) || it.date || "";
                const isNotice = it.category === "공지";
                const chipClasses = isNotice
                  ? "border-sky-200 text-sky-700 bg-sky-50"
                  : "border-emerald-200 text-emerald-700 bg-emerald-50";
                const dotClasses = isNotice ? "bg-sky-500" : "bg-emerald-500";
                const circleClasses = isNotice
                  ? "border-sky-200 bg-sky-50/60 text-sky-700"
                  : "border-emerald-200 bg-emerald-50/60 text-emerald-700";
                const circleChip = (
                  <span
                    className={`relative inline-flex items-center justify-center rounded-full border ${circleClasses}`}
                    style={{ width: 40, height: 40 }}
                  >
                    <span className={`absolute left-2 top-1.5 h-2 w-2 rounded-full ${dotClasses}`}></span>
                    <span className="text-[12px] leading-tight font-semibold">{it.category}</span>
                  </span>
                );
                return (
                  <tr key={it.slug} className="border-t hover:bg-gray-50">
                    <td className="py-3 pl-4 pr-2 text-gray-500 align-top">{number}</td>
                    <td className="py-3 pl-6 pr-2 align-top">
                      <Link
                        to={`/news/notices/${encodeURIComponent(it.slug)}`}
                        className="inline-flex items-center hover:underline"
                      >
                        <span className="text-gray-900 font-medium">{it.title || "제목 없음"}</span>
                      </Link>
                    </td>
                    <td className="py-3 px-2 align-top text-center">
                      {circleChip}
                    </td>
                    <td className="py-3 px-3 text-gray-600 align-top whitespace-nowrap">{dateStr}</td>
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
