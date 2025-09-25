import { Buffer } from "buffer";
window.Buffer = Buffer; // ✅ gray-matter 같은 패키지가 Buffer 찾을 때 사용하게끔 글로벌 등록

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN, // Netlify에 저장한 값 불러오기
  integrations: [],
  tracesSampleRate: 1.0, // 퍼포먼스 추적 (원하면 0.1 정도로 낮춰도 됨)
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

