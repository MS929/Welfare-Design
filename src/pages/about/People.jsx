// -----------------------------------------------------------------------------
// People.jsx
// [페이지 목적]
//  - 소개 > 함께하는 사람들 페이지
//  - 복지디자인 사회적협동조합의 조직 구조, 운영 플랫폼, 구성별 역할을 소개
//
// [화면 구성]
//  - 상단: 브레드크럼 + 페이지 제목
//  - 중간: 조직도(데스크톱/모바일 분리 렌더링)
//  - 하단: 3대 운영 플랫폼 카드 + 구성 및 업무 표
//
// [데이터 구조]
//  - platforms: 3대 운영 플랫폼 카드 데이터
//  - roles: 구성 및 업무 표 데이터
//
// [유지보수 위치]
//  - 플랫폼 내용 변경: platforms 배열 수정
//  - 조직 역할/업무 변경: roles 배열 수정
//  - 조직도 구조 변경: OrgChartDesktop / OrgChartMobile 수정
// -----------------------------------------------------------------------------

export default function AboutPeople() {
  // 3대 운영 플랫폼 카드 데이터
  // - title: 플랫폼명
  // - items: 주요 역할/사업 목록
  // - color: 카드 강조색
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

  // 구성 및 업무 표 데이터
  // - 의사결정 조직과 실행 조직의 역할을 하단 표로 표시
  const roles = [
    { part: "조합원총회", desc: "모든 조합원이 참가하는 최고의 의사결정기구" },
    { part: "이사회(이사장)", desc: "조합의 사무 총괄·관장 및 대외적 대표" },
    { part: "사무국(조합이사)", desc: "각 플랫폼을 실행하는 실무 주체" },
  ];

  return (
    <div className="bg-white">
      {/* 상단 영역: 현재 위치 안내(브레드크럼)와 페이지 제목 */}
      <header className="max-w-screen-xl mx-auto px-4 pt-10">
        <p className="text-sm text-gray-500">
          소개 &gt; <span className="text-gray-700">함께하는 사람들</span>
        </p>
        <h1 className="mt-3 text-3xl md:text-4xl font-extrabold tracking-tight">
          함께하는 사람들
        </h1>
      </header>

      {/* 조직도 영역
          - 데스크톱: 가로 확장형 조직도
          - 모바일: 세로 흐름형 조직도 */}
      <section className="max-w-screen-xl mx-auto px-4 pt-10 pb-0 mb-[-0px]">
        <div className="hidden md:block"><OrgChartDesktop /></div>
        <div className="md:hidden"><OrgChartMobile /></div>
      </section>

      {/* 3대 운영 플랫폼 카드 영역
          - platforms 배열을 순회하여 카드 자동 생성 */}
      <section className="max-w-screen-xl mx-auto px-4 pb-14 mt-0 relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {platforms.map((p) => (
            <PlatformCard key={p.title} {...p} />
          ))}
        </div>
      </section>

      {/* 구성 및 업무 표
          - roles 배열을 기반으로 조직별 역할을 표시 */}
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
//  - 3대 운영 플랫폼을 카드 형태로 표시하는 컴포넌트
//  - color 값을 카드 테두리, 배경 tint, 제목/불릿 색상에 사용
// -----------------------------------------------------------------------------
function PlatformCard({ title, items, color }) {
  // 플랫폼 색상을 연하게 적용해 카드 배경과 테두리 톤을 맞춤
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
//  - 데스크톱과 모바일에서 서로 다른 조직도 레이아웃 사용
// -----------------------------------------------------------------------------
function OrgChartDesktop() {
  // 데스크톱 조직도
  // - 중앙 트렁크(총회 → 이사회 → 이사장 → 사무국)를 기준으로 감사와 3개 플랫폼을 분기
  return (
    <div className="relative mx-auto w-full max-w-screen-xl">
      <div className="flex flex-col items-center">
        {/* 중앙 트렁크: 총회 → 이사회 → 이사장 */}
        <Node label="조합원총회" />
        <VLine h={22} />
        <Node label="이사회" />
        <VLine h={22} />
        <Node label="이사장" />

        {/* 감사 분기 영역 */}
        <CrossAuditor />

        {/* 사무국 */}
        <VLine h={10} />
        <Node label="사무국" />

        {/* 하단 3대 플랫폼 분기 */}
        <VLine h={16} />
        {/* 3개 플랫폼을 연결하는 가로선 */}
        <div className="h-[2px] w-2/3 mx-auto bg-slate-400" />
        <div className="grid w-full grid-cols-3">
          <div className="flex justify-center"><VLine h={36} /></div>
          <div className="flex justify-center"><VLine h={36} /></div>
          <div className="flex justify-center"><VLine h={36} /></div>
        </div>
      </div>
    </div>
  );
}

// 모바일 조직도
// - 작은 화면에서 조직 흐름을 세로로 이해할 수 있도록 단순화
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

// 모바일 조직도 노드
function MobileNode({ label }) {
  return (
    <div className="inline-flex items-center justify-center rounded-full border border-slate-400 bg-white px-4 h-10 text-gray-800 shadow-sm text-sm">
      {label}
    </div>
  );
}

// 모바일 조직도 세로 연결선
function MobileConnector({ h = 24 }) {
  return (
    <div
      className="w-[2px] bg-slate-400 mx-auto"
      style={{ height: `${h}px`, borderRadius: 2 }}
    />
  );
}

function MobileAuditor() {
  // 중앙 세로 트렁크를 유지하면서 감사 노드만 좌측으로 분기
  const spur = 118; // 중앙 트렁크에서 감사 노드까지의 거리
  const lineColor = "#94A3B8"; // 조직도 연결선 색상
  const H = 56; // 감사 분기 영역 높이
  const mid = Math.floor(H / 2); // 분기선 세로 중앙 좌표

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

// 데스크톱 조직도 세로 연결선
function VLine({ h = 8 }) {
  return (
    <div
      className="w-[2px] bg-slate-400 mx-auto"
      style={{ height: `${h * 4}px` }}
    />
  );
}

// 데스크톱 조직도 노드
function Node({ label, small = false }) {
  const base =
    "inline-flex items-center justify-center rounded-xl border border-slate-400 bg-white px-4 text-gray-800 shadow-sm";
  const size = small
    ? "h-9 text-sm"
    : "h-11 text-base min-w-[96px]";
  return <div className={`${base} ${size}`}>{label}</div>;
}

function CrossAuditor() {
  // 중앙 트렁크에서 감사 노드까지 이어지는 좌측 분기 길이
  const spur = 280; // px
  return (
    <div className="relative w-full h-10">
      {/* 중앙 세로 트렁크 연결부 */}
      <div className="absolute left-1/2 top-0 -translate-x-1/2">
        <VLine h={10} />
      </div>
      {/* 감사 노드로 이어지는 좌측 분기선 */}
      <div
        className="absolute top-1/2 -translate-y-1/2 h-[2px] bg-slate-400"
        style={{ left: `calc(50% - ${spur}px)`, width: `${spur}px` }}
      />
      {/* 감사 노드 */}
      <div
        className="absolute top-1/2 -translate-y-1/2"
        style={{ left: `calc(50% - ${spur}px)` }}
      >
        <Node label="감사" small />
      </div>
    </div>
  );
}

// 표 헤더 셀 공통 컴포넌트
function Th({ children }) {
  return (
    <th className="p-3 text-sm font-semibold text-gray-700">{children}</th>
  );
}

// 표 데이터 셀 공통 컴포넌트
function Td({ children, className = "" }) {
  return (
    <td className={`p-3 text-sm text-gray-700 align-top ${className}`}>{children}</td>
  );
}