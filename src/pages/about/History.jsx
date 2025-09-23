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
    "--rail": "-4px" // desktop default
  };

  // 안전 가드: 외부 전역/모듈의 byYear가 없을 때도 페이지가 깨지지 않도록
  // window.__WD_HISTORY__ 를 우선 사용하고, 없으면 빈 객체로 처리
  const safeByYear =
    (typeof byYear !== "undefined" && byYear) ||
    (typeof window !== "undefined" && window.__WD_HISTORY__) ||
    {};

  return (
    <div
      className="about-history relative max-w-7xl mx-auto px-0 pt-0 pb-14"
      style={themeVars}
    >
      {/* 모바일만 변수 재설정 (데스크톱은 기존 유지) */}
      <style>{`
        @media (max-width: 767.98px) {
          .about-history{ --rail:-2px; --timeline-guide:10px; --year-block:60px; }
          .about-history .mobile-ml{ margin-left:0 !important; }
        }
      `}</style>

      {/* 상단 소프트 그라데이션 (모바일에서는 살짝 약하게 보이도록 높이 축소) */}
      <div
        className="pointer-events-none absolute inset-x-0 -top-8 h-20 md:h-20 bg-gradient-to-b from-[var(--pri-soft)] via-[var(--sec-soft)] to-transparent blur-2xl"
        aria-hidden="true"
      />

      {/* 헤더: whatIs.jsx와 동일 규격 (PC 그대로) */}
      <header className="max-w-screen-xl mx-auto px-4 pt-10">
        <p className="text-sm text-black/80">
          소개 &gt; <span className="text-black">연혁</span>
        </p>
        <h1 className="mt-3 text-3xl md:text-4xl font-extrabold tracking-tight">
          연혁
        </h1>
      </header>

      {/* ===== 데스크톱 타임라인 (기존 그대로) ===== */}
      {Object.keys(safeByYear).length === 0 && (
        <div className="md:px-4 px-4 py-10 text-center text-slate-500">
          등록된 연혁이 없습니다.
        </div>
      )}
      <div className="hidden md:block">
        {/* 타임라인 래퍼: 좌측 고정 여백 유지 */}
        <div className="relative mt-5 mobile-ml" style={{ marginLeft: "calc(var(--timeline-guide) + 80px)" }}>
          {Object.keys(safeByYear)
            .sort((a, b) => b.localeCompare(a))
            .map((year) => (
              <section key={year} className="relative mb-16">
                {/* 연도 헤더 */}
                <div className="pl-1 mb-6 relative" style={{ height: "var(--year-block)" }}>
                  <div className="absolute left-[var(--rail)] flex flex-col items-center -translate-x-1/2">
                    <h2 className="text-2xl md:text-3xl font-black tracking-tight leading-none">
                      <span className="bg-gradient-to-r from-[var(--pri)] to-[var(--sec)] bg-clip-text text-transparent">{year}</span>
                    </h2>
                    <span className="mt-1 px-2 py-0.5 text-xs font-semibold rounded-full bg-[var(--pri-soft)] text-[var(--pri)]">YEAR</span>
                  </div>
                </div>

                {/* 세로 라인 + 카드들 */}
                <div className="relative flex-1 pl-8 md:pl-10 lg:pl-12">
                  <div
                    className="absolute bottom-6 border-l-2 border-dashed border-[var(--pri)]/30"
                    style={{ left: "var(--rail)", top: "calc(var(--year-block) - 40px)" }}
                  />

                  <div className="space-y-8">
                    {safeByYear[year].map((item, i) => (
                      <div key={i} className="relative">
                        <article className="relative bg-white/90 backdrop-blur-sm border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition overflow-hidden">
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[var(--pri)] to-[var(--sec)]" />
                          <div className="p-5 md:p-6">
                            <time className="inline-block px-3 py-1 text-xs font-semibold text-[var(--pri)] bg-[var(--pri-soft)] rounded-full">
                              {item.ym}
                            </time>
                            <p className="mt-3 font-medium text-slate-800 leading-relaxed">{item.event}</p>
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

      {/* ===== 모바일 타임라인 (새 레이아웃) ===== */}
      <div className="md:hidden px-4 mt-6">
        {Object.keys(safeByYear)
          .sort((a, b) => b.localeCompare(a))
          .map((year) => (
            <section key={year} className="mb-10">
              {/* 연도 타이틀: 중앙 정렬, 라벨 간결화 */}
              <div className="text-center mb-3">
                <h2 className="text-2xl font-extrabold tracking-tight">
                  <span className="bg-gradient-to-r from-[var(--pri)] to-[var(--sec)] bg-clip-text text-transparent">{year}</span>
                </h2>
              </div>

              {/* 간단 리스트 카드 (세로 레일 제거, 여백 축소) */}
              <div className="space-y-4">
                {safeByYear[year].map((item, i) => (
                  <article
                    key={i}
                    className="bg-white/95 border border-slate-200 rounded-lg shadow-sm overflow-hidden"
                  >
                    <div className="p-4">
                      <time className="inline-block px-2.5 py-1 text-[11px] font-semibold text-[var(--pri)] bg-[var(--pri-soft)] rounded-full">
                        {item.ym}
                      </time>
                      <p className="mt-2 text-[15px] leading-relaxed text-slate-800">
                        {item.event}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
      </div>
    </div>
  );
}
