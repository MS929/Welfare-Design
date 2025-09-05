// src/pages/about/People.jsx
export default function AboutPeople() {
  const platforms = [
    {
      title: "복지연결플랫폼",
      items: [
        "보조기기 및 복지용구 기증·수리·재분배 시스템 구축",
        "전동휠체어 이용자 대상 보험 지원 서비스",
        "복지정보 제공 및 복지 신청 지원 서비스",
        "지역사회 복지 연계·제고 및 통합 프로그램 운영",
      ],
      color: "from-emerald-50 to-white",
      ring: "ring-emerald-200",
    },
    {
      title: "복지디자인연구소",
      items: [
        "취약계층 서비스 연구 및 개발",
        "복지 인력 및 주민 대상 교육 콘텐츠 기획·운영",
        "복지 관련 출판물 제작·배포",
        "복지모델 컨설팅",
      ],
      color: "from-sky-50 to-white",
      ring: "ring-sky-200",
    },
    {
      title: "협력운영플랫폼",
      items: [
        "조합원과 직원에 대한 상담·교육",
        "육·훈련 및 정보제공 사업",
        "조합 간 협력을 위한 사업",
        "조합의 홍보 및 지역사회를 위한 사업",
      ],
      color: "from-amber-50 to-white",
      ring: "ring-amber-200",
    },
  ];

  const roles = [
    { part: "조합원총회", desc: "모든 조합원이 참가하는 최고의 의사결정기구" },
    { part: "이사회(이사장)", desc: "조합의 사무 총괄·관장 및 대외적 대표" },
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
        <p className="mt-2 text-gray-600">
          원본 도식(총회→이사회→이사장, 좌측 감사 분기, 중앙 사무국, 하단
          3플랫폼)을 반응형으로 정리했습니다.
        </p>
      </header>

      {/* ===== 조직도 캔버스 ===== */}
      <section className="max-w-screen-xl mx-auto px-4 py-10">
        <OrgChart />
      </section>

      {/* ===== 하단 3 플랫폼 카드 ===== */}
      <section className="max-w-screen-xl mx-auto px-4 pb-14">
        <h2 className="text-xl font-bold mb-5">플랫폼별 주요 역할</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {platforms.map((p) => (
            <PlatformCard key={p.title} {...p} />
          ))}
        </div>
      </section>

      {/* ===== 역할 표 ===== */}
      <section className="max-w-screen-xl mx-auto px-4 pb-16">
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
    <div className="relative mx-auto w-full max-w-4xl">
      {/* 세로 축 (총회-이사회-이사장) */}
      <div className="flex flex-col items-center">
        <Node label="조합원총회" />
        <VLine h={22} />
        <Node label="이사회" />
        <VLine h={22} />
        {/* 이사장 + 분기 라인 */}
        <div className="relative w-full flex justify-center">
          <Node label="이사장" />
          {/* 이사장에서 좌측/하향으로 갈라지는 라인 */}
          <div className="absolute left-1/2 top-full -translate-x-1/2">
            {/* 아래로 */}
            <div className="w-px h-5 bg-gray-300 mx-auto" />
            {/* 좌측으로 (감사 방향) */}
            <div className="relative">
              <div className="h-px w-40 bg-gray-300 -ml-40" />
              {/* 좌측 끝에서 위로 살짝 */}
              <div className="absolute left-0 -top-5 w-px h-5 bg-gray-300" />
            </div>
          </div>
        </div>

        {/* 감사 (좌측) + 사무국(중앙) */}
        <div className="grid grid-cols-3 items-start w-full mt-3">
          {/* 감사(좌측 정렬) */}
          <div className="flex justify-start">
            <Node label="감사" small />
          </div>
          {/* 중앙 사무국 */}
          <div className="flex justify-center">
            <VLine h={8} />
          </div>
          <div />
        </div>
        <div className="flex justify-center w-full">
          <Node label="사무국" />
        </div>

        {/* 사무국 밑 가로 라인 (플랫폼 3개로 분기) */}
        <div className="w-full max-w-3xl mt-2">
          <VLine h={10} />
          <div className="h-px w-full bg-gray-300" />
          {/* 세 갈래 내려가는 세로 라인 */}
          <div className="grid grid-cols-3">
            <div className="flex justify-center">
              <VLine h={12} />
            </div>
            <div className="flex justify-center">
              <VLine h={12} />
            </div>
            <div className="flex justify-center">
              <VLine h={12} />
            </div>
          </div>
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
function PlatformCard({ title, items, color, ring }) {
  return (
    <div
      className={`rounded-2xl border p-5 bg-gradient-to-b ${color} ring-1 ${ring}`}
    >
      <h3 className="font-semibold text-lg">{title}</h3>
      <ul className="mt-3 space-y-2 text-gray-700 list-disc pl-5">
        {items.map((t, i) => (
          <li key={i}>{t}</li>
        ))}
      </ul>
    </div>
  );
}
function Th({ children }) {
  return <th className="px-4 py-3 text-sm font-medium border-b">{children}</th>;
}
function Td({ children, className = "" }) {
  return <td className={`px-4 py-3 text-sm ${className}`}>{children}</td>;
}
