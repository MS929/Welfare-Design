/**
 * -----------------------------------------------------------------------------
 * Navbar.jsx 
 * [컴포넌트 목적]
 *  - 사이트 전 페이지에서 공통으로 사용하는 상단 네비게이션(헤더)
 *
 * [구성]
 *  - 데스크톱: 상단 4개 섹션 탭 + 호버 기반 메가메뉴ssssssss
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
  // (hover 기반) 메가메뉴가 열려 있는 동안만 하단 패널을 렌더링

  // 현재 포인터가 올라간 상단 탭 인덱스
  const [hoveredIdx, setHoveredIdx] = useState(null);

  // 상단 탭 UL의 실제 좌표와 너비를 기준으로 메가메뉴를 정렬
  const tabsRef = useRef(null);
  const [megaLeft, setMegaLeft] = useState(0);
  const [megaWidth, setMegaWidth] = useState(0);

  const updateMegaLeft = () => {
    if (!tabsRef.current) return;
    const rect = tabsRef.current.getBoundingClientRect();
    // 소수점까지 포함한 정확한 좌표를 사용해 메가메뉴 컬럼을 상단 탭과 정렬
    // 특히 우측 끝("후원") 컬럼이 어긋나지 않도록 rect.left/width 값을 그대로 사용
    setMegaLeft(rect.left);
    setMegaWidth(rect.width || tabsRef.current.offsetWidth || 0);
  };

  // 메가메뉴 토글 시 현재 탭 영역 좌표를 다시 측정
  useEffect(() => { updateMegaLeft(); }, [megaOpen]);

  // 리사이즈 시 메가메뉴 좌표 재계산
  useEffect(() => {
    const on = () => updateMegaLeft();
    window.addEventListener("resize", on);
    return () => window.removeEventListener("resize", on);
  }, []);

  // 모바일 드로어가 열려 있을 때 배경(body) 스크롤을 잠가 이중 스크롤을 방지
  useEffect(() => {
    const prev = document.body.style.overflow;
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = prev || '';
    }
    return () => {
      document.body.style.overflow = prev || '';
    };
  }, [mobileOpen]);

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
        { to: "/business/ewc-insurance", label: "전동휠체어 보험금 지원", nowrap: true },
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
        // Navbar를 통해 모든 페이지에 적용되는 전역 텍스트/줄바꿈 안정화 스타일
        dangerouslySetInnerHTML={{ __html: `
html { -webkit-text-size-adjust: 100%; text-size-adjust: 100%; }
/* 공통 박스 모델: 레이아웃 계산 안정화 */
*, *::before, *::after { box-sizing: border-box; min-width: 0; }
body {
  line-height: 1.5;                    /* 기본 행간 */
  -webkit-font-smoothing: antialiased; /* 글자 렌더링 부드럽게(웹킷) */
  -moz-osx-font-smoothing: grayscale;  /* 글자 렌더링 부드럽게(맥) */
  text-rendering: optimizeLegibility;  /* 가독성 우선 렌더링 */
  word-break: keep-all;                /* 한글 단어 중간 분리 방지 */
  overflow-wrap: anywhere;             /* 긴 영문/URL도 안전하게 줄바꿈 */
}
/* 링크/버튼/텍스트 요소에서 긴 문자열이 레이아웃을 깨지 않도록 방어 */
a, button, p, li, div, span { overflow-wrap: anywhere; word-break: keep-all; }
/* 제목 계열: 과도한 줄간격 확장을 방지 */
h1, h2, h3, h4, h5 { line-height: 1.25; }
/* 특정 텍스트는 줄바꿈 금지(메뉴 라벨 등) */
.nowrap, .nav-nowrap { white-space: nowrap; }
` }}
      />

      <header
        role="navigation"
        aria-label="Primary"
        className="sticky top-0 z-50 bg-white shadow"
        onMouseLeave={() => { setMegaOpen(false); setHoveredIdx(null); }}
      >
        <nav className="w-full relative px-4 md:pl-[120px] md:pr-6 py-3 grid grid-cols-[auto,1fr,auto] items-center gap-6">
          {/* 로고 영역 (데스크톱에서 탭 그리드가 밀리지 않도록 인라인 배치) */}
          <Link
            to="/"
            className="flex items-center mr-4 md:mr-8"
            onClick={(e) => {
              // 이미 홈(/)에 있는 상태에서 로고를 누르면 "새로고침"처럼 동작하도록 강제 처리
              if (location.pathname === "/") {
                e.preventDefault();
                // UX를 위해 먼저 상단으로 스크롤한 뒤 하드 리로드 실행
                window.scrollTo({ top: 0, behavior: "smooth" });
                // smooth 스크롤 적용을 고려해 잠시 지연 후 리로드
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

          {/* 상단 탭(데스크톱) — 로고 옆에 4개 섹션 탭 표시 */}
          <ul
            ref={tabsRef}
            className="hidden md:grid col-start-2 grid-cols-4 gap-16 justify-items-center items-center text-center w-[750px] mx-auto"
          >
            {sections.map((sec, idx) => (
              <li key={sec.title} className="flex items-center">
                <button
                  type="button"
                  className={`text-left font-medium text-[16px] hover:text-emerald-600 leading-tight ${hoveredIdx === idx ? "text-emerald-600 underline decoration-emerald-500 underline-offset-8" : ""}`}
                  onMouseEnter={() => { setMegaOpen(true); setHoveredIdx(idx); }}
                >
                  {sec.title}
                </button>
              </li>
            ))}
          </ul>

          {/* 우측 버튼 */}
          <div className="hidden md:flex items-center gap-3 col-start-3 justify-self-end">
            <Link to="/support/guide" className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-full shadow-sm hover:shadow transition">후원 안내</Link>
            <Link to="/support/combination" className="border border-emerald-500 text-emerald-600 hover:bg-emerald-50 px-4 py-2 rounded-full transition">조합 가입</Link>
          </div>

          {/* 모바일 햄버거 버튼 */}
          <button
            className="md:hidden ml-auto rounded-md p-3 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 z-[75] min-w-[44px] min-h-[44px] flex items-center justify-center"
            style={{ touchAction: 'manipulation' }}
            onClick={() => setMobileOpen(v => !v)}
            aria-label="toggle menu"
            aria-expanded={mobileOpen}
          >
            <span className="text-2xl leading-none" aria-hidden="true">☰</span>
          </button>
        </nav>

        {megaOpen && (
          <div
            className="absolute left-0 right-0 top-full z-40 bg-white shadow-lg border-t"
            onMouseEnter={() => setMegaOpen(true)}
            onMouseLeave={() => {
              setMegaOpen(false);
              setHoveredIdx(null);
            }}
          >
            {/*
              Desktop Mega Menu Layout
              - Left: illustration panel (replace the image path as needed)
              - Right: 4-column menu aligned in a centered container
            */}
            <div
              style={{
                maxWidth: 1360,
                margin: "0 auto",
                padding: "22px 24px 26px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 44,
                }}
              >
                {/* Left illustration panel */}
                <div
                  aria-hidden
                  style={{
                    flex: "0 0 360px",
                    maxWidth: 360,
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      borderRadius: 10,
                      overflow: "hidden",
                      background: "#FFF7F2",
                      border: "1px solid rgba(17,24,39,.10)",
                      boxShadow: "0 8px 18px rgba(0,0,0,.06)",
                    }}
                  >
                    <img
                      src="/images/illustrations/mega-community.png"
                      alt=""
                      loading="eager"
                      decoding="async"
                      style={{
                        width: "100%",
                        height: "auto",
                        display: "block",
                      }}
                      onError={(e) => {
                        // If the file path is different, replace it with the correct one.
                        // Prevent infinite loop.
                        e.currentTarget.onerror = null;
                      }}
                    />
                  </div>
                </div>

                {/* Right menu columns */}
                <div style={{ flex: "1 1 auto" }}>
                  <div className="grid grid-cols-4 gap-16 justify-items-center pt-1 text-center">
                    {sections.map((sec) => (
                      <div key={sec.title} className="text-center">
                        <ul className="space-y-2">
                          {sec.items.map((it) => (
                            <li key={it.to}>
                              <NavLink
                                to={it.to}
                                className="block py-1 leading-[1.6] text-[15px] text-gray-800 hover:text-emerald-600 whitespace-normal focus-visible:ring-2 focus-visible:ring-emerald-500 text-center"
                                onClick={() => {
                                  setMegaOpen(false);
                                  setHoveredIdx(null);
                                }}
                              >
                                <span className={it.nowrap ? "nav-nowrap" : ""}>{it.label}</span>
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
        )}

        {/* 모바일 메뉴 오버레이(바깥 클릭 시 닫힘) */}
        {mobileOpen && (
          <div className="fixed inset-0 z-40 md:hidden" onClick={() => setMobileOpen(false)} aria-hidden="true" />
        )}

        {mobileOpen && (
          <div className="md:hidden absolute left-0 right-0 top-full z-[70] border-t bg-white shadow-lg">
            {/* 모바일 드로어 상단 CTA 버튼 */}
            <div className="px-4 py-3 flex gap-2 items-center sticky top-0 bg-white z-10 border-b">
              <Link to="/support/guide" className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-2 rounded-full text-sm shadow-sm transition whitespace-nowrap" onClick={() => setMobileOpen(false)}>후원 안내</Link>
              <Link to="/support/combination" className="border border-emerald-500 text-emerald-600 hover:bg-emerald-50 px-3 py-2 rounded-full text-sm transition whitespace-nowrap" onClick={() => setMobileOpen(false)}>조합 가입</Link>
            </div>

            {/* 모바일 아코디언 메뉴: 섹션별로 details/summary로 접고 펼침 */}
            {/* 소개 */}
            <details className="border-b"><summary className="px-4 py-3 cursor-pointer hover:bg-gray-50">소개</summary>
              <div className="px-2 pb-2">
                <NavLink to="/about/what" className="block px-3 py-2 rounded hover:bg-gray-50" onClick={(e)=>{setMobileOpen(false); e.target.closest('details').removeAttribute('open');}}>복지디자인은?</NavLink>
                <NavLink to="/about/establishment" className="block px-3 py-2 rounded hover:bg-gray-50" onClick={(e)=>{setMobileOpen(false); e.target.closest('details').removeAttribute('open');}}>인사말</NavLink>
                <NavLink to="/about/history" className="block px-3 py-2 rounded hover:bg-gray-50" onClick={(e)=>{setMobileOpen(false); e.target.closest('details').removeAttribute('open');}}>연혁</NavLink>
                <NavLink to="/about/people" className="block px-3 py-2 rounded hover:bg-gray-50" onClick={(e)=>{setMobileOpen(false); e.target.closest('details').removeAttribute('open');}}>함께하는 사람들</NavLink>
              </div>
            </details>

            {/* 소식 */}
            <details className="border-b"><summary className="px-4 py-3 cursor-pointer hover:bg-gray-50">소식</summary>
              <div className="px-2 pb-2">
                <NavLink to="/news/stories" className="block px-3 py-2 rounded hover:bg-gray-50" onClick={(e)=>{setMobileOpen(false); e.target.closest('details').removeAttribute('open');}}>복지디자인 이야기</NavLink>
                <NavLink to="/news/notices" className="block px-3 py-2 rounded hover:bg-gray-50" onClick={(e)=>{setMobileOpen(false); e.target.closest('details').removeAttribute('open');}}>공지사항</NavLink>
              </div>
            </details>

            {/* 사업 */}
            <details className="border-b"><summary className="px-4 py-3 cursor-pointer hover:bg-gray-50">사업</summary>
              <div className="px-2 pb-2">
                <NavLink to="/business/overview" className="block px-3 py-2 rounded hover:bg-gray-50" onClick={(e)=>{setMobileOpen(false); e.target.closest('details').removeAttribute('open');}}>사업영역</NavLink>
                <NavLink to="/business/rental" className="block px-3 py-2 rounded hover:bg-gray-50" onClick={(e)=>{setMobileOpen(false); e.target.closest('details').removeAttribute('open');}}>휠체어·복지용구 대여</NavLink>
                <NavLink to="/business/apply-help" className="block px-3 py-2 rounded hover:bg-gray-50" onClick={(e)=>{setMobileOpen(false); e.target.closest('details').removeAttribute('open');}}>복지용구 신청 안내</NavLink>
                <NavLink to="/business/donation" className="block px-3 py-2 rounded hover:bg-gray-50" onClick={(e)=>{setMobileOpen(false); e.target.closest('details').removeAttribute('open');}}>보조기기 기증 캠페인</NavLink>
                <NavLink to="/business/ewc-insurance" className="block px-3 py-2 rounded hover:bg-gray-50" onClick={(e)=>{setMobileOpen(false); e.target.closest('details').removeAttribute('open');}}>전동휠체어 보험금 지원</NavLink>
                <NavLink to="/business/needs-survey" className="block px-3 py-2 rounded hover:bg-gray-50" onClick={(e)=>{setMobileOpen(false); e.target.closest('details').removeAttribute('open');}}>복지욕구 실태조사</NavLink>
                <NavLink to="/business/member-services" className="block px-3 py-2 rounded hover:bg-gray-50" onClick={(e)=>{setMobileOpen(false); e.target.closest('details').removeAttribute('open');}}>조합원 지원 서비스</NavLink>
              </div>
            </details>

            {/* 후원 */}
            <details><summary className="px-4 py-3 cursor-pointer hover:bg-gray-50">후원</summary>
              <div className="px-2 pb-2">
                <NavLink to="/support/guide" className="block px-3 py-2 rounded hover:bg-gray-50" onClick={(e)=>{setMobileOpen(false); e.target.closest('details').removeAttribute('open');}}>후원안내</NavLink>
                <NavLink to="/support/faq" className="block px-3 py-2 rounded hover:bg-gray-50" onClick={(e)=>{setMobileOpen(false); e.target.closest('details').removeAttribute('open');}}>FAQ</NavLink>
              </div>
            </details>
          </div>
        )}
      </header>
    </>
  );
}
