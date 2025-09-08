/** @type {import('tailwindcss').Config} */
// tailwind.config.js
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",   // 포인트
          500: "#10b981",   // 메인(emerald-500)
          600: "#059669",
          700: "#047857",
          800: "#065f46",   // 딥 그린 텍스트
          900: "#064e3b",
        },
        ink: {
          900: "#0f172a"    // 본문 진한 잉크색(선택)
        }
      }
    }
  },
  plugins: [],
}
