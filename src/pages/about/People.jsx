// src/pages/about/People.jsx
export default function AboutPeople() {
  const roles = [
    { part: "조합원총회", desc: "모든 조합원이 참가하는 최고의 의사결정기구" },
    {
      part: "이사회(이사장)",
      desc: "조합의 사무를 총괄·관장하며 대외적 대표직을 수행함",
    },
    { part: "사무국(조합이사)", desc: "각 플랫폼을 실행하는 실무 주체" },
  ];

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

      {/* ===== 조직도 ===== */}
      <section className="max-w-screen-xl mx-auto px-4 py-10">
        <OrgChart />
      </section>

      {/* ===== 구성 및 업무 표 ===== */}
      <section className="max-w-screen-xl mx-auto px-4 pb-20">
        <h2 className="text-xl font-bold mb-5">구성 및 업무</h2>
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

/* ================= 조직도 ================= */

function OrgChart() {
  return (
    <div className="mx-auto w-full max-w-5xl">
      {/* 1열 중앙 수직축: 조합원총회, 이사회, 이사장, 감사, 사무국 */}
      <div className="grid grid-cols-3 gap-x-10 justify-items-center">
        {/* ---------- 중앙 수직축 ---------- */}
        <div className="col-start-2 w-full flex flex-col items-center">
          <Node label="조합원총회" />
          <VLine h={24} />
          <Node label="이사회" />
          <VLine h={24} />
          <Node label="이사장" />
          <VLine h={24} />
          <Node label="감사" small />
          <VLine h={24} />
          <Node label="사무국" />
        </div>

        {/* ---------- 가로 기준선(모든 칸을 정확히 잇기) ---------- */}
        <div className="col-span-3 w-full relative mt-6 mb-6">
          {/* 중앙 세로선이 기준선에 정확히 닿도록 */}
          <div className="absolute left-1/2 -translate-x-1/2">
            <VLine h={28} />
          </div>

          {/* 기준 가로선 자체 */}
          <div className="h-px w-full bg-gray-300" />

          {/* 사무국으로 내려가는 중앙 세로선(기준선 아래측) */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0">
            <VLine h={28} direction="down" />
          </div>

          {/* 플랫폼 3개로 내려가는 세로선 */}
          <div className="absolute left-[16.66%] -translate-x-1/2 top-0">
            <VLine h={28} direction="down" />
          </div>
          <div className="absolute left-1/2 -translate-x-1/2 top-0">
            <VLine h={28} direction="down" />
          </div>
          <div className="absolute left-[83.33%] -translate-x-1/2 top-0">
            <VLine h={28} direction="down" />
          </div>
        </div>

        {/* ---------- 하단 3 플랫폼 카드(정확히 3분할 정렬) ---------- */}
        <PlatformCard
          title="복지연결플랫폼"
          items={[
            "보조기기 및 복지용구 기증·수리·재분배 시스템 구축",
            "전동휠체어 이용자 대상 보험 지원 서비스",
            "복지정보 제공 및 복지 신청 지원 서비스",
            "지역사회 복지 연계·제고 및 통합 프로그램 운영",
          ]}
          colStart={1}
        />
        <PlatformCard
          title="복지디자인연구소"
          items={[
            "취약계층 서비스 연구 및 개발",
            "복지 인력 및 주민 대상 교육 콘텐츠 기획·운영",
            "복지 관련 출판물 제작·배포",
            "복지모델 컨설팅",
          ]}
          colStart={2}
        />
        <PlatformCard
          title="협력운영플랫폼"
          items={[
            "조합원과 직원에 대한 상담·교육",
            "육·훈련 및 정보제공 사업",
            "조합 간 협력을 위한 사업",
            "조합의 홍보 및 지역사회를 위한 사업",
          ]}
          colStart={3}
        />
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

function PlatformCard({ title, items, colStart }) {
  return (
    <div className={`col-start-${colStart} w-full`}>
      <div className="rounded-xl border shadow-sm p-5 bg-white">
        <h3 className="font-semibold mb-3">{title}</h3>
        <ul className="space-y-2 text-sm text-gray-700 list-disc pl-5">
          {items.map((it, i) => (
            <li key={i}>{it}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Th({ children }) {
  return <th className="px-4 py-3 text-sm font-medium border-b">{children}</th>;
}
function Td({ children, className = "" }) {
  return <td className={`px-4 py-3 text-sm ${className}`}>{children}</td>;
}
