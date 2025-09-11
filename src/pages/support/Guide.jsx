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
          함께하는 후원
        </h1>
        <p className="text-gray-600 mt-3">
          여러분의 후원은 이동·건강·정보 접근성이 필요한 이웃에게
          <span className="whitespace-nowrap"> 실질적인 변화를</span> 만듭니다.
        </p>
      </header>

      {/* 3가지 방식 */}
      <section className="grid md:grid-cols-2 gap-6 items-stretch">
        <SupportCard
          title="정기 후원/일시 후원"
          desc="매달 혹은 일시 후원으로 사업의 지속가능성을 높여주세요."
          bullets={["계좌이체/자동이체", "기부금 영수증 발급"]}
          cta={{ label: "후원 안내", href: "/support/faq#personal" }}
        />
        <SupportCard
          title="물품 기부"
          desc="보조기기·복지용구·소모품 등 양질의 물품을 순환시킵니다."
          bullets={["수거/검수/재분배","캠페인 연계 가능"]}
          cta={{ label: "물품 기부 안내", href: "/support/faq#goods" }}
        />
      </section>

      {/* 계좌 안내 */}
      <BankBox className="mt-10" />

      {/* FAQ/연락처 */}
      <section className="grid md:grid-cols-1 gap-6 mt-10">
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
    name: "00은행",
    number: "000-000000-0000-00",
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
        * 입금자명과 신청 정보가 다르면 확인이 지연될 수 있어요. 정기후원은
        자동이체(금융기관) 또는 CMS 출금 동의를 통해 설정합니다.
      </p>
    </section>
  );
}
