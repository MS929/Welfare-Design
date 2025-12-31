/**
 * _Layout.jsx
 * --------------------------------------------------
 * 사업(Business) 섹션 공통 레이아웃 컴포넌트
 *
 * 이 파일은 "사업 페이지들에서 반복되는 상단 UI(브레드크럼 + 제목)"를
 * 한 곳에서 공통 관리하기 위해 존재한다.
 *
 * - title   : 현재 페이지 제목 (브레드크럼, h1 제목에 사용)
 * - children: 각 사업 페이지의 본문 콘텐츠
 */
export default function BizLayout({
  /** 현재 페이지 제목 (브레드크럼 및 h1 제목에 공통 사용) */
  title,

  /** 각 사업 페이지의 실제 콘텐츠 */
  children,
}) {
  return (
    <div className="bg-white">
      {/* 상단 영역: 브레드크럼 + 페이지 제목 */}
      <section className="max-w-screen-xl mx-auto px-4 pt-10">
        {/* 브레드크럼: "사업 > 현재 페이지 제목" */}
        <nav className="text-sm text-gray-500">
          사업 &gt; <span className="text-gray-700">{title}</span>
        </nav>

        {/* 페이지 메인 제목 */}
        <h1 className="mt-3 text-3xl md:text-4xl font-extrabold">{title}</h1>
      </section>

      {/* 본문 영역: 각 페이지에서 전달된 children 렌더링 */}
      <section className="max-w-screen-xl mx-auto px-4 py-10">
        {children}
      </section>
    </div>
  );
}
