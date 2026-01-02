// -----------------------------------------------------------------------------
// People.jsx (함께하는 사람들)
// -----------------------------------------------------------------------------
// [페이지 목적]
//  - 복지디자인 사회적협동조합의 조직 구조와 운영 체계를 시각적으로 소개
//
// [구성]
//  - 상단: 조직도(데스크톱/모바일 분기 렌더링)
//  - 하단: 3대 운영 플랫폼 카드 + 조직 역할/업무 표
//
// [UI/UX 포인트]
//  - 정보 전달을 우선한 구조적 레이아웃(조직도 → 플랫폼 요약 → 역할 표)
//  - 화면 크기에 따라 조직도 레이아웃을 분리해 가독성 확보
// -----------------------------------------------------------------------------

export default function AboutPeople() {
  // -----------------------------------------------------------------------------
  // [데이터] 3대 운영 플랫폼(카드 영역)
  //  - 플랫폼별 고유 색상(color)로 시각적 구분
  // -----------------------------------------------------------------------------
  const platforms = [
    {
      title: "복지연결플랫폼",
      items: [
        "보조기기 및 복지용구 기증·수리·재분배 시스템 구축",
        "전동휠체어 이용자 대상 보험 지원 서비스",
        "복지정보 제공 및 복지 신청 지원 서비스",
        "지역사회 복지 연계·제고 및 통합 프로그램 운영",
      ],
      color: "#F4B731", // 노랑(플랫폼 1 강조색)
    },
    {
      title: "복지디자인연구소",
      items: [
        "취약계층 서비스 연구 및 개발",
        "복지 인력 및 주민 대상 교육 콘텐츠 기획·운영",
        "복지 관련 출판물 제작·배포",
        "복지모델 컨설팅",
      ],
      color: "#ED6A32", // 주황(플랫폼 2 강조색)
    },
    {
      title: "협력운영플랫폼",
      items: [
        "조합원과 직원에 대한 상담·교육",
        "육·훈련 및 정보제공 사업",
        "조합 간 협력을 위한 사업",
        "조합의 홍보 및 지역사회를 위한 사업",
      ],
      color: "#3BA7A0", // 청록(플랫폼 3 강조색)
    },
  ];

  // -----------------------------------------------------------------------------
  // [데이터] 조직 구성/업무 표(하단 테이블)
  //  - 의사결정(총회/이사회) → 집행(사무국) 역할을 한눈에 정리
  // -----------------------------------------------------------------------------
  const roles = [
    { part: "조합원총회", desc: "모든 조합원이 참가하는 최고의 의사결정기구" },
    { part: "이사회(이사장)", desc: "조합의 사무 총괄·관장 및 대외적 대표" },
    { part: "사무국(조합이사)", desc: "각 플랫폼을 실행하는 실무 주체" },
  ];

  return (
    <div className="bg-white">
      {/* -------------------------------------------------------------------
         상단 헤더(브레드크럼 + 페이지 제목)
         ------------------------------------------------------------------- */}
      <header className="max-w-screen-xl mx-auto px-4 pt-10">
        <p className="text-sm text-gray-500">
          소개 &gt; <span className="text-gray-700">함께하는 사람들</span>
        </p>
        <h1 className="mt-3 text-3xl md:text-4xl font-extrabold tracking-tight">
          함께하는 사람들
        </h1>
      </header>

      {/* -------------------------------------------------------------------
         조직도 영역
         - 데스크톱: 가로 확장형 조직도(Desktop 전용 컴포넌트)
         - 모바일: 세로 흐름형 조직도(Mobile 전용 컴포넌트)
         ------------------------------------------------------------------- */}
      <section className="max-w-screen-xl mx-auto px-4 pt-10 pb-0 mb-[-0px]">
        <div className="hidden md:block"><OrgChartDesktop /></div>
        <div className="md:hidden"><OrgChartMobile /></div>
      </section>

      {/* -------------------------------------------------------------------
         3대 운영 플랫폼 카드 영역
         - 플랫폼별 주요 역할/사업을 요약 카드로 제공
         ------------------------------------------------------------------- */}
      <section className="max-w-screen-xl mx-auto px-4 pb-14 mt-0 relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {platforms.map((p) => (
            <PlatformCard key={p.title} {...p} />
          ))}
        </div>
      </section>

      {/* -------------------------------------------------------------------
         구성 및 업무 표
         - 조직별 역할과 책임을 텍스트 기반 표로 정리
         ------------------------------------------------------------------- */}
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
// -----------------------------------------------------------------------------
// PlatformCard
//  - 하단 3대 운영 플랫폼을 표현하는 공통 카드 컴포넌트
//  - 플랫폼 고유 색상(color)을 제목/불릿/테두리 포인트로 사용
// -----------------------------------------------------------------------------
function PlatformCard({ title, items, color }) {
  // 카드 배경용 연한 그라데이션(플랫폼 색상에 투명도만 적용)
  const tint = `${color}1A`; // ~10% opacity hex (1A)
  const ring = color;
  return (
    <div
      className="relative rounded-2xl p-6 pt-8 shadow-sm border bg-white"
      style={{ borderColor: ring, background: `linear-gradient(180deg, ${tint}, #ffffff)` }}
    >
      <div className="flex items-center gap-2 mb-3">
        <span
          className="inline-block w-2.5 h-2.5 rounded-full"
          style={{ backgroundColor: color }}
          aria-hidden
        />
        <h3 className="text-lg font-bold" style={{ color }}>{title}</h3>
      </div>
      <ul className="space-y-2 text-gray-700 leading-relaxed">
        {items.map((it, idx) => (
          <li key={idx} className="flex gap-2">
            <span className="mt-2 inline-block w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// -----------------------------------------------------------------------------
// 조직도 컴포넌트 묶음
//  - Desktop/Mobile 환경에 따라 다른 레이아웃을 사용
// -----------------------------------------------------------------------------
function OrgChartDesktop() {
  // [Desktop] 가로 확장형 조직도
  //  - 중앙 트렁크(총회 → 이사회 → 이사장)를 기준으로 분기 구조를 표현
  return (
    <div className="relative mx-auto w-full max-w-screen-xl">
      <div className="flex flex-col items-center">
        {/* 중앙 트렁크: 총회 → 이사회 → 이사장 */}
        <Node label="조합원총회" />
        <VLine h={22} />
        <Node label="이사회" />
        <VLine h={22} />
        <Node label="이사장" />

        {/* 감사 교차부: 가로선은 전체, 중앙에 세로 연결점 포함 */}
        <CrossAuditor />

        {/* 사무국 (트렁크가 끊기지 않도록 바로 이어짐) */}
        <VLine h={10} />
        <Node label="사무국" />

        {/* 하단 분기: 3플랫폼 위치까지 하강 및 가로선/세로선 */}
        <VLine h={16} />
        {/* 좌·우 플랫폼 컬럼 사이까지만 이어지는 가로 연결선 */}
        <div className="h-px w-2/3 mx-auto bg-gray-300" />
        <div className="grid w-full grid-cols-3">
          <div className="flex justify-center"><VLine h={36} /></div>
          <div className="flex justify-center"><VLine h={36} /></div>
          <div className="flex justify-center"><VLine h={36} /></div>
        </div>
      </div>
    </div>
  );
}

// [Mobile] 세로 흐름형 조직도
//  - 작은 화면에서도 구조를 빠르게 이해할 수 있도록 단순화
function OrgChartMobile() {
  return (
    <div className="max-w-screen-sm mx-auto flex flex-col items-center gap-2 px-4">
      <MobileNode label="조합원총회" />
      <MobileConnector h={28} />
      <MobileNode label="이사회" />
      <MobileConnector h={28} />
      <MobileNode label="이사장" />
      <MobileAuditor />
      <MobileNode label="사무국" />
      <MobileConnector h={28} />
    </div>
  );
}

function MobileNode({ label }) {
  return (
    <div className="inline-flex items-center justify-center rounded-full border border-gray-300 bg-white px-4 h-10 text-gray-800 shadow-sm text-sm">
      {label}
    </div>
  );
}

function MobileConnector({ h = 24 }) {
  return (
    <div
      className="w-[2px] bg-gray-300 mx-auto"
      style={{ height: `${h}px`, borderRadius: 2 }}
    />
  );
}

function MobileAuditor() {
  // 세로 트렁크를 유지한 채 좌측으로만 감사 노드를 분기하는 T자 구조
  const spur = 118; // 중앙 트렁크에서 감사 노드까지의 거리(px)
  const lineColor = "#D1D5DB"; // 라인 색상(gray-300)
  const H = 56; // 감사 블록 전체 높이(이사장–사무국 간 간격 조절)
  const mid = Math.floor(H / 2); // 분기선이 위치할 세로 중앙 좌표

  return (
    <div className="relative w-full" style={{ height: H }}>
      {/* 끊기지 않는 중앙 세로 트렁크 */}
      <div
        className="absolute left-1/2 -translate-x-1/2"
        style={{ top: 0, height: H, width: 2, backgroundColor: lineColor, borderRadius: 2 }}
      />

      {/* 중간 지점에서 감사로 향하는 단일 가로 분기선 */}
      <div
        className="absolute"
        style={{ top: mid, left: `calc(50% - ${spur}px)`, width: spur, height: 2, backgroundColor: lineColor, borderRadius: 2 }}
      />

      {/* 분기선 끝에 위치한 감사 노드 */}
      <div className="absolute -translate-y-1/2" style={{ top: mid, left: `calc(50% - ${spur}px)` }}>
        <MobileNode label="감사" />
      </div>
    </div>
  );
}

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

function CrossAuditor() {
  // 중앙 트렁크에서 감사 노드까지 이어지는 좌측 분기 길이(px)
  const spur = 280; // px
  return (
    <div className="relative w-full h-10">
      {/* 트렁크가 시각적으로 끊기지 않도록 중앙 연결부 표시 */}
      <div className="absolute left-1/2 top-0 -translate-x-1/2">
        <VLine h={10} />
      </div>
      {/* 트렁크에서 감사 박스까지 이어지는 짧은 가로선(좌측) */}
      <div
        className="absolute top-1/2 -translate-y-1/2 h-px bg-gray-300"
        style={{ left: `calc(50% - ${spur}px)`, width: `${spur}px` }}
      />
      {/* 분기선 끝에 정확히 배치된 감사 노드 */}
      <div
        className="absolute top-1/2 -translate-y-1/2"
        style={{ left: `calc(50% - ${spur}px)` }}
      >
        <Node label="감사" small />
      </div>
    </div>
  );
}

// [표] 헤더 셀 공통 컴포넌트
function Th({ children }) {
  return (
    <th className="p-3 text-sm font-semibold text-gray-700">{children}</th>
  );
}

// [표] 데이터 셀 공통 컴포넌트
function Td({ children, className = "" }) {
  return (
    <td className={`p-3 text-sm text-gray-700 align-top ${className}`}>{children}</td>
  );
}