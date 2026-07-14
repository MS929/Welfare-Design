// -----------------------------------------------------------------------------
// MemberServices.jsx
// [페이지 목적]
//  - 조합원 지원 서비스 안내 페이지
//  - 조합원 지원 서비스 안내 이미지를 중심으로 정보를 전달하는 단일 이미지형 페이지
//
// [화면 구성]
//  - BizLayout 공통 사업 레이아웃 사용
//  - 본문: 조합원 지원 서비스 안내 이미지 표시
//
// [이미지 처리]
//  - public/images/business/member-services.png 정적 이미지 사용
//  - 중요한 안내 이미지이므로 eager/high 옵션으로 우선 로딩
//  - Cloudinary image/fetch 변환은 사용하지 않음
//
// [유지보수 위치]
//  - 안내 이미지 변경: public/images/business/member-services.png 교체
//  - 공통 사업 페이지 구조 변경: BizLayout 수정
// -----------------------------------------------------------------------------

import BizLayout from "./_Layout";

export default function MemberServices() {
  return (
    <>
      {/* 페이지 전용 텍스트 가드 CSS
          - 모바일 브라우저 자동 글자 확대 방지
          - 한글 줄바꿈 및 긴 텍스트 깨짐 방지 */}
      <style
        id="page-text-guard"
        dangerouslySetInnerHTML={{ __html: `
/* 페이지 텍스트/레이아웃 가드 */

/* 모바일 자동 텍스트 확대 방지 */
html {
  -webkit-text-size-adjust: 100%;
  text-size-adjust: 100%;
}

/* 박스 모델 통일 및 긴 텍스트로 인한 레이아웃 깨짐 방지 */
*, *::before, *::after {
  box-sizing: border-box;
  min-width: 0;
  hyphens: manual;
  -webkit-hyphens: manual;
}

/* 본문 기본 가독성 설정 */
body {
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;

  /* 한글/영문 혼합 줄바꿈 안정화 */
  word-break: keep-all;
  overflow-wrap: anywhere;
  -webkit-line-break: after-white-space;
}

/* 제목 줄바꿈 균형 (지원 브라우저 한정) */
h1, h2, .heading-balance {
  text-wrap: balance;
}

/* text-wrap 미지원 브라우저 대응용 fallback */
@supports not (text-wrap: balance) {
  h1, h2, .heading-balance {
    line-height: 1.25;
    max-width: 45ch;
  }
}

/* 하이라이트 스타일 줄바꿈 깨짐 방지 */
mark, [data-hl] {
  -webkit-box-decoration-break: clone;
  box-decoration-break: clone;
  padding: 0 .08em;
  border-radius: 2px;
}

/* ===== 유틸리티 클래스 ===== */

/* 절대 줄바꿈 금지 */
.nowrap {
  white-space: nowrap;
}

/* 어디서든 줄바꿈 허용 (긴 URL/숫자 대응) */
.u-wrap-anywhere {
  overflow-wrap: anywhere;
  word-break: keep-all;
}

/* 한 줄 말줄임 처리 */
.u-ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
        ` }}
      />
      <BizLayout title="조합원 지원 서비스">
      <div className="max-w-screen-xl mx-auto px-4 pb-4 md:pb-0">
        {/* 안내 이미지 영역 */}
        <div className="flex justify-center">
          {/* 조합원 지원 서비스 안내 이미지
              - 핵심 콘텐츠 이미지이므로 우선 로딩 처리 */}
          <div className="w-full max-w-[1050px] mx-auto">
            <img
              src="/images/business/member-services.png?v=2"
              alt="조합원 지원 서비스"
              loading="eager"
              fetchPriority="high"
              decoding="async"
              width="1400"
              height="1000"
              sizes="100vw"
              className="w-full h-auto object-contain rounded-2xl"
              style={{
                imageRendering: 'auto',
                display: 'block',
              }}
            />
          </div>
        </div>
      </div>
    </BizLayout>
    </>
  );
}
