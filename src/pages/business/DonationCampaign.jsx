// src/pages/business/DonationCampaign.jsx
// -----------------------------------------------------------------------------
// [페이지 목적]
//  - 보조기기(복지용구) 기증 캠페인 안내 페이지
//  - 좌측: 캠페인 대표 이미지
//  - 우측: 캠페인 내용 안내 → 기대 효과 → 전화 문의 배너
//
//  - BizLayout을 사용해 사업 페이지 공통 상단(브레드크럼/제목) 스타일을 통일
//
// [이미지 최적화 전략]
//  - 모바일: Cloudinary image/fetch를 활용한 AVIF/WEBP + srcset 제공
//  - 태블릿/데스크탑: 로컬 정적 PNG 사용으로 품질 고정 및 캐시 안정성 확보
//
// [UX/레이아웃 포인트]
//  - 이미지/텍스트 동일 높이 느낌을 CSS Grid로 해결 (JS 계산 제거)
//  - 문의 배너는 md 기준으로 완전히 분리 렌더링하여 줄바꿈/깨짐 방지
// -----------------------------------------------------------------------------
import BizLayout from "./_Layout";

export default function DonationCampaign() {
  // =========================
  // 페이지 컨텐츠 상수(템플릿화)
  // =========================
  const PAGE_TITLE = "보조기기 기증 캠페인";
  const HERO_ALT = "보조기기 기증 캠페인";

  const INFO_TITLE = "핵심 안내";
  const EFFECT_TITLE = "기대 효과";

  const PHONE_LABEL = "신청 문의 : 복지디자인";
  const PHONE_TEL = "0420000000";
  const PHONE_DISPLAY = "042-000-0000";

  const infoItems = [
    {
      lines: [
        "지역 주민과 단체를 대상으로 보조기기 기증 캠페인 실시",
        "- 기증가능 품목 : 수동/전동 휠체어, 보행보조기, 목욕의자, 안전손잡이 등",
      ],
    },
    {
      lines: ["주민센터 및 공공기관 대상 장애인 인식개선 캠페인 연 2회 진행"],
    },
  ];

  const effectItems = [
    "취약계층의 복지정보 접근성 강화 및 제도적 권리 실현 지원",
    "장애인에 대한 지역사회 인식 개선 및 복지문화 조성",
  ];

  // ---------------------------------------------------------------------------
  // 이미지 URL 구성
  //  - ORIGIN: 현재 배포 origin (SSR 환경 대비 fallback 포함)
  //  - RAW: 원본 정적 이미지 경로
  //  - cld / cldM: Cloudinary fetch URL 생성 헬퍼
  // ---------------------------------------------------------------------------
  const ORIGIN = typeof window !== 'undefined' ? window.location.origin : 'https://welfaredesign.netlify.app';
  const RAW = `${ORIGIN}/images/business/donation.png`;
  const C_BASE = 'https://res.cloudinary.com/dxeadg9wi/image/fetch';
  const cld = (w, fmt = 'auto') => `${C_BASE}/c_limit,f_${fmt},q_auto,w_${w}/${encodeURIComponent(RAW)}`;
  const cldM = (w, fmt = 'auto') => `${C_BASE}/c_limit,f_${fmt},q_auto:eco,dpr_auto,w_${w}/${encodeURIComponent(RAW)}`;

  return (
    <>
      {/* 페이지 전용 텍스트/줄바꿈 안정화 CSS 주입 (모바일 확대·줄바꿈 이슈 방지) */}
      {/*
        페이지 전용 "텍스트 가드" CSS 설명
        - word-break: keep-all → 한글 단어 중간 끊김 방지
        - overflow-wrap: anywhere → 긴 영문/URL 레이아웃 깨짐 방지
        - text-wrap: balance → 제목 줄바꿈 균형(지원 브라우저 한정)
      */}
      <style
        id="page-text-guard"
        dangerouslySetInnerHTML={{ __html: `
/* =====================================================================
   텍스트 가드(페이지 전용)
   - 모바일에서 글자 자동 확대/줄바꿈으로 레이아웃이 깨지는 상황 예방
   - grid/flex 내부 글자 넘침을 줄이기 위해 min-width: 0 등 적용
   ===================================================================== */

/* 브라우저 텍스트 자동 확대/축소 방지 (모바일 접근성 이슈 예방) */
html {
  -webkit-text-size-adjust: 100%;
  text-size-adjust: 100%;
}

/* 모든 요소에 box-sizing 통일 + 최소 너비 0
   → grid/flex 내부에서 글자 넘침 현상 방지 */
*, *::before, *::after {
  box-sizing: border-box;
  min-width: 0;
  /* 자동 하이픈 비활성화 (한글/혼합 텍스트 깨짐 방지) */
  hyphens: manual;
  -webkit-hyphens: manual;
}

/* 본문 기본 가독성(줄바꿈/렌더링) 세팅 */
body {
  line-height: 1.5;

  /* 폰트 렌더링 품질 개선 (macOS/iOS 중심) */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  /* 텍스트 렌더링 최적화 */
  text-rendering: optimizeLegibility;

  /* 한글 단어 중간 줄바꿈 방지 */
  word-break: keep-all;

  /* 긴 영문/URL은 안전하게 줄바꿈 */
  overflow-wrap: anywhere;

  /* WebKit 기반 브라우저에서 공백 기준 줄바꿈 보정 */
  -webkit-line-break: after-white-space;
}

/* 제목 줄바꿈 균형 (지원 브라우저 한정) */
h1, h2, .heading-balance {
  text-wrap: balance;
}

/* text-wrap 미지원 브라우저용 대체 처리 */
@supports not (text-wrap: balance) {
  h1, h2, .heading-balance {
    line-height: 1.25;
    max-width: 45ch; /* 제목 한 줄 길이 제한으로 가독성 확보 */
  }
}

/* 강조(mark) 텍스트가 여러 줄로 넘어갈 때 배경 깨짐 방지 */
mark, [data-hl] {
  -webkit-box-decoration-break: clone;
  box-decoration-break: clone;
  padding: 0 .08em;
  border-radius: 2px;
}

/* 줄바꿈 금지 유틸 클래스 */
.nowrap {
  white-space: nowrap;
}

/* 긴 문자열(영문/URL) 안전 줄바꿈 유틸 */
.u-wrap-anywhere {
  overflow-wrap: anywhere;
  word-break: keep-all;
}

/* 한 줄 말줄임 유틸 클래스 */
.u-ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
        ` }}
      />
      {/* 사업 페이지 공통 레이아웃: 브레드크럼 + 페이지 제목(h1) 영역 */}
      <BizLayout title={PAGE_TITLE}>
      <div className="max-w-screen-xl mx-auto px-4 pb-4 md:pb-0">
        {/* ====================== 메인 섹션: 이미지 + 캠페인 안내 ====================== */}
        <div className="grid gap-8 md:grid-cols-2 items-stretch">
          {/* 좌측 이미지: JS 동기화 제거, 순수 CSS로 동일 높이 */}
          <div className="flex items-center justify-center">
            {/*
              <picture> 요소를 사용한 반응형 이미지 처리
              - 모바일(max-width: 767px): AVIF → WEBP 순서로 최적 포맷 제공
              - 태블릿/데스크탑: 로컬 PNG 사용
            */}
            {/* 단일 그림 요소로 중복 렌더 제거 */}
            <picture>
              {/* 모바일: AVIF 포맷 (최고 압축 효율)*/}
              <source
                media="(max-width: 767px)"
                type="image/avif"
                srcSet={`${cldM(320, 'avif')} 320w, ${cldM(480, 'avif')} 480w, ${cldM(640, 'avif')} 640w, ${cldM(750, 'avif')} 750w, ${cldM(828, 'avif')} 828w`}
                sizes="100vw"
              />
              {/* 모바일: WEBP 포맷 (AVIF 미지원 브라우저 대응)*/}
              <source
                media="(max-width: 767px)"
                type="image/webp"
                srcSet={`${cldM(320, 'webp')} 320w, ${cldM(480, 'webp')} 480w, ${cldM(640, 'webp')} 640w, ${cldM(750, 'webp')} 750w, ${cldM(828, 'webp')} 828w`}
                sizes="100vw"
              />
              {/*
                태블릿/데스크탑: 정적 PNG 이미지
                - 디자인 품질 고정
                - 빌드 시 정적 자산 캐시 활용
              */}
              <img
                src="/images/business/donation.png"
                alt={HERO_ALT}
                loading="eager"
                fetchPriority="high"
                decoding="async"
                width="960"
                height="720"
                sizes="(max-width: 767px) 100vw, 50vw"
                className="w-full h-auto"
                style={{ imageRendering: 'auto', display: 'block' }}
              />
            </picture>
          </div>

          {/* 우측 컬럼: 캠페인 안내 → 기대 효과 → 문의 배너*/}
          <div className="flex flex-col gap-6 mt-10 md:mt-14">
            <div className="rounded-2xl border border-[#2CB9B1]/40 bg-white/90 backdrop-blur-[1px] shadow-md p-7 md:p-8">
              <h3 className="font-semibold text-lg tracking-tight text-gray-900 mb-4">
                {INFO_TITLE}
              </h3>
              <ul className="space-y-4 text-gray-800 leading-relaxed">
                {infoItems.map((it, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="mt-2 h-2 w-2 rounded-full bg-[#2CB9B1] shadow-[0_0_0_2px_rgba(44,185,177,0.18)] shrink-0" />
                    <span>
                      {it.lines.map((line, li) => (
                        <span key={li}>
                          {line}
                          {li < it.lines.length - 1 ? <br /> : null}
                        </span>
                      ))}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-[#2CB9B1]/30 bg-white/90 backdrop-blur-[1px] shadow-md py-10 px-7 md:px-8 md:py-12">
              <h3 className="font-semibold text-lg tracking-tight text-gray-900 mb-3">
                {EFFECT_TITLE}
              </h3>
              <ul className="list-disc list-outside pl-5 space-y-1.5 text-gray-700 leading-relaxed tracking-tight text-justify">
                {effectItems.map((txt) => (
                  <li key={txt}>{txt}</li>
                ))}
              </ul>
            </div>

            {/*
              문의 배너 반응형 처리
              - md 이상: 중앙 정렬 + 큰 글씨로 번호 가독성 확보
              - md 미만: 한 줄 유지(whitespace-nowrap)로 줄바꿈/깨짐 방지
            */}
            {/* 문의 박스: PC(데스크탑) / 모바일 분리 렌더링 */}
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
                    {PHONE_LABEL}
                  </span>
                  <a
                    href={`tel:${PHONE_TEL}`}
                    className="font-extrabold text-2xl tabular-nums text-[#F26C2A] underline whitespace-nowrap"
                  >
                    {PHONE_DISPLAY}
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
                      {PHONE_LABEL}
                    </span>
                  </div>
                  <a
                    href={`tel:${PHONE_TEL}`}
                    className="font-extrabold text-[20px] tabular-nums text-[#F26C2A] underline whitespace-nowrap"
                  >
                    {PHONE_DISPLAY}
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
