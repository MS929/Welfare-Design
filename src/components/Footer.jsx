export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-12">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* 로고 */}
        <div>
          <img
            src="/images/about/main.png"
            alt="복지디자인 로고"
            className="h-10 mb-3"
          />
          <p className="text-sm">복지디자인 사회적협동조합</p>
        </div>
        {/* 로고 및 소개 */}
        <div>
          <h2 className="text-white text-xl font-bold mb-3">복지디자인</h2>
          <p className="text-sm">
            함께 성장하며 모두의 행복을 위한 복지를 디자인합니다.
          </p>
        </div>

        {/* 연락처 */}
        <div>
          <h3 className="text-white font-semibold mb-3">문의</h3>
          <p className="text-sm">전화: 042-934-6338</p>
          <p className="text-sm">팩스: 042-934-1858</p>
          <p className="text-sm">이메일: songkangbokji@songkang.or.kr</p>
          <p className="text-sm mt-2">대전광역시 유성구 봉산로 45</p>
        </div>
      </div>
      {/* 저작권 */}
      <div className="text-center text-sm text-gray-400 border-t border-gray-700 py-4">
        © {new Date().getFullYear()} 복지디자인. All rights reserved. Design By
        <a
          href="https://github.com/MS929"
          className="underline hover:text-white ml-1"
          target="_blank"
          rel="noopener noreferrer"
        >
          MS シ
        </a>
      </div>
    </footer>
  );
}
