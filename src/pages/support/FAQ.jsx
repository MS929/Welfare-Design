import { useMemo, useState, useEffect } from "react";
import { loadFaqItems } from "../../lib/loadFaq";

const CATEGORIES = ["전체", "후원관련 문의", "기부금영수증"]; // 필요 시 '기타' 추가

export default function SupFAQ() {
	const all = useMemo(() => loadFaqItems(), []);
	const [cat, setCat] = useState("전체");
	const [q, setQ] = useState("");
	const [dq, setDq] = useState("");
	const [openIdx, setOpenIdx] = useState(null);

	const counts = useMemo(() => {
		const m = { 전체: all.length };
		for (const c of CATEGORIES.filter((c) => c !== "전체")) {
			m[c] = all.filter((it) => it.category === c).length;
		}
		return m;
	}, [all]);

	useEffect(() => {
		const t = setTimeout(() => setDq(q.trim()), 250);
		return () => clearTimeout(t);
	}, [q]);

	const filtered = useMemo(() => {
		return all
			.filter((it) => (cat === "전체" ? true : it.category === cat))
			.filter((it) =>
				dq ? (it.title + " " + it.body).toLowerCase().includes(dq.toLowerCase()) : true
			);
	}, [all, cat, dq]);

	return (
		<>
      <style
        id="page-text-guard"
        dangerouslySetInnerHTML={{ __html: `
html { -webkit-text-size-adjust: 100%; text-size-adjust: 100%; }
*, *::before, *::after { box-sizing: border-box; min-width: 0; hyphens: manual; -webkit-hyphens: manual; }
body {
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
  word-break: keep-all;            /* Korean: avoid mid-word breaks */
  overflow-wrap: anywhere;         /* Long English/URLs wrap safely */
  -webkit-line-break: after-white-space;
}
h1, h2, .heading-balance { text-wrap: balance; }
@supports not (text-wrap: balance) {
  h1, h2, .heading-balance { line-height: 1.25; max-width: 45ch; }
}
mark, [data-hl] {
  -webkit-box-decoration-break: clone;
  box-decoration-break: clone;
  padding: 0 .08em;
  border-radius: 2px;
}
.nowrap { white-space: nowrap; }
.u-wrap-anywhere { overflow-wrap: anywhere; word-break: keep-all; }
.u-ellipsis { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        ` }}
      />
			<section className="hidden md:block max-w-screen-xl mx-auto pl-2 pr-4 sm:pl-3 sm:pr-6 lg:pl-4 lg:pr-8 pb-10">
				<div className="bg-white">
				  {/* ===== 브레드크럼 + 제목 (whatIs.jsx 스타일) ===== */}
				  <section className="pt-8 md:pt-10 mb-10 md:mb-12">
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
				<div className="grid grid-cols-3 gap-4" role="tablist" aria-label="FAQ 카테고리">
					{CATEGORIES.map((c, i) => {
						const selected = cat === c;
						return (
							<button
								key={c}
								role="tab"
								id={`tab-${i}`}
								aria-selected={selected}
								aria-controls={`panel-${i}`}
								tabIndex={selected ? 0 : -1}
								onKeyDown={(e) => {
									if (e.key === "ArrowRight") setCat(CATEGORIES[(i + 1) % CATEGORIES.length]);
									if (e.key === "ArrowLeft") setCat(CATEGORIES[(i - 1 + CATEGORIES.length) % CATEGORIES.length]);
								}}
								onClick={() => setCat(c)}
								className={`relative flex items-center justify-center rounded-full px-6 py-2.5 font-semibold text-center border transition-all shadow-sm
									${selected
										? "bg-[#1E9E8F] text-white border-[#1E9E8F] shadow-md"
										: "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
									}
									${selected ? "" : "hover:text-[#1E9E8F]"}
								`}
								style={{ minHeight: "44px" }}
							>
								<span>{c}</span>
								<span
									className={`ml-2 inline-block text-xs px-2 py-0.5 rounded-full font-semibold 
										${selected
											? "bg-white text-[#1E9E8F] border border-[#1E9E8F]"
											: "bg-gray-100 text-gray-500 border border-gray-200"
										}
									`}
									style={{ minWidth: 24, textAlign: "center" }}
								>
									{counts[c] ?? 0}
								</span>
							</button>
						);
					})}
				</div>

				{/* Search Row */}
				<div className="mt-10 bg-gray-50 border border-gray-100 rounded-xl p-6 shadow-sm">
					<div className="max-w-md ml-auto flex gap-2 items-center">
						<input
							value={q}
							onChange={(e) => setQ(e.target.value)}
							placeholder="키워드로 검색"
							className="flex-1 rounded-full border border-gray-200 px-4 py-2.5 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1E9E8F] transition"
							onKeyDown={(e)=>{ if(e.key==='Enter'){ setDq(q.trim()); }}}
						/>
						<button
							onClick={() => setQ((v) => v.trim())}
							className="inline-flex items-center gap-1 rounded-full bg-[#1E9E8F] text-white border border-[#1E9E8F] px-5 py-2.5 font-semibold shadow hover:bg-[#157F76] transition"
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
							idx={idx}
							q={dq}
						/>
					))}
					{filtered.length === 0 && (
						<p className="p-6 text-gray-500">검색 결과가 없습니다.</p>
					)}
				</div>
			</section>
			{/* Mobile 전용 FAQ */}
			<section className="md:hidden max-w-screen-md mx-auto px-4 pb-20">
				{/* 제목 */}
				<h1 className="mt-6 text-[28px] font-extrabold tracking-tight text-black">자주 묻는 질문</h1>

				{/* 카테고리 칩: 가로 스크롤 */}
				<div className="mt-4 -mx-1 overflow-x-auto no-scrollbar">
					<div className="flex items-center gap-2.5 px-1 min-w-max" role="tablist" aria-label="FAQ 카테고리(모바일)">
						{CATEGORIES.map((c, i) => {
							const selected = cat === c;
							return (
								<button
									key={c}
									role="tab"
									aria-selected={selected}
									onClick={() => setCat(c)}
									className={`shrink-0 inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[15px] font-semibold border transition-all shadow-sm ${selected ? "bg-[#1E9E8F] text-white border-[#1E9E8F]" : "bg-white text-gray-700 border-gray-200"}`}
								>
									<span>{c}</span>
									<span className={`text-[11px] leading-none px-2 py-1 rounded-full font-bold ${selected ? "bg-white text-[#1E9E8F]" : "bg-gray-100 text-gray-600"}`}>{counts[c] ?? 0}</span>
								</button>
							);
						})}
					</div>
				</div>

				{/* 검색 카드 */}
				<div className="mt-6 rounded-2xl border border-gray-100 bg-gray-50 p-4 shadow-sm">
					<div className="flex items-center gap-2">
						<input
							value={q}
							onChange={(e) => setQ(e.target.value)}
							placeholder="키워드로 검색"
							className="flex-1 rounded-full border border-gray-200 px-4 py-3 bg-white text-[15px] text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1E9E8F]"
							onKeyDown={(e)=>{ if(e.key==='Enter'){ setDq(q.trim()); }}}
						/>
						<button
							onClick={() => setQ((v) => v.trim())}
							className="inline-flex items-center justify-center rounded-full h-11 w-11 bg-[#1E9E8F] text-white border border-[#1E9E8F] shadow"
							aria-label="검색"
						>
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5" strokeWidth="2">
								<circle cx="11" cy="11" r="7" stroke="currentColor" />
								<line x1="18" y1="18" x2="15.5" y2="15.5" stroke="currentColor" strokeLinecap="round" />
							</svg>
						</button>
					</div>
				</div>

				{/* 리스트 */}
				<div className="mt-5 divide-y divide-gray-200 border border-gray-200 rounded-2xl bg-white overflow-hidden">
					{filtered.map((it, idx) => (
						<MobileItem
							key={idx}
							item={it}
							open={openIdx === idx}
							onToggle={() => setOpenIdx(openIdx === idx ? null : idx)}
							idx={idx}
							q={dq}
						/>
					))}
					{filtered.length === 0 && (
						<p className="p-5 text-gray-500">검색 결과가 없습니다.</p>
					)}
				</div>
			</section>
		</>
	);
}

