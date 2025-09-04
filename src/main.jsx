import { Buffer } from "buffer";
window.Buffer = Buffer; // ✅ gray-matter 같은 패키지가 Buffer 찾을 때 사용하게끔 글로벌 등록

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

