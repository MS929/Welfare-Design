// src/pages/about/History.jsx
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
  return (
    <div
      className="relative max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-16"
      style={{ "--accent": "#0ea5e9", "--accent-soft": "rgba(14,165,233,.12)" }}
    >
      {/* soft background glow */}
      <div
        className="pointer-events-none absolute inset-x-0 -top-24 h-64 bg-gradient-to-b from-[var(--accent-soft)]/60 to-transparent blur-2xl"
        aria-hidden="true"
      />

      {/* 브레드크럼 */}
      <p className="text-sm text-gray-500 mb-2">소개 &gt; 연혁</p>

      {/* 제목 */}
      <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-12">연혁</h1>

      {/* 타임라인 래퍼: 살짝 바깥으로 */}
      <div className="relative lg:-ml-10 xl:-ml-16">
        {Object.keys(byYear)
          .sort()
          .map((year) => (
            <section key={year} className="relative mb-16">
              {/* 연도 헤더 - 원형 대신 리본/타이포 스타일 */}
              <div className="pl-1 mb-6 flex items-center gap-3">
                <span className="h-6 w-1.5 rounded bg-[var(--accent)]" />
                <h2 className="text-2xl md:text-3xl font-black tracking-tight">
                  <span className="bg-gradient-to-r from-[var(--accent)] to-sky-400 bg-clip-text text-transparent">
                    {year}
                  </span>
                </h2>
                <span className="ml-1 px-2 py-0.5 text-xs font-semibold rounded-full bg-[var(--accent-soft)] text-[var(--accent)]">
                  YEAR
                </span>
              </div>

              {/* 세로 라인 + 카드들 */}
              <div className="relative flex-1">
                {/* vertical line */}
                <div className="absolute left-2 md:left-3 top-0 bottom-0 border-l-2 border-dashed border-[var(--accent)]/30" />

                <div className="space-y-8 ml-10 md:ml-14 lg:ml-16">
                  {byYear[year].map((item, i) => (
                    <div key={i} className="relative">
                      {/* 다이아몬드 노드 */}
                      <span className="absolute -left-4 md:-left-5 top-6 block w-2.5 h-2.5 rotate-45 bg-[var(--accent)] shadow-sm" />

                      {/* 카드 */}
                      <article className="relative bg-white/85 backdrop-blur-sm border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition overflow-hidden">
                        {/* 좌측 컬러 스트립 */}
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[var(--accent)] to-sky-400" />

                        <div className="p-5 md:p-6">
                          <time className="inline-block px-3 py-1 text-xs font-semibold text-[var(--accent)] bg-[var(--accent-soft)] rounded-full">
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
