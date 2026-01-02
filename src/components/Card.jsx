/**
 * Card.jsx
 * -----------------------------------------------------------------------------
 * [컴포넌트 목적]
 *  - 제목/이미지/설명을 한 장의 카드 UI로 보여주는 재사용 컴포넌트
 *  - 목록/그리드 섹션에서 동일한 카드 스타일을 반복 렌더링할 때 사용
 *
 * [Props]
 *  - title: 카드 제목 텍스트(이미지 대체 텍스트에도 사용)
 *  - image: 카드 썸네일 이미지 URL(없으면 이미지 영역만 빈 상태로 유지)
 *  - desc : 카드 설명(보조 문장)
 * -----------------------------------------------------------------------------
 */
export default function Card({ title, image, desc }) {
  return (
    // 카드 외곽 컨테이너: 둥근 모서리 + 그림자 + hover 시 강조
    <article className="bg-white rounded-2xl shadow hover:shadow-md transition p-4">
      {/* 이미지 영역: 16:9 비율 고정(리스트/그리드에서 높이 균일 유지) */}
      <div className="aspect-[16/9] w-full overflow-hidden rounded-xl bg-gray-100">
        {/* image가 있을 때만 실제 이미지 렌더링 */}
        {image && (
          <img src={image} alt={title} className="w-full h-full object-cover" />
        )}
      </div>

      {/* 텍스트 영역: 제목 + 설명 */}
      <h3 className="mt-3 font-bold">{title}</h3>
      <p className="text-sm text-gray-600">{desc}</p>
    </article>
  );
}
