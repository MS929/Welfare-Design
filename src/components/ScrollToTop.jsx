/**
 * ScrollToTop.jsx
 * [컴포넌트 목적]
 * 라우트 전환 시 스크롤 위치를 제어하는 공통 유틸 컴포넌트
 * 
 * [해결하는 문제]
 * SPA 환경에서 페이지 이동 시 이전 스크롤 위치가 남는 문제 방지
 * 
 * [지원 기능]
 * 해시(#id)가 포함된 URL 접근 시 해당 요소로 스크롤 이동 기능 포함
 */
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * 스크롤 위치를 관리하는 로직
 * 1) 라우트(pathname)가 변경되면 스크롤을 최상단으로 이동
 * 2) 전체 새로고침 시 브라우저의 자동 스크롤 복원 기능을 꺼서 이전 위치 유지 방지
 * 3) URL에 해시(#section)가 있으면 해당 요소가 렌더링된 후 위치로 스크롤 이동
 */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  // 브라우저가 새로고침이나 뒤로가기 시 자동으로 스크롤 위치를 복원하는 기능을 비활성화하여
  // 이전 위치가 유지되어 발생하는 문제를 막음
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      const prev = window.history.scrollRestoration;
      window.history.scrollRestoration = "manual";
      return () => {
        window.history.scrollRestoration = prev;
      };
    }
  }, []);

  // 컴포넌트가 처음 마운트될 때 실행
  useEffect(() => {
    if (hash) {
      // 해시(#id)에 해당하는 요소가 렌더링된 뒤 다음 프레임에서 스크롤 이동하여
      // 요소 위치로 부드럽게 이동하도록 처리
      requestAnimationFrame(() => {
        const el = document.querySelector(hash);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        } else {
          // 해시에 해당하는 요소가 없으면 안전하게 최상단으로 이동
          window.scrollTo({ top: 0, left: 0, behavior: "auto" });
        }
      });
    } else {
      // 해시가 없으면 기본적으로 페이지 최상단으로 이동
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }
  }, []); // 전체 새로고침 시 1회만 실행

  // 라우트(pathname) 변경 시 실행
  useEffect(() => {
    // 해시가 있으면 위에서 이미 처리했으므로 중복 방지
    if (hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);

  // UI를 렌더링하지 않고 스크롤 위치 조정만 수행
  return null;
}
