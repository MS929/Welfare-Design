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
              공익활동가 긴급의료비 지원사업
              <br />
              <b>(상시공모)</b>
            </h1>
            <p style={{ color: PALETTE.grayText, marginTop: 10 }}>
              갑작스러운 의료비로 인한 경제적 부담을 줄일 수 있도록
              <br />
              상시 접수합니다. 신청 대상 및 절차를 확인하세요.
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
              { icon: "📄", label: "사업안내" },
              { icon: "❤️", label: "후원" },
              { icon: "🤝", label: "조합가입" },
              { icon: "🏢", label: "협력기관" },
              { icon: "ℹ️", label: "문의" },
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
            "나와 동행 우리동네, 함께 만든 2025년 상반기 복지지도",
            "내 2025 라면한그릇 자리 ‘일명복’ 3회차 — 생활 속의 연대",
            "복지연계 처리량을 한 번에! 오픈 워크플로 발표",
            "공동체 회복 프로젝트 – 카드뉴스 2편",
            "현장 리더가 말하는 ‘업무와 삶’ 밸런스",
            "데이터로 보는 지역 복지 격차",
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
            공익활동가의 지속가능한 활동과 존중받는 삶을 위한 안전망
          </div>
          <p style={{ color: PALETTE.grayText, margin: 0 }}>
            의료·상담·주거 등 실질적 지원으로 지역 공동체의 회복탄력성을 키웁니다.
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
              후원·가입 안내 보기
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
            { icon: "🧰", label: "상생부조" },
            { icon: "💳", label: "대출지원" },
            { icon: "🏥", label: "건강의료 지원" },
            { icon: "📦", label: "재충전 지원" },
            { icon: "🧑‍🏫", label: "전문역량 지원" },
            { icon: "🎯", label: "대상별 맞춤 지원" },
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
            <div style={{ fontWeight: 900, marginBottom: 12 }}>공지/공모</div>
            <div style={{ display: "grid", gap: 10 }}>
              {[
                "2025 하반기 소액대출사업(∼9/14) 안내",
                "2025 활동가 리더십 커뮤니티 모집",
                "기부자 감사 행사 안내(∼9/10)",
                "신규기관 라운드테이블 참가 안내(∼9/7)",
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
                  <div style={{ color: PALETTE.grayText, fontSize: 12, marginTop: 4 }}>
                    2025-09-{28 - i}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 뉴스레터 */}
          <div style={{ position: "relative" }}>
            <div style={{ fontWeight: 900, marginBottom: 12 }}>뉴스레터</div>
            <div style={{ display: "grid", gap: 10 }}>
              {[
                "상반기 협력 성과, 함께 만든 2025년",
                "가까운 거리의 복지: 활동가 스토리",
                "데이터로 설계하는 복지",
                "조합원 인터뷰 – 일과 삶의 조화",
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
                  <div style={{ color: PALETTE.grayText, fontSize: 12, marginTop: 4 }}>
                    2025-09-{22 - i}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 연구 */}
          <div>
            <div style={{ fontWeight: 900, marginBottom: 12 }}>연구</div>
            <div
              style={{
                background: "#fff",
                border: `1px solid ${PALETTE.lineStrong}`,
                borderRadius: 16,
                padding: 16,
                boxShadow: PALETTE.shadowSm,
              }}
            >
              <div
                aria-hidden
                style={{
                  height: 160,
                  borderRadius: 12,
                  background:
                    "conic-gradient(from 180deg at 50% 50%, rgba(237,106,50,.25), rgba(244,183,49,.25), rgba(59,167,160,.25))",
                  marginBottom: 12,
                }}
              />
              <div style={{ fontWeight: 800 }}>
                연구: 복지디자인 발전 2025 – 지역 자원 연계 분석
              </div>
              <div style={{ color: PALETTE.grayText, fontSize: 12, marginTop: 6 }}>
                2025-09-18
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* 구독 안내 스트립 */}
      <div style={{ background: PALETTE.mintBar, padding: "18px 0" }}>
        <Section style={{ padding: 0 }}>
          <div
            style={{
              background: "#fff",
              borderRadius: 999,
              padding: "12px 18px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              border: `1px solid ${PALETTE.line}`,
              boxShadow: "0 4px 10px rgba(0,0,0,.06)",
            }}
          >
            <span style={{ fontWeight: 800, color: PALETTE.darkText }}>
              동행형 활동과 지원소식! 뉴스레터를 받아보세요.
            </span>
            <a
              href="#newsletter"
              style={{
                background: PALETTE.teal,
                color: "#fff",
                padding: "10px 16px",
                borderRadius: 10,
                textDecoration: "none",
                fontWeight: 900,
              }}
            >
              구독 신청하기
            </a>
          </div>
        </Section>
      </div>

      {/* 바닥 간격 */}
      <div style={{ height: 36 }} />
    </main>
  );
}
