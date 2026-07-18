// -----------------------------------------------------------------------------
// History.jsx
// [페이지 목적]
//  - 소개 > 연혁 페이지
//  - CMS의 src/content/history/*.md[x] 파일을 읽어 연도별 타임라인으로 표시
//
// [데이터 흐름]
//  - Vite import.meta.glob으로 history 폴더의 markdown 원문을 raw 문자열로 로드
//  - frontmatter에서 date/event 값을 파싱
//  - 연도별로 묶고 최신 날짜순으로 정렬하여 타임라인 형태로 렌더링
//
// [예외 처리]
//  - CMS 데이터 로드 실패 또는 데이터가 비어 있을 경우 fallbackRaw 기본 연혁을 표시
//
// [유지보수 위치]
//  - 연혁 추가/수정: CMS의 연혁 메뉴 또는 src/content/history 파일 수정
//  - 기본 예비 연혁 변경: fallbackRaw 배열 수정
//  - 타임라인 색상/간격 변경: themeVars 수정
// -----------------------------------------------------------------------------
import { useEffect, useMemo, useState } from "react";

// CMS 연혁 원문 로드
// - history 폴더의 md/mdx 파일을 raw 문자열로 가져옴
// - 연혁 페이지에서는 이 데이터로 타임라인 항목을 구성함
const HISTORY_MODULES = import.meta.glob("../../content/history/*.{md,mdx}", {
  query: "?raw",
  import: "default",
  eager: true,
});

// CMS 데이터가 없거나 로드에 실패했을 때 사용하는 예비 연혁 데이터
// - 운영 중에는 CMS 데이터가 우선 사용됨
const fallbackRaw = [
  { date: "2025.05", event: "가칭) 복지디자인사회적협동조합 실무자 교육 진행" },
  { date: "2025.06", event: "가칭) 복지디자인사회적협동조합 설립 추진단 결성" },
  { date: "2024.11", event: "가칭) 복지디자인사회적협동조합 창립총회 개최" },
  {
    date: "2024.12",
    event: "가칭) 복지디자인사회적협동조합 설립동의자 모집 및 준비모임",
  },
];

// Markdown frontmatter 파싱
// - 상단 --- 영역의 key:value 값을 data 객체로 변환
// - 나머지 본문은 content로 분리하여 event 값이 없을 때 보조로 사용
function parseFrontmatter(rawText) {
  const text = String(rawText || "");
  const match = text.match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/);

  if (!match) return { data: {}, content: text.trim() };

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

// CMS 연혁 목록 데이터 생성
// - HISTORY_MODULES의 markdown 파일들을 순회하며 date/event 값만 추출
// - 날짜와 내용이 모두 있는 항목만 타임라인에 사용
async function fetchHistoryItems() {
  const items = Object.entries(HISTORY_MODULES).map(([path, raw]) => {
    const { data, content } = parseFrontmatter(raw);

    return {
      id: path,
      date: String(data?.date || "").trim(),
      event: String(data?.event || content || "").trim(),
    };
  });

  return items.filter((item) => item.date && item.event);
}

// 연혁 데이터를 연도별로 그룹화
// - date 값을 기준으로 최신순 정렬
// - 화면 렌더링에 필요한 { 연도: [{ ym, event }] } 구조로 변환
function makeByYear(items) {
  // 정렬용 날짜 숫자 생성
  // - 2026.07 → 202607 형태로 변환하여 비교
  const normalize = (d) => {
    const [y, m = "00"] = String(d).split(".");
    return Number(`${y}${m.padStart(2, "0")}`);
  };

  return items
    .slice()
    .filter((item) => item.date && item.event)
    .sort((a, b) => normalize(b.date) - normalize(a.date))
    .reduce((acc, item) => {
      const [y, m] = String(item.date).split(".");
      const ym = m ? `${y}. ${m}` : y;

      (acc[y] ||= []).push({
        ym,
        event: item.event,
      });

      return acc;
    }, {});
}

