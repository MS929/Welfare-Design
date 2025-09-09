// src/pages/news/StoryDetail.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import matter from "gray-matter";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * 동행이야기 상세 페이지
 * - CMS가 생성한 /src/content/stories/*.md 를 읽어서 렌더링
 * - Vite 5/7 호환: import.meta.glob 의 as:'raw' 대신 query:'?raw', import:'default'
 */
export default function StoryDetail() {
  const { slug } = useParams();
  const nav = useNavigate();
  const [post, setPost] = useState(null); // null: 로딩, undefined: not found

  useEffect(() => {
    (async () => {
      try {
        const modules = import.meta.glob("/src/content/stories/*.md", {
          query: "?raw",
          import: "default",
        });

        const key = Object.keys(modules).find((p) => p.endsWith(`${slug}.md`));
        if (!key) {
          setPost(undefined);
          return;
        }

        const raw = await modules[key]();
        const { data, content } = matter(raw);
        // frontmatter 예시: title, date, thumbnail, author 등
        setPost({
          title: data.title ?? "",
          date: data.date ?? "",
          thumbnail: data.thumbnail ?? "",
          author: data.author ?? "",
          content,
        });
      } catch (e) {
        console.error(e);
        setPost(undefined);
      }
    })();
  }, [slug]);

  if (post === undefined) {
    return (
      <div className="max-w-screen-md mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-3">글을 찾을 수 없습니다</h1>
        <button className="text-sky-600 underline" onClick={() => nav(-1)}>
          목록으로
        </button>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-screen-md mx-auto px-4 py-16">
        <p className="text-gray-500">불러오는 중…</p>
      </div>
    );
  }

  return (
    <div className="max-w-screen-md mx-auto px-4 py-10">
      <button
        className="text-sky-600 text-sm mb-4 hover:underline"
        onClick={() => nav(-1)}
      >
        ← 목록으로
      </button>

      <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">
        {post.title}
      </h1>

      <div className="mt-2 text-sm text-gray-500">
        {post.date
          ? new Date(post.date).toISOString().slice(0, 10)
          : null}
        {post.author ? <span className="ml-2">· {post.author}</span> : null}
      </div>

      {post.thumbnail ? (
        <img
          src={post.thumbnail}
          alt=""
          className="mt-6 w-full h-auto max-h-[520px] object-contain rounded-xl border"
          loading="lazy"
        />
      ) : null}

      <article className="prose max-w-none mt-8 prose-img:rounded-xl prose-img:my-6">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            img: ({ node, ...props }) => (
              <img
                {...props}
                loading="lazy"
                className="w-full h-auto max-h-[520px] object-contain rounded-xl my-6"
              />
            ),
            a: ({ node, ...props }) => {
              const href = String(props.href || "");
              const isExternal = /^https?:\/\//i.test(href);
              return (
                <a
                  {...props}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noopener noreferrer" : undefined}
                  className="text-sky-600 underline"
                />
              );
            },
          }}
        >
          {post.content}
        </ReactMarkdown>
      </article>
    </div>
  );
}
