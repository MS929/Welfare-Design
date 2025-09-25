// src/pages/business/DonationCampaign.jsx
import BizLayout from "./_Layout";

export default function DonationCampaign() {
  const ORIGIN = typeof window !== 'undefined' ? window.location.origin : 'https://welfaredesign.netlify.app';
  const RAW = `${ORIGIN}/images/business/donation.png`;
  const C_BASE = 'https://res.cloudinary.com/dxeadg9wi/image/fetch';
  const cld = (w, fmt = 'auto') => `${C_BASE}/c_limit,f_${fmt},q_auto,w_${w}/${encodeURIComponent(RAW)}`;
  const cldM = (w, fmt = 'auto') => `${C_BASE}/c_limit,f_${fmt},q_auto:eco,dpr_auto,w_${w}/${encodeURIComponent(RAW)}`;

  return (
    <>
      <style
        id="page-text-guard"
        dangerouslySetInnerHTML={{ __html: `
html { -webkit-text-size-adjust: 100%; text-size-adjust: 100%; }
*, *::before, *::after { box-sizing: border-box; min-width: 0; hyphens: manual; -webkit-hyphens: manual; }
body {
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
  word-break: keep-all;
  overflow-wrap: anywhere;
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
        ` }}
      />
      <BizLayout title="보조기기 기증 캠페인">
      <div className="max-w-screen-xl mx-auto px-4 pb-4 md:pb-0">
        {/* 이미지 + 우측 정보 박스(대여 안내) + 기대효과(대여 안내 박스 아래) */}
        <div className="grid gap-8 md:grid-cols-2 items-stretch">
          {/* 좌측 이미지: JS 동기화 제거, 순수 CSS로 동일 높이 */}
          <div className="flex items-center justify-center">
            {/* 단일 그림 요소로 중복 렌더 제거 */}
            <picture>
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
              <img
                src="/images/business/donation.png"
                alt="보조기기 기증 캠페인"
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
          <div className="grid gap-6 mt-10 md:mt-14 md:grid-rows-[auto,1fr,auto] md:h-[470px] md:max-h-none">
            <div className="rounded-2xl border border-[#2CB9B1]/40 bg-white/90 backdrop-blur-[1px] shadow-md p-7 md:p-8">
              <ul className="space-y-4 text-gray-800 leading-relaxed">
                <li className="flex gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-[#2CB9B1] shadow-[0_0_0_2px_rgba(44,185,177,0.18)] shrink-0" />
                  <span>
                    지역 주민과 단체를 대상으로 보조기기 기증 캠페인 실시{" "}
                    <br></br>- 기증가능 품목 : 수동/전동 휠체어, 보행보조기,
                    목욕의자, 안전손잡이 등
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-[#2CB9B1] shadow-[0_0_0_2px_rgba(44,185,177,0.18)] shrink-0" />
                  <span>
                    주민센터 및 공공기관 대상 장애인 인식개선 캠페인 연 2회 진행
                  </span>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-[#2CB9B1]/30 bg-white/90 backdrop-blur-[1px] shadow-md py-10 px-7 md:px-8 md:py-12">
              <h3 className="font-semibold text-lg tracking-tight text-[#F26C2A] mb-3">
                기대 효과
              </h3>
              <ul className="list-disc list-outside pl-5 space-y-1.5 text-gray-700 leading-relaxed tracking-tight text-justify">
                <li>
                  취약계층의 복지정보 접근성 강화 및 제도적 권리 실현 지원
                </li>
                <li>장애인에 대한 지역사회 인식 개선 및 복지문화 조성</li>
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
              {/* Mobile 전용 (md 미만): 한 줄 레이아웃, 줄바꿈 방지 */}
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
