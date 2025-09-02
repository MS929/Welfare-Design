// src/pages/business/NeedsSurvey.jsx
import BizLayout from "./_Layout";
import BusinessHero from "./_BusinessHero";

export default function NeedsSurvey() {         // 5. 취약 계층 복지욕구 실태조사   
  return (
    <BizLayout title="취약 계층 복지욕구 실태조사">
      <BusinessHero
        imageSrc="/images/business/needs-survey.png"
        subtitle="현장의 목소리를 데이터로"
        bullets={[
          "설문·심층면접 기반의 기초 조사",
          "생활/건강/이동/돌봄/주거 등 다영역 분석",
          "결과는 공공정책·사업 설계 개선에 반영",
        ]}
        note="조사 참여자 정보는 관련 법령에 따라 철저히 보호됩니다."
        ctaText="조사 참여 의향 등록"
        ctaHref="/apply/survey"
      />

      <div className="max-w-screen-xl mx-auto px-4 mt-10">
        <h3 className="font-semibold text-lg mb-3">조사 개요</h3>
        <ul className="list-disc list-inside space-y-1 text-gray-700">
          <li>기간: 연 1회(필요 시 수시 보완)</li>
          <li>대상: 지역 취약계층 및 보호자</li>
          <li>방법: 온라인/오프라인 병행</li>
        </ul>
      </div>
    </BizLayout>
  );
}
