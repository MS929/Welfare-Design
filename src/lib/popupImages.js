function unquote(value) {
  const trimmed = String(value || "").trim();

  if (
    trimmed.length >= 2 &&
    ((trimmed.startsWith('"') && trimmed.endsWith('"')) ||
      (trimmed.startsWith("'") && trimmed.endsWith("'")))
  ) {
    return trimmed.slice(1, -1);
  }

  return trimmed;
}

export function parsePopupImageValues(rawText) {
  const text = String(rawText || "");
  const frontmatterMatch = text.match(
    /^---[ \t]*\r?\n([\s\S]*?)\r?\n---(?:[ \t]*\r?\n|$)/,
  );

  if (!frontmatterMatch) return [];

  const lines = frontmatterMatch[1].split(/\r?\n/);
  const images = [];
  let insideImages = false;

  lines.forEach((line) => {
    if (/^images:\s*(?:\[\])?\s*$/.test(line)) {
      insideImages = true;
      return;
    }

    if (!insideImages) return;

    if (/^[a-zA-Z가-힣0-9_-]+:\s*/.test(line)) {
      insideImages = false;
      return;
    }

    const objectImageMatch = line.match(/^\s*-\s*image:\s*(.+?)\s*$/);
    const stringImageMatch = line.match(/^\s*-\s*(.+?)\s*$/);
    const value = objectImageMatch?.[1] || stringImageMatch?.[1] || "";
    const image = unquote(value);

    if (image) images.push(image);
  });

  return images;
}
