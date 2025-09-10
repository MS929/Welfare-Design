// src/pages/business/MemberServices.jsx
import BizLayout from "./_Layout";

export default function MemberServices() {
  return (
    <BizLayout title="조합원 지원 서비스">
      <div className="max-w-screen-xl mx-auto px-4">
        {/* 이미지 + 우측 정보 박스(대여 안내) + 기대효과(대여 안내 박스 아래) */}
        <div className="grid gap-8 md:grid-cols-2 items-stretch">
          {/* 좌측 이미지: JS 동기화 제거, 순수 CSS로 동일 높이 */}
          <div className="rounded-2xl bg-emerald-50 p-4 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.05)] flex items-center justify-center overflow-hidden">
            <img
              src="/images/business/member-services.png"
              alt="조합원 지원 서비스"
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
                    1. 조합원에 대한 상담, 교육·훈련 및 정보 제공 <br></br>
                    - 조합원 맞춤 상담  <br></br>
                    - 기본 및 실무교육 <br></br>
                    - 정보 제공 및 커뮤니티 구축
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                  <span>
                    2. 조합 간 협력을 위한 사업
                    - 외부 네트워크 구축
                    - 내부거래 활성화
                  </span>
                  <li className="flex gap-3">
                    <span className="mt-2 h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                    <span>
                      3. 조합 홍보 및 지역사회를 위한 사업
                      - 주민 대상 홍보캠페인 운영
                      - 사회복지시설 연계 홍보
                    </span>
                  </li>
                </li>
              </ul>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6 mt-6">
              <h3 className="font-semibold text-lg mb-3">기대 효과</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>전문성 및 자립 능력 향상 조합원 역량 강화</li>
                <li>협력 사업을 통해 자원 공유와 공동 성장 가능</li>
                <li>지역사회 문제 해결에 동참하며 공익적 역할 수행을 통한 지역사회 기여</li>
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
