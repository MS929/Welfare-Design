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
          "수동/전동 휠체어, 보행보조기, 목욕의자 등 기초 복지용구 무상 대여",
          "사용법 안내 및 기초 안전 교육, 필요 시 점검 연계",
          "사전 상담 후 재고·일정 확인, 대여 계약서 작성",
        ]}
        note="대여 기간·품목은 재고 상황에 따라 조정될 수 있습니다."
        ctaText="대여 신청하기"
        ctaHref="/apply/rental"
      />

      <div className="max-w-screen-xl mx-auto px-4 mt-10">
        <h3 className="font-semibold text-lg mb-3">진행 절차</h3>
        <ol className="list-decimal list-inside space-y-1 text-gray-700">
          <li>상담 신청(전화/온라인 폼)</li>
          <li>자격·필요 기기 확인 및 일정 조정</li>
          <li>대여 계약서 작성 · 물품 전달</li>
        </ol>
      </div>
    </BizLayout>
  );
}
