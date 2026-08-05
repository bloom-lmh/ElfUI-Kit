# AiFilterTable plan

Status chips that reorganize live table data, ported from the Beautiful UI "Filter Table" primitive.

## Contract

- Props: `columns`, `rows` (`AiFilterRow[]`), `filters` (`AiFilterChip[]`), `defaultFilter`, `matchKey`, `showCounts`, `labels`, `ariaLabel`.
- Events: `filter-change` (`key`), `row-click` (`AiFilterRow`).
- Expose: `setFilter(key)`, `clearFilter()`, `getFilter()`.
- Slots: `footer`.
- Host: `data-filter` / `data-empty` attributes, `aria-label`.

## Behavior

- Chips compare `matchKey` cell values against each chip's `value`; counts are computed from the full dataset.
- Filtering is internal and observable; rows keep extra fields for parent-driven rendering.
