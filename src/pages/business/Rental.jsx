// src/pages/business/Rental.jsx
import BizLayout from "./_Layout";
import BusinessHero from "./_BusinessHero";

export default function Rental() {    // 1. 휠체어 및 복지용구 무료 대여
  return (
    <BizLayout title="휠체어 및 복지용구 무료 대여">
      <BusinessHero
        imageSrc="/images/business/rental.png"
        subtitle="단기·긴급 상황의 이동권 보장"
        bullets={[
          "수동/전동 휠체어, 보행보조기, 목욕의자 등 기초 복지용구 무료 대여",
          "사전 연락 후 재고 확인 및 대여 대장 작성",
          "사용법 안내 및 기초 안전 교육",
          "기본 7일 대여, 1회 연장 가능(최대 14일)",
        ]}
      />

      <div className="max-w-screen-xl mx-auto px-4 mt-8">
        <p className="text-gray-700">
          <span className="font-medium">신청 문의</span>: 복지디자인{" "}
          <a href="tel:0420000000" className="underline underline-offset-2">
            042-000-0000
          </a>
        </p>
      </div>

      {/* 기대 효과 */}
      <div className="max-w-screen-xl mx-auto px-4 mt-10">
        <h3 className="font-semibold text-lg mb-3">기대 효과</h3>
        <ul className="list-disc list-inside space-y-1 text-gray-700">
          <li>복지 사각지대 해소 및 취약계층 복지 접근성 강화</li>
          <li>지역 복지 자원의 선순환 구조 형성</li>
          <li>협력기관 및 조합원과의 지속 가능한 복지 파트너십 구축</li>
        </ul>
      </div>
    </BizLayout>
  );
}
