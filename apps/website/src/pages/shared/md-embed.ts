/** Helpers for embedding library components inside elf-md-page Markdown content. */

export const escAttr = (value: string): string =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

export interface MdCodeItem {
  key: string;
  label: string;
  filename: string;
  language: string;
  code: string;
}

/** Single code card rendered as an editor-window elf-code-card. */
export const codeCard = (code: string, language: string, filename: string): string =>
  `<div class="md-embed"><elf-code-card items='${escAttr(
    JSON.stringify([
      { key: filename, label: filename, filename, language, code } satisfies MdCodeItem,
    ]),
  )}' variant="window" line-numbers="false"></elf-code-card></div>`;

/** Tabbed code card rendered as an editor-window elf-code-card. */
export const codeTabs = (items: MdCodeItem[]): string =>
  `<div class="md-embed"><elf-code-card items='${escAttr(
    JSON.stringify(items),
  )}' variant="window" line-numbers="false"></elf-code-card></div>`;

export const quote = (type: string, title: string, body: string, compact = true): string =>
  `<div class="md-embed"><elf-quote type="${type}" variant="soft" title="${escAttr(title)}" compact="${compact ? "true" : "false"}"><p>${body}</p></elf-quote></div>`;

export const table = (
  columns: Array<{ prop: string; label: string }>,
  rows: Array<Record<string, string>>,
  rowKey: string,
): string =>
  `<div class="md-embed"><elf-table data='${escAttr(JSON.stringify(rows))}' columns='${escAttr(JSON.stringify(columns))}' row-key="${rowKey}" border stripe></elf-table></div>`;

/** Shared embedded-component styles, injected inside the elf-md-page shadow. */
export const MD_EMBED_STYLE = `<style>
.md-embed {
  margin: 0 0 22px;
  min-width: 0;
}
@media (max-width: 720px) {
  .md-embed {
    overflow-x: auto;
  }
  .md-embed elf-table {
    min-width: 0;
  }
}
</style>
`;
