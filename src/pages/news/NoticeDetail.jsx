// src/pages/news/NoticeDetail.jsx
// 공지사항 상세 페이지
// - URL 파라미터(slug)를 기준으로 공지 markdown 파일을 로드한다.
// - gray-matter로 프론트매터/본문을 분리하여 화면에 렌더링한다.
// - 파일이 없을 경우 '글을 찾을 수 없습니다' 안내 화면을 보여준다.

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import matter from 'gray-matter';
import ReactMarkdown from 'react-markdown';

// 공지사항 상세 뷰 컴포넌트
export default function NoticeDetail() {
  // URL 경로에서 공지 slug 추출 (/news/notices/:slug)
  const { slug } = useParams();
  // 목록 페이지로 이동하기 위한 네비게이션 훅
  const nav = useNavigate();
  // 공지 데이터 상태
  // - null: 로딩 중
  // - undefined: 파일 없음(404 성격)
  // - object: 정상 로드
  const [post, setPost] = useState(null);

  // slug 변경 시마다 해당 공지 markdown 파일을 비동기로 로드
  useEffect(() => {
    (async () => {
      try {
        // Vite glob 기능으로 공지 markdown 파일들을 문자열(raw)로 로드
        const modules = import.meta.glob('/src/content/notices/*.md', { query: '?raw', import: 'default' });
        // slug와 일치하는 파일 경로 탐색
        const fileKey = Object.keys(modules).find((p) => p.endsWith(`${slug}.md`));

        // 해당 slug에 대응하는 파일이 없으면 404 상태로 처리
        if (!fileKey) {
          setPost(undefined);
          return;
        }

        // markdown 원문 로드
        const raw = await modules[fileKey]();
        // gray-matter로 프론트매터(data)와 본문(content) 분리
        const { data, content } = matter(raw);
        setPost({ ...(data ?? {}), content });
      } catch (e) {
        // 파싱/로딩 중 오류 발생 시: 콘솔 로그 후 404 상태로 폴백
        console.error('[notice detail] load error:', e);
        setPost(undefined);
      }
    })();
  }, [slug]);

  // 공지 파일을 찾을 수 없을 때 보여주는 안내 화면
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

  // 마크다운 이미지 렌더링 통일
  // - lazy 로딩 + async 디코딩
  // - 과도한 크기 방지 및 비율 유지
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
        {/* 공지 목록으로 돌아가기 버튼 */} 
        <button
          onClick={() => nav('/news/notices')}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded border border-gray-300 text-gray-700 hover:bg-gray-50 transition text-sm font-medium"
          aria-label="Back to notice list"
        >
          <span aria-hidden>←</span> 목록으로
        </button>
        {/* 배지 UI는 의도적으로 제거됨 (공지 성격 단순화) */}
      </div>

      {/* 공지 본문 카드 영역 */} 
      <article className="bg-white shadow-sm ring-1 ring-gray-200 rounded-lg p-8 text-gray-900">
        <header className="mb-6">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">{post.title || slug}</h1>
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

        {/* 썸네일 이미지가 있을 경우에만 렌더링 */} 
        {post.thumbnail && (
          <img
            src={post.thumbnail}
            alt=""
            loading="lazy"
            decoding="async"
            className="mb-6 w-full rounded-lg object-cover"
          />
        )}

        {/* 마크다운 본문 렌더링 영역 */} 
        <div className="prose max-w-none text-[17px] leading-8 text-gray-800">
          <ReactMarkdown components={markdownComponents}>{post.content}</ReactMarkdown>
        </div>
      </article>
    </div>
  );
}
