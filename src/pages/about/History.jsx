// src/pages/about/History.jsx

// 원자료 (오름차순 정렬 기준: YYYY.MM)
const raw = [
  { date: "2025.05", event: "가칭) 복지디자인사회적협동조합 실무자 교육 진행" },
  { date: "2025.06", event: "가칭) 복지디자인사회적협동조합 설립 추진단 결성" },
  { date: "2024.11", event: "가칭) 복지디자인사회적협동조합 창립총회 개최" },
  { date: "2024.12", event: "가칭) 복지디자인사회적협동조합 설립동의자 모집 및 준비모임" },
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
    "--title-guide": "20px",
    "--timeline-guide": "20px",
    "--year-block": "72px",
    "--rail": "-4px" // page left guide fine‑tune (align to header guide)
  };

  return (
    <div
      className="relative max-w-7xl mx-auto px-0 pt-0 pb-16"
      style={themeVars}
    >
      {/* 상단 소프트 그라데이션 */}
      <div
        className="pointer-events-none absolute inset-x-0 -top-10 h-24 bg-gradient-to-b from-[var(--pri-soft)] via-[var(--sec-soft)] to-transparent blur-2xl"
        aria-hidden="true"
      />

      {/* 헤더: whatIs.jsx와 동일 규격 */}
      <header className="max-w-screen-xl mx-auto px-4 pt-10">
        <p className="text-sm text-black/80">
          소개 &gt; <span className="text-black">연혁</span>
        </p>
        <h1 className="mt-3 text-3xl md:text-4xl font-extrabold tracking-tight">
          연혁
        </h1>
      </header>

      {/* 모바일 전용 타임라인 */}
      <div className="md:hidden mt-6">
        {Object.keys(byYear)
          .sort((a, b) => b.localeCompare(a))
          .map((year) => (
            <section key={year} className="relative mb-16">
              {/* 연도 헤더 */}
              <div className="pl-1 mb-6 relative h-14 md:h-[var(--year-block)]">
                <div
                  className="absolute left-6 flex flex-col items-center"
                  style={{ transform: "translateX(0)" }}
                >
                  {/* 그라데이션 텍스트 */}
                  <h2 className="text-2xl md:text-3xl font-black tracking-tight leading-none">
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
              <div className="relative flex-1 pl-8">
                {/* vertical rail aligned to the page's left guide */}
                <div
                  className="absolute left-6 border-l-2 border-dashed border-[var(--pri)]/30"
                  style={{ top: "calc(56px - 24px)", bottom: 0 }}
                />

                <div className="space-y-6">
                  {byYear[year].map((item, i) => (
                    <div key={i} className="relative">
                      {/* card */}
                      <article className="relative bg-white/95 backdrop-blur-sm border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition overflow-hidden">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[var(--pri)] to-[var(--sec)]" />
                        <div className="p-4 pr-5">
                          <time className="inline-block px-3 py-1 text-[11px] font-semibold text-[var(--pri)] bg-[var(--pri-soft)] rounded-full">
                            {item.ym}
                          </time>
                          <p className="mt-2 font-medium text-slate-800 leading-[1.55]">
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

      {/* 데스크탑 전용 타임라인 */}
      <div className="hidden md:block mt-6">
        {Object.keys(byYear)
          .sort((a, b) => b.localeCompare(a))
          .map((year) => (
            <section key={year} className="relative mb-16">
              {/* 연도 헤더 */}
              <div className="pl-1 mb-6 relative h-14 md:h-[var(--year-block)]">
                <div
                  className="absolute left-[var(--rail)] flex flex-col items-center -translate-x-1/2"
                >
                  {/* 그라데이션 텍스트 */}
                  <h2 className="text-2xl md:text-3xl font-black tracking-tight leading-none">
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
              <div className="relative flex-1 pl-12">
                {/* vertical rail aligned to the page's left guide */}
                <div
                  className="absolute left-[var(--rail)] border-l-2 border-dashed border-[var(--pri)]/30"
                  style={{ top: 0, bottom: 0 }}
                />

                <div className="space-y-8">
                  {byYear[year].map((item, i) => (
                    <div key={i} className="relative">
                      {/* card */}
                      <article className="relative bg-white/95 backdrop-blur-sm border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition overflow-hidden">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[var(--pri)] to-[var(--sec)]" />
                        <div className="p-6 pr-5">
                          <time className="inline-block px-3 py-1 text-xs font-semibold text-[var(--pri)] bg-[var(--pri-soft)] rounded-full">
                            {item.ym}
                          </time>
                          <p className="mt-3 font-medium text-slate-800 leading-[1.55]">
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
