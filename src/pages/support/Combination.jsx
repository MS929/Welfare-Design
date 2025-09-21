export default function Combination() {
  return (
    <>
      <div className="bg-white">
        {/* ===== 브레드크럼 + 제목 (필요 시 수정) ===== */}
        <section className="max-w-screen-xl mx-auto px-4 pt-10">
          <nav className="text-sm text-black">
            조합 &gt; <span className="text-black">가입 안내</span>
          </nav>
          <h1 className="mt-3 text-3xl md:text-4xl font-extrabold tracking-tight text-black">
            조합 가입
          </h1>
        </section>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 antialiased tracking-[-0.01em] mt-10">
        <div className="rounded-2xl border border-gray-200 bg-white/70 backdrop-blur p-6 md:p-8 shadow-sm">
          <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 mb-4">조합 가입 안내</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            복지디자인의 미션에 공감하시고 조합 가입을 원하시면 아래 연락처로 편하게 문의해 주세요.
            간단한 안내와 상담 후 절차를 도와드립니다.
          </p>

          <ul className="mt-6 space-y-3 text-gray-800">
            <li>
              <span className="mr-2">📞</span>
              <a href="tel:042-000-0000" className="font-semibold hover:text-emerald-700">
                042-000-0000
              </a>
            </li>
            <li>
              <span className="mr-2">✉️</span>
              <a href="mailto:info@welfaredesign.org" className="font-semibold hover:text-sky-700">
                info@welfaredesign.org
              </a>
            </li>
          </ul>

          <div className="mt-8 flex gap-4">
            <a
              href="tel:042-000-0000"
              className="inline-flex items-center justify-center rounded-md bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 font-semibold"
            >
              전화 걸기
            </a>
            <a
              href="mailto:info@welfaredesign.org"
              className="inline-flex items-center justify-center rounded-md bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 font-semibold"
            >
              이메일 보내기
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
