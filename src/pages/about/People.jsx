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
    </div>
  );
}

/* ===================== 데이터 ===================== */
const platformDetails = {
  left: {
    title: "복지연결플랫폼",
    items: [
      "보조기기 및 복지용구 기증·수리·재분배 시스템 구축",
      "전동휠체어 이용자 대상 보험 지원 서비스",
      "복지정보 제공 및 복지 신청 지원 서비스",
      "지역사회 복지 연계·제고 및 통합 프로그램 운영",
    ],
  },
  center: {
    title: "복지디자인연구소",
    items: [
      "취약계층 서비스 연구 및 개발",
      "복지 인력 및 주민 대상 교육·콘텐츠 기획·운영",
      "복지 관련 출판물 제작·배포",
      "복지모델 컨설팅",
    ],
  },
  right: {
    title: "협력운영플랫폼",
    items: [
      "조합원과 직원에 대한 상담·교육",
      "육·훈련 및 정보제공 사업",
      "조합 간 협력을 위한 사업",
      "조합 홍보 및 지역사회룰 위한 사업",
    ],
  },
};

/* ===================== 조직도 ===================== */
function OrgChart() {
  return (
    <div className="relative mx-auto w-full max-w-5xl">
      <div className="flex flex-col items-center">
        {/* 세로 축: 총회 -> 이사회 -> 이사장 */}
        <Node label="조합원총회" />
        <VLine h={28} />
        <Node label="이사회" />
        <VLine h={28} />

        {/* 이사장 + 버스라인 */}
        <div className="relative w-full">
          {/* 이사장 노드 */}
          <div className="flex justify-center">
            <Node label="이사장" />
          </div>

          {/* 이사장에서 아래로 */}
          <div
            className="absolute left-1/2 -translate-x-1/2 w-px bg-gray-300"
            style={{ top: 64, height: 24 }}
          />

          {/* 긴 수평 버스라인 */}
          <div className="absolute left-0 right-0" style={{ top: 88 }}>
            <div className="h-px w-full bg-gray-300" />
          </div>

          {/* 버스라인에서 내려가는 수직선들 */}
          {/* 감사(왼쪽) */}
          <div
            className="absolute -translate-x-1/2 w-px bg-gray-300"
            style={{ left: "18%", top: 88, height: 56 }}
          />
          {/* 사무국(중앙) */}
          <div
            className="absolute left-1/2 -translate-x-1/2 w-px bg-gray-300"
            style={{ top: 88, height: 56 }}
          />
          {/* 플랫폼 3갈래: 좌/중/우 */}
          <div
            className="absolute -translate-x-1/2 w-px bg-gray-300"
            style={{ left: "33%", top: 88, height: 120 }}
          />
          <div
            className="absolute -translate-x-1/2 w-px bg-gray-300"
            style={{ left: "50%", top: 88, height: 120 }}
          />
          <div
            className="absolute -translate-x-1/2 w-px bg-gray-300"
            style={{ left: "67%", top: 88, height: 120 }}
          />
        </div>

        {/* 감사 / 사무국 노드 */}
        <div className="grid grid-cols-3 items-start w-full pt-[168px]">
          <div className="flex justify-start pl-6">
            <Node label="감사" small />
          </div>
          <div className="flex justify-center">
            <Node label="사무국" />
          </div>
          <div />
        </div>

        {/* 플랫폼 3개 노드 (선 연결 완료) */}
        <div className="grid grid-cols-3 gap-8 w-full mt-8">
          <PlatformNode pos="left" data={platformDetails.left} />
          <PlatformNode pos="center" data={platformDetails.center} />
          <PlatformNode pos="right" data={platformDetails.right} />
        </div>
      </div>
    </div>
  );
}

/* ===================== 부품 ===================== */
function PlatformNode({ pos, data }) {
  return (
    <div className="flex flex-col items-center">
      <Node label={data.title} wide />

      {/* 접는 상세(내용 보존) */}
      <details className="w-full max-w-md mt-3 group">
        <summary className="cursor-pointer select-none text-sm text-gray-600 hover:text-gray-900 flex items-center">
          <span className="inline-block mr-2 transition-transform group-open:rotate-90">
            ▶
          </span>
          역할 보기
        </summary>
        <div className="mt-2 rounded-lg border bg-white p-4 shadow-sm">
          <ul className="list-disc pl-5 text-sm leading-6 text-gray-700">
            {data.items.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        </div>
      </details>
    </div>
  );
}

function Node({ label, small = false, wide = false }) {
  return (
    <div
      className={[
        "rounded-lg border bg-white shadow-sm ring-1 ring-gray-200",
        "px-4",
        small ? "py-1 text-sm" : "py-2",
        wide ? "min-w-[220px]" : "min-w-[140px]",
        "text-center font-medium",
      ].join(" ")}
    >
      {label}
    </div>
  );
}
function VLine({ h = 16 }) {
  return <div style={{ height: h }} className="w-px bg-gray-300 mx-auto" />;
}
