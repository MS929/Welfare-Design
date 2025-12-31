/**
 * image.js
 * - Cloudinary Fetch 기능을 이용해 이미지 URL을 동적으로 생성하는 유틸 모음
 * - 로컬 이미지(/public)와 외부 URL을 동일한 방식으로 최적화 처리
 * - Home, 카드 이미지, 썸네일 등 전역 이미지 로딩 성능 개선 목적
 */

// Cloudinary Fetch API 기본 엔드포인트
// - fetch 방식은 외부 이미지/로컬 이미지를 모두 Cloudinary를 통해 최적화 가능
const CLOUDINARY_BASE = "https://res.cloudinary.com/dxeadg9wi/image/fetch";

/**
 * Cloudinary fetch URL 생성 (범용)
 * @param {string} pathOrUrl  "/images/foo.png" 같은 사이트 상대경로 또는 절대 URL
 * @param {{w?:number,h?:number,q?:number,fm?:string,fit?:string,dprAuto?:boolean}} opt
 */
// Cloudinary 변환 옵션을 조합하여 최종 이미지 URL을 생성하는 핵심 함수
// - w/h/q/fm/fit/dpr 옵션을 상황에 맞게 선택적으로 적용
export function imageUrl(pathOrUrl, opt = {}) {
  const { w, h, q = 82, fm = "auto", fit = "limit", dprAuto = false } = opt;

  // 절대 경로(URL)인지 상대 경로(/images/...)인지 판별
  const isAbs = /^https?:\/\//i.test(pathOrUrl);

  // 브라우저 환경에서는 현재 도메인 기준으로 origin 설정
  // (SSR/빌드 환경에서는 Netlify 기본 도메인을 fallback으로 사용)
  const origin =
    (typeof window !== "undefined" && window.location?.origin) ||
    "https://welfaredesign.netlify.app";

  // Cloudinary fetch에 전달할 원본 이미지 URL 인코딩
  const src = encodeURI(isAbs ? pathOrUrl : origin + pathOrUrl);

  // Cloudinary 변환 파라미터들을 누적할 배열
  const parts = [];

  // 옵션이 존재하는 경우에만 Cloudinary 변환 파라미터로 추가
  if (fit) parts.push(`c_${fit}`);
  if (fm) parts.push(`f_${fm}`);
  if (typeof q === "number") parts.push(`q_${q}`);
  if (typeof w === "number") parts.push(`w_${w}`);
  if (typeof h === "number") parts.push(`h_${h}`);
  if (dprAuto) parts.push("dpr_auto");

  const t = parts.join(",");

  // 최종 Cloudinary Fetch URL 반환
  return `${CLOUDINARY_BASE}/${t}/${src}`;
}

/**
 * Home.jsx 등에서 사용하는 간단 fetch 헬퍼
 * - 자동 포맷(f_auto), 적절한 화질(q), DPR 대응을 기본값으로 설정
 * - 히어로/대표 이미지처럼 화면 폭 기준으로 로딩하는 경우에 사용
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
 * 반응형 이미지를 위한 srcset 문자열 생성 헬퍼
 * - 여러 해상도(w)를 받아 브라우저가 최적 이미지를 선택하도록 지원
 * - OptimizedImg 컴포넌트에서 사용
 */
export function cldSrcSet(pathOrUrl, widths = []) {
  // 유효한 숫자 width 값만 필터링
  return widths
    .filter((w) => typeof w === "number" && w > 0)
    // 각 width별 Cloudinary fetch URL과 "{w}w" 디스크립터 생성
    .map((w) => `${cldFetch(pathOrUrl, w)} ${w}w`)
    .join(", ");
}
