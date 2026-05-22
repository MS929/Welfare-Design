// -----------------------------------------------------------------------------
// [페이지 목적]
//  - 공지사항 목록 페이지
//  - GitHub에 저장된 CMS markdown 공지 파일을 실시간으로 불러와 목록/검색/카테고리/페이지네이션 제공
//
// [화면 구성]
//  - 데스크탑(md 이상): 테이블 형태 목록
//  - 모바일(md 미만): 카드형 리스트
//
// [데이터 처리]
//  - GitHub Contents API로 src/content/notices/*.md 파일을 로드
//  - 프론트매터(date, title, category 등)를 기준으로 목록 구성
//  - 최신 날짜 기준 내림차순 정렬
// -----------------------------------------------------------------------------
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const GITHUB_NOTICES_API =
  "https://api.github.com/repos/MS929/Welfare-Design/contents/src/content/notices?ref=main";

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
    if (!trimmed || trimmed.startsWith("#")) return;

    const idx = trimmed.indexOf(":");
    if (idx === -1) return;

    const key = trimmed.slice(0, idx).trim();
    let value = trimmed.slice(idx + 1).trim();

    value = value.replace(/^['"]|['"]$/g, "");
    data[key] = value;
  });

  return { data, content: content.trim() };
}

function normalizeDate(v) {
  try {
    const d = new Date(v);
    if (!isNaN(d.getTime())) return d;
  } catch (_) {}
  return null;
}

function normalizeCategory(rawCategory) {
  const raw = String(rawCategory || "공지").trim();
  const compact = raw.replace(/[\s-]/g, "");
  if (compact === "공모") return "정보공개";
  if (compact.includes("정보") && compact.includes("공개")) return "정보공개";
  if (compact.includes("공지")) return "공지";
  return raw || "공지";
}

function makeExcerpt(content = "") {
  const text = String(content || "")
    .replace(/\n+/g, " ")
    .replace(/!\[[^\]]*\]\([^)]+\)/g, "")
    .trim();
  return text.slice(0, 120) + (text.length > 120 ? "…" : "");
}

async function fetchNoticeItems() {
  const res = await fetch(`${GITHUB_NOTICES_API}&t=${Date.now()}`, {
    cache: "no-store",
    headers: {
      Accept: "application/vnd.github+json",
    },
  });

  if (!res.ok) {
    throw new Error(`GitHub notices list fetch failed: ${res.status}`);
  }

  const files = await res.json();

  const mdFiles = Array.isArray(files)
    ? files.filter(
        (file) =>
          file.type === "file" &&
          /\.(md|mdx)$/i.test(file.name || "") &&
          file.download_url
      )
    : [];

  const entries = await Promise.all(
    mdFiles.map(async (file) => {
      const rawUrl = `${file.download_url}${
        file.download_url.includes("?") ? "&" : "?"
      }t=${Date.now()}`;
      const fileRes = await fetch(rawUrl, { cache: "no-store" });

      if (!fileRes.ok) return null;

      const raw = await fileRes.text();
      const { data, content } = parseFrontmatter(raw);
      const slug = String(file.name || "").replace(/\.(md|mdx)$/i, "");
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
    })
  );

  return entries.filter(Boolean).sort((a, b) => {
    const ta = a.dateObj ? a.dateObj.getTime() : 0;
    const tb = b.dateObj ? b.dateObj.getTime() : 0;
    if (tb !== ta) return tb - ta;
    return b.slug.localeCompare(a.slug);
  });
}

export default function Notices() {
  const location = useLocation();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState(() => {
    const qs = new URLSearchParams(location.search);
    const c = (qs.get("category") || "").replace(/\s+/g, "");
    if (!c) return "전체";
    if (c.includes("공지")) return "공지";
    if (c.includes("정보") && c.includes("공개")) return "정보공개";
    return "전체";
  });
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 9;

  useEffect(() => {
    let alive = true;

    fetchNoticeItems()
      .then((entries) => {
        if (!alive) return;
        setItems(entries);
      })
      .catch((e) => {
        console.warn("공지사항 GitHub CMS 데이터 로드 실패:", e);
        if (alive) setItems([]);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, []);

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

  useEffect(() => {
    setPage(1);
  }, [tab, q]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  useEffect(() => {
    const tp = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    if (page > tp) setPage(1);
  }, [filtered.length, page]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  const paginatedItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="bg-white">
      <section className="max-w-screen-xl mx-auto px-4 pt-10">
        <nav className="text-sm text-black/80">
          소식 <span className="mx-1 text-gray-400">›</span>
          <span className="text-black">공지사항</span>
        </nav>
        <h1 className="mt-3 text-3xl md:text-4xl font-extrabold tracking-tight text-black">
          공지사항
        </h1>
      </section>

      <div className="max-w-screen-xl mx-auto flex flex-wrap items-center gap-3 px-4 pt-6 pb-6 antialiased tracking-[-0.01em]">
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

      {loading ? (
        <p className="max-w-screen-xl mx-auto px-4 py-8 text-gray-500">공지사항을 불러오는 중입니다.</p>
      ) : paginatedItems.length === 0 ? (
        <p className="max-w-screen-xl mx-auto px-4 py-8 text-gray-500">등록된 글이 없습니다.</p>
      ) : (
        <>
          <div className="hidden md:block">
            <div className="max-w-screen-xl mx-auto overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
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
          </div>

          <div className="md:hidden">
            <ul className="max-w-screen-xl mx-auto px-4 space-y-4">
              {paginatedItems.map((it, idx) => {
                const number = filtered.length - ((page - 1) * PAGE_SIZE + idx);
                const dateStr = (it.dateObj && it.dateObj.toISOString().slice(0, 10)) || it.date || "";
                return (
                  <li key={it.slug}>
                    <Link
                      to={`/news/notices/${encodeURIComponent(it.slug)}`}
                      className="block rounded-2xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md active:bg-gray-50 transition-shadow"
                    >
                      <div className="flex items-start gap-3">
                        <span className="shrink-0 mt-0.5 grid place-items-center h-6 w-6 rounded-full bg-gray-100 text-xs font-semibold text-gray-700">
                          {number}
                        </span>

                        <div className="min-w-0 flex-1">
                          <p className="text-[15px] font-semibold text-gray-900 leading-snug break-words truncate">
                            {it.title || "제목 없음"}
                          </p>

                          <div className="mt-2 flex items-center gap-2 text-[13px]">
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[12px] border ${
                                it.category === "공지"
                                  ? "text-orange-700 border-orange-200 bg-orange-50"
                                  : "text-[#15796E] border-[#9FDCD5] bg-[#E9F7F5]"
                              }`}
                            >
                              {it.category}
                            </span>
                            <span className="h-3 w-px bg-gray-300" aria-hidden="true" />
                            <time className="text-gray-500">{dateStr}</time>
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

      <div className="max-w-screen-xl mx-auto flex justify-center items-center gap-4 my-8 px-4">
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
