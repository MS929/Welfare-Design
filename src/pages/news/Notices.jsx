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
// - notices 폴더의 md/mdx 파일을 raw 문자열로 가져옴
// - 목록 페이지에서는 이 데이터로 공지/정보공개 목록을 구성함
const NOTICE_MODULES = import.meta.glob("../../content/notices/*.{md,mdx}", {
  query: "?raw",
  import: "default",
  eager: true,
});

// Markdown frontmatter 파싱
// - 상단 --- 영역의 key:value 값을 data 객체로 변환
// - 나머지 본문은 content로 분리하여 요약문(excerpt) 생성에 사용
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

    value = value.replace(/^[']|[']$/g, "").replace(/^[\"]|[\"]$/g, "");
    data[key] = value;
  });

  return { data, content: content.trim() };
}

// 날짜 문자열을 Date 객체로 변환
// - 정렬과 화면 표시용 날짜 계산에 사용
// - 유효하지 않은 날짜는 null로 처리
function normalizeDate(v) {
  try {
    const d = new Date(v);
    if (!isNaN(d.getTime())) return d;
  } catch (_) {}
  return null;
}

// 공지사항 카테고리 정규화
// - CMS 입력값의 공백/하이픈/오타성 표기를 보정
// - 공모는 정보공개로 처리하고, 정보공개/공지 외 값은 원본 값을 최대한 유지
function normalizeCategory(rawCategory) {
  const raw = String(rawCategory || "공지").trim();
  const compact = raw.replace(/[\s-]/g, "");

  if (compact === "공모") return "정보공개";
  if (compact.includes("정보") && compact.includes("공개")) return "정보공개";
  if (compact.includes("공지")) return "공지";

  return raw || "공지";
}

// 카드/검색용 요약문 생성
// - markdown 이미지/링크/기호를 제거하고 본문 텍스트만 추출
// - 검색어 필터링에도 excerpt 값을 함께 사용
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
// - NOTICE_MODULES의 markdown 파일들을 순회하며 목록에 필요한 데이터로 변환
// - 최신 날짜순으로 정렬하고, 날짜가 같으면 slug 기준으로 한 번 더 정렬
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
    const ta = a.dateObj ? a.dateObj.getTime() : 0;
    const tb = b.dateObj ? b.dateObj.getTime() : 0;

    if (tb !== ta) return tb - ta;

    return b.slug.localeCompare(a.slug);
  });
}

