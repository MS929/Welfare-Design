// src/pages/about/People.jsx
export default function AboutPeople() {
  return (
    <div className="bg-white">
      {/* 헤더 */}
      <header className="max-w-screen-xl mx-auto px-4 lg:px-0 pt-10">
        <p className="text-sm text-gray-500">
          소개 &gt; <span className="text-gray-700">함께하는 사람들</span>
        </p>
        <h1 className="mt-3 text-3xl md:text-4xl font-extrabold tracking-tight">
          함께하는 사람들
        </h1>
        <p className="mt-2 text-gray-600">
          조직도 및 업무 (표 없이 조직도만 표시)
        </p>
      </header>

      {/* ===== 조직도 섹션 ===== */}
      <section className="max-w-screen-xl mx-auto px-4 lg:px-0 py-10">
        <OrgChart />
      </section>
    </div>
  );
}

/* ================= 조직도 ================= */

function OrgChart() {
  return (
    <div className="relative mx-auto w-full max-w-5xl">
      {/* 수직: 총회 → 이사회 → 이사장 */}
      <div className="flex flex-col items-center">
        <Node label="조합원총회" />
        <VLine h={24} />
        <Node label="이사회" />
        <VLine h={24} />
        <Node label="이사장" />

        {/* 기준 수평 라인 */}
        <VLine h={24} />
        <div className="relative w-full">
          <div className="h-px bg-gray-300 w-full" />
          {/* 감사/사무국으로 내려가는 세로선 */}
          <div className="absolute left-[14%] -top-3 w-px h-16 bg-gray-300" />
          <div className="absolute left-1/2 -translate-x-1/2 -top-3 w-px h-16 bg-gray-300" />
        </div>

        {/* 감사 & 사무국 노드 */}
        <div className="relative w-full mt-6">
          <div className="absolute left-[10%]">
            <Node label="감사" small />
          </div>
          <div className="absolute left-1/2 -translate-x-1/2">
            <Node label="사무국" />
          </div>
          <div className="h-24" />
        </div>

        {/* 사무국에서 플랫폼 3개로 연결 */}
        <div className="relative w-full">
          {/* 사무국 아래 수직선 */}
          <div className="absolute left-1/2 -translate-x-1/2 -top-24 w-px h-16 bg-gray-300" />
          {/* 플랫폼 분기 가로선 */}
          <div className="h-px bg-gray-300 w-full mt-[-8px]" />
          {/* 각 플랫폼으로 내려가는 세로선 */}
          <div className="grid grid-cols-3 mt-0">
            <div className="flex justify-center">
              <VLine h={24} />
            </div>
            <div className="flex justify-center">
              <VLine h={24} />
            </div>
            <div className="flex justify-center">
              <VLine h={24} />
            </div>
          </div>
        </div>

        {/* 플랫폼 카드 3개 */}
        <div className="grid md:grid-cols-3 gap-6 w-full mt-2">
          <PlatformCard
            title="복지연결플랫폼"
            items={[
              "보조기기 및 복지용구 기증·수리·재분배 시스템 구축",
              "전동휠체어 이용자 대상 보험 지원 서비스",
              "복지정보 제공 및 복지 신청 지원 서비스",
              "지역사회 복지 연계·제고 및 통합 프로그램 운영",
            ]}
          />
          <PlatformCard
            title="복지디자인연구소"
            items={[
              "취약계층 서비스 연구 및 개발",
              "복지 인력 및 주민 대상 교육 콘텐츠 기획 및 운영",
              "복지 관련 출판물 제작·배포",
              "복지모델 컨설팅",
            ]}
          />
          <PlatformCard
            title="협력운영플랫폼"
            items={[
              "조합원과 직원에 대한 상담·교육",
              "육·훈련 및 정보제공 사업",
              "조합 간 협력을 위한 사업",
              "조합의 홍보 및 지역사회를 위한 사업",
            ]}
          />
        </div>
      </div>
    </div>
  );
}

/* ================= 작은 부품 ================= */

function Node({ label, small = false }) {
  return (
    <div
      className={[
        "rounded-md border bg-white shadow-sm ring-1 ring-gray-200",
        "px-4",
        small ? "py-1 text-sm" : "py-2",
        "min-w-[140px] text-center font-medium",
      ].join(" ")}
    >
      {label}
    </div>
  );
}

function PlatformCard({ title, items }) {
  return (
    <div className="rounded-xl border shadow-sm ring-1 ring-gray-100 bg-white">
      <div className="px-6 py-3 border-b bg-gray-50/70">
        <h3 className="font-bold text-gray-800">{title}</h3>
      </div>
      <ul className="px-6 py-4 list-disc space-y-2 text-sm leading-6 text-gray-700">
        {items.map((t, i) => (
          <li key={i}>{t}</li>
        ))}
      </ul>
    </div>
  );
}

function VLine({ h = 16 }) {
  return <div style={{ height: h }} className="w-px bg-gray-300 mx-auto" />;
}
