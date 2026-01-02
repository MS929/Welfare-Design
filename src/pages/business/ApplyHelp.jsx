// src/pages/business/ApplyHelp.jsx
// -----------------------------------------------------------------------------
// [페이지 목적]
//  - 복지용구(보조기기/복지용구) 신청 안내 지원 페이지
//  - 좌측: 대표 이미지 / 우측: 안내 내용(불릿) + 기대효과 + 전화 문의 배너
//
// [이미지 전략]
//  - 모바일: Cloudinary `image/fetch`로 AVIF/WEBP + 반응형 srcset 제공(용량/속도 최적화)
//  - 데스크탑/태블릿: 로컬 정적 PNG를 그대로 사용(디자인/품질 보존 + 캐시 안정)
//
// [텍스트/레이아웃 안정화]
//  - 긴 영문/URL 줄바꿈, 한글 줄바꿈(keep-all) 등 깨짐 방지용 CSS 가드 포함
//  - MD 기준으로 문의 배너 레이아웃을 분리해 모바일 줄바꿈/넘침을 예방
// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
// [Cloudinary 이미지 변환(fetch) 헬퍼]
//  - Netlify에 배포된 정적 이미지를 Cloudinary가 fetch로 가져와 AVIF/WEBP로 변환
//  - 모바일 구간에서만 srcset을 사용해 초기 로딩 트래픽을 절감
//  - 태블릿/데스크탑은 로컬 PNG를 그대로 사용해 디자인/품질/캐시 안정성 유지
// -----------------------------------------------------------------------------
const ORIGIN = "https://welfaredesign.netlify.app"; // 배포(프로덕션) 정적 파일 기준 origin
const RAW = `${ORIGIN}/images/business/apply-help.png`; // Cloudinary가 fetch할 원본 URL

// w: 요청 너비(px), fmt: avif/webp/auto
// c_limit: 원본 비율 유지, 지정 폭 이상 확대 방지
// q_auto:eco: 자동 품질(eco)
// dpr_auto: 기기 DPR에 맞춰 최적화
const cld = (w, fmt = "auto") =>
  `https://res.cloudinary.com/dxeadg9wi/image/fetch/c_limit,f_${fmt},q_auto:eco,dpr_auto,w_${w}/${RAW}`;

