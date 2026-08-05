# AiDiffTable plan

AI-proposed edits sweeping through tabular data, ported from the Beautiful UI "Diff Table" primitive.

## Contract

- Props: `title`, `columns` (`AiTableColumn[]`), `rows` (`AiDiffRow[]` with per-cell `value` / `status` / `original`), `summary`, `labels`, `ariaLabel`.
- Events: `row-click` (`AiDiffRow`).
- Slots: `header`, `footer`.
- Host: `data-empty` flag, `aria-label`.

## Behavior

- Cells render `add` / `remove` / `change` treatments with markers and struck-through originals; `same` cells stay neutral.
- Rows accept arbitrary extra fields on `AiDiffRow`; clicking a row emits the full row for parent-driven handling.
