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
    "--guide": "180px",
    "--rail": "-4px" // page left guide fine‑tune (align to header guide)
  };

  return (
    <div
      className="relative max-w-7xl mx-auto px-4 md:px-6 lg:px-8 pt-0 pb-14"
      style={themeVars}
    >
      {/* 상단 소프트 그라데이션 */}
      <div
        className="pointer-events-none absolute inset-x-0 -top-8 h-20 bg-gradient-to-b from-[var(--pri-soft)] via-[var(--sec-soft)] to-transparent blur-2xl"
        aria-hidden="true"
      />

      {/* 헤더: whatIs.jsx와 동일 규격 + 좌측 레일 정렬 */}
      <section className="px-4 md:px-6 lg:px-8 mt-2 flex flex-col items-start" style={{ paddingLeft: "var(--guide)" }}>
        {/* breadcrumb pill (좌측 레일 맞춤) */}
        <div className="mb-3">
          <span className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1 text-sm text-slate-600 shadow-sm">
            <span className="text-slate-400">소개</span>
            <span className="text-slate-300">›</span>
            <span className="font-semibold text-slate-700">연혁</span>
          </span>
        </div>
        {/* page title */}
        <h1 className="text-3xl md:text-4xl font-extrabold leading-tight tracking-tight">
          연혁
        </h1>
      </section>

      {/* 타임라인 래퍼: Establishment와 맞추기 위해 좌측 고정 여백 부여 */}
      <div className="relative mt-5" style={{ paddingLeft: "var(--guide)", "--rail": "-4px" }}>
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
              <div className="relative flex-1 pl-8 md:pl-10 lg:pl-12">
                {/* vertical rail aligned to the page's left guide */}
                <div
                  className="absolute top-0 bottom-0 border-l-2 border-dashed border-[var(--pri)]/30"
                  style={{ left: "var(--rail)" }}
                />

                <div className="space-y-8">
                  {byYear[year].map((item, i) => (
                    <div key={i} className="relative">
                      {/* timeline diamond pinned to the rail */}
                      <span
                        className="absolute top-6 block w-2.5 h-2.5 rotate-45 bg-[var(--pri)] shadow-sm"
                        style={{ left: "calc(var(--rail) - 5px)" }}
                      />
                      <span
                        className="absolute top-[26px] h-[2px] bg-gradient-to-r from-[var(--pri)] to-[var(--sec)] opacity-60"
                        style={{ left: "var(--rail)", width: "20px" }}
                      />
                      {/* card */}
                      <article className="relative bg-white/90 backdrop-blur-sm border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition overflow-hidden">
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
