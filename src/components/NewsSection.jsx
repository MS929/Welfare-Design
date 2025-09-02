import Card from "./Card";

export default function NewsSection() {
  const news = [
    {
      id: 1,
      title: "공익활동가 오행시",
      image: "/images/news1.jpg",
      desc: "공익활동의 지속성에 대해",
    },
    {
      id: 2,
      title: "지원사업 공모",
      image: "/images/news2.jpg",
      desc: "신규 지원사업 안내",
    },
    {
      id: 3,
      title: "연구 보고서 발표",
      image: "/images/news3.jpg",
      desc: "연구 성과를 공유합니다",
    },
  ];

  return (
    <section className="bg-gray-50 py-10">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6">동행이야기</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {news.map((n) => (
            <Card key={n.id} {...n} />
          ))}
        </div>
      </div>
    </section>
  );
}
