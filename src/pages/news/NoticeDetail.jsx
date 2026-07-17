// -----------------------------------------------------------------------------
// NoticeDetail.jsx
// [페이지 목적]
//  - 공지사항 상세 페이지
//  - URL 파라미터(slug)에 해당하는 src/content/notices/*.md[x] CMS markdown 파일을 찾아 렌더링
//
// [데이터 흐름]
//  - Vite import.meta.glob으로 notices 폴더의 markdown 원문을 raw 문자열로 로드
//  - URL slug와 파일명을 비교해 현재 공지 글을 찾음
//  - frontmatter에서 제목/날짜/썸네일/갤러리 정보를 파싱하고 본문은 ReactMarkdown으로 렌더링
//
// [렌더링 구성]
//  - 상단: 브레드크럼(소식 > 공지사항 > 상세)
//  - 본문: 제목, 날짜, 대표 이미지, 첨부 이미지 갤러리, markdown 본문
//
// [운영 참고]
//  - CMS에서 새 공지 또는 수정된 공지를 저장한 뒤 Netlify 재배포가 완료되어야 반영됨
//  - gallery 필드는 CMS config.yml의 추가 이미지 목록 구조와 함께 관리
// -----------------------------------------------------------------------------

import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";

// CMS 공지사항 원문 로드
// - notices 폴더의 md/mdx 파일을 raw 문자열로 가져옴
// - 상세 페이지에서 slug와 일치하는 파일을 찾기 위한 데이터 원본
const NOTICE_MODULES = import.meta.glob("../../content/notices/*.{md,mdx}", {
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

    value = value.replace(/^[']|[']$/g, "").replace(/^["]|["]$/g, "");
    data[key] = value;
  });

  return { data, content: content.trim() };
}

