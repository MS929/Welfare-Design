import OptimizedImg from "./OptimizedImg";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        {/* 상단: PC/모바일 분기 없는 반응형 레이아웃 (모바일 1열, PC 2열) */}
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-6 md:gap-8 border-b border-gray-800 pb-6 md:pb-8 mb-6 md:mb-8">
          {/* 좌측: 로고 + 소개 (모바일: 작게, 데스크톱: 조금 크게) */}
          <div className="flex items-center gap-3 md:gap-4">
            <OptimizedImg
              src="/images/about/main.png"
              alt="복지디자인 로고"
              useCdn
              cdnWidth={200}
              sizes="(max-width: 768px) 40px, 48px"
              className="h-8 w-auto md:h-10"
              loading="lazy"
              decoding="async"
              fetchpriority="low"
              width={200}
              height={80}
              onError={(e) => { e.currentTarget.src = "/images/about/fallback.png"; }}
            />
            <div className="leading-tight">
              <p className="text-sm md:text-base font-semibold">복지디자인 사회적협동조합 | Welfare Design Cooperative</p>
              <p className="text-xs md:text-sm text-gray-400">함께 성장하며 모두의 행복을 위한 복지를 디자인합니다.</p>
            </div>
          </div>

          {/* 우측: 연락처 (모바일: 왼쪽 정렬, PC: 오른쪽 정렬) */}
          <div className="text-sm md:text-[15px] text-gray-300 md:text-right leading-relaxed">
            <p><span className="text-gray-400">전화</span>: 042-934-6338</p>
            <p><span className="text-gray-400">팩스</span>: 042-934-1858</p>
            <p><span className="text-gray-400">이메일</span>: songkangbokji@songkang.or.kr</p>
            <p className="mt-1 md:mt-2">대전광역시 유성구 봉산로 45</p>
          </div>
        </div>

        {/* 하단: 저작권 */}
        <div className="text-center text-xs sm:text-sm text-gray-500">
          © {new Date().getFullYear()} 복지디자인 사회적협동조합. All rights reserved.
          <span className="ml-1 sm:ml-2 block sm:inline">
            Design By {" "}
            <a
              href="https://github.com/MS929"
              className="underline hover:text-gray-300"
              target="_blank"
              rel="noopener noreferrer"
            >
              MS シ
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
