// src/pages/news/Notices.jsx
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
  const location = useLocation();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [tab, setTab] = useState(() => {
    const qs = new URLSearchParams(location.search);
    const c = (qs.get("category") || "").replace(/\s+/g, "");
    if (!c) return "전체";
    if (c.includes("공지")) return "공지";
    if (c.includes("정보") && c.includes("공개")) return "정보공개";
    return "전체";
  }); // 전체 | 공지 | 정보공개
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
        if (tb !== ta) return tb - ta;
        return b.slug.localeCompare(a.slug); // 안정 정렬: 파일명 역순
      });

      setItems(entries);
    })();
  }, []);

  // Sync tab with ?category= query param when URL changes (e.g., from "더보기" links)
  useEffect(() => {
    const qs = new URLSearchParams(location.search);
    const c = (qs.get("category") || "").replace(/\s+/g, "");
    if (!c) return setTab("전체");
    if (c.includes("공지")) return setTab("공지");
    if (c.includes("정보") && c.includes("공개")) return setTab("정보공개");
    setTab("전체");
  }, [location.search]);

  const setTabAndURL = (t) => {
    setTab(t);
    const param =
      t === "전체" ? "" :
      t === "공지" ? "?category=공지" : "?category=정보공개";
    navigate(`/news/notices${param}`, { replace: false });
  };

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

  useEffect(() => {
    const tp = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    if (page > tp) setPage(1);
  }, [filtered.length, page]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  const paginatedItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="max-w-screen-xl mx-auto pl-2 pr-4 sm:pl-3 sm:pr-6 lg:pl-4 lg:pr-8 pt-8 md:pt-10 pb-14 antialiased tracking-[-0.01em]">
      {/* ===== 브레드크럼 + 제목 ===== */}
      <nav className="flex items-center gap-1 text-[13px] md:text-[14px] text-gray-600 mb-2">
        <Link to="/news/stories" className="text-[#1E9E8F] font-semibold hover:underline">
          소식
        </Link>
        <span className="text-gray-400">›</span>
        <span className="text-gray-600">공지사항</span>
      </nav>
      <h1 className="text-3xl md:text-4xl leading-[1.15] font-extrabold tracking-tight text-gray-900 mb-6">
        공지사항
      </h1>

      {/* 필터 + 검색 */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        {["전체", "공지", "정보공개"].map((t) => (
          <button
            key={t}
            onClick={() => setTabAndURL(t)}
            className={`px-4 py-2 rounded-full border transition focus:outline-none focus:ring-2 focus:ring-[#1E9E8F] ${
              tab === t
                ? "bg-[#1E9E8F] text-white border-[#1E9E8F] shadow-sm"
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
            className="w-full rounded-full border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-[#1E9E8F] focus:border-[#1E9E8F] shadow-sm"
          />
        </div>
      </div>

      {/* 리스트(글) 형식 */}
      {paginatedItems.length === 0 ? (
        <p className="text-gray-500">등록된 글이 없습니다.</p>
      ) : (
        <div className="overflow-hidden rounded-none border border-gray-100 bg-white shadow">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 sticky top-0 z-10 border-b border-gray-100">
              <tr>
                <th scope="col" className="w-24 py-3.5 px-4 text-center font-medium text-gray-600">번호</th>
                <th scope="col" className="py-3.5 px-4 text-center font-medium text-gray-600">제목</th>
                <th scope="col" className="w-32 py-3.5 px-4 text-center font-medium text-gray-600">구분</th>
                <th scope="col" className="w-44 py-3.5 px-4 text-center font-medium text-gray-600">작성일</th>
              </tr>
            </thead>
            <tbody>
              {paginatedItems.map((it, idx) => {
                const number = filtered.length - ((page - 1) * PAGE_SIZE + idx);
                const dateStr = (it.dateObj && it.dateObj.toISOString().slice(0, 10)) || it.date || "";
                const isNotice = it.category === "공지";
                const circleChip = (
                  <span
                    className={`inline-flex items-center rounded-full border bg-white px-3 py-1 shadow-sm text-sm ${
                      it.category === "공지"
                        ? "text-orange-600 border-orange-200"
                        : "text-[#1E9E8F] border-[#9FDCD5]"
                    }`}
                  >
                    <span className="font-medium tracking-tight">{it.category}</span>
                  </span>
                );
                return (
                  <tr key={it.slug} className="border-t border-gray-100 odd:bg-white even:bg-gray-50/40 hover:bg-gray-100 transition-colors">
                    <td className="py-4 px-4 text-gray-500 text-center align-middle">
                      {number}
                    </td>
                    <td className="py-4 px-4 align-middle">
                      <Link
                        to={`/news/notices/${encodeURIComponent(it.slug)}`}
                        className="block w-full -mx-2 px-2 -my-1 py-1 max-w-full truncate transition-colors hover:text-[#1E9E8F]"
                      >
                        <span className="text-gray-900 font-medium truncate">{it.title || "제목 없음"}</span>
                      </Link>
                    </td>
                    <td className="py-4 px-4 align-middle text-center">
                      {circleChip}
                    </td>
                    <td className="py-4 px-4 text-gray-600 align-middle whitespace-nowrap">{dateStr}</td>
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
