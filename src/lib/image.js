// src/lib/image.js
// Cloudinary fetch 전달을 이용해 최적화된 이미지 URL을 만들어주는 헬퍼

const CLOUDINARY_BASE = "https://res.cloudinary.com/dxeadg9wi/image/fetch";

/**
 * Cloudinary fetch URL 생성
 * @param {string} pathOrUrl  "/images/foo.png" 같은 사이트 상대경로 또는 절대 URL
 * @param {{w?:number,h?:number,q?:number,fm?:string,fit?:string}} opt
 */
export function imageUrl(pathOrUrl, opt = {}) {
  const { w, h, q = 82, fm = "auto", fit = "limit" } = opt;

  // 절대 URL이면 그대로, 아니면 런타임 origin을 붙인다(SSR 대비 기본값 포함)
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

  const t = parts.join(",");
  return `${CLOUDINARY_BASE}/${t}/${src}`;
}
