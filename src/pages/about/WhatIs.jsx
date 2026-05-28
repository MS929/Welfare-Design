/**
 * WhatIs.jsx (소개 > 복지디자인은?)
 * --------------------------------------------------
 * - 사회적협동조합 복지디자인의 정체성, 설립 배경,
 *   설립 목적·미션·비전(GMV), 운영 원칙, 정관을 설명하는 소개 페이지
 * - 정보 중심 페이지로, 하단의 데이터 상수만 수정하면
 *   레이아웃 변경 없이 콘텐츠 유지·관리 가능
 * - 상단 대표 이미지는 preload를 통해 초기 렌더링 성능(LCP)을 개선
 */
export default function AboutWhat() {
  const main2Image = "/images/about/main2.png";

  /**
   * 섹션 제목 공통 컴포넌트
   * - 좌측 컬러 도트 + 제목 텍스트
   * - 색상은 섹션의 성격(브랜드 컬러)에 맞춰 전달
   */
  const SectionTitle = ({ color, children }) => (
    <div className="flex items-center gap-3 mb-6">
      <span
        className="inline-block h-4 w-4 md:h-6 md:w-6 rounded-full"
        style={{ backgroundColor: color }}
        aria-hidden
      />
      <h2 className="text-[22px] md:text-[26px] font-bold leading-tight text-brand-900 m-0">
        {children}
      </h2>
    </div>
  );

  // ============================================================================
  // 페이지 콘텐츠 데이터
  // - 아래 데이터(객체/배열)만 수정하면 페이지 내용 변경 가능
  // ============================================================================

  // 1) 설립 배경
  const background = {
    title: "설립 배경",
    image: main2Image,
    paragraphs: [
      "복지디자인 사회적협동조합은 한국침례신학대학교 사회복지대학원에서 만난 12명의 동문들이 사람을 향한 마음을 배우고 사회복지의 가치를 실천해온 경험을 지역사회와 이웃에게 돌려드리고자 설립한 조합입니다.",
      "우리는 복지가 설계될 수 있다는 믿음 아래, 작고 연약한 삶도 따뜻하게 디자인될 수 있으며 의미와 책임, 그리고 소명을 담은 복지를 만들어가야 한다고 확신합니다.",
      "복지디자인 사회적협동조합은 은혜의 복지를 기획하고, 사람을 향한 섬김을 실천하며, 지속가능하고 따뜻한 공동체를 이루는 것을 목표로 합니다.",
    ],
  };

  // 2) 설립 목적 / 미션 / 비전
  const gmv = [
    {
      key: "설립 목적",
      body: "조합은 자주적·자립적·자치적인 협동조합 활동을 바탕으로, 복지정보에 대한 접근이 어려운 고령자·장애인 등 이동 취약계층뿐만 아니라 누구나 복지 사각지대 없이 맞춤형 복지서비스를 기획·연결·운영하고, 정보 연계, 행정 절차 동행 지원, 보조기기 나눔 등을 통해 실질적인 복지 접근권을 보장함으로써, 주민의 삶의 질을 향상하는 것을 목적으로 한다.",
    },
    {
      key: "미션",
      body: "복지 실천가들과 함께 성장하며, 지역 주민의 삶을 행복하게 디자인 합니다.",
    },
    {
      key: "비전",
      body: [
        "누구나 접근할 수 있는 맞춤형 복지 플랫폼 실현",
        "복지 실천가와 함께 성장하는 지식 기반 협력 생태계 구축",
        "복지서비스의 품질을 높여 지역사회에 실질적으로 기여",
      ],
    },
  ];

  // 3) 역대 이사장
  const pastChairs = ["1대 이사장 신창섭"];

  // 4) 조합원 자격 및 유형
  const memberEligibility = [
    "설립취지에 동의하고 조합운영규약(정관)에 따르는 자",
    "상호부조·협동의 가치에 공감하며 참여하려는 자",
    "조합의 목적사업 이용자 혹은 그 지지자",
  ];

  // 5) 운영 공개 항목
  const operationDisclosure = [
    "정기보고: 총회, 이사회 의사록, 사업/결산 보고",
    "재정 공개: 회계감사 결과, 기부금 명세",
    "사업성과 공개: 정기 리포트, 평가 보고",
  ];

  // 6) 협동조합 7대 원칙
  const principles = [
    {
      no: "01.",
      title: "자발적·개방적 조합원 제도",
      desc: [
        "협동조합은 자발적인 조직으로, 성(性)적·사회적·인종적·정치적·종교적 차별 없이 모든 사람에게 열려 있습니다.",
      ],
    },
    {
      no: "02.",
      title: "조합원에 의한 민주적인 관리",
      desc: [
        "조합원들은 정책 수립과 의사결정에 적극적으로 참여하고, 선출된 임원들은 조합원에게 책임을 지고 봉사합니다.",
        "협동조합은 동등한 투표권(1인 1표)을 가지며, 민주적 방식으로 운영됩니다.",
      ],
    },
    {
      no: "03.",
      title: "조합원의 경제적 참여",
      desc: [
        "협동조합의 자본은 공정하게 조성되고 민주적인 방식으로 운영됩니다.",
        "자본금의 일부는 조합의 공동재산이며, 출자배당이 있는 경우에는 출자액에 따라 제한된 배당을 받는 것을 원칙으로 합니다.",
        "사회적협동조합의 잉여금은 배당하지 않고, 조합의 발전을 위한 유보금 적립과 활동 지원·지역사회 기여에 사용합니다.",
      ],
    },
    {
      no: "04.",
      title: "자율과 독립",
      desc: [
        "협동조합은 조합원이 통제하는 자율적·자조적 조직입니다.",
        "다른 조직과 협약을 맺거나 외부 자본을 조달할 때에도, 조합원에 의한 민주적 통제와 조합의 자율성은 유지되어야 합니다.",
      ],
    },
    {
      no: "05.",
      title: "교육·훈련·정보 제공",
      desc: [
        "조합원·임원·경영자·직원이 협동조합 발전에 실질적으로 기여할 수 있도록 교육과 훈련을 제공합니다.",
        "지역사회와 이용자에게 협동조합의 가치와 이점을 알리는 정보 제공을 실시합니다.",
      ],
    },
    {
      no: "06.",
      title: "협동조합 간의 협동",
      desc: [
        "협동조합은 국내·국외에서 공동의 협력 사업을 전개하여 협동조합 운동의 힘을 강화하고, 조합원에게 효과적·효율적으로 봉사합니다.",
      ],
    },
    {
      no: "07.",
      title: "지역사회에 대한 기여",
      desc: [
        "조합은 지역사회의 지속가능한 발전에 기여하며, 공익을 증진하는 사업을 추진합니다。",
      ],
    },
  ];


  return (
    <div className="bg-white">
      {/* ===== 브레드크럼 + 제목 (필요 시 수정) ===== */}
      <section className="max-w-screen-xl mx-auto px-4 pt-10">
        <nav className="text-[15px] text-black">
          소개 &gt; <span className="text-black">복지디자인은?</span>
        </nav>
        <h1 className="mt-3 text-[34px] md:text-[42px] font-extrabold tracking-tight text-black">
          복지디자인은?
        </h1>
      </section>

      {/* ===== 소개 카피(헤더 카피) ===== */}
      <section className="max-w-screen-xl mx-auto px-4 pt-6 pb-4 text-center">
        {/* 1줄 제목 */}
        <h2 className="mt-2 text-[22px] md:text-[26px] font-semibold text-brand-700">
          복지디자인사회적협동조합은
        </h2>

        {/* 2줄 메인 카피 (따옴표 강조) */}
        <p className="mt-2 text-[26px] md:text-[34px] font-extrabold text-brand-900 leading-tight">
          <span className="text-gray-900">
            “함께 성장하며, 모두의 행복을 위한 복지를 디자인합니다.”
          </span>
        </p>

        {/* 가는 구분선 */}
        <div className="mx-auto mt-5 h-1 w-28 rounded-full bg-gradient-to-r from-brand-400 to-brand-600" />
      </section>
      {/* ===== 설립 배경 ===== */}
      <section className="max-w-screen-xl mx-auto px-4 py-10">
        <SectionTitle color="#3BA7A0">설립 배경</SectionTitle>

        <div className="grid grid-cols-1 md:grid-cols-[minmax(200px,260px),1fr] gap-4 md:gap-6 items-center justify-items-center md:justify-items-start">
          <img
            key={background.image}
            src={background.image}
            alt="설립 배경"
            loading="eager"
            decoding="async"
            width={680}
            height={510}
            className="block w-full h-auto max-w-[320px] md:max-w-none max-h-40 md:max-h-56 object-contain mx-auto mb-4"
          />
          <div className="space-y-4 text-gray-900 leading-relaxed break-words self-center mt-0">
            {background.paragraphs.map((t, i) => (
              <p
                key={i}
                className="whitespace-pre-line text-[16px] md:text-[17px] leading-[1.78]"
              >
                {t}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 설립 목적 / 미션 / 비전 ===== */}
      <section className="max-w-screen-xl mx-auto px-4 pb-10">
        {/* 카드 상단을 브랜드 3색으로 채우고, 제목을 가운데 정렬 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 space-y-4 sm:space-y-0">
          {gmv.map((b, idx) => {
            const accents = [
              { bg: "#F4B731", fg: "#2B2E34" }, // 노랑(대비를 위해 어두운 글자)
              { bg: "#ED6A32", fg: "#2B2E34" }, // 오렌지
              { bg: "#3BA7A0", fg: "#2B2E34" }, // 청록
            ];
            const accent = accents[idx % accents.length];
            return (
              <div
                key={b.key}
                className="rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm min-h-[240px] flex flex-col"
                style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
              >
                {/* 컬러 헤더 (제목 가운데) */}
                <div
                  className="py-3 text-center text-[17px] md:text-[18px] font-semibold tracking-tight"
                  style={{ backgroundColor: accent.bg, color: accent.fg }}
                >
                  {b.key}
                </div>

                {/* 내용 */}
                <div className="p-5 flex-1">
                  {Array.isArray(b.body) ? (
                    <ul className="list-disc pl-5 space-y-2 text-gray-800 leading-relaxed">
                      {b.body.map((t, i) => (
                        <li
                          key={i}
                          className="text-[16px] md:text-[17px] leading-[1.72]"
                        >
                          {t}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-800 text-[16px] md:text-[17px] leading-[1.72]">
                      {b.body}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ===== 역대 이사장 ===== */}
      <section className="max-w-screen-xl mx-auto px-4 pb-10">
        <SectionTitle color="#ED6A32">역대 이사장</SectionTitle>
        <div className="flex flex-wrap gap-3">
          {pastChairs.map((name, i) => (
            <span
              key={i}
              className="rounded-full border border-brand-200 bg-brand-50 px-4 py-2 text-[15px] md:text-base text-brand-800"
            >
              {name}
            </span>
          ))}
        </div>
      </section>

      {/* ===== 조합원의 자격 및 유형 / 운영 공개 ===== */}
      <section className="max-w-screen-xl mx-auto px-4 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* 조합원의 자격 및 유형 */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span
                className="inline-block h-4 w-4 md:h-6 md:w-6 rounded-full"
                style={{ backgroundColor: "#3BA7A0" }}
                aria-hidden
              />
              <h2 className="text-[22px] md:text-[26px] font-bold leading-tight text-brand-900 m-0">
                조합원의 자격 및 유형
              </h2>
            </div>

            <ul className="list-disc pl-6 space-y-3 text-gray-800">
              {memberEligibility.map((t, i) => (
                <li
                  key={i}
                  className="text-[16px] md:text-[17px] leading-[1.72]"
                >
                  {t}
                </li>
              ))}
            </ul>
          </div>

          {/* 운영 공개 */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span
                className="inline-block h-4 w-4 md:h-6 md:w-6 rounded-full"
                style={{ backgroundColor: "#3BA7A0" }}
                aria-hidden
              />
              <h2 className="text-[22px] md:text-[26px] font-bold leading-tight text-brand-900 m-0">
                운영 공개
              </h2>
            </div>

            <ul className="list-disc pl-6 space-y-3 text-gray-800">
              {operationDisclosure.map((t, i) => (
                <li
                  key={i}
                  className="text-[16px] md:text-[17px] leading-[1.72]"
                >
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ===== 운영 원칙 (7대 원칙) ===== */}
      <section className="max-w-screen-xl mx-auto px-4 pb-10">
        <SectionTitle color="#F4B731">
          운영 원칙(협동조합 7대 원칙)
        </SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch space-y-4 md:space-y-0">
          {principles.map((p, idx) => {
            const principlePalette = ["#F4B731", "#ED6A32", "#3BA7A0"]; // 반복 적용
            const pc = principlePalette[idx % principlePalette.length];
            return (
              <div
                key={p.no}
                className="rounded-xl overflow-hidden border bg-white shadow-sm h-full min-h-[180px] flex flex-col"
                style={{ borderColor: pc }}
              >
                {/* 상단 헤더: 01. 제목 (배경색 = 팔레트 색) */}
                <div
                  className="px-4 py-3 text-[18px] md:text-[19px] font-semibold tracking-tight"
                  style={{ backgroundColor: pc, color: "#2B2E34" }}
                >
                  {p.no} {p.title}
                </div>

                {/* 내용 */}
                <div className="p-5 flex-1">
                  {Array.isArray(p.desc) ? (
                    <ul className="list-disc pl-5 space-y-2 text-gray-800 leading-relaxed">
                      {p.desc.map((line, i) => (
                        <li
                          key={i}
                          className="text-[16px] md:text-[17px] leading-[1.72]"
                        >
                          {line}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-800 text-[16px] md:text-[17px] leading-[1.72]">
                      {p.desc}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <p className="mt-4 text-[15px] text-black">
          출처: 국제협동조합연맹(ICA)의 협동조합 7대원칙(1995년)
        </p>
      </section>
    </div>
  );
}
