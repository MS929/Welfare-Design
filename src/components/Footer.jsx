import OptimizedImg from "./OptimizedImg";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-12">
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* 로고 및 협동조합 소개 */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-700 pb-6 mb-6">
          <div className="mb-4 md:mb-0 flex items-center">
            <OptimizedImg
              src="/images/about/main.png"
              alt="복지디자인 로고"
              useCdn
              cdnWidth={200}
              sizes="200px"
              className="h-12"
              imgStyle={{ height: "3rem", width: "auto", display: "block" }}
              loading="lazy"
              decoding="async"
              fetchpriority="low"
              width={200}
              height={80}
              onError={(e) => { e.currentTarget.src = "/images/about/fallback.png"; }}
            />
            <div className="ml-3">
              <p className="text-sm font-semibold">복지디자인 사회적협동조합 | Welfare Design Cooperative</p>
              <p className="text-xs text-gray-400">
                함께 성장하며 모두의 행복을 위한 복지를 디자인합니다.
              </p>
            </div>
          </div>

          {/* 연락처 */}
          <div className="text-sm">
            <p>전화: 042-934-6338</p>
            <p>팩스: 042-934-1858</p>
            <p>이메일: songkangbokji@songkang.or.kr</p>
            <p className="mt-2">대전광역시 유성구 봉산로 45</p>
          </div>
        </div>

        {/* 저작권 */}
        <div className="text-center text-sm text-gray-400">
          © {new Date().getFullYear()} 복지디자인 사회적협동조합. All rights reserved. 
          <span className="ml-2">
            Design By{" "}
            <a
              href="https://github.com/MS929"
              className="underline hover:text-white"
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
