// src/pages/about/People.jsx
export default function AboutPeople() {
  return (
    <div className="bg-white">
      {/* 헤더 */}
      <header className="max-w-screen-xl mx-auto px-4 pt-10">
        <p className="text-sm text-gray-500">
          소개 &gt; <span className="text-gray-700">함께하는 사람들</span>
        </p>
        <h1 className="mt-3 text-3xl md:text-4xl font-extrabold tracking-tight">
          함께하는 사람들
        </h1>
        <p className="mt-2 text-gray-600">조직도 수정 필요</p>
      </header>

      {/* 조직도 */}
      <section className="max-w-screen-xl mx-auto px-4 py-10">
        <OrgChart />
      </section>

      {/* 플랫폼별 주요 역할 (복구) */}
      <section className="max-w-screen-xl mx-auto px-4 pb-16">
        <h2 className="text-xl font-bold mb-6">플랫폼별 주요 역할</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <Card title="복지연결플랫폼" badge="Platform">
            <Li>보조기기 및 복지용구 기증·수리·재분배 시스템 구축</Li>
            <Li>전동휠체어 이용자 대상 보험 지원 서비스</Li>
            <Li>복지정보 제공 및 복지 신청 지원 서비스</Li>
            <Li>지역사회 복지 연계·제고 및 통합 프로그램 운영</Li>
          </Card>
          <Card title="복지디자인연구소" badge="Lab">
            <Li>취약계층 서비스 연구 및 개발</Li>
            <Li>복지 인력 및 주민 대상 교육·콘텐츠 기획·운영</Li>
            <Li>복지 관련 출판물 제작·배포</Li>
            <Li>복지모델 컨설팅</Li>
          </Card>
          <Card title="협력운영플랫폼" badge="Ops">
            <Li>조합원과 직원에 대한 상담·교육</Li>
            <Li>육·훈련 및 정보제공 사업</Li>
            <Li>조합 간 협력을 위한 사업</Li>
            <Li>조합 홍보 및 지역사회와의 협력</Li>
          </Card>
        </div>
      </section>
    </div>
  );
}

/* =============== 조직도 =============== */
function OrgChart() {
  return (
    <div className="relative mx-auto w-full max-w-5xl">
      <div className="flex flex-col items-center">
        {/* 세로 축: 총회 -> 이사회 -> 이사장 */}
        <Node label="조합원총회" />
        <VLine h={28} />
        <Node label="이사회" />
        <VLine h={28} />

        {/* 이사장 */}
        <div className="relative w-full">
          <div className="flex justify-center">
            <Node label="이사장" />
          </div>

          {/* 이사장 아래 수직선 */}
          <div
            className="absolute left-1/2 -translate-x-1/2 w-px bg-gray-300"
            style={{ top: 64, height: 24 }}
          />

          {/* 메인 가로 버스라인 */}
          <div
            className="absolute left-0 right-0"
            style={{ top: 88, height: 1 }}
          >
            <div className="h-px w-full bg-gray-300" />
          </div>

          {/* 버스라인에서 노드로 내려가는 수직선들 */}
          {/* 감사(좌측) */}
          <div
            className="absolute -translate-x-1/2 w-px bg-gray-300"
            style={{ left: "12%", top: 88, height: 24 }}
          />
          {/* 사무국(중앙) */}
          <div
            className="absolute left-1/2 -translate-x-1/2 w-px bg-gray-300"
            style={{ top: 88, height: 24 }}
          />
        </div>

        {/* 감사 · 사무국 */}
        <div className="grid grid-cols-3 items-start w-full pt-[120px]">
          <div className="flex justify-start pl-4">
            <Node label="감사" small />
          </div>
          <div className="flex justify-center">
            <Node label="사무국" />
          </div>
          <div />
        </div>
      </div>
    </div>
  );
}

/* =============== UI 부품 =============== */
function Node({ label, small = false }) {
  return (
    <div
      className={[
        "rounded-lg border bg-white shadow-sm ring-1 ring-gray-200",
        "px-4",
        small ? "py-1 text-sm" : "py-2",
        "min-w-[140px] text-center font-medium",
      ].join(" ")}
    >
      {label}
    </div>
  );
}
function VLine({ h = 16 }) {
  return <div style={{ height: h }} className="w-px bg-gray-300 mx-auto" />;
}

function Card({ title, children, badge }) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <div className="mb-2 flex items-center gap-2">
        <h3 className="text-lg font-semibold">{title}</h3>
        {badge ? (
          <span className="rounded-full border px-2 py-0.5 text-xs text-gray-600">
            {badge}
          </span>
        ) : null}
      </div>
      <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
        {children}
      </ul>
    </div>
  );
}
function Li({ children }) {
  return <li>{children}</li>;
}
