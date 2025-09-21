import { useMemo, useState } from "react";
import { loadFaqItems } from "../../lib/loadFaq";

const CATEGORIES = ["전체", "후원관련 문의", "기부금영수증"]; // 필요 시 '기타' 추가

export default function SupFAQ() {
	const all = useMemo(() => loadFaqItems(), []);
	const [cat, setCat] = useState("전체");
	const [q, setQ] = useState("");
	const [openIdx, setOpenIdx] = useState(null);

	const counts = useMemo(() => {
		const m = { 전체: all.length };
		for (const c of CATEGORIES.filter((c) => c !== "전체")) {
			m[c] = all.filter((it) => it.category === c).length;
		}
		return m;
	}, [all]);

	const filtered = useMemo(() => {
		return all
			.filter((it) => (cat === "전체" ? true : it.category === cat))
			.filter((it) =>
				q ? (it.title + " " + it.body).toLowerCase().includes(q.toLowerCase()) : true
			);
	}, [all, cat, q]);

	return (
		<section className="max-w-screen-xl mx-auto px-4 py-10">
			<div className="bg-white">
			  {/* ===== 브레드크럼 + 제목 (whatIs.jsx 스타일) ===== */}
			  <section className="max-w-screen-xl mx-auto px-4 pt-8 md:pt-10">
			    <nav className="text-sm text-black">
			      후원 &gt; <span className="text-black">FAQ</span>
			    </nav>
			    <h1 className="mt-3 text-3xl md:text-4xl font-extrabold tracking-tight text-black">
			      자주 묻는 질문
			    </h1>
			  </section>
			</div>

			<h1 className="sr-only">자주 묻는 질문</h1>

			{/* Tabs */}
			<div className="grid grid-cols-3 gap-4 mt-8">
				{CATEGORIES.map((c) => (
					<button
						key={c}
						onClick={() => setCat(c)}
						className={`rounded-md px-6 py-3 font-semibold text-center border transition ${
							cat === c
								? "bg-[#ff4f8f]/90 text-white border-[#ff4f8f]"
								: "bg-white text-gray-800 border-gray-300 hover:bg-gray-50"
						}`}
					>
						{c}
						<span className="ml-1 text-sm">({counts[c] ?? 0})</span>
					</button>
				))}
			</div>

			{/* Search Row */}
			<div className="mt-10 bg-gray-50 border rounded-md p-6">
				<div className="max-w-md ml-auto flex gap-2">
					<input
						value={q}
						onChange={(e) => setQ(e.target.value)}
						placeholder="키워드"
						className="flex-1 rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2CB9B1]"
					/>
					<button
						onClick={() => setQ((v) => v.trim())}
						className="inline-flex items-center gap-1 rounded-md bg-white border px-4 py-2 hover:bg-gray-50"
					>
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
							<path d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z" />
						</svg>
						검색
					</button>
				</div>
			</div>

			{/* List */}
			<div className="mt-6 md:mt-8 divide-y divide-gray-200 border border-gray-200 rounded-md bg-white">
				{filtered.map((it, idx) => (
					<Item
						key={idx}
						item={it}
						open={openIdx === idx}
						onToggle={() => setOpenIdx(openIdx === idx ? null : idx)}
					/>
				))}
				{filtered.length === 0 && (
					<p className="p-6 text-gray-500">검색 결과가 없습니다.</p>
				)}
			</div>
		</section>
	);
}

function Item({ item, open, onToggle }) {
	return (
		<div className="">
			<button
				onClick={onToggle}
				className="w-full flex items-start gap-4 px-6 py-7 md:py-8 text-left hover:bg-gray-50"
			>
				<span className="text-[#ff4f8f] font-bold">Q.</span>
				<span className="flex-1 text-gray-900 leading-snug">{item.title}</span>
				<span className="text-gray-400 text-xl leading-none">{open ? "−" : "+"}</span>
			</button>
			{open && (
				<div className="px-6 md:px-7 pt-4 pb-8 text-gray-700">
					<div
						className="max-w-none leading-relaxed space-y-3"
						dangerouslySetInnerHTML={{ __html: mdToHtml(item.body) }}
					/>
				</div>
			)}
		</div>
	);
}

// 간단한 마크다운 렌더(굵게/줄바꿈만)
function mdToHtml(md) {
	return (md || "")
		.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
		.replace(/\n/g, "<br/>");
}
