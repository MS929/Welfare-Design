import { useState } from "react";

const slides = [
  { id: 1, image: "/images/banner1.jpg", text: "함께하는 사회" },
  { id: 2, image: "/images/banner2.jpg", text: "연대와 지원" },
];

export default function Slider() {
  const [i, setI] = useState(0);
  const prev = () => setI((i - 1 + slides.length) % slides.length);
  const next = () => setI((i + 1) % slides.length);

  return (
    <section className="relative w-full h-64 md:h-[420px] overflow-hidden bg-gray-200">
      {/* 배너 이미지 (없으면 회색 배경만 보임) */}
      {slides[i].image && (
        <img
          src={slides[i].image}
          alt=""
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      )}
      <div className="absolute inset-x-0 bottom-4 text-center">
        <span className="inline-block bg-black/40 text-white text-sm md:text-base px-3 py-1 rounded">
          {slides[i].text}
        </span>
      </div>
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow"
      >
        ◀
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow"
      >
        ▶
      </button>
    </section>
  );
}
