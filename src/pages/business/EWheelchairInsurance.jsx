// src/pages/business/EwcInsurance.jsx
import BizLayout from "./_Layout";

export default function EwcInsurance() {
  // --- Cloudinary responsive image helper (local to this page) ---
  const ORIGIN = (typeof window !== 'undefined' && window.location?.origin)
    ? window.location.origin
    // SSR/preview fallback (use production origin so fetch URL is absolute)
    : 'https://welfaredesign.netlify.app';
  const RAW = '/images/business/ewc-insurance.png';
  const cld = (w) => `https://res.cloudinary.com/dxeadg9wi/image/fetch/c_limit,f_auto,q_auto,w_${w}/${encodeURIComponent(ORIGIN + RAW)}`;
  const cldM = (w, fmt = 'auto') =>
    `https://res.cloudinary.com/dxeadg9wi/image/fetch/c_limit,f_${fmt},q_auto:eco,dpr_auto,w_${w}/${encodeURIComponent(ORIGIN + RAW)}`;

  return (
    <>
      {/* Cloudinary CDN과의 연결을 미리 열어(Preconnect) 이미지 로딩 지연을 줄임 */}
      <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
      {/*
        페이지 전용 텍스트/줄바꿈 가드 스타일
        - 모바일에서 자동 글자 확대 방지
        - 긴 단어/숫자(전화번호 등)로 인한 레이아웃 깨짐 방지
        - 제목 줄바꿈(균형) 지원
      */}
      <style
        id="page-text-guard"
        dangerouslySetInnerHTML={{ __html: `
/* ===== 1) 모바일 자동 글자 확대 방지 (iOS Safari 등) ===== */
html { -webkit-text-size-adjust: 100%; text-size-adjust: 100%; }

/* ===== 2) 레이아웃 안정화: box-sizing 통일 + 최소 너비/하이픈 처리 ===== */
*, *::before, *::after {
  box-sizing: border-box;
  min-width: 0;              /* flex/grid 자식이 과도하게 커지는 현상 방지 */
  hyphens: manual;
  -webkit-hyphens: manual;
}

/* ===== 3) 본문 렌더링 품질 + 줄바꿈 정책 ===== */
body {
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;

  /* 한국어 문장: 단어 중간 깨짐 최소화 + 필요 시 어디서든 줄바꿈 허용 */
  word-break: keep-all;
  overflow-wrap: anywhere;

  /* WebKit 계열 줄바꿈 정책 보정 */
  -webkit-line-break: after-white-space;
}

/* ===== 4) 제목 줄바꿈 균형(지원 브라우저에서만) ===== */
h1, h2, .heading-balance { text-wrap: balance; }
@supports not (text-wrap: balance) {
  /* text-wrap 미지원 시: 줄간격을 조금 줄이고 제목 폭을 제한해 자연스러운 줄바꿈 유도 */
  h1, h2, .heading-balance { line-height: 1.25; max-width: 45ch; }
}

/* ===== 5) 하이라이트(마크) 스타일: 줄바꿈 시에도 배경이 자연스럽게 이어지도록 ===== */
mark, [data-hl] {
  -webkit-box-decoration-break: clone;
  box-decoration-break: clone;
  padding: 0 .08em;
  border-radius: 2px;
}

/* ===== 6) 유틸 클래스: 특정 상황에서 줄바꿈/말줄임 제어 ===== */
.nowrap { white-space: nowrap; }
.u-wrap-anywhere { overflow-wrap: anywhere; word-break: keep-all; }
.u-ellipsis { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        ` }}
      />
      <BizLayout title="취약 계층 전동휠체어 보험금 지원">
      <div className="max-w-screen-xl mx-auto px-4 pb-4 md:pb-0">
        {/* 이미지 + 우측 정보 박스(대여 안내) + 기대효과(대여 안내 박스 아래) */}
        <div className="grid gap-8 md:grid-cols-2 items-stretch">
          {/* 좌측 이미지: JS 동기화 제거, 순수 CSS로 동일 높이 */}
          <div className="flex items-center justify-center">
            {/*
              단일 그림 요소로 중복 렌더 제거
              <picture>를 사용해 브라우저가 지원하는 포맷(AVIF/WEBP)을 우선 선택 → 용량/속도 개선
            */}
            <picture>
              {/* AVIF first */}
              <source
                media="(max-width: 767px)"
                type="image/avif"
                srcSet={`${cldM(320,'avif')} 320w, ${cldM(480,'avif')} 480w, ${cldM(640,'avif')} 640w, ${cldM(750,'avif')} 750w, ${cldM(828,'avif')} 828w`}
                sizes="100vw"
              />
              {/* WEBP fallback */}
              <source
                media="(max-width: 767px)"
                type="image/webp"
                srcSet={`${cldM(320,'webp')} 320w, ${cldM(480,'webp')} 480w, ${cldM(640,'webp')} 640w, ${cldM(750,'webp')} 750w, ${cldM(828,'webp')} 828w`}
                sizes="100vw"
              />
              {/* Final PNG/auto fallback */}
              <img
                src={RAW}
                alt="취약 계층 전동휠체어 보험금 지원"
                width={960}
                height={720}
                decoding="async"
                loading="eager"
                fetchPriority="high"
                sizes="(max-width: 767px) 100vw, 50vw"
                className="w-full h-auto"
                style={{ imageRendering: 'auto', display: 'block' }}
              />
            </picture>
          </div>

          {/* 우측: 대여 안내 + 기대효과 + 문의 */}
          <div className="grid md:h-[440px] lg:h-[470px] grid-rows-[auto,1fr,auto] gap-6 mt-14">
            <div className="rounded-2xl border border-[#2CB9B1]/40 bg-white/90 backdrop-blur-[1px] shadow-md p-7 md:p-8">
              <ul className="space-y-4 pt-2 text-gray-800 leading-relaxed">
                <li className="flex gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-[#2CB9B1] shadow-[0_0_0_2px_rgba(44,185,177,0.18)] shrink-0" />
                  <span>
                    저소득 취약계층 전동휠체어 사용자 대상 보험료 일부 지원
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-[#2CB9B1] shadow-[0_0_0_2px_rgba(44,185,177,0.18)] shrink-0" />
                  <span>
                    사례관리 기관과 협력하여 대상자 발굴 및 기존 사업과 연계하여
                    지원
                  </span>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-[#2CB9B1]/30 bg-white/90 backdrop-blur-[1px] shadow-md p-7 md:p-8 h-full flex flex-col justify-center">
              <h3 className="font-semibold text-lg tracking-tight text-[#F26C2A] mb-3">
                기대 효과
              </h3>
              <ul className="list-disc list-inside pt-2 space-y-1.5 text-gray-700 leading-relaxed">
                <li>
                  취약계층의 복지정보 접근성 강화 및 제도적 권리 실현 지원
                </li>
                <li>전동보장구 이용자의 안전망 확보 및 사고 예방</li>
              </ul>
            </div>

            {/* 문의 박스: PC(데스크탑) / 모바일 분리 렌더링 */}
            <div className="mt-3 mb-1 md:mb-0">
              {/* Desktop & Tablet (md 이상): 기존 스타일 유지 */}
              <div className="hidden md:block rounded-2xl border border-[#F26C2A]/45 bg-gradient-to-r from-[#FFF3E9] to-[#EFFFFD] px-8 py-5 shadow-md">
                <div className="flex items-center justify-center gap-3 text-[#111827] tracking-tight">
                  {/* phone icon */}
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
              {/*
                Mobile 전용 (md 미만)
                - 텍스트가 2줄로 깨지면 높이가 늘어나 레이아웃이 흔들릴 수 있어 한 줄 고정
                - 전화번호는 tap-to-call이 잘 되도록 크게/굵게 표시
              */}
              <div className="md:hidden rounded-2xl border border-[#F26C2A]/45 bg-gradient-to-r from-[#FFF3E9] to-[#EFFFFD] px-5 py-4 shadow-md">
                <div className="flex items-center justify-between gap-3 text-[#111827]">
                  <div className="flex items-center gap-2 min-w-0">
                    {/* phone icon */}
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
