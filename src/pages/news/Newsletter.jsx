// -----------------------------------------------------------------------------
// 페이지 목적: 뉴스레터 아카이브 목록 페이지
// 데이터 출처: /src/content/news/ 폴더의 마크다운 파일
// 로딩 시점: 빌드 타임(import.meta.glob, eager)


// 뉴스레터 목록 페이지 컴포넌트
export default function NewsNewsletter() {
  // 메인 컨텐츠 영역을 감싸는 섹션
  return (
    <section className="max-w-screen-xl mx-auto px-4 py-10">
      {/* 페이지 제목을 나타내는 헤더 */}
      <h1 className="text-3xl font-bold mb-4">뉴스레터</h1>
      {/* 부가 설명 문구 */}
      <p className="text-gray-700">뉴스레터 아카이브.</p>
    </section>
  );
}
// 빌드 시점에 모든 마크다운 파일을 즉시 로드합니다.
// 컴포넌트 외부에 위치시켜, 컴포넌트가 렌더링될 때마다 반복 실행되는 것을 방지합니다.
const files = import.meta.glob("/src/content/news/**/*.md", { eager: true });