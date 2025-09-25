import OptimizedImg from "./OptimizedImg";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-gray-900 text-gray-300 mt-12 md:mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 md:py-6 lg:py-5">
        {/* Top row */}
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          {/* Brand */}
          <div className="flex items-start md:items-center gap-3 md:gap-4">
            <OptimizedImg
              src="/images/about/main.png"
              alt="복지디자인 로고"
              useCdn
              cdnWidth={128}
              sizes="(max-width: 768px) 40px, 56px"
              className="h-10 w-auto md:h-12 lg:h-12 shrink-0 rounded"
              loading="lazy"
              decoding="async"
              fetchpriority="low"
              width={128}
              height={48}
              onError={(e) => {
                e.currentTarget.src = "/images/about/fallback.png";
              }}
            />

            <div className="leading-tight md:leading-snug">
              <p className="text-[15px] md:text-base lg:text-[17px] font-semibold tracking-tight">
                복지디자인 사회적협동조합
                <span className="hidden xl:inline"> | Welfare Design Cooperative</span>
              </p>
              <p className="text-[12px] md:text-[12.5px] lg:text-[13px] text-gray-400 mt-1">
                함께 성장하며 모두의 행복을 위한 복지를 디자인합니다.
              </p>
            </div>
          </div>

          {/* Contacts */}
          <ul className="grid grid-cols-1 gap-1.5 md:gap-1 md:text-right text-[14px] md:text-[13px] lg:text-[13.5px] leading-relaxed tabular-nums">
            <li className="whitespace-nowrap"><span className="text-gray-400">전화</span><span className="mx-1 text-gray-600">:</span>042-934-6338</li>
            <li className="whitespace-nowrap"><span className="text-gray-400">팩스</span><span className="mx-1 text-gray-600">:</span>042-934-1858</li>
            <li className="break-all"><span className="text-gray-400">이메일</span><span className="mx-1 text-gray-600">:</span>songkangbokji@songkang.or.kr</li>
            <li className="whitespace-normal md:whitespace-nowrap pt-0.5">대전광역시 유성구 봉산로 45</li>
          </ul>
        </div>

        {/* Divider */}
        <hr className="border-gray-800 my-4" />

        {/* Bottom row */}
        <div className="flex flex-col md:flex-row items-center md:items-center md:justify-between gap-1 text-[11.5px] sm:text-[12px] lg:text-[12.5px] text-gray-500">
          <p className="order-2 md:order-1">© {year} 복지디자인 사회적협동조합. All rights reserved.</p>
          <p className="order-1 md:order-2">
            Design By {" "}
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
