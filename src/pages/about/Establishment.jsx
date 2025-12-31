/**
 * Establishment.jsx (인사말 페이지)
 * - 복지디자인 사회적협동조합의 설립 배경과 비전을 소개하는 정적 콘텐츠 페이지
 * - 긴 텍스트 콘텐츠의 가독성을 최우선으로 고려한 타이포그래피 중심 레이아웃
 * - 모바일/태블릿/데스크톱 환경 모두에서 동일한 읽기 경험을 제공하도록 설계
 */

// 소개 > 인사말 페이지 컴포넌트
export default function AboutGreeting() {
  return (
    <>
      {/* 페이지 전용 텍스트 가독성 보정 스타일
          - 줄바꿈, 하이픈, 자간, 폰트 스무딩을 통합 관리
          - 긴 문단 위주의 콘텐츠에서 모바일 가독성 확보 목적 */}
      <style
        id="page-text-guard"
        dangerouslySetInnerHTML={{ __html: `
/* 모바일 브라우저(iOS Safari 등)의 임의 텍스트 확대/축소를 방지하여
  폰트 크기를 그대로 유지 */
html { -webkit-text-size-adjust: 100%; text-size-adjust: 100%; }

/* 전역 박스 모델 통일 및 텍스트 줄바꿈 안정화
   - flex/grid 내부에서 텍스트가 레이아웃을 밀어내는 현상 방지
   - 자동 하이픈 분리를 비활성화하여 단어 중간 끊김 방지 */
*, *::before, *::after { box-sizing: border-box; min-width: 0; hyphens: manual; -webkit-hyphens: manual; }

/* 긴 문단을 위한 기본 텍스트 렌더링 설정
   - 자간/곡선 렌더링을 가독성 우선으로 처리
   - 단어는 최대한 유지하되, 레이아웃이 깨질 경우에만 줄바꿈 허용
   - iOS Safari에서의 줄바꿈 규칙을 안정화 */
body {
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
  word-break: keep-all;
  overflow-wrap: anywhere;
  -webkit-line-break: after-white-space;
}

/* 제목 텍스트를 시각적으로 균형 잡히게 줄바꿈
   - 최신 브라우저에서 text-wrap: balance 지원 */
h1, h2, .heading-balance { text-wrap: balance; }

/* text-wrap: balance를 지원하지 않는 브라우저를 위한 대체 처리
   - 줄 높이와 최대 글자 수(ch)를 제한하여 제목 가독성 확보 */
@supports not (text-wrap: balance) {
  h1, h2, .heading-balance { line-height: 1.25; max-width: 45ch; }
}

/* 강조(mark/highlight) 텍스트가 줄바꿈 시에도 자연스럽게 보이도록 처리 */
mark, [data-hl] {
  -webkit-box-decoration-break: clone;
  box-decoration-break: clone;
  padding: 0 .08em;
  border-radius: 2px;
}

/* 상황별 텍스트 동작 제어를 위한 유틸 클래스
   - 줄바꿈 금지, 강제 줄바꿈 허용, 말줄임 처리 등 */
.nowrap { white-space: nowrap; }
.u-wrap-anywhere { overflow-wrap: anywhere; word-break: keep-all; }
.u-ellipsis { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        ` }}
      />
      <div className="bg-white">
      {/* 상단 영역: 브레드크럼 + 페이지 제목
          - clamp() 기반 타이포그래피로 화면 크기별 자연스러운 크기 조절 */}
      {/* iOS 노치/상태바 영역을 고려한 safe-area 상단 여백 적용 */}
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

      {/* 본문 영역: 긴 텍스트 콘텐츠를 위한 가독성 최적화 레이아웃 */}
      <section className="px-4 sm:px-5 md:px-6 pb-16">
        {/* 본문 최대 폭을 ch 단위로 제한하여 한 줄 길이를 제어
            - 읽기 속도와 피로도를 낮추기 위한 타이포그래피 설계 */}
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
          {/* 페이지 핵심 메시지를 강조하는 인용구 영역 */}
          <blockquote className="text-center text-gray-700 italic tracking-tight text-[clamp(16px,4.2vw,20px)] leading-[1.65] sm:leading-[1.7] md:leading-relaxed">
            “사람을 향한 사랑의 마음으로, 복지를 디자인하는 따뜻한 연결을 시작합니다.”
          </blockquote>
          <div className="mx-auto mt-3 mb-6 h-[3px] w-10 rounded-full bg-gray-200" />

          {/* 인사말 본문 문단
              - 문단 간 충분한 간격과 line-height로 편안한 읽기 경험 제공 */}
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

          {/* 서명 영역: 인사말 작성자 및 직함 표시 */}
          <div className="mt-9 sm:mt-10 md:mt-12 text-right">
            <p className="text-[clamp(12px,2.9vw,14px)] text-gray-500">복지디자인 사회적협동조합 이사장</p>
            <p className="mt-1 font-semibold tracking-tight text-[clamp(16px,4.6vw,20px)]">신창섭 올림</p>
          </div>
        </div>
      </section>
    </div>
    </>
  );
}
