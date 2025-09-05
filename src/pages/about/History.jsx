// src/pages/about/History.jsx
export default function AboutHistory() {
  // 연혁을 연도별로 그룹화하여 오름차순으로 정렬
  const history = [
    // 2024년
    { date: "2024. 11", event: "가칭) 복지디자인사회적협동조합 창립총회 개최" },
    { date: "2024. 12", event: "가칭) 복지디자인사회적협동조합 설립동의자 모집 및 준비모임" },

    // 2025년
    { date: "2025. 05", event: "가칭) 복지디자인사회적협동조합 실무자 교육 진행" },
    { date: "2025. 06", event: "가칭) 복지디자인사회적협동조합 설립 추진단 결성" },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      {/* 브레드크럼 */}
      <p className="text-sm text-gray-500 mb-2">소개 &gt; 연혁</p>

      {/* 제목 */}
      <h1 className="text-3xl md:text-4xl font-extrabold mb-12">연혁</h1>

      {/* 타임라인 */}
      <div className="relative border-l-2 border-sky-200">
        {history.map((item, i) => (
          <div key={i} className="mb-12 ml-8 relative">

            {/* 카드 */}
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
  );
}
