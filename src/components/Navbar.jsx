// src/components/Navbar.jsx
import { useRef, useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";

const OPEN_DELAY_MS = 120;
const CLOSE_DELAY_MS = 250;

function useHoverDelay() {
  const [open, setOpen] = useState(false);
  const openT = useRef(null);
  const closeT = useRef(null);

  const enter = () => {
    if (closeT.current) clearTimeout(closeT.current);
    openT.current = setTimeout(() => setOpen(true), OPEN_DELAY_MS);
  };
  const leave = () => {
    if (openT.current) clearTimeout(openT.current);
    closeT.current = setTimeout(() => setOpen(false), CLOSE_DELAY_MS);
  };
  return { open, enter, leave, setOpen };
}

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
                  className="block px-3 py-2 rounded hover:bg-gray-50"
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

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  // 메가메뉴(데스크톱) 열기 상태
  const [megaOpen, setMegaOpen] = useState(false);

  // 현재 포인터가 올라간 상단 탭 인덱스(메가메뉴는 해당 섹션만 표시)
  const [hoveredIdx, setHoveredIdx] = useState(null);

  // 상단 탭 UL의 실제 좌표를 기준으로 메가메뉴를 정렬
  const tabsRef = useRef(null);
  const [megaLeft, setMegaLeft] = useState(0);

  const updateMegaLeft = () => {
    if (!tabsRef.current) return;
    const rect = tabsRef.current.getBoundingClientRect();
    // 1px 떨림 방지를 위해 반올림
    setMegaLeft(Math.round(rect.left));
  };

  // 메가메뉴가 열릴 때, 그리고 리사이즈 시 좌표 재계산
  useEffect(() => { updateMegaLeft(); }, [megaOpen]);
  useEffect(() => {
    const on = () => updateMegaLeft();
    window.addEventListener("resize", on);
    return () => window.removeEventListener("resize", on);
  }, []);

  // 상단 섹션/항목 정의(중복 제거)
  const sections = [
    {
      title: "복지디자인 소개",
      items: [
        { to: "/about/what", label: "복지디자인은?" },
        { to: "/about/establishment", label: "인사말" },
        { to: "/about/history", label: "연혁" },
        { to: "/about/people", label: "조직도" },
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
        { to: "/business/rental", label: "휠체어·복지용구 무료 대여" },
        { to: "/business/apply-help", label: "복지용구 신청 안내 지원" },
        { to: "/business/donation", label: "보조기기 기증 캠페인" },
        { to: "/business/ewc-insurance", label: "전동휠체어 보험금 지원" },
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
    <header
      className="sticky top-0 z-50 bg-white/90 backdrop-blur shadow"
      onMouseLeave={() => {
        setMegaOpen(false);
        setHoveredIdx(null);
      }}
    >
      <nav className="w-full relative px-4 md:pl-[120px] md:pr-6 py-3 grid grid-cols-[auto,1fr,auto] items-center gap-6">
        {/* Logo (mobile inline, desktop inline so it doesn't shift the tab grid) */}
        <Link to="/" className="flex items-center">
          <img src="/images/main3.png" alt="복지 디자인 로고" className="h-12 w-auto md:h-16 object-contain block" />
        </Link>

        {/* Top tabs (desktop) inline next to logo */}
        <ul
          ref={tabsRef}
          className="hidden md:grid col-start-2 grid-cols-4 gap-16 justify-items-center items-center text-center w-[750px] mx-auto"
        >
          {sections.map((sec, idx) => (
            <li key={sec.title} className="flex items-center">
              <button
                type="button"
                className={`text-left font-medium text-[15px] hover:text-emerald-600 leading-tight ${
                  hoveredIdx === idx ? "text-emerald-600" : ""
                }`}
                onMouseEnter={() => {
                  setMegaOpen(true);
                  setHoveredIdx(idx);
                }}
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
            className="bg-sky-400 hover:bg-sky-500 text-white px-4 py-2 rounded-full"
          >
            후원 안내
          </Link>
          <Link
            to="/support/combination"
            className="bg-sky-400 hover:bg-sky-500 text-white px-4 py-2 rounded-full"
          >
            조합 가입
          </Link>
        </div>

        {/* 모바일 햄버거 */}
        <button
          className="md:hidden ml-auto"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="toggle menu"
        >
          ☰
        </button>
      </nav>

      {megaOpen && (
        <div
          className="absolute left-0 right-0 top-full z-40 bg-white/95 shadow-lg border-t"
          onMouseEnter={() => setMegaOpen(true)}
          onMouseLeave={() => {
            setMegaOpen(false);
            setHoveredIdx(null);
          }}
        >
          <div style={{ marginLeft: megaLeft, width: 750 }}>
            <div className="grid grid-cols-4 gap-16 justify-items-center pt-5 pb-6 text-center">
              {sections.map((sec) => (
                <div key={sec.title} className="w-full">
                  <ul className="space-y-1.5">
                    {sec.items.map((it) => (
                      <li key={it.to}>
                        <NavLink
                          to={it.to}
                          className="block h-8 leading-none text-[14px] text-gray-800 hover:text-emerald-600 whitespace-nowrap"
                          onClick={() => {
                            setMegaOpen(false);
                            setHoveredIdx(null);
                          }}
                        >
                          {it.label}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 모바일 메뉴(간단 버전) */}
      {mobileOpen && (
        <div className="md:hidden border-t bg-white">
          <details className="border-b">
            <summary className="px-4 py-3 cursor-pointer hover:bg-gray-50">
              소개
            </summary>
            <div className="px-2 pb-2">
              <NavLink
                to="/about/establishment"
                className="block px-3 py-2 rounded hover:bg-gray-50"
              >
                설립 내용
              </NavLink>
              <NavLink
                to="/about/what"
                className="block px-3 py-2 rounded hover:bg-gray-50"
                onClick={() => setMobileOpen(false)}
              >
                복지디자인은?
              </NavLink>
              <NavLink
                to="/about/history"
                className="block px-3 py-2 rounded hover:bg-gray-50"
                onClick={() => setMobileOpen(false)}
              >
                연혁
              </NavLink>
              <NavLink
                to="/about/people"
                className="block px-3 py-2 rounded hover:bg-gray-50"
                onClick={() => setMobileOpen(false)}
              >
                함께하는 사람들
              </NavLink>
            </div>
          </details>

          <details className="border-b">
            <summary className="px-4 py-3 cursor-pointer hover:bg-gray-50">
              소식
            </summary>
            <div className="px-2 pb-2">
              <NavLink
                to="/news/stories"
                className="block px-3 py-2 rounded hover:bg-gray-50"
                onClick={() => setMobileOpen(false)}
              >
                복지디자인 이야기
              </NavLink>
              <NavLink
                to="/news/notices"
                className="block px-3 py-2 rounded hover:bg-gray-50"
                onClick={() => setMobileOpen(false)}
              >
                공지사항
              </NavLink>
            </div>
          </details>

          <details className="border-b">
            <summary className="px-4 py-3 cursor-pointer hover:bg-gray-50">
              사업
            </summary>
            <div className="px-2 pb-2">
              <NavLink
                to="/business/overview"
                className="block px-3 py-2 rounded hover:bg-gray-50"
                onClick={() => setMobileOpen(false)}
              >
                사업영역
              </NavLink>
              <NavLink
                to="/business/rental"
                className="block px-3 py-2 rounded hover:bg-gray-50"
                onClick={() => setMobileOpen(false)}
              >
                휠체어·복지용구 무료 대여
              </NavLink>
              <NavLink
                to="/business/apply-help"
                className="block px-3 py-2 rounded hover:bg-gray-50"
                onClick={() => setMobileOpen(false)}
              >
                복지용구 신청 안내 지원
              </NavLink>
              <NavLink
                to="/business/donation"
                className="block px-3 py-2 rounded hover:bg-gray-50"
                onClick={() => setMobileOpen(false)}
              >
                보조기기 기증 캠페인
              </NavLink>
              <NavLink
                to="/business/ewc-insurance"
                className="block px-3 py-2 rounded hover:bg-gray-50"
                onClick={() => setMobileOpen(false)}
              >
                전동휠체어 보험금 지원
              </NavLink>
              <NavLink
                to="/business/needs-survey"
                className="block px-3 py-2 rounded hover:bg-gray-50"
                onClick={() => setMobileOpen(false)}
              >
                복지욕구 실태조사
              </NavLink>
              <NavLink
                to="/business/member-services"
                className="block px-3 py-2 rounded hover:bg-gray-50"
                onClick={() => setMobileOpen(false)}
              >
                조합원 지원 서비스
              </NavLink>
            </div>
          </details>

          <details>
            <summary className="px-4 py-3 cursor-pointer hover:bg-gray-50">
              후원
            </summary>
            <div className="px-2 pb-2">
              <NavLink
                to="/support/guide"
                className="block px-3 py-2 rounded hover:bg-gray-50"
                onClick={() => setMobileOpen(false)}
              >
                후원안내
              </NavLink>
              <NavLink
                to="/support/faq"
                className="block px-3 py-2 rounded hover:bg-gray-50"
                onClick={() => setMobileOpen(false)}
              >
                FAQ
              </NavLink>
            </div>
          </details>
        </div>
      )}
    </header>
  );
}
