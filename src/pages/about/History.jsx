/**
 * History.jsx (연혁 페이지)
 * - 복지디자인 사회적협동조합의 주요 활동/준비 과정을 연도별 타임라인으로 정리한 페이지
 * - 원자료(raw)를 날짜 기준으로 정렬한 뒤, 연도별로 그룹핑(byYear)하여 카드 형태로 렌더링
 * - 모바일 우선(Mobile-first) 레이아웃을 기반으로, md 이상에서 데스크톱 간격/가이드를 복원
 */

// 연혁 원자료
// - date는 "YYYY.MM" 형태로 작성(정렬/그룹핑 기준)
// - event는 해당 월의 핵심 이벤트를 간단 문장으로 기록
const raw = [
  { date: "2025.05", event: "가칭) 복지디자인사회적협동조합 실무자 교육 진행" },
  { date: "2025.06", event: "가칭) 복지디자인사회적협동조합 설립 추진단 결성" },
  { date: "2024.11", event: "가칭) 복지디자인사회적협동조합 창립총회 개최" },
  { date: "2024.12", event: "가칭) 복지디자인사회적협동조합 설립동의자 모집 및 준비모임" },
];

// 날짜 오름차순 정렬 → 연도별 그룹핑(byYear) 생성
const byYear = raw
  .slice()
  .sort((a, b) => a.date.localeCompare(b.date))
  .reduce((acc, item) => {
    // "YYYY.MM"을 연도/월로 분리
    const [y, m] = item.date.split(".");
    // 해당 연도 배열이 없으면 생성 후, "YYYY. MM" 표시용 문자열과 이벤트를 저장
    (acc[y] ||= []).push({ ym: `${y}. ${m}`, event: item.event });
    return acc;
  }, {});

// 소개 > 연혁 페이지 컴포넌트
export default function AboutHistory() {
  // 페이지 전용 컬러 팔레트 및 레이아웃 가이드 변수(로고 컬러 반영)
  // CSS 변수로 정의하여 타임라인 간격/레일 위치를 화면 크기별로 유연하게 제어
  const themeVars = {
    "--pri": "#F26C2A",
    "--sec": "#2CB9B1",
    "--acc": "#F4C542",
    "--pri-soft": "rgba(242,108,42,0.10)",
    "--sec-soft": "rgba(44,185,177,0.10)",
    "--title-guide": "20px",
    "--timeline-guide": "20px",
    // default: MOBILE first
    "--year-block": "56px",
    "--timeline-offset": "32px",
    "--rail": "0px",
    // desktop targets (used via media queries below)
    "--year-block-desktop": "72px",
    "--timeline-offset-desktop": "calc(var(--timeline-guide) + 80px)",
    "--rail-desktop": "-4px"
  };

  return (
    <>
      {/* 페이지 전용 CSS 변수(themeVars)를 루트 컨테이너에 주입하여 하위 타임라인 레이아웃을 제어 */}
      <div
        className="relative max-w-7xl mx-auto px-0 pt-0 pb-14 overflow-x-hidden"
        style={themeVars}
      >
        <style>{`
          /* 모바일 우선(Mobile-first) 변수 값은 위 themeVars에서 기본으로 설정 */
          .history-wrapper {
            /* 모바일에서는 추가 규칙이 필요 없음(기본 변수만으로 레이아웃 완성) */
          }
          /* md 이상(768px~): 데스크톱 간격/레일 위치를 원래 값으로 복원 */
          @media (min-width: 768px) {
            .history-wrapper {
              --year-block: var(--year-block-desktop);
              --timeline-offset: var(--timeline-offset-desktop);
              --rail: var(--rail-desktop);
            }
          }
        `}</style>

        {/* 상단 소프트 그라데이션 */}
        <div
          className="pointer-events-none absolute inset-x-0 -top-8 h-20 bg-gradient-to-b from-[var(--pri-soft)] via-[var(--sec-soft)] to-transparent blur-2xl"
          aria-hidden="true"
        />

        {/* 상단 헤더: 브레드크럼 + 페이지 타이틀 */}
        <header className="max-w-screen-xl mx-auto px-4 pt-10">
          <p className="text-sm text-black/80">
            소개 &gt; <span className="text-black">연혁</span>
          </p>
          <h1 className="mt-3 text-3xl md:text-4xl font-extrabold tracking-tight">
            연혁
          </h1>
        </header>

        {/* 타임라인 래퍼: 좌측 가이드(timeline-offset) 기준으로 연도/카드를 배치 */}
        <div className="history-wrapper relative mt-5 px-4 pr-5 md:px-0 md:pr-0 overflow-x-visible" style={{ paddingLeft: "var(--timeline-offset)" }}>
          {/* 연도별로 섹션을 렌더링(최신 연도가 위로 오도록 내림차순 표시) */}
          {Object.keys(byYear)
            .sort((a, b) => b.localeCompare(a))
            .map((year) => (
              <section key={year} className="relative mb-16">
                {/* 연도 헤더 */}
                <div className="pl-1 mb-6 relative" style={{ height: "var(--year-block)" }}>
                  <div
                    className="absolute left-[var(--rail)] flex flex-col items-center -translate-x-0 md:-translate-x-1/2"
                  >
                    {/* 그라데이션 텍스트 */}
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

                {/* 세로 라인 + 카드들 */}
                <div className="relative flex-1 min-w-0 pl-9 md:pl-10 lg:pl-12 overflow-x-visible">
                  {/* 세로 레일(점선)이 페이지의 좌측 가이드(rail) 위치에 정렬되도록 배치 */}
                  <div
                    className="absolute bottom-6 border-l-2 border-dashed border-[var(--pri)]/30"
                    style={{ left: "var(--rail)", top: "calc(var(--year-block) - 28px)" }}
                  />

                  <div className="space-y-6 md:space-y-8">
                    {/* 해당 연도에 속한 월별 이벤트를 카드로 나열 */}
                    {byYear[year].map((item, i) => (
                      <div key={i} className="relative">
                        {/* 이벤트 카드(좌측 컬러 바 + 날짜 뱃지 + 설명 텍스트) */}
                        <article className="relative w-full max-w-full min-w-0 bg-white/90 backdrop-blur-sm border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition overflow-visible md:overflow-hidden">
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[var(--pri)] to-[var(--sec)]" />
                          <div className="p-4 pr-6 md:p-6 max-w-full">
                            <time className="inline-block px-3 py-1 text-xs font-semibold text-[var(--pri)] bg-[var(--pri-soft)] rounded-full">
                              {item.ym}
                            </time>
                            <p className="mt-2 md:mt-3 font-medium text-slate-800 leading-relaxed break-keep break-words" style={{ overflowWrap: 'anywhere', wordBreak: 'keep-all', lineHeight: 1.6 }}>
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
