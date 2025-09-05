// src/pages/about/History.jsx
const raw = [
  { date: "2024.11", event: "가칭) 복지디자인사회적협동조합 창립총회 개최" },
  {
    date: "2024.12",
    event: "가칭) 복지디자인사회적협동조합 설립동의자 모집 및 준비모임",
  },
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
      className="max-w-7xl mx-auto px-3 md:px-6 lg:px-8 py-16"
      style={{ "--accent": "#0ea5e9", "--accent-soft": "rgba(14,165,233,.12)" }}
    >
      {/* 브레드크럼 */}
      <p className="text-sm text-gray-500 mb-2">소개 &gt; 연혁</p>

      {/* 제목 */}
      <h1 className="text-3xl md:text-4xl font-extrabold mb-10">연혁</h1>

      {/* 타임라인 래퍼: 바깥으로 당기기 위해 음수 마진 */}
      <div className="relative lg:-ml-16 xl:-ml-24">
        {Object.keys(byYear)
          .sort() // 2024 -> 2025 ...
          .map((year) => (
            <section key={year} className="relative mb-16">
              {/* 왼쪽 연도 배지 */}
              <div className="flex items-center gap-6">
                <div className="relative shrink-0">
                  {/* glow */}
                  <div
                    className="absolute -inset-2 rounded-full bg-[var(--accent)] opacity-25 blur-md"
                    aria-hidden="true"
                  />
                  <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full bg-[var(--accent)] text-white flex items-center justify-center text-xl md:text-2xl font-extrabold ring-4 ring-white shadow-xl">
                    {year}
                  </div>
                </div>

                {/* 세로 라인 + 카드들 */}
                <div className="relative flex-1">
                  <div className="absolute left-3 md:left-4 top-0 bottom-0 border-l-2 border-dashed border-[var(--accent)]/20" />
                  <div className="space-y-8 ml-12 md:ml-20 lg:ml-28">
                    {byYear[year].map((item, i) => (
                      <div key={i} className="relative">
                        {/* node dot on the line */}
                        <span className="absolute -left-3 md:-left-4 top-6 w-3 h-3 md:w-3.5 md:h-3.5 rounded-full bg-[var(--accent)] ring-4 ring-white" />
                        <article className="bg-white border rounded-xl shadow-sm p-5 md:p-6 hover:shadow-md transition-shadow">
                          <time className="inline-block px-3 py-1 text-xs font-semibold text-[var(--accent)] bg-[var(--accent-soft)] rounded-full">
                            {item.ym}
                          </time>
                          <p className="mt-3 text-gray-800">{item.event}</p>
                        </article>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          ))}
      </div>
    </div>
  );
}
