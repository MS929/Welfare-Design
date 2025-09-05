// src/pages/about/History.jsx
export default function AboutHistory() {
  const history = {
    2024: [
      {
        date: "2024. 11",
        event: "가칭) 복지디자인사회적협동조합 창립총회 개최",
      },
      {
        date: "2024. 12",
        event: "가칭) 복지디자인사회적협동조합 설립동의자 모집 및 준비모임",
      },
    ],
    2025: [
      {
        date: "2025. 05",
        event: "가칭) 복지디자인사회적협동조합 실무자 교육 진행",
      },
      {
        date: "2025. 06",
        event: "가칭) 복지디자인사회적협동조합 설립 추진단 결성",
      },
    ],
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      {/* 브레드크럼 */}
      <p className="text-sm text-gray-500 mb-2">소개 &gt; 연혁</p>

      {/* 제목 */}
      <h1 className="text-3xl md:text-4xl font-extrabold mb-12">연혁</h1>

      {/* 타임라인 */}
      <div className="relative">
        {Object.keys(history)
          .sort()
          .map((year) => (
            <div key={year} className="mb-16 relative">
              {/* 연도 표시 */}
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 flex items-center justify-center bg-sky-500 text-white font-bold text-xl rounded-full shadow">
                  {year}
                </div>
                <div className="flex-1 h-0.5 bg-sky-200 ml-4"></div>
              </div>

              {/* 해당 연도의 이벤트들 */}
              <div className="ml-10 border-l-2 border-sky-200 pl-6">
                {history[year].map((item, i) => (
                  <div key={i} className="mb-8">
                    <div className="bg-white border rounded-xl shadow-md p-5">
                      <time className="inline-block px-3 py-1 text-xs font-semibold text-sky-600 bg-sky-50 rounded-full">
                        {item.date}
                      </time>
                      <p className="mt-3 text-gray-800">{item.event}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
