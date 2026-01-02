// -----------------------------------------------------------------------------
// [페이지 목적]
//  - "복지디자인 이야기" 상세 페이지
//  - URL 파라미터(slug)에 해당하는 마크다운 파일을 찾아 제목/날짜/썸네일/본문을 렌더링
//
// [데이터 로딩 방식]
//  - Vite의 import.meta.glob을 사용해 /src/content/news/*.md 파일을 raw 문자열로 로드
//  - eager: true → 빌드 시점에 모두 포함되어, 상세 페이지에서 즉시 조회 가능
//
// [렌더링 구성]
//  - 상단: 브레드크럼(소식 > 동행이야기 > 상세)
//  - 본문: frontmatter(제목/날짜/썸네일) + 마크다운 body를 줄 단위로 문단(<p>) 출력
// -----------------------------------------------------------------------------

import { useParams, Link } from "react-router-dom";

// /src/content/news/*.md 경로의 파일들을 { "경로": "원문 문자열" } 형태로 매핑
const rawModules = import.meta.glob("/src/content/news/*.md", {
  eager: true,
  as: "raw",
});

// 마크다운 원문에서 frontmatter(--- ... ---)와 본문(body)을 분리하는 간단 파서
// - 외부 라이브러리 없이 최소 기능만 구현(제목/날짜/썸네일 등 key: value 형태 가정)
function parseFrontMatter(md) {
  // frontmatter 영역(--- ... ---) 정규식으로 추출
  const fmMatch = md.match(/^---([\s\S]*?)---\s*/);
  // frontmatter를 제거한 나머지를 본문(body)으로 사용
  const body = md.replace(/^---[\s\S]*?---\s*/, "").trim();

  const fm = {};
  // frontmatter 블록을 줄 단위로 나누어 key: value 형태로 파싱
  const fmBlock = fmMatch ? fmMatch[1] : "";
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
        </Link>
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

// -----------------------------------------------------------------------------
// 메모
//  - frontmatter는 단순 key: value 형태만 가정(복잡한 YAML 문법/배열/중첩은 미지원)
//  - 본문은 줄 단위로 <p>를 생성하므로, 공백 줄/목록/제목 등은 필요 시 추가 처리 필요
// -----------------------------------------------------------------------------
