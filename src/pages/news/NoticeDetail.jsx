// -----------------------------------------------------------------------------
// [페이지 목적]
//  - 공지사항 상세 페이지(NoticeDetail)
//  - URL 파라미터(slug)로 GitHub에 저장된 CMS markdown 공지 파일을 찾아 렌더링
//
// [데이터 로딩 흐름]
//  - GitHub Contents API로 src/content/notices 목록을 실시간 조회
//  - 현재 slug와 같은 파일명을 찾은 뒤 download_url로 markdown 원문 로드
//  - 직접 frontmatter를 파싱하여 data/content 분리
//  - slug 파일이 없거나 로딩/파싱 오류가 나면 404 성격 화면(post === undefined) 노출
//
// [마크다운 렌더링]
//  - react-markdown 사용
//  - 이미지(img)는 공통 스타일 + lazy 로딩/async 디코딩으로 통일
// -----------------------------------------------------------------------------

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

const GITHUB_NOTICES_API =
  'https://api.github.com/repos/MS929/Welfare-Design/contents/src/content/notices?ref=main';

function parseFrontmatter(rawText) {
  const text = String(rawText || '');
  const match = text.match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/);

  if (!match) {
    return { data: {}, content: text.trim() };
  }

  const [, yaml, content] = match;
  const data = {};

  yaml.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;

    const idx = trimmed.indexOf(':');
    if (idx === -1) return;

    const key = trimmed.slice(0, idx).trim();
    let value = trimmed.slice(idx + 1).trim();

    value = value.replace(/^["']|["']$/g, '');
    data[key] = value;
  });

  return { data, content: content.trim() };
}

// -----------------------------------------------------------------------------
// [컴포넌트] 공지사항 상세 뷰
// -----------------------------------------------------------------------------
export default function NoticeDetail() {
  const { slug } = useParams();
  const nav = useNavigate();
  const [post, setPost] = useState(null);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const listRes = await fetch(`${GITHUB_NOTICES_API}&t=${Date.now()}`, {
          cache: 'no-store',
          headers: {
            Accept: 'application/vnd.github+json',
          },
        });

        if (!listRes.ok) {
          throw new Error(`GitHub notices list fetch failed: ${listRes.status}`);
        }

        const files = await listRes.json();
        const target = Array.isArray(files)
          ? files.find((file) => {
              const name = String(file.name || '');
              const base = name.replace(/\.(md|mdx)$/i, '');
              return file.type === 'file' && file.download_url && base === slug;
            })
          : null;

        if (!target) {
          if (alive) setPost(undefined);
          return;
        }

        const rawUrl = `${target.download_url}${
          target.download_url.includes('?') ? '&' : '?'
        }t=${Date.now()}`;
        const rawRes = await fetch(rawUrl, { cache: 'no-store' });

        if (!rawRes.ok) {
          throw new Error(`GitHub notice file fetch failed: ${rawRes.status}`);
        }

        const raw = await rawRes.text();
        const { data, content } = parseFrontmatter(raw);

        if (alive) {
          setPost({ ...(data ?? {}), content });
        }
      } catch (e) {
        console.error('[notice detail] live load error:', e);
        if (alive) setPost(undefined);
      }
    })();

    return () => {
      alive = false;
    };
  }, [slug]);

  if (post === undefined) {
    return (
      <div className="max-w-screen-md mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-3">글을 찾을 수 없습니다</h1>
        <button className="text-sky-600 underline" onClick={() => nav('/news/notices')}>
          목록으로
        </button>
      </div>
    );
  }

  if (!post) return null;

  const markdownComponents = {
    img: ({ node, ...props }) => (
      <img
        {...props}
        loading="lazy"
        decoding="async"
        className="mt-6 rounded-lg border border-gray-200 w-full max-h-[70vh] object-contain"
        alt={props.alt || ''}
      />
    ),
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => nav('/news/notices')}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded border border-gray-300 text-gray-700 hover:bg-gray-50 transition text-sm font-medium"
          aria-label="Back to notice list"
        >
          <span aria-hidden>←</span> 목록으로
        </button>
      </div>

      <article className="bg-white shadow-sm ring-1 ring-gray-200 rounded-lg p-8 text-gray-900">
        <header className="mb-6">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            {post.title || slug}
          </h1>
          {post.date && (
            <time
              dateTime={new Date(post.date).toISOString()}
              className="block mt-1 text-gray-500 text-sm font-medium select-none"
            >
              {new Date(post.date).toLocaleDateString(undefined, {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
              })}
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
          <ReactMarkdown components={markdownComponents}>{post.content}</ReactMarkdown>
        </div>
      </article>
    </div>
  );
}
