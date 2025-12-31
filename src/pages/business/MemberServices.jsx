// src/pages/business/MemberServices.jsx
import BizLayout from "./_Layout";

export default function MemberServices() {
  // 이 페이지에서 사용하는 이미지용 Cloudinary fetch 헬퍼 (SSR 환경에서도 안전하게 동작)
  const ORIGIN = typeof window !== 'undefined' ? window.location.origin : 'https://welfaredesign.netlify.app';
  const RAW = `${ORIGIN}/images/business/member-services.png`;
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
   Global text & layout guard
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

/* ===== Utility classes ===== */

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
        <div className="grid gap-8 md:grid-cols-2 items-stretch">
          {/* 좌측 이미지: JS 동기화 제거, 순수 CSS로 동일 높이 */}
          <div className="flex items-center justify-center">
            {/* 반응형 이미지 처리:
                - 모바일: Cloudinary AVIF/WebP 자동 최적화
                - 태블릿/데스크탑: 로컬 PNG 사용 (화질 안정성) */}
            {/* 단일 picture 요소 사용으로 이미지 중복 렌더링 방지 */}
            <picture>
              {/* 모바일 전용: Cloudinary 최적화 (AVIF/WebP), 데스크탑/태블릿은 로컬 PNG 유지 */}
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
                src="/images/business/member-services.png"
                alt="조합원 지원 서비스"
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

          {/* 우측: 대여 안내 + 기대효과 + 문의 */}
          <div className="grid h-full grid-rows-[auto,1fr,auto] gap-6">
            <div className="rounded-2xl border border-[#2CB9B1]/40 bg-white/90 backdrop-blur-[1px] shadow-md p-7 md:p-8">
              <ul className="space-y-4 text-gray-800 leading-relaxed">
                <li className="flex gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-[#2CB9B1] shadow-[0_0_0_2px_rgba(44,185,177,0.18)] shrink-0" />
                  <span>
                    조합원에 대한 상담, 교육·훈련 및 정보 제공 <br></br>- 조합원
                    맞춤 상담 <br></br>- 기본 및 실무교육 <br></br>- 정보 제공
                    및 커뮤니티 구축
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-[#2CB9B1] shadow-[0_0_0_2px_rgba(44,185,177,0.18)] shrink-0" />
                  <span>
                    조합 간 협력을 위한 사업 <br></br>- 외부 네트워크 구축{" "}
                    <br></br>- 내부거래 활성화
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-[#2CB9B1] shadow-[0_0_0_2px_rgba(44,185,177,0.18)] shrink-0" />
                  <span>
                    조합 홍보 및 지역사회를 위한 사업 <br></br>- 주민 대상
                    홍보캠페인 운영 <br></br>- 사회복지시설 연계 홍보
                  </span>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-[#2CB9B1]/30 bg-white/90 backdrop-blur-[1px] shadow-md p-7 md:p-8 h-full">
              <h3 className="font-semibold text-lg tracking-tight text-[#F26C2A] mb-3">
                기대 효과
              </h3>
              <ul className="list-disc list-inside space-y-1.5 text-gray-700 leading-relaxed">
                <li>전문성 및 자립 능력 향상 조합원 역량 강화</li>
                <li>협력 사업을 통해 자원 공유와 공동 성장 가능</li>
                <li>
                  지역사회 문제 해결에 동참하며 공익적 역할 수행을 통한 지역사회
                  기여
                </li>
              </ul>
            </div>

            {/* 문의 박스: PC(데스크탑) / 모바일 분리 렌더링 */}
            <div className="mt-3 mb-1 md:mb-0">
              {/* 데스크탑/태블릿: 중앙 정렬 + 큰 타이포그래피 유지 */}
              {/* 데스크탑 & 태블릿 (md 이상): 기존 스타일 유지 */}
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
              {/* 모바일: 한 줄 고정 레이아웃 + 전화번호 탭 최적화 */}
              {/* 모바일 전용 (md 미만): 한 줄 레이아웃 유지 및 줄바꿈 방지 */}
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
