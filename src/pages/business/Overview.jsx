// src/pages/business/Overview.jsx
import { Link } from "react-router-dom";
import BizLayout from "./_Layout";

export default function BizOverview() {
  // 운영 중인 6개 사업 카드
  const programs = [
    {
      to: "/business/rental",
      title: "휠체어 및 복지용구 무료 대여",
      desc: "단기/긴급 대여로 이동권과 일상 회복을 지원합니다.",
    },
    {
      to: "/business/apply-help",
      title: "보조기기·복지용구 신청 안내 지원",
      desc: "신청 절차 안내, 서류 준비, 기관 연계까지 동행 지원.",
    },
    {
      to: "/business/donation",
      title: "보조기기 기증 캠페인",
      desc: "기증–수리–재분배로 순환 시스템을 구축합니다.",
    },
    {
      to: "/business/ewc-insurance",
      title: "취약 계층 전동 휠체어 보험금 지원",
      desc: "사고·고장 대비 보험료/보장 연계 지원.",
    },
    {
      to: "/business/needs-survey",
      title: "취약 계층 복지욕구 실태조사",
      desc: "현장의 요구를 데이터로 수집·분석하여 정책·사업에 반영.",
    },
    {
      to: "/business/member-services",
      title: "조합원 지원 서비스",
      desc: "상담·교육·정보제공 등 조합원 전용 프로그램.",
    },
  ];

  return (
    <BizLayout title="사업영역">
      {/* 소개 문단 */}
      <section>
        <p className="text-gray-700 leading-relaxed">
          복지디자인 사회적협동조합은 이동·건강·경제·정보 접근성 등을 중심으로
          지역 기반 상호부조의 사업을 전개합니다. 아래 프로그램은 현재 운영 중인
          핵심 사업으로, 대상/절차/문의는 각 페이지에서 확인하실 수 있습니다.
        </p>

        {/* 프로그램 카드 그리드 */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((p) => (
            <Link
              key={p.to}
              to={p.to}
              className="block rounded-2xl border p-5 bg-white hover:bg-gray-50"
            >
              <h4 className="font-semibold">{p.title}</h4>
              <p className="text-sm text-gray-600 mt-2">{p.desc}</p>
              <span className="inline-block mt-4 text-sm text-sky-600">
                자세히 보기 →
              </span>
            </Link>
          ))}
        </div>
      </section>
    </BizLayout>
  );
}
