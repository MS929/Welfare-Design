// -----------------------------------------------------------------------------
// Story.jsx
// [페이지 목적]
//  - "복지디자인 이야기" 상세 페이지
//  - URL 파라미터(slug)에 해당하는 src/content/stories/*.md[x] 파일을 찾아 렌더링
//
// [데이터 로딩 방식]
//  - GitHub API를 직접 호출하지 않고 Vite import.meta.glob으로 로컬 CMS markdown을 사용
//  - 빌드 시점에 stories 폴더의 모든 markdown 원문을 raw 문자열로 포함
//  - 현재 slug와 파일명을 비교해 해당 글의 frontmatter와 본문을 표시
//
// [렌더링 구성]
//  - 상단: 브레드크럼(소식 > 복지디자인 이야기 > 상세)
//  - 본문: 제목, 날짜, 썸네일, markdown 본문
//
// [운영 참고]
//  - CMS에서 새 글을 저장한 뒤 Netlify 재배포가 완료되어야 홈페이지에 반영됨
//  - 복잡한 갤러리/이전·다음 글 기능은 StoryDetail.jsx에서 관리함
// -----------------------------------------------------------------------------

import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";

// CMS 스토리 원문 로드
// - stories 폴더의 md/mdx 파일을 raw 문자열로 가져옴
// - 상세 페이지에서 slug와 일치하는 파일을 찾기 위한 데이터 원본
const STORY_DETAIL_MODULES = import.meta.glob("../../content/stories/*.{md,mdx}", {
  query: "?raw",
  import: "default",
  eager: true,
});

// Markdown frontmatter 파싱
// - 상단 --- 영역의 key:value 값을 data 객체로 변환
// - 나머지 영역은 content로 분리하여 ReactMarkdown 본문 렌더링에 사용
function parseFrontmatter(rawText) {
  const text = String(rawText || "");
  const match = text.match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/);

  if (!match) {
    return { data: {}, content: text.trim() };
  }

  const [, yaml, content] = match;
  const data = {};

  yaml.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;

    const idx = trimmed.indexOf(":");
    if (idx === -1) return;

    const key = trimmed.slice(0, idx).trim();
    let value = trimmed.slice(idx + 1).trim();

    value = value.replace(/^[']|[']$/g, "").replace(/^[\"]|[\"]$/g, "");
    data[key] = value;
  });

  return { data, content: content.trim() };
}

// 현재 slug에 해당하는 스토리 상세 데이터 찾기
// - 파일명에서 확장자(.md/.mdx)를 제거한 값과 URL slug를 비교
// - 일치하는 파일이 없으면 undefined를 반환하여 404 성격의 화면을 표시
async function fetchStoryDetail(slug) {
  const target = Object.entries(STORY_DETAIL_MODULES).find(([path]) => {
    const fileName = path.split("/").pop() || "";
    const base = fileName.replace(/\.(md|mdx)$/i, "");
    return base === slug;
  });

  if (!target) return undefined;

  const [, raw] = target;
  const { data, content } = parseFrontmatter(raw);

  return {
    ...(data ?? {}),
    content,
  };
}

// Markdown 본문 안의 이미지 렌더링 컴포넌트
// - ReactMarkdown의 img 태그를 대체하여 공통 스타일과 lazy loading을 적용
function MarkdownImage({ alt = "", ...props }) {
  return (
    <img
      {...props}
      alt={alt}
      loading="lazy"
      decoding="async"
      className="mt-6 rounded-lg border border-gray-200 w-full max-h-[70vh] object-contain"
    />
  );
}

// 복지디자인 이야기 상세 페이지 컴포넌트
// - slug 변경 시 해당 글을 다시 로드
// - 로딩/글 없음/정상 표시 상태를 분기하여 렌더링
export default function StoryDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  // slug가 바뀔 때마다 CMS markdown에서 해당 글을 다시 조회
  // - alive 플래그로 언마운트 이후 setState가 실행되는 것을 방지
  useEffect(() => {
    let alive = true;

    setLoading(true);

    fetchStoryDetail(slug)
      .then((data) => {
        if (!alive) return;
        setPost(data);
      })
      .catch((e) => {
        console.error("[story detail] CMS load error:", e);
        if (alive) setPost(undefined);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [slug]);

  // ReactMarkdown 커스텀 렌더러 설정
  // - markdown 이미지에는 MarkdownImage 컴포넌트를 적용
  // - useMemo로 렌더러 객체가 매번 새로 생성되지 않도록 함
  const markdownComponents = useMemo(
    () => ({
      img: MarkdownImage,
    }),
    []
  );

  // 데이터 로딩 중에는 스켈레톤 UI 표시
  if (loading) {
    return (
      <div className="max-w-screen-md mx-auto px-4 py-12">
        <div className="animate-pulse space-y-5">
          <div className="h-4 w-48 rounded bg-gray-100" />
          <div className="h-9 w-2/3 rounded bg-gray-200" />
          <div className="h-4 w-32 rounded bg-gray-100" />
          <div className="h-64 rounded-xl bg-gray-100" />
          <div className="space-y-3">
            <div className="h-4 rounded bg-gray-100" />
            <div className="h-4 w-5/6 rounded bg-gray-100" />
            <div className="h-4 w-4/6 rounded bg-gray-100" />
          </div>
        </div>
      </div>
    );
  }

  // slug와 일치하는 글이 없을 때 표시하는 화면
  if (post === undefined) {
    return (
      <div className="max-w-screen-xl mx-auto px-4 py-12">
        <p className="text-gray-500">글을 찾을 수 없습니다.</p>
        <Link to="/news/stories" className="mt-4 inline-block text-sky-600 underline">
          목록으로
        </Link>
      </div>
    );
  }

  if (!post) return null;

  return (
    <div className="max-w-screen-md mx-auto px-4 py-12">
      <p className="text-sm text-gray-500 mb-2">
        <Link to="/news/stories" className="hover:underline">
          소식 &gt; 복지디자인 이야기
        </Link>
        &gt; 상세
      </p>

      <h1 className="text-3xl font-bold break-words">{post.title || slug}</h1>

      {post.date && (
        <time className="block text-sm text-gray-500 mt-2 mb-6">
          {String(post.date).slice(0, 10)}
        </time>
      )}

      {/* 대표 썸네일 이미지
          - CMS frontmatter의 thumbnail 값이 있을 때만 표시 */}
      {post.thumbnail ? (
        <img
          src={post.thumbnail}
          alt=""
          loading="lazy"
          decoding="async"
          className="w-full rounded-xl mb-6"
        />
      ) : null}

      {/* Markdown 본문 렌더링 영역 */}
      <div className="prose max-w-none">
        <ReactMarkdown components={markdownComponents}>{post.content || ""}</ReactMarkdown>
      </div>
    </div>
  );
}
