// -----------------------------------------------------------------------------
// [컴포넌트 목적]
//  - 홈(Home) 화면 하단에 노출되는 빠른 이동(Shortcut) 버튼 섹션
//  - 주요 페이지로의 접근성을 높이기 위한 원형 버튼 UI 제공
//
// [구성 방식]
//  - 버튼 목록은 items 배열로 관리하여 추가/수정 시 구조 변경을 최소화
//  - 각 버튼은 동일한 크기/스타일을 유지하며 반응형 크기만 조절
// -----------------------------------------------------------------------------

// 빠른 이동 버튼에 사용될 라벨 및 링크 정의
const items = [
  { label: "???", link: "#" },
  { label: "???", link: "#" },
  { label: "???", link: "#" },
  { label: "???", link: "#" },
];

// 홈 화면 하단에 배치되는 바로가기 버튼 모음 컴포넌트
export default function ShortcutButtons() {
  return (
    <>
      {/* 바로가기 버튼 섹션 영역 */}
      <section className="bg-emerald-100 py-8">
        {/* 버튼 영역을 가운데 정렬하는 컨테이너 */}
        <div className="max-w-6xl mx-auto flex flex-wrap justify-center gap-6">
          {/* items 배열을 순회하여 바로가기 버튼 렌더링 */}
          {items.map((it, idx) => (
            <>
              {/* 단일 바로가기 버튼(원형 UI, hover 시 시각적 피드백 제공) */}
              <a
                key={idx}
                href={it.link}
                className="bg-white w-28 h-28 md:w-32 md:h-32 rounded-full shadow grid place-items-center text-center text-sm font-semibold hover:bg-sky-50"
              >
                {it.label}
              </a>
            </>
          ))}
        </div>
      </section>
    </>
  );
}
