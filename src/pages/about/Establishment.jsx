// -----------------------------------------------------------------------------
// Establishment.jsx
// [페이지 목적]
//  - 소개 > 인사말 페이지
//  - 복지디자인 사회적협동조합의 설립 배경, 가치, 비전, 주요 활동을 소개
//
// [콘텐츠 특성]
//  - CMS가 아닌 코드 내부 정적 문구로 관리
//  - 인용구, 본문 문단, 이사장 서명 영역으로 구성
//
// [가독성 처리]
//  - 본문 최대 폭을 ch 단위로 제한해 한 줄 길이를 조절
//  - 데스크톱은 양쪽 정렬, 모바일은 왼쪽 정렬 적용
//  - 페이지 전용 text guard CSS로 모바일 자동 확대와 줄바꿈 문제 완화
//
// [유지보수 위치]
//  - 인사말 문구 수정: 본문 <p> 요소 수정
//  - 이사장명/직함 수정: 하단 서명 영역 수정
//  - 본문 폭/행간 수정: 본문 컨테이너 className 및 greeting-body-text CSS 수정
// -----------------------------------------------------------------------------

// 인사말 페이지 컴포넌트
export default function AboutGreeting() {
  return (
    <>
      {/* 페이지 전용 텍스트 가드 CSS
          - 모바일 브라우저 자동 글자 확대 방지
          - 한글 줄바꿈, 제목 균형, 본문 정렬을 페이지 단위로 보정 */}
      <style
        id="page-text-guard"
        dangerouslySetInnerHTML={{
          __html: `
/* 모바일 자동 텍스트 확대 방지 */
html {
  -webkit-text-size-adjust: 100%;
  text-size-adjust: 100%;
}

/* 박스 모델 통일 및 긴 텍스트 레이아웃 안정화 */
*, *::before, *::after {
  box-sizing: border-box;
  min-width: 0;
  hyphens: manual;
  -webkit-hyphens: manual;
}

/* 본문 기본 가독성 및 줄바꿈 설정 */
body {
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
  word-break: keep-all;
  overflow-wrap: anywhere;
  -webkit-line-break: after-white-space;
}

/* 제목 줄바꿈 균형 */
h1, h2, .heading-balance {
  text-wrap: balance;
}

/* text-wrap 미지원 브라우저 대체 처리 */
@supports not (text-wrap: balance) {
  h1, h2, .heading-balance {
    line-height: 1.25;
    max-width: 45ch;
  }
}

/* 하이라이트 줄바꿈 처리 */
mark, [data-hl] {
  -webkit-box-decoration-break: clone;
  box-decoration-break: clone;
  padding: 0 .08em;
  border-radius: 2px;
}

/* 줄바꿈/말줄임 유틸 클래스 */
.nowrap {
  white-space: nowrap;
}

.u-wrap-anywhere {
  overflow-wrap: anywhere;
  word-break: keep-all;
}

.u-ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 인사말 본문 정렬
   - 데스크톱: 양쪽 정렬
   - 모바일: 왼쪽 정렬 */
.greeting-body-text {
  text-align: justify;
  text-align-last: left;
  word-break: keep-all;
  overflow-wrap: normal;
}

@media (max-width: 640px) {
  .greeting-body-text {
    text-align: left;
    text-align-last: auto;
    word-break: keep-all;
    overflow-wrap: break-word;
  }
}
        `,
        }}
      />

      <div className="bg-white relative overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: "radial-gradient(#3BA7A0 1px, transparent 1px)",
            backgroundSize: "26px 26px",
          }}
        />

        {/* 상단 영역: 현재 위치 안내(브레드크럼)와 페이지 제목 */}
        <section
          className="max-w-screen-xl mx-auto px-4 sm:px-5 md:px-6 pb-4 pt-4 sm:pt-5 md:pt-7 lg:pt-8"
          style={{
            paddingTop: "calc(env(safe-area-inset-top, 0px) + 64px)",
          }}
        >
          <nav className="text-[clamp(12px,2.8vw,14px)] text-gray-500">
            소개 &gt; <span className="text-gray-700">인사말</span>
          </nav>

          <h1 className="mt-3 font-extrabold text-gray-900 tracking-tight text-[clamp(22px,5.2vw,34px)]">
            인사말
          </h1>

          <div className="mt-3 h-1.5 w-12 rounded-full bg-[#3BA7A0]/70" />
        </section>

        {/* 인사말 본문 영역 */}
        <section className="px-4 sm:px-5 md:px-6 pb-16">
          {/* 본문 최대 폭을 제한해 읽기 편한 줄 길이 유지 */}
          <div
            className="mx-auto max-w-[62ch] sm:max-w-[66ch] md:max-w-[70ch]"
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
            {/* 페이지 핵심 메시지 인용구 */}
            <blockquote className="text-left text-gray-700 italic tracking-tight text-[clamp(16px,4.2vw,20px)] leading-[1.75] sm:leading-[1.8] md:leading-[1.85] break-keep">
              “사람을 향한 사랑의 마음으로, 복지를 디자인하는 따뜻한 연결을
              시작합니다.”
            </blockquote>

            <div className="mt-4 mb-8 h-[2px] w-full rounded-full bg-gradient-to-r from-[#3BA7A0]/45 via-[#3BA7A0]/20 to-transparent" />

            {/* 인사말 본문 문단 */}
            <div className="greeting-body-text space-y-8 text-gray-900 text-[clamp(15px,3.9vw,17.5px)] leading-[1.75] sm:leading-[1.85] md:leading-[1.9]">
              <p>
                안녕하십니까. 복지디자인 사회적협동조합 이사장{" "}
                <strong>신창섭</strong>입니다. 저희 조합은 한국침례신학대학교
                사회복지대학원에서 함께 배움의 시간을 나누었던 12명의 동문들이,
                각자의 자리에서 쌓아온 실천 경험과 복지에 대한 사명을 지역사회와
                나누고자 모여 설립한 사회적협동조합입니다.
              </p>

              <p>
                20여 년 전 “사람을 향한 하나님의 마음”을 가슴에 품고 출발한
                우리의 여정은 이제{" "}
                <span className="font-semibold">
                  복지를 디자인하는 실천 플랫폼
                </span>
                으로서 새로운 시작을 맞이하였습니다.
              </p>

              <p>
                복지는 설계할 수 있다고 믿습니다. 삶의 크고 작은 결핍 속에서도
                따뜻한 설계와 연결을 통해 누구나 존엄한 삶을 살아갈 수 있습니다.
                우리는 단순한 복지 서비스의 제공을 넘어 의미와 책임, 그리고
                소명을 담아{" "}
                <span className="font-semibold">사람 중심의 복지 생태계</span>를
                만들어가고자 합니다.
              </p>

              <p>
                복지디자인 사회적협동조합은 보조기기 순환 시스템, 신청 동행,
                복지 상담, 전동휠체어 보험료 지원 등{" "}
                <span className="font-medium">현장 기반의 복지연결망</span>을
                운영하며 복지 사각지대를 해소하고, 지역 안에서 누구나 복지에
                접근할 수 있는 길을 넓혀가고 있습니다.
              </p>

              <p>
                “작지만 깊이 있는 변화”, 그 출발점이 바로 복지디자인입니다. 이
                따뜻한 변화의 여정에 여러분의 관심과 참여를 부탁드립니다.
              </p>
            </div>

            {/* 이사장 서명 영역
                - 직함 또는 이름 변경 시 이 영역의 문구를 함께 수정 */}
            <div className="mt-14 pt-6 border-t border-gray-100 text-right">
              <p className="text-[clamp(12px,2.9vw,14px)] text-gray-500">
                복지디자인 사회적협동조합 이사장
              </p>

              <p className="mt-1 font-semibold tracking-tight text-[clamp(16px,4.6vw,20px)]">
                신창섭 올림
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
