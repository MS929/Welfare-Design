// src/pages/business/EwcInsurance.jsx
import BizLayout from "./_Layout";
import BusinessHero from "./_BusinessHero";

export default function EwcInsurance() {    // 4. 취약 계층 전동휠체어 보험금 지원
  return (
    <BizLayout title="취약 계층 전동휠체어 보험금 지원">
      <BusinessHero
        imageSrc="/images/business/ewc-insurance.png"
        subtitle="사고·고장 대비, 안전한 이동 생활"
        bullets={[
          "저소득/취약가정 전동휠체어 보험료 일부 지원",
          "안전 점검·유지관리 교육 연계",
          "사례관리 기관과 협력하여 규모 확대 추진",
        ]}
        note="지원 기준과 기간은 예산 및 후원 상황에 따라 공지됩니다."
        ctaText="지원 신청하기"
        ctaHref="/apply/insurance"
      />

      <div className="max-w-screen-xl mx-auto px-4 mt-10">
        <h3 className="font-semibold text-lg mb-3">신청 안내</h3>
        <ul className="list-disc list-inside space-y-1 text-gray-700">
          <li>대상: 전동휠체어를 사용하는 취약계층</li>
          <li>방법: 온라인 폼/기관 추천/내방 접수</li>
          <li>심사: 소득, 사용환경, 위험도 등을 종합 검토</li>
        </ul>
      </div>
    </BizLayout>
  );
}
