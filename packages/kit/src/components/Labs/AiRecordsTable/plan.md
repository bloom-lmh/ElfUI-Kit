# AiRecordsTable plan

CRM-style records grid with tags, sorting, and selection, ported from the Beautiful UI "Records Table" primitive.

## Contract

- Props: `columns` (`AiTableColumn[]` with `sortable` / `align` / `width`), `rows` (`AiRecordRow[]` with `cells` / `tags` / `href` / `avatar`), `selectable`, `sortBy` / `sortOrder` (models), `showFooter`, `footerText`, `formatCell`, `labels`, `ariaLabel`.
- Events: `sort-change` (`{ key, order }`), `selection-change` (`ids`), `row-click` (`AiRecordRow`).
- Expose: `getSelectedIds()`, `clearSelection()`, `toggleRow(id)`.
- Slots: `toolbar`, `footer`.
- Host: `data-selectable` / `data-empty` flags, `aria-label`.

## Behavior

- Sortable headers toggle asc/desc and emit the new sort; selection is internal but observable through `selection-change`.
- Cells support arbitrary values via `formatCell`, and rows keep extra fields for parent rendering; first-column avatars, tags, and links render structurally.
