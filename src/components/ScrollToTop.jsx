/**
 * ScrollToTop.jsx
 * - 라우트 전환 시 스크롤 위치를 제어하는 공통 유틸 컴포넌트
 * - SPA 환경에서 페이지 이동 시 이전 스크롤 위치가 남는 문제를 방지
 * - 해시(#id)가 포함된 URL 접근 시 해당 요소로 스크롤하는 기능 포함
 */
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * 스크롤 관리 로직
 * 1) 라우트(pathname) 변경 시 항상 최상단으로 스크롤
 * 2) 전체 새로고침 시 브라우저의 자동 스크롤 복원 기능을 비활성화
 * 3) URL에 해시(#section)가 있을 경우, 해당 요소가 렌더링된 뒤 위치로 이동
 */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  // 브라우저의 자동 스크롤 복원(scrollRestoration)을 비활성화하여
  // 새로고침/뒤로가기 시 이전 위치가 유지되는 현상을 방지
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      const prev = window.history.scrollRestoration;
      window.history.scrollRestoration = "manual";
      return () => {
        window.history.scrollRestoration = prev;
      };
    }
  }, []);

  // 컴포넌트 최초 마운트 시(전체 새로고침 상황)
  useEffect(() => {
    if (hash) {
      // 해시(#id)에 해당하는 DOM 요소가 렌더링된 이후 스크롤되도록
      // requestAnimationFrame을 사용해 다음 프레임에서 처리
      requestAnimationFrame(() => {
        const el = document.querySelector(hash);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        } else {
          // 해시에 해당하는 요소가 없을 경우 안전하게 최상단으로 이동
          window.scrollTo({ top: 0, left: 0, behavior: "auto" });
        }
      });
    } else {
      // 해시가 없는 경우에는 기본적으로 페이지 최상단으로 이동
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }
  }, []); // run once on reload

  // 라우트(pathname) 변경 시 실행되는 스크롤 제어
  useEffect(() => {
    // 해시 기반 스크롤은 위의 useEffect에서 이미 처리하므로 중복 실행 방지
    if (hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);

  // 이 컴포넌트는 UI를 렌더링하지 않고 스크롤 제어만 담당
  return null;
}
