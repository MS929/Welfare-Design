function OrgChartMobile() {
  return (
    <div className="max-w-screen-sm mx-auto flex flex-col items-center gap-3 px-4">
      <MobileNode label="조합원총회" />
      <MobileConnector h={28} />
      <MobileNode label="이사회" />
      <MobileConnector h={28} />
      <MobileNode label="이사장" />
      <MobileConnector h={28} />
      <MobileNode label="사무국" />

      {/* connector from 사무국 down to platform cards (no boxes) */}
      <MobileConnector h={64} />
    </div>
  );
}

export default function AboutPeople() {
  return <OrgChartMobile />;
}