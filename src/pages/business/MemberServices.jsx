// src/pages/business/MemberServices.jsx
import BizLayout from "./_Layout";
import BusinessHero from "./_BusinessHero";

export default function MemberServices() {      // 6. 조합원을 지원하는 서비스
  return (
    <BizLayout title="조합원 지원 서비스">
      <BusinessHero
        imageSrc="/images/business/member-services.png"
        subtitle="함께 배우고 성장하는 커뮤니티"
        bullets={[
          "조합원 대상 상담, 교육·훈련, 정보제공 프로그램",
          "자조모임/네트워킹/사례공유 정기 운영",
          "교육 수료 시 역량강화 인증서 발급(일부 과정)",
        ]}
        note="프로그램 일정은 공지사항과 뉴스레터로 안내합니다."
        ctaText="프로그램 일정 보기"
        ctaHref="/news/notices"
      />

      <div className="max-w-screen-xl mx-auto px-4 mt-10">
        <h3 className="font-semibold text-lg mb-3">운영 형태</h3>
        <ul className="list-disc list-inside space-y-1 text-gray-700">
          <li>오프라인 소규모 워크숍 · 특강</li>
          <li>온라인 라이브/녹화 강의</li>
          <li>분기별 네트워킹 데이</li>
        </ul>
      </div>
    </BizLayout>
  );
}
