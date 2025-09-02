// src/pages/business/Donation.jsx
import BizLayout from "./_Layout";
import BusinessHero from "./_BusinessHero";

export default function Donation() {    // 3. 보조기기 기증 및 장애인 인식개선 캠페인
  return (
    <BizLayout title="보조기기 기증 캠페인">
      <BusinessHero
        imageSrc="/images/business/donation.png"
        subtitle="순환과 나눔으로 이동권을 회복합니다"
        bullets={[
          "지역 주민·단체 대상 보조기기 기증 캠페인 연 2회",
          "점검/세척/경정비 후 필요 가정에 재분배",
          "주민센터·공공기관과 협업하여 인식개선 활동",
        ]}
        note="기증하실 물품의 상태를 사진으로 보내주시면 확인 후 안내드립니다."
        ctaText="기증 문의하기"
        ctaHref="/apply/donate"
      />

      <div className="max-w-screen-xl mx-auto px-4 mt-10">
        <h3 className="font-semibold text-lg mb-3">기증 가능 품목</h3>
        <ul className="list-disc list-inside space-y-1 text-gray-700">
          <li>수동/전동 휠체어, 보행보조기, 목욕의자, 안전손잡이 등</li>
          <li>기초 소모품은 재분배 전 교체합니다.</li>
        </ul>
      </div>
    </BizLayout>
  );
}
