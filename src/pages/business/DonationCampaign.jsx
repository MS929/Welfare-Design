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
          "지역 주민과 단체를 대상으로 보조기기 기증 캠페인 실시",
          "주민센터 및 공공기관 대상 장애인 인식개선 캠페인 연 2회 진행",
        ]}
        note="기증하실 물품의 상태를 사진으로 보내주시면 확인 후 안내드립니다."
        ctaText="기증 문의하기"
        ctaHref="/apply/donate"
      />

      <section className="max-w-screen-xl mx-auto px-4 mt-8">
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-6">
          <h3 className="font-semibold text-lg mb-3 text-gray-900">기대 효과</h3>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            <li>취약계층의 복지정보 접근성 강화 및 제도적 권리 실현 지원</li>
            <li>장애인에 대한 지역사회 인식 개선 및 복지문화 조성</li>
          </ul>
        </div>
      </section>
    </BizLayout>
  );
}
