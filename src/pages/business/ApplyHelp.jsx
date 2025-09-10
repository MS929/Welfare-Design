// src/pages/business/ApplyHelp.jsx
import BizLayout from "./_Layout";

export default function ApplyHelp() {
  return (
    <BizLayout title="복지용구 신청 안내 지원">
      <div className="max-w-screen-xl mx-auto px-4">
        {/* 상단: 좌측 이미지 / 우측 안내 박스 */}
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* 이미지 */}
          <div className="rounded-2xl bg-emerald-50 p-4 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.05)] flex items-center justify-center overflow-hidden">
            <div className="w-[clamp(380px,40vw,360px)] aspect-[4/5]">
              <img
                src="/images/business/apply-help.png"
                alt="복지용구 신청 안내 지원"
                className="w-full h-full object-contain rounded-xl"
              />
            </div>
          </div>
          {/* 안내 박스 (불릿) + 기대 효과 + 상담 문의 배너 */}
          <div className="flex flex-col gap-7 h-full">
            {/* 안내 박스 */}
            <div className="rounded-2xl border border-emerald-200 bg-white p-8">
              <ul className="space-y-5 text-gray-800">
                <li className="flex gap-3">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-emerald-500" />
                  <span>
                    장애인등록, 노인장기요양, 긴급복지 등 지원제도 안내
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-emerald-500" />
                  <span>신청 방법/순서/기간/필수서류 체크리스트 제공</span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-emerald-500" />
                  <span>읍면동·구청·국민건강보험공단 등 유관기관 연계</span>
                </li>
              </ul>
            </div>
            {/* 기대 효과 */}
            <div className="rounded-2xl border border-emerald-200 bg-white p-8">
              <h3 className="font-semibold text-gray-900 mb-4">기대 효과</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>
                  취약계층의 복지정보 접근성 강화 및 제도적 권리 실현 지원
                </li>
                <li>보조기기 및 복지용구의 지역 내 순환 체계 구축</li>
              </ul>
            </div>
            {/* 상담 문의 배너 */}
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-7 flex items-center gap-3">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-emerald-600 text-white">
                ☎
              </span>
              <p className="text-gray-800">
                상담 문의 : <strong>복지디자인</strong>{" "}
                <a href="tel:0420000000" className="font-bold text-gray-900">
                  042-000-0000
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </BizLayout>
  );
}
