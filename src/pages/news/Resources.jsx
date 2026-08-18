import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { formatResourceDate, getResources } from "../../lib/resources";

const PAGE_SIZE = 10;
const DEFAULT_CATEGORIES = ["서식", "보고서", "홍보자료", "기타"];

export default function Resources() {
  const items = getResources();
  const [category, setCategory] = useState("전체");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const categories = useMemo(() => {
    const registered = items.map((item) => item.category).filter(Boolean);
    return ["전체", ...new Set([...DEFAULT_CATEGORIES, ...registered])];
  }, [items]);

  const filtered = useMemo(() => {
    const keyword = query.trim().toLowerCase();

    return items.filter((item) => {
      const matchesCategory =
        category === "전체" || item.category === category;
      const matchesQuery =
        !keyword ||
        item.title.toLowerCase().includes(keyword) ||
        item.excerpt.toLowerCase().includes(keyword) ||
        item.attachments.some((attachment) =>
          attachment.name.toLowerCase().includes(keyword),
        );

      return matchesCategory && matchesQuery;
    });
  }, [category, items, query]);

  useEffect(() => {
    setPage(1);
  }, [category, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  return (
    <div className="min-h-[60vh] bg-white pb-12">
      <section className="mx-auto max-w-screen-xl px-4 pt-10">
        <nav className="text-sm text-black/80">
          소식
          <span className="mx-1 text-gray-400">›</span>
          <span className="text-black">자료실</span>
        </nav>

        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-black md:text-4xl">
          자료실
        </h1>
        <p className="mt-3 text-gray-600">
          복지디자인의 서식, 보고서 및 각종 자료를 내려받을 수 있습니다.
        </p>
      </section>

      <section
        className="mx-auto flex max-w-screen-xl flex-wrap items-center gap-3 px-4 pb-6 pt-6"
        aria-label="자료 검색 및 분류"
      >
        {categories.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setCategory(item)}
            className={`rounded-full border px-4 py-2 transition focus:outline-none focus:ring-2 focus:ring-[#1E9E8F] ${
              category === item
                ? "border-[#1E9E8F] bg-[#1E9E8F] text-white shadow-sm"
                : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            {item}
          </button>
        ))}

        <div className="ml-auto w-full sm:w-72">
          <label htmlFor="resource-search" className="sr-only">
            자료 검색
          </label>
          <input
            id="resource-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="자료 검색"
            className="w-full rounded-full border border-gray-300 px-4 py-2 shadow-sm outline-none focus:border-[#1E9E8F] focus:ring-2 focus:ring-[#1E9E8F]"
          />
        </div>
      </section>

      {pageItems.length === 0 ? (
        <div className="mx-auto max-w-screen-xl px-4 py-14 text-center text-gray-500">
          {items.length === 0
            ? "등록된 자료가 아직 없습니다."
            : "검색 조건에 맞는 자료가 없습니다."}
        </div>
      ) : (
        <>
          <div className="mx-auto hidden max-w-screen-xl overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm md:block">
            <table className="w-full table-fixed text-sm">
              <thead className="border-b border-gray-100 bg-gray-50 text-gray-600">
                <tr>
                  <th className="w-20 px-4 py-3.5 text-center font-medium">
                    번호
                  </th>
                  <th className="px-4 py-3.5 text-left font-medium">자료명</th>
                  <th className="w-28 px-4 py-3.5 text-center font-medium">
                    분류
                  </th>
                  <th className="w-24 px-4 py-3.5 text-center font-medium">
                    파일
                  </th>
                  <th className="w-40 px-4 py-3.5 text-center font-medium">
                    등록일
                  </th>
                </tr>
              </thead>
              <tbody>
                {pageItems.map((item, index) => {
                  const number =
                    filtered.length - ((page - 1) * PAGE_SIZE + index);

                  return (
                    <tr
                      key={item.slug}
                      className="border-t border-gray-100 transition-colors even:bg-gray-50/40 hover:bg-gray-100"
                    >
                      <td className="px-4 py-4 text-center text-gray-500">
                        {number}
                      </td>
                      <td className="px-4 py-4">
                        <Link
                          to={`/news/resources/${encodeURIComponent(item.slug)}`}
                          className="font-semibold text-gray-900 hover:text-[#15796E] hover:underline"
                        >
                          {item.title}
                        </Link>
                        {item.excerpt ? (
                          <p className="mt-1 truncate text-xs text-gray-500">
                            {item.excerpt}
                          </p>
                        ) : null}
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className="inline-flex rounded-full border border-[#9FDCD5] bg-[#E9F7F5] px-3 py-1 text-xs font-medium text-[#15796E]">
                          {item.category}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center text-gray-600">
                        {item.attachments.length}개
                      </td>
                      <td className="px-4 py-4 text-center tabular-nums text-gray-500">
                        {formatResourceDate(item.date)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <ul className="mx-auto grid max-w-screen-xl gap-3 px-4 md:hidden">
            {pageItems.map((item, index) => {
              const number =
                filtered.length - ((page - 1) * PAGE_SIZE + index);

              return (
                <li key={item.slug}>
                  <Link
                    to={`/news/resources/${encodeURIComponent(item.slug)}`}
                    className="block rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md"
                  >
                    <div className="flex items-start gap-3">
                      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-gray-100 text-xs font-semibold text-gray-700">
                        {number}
                      </span>
                      <div className="min-w-0 flex-1">
                        <h2 className="font-semibold leading-snug text-gray-900">
                          {item.title}
                        </h2>
                        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                          <span className="rounded-full bg-[#E9F7F5] px-2.5 py-1 text-[#15796E]">
                            {item.category}
                          </span>
                          <span>{item.attachments.length}개 파일</span>
                          <time>{formatResourceDate(item.date)}</time>
                        </div>
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </>
      )}

      {filtered.length > PAGE_SIZE ? (
        <nav
          className="mx-auto mt-8 flex max-w-screen-xl items-center justify-center gap-4 px-4"
          aria-label="자료실 페이지 이동"
        >
          <button
            type="button"
            onClick={() => setPage((value) => Math.max(1, value - 1))}
            disabled={page === 1}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
          >
            이전
          </button>
          <span className="text-sm tabular-nums text-gray-600">
            {page} / {totalPages}
          </span>
          <button
            type="button"
            onClick={() =>
              setPage((value) => Math.min(totalPages, value + 1))
            }
            disabled={page === totalPages}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
          >
            다음
          </button>
        </nav>
      ) : null}
    </div>
  );
}
