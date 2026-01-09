/**
 * -----------------------------------------------------------------------------
 * Navbar.jsx
 * [컴포넌트 목적]
 *  - 사이트 전 페이지에서 공통으로 사용하는 상단 네비게이션(헤더)
 *
 * [구성]
 *  - 데스크톱: 상단 4개 섹션 탭(클릭) + 선택된 섹션만 표시되는 메가메뉴
 *  - 모바일: 햄버거 버튼 + 드로어(섹션별 details/summary 아코디언)
 *
 * [UX/동작 포인트]
 *  - 호버 진입/이탈에 지연 시간을 둬서 드롭다운 깜빡임 방지
 *  - 리사이즈/토글 시 상단 탭 영역의 좌표를 재측정하여 메가메뉴 정렬 유지
 *  - 모바일 메뉴 오픈 시 body 스크롤을 잠가 이중 스크롤을 방지
 *  - Navbar에서 전역 텍스트 줄바꿈/렌더링 안정화 CSS를 주입(모바일 확대/긴 문자열 대응)
 * -----------------------------------------------------------------------------
 */

// =============================
// React hooks / 라우팅 의존성
// =============================
import { useRef, useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

// hover 진입/이탈 시 메뉴가 너무 민감하게 깜빡이지 않도록 지연 시간을 둠
const OPEN_DELAY_MS = 120;
const CLOSE_DELAY_MS = 250;

/**
 * hover 지연(open/close delay)을 적용한 상태 관리 훅
 * - 마우스가 메뉴 경계에서 살짝 흔들려도 드롭다운이 닫히지 않도록 UX 개선
 */
function useHoverDelay() {
  const [open, setOpen] = useState(false);
  // 열기/닫기 타이머를 저장(컴포넌트 생명주기 동안 유지)
  const openT = useRef(null);
  const closeT = useRef(null);

  // hover 진입: 닫기 타이머를 취소하고, 일정 시간 후 open=true
  const enter = () => {
    if (closeT.current) clearTimeout(closeT.current);
    openT.current = setTimeout(() => setOpen(true), OPEN_DELAY_MS);
  };
  // hover 이탈: 열기 타이머를 취소하고, 일정 시간 후 open=false
  const leave = () => {
    if (openT.current) clearTimeout(openT.current);
    closeT.current = setTimeout(() => setOpen(false), CLOSE_DELAY_MS);
  };
  return { open, enter, leave, setOpen };
}


// 상단 네비게이션 바(데스크톱 메가메뉴 + 모바일 드로어)
export default function Navbar() {
  // 현재 경로 확인(홈에서 로고 클릭 시 강제 새로고침 처리 등에 사용)
  const location = useLocation();

  // 모바일 드로어(햄버거 메뉴) 열림/닫힘 상태
  const [mobileOpen, setMobileOpen] = useState(false);

  // 메가메뉴(데스크톱) 열기 상태
  const [megaOpen, setMegaOpen] = useState(false);

  // 클릭(또는 보조로 hover)로 선택된 상단 탭 인덱스
  const [activeIdx, setActiveIdx] = useState(null);
  const openTimer = useRef(null);
  const closeTimer = useRef(null);
  const openMega = (idx) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    if (openTimer.current) clearTimeout(openTimer.current);
    openTimer.current = setTimeout(() => {
      setMegaOpen(true);
      setActiveIdx(idx);
    }, OPEN_DELAY_MS);
  };
  const closeMega = () => {
    if (openTimer.current) clearTimeout(openTimer.current);
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => {
      setMegaOpen(false);
      setActiveIdx(null);
    }, CLOSE_DELAY_MS);
  };

  // 상단 탭 UL ref(향후 정렬/접근성 확장용)
  const tabsRef = useRef(null);

  // 모바일 드로어가 열려 있을 때 배경(body) 스크롤을 잠가 이중 스크롤을 방지
  useEffect(() => {
    const prev = document.body.style.overflow;
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = prev || "";
    }
    return () => {
      document.body.style.overflow = prev || "";
    };
  }, [mobileOpen]);


  // 로고는 최적화 변환 없이 원본을 사용(리사이즈/압축 과정에서의 흐림 방지)
  const logoSrc = "/images/main/main3.png";

  // CTA button styles (2안: 브라운 Primary + 그린 Secondary)
  const CTA_PRIMARY =
    "bg-[#A07055] hover:bg-[#8B5E45] text-white px-4 py-2 rounded-full shadow-sm hover:shadow transition whitespace-nowrap";
  const CTA_SECONDARY =
    "border border-[#4FAF7C] text-[#4FAF7C] hover:bg-[#E9F6EF] px-4 py-2 rounded-full transition whitespace-nowrap";

  // 상단 섹션/항목 정의
  const sections = [
    {
      title: "복지디자인 소개",
      items: [
        { to: "/about/what", label: "복지디자인은?" },
        { to: "/about/establishment", label: "인사말" },
        { to: "/about/history", label: "연혁" },
        { to: "/about/people", label: "함께하는 사람들" },
      ],
    },
    {
      title: "소식",
      items: [
        { to: "/news/stories", label: "복지디자인 이야기" },
        { to: "/news/notices", label: "공지사항" },
      ],
    },
    {
      title: "사업",
      items: [
        { to: "/business/overview", label: "사업영역" },
        { to: "/business/rental", label: "휠체어·복지용구 대여" },
        { to: "/business/apply-help", label: "복지용구 신청 안내" },
        { to: "/business/donation", label: "보조기기 기증 캠페인" },
        {
          to: "/business/ewc-insurance",
          label: "전동휠체어 보험금 지원",
          nowrap: true,
        },
        { to: "/business/needs-survey", label: "복지욕구 실태조사" },
        { to: "/business/member-services", label: "조합원 지원 서비스" },
      ],
    },
    {
      title: "후원",
      items: [
        { to: "/support/guide", label: "후원안내" },
        { to: "/support/faq", label: "FAQ" },
      ],
    },
  ];

  return (
    <>
      <style
        id="global-text-guard"
        dangerouslySetInnerHTML={{
          __html: `
html { -webkit-text-size-adjust: 100%; text-size-adjust: 100%; }
/* 공통 박스 모델: 레이아웃 계산 안정화 */
*, *::before, *::after { box-sizing: border-box; min-width: 0; }
body {
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
  word-break: keep-all;
  overflow-wrap: anywhere;
}
a, button { overflow-wrap: normal; word-break: keep-all; }
p, li, div, span { overflow-wrap: anywhere; word-break: keep-all; }
h1, h2, h3, h4, h5 { line-height: 1.25; }
.nowrap, .nav-nowrap { white-space: nowrap; }
`,
        }}
      />

      <header
        role="navigation"
        aria-label="Primary"
        className="sticky top-0 z-50 bg-white shadow"
        onMouseLeave={closeMega}
      >
        <nav className="w-full relative px-4 md:pl-[120px] md:pr-6 py-3 grid grid-cols-[auto,1fr,auto] items-center gap-6">
          {/* 로고 영역 */}
          <Link
            to="/"
            className="flex items-center mr-4 md:mr-8"
            onClick={(e) => {
              if (location.pathname === "/") {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
                setTimeout(() => window.location.reload(), 150);
              }
            }}
          >
            <img
              src={logoSrc}
              alt="복지 디자인 로고"
              className="h-12 w-auto md:h-16 object-contain block"
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
          </Link>

          {/* 상단 탭(데스크톱) */}
          <ul
            ref={tabsRef}
            className="hidden md:grid col-start-2 grid-cols-4 gap-24 justify-items-center items-center text-center w-[750px] mx-auto"
          >
            {sections.map((sec, idx) => (
              <li key={sec.title} className="flex items-center">
                <button
                  type="button"
                  className={`text-left font-normal text-[15.5px] hover:text-emerald-600 leading-tight transition-colors ${
                    megaOpen && activeIdx === idx
                      ? "text-emerald-600 underline decoration-emerald-500 underline-offset-8"
                      : ""
                  }`}
                  onMouseEnter={() => openMega(idx)}
                  onMouseLeave={closeMega}
                  aria-expanded={megaOpen && activeIdx === idx}
                >
                  {sec.title}
                </button>
              </li>
            ))}
          </ul>

          {/* 우측 버튼 */}
          <div className="hidden md:flex items-center gap-3 col-start-3 justify-self-end">
            <Link
              to="/support/guide"
              className={CTA_PRIMARY}
            >
              후원 안내
            </Link>
            <Link
              to="/support/combination"
              className={CTA_SECONDARY}
            >
              조합 가입
            </Link>
          </div>

          {/* 모바일 햄버거 버튼 */}
          <button
            className="md:hidden ml-auto rounded-md p-3 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 z-[75] min-w-[44px] min-h-[44px] flex items-center justify-center"
            style={{ touchAction: "manipulation" }}
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="toggle menu"
            aria-expanded={mobileOpen}
          >
            <span className="text-2xl leading-none" aria-hidden="true">
              ☰
            </span>
          </button>
        </nav>

        {megaOpen && activeIdx != null && (
          <div
            className="absolute left-0 right-0 top-full z-40"
            style={{ paddingTop: 10 }}
            onMouseEnter={() => {
              if (closeTimer.current) clearTimeout(closeTimer.current);
            }}
            onMouseLeave={closeMega}
          >
            {(() => {
              const sec = sections[activeIdx];
              const items = sec.items;

              // 섹션별 컬럼 수
              // - 소식/후원: 2칸
              // - 나머지: 4칸
              const isNews = sec.title === "소식";
              const isSupport = sec.title === "후원";
              const isBusiness = sec.title === "사업";
              const colCount = isNews || isSupport ? 2 : 4;

              const cols = Array.from({ length: colCount }, () => []);

              // 아이템 분배 규칙
              // - 사업: 1번 칸에 '사업영역'만, 나머지는 2개씩 2~4칸에 배치
              // - 그 외: 균등 분배
              if (isBusiness) {
                const first = items[0]; // 사업영역
                if (first) cols[0].push(first);

                const rest = items.slice(1);
                rest.forEach((it, i) => {
                  const target = 1 + Math.floor(i / 2);
                  const safeTarget = Math.min(target, colCount - 1);
                  cols[safeTarget].push(it);
                });
              } else {
                items.forEach((it, i) => {
                  cols[i % colCount].push(it);
                });
              }

              return (
                <div className="w-full">
                  {/* 드롭다운 영역 배경(살짝 따뜻한 톤) */}
                  <div className="bg-gradient-to-b from-[#FFF7F2] to-white">
                    <div className="mx-auto w-full max-w-[1440px] px-6 md:px-10 py-6">
                      <div className="rounded-2xl border border-gray-200 bg-white shadow-[0_18px_48px_rgba(0,0,0,0.12)] overflow-hidden">
                        <div className="flex">
                          {/* Left image panel */}
                          <div className="w-[320px] shrink-0 border-r border-gray-200 bg-[#FFF7F2]">
                            <div className="relative h-[300px]">
                              <img
                                src="/images/illustrations/community.png"
                                alt=""
                                className="absolute inset-0 h-full w-full object-cover object-center"
                                loading="eager"
                                decoding="async"
                              />
                              {/* 상단은 밝게, 하단은 살짝 진하게: 텍스트 가독성 */}
                              <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/55 to-white/85" />

                              <div className="relative h-full px-9 py-8 flex flex-col justify-end">
                                <div className="text-[30px] leading-tight text-emerald-700 font-normal tracking-[-0.01em]">
                                  {sec.title}
                                </div>
                                <div className="mt-2 text-[13px] text-gray-600 leading-relaxed">
                                  원하는 메뉴를 선택해 주세요.
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Right columns */}
                          <div className="flex-1">
                            <div
                              className="grid divide-x divide-gray-200"
                              style={{
                                gridTemplateColumns: `repeat(${colCount}, minmax(0, 1fr))`,
                              }}
                            >
                              {cols.map((col, ci) => (
                                <div key={ci} className="px-10 py-10">
                                  <ul className="space-y-2">
                                    {col.map((it) => (
                                      <li key={it.to}>
                                        <NavLink
                                          to={it.to}
                                          className="group w-full inline-flex items-center justify-between gap-3 rounded-xl px-3 py-3 text-[17px] leading-snug text-gray-900 font-normal transition-colors hover:bg-emerald-50 hover:text-emerald-700 focus-visible:ring-2 focus-visible:ring-emerald-500"
                                          onClick={() => {
                                            setMegaOpen(false);
                                            setActiveIdx(null);
                                          }}
                                        >
                                          <span className={it.nowrap ? "nav-nowrap" : ""}>
                                            {it.label}
                                          </span>
                                          <span
                                            aria-hidden="true"
                                            className="opacity-0 translate-x-[-2px] transition-all group-hover:opacity-100 group-hover:translate-x-0 text-emerald-600"
                                          >
                                            →
                                          </span>
                                        </NavLink>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* 모바일 메뉴 오버레이 */}
        {mobileOpen && (
          <div
            className="fixed inset-0 z-40 md:hidden"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
        )}

        {mobileOpen && (
          <div className="md:hidden absolute left-0 right-0 top-full z-[70] border-t bg-white shadow-lg">
            <div className="px-4 py-3 flex gap-2 items-center sticky top-0 bg-white z-10 border-b">
              <Link
                to="/support/guide"
                className="bg-[#A07055] hover:bg-[#8B5E45] text-white px-3 py-2 rounded-full text-sm shadow-sm transition whitespace-nowrap"
                onClick={() => setMobileOpen(false)}
              >
                후원 안내
              </Link>
              <Link
                to="/support/combination"
                className="border border-[#4FAF7C] text-[#4FAF7C] hover:bg-[#E9F6EF] px-3 py-2 rounded-full text-sm transition whitespace-nowrap"
                onClick={() => setMobileOpen(false)}
              >
                조합 가입
              </Link>
            </div>

            {/* 소개 */}
            <details className="border-b">
              <summary className="px-4 py-3 cursor-pointer hover:bg-gray-50">
                소개
              </summary>
              <div className="px-2 pb-2">
                <NavLink
                  to="/about/what"
                  className="block px-3 py-2 rounded hover:bg-gray-50"
                  onClick={(e) => {
                    setMobileOpen(false);
                    e.target.closest("details").removeAttribute("open");
                  }}
                >
                  복지디자인은?
                </NavLink>
                <NavLink
                  to="/about/establishment"
                  className="block px-3 py-2 rounded hover:bg-gray-50"
                  onClick={(e) => {
                    setMobileOpen(false);
                    e.target.closest("details").removeAttribute("open");
                  }}
                >
                  인사말
                </NavLink>
                <NavLink
                  to="/about/history"
                  className="block px-3 py-2 rounded hover:bg-gray-50"
                  onClick={(e) => {
                    setMobileOpen(false);
                    e.target.closest("details").removeAttribute("open");
                  }}
                >
                  연혁
                </NavLink>
                <NavLink
                  to="/about/people"
                  className="block px-3 py-2 rounded hover:bg-gray-50"
                  onClick={(e) => {
                    setMobileOpen(false);
                    e.target.closest("details").removeAttribute("open");
                  }}
                >
                  함께하는 사람들
                </NavLink>
              </div>
            </details>

            {/* 소식 */}
            <details className="border-b">
              <summary className="px-4 py-3 cursor-pointer hover:bg-gray-50">
                소식
              </summary>
              <div className="px-2 pb-2">
                <NavLink
                  to="/news/stories"
                  className="block px-3 py-2 rounded hover:bg-gray-50"
                  onClick={(e) => {
                    setMobileOpen(false);
                    e.target.closest("details").removeAttribute("open");
                  }}
                >
                  복지디자인 이야기
                </NavLink>
                <NavLink
                  to="/news/notices"
                  className="block px-3 py-2 rounded hover:bg-gray-50"
                  onClick={(e) => {
                    setMobileOpen(false);
                    e.target.closest("details").removeAttribute("open");
                  }}
                >
                  공지사항
                </NavLink>
              </div>
            </details>

            {/* 사업 */}
            <details className="border-b">
              <summary className="px-4 py-3 cursor-pointer hover:bg-gray-50">
                사업
              </summary>
              <div className="px-2 pb-2">
                <NavLink
                  to="/business/overview"
                  className="block px-3 py-2 rounded hover:bg-gray-50"
                  onClick={(e) => {
                    setMobileOpen(false);
                    e.target.closest("details").removeAttribute("open");
                  }}
                >
                  사업영역
                </NavLink>
                <NavLink
                  to="/business/rental"
                  className="block px-3 py-2 rounded hover:bg-gray-50"
                  onClick={(e) => {
                    setMobileOpen(false);
                    e.target.closest("details").removeAttribute("open");
                  }}
                >
                  휠체어·복지용구 대여
                </NavLink>
                <NavLink
                  to="/business/apply-help"
                  className="block px-3 py-2 rounded hover:bg-gray-50"
                  onClick={(e) => {
                    setMobileOpen(false);
                    e.target.closest("details").removeAttribute("open");
                  }}
                >
                  복지용구 신청 안내
                </NavLink>
                <NavLink
                  to="/business/donation"
                  className="block px-3 py-2 rounded hover:bg-gray-50"
                  onClick={(e) => {
                    setMobileOpen(false);
                    e.target.closest("details").removeAttribute("open");
                  }}
                >
                  보조기기 기증 캠페인
                </NavLink>
                <NavLink
                  to="/business/ewc-insurance"
                  className="block px-3 py-2 rounded hover:bg-gray-50"
                  onClick={(e) => {
                    setMobileOpen(false);
                    e.target.closest("details").removeAttribute("open");
                  }}
                >
                  전동휠체어 보험금 지원
                </NavLink>
                <NavLink
                  to="/business/needs-survey"
                  className="block px-3 py-2 rounded hover:bg-gray-50"
                  onClick={(e) => {
                    setMobileOpen(false);
                    e.target.closest("details").removeAttribute("open");
                  }}
                >
                  복지욕구 실태조사
                </NavLink>
                <NavLink
                  to="/business/member-services"
                  className="block px-3 py-2 rounded hover:bg-gray-50"
                  onClick={(e) => {
                    setMobileOpen(false);
                    e.target.closest("details").removeAttribute("open");
                  }}
                >
                  조합원 지원 서비스
                </NavLink>
              </div>
            </details>

            {/* 후원 */}
            <details>
              <summary className="px-4 py-3 cursor-pointer hover:bg-gray-50">
                후원
              </summary>
              <div className="px-2 pb-2">
                <NavLink
                  to="/support/guide"
                  className="block px-3 py-2 rounded hover:bg-gray-50"
                  onClick={(e) => {
                    setMobileOpen(false);
                    e.target.closest("details").removeAttribute("open");
                  }}
                >
                  후원안내
                </NavLink>
                <NavLink
                  to="/support/faq"
                  className="block px-3 py-2 rounded hover:bg-gray-50"
                  onClick={(e) => {
                    setMobileOpen(false);
                    e.target.closest("details").removeAttribute("open");
                  }}
                >
                  FAQ
                </NavLink>
              </div>
            </details>
          </div>
        )}
      </header>
    </>
  );
}