// src/pages/business/ApplyHelp.jsx
import BizLayout from "./_Layout";
import BusinessHero from "./_BusinessHero";

export default function ApplyHelp() {   // 2. 복지용구 신청 안내 지원
  return (
    <BizLayout title="복지용구 신청 안내 지원">
      <BusinessHero
        imageSrc="/images/business/apply-help.png"
        subtitle="절차 안내부터 서류 준비, 기관 연계까지"
        bullets={[
          "장애인등록, 노인장기요양, 긴급복지 등 지원제도 안내",
          "신청 방법/순서/기간/필수서류 체크리스트 제공",
          "읍면동·구청·국민건강보험공단 등 유관기관 연계",
        ]}
        note="개별 상담 후 개인 상황에 맞춘 경로를 안내합니다."
        ctaText="상담 예약하기"
        ctaHref="/apply/consult"
      />

      <div className="max-w-screen-xl mx-auto px-4 mt-10">
        <h3 className="font-semibold text-lg mb-3">진행 절차</h3>
        <ol className="list-decimal list-inside space-y-1 text-gray-700">
          <li>사전 상담 · 기초정보 확인</li>
          <li>적합한 제도 탐색(요건/서류/기간/절차)</li>
          <li>접수기관 연결 및 결과 안내</li>
        </ol>
      </div>
    </BizLayout>
  );
}
