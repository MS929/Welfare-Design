import matter from "gray-matter";

const RESOURCE_MODULES = import.meta.glob(
  "../content/resources/*.{md,mdx}",
  {
    query: "?raw",
    import: "default",
    eager: true,
  },
);

function normalizeAttachments(value) {
  if (!Array.isArray(value)) return [];

  return value
    .map((attachment) => {
      if (typeof attachment === "string") {
        return { file: attachment.trim(), name: "" };
      }

      return {
        file: String(attachment?.file || "").trim(),
        name: String(attachment?.name || "").trim(),
      };
    })
    .filter((attachment) => /^(https?:\/\/|\/)/i.test(attachment.file));
}

function makeExcerpt(content = "") {
  const text = String(content)
    .replace(/!\[[^\]]*\]\([^)]+\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[#>*`_~-]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  return text.slice(0, 120) + (text.length > 120 ? "…" : "");
}

function parseDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function loadResources() {
  return Object.entries(RESOURCE_MODULES)
    .map(([path, raw]) => {
      const fileName = path.split("/").pop() || "";
      const slug = fileName.replace(/\.(md|mdx)$/i, "");
      const parsed = matter(String(raw || ""));
      const date = String(parsed.data?.date || "").slice(0, 10);

      return {
        slug,
        title: String(parsed.data?.title || slug || "제목 없음").trim(),
        date,
        dateObj: parseDate(date),
        category: String(parsed.data?.category || "기타").trim(),
        attachments: normalizeAttachments(parsed.data?.attachments),
        content: String(parsed.content || "").trim(),
        excerpt: makeExcerpt(parsed.content),
      };
    })
    .sort((a, b) => {
      const timeA = a.dateObj?.getTime() || 0;
      const timeB = b.dateObj?.getTime() || 0;

      return timeB - timeA || b.slug.localeCompare(a.slug);
    });
}

const RESOURCES = loadResources();

export function getResources() {
  return RESOURCES;
}

export function getResourceBySlug(slug) {
  return RESOURCES.find((resource) => resource.slug === slug);
}

export function formatResourceDate(value) {
  const date = parseDate(value);

  if (!date) return String(value || "").replaceAll("-", ".");

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}.${month}.${day}`;
}

export function getAttachmentName(attachment, index) {
  if (attachment.name) return attachment.name;

  try {
    const baseUrl = globalThis.location?.origin || "https://welfaredesign.kr";
    const pathname = new URL(attachment.file, baseUrl).pathname;
    const fileName = pathname.split("/").filter(Boolean).pop();

    if (fileName) return decodeURIComponent(fileName);
  } catch {
    // URL에서 파일명을 읽을 수 없으면 기본 이름을 사용합니다.
  }

  return `첨부파일 ${index + 1}`;
}

export function getAttachmentDownloadUrl(file) {
  const url = String(file || "");

  if (
    !/^https:\/\/res\.cloudinary\.com\//i.test(url) ||
    !/\/(image|video|raw)\/upload\//i.test(url) ||
    /\/upload\/[^?#]*fl_attachment/i.test(url)
  ) {
    return url;
  }

  return url.replace(
    /\/(image|video|raw)\/upload\//i,
    "/$1/upload/fl_attachment/",
  );
}
