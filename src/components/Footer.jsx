export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-12">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* 로고 및 소개 */}
        <div>
          <h2 className="text-white text-xl font-bold mb-3">복지디자인</h2>
          <p className="text-sm">
            함께 성장하며 모두의 행복을 위한 복지를 디자인합니다.
          </p>
        </div>

        {/* 메뉴 */}
        <div>
          <h3 className="text-white font-semibold mb-3">메뉴</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/about" className="hover:text-white">소개</a></li>
            <li><a href="/business" className="hover:text-white">사업</a></li>
            <li><a href="/news" className="hover:text-white">소식</a></li>
            <li><a href="/support" className="hover:text-white">후원 안내</a></li>
            <li><a href="/join" className="hover:text-white">조합 가입</a></li>
          </ul>
        </div>

        {/* 연락처 */}
        <div>
          <h3 className="text-white font-semibold mb-3">문의</h3>
          <p className="text-sm">전화: 042-934-6338</p>
          <p className="text-sm">팩스: 042-934-1858</p>
          <p className="text-sm">이메일: songkangbokji@songkang.or.kr</p>
          <p className="text-sm mt-2">대전광역시 유성구 봉산로 45</p>
        </div>

        {/* 소셜/저작권 */}
        <div>
          <h3 className="text-white font-semibold mb-3">Follow Us</h3>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-white">Facebook</a>
            <a href="#" className="hover:text-white">Instagram</a>
            <a href="#" className="hover:text-white">YouTube</a>
          </div>
        </div>
      </div>
      {/* 저작권 */}
      <div className="text-center text-sm text-gray-400 border-t border-gray-700 py-4">
        © {new Date().getFullYear()} 복지디자인. All rights reserved.
      </div>
    </footer>
  );
}
