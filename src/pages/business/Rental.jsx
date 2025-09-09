// src/pages/business/Rental.jsx
// src/pages/business/Rental.jsx
import BizLayout from "./_Layout";

export default function Rental() { // 1. 휠체어 및 복지용구 무료 대여
  return (
    <BizLayout title="휠체어 및 복지용구 무료 대여">
      <div className="max-w-screen-xl mx-auto px-4">
        {/* 이미지 + 우측 정보 박스(대여 안내) + 기대효과(우측 박스 아래) */}
        <div className="grid gap-8 md:grid-cols-2 items-start">
          {/* 좌측 이미지 */}
          <div className="rounded-2xl bg-emerald-50/40 p-4 md:p-6 shadow-inner">
            <img
              src="/images/business/rental.png"
              alt="휠체어 및 복지용구 무료 대여"
              className="w-full h-auto rounded-xl border border-emerald-100"
            />
          </div>

          {/* 우측: 대여 안내 박스 */}
          <div>
            <div className="rounded-xl border border-emerald-200 bg-white shadow-sm p-6">
              <ul className="space-y-4 text-gray-800">
                <li className="flex gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                  <span>수동/전동 휠체어, 보행보조기, 목욕의자 등 기초 복지용구 무료 대여</span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                  <span>사전 연락 후 재고 확인 및 대여 대장 작성</span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                  <span>사용법 안내 및 기초 안전 교육</span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                  <span>기본 7일 대여, 1회 연장 가능(최대 14일)</span>
                </li>
              </ul>
            </div>

            {/* 우측: 기대 효과 박스 (대여 안내 박스 바로 아래) */}
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6 mt-6">
              <h3 className="font-semibold text-lg mb-3">기대 효과</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>복지 사각지대 해소 및 취약계층 복지 접근성 강화</li>
                <li>지역 복지 자원의 선순환 구조 형성</li>
                <li>협력기관 및 조합원과의 지속 가능한 복지 파트너십 구축</li>
              </ul>
              <p className="text-gray-700 mt-6">
                <span className="font-medium">신청 문의</span>: 복지디자인{" "}
                <a href="tel:0420000000" className="underline underline-offset-2">
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
