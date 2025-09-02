export default function BizLayout({ title, children }) {
  return (
    <div className="bg-white">
      <section className="max-w-screen-xl mx-auto px-4 pt-10">
        <nav className="text-sm text-gray-500">
          사업 &gt; <span className="text-gray-700">{title}</span>
        </nav>
        <h1 className="mt-3 text-3xl md:text-4xl font-extrabold">{title}</h1>
      </section>
      <section className="max-w-screen-xl mx-auto px-4 py-10">
        {children}
      </section>
    </div>
  );
}
