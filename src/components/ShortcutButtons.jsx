const items = [
  { label: "???", link: "#" },
  { label: "???", link: "#" },
  { label: "???", link: "#" },
  { label: "???", link: "#" },
];

export default function ShortcutButtons() {
  return (
    <section className="bg-emerald-100 py-8">
      <div className="max-w-6xl mx-auto flex flex-wrap justify-center gap-6">
        {items.map((it, idx) => (
          <a
            key={idx}
            href={it.link}
            className="bg-white w-28 h-28 md:w-32 md:h-32 rounded-full shadow grid place-items-center text-center text-sm font-semibold hover:bg-sky-50"
          >
            {it.label}
          </a>
        ))}
      </div>
    </section>
  );
}
