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

/**
 * Dropdown: 간단 드롭다운 메뉴 컴포넌트(확장용)
 * - hover/focus 이벤트로 open 상태 제어
 * - items: {to, label} 배열을 받아 NavLink 목록을 렌더링
 */
function Dropdown({ title, items }) {
  const { open, enter, leave } = useHoverDelay();
  return (
    <li
      className="relative"
      onMouseEnter={enter}
      onMouseLeave={leave}
      onFocus={enter}
      onBlur={leave}
    >
      <button
        type="button"
        className="hover:text-sky-600 focus:outline-none"
        aria-expanded={open}
      >
        {title}
      </button>
      {open && (
        <div
          className="absolute top-full left-0 z-[60] mt-2 bg-white shadow-xl rounded-2xl p-3 w-56"
          onMouseEnter={enter}
          onMouseLeave={leave}
          role="menu"
        >
          <ul className="flex flex-col">
            {items.map((it) => (
              <li key={it.to}>
                <NavLink
                  to={it.to}
                  className="block px-3 py-2 rounded hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-emerald-500"
                >
                  {it.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      )}
    </li>
  );
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

  // 상단 탭 UL의 실제 좌표와 너비를 기준으로 메가메뉴를 정렬
  const tabsRef = useRef(null);
  // 메가메뉴 컬럼을 상단 탭과 정확히 정렬하기 위한 좌표/폭
  const [megaLeft, setMegaLeft] = useState(0);
  const [megaWidth, setMegaWidth] = useState(0);
  const [showIllu, setShowIllu] = useState(true);

  // Mega-menu illustration card size (portrait 느낌)
  // - 가로로 'contain'되면서 가운데 작게 떠 보이는 문제를 해결하기 위해
  //   카드 자체를 세로 비율로 만들고, 이미지는 cover로 채움
  const ILLU_W = 320;
  const ILLU_H = 300;
  const ILLU_GAP = 44;

  const updateMegaRect = () => {
    if (!tabsRef.current) return;
    const rect = tabsRef.current.getBoundingClientRect();
    // tabsRef 기준(뷰포트 좌표)로 메가메뉴 컬럼을 위치시킴
    const w = rect.width || tabsRef.current.offsetWidth || 0;
    setMegaLeft(rect.left);
    setMegaWidth(w || 750);

    // 일러스트는 컬럼 왼쪽에 놓되, 공간이 부족하면 숨김(겹침 방지)
    const illuLeft = rect.left - (ILLU_W + ILLU_GAP);
    setShowIllu(illuLeft >= 16);
  };

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

  // 메가메뉴가 열릴 때 상단 탭 좌표를 측정(첫 렌더 타이밍 보정)
  useEffect(() => {
    if (!megaOpen) return;
    // layout 안정화 후 측정
    requestAnimationFrame(() => updateMegaRect());
  }, [megaOpen]);

  // 리사이즈 시 좌표 재계산
  useEffect(() => {
    const onResize = () => {
      if (!megaOpen) return;
      updateMegaRect();
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [megaOpen]);

  // 로고는 최적화 변환 없이 원본을 사용(리사이즈/압축 과정에서의 흐림 방지)
  const logoSrc = "/images/main/main3.png";

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
a, button, p, li, div, span { overflow-wrap: anywhere; word-break: keep-all; }
h1, h2, h3, h4, h5 { line-height: 1.25; }
.nowrap, .nav-nowrap { white-space: nowrap; }
`,
        }}
      />

      <header
        role="navigation"
        aria-label="Primary"
        className="sticky top-0 z-50 bg-white shadow"
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
            className="hidden md:grid col-start-2 grid-cols-4 gap-16 justify-items-center items-center text-center w-[750px] mx-auto"
          >
            {sections.map((sec, idx) => (
              <li key={sec.title} className="flex items-center">
                <button
                  type="button"
                  className={`text-left font-medium text-[16px] hover:text-emerald-600 leading-tight ${
                    activeIdx === idx
                      ? "text-emerald-600 underline decoration-emerald-500 underline-offset-8"
                      : ""
                  }`}
                  onClick={() => {
                    // 같은 탭을 다시 누르면 닫기
                    if (megaOpen && activeIdx === idx) {
                      setMegaOpen(false);
                      setActiveIdx(null);
                      return;
                    }
                    setMegaOpen(true);
                    setActiveIdx(idx);
                    requestAnimationFrame(() => updateMegaRect());
                  }}
                  onMouseEnter={() => {
                    // 클릭 UX가 기본이지만, 이미 열려있을 때는 hover로 탭 전환 허용
                    if (!megaOpen) return;
                    setActiveIdx(idx);
                    requestAnimationFrame(() => updateMegaRect());
                  }}
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
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-full shadow-sm hover:shadow transition"
            >
              후원 안내
            </Link>
            <Link
              to="/support/combination"
              className="border border-emerald-500 text-emerald-600 hover:bg-emerald-50 px-4 py-2 rounded-full transition"
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

        {megaOpen && (
          <div
            className="absolute left-0 right-0 top-full z-40 bg-white shadow-lg border-t"
            onMouseEnter={() => setMegaOpen(true)}
            onMouseLeave={() => {
              // hover로 닫히지 않게 유지 (클릭으로 닫는 방식)
            }}
          >
            <div
              style={{
                position: "relative",
                width: "100%",
                padding: "18px 0 26px",
                background: "#fff",
                overflow: "visible",
                minHeight: Math.max(300, ILLU_H + 60),
              }}
            >
              {/* Left illustration */}
              {showIllu && (
                <div
                  aria-hidden
                  style={{
                    position: "absolute",
                    left: Math.max(16, megaLeft - (ILLU_W + ILLU_GAP)),
                    top: 18,
                    width: ILLU_W,
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      height: ILLU_H,
                      borderRadius: 12,
                      overflow: "hidden",
                      background: "#FFF7F2",
                      border: "1px solid rgba(17,24,39,.10)",
                      boxShadow: "0 10px 22px rgba(0,0,0,.06)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: 0,
                    }}
                  >
                    <img
                      src="/images/illustrations/community.png"
                      alt=""
                      loading="eager"
                      decoding="async"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        objectPosition: "center 30%",
                        display: "block",
                        padding: 0,
                      }}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Right menu columns aligned to the top tabs */}
              <div
                style={{
                  position: "relative",
                  marginLeft: Math.max(16, megaLeft),
                  width: megaWidth,
                  maxWidth: "calc(100% - 32px)",
                }}
              >
                {(() => {
                  const sec = activeIdx != null ? sections[activeIdx] : null;
                  if (!sec) return null;

                  const itemCount = sec.items.length;
                  const cols = itemCount >= 6 ? 2 : 1; // 항목이 많으면 2열

                  return (
                    <div className="w-full">
                      <div className="text-left font-semibold text-[16px] text-gray-900 mb-5">
                        {sec.title}
                      </div>

                      <div
                        className={`grid gap-x-16 gap-y-3 ${cols === 2 ? "grid-cols-2" : "grid-cols-1"}`}
                        style={{ maxWidth: cols === 2 ? 680 : 420 }}
                      >
                        {sec.items.map((it) => (
                          <NavLink
                            key={it.to}
                            to={it.to}
                            className="block py-1 leading-[1.9] text-[15px] text-gray-800 hover:text-emerald-600 whitespace-normal focus-visible:ring-2 focus-visible:ring-emerald-500"
                            onClick={() => {
                              setMegaOpen(false);
                              setActiveIdx(null);
                            }}
                          >
                            <span className={it.nowrap ? "nav-nowrap" : ""}>{it.label}</span>
                          </NavLink>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
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
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-2 rounded-full text-sm shadow-sm transition whitespace-nowrap"
                onClick={() => setMobileOpen(false)}
              >
                후원 안내
              </Link>
              <Link
                to="/support/combination"
                className="border border-emerald-500 text-emerald-600 hover:bg-emerald-50 px-3 py-2 rounded-full text-sm transition whitespace-nowrap"
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

  // 데스크톱 메가메뉴: ESC / 바깥 클릭 시 닫기
  useEffect(() => {
    if (!megaOpen) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        setMegaOpen(false);
        setActiveIdx(null);
      }
    };

    const onPointerDown = (e) => {
      // header(네비) 영역 밖을 누르면 닫기
      const headerEl = document.querySelector('header[aria-label="Primary"]');
      if (!headerEl) return;
      if (!headerEl.contains(e.target)) {
        setMegaOpen(false);
        setActiveIdx(null);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, [megaOpen]);