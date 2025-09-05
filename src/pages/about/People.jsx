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
      </header>

      {/* ===== 조직도 캔버스 ===== */}
      <section className="max-w-screen-xl mx-auto px-4 py-10">
        <OrgChart />
      </section>

      {/* ===== 하단 3 플랫폼 카드 ===== */}
      <section className="max-w-screen-xl mx-auto px-4 pb-14 -mt-10 md:-mt-16 lg:-mt-20 relative z-10">
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
// 카드: 하단 3개 플랫폼 공통 UI
function PlatformCard({ title, items, color, ring }) {
  return (
    <div
      className={[
        "rounded-2xl bg-gradient-to-b p-6 shadow-sm",
        "ring-1",
        ring,
        color,
      ].join(" ")}
    >
      <h3 className="text-lg font-bold mb-3">{title}</h3>
      <ul className="space-y-2 text-gray-700 leading-relaxed list-disc pl-5">
        {items.map((it, idx) => (
          <li key={idx}>{it}</li>
        ))}
      </ul>
    </div>
  );
}

/* ================= 조직도 ================= */

function OrgChart() {
  return (
    // 카드 섹션과 너비를 정확히 맞추기 위해 max-w-screen-xl 사용
    <div className="relative mx-auto w-full max-w-screen-xl">
      <div className="flex flex-col items-center">
        <Node label="조합원총회" />
        <VLine h={22} />
        <Node label="이사회" />
        <VLine h={22} />

        <div className="flex flex-col items-center w-full">
          <Node label="이사장" />
          <VLine h={12} />
        </div>

        {/* 감사(좌) — 박스는 고정, 선만 늘려서 중앙 트렁크에 정확히 연결 */}
        <div className="w-full grid grid-cols-[22%_0px_1fr] items-center">
          {/* 좌측: 선은 고정, 박스만 오른쪽으로 이동 */}
          <div className="relative w-[360px] h-9 justify-self-end">
            {/* 고정 가로선 */}
            <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-px bg-gray-300" />
            {/* 감사 박스: 선 길이에 영향 없이 위치만 조정 */}
            <div className="absolute top-1/2 -translate-y-1/2 right-0">
              <Node label="감사" small />
            </div>
          </div>
          {/* 중앙: 트렁크 접점 */}
          <div className="justify-self-center">
            <VLine h={14} />
          </div>
          <div />
        </div>

        {/* 사무국: 추가 세그먼트 없이 바로 붙도록 살짝 당김 */}
        <div className="flex justify-center w-full -mt-1">
          <Node label="사무국" />
        </div>

        {/* 선만 길게: 가로선은 컨테이너 전체, 세로선은 3등분 위치에 길게 드롭 */}
        <div className="w-full mt-2">
          {/* 세로를 조금 더 내려서 카드 상단까지 닿게 */}
          <VLine h={24} />
          <div className="h-px w-full bg-gray-300" />
          {/* 카드 그리드와 동일한 3등분 위치에 세로선 길게 */}
          <div className="grid grid-cols-3">
            <div className="flex justify-center">
              <VLine h={36} />
            </div>
            <div className="flex justify-center">
              <VLine h={36} />
            </div>
            <div className="flex justify-center">
              <VLine h={36} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
// ===== helpers =====
function VLine({ h = 8 }) {
  return (
    <div
      className="w-px bg-gray-300 mx-auto"
      style={{ height: `${h * 4}px` }}
    />
  );
}

function Node({ label, small = false }) {
  const base =
    "inline-flex items-center justify-center rounded-xl border border-gray-300 bg-white px-4 text-gray-800 shadow-sm";
  const size = small
    ? "h-9 text-sm"
    : "h-11 text-base min-w-[96px]";
  return <div className={`${base} ${size}`}>{label}</div>;
}

function Th({ children }) {
  return (
    <th className="p-3 text-sm font-semibold text-gray-700">{children}</th>
  );
}

function Td({ children, className = "" }) {
  return (
    <td className={`p-3 text-sm text-gray-700 align-top ${className}`}>{children}</td>
  );
}