// 공지사항 목록 페이지 컴포넌트
// - CMS 글 목록 로드, 카테고리 탭, 검색, 페이지네이션을 관리
export default function Notices() {
  const location = useLocation();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // 초기 카테고리 탭 상태
  // - URL의 category 쿼리값을 읽어 전체/공지/정보공개 중 하나로 초기화
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

  // CMS 공지사항 목록 로드
  // - 컴포넌트가 처음 표시될 때 한 번만 실행
  // - alive 플래그로 언마운트 이후 setState가 실행되는 것을 방지
  useEffect(() => {
    let alive = true;

    fetchNoticeItems()
      .then((entries) => {
        if (!alive) return;
        setItems(entries);
      })
      .catch((e) => {
        console.warn("공지사항 CMS 데이터 로드 실패:", e);
        if (alive) setItems([]);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, []);

  // URL category 쿼리와 현재 탭 상태 동기화
  // - 외부 링크/새로고침/뒤로가기 상황에서도 탭 상태를 유지
  useEffect(() => {
    const qs = new URLSearchParams(location.search);
    const c = (qs.get("category") || "").replace(/\s+/g, "");

    if (!c) return setTab("전체");
    if (c.includes("공지")) return setTab("공지");
    if (c.includes("정보") && c.includes("공개")) return setTab("정보공개");

    setTab("전체");
  }, [location.search]);

  // 탭 클릭 시 상태와 URL을 함께 변경
  // - URL에 category 값을 남겨 현재 목록 상태를 공유/복원할 수 있게 함
  const setTabAndURL = (t) => {
    setTab(t);

    const param =
      t === "전체"
        ? ""
        : t === "공지"
          ? "?category=공지"
          : "?category=정보공개";

    navigate(`/news/notices${param}`, { replace: false });
  };

  // 카테고리 + 검색어 기준 목록 필터링
  // - 먼저 탭 값으로 공지/정보공개를 거르고, 검색어가 있으면 제목/excerpt를 검색
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

  // 탭/검색어 변경 시 페이지를 1로 리셋
  // - 이전 페이지 번호가 남아 빈 목록이 보이는 상황을 방지
  useEffect(() => {
    setPage(1);
  }, [tab, q]);

  // 전체 페이지 수 계산
  // - 결과가 0개여도 페이지 UI가 깨지지 않도록 최소 1페이지로 처리
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  // 필터 결과가 줄어 현재 페이지가 범위를 벗어나면 1페이지로 보정
  useEffect(() => {
    const tp = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    if (page > tp) setPage(1);
  }, [filtered.length, page]);

  // 페이지 이동 시 상단으로 스크롤
  // - 다음/이전 페이지로 이동했을 때 새 목록을 바로 볼 수 있게 함
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  // 페이지네이션 적용
  // - 필터링된 전체 목록 중 현재 페이지에 보여줄 PAGE_SIZE(9개)만 잘라냄
  const paginatedItems = filtered.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

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

      {/* 카테고리 탭 + 검색 영역
          - 탭 클릭 시 URL category 쿼리를 갱신
          - 검색어는 제목과 요약문(excerpt)을 대상으로 필터링 */}
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
        <p className="max-w-screen-xl mx-auto px-4 py-8 text-gray-500">
          공지사항을 불러오는 중입니다.
        </p>
      ) : paginatedItems.length === 0 ? (
        <p className="max-w-screen-xl mx-auto px-4 py-8 text-gray-500">
          등록된 글이 없습니다.
        </p>
      ) : (
        <>
          {/* 데스크톱 목록
              - md 이상 화면에서는 테이블 형태로 번호/제목/구분/작성일을 표시 */}
          <div className="hidden md:block">
            <div className="max-w-screen-xl mx-auto overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-600 sticky top-0 z-10 border-b border-gray-100">
                  <tr>
                    <th
                      scope="col"
                      className="w-24 py-3.5 px-4 text-center font-medium text-gray-600"
                    >
                      번호
                    </th>
                    <th
                      scope="col"
                      className="py-3.5 px-4 text-center font-medium text-gray-600"
                    >
                      제목
                    </th>
                    <th
                      scope="col"
                      className="w-32 py-3.5 px-4 text-center font-medium text-gray-600"
                    >
                      구분
                    </th>
                    <th
                      scope="col"
                      className="py-4 px-4 text-center text-gray-600 align-middle whitespace-nowrap"
                    >
                      작성일
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedItems.map((it, idx) => {
                    const number =
                      filtered.length - ((page - 1) * PAGE_SIZE + idx);
                    const dateStr =
                      (it.dateObj && it.dateObj.toISOString().slice(0, 10)) ||
                      it.date ||
                      "";
                    const circleChip = (
                      <span
                        className={`inline-flex items-center rounded-full border bg-white px-3 py-1 shadow-sm text-sm ${
                          it.category === "공지"
                            ? "text-orange-600 border-orange-200"
                            : "text-[#1E9E8F] border-[#9FDCD5]"
                        }`}
                      >
                        <span className="font-medium tracking-tight">
                          {it.category}
                        </span>
                      </span>
                    );

                    return (
                      <tr
                        key={it.slug}
                        className="border-t border-gray-100 odd:bg-white even:bg-gray-50/40 hover:bg-gray-100 transition-colors"
                      >
                        <td className="py-4 px-4 text-gray-500 text-center align-middle">
                          {number}
                        </td>
                        <td className="py-4 px-4 align-middle">
                          <Link
                            to={`/news/notices/${encodeURIComponent(it.slug)}`}
                            className="block w-full -mx-2 px-2 -my-1 py-1 max-w-full truncate transition-colors hover:text-[#1E9E8F]"
                          >
                            <span className="text-gray-900 font-medium truncate">
                              {it.title || "제목 없음"}
                            </span>
                          </Link>
                        </td>
                        <td className="py-4 px-4 align-middle text-center">
                          {circleChip}
                        </td>
                        <td className="py-4 pl-4 pr-10 text-right text-gray-600 align-middle whitespace-nowrap">
                          {dateStr}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* 모바일 목록
              - md 미만 화면에서는 터치하기 쉬운 카드형 리스트로 표시 */}
          <div className="md:hidden">
            <ul className="max-w-screen-xl mx-auto px-4 space-y-4">
              {paginatedItems.map((it, idx) => {
                const number = filtered.length - ((page - 1) * PAGE_SIZE + idx);
                const dateStr =
                  (it.dateObj && it.dateObj.toISOString().slice(0, 10)) ||
                  it.date ||
                  "";

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
                            <span
                              className="h-3 w-px bg-gray-300"
                              aria-hidden="true"
                            />
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

      {/* 페이지네이션 컨트롤
          - 한 페이지에 PAGE_SIZE(9개)씩 표시 */}
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
