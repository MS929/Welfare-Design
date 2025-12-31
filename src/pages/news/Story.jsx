// src/pages/news/Story.jsx
// 복지디자인 이야기 상세 페이지
// - URL 파라미터(slug)에 해당하는 markdown 파일을 찾아 상세 내용을 렌더링
// - 목록 페이지(stories)에서 넘어온 맥락에 맞는 상세 뷰 제공

// Vite의 import.meta.glob 사용
// - /src/content/news/*.md 내 모든 마크다운 파일을 문자열(raw) 형태로 즉시 로드
// - eager: true → 빌드 시점에 모두 포함 (상세 페이지 단건 조회용)
import { useParams, Link } from "react-router-dom";

const rawModules = import.meta.glob("/src/content/news/*.md", {
  eager: true,
  as: "raw",
});

// 마크다운 문자열에서 frontmatter와 본문(body)을 분리하는 간단 파서
// - --- 로 감싸진 YAML 스타일 frontmatter를 수동 파싱
// - 외부 라이브러리 없이 가볍게 사용하기 위한 구현
function parseFrontMatter(md) {
  // frontmatter 영역(--- ... ---) 정규식으로 추출
  const fmMatch = md.match(/^---([\s\S]*?)---\s*/);
  // frontmatter를 제거한 나머지를 본문(body)으로 사용
  const body = md.replace(/^---[\s\S]*?---\s*/, "").trim();

  const fm = {};
  // frontmatter 블록을 줄 단위로 나누어 key: value 형태로 파싱
  fmBlock = fmMatch ? fmMatch[1] : "";
  fmBlock
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .forEach((line) => {
      const idx = line.indexOf(":");
      if (idx === -1) return;
      const key = line.slice(0, idx).trim();
      let value = line.slice(idx + 1).trim();
      // 따옴표로 감싸진 값("value") 처리
      value = value.replace(/^"(.*)"$/, "$1");
      fm[key] = value;
    });

  return { frontmatter: fm, body };
}

// 복지디자인 이야기 상세 컴포넌트
export default function StoryDetail() {
  // URL 경로에서 slug 파라미터 추출 (예: /news/stories/:slug)
  const { slug } = useParams();

  // slug와 일치하는 markdown 파일 경로 탐색
  const matchPath = Object.keys(rawModules).find((p) =>
    p.endsWith(`${slug}.md`)
  );

  // slug에 해당하는 파일이 없을 경우: 404 대체 메시지 표시
  if (!matchPath) {
    return (
      <div className="max-w-screen-xl mx-auto px-4 py-12">
        <p className="text-gray-500">글을 찾을 수 없습니다.</p>
      </div>
    );
  }

  // 매칭된 markdown 파일의 원본 문자열(raw) 가져오기
  const raw = rawModules[matchPath];
  const { frontmatter, body } = parseFrontMatter(raw);

  return (
    <div className="max-w-screen-md mx-auto px-4 py-12">
      {/* 상단 브레드크럼: 소식 > 동행이야기 > 상세 */} 
      <p className="text-sm text-gray-500 mb-2">
        <Link to="/news/stories" className="hover:underline">
          소식 &gt; 동행이야기
        </Link>{" "}
        &gt; 상세
      </p>

      {/* 게시글 제목 */} 
      <h1 className="text-3xl font-bold">{frontmatter.title}</h1>
      {/* 게시 날짜 (YYYY-MM-DD 형식으로 표시) */} 
      <time className="block text-sm text-gray-500 mt-2 mb-6">
        {frontmatter.date?.slice(0, 10)}
      </time>

      {/* 썸네일 이미지가 있을 경우에만 렌더링 */} 
      {frontmatter.thumbnail ? (
        <img
          src={frontmatter.thumbnail}
          alt=""
          className="w-full rounded-xl mb-6"
        />
      ) : null}

      {/* 마크다운 본문을 줄 단위로 분리하여 문단(<p>)으로 출력 */} 
      <div className="prose max-w-none">
        {body.split("\n").map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </div>
    </div>
  );
}
