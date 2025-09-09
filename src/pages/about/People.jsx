// src/pages/about/People.jsx
export default function AboutPeople() {
  // Brand palette (from logo)
  const BRAND = {
    yellow: "#F4B731",
    orange: "#ED6A32",
    teal: "#3BA7A0",
  };

  const platforms = [
    {
      title: "복지연결플랫폼",
      items: [
        "보조기기 및 복지용구 기증·수리·재분배 시스템 구축",
        "전동휠체어 이용자 대상 보험 지원 서비스",
        "복지정보 제공 및 복지 신청 지원 서비스",
        "지역사회 복지 연계·제고 및 통합 프로그램 운영",
      ],
      color: BRAND.yellow,
    },
    {
      title: "복지디자인연구소",
      items: [
        "취약계층 서비스 연구 및 개발",
        "복지 인력 및 주민 대상 교육 콘텐츠 기획·운영",
        "복지 관련 출판물 제작·배포",
        "복지모델 컨설팅",
      ],
      color: BRAND.orange,
    },
    {
      title: "협력운영플랫폼",
      items: [
        "조합원과 직원에 대한 상담·교육",
        "육·훈련 및 정보제공 사업",
        "조합 간 협력을 위한 사업",
        "조합의 홍보 및 지역사회를 위한 사업",
      ],
      color: BRAND.teal,
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
        {/* 브랜드 악센트 바 */}
        <div
          className="mt-3 h-1 w-20 rounded-full"
          style={{
            background:
              "linear-gradient(90deg, #F4B731 0%, #ED6A32 50%, #3BA7A0 100%)",
          }}
        />
      </header>

      {/* ===== 조직도 캔버스 ===== */}
      <section className="max-w-screen-xl mx-auto px-4 pt-10 pb-0">
        <OrgChart />
      </section>

      {/* ===== 하단 3 플랫폼 카드 ===== */}
      <section className="max-w-screen-xl mx-auto px-4 pb-14 mt-0">
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

// ======= 카드: 하단 3개 플랫폼 공통 UI (no hover) =======
function PlatformCard({ title, items, color }) {
  const tint = `${color}1A`; // ~10% opacity hex (1A)
  return (
    <div
      className="relative rounded-2xl p-6 pt-7 shadow-sm border bg-white min-h-[260px] flex flex-col"
      style={{
        borderColor: color,
        background: `linear-gradient(180deg, ${tint}, #ffffff)`,
      }}
    >
      {/* 상단 얇은 컬러바 */}
      <div
        className="absolute left-0 right-0 top-0 h-1 rounded-t-2xl"
        style={{ backgroundColor: color }}
      />
      <div className="flex items-center gap-2 mb-3">
        <span
          className="inline-block w-2.5 h-2.5 rounded-full"
          style={{ backgroundColor: color }}
          aria-hidden
        />
        <h3 className="text-lg font-bold" style={{ color }}>
          {title}
        </h3>
      </div>
      <ul className="space-y-2 text-gray-700 leading-relaxed">
        {items.map((it, idx) => (
          <li key={idx} className="flex gap-2">
            <span
              className="mt-2 inline-block w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: color }}
            />
            <span>{it}</span>
          </li>
        ))}
      </ul>
      {/* 바닥 여백 균형 */}
      <div className="mt-auto" />
    </div>
  );
}

/* ================= 조직도 ================= */

function OrgChart() {
  return (
    <div className="relative mx-auto w-full max-w-screen-xl">
      <div className="flex flex-col items-center">
        {/* 중앙 트렁크: 총회 → 이사회 → 이사장 */}
        <Node label="조합원총회" />
        <VLine h={22} />
        <Node label="이사회" />
        <VLine h={22} />
        <Node label="이사장" />

        {/* 감사: 좌측으로 깔끔히, 메인 트렁크는 끊김 없이 유지 */}
        <CrossAuditor />

        {/* 사무국 (트렁크가 끊기지 않도록 바로 이어짐) */}
        <VLine h={10} />
        <Node label="사무국" />

        {/* 하단 분기: 3플랫폼 연결 (가로선은 플랫폼 영역까지만) */}
        <VLine h={16} />
        <div className="h-px w-11/12 md:w-2/3 mx-auto bg-gray-300" />
        <div className="grid w-full grid-cols-1 md:grid-cols-3">
          <div className="flex justify-center md:justify-center">
            <VLine h={36} dashed />
          </div>
          <div className="hidden md:flex justify-center">
            <VLine h={36} dashed />
          </div>
          <div className="hidden md:flex justify-center">
            <VLine h={36} dashed />
          </div>
        </div>
      </div>
    </div>
  );
}

// 가운데 트렁크에 정확히 접속하는 감사 교차부
function CrossAuditor() {
  const spur = 260; // px : trunk -> 감사 노드까지 가로 길이
  return (
    <div className="relative w-full h-10">
      {/* 트렁크 연속성 유지용 짧은 세로선 */}
      <div className="absolute left-1/2 top-0 -translate-x-1/2">
        <VLine h={10} />
      </div>

      {/* 트렁크 -> 감사까지 가로 연결선 (박스에 닿을 때까지만) */}
      <div
        className="absolute top-1/2 -translate-y-1/2 h-px bg-gray-300"
        style={{ left: `calc(50% - ${spur}px)`, width: `${spur - 100}px` }}
      />
      {/* 감사 노드 (가로선 끝 지점에 정확히 배치) */}
      <div
        className="absolute top-1/2 -translate-y-1/2"
        style={{ left: `calc(50% - ${spur}px)` }}
      >
        <Node label="감사" small />
      </div>
    </div>
  );
}

function VLine({ h = 8, dashed = false }) {
  return (
    <div
      className={`mx-auto ${dashed ? "border-l border-dashed" : "w-px"} bg-gray-300`}
      style={{
        height: `${h * 4}px`,
        borderColor: dashed ? "rgba(0,0,0,0.15)" : undefined,
      }}
    />
  );
}

function Node({ label, small = false }) {
  const base =
    "inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-4 text-gray-800 shadow-sm";
  const size = small ? "h-9 text-sm" : "h-11 text-base min-w-[110px]";
  return <div className={`${base} ${size}`}>{label}</div>;
}

function Th({ children }) {
  return <th className="p-3 text-sm font-semibold text-gray-700">{children}</th>;
}

function Td({ children, className = "" }) {
  return <td className={`p-3 text-sm text-gray-700 align-top ${className}`}>{children}</td>;
}