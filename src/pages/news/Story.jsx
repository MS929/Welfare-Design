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
// -----------------------------------------------------------------------------
// [페이지 목적]
//  - "복지디자인 이야기" 상세 페이지
//  - URL 파라미터(slug)에 해당하는 GitHub CMS markdown 파일을 찾아 렌더링
//
// [데이터 로딩 방식]
//  - GitHub Contents API로 src/content/stories 목록을 실시간 조회
//  - 현재 slug와 같은 파일을 찾은 뒤 download_url로 markdown 원문 로드
//  - 직접 frontmatter를 파싱하여 제목/날짜/썸네일/본문 렌더링
// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
// [페이지 목적]
//  - "복지디자인 이야기" 상세 페이지
//  - URL 파라미터(slug)에 해당하는 /src/content/stories/*.md[x] 파일을 찾아 렌더링
//
// [데이터 로딩 방식]
//  - GitHub API 실시간 호출 없이 Vite import.meta.glob 로 로컬 CMS markdown을 사용
//  - 빌드 시점에 모든 stories markdown을 raw 문자열로 포함
//  - 현재 slug와 같은 파일명을 찾아 frontmatter와 본문을 렌더링
//
// [렌더링 구성]
//  - 상단: 브레드크럼(소식 > 복지디자인 이야기 > 상세)
//  - 본문: frontmatter(제목/날짜/썸네일) + 마크다운 body 렌더링
// -----------------------------------------------------------------------------

import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";

const STORY_DETAIL_MODULES = import.meta.glob("../../content/stories/*.{md,mdx}", {
  query: "?raw",
  import: "default",
  eager: true,
});

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

export default function StoryDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const markdownComponents = useMemo(
    () => ({
      img: MarkdownImage,
    }),
    []
  );

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

      {post.thumbnail ? (
        <img
          src={post.thumbnail}
          alt=""
          loading="lazy"
          decoding="async"
          className="w-full rounded-xl mb-6"
        />
      ) : null}

      <div className="prose max-w-none">
        <ReactMarkdown components={markdownComponents}>{post.content || ""}</ReactMarkdown>
      </div>
    </div>
  );
}
