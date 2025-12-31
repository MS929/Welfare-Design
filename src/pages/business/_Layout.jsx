/**
 * BizLayout.jsx
 * --------------------------------------------------
 * - 사업(Business) 페이지 공통 레이아웃 컴포넌트
 * - 상단에 브레드크럼 + 페이지 제목을 고정 제공
 * - 실제 페이지 콘텐츠는 children으로 주입받아 렌더링
 * - 사업 관련 페이지들에서 반복되는 레이아웃을 통합 관리하기 위한 목적
 */
export default function BizLayout({
  /** 현재 페이지의 제목 (브레드크럼 및 h1에 공통 사용) */
  title,

  /** 각 사업 페이지의 실제 콘텐츠 */
  children,
}) {
  return (
    /**
     * 전체 페이지 컨테이너
     * - 배경색 흰색 고정
     */
    <div className="bg-white">
      {/* ===== 상단: 브레드크럼 + 페이지 제목 영역 ===== */}
      <section className="max-w-screen-xl mx-auto px-4 pt-10">
        {/* 브레드크럼: 사업 > 현재 페이지 */}
        <nav className="text-sm text-gray-500">
          사업 &gt; <span className="text-gray-700">{title}</span>
        </nav>

        {/* 페이지 메인 제목 */}
        <h1 className="mt-3 text-3xl md:text-4xl font-extrabold">
          {title}
        </h1>
      </section>

      {/* ===== 하단: 페이지별 실제 콘텐츠 영역 ===== */}
      <section className="max-w-screen-xl mx-auto px-4 py-10">
        {children}
      </section>
    </div>
  );
}

/**
 * NOTE:
 * - BizLayout은 사업 페이지 공통 레이아웃이므로
 *   디자인 변경 시 이 파일만 수정하면 전체 사업 페이지에 반영됨
 * - title은 필수 props로 사용하는 것을 권장
 */
