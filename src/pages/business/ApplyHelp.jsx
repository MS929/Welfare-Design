// src/pages/business/ApplyHelp.jsx
import BizLayout from "./_Layout";
import ContactBox from "../../components/ContactBox";

export default function ApplyHelp() {
  return (
    <BizLayout title="복지용구 신청 안내 지원">
      <div className="max-w-screen-xl mx-auto px-4 pb-12">
        {/* 상단: 좌측 이미지 / 우측 안내 박스 */}
        <div className="grid gap-8 md:grid-cols-2 items-stretch">
        
          {/* 안내 박스 (불릿) + 기대 효과 + 상담 문의 배너 */}
          <div className="grid md:h-[460px] lg:h-[470px] grid-rows-[auto,auto,auto] md:grid-rows-[auto,1fr,auto] gap-6 mt-12">
            {/* 안내 박스 */}
            <div className="rounded-2xl border border-[#2CB9B1]/40 bg-white/90 backdrop-blur-[1px] shadow-md p-7 md:p-8">
              <ul className="space-y-4 text-gray-800 leading-relaxed">
                <li className="flex gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-[#2CB9B1] shadow-[0_0_0_2px_rgba(44,185,177,0.18)] shrink-0" />
                  <span>
                    장애인등록, 노인장기요양, 긴급복지 등 지원제도 안내
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-[#2CB9B1] shadow-[0_0_0_2px_rgba(44,185,177,0.18)] shrink-0" />
                  <span>신청 방법/순서/기간/필수서류 체크리스트 제공</span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-[#2CB9B1] shadow-[0_0_0_2px_rgba(44,185,177,0.18)] shrink-0" />
                  <span>읍면동·구청·국민건강보험공단 등 유관기관 연계</span>
                </li>
              </ul>
            </div>
            {/* 기대 효과 */}
            <div className="rounded-2xl border border-[#2CB9B1]/30 bg-white/90 backdrop-blur-[1px] shadow-md p-7 md:p-8 md:h-full">
              <h3 className="font-semibold text-lg tracking-tight text-[#F26C2A] mb-3">
                기대 효과
              </h3>
              <ul className="list-disc list-inside space-y-1.5 text-gray-700 leading-relaxed">
                <li>
                  취약계층의 복지정보 접근성 강화 및 제도적 권리 실현 지원
                </li>
                <li>보조기기 및 복지용구의 지역 내 순환 체계 구축</li>
              </ul>
            </div>

            <ContactBox />
          </div>
        </div>
      </div>
    </BizLayout>
  );
}
