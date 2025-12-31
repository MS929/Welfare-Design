/**
 * loadFaq.js
 * - FAQ 콘텐츠를 markdown(.md) 파일에서 로드하는 유틸 함수
 * - frontmatter(title, category, order, published)를 파싱하여 사용
 * - 로컬 개발 환경과 Netlify 배포 환경 모두에서 동작하도록 경로를 이중 지원
 */

export function loadFaqItems() {
  // FAQ markdown 파일들을 로드하여 화면에서 사용 가능한 데이터 구조로 변환

  // 빌드 시점에 FAQ markdown 파일을 raw 문자열로 모두 로드 (eager 방식)
  const files = {
    ...import.meta.glob('/content/faq/*.md', { as: 'raw', eager: true }),
    ...import.meta.glob('/src/content/faq/*.md', { as: 'raw', eager: true }),
  };

  // 각 markdown 파일을 순회하며 frontmatter와 본문을 분리 처리
  const items = Object.entries(files).map(([path, raw]) => {
    // --- frontmatter --- 와 본문(body)을 분리하기 위한 정규식
    const match = /^---([\s\S]*?)---\n?([\s\S]*)$/m.exec(raw);

    // frontmatter 영역을 한 줄씩 파싱하여 key-value 객체로 변환
    const fm = Object.fromEntries(
      (match?.[1] || '')
        .split('\n')
        .filter(Boolean)
        .map((line) => {
          // "key: value" 형태의 라인을 분리하여 frontmatter 필드 생성
          const idx = line.indexOf(':');
          const key = line.slice(0, idx).trim();
          const val = line.slice(idx + 1).trim().replace(/^"|"$/g, '');
          return [key, val];
        })
    );

    // frontmatter를 제외한 실제 FAQ 본문 내용
    const body = (match?.[2] || '').trim();

    // 화면에서 사용될 FAQ 아이템 데이터 구조
    return {
      path,
      title: fm.title || '',
      category: fm.category || '전체',
      order: Number(fm.order || 0),
      published: String(fm.published || 'true') !== 'false',
      body,
    };
  });

  // 공개(published=true)된 FAQ만 노출하고, order 기준으로 정렬
  return items
    .filter((it) => it.published)
    .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
}