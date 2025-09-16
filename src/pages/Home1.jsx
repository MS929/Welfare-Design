import React from "react";

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

const StoryCard = ({ title, date }) => (
  <article
    style={{
      background: "#fff",
      borderRadius: PALETTE.radiusLg,
      border: `1px solid ${PALETTE.line}`,
      boxShadow: PALETTE.shadowSm,
      overflow: "hidden",
    }}
  >
    <div
      aria-hidden
      style={{
        height: 160,
        background:
          "radial-gradient(120% 80% at 50% 20%, rgba(59,167,160,.25), rgba(237,106,50,.18))",
        borderBottom: `1px solid ${PALETTE.line}`,
      }}
    />
    <div style={{ padding: 16 }}>
      <div style={{ fontWeight: 800, lineHeight: 1.25 }}>{title}</div>
      <div style={{ color: PALETTE.grayText, fontSize: 12, marginTop: 10 }}>
        {date}
      </div>
    </div>
  </article>
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
        <h2 style={{ margin: "0 0 16px 0", fontSize: 22 }}>복지디자인 소식</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0,1fr))",
            gap: 18,
          }}
        >
          {[
            "복지디자인 소개 세미나 — 우리 지역 맞춤형 복지",
            "지역사회 복지사업 설명회(2차) 개최",
            "복지동행 운영사업: 주민 협력 라운드테이블",
            "복지시설 네트워크 교류회 스냅샷",
            "데이터 기반 복지 설계 파일럿 보고",
            "후원자 이야기 — 함께 만든 변화",
          ].map((t, i) => (
            <StoryCard key={i} title={t} date={`2025-09-${12 - i}`} />
          ))}
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
