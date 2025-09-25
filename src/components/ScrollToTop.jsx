// src/components/ScrollToTop.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Scroll management
 * - On route change: scroll to top
 * - On full reload: force scroll to top (and disable browser scrollRestoration)
 * - If URL has a hash (#id): try to scroll to that element after paint
 */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  // Disable browser's automatic scroll restoration so refresh/back won't keep old position
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      const prev = window.history.scrollRestoration;
      window.history.scrollRestoration = "manual";
      return () => {
        window.history.scrollRestoration = prev;
      };
    }
  }, []);

  // On first mount (full reload)
  useEffect(() => {
    if (hash) {
      // If an anchor exists, scroll to it on the next frame
      requestAnimationFrame(() => {
        const el = document.querySelector(hash);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        } else {
          window.scrollTo({ top: 0, left: 0, behavior: "auto" });
        }
      });
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }
  }, []); // run once on reload

  // On route change
  useEffect(() => {
    if (hash) return; // hash navigation handled above
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);

  return null;
}
