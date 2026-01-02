/**
// -----------------------------------------------------------------------------
// [컴포넌트 목적]
//  - 메인(Home) 화면 상단에 노출되는 이미지 슬라이더(캐러셀) 컴포넌트
//  - slides 배열에 정의된 이미지와 문구를 순환 표시
//
// [동작 방식]
//  - 좌/우 버튼 클릭으로 이전·다음 슬라이드로 순환 이동
//  - 첫 슬라이드 이전 → 마지막, 마지막 이후 → 첫 슬라이드로 연결
//
// [구성]
//  - 배너 이미지 + 하단 설명 텍스트 + 좌/우 이동 버튼
// -----------------------------------------------------------------------------
*/
import { useState } from "react";

// 슬라이더에 사용될 배너 이미지 및 문구 데이터
const slides = [
  { id: 1, image: "/images/banner1.jpg", text: "함께하는 사회" },
  { id: 2, image: "/images/banner2.jpg", text: "연대와 지원" },
];

// 메인 배너 영역에 표시되는 슬라이더 컴포넌트
export default function Slider() {
  // 현재 표시 중인 슬라이드의 인덱스 상태
  const [i, setI] = useState(0);
  // 이전 슬라이드로 이동 (첫 슬라이드에서 이전 시 마지막으로 순환)
  const prev = () => setI((i - 1 + slides.length) % slides.length);
  // 다음 슬라이드로 이동 (마지막 슬라이드 이후 처음으로 순환)
  const next = () => setI((i + 1) % slides.length);

  return (
    // 슬라이더 전체 영역: 고정 높이 + overflow hidden으로 영역 제한
    <section className="relative w-full h-64 md:h-[420px] overflow-hidden bg-gray-200">
      {/* 현재 슬라이드의 배너 이미지 */}
      {slides[i].image && (
        <img
          src={slides[i].image}
          alt=""
          className="w-full h-full object-cover"
          onError={(e) => {
            // 이미지 로딩 실패 시 img 요소를 숨겨 깨진 이미지 노출 방지
            e.currentTarget.style.display = "none";
          }}
        />
      )}
      {/* 배너 하단에 표시되는 슬라이드 설명 텍스트 */}
      <div className="absolute inset-x-0 bottom-4 text-center">
        <span className="inline-block bg-black/40 text-white text-sm md:text-base px-3 py-1 rounded">
          {slides[i].text}
        </span>
      </div>
      {/* 이전 슬라이드 이동 버튼 */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow"
      >
        ◀
      </button>
      {/* 다음 슬라이드 이동 버튼 */}
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow"
      >
        ▶
      </button>
    </section>
  );
}
