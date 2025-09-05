// src/pages/about/People.jsx
// 깔끔한 카드형 조직도 + 플랫폼 카드 + 역할표 + 핵심 인물 그리드

const CORE = {
  title: "함께하는 사람들",
  breadcrumb: "소개 > 함께하는 사람들",
  intro:
    "복지디자인 사회적협동조합의 의사결정 구조와 실행 조직을 한눈에 보기 쉽게 정리했습니다. 총회·이사회·이사장 중심으로 운영되고, 감사의 견제와 사무국 실행, 그리고 3개 플랫폼이 현장 사업을 담당합니다.",
};

export default function AboutPeople() {
  const platforms = [
    {
      key: "connect",
      title: "복지연결플랫폼",
      badge: "CONN.",
      color: "emerald",
      items: [
        "보조기기·복지용구 기증·수리·재분배 시스템",
        "전동휠체어 이용자 보험 지원",
        "복지정보 제공 및 복지 신청 지원",
        "지역 복지 연계·통합 프로그램 운영",
      ],
    },
    {
      key: "lab",
      title: "복지디자인연구소",
      badge: "LAB",
      color: "sky",
      items: [
        "취약계층 서비스 연구·개발",
        "복지 인력·주민 대상 교육 콘텐츠",
        "복지 관련 출판물 제작·배포",
        "복지모델 컨설팅",
      ],
    },
    {
      key: "coop",
      title: "협력운영플랫폼",
      badge: "OPS",
      color: "amber",
      items: [
        "조합원·직원 상담·교육·훈련",
        "정보제공·홍보",
        "조합 간 협력 사업",
        "지역사회 연계 프로젝트",
      ],
    },
  ];

  const roles = [
    {
      part: "조합원총회",
      desc: "모든 조합원이 참가하는 최고의 의사결정기구",
    },
    {
      part: "이사회(이사장)",
      desc: "조합의 사무를 총괄·관장하고 대외 대표 역할 수행",
    },
    {
      part: "사무국(조합이사)",
      desc: "결정사항 집행 및 3개 플랫폼 사업 운영",
    },
  ];

  const people = [
    { name: "김OO", role: "이사장", email: "", phone: "" },
    { name: "박OO", role: "감사", email: "", phone: "" },
    { name: "이OO", role: "사무국장", email: "", phone: "" },
    { name: "최OO", role: "플랫폼 리드(연결)", email: "", phone: "" },
    { name: "정OO", role: "플랫폼 리드(연구소)", email: "", phone: "" },
    { name: "오OO", role: "플랫폼 리드(운영)", email: "", phone: "" },
  ];

  return (
    <div className="bg-white">
      {/* ===== Hero ===== */}
      <header className="border-b">
        <div className="max-w-screen-xl mx-auto px-4 py-8">
          <p className="text-xs md:text-sm text-gray-500">{CORE.breadcrumb}</p>
          <h1 className="mt-2 text-3xl md:text-4xl font-extrabold tracking-tight">
            {CORE.title}
          </h1>
          <p className="mt-3 text-gray-600 max-w-3xl">{CORE.intro}</p>
        </div>
      </header>

      {/* ===== Org Chart ===== */}
      <section className="max-w-screen-xl mx-auto px-4 py-10">
        <OrgChart />
      </section>

      {/* ===== Platforms ===== */}
      <section className="max-w-screen-xl mx-auto px-4 pb-12">
        <h2 className="text-xl font-bold mb-5">플랫폼별 주요 역할</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {platforms.map((p) => (
            <PlatformCard key={p.key} {...p} />
          ))}
        </div>
      </section>

      {/* ===== Roles Table (card style) ===== */}
      <section className="max-w-screen-xl mx-auto px-4 pb-16">
        <h2 className="text-xl font-bold mb-5">구성 및 업무</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {roles.map((r, i) => (
            <div
              key={i}
              className="rounded-2xl border shadow-sm bg-white p-5 ring-1 ring-gray-100"
            >
              <div className="text-sm text-gray-500">구분</div>
              <div className="mt-1 font-semibold">{r.part}</div>
              <div className="mt-3 text-gray-700">{r.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== Core Members ===== */}
      <section className="max-w-screen-xl mx-auto px-4 pb-20">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold">핵심 구성원</h2>
          <span className="text-xs text-gray-500">
            * 사진이 없으면 이니셜 아바타로 표시됩니다
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {people.map((m, idx) => (
            <MemberCard key={idx} {...m} />
          ))}
        </div>
      </section>
    </div>
  );
}

/* =================== Components =================== */

/** 조직도: 깔끔한 카드 + 라인 구성 (세로 스파인 → 분기 → 3 Platform) */
function OrgChart() {
  return (
    <div className="relative mx-auto w-full max-w-5xl">
      {/* 세로 스파인 */}
      <div className="flex flex-col items-center">
        <TierCard label="조합원총회" sub="최고 의사결정" />
        <VLine h={26} />
        <TierCard label="이사회" sub="집행 의결" />
        <VLine h={26} />

        {/* 이사장 + 분기 라인 */}
        <div className="relative w-full flex justify-center">
          <TierCard label="이사장" highlight />
          {/* 분기: 아래로/좌측(감사) */}
          <div className="absolute left-1/2 top-full -translate-x-1/2">
            {/* 아래로 */}
            <div className="w-px h-5 bg-gray-300 mx-auto" />
            {/* 좌측으로(감사) */}
            <div className="relative">
              <div className="h-px w-44 bg-gray-300 -ml-44" />
              <div className="absolute left-0 -top-5 w-px h-5 bg-gray-300" />
            </div>
          </div>
        </div>

        {/* 감사 + 사무국 */}
        <div className="grid grid-cols-3 w-full mt-2">
          <div className="flex justify-start">
            <SmallCard label="감사" tone="slate" />
          </div>
          <div className="flex justify-center">
            <VLine h={10} />
          </div>
          <div />
        </div>
        <div className="flex justify-center w-full">
          <TierCard label="사무국" sub="집행 조직" />
        </div>

        {/* 사무국 아래 가로 라인 + 3갈래 */}
        <div className="w-full max-w-4xl mt-3">
          <VLine h={12} />
          <div className="h-px w-full bg-gray-300" />
          <div className="grid grid-cols-3">
            <div className="flex justify-center">
              <VLine h={14} />
            </div>
            <div className="flex justify-center">
              <VLine h={14} />
            </div>
            <div className="flex justify-center">
              <VLine h={14} />
            </div>
          </div>
        </div>

        {/* 자리 카드(플랫폼 자리만 표기 – 실제 내용은 아래 PlatformCard에서 상세 제공) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 w-full max-w-4xl">
          <Slot label="복지연결플랫폼" />
          <Slot label="복지디자인연구소" />
          <Slot label="협력운영플랫폼" />
        </div>
      </div>
    </div>
  );
}

/* ---- small parts ---- */

function TierCard({ label, sub, highlight = false }) {
  return (
    <div
      className={[
        "rounded-2xl border bg-white shadow-sm",
        "px-5 py-3 min-w-[200px] text-center",
        "ring-1",
        highlight ? "ring-sky-200" : "ring-gray-100",
      ].join(" ")}
    >
      <div className="font-semibold">{label}</div>
      {sub && <div className="text-xs text-gray-500 mt-0.5">{sub}</div>}
    </div>
  );
}

function SmallCard({ label, tone = "slate" }) {
  const ring = tone === "slate" ? "ring-gray-200" : "ring-emerald-200";
  return (
    <div
      className={`rounded-xl border bg-white shadow-sm px-3 py-1.5 min-w-[120px] text-center text-sm ring-1 ${ring}`}
    >
      {label}
    </div>
  );
}

function Slot({ label }) {
  return (
    <div className="rounded-xl border bg-gray-50/30 text-gray-600 text-sm px-4 py-3 text-center">
      {label}
    </div>
  );
}

function VLine({ h = 16 }) {
  return <div style={{ height: h }} className="w-px bg-gray-300 mx-auto" />;
}

function PlatformCard({ title, items, badge, color }) {
  const colorMap = {
    emerald: {
      ring: "ring-emerald-200",
      badgeBg: "bg-emerald-100 text-emerald-700",
      dot: "bg-emerald-400",
    },
    sky: {
      ring: "ring-sky-200",
      badgeBg: "bg-sky-100 text-sky-700",
      dot: "bg-sky-400",
    },
    amber: {
      ring: "ring-amber-200",
      badgeBg: "bg-amber-100 text-amber-700",
      dot: "bg-amber-400",
    },
  }[color || "emerald"];

  return (
    <div className={`rounded-2xl border shadow-sm p-5 ring-1 ${colorMap.ring}`}>
      <div className="flex items-center gap-2">
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${colorMap.badgeBg}`}
        >
          {badge}
        </span>
        <h3 className="font-semibold text-lg">{title}</h3>
      </div>
      <ul className="mt-3 space-y-2">
        {items.map((t, i) => (
          <li key={i} className="flex items-start gap-2 text-gray-700">
            <span className={`mt-2 h-1.5 w-1.5 rounded-full ${colorMap.dot}`} />
            <span>{t}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function MemberCard({ name, role, email, phone, photo }) {
  const initials = name?.replace(/\s+/g, "").slice(0, 2).toUpperCase();

  return (
    <div className="rounded-2xl border shadow-sm p-4 text-center">
      <div className="mx-auto h-16 w-16 rounded-full bg-slate-100 ring-1 ring-gray-200 flex items-center justify-center overflow-hidden">
        {photo ? (
          <img src={photo} alt={name} className="h-full w-full object-cover" />
        ) : (
          <span className="text-slate-500 text-sm">{initials || "NA"}</span>
        )}
      </div>
      <div className="mt-3 font-semibold">{name}</div>
      <div className="text-xs text-gray-500">{role}</div>
      {(email || phone) && (
        <div className="mt-2 text-[11px] text-gray-500 space-y-0.5">
          {email && <div>{email}</div>}
          {phone && <div>{phone}</div>}
        </div>
      )}
    </div>
  );
}
