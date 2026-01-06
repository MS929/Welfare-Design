/**
 * main.jsx
 * - React 애플리케이션의 진입점(Entry Point)
 * - 전역 환경 설정(Buffer)과 Router를 초기화
 * - 실제 화면(라우팅/레이아웃) 구성은 App.jsx에서 담당
 */

import { Buffer } from "buffer";
window.Buffer = Buffer; // Node 환경용 Buffer를 브라우저 전역에 등록 (gray-matter 등 패키지 호환용)

// =============================
// React 및 렌더링 관련 의존성
// =============================
import React from "react";
import ReactDOM from "react-dom/client";

// 클라이언트 사이드 라우팅을 위한 BrowserRouter
import { BrowserRouter } from "react-router-dom";

// 전체 페이지 라우팅과 공통 레이아웃을 담당하는 최상위 컴포넌트
import App from "./App";

// 전역 스타일(CSS Reset 및 기본 타이포/레이아웃 설정)
import "./index.css";

// React 18 방식의 Root 생성 후 애플리케이션 렌더링
ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    {/* 전체 앱을 Router로 감싸 페이지 전환을 SPA 방식으로 처리 */}
    <App />
  </BrowserRouter>
);
