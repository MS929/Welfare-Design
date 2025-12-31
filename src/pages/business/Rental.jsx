// src/pages/business/Rental.jsx
import BizLayout from "./_Layout";

export default function Rental() {
  return (
    <>
      <style
        id="page-text-guard"
        // 전역 텍스트/줄바꿈 가드: 모바일 자동 확대 방지 + 긴 텍스트 줄바꿈 안정화(깨짐 방지)
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
  word-break: keep-all;
  overflow-wrap: anywhere;
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
        {/* 이미지 CDN(Cloudinary) 연결 미리 열기: 특히 모바일에서 첫 이미지 로딩 지연을 줄이기 위함 */}
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
      <div className="max-w-screen-xl mx-auto px-4 pb-4 md:pb-0">
        {/* 섹션 구성: 좌측(이미지) + 우측(대여 안내/기대효과/문의) */}
        <div className="grid gap-8 md:grid-cols-2 items-stretch">
          {/* 좌측 이미지 영역: 불필요한 JS 레이아웃 동기화 없이 반응형으로 표시 */}
          <div className="flex items-center justify-center">
            {/* <picture> 사용: 모바일은 최적화(Cloudinary), PC는 원본 PNG 유지 */}
            <picture>
              {(() => {
                const REMOTE = "https://welfaredesign.netlify.app/images/business/rental.png";
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

          {/* 우측 영역: 대여 안내 → 기대효과 → 문의 */}
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

            {/* 문의 박스: 화면 크기별(PC/모바일) 레이아웃을 분리해 줄바꿈/가독성 최적화 */}
            <div className="mt-3 mb-1 md:mb-0">
              {/* PC/태블릿(md 이상): 기존 레이아웃(가운데 정렬 + 큰 폰트) 유지 */}
              <div className="hidden md:block rounded-2xl border border-[#F26C2A]/45 bg-gradient-to-r from-[#FFF3E9] to-[#EFFFFD] px-8 py-5 shadow-md">
                <div className="flex items-center justify-center gap-3 text-[#111827] tracking-tight">
                  {/* 전화 아이콘(SVG) */}
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
              {/* 모바일(md 미만): 한 줄 레이아웃 + 줄바꿈 방지(전화번호 잘림/개행 방지) */}
              <div className="md:hidden rounded-2xl border border-[#F26C2A]/45 bg-gradient-to-r from-[#FFF3E9] to-[#EFFFFD] px-5 py-4 shadow-md">
                <div className="flex items-center justify-between gap-3 text-[#111827]">
                  <div className="flex items-center gap-2 min-w-0">
                    {/* 전화 아이콘(SVG) */}
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
                                                                                                                                                                                                                                                                                                                                                                                                                                     