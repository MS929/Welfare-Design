// src/pages/about/History.jsx

// 원자료 (오름차순 정렬 기준: YYYY.MM)
const raw = [
  { date: "2024.11", event: "가칭) 복지디자인사회적협동조합 창립총회 개최" },
  { date: "2024.12", event: "가칭) 복지디자인사회적협동조합 설립동의자 모집 및 준비모임" },
  { date: "2025.05", event: "가칭) 복지디자인사회적협동조합 실무자 교육 진행" },
  { date: "2025.06", event: "가칭) 복지디자인사회적협동조합 설립 추진단 결성" },
];

// 날짜 오름차순 정렬 + 년도별 그룹
const byYear = raw
  .slice()
  .sort((a, b) => a.date.localeCompare(b.date))
  .reduce((acc, item) => {
    const [y, m] = item.date.split(".");
    (acc[y] ||= []).push({ ym: `${y}. ${m}`, event: item.event });
    return acc;
  }, {});

export default function AboutHistory() {
  // 페이지 전용 팔레트(로고 컬러 반영)
  // Primary(주황)   : #F26C2A
  // Secondary(청록) : #2CB9B1
  // Accent(노랑)    : #F4C542
  const themeVars = {
    "--pri": "#F26C2A",
    "--sec": "#2CB9B1",
    "--acc": "#F4C542",
    "--pri-soft": "rgba(242,108,42,0.10)",
    "--sec-soft": "rgba(44,185,177,0.10)",
  };

  return (
    <div
      className="relative max-w-7xl mx-auto px-4 md:px-6 lg:px-8 pt-2 pb-12"
      style={themeVars}
    >
      {/* 상단 소프트 그라데이션 */}
      <div
        className="pointer-events-none absolute inset-x-0 -top-24 h-48 bg-gradient-to-b from-[var(--pri-soft)] via-[var(--sec-soft)] to-transparent blur-2xl"
        aria-hidden="true"
      />

      {/* 헤더: whatIs.jsx와 동일 규격 */}
      <header className="mx-auto max-w-[1040px] px-4 sm:px-6 lg:px-8 pt-8">
        <nav className="text-sm text-slate-500">
          소개 &gt; <span className="text-slate-700">연혁</span>
        </nav>
        <h1 className="mt-4 text-4xl font-extrabold tracking-tight">연혁</h1>
      </header>

      {/* 타임라인 래퍼: 넓게 보이도록 살짝 좌측으로 */}
      <div className="relative mt-8">
        {Object.keys(byYear)
          .sort()
          .map((year) => (
            <section key={year} className="relative mb-16">
              {/* 연도 헤더 */}
              <div className="pl-1 mb-6 flex items-center gap-3">
                {/* 작은 색 바 */}
                <span className="h-6 w-1.5 rounded bg-[var(--pri)]" />
                {/* 그라데이션 텍스트 */}
                <h2 className="text-2xl md:text-3xl font-black tracking-tight">
                  <span className="bg-gradient-to-r from-[var(--pri)] to-[var(--sec)] bg-clip-text text-transparent">
                    {year}
                  </span>
                </h2>
                <span className="ml-1 px-2 py-0.5 text-xs font-semibold rounded-full bg-[var(--pri-soft)] text-[var(--pri)]">
                  YEAR
                </span>
              </div>

              {/* 세로 라인 + 카드들 */}
              <div className="relative flex-1">
                {/* vertical line (연한 주황) */}
                <div className="absolute left-2 md:left-3 top-0 bottom-0 border-l-2 border-dashed border-[var(--pri)]/30" />

                <div className="space-y-8 ml-10 md:ml-14 lg:ml-16">
                  {byYear[year].map((item, i) => (
                    <div key={i} className="relative">
                      {/* 타임라인 노드: 다이아몬드 */}
                      <span className="absolute -left-4 md:-left-5 top-6 block w-2.5 h-2.5 rotate-45 bg-[var(--pri)] shadow-sm" />

                      {/* 카드 */}
                      <article className="relative bg-white/90 backdrop-blur-sm border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition overflow-hidden">
                        {/* 좌측 컬러 스트립: 주황 → 청록 */}
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[var(--pri)] to-[var(--sec)]" />

                        <div className="p-5 md:p-6">
                          <time className="inline-block px-3 py-1 text-xs font-semibold text-[var(--pri)] bg-[var(--pri-soft)] rounded-full">
                            {item.ym}
                          </time>
                          <p className="mt-2 md:mt-3 font-medium text-slate-800 leading-relaxed">
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
  );
}
