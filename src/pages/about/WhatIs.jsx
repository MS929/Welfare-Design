// src/pages/about/WhatIs.jsx
export default function AboutWhat() {
  // ===== 데이터: 텍스트만 바꾸면 됨 =====
  const background = {
    title: "설립 배경",
    image: "/images/about/bg-establish.jpg", // 없으면 자동 대체 이미지로 표시됨
    paragraphs: [
      "복지디자인 사회적협동조합은 사회복지의 가치를 일상에서 구현하고 확산하기 위해 설립되었습니다.",
      "현장의 복지자원과 시민의 수요 사이의 간극을 줄이고, 상호부조와 협동의 원리로 지속가능한 복지 생태계를 만드는 것을 목표로 합니다.",
      "지역 기반의 연대와 협력 속에서 복지의 접근성을 높이고, 취약계층의 삶을 실질적으로 개선하는 모델을 만들어가고자 합니다.",
    ],
  };

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

  const pastChairs = [
    "초대 이사장 (예시)",
    "제1–3대 이사장 (예시)",
    "제2–4대 부이사장 (예시)",
    "제3–4대 이사장 (예시)",
    "제5대 이사장 (예시)",
  ];

  const memberEligibility = [
    "설립취지에 동의하고 조합운영규약(정관)에 따르는 자",
    "상호부조·협동의 가치에 공감하며 참여하려는 자",
    "조합의 목적사업 이용자 혹은 그 지지자",
  ];

  const operationDisclosure = [
    "정기보고: 총회, 이사회 의사록, 사업/결산 보고",
    "재정 공개: 회계감사 결과, 기부금 명세",
    "사업성과 공개: 정기 리포트, 평가 보고",
  ];

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

  // 긴 정관 텍스트 (줄바꿈 그대로 보이게)
  const bylawsText = `복지동행 사회적협동조합 정관

제1조(설립과 명칭)
이 조합은 협동조합기본법에 의하여 설립하며, “복지동행사회적협동조합”이라 한다.

제2조(목적)
“복지동행사회적협동조합”(이하 ‘조합’이라 한다)은 자주적․자립적․자치적인 협동조합 활동 및 전문적인 사회복지 활동을 통하여 구성원의 복리증진과 상부상조 및 국민 경제의 균형 있는 발전에 기여하기 위하여 둘 이상 유형의 조합원들이 모여 조합원의 경영개선 및 생활향상과 사회복지 발전을 목적으로 한다. 

제3조(조합의 책무)
① 조합은 조합원 등의 권익 증진을 위하여 교육․훈련 및 정보 제공 등의 활동을 적극적으로 수행한다.
② 조합은 다른 협동조합, 다른 법률에 따른 협동조합, 외국의 협동조합 및 관련 국제기구 등과의 상호 협력, 이해 증진 및 공동사업 개발 등을 위하여 노력한다.

제4조(사무소의 소재지)
조합의 주된 사무소는 서울특별시에 두며, 이사회의 의결에 따라 필요한 곳에 지사무소를 둘 수 있다. 

제5조(공고방법)
① 조합의 공고는 주된 사무소의 게시판(지사무소의 게시판을 포함한다) 또는 조합의 인터넷 홈페이지(www.welfarecoop.org)에 게시하고, 필요하다고 인정하는 때에는 서울특별시에서 발간되는 일간신문 또는 중앙일간지에 게재할 수 있다. 
② 제1항의 공고기간은 7일 이상으로 하며, 조합원의 이해에 중대한 영향을 미칠 수 있는 내용에 대하여는 공고와 함께 서면으로 조합원에게 통지하여야 한다.

제6조(통지 및 최고방법)
조합원에 대한 통지 및 최고는 조합원명부에 기재된 주소지로 하고, 통지 및 최고기간은 7일 이상으로 한다. 다만, 조합원이 따로 연락받을 연락처를 지정하였을 때에는 그곳으로 한다.

제7조(공직선거 관여 금지)
① 조합은 공직선거에 있어서 특정 정당을 지지․반대하거나 특정인을 당선되도록 하거나 당선되지 아니하도록 하는 일체의 행위를 하여서는 아니 된다.
② 누구든지 조합을 이용하여 제1항에 따른 행위를 하여서는 아니 된다.

제8조(규약 또는 규정)
조합의 운영 및 사업실시에 관하여 필요한 사항으로서 이 정관으로 정한 것을 제외하고는 규약 또는 규정으로 정할 수 있다.

제9조(조합원의 자격 및 유형)
① 조합의 설립목적에 동의하고 조합원으로서의 의무를 다하고자 하는 자는 조합원이 될 수 있다.
② 조합원의 유형은 다음 각 호와 같다.
   1. 생산자조합원: 조합의 생산 활동 등에 함께 참여하는 자
   2. 소비자조합원: 조합의 재화나 서비스를 이용하는 자
   3. 직원조합원: 조합에 고용된 자
   4. 자원봉사자조합원: 조합에 무상으로 필요한 서비스 등을 제공하는 자
   5. 후원자조합원: 조합에 필요한 물품 등을 기부하거나 자금 등을 후원하는 자

제10조(조합원의 가입)
① 조합원의 자격을 가진 자가 조합에 가입하고자 할 때에는 가입신청서를 제출하여야 한다.
② 조합은 제1항에 따른 신청서가 접수되면 신청인의 자격을 확인하고 가입의 가부를 결정하여 신청서를 접수한 날부터 2주 이내에 신청인에게 서면 또는 전화 등의 방법으로 통지하여야 한다.
③ 제2항의 규정에 따라 가입의 통지를 받은 자는 조합에 가입할 자격을 가지며 납입하기로 한 출자좌수에 대한 금액을 가입 후 1개월 내에 조합에 납부함으로써 조합원이 된다. 
④ 조합은 정당한 사유 없이 조합원의 자격을 갖추고 있는 자에 대하여 가입을 거절하거나 가입에 관하여 다른 조합원보다 불리한 조건을 붙일 수 없다. 

제11조(조합원의 고지의무)
조합원은 제10조제1항에 따라 제출한 가입신청서의 기재사항에 변경이 있을 때 또는 조합원의 자격을 상실하였을 때에는 지체 없이 조합에 이를 고지하여야 한다.

제12조(조합원의 책임)
조합원의 책임은 납입한 출자액을 한도로 한다.

제13조(탈퇴)
① 조합원은 탈퇴하고자 하는 날의 30일 전에 예고하고 조합을 탈퇴할 수 있다.
② 조합원은 다음 각 호의 어느 하나에 해당하는 때에는 당연히 탈퇴된다. 
   1. 조합원의 자격이 없는 경우 
   2. 사망한 경우
   3. 성년후견개시의 심판을 받은 경우 
   4. 삭제 
   5. 조합원인 법인이 해산한 경우

제14조(제명)
① 조합은 조합원이 다음 각 호의 어느 하나에 해당하면 총회의 의결을 얻어 제명할 수 있다.
   1. 1년 이상 계속해서 조합의 시설 또는 사업을 이용하지 아니한 경우
   2. 출자금 및 경비의 납입 등 조합에 대한 의무를 이행하지 아니한 경우
   3. 조합의 사업과 관련된 법령․행정처분․정관 및 총회의결사항, 규약·규정을 위반한 경우 
   4. 고의 또는 중대한 과실로 조합의 사업을 방해하거나 신용을 상실하게 하는 행위를 한 경우
② 조합은 제1항에 따라 조합원을 제명하고자 할 때에는 총회 개최 10일 전에 그 조합원에게 제명의 사유를 알리고 총회에서 의견을 진술할 기회를 주어야 한다. 
③ 제2항에 따른 의견진술의 기회를 주지 아니하고 행한 총회의 제명 의결은 해당 조합원에게 대항하지 못한다. 
④ 조합은 제명결의가 있었을 때에 제명된 조합원에게 제명이유를 서면으로 통지하여야 한다.

제15조(탈퇴․제명조합원의 출자금환급청구권)
① 조합을 탈퇴하거나 조합으로부터 제명된 조합원은 다음 각 호의 정하는 바에 따라 출자금의 환급을 청구할 수 있다.
   1. 제13조의 규정에 의한 탈퇴의 경우에는 탈퇴조합원의 출자금에 해당하는 금액
   2. 제14조 제1항의 1호 및 2호의 규정에 의한 제명의 경우에는 제명조합원의 출자금에 해당하는 금액
② 제1항의 출자금은 제명 또는 탈퇴한 회계연도 말의 조합의 자산과 부채에 따라 정한다.
③ 조합은 탈퇴 조합원이 조합에 대한 채무를 다 갚을 때까지는 제1항에 따른 출자금의 환급을 정지할 수 있다. 
④ 조합은 탈퇴하거나 제명된 조합원이 조합에 대하여 채무가 있을 때에는 제1항에 따른 환급금과 상계할 수 있다.
⑤ 제1항에 따른 청구권은 탈퇴하거나 제명된 날부터 2년간 행사하지 아니하면 소멸된다.
⑥ 제1항에 따른 청구권은 탈퇴하거나 제명된 당시의 회계연도의 다음 회계연도부터 청구할 수 있다. 

제16조(탈퇴조합원의 손실액 부담)
① … (중략: 나머지 조항은 아래 박스에서 그대로 표시됩니다) …

부  칙

이 정관은 보건복지부장관의 인가를 받은 날부터 시행한다.
① 2013. 10. 31 정관 인가
② 2014. 11. 12 정관변경 인가
③ 2016. 03. 25 정관변경 인가
④ 2017. 06. 30 정관변경 인가
⑤ 2019. 04. 19 정관변경 인가
⑥ 2023. 07. 17 정관변경 인가
`;

  return (
    <div className="bg-white">
      {/* ===== 브레드크럼 + 제목 (필요 시 수정) ===== */}
      <section className="max-w-screen-xl mx-auto px-4 pt-10">
        <nav className="text-sm text-gray-500">
          소개 &gt; <span className="text-gray-700">복지디자인?</span>
        </nav>
        <h1 className="mt-3 text-3xl md:text-4xl font-extrabold">
          복지디자인은?
        </h1>
      </section>

      {/* ===== 소개 카피(헤더 카피) ===== */}
      <section className="max-w-screen-xl mx-auto px-4 pt-6 pb-4 text-center">
        {/* 1줄 제목 */}
        <h2 className="mt-2 text-xl md:text-2xl font-semibold">
          복지디자인사회적협동조합은
        </h2>

        {/* 2줄 메인 카피 (따옴표 강조) */}
        <p className="mt-2 text-2xl md:text-3xl font-extrabold">
          <span className="text-gray-900">
            “함께 성장하며, 모두의 행복을 위한 복지를 디자인합니다.”
          </span>
        </p>

        {/* 가는 구분선 (선택) */}
        <div className="mx-auto mt-4 h-px w-24 bg-gray-200" />
      </section>
      {/* ===== 설립 배경 ===== */}
      <section className="max-w-screen-xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold mb-6">설립 배경</h2>

        <div className="grid md:grid-cols-[260px,1fr] gap-6 items-start">
          <div className="rounded-xl overflow-hidden border bg-white">
            <img
              src={background.image}
              onError={(e) => {
                e.currentTarget.src =
                  "https://picsum.photos/520/360?grayscale&random=11";
              }}
              alt="설립 배경"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-4 text-gray-700 leading-relaxed">
            {background.paragraphs.map((t, i) => (
              <p key={i}>{t}</p>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 설립 목적 / 미션 / 비전 ===== */}
      <section className="max-w-screen-xl mx-auto px-4 pb-10">
        <div className="grid md:grid-cols-3 gap-6">
          {gmv.map((b) => (
            <div key={b.key} className="rounded-xl border p-5 bg-white">
              <h3 className="text-lg font-semibold mb-2">{b.key}</h3>
              {Array.isArray(b.body) ? (
                <ul className="list-disc pl-5 space-y-2 text-gray-700 leading-relaxed">
                  {b.body.map((t, i) => (
                    <li key={i}>{t}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-700 leading-relaxed">{b.body}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ===== 역대 이사장 ===== */}
      <section className="max-w-screen-xl mx-auto px-4 pb-10">
        <h2 className="text-2xl font-bold mb-4">역대 이사장</h2>
        <div className="flex flex-wrap gap-3">
          {pastChairs.map((name, i) => (
            <span
              key={i}
              className="rounded-full border px-4 py-2 bg-white text-sm"
            >
              {name}
            </span>
          ))}
        </div>
      </section>

      {/* ===== 조합원의 자격 및 유형 / 운영 공개 ===== */}
      <section className="max-w-screen-xl mx-auto px-4 pb-10 grid md:grid-cols-2 gap-6">
        <div className="rounded-xl border p-5 bg-white">
          <h3 className="text-lg font-semibold mb-3">조합원의 자격 및 유형</h3>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            {memberEligibility.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border p-5 bg-white">
          <h3 className="text-lg font-semibold mb-3">운영 공개</h3>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            {operationDisclosure.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* ===== 운영 원칙 (7대 원칙) ===== */}
      <section className="max-w-screen-xl mx-auto px-4 pb-10">
        <h2 className="text-2xl font-bold mb-4">
          운영 원칙(협동조합 7대 원칙)
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {principles.map((p) => (
            <div key={p.no} className="rounded-xl border p-5 bg-white">
              <div className="text-sm text-gray-400">{p.no}</div>
              <h4 className="font-semibold mt-1">{p.title}</h4>
              {Array.isArray(p.desc) ? (
                <ul className="mt-2 list-disc pl-5 space-y-1 text-gray-700 leading-relaxed">
                  {p.desc.map((line, idx) => (
                    <li key={idx}>{line}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-700 mt-2 leading-relaxed">{p.desc}</p>
              )}
            </div>
          ))}
        </div>
        <p className="text-sm text-gray-500 mt-4">
          출처: 국제협동조합연맹(ICA)의 협동조합 7대원칙(1995년)
        </p>
      </section>

      {/* ===== 정관 (스크롤 박스) ===== */}
      <section className="max-w-screen-xl mx-auto px-4 pb-16">
        <h2 className="text-2xl font-bold mb-4">정관</h2>

        <div className="rounded-xl border bg-white p-4 md:p-5">
          {/* 고정 높이 + 스크롤 */}
          <div className="max-h-[60vh] overflow-y-auto whitespace-pre-wrap leading-relaxed text-gray-800">
            {bylawsText}
          </div>

          {/* 부가 행동 (선택) */}
          {/* 다운로드 파일이 있으면 href 바꿔 사용 */}
          {/* <div className="mt-4 flex gap-2">
      <a
        href="/downloads/bylaws.pdf"
        className="px-3 py-2 text-sm rounded border"
        target="_blank" rel="noreferrer"
      >
        PDF 전체보기
      </a>
    </div> */}
        </div>
      </section>
    </div>
  );
}
