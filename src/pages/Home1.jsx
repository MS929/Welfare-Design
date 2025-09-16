import React from "react";

// 로컬 팔레트 (프로젝트 색과 유사하게)
const PALETTE = {
  orange: "#ED6A32",
  yellow: "#F4B731",
  teal: "#3BA7A0",
  grayBg: "#F5F7FA",
  grayCard: "#FFFFFF",
  grayText: "#6B7280",
  line: "rgba(17, 24, 39, 0.08)",
  shadow: "0 8px 24px rgba(0,0,0,.06)",
  radius: 16,
  radiusLg: 22,
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

const Card = ({ title, desc, date }) => (
  <div
    role="article"
    style={{
      background: PALETTE.grayCard,
      borderRadius: PALETTE.radius,
      border: `1px solid ${PALETTE.line}`,
      boxShadow: "0 6px 16px rgba(0,0,0,.05)",
      padding: 18,
    }}
  >
    <div
      aria-hidden
      style={{
        background:
          "linear-gradient(135deg, rgba(59,167,160,.12), rgba(237,106,50,.12))",
        height: 140,
        borderRadius: PALETTE.radius,
        marginBottom: 12,
      }}
    />
    <div style={{ fontWeight: 800, fontSize: 16, lineHeight: 1.2 }}>
      {title}
    </div>
    {desc && (
      <div style={{ color: PALETTE.grayText, marginTop: 6, fontSize: 13 }}>
        {desc}
      </div>
    )}
    {date && (
      <div style={{ color: PALETTE.grayText, marginTop: 10, fontSize: 12 }}>
        {date}
      </div>
    )}
  </div>
);

export default function Home1() {
  return (
    <main style={{ background: "#fff" }}>
      {/* HERO */}
      <Section style={{ paddingTop: 32, paddingBottom: 40 }}>
        <div
          style={{
            background: PALETTE.grayBg,
            borderRadius: PALETTE.radiusLg,
            border: `1px solid ${PALETTE.line}`,
            boxShadow: PALETTE.shadow,
            padding: 28,
            display: "grid",
            gridTemplateColumns: "1.2fr 1fr",
            gap: 18,
            alignItems: "center",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: 40,
                lineHeight: 1.18,
                margin: 0,
                letterSpacing: -0.3,
              }}
            >
              현장과 지역을 잇는{" "}
              <b>맞춤형 복지를 설계</b>하며
              <br />
              <b>복지디자인 사회적협동조합</b>이
              <br />
              지역과 함께합니다.
            </h1>
            <p style={{ color: PALETTE.grayText, marginTop: 12 }}>
              주민·기관·전문가가 협력하는 맞춤형 복지 플랫폼을 설계·운영합니다.
            </p>

            {/* 퀵 액션 */}
            <div style={{ marginTop: 18, display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Pill label="사업 안내" icon="📌" color={PALETTE.teal} />
              <Pill label="후원 하기" icon="💝" color={PALETTE.orange} />
              <Pill label="조합 가입" icon="🤝" color={PALETTE.yellow} />
              <Pill label="문의" icon="💬" color={PALETTE.teal} />
            </div>
          </div>

          {/* Hero 이미지 데코 */}
          <div
            aria-hidden
            style={{
              borderRadius: PALETTE.radiusLg,
              height: 260,
              border: `1px solid ${PALETTE.line}`,
              background:
                "radial-gradient(100% 100% at 50% 40%, rgba(59,167,160,.15), rgba(244,183,49,.08) 60%, rgba(237,106,50,.12) 100%)",
              boxShadow: PALETTE.shadow,
            }}
          />
        </div>
      </Section>

      {/* 소식 그리드 */}
      <Section style={{ paddingTop: 8 }}>
        <h2 style={{ margin: "0 0 16px 0", fontSize: 22 }}>복지디자인 소식</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0,1fr))",
            gap: 16,
          }}
        >
          {[
            {
              title: "우리 동네 복지 자원지도를 업데이트했어요",
              date: "2025-09-12",
            },
            {
              title: "지역사회 돌봄 프로젝트 2차 공모",
              date: "2025-09-10",
            },
            {
              title: "복지시설 네트워크 라운드테이블",
              date: "2025-09-08",
            },
            {
              title: "취약계층 주거환경 개선 캠페인",
              date: "2025-09-05",
            },
            {
              title: "마을복지 활동가 아카데미 1기 모집",
              date: "2025-09-04",
            },
            {
              title: "복지디자인 분과모임 – 데이터 기반 복지",
              date: "2025-09-02",
            },
          ].map((n, i) => (
            <Card key={i} title={n.title} date={n.date} />
          ))}
        </div>
      </Section>

      {/* 중앙 CTA */}
      <Section>
        <div
          style={{
            background: "#FFFBF3",
            border: `1px solid ${PALETTE.line}`,
            borderRadius: PALETTE.radiusLg,
            boxShadow: PALETTE.shadow,
            padding: "28px 20px",
            textAlign: "center",
          }}
        >
          <div style={{ fontWeight: 900, fontSize: 20, marginBottom: 8 }}>
            공익활동가의 지속가능한 활동과 존중받는 삶을 위한 안전망
          </div>
          <p style={{ color: PALETTE.grayText, margin: 0 }}>
            활동가 의료·상담·주거 등 실질적 지원을 통해 지역 공동체의 회복탄력성을 키웁니다.
          </p>
          <div style={{ marginTop: 14 }}>
            <a
              href="#support"
              style={{
                display: "inline-block",
                padding: "10px 16px",
                borderRadius: 10,
                background: PALETTE.teal,
                color: "#fff",
                fontWeight: 800,
                textDecoration: "none",
                boxShadow: "0 6px 12px rgba(59,167,160,.28)",
              }}
            >
              후원·가입 안내 보기
            </a>
          </div>
        </div>
      </Section>

      {/* 지원사업 영역 */}
      <Section id="support" style={{ paddingTop: 0 }}>
        <h2 style={{ margin: "0 0 16px 0", fontSize: 22 }}>지원사업 영역</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0,1fr))",
            gap: 16,
          }}
        >
          {[
            { icon: "🏥", label: "긴급의료 지원", color: PALETTE.teal },
            { icon: "🧾", label: "대출지원", color: PALETTE.orange },
            { icon: "🧠", label: "전문상담", color: PALETTE.yellow },
            { icon: "🏠", label: "주거 지원", color: PALETTE.teal },
            { icon: "🧑‍🏫", label: "역량 강화", color: PALETTE.orange },
            { icon: "🎯", label: "맞춤형 연계", color: PALETTE.yellow },
          ].map((it, i) => (
            <div
              key={i}
              style={{
                background: "#fff",
                border: `1px solid ${PALETTE.line}`,
                borderRadius: PALETTE.radiusLg,
                padding: 18,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                boxShadow: "0 6px 16px rgba(0,0,0,.05)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: it.color,
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 22,
                  }}
                  aria-hidden
                >
                  {it.icon}
                </div>
                <div style={{ fontWeight: 800 }}>{it.label}</div>
              </div>
              <span style={{ color: PALETTE.grayText, fontSize: 12 }}>바로가기 ›</span>
            </div>
          ))}
        </div>
      </Section>

      {/* 공지/뉴스/연구 */}
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
            <div style={{ fontWeight: 900, marginBottom: 10 }}>공지/공모</div>
            <div style={{ display: "grid", gap: 10 }}>
              {[
                "2025 하반기 소액대출사업(∼9/14) 안내",
                "2025 활동가 리더십 커뮤니티 모집",
                "기부자 감사 행사 안내(∼9/10)",
              ].map((t, i) => (
                <div
                  key={i}
                  style={{
                    background: "#fff",
                    border: `1px solid ${PALETTE.line}`,
                    borderRadius: 12,
                    padding: "14px 16px",
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
          <div>
            <div style={{ fontWeight: 900, marginBottom: 10 }}>뉴스레터</div>
            <div style={{ display: "grid", gap: 10 }}>
              {[
                "우리 동네 협력: 함께 만든 2025년 상반기",
                "활동가 스토리: 가까운 거리의 복지",
                "프로젝트 스냅샷: 데이터로 설계하는 복지",
              ].map((t, i) => (
                <div
                  key={i}
                  style={{
                    background: "#fff",
                    border: `1px solid ${PALETTE.line}`,
                    borderRadius: 12,
                    padding: "14px 16px",
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
            <div style={{ fontWeight: 900, marginBottom: 10 }}>연구</div>
            <div
              style={{
                background: "#fff",
                border: `1px solid ${PALETTE.line}`,
                borderRadius: 16,
                padding: 16,
              }}
            >
              <div
                aria-hidden
                style={{
                  height: 140,
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

      {/* 바닥 간격 */}
      <div style={{ height: 36 }} />
    </main>
  );
}
