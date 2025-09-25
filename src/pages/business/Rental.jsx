// src/pages/business/Rental.jsx
import BizLayout from "./_Layout";

export default function Rental() {
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
      <BizLayout title="휠체어 및 복지용구 무료 대여">
      <div className="max-w-screen-xl mx-auto px-4 pb-4 md:pb-0">
        {/* 이미지 + 우측 정보 박스(대여 안내) + 기대효과(대여 안내 박스 아래) */}
        <div className="grid gap-8 md:grid-cols-2 items-stretch">
          {/* 좌측 이미지: JS 동기화 제거, 순수 CSS로 동일 높이 */}
          <div className="flex items-center justify-center">
            {/* 단일 그림 요소로 중복 렌더 제거 */}
            <picture>
              {(() => {
                const REMOTE = "https://welfaredesign.netlify.app/images/business/rental.png";
                const cld = (w) =>
                  `https://res.cloudinary.com/dxeadg9wi/image/fetch/c_limit,f_auto,q_auto,w_${w}/${encodeURIComponent(
                    REMOTE
                  )}`;
                const cldM = (w, fmt='auto') =>
                  `https://res.cloudinary.com/dxeadg9wi/image/fetch/c_limit,f_${fmt},q_auto:eco,w_${w}/${encodeURIComponent(REMOTE)}`;

                const srcSet = [640, 960, 1200, 1600]
                  .map((w) => `${cld(w)} ${w}w`)
                  .join(", ");

                return (
                  <>
                    <source
                      media="(max-width: 767px)"
                      type="image/avif"
                      srcSet={`${cldM(320,'avif')} 320w, ${cldM(480,'avif')} 480w, ${cldM(640,'avif')} 640w`}
                      sizes="100vw"
                    />
                    <source
                      media="(max-width: 767px)"
                      type="image/webp"
                      srcSet={`${cldM(320,'webp')} 320w, ${cldM(480,'webp')} 480w, ${cldM(640,'webp')} 640w`}
                      sizes="100vw"
                    />
                    <source
                      type="image/avif"
                      srcSet={srcSet}
                      sizes="(max-width: 767px) 100vw, 50vw"
                    />
                    <source
                      type="image/webp"
                      srcSet={srcSet}
                      sizes="(max-width: 767px) 100vw, 50vw"
                    />
                    <img
                      src={cld(960)}
                      alt="휠체어 및 복지용구 무료 대여"
                      loading="eager"
                      fetchpriority="high"
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

          {/* 우측: 대여 안내 + 기대효과 + 문의 */}
          <div className="flex flex-col h-full mt-8">
            <div className="rounded-2xl border border-[#2CB9B1]/40 bg-white/90 backdrop-blur-[1px] shadow-md p-7 md:p-8">
              <ul className="space-y-4 text-gray-800 leading-relaxed">
                <li className="flex gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-[#2CB9B1] shadow-[0_0_0_2px_rgba(44,185,177,0.18)] shrink-0" />
                  <span>
                    수동/전동 휠체어, 보행보조기, 목욕의자 등 기초 복지용구 무료
                    대여
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-[#2CB9B1] shadow-[0_0_0_2px_rgba(44,185,177,0.18)] shrink-0" />
                  <span>사전 연락 후 재고 확인 및 대여 대장 작성</span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-[#2CB9B1] shadow-[0_0_0_2px_rgba(44,185,177,0.18)] shrink-0" />
                  <span>사용법 안내 및 기초 안전 교육</span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-[#2CB9B1] shadow-[0_0_0_2px_rgba(44,185,177,0.18)] shrink-0" />
                  <span>기본 7일 대여, 1회 연장 가능(최대 14일)</span>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-[#2CB9B1]/30 bg-white/90 backdrop-blur-[1px] shadow-md p-7 md:p-8 mt-6">
              <h3 className="font-semibold text-lg tracking-tight text-[#F26C2A] mb-3">기대 효과</h3>
              <ul className="list-disc list-inside space-y-1.5 text-gray-700 leading-relaxed">
                <li>복지 사각지대 해소 및 취약계층 복지 접근성 강화</li>
                <li>지역 복지 자원의 선순환 구조 형성</li>
                <li>협력기관 및 조합원과의 지속 가능한 복지 파트너십 구축</li>
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
