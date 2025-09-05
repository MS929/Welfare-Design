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

/* =============== 조직도 =============== */
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
            style={{ left: "14%", top: 88, height: 56 }}
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

        {/* 감사 / 사무국 노드 (버스라인 아래에 배치) */}
        <div className="grid grid-cols-3 items-start w-full pt-[168px]">
          <div className="flex justify-start pl-6">
            <Node label="감사" small />
          </div>
          <div className="flex justify-center">
            <Node label="사무국" />
          </div>
          <div />
        </div>

        {/* 플랫폼 3개 노드 (버스라인에서 3갈래로 연결된 박스) */}
        <div className="grid grid-cols-3 gap-6 w-full mt-8">
          <div className="flex justify-center">
            <Node label="복지연결플랫폼" wide />
          </div>
          <div className="flex justify-center">
            <Node label="복지디자인연구소" wide />
          </div>
          <div className="flex justify-center">
            <Node label="협력운영플랫폼" wide />
          </div>
        </div>
      </div>
    </div>
  );
}

/* =============== UI 부품 =============== */
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
