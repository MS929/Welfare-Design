import OptimizedImg from "./OptimizedImg";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-10">
        {/* 상단: 모바일 1열(좌측 정렬), 데스크톱 2열(좌 소개 / 우 연락처) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 border-b border-gray-800 pb-6 md:pb-8 mb-6 md:mb-8">
          {/* 좌측: 로고 + 소개 */}
          <div className="flex flex-col md:flex-row md:items-start gap-3 md:gap-4">
            <div className="shrink-0">
              <OptimizedImg
                src="/images/about/main.png"
                alt="복지디자인 로고"
                useCdn
                cdnWidth={200}
                sizes="(max-width: 768px) 44px, 56px"
                className="h-11 w-auto md:h-14"
                loading="lazy"
                decoding="async"
                fetchpriority="low"
                width={200}
                height={80}
                onError={(e) => { e.currentTarget.src = "/images/about/fallback.png"; }}
              />
            </div>
            <div className="leading-tight md:pt-0.5">
              <p className="text-base md:text-lg font-semibold tracking-tight">
                복지디자인 사회적협동조합 <span className="hidden sm:inline">| Welfare Design Cooperative</span>
              </p>
              <p className="text-sm md:text-[15px] text-gray-400 mt-0.5">
                함께 성장하며 모두의 행복을 위한 복지를 디자인합니다.
              </p>
            </div>
          </div>

          {/* 우측: 연락처 (모바일: 좌측 정렬 / 데스크톱: 우측 정렬, 상단 맞춤) */}
          <div className="text-[15px] md:text-[15px] leading-relaxed md:justify-self-end md:text-right">
            <div className="space-y-1.5 md:space-y-1">
              <p><span className="text-gray-400">전화</span>: 042-934-6338</p>
              <p><span className="text-gray-400">팩스</span>: 042-934-1858</p>
              <p className="break-all"><span className="text-gray-400">이메일</span>: songkangbokji@songkang.or.kr</p>
              <p className="pt-1 md:pt-2">대전광역시 유성구 봉산로 45</p>
            </div>
          </div>
        </div>

        {/* 하단: 저작권 */}
        <div className="text-center text-xs sm:text-[13px] text-gray-500">
          <p>
            © {new Date().getFullYear()} 복지디자인 사회적협동조합. All rights reserved.
          </p>
          <p className="mt-1">
            Design By {" "}
            <a
              href="https://github.com/MS929"
              className="underline hover:text-gray-300"
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
