// src/pages/news/Notices.jsx
function parseFrontMatter(raw) {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) return { data: {}, body: raw };
  const yaml = Object.fromEntries(
    m[1]
      .split("\n")
      .filter(Boolean)
      .map((line) => {
        const idx = line.indexOf(":");
        const k = line.slice(0, idx).trim();
        const v = line
          .slice(idx + 1)
          .trim()
          .replace(/^"|"$/g, "");
        return [k, v];
      })
  );
  return { data: yaml, body: m[2].trim() };
}

export default function Notices() {
  // notices 폴더만 읽음 (필요하면 news도 포함 가능)
  const modules = import.meta.glob("../../content/notices/*.md", {
    eager: true,
    as: "raw",
  });

  const items = Object.entries(modules)
    .map(([path, raw]) => {
      const { data } = parseFrontMatter(raw);
      return {
        path,
        title: data.title ?? "제목 없음",
        date: data.date ?? "",
        thumbnail: data.thumbnail ?? "",
      };
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">공지/공모</h1>
      {items.length === 0 ? (
        <p className="text-gray-500">공지/공모 글 목록이 표시됩니다.</p>
      ) : (
        <ul className="space-y-4">
          {items.map((it) => (
            <li
              key={it.path}
              className="border rounded-lg p-4 flex items-center gap-4"
            >
              {it.thumbnail ? (
                <img
                  src={it.thumbnail}
                  alt=""
                  className="w-20 h-20 object-cover rounded-md"
                />
              ) : (
                <div className="w-20 h-20 bg-gray-100 rounded-md" />
              )}
              <div>
                <h3 className="font-semibold">{it.title}</h3>
                <p className="text-sm text-gray-500">{it.date?.slice(0, 10)}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
