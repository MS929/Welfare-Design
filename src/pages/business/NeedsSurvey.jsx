// src/pages/business/NeedsSurvey.jsx

import BizLayout from "./_Layout";

export default function NeedsSurvey() {
  return (
    <BizLayout title="취약 계층 복지욕구 실태조사">
      <div className="max-w-screen-xl mx-auto px-4 pb-24 md:pb-0">
        {/* 이미지 + 우측 정보 박스(대여 안내) + 기대효과(대여 안내 박스 아래) */}
        <div className="grid gap-8 md:grid-cols-2 items-stretch">
          {/* 좌측 이미지: JS 동기화 제거, 순수 CSS로 동일 높이 */}
          <div className="flex items-center justify-center">
            <img
              src="/images/business/needs-survey.png"
              alt="취약 계층 복지욕구 실태조사"
              className="w-full h-auto max-w-[560px]"
            />
          </div>

          {/* 우측: 대여 안내 + 기대효과 + 문의 */}
          <div className="grid md:h-[440px] lg:h-[470px] grid-rows-[auto,1fr,auto] gap-6 mt-14">
            <div className="rounded-2xl border border-[#2CB9B1]/40 bg-white/90 backdrop-blur-[1px] shadow-md p-7 md:p-8">
              <ul className="space-y-4 text-gray-800 leading-relaxed">
                <li className="flex gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-[#2CB9B1] shadow-[0_0_0_2px_rgba(44,185,177,0.18)] shrink-0" />
                  <span>
                    취약계층 및 보호자 대상, 설문·심층면접 기반 조사(연 1회,
                    필요시 수시)
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-[#2CB9B1] shadow-[0_0_0_2px_rgba(44,185,177,0.18)] shrink-0" />
                  <span>결과 공유회, 향후 서비스 개선 반영</span>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-[#2CB9B1]/30 bg-white/90 backdrop-blur-[1px] shadow-md p-7 md:p-8 h-full flex flex-col justify-center">
              <h3 className="font-semibold text-lg tracking-tight text-[#F26C2A] mb-3">기대 효과</h3>
              <ul className="list-disc list-inside space-y-1.5 text-gray-700 leading-relaxed">
                <li>
                  취약계층의 복지정보 접근성 강화 및 제도적 권리 실현 지원
                </li>
                <li>
                  실태조사 기반의 복지서비스 품질 향상 및 수요 맞춤형 정책 제안
                </li>
              </ul>
            </div>

            <div className="hidden md:block rounded-2xl border border-[#F26C2A]/45 bg-gradient-to-r from-[#FFF3E9] to-[#EFFFFD] px-8 py-5 shadow-md">
              <div className="flex items-center gap-3 text-[#111827] tracking-tight">
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
                <a href="tel:0420000000" className="font-extrabold text-xl md:text-2xl tabular-nums text-[#F26C2A] underline">042-000-0000</a>
              </div>
            </div>
          </div>
        </div>

        {/* 모바일 전용 문의 박스 (PC 영향 없음) */}
        <div className="md:hidden mt-6 mb-24">
          <div className="rounded-2xl border border-[#F26C2A]/45 bg-gradient-to-r from-[#FFF3E9] to-[#EFFFFD] px-6 py-4 shadow-md">
            <div className="flex items-center justify-between gap-4 text-[#111827]">
              <div className="flex items-center gap-2.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-5 w-5 text-[#F26C2A]"
                  aria-hidden="true"
                >
                  <path d="M2.25 6.75c0 7.008 5.742 12.75 12.75 12.75.71 0 1.32-.51 1.44-1.21l.38-2.19a1.5 1.5 0 0 0-1.08-1.71l-2.24-.62a1.5 1.5 0 0 0-1.49.44l-.82.83a10.97 10.97 0 0 1-4.26-4.27l.83-.82a1.5 1.5 0 0 0 .44-1.49l-.62-2.24a1.5 1.5 0 0 0-1.71-1.08l-2.19.38c-.7.12-1.21.73-1.21 1.44Z" />
                </svg>
                <span className="font-semibold tracking-tight text-[#374151]">신청 문의 : 복지디자인</span>
              </div>
              <a
                href="tel:0420000000"
                className="font-extrabold text-lg tabular-nums text-[#F26C2A] underline whitespace-nowrap"
              >
                042-000-0000
              </a>
            </div>
          </div>
        </div>
      </div>
    </BizLayout>
  );
}
