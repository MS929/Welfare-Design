// -----------------------------------------------------------------------------
// Overview.jsx
// [페이지 목적]
//  - 복지디자인 사회적협동조합 사업영역 메인 페이지
//  - 운영 중인 사업들을 카드 형태로 보여주고 각 상세 페이지로 연결
//
// [데이터 구조]
//  - programs 배열에서 사업명/설명/아이콘/이동 경로 관리
//  - 사업 추가 또는 삭제 시 programs 배열만 수정
//
// [화면 구성]
//  - 상단: 사업영역 소개 문구
//  - 하단: 사업별 이동 카드 목록
//
// [UX/성능]
//  - 반응형 grid 구조로 PC/모바일 대응
//  - content-visibility 적용으로 카드 렌더링 최적화
//
// [유지보수 위치]
//  - 사업 추가: programs 배열 추가
//  - 사업 아이콘 변경: /public/images/icons 이미지 교체
//  - 공통 레이아웃 변경: BizLayout 수정
// -----------------------------------------------------------------------------
import { Link } from "react-router-dom";
import BizLayout from "./_Layout";

export default function BizOverview() {
  // 사업 카드 데이터
  // - 사업 추가/삭제는 이 배열에서 관리
  // - to: 이동 경로
  // - icon: public/images/icons 기준 이미지 경로
  const programs = [
    {
      to: "/business/apply-help",
      title: "노인장기요양보험 <strong>복지용구</strong>",
      desc: "노인장기요양보험 복지용구 급여와 이용 절차를 안내합니다.",
      icon: "/images/icons/apply-help.png",
    },
    {
      to: "/business/rental",
      title: "휠체어 무료 대여",
      desc: "단기/긴급 대여로 이동권과 일상 회복을 지원합니다.",
      icon: "/images/icons/rental.png",
    },
    {
      to: "/business/needs-survey",
      title: "보조기기 기증 및 수리",
      desc: "문의 및 상담, 기증 및 수리 서비스 안내.",
      icon: "/images/icons/needs-survey.png",
    },
    {
      to: "/business/ewc-insurance",
      title: "취약 계층 복지욕구 실태조사",
      desc: "현장의 요구를 데이터로 수집·분석하여 정책·사업에 반영.",
      icon: "/images/icons/ewc-insurance.png",
    },
    {
      to: "/business/member-services",
      title: "조합원 지원 서비스",
      desc: "상담·교육·정보제공 등 조합원 전용 프로그램.",
      icon: "/images/icons/member-services.png",
    },
  ];

  return (
    <>
      {/* 페이지 전용 텍스트 가드 CSS
          - 모바일 브라우저 자동 글자 확대 방지
          - 한글 줄바꿈 및 긴 텍스트 깨짐 방지 */}
      <style
        id="page-text-guard"
        dangerouslySetInnerHTML={{
          __html: `
/* 모바일 환경에서 브라우저 자동 글자 확대 방지 */
html { -webkit-text-size-adjust: 100%; text-size-adjust: 100%; }
/* 박스 모델 통일 및 줄바꿈 안정성 확보 */
*, *::before, *::after { box-sizing: border-box; min-width: 0; hyphens: manual; -webkit-hyphens: manual; }
/* 가독성 향상을 위한 기본 텍스트 렌더링 설정 */
body {
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
  word-break: keep-all;
  overflow-wrap: anywhere;
  -webkit-line-break: after-white-space;
}
/* 제목 줄바꿈 균형 조정 (지원 브라우저 한정) */
h1, h2, .heading-balance { text-wrap: balance; }
/* text-wrap 미지원 브라우저 대응 */
@supports not (text-wrap: balance) {
  h1, h2, .heading-balance { line-height: 1.25; max-width: 45ch; }
}
/* 강조 텍스트(mark) 스타일 통일 */
mark, [data-hl] {
  -webkit-box-decoration-break: clone;
  box-decoration-break: clone;
  padding: 0 .08em;
  border-radius: 2px;
}
/* 강제 줄바꿈 방지 유틸리티 */
.nowrap { white-space: nowrap; }
/* 긴 단어/URL 줄바꿈 허용 */
.u-wrap-anywhere { overflow-wrap: anywhere; word-break: keep-all; }
/* 한 줄 말줄임 처리 */
.u-ellipsis { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
/* 카드 렌더링 성능 최적화 (content-visibility) */
.cv { content-visibility: auto; contain-intrinsic-size: 240px 160px; }
        `,
        }}
      />

      <BizLayout title="사업영역">
        <section>
          <p className="text-gray-700 leading-relaxed">
            복지디자인 사회적협동조합은 이동·건강·경제·정보 접근성 등을 중심으로
            지역 기반 상호부조의 사업을 전개합니다. 아래 프로그램은 현재 운영 중인
            핵심 사업으로, 대상/절차/문의는 각 페이지에서 확인하실 수 있습니다.
          </p>

          {/* 사업 카드 목록
              - programs 배열을 순회하여 자동 생성
              - 카드 클릭 시 각 사업 상세 페이지 이동 */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {programs.map((p) => {
              return (
                <Link
                  key={p.to + p.title}
                  to={p.to}
                  className="cv relative block h-full rounded-2xl border border-[#2CB9B1]/30 bg-white/90 backdrop-blur-[1px] ring-1 ring-inset ring-white/60 shadow-sm hover:shadow-md transition-all duration-200 hover:border-[#2CB9B1]/50 focus:outline-none focus:ring-2 focus:ring-[#2CB9B1]/40"
                >
                  <div className="p-5 flex flex-col h-full">
                    <div className="flex items-center gap-3">
                      <span className="inline-block h-2.5 w-2.5 shrink-0 rounded-full bg-[#F26C2A] shadow-[0_0_0_2px_rgba(242,108,42,0.18)]" />
                      <h4 className="font-semibold text-[17px] text-[#111827] leading-snug">
                        {p.title.includes("<strong>") ? (
                          <>
                            <span className="relative top-[1px] text-[13px] font-medium text-gray-500">
                              노인장기요양보험
                            </span>{" "}
                            <span className="text-[20px] font-bold text-[#111827] tracking-[-0.01em] leading-none">
                              복지용구
                            </span>
                          </>
                        ) : (
                          p.title
                        )}
                      </h4>
                    </div>

                    <p className="text-sm text-gray-600 mt-3 leading-relaxed flex-1">
                      {p.desc}
                    </p>

                    <span className="inline-flex items-center gap-1 text-[#F26C2A] font-semibold mt-4">
                      자세히 보기
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="h-4 w-4"
                      >
                        <path d="M13.5 4.5 21 12l-7.5 7.5m7.5-7.5H3" />
                      </svg>
                    </span>
                  </div>

                  {/* 사업 아이콘 이미지
                      - 장식 목적 이미지이므로 alt="" 처리
                      - lazy loading으로 초기 로딩 부담 감소 */}
                  <img
                    src={p.icon}
                    alt=""
                    width={48}
                    height={48}
                    loading="lazy"
                    decoding="async"
                    fetchPriority="low"
                    className="absolute bottom-3 right-3 w-12 h-12 opacity-80 select-none pointer-events-none"
                  />
                </Link>
              );
            })}
          </div>
        </section>
      </BizLayout>
    </>
  );
}
