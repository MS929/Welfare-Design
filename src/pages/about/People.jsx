// src/pages/about/People.jsx
export default function AboutPeople() {
  // ===== 데이터 =====
  const org = {
    top: ["조합원총회", "이사회", "이사장"],
    side: [
      { label: "감사", note: "재정·운영 감시" },
      { label: "사무국", note: "사업 실행 주체" },
    ],
    platforms: [
      {
        title: "복지연결플랫폼",
        items: [
          "보조기기·복지용구 기증/수리/재분배",
          "전동휠체어 이용자 보험 지원",
          "복지정보 제공 및 신청 지원",
          "지역 연계 및 통합 프로그램",
        ],
        color: "from-emerald-50 to-white",
      },
      {
        title: "복지디자인연구소",
        items: [
          "취약계층 서비스 연구/개발",
          "교육 콘텐츠 기획·운영",
          "복지 출판물 제작·배포",
          "복지모델 컨설팅",
        ],
        color: "from-sky-50 to-white",
      },
      {
        title: "협력운영플랫폼",
        items: [
          "조합원·직원 상담/교육/정보제공",
          "조합 간 협력 사업",
          "조합 홍보 및 지역사회 사업",
        ],
        color: "from-amber-50 to-white",
      },
    ],
    roles: [
      { part: "조합원총회", desc: "모든 조합원이 참가하는 최고 의사결정기구" },
      {
        part: "이사회(이사장)",
        desc: "조합 사무 총괄·대외 대표, 주요 안건 의결",
      },
      { part: "감사", desc: "재무·운영 감사 및 자문, 위험관리 권고" },
      { part: "사무국", desc: "각 플랫폼 실행, 사업관리/예산/성과보고" },
    ],
  };

  return (
    <div className="bg-white">
      {/* 헤더 */}
      <header className="max-w-screen-xl mx-auto px-4 pt-10">
        <p className="text-sm text-gray-500">
          소개 &gt; <span className="text-gray-700">함께하는 사람들</span>
        </p>
        <h1 className="mt-4 text-3xl md:text-4xl font-extrabold tracking-tight">
          함께하는 사람들
        </h1>
        <p className="mt-2 text-gray-600">
          복지디자인 사회적협동조합의 조직 체계와 역할을 소개합니다.
        </p>
      </header>

      {/* 조직도 */}
      <section className="max-w-screen-xl mx-auto px-4 py-10">
        <OrgTree org={org} />
      </section>

      {/* 플랫폼 섹션 */}
      <section className="max-w-screen-xl mx-auto px-4 pb-14">
        <h2 className="text-xl font-bold mb-5">플랫폼별 주요 역할</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {org.platforms.map((p) => (
            <PlatformCard key={p.title} {...p} />
          ))}
        </div>
      </section>

      {/* 역할 표 */}
      <section className="max-w-screen-xl mx-auto px-4 pb-16">
        <h2 className="text-xl font-bold mb-5">조직별 역할 요약</h2>
        <div className="overflow-x-auto rounded-xl border">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-gray-700">
                <Th>구분</Th>
                <Th>업무</Th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {org.roles.map((r, i) => (
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

/* ================== 컴포넌트 ================== */

function OrgTree({ org }) {
  return (
    <div className="rounded-2xl border p-6">
      {/* 상단 3단 */}
      <div className="flex flex-col items-center">
        <OrgNode label={org.top[0]} accent="emerald" />
        <TreeLine h={18} />
        <OrgNode label={org.top[1]} accent="sky" />
        <TreeLine h={18} />
        <OrgNode label={org.top[2]} accent="slate" strong />
      </div>

      {/* 분기: 감사 / 사무국 */}
      <div className="relative mt-6">
        {/* 중앙 세로 */}
        <div className="absolute left-1/2 top-0 -translate-x-1/2 w-px h-6 bg-gray-300" />
        {/* 가로 라인 */}
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1 flex flex-col items-center">
            <BranchLine />
            <OrgNode
              label={org.side[0].label}
              desc={org.side[0].note}
              accent="amber"
              small
            />
          </div>
          <div className="flex-1 flex flex-col items-center">
            <BranchLine />
            <OrgNode
              label={org.side[1].label}
              desc={org.side[1].note}
              accent="emerald"
              small
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function OrgNode({
  label,
  desc,
  small = false,
  strong = false,
  accent = "sky",
}) {
  const colorMap = {
    emerald: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    sky: "bg-sky-50 text-sky-700 ring-sky-200",
    amber: "bg-amber-50 text-amber-700 ring-amber-200",
    slate: "bg-slate-50 text-slate-700 ring-slate-200",
  };
  return (
    <div
      className={[
        "w-full max-w-xs rounded-xl border bg-white shadow-sm ring-1",
        colorMap[accent],
        strong ? "border-slate-200" : "border-gray-200",
        "px-4",
        small ? "py-2" : "py-3",
        "text-center",
      ].join(" ")}
    >
      <div className="font-bold">{label}</div>
      {desc && <div className="text-xs text-gray-500 mt-0.5">{desc}</div>}
    </div>
  );
}

function TreeLine({ h = 16 }) {
  return <div style={{ height: h }} className="w-px bg-gray-300 mx-auto" />;
}

function BranchLine() {
  return (
    <div className="w-full max-w-xs">
      <div className="h-5 w-px bg-gray-300 mx-auto" />
      <div className="h-px w-full bg-gray-300" />
    </div>
  );
}

function PlatformCard({ title, items, color }) {
  return (
    <div className={`rounded-2xl border p-5 bg-gradient-to-b ${color}`}>
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
