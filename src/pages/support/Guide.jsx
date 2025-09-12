// src/pages/support/Guide.jsx
import { Link } from "react-router-dom";
import { useState } from "react";

export default function SupGuide() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Hero */}
      <header className="mb-10">
        <p className="text-sm text-gray-500">후원 &gt; 안내</p>
        <h1 className="text-3xl sm:text-4xl font-extrabold mt-2">
          복지디자인 후원 안내
        </h1>
        <p className="text-gray-600 mt-3 whitespace-pre-line">
          “작지만 깊이 있는 변화”, 그 출발점이 바로 복지디자인입니다.
          복지디자인 사회적협동조합은 복지를 설계하는 사람들입니다.{"\n"}
          여러분의 작은 관심을 통하여 소외된 이웃이 스스로 삶을 회복할 수 있도록
          체계적이고 지속 가능한 복지를 함께 만들어갑니다.{"\n"}
          현장 기반의 복지연결망을 운영하며 복지 사각지대를 해소하고,
          지역 안에서 누구나 복지에 접근할 수 있도록 최선을 다하겠습니다.
        </p>
      </header>

      {/* 3가지 방식 – PDF 레이아웃 맞춤 */}
      <section className="grid md:grid-cols-3 gap-0 mt-8">
        <SupportPanel
          icon={<HeartHandIcon className="w-24 h-24 mx-auto" />}
          title="개인 후원"
          items={[
            "매월 or 일시 후원으로 사업의 지속가능성을 높여주세요.",
            "계좌이체/자동이체",
            "지속적인 복지서비스 지원",
          ]}
        />
        <SupportPanel
          icon={<PeopleHeartIcon className="w-24 h-24 mx-auto" />}
          title="기업·단체 후원"
          items={[
            "파트너십/캠페인/지정기탁 등 다양한 방식으로 함께 할 수 있어요.",
            "사회공헌 파트너십",
            "기업 참여형 후원 프로그램",
          ]}
        />
        <SupportPanel
          icon={<BoxHeartIcon className="w-24 h-24 mx-auto" />}
          title="물품 후원"
          items={[
            "휠체어·보장구·보조기기 등 양질의 물품을 순환시켜요.",
            "수거/검수/재분배",
            "생활용품 후원 가능",
          ]}
        />
      </section>

      {/* 계좌 안내 */}
      <BankBox className="mt-10" />

      {/* 후원 신청서 */}
      <section className="mt-10 rounded-2xl border p-6 bg-white">
        <h3 className="text-lg font-semibold mb-3">후원 신청서</h3>
        <p className="text-gray-700 mb-4">
          후원 신청서를 작성해주시면 기부금 영수증 발급과 투명한 후원금 공개를 약속드립니다.
        </p>
        <a
          href="https://forms.gle/AepMiTRFNNZs9ovu5"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-5 py-3 rounded-full bg-sky-500 text-white hover:bg-sky-600"
        >
          후원 신청서 작성하기
        </a>
      </section>

      {/* 법적 고지 */}
      <p className="text-gray-500 text-xs mt-4">
        ※ 법인세법 제18조 소득세법 제34조에 의거 기부금 영수증 발급이 가능합니다.
      </p>

      {/* FAQ/연락처 */}
      <section className="grid md:grid-cols-2 gap-6 mt-10">
        <div className="rounded-2xl border p-6 bg-white">
          <h3 className="text-lg font-semibold">자주 묻는 질문</h3>
          <ul className="mt-3 list-disc pl-5 text-gray-700 space-y-1">
            <li>정기후원 해지는 어디서 하나요?</li>
            <li>물품 기부 기준이 있나요?</li>
          </ul>
          <Link
            to="/support/faq"
            className="inline-block mt-4 text-sky-600 hover:underline"
          >
            FAQ 전체 보기 →
          </Link>
        </div>

        <div className="rounded-2xl border p-6 bg-white">
          <h3 className="text-lg font-semibold">연락처</h3>
          <p className="text-gray-700 mt-2">
            이메일:{" "}
            <a className="text-sky-600" href="mailto:test@naver.com">
              test.naver.com
            </a>
            <br />
            전화: 02-000-0000 (평일 10:00–17:00)
          </p>
          <p className="text-gray-500 text-sm mt-3">
            * 실제 연락처/운영시간은 나중에 확정되면 바꿔 넣으면 됩니다.
          </p>
        </div>
      </section>
    </div>
  );
}

