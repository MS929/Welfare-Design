// src/lib/image.js
// Cloudinary fetch 전달을 이용해 최적화된 이미지 URL을 만들어주는 헬퍼들

const CLOUDINARY_BASE = "https://res.cloudinary.com/dxeadg9wi/image/fetch";

/**
 * Cloudinary fetch URL 생성 (범용)
 * @param {string} pathOrUrl  "/images/foo.png" 같은 사이트 상대경로 또는 절대 URL
 * @param {{w?:number,h?:number,q?:number,fm?:string,fit?:string,dprAuto?:boolean}} opt
 */
export function imageUrl(pathOrUrl, opt = {}) {
  const { w, h, q = 82, fm = "auto", fit = "limit", dprAuto = false } = opt;

  const isAbs = /^https?:\/\//i.test(pathOrUrl);
  const origin =
    (typeof window !== "undefined" && window.location?.origin) ||
    "https://welfaredesign.netlify.app";
  const src = encodeURI(isAbs ? pathOrUrl : origin + pathOrUrl);

  const parts = [];
  if (fit) parts.push(`c_${fit}`);
  if (fm) parts.push(`f_${fm}`);
  if (typeof q === "number") parts.push(`q_${q}`);
  if (typeof w === "number") parts.push(`w_${w}`);
  if (typeof h === "number") parts.push(`h_${h}`);
  if (dprAuto) parts.push("dpr_auto");

  const t = parts.join(",");
  return `${CLOUDINARY_BASE}/${t}/${src}`;
}

/**
 * Home.jsx 히어로용 간단 fetch (q_auto,f_auto, c_limit, w)
 * @param {string} pathOrUrl
 * @param {number} width
 */
export function cldFetch(pathOrUrl, width) {
  return imageUrl(pathOrUrl, {
    w: width,
    q: 80,
    fm: "auto",
    fit: "limit",
    dprAuto: true,
  });
}

/**
 * srcset 문자열 생성: "<url> <w>w, <url> <w>w, ..."
 * @param {string} pathOrUrl
 * @param {number[]} widths
 */
export function cldSrcSet(pathOrUrl, widths = []) {
  return widths
    .filter((w) => typeof w === "number" && w > 0)
    .map((w) => `${cldFetch(pathOrUrl, w)} ${w}w`)
    .join(", ");
}
