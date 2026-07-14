// src/pages/business/Rental.jsx
/**
 * Rental.jsx
 * [페이지 목적]
 * - 휠체어 무료 대여 안내 페이지
 * - BizLayout 공통 사업 레이아웃 사용
 *
 * [이미지 처리]
 * - PC: public/images 원본 이미지 사용
 * - 모바일: Cloudinary image/fetch 변환으로 용량 최적화
 * - AVIF → WEBP → 원본 순서로 브라우저가 지원하는 이미지 사용
 *
 * [유지보수 위치]
 * - 안내 이미지 변경: public/images/business/rental.png 교체
 * - 모바일 최적화 기준 이미지 변경: REMOTE 주소 수정
 */

import BizLayout from "./_Layout";

export default function Rental() {
  return (
    <>
      {/* 페이지 전용 텍스트 가드 CSS
          - 모바일 브라우저 자동 글자 확대 방지
          - 한글 단어 중간 끊김 방지
          - 긴 URL/영문 텍스트 줄바꿈 처리 */}
      <style
        id="page-text-guard"
        dangerouslySetInnerHTML={{
          __html: `
html { -webkit-text-size-adjust: 100%; text-size-adjust: 100%; }

*, *::before, *::after { box-sizing: border-box; min-width: 0; hyphens: manual; -webkit-hyphens: manual; }

body {
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
  word-break: keep-all;            /* 한글 단어 중간 분리 방지 */
  overflow-wrap: anywhere;         /* 긴 영문/URL도 안전하게 줄바꿈 */
  -webkit-line-break: after-white-space;
}

h1, h2, .heading-balance { text-wrap: balance; }

@supports not (text-wrap: balance) {
  h1, h2, .heading-balance { line-height: 1.25; max-width: 45ch; }
}

mark, [data-hl] {
  -webkit-box-decoration-break: clone;
  box-decoration-break: clone;
  padding: 0 .08em;
  border-radius: 2px;
}

.nowrap { white-space: nowrap; }
.u-wrap-anywhere { overflow-wrap: anywhere; word-break: keep-all; }
.u-ellipsis { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
          `,
        }}
      />
      <BizLayout title="휠체어 무료 대여">
        {/* Cloudinary CDN 사전 연결
            - 모바일 이미지 요청 시간을 줄이기 위해 미리 연결 */}
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
      <div className="max-w-screen-xl mx-auto px-4 pb-4 md:pb-0">
        
        <div className="flex justify-center">
          {/* 대여 안내 대표 이미지 영역 */}
          <div className="w-full max-w-[1050px] mx-auto">
            {/* 반응형 이미지 제공
                - 모바일: Cloudinary 최적화 이미지 사용
                - PC: public 폴더 원본 이미지 사용 */}
            <picture>
              {(() => {
                // Cloudinary image/fetch 변환용 원본 이미지 주소
                // - Netlify에 배포된 원본 이미지를 기준으로 모바일 최적화 버전을 생성
                const REMOTE = "https://welfaredesign.netlify.app/images/business/rental.png?v=2";
                // 모바일 화면 폭에 맞는 Cloudinary 변환 URL 생성
                // - 자동 포맷 변환
                // - 품질 최적화
                // - DPR(고해상도 화면) 자동 대응
                const cldM = (w, fmt = 'auto') =>
                  `https://res.cloudinary.com/dxeadg9wi/image/fetch/c_limit,f_${fmt},q_auto:eco,dpr_auto,w_${w}/${encodeURIComponent(REMOTE)}`;

                return (
                  <>
                    {/* 모바일 최적화 이미지
                        - AVIF 우선 제공
                        - 미지원 브라우저는 WEBP 사용
                        - 둘 다 불가능하면 img 원본 fallback */}
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
                    <img
                      src="/images/business/rental.png?v=2"
                      alt="휠체어 무료 대여"
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
                  </>
                );
              })()}
            </picture>
          </div>
        </div>
      </div>
    </BizLayout>
    </>
  );
}