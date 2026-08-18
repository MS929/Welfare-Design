function parseScalar(value) {
  const trimmed = String(value || "").trim();

  if (
    trimmed.length >= 2 &&
    trimmed.startsWith('"') &&
    trimmed.endsWith('"')
  ) {
    try {
      return JSON.parse(trimmed);
    } catch {
      return trimmed.slice(1, -1);
    }
  }

  if (
    trimmed.length >= 2 &&
    trimmed.startsWith("'") &&
    trimmed.endsWith("'")
  ) {
    return trimmed.slice(1, -1).replace(/''/g, "'");
  }

  return trimmed;
}

function parseAttachments(yaml) {
  const lines = String(yaml || "").split(/\r?\n/);
  const attachments = [];
  let insideAttachments = false;
  let current = null;

  const saveCurrent = () => {
    if (current?.file) attachments.push(current);
    current = null;
  };

  lines.forEach((line) => {
    if (/^attachments:\s*(?:\[\])?\s*$/.test(line)) {
      insideAttachments = true;
      return;
    }

    if (!insideAttachments) return;

    // 들여쓰기 없는 다음 필드가 나오면 attachments 목록이 끝난 것입니다.
    if (/^[a-zA-Z가-힣0-9_-]+:\s*/.test(line)) {
      saveCurrent();
      insideAttachments = false;
      return;
    }

    const itemMatch = line.match(/^\s*-\s*(?:(file|name):\s*(.*))?$/);

    if (itemMatch) {
      saveCurrent();
      current = { file: "", name: "" };

      if (itemMatch[1]) {
        current[itemMatch[1]] = parseScalar(itemMatch[2]);
      }

      return;
    }

    const fieldMatch = line.match(/^\s+(file|name):\s*(.*)$/);

    if (fieldMatch && current) {
      current[fieldMatch[1]] = parseScalar(fieldMatch[2]);
    }
  });

  if (insideAttachments) saveCurrent();

  return attachments;
}

export function parseResourceDocument(rawText) {
  const text = String(rawText || "");
  const match = text.match(
    /^---[ \t]*\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)([\s\S]*)$/,
  );

  if (!match) {
    return { data: { attachments: [] }, content: text.trim() };
  }

  const [, yaml, content] = match;
  const data = { attachments: parseAttachments(yaml) };

  yaml.split(/\r?\n/).forEach((line) => {
    const scalarMatch = line.match(/^(title|date|category):\s*(.*)$/);

    if (scalarMatch) {
      data[scalarMatch[1]] = parseScalar(scalarMatch[2]);
    }
  });

  return { data, content: content.trim() };
}
