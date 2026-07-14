// -----------------------------------------------------------------------------
// 페이지 목적: 뉴스레터 아카이브 목록 페이지
// 데이터 출처: /src/content/news/ 폴더의 마크다운 파일
// 참고: 현재 화면에는 정적 안내 문구만 표시되며, 아래 files 데이터는 추후 목록 렌더링에 사용됩니다.

export default function NewsNewsletter() {
  return (
    <section className="max-w-screen-xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-4">뉴스레터</h1>
      <p className="text-gray-700">뉴스레터 아카이브.</p>
    </section>
  );
}
// 빌드 시점에 뉴스 마크다운 파일을 한 번에 불러와, 향후 뉴스레터 목록 데이터로 활용합니다.
const files = import.meta.glob("/src/content/news/**/*.md", { eager: true });