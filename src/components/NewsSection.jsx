/**
 * NewsSection.jsx
 * - 메인 페이지(Home)에 노출되는 "소식" 미리보기 섹션
 * - markdown 기반 뉴스 콘텐츠를 로드하여 최신 글 3개만 카드 형태로 표시
 * - 전체 목록은 /news 페이지에서 확인 가능
 */
// =============================
// 라우팅 관련 의존성
// =============================
import { Link } from "react-router-dom";

/**
 * Vite: 모든 마크다운을 raw 텍스트로 불러오기
 * - /src/content/news/*.md 파일을 전부 읽어옵니다.
 * - as: 'raw' 로 하면 문자열 그대로 들어옵니다.
 * - 빌드 시점에 모든 뉴스 markdown을 메모리에 적재하여 런타임 요청을 제거
 */
const rawModules = import.meta.glob("/src/content/news/*.md", {
  eager: true,
  as: "raw",
});

/**
 * 뉴스 markdown 파일에서 front-matter와 본문을 분리
 * - front-matter: title, date, thumbnail 등 메타데이터
 * - body: 실제 기사 본문 내용
 */
function parseFrontMatter(md) {
  // 파일 상단의 --- --- 블록(front-matter) 존재 여부 확인
  const fmMatch = md.match(/^---([\s\S]*?)---\s*/);
  const fmBlock = fmMatch ? fmMatch[1] : "";
  // front-matter를 제거한 순수 본문 영역
  const body = md.replace(/^---[\s\S]*?---\s*/, "").trim();

  // 파싱된 front-matter key/value를 담는 객체
  const fm = {};
  fmBlock
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .forEach((line) => {
      // ':' 기준으로 key 와 value 분리
      const idx = line.indexOf(":");
      if (idx === -1) return;
      const key = line.slice(0, idx).trim();
      let value = line.slice(idx + 1).trim();
      // 값 양끝의 큰따옴표 제거 (YAML 스타일 대응)
      value = value.replace(/^"(.*)"$/, "$1");
      fm[key] = value;
    });

  return { frontmatter: fm, body };
}

// 모든 뉴스 markdown 파일을 순회하여 화면에서 사용할 posts 배열로 변환
const posts = Object.entries(rawModules)
  .map(([path, raw]) => {
    const { frontmatter, body } = parseFrontMatter(raw);
    const slug = path.split("/").pop().replace(".md", "");
    return {
      title: frontmatter.title || "(제목 없음)",
      date: frontmatter.date || "",
      thumbnail: frontmatter.thumbnail || "",
      body,
      slug,
    };
  })
  .sort((a, b) => new Date(b.date) - new Date(a.date)); // 날짜 기준 최신순 정렬

// 메인 페이지에 노출되는 뉴스 요약 섹션 컴포넌트
export default function NewsSection() {
  // 뉴스 데이터가 하나도 없을 경우의 예외 처리
  if (!posts.length) {
    return (
      <section className="max-w-screen-xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-4">소식</h2>
        <p className="text-gray-500">등록된 소식이 아직 없습니다.</p>
      </section>
    );
  }

  const top = posts.slice(0, 3); // 메인 화면에는 최신 뉴스 3개만 노출

  return (
    <>
      {/* 메인 페이지 소식 섹션 */}
      <section className="max-w-screen-xl mx-auto px-4 py-12">
        {/* 섹션 제목 + 전체 뉴스 페이지로 이동하는 링크 */}
        <div className="flex items-end justify-between mb-6">
          <h2 className="text-2xl font-bold">소식</h2>
          <Link to="/news" className="text-sm text-sky-700 hover:underline">
            전체 보기
          </Link>
        </div>

        {/* 뉴스 카드 그리드 (반응형 1~3열) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {top.map((p) => (
            <>
              {/* 개별 뉴스 카드 */}
              <article
                key={p.slug}
                className="rounded-xl border bg-white shadow-sm overflow-hidden"
              >
                {/* 뉴스 썸네일 이미지 (없거나 로딩 실패 시 숨김 처리) */}
                {p.thumbnail ? (
                  <img
                    src={p.thumbnail}
                    alt={p.title}
                    className="w-full h-44 object-cover"
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                ) : null}

                <div className="p-4">
                  <time className="text-xs text-gray-500">
                    {p.date?.slice(0, 10)}
                  </time>
                  <h3 className="mt-1 font-semibold line-clamp-2">{p.title}</h3>
                  {/* 본문 내용을 요약하여 최대 3줄로 표시 */}
                  <p className="mt-2 text-sm text-gray-600 line-clamp-3">
                    {p.body.replace(/\n+/g, " ").slice(0, 120)}
                    {p.body.length > 120 ? "…" : ""}
                  </p>

                  {/* 상세 페이지 라우팅을 아직 안 만들었으면 링크 제거해도 됨 */}
                  {/* <Link to={`/news/${p.slug}`} className="mt-3 inline-block text-sky-700 text-sm">
                    자세히 보기 →
                  </Link> */}
                </div>
              </article>
            </>
          ))}
        </div>
      </section>
    </>
  );
}