/* ---------- 작은 컴포넌트들 ---------- */

function SupportPanel({ icon, title, items = [] }) {
  return (
    <div className="border md:border-l-0 first:rounded-t-2xl md:first:rounded-l-2xl md:first:rounded-t-none md:last:rounded-r-2xl last:rounded-b-2xl bg-white px-6 py-8 text-center">
      <div className="mb-4 text-sky-500 flex justify-center">{icon}</div>
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      <ul className="text-gray-800 space-y-2 text-left max-w-xs mx-auto list-disc list-inside">
        {items.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
    </div>
  );
}

function SupportCard({ title, desc, bullets = [], cta, className = "" }) {
  return (
    <div className={`rounded-2xl border p-6 bg-white flex flex-col h-full ${className}`}>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-gray-700 mt-2">{desc}</p>
      {bullets?.length > 0 && (
        <ul className="mt-3 text-gray-700 space-y-1 list-disc pl-5">
          {bullets.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
      )}
      {cta && (
        <Link
          to={cta.href}
          className="inline-block mt-4 px-4 py-2 rounded-full bg-sky-500 text-white hover:bg-sky-600"
        >
          {cta.label}
        </Link>
      )}
    </div>
  );
}

function BankBox({ className = "" }) {
  const [copied, setCopied] = useState(false);

  const bank = {
    name: "하나은행",
    number: "1230456789-1011-22",
    holder: "복지디자인사회적협동조합",
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`${bank.name} ${bank.number}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  return (
    <section className={`rounded-2xl border p-6 bg-emerald-50/60 ${className}`}>
      <h3 className="text-lg font-semibold">무통장 입금(계좌이체)</h3>
      <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <p className="text-gray-800">
          <span className="font-medium">{bank.name}</span>{" "}
          <span className="font-mono tracking-wide">{bank.number}</span>
          {" · "}
          <span className="text-gray-600">{bank.holder}</span>
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={copy}
            className="px-3 py-2 rounded-lg border bg-white hover:bg-gray-50"
          >
            {copied ? "복사됨!" : "계좌 복사"}
          </button>
        </div>
      </div>
      <p className="text-gray-600 text-sm mt-3">
        * 입금자명 기록이 반드시 필요합니다. 입금자명과 신청 정보가 다를 경우 확인이 지연될 수 있습니다.
      </p>
    </section>
  );
}

function HeartHandIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 36c3 0 5-2 8-2h10c2 0 3 2 1 3l-8 4" stroke="#0ea5e9" strokeWidth="3" strokeLinecap="round"/>
      <path d="M23 46h8c6 0 10-3 12-6" stroke="#0ea5e9" strokeWidth="3" strokeLinecap="round"/>
      <path d="M40 10c-3 0-5 2-8 5-3-3-5-5-8-5a6 6 0 0 0-6 6c0 6 7 10 14 16 7-6 14-10 14-16a6 6 0 0 0-6-6z" fill="#f43f5e"/>
    </svg>
  );
}

function PeopleHeartIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="28" r="6" fill="#0ea5e9"/>
      <circle cx="44" cy="28" r="6" fill="#0ea5e9"/>
      <circle cx="32" cy="34" r="7" fill="#0284c7"/>
      <path d="M32 8c-3 0-5 2-8 5 3 3 5 5 8 8 3-3 5-5 8-8-3-3-5-5-8-5z" fill="#f43f5e"/>
    </svg>
  );
}

function BoxHeartIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="12" y="22" width="40" height="26" rx="3" fill="#0ea5e9"/>
      <path d="M12 22l20-8 20 8" stroke="#0369a1" strokeWidth="3"/>
      <path d="M42 10c-2 0-4 1-6 4-2-3-4-4-6-4a5 5 0 0 0-5 5c0 5 6 8 11 13 5-5 11-8 11-13a5 5 0 0 0-5-5z" fill="#f43f5e"/>
    </svg>
  );
}
