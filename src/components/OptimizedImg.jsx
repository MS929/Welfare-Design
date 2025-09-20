// src/components/OptimizedImg.jsx
import { useEffect, useRef, useState } from "react";

export default function OptimizedImg({
  src,
  alt = "",
  className,
  style,
  loading = "lazy",
  decoding = "async",
  fetchpriority, // "high" | "low" | undefined
  sizes, // e.g. "(min-width: 1024px) 33vw, 100vw"
  width,
  height,
  onLoad,
  onError,
  ...rest
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(loading !== "lazy"); // eager면 바로 보이게

  useEffect(() => {
    if (visible) return;
    if (!("IntersectionObserver" in window)) {
      setVisible(true);
      return;
    }
    const el = ref.current;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVisible(true);
            io.disconnect();
          }
        });
      },
      { rootMargin: "200px 0px" }
    );
    if (el) io.observe(el);
    return () => io.disconnect();
  }, [visible]);

  return (
    <img
      ref={ref}
      src={visible ? src : undefined}
      alt={alt}
      className={className}
      style={style}
      loading={loading}
      decoding={decoding}
      fetchpriority={fetchpriority}
      sizes={sizes}
      width={width}
      height={height}
      onLoad={onLoad}
      onError={onError}
      {...rest}
    />
  );
}