// gallery 필드 전용 파서
// - CMS config.yml의 gallery list 구조를 직접 읽어 첨부 이미지 배열로 변환
// - 각 항목은 image와 caption 값을 가짐
function parseGalleryImages(rawText) {
  const text = String(rawText || "");
  const match = text.match(/^---\s*\n([\s\S]*?)\n---/);
  if (!match) return [];

  const yaml = match[1];
  const galleryMatch = yaml.match(
    /(?:^|\n)gallery:\s*\n([\s\S]*?)(?=\n[a-zA-Z가-힣0-9_-]+:\s*|$)/,
  );

  if (!galleryMatch) return [];

  const block = galleryMatch[1];
  const items = [];
  let current = null;

  block.split("\n").forEach((line) => {
    const imageMatch = line.match(/^\s*-\s*image:\s*(.+?)\s*$/);
    const captionMatch = line.match(/^\s*caption:\s*(.+?)\s*$/);

    if (imageMatch) {
      if (current?.image) items.push(current);

      current = {
        image: imageMatch[1].replace(/^["']|["']$/g, "").trim(),
        caption: "",
      };

      return;
    }

    if (captionMatch && current) {
      current.caption = captionMatch[1].replace(/^["']|["']$/g, "").trim();
    }
  });

  if (current?.image) items.push(current);

  return items;
}

// 공지 작성일 표시 형식 변환
// - CMS에 저장된 날짜 값을 ko-KR 날짜 형식으로 변환하여 화면에 표시
// - 유효하지 않은 날짜는 빈 문자열로 처리
function formatDate(date) {
  try {
    const d = new Date(date);

    if (Number.isNaN(d.getTime())) {
      return "";
    }

    return d.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  } catch {
    return "";
  }
}

// 현재 slug에 해당하는 공지 상세 데이터 찾기
// - 파일명에서 확장자(.md/.mdx)를 제거한 값과 URL slug를 비교
// - 일치하는 파일이 없으면 undefined를 반환하여 404 성격의 화면을 표시
async function fetchNoticeDetail(slug) {
  const target = Object.entries(NOTICE_MODULES).find(([path]) => {
    const fileName = path.split("/").pop() || "";
    const base = fileName.replace(/\.(md|mdx)$/i, "");

    return base === slug;
  });

  if (!target) {
    return undefined;
  }

  const [, raw] = target;
  const { data, content } = parseFrontmatter(raw);
  const gallery = parseGalleryImages(raw);

  return {
    ...(data ?? {}),
    gallery,
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
      className="mt-6 w-full max-h-[70vh] rounded-lg border border-gray-200 object-contain"
    />
  );
}

// -----------------------------------------------------------------------------
// NoticeDetail 컴포넌트
//  - slug 변경 시 해당 공지를 다시 로드
//  - 로딩/글 없음/정상 표시 상태를 분기하여 렌더링
// -----------------------------------------------------------------------------
export default function NoticeDetail() {
  const { slug } = useParams();
  const nav = useNavigate();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  // slug가 바뀔 때마다 CMS markdown에서 해당 공지를 다시 조회
  // - alive 플래그로 언마운트 이후 setState가 실행되는 것을 방지
  useEffect(() => {
    let alive = true;

    setLoading(true);

    fetchNoticeDetail(slug)
      .then((data) => {
        if (!alive) return;
        setPost(data);
      })
      .catch((error) => {
        console.error("[notice detail] CMS load error:", error);

        if (alive) {
          setPost(undefined);
        }
      })
      .finally(() => {
        if (alive) {
          setLoading(false);
        }
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
    [],
  );

  // 데이터 로딩 중에는 스켈레톤 UI 표시
  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20">
        <div className="animate-pulse space-y-5">
          <div className="h-10 w-2/3 rounded bg-gray-200" />
          <div className="h-4 w-32 rounded bg-gray-200" />
          <div className="h-64 rounded-2xl bg-gray-100" />

          <div className="space-y-3">
            <div className="h-4 rounded bg-gray-100" />
            <div className="h-4 w-5/6 rounded bg-gray-100" />
            <div className="h-4 w-4/6 rounded bg-gray-100" />
          </div>
        </div>
      </div>
    );
  }

  // slug와 일치하는 공지가 없을 때 표시하는 화면
  if (post === undefined) {
    return (
      <div className="max-w-screen-md mx-auto px-4 py-16 text-center">
        <h1 className="mb-3 text-2xl font-bold">글을 찾을 수 없습니다</h1>

        <p className="mb-6 text-gray-500">
          삭제되었거나 존재하지 않는 게시글입니다.
        </p>

        <button
          type="button"
          className="text-sky-600 underline"
          onClick={() => nav("/news/notices")}
        >
          목록으로
        </button>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* 브레드크럼
          - 현재 위치를 소식 > 공지사항 > 상세 순서로 표시 */}
      <section className="mb-4">
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

      {/* 목록으로 돌아가기 버튼
          - 상세 콘텐츠보다 시각적 비중을 낮게 유지 */}
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => nav("/news/notices")}
          className="inline-flex items-center gap-1 rounded-md border border-gray-200 px-2.5 py-1 text-[13px] font-medium text-gray-500 transition hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700"
          aria-label="공지사항 목록으로 돌아가기"
        >
          <span aria-hidden="true">←</span>
          목록으로
        </button>
      </div>

      <article className="rounded-lg bg-white p-8 md:p-10 text-gray-900 shadow-sm ring-1 ring-gray-200">
        <header className="mb-6 border-b border-gray-100 pb-5">
          <h1 className="break-words text-4xl font-extrabold leading-[1.15] tracking-tight">
            {post.title || slug}
          </h1>
          {post.date && (
            <time
              dateTime={post.date}
              className="mt-5 block text-base font-normal text-gray-400"
            >
              {formatDate(post.date)}
            </time>
          )}
        </header>

        {/* 대표 썸네일 이미지
            - CMS frontmatter의 thumbnail 값이 있을 때만 표시 */}
        {post.thumbnail && (
          <img
            src={post.thumbnail}
            alt=""
            loading="lazy"
            decoding="async"
            className="mb-8 mx-auto w-full max-w-4xl rounded-lg object-contain"
          />
        )}

        {/* 첨부 이미지 갤러리
            - CMS의 gallery 필드에 등록된 이미지를 2열 그리드로 표시
            - caption이 있으면 이미지 아래에 설명 문구로 출력 */}
        {Array.isArray(post.gallery) && post.gallery.length > 0 ? (
          <section className="mb-8">
            <div className="grid gap-4">
              {post.gallery.map((item, index) => (
                <figure
                  key={`${item.image}-${index}`}
                  className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
                >
                  <img
                    src={item.image}
                    alt={
                      item.caption ||
                      `${post.title || slug} 추가 이미지 ${index + 1}`
                    }
                    loading="lazy"
                    decoding="async"
                    className="mx-auto block w-full max-w-4xl rounded-2xl object-contain"
                  />

                  {item.caption ? (
                    <figcaption className="px-4 py-3 text-sm text-gray-500">
                      {item.caption}
                    </figcaption>
                  ) : null}
                </figure>
              ))}
            </div>
          </section>
        ) : null}

        {/* Markdown 본문 렌더링 영역 */}
        <div className="prose prose-neutral max-w-none text-[17px] leading-8 text-gray-800">
          <ReactMarkdown components={markdownComponents}>
            {post.content || ""}
          </ReactMarkdown>
        </div>
      </article>
    </div>
  );
}
