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

      {/* ===== 본문 ===== */}
      <section className="relative max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 antialiased tracking-[-0.01em] mt-10">
        

        <div className="relative rounded-2xl border border-gray-200 bg-white p-6 md:p-8 shadow-md">
          {/* accent bar */}
          <div className="-mt-6 -mx-6 md:-mx-8 mb-4 h-1 rounded-t-2xl bg-gradient-to-r from-emerald-300/70 via-sky-300/70 to-transparent" />
          {/* badge */}
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-semibold px-2.5 py-1 mb-2">
            JOIN&nbsp;US
          </span>

          <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 mb-4">
            조합 가입 안내
          </h2>

          <p className="text-gray-700 leading-relaxed mb-6 md:mb-7 max-w-2xl">
            복지디자인의 미션에 공감하시고 조합 가입을 원하시면 아래 연락처로 편하게 문의해 주세요.
            간단한 안내와 상담 후 절차를 도와드립니다.
          </p>

          {/* 연락처 */}
          <ul className="mt-4 space-y-3 text-gray-800">
            <li className="flex items-center gap-3 leading-none">
              {/* phone icon */}
              <svg
                className="h-5 w-5 text-emerald-600 flex-shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M3 5.5c0-1.1.9-2 2-2h2.2c.9 0 1.7.6 1.9 1.5l.6 2.2c.2.9-.2 1.9-1 2.4l-1 .7c1.3 2.5 3.2 4.4 5.7 5.7l.7-1c.6-.8 1.5-1.2 2.4-1l2.2.6c.9.2 1.5 1 1.5 1.9V19c0 1.1-.9 2-2 2h-.8C10.6 21 3 13.4 3 5.5Z"
                  fill="currentColor"
                />
              </svg>
              <a
                href="tel:042-000-0000"
                className="font-semibold hover:text-emerald-700"
                aria-label="전화 걸기 042-000-0000"
              >
                042-000-0000
              </a>
            </li>

            <li className="flex items-center gap-3 leading-none">
              {/* mail icon */}
              <svg
                className="h-5 w-5 text-sky-600 flex-shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M3.75 5.5h16.5c.69 0 1.25.56 1.25 1.25v10.5c0 .69-.56 1.25-1.25 1.25H3.75c-.69 0-1.25-.56-1.25-1.25V6.75c0-.69.56-1.25 1.25-1.25Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="m4 7 8 6 8-6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <a
                href="mailto:info@welfaredesign.org"
                className="font-semibold hover:text-sky-700"
                aria-label="이메일 보내기 info@welfaredesign.org"
              >
                info@welfaredesign.org
              </a>
            </li>
          </ul>

          {/* actions */}
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="tel:042-000-0000"
              className="inline-flex items-center justify-center rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 font-semibold"
              aria-label="전화 걸기 버튼"
            >
              전화 걸기
            </a>
            <a
              href="mailto:info@welfaredesign.org"
              className="inline-flex items-center justify-center rounded-lg bg-white text-sky-700 ring-1 ring-inset ring-sky-200 hover:bg-sky-50 px-5 py-2.5 font-semibold"
              aria-label="이메일 보내기 버튼"
            >
              이메일 보내기
            </a>
          </div>

          {/* helper note */}
          <p className="mt-5 text-sm text-gray-500">
            * 상담 가능 시간: 평일 09:00 ~ 18:00 (점심 12:00 ~ 13:00)
          </p>
        </div>
      </section>
    </>
  );
}
