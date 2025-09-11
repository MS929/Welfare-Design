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

      {/* 3가지 방식 */}
      <section className="grid md:grid-cols-3 gap-6 items-stretch">
        <SupportCard
          title="개인 후원"
          desc="소중한 후원으로 지역사회의 변화를 함께 만들어갑니다."
          bullets={[
            "정기 후원 및 일시 후원 가능",
            "기부금 영수증 발급",
            "후원금 사용 내역 투명 공개",
          ]}
          cta={{ label: "개인 후원 안내", href: "/support/faq#personal" }}
        />
        <SupportCard
          title="기업·단체 후원"
          desc="사회적 책임을 다하는 기업과 단체의 후원을 환영합니다."
          bullets={[
            "맞춤형 후원 프로그램 제공",
            "사회공헌 활동 연계 가능",
            "기부금 영수증 발급",
          ]}
          cta={{ label: "기업·단체 후원 안내", href: "/support/faq#corporate" }}
        />
        <SupportCard
          title="물품 후원"
          desc="복지용품과 자원을 나누어 소외된 이웃에게 전달합니다."
          bullets={[
            "보조기기 및 복지용구 기부",
            "수거 및 검수 후 재분배",
            "캠페인과 연계 가능",
          ]}
          cta={{ label: "물품 후원 안내", href: "/support/faq#goods" }}
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
