// -----------------------------------------------------------------------------
// ApplyHelp.jsx
// [페이지 목적]
//  - 노인장기요양보험 복지용구 안내 페이지
//  - 복지용구 신청 안내 이미지를 중심으로 정보를 전달하는 단일 이미지형 페이지
//
// [화면 구성]
//  - BizLayout 공통 사업 레이아웃 사용
//  - 본문: 복지용구 안내 이미지 표시
//
// [이미지 처리]
//  - public/images/business/apply-help.png 정적 이미지 사용
//  - 중요한 안내 이미지이므로 eager/high 옵션으로 우선 로딩
//  - Cloudinary image/fetch 변환은 사용하지 않음
//
// [유지보수 위치]
//  - 안내 이미지 변경: public/images/business/apply-help.png 교체
//  - 공통 사업 페이지 구조 변경: BizLayout 수정
// -----------------------------------------------------------------------------
import BizLayout from "./_Layout";

export default function ApplyHelp() {
  // 페이지 제목 및 대표 이미지 대체 텍스트
  const PAGE_TITLE = "노인장기요양보험 복지용구";
  const HERO_ALT = "노인장기요양보험 복지용구";

  return (
    <>
      {/* 페이지 전용 텍스트 가드 CSS
          - 모바일 브라우저 자동 글자 확대 방지
          - 한글 줄바꿈 및 긴 텍스트 깨짐 방지 */}
      <style
        id="page-text-guard"
        dangerouslySetInnerHTML={{ __html: `
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
  word-break: keep-all;
  overflow-wrap: anywhere;
  -webkit-line-break: after-white-space;
}

/* 제목 줄바꿈 균형 */
h1, h2, .heading-balance {
  text-wrap: balance;
}

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

/* 줄바꿈/말줄임 제어 유틸 클래스 */
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
        ` }}
      />
      {/* 사업 페이지 공통 레이아웃 */}
      <BizLayout title={PAGE_TITLE}>
      <div className="max-w-screen-xl mx-auto px-4 pb-8">
        {/* 안내 이미지 영역 */}
        {/* 노인장기요양보험 복지용구 안내 이미지
            - 핵심 콘텐츠 이미지이므로 우선 로딩 처리 */}
        <img
          src="/images/business/apply-help.png?v=20260522-applyhelp"
          alt={HERO_ALT}
          loading="eager"
          fetchPriority="high"
          decoding="async"
          width="1400"
          height="1000"
          sizes="100vw"
          className="w-full h-auto object-contain rounded-2xl"
          style={{
            imageRendering: "auto",
            display: "block",
          }}
        />
      </div>
    </BizLayout>
    </>
  );
}
