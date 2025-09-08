// src/pages/about/Establishment.jsx
export default function AboutGreeting() {
  return (
    <div className="bg-white">
      {/* 브레드크럼 + 제목 */}
      <section className="max-w-screen-xl mx-auto px-4 pt-10">
        <nav className="text-sm text-gray-500">
          소개 &gt; <span className="text-gray-700">인사말</span>
        </nav>
        <h1 className="mt-4 text-3xl md:text-4xl font-extrabold">인사말</h1>
      </section>

      {/* 헤드라인 문구 */}
      <section className="max-w-screen-md mx-auto px-4 pt-6">
        <blockquote className="text-center text-xl md:text-2xl font-semibold text-teal-700 leading-relaxed whitespace-pre-line">
          {`“사람을 향한 사랑의 마음으로,
            복지를 디자인하는 따뜻한 연결을 시작합니다.”`}
        </blockquote>
      </section>

      {/* 본문 인사말 */}
      <section className="max-w-screen-md mx-auto px-4 py-10">
        <div className="space-y-6 text-gray-800 leading-relaxed">
          <p className="whitespace-pre-line">
            {`안녕하십니까.
              복지디자인 사회적협동조합 이사장 신창섭입니다.
              저희 조합은 한국침례신학대학교 사회복지대학원에서 함께 배움의 시간을 나누었던 12명의 동문들이, 각자의 자리에서 쌓아온 실천 경험과 복지에 대한 사명을 지역사회와 나누고자 모여 설립한 사회적협동조합입니다.`}
          </p>

          <p className="whitespace-pre-line">
            {`20여 년 전,
              “사람을 향한 하나님의 마음”을 가슴에 품고 출발한 우리의 여정은 이제 ‘복지를 디자인하는 실천 플랫폼’으로서 새로운 시작을 맞이하였습니다.`}
          </p>

          <p className="whitespace-pre-line">
            {`복지는 설계할 수 있습니다.
              삶의 크고 작은 결핍 속에서도, 따뜻한 설계와 연결을 통해 누구나 존엄한 삶을 살아갈 수 있다고 믿습니다.
              우리는 단순한 복지 서비스의 제공을 넘어, 의미와 책임, 그리고 소명을 담아 사람 중심의 복지 생태계를 만들어가고자 합니다.`}
          </p>

          <p className="whitespace-pre-line">
            {`복지 디자인 사회적협동조합은,
              보조기기 순환 시스템, 신청 동행, 복지 상담, 전동휠체어 보험료 지원 등 ‘함께 살이 복지연결망’을 기반으로 한 실천적 복지모델을 운영하며 복지 사각지대를 해소하고, 지역 안에서 누구나 복지에 접근할 수 있는 길을 넓혀가고 있습니다.`}
          </p>

          <p className="whitespace-pre-line">
            {`“작지만 깊이 있는 변화”,
              그 출발점이 바로 복지디자인입니다.
              이 따뜻한 변화의 여정에 여러분의 관심과 참여를 부탁드립니다.`}
          </p>

          <div className="mt-6 text-right whitespace-pre-line">
            {`감사합니다.
              복지디자인 사회적협동조합 이사장
              신창섭 올림`}
          </div>
        </div>
      </section>
    </div>
  );
}
