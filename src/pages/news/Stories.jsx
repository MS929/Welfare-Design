// src/pages/news/Stories.jsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import matter from "gray-matter";

const CATEGORIES = ["전체", "인터뷰", "행사", "공탁", "공조동방"];

// 마크다운 본문에서 첫 문장 정도만 간단 추출
function toExcerpt(md = "", max = 80) {
  const text = md
    .replace(/!\[[^\]]*\]\([^)]+\)/g, "") // 이미지
    .replace(/\[[^\]]*\]\([^)]+\)/g, "") // 링크 표기
    .replace(/[#>*`_~-]/g, "") // 마크다운 기호
    .replace(/\s+/g, " ")
    .trim();
  return text.length > max ? text.slice(0, max) + "…" : text;
}

function Tag({ children }) {
  return (
    <span className="inline-block rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold px-2 py-1">
      {children}
    </span>
  );
}

function StoryCard({ item }) {
  const date = item.date ? new Date(item.date).toISOString().slice(0, 10) : "";
  return (
    <Link
      to={`/news/stories/${item.slug}`}
      className="group block overflow-hidden rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow bg-white"
    >
        {item.thumbnail && (
          <img
            src={item.thumbnail}
            alt=""
            className="mt-6 w-full max-h-[520px] object-contain rounded-xl"
          />
      )}

      <div className="p-4 sm:p-5">
        <div className="mb-2">
          <Tag>{item.category}</Tag>
        </div>
        <h3 className="line-clamp-1 text-lg font-bold text-gray-900">
          {item.title}
        </h3>
        <p className="mt-1 text-sm text-gray-500">{date}</p>
        <p className="mt-2 line-clamp-2 text-sm text-gray-700">
          {item.excerpt}
        </p>
      </div>
    </Link>
  );
}

export default function NewsStories() {
  const [rawItems, setRawItems] = useState([]);
  const [activeCat, setActiveCat] = useState("전체");
  const [q, setQ] = useState("");

  useEffect(() => {
    (async () => {
      // vite glob – 파일 내용(raw)까지 읽어서 frontmatter 파싱
      const modules = import.meta.glob("/src/content/stories/*.md", {
        query: "?raw",
        import: "default",
      });

      const entries = await Promise.all(
        Object.entries(modules).map(async ([path, loader]) => {
          const raw = await loader();
          const { data, content } = matter(raw);
          const file = path.split("/").pop().replace(".md", "");

          return {
            slug: file, // 상세 라우팅에 그대로 사용
            title: data.title || "제목 없음",
            date: data.date || "",
            thumbnail: data.thumbnail || "",
            category: data.category || "인터뷰",
            excerpt: toExcerpt(content),
            _sort: data.date ? new Date(data.date).getTime() : 0,
          };
        })
      );

      // 최신순 정렬
      entries.sort((a, b) => b._sort - a._sort);
      setRawItems(entries);
    })();
  }, []);

  const filtered = useMemo(() => {
    const byCat =
      activeCat === "전체"
        ? rawItems
        : rawItems.filter((it) => (it.category || "인터뷰") === activeCat);

    const keyword = q.trim().toLowerCase();
    if (!keyword) return byCat;

    return byCat.filter(
      (it) =>
        it.title.toLowerCase().includes(keyword) ||
        (it.excerpt || "").toLowerCase().includes(keyword)
    );
  }, [rawItems, activeCat, q]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl sm:text-4xl font-extrabold mb-6">동행이야기</h1>

      {/* 탭 */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-6">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setActiveCat(c)}
            className={`px-3 py-1.5 rounded-full border text-sm font-medium transition
              ${
                activeCat === c
                  ? "bg-emerald-600 border-emerald-600 text-white"
                  : "bg-white border-gray-300 text-gray-700 hover:border-emerald-400"
              }`}
          >
            {c}
          </button>
        ))}

        {/* 검색 */}
        <div className="ml-auto w-full sm:w-72">
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search"
            className="w-full rounded-full border border-gray-300 px-4 py-2 text-sm outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* 카드 그리드 */}
      {filtered.length === 0 ? (
        <p className="text-gray-500">등록된 글이 없습니다.</p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((it) => (
            <StoryCard key={it.slug} item={it} />
          ))}
        </div>
      )}
    </div>
  );
}
