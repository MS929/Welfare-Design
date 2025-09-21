export default function Combination() {
  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 antialiased tracking-[-0.01em]">
      {/* ===== Hero Header ===== */}
      <section className="max-w-screen-xl mx-auto px-4 pt-0 md:pt-2 pb-8">
        <nav className="text-sm text-gray-500">
          조합 &gt; <span className="text-black">가입 안내</span>
        </nav>
        <h1 className="mt-3 text-3xl md:text-4xl font-extrabold tracking-tight text-black">
          조합 가입
        </h1>
      </section>

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
