// -----------------------------------------------------------------------------
// Notices.jsx
// [페이지 목적]
//  - 공지사항 목록 페이지
//  - src/content/notices/*.md[x] CMS markdown 파일을 빌드 시점에 읽어 목록을 구성
//
// [데이터 흐름]
//  - Vite import.meta.glob으로 notices 폴더의 markdown 원문을 raw 문자열로 로드
//  - frontmatter에서 제목/날짜/카테고리/썸네일 정보를 파싱
//  - 카테고리 탭, 검색어, 페이지네이션 상태에 따라 목록을 필터링하여 표시
//
// [화면 구성]
//  - 데스크톱(md 이상): 테이블 형태 목록
//  - 모바일(md 미만): 카드형 리스트
//
// [상태 유지]
//  - URL 쿼리스트링(category)을 기준으로 현재 탭 상태를 유지
//  - 새로고침 또는 외부 링크 접근 시에도 같은 카테고리 탭을 복원
//
// [운영 참고]
//  - 새 공지 또는 수정된 공지는 CMS 저장 후 Netlify 재배포가 완료되어야 반영됨
//  - 카테고리를 추가하려면 CMS config.yml과 이 페이지의 탭 처리 로직을 함께 수정
// -----------------------------------------------------------------------------

import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

// CMS 공지사항 원문 로드
const NOTICE_MODULES = import.meta.glob("../../content/notices/*.{md,mdx}", {
  query: "?raw",
  import: "default",
  eager: true,
});

// Markdown frontmatter 파싱
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

    if (!trimmed || trimmed.startsWith("#")) {
      return;
    }

    const idx = trimmed.indexOf(":");

    if (idx === -1) {
      return;
    }

    const key = trimmed.slice(0, idx).trim();
    let value = trimmed.slice(idx + 1).trim();

    value = value.replace(/^[']|[']$/g, "").replace(/^["]|["]$/g, "");

    data[key] = value;
  });

  return {
    data,
    content: content.trim(),
  };
}

// 날짜 문자열을 Date 객체로 변환
function normalizeDate(value) {
  try {
    const date = new Date(value);

    if (!Number.isNaN(date.getTime())) {
      return date;
    }
  } catch {
    return null;
  }

  return null;
}

// 공지 작성일 화면 표시 형식
// - 날짜를 YYYY.MM.DD 형식으로 통일
function formatDisplayDate(dateObj, fallback = "") {
  if (dateObj instanceof Date && !Number.isNaN(dateObj.getTime())) {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");

    return `${year}.${month}.${day}`;
  }

  return String(fallback || "").replaceAll("-", ".");
}

// 공지사항 카테고리 정규화
function normalizeCategory(rawCategory) {
  const raw = String(rawCategory || "공지").trim();
  const compact = raw.replace(/[\s-]/g, "");

  if (compact === "공모") {
    return "정보공개";
  }

  if (compact.includes("정보") && compact.includes("공개")) {
    return "정보공개";
  }

  if (compact.includes("공지")) {
    return "공지";
  }

  return raw || "공지";
}

