// src/pages/business/_BusinessHero.jsx
/**
 * BusinessHero 컴포넌트
 * --------------------------------------------------
 * - 사업 페이지 상단 또는 섹션용 히어로 컴포넌트
 * - 좌측 이미지와 우측 설명(불릿) 및 CTA 버튼으로 구성
 * - 다양한 사업 페이지에서 재사용 가능하도록 props 기반 설계
 */
export default function BusinessHero({
  /**
   * 내부 섹션 제목 표시 여부
   * - 중간 섹션에서 제목을 표시할 때 사용
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
   * CTA 클릭 핸들러
   * - 라우팅이 아닌 동작(모달, 스크롤 등)에 사용
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
        {/* ------------------------------------------------------------------
            좌측: 이미지 영역
            - 부모에 고정 높이를 두지 않아 이미지 잘림 방지
            - object-contain으로 비율 유지
           ------------------------------------------------------------------ */}
        <div className="rounded-3xl bg-emerald-200/40 p-3">
          <div className="w-full rounded-2xl overflow-hidden flex items-center justify-center">
            <img
              src={imageSrc}
              alt={heading || subtitle || "business image"}
              /**
               * 이미지 스타일
               * - 큰 화면에서도 과도하게 커지지 않도록 max-height 제한
               * - w-auto + h-auto로 원본 비율 유지
               */
              className="max-h-[520px] w-auto h-auto object-contain"
              loading="lazy" // 초기 로딩 성능 최적화
            />
          </div>
        </div>

        {/* ------------------------------------------------------------------
            우측: 설명 및 CTA 영역
           ------------------------------------------------------------------ */}
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
                 * 링크형 CTA
                 * - 페이지 이동 목적
                 */
                <a
                  href={ctaHref}
                  className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-6 py-3 text-white font-semibold hover:bg-emerald-600 transition"
                >
                  {ctaText}
                </a>
              ) : (
                /**
                 * 버튼형 CTA
                 * - 모달, 스크롤, 커스텀 액션 등 클릭 이벤트 처리
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
