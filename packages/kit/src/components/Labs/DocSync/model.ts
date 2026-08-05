import type { DocSyncBlock, DocSyncMode } from "./types";

const TYPE_TAGS: Record<string, string> = {
  heading: "#",
  paragraph: "¶",
  list: "•",
  code: "</>",
  table: "▦",
  math: "Σ",
  quote: "❝",
  divider: "—",
  image: "▧",
};

const BLOCK_ESTIMATES: Record<string, number> = {
  heading: 36,
  paragraph: 26,
  list: 22,
  code: 72,
  table: 48,
  math: 44,
  quote: 32,
  divider: 18,
  image: 120,
};

/** Deterministic FNV-1a hash for content-addressed sync ids. */
export const fnv1a = (source: string): number => {
  let hash = 0x811c9dc5;
  for (let index = 0; index < source.length; index += 1) {
    hash ^= source.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
};

export const escapeHtml = (value: string): string =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const blockText = (block: DocSyncBlock): string => {
  if (block.text != null) return String(block.text);
  if (block.items?.length) return block.items.join("\n");
  if (block.rows?.length) return block.rows.map((row) => row.join(" | ")).join("\n");
  return "";
};

/** Content-addressed id: sync-{type}-{fnv1a(type + text + same-type ordinal)}. */
export const resolveBlockId = (block: DocSyncBlock, sameTypeIndex: number): string => {
  if (block.id && block.id.trim()) return block.id.trim();
  const seed = `${block.type}\n${blockText(block)}\n${sameTypeIndex}`;
  return `sync-${block.type}-${fnv1a(seed).toString(16).padStart(8, "0")}`;
};

export const normalizeBlocks = (blocks: DocSyncBlock[]): DocSyncBlock[] => {
  const source = Array.isArray(blocks) ? blocks : [];
  const sameTypeCount: Record<string, number> = {};
  return source.map((block) => {
    const type = String(block?.type || "paragraph");
    const ordinal = sameTypeCount[type] ?? 0;
    sameTypeCount[type] = ordinal + 1;
    return { ...block, type, id: resolveBlockId(block ?? {}, ordinal) };
  });
};

export const estimateBlockHeight = (block: DocSyncBlock): number => {
  const type = String(block?.type || "paragraph");
  const base = BLOCK_ESTIMATES[type] ?? 28;
  if (type === "list" && block?.items?.length)
    return Math.max(base, base + (block.items.length - 1) * 22);
  if (type === "table" && block?.rows?.length) return Math.max(base, 28 + block.rows.length * 26);
  return base;
};

const headingLevel = (block: DocSyncBlock): number =>
  Math.min(6, Math.max(1, Number(block.level) || 1));

/** Renders one block for a pane. Source mode shows the raw dialect; preview mode shows a document view. */
export const blockMarkup = (block: DocSyncBlock, mode: DocSyncMode): string => {
  const text = escapeHtml(block.text ?? "");
  const type = block.type || "paragraph";
  if (mode === "source") {
    const tag = TYPE_TAGS[type] ?? "§";
    return `<span class="doc-sync-source-tag" aria-hidden="true">${tag}</span><span class="doc-sync-source-text">${text || "&nbsp;"}</span>`;
  }
  if (type === "heading") {
    const level = headingLevel(block);
    return `<h${level} class="doc-sync-heading">${text}</h${level}>`;
  }
  if (type === "list") {
    const items = (block.items ?? []).map((item) => `<li>${escapeHtml(item)}</li>`).join("");
    return `<ul class="doc-sync-list">${items}</ul>`;
  }
  if (type === "code") return `<pre class="doc-sync-code"><code>${text}</code></pre>`;
  if (type === "table") {
    const rows = (block.rows ?? [])
      .map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`)
      .join("");
    return `<table class="doc-sync-table"><tbody>${rows}</tbody></table>`;
  }
  if (type === "math") return `<div class="doc-sync-math">${text}</div>`;
  if (type === "quote") return `<blockquote class="doc-sync-quote">${text}</blockquote>`;
  if (type === "divider") return `<hr class="doc-sync-divider">`;
  if (type === "image") return `<div class="doc-sync-image">${text || "image"}</div>`;
  return `<p class="doc-sync-paragraph">${text}</p>`;
};

/** Index of the first row whose end offset is greater than the given offset. */
export const indexAtOffset = (offsets: readonly number[], offset: number): number => {
  let low = 0;
  let high = Math.max(0, offsets.length - 2);
  while (low <= high) {
    const middle = (low + high) >> 1;
    if ((offsets[middle + 1] ?? 0) <= offset) low = middle + 1;
    else high = middle - 1;
  }
  return Math.max(0, Math.min(offsets.length - 2, low));
};
