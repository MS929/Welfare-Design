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
        <p className="mt-2 text-gray-600">
          조직도 역할을 간단히 소개합니다. (디자인은 추후 변동)
        </p>
      </header>

      {/* ===== 조직도 ===== */}
      <section className="max-w-screen-xl mx-auto px-4 py-10">
        <OrgChart />
      </section>

      {/* ===== 플랫폼별 설명 카드 ===== */}
      <section className="max-w-screen-xl mx-auto px-4 pb-10">
        <PlatformCards />
      </section>

      {/* ===== 구성 및 업무 표 ===== */}
      <section className="max-w-screen-xl mx-auto px-4 pb-16">
        <DutiesTable />
      </section>
    </div>
  );
}

/* ================== 조직도 ================== */
function OrgChart() {
  return (
    <div className="relative mx-auto w-full max-w-5xl">
      {/* 위 세로 축: 조합원총회 -> 이사회 -> 이사장 */}
      <div className="flex flex-col items-center">
        <Node label="조합원총회" />
        <VLine h={24} />
        <Node label="이사회" />
        <VLine h={24} />
        <Node label="이사장" />

        {/* 가로 라인 + 분기(감사/사무국) */}
        <div className="relative w-full mt-6">
          {/* 이사장에서 가로 라인까지 내려오는 세로 */}
          <div className="absolute left-1/2 -translate-x-1/2 -top-6 w-px h-6 bg-gray-300" />

          {/* 전체 가로 라인 */}
          <div className="h-px w-full bg-gray-300" />

          {/* 좌측 ‘감사’ 위로 올라가는 라인 + 박스 */}
          <div className="absolute left-[20%] -translate-x-1/2 -top-10">
            <Node label="감사" small />
          </div>
          <div className="absolute left-[20%] -translate-x-1/2 -top-10 w-px h-10 bg-gray-300" />

          {/* 중앙 ‘사무국’ 내려가는 라인 + 박스 */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 w-px h-12 bg-gray-300" />
          <div className="pt-12 flex justify-center">
            <Node label="사무국" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================== 플랫폼 카드 ================== */
function PlatformCards() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      <Card title="복지연결플랫폼">
        <Ul>
          <Li>보조기기 및 복지용구 기증·수리·재분배 시스템 구축</Li>
          <Li>전동휠체어 이용자 대상 보험 지원 서비스</Li>
          <Li>복지정보 제공 및 복지 신청 지원 서비스</Li>
          <Li>지역사회 복지 연계·제고 및 통합 프로그램 운영</Li>
        </Ul>
      </Card>

      <Card title="복지디자인연구소">
        <Ul>
          <Li>취약계층 서비스 연구 및 개발</Li>
          <Li>복지 인력 및 주민 대상 교육 콘텐츠 기획·운영</Li>
          <Li>복지 관련 출판물 제작·배포</Li>
          <Li>복지모델 컨설팅</Li>
        </Ul>
      </Card>

      <Card title="협력운영플랫폼">
        <Ul>
          <Li>조합원과 직원에 대한 상담·교육</Li>
          <Li>육·훈련 및 정보제공 사업</Li>
          <Li>조합 간 협력을 위한 사업</Li>
          <Li>조합의 홍보 및 지역사회를 위한 사업</Li>
        </Ul>
      </Card>
    </div>
  );
}

/* ================== 구성 및 업무 표 ================== */
function DutiesTable() {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-50 text-gray-700">
          <tr>
            <Th>구분</Th>
            <Th>업무</Th>
          </tr>
        </thead>
        <tbody className="divide-y">
          <tr>
            <Td className="whitespace-nowrap font-semibold">조합원총회</Td>
            <Td>모든 조합원이 참가하는 최고의 의사결정기구</Td>
          </tr>
          <tr>
            <Td className="whitespace-nowrap font-semibold">이사회(이사장)</Td>
            <Td>조합의 사무를 총괄·관장하며 대외적 대표직을 수행함</Td>
          </tr>
          <tr>
            <Td className="whitespace-nowrap font-semibold">
              사무국(조합이사)
            </Td>
            <Td>각 플랫폼을 실행하는 실무 주체</Td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

/* ================== 작은 부품 ================== */
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
function Card({ title, children }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <h3 className="text-base font-bold mb-3">{title}</h3>
      {children}
    </div>
  );
}
function Ul({ children }) {
  return <ul className="space-y-2 text-sm text-gray-700">{children}</ul>;
}
function Li({ children }) {
  return (
    <li className="flex gap-2">
      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-gray-400" />
      <span>{children}</span>
    </li>
  );
}
function Th({ children }) {
  return <th className="px-4 py-3 text-sm font-medium border-b">{children}</th>;
}
function Td({ children, className = "" }) {
  return <td className={`px-4 py-3 text-sm ${className}`}>{children}</td>;
}
