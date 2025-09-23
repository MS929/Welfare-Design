// src/pages/about/Establishment.jsx
export default function AboutGreeting() {
  return (
    <div className="bg-white">
      {/* 상단 : 브레드크럼 + 제목 (유연한 타이포) */}
      <section
        className="max-w-screen-xl mx-auto px-4 sm:px-5 md:px-6 pb-4 pt-6 sm:pt-7 md:pt-10 lg:pt-12"
        style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 64px)' }}
      >
        <nav className="text-[clamp(12px,2.8vw,14px)] text-gray-500">
          소개 &gt; <span className="text-gray-700">인사말</span>
        </nav>
        <h1 className="mt-3 font-extrabold text-gray-900 tracking-tight text-[clamp(22px,5.2vw,34px)]">
          인사말
        </h1>
        <div className="mt-3 h-1.5 w-12 rounded-full bg-[#3BA7A0]/70" />
      </section>

      {/* 본문 : 모든 모바일에 최적화된 가독성 */}
      <section className="px-4 sm:px-5 md:px-6 pb-16">
        <div
          className="mx-auto max-w-[68ch] sm:max-w-[72ch] md:max-w-[76ch]"
          style={{
            letterSpacing: 0,
            fontKerning: "none",
            textRendering: "optimizeLegibility",
            WebkitFontSmoothing: "antialiased",
            MozOsxFontSmoothing: "grayscale",
            wordBreak: "keep-all",
            overflowWrap: "anywhere",
          }}
        >
          {/* 인용구 */}
          <blockquote className="text-center text-gray-700 italic tracking-tight text-[clamp(16px,4.2vw,20px)] leading-[1.65] sm:leading-[1.7] md:leading-relaxed">
            “사람을 향한 사랑의 마음으로, 복지를 디자인하는 따뜻한 연결을 시작합니다.”
          </blockquote>
          <div className="mx-auto mt-3 mb-6 h-[3px] w-10 rounded-full bg-gray-200" />

          {/* 본문 문단 */}
          <div className="space-y-6 text-gray-800 text-[clamp(15px,3.9vw,17.5px)] leading-[1.75] sm:leading-[1.85] md:leading-[1.9]">
            <p>
              안녕하십니까. 복지디자인 사회적협동조합 이사장 <strong>신창섭</strong>입니다. 저희 조합은 한국침례신학대학교 사회복지대학원에서 함께 배움의 시간을 나누었던 12명의 동문들이, 각자의 자리에서 쌓아온 실천 경험과 복지에 대한 사명을 지역사회와 나누고자 모여 설립한 사회적협동조합입니다.
            </p>
            <p>
              20여 년 전 “사람을 향한 하나님의 마음”을 가슴에 품고 출발한 우리의 여정은 이제 <span className="font-semibold">복지를 디자인하는 실천 플랫폼</span>으로서 새로운 시작을 맞이하였습니다.
            </p>
            <p>
              복지는 설계할 수 있다고 믿습니다. 삶의 크고 작은 결핍 속에서도 따뜻한 설계와 연결을 통해 누구나 존엄한 삶을 살아갈 수 있습니다. 우리는 단순한 복지 서비스의 제공을 넘어 의미와 책임, 그리고 소명을 담아 <span className="font-semibold">사람 중심의 복지 생태계</span>를 만들어가고자 합니다.
            </p>
            <p>
              복지디자인 사회적협동조합은 보조기기 순환 시스템, 신청 동행, 복지 상담, 전동휠체어 보험료 지원 등 <span className="font-medium">현장 기반의 복지연결망</span>을 운영하며 복지 사각지대를 해소하고, 지역 안에서 누구나 복지에 접근할 수 있는 길을 넓혀가고 있습니다.
            </p>
            <p>
              “작지만 깊이 있는 변화”, 그 출발점이 바로 복지디자인입니다. 이 따뜻한 변화의 여정에 여러분의 관심과 참여를 부탁드립니다.
            </p>
          </div>

          {/* 서명 블록 */}
          <div className="mt-9 sm:mt-10 md:mt-12 text-right">
            <p className="text-[clamp(12px,2.9vw,14px)] text-gray-500">복지디자인 사회적협동조합 이사장</p>
            <p className="mt-1 font-semibold tracking-tight text-[clamp(16px,4.6vw,20px)]">신창섭 올림</p>
          </div>
        </div>
      </section>
    </div>
  );
}