function Item({ item, open, onToggle, idx, q }) {
	const contentId = `faq-panel-${idx}`;
	const buttonId = `faq-button-${idx}`;

	function renderTitle(text, keyword) {
		return highlight(text, keyword);
	}

	return (
		<div>
			<button
				id={buttonId}
				aria-expanded={open}
				aria-controls={contentId}
				onClick={onToggle}
				className={`w-full flex items-start gap-4 px-6 py-7 md:py-8 text-left group transition hover:bg-gray-50 focus:outline-none`}
			>
				<span className="text-[#1E9E8F] font-bold pt-0.5">Q.</span>
				<span className="flex-1 text-gray-900 leading-snug font-medium">{renderTitle(item.title, q)}</span>
				<span className={`flex items-center justify-center h-8 w-8 rounded-full transition transform duration-200 ${
					open ? "bg-[#2CB9B1]/10 rotate-180" : "bg-gray-100 group-hover:bg-gray-200 rotate-0"
				}`}>
					{open ? (
						<svg width="22" height="22" viewBox="0 0 22 22" fill="none" className="mx-auto text-[#1E9E8F] opacity-80" stroke="currentColor" strokeWidth="2">
							<line x1="6" y1="11" x2="16" y2="11" stroke="currentColor" strokeLinecap="round"/>
						</svg>
					) : (
						<svg width="22" height="22" viewBox="0 0 22 22" fill="none" className="mx-auto text-gray-400 group-hover:text-[#1E9E8F]" stroke="currentColor" strokeWidth="2">
							<line x1="11" y1="6" x2="11" y2="16" stroke="currentColor" strokeLinecap="round"/>
							<line x1="6" y1="11" x2="16" y2="11" stroke="currentColor" strokeLinecap="round"/>
						</svg>
					)}
				</span>
			</button>
			{open && (
				<div
					id={contentId}
					role="region"
					aria-labelledby={buttonId}
					className="px-6 md:px-7 pt-4 pb-8 text-gray-700"
				>
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

function escapeRegExp(s){return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");}
function highlight(text, keyword){
	if(!keyword) return text;
	const re = new RegExp(`(${escapeRegExp(keyword)})`, 'ig');
	const parts = String(text).split(re);
	return parts.map((part, i) =>
		re.test(part) ? <mark key={i} className="bg-yellow-100 px-0.5 rounded">{part}</mark> : part
	);
}

function MobileItem({ item, open, onToggle, idx, q }) {
  const contentId = `m-faq-panel-${idx}`;
  const buttonId = `m-faq-button-${idx}`;

  function renderTitle(text, keyword) {
    return highlight(text, keyword);
  }

  return (
    <div>
      <button
        id={buttonId}
        aria-expanded={open}
        aria-controls={contentId}
        onClick={onToggle}
        className="w-full flex items-start gap-3 px-4 py-5 text-left group transition active:bg-gray-50"
      >
        <span className="text-[#1E9E8F] font-extrabold pt-0.5">Q.</span>
        <span className="flex-1 text-gray-900 leading-snug font-medium text-[16px]">{renderTitle(item.title, q)}</span>
        <span className={`flex items-center justify-center h-9 w-9 rounded-full transition ${open ? "bg-[#2CB9B1]/10 rotate-45" : "bg-gray-100"}`}>
          <svg width="20" height="20" viewBox="0 0 22 22" fill="none" className={`${open ? "text-[#1E9E8F]" : "text-gray-500"}`} stroke="currentColor" strokeWidth="2">
            <line x1="11" y1="6" x2="11" y2="16" stroke="currentColor" strokeLinecap="round"/>
            <line x1="6" y1="11" x2="16" y2="11" stroke="currentColor" strokeLinecap="round"/>
          </svg>
        </span>
      </button>
      {open && (
        <div
          id={contentId}
          role="region"
          aria-labelledby={buttonId}
          className="px-4 pt-1 pb-5 text-gray-700 bg-white"
        >
          <div
            className="max-w-none leading-relaxed space-y-3 text-[15px]"
            dangerouslySetInnerHTML={{ __html: mdToHtml(item.body) }}
          />
        </div>
      )}
    </div>
  );
}
