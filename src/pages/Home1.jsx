import { useState, useEffect, useMemo } from "react";
import matter from "gray-matter";
// src/pages/Home1.jsx
// 팔레트 (우리 브랜드 컬러로, 레퍼런스 톤을 흉내냄)
const PALETTE = {
  orange: "#ED6A32",
  yellow: "#F4B731",
  teal: "#3BA7A0",
  tealLight: "#E6F5F2",
  mintBar: "#D8F3EC",
  beige: "#FBF6EF",
  grayBg: "#F5F7FA",
  grayCard: "#FFFFFF",
  grayText: "#64748B",
  darkText: "#111827",
  line: "rgba(17, 24, 39, 0.08)",
  lineStrong: "rgba(17, 24, 39, 0.12)",
  shadowSm: "0 4px 12px rgba(0,0,0,.05)",
  shadow: "0 8px 24px rgba(0,0,0,.06)",
  radius: 16,
  radiusLg: 22,
  radiusXl: 28,
};

// ===== Utils (match Home.jsx behavior) =====
function parseDatedSlug(filepath) {
  const name = filepath.split("/").pop() || "";
  const m = name.match(/^(\d{4}-\d{2}-\d{2})-(.+)\.(md|mdx)$/);
  if (!m) {
    return {
      date: null,
      slug: name.replace(/\.(md|mdx)$/i, ""),
      titleFromFile: name.replace(/\.(md|mdx)$/i, ""),
    };
  }
  const [, date, rest] = m;
  const slug = rest
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9가-힣-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
  return { date, slug, titleFromFile: rest };
}

function formatDate(v) {
  if (!v) return "";
  try {
    if (typeof v === "string") return v.slice(0, 10);
    if (v instanceof Date && !isNaN(v)) return v.toISOString().slice(0, 10);
  } catch {}
  return "";
}

const Section = ({ children, style }) => (
  <section
    style={{
      maxWidth: 1180,
      margin: "0 auto",
      padding: "48px 20px",
      ...style,
    }}
  >
    {children}
  </section>
);

const Pill = ({ label, icon, color, onClick }) => (
  <button
    onClick={onClick}
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      padding: "10px 14px",
      borderRadius: 999,
      border: `1px solid ${PALETTE.line}`,
      background: "#fff",
      boxShadow: "0 2px 6px rgba(0,0,0,.04)",
      fontWeight: 700,
      cursor: "pointer",
    }}
  >
    <span
      aria-hidden
      style={{
        width: 28,
        height: 28,
        borderRadius: 999,
        background: color,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 14,
        color: "#fff",
      }}
    >
      {icon}
    </span>
    <span>{label}</span>
  </button>
);

