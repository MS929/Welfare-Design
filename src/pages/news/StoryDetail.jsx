// src/pages/news/StoryDetail.jsx
import { useParams, Link } from "react-router-dom";

/** frontmatter + body 파서 */
function parseMD(raw) {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) return { frontmatter: {}, body: raw };
  const [, fmBlock, body] = m;
  const fm = {};
  fmBlock.split("\n").forEach((line) => {
    const idx = line.indexOf(":");
    if (idx === -1) return;
    const key = line.slice(0, idx).trim();
    const val = line.slice(idx + 1).trim().replace(/^"|"$/g, "");
    fm[key] = val;
  });
  return { frontmatter: fm, body: body?.trim() ?? "" };
}

/** 파일 경로에서 slug 뽑기 */
function slugFromPath(path) {
  return path.split("/").pop().replace(/\.md$/, "");
}

export default function StoryDetail() {
    const { slug } = useParams();

    // 모든 파일 로드
    const files = import.meta.glob("/src/content/stories/*.md", {
        eager: true,
        as: "raw",
    });

    // slug 매칭 파일 찾기
    let found = null;
    for (const [path, raw] of Object.entries(files)) {
        if (slugFromPath(path) === slug) {
            const { frontmatter, body } = parseMD(raw);
            found = {
                title: frontmatter.title || "제목 없음",
                date: frontmatter.date || "",
                thumbnail: frontmatter.thumbnail || "",
                body,
            };
            break;
        }

        if (!found) {
            return (
                <div className="max-w-screen-md mx-auto px-4 py-16">
                    <p className="text-gray-600">해당 스토리를 찾을 수 없습니다.</p>
                    <Link to="/news/stories" className="text-sky-600 underline mt-4 inline-block">
                        목록으로 돌아가기
                    </Link>
                </div>
            );
        }

        // 아주 간단한 마크다운 처리 (줄바꿈만)
        const html = found.body
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/\n/g, "<br />");

        return (
            <div className="max-w-screen-md mx-auto px-4 py-12">
                <Link to="/news/stories" className="text-sm text-sky-600">&larr; 목록으로</Link>
                <h1 className="text-3xl md:text-4xl font-extrabold mt-2">{found.title}</h1>
                {found.date && (
                    <p className="text-gray-500 mt-2">{new Date(found.date).toISOString().slice(0, 10)}</p>
                )}

                {found.thumbnail && (
                    <div className="mt-6 rounded-xl overflow-hidden">
                        <img src={found.thumbnail} alt={found.title} className="w-full object-cover" />
                    </div>
                )}

                <div
                    className="prose max-w-none mt-8"
                    dangerouslySetInnerHTML={{ __html: html }}
                />
            </div>
        );
    }
}