// 카드 및 검색용 요약문 생성
function makeExcerpt(content = "") {
  const text = String(content || "")
    .replace(/\n+/g, " ")
    .replace(/!\[[^\]]*\]\([^)]+\)/g, "")
    .replace(/\[[^\]]*\]\([^)]+\)/g, "")
    .replace(/[#>*`_~-]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  return text.slice(0, 120) + (text.length > 120 ? "…" : "");
}

// 공지사항 목록 데이터 생성
async function fetchNoticeItems() {
  const entries = Object.entries(NOTICE_MODULES).map(([path, raw]) => {
    const fileName = path.split("/").pop() || "";
    const { data, content } = parseFrontmatter(raw);

    const slug = fileName.replace(/\.(md|mdx)$/i, "");
    const rawCategory = data?.category ?? "공지";
    const category = normalizeCategory(rawCategory);
    const date = String(data?.date || "").trim();
    const dateObj = normalizeDate(date);

    return {
      slug,
      title: String(data?.title || "").trim(),
      date,
      dateObj,
      thumbnail: String(data?.thumbnail || "").trim(),
      category,
      excerpt: makeExcerpt(content),
    };
  });

  return entries.filter(Boolean).sort((a, b) => {
    const timeA = a.dateObj ? a.dateObj.getTime() : 0;
    const timeB = b.dateObj ? b.dateObj.getTime() : 0;

    if (timeB !== timeA) {
      return timeB - timeA;
    }

    return b.slug.localeCompare(a.slug);
  });
}

export default function Notices() {
  const location = useLocation();
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [tab, setTab] = useState(() => {
    const params = new URLSearchParams(location.search);
    const category = (params.get("category") || "").replace(/\s+/g, "");

    if (!category) {
      return "전체";
    }

    if (category.includes("공지")) {
      return "공지";
    }

    if (category.includes("정보") && category.includes("공개")) {
      return "정보공개";
    }

    return "전체";
  });

  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);

  const PAGE_SIZE = 9;

  // CMS 공지사항 목록 로드
  useEffect(() => {
    let alive = true;

    fetchNoticeItems()
      .then((entries) => {
        if (!alive) {
          return;
        }

        setItems(entries);
      })
      .catch((error) => {
        console.warn("공지사항 CMS 데이터 로드 실패:", error);

        if (alive) {
          setItems([]);
        }
      })
      .finally(() => {
        if (alive) {
          setLoading(false);
        }
      });

    return () => {
      alive = false;
    };
  }, []);

  // URL category 쿼리와 탭 상태 동기화
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = (params.get("category") || "").replace(/\s+/g, "");

    if (!category) {
      setTab("전체");
      return;
    }

    if (category.includes("공지")) {
      setTab("공지");
      return;
    }

    if (category.includes("정보") && category.includes("공개")) {
      setTab("정보공개");
      return;
    }

    setTab("전체");
  }, [location.search]);

  // 탭 변경
  const setTabAndURL = (targetTab) => {
    setTab(targetTab);

    const param =
      targetTab === "전체"
        ? ""
        : targetTab === "공지"
          ? "?category=공지"
          : "?category=정보공개";

    navigate(`/news/notices${param}`, {
      replace: false,
    });
  };

  // 카테고리 및 검색어 필터링
  const filtered = useMemo(() => {
    return items.filter((item) => {
      const matchesTab = tab === "전체" || item.category === tab;
      const query = q.trim().toLowerCase();

      const matchesQuery =
        query === "" ||
        (item.title ?? "").toLowerCase().includes(query) ||
        (item.excerpt ?? "").toLowerCase().includes(query);

      return matchesTab && matchesQuery;
    });
  }, [items, tab, q]);

  // 탭 또는 검색어 변경 시 1페이지로 이동
  useEffect(() => {
    setPage(1);
  }, [tab, q]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  // 현재 페이지 범위 보정
  useEffect(() => {
    const calculatedPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

    if (page > calculatedPages) {
      setPage(1);
    }
  }, [filtered.length, page]);

  // 페이지 이동 시 화면 상단으로 이동
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [page]);

  const paginatedItems = filtered.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  return (
    <div className="bg-white">
      <section className="mx-auto max-w-screen-xl px-4 pt-10">
        <nav className="text-sm text-black/80">
          소식
          <span className="mx-1 text-gray-400">›</span>
          <span className="text-black">공지사항</span>
        </nav>

        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-black md:text-4xl">
          공지사항
        </h1>
      </section>

      {/* 카테고리 탭 및 검색 영역 */}
      <div className="mx-auto flex max-w-screen-xl flex-wrap items-center gap-3 px-4 pb-6 pt-6 tracking-[-0.01em] antialiased">
        {["전체", "공지", "정보공개"].map((targetTab) => (
          <button
            key={targetTab}
            type="button"
            onClick={() => setTabAndURL(targetTab)}
            className={`rounded-full border px-4 py-2 transition focus:outline-none focus:ring-2 focus:ring-[#1E9E8F] ${
              tab === targetTab
                ? "border-[#1E9E8F] bg-[#1E9E8F] text-white shadow-sm"
                : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            {targetTab}
          </button>
        ))}

        <div className="ml-auto w-full sm:w-72">
          <input
            value={q}
            onChange={(event) => setQ(event.target.value)}
            placeholder="Search"
            className="w-full rounded-full border border-gray-300 px-4 py-2 shadow-sm outline-none focus:border-[#1E9E8F] focus:ring-2 focus:ring-[#1E9E8F]"
          />
        </div>
      </div>

      {loading ? (
        <p className="mx-auto max-w-screen-xl px-4 py-8 text-gray-500">
          공지사항을 불러오는 중입니다.
        </p>
      ) : paginatedItems.length === 0 ? (
        <p className="mx-auto max-w-screen-xl px-4 py-8 text-gray-500">
          등록된 글이 없습니다.
        </p>
      ) : (
        <>
          {/* 데스크톱 목록 */}
          <div className="hidden md:block">
            <div className="mx-auto max-w-screen-xl overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
              <table className="w-full table-fixed text-sm">
                <thead className="sticky top-0 z-10 border-b border-gray-100 bg-gray-50 text-gray-600">
                  <tr>
                    <th
                      scope="col"
                      className="w-20 px-4 py-3.5 text-center font-medium text-gray-600"
                    >
                      번호
                    </th>

                    <th
                      scope="col"
                      className="px-6 py-3.5 text-left font-medium text-gray-600"
                    >
                      제목
                    </th>

                    <th
                      scope="col"
                      className="w-28 px-4 py-3.5 text-center font-medium text-gray-600"
                    >
                      구분
                    </th>

                    <th
                      scope="col"
                      className="w-40 px-4 py-3.5 text-center font-medium text-gray-600"
                    >
                      작성일
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedItems.map((item, index) => {
                    const number =
                      filtered.length - ((page - 1) * PAGE_SIZE + index);

                    const dateStr = formatDisplayDate(item.dateObj, item.date);

                    const categoryChip = (
                      <span
                        className={`inline-flex items-center rounded-full border bg-white px-3 py-1 text-sm shadow-sm ${
                          item.category === "공지"
                            ? "border-orange-200 text-orange-600"
                            : "border-[#9FDCD5] text-[#1E9E8F]"
                        }`}
                      >
                        <span className="font-medium tracking-tight">
                          {item.category}
                        </span>
                      </span>
                    );

                    return (
                      <tr
                        key={item.slug}
                        className="border-t border-gray-100 transition-colors odd:bg-white even:bg-gray-50/40 hover:bg-gray-100"
                      >
                        <td className="px-4 py-4 text-center align-middle text-gray-500">
                          {number}
                        </td>

                        <td className="px-6 py-4 align-middle">
                          <Link
                            to={`/news/notices/${encodeURIComponent(
                              item.slug,
                            )}`}
                            className="-mx-2 -my-1 block w-full max-w-full truncate px-2 py-1 transition-colors hover:text-[#1E9E8F]"
                          >
                            <span className="truncate font-medium text-gray-900">
                              {item.title || "제목 없음"}
                            </span>
                          </Link>
                        </td>

                        <td className="px-4 py-4 text-center align-middle">
                          {categoryChip}
                        </td>

                        <td className="whitespace-nowrap px-4 py-4 text-center align-middle text-gray-600 tabular-nums">
                          {dateStr}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* 모바일 목록 */}
          <div className="md:hidden">
            <ul className="mx-auto max-w-screen-xl space-y-4 px-4">
              {paginatedItems.map((item, index) => {
                const number =
                  filtered.length - ((page - 1) * PAGE_SIZE + index);

                const dateStr = formatDisplayDate(item.dateObj, item.date);

                return (
                  <li key={item.slug}>
                    <Link
                      to={`/news/notices/${encodeURIComponent(item.slug)}`}
                      className="block rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md active:bg-gray-50"
                    >
                      <div className="flex items-start gap-3">
                        <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-gray-100 text-xs font-semibold text-gray-700">
                          {number}
                        </span>

                        <div className="min-w-0 flex-1">
                          <p className="truncate break-words text-[15px] font-semibold leading-snug text-gray-900">
                            {item.title || "제목 없음"}
                          </p>

                          <div className="mt-2 flex items-center gap-2 text-[13px]">
                            <span
                              className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[12px] ${
                                item.category === "공지"
                                  ? "border-orange-200 bg-orange-50 text-orange-700"
                                  : "border-[#9FDCD5] bg-[#E9F7F5] text-[#15796E]"
                              }`}
                            >
                              {item.category}
                            </span>

                            <span
                              className="h-3 w-px bg-gray-300"
                              aria-hidden="true"
                            />

                            <time className="text-gray-500 tabular-nums">
                              {dateStr}
                            </time>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </>
      )}

      {/* 페이지네이션 */}
      <div className="mx-auto my-8 flex max-w-screen-xl items-center justify-center gap-4 px-4">
        <button
          type="button"
          onClick={() => setPage((current) => Math.max(1, current - 1))}
          disabled={page === 1}
          className={`rounded border px-4 py-2 ${
            page === 1
              ? "cursor-not-allowed bg-gray-200 text-gray-500"
              : "bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          이전
        </button>

        <span className="text-gray-700">
          {page} / {totalPages}
        </span>

        <button
          type="button"
          onClick={() =>
            setPage((current) => Math.min(totalPages, current + 1))
          }
          disabled={page === totalPages}
          className={`rounded border px-4 py-2 ${
            page === totalPages
              ? "cursor-not-allowed bg-gray-200 text-gray-500"
              : "bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          다음
        </button>
      </div>
    </div>
  );
}
