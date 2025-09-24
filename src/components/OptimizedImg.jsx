// src/components/OptimizedImg.jsx
import { useEffect, useRef, useState } from "react";

/**
 * Optimized image component
 * - Lazy-loads offscreen images via IntersectionObserver (fallback to eager)
 * - Uses <picture> with AVIF/WEBP sources (if provided) then PNG/JPG fallback
 * - LCP image: set priority={true} to use eager + fetchPriority="high"
 * - Pass width/height to reserve layout space (reduces CLS). If both given, aspectRatio is set.
 */

// Build Netlify Image CDN URL for on-the-fly resize/format
function toNetlifyImage(rawUrl, { w = 1600, q = 82, f = "webp" } = {}) {
  try {
    if (!rawUrl) return rawUrl;
    const encoded = encodeURIComponent(rawUrl);
    return `/.netlify/images?url=${encoded}&w=${w}&q=${q}&fm=${f}`;
  } catch {
    return rawUrl;
  }
}
export default function OptimizedImg({
  src, // fallback png/jpg
  webp, // optional webp path
  avif, // optional avif path
  alt = "",
  className,
  style,
  // If priority is true -> eager/sync/high, else lazy/async/auto
  priority = false,
  sizes = "(max-width: 768px) 100vw, 1200px",
  width,
  useCdn = false, // ✅ 추가
  cdnWidth, // ✅ 추가
  cdnQuality, // ✅ 추가
  height,
  onLoad,
  onError,
  ...rest
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(priority); // priority면 바로 로드

  useEffect(() => {
    if (visible) return;
    if (!("IntersectionObserver" in window)) {
      setVisible(true);
      return;
    }
    const el = ref.current;
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

  const loading = priority ? "eager" : "lazy";
  const decoding = priority ? "sync" : "async";
  const fetchPriority = priority ? "high" : "auto";

  const aspectStyle =
    width && height ? { aspectRatio: `${width}/${height}` } : undefined;

    let cdnWebp, cdnAvif, cdnSrc;
    if (useCdn) {
      const w = cdnWidth || width || 1600;
      const q = typeof cdnQuality === "number" ? cdnQuality : 82;
      cdnWebp = toNetlifyImage(src, { w, q, f: "webp" });
      cdnAvif = toNetlifyImage(src, { w, q, f: "avif" });
      cdnSrc = toNetlifyImage(src, { w, q, f: "jpg" });
    }
  
  return (
    <picture
      ref={ref}
      className={className}
      style={{ ...style, ...aspectStyle }}
    >
      {/* Only provide sources when visible to avoid preloading before IO triggers */}
      {visible && (avif || useCdn) && (
        <source srcSet={avif ? avif : cdnAvif} type="image/avif" sizes={sizes} />
      )}
      {visible && (webp || useCdn) && (
        <source srcSet={webp ? webp : cdnWebp} type="image/webp" sizes={sizes} />
      )}
      <img
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
        {...rest}
      />
    </picture>
  );
}
