// src/pages/business/NeedsSurvey.jsx
import BizLayout from "./_Layout";

export default function NeedsSurvey() {
  // 이 페이지 이미지용 Cloudinary fetch 헬퍼 (SSR 환경에서도 origin 안전하게 처리)
  const ORIGIN = typeof window !== 'undefined' ? window.location.origin : 'https://welfaredesign.netlify.app';
  const RAW = `${ORIGIN}/images/business/needs-survey.png`;
  const cld = (w, fmt = 'auto') => `https://res.cloudinary.com/dxeadg9wi/image/fetch/c_limit,f_${fmt},q_auto,w_${w}/${encodeURIComponent(RAW)}`;
  const cldM = (w, fmt = 'auto') =>
    `https://res.cloudinary.com/dxeadg9wi/image/fetch/c_limit,f_${fmt},q_auto:eco,dpr_auto,w_${w}/${encodeURIComponent(RAW)}`;
  return (
    <>
      <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
      <style
        id="page-text-guard"
        dangerouslySetInnerHTML={{ __html: `
/* 텍스트 크기 자동 보정 비활성화(모바일 확대/축소로 인한 레이아웃 흔들림 방지) */
html { -webkit-text-size-adjust: 100%; text-size-adjust: 100%; }

/* 전역 박스 모델 통일 + 예상치 못한 줄바꿈/하이픈 처리 안정화 */
*, *::before, *::after { box-sizing: border-box; min-width: 0; hyphens: manual; -webkit-hyphens: manual; }

/* 본문 타이포/줄바꿈 정책: 한글 단어 단위 유지 + 긴 문자열은 안전하게 줄바꿈 */
body {
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
  word-break: keep-all;
  overflow-wrap: anywhere;
  -webkit-line-break: after-white-space;
}

/* 제목 줄바꿈을 보기 좋게(지원 브라우저) */
h1, h2, .heading-balance { text-wrap: balance; }

/* text-wrap 미지원 브라우저용 폴백: 과도한 줄바꿈/행간 붕괴 방지 */
@supports not (text-wrap: balance) {
  h1, h2, .heading-balance { line-height: 1.25; max-width: 45ch; }
}

/* 하이라이트(마커) 영역이 줄바꿈될 때 모양이 깨지지 않게 */
mark, [data-hl] {
  -webkit-box-decoration-break: clone;
  box-decoration-break: clone;
  padding: 0 .08em;
  border-radius: 2px;
}

/* 유틸리티 클래스: 특정 구간에서만 필요한 줄바꿈/말줄임 제어 */
.nowrap { white-space: nowrap; }
.u-wrap-anywhere { overflow-wrap: anywhere; word-break: keep-all; }
.u-ellipsis { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        ` }}
      />
      <BizLayout title="취약 계층 복지욕구 실태조사">
      <div className="max-w-screen-xl mx-auto px-4 pb-4 md:pb-0">
        {/* 이미지 + 우측 정보 박스(대여 안내) + 기대효과(대여 안내 박스 아래) */}
        <div className="grid gap-8 md:grid-cols-2 items-stretch">
          {/* 좌측 이미지: JS 동기화 제거, 순수 CSS로 동일 높이 */}
          <div className="flex items-center justify-center">
            <picture>
              {/* 모바일 전용: Cloudinary 최적화 (AVIF/WebP) */}
              <source
                media="(max-width: 767px)"
                type="image/avif"
                srcSet={`${cldM(320, 'avif')} 320w, ${cldM(480, 'avif')} 480w, ${cldM(640, 'avif')} 640w, ${cldM(750, 'avif')} 750w, ${cldM(828, 'avif')} 828w`}
                sizes="100vw"
              />
              <source
                media="(max-width: 767px)"
                type="image/webp"
                srcSet={`${cldM(320, 'webp')} 320w, ${cldM(480, 'webp')} 480w, ${cldM(640, 'webp')} 640w, ${cldM(750, 'webp')} 750w, ${cldM(828, 'webp')} 828w`}
                sizes="100vw"
              />
              {/* 데스크탑/태블릿: 원본 정적 PNG 유지 */}
              <img
                src="/images/business/needs-survey.png"
                alt="취약 계층 복지욕구 실태조사"
                loading="eager"
                fetchPriority="high"
                decoding="async"
                width="1200"
                height="900"
                sizes="(max-width: 767px) 100vw, 50vw"
                className="w-full h-auto"
                style={{ imageRendering: 'auto', display: 'block' }}
              />
            </picture>
          </div>

          {/* 우측: 대여 안내 + 기대효과 + 문의 */}
          <div className="grid md:h-[440px] lg:h-[470px] grid-rows-[auto,1fr,auto] gap-6 mt-14">
            <div className="rounded-2xl border border-[#2CB9B1]/40 bg-white/90 backdrop-blur-[1px] shadow-md p-7 md:p-8">
              <ul className="space-y-4 text-gray-800 leading-relaxed">
                <li className="flex gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-[#2CB9B1] shadow-[0_0_0_2px_rgba(44,185,177,0.18)] shrink-0" />
                  <span>
                    취약계층 및 보호자 대상, 설문·심층면접 기반 조사(연 1회,
                    필요시 수시)
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-[#2CB9B1] shadow-[0_0_0_2px_rgba(44,185,177,0.18)] shrink-0" />
                  <span>결과 공유회, 향후 서비스 개선 반영</span>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-[#2CB9B1]/30 bg-white/90 backdrop-blur-[1px] shadow-md p-7 md:p-8 h-full flex flex-col justify-center">
              <h3 className="font-semibold text-lg tracking-tight text-[#F26C2A] mb-3">
                기대 효과
              </h3>
              <ul className="list-disc list-inside space-y-1.5 text-gray-700 leading-relaxed">
                <li>
                  취약계층의 복지정보 접근성 강화 및 제도적 권리 실현 지원
                </li>
                <li>
                  실태조사 기반의 복지서비스 품질 향상 및 수요 맞춤형 정책 제안
                </li>
              </ul>
            </div>

            {/* 문의 박스: PC(데스크탑) / 모바일 분리 렌더링 */}
            <div className="mt-3 mb-1 md:mb-0">
              {/* 데스크탑 & 태블릿(md 이상): 기존 스타일 유지 */}
              <div className="hidden md:block rounded-2xl border border-[#F26C2A]/45 bg-gradient-to-r from-[#FFF3E9] to-[#EFFFFD] px-8 py-5 shadow-md">
                <div className="flex items-center justify-center gap-3 text-[#111827] tracking-tight">
                  {/* 전화 아이콘 */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-5 w-5 text-[#F26C2A]"
                    aria-hidden="true"
                  >
                    <path d="M2.25 6.75c0 7.008 5.742 12.75 12.75 12.75.71 0 1.32-.51 1.44-1.21l.38-2.19a1.5 1.5 0 0 0-1.08-1.71l-2.24-.62a1.5 1.5 0 0 0-1.49.44l-.82.83a10.97 10.97 0 0 1-4.26-4.27l.83-.82a1.5 1.5 0 0 0 .44-1.49l-.62-2.24a1.5 1.5 0 0 0-1.71-1.08l-2.19.38c-.7.12-1.21.73-1.21 1.44Z" />
                  </svg>
                  <span className="font-semibold tracking-wide text-[#374151]">
                    신청 문의 : 복지디자인
                  </span>
                  <a
                    href="tel:0420000000"
                    className="font-extrabold text-2xl tabular-nums text-[#F26C2A] underline whitespace-nowrap"
                  >
                    042-000-0000
                  </a>
                </div>
              </div>
              {/* 모바일 전용(md 미만): 한 줄 레이아웃, 줄바꿈 방지 */}
              <div className="md:hidden rounded-2xl border border-[#F26C2A]/45 bg-gradient-to-r from-[#FFF3E9] to-[#EFFFFD] px-5 py-4 shadow-md">
                <div className="flex items-center justify-between gap-3 text-[#111827]">
                  <div className="flex items-center gap-2 min-w-0">
                    {/* 전화 아이콘 */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-5 w-5 text-[#F26C2A] shrink-0"
                      aria-hidden="true"
                    >
                      <path d="M2.25 6.75c0 7.008 5.742 12.75 12.75 12.75.71 0 1.32-.51 1.44-1.21l.38-2.19a1.5 1.5 0 0 0-1.08-1.71l-2.24-.62a1.5 1.5 0 0 0-1.49.44l-.82.83a10.97 10.97 0 0 1-4.26-4.27l.83-.82a1.5 1.5 0 0 0 .44-1.49l-.62-2.24a1.5 1.5 0 0 0-1.71-1.08l-2.19.38c-.7.12-1.21.73-1.21 1.44Z" />
                    </svg>
                    <span className="font-semibold text-[15px] text-[#374151] whitespace-nowrap">
                      신청 문의 : 복지디자인
                    </span>
                  </div>
                  <a
                    href="tel:0420000000"
                    className="font-extrabold text-[20px] tabular-nums text-[#F26C2A] underline whitespace-nowrap"
                  >
                    042-000-0000
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BizLayout>
    </>
  );
}
