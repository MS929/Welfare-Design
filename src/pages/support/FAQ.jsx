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
		<section className="max-w-screen-xl mx-auto pl-2 pr-4 sm:pl-3 sm:pr-6 lg:pl-4 lg:pr-8 pb-10">
			<div className="bg-white">
			  {/* ===== 브레드크럼 + 제목 (whatIs.jsx 스타일) ===== */}
			  <section className="pt-8 md:pt-10 mb-6 md:mb-8">
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
						className={`relative flex items-center justify-center rounded-full px-6 py-2.5 font-semibold text-center border transition-all shadow-sm
							${cat === c
								? "bg-[#ff4f8f]/95 text-white border-[#ff4f8f] shadow-md"
								: "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
							}
							${cat === c ? "" : "hover:text-[#ff4f8f]"}
						`}
						style={{ minHeight: "44px" }}
					>
						<span>{c}</span>
						<span
							className={`ml-2 inline-block text-xs px-2 py-0.5 rounded-full font-semibold 
								${cat === c
									? "bg-white text-[#ff4f8f] border border-[#ff4f8f]"
									: "bg-gray-100 text-gray-500 border border-gray-200"
								}
							`}
							style={{ minWidth: 24, textAlign: "center" }}
						>
							{counts[c] ?? 0}
						</span>
					</button>
				))}
			</div>

			{/* Search Row */}
			<div className="mt-10 bg-gray-50 border border-gray-100 rounded-xl p-6 shadow-sm">
				<div className="max-w-md ml-auto flex gap-2 items-center">
					<input
						value={q}
						onChange={(e) => setQ(e.target.value)}
						placeholder="키워드로 검색"
						className="flex-1 rounded-full border border-gray-200 px-4 py-2.5 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2CB9B1] transition"
					/>
					<button
						onClick={() => setQ((v) => v.trim())}
						className="inline-flex items-center gap-1 rounded-full bg-[#ff4f8f]/90 text-white border border-[#ff4f8f] px-5 py-2.5 font-semibold shadow hover:bg-[#ff4f8f] transition"
					>
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5" strokeWidth="2">
							<circle cx="11" cy="11" r="7" stroke="currentColor" />
							<line x1="18" y1="18" x2="15.5" y2="15.5" stroke="currentColor" strokeLinecap="round" />
						</svg>
						<span className="hidden sm:inline">검색</span>
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
				className={`w-full flex items-start gap-4 px-6 py-7 md:py-8 text-left group transition hover:bg-gray-50 focus:outline-none`}
			>
				<span className="text-[#ff4f8f] font-bold pt-0.5">Q.</span>
				<span className="flex-1 text-gray-900 leading-snug font-medium">{item.title}</span>
				<span className={`flex items-center justify-center h-8 w-8 rounded-full transition ${
					open
						? "bg-[#2CB9B1]/10"
						: "bg-gray-100 group-hover:bg-gray-200"
				}`}>
					{open ? (
						<svg width="22" height="22" viewBox="0 0 22 22" fill="none" className="mx-auto text-[#2CB9B1] opacity-80" stroke="currentColor" strokeWidth="2">
							<line x1="6" y1="11" x2="16" y2="11" stroke="currentColor" strokeLinecap="round"/>
						</svg>
					) : (
						<svg width="22" height="22" viewBox="0 0 22 22" fill="none" className="mx-auto text-gray-400 group-hover:text-[#2CB9B1]" stroke="currentColor" strokeWidth="2">
							<line x1="11" y1="6" x2="11" y2="16" stroke="currentColor" strokeLinecap="round"/>
							<line x1="6" y1="11" x2="16" y2="11" stroke="currentColor" strokeLinecap="round"/>
						</svg>
					)}
				</span>
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
