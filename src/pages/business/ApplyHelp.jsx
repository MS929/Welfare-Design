// src/pages/business/ApplyHelp.jsx
import BizLayout from "./_Layout";

export default function ApplyHelp() {
  return (
    <BizLayout title="복지용구 신청 안내 지원">
      <div className="max-w-screen-xl mx-auto px-4">
        {/* 상단: 좌측 이미지 / 우측 안내 박스 */}
        <div className="grid gap-8 md:grid-cols-2 items-stretch">
          {/* 이미지 */}
          <div className="rounded-2xl bg-emerald-50 p-4 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.05)] flex items-center justify-center overflow-hidden h-[400px] lg:h-[460px]">
            <img
              src="/images/business/apply-help.png"
              alt="복지용구 신청 안내 지원"
              className="h-full w-auto max-w-full rounded-xl object-contain"
            />
          </div>
          {/* 안내 박스 (불릿) + 기대 효과 + 상담 문의 배너 */}
          <div className="flex flex-col h-full">
            {/* 안내 박스 */}
            <div className="rounded-xl border border-emerald-200 bg-white shadow-sm p-6">
              <ul className="space-y-4 text-gray-800">
                <li className="flex gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                  <span>
                    장애인등록, 노인장기요양, 긴급복지 등 지원제도 안내
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                  <span>신청 방법/순서/기간/필수서류 체크리스트 제공</span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                  <span>읍면동·구청·국민건강보험공단 등 유관기관 연계</span>
                </li>
              </ul>
            </div>
            {/* 기대 효과 */}
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6 mt-6">
              <h3 className="font-semibold text-lg mb-3">기대 효과</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>
                  취약계층의 복지정보 접근성 강화 및 제도적 권리 실현 지원
                </li>
                <li>보조기기 및 복지용구의 지역 내 순환 체계 구축</li>
              </ul>
            </div>
            {/* 상담 문의 배너 */}
            <div className="rounded-xl border border-emerald-300 bg-emerald-50/70 px-6 py-4 shadow-sm mt-6">
              <div className="flex items-center gap-3 text-emerald-900">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
                  <path d="M2.25 6.75c0 7.008 5.742 12.75 12.75 12.75.71 0 1.32-.51 1.44-1.21l.38-2.19a1.5 1.5 0 0 0-1.08-1.71l-2.24-.62a1.5 1.5 0 0 0-1.49.44l-.82.83a10.97 10.97 0 0 1-4.26-4.27l.83-.82a1.5 1.5 0 0 0 .44-1.49l-.62-2.24a1.5 1.5 0 0 0-1.71-1.08l-2.19.38c-.7.12-1.21.73-1.21 1.44Z" />
                </svg>
                <span className="font-semibold tracking-wide">신청 문의 : 복지디자인</span>
                <span className="font-bold text-xl tabular-nums">042-000-0000</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BizLayout>
  );
}