// 연혁 페이지 컴포넌트
// - CMS 데이터 로드, fallback 처리, 연도별 그룹화, 타임라인 렌더링을 담당
export default function AboutHistory() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // CMS 연혁 데이터 로드
  // - 데이터가 없거나 오류가 발생하면 fallbackRaw를 사용
  // - alive 플래그로 언마운트 이후 setState가 실행되는 것을 방지
  useEffect(() => {
    let alive = true;

    fetchHistoryItems()
      .then((data) => {
        if (!alive) return;
        setItems(data.length > 0 ? data : fallbackRaw);
      })
      .catch((e) => {
        console.warn("연혁 CMS 데이터 로드 실패:", e);
        if (alive) setItems(fallbackRaw);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, []);

  // 연도별 타임라인 데이터 메모이제이션
  // - items가 바뀔 때만 연도별 그룹을 다시 계산
  const byYear = useMemo(() => makeByYear(items), [items]);

  // 타임라인 디자인 변수
  // - 브랜드 색상, 연도 영역 높이, 세로 라인 위치 등을 CSS 변수로 관리
  const themeVars = {
    "--pri": "#F26C2A",
    "--sec": "#2CB9B1",
    "--acc": "#F4C542",
    "--pri-soft": "rgba(242,108,42,0.10)",
    "--sec-soft": "rgba(44,185,177,0.10)",
    "--title-guide": "20px",
    "--timeline-guide": "20px",
    "--year-block": "56px",
    "--timeline-offset": "32px",
    "--rail": "0px",
    "--year-block-desktop": "72px",
    "--timeline-offset-desktop": "calc(var(--timeline-guide) + 80px)",
    "--rail-desktop": "-4px",
  };

  return (
    <>
      <div
        className="relative max-w-7xl mx-auto px-0 pt-0 pb-14 overflow-x-hidden"
        style={themeVars}
      >
        {/* 데스크톱 타임라인 간격 보정 CSS */}
        <style>{`
          @media (min-width: 768px) {
            .history-wrapper {
              --year-block: var(--year-block-desktop);
              --timeline-offset: var(--timeline-offset-desktop);
              --rail: var(--rail-desktop);
            }
          }
        `}</style>

        {/* 상단 영역: 현재 위치 안내(브레드크럼)와 페이지 제목 */}
        <header className="max-w-screen-xl mx-auto px-4 pt-10">
          <p className="text-sm text-black/80">
            소개 &gt; <span className="text-black">연혁</span>
          </p>

          <h1 className="mt-3 text-3xl md:text-4xl font-extrabold tracking-tight">
            연혁
          </h1>

          {loading && (
            <p className="mt-3 text-sm text-slate-500">
              연혁 데이터를 불러오는 중입니다.
            </p>
          )}

          {!loading && Object.keys(byYear).length === 0 && (
            <p className="mt-3 text-sm text-slate-500">
              등록된 연혁이 없습니다.
            </p>
          )}
        </header>

        {/* 연혁 타임라인 영역
            - byYear 객체를 기준으로 연도별 섹션을 자동 생성 */}
        <div
          className="history-wrapper relative mt-5 px-4 pr-5 md:px-0 md:pr-0 overflow-x-visible"
          style={{ paddingLeft: "var(--timeline-offset)" }}
        >
          {Object.keys(byYear)
            .sort((a, b) => b.localeCompare(a))
            .map((year) => (
              <section key={year} className="relative mb-16">
                <div
                  className="pl-1 mb-6 relative"
                  style={{ height: "var(--year-block)" }}
                >
                  <div className="absolute left-[var(--rail)] flex flex-col items-center -translate-x-0 md:-translate-x-1/2">
                    <h2 className="text-2xl md:text-3xl font-black tracking-tighter md:tracking-tight leading-none">
                      <span className="bg-gradient-to-r from-[var(--pri)] to-[var(--sec)] bg-clip-text text-transparent">
                        {year}
                      </span>
                    </h2>

                    <span className="mt-1 px-2 py-0.5 text-xs font-semibold rounded-full bg-[var(--pri-soft)] text-[var(--pri)]">
                      YEAR
                    </span>
                  </div>
                </div>

                {/* 해당 연도의 연혁 항목 목록 */}
                <div
                  className="relative flex-1 min-w-0 pl-9 md:pl-10 lg:pl-12 overflow-x-visible"
                >
                  {/* 연혁 항목을 따라 내려가는 세로 타임라인 라인 */}
                  <div
                    className="absolute bottom-6 border-l-2 border-dashed border-[var(--pri)]/30"
                    style={{
                      left: "var(--rail)",
                      top: "calc(var(--year-block) - 28px)",
                    }}
                  />

                  <div className="space-y-6 md:space-y-8">
                    {byYear[year].map((item, i) => (
                      <div key={`${item.ym}-${i}`} className="relative">
                        <article className="relative w-full max-w-full min-w-0 bg-white border border-slate-200 rounded-xl shadow-sm overflow-visible md:overflow-hidden">
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[var(--pri)] to-[var(--sec)]" />

                          <div className="p-4 pr-6 md:p-6 max-w-full">
                            <time className="inline-block px-3 py-1 text-xs font-semibold text-[var(--pri)] bg-[var(--pri-soft)] rounded-full">
                              {item.ym}
                            </time>

                            <p
                              className="mt-2 md:mt-3 font-medium text-slate-800 leading-relaxed break-keep break-words"
                              style={{
                                overflowWrap: "anywhere",
                                wordBreak: "keep-all",
                                lineHeight: 1.6,
                              }}
                            >
                              {item.event}
                            </p>
                          </div>
                        </article>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            ))}
        </div>
      </div>
    </>
  );
}
