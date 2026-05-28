// -----------------------------------------------------------------------------
// [페이지 목적]
//  - 공지사항 상세 페이지(NoticeDetail)
//  - URL 파라미터(slug)로 /src/content/notices/*.md CMS markdown 공지 파일을 찾아 렌더링
//
// [데이터 로딩 흐름]
//  - GitHub API 실시간 호출 없이 Vite import.meta.glob 로 로컬 CMS markdown을 사용
//  - 현재 slug와 같은 파일명을 찾은 뒤 frontmatter를 파싱하여 data/content 분리
//  - slug 파일이 없거나 파싱 오류가 나면 404 성격 화면(post === undefined) 노출
//
// [마크다운 렌더링]
//  - react-markdown 사용
//  - 이미지(img)는 공통 스타일 + lazy 로딩/async 디코딩으로 통일
// -----------------------------------------------------------------------------

import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";

const NOTICE_MODULES = import.meta.glob("../../content/notices/*.{md,mdx}", {
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

function formatDate(date) {
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return "";

    return d.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  } catch (_) {
    return "";
  }
}

async function fetchNoticeDetail(slug) {
  const target = Object.entries(NOTICE_MODULES).find(([path]) => {
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

// -----------------------------------------------------------------------------
// [컴포넌트] 공지사항 상세 뷰
// -----------------------------------------------------------------------------
export default function NoticeDetail() {
  const { slug } = useParams();
  const nav = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    setLoading(true);

    fetchNoticeDetail(slug)
      .then((data) => {
        if (!alive) return;
        setPost(data);
      })
      .catch((e) => {
        console.error("[notice detail] CMS load error:", e);
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
      <div className="max-w-3xl mx-auto px-4 py-20">
        <div className="animate-pulse space-y-5">
          <div className="h-10 bg-gray-200 rounded w-2/3" />
          <div className="h-4 bg-gray-200 rounded w-32" />
          <div className="h-64 bg-gray-100 rounded-2xl" />
          <div className="space-y-3">
            <div className="h-4 bg-gray-100 rounded" />
            <div className="h-4 bg-gray-100 rounded w-5/6" />
            <div className="h-4 bg-gray-100 rounded w-4/6" />
          </div>
        </div>
      </div>
    );
  }

  if (post === undefined) {
    return (
      <div className="max-w-screen-md mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-3">글을 찾을 수 없습니다</h1>
        <p className="mb-6 text-gray-500">삭제되었거나 존재하지 않는 게시글입니다.</p>
        <button className="text-sky-600 underline" onClick={() => nav("/news/notices")}>
          목록으로
        </button>
      </div>
    );
  }

  if (!post) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <section className="mb-6">
        <nav className="text-sm text-black/80">
          <Link to="/news" className="hover:underline">
            소식
          </Link>
          <span className="mx-1 text-gray-400">›</span>
          <Link to="/news/notices" className="hover:underline">
            공지사항
          </Link>
          <span className="mx-1 text-gray-400">›</span>
          <span className="text-black">{post.title || slug}</span>
        </nav>
      </section>

      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => nav("/news/notices")}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded border border-gray-300 text-gray-700 hover:bg-gray-50 transition text-sm font-medium"
          aria-label="Back to notice list"
        >
          <span aria-hidden>←</span> 목록으로
        </button>
      </div>

      <article className="bg-white shadow-sm ring-1 ring-gray-200 rounded-lg p-8 text-gray-900">
        <header className="mb-6">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight break-words">
            {post.title || slug}
          </h1>
          {post.date && (
            <time
              dateTime={post.date}
              className="block mt-1 text-gray-500 text-sm font-medium select-none"
            >
              {formatDate(post.date)}
            </time>
          )}
        </header>

        {post.thumbnail && (
          <img
            src={post.thumbnail}
            alt=""
            loading="lazy"
            decoding="async"
            className="mb-6 w-full rounded-lg object-cover"
          />
        )}

        <div className="prose max-w-none text-[17px] leading-8 text-gray-800">
          <ReactMarkdown components={markdownComponents}>{post.content || ""}</ReactMarkdown>
        </div>
      </article>
    </div>
  );
}
