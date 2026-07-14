/****
 * _Layout.jsx
 * -----------------------------------------------------------------------------
 * [페이지 목적]
 * - 사업 영역 페이지에서 공통으로 사용하는 레이아웃 컴포넌트
 * - 반복되는 브레드크럼, 제목, 본문 영역 구조를 통합 관리
 *
 * [사용 방식]
 * - title: 페이지 제목 및 브레드크럼 표시
 * - children: 각 사업 페이지에서 전달하는 실제 콘텐츠 영역
 *
 * [유지보수 위치]
 * - 사업 페이지 공통 여백/폭 변경: 이 파일 수정
 * - 개별 사업 내용 변경: 각 사업 페이지 수정
 */
export default function BizLayout({
  title,
  children,
}) {
  return (
    <div className="bg-white">
      {/* 사업 페이지 공통 상단 영역 */}
      <section className="max-w-screen-xl mx-auto px-4 pt-10">
        {/* 현재 페이지 위치 표시 */}
        <nav className="text-sm text-gray-500">
          사업 &gt; <span className="text-gray-700">{title}</span>
        </nav>

        {/* 페이지 제목 */}
        <h1 className="mt-3 text-3xl md:text-4xl font-extrabold">{title}</h1>
      </section>

      {/* 각 사업 페이지 콘텐츠 출력 영역 */}
      <section className="max-w-screen-xl mx-auto px-4 py-10">
        {children}
      </section>
    </div>
  );
}
