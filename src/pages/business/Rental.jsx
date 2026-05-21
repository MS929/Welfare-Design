// src/pages/business/Rental.jsx
/**
 * -----------------------------------------------------------------------------
 * [페이지 목적]
 *  - 휠체어 및 복지용구(보행보조기, 목욕의자 등) 무료 대여 안내 페이지
 *  - 이용 방법/대여 규칙/기대 효과/전화 문의 정보를 한 화면에서 제공
 *
 * [구성]
 *  - BizLayout(상단 공통 레이아웃) 내부에 본문 2열 Grid 배치
 *    · 좌측: 대표 이미지(반응형)
 *    · 우측: 대여 안내 카드 → 기대 효과 카드 → 문의 배너(PC/모바일 분리)
 *
 * [이미지 최적화 전략]
 *  - 모바일: Cloudinary image/fetch로 AVIF/WEBP + srcset 제공(용량↓/속도↑)
 *  - 태블릿/데스크탑: 로컬 정적 PNG로 품질/캐시 안정성 확보
 *
 * [텍스트/레이아웃 안정화]
 *  - 전역 텍스트 가드 CSS를 페이지 단위로 주입하여(모바일 폰트 자동 확대/긴 문자열 깨짐) 예방
 *  - 문의 배너는 md 기준으로 완전히 분리 렌더링하여 줄바꿈/잘림 이슈를 최소화
 * -----------------------------------------------------------------------------
 */

import BizLayout from "./_Layout";

export default function Rental() {
  return (
    <>
      {/* 페이지 단위 CSS 주입: 전역 CSS 수정 없이도 모바일 텍스트/줄바꿈 이슈를 안전하게 방지 */}
      <style
        id="page-text-guard"
        dangerouslySetInnerHTML={{
          __html: `
/* 모바일 Safari/Chrome에서 폰트가 임의로 확대되는 현상 방지 */
html { -webkit-text-size-adjust: 100%; text-size-adjust: 100%; }

/* 레이아웃 계산 안정화 + 하이픈(단어 분리) 정책 고정 */
*, *::before, *::after { box-sizing: border-box; min-width: 0; hyphens: manual; -webkit-hyphens: manual; }

/* 본문 가독성/줄바꿈 기본값: 긴 문자열(전화번호/URL 등) 때문에 레이아웃이 깨지는 문제 예방 */
body {
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
  word-break: keep-all;            /* 한글 단어 중간 분리 방지 */
  overflow-wrap: anywhere;         /* 긴 영문/URL도 안전하게 줄바꿈 */
  -webkit-line-break: after-white-space;
}

/* 제목 계열은 가능한 줄 균형(balanced wrap)으로 보기 좋게 */
h1, h2, .heading-balance { text-wrap: balance; }

/* text-wrap: balance 미지원 브라우저 fallback */
@supports not (text-wrap: balance) {
  h1, h2, .heading-balance { line-height: 1.25; max-width: 45ch; }
}

/* 하이라이트(mark) 배경이 줄바꿈 시에도 자연스럽게 이어지도록 */
mark, [data-hl] {
  -webkit-box-decoration-break: clone;
  box-decoration-break: clone;
  padding: 0 .08em;
  border-radius: 2px;
}

/* 유틸: 줄바꿈 금지 / 어디서든 줄바꿈 허용 / 말줄임 */
.nowrap { white-space: nowrap; }
.u-wrap-anywhere { overflow-wrap: anywhere; word-break: keep-all; }
.u-ellipsis { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
          `,
        }}
      />
      <BizLayout title="휠체어 및 복지용구 무료 대여">
        {/* 이미지 CDN(Cloudinary)과의 연결을 미리 열어(Preconnect) 모바일 첫 로딩 지연을 줄임 */}
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
      <div className="max-w-screen-xl mx-auto px-4 pb-4 md:pb-0">
        {/* 섹션 구성: 좌측(이미지) + 우측(대여 안내/기대효과/문의) */}
        <div className="grid gap-8 md:grid-cols-2 items-stretch">
          {/* 좌측 이미지 영역: 불필요한 JS 레이아웃 동기화 없이 반응형으로 표시 */}
          <div className="flex items-center justify-center">
            {/* <picture> 사용: 모바일는 최적화(Cloudinary), PC는 원본 PNG 유지 */}
            <picture>
              {(() => {
                // 원본 이미지는 Netlify 정적 파일 URL을 기준으로, 모바일에서만 Cloudinary로 변환/최적화
                const REMOTE = "https://welfaredesign.netlify.app/images/business/rental.png";
                // Cloudinary fetch 변환 URL 생성기(너비/포맷 자동 최적화)
                const cldM = (w, fmt = 'auto') =>
                  `https://res.cloudinary.com/dxeadg9wi/image/fetch/c_limit,f_${fmt},q_auto:eco,dpr_auto,w_${w}/${encodeURIComponent(REMOTE)}`;

                return (
                  <>
                    {/* 모바일 전용: Cloudinary fetch 변환(포맷/품질/dpr/너비 자동 최적화) */}
                    <source
                      media="(max-width: 767px)"
                      type="image/avif"
                      srcSet={`${cldM(320,'avif')} 320w, ${cldM(480,'avif')} 480w, ${cldM(640,'avif')} 640w, ${cldM(750,'avif')} 750w, ${cldM(828,'avif')} 828w`}
                      sizes="100vw"
                    />
                    <source
                      media="(max-width: 767px)"
                      type="image/webp"
                      srcSet={`${cldM(320,'webp')} 320w, ${cldM(480,'webp')} 480w, ${cldM(640,'webp')} 640w, ${cldM(750,'webp')} 750w, ${cldM(828,'webp')} 828w`}
                      sizes="100vw"
                    />
                    {/* 데스크탑/태블릿: 정적 PNG 사용(PC는 변환 없이 원본 유지) */}
                    <img
                      src="/images/business/rental.png"
                      alt="휠체어 및 복지용구 무료 대여"
                      loading="eager"
                      fetchPriority="high"
                      decoding="async"
                      width="960"
                      height="720"
                      sizes="(max-width: 767px) 100vw, 50vw"
                      className="w-full h-auto"
                      style={{ imageRendering: "auto", display: "block" }}
                    />
                  </>
                );
              })()}
            </picture>
          </div>

          {/* 우측 영역: 텍스트 제거 후 빈 레이아웃만 유지 */}
          <div className="flex flex-col h-full mt-8" />
        </div>
      </div>
    </BizLayout>
    </>
  );
}