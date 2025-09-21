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

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 antialiased tracking-[-0.01em]">
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5 md:p-6 mb-8">
          <p className="text-gray-700">
            복지디자인의 미션에 공감하신다면 지금 함께해요. 지역과 현장을 잇는 맞춤형 복지를…
          </p>
          <ul className="mt-4 flex flex-wrap gap-2 text-sm">
            <li className="px-2.5 py-1 rounded-full bg-white border text-emerald-700">지역 연대</li>
            <li className="px-2.5 py-1 rounded-full bg-white border text-emerald-700">투명 운영</li>
            <li className="px-2.5 py-1 rounded-full bg-white border text-emerald-700">사회적 가치</li>
          </ul>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold mb-3">가입 혜택</h2>
            <ul className="space-y-2 text-gray-700 list-inside">
              <li>✅ 체계적 네트워크</li>
              <li>✅ 교육/자료</li>
              <li>✅ 프로젝트 참여</li>
              <li>✅ 투명한 의사결정</li>
            </ul>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm flex flex-col">
            <h2 className="text-lg font-bold mb-3">가입 절차</h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-700 flex-grow">
              <li>문의</li>
              <li>설명회/상담</li>
              <li>서류 제출</li>
              <li>승인/안내</li>
            </ol>
            <a
              href="mailto:info@welfaredesign.org"
              className="mt-4 inline-block bg-emerald-600 hover:bg-emerald-700 text-white text-center rounded-md px-4 py-2 font-semibold transition"
            >
              가입 문의하기
            </a>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm flex flex-col">
            <h2 className="text-lg font-bold mb-3">가입 대상/요건</h2>
            <ul className="space-y-2 text-gray-700 list-disc list-inside flex-grow">
              <li>지역 복지 단체 및 개인</li>
              <li>복지 디자인에 관심 있는 분</li>
              <li>사회적 가치 실현에 동참하는 분</li>
            </ul>
            <div className="mt-4 rounded-md border border-gray-300 bg-gray-50 p-3 text-sm text-gray-600">
              연회비/서류 등은 담당자 안내에 따릅니다.
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="font-extrabold text-lg text-gray-900 mb-4">문의</h3>
          <ul className="space-y-3">
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
    </>
  );
}
