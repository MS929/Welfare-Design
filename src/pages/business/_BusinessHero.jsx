// -----------------------------------------------------------------------------
// _BusinessHero.jsx
// [컴포넌트 목적]
//  - 사업 페이지에서 공통으로 사용할 수 있는 이미지 + 설명형 히어로 컴포넌트
//  - 대표 이미지, 설명 목록, CTA 버튼 구조를 props 기반으로 렌더링
//
// [사용 방식]
//  - imageSrc: 대표 이미지 경로
//  - bullets: 안내 문구 배열
//  - ctaHref/onCta: 링크 이동 또는 버튼 동작 처리
//
// [유지보수 위치]
//  - 히어로 영역 공통 디자인 변경: 이 파일 수정
//  - 사업별 내용 변경: 해당 페이지에서 전달하는 props 수정
// -----------------------------------------------------------------------------
export default function BusinessHero({
  showHeading = false,
  heading,
  subtitle,
  imageSrc,
  bullets = [],
  ctaText,
  ctaHref,
  onCta,
  note,
}) {
  return (
    // 사업 히어로 전체 컨테이너
    <section className="max-w-screen-xl mx-auto px-4">
      {/* 선택 표시 제목 영역 */}
      {showHeading && (
        <div className="mb-6">
          <h2 className="text-2xl md:text-3xl font-extrabold">
            {heading}
          </h2>

          <p className="mt-1 text-lg text-gray-700">
            {subtitle}
          </p>
        </div>
      )}

      {/* 메인 콘텐츠 영역: PC 2열 / 모바일 1열 */}
      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* 대표 이미지 영역
            - object-contain으로 이미지 비율 유지 */}
        <div className="rounded-3xl bg-emerald-200/40 p-3">
          <div className="w-full rounded-2xl overflow-hidden flex items-center justify-center">
            <img
              src={imageSrc}
              alt={heading || subtitle || "business image"}
              className="max-h-[520px] w-auto h-auto object-contain"
              loading="lazy" // 화면 진입 전까지 이미지 로딩 지연
            />
          </div>
        </div>

        {/* 안내 내용 및 CTA 영역 */}
        <div className="rounded-2xl border border-emerald-200 bg-white p-6">
          {/* 안내 문구 목록 */}
          <ul className="space-y-3 text-gray-800 leading-relaxed">
            {bullets.map((b, i) => (
              <li key={i} className="flex gap-3">
                <span className="mt-1.5 inline-block h-2 w-2 rounded-full bg-emerald-500" />
                <span>{b}</span>
              </li>
            ))}
          </ul>

          <p className="mt-4 text-sm text-gray-500">
            {note}
          </p>

          {/* CTA 버튼 영역: 링크 또는 클릭 이벤트 방식 지원 */}
          {ctaText && (ctaHref || onCta) && (
            <div className="pt-6">
              {ctaHref ? (
                <a
                  href={ctaHref}
                  className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-6 py-3 text-white font-semibold hover:bg-emerald-600 transition"
                >
                  {ctaText}
                </a>
              ) : (
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
