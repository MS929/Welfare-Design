// src/components/OptimizedImg.jsx
import { useEffect, useRef, useState } from "react";

/**
 * -----------------------------------------------------------------------------
 * [컴포넌트 목적]
 *  - 이미지 로딩/포맷을 최적화해서 초기 로딩(LCP)과 스크롤 구간 성능을 개선하는 컴포넌트
 *
 * [동작 방식]
 *  - IntersectionObserver로 뷰포트 근처에 왔을 때만 로드(미지원 브라우저는 즉시 로드)
 *  - <picture>를 사용해 AVIF/WEBP(가능하면) → PNG/JPG(폴백) 순서로 제공
 *  - priority={true}면 첫 화면 핵심 이미지로 간주하여 eager + fetchPriority="high" 적용
 *  - width/height를 주면 레이아웃 공간을 미리 확보해 CLS(레이아웃 흔들림) 감소
 * -----------------------------------------------------------------------------
 */

// Netlify Image CDN URL 생성(요청 시 리사이즈/포맷 변환을 즉시 수행)
function toNetlifyImage(rawUrl, { w = 1600, q = 82, f = "webp" } = {}) {
  try {
    if (!rawUrl) return rawUrl;
    const encoded = encodeURIComponent(rawUrl);
    return `/.netlify/images?url=${encoded}&w=${w}&q=${q}&fm=${f}`;
  } catch {
    // URL 인코딩/문자열 처리 실패 시 원본 URL 그대로 사용
    return rawUrl;
  }
}

export default function OptimizedImg({
  src, // 기본 이미지 경로(최종 폴백: png/jpg 등)
  webp, // webp 경로(별도로 준비한 경우)
  avif, // avif 경로(별도로 준비한 경우)
  alt = "",
  className,
  style,
  imgStyle,
  // priority=true면 즉시 로드(첫 화면/LCP 이미지용), 아니면 스크롤 시점에 지연 로드
  priority = false,
  sizes = "(max-width: 768px) 100vw, 1200px",
  width,
  height,

  // Netlify 이미지 CDN 사용 여부(원본 src를 기반으로 포맷 변환/리사이즈 요청)
  useCdn = false,
  // CDN 변환 시 사용할 폭/품질(미지정이면 width 또는 기본값을 사용)
  cdnWidth,
  cdnQuality,

  onLoad,
  onError,
  ...rest
}) {
  // <picture> 요소를 관찰해서 화면 근처에 오면 visible=true로 전환
  const ref = useRef(null);
  const [visible, setVisible] = useState(priority); // priority면 처음부터 로드

  useEffect(() => {
    // 이미 보이도록 결정됐으면(또는 priority) 아무 것도 하지 않음
    if (visible) return;

    // IntersectionObserver 미지원 브라우저: 즉시 로드로 처리
    if (!("IntersectionObserver" in window)) {
      setVisible(true);
      return;
    }

    const el = ref.current;

    // rootMargin을 넉넉히 줘서(200px) 화면에 들어오기 전에 미리 로드
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setVisible(true);
            io.disconnect();
            break;
          }
        }
      },
      { rootMargin: "200px 0px" }
    );

    if (el) io.observe(el);
    return () => io.disconnect();
  }, [visible]);

  // priority 여부에 따라 로딩 힌트 설정
  const loading = priority ? "eager" : "lazy";
  const decoding = priority ? "sync" : "async";
  const fetchPriority = priority ? "high" : "auto";

  // width/height가 있으면 aspect-ratio를 지정해 CLS를 줄임
  const aspectStyle = width && height ? { aspectRatio: `${width}/${height}` } : undefined;

  // CDN 사용 시: src 하나로 avif/webp/jpg(폴백) URL을 생성
  let cdnWebp, cdnAvif, cdnSrc;
  if (useCdn) {
    const w = cdnWidth || width || 1600;
    const q = typeof cdnQuality === "number" ? cdnQuality : 82;

    // 같은 원본(src)을 기반으로 포맷만 바꿔서 요청
    cdnWebp = toNetlifyImage(src, { w, q, f: "webp" });
    cdnAvif = toNetlifyImage(src, { w, q, f: "avif" });
    cdnSrc = toNetlifyImage(src, { w, q, f: "jpg" });
  }

  return (
    <picture ref={ref} className={className} style={{ ...style, ...aspectStyle }}>
      {/*
        visible=true가 된 뒤에만 <source>를 렌더링해서
        화면 밖 이미지가 불필요하게 먼저 프리로드되지 않도록 함
      */}
      {visible && (avif || useCdn) && (
        <source srcSet={avif ? avif : cdnAvif} type="image/avif" sizes={sizes} />
      )}
      {visible && (webp || useCdn) && (
        <source srcSet={webp ? webp : cdnWebp} type="image/webp" sizes={sizes} />
      )}

      <img
        // visible 전에는 src를 비워두어(undefined) 실제 다운로드를 지연
        src={visible ? (useCdn ? cdnSrc : src) : undefined}
        alt={alt}
        loading={loading}
        decoding={decoding}
        fetchPriority={fetchPriority}
        sizes={sizes}
        width={width}
        height={height}
        onLoad={onLoad}
        onError={onError}
        style={imgStyle}
        {...rest}
      />
    </picture>
  );
}
