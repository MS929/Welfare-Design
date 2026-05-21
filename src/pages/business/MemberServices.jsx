// -----------------------------------------------------------------------------
// [페이지 목적]
//  - 조합원 지원 서비스(상담/교육/정보제공/협력/홍보) 안내 페이지
//  - 좌측: 대표 이미지
//  - 우측: 서비스 항목 → 기대 효과 → 전화 문의 배너
//
// [이미지 최적화 전략]
//  - 모바일: Cloudinary image/fetch로 AVIF/WEBP + srcset 제공(용량 절감)
//  - 태블릿/데스크탑: 로컬 PNG 사용(화질 고정 + 캐시 안정성)
//
// [UX/레이아웃 포인트]
//  - 이미지/텍스트 높이 맞춤을 CSS Grid로 처리하여 불필요한 JS 동기화 제거
//  - 문의 배너는 md 기준으로 PC/모바일을 분리 렌더링해 줄바꿈/깨짐 방지
//
// [텍스트 깨짐 방지]
//  - 페이지 전용 style 주입으로 모바일 텍스트 확대/줄바꿈 이슈 최소화
// -----------------------------------------------------------------------------

// 사업(Business) 섹션 공통 레이아웃(브레드크럼 + 제목 + 컨텐츠 컨테이너)
import BizLayout from "./_Layout";

export default function MemberServices() {
  // ---------------------------------------------------------------------------
  // Cloudinary image/fetch용 URL 구성
  //  - ORIGIN: SSR 환경에서 window가 없을 수 있어 안전한 기본 도메인으로 대체
  //  - RAW: 로컬 정적 이미지 경로를 절대 URL로 변환(Cloudinary fetch 입력값)
  //  - cld/cldM: 폭(w)과 포맷(fmt)에 따라 최적화된 이미지 URL 생성
  // ---------------------------------------------------------------------------
  const ORIGIN = typeof window !== 'undefined' ? window.location.origin : 'https://welfaredesign.netlify.app';
  const RAW = `${ORIGIN}/images/business/member-services.png?v=2`;
  const cld = (w, fmt = 'auto') => `https://res.cloudinary.com/dxeadg9wi/image/fetch/c_limit,f_${fmt},q_auto,w_${w}/${RAW}`;
  const cldM = (w, fmt = 'auto') => `https://res.cloudinary.com/dxeadg9wi/image/fetch/c_limit,f_${fmt},q_auto:eco,dpr_auto,w_${w}/${RAW}`;

  return (
    <>
      {/* Cloudinary CDN 사전 연결: 이미지 초기 로딩 지연 최소화 */}
      <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
      <style
        id="page-text-guard"
        dangerouslySetInnerHTML={{ __html: `
/* =========================================================
   페이지 텍스트/레이아웃 가드
   - 모바일/데스크탑 텍스트 깨짐 방지
   - 줄바꿈/하이픈/가독성 기본값 통일
   ========================================================= */

/* 브라우저 자동 텍스트 확대 방지 (iOS/Android) */
html {
  -webkit-text-size-adjust: 100%;
  text-size-adjust: 100%;
}

/* 모든 요소 박스모델 통일 + 예기치 않은 넘침 방지 */
*, *::before, *::after {
  box-sizing: border-box;
  min-width: 0;
  /* 자동 하이픈은 필요할 때만 수동 적용 */
  hyphens: manual;
  -webkit-hyphens: manual;
}

/* 본문 기본 가독성 세팅 */
body {
  line-height: 1.5;
  /* 폰트 렌더링 개선 */
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

/* 형광펜/강조 마크가 줄바꿈 시 깨지지 않도록 */
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
        {/* 이미지 + 우측 정보 박스(대여 안내) + 기대효과(대여 안내 박스 아래) */}
        <div className="flex justify-center">
          {/* 좌측 이미지: JS 동기화 제거, 순수 CSS로 동일 높이 */}
          <div className="w-full max-w-[1050px] mx-auto">
            {/* 반응형 이미지 처리:
                - 모바일: Cloudinary AVIF/WebP 자동 최적화
                - 태블릿/데스크탑: 로컬 PNG 사용 (화질 안정성) */}
            {/* 단일 picture 요소 사용으로 이미지 중복 렌더링 방지 */}
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

          {/* 우측 영역 제거 */}
        </div>
      </div>
    </BizLayout>
    </>
  );
}
