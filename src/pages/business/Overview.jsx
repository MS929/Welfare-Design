// src/pages/business/Overview.jsx
import { Link } from "react-router-dom";
import BizLayout from "./_Layout";

export default function BizOverview() {     // 0. 사업영역
  // 운영 중인 6개 사업 카드
  const programs = [
    {
      to: "/business/rental",
      title: "휠체어 및 복지용구 무료 대여",
      desc: "단기/긴급 대여로 이동권과 일상 회복을 지원합니다.",
      icon: "/images/icons/rental.png",
    },
    {
      to: "/business/apply-help",
      title: "보조기기·복지용구 신청 안내 지원",
      desc: "신청 절차 안내, 서류 준비, 기관 연계까지 동행 지원.",
      icon: "/images/icons/apply-help.png",
    },
    {
      to: "/business/donation",
      title: "보조기기 기증 캠페인",
      desc: "기증–수리–재분배로 순환 시스템을 구축합니다.",
      icon: "/images/icons/donation.png",
    },
    {
      to: "/business/ewc-insurance",
      title: "취약 계층 전동 휠체어 보험금 지원",
      desc: "사고·고장 대비 보험료/보장 연계 지원.",
      icon: "/images/icons/ewc-insurance.png",
    },
    {
      to: "/business/needs-survey",
      title: "취약 계층 복지욕구 실태조사",
      desc: "현장의 요구를 데이터로 수집·분석하여 정책·사업에 반영.",
      icon: "/images/icons/needs-survey.png",
    },
    {
      to: "/business/member-services",
      title: "조합원 지원 서비스",
      desc: "상담·교육·정보제공 등 조합원 전용 프로그램.",
      icon: "/images/icons/member-services.png",
    },
  ];

  return (
    <BizLayout title="사업영역">
      <section>
        <p className="text-gray-700 leading-relaxed">
          복지디자인 사회적협동조합은 이동·건강·경제·정보 접근성 등을 중심으로
          지역 기반 상호부조의 사업을 전개합니다. 아래 프로그램은 현재 운영 중인
          핵심 사업으로, 대상/절차/문의는 각 페이지에서 확인하실 수 있습니다.
        </p>

        {/* 프로그램 카드 그리드 */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {programs.map((p) => (
            <Link
              key={p.to}
              to={p.to}
              className="relative block h-full rounded-2xl border border-[#2CB9B1]/30 bg-white/90 backdrop-blur-[1px] ring-1 ring-inset ring-white/60 shadow-sm hover:shadow-md transition-all duration-200 hover:border-[#2CB9B1]/50 focus:outline-none focus:ring-2 focus:ring-[#2CB9B1]/40"
            >
              <div className="p-5 flex flex-col h-full">
                <div className="flex items-start gap-3">
                  <span className="mt-1 inline-block h-2.5 w-2.5 rounded-full bg-[#F26C2A] shadow-[0_0_0_2px_rgba(242,108,42,0.18)]" />
                  <h4 className="font-semibold text-[17px] text-[#111827] leading-snug">
                    {p.title}
                  </h4>
                </div>
                <p className="text-sm text-gray-600 mt-3 leading-relaxed flex-1">
                  {p.desc}
                </p>
                <span className="inline-flex items-center gap-1 text-[#F26C2A] font-semibold mt-4">
                  자세히 보기
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                    <path d="M13.5 4.5 21 12l-7.5 7.5m7.5-7.5H3" />
                  </svg>
                </span>
              </div>
              <img src={p.icon} alt="" className="w-8 h-8 absolute bottom-3 right-3 opacity-80" />
            </Link>
          ))}
        </div>
      </section>
    </BizLayout>
  );
}
