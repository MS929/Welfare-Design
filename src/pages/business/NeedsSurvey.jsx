// src/pages/business/NeedsSurvey.jsx

import BizLayout from "./_Layout";

export default function NeedsSurvey() {
  return (
    <BizLayout title="취약 계층 복지욕구 실태조사">
      <div className="max-w-screen-xl mx-auto px-4">
        {/* 이미지 + 우측 정보 박스(대여 안내) + 기대효과(대여 안내 박스 아래) */}
        <div className="grid gap-8 md:grid-cols-2 items-stretch">
          {/* 좌측 이미지: JS 동기화 제거, 순수 CSS로 동일 높이 */}
          <div className="rounded-2xl bg-emerald-50 p-4 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.05)] flex items-center justify-center overflow-hidden">
            <img
              src="/images/business/needs-survey.png"
              alt="취약 계층 복지욕구 실태조사"
              className="w-auto max-w-full max-h-[360px] lg:max-h-[420px] rounded-xl object-contain"
            />
          </div>

          {/* 우측: 대여 안내 + 기대효과 + 문의 */}
          <div className="flex flex-col h-full">
            <div className="rounded-xl border border-emerald-200 bg-white shadow-sm p-6">
              <ul className="space-y-4 text-gray-800">
                <li className="flex gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                  <span>
                    취약계층 및 보호자 대상, 설문·심층면접 기반 조사(연 1회,
                    필요시 수시)
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                  <span>결과 공유회, 향후 서비스 개선 반영</span>
                </li>
              </ul>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6 mt-6">
              <h3 className="font-semibold text-lg mb-3">기대 효과</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>
                  취약계층의 복지정보 접근성 강화 및 제도적 권리 실현 지원
                </li>
                <li>
                  실태조사 기반의 복지서비스 품질 향상 및 수요 맞춤형 정책 제안
                </li>
              </ul>
            </div>

            <div className="rounded-xl border border-emerald-300 bg-emerald-50/70 px-6 py-4 shadow-sm mt-6">
              <div className="flex items-center gap-3 text-emerald-900">
                {/* phone icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-5 w-5"
                  aria-hidden="true"
                >
                  <path d="M2.25 6.75c0 7.008 5.742 12.75 12.75 12.75.71 0 1.32-.51 1.44-1.21l.38-2.19a1.5 1.5 0 0 0-1.08-1.71l-2.24-.62a1.5 1.5 0 0 0-1.49.44l-.82.83a10.97 10.97 0 0 1-4.26-4.27l.83-.82a1.5 1.5 0 0 0 .44-1.49l-.62-2.24a1.5 1.5 0 0 0-1.71-1.08l-2.19.38c-.7.12-1.21.73-1.21 1.44Z" />
                </svg>
                <span className="font-semibold tracking-wide">
                  신청 문의 : 복지디자인
                </span>
                <span className="font-bold text-xl tabular-nums">
                  042-000-0000
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BizLayout>
  );
}
