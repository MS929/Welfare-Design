// src/pages/business/_BusinessHero.jsx
export default function BusinessHero({
  // 필요 시에만 내부 제목을 보여줌(기본 false)
  showHeading = false,
  heading,
  subtitle,

  imageSrc, // "/images/business/*.png"
  bullets = [],

  ctaText, // 버튼 라벨
  ctaHref, // 버튼 링크(또는 onCta 중 하나만)
  onCta,
  note,
}) {
  return (
    <section className="max-w-screen-xl mx-auto px-4">
      {/* (선택) 내부 제목 */}
      {showHeading && (
        <div className="mb-6">
          <h2 className="text-2xl md:text-3xl font-extrabold">{heading}</h2>
          {subtitle && <p className="mt-1 text-lg text-gray-700">{subtitle}</p>}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* 왼쪽 이미지: 짤림 방지 (부모에 고정 높이 없음) */}
        <div className="rounded-3xl bg-emerald-200/40 p-3">
          <div className="w-full rounded-2xl overflow-hidden flex items-center justify-center">
            <img
              src={imageSrc}
              alt={heading || subtitle || "business image"}
              // 큰 화면에서도 과하지 않게: 세로 최대 520px까지만 제한 (필요하면 숫자 조절)
              className="max-h-[520px] w-auto h-auto object-contain"
              loading="lazy"
            />
          </div>
        </div>

        {/* 오른쪽 설명 박스 */}
        <div className="rounded-2xl border border-emerald-200 bg-white p-6">
          <ul className="space-y-3 text-gray-800 leading-relaxed">
            {bullets.map((b, i) => (
              <li key={i} className="flex gap-3">
                <span className="mt-1.5 inline-block h-2 w-2 rounded-full bg-emerald-500" />
                <span>{b}</span>
              </li>
            ))}
          </ul>

          {note && <p className="mt-4 text-sm text-gray-500">{note}</p>}

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
