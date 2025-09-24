// src/components/OptimizedImg.jsx
import { useEffect, useRef, useState } from "react";
// src/components/OptimizedImg.jsx
import { useEffect, useRef, useState } from "react";

/**
 * Optimized image component
 * - Lazy-loads offscreen images via IntersectionObserver (fallback to eager)
 * - Uses <picture> with AVIF/WEBP sources (if provided) then PNG/JPG fallback
 * - LCP image: set priority={true} to use eager + fetchPriority="high"
 * - Pass width/height to reserve layout space (reduces CLS). If both given, aspectRatio is set.
 */
export default function OptimizedImg({
  src,                 // fallback png/jpg
  webp,                // optional webp path
  avif,                // optional avif path
  alt = "",
  className,
  style,
  // If priority is true -> eager/sync/high, else lazy/async/auto
  priority = false,
  sizes = "(max-width: 768px) 100vw, 1200px",
  width,
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

  const aspectStyle = width && height ? { aspectRatio: `${width}/${height}` } : undefined;

  return (
    <picture ref={ref} className={className} style={{ ...style, ...aspectStyle }}>
      {/* Only provide sources when visible to avoid preloading before IO triggers */}
      {visible && avif && <source srcSet={avif} type="image/avif" sizes={sizes} />}
      {visible && webp && <source srcSet={webp} type="image/webp" sizes={sizes} />}
      <img
        src={visible ? src : undefined}
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
