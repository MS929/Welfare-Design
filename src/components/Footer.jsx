import OptimizedImg from "./OptimizedImg";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-gray-900 text-gray-300 mt-12 md:mt-16">
      {/* container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 md:py-5 lg:py-4">
        {/* Top row */}
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          {/* Brand */}
          <div className="flex items-center gap-3 md:gap-4">
            <OptimizedImg
              src="/images/about/main.png"
              alt="복지디자인 로고"
              useCdn
              cdnWidth={80}
              sizes="(max-width: 768px) 40px, 48px"
              className="h-6 w-auto md:h-7 lg:h-7 shrink-0 rounded -mt-6 md:-mt-8 lg:-mt-10"
              loading="lazy"
              decoding="async"
              fetchpriority="low"
              width={80}
              height={30}
              onError={(e) => {
                e.currentTarget.src = "/images/about/fallback.png";
              }}
            />

            <div className="leading-tight md:leading-snug">
              <p className="text-[15px] md:text-[15.5px] lg:text-[16px] font-semibold tracking-tight">
                복지디자인 사회적협동조합
                <span className="hidden xl:inline">
                  {" "}
                  | Welfare Design Cooperative
                </span>
              </p>
              <p className="text-[12px] md:text-[12.5px] lg:text-[13px] text-gray-400 mt-1">
                함께 성장하며 모두의 행복을 위한 복지를 디자인합니다.
              </p>
              <p className="text-[12px] md:text-[12.5px] lg:text-[13px] text-gray-400 mt-1">
                계좌번호 : 1230456789-1011-22 · 하나은행
              </p>
            </div>
          </div>

          {/* Contacts (PC 우측 정렬, 간격 컴팩트) */}
          <ul className="grid grid-cols-1 gap-1 md:gap-1 md:text-right text-[14px] md:text-[13px] lg:text-[13.5px] leading-relaxed tabular-nums">
            <li className="whitespace-nowrap">
              <span className="text-gray-400">전화</span>
              <span className="mx-1 text-gray-600">:</span>042-934-6338
            </li>
            <li className="whitespace-nowrap">
              <span className="text-gray-400">팩스</span>
              <span className="mx-1 text-gray-600">:</span>042-934-1858
            </li>
            <li className="break-all">
              <span className="text-gray-400">이메일</span>
              <span className="mx-1 text-gray-600">:</span>
              songkangbokji@songkang.or.kr
            </li>
            <li className="whitespace-normal md:whitespace-nowrap">
              대전광역시 유성구 봉산로 45
            </li>
          </ul>
        </div>

        {/* Divider */}
        <hr className="border-gray-800 my-3" />

        {/* Bottom row */}
        <div className="flex flex-col items-center justify-center text-center gap-1 text-[11.5px] sm:text-[12px] lg:text-[12.5px] text-gray-500">
          <p>© {year} 복지디자인 사회적협동조합. All rights reserved.</p>
          <p>
            Design By{" "}
            <a
              href="https://github.com/MS929"
              className="underline decoration-gray-600 hover:text-gray-300 hover:decoration-gray-300"
              target="_blank"
              rel="noopener noreferrer"
            >
              MS シ
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
