// src/pages/about/Establishment.jsx
export default function AboutEstablishment() {
  return (
    <div className="bg-white">
      {/* 브레드크럼 + 제목 */}
      <section className="max-w-screen-xl mx-auto px-4 pt-10">
        <nav className="text-sm text-gray-500">
          소개 &gt; <span className="text-gray-700">설립 내용</span>
        </nav>
        <h1 className="mt-4 text-3xl md:text-4xl font-extrabold">설립 내용</h1>
      </section>

      {/* 설립 취지 */}
      <section className="max-w-screen-md mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold mb-6">설립 취지</h2>
        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
          {`복지디자인 사회적협동조합

우리는 한국침례신학대학교 사회복지대학원에서 만난 12명의 동문입니다. 20여 년 전, “사람을 향한 하나님의 마음”을 배우며 사회복지의 길을 걷기 시작했고, 그 길 위에서 각자의 자리에서 섬김과 실천의 시간을 이어왔습니다.

이제, 우리가 받은 은혜와 경험을 이웃과 지역사회에 돌려드리고자 복지디자인 사회적협동조합을 설립하였습니다.`}
        </p>
      </section>

      {/* 설립의 의미 */}
      <section className="max-w-screen-md mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold mb-6">설립의 의미</h2>
        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
          {`우리의 이름에는 두 가지 고백이 담겨 있습니다. 하나는, 복지는 설계할 수 있다는 믿음입니다. 작고 연약한 삶도 따뜻하게 디자인될 수 있다고 우리는 믿습니다. 또 하나는, 우리가 실천하려는 복지는 그저 하나의 복지가 아니라 ‘더 깊은 의미와 책임, 그리고 소명’이 담긴 복지라는 확신입니다.

우리는 이 공동체를 통해 은혜의 복지를 기획하고, 사람을 향한 섬김을 디자인하며, 더불어 살아가는 따뜻한 세상을 함께 만들어가고자 합니다.

작지만 깊이 있는 변화, 그 시작이 바로 여기, 복지디자인입니다.`}
        </p>
      </section>
    </div>
  );
}
