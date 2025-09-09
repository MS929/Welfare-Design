// src/pages/news/StoryDetail.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import matter from "gray-matter";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "../../styles/global.css"; // ★ 여기서도 import!

export default function StoryDetail() {
  const { slug: rawSlug } = useParams();
  const slug = decodeURIComponent(rawSlug || ""); // ← 디코딩
  const nav = useNavigate();
  const [post, setPost] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        // ✅ 최신 Vite 옵션 사용
        const abs = import.meta.glob("/src/content/stories/*.md", {
          query: "?raw",
          import: "default",
        });
        const rel = import.meta.glob("./../../content/stories/*.md", {
          query: "?raw",
          import: "default",
        });

        // 키 후보를 전부 모아 slug와 끝이 일치하는 파일을 찾음
        const all = { ...abs, ...rel };
        const keys = Object.keys(all);

        let targetKey =
          keys.find((p) => p.endsWith(`${slug}.md`)) ||
          // 혹시 인코딩 차이로 실패하면 다시 한번 비교
          keys.find((p) => decodeURIComponent(p).endsWith(`${slug}.md`));

        if (!targetKey) {
          setNotFound(true);
          return;
        }

        const raw = await all[targetKey]();
        const { data, content } = matter(raw);
        setPost({ ...data, content });
      } catch (e) {
        console.error("[StoryDetail] load error:", e);
        setNotFound(true);
      }
    })();
  }, [slug]);

  if (notFound) {
    return (
      <div className="max-w-screen-md mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-3">글을 찾을 수 없습니다</h1>
        <button className="text-sky-600 underline" onClick={() => nav(-1)}>
          목록으로
        </button>
      </div>
    );
  }

  if (!post) return null;

  return (
    <div className="max-w-screen-lg mx-auto px-4 py-10">
      <button className="text-sky-600 text-sm mb-4" onClick={() => nav(-1)}>
        ← 목록으로
      </button>

      <h1 className="text-3xl font-extrabold mb-1">{post.title}</h1>
      {post.date && (
        <p className="text-gray-500 mt-2">
          {new Date(post.date).toISOString().slice(0, 10)}
        </p>
      )}

      {post.thumbnail && (
        <img src={post.thumbnail} alt="" className="mt-6 w-full rounded-xl" />
      )}

      <article className="cms-content prose prose-slate max-w-none mt-8">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            img: (props) => (
              // force responsive images inserted from CMS
              <img
                {...props}
                className={(props.className ? props.className + " " : "") +
                  "mx-auto my-4 rounded-lg max-w-full h-auto"}
                loading="lazy"
                decoding="async"
              />
            ),
            a: (props) => (
              <a
                {...props}
                className={(props.className ? props.className + " " : "") +
                  "text-sky-600 underline underline-offset-2 hover:no-underline"}
                target={props.href?.startsWith("/") ? undefined : "_blank"}
                rel={props.href?.startsWith("/") ? undefined : "noopener noreferrer"}
              />
            ),
          }}
        >
          {post.content}
        </ReactMarkdown>
      </article>
    </div>
  );
}
