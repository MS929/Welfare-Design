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

        {/* 이사장 */}
        <div className="relative w-full">
          <div className="flex justify-center">
            <Node label="이사장" />
          </div>

          {/* 이사장 아래로 수직선 */}
          <div
            className="absolute left-1/2 top-[64px] -translate-x-1/2 w-px bg-gray-300"
            style={{ height: 24 }}
          />

          {/* 이사장 아래 가로 라인(감사/사무국으로 분기되는 메인 버스라인) */}
          <div className="absolute left-0 right-0 top-[88px] h-px bg-gray-300" />

          {/* 가로 라인과 각 노드를 연결하는 수직선들 */}
          {/* 감사(좌측) */}
          <div
            className="absolute left-[12%] top-[88px] -translate-x-1/2 w-px bg-gray-300"
            style={{ height: 24 }}
          />
          {/* 사무국(중앙) */}
          <div
            className="absolute left-1/2 top-[88px] -translate-x-1/2 w-px bg-gray-300"
            style={{ height: 24 }}
          />
        </div>

        {/* 감사 · 사무국 */}
        <div className="grid grid-cols-3 items-start w-full pt-[120px]">
          <div className="flex justify-start pl-4">
            <Node label="감사" small />
          </div>
          <div className="flex justify-center">
            <Node label="사무국" />
          </div>
          <div />
        </div>
      </div>
    </div>
  );
}

/* =============== UI 작은 부품 =============== */
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
