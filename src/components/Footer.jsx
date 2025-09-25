import OptimizedImg from "./OptimizedImg";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-gray-900 text-gray-300 mt-12 md:mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-8 lg:py-6">
        {/* Top: brand & contacts */}
        <div className="flex flex-col items-center text-center md:grid md:grid-cols-2 md:items-start md:text-left gap-6 md:gap-6 lg:gap-8">
          {/* Brand */}
          <div className="flex flex-col items-center md:items-start gap-3 md:gap-2">
            <OptimizedImg
              src="/images/about/main.png"
              alt="복지디자인 로고"
              useCdn
              cdnWidth={160}
              sizes="(max-width: 768px) 56px, 72px"
              className="h-14 w-auto md:h-14 lg:h-16"
              loading="lazy"
              decoding="async"
              fetchpriority="low"
              width={160}
              height={64}
              onError={(e) => {
                e.currentTarget.src = "/images/about/fallback.png";
              }}
            />

            <div className="leading-tight md:leading-snug">
              <p className="text-base md:text-lg lg:text-xl font-semibold tracking-tight">
                복지디자인 사회적협동조합
                <span className="hidden xl:inline"> | Welfare Design Cooperative</span>
              </p>
              <p className="text-sm md:text-[13px] lg:text-[14px] text-gray-400 mt-1">
                함께 성장하며 모두의 행복을 위한 복지를 디자인합니다.
              </p>
            </div>
          </div>

          {/* Contacts */}
          <div className="w-full md:justify-self-end">
            <ul className="text-[15px] leading-relaxed space-y-1.5 md:space-y-0.5 lg:space-y-0 md:text-right">
              <li>
                <span className="text-gray-400">전화</span>
                <span className="mx-1 text-gray-500">:</span>
                042-934-6338
              </li>
              <li>
                <span className="text-gray-400">팩스</span>
                <span className="mx-1 text-gray-500">:</span>
                042-934-1858
              </li>
              <li className="break-all">
                <span className="text-gray-400">이메일</span>
                <span className="mx-1 text-gray-500">:</span>
                songkangbokji@songkang.or.kr
              </li>
              <li className="pt-1 md:pt-2">대전광역시 유성구 봉산로 45</li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <hr className="border-gray-800 my-6 md:my-5" />

        {/* Bottom: copyright */}
        <div className="text-center text-[11px] sm:text-[12px] md:text-[12px] lg:text-[13px] text-gray-500">
          <p>© {year} 복지디자인 사회적협동조합. All rights reserved.</p>
          <p className="mt-0.5 md:mt-0">
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
