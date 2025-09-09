// src/pages/business/Rental.jsx
import BizLayout from "./_Layout";
import { useEffect, useRef } from "react";

export default function Rental() { // 1. 휠체어 및 복지용구 무료 대여
  const leftColRef = useRef(null);
  const rightColRef = useRef(null);
  const imgRef = useRef(null);

  useEffect(() => {
    if (!leftColRef.current || !rightColRef.current) return;

    const syncHeights = () => {
      if (!leftColRef.current || !rightColRef.current) return;
      // Only force equal height on md and up
      if (window.innerWidth < 768) {
        leftColRef.current.style.height = "auto";
        return;
      }
      leftColRef.current.style.height = `${rightColRef.current.offsetHeight}px`;
    };

    // Initial sync
    syncHeights();

    // Re-sync on window resize
    window.addEventListener("resize", syncHeights);

    // Re-sync when right column content height changes
    let ro;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(syncHeights);
      ro.observe(rightColRef.current);
    }

    // Re-sync when image finishes loading (in case it affects layout)
    const imgEl = imgRef.current;
    const onImgLoad = () => syncHeights();
    if (imgEl) {
      if (imgEl.complete) {
        syncHeights();
      } else {
        imgEl.addEventListener("load", onImgLoad);
      }
    }

    return () => {
      window.removeEventListener("resize", syncHeights);
      if (ro) ro.disconnect();
      if (imgEl) imgEl.removeEventListener("load", onImgLoad);
    };
  }, []);
  return (
    <BizLayout title="휠체어 및 복지용구 무료 대여">
      <div className="max-w-screen-xl mx-auto px-4">
        {/* 이미지 + 우측 정보 박스(대여 안내) + 기대효과(우측 박스 아래) */}
        <div className="grid gap-8 md:grid-cols-2 items-stretch">
          {/* 좌측 이미지 */}
          <div
            className="rounded-2xl bg-emerald-50/40 p-4 md:p-6 shadow-inner h-full flex items-center justify-center"
            ref={leftColRef}
          >
            <img
              ref={imgRef}
              src="/images/business/rental.png"
              alt="휠체어 및 복지용구 무료 대여"
              className="h-full w-full max-w-full object-contain object-top rounded-xl border border-emerald-100 bg-white"
            />
          </div>

          {/* 우측: 대여 안내 박스 */}
          <div ref={rightColRef}>
            <div className="rounded-xl border border-emerald-200 bg-white shadow-sm p-6">
              <ul className="space-y-4 text-gray-800">
                <li className="flex gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                  <span>수동/전동 휠체어, 보행보조기, 목욕의자 등 기초 복지용구 무료 대여</span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                  <span>사전 연락 후 재고 확인 및 대여 대장 작성</span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                  <span>사용법 안내 및 기초 안전 교육</span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                  <span>기본 7일 대여, 1회 연장 가능(최대 14일)</span>
                </li>
              </ul>
            </div>

            {/* 우측: 기대 효과 박스 (대여 안내 박스 바로 아래) */}
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6 mt-6">
              <h3 className="font-semibold text-lg mb-3">기대 효과</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>복지 사각지대 해소 및 취약계층 복지 접근성 강화</li>
                <li>지역 복지 자원의 선순환 구조 형성</li>
                <li>협력기관 및 조합원과의 지속 가능한 복지 파트너십 구축</li>
              </ul>
            </div>

            {/* 기대 효과 아래: 신청 문의 */}
            <div className="rounded-xl border border-emerald-300 bg-emerald-50/70 px-6 py-4 shadow-sm mt-6">
              <div className="flex items-center gap-3 text-emerald-900">
                {/* phone icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-5 w-5"
                  aria-hidden="true"
                >
                  <path d="M2.25 6.75c0 7.008 5.742 12.75 12.75 12.75.71 0 1.32-.51 1.44-1.21l.38-2.19a1.5 1.5 0 0 0-1.08-1.71l-2.24-.62a1.5 1.5 0 0 0-1.49.44l-.82.83a10.97 10.97 0 0 1-4.26-4.27l.83-.82a1.5 1.5 0 0 0 .44-1.49l-.62-2.24a1.5 1.5 0 0 0-1.71-1.08l-2.19.38c-.7.12-1.21.73-1.21 1.44Z"/>
                </svg>
                <span className="font-semibold tracking-wide">신청 문의 : 복지디자인</span>
                <span className="font-bold text-xl tabular-nums">042-000-0000</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BizLayout>
  );
}
