// -----------------------------------------------------------------------------
// [페이지 목적]
//  - 취약 계층 전동휠체어 이용자를 위한 보험금 지원 사업 안내 페이지
//
// [구성]
//  - 좌측: 사업 대표 이미지(반응형)
//  - 우측: 지원 내용 요약 → 기대 효과 → 전화 문의 배너
//
// [이미지/UX 전략]
//  - 모바일: Cloudinary fetch 기반 AVIF/WEBP 제공으로 용량 절감
//  - 태블릿/데스크탑: 로컬 PNG 사용으로 화질 및 캐시 안정성 유지
//  - 이미지/텍스트 높이 동기화는 CSS Grid로 처리(JS 계산 제거)
// -----------------------------------------------------------------------------

import BizLayout from "./_Layout";

export default function EwcInsurance() {
  // --- 이 페이지 전용 Cloudinary 반응형 이미지 헬퍼 ---
  const ORIGIN = (typeof window !== 'undefined' && window.location?.origin)
    ? window.location.origin
    // SSR/프리뷰 환경 대비용 fallback (fetch URL이 절대 경로가 되도록 운영 도메인 사용)
    : 'https://welfaredesign.netlify.app';
  const RAW = '/images/business/needs-survey.png?v=20260522-ewc';
  const cld = (w) => `https://res.cloudinary.com/dxeadg9wi/image/fetch/c_limit,f_auto,q_auto,w_${w}/${encodeURIComponent(ORIGIN + RAW)}`;
  const cldM = (w, fmt = 'auto') =>
    `https://res.cloudinary.com/dxeadg9wi/image/fetch/c_limit,f_${fmt},q_auto:eco,dpr_auto,w_${w}/${encodeURIComponent(ORIGIN + RAW)}`;

  return (
    <>
      {/* Cloudinary CDN에 preconnect로 미리 연결해 이미지 로딩 지연을 줄임 */}
      <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
      {/*
        페이지 전용 텍스트/줄바꿈 가드 스타일
        - 모바일 자동 글자 확대 방지
        - 긴 단어/숫자로 인한 레이아웃 깨짐 방지
        - 제목 줄바꿈 균형 지원
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
  border-radius: 2px;ㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋ
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
        <div className="flex justify-center">
          {/* 좌측 이미지: JS 동기화 제거, CSS만으로 동일 높이 유지 */}
          <div className="w-full max-w-[1050px] mx-auto">
            {/*
              단일 그림 요소로 중복 렌더 제거
              <picture>를 사용해 브라우저가 지원하는 포맷(AVIF/WEBP)을 우선 선택 → 용량/속도 개선
            */}
            <picture>
              {/* 최종 PNG fallback(모든 환경 대응) */}
              <img
                src={RAW}
                alt="취약 계층 전동휠체어 보험금 지원"
                width={1400}
                height={1000}
                decoding="async"
                loading="eager"
                fetchPriority="high"
                sizes="100vw"
                className="w-full h-auto object-contain rounded-2xl"
                style={{
                  imageRendering: 'auto',
                  display: 'block',
                }}
              />
            </picture>
          </div>
        </div>
      </div>
    </BizLayout>
    </>
  );
}
