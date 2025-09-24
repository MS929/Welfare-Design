// src/components/ContactBox.jsx
export default function ContactBox() {
  return (
    <div className="mt-6 mb-8">
      {/* Desktop & Tablet */}
      <div className="hidden md:block rounded-2xl border border-[#F26C2A]/45 bg-gradient-to-r from-[#FFF3E9] to-[#EFFFFD] px-8 py-5 shadow-md">
        <div className="flex items-center gap-3 text-[#111827] tracking-tight">
          {/* phone icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-5 w-5 text-[#F26C2A]"
            aria-hidden="true"
          >
            <path d="M2.25 6.75c0 7.008 5.742 12.75 12.75 12.75.71 0 1.32-.51 1.44-1.21l.38-2.19a1.5 1.5 0 0 0-1.08-1.71l-2.24-.62a1.5 1.5 0 0 0-1.49.44l-.82.83a10.97 10.97 0 0 1-4.26-4.27l.83-.82a1.5 1.5 0 0 0 .44-1.49l-.62-2.24a1.5 1.5 0 0 0-1.71-1.08l-2.19.38c-.7.12-1.21.73-1.21 1.44Z" />
          </svg>
          <span className="font-semibold tracking-wide text-[#374151]">
            신청 문의 : 복지디자인
          </span>
          <a
            href="tel:0420000000"
            className="font-extrabold text-2xl tabular-nums text-[#F26C2A] underline whitespace-nowrap"
          >
            042-000-0000
          </a>
        </div>
      </div>

      {/* Mobile */}
      <div className="md:hidden rounded-2xl border border-[#F26C2A]/45 bg-gradient-to-r from-[#FFF3E9] to-[#EFFFFD] px-5 py-4 shadow-md">
        <div className="flex items-center justify-between gap-3 text-[#111827]">
          <div className="flex items-center gap-2 min-w-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-5 w-5 text-[#F26C2A] shrink-0"
              aria-hidden="true"
            >
              <path d="M2.25 6.75c0 7.008 5.742 12.75 12.75 12.75.71 0 1.32-.51 1.44-1.21l.38-2.19a1.5 1.5 0 0 0-1.08-1.71l-2.24-.62a1.5 1.5 0 0 0-1.49.44l-.82.83a10.97 10.97 0 0 1-4.26-4.27l.83-.82a1.5 1.5 0 0 0 .44-1.49l-.62-2.24a1.5 1.5 0 0 0-1.71-1.08l-2.19.38c-.7.12-1.21.73-1.21 1.44Z" />
            </svg>
            <span className="font-semibold text-[15px] text-[#374151] whitespace-nowrap">
              신청 문의 : 복지디자인
            </span>
          </div>
          <a
            href="tel:0420000000"
            className="font-extrabold text-[20px] tabular-nums text-[#F26C2A] underline whitespace-nowrap"
          >
            042-000-0000
          </a>
        </div>
      </div>
    </div>
  );
}
