// src/pages/about/People.jsx
export default function AboutPeople() {
  const platforms = [
    {
      name: "복지연결플랫폼",
      items: [
        "보조기기 및 복지용구 기증·수리·재분배 시스템 구축",
        "전동휠체어 이용자 대상 보험 지원 서비스",
        "복지정보 제공 및 복지 신청 지원 서비스",
        "지역사회 복지 연계·제고 및 통합 프로그램 운영",
      ],
    },
    {
      name: "복지디자인연구소",
      items: [
        "취약계층 서비스 연구 및 개발",
        "복지 인력 및 주민 대상 교육 콘텐츠 기획·운영",
        "복지 관련 출판물 제작·배포",
        "복지모델 컨설팅",
      ],
    },
    {
      name: "협력운영플랫폼",
      items: [
        "조합원과 직원에 대한 상담·교육",
        "육·훈련 및 정보제공 사업",
        "조합 간 협력을 위한 사업",
        "조합의 홍보 및 지역사회를 위한 사업",
      ],
    },
  ];

  const roles = [
    { part: "조합원총회", desc: "모든 조합원이 참가하는 최고의 의사결정기구" },
    {
      part: "이사회(이사장)",
      desc: "조합의 사무를 총괄·관장하며 대외적 대표권을 수행함",
    },
    { part: "사무국(조합이사)", desc: "각 플랫폼을 실행하는 실무 주체" },
  ];

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
          조직도의 역할을 간단히 소개합니다. (디자인은 추후 반영)
        </p>
      </header>

      {/* ===== 조직도 ===== */}
      <section className="max-w-screen-xl mx-auto px-4 lg:px-0 py-10">
        <OrgChart />
      </section>

      {/* ===== 플랫폼 카드 3개 ===== */}
      <section className="max-w-screen-xl mx-auto px-4 lg:px-0">
        <div className="grid md:grid-cols-3 gap-6">
          {platforms.map((p, i) => (
            <div
              key={i}
              className="rounded-xl border shadow-sm ring-1 ring-gray-100 bg-white"
            >
              <div className="px-6 py-4 border-b bg-gray-50/60">
                <h3 className="font-bold">{p.name}</h3>
              </div>
              <ul className="px-6 py-4 list-disc space-y-2 text-sm leading-6 text-gray-700">
                {p.items.map((t, idx) => (
                  <li key={idx}>{t}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ===== 구성 및 업무 표 ===== */}
      <section className="max-w-screen-xl mx-auto px-4 lg:px-0 py-12">
        <h2 className="text-lg md:text-xl font-bold mb-4">구성 및 업무</h2>
        <div className="overflow-x-auto rounded-xl border">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-gray-700">
                <Th>구분</Th>
                <Th>업무</Th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {roles.map((r, i) => (
                <tr key={i} className="align-top">
                  <Td className="whitespace-nowrap font-semibold">{r.part}</Td>
                  <Td>{r.desc}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

/* ================= 조직도 컴포넌트 ================= */

function OrgChart() {
  return (
    <div className="relative mx-auto w-full max-w-5xl">
      {/* 수직 메인 체인: 총회 -> 이사회 -> 이사장 */}
      <div className="flex flex-col items-center">
        <Node label="조합원총회" />
        <VLine h={24} />
        <Node label="이사회" />
        <VLine h={24} />
        <Node label="이사장" />

        {/* 이사장에서 가로로 퍼지는 기준선 */}
        <VLine h={24} />
        <div className="relative w-full">
          {/* 기준 수평 라인 */}
          <div className="h-px bg-gray-300 w-full" />

          {/* 감사 연결 (좌측) */}
          <div className="absolute left-[14%] -top-3 w-px h-14 bg-gray-300" />
          {/* 사무국 연결 (중앙) */}
          <div className="absolute left-1/2 -translate-x-1/2 -top-3 w-px h-14 bg-gray-300" />
          {/* 오른쪽 여분 포인트 (디자인 균형) */}
          <div className="absolute right-[14%] -top-3 w-px h-14 bg-transparent" />
        </div>

        {/* 기준선 아래 노드들 */}
        <div className="relative w-full mt-6">
          {/* 좌측 감사 */}
          <div className="absolute left-[10%]">
            <Node label="감사" small />
          </div>
          {/* 중앙 사무국 */}
          <div className="absolute left-1/2 -translate-x-1/2">
            <Node label="사무국" />
          </div>
          {/* 공간 확보용 높이 */}
          <div className="h-20" />
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
function Th({ children }) {
  return <th className="px-4 py-3 text-sm font-medium border-b">{children}</th>;
}
function Td({ children, className = "" }) {
  return <td className={`px-4 py-3 text-sm ${className}`}>{children}</td>;
}
