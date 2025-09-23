// src/pages/business/EwcInsurance.jsx
import BizLayout from "./_Layout";

export default function EwcInsurance() {
  return (
    <BizLayout title="취약 계층 전동휠체어 보험금 지원">
      <div className="max-w-screen-xl mx-auto px-4">
        {/* 이미지 + 우측 정보 박스(대여 안내) + 기대효과(대여 안내 박스 아래) */}
        <div className="grid gap-8 md:grid-cols-2 items-stretch">
          {/* 좌측 이미지: JS 동기화 제거, 순수 CSS로 동일 높이 */}
          <div className="flex items-center justify-center">
            <img
              src="/images/business/ewc-insurance.png"
              alt="취약 계층 전동휠체어 보험금 지원"
            />
          </div>

          {/* 우측: 대여 안내 + 기대효과 + 문의 */}
          <div className="grid h-[440px] lg:h-[470px] grid-rows-[auto,1fr,auto] gap-6 mt-14">
            <div className="rounded-2xl border border-[#2CB9B1]/40 bg-white/90 backdrop-blur-[1px] shadow-md p-7 md:p-8">
              <ul className="space-y-4 pt-2 text-gray-800 leading-relaxed">
                <li className="flex gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-[#2CB9B1] shadow-[0_0_0_2px_rgba(44,185,177,0.18)] shrink-0" />
                  <span>저소득 취약계층 전동휠체어 사용자 대상 보험료 일부 지원</span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-[#2CB9B1] shadow-[0_0_0_2px_rgba(44,185,177,0.18)] shrink-0" />
                  <span>사례관리 기관과 협력하여 대상자 발굴 및 기존 사업과 연계하여 지원</span>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-[#2CB9B1]/30 bg-white/90 backdrop-blur-[1px] shadow-md p-7 md:p-8 h-full flex flex-col justify-center">
              <h3 className="font-semibold text-lg tracking-tight text-[#F26C2A] mb-3">기대 효과</h3>
              <ul className="list-disc list-inside pt-2 space-y-1.5 text-gray-700 leading-relaxed">
                <li>
                  취약계층의 복지정보 접근성 강화 및 제도적 권리 실현 지원
                </li>
                <li>전동보장구 이용자의 안전망 확보 및 사고 예방</li>
              </ul>
            </div>

            <div className="block md:hidden rounded-2xl border border-[#F26C2A]/45 bg-gradient-to-r from-[#FFF3E9] to-[#EFFFFD] px-8 py-5 shadow-md mb-12">
              <div className="flex items-center gap-3 text-[#111827] tracking-tight">
                {/* phone icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-5 w-5 text-[#F26C2A]"
                  aria-hidden="true"
                >
                  <path d="M2.25 6.75c0 7.008 5.742 12.75 12.75 12.75.71 0 1.32-.51 1.44-1.21l.38-2.19a1.5 1.5 0 0 0-1.08-1.71l-2.24-.62a1.5 1.5 0 0 0-1.49.44l-.82.83a10.97 10.97 0 0 1-4.26-4.27l.83-.82a1.5 1.5 0 0 0 .44-1.49l-.62-2.24a1.5 1.5 0 0 0-1.71-1.08l-2.19.38c-.7.12-1.21.73-1.21 1.44Z" />
                </svg>
                <span className="font-semibold tracking-wide text-[#374151]">
                  신청 문의 : 복지디자인
                </span>
                <a href="tel:0420000000" className="font-extrabold text-xl md:text-2xl tabular-nums text-[#F26C2A] underline">
                  042-000-0000
                </a>
              </div>
            </div>

            <div className="hidden md:block rounded-2xl border border-[#F26C2A]/45 bg-gradient-to-r from-[#FFF3E9] to-[#EFFFFD] px-8 py-5 shadow-md mb-12 md:mb-0">
              <div className="flex items-center gap-3 text-[#111827] tracking-tight">
                {/* phone icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-5 w-5 text-[#F26C2A]"
                  aria-hidden="true"
                >
                  <path d="M2.25 6.75c0 7.008 5.742 12.75 12.75 12.75.71 0 1.32-.51 1.44-1.21l.38-2.19a1.5 1.5 0 0 0-1.08-1.71l-2.24-.62a1.5 1.5 0 0 0-1.49.44l-.82.83a10.97 10.97 0 0 1-4.26-4.27l.83-.82a1.5 1.5 0 0 0 .44-1.49l-.62-2.24a1.5 1.5 0 0 0-1.71-1.08l-2.19.38c-.7.12-1.21.73-1.21 1.44Z" />
                </svg>
                <span className="font-semibold tracking-wide text-[#374151]">
                  신청 문의 : 복지디자인
                </span>
                <a href="tel:0420000000" className="font-extrabold text-xl md:text-2xl tabular-nums text-[#F26C2A] underline">
                  042-000-0000
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BizLayout>
  );
}
