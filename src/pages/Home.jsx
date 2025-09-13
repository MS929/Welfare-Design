// src/pages/Home.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import ShortcutButtons from "../components/ShortcutButtons";
import NewsSection from "../components/NewsSection";

export default function Home() {
  const [noticeTab, setNoticeTab] = useState("공지");

  const tabs = ["공지", "채용", "교육", "자료", "기타"];
  const tabItems = {
    공지: [
      { id: 1, title: "2024년 정기 총회 안내", date: "2024.05.10", to: "/notices/2024-regular-meeting" },
      { id: 2, title: "복지디자인 사회적협동조합 신규 서비스 출시", date: "2024.04.20", to: "/notices/new-service-launch" },
      { id: 3, title: "2024년 상반기 운영 일정 공지", date: "2024.03.15", to: "/notices/first-half-schedule" },
    ],
    채용: [
      { id: 11, title: "사회복지사 채용 공고", date: "2024.05.01", to: "/notices/welfare-worker-recruitment" },
      { id: 12, title: "프로그램 코디네이터 채용", date: "2024.04.10", to: "/notices/program-coordinator-recruitment" },
      { id: 13, title: "홍보/디자인 인턴 모집", date: "2024.03.25", to: "/notices/pr-design-internship" },
    ],
    교육: [
      { id: 21, title: "복지디자인 전문가 양성 교육 1기 모집", date: "2024.05.05", to: "/stories/welfare-design-training" },
      { id: 22, title: "보조기기 안전교육 안내", date: "2024.04.15", to: "/stories/assistive-device-safety" },
      { id: 23, title: "케어기술 업스킬 워크숍 개최", date: "2024.03.30", to: "/stories/care-skill-workshop" },
    ],
    자료: [
      { id: 31, title: "2023년 연간 보고서 요약본", date: "2024.02.28", to: "/newsletters/2023-annual-report" },
      { id: 32, title: "복지디자인 정관 및 규정 모음", date: "2024.01.15", to: "/newsletters/statutes-and-regulations" },
      { id: 33, title: "홍보 키트 다운로드", date: "2023.12.10", to: "/newsletters/promo-kit" },
    ],
    기타: [
      { id: 41, title: "여름 휴무 안내", date: "2024.07.01", to: "/notices/summer-holiday" },
      { id: 42, title: "추석 명절 운영 안내", date: "2024.09.10", to: "/notices/chuseok-operation" },
      { id: 43, title: "분실물 센터 운영 안내", date: "2024.06.20", to: "/notices/lost-and-found" },
    ],
  };

  return (
    <main>
      {/* 0) 상단 간격 */}
      <div style={{ height: 8 }} />

      {/* 1) HERO – 좌 텍스트/우 이미지 */}
      <section
        aria-label="메인 히어로"
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 16px",
          marginBottom: 40,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.1fr 1fr",
            gap: 24,
            alignItems: "center",
          }}
        >
          {/* 왼쪽 – 카피 + 4개 원형 바로가기 */}
          <div>
            <p style={{ fontSize: 28, lineHeight: 1.5, margin: 0, fontWeight: 700 }}>
              복지 사각지대 없는 사회
              <br />
              <span style={{ color: "#0ea5e9" }}>복지디자인 사회적협동조합</span>이 함께
              <br />
              만들어갑니다.
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 80px)",
                gap: 16,
                marginTop: 20,
              }}
            >
              {[
                { label: "조합원 지원", to: "/support" },
                { label: "사회공헌", to: "/business" },
                { label: "지정기탁", to: "/support" },
                { label: "운영소식", to: "/news" },
              ].map((b) => (
                <Link
                  key={b.label}
                  to={b.to}
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    display: "grid",
                    placeItems: "center",
                    textDecoration: "none",
                    color: "#333",
                    border: "1px solid #eee",
                    background: "#fff",
                  }}
                >
                  <span style={{ fontSize: 12, textAlign: "center" }}>{b.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* 오른쪽 – 이미지/슬라이더 자리 (기존 Slider 사용) */}
          <div style={{ borderRadius: 12, overflow: "hidden" }}>
            <img src="/images/main-hero-1.png" alt="메인 히어로" style={{ width: "100%", height: "auto" }} />
          </div>
        </div>
      </section>

      {/* 2) 공지사항 – 탭형 */}
      <section
        aria-labelledby="notice-heading"
        style={{ maxWidth: 1200, margin: "0 auto", padding: "0 16px", marginBottom: 40 }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h2 id="notice-heading" style={{ fontSize: 20, fontWeight: 700 }}>공지사항</h2>
          <div style={{ display: "flex", gap: 8 }}>
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => setNoticeTab(t)}
                style={{
                  padding: "6px 10px",
                  borderRadius: 999,
                  border: noticeTab === t ? "1px solid #0ea5e9" : "1px solid #e6e6e6",
                  background: noticeTab === t ? "#e6f7ff" : "#fff",
                  color: "#333",
                  cursor: "pointer",
                }}
              >
                {t}
              </button>
            ))}
            <Link to="/news" style={{ fontSize: 14, color: "#2a7ae4", marginLeft: 8 }}>더 보기</Link>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: 16,
          }}
        >
          {tabItems[noticeTab].map((item) => (
            <article key={item.id} style={{ border: "1px solid #eee", borderRadius: 8, padding: 16 }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>
                <Link to={item.to} style={{ color: "inherit", textDecoration: "none" }}>
                  {item.title}
                </Link>
              </h3>
              <time style={{ fontSize: 12, color: "#999" }}>{item.date}</time>
            </article>
          ))}
        </div>
      </section>

      {/* 3) 바로가기 카드 – 유지 */}
      <section aria-label="바로가기" style={{ marginBottom: 40 }}>
        <ShortcutButtons />
      </section>

      {/* 4) 가입/후원/문의 CTA 박스 */}
      <section
        aria-label="가입/후원/문의"
        style={{ maxWidth: 1200, margin: "0 auto", padding: "0 16px", marginBottom: 40 }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: 16,
          }}
        >
          <Link
            to="/support"
            style={{
              display: "block",
              border: "1px solid #eaeaea",
              borderRadius: 12,
              padding: 20,
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <strong style={{ display: "block", marginBottom: 8 }}>조합 가입 신청하기</strong>
            <span style={{ fontSize: 14, color: "#666" }}>복지디자인의 미션에 함께해주세요.</span>
          </Link>

          <Link
            to="/support"
            style={{
              display: "block",
              border: "1px solid #eaeaea",
              borderRadius: 12,
              padding: 20,
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <strong style={{ display: "block", marginBottom: 8 }}>후원 가입 신청하기</strong>
            <span style={{ fontSize: 14, color: "#666" }}>지속적 관심과 지지를 부탁드립니다.</span>
          </Link>

          <a
            href="mailto:welfarecoop@naver.com"
            style={{
              display: "block",
              border: "1px solid #eaeaea",
              borderRadius: 12,
              padding: 20,
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <strong style={{ display: "block", marginBottom: 8 }}>이메일로 문의하기</strong>
            <span style={{ fontSize: 14, color: "#666" }}>궁금하신 사항이 있으시면 메일을 보내주세요.</span>
          </a>
        </div>
      </section>

      {/* 5) 소식 섹션 – 기존 컴포넌트 */}
      <section aria-label="소식" style={{ marginBottom: 48 }}>
        <NewsSection />
      </section>

      {/* 6) 파트너 로고 스트립 */}
      <section
        aria-label="파트너"
        style={{
          background: "#fafafa",
          borderTop: "1px solid #f0f0f0",
          borderBottom: "1px solid #f0f0f0",
          padding: "16px 0",
          marginBottom: 32,
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 16px" }}>
          <ul
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
              gap: 16,
              listStyle: "none",
              padding: 0,
              margin: 0,
              alignItems: "center",
              justifyItems: "center",
            }}
          >
            {["보건복지부", "사회적협동조합연합회", "충남사회적경제", "광주사회적경제", "복지특화"].map(
              (name) => (
                <li key={name} style={{ fontSize: 13, color: "#888" }}>{name}</li>
              )
            )}
          </ul>
        </div>
      </section>
    </main>
  );
}
