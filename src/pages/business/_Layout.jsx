/****
 * _Layout.jsx
 * -----------------------------------------------------------------------------
 * 사업(Business) 섹션 공통 레이아웃 컴포넌트
 *
 * 사업 관련 페이지에서 반복되는 상단 구조(브레드크럼 + 페이지 제목)를
 * 하나의 레이아웃으로 분리하여 공통 관리하기 위한 파일이다.
 *
 * 이 레이아웃은 "구조 통일"과 "유지보수 단순화"를 목적으로 하며,
 * 실제 페이지별 콘텐츠는 children으로 주입받아 렌더링한다.
 *
 * props
 * - title    : 현재 페이지 제목
 *              · 브레드크럼 표시
 *              · h1 메인 제목에 공통 사용
 * - children : 각 사업 페이지의 실제 본문 콘텐츠
 */
export default function BizLayout({
  /** 현재 페이지 제목 (브레드크럼 및 h1 제목에 공통 사용) */
  title,

  /** 각 사업 페이지의 실제 콘텐츠 */
  children,
}) {
  return (
    <div className="bg-white">
      {/* 상단 영역: 사업 페이지 공통 브레드크럼 + 제목 */}
      <section className="max-w-screen-xl mx-auto px-4 pt-10">
        {/* 브레드크럼 영역: 현재 페이지의 위치 안내 */}
        <nav className="text-sm text-gray-500">
          사업 &gt; <span className="text-gray-700">{title}</span>
        </nav>

        {/* 페이지 메인 제목(h1): 각 사업 페이지의 핵심 제목 */}
        <h1 className="mt-3 text-3xl md:text-4xl font-extrabold">{title}</h1>
      </section>

      {/* 본문 영역: 각 사업 페이지에서 전달된 실제 콘텐츠 렌더링 */}
      <section className="max-w-screen-xl mx-auto px-4 py-10">
        {children}
      </section>
    </div>
  );
}
