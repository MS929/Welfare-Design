export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-12">
      <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h3 className="text-white font-bold mb-2">동행</h3>
          <p>제목</p>
          <p>대전광역시 유성구 봉산로 45</p>
        </div>
        <div>
          <h3 className="text-white font-bold mb-2">문의</h3>
          <p>전화: 042-934-6338</p>
          <p>팩스: 042-934-1858</p>
          <p>이메일: songkangbokji@songkang.or.kr</p>
        </div>
      </div>
      <div className="text-center text-sm text-gray-400 pb-6">
        © {new Date().getFullYear()} ??. All rights reserved.
      </div>
    </footer>
  );
}
