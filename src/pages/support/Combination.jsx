export default function Combination() {
  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 antialiased tracking-[-0.01em]">
      {/* ===== 브레드크럼 ===== */}
      <nav className="text-sm text-gray-500 mb-6">
        조합 &gt; <span className="text-gray-900 font-medium">가입 안내</span>
      </nav>

      <section className="bg-emerald-50 rounded-2xl p-10">
        {/* 헤더 */}
        <header className="text-center mb-12">
          <h1 className="mt-3 text-3xl md:text-4xl font-extrabold tracking-tight text-black">
            조합 가입
          </h1>
          <p className="mt-4 text-gray-700 leading-relaxed max-w-2xl mx-auto">
            복지디자인의 미션에 공감하신다면 지금 함께해요. 지역과 현장을 잇는 맞춤형 복지에 
            조합원으로 참여할 수 있습니다.
          </p>
        </header>

        {/* 문의 섹션 */}
        <div className="bg-white rounded-xl p-6 mt-8">
          <h3 className="font-extrabold text-xl text-gray-900 mb-6">문의</h3>
          <ul className="space-y-4">
            <li className="flex items-center">
              <span className="mr-3 text-emerald-600 text-xl">📞</span>
              <a
                href="tel:042-000-0000"
                className="text-gray-800 hover:text-emerald-700 transition font-medium"
              >
                전화: 042-000-0000
              </a>
            </li>
            <li className="flex items-center">
              <span className="mr-3 text-sky-600 text-xl">✉️</span>
              <a
                href="mailto:info@welfaredesign.org"
                className="text-gray-800 hover:text-sky-700 transition font-medium"
              >
                이메일: info@welfaredesign.org
              </a>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
