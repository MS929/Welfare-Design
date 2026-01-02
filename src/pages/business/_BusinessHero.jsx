// -----------------------------------------------------------------------------
// [컴포넌트 목적]
//  - 사업 페이지 상단 또는 주요 섹션에 사용되는 공통 히어로 컴포넌트
//  - 좌측 이미지 + 우측 설명(불릿) + CTA로 구성된 시각적 안내 영역
//
// [설계 의도]
//  - 다양한 사업 페이지에서 재사용할 수 있도록 props 기반으로 구성
//  - 레이아웃과 콘텐츠를 분리하여 유지보수 효율을 높임
// -----------------------------------------------------------------------------
export default function BusinessHero({
  /**
   * 중간 섹션에서 제목 표시 여부 제어
   */
  showHeading = false,

  /** 내부 제목 텍스트 */
  heading,

  /** 내부 제목 하단 보조 설명 */
  subtitle,

  /**
   * 좌측 이미지 경로
   * 예) "/images/business/xxx.png"
   */
  imageSrc,

  /**
   * 우측 설명 불릿 목록
   * - 문자열 배열 형태
   */
  bullets = [],

  /** CTA 버튼에 표시될 텍스트 */
  ctaText,

  /**
   * CTA 링크 URL
   */
  ctaHref,

  /**
   * 페이지 이동 없이 동작을 수행하는 클릭 핸들러
   */
  onCta,

  /** 하단에 작게 표시되는 보조 안내 문구 */
  note,
}) {
  return (
    /**
     * 전체 섹션 컨테이너
     * - 최대 너비 제한 및 중앙 정렬
     */
    <section className="max-w-screen-xl mx-auto px-4">
      {/* ===== 내부 제목 영역 ===== */}
      {showHeading && (
        <div className="mb-6">
          {/* 섹션 제목 */}
          <h2 className="text-2xl md:text-3xl font-extrabold">
            {heading}
          </h2>

          <p className="mt-1 text-lg text-gray-700">
            {subtitle}
          </p>
        </div>
      )}

      {/* ===== 메인 콘텐츠 영역 (2컬럼 레이아웃) ===== */}
      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* 좌측 영역: 대표 이미지 표시
            - 고정 높이를 두지 않아 이미지 잘림을 방지
            - object-contain으로 원본 비율 유지 */}
        <div className="rounded-3xl bg-emerald-200/40 p-3">
          <div className="w-full rounded-2xl overflow-hidden flex items-center justify-center">
            <img
              src={imageSrc}
              alt={heading || subtitle || "business image"}
              /**
               * 이미지 스타일
               * - 큰 화면에서도 과도하게 커지지 않도록 max-height 제한
               * - w-auto + h-auto로 원본 비율 유지
               * - 다양한 화면 크기에서 시각적 균형을 유지하기 위함
               */
              className="max-h-[520px] w-auto h-auto object-contain"
              loading="lazy" // 초기 렌더링 성능 개선을 위한 지연 로딩
            />
          </div>
        </div>

        {/* 우측 영역: 설명 불릿 + CTA 제공 영역 */}
        <div className="rounded-2xl border border-emerald-200 bg-white p-6">
          {/* 설명 불릿 리스트 */}
          <ul className="space-y-3 text-gray-800 leading-relaxed">
            {bullets.map((b, i) => (
              <li key={i} className="flex gap-3">
                {/* 불릿 포인트 표시용 도트 */}
                <span className="mt-1.5 inline-block h-2 w-2 rounded-full bg-emerald-500" />
                <span>{b}</span>
              </li>
            ))}
          </ul>

          <p className="mt-4 text-sm text-gray-500">
            {note}
          </p>

          {/* ===== CTA 버튼 영역 ===== */}
          {ctaText && (ctaHref || onCta) && (
            <div className="pt-6">
              {ctaHref ? (
                /**
                 * 페이지 이동을 통한 다음 단계 유도
                 */
                <a
                  href={ctaHref}
                  className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-6 py-3 text-white font-semibold hover:bg-emerald-600 transition"
                >
                  {ctaText}
                </a>
              ) : (
                /**
                 * 페이지 이동 없이 동작을 수행하는 액션 트리거
                 */
                <button
                  onClick={onCta}
                  className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-6 py-3 text-white font-semibold hover:bg-emerald-600 transition"
                >
                  {ctaText}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
