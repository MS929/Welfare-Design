import { Link, useNavigate, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import {
  formatResourceDate,
  getAttachmentDownloadUrl,
  getAttachmentName,
  getResourceBySlug,
} from "../../lib/resources";

export default function ResourceDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const resource = getResourceBySlug(slug);

  if (!resource) {
    return (
      <div className="mx-auto max-w-screen-md px-4 py-16 text-center">
        <h1 className="mb-3 text-2xl font-bold">자료를 찾을 수 없습니다</h1>
        <p className="mb-6 text-gray-500">
          삭제되었거나 존재하지 않는 자료입니다.
        </p>
        <button
          type="button"
          onClick={() => navigate("/news/resources")}
          className="text-sky-700 underline"
        >
          자료실로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <nav className="mb-4 text-base leading-7 text-black/80">
        <Link to="/news" className="hover:underline">
          소식
        </Link>
        <span className="mx-1 text-gray-400">›</span>
        <Link to="/news/resources" className="hover:underline">
          자료실
        </Link>
        <span className="mx-1 text-gray-400">›</span>
        <span className="text-black">{resource.title}</span>
      </nav>

      <button
        type="button"
        onClick={() => navigate("/news/resources")}
        className="mb-3 inline-flex items-center gap-1.5 rounded-md border border-gray-200 px-3.5 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
      >
        <span aria-hidden="true">←</span>
        목록으로
      </button>

      <article className="rounded-lg bg-white p-6 text-gray-900 shadow-sm ring-1 ring-gray-200 md:p-10">
        <header className="mb-8 border-b border-gray-100 pb-6">
          <span className="inline-flex rounded-full border border-[#9FDCD5] bg-[#E9F7F5] px-3 py-1 text-sm font-medium text-[#15796E]">
            {resource.category}
          </span>
          <h1 className="mt-4 break-words text-3xl font-extrabold leading-tight tracking-tight md:text-4xl">
            {resource.title}
          </h1>
          {resource.date ? (
            <time
              dateTime={resource.date}
              className="mt-4 block text-sm text-gray-400"
            >
              {formatResourceDate(resource.date)}
            </time>
          ) : null}
        </header>

        {resource.content ? (
          <div className="prose prose-neutral mb-8 max-w-none text-[17px] leading-8 text-gray-800">
            <ReactMarkdown>{resource.content}</ReactMarkdown>
          </div>
        ) : null}

        <section
          className="rounded-xl border border-gray-200 bg-gray-50 p-5"
          aria-labelledby="resource-files-title"
        >
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2
              id="resource-files-title"
              className="text-lg font-semibold text-gray-900"
            >
              첨부파일
            </h2>
            <span className="text-sm text-gray-500">
              {resource.attachments.length}개
            </span>
          </div>

          {resource.attachments.length > 0 ? (
            <ul className="space-y-2">
              {resource.attachments.map((attachment, index) => (
                <li key={`${attachment.file}-${index}`}>
                  <a
                    href={getAttachmentDownloadUrl(attachment.file)}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 font-medium text-sky-700 transition hover:border-sky-300 hover:bg-sky-50 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                  >
                    <span className="min-w-0 break-all">
                      {getAttachmentName(attachment, index)}
                    </span>
                    <span className="shrink-0 text-sm text-gray-500">
                      다운로드 ↓
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">등록된 파일이 없습니다.</p>
          )}
        </section>
      </article>
    </div>
  );
}