export default function ApplyHelp() {
  return (
    <>
      {/* Cloudinary CDN에 preconnect로 미리 연결해 이미지 요청 지연을 줄임 */}
      <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
      {/*
        [텍스트/줄바꿈 깨짐 방지용 CSS]
        - 한글: word-break: keep-all로 단어 중간 끊김 최소화
        - 긴 URL/영문: overflow-wrap: anywhere로 화면 밖 넘침 방지
        - 제목: text-wrap: balance 지원 시 줄바꿈 균형, 미지원 브라우저는 fallback 적용
      */}
      <style
        id="page-text-guard"
        dangerouslySetInnerHTML={{ __html: `
html {
  -webkit-text-size-adjust: 100%; /* iOS Safari에서 글자 자동 확대를 막아 레이아웃이 흔들리지 않게 함 */
  text-size-adjust: 100%;         /* 일부 브라우저의 텍스트 자동 조정 비활성화/완화 */
}

*, *::before, *::after {
  box-sizing: border-box;         /* padding/ border 포함해 크기를 계산(예상 가능한 레이아웃) */
  min-width: 0;                   /* flex/grid 자식이 내용 때문에 과도하게 넓어지는 문제 방지 */
  hyphens: manual;                /* 자동 하이픈 삽입을 최소화(필요 시 수동 하이픈만 적용) */
  -webkit-hyphens: manual;        /* Safari 계열 하이픈 설정 */
}

body {
  line-height: 1.5;               /* 본문 기본 행간 */
  -webkit-font-smoothing: antialiased; /* macOS/Safari에서 폰트 렌더링을 부드럽게 */
  -moz-osx-font-smoothing: grayscale;  /* macOS/Firefox 폰트 렌더링 보정 */
  text-rendering: optimizeLegibility;  /* 가독성 우선 렌더링(커닝 등) */

  word-break: keep-all;           /* 한글 단어가 중간에서 끊어지지 않도록 설정 */
  overflow-wrap: anywhere;        /* 긴 영문 텍스트나 URL도 화면 밖으로 넘치지 않게 줄바꿈 */
  -webkit-line-break: after-white-space; /* WebKit 줄바꿈 동작 보정(공백 기준 줄바꿈 우선) */
}

h1, h2, .heading-balance {
  text-wrap: balance;             /* 제목 줄바꿈을 균형 있게(지원 브라우저에서만) */
}

@supports not (text-wrap: balance) {
  h1, h2, .heading-balance {
    line-height: 1.25;            /* balance 미지원 환경에서 제목이 뭉개지지 않게 행간 조정 */
    max-width: 45ch;              /* 제목 줄 길이를 제한해 과도한 한 줄 폭을 방지 */
  }
}

mark, [data-hl] {
  -webkit-box-decoration-break: clone; /* 줄바꿈된 강조 표시가 끊기지 않게(webkit) */
  box-decoration-break: clone;          /* 줄바꿈된 강조 표시가 끊기지 않게(표준) */
  padding: 0 .08em;                    /* 하이라이트 양옆 여백 */
  border-radius: 2px;                  /* 하이라이트 모서리 살짝 둥글게 */
}

.nowrap {
  white-space: nowrap;           /* 강제 한 줄 표시(줄바꿈 금지) */
}

.u-wrap-anywhere {
  overflow-wrap: anywhere;       /* 긴 문자열도 어디서든 줄바꿈 허용 */
  word-break: keep-all;          /* 한글 단어 중간 분리 방지 */
}

.u-ellipsis {
  overflow: hidden;              /* 영역 밖 내용 숨김 */
  text-overflow: ellipsis;       /* 한 줄 말줄임표 처리 */
  white-space: nowrap;           /* 한 줄 고정 */
}
        ` }}
      />
      {/* 공통 비즈니스 레이아웃: 상단 브레드크럼과 페이지 제목을 제공 */}
      <BizLayout title="복지용구 신청 안내 지원">
      <div className="max-w-screen-xl mx-auto px-4 pb-4">
        {/* ====================== 메인 섹션: 이미지 + 안내 콘텐츠 ====================== */}
        {/* 상단: 좌측 이미지 / 우측 안내 박스 */}
        <div className="grid gap-8 md:grid-cols-2 items-stretch">
          <div className="flex items-center justify-center">
            {/*
              [이미지 포맷/미디어쿼리 분기]
              - (max-width: 767px) 모바일 구간에서만 AVIF/WEBP 소스를 제공
              - 태블릿/데스크탑은 로컬 PNG를 사용해 품질과 캐시 안정성을 확보
            */}
            <picture>
              {/* 모바일: AVIF (가장 용량 효율이 좋은 포맷) */}
              <source
                media="(max-width: 767px)"
                type="image/avif"
                srcSet={`${cld(320,'avif')} 320w, ${cld(480,'avif')} 480w, ${cld(640,'avif')} 640w, ${cld(750,'avif')} 750w, ${cld(828,'avif')} 828w`}
                sizes="100vw"
              />
              {/* 모바일: WEBP (AVIF 미지원 브라우저를 위한 대체 포맷) */}
              <source
                media="(max-width: 767px)"
                type="image/webp"
                srcSet={`${cld(320,'webp')} 320w, ${cld(480,'webp')} 480w, ${cld(640,'webp')} 640w, ${cld(750,'webp')} 750w, ${cld(828,'webp')} 828w`}
                sizes="100vw"
              />
              {/*
                태블릿/데스크탑: 로컬 정적 PNG
                - 디자인/화질을 고정해 의도한 비주얼 유지
                - 빌드 시 정적 자산 캐시를 그대로 활용
              */}
              <img
                src="/images/business/apply-help.png"
                alt="복지용구 신청 안내 지원"
                loading="eager"
                fetchPriority="high"
                decoding="async"
                width="960"
                height="720"
                sizes="(max-width: 767px) 100vw, 50vw"
                className="w-full h-auto"
                style={{ imageRendering: "auto", display: "block" }}
              />
            </picture>
          </div>
          {/* 우측 컬럼: 안내(불릿) → 기대 효과 → 문의 배너(반응형) */}
          <div className="grid md:h-[460px] lg:h-[470px] grid-rows-[auto,auto,auto] md:grid-rows-[auto,1fr,auto] gap-6 mt-12">
            {/* 안내 박스 */}
            <div className="rounded-2xl border border-[#2CB9B1]/40 bg-white/90 backdrop-blur-[1px] shadow-md p-7 md:p-8">
              <ul className="space-y-4 text-gray-800 leading-relaxed">
                <li className="flex gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-[#2CB9B1] shadow-[0_0_0_2px_rgba(44,185,177,0.18)] shrink-0" />
                  <span>
                    장애인등록, 노인장기요양, 긴급복지 등 지원제도 안내
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-[#2CB9B1] shadow-[0_0_0_2px_rgba(44,185,177,0.18)] shrink-0" />
                  <span>신청 방법/순서/기간/필수서류 체크리스트 제공</span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-[#2CB9B1] shadow-[0_0_0_2px_rgba(44,185,177,0.18)] shrink-0" />
                  <span>읍면동·구청·국민건강보험공단 등 유관기관 연계</span>
                </li>
              </ul>
            </div>
            {/* 기대 효과 */}
            <div className="rounded-2xl border border-[#2CB9B1]/30 bg-white/90 backdrop-blur-[1px] shadow-md p-7 md:p-8 md:h-full">
              <h3 className="font-semibold text-lg tracking-tight text-[#F26C2A] mb-3">
                기대 효과
              </h3>
              <ul className="list-disc list-inside space-y-1.5 text-gray-700 leading-relaxed">
                <li>
                  취약계층의 복지정보 접근성 강화 및 제도적 권리 실현 지원
                </li>
                <li>보조기기 및 복지용구의 지역 내 순환 체계 구축</li>
              </ul>
            </div>

            {/*
              [문의 배너 분리 렌더링(md 기준)]
              - 데스크탑/태블릿: 가운데 정렬 + 큰 폰트 구성
              - 모바일: 한 줄 레이아웃 + 줄바꿈 방지(whitespace-nowrap)
            */}
            {/* 문의 박스: 데스크탑/태블릿(md 이상)과 모바일(md 미만) 분리 렌더링 */}
            <div className="mt-3 mb-1 md:mb-0">
              {/* 데스크탑/태블릿(md 이상): 기존 스타일 유지 */}
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
              {/* 모바일(md 미만): 한 줄 레이아웃 + 줄바꿈 방지 */}
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
