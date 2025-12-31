/**
 * md.js
 * - markdown(.md) 파일의 frontmatter(--- ... ---)를 파싱하는 유틸
 * - import.meta.glob로 로드한 raw 문자열을 "포스트 목록" 데이터로 변환
 * - 공지/스토리 등 CMS성 콘텐츠를 파일 기반으로 관리할 때 공통으로 사용
 */

/**
 * markdown 문자열에서 frontmatter와 본문을 분리
 * - frontmatter 형식: 파일 상단의 --- ... --- 블록
 * - 지원 필드 예: title, date, thumbnail 등
 * @param {string} raw  markdown 원문(raw)
 * @returns {{ frontMatter: Record<string,string>, content: string }}
 */
export function parseFrontMatter(raw) {
  // frontmatter(---) 블록과 본문을 분리하기 위한 정규식 매칭
  const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  // frontmatter가 있으면 본문만(trim) 사용, 없으면 raw 전체를 본문으로 사용
  const body = m ? m[2].trim() : raw;
  // 파싱된 frontmatter key-value를 담는 객체
  const fm = {};
  if (m) {
    // frontmatter 영역을 줄 단위로 순회하며 "key: value" 형태를 파싱
    m[1].split("\n").forEach((line) => {
      // 콜론(:) 기준으로 key/value 분리
      const idx = line.indexOf(":");
      if (idx > -1) {
        const k = line.slice(0, idx).trim();
        // value 양끝 따옴표("'"/"\"") 제거하여 저장
        const v = line
          .slice(idx + 1)
          .trim()
          .replace(/^['"]|['"]$/g, "");
        fm[k] = v;
      }
    });
  }
  // frontmatter와 본문을 함께 반환
  return { frontMatter: fm, content: body };
}

/**
 * import.meta.glob 결과(여러 glob 객체)를 받아 포스트 목록으로 변환
 * - slug: 파일명(.md 제외)
 * - date: 최신순 정렬을 위해 Date 객체로 변환
 * @param {Array<Record<string,string>>} globs  import.meta.glob 결과 객체들의 배열
 * @returns {Array<{slug:string,title:string,date:Date,thumbnail:string,content:string}>}
 */
export function loadPosts(globs) {
  // globs(여러 import.meta.glob 결과)를 하나의 객체로 병합하여 순회
  // { [path]: rawMarkdownString } 형태로 병합
  const rawModules = Object.assign({}, ...globs);
  return Object.entries(rawModules)
    // 각 파일(path)의 markdown(raw)을 파싱하여 포스트 객체로 변환
    .map(([path, raw]) => {
      // 파일명에서 slug 추출 (확장자 .md 제거)
      const slug = path.split("/").pop().replace(/\.md$/, "");
      // 화면에서 사용될 포스트 데이터 구조
      const { frontMatter, content } = parseFrontMatter(raw);
      return {
        slug,
        title: frontMatter.title || slug,
        date: new Date(frontMatter.date || Date.now()),
        thumbnail: frontMatter.thumbnail || "",
        content,
      };
    })
    // 날짜 기준 최신순 정렬
    .sort((a, b) => b.date - a.date);
}
