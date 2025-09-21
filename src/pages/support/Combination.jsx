export default function Combination() {
  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 antialiased tracking-[-0.01em]">
      {/* ===== Hero Header ===== */}
      <nav className="text-sm text-gray-500 mb-6 text-left">
        조합 &gt; <span className="text-gray-900 font-medium">가입 안내</span>
      </nav>

      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-black">
          조합 가입
        </h1>
        <p className="mt-4 text-lg text-gray-700">
          여러분의 참여를 기다립니다. 함께 만들어가는 조합의 미래.
        </p>
      </div>

      {/* 문의 섹션 */}
      <div className="max-w-md mx-auto border border-gray-300 rounded-lg p-6 shadow-sm">
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
    </div>
  );
}
