import { useEffect, useMemo, useState } from "react";

const GITHUB_API =
  "https://api.github.com/repos/MS929/Welfare-Design/contents/src/content/history?ref=main";

const fallbackRaw = [
  { date: "2025.05", event: "가칭) 복지디자인사회적협동조합 실무자 교육 진행" },
  { date: "2025.06", event: "가칭) 복지디자인사회적협동조합 설립 추진단 결성" },
  { date: "2024.11", event: "가칭) 복지디자인사회적협동조합 창립총회 개최" },
  {
    date: "2024.12",
    event: "가칭) 복지디자인사회적협동조합 설립동의자 모집 및 준비모임",
  },
];

function parseFrontmatter(rawText) {
  const text = String(rawText || "");
  const match = text.match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/);

  if (!match) return { data: {}, content: text.trim() };

  const [, yaml, content] = match;
  const data = {};

  yaml.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;

    const idx = trimmed.indexOf(":");
    if (idx === -1) return;

    const key = trimmed.slice(0, idx).trim();
    let value = trimmed.slice(idx + 1).trim();

    value = value.replace(/^['"]|['"]$/g, "");
    data[key] = value;
  });

  return { data, content: content.trim() };
}

async function fetchHistoryItems() {
  const res = await fetch(`${GITHUB_API}&t=${Date.now()}`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("GitHub history list fetch failed");

  const files = await res.json();

  const mdFiles = files.filter(
    (file) =>
      file.type === "file" &&
      /\.(md|mdx)$/i.test(file.name) &&
      file.download_url,
  );

  const items = await Promise.all(
    mdFiles.map(async (file) => {
      const fileRes = await fetch(`${file.download_url}?t=${Date.now()}`, {
        cache: "no-store",
      });

      const raw = await fileRes.text();
      const { data, content } = parseFrontmatter(raw);

      return {
        id: file.path,
        date: String(data?.date || "").trim(),
        event: String(data?.event || content || "").trim(),
      };
    }),
  );

  return items.filter((item) => item.date && item.event);
}

function makeByYear(items) {
  return items
    .slice()
    .filter((item) => item.date && item.event)
    .sort((a, b) => {
      const normalize = (d) => {
        const [y, m = "00"] = String(d).split(".");
        return Number(`${y}${m.padStart(2, "0")}`);
      };

      return normalize(a.date) - normalize(b.date);
    })
    .reduce((acc, item) => {
      const [y, m] = String(item.date).split(".");
      const ym = m ? `${y}. ${m}` : y;

      (acc[y] ||= []).push({
        ym,
        event: item.event,
      });

      return acc;
    }, {});
}

export default function AboutHistory() {
  const [items, setItems] = useState(fallbackRaw);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    fetchHistoryItems()
      .then((data) => {
        if (!alive) return;
        setItems(data.length > 0 ? data : fallbackRaw);
      })
      .catch((e) => {
        console.warn("연혁 GitHub 실시간 로드 실패:", e);
        if (alive) setItems(fallbackRaw);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, []);

  const byYear = useMemo(() => makeByYear(items), [items]);

  const themeVars = {
    "--pri": "#F26C2A",
    "--sec": "#2CB9B1",
    "--acc": "#F4C542",
    "--pri-soft": "rgba(242,108,42,0.10)",
    "--sec-soft": "rgba(44,185,177,0.10)",
    "--title-guide": "20px",
    "--timeline-guide": "20px",
    "--year-block": "56px",
    "--timeline-offset": "32px",
    "--rail": "0px",
    "--year-block-desktop": "72px",
    "--timeline-offset-desktop": "calc(var(--timeline-guide) + 80px)",
    "--rail-desktop": "-4px",
  };

  return (
    <>
      <div
        className="relative max-w-7xl mx-auto px-0 pt-0 pb-14 overflow-x-hidden"
        style={themeVars}
      >
        <style>{`
          @media (min-width: 768px) {
            .history-wrapper {
              --year-block: var(--year-block-desktop);
              --timeline-offset: var(--timeline-offset-desktop);
              --rail: var(--rail-desktop);
            }
          }
        `}</style>

        <div
          className="pointer-events-none absolute inset-x-0 -top-8 h-20 bg-gradient-to-b from-[var(--pri-soft)] via-[var(--sec-soft)] to-transparent blur-2xl"
          aria-hidden="true"
        />

        <header className="max-w-screen-xl mx-auto px-4 pt-10">
          <p className="text-sm text-black/80">
            소개 &gt; <span className="text-black">연혁</span>
          </p>

          <h1 className="mt-3 text-3xl md:text-4xl font-extrabold tracking-tight">
            연혁
          </h1>

          {loading && (
            <p className="mt-3 text-sm text-slate-500">
              연혁 데이터를 불러오는 중입니다.
            </p>
          )}
        </header>

        <div
          className="history-wrapper relative mt-5 px-4 pr-5 md:px-0 md:pr-0 overflow-x-visible"
          style={{ paddingLeft: "var(--timeline-offset)" }}
        >
          {Object.keys(byYear)
            .sort((a, b) => b.localeCompare(a))
            .map((year) => (
              <section key={year} className="relative mb-16">
                <div
                  className="pl-1 mb-6 relative"
                  style={{ height: "var(--year-block)" }}
                >
                  <div className="absolute left-[var(--rail)] flex flex-col items-center -translate-x-0 md:-translate-x-1/2">
                    <h2 className="text-2xl md:text-3xl font-black tracking-tighter md:tracking-tight leading-none">
                      <span className="bg-gradient-to-r from-[var(--pri)] to-[var(--sec)] bg-clip-text text-transparent">
                        {year}
                      </span>
                    </h2>

                    <span className="mt-1 px-2 py-0.5 text-xs font-semibold rounded-full bg-[var(--pri-soft)] text-[var(--pri)]">
                      YEAR
                    </span>
                  </div>
                </div>

                <div className="relative flex-1 min-w-0 pl-9 md:pl-10 lg:pl-12 overflow-x-visible">
                  <div
                    className="absolute bottom-6 border-l-2 border-dashed border-[var(--pri)]/30"
                    style={{
                      left: "var(--rail)",
                      top: "calc(var(--year-block) - 28px)",
                    }}
                  />

                  <div className="space-y-6 md:space-y-8">
                    {byYear[year].map((item, i) => (
                      <div key={`${item.ym}-${i}`} className="relative">
                        <article className="relative w-full max-w-full min-w-0 bg-white/90 backdrop-blur-sm border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition overflow-visible md:overflow-hidden">
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[var(--pri)] to-[var(--sec)]" />

                          <div className="p-4 pr-6 md:p-6 max-w-full">
                            <time className="inline-block px-3 py-1 text-xs font-semibold text-[var(--pri)] bg-[var(--pri-soft)] rounded-full">
                              {item.ym}
                            </time>

                            <p
                              className="mt-2 md:mt-3 font-medium text-slate-800 leading-relaxed break-keep break-words"
                              style={{
                                overflowWrap: "anywhere",
                                wordBreak: "keep-all",
                                lineHeight: 1.6,
                              }}
                            >
                              {item.event}
                            </p>
                          </div>
                        </article>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            ))}
        </div>
      </div>
    </>
  );
}
