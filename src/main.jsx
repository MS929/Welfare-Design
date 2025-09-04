// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

// ✅ Buffer polyfill: 프로젝트에 buffer 패키지가 설치되어 있어야 함
import { Buffer as BufferPolyfill } from "buffer";
if (!window.Buffer) window.Buffer = BufferPolyfill;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
