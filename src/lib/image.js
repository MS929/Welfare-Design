// src/lib/image.js
const CLOUDINARY_BASE =
  "https://res.cloudinary.com/dxeadg9wi/image/fetch/c_limit,f_auto,q_auto";
const BASE_ORIGIN = "https://welfaredesign.netlify.app";

/**
 * Cloudinary fetch URL로 바꿔준다.
 * - 상대경로면 BASE_ORIGIN을 붙여 절대 URL로 만든다
 * - 절대경로(https://)면 그대로 사용
 * - **원본 URL은 인코딩하지 않는다** (Cloudinary fetch는 raw URL을 기대)
 */
export function cldFetch(path, w = 1200) {
  try {
    if (!path) return path;
    const isAbsolute = /^https?:\/\//i.test(path);
    const remote = isAbsolute
      ? path
      : `${BASE_ORIGIN}${path.startsWith("/") ? path : `/${path}`}`;

    return `${CLOUDINARY_BASE},w_${w}/${remote}`;
  } catch {
    return path;
  }
}

/**
 * srcset 생성기 (선택)
 * - 같은 이미지를 여러 폭으로 미리 구성해서 브라우저가 최적 선택
 */
export function cldSrcSet(path, widths = [480, 800, 1200, 1600]) {
  return widths.map((w) => `${cldFetch(path, w)} ${w}w`).join(", ");
}
