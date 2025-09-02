export default function Card({ title, image, desc }) {
  return (
    <article className="bg-white rounded-2xl shadow hover:shadow-md transition p-4">
      <div className="aspect-[16/9] w-full overflow-hidden rounded-xl bg-gray-100">
        {image && (
          <img src={image} alt={title} className="w-full h-full object-cover" />
        )}
      </div>
      <h3 className="mt-3 font-bold">{title}</h3>
      <p className="text-sm text-gray-600">{desc}</p>
    </article>
  );
}
