/**
 * ShortcutButtons.jsx
 * - 메인 페이지(Home)에 노출되는 빠른 이동(Shortcut) 버튼 섹션
 * - 주요 페이지로 바로 이동할 수 있는 원형 버튼 UI 제공
 * - 버튼 목록은 items 배열로 관리하여 확장/수정이 용이하도록 구성
 */

// 빠른 이동 버튼에 사용될 라벨과 링크 목록
// 실제 서비스 연결 시 label/link 값만 교체하면 됨
const items = [
  { label: "???", link: "#" },
  { label: "???", link: "#" },
  { label: "???", link: "#" },
  { label: "???", link: "#" },
];

// 메인 페이지 하단에 배치되는 바로가기 버튼 모음 컴포넌트
export default function ShortcutButtons() {
  return (
    <>
      {/* 바로가기 버튼 섹션 전체 영역 */}
      <section className="bg-emerald-100 py-8">
        {/* 화면 폭을 제한하고 버튼들을 가운데 정렬하는 컨테이너 */}
        <div className="max-w-6xl mx-auto flex flex-wrap justify-center gap-6">
          {/* items 배열을 순회하며 개별 바로가기 버튼 렌더링 */}
          {items.map((it, idx) => (
            <>
              {/* 단일 바로가기 버튼 (원형 UI) */}
              {/* hover 시 배경색 변경으로 인터랙션 제공 */}
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