const StoryCard = ({ title, date, href = "/news/stories", thumbnail }) => (
  <a href={href} style={{ textDecoration: "none", color: "inherit" }}>
    <article
      style={{
        background: "#fff",
        borderRadius: PALETTE.radiusLg,
        border: `1px solid ${PALETTE.line}`,
        boxShadow: PALETTE.shadowSm,
        overflow: "hidden",
        transition: "transform .12s ease, box-shadow .12s ease",
      }}
    >
      <div
        aria-hidden
        style={{
          height: 160,
          overflow: "hidden",
          borderBottom: `1px solid ${PALETTE.line}`,
          background: thumbnail
            ? "#fff"
            : "radial-gradient(120% 80% at 50% 20%, rgba(59,167,160,.25), rgba(237,106,50,.18))",
        }}
      >
        {thumbnail ? (
          <img
            src={thumbnail}
            alt=""
            loading="lazy"
            decoding="async"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : null}
      </div>
      <div style={{ padding: 16 }}>
        <div style={{ fontWeight: 800, lineHeight: 1.25 }}>{title}</div>
        <div style={{ color: PALETTE.grayText, fontSize: 12, marginTop: 10 }}>
          {date}
        </div>
      </div>
    </article>
  </a>
);

export default function Home1() {
  return (
    <main style={{ background: "#fff" }}>
      {/* HERO (레퍼런스형: 베이지 배경 + 좌측 반원 이미지 + 우측 텍스트) */}
      <Section style={{ paddingTop: 28, paddingBottom: 36 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.1fr 1fr",
            gap: 28,
            alignItems: "center",
            background: PALETTE.beige,
            borderRadius: PALETTE.radiusXl,
            border: `1px solid ${PALETTE.line}`,
            boxShadow: PALETTE.shadow,
            padding: 28,
          }}
        >
          {/* 좌측 반원 이미지 프레임 */}
          <div
            aria-hidden
            style={{
              height: 280,
              background:
                "linear-gradient(180deg, rgba(59,167,160,.35), rgba(244,183,49,.25))",
              borderRadius: "240px 240px 0 0",
              border: `1px solid ${PALETTE.line}`,
              boxShadow: "0 10px 24px rgba(0,0,0,.08) inset",
              overflow: "hidden",
            }}
          />

          {/* 우측 텍스트 */}
          <div>
            <h1
              style={{
                fontSize: 32,
                lineHeight: 1.35,
                margin: 0,
                letterSpacing: -0.2,
              }}
            >
              현장과 지역을 잇는 <b>맞춤형 복지</b>를 설계하며
              <br />
              <b>복지디자인 사회적협동조합</b>이
              <br />
              지역과 함께합니다.
            </h1>
            <p style={{ color: PALETTE.grayText, marginTop: 10 }}>
              주민·기관·전문가가 협력하는 맞춤형 복지 플랫폼을 설계·운영합니다.
            </p>

            {/* 캐러셀 도트 (모형) */}
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 999,
                    background: i === 0 ? PALETTE.teal : "#D1D5DB",
                    boxShadow: "0 1px 2px rgba(0,0,0,.08)",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* 빠르게가기 (민트색 스트립 + 라운드 아이콘 버튼) */}
      <div style={{ background: PALETTE.mintBar, padding: "18px 0" }}>
        <Section style={{ padding: 0 }}>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            {[
              { icon: "🏢", label: "복지디자인 소개" },
              { icon: "📌", label: "사업 안내" },
              { icon: "💝", label: "후원 안내" },
              { icon: "🤝", label: "조합 가입" },
            ].map((it, i) => (
              <button
                key={i}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 16px",
                  borderRadius: 999,
                  border: "none",
                  background: "#fff",
                  boxShadow: "0 2px 6px rgba(0,0,0,.06)",
                  fontWeight: 800,
                }}
              >
                <span
                  aria-hidden
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 999,
                    background: PALETTE.teal,
                    color: "#fff",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 14,
                  }}
                >
                  {it.icon}
                </span>
                {it.label}
              </button>
            ))}
          </div>
        </Section>
      </div>

      {/* 동행이야기(=소식) 그리드 */}
      <Section>
        {/* 좌측 설명 + 우측 리스트 레이아웃 */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "260px 1fr",
            gap: 24,
            alignItems: "start",
          }}
        >
          {/* 좌측 고정 영역 */}
          {(() => {
            const [active, setActive] = useState("전체");
            const [items, setItems] = useState([]);

            useEffect(() => {
              try {
                const modules = import.meta.glob("/src/content/stories/*.{md,mdx}", {
                  eager: true,
                  query: "?raw",
                  import: "default",
                });

                const mapped = Object.entries(modules).map(([path, raw]) => {
                  const { data } = matter(raw);
                  const meta = parseDatedSlug(path);
                  const base = (path.split("/").pop() || "").replace(/\.(md|mdx)$/i, "");
                  const rawType = (data?.category || data?.type || "기타").trim();
                  const typeMap = {
                    행사안내: "행사",
                    이벤트: "행사",
                    활동소식: "활동",
                    인터뷰: "인터뷰",
                    공탁: "공탁",
                    공조동행: "공조동행",
                  };
                  const type = typeMap[rawType] || rawType;
                  return {
                    id: path,
                    title: data?.title || meta.titleFromFile,
                    date: formatDate(data?.date) || formatDate(meta.date),
                    slug: base,
                    type,
                    thumbnail: data?.thumbnail || null,
                  };
                });

                mapped.sort((a, b) => {
                  const ad = a.date ? new Date(a.date) : new Date(0);
                  const bd = b.date ? new Date(b.date) : new Date(0);
                  if (!isNaN(bd) && !isNaN(ad) && bd.getTime() !== ad.getTime()) {
                    return bd.getTime() - ad.getTime();
                  }
                  return (b.id || "").localeCompare(a.id || "");
                });
                setItems(mapped);
              } catch (e) {
                console.warn("스토리 로드 실패:", e);
                setItems([]);
              }
            }, []);

            // 동적 탭: 데이터에 있는 카테고리로 생성 (Home.jsx와 동일 경험)
            const pills = useMemo(() => {
              const banned = new Set(["공지", "활동후기"]);
              const cats = Array.from(
                new Set(items.map((i) => i.type).filter((t) => t && !banned.has(t)))
              );
              const order = ["인터뷰", "행사", "활동", "공탁", "공조동행"]; // 선호 순서
              cats.sort((a, b) => {
                const ia = order.indexOf(a);
                const ib = order.indexOf(b);
                if (ia !== -1 && ib !== -1) return ia - ib;
                if (ia !== -1) return -1;
                if (ib !== -1) return 1;
                return a.localeCompare(b, "ko");
              });
              return ["전체", ...cats];
            }, [items]);

            const filtered = items.filter((d) => active === "전체" || d.type === active);

            return (
              <>
                <div>
                  <h2 style={{ margin: "0 0 8px 0", fontSize: 22, fontWeight: 900 }}>
                    복지디자인 이야기
                  </h2>
                  <p style={{ margin: "0 0 10px 0", color: PALETTE.grayText, fontSize: 14 }}>
                    복지디자인의 최신 소식을 전해드려요
                  </p>
                  <a
                    href="/news/stories"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      textDecoration: "none",
                      color: PALETTE.teal,
                      fontWeight: 800,
                      marginBottom: 10,
                    }}
                  >
                    더보기 <span aria-hidden>›</span>
                  </a>
                  {/* 필터 탭: 더보기 아래 세로 동그라미 */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 12,
                      marginTop: 28,
                    }}
                  >
                    {pills.map((label) => {
                      const isActive = active === label;
                      return (
                        <button
                          key={label}
                          onClick={() => setActive(label)}
                          style={{
                            cursor: "pointer",
                            width: 84,
                            height: 84,
                            borderRadius: 16,
                            border: `1px solid ${PALETTE.line}`,
                            background: isActive ? PALETTE.teal : "#fff",
                            color: isActive ? "#fff" : PALETTE.darkText,
                            fontWeight: 800,
                            boxShadow: "0 2px 6px rgba(0,0,0,.04)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            textAlign: "center",
                            lineHeight: 1.2,
                            padding: 8,
                            wordBreak: "keep-all",
                          }}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 우측: 카드 그리드 */}
                <div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(3, minmax(0,1fr))",
                      gap: 18,
                    }}
                  >
                    {filtered.slice(0, 6).map((n) => (
                      <StoryCard
                        key={n.slug}
                        title={n.title}
                        date={n.date}
                        href={`/news/stories/${encodeURIComponent(n.slug)}`}
                        thumbnail={n.thumbnail}
                      />
                    ))}
                  </div>
                </div>
              </>
            );
          })()}
        </div>
      </Section>

      {/* 중앙 CTA (베이지 톤) */}
      <Section>
        <div
          style={{
            background: PALETTE.beige,
            border: `1px solid ${PALETTE.line}`,
            borderRadius: PALETTE.radiusXl,
            boxShadow: PALETTE.shadow,
            padding: "32px 24px",
            textAlign: "center",
          }}
        >
          <div style={{ fontWeight: 900, fontSize: 22, marginBottom: 6 }}>
            지역과 함께 만드는 맞춤형 복지, 복지디자인이 앞장섭니다
          </div>
          <p style={{ color: PALETTE.grayText, margin: 0 }}>
            주민·기관·전문가가 함께 설계하는 프로그램으로 돌봄·연계·교육을
            지원합니다.
          </p>
          <div style={{ marginTop: 14 }}>
            <a
              href="#support"
              style={{
                display: "inline-block",
                padding: "12px 18px",
                borderRadius: 999,
                background: PALETTE.teal,
                color: "#fff",
                fontWeight: 900,
                textDecoration: "none",
                boxShadow: "0 8px 18px rgba(59,167,160,.28)",
              }}
            >
              후원 안내 보기
            </a>
          </div>
        </div>
      </Section>

      {/* 지원사업 영역 (민트 아이콘 타일) */}
      <Section id="support" style={{ paddingTop: 0 }}>
        <h2 style={{ margin: "0 0 16px 0", fontSize: 22, fontWeight: 900 }}>
          지원사업 영역
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0,1fr))",
            gap: 16,
          }}
        >
          {[
            { icon: "🤝", label: "휠체어 및 복지용구 무료 대여" },
            { icon: "🏘️", label: "보조기기·복지용구 신청 안내 지원" },
            { icon: "🏥", label: "보조기기 기증 캠페인" },
            { icon: "🧭", label: "취약 계층 전동 휠체어 보험금 지원" },
            { icon: "🎓", label: "취약 계층 복지욕구 실태조사" },
            { icon: "📊", label: "조합원 지원 서비스" },
          ].map((it, i) => (
            <div
              key={i}
              style={{
                background: PALETTE.teal,
                color: "#fff",
                borderRadius: PALETTE.radiusLg,
                padding: 20,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                boxShadow: "0 8px 18px rgba(59,167,160,.25)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  aria-hidden
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: "rgba(255,255,255,.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 22,
                  }}
                >
                  {it.icon}
                </div>
                <div style={{ fontWeight: 900 }}>{it.label}</div>
              </div>
              <span style={{ opacity: 0.9, fontSize: 12 }}>바로가기 ›</span>
            </div>
          ))}
        </div>
      </Section>

      {/* 공지/뉴스/연구 (3열 + 중앙 세로 라인) */}
      <Section style={{ paddingTop: 12 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 2fr 1fr",
            gap: 24,
            alignItems: "start",
          }}
        >
          {/* 공지 */}
          <div>
            <div style={{ fontWeight: 900, marginBottom: 12 }}>공지사항</div>
            <div style={{ display: "grid", gap: 10 }}>
              {[
                "[공지] 9월 운영위원회 회의 안내",
                "복지디자인 소개 자료 공개",
                "후원·가입 안내 페이지 개편",
                "지역 파트너 기관 모집 공고",
              ].map((t, i) => (
                <div
                  key={i}
                  style={{
                    background: "#fff",
                    border: `1px solid ${PALETTE.line}`,
                    borderRadius: 12,
                    padding: "14px 16px",
                    boxShadow: PALETTE.shadowSm,
                  }}
                >
                  <div style={{ fontWeight: 700 }}>{t}</div>
                  <div
                    style={{
                      color: PALETTE.grayText,
                      fontSize: 12,
                      marginTop: 4,
                    }}
                  >
                    2025-09-{28 - i}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 뉴스레터 */}
          <div style={{ position: "relative" }}>
            <div style={{ fontWeight: 900, marginBottom: 12 }}>소식</div>
            <div style={{ display: "grid", gap: 10 }}>
              {[
                "현장 리포트: 주민과 함께한 설계 워크숍",
                "사업 안내 설명회 — 다시보기 공개",
                "복지시설 운영사례 인터뷰",
                "데이터 기반 복지 리서치 노트",
              ].map((t, i) => (
                <div
                  key={i}
                  style={{
                    background: "#fff",
                    border: `1px solid ${PALETTE.line}`,
                    borderRadius: 12,
                    padding: "14px 16px",
                    boxShadow: PALETTE.shadowSm,
                  }}
                >
                  <div style={{ fontWeight: 700 }}>{t}</div>
                  <div
                    style={{
                      color: PALETTE.grayText,
                      fontSize: 12,
                      marginTop: 4,
                    }}
                  >
                    2025-09-{22 - i}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>
      {/* 바닥 간격 */}
      <div style={{ height: 36 }} />
    </main>
  );
